import { matchingLegalTriggers, normalizeLegalText } from "./skill-matching";

/**
 * Núcleo jurídico local e determinístico. Não depende de LLM nem de dados do Atlas.
 * Aceita APENAS versões já elegíveis por skill-governance. Nunca aprova conteúdo.
 */
export type LegalCandidate = {
  id: string; slug: string; version: number; area: string; description: string;
  content: string; triggers: string; requiredSources: string; forbiddenClaims: string;
};
export type LegalIntent = {
  area: string | null; form: string | null; phase: string | null;
  confidence: "detected" | "uncertain"; questions: string[];
};
export type LegalSuggestion = {
  slug: string; version: number; score: number;
  evidence: string[]; sourceStatus: "declared_unverified";
  explanation: string; channel: "lexical_rrf";
};
const areas: ReadonlyArray<[string,string[]]> = [
  ["consumidor",["consumidor","cdc","cobranca indevida","vicio do produto","negativacao"]],
  ["trabalhista",["reclamacao trabalhista","clt","horas extras","verbas rescisorias","trabalhador"]],
  ["penal",["habeas corpus","prisao preventiva","denuncia criminal","trafico de drogas","codigo penal"]],
  ["previdenciario",["inss","beneficio previdenciario","aposentadoria","auxilio doenca"]],
  ["tributario",["icms","itbi","tributo","execucao fiscal","imposto"]],
  ["ambiental",["licenciamento ambiental","ibama","dano ambiental","multa ambiental"]],
  ["administrativo",["servidor publico","licitacao","contrato administrativo"]],
  ["digital",["lgpd","dados pessoais","perfil falso","fraude digital"]],
  ["civil",["responsabilidade civil","contrato civil","obrigacao de fazer","danos materiais"]],
  ["familia",["guarda","pensao alimenticia","divorcio"]],
  ["empresarial",["sociedade empresaria","recuperacao judicial","contrato empresarial"]],
];
const forms: ReadonlyArray<[string,string[]]> = [
  ["peticao-inicial",["peticao inicial","ajuizar acao","propositura da acao"]],
  ["contestacao",["contestacao","defesa do reu","impugnacao ao pedido"]],
  ["recurso",["apelacao","agravo de instrumento","recurso inominado","recurso ordinario"]],
  ["habeas-corpus",["habeas corpus"]],
  ["replica",["replica","impugnacao a contestacao"]],
  ["execucao",["cumprimento de sentenca","execucao de titulo","execucao fiscal"]],
  ["acordo",["homologacao de acordo","transacao judicial"]],
  ["parecer",["parecer juridico","opiniao legal"]],
];
const phases: ReadonlyArray<[string,string[]]> = [
  ["conhecimento",["citacao","inicial","contestacao","sentenca"]],
  ["recursal",["recurso","apelacao","agravo"]],
  ["cumprimento",["cumprimento de sentenca","penhora","execucao"]],
];
const stopWords = new Set(["para","como","pela","pelo","esta","esse","sobre","sua","com","uma","dos","das","que","deve","analise","caso","fatos","documento","direito","peticao","entre","quando","artigo"]);
function tokens(text: string): string[] {
  return normalizeLegalText(text).split(" ").filter(x=>x.length>=3&&!stopWords.has(x)).slice(0,3000);
}
function pick(text: string, options: ReadonlyArray<[string,string[]]>): string | null {
  const scored=options.map(([key,phrases])=>({key,count:matchingLegalTriggers(text,phrases).length})).filter(x=>x.count>0)
    .sort((a,b)=>b.count-a.count || a.key.localeCompare(b.key));
  if (!scored.length || (scored.length>1 && scored[0].count===scored[1].count)) return null;
  return scored[0].key;
}
export function identifyLegalIntent(text:string):LegalIntent {
  const area=pick(text,areas),form=pick(text,forms),phase=pick(text,phases);
  const questions:string[]=[];
  if(!area)questions.push("Qual é a matéria jurídica predominante?");
  if(!form)questions.push("Qual peça ou providência jurídica deve ser produzida?");
  return {area,form,phase,confidence:area&&form?"detected":"uncertain",questions};
}
function keywords(raw:string):string[] {
  try {const parsed:unknown=JSON.parse(raw);if(!parsed||typeof parsed!=="object"||Array.isArray(parsed))return [];
    const list=(parsed as {keywords?:unknown}).keywords;
    return Array.isArray(list)?list.filter((v):v is string=>typeof v==="string").slice(0,64):[];
  }catch{return [];}
}
function bm25Search(queryTokens:string[],corpus:string[][],limit:number):number[] {
  if(!queryTokens.length)return [];
  const total=corpus.length||1;
  const avg=corpus.reduce((n,d)=>n+d.length,0)/total||1;
  const terms=[...new Set(queryTokens)];
  const df=new Map(terms.map(t=>[t,corpus.filter(doc=>doc.includes(t)).length]));
  const scored=corpus.map((doc,i)=>{
    const freq=new Map<string,number>();
    for(const word of doc)if(df.has(word))freq.set(word,(freq.get(word)||0)+1);
    let score=0;
    for(const term of terms){
      const occurrences=freq.get(term)||0;
      if(!occurrences)continue;
      const idf=Math.log(1+(total-(df.get(term)||0)+0.5)/((df.get(term)||0)+0.5));
      score+=idf*(occurrences*2.2)/(occurrences+1.2*(0.25+0.75*doc.length/avg));
    }
    return {i,score};
  }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.i-b.i);
  return scored.slice(0,limit).map(x=>x.i);
}
function stringList(raw:string):string[] {
  try {const value:unknown=JSON.parse(raw);return Array.isArray(value)?value.filter((x):x is string=>typeof x==="string"):[];}
  catch{return [];}
}
export function retrieveLegalSkills(text:string, approved:readonly LegalCandidate[],topK=6):{
  intent:LegalIntent; suggestions:LegalSuggestion[]; abstained:boolean;
} {
  const input=text.slice(0,12000);
  const intent=identifyLegalIntent(input);
  if(tokens(input).length<3) return {intent,suggestions:[],abstained:true};
  // Área explícita nunca deve introduzir matérias alheias silenciosamente.
  const selected=approved.filter(x=>!intent.area||x.area===intent.area||x.area==="geral");
  const query=tokens(input);
  const triggerDocs=selected.map(s=>tokens(keywords(s.triggers).join(" ")));
  const legalDocs=selected.map(s=>tokens(s.description+" "+s.content.slice(0,5000)));
  const first=bm25Search(query,triggerDocs,40);
  const second=bm25Search(query,legalDocs,40);
  const evidence=new Map<number,string[]>();
  const score=new Map<number,number>();
  for(const [channel,ranked] of [["gatilhos",first],["texto",second]] as const){
    ranked.forEach((i,rank)=>{
      score.set(i,(score.get(i)||0)+1/(60+rank+1));
      evidence.set(i,[...(evidence.get(i)||[]),channel]);
    });
  }
  const suggestions=[...score.keys()].map(i=>{
    const skill=selected[i],hit=matchingLegalTriggers(input,keywords(skill.triggers));
    // Sem gatilho literal, exigir confirmação humana mesmo se o texto foi similar.
    const weight=(score.get(i)||0)+(hit.length>0?0.01:0);
    return {i,skill,hit,weight};
  }).filter(x=>x.weight>=0.01 && x.hit.length>0)
    .sort((a,b)=>b.weight-a.weight||a.skill.slug.localeCompare(b.skill.slug)).slice(0,Math.max(1,Math.min(10,topK)));
  return {
    intent,
    suggestions:suggestions.map(x=>({
      slug:x.skill.slug,version:x.skill.version,
      score:Math.round(Math.min(1,x.weight*25)*1000)/1000,
      evidence:x.hit.slice(0,5),sourceStatus:"declared_unverified" as const,
      explanation:"Correspondência por gatilhos jurídicos com fusão RRF lexical; fontes ainda exigem validação editorial.",
      channel:"lexical_rrf" as const,
    })),
    abstained:suggestions.length===0,
  };
}
