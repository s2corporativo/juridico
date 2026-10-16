import { normalizeLegalText } from "./skill-matching";
import type { LegalCandidate } from "./legal-intelligence-core";

/** Triagem automatizada de qualidade — não equivale a homologação jurídica. */
export type MaturationFinding = {
  slug: string; version: number; maturity: number;
  level: "needs_review" | "needs_enrichment" | "ready_for_human_validation";
  signals: string[]; suggestedActions: string[];
};
const officialHosts = ["planalto.gov.br","stf.jus.br","stj.jus.br","cnj.jus.br","tst.jus.br","tse.jus.br","gov.br"];
function sources(raw: string): string[] {
  try { const value: unknown=JSON.parse(raw);return Array.isArray(value)?value.filter((x):x is string=>typeof x==="string"):[]; }
  catch { return []; }
}
function isOfficial(value:string):boolean {
  try { const parsed=new URL(value);return parsed.protocol==="https:"&&officialHosts.some(host=>parsed.hostname===host||parsed.hostname.endsWith("."+host)); }
  catch { return false; }
}
function triggers(raw:string):string[] {
  try { const v:unknown=JSON.parse(raw);if(!v||typeof v!=="object")return [];
    const k=(v as {keywords?:unknown}).keywords;
    return Array.isArray(k)?k.filter((x):x is string=>typeof x==="string"):[];
  }catch{return [];}
}
export function assessSkillMaturity(skill:LegalCandidate):MaturationFinding {
  const signals:string[]=[];
  const suggestedActions:string[]=[];
  let score=100;
  // Um formulário preenchido não é uma habilidade juridicamente madura.
  // Roteiros importados para curadoria devem permanecer em revisão prioritária.
  if (["rascunho metodologico para revisao juridica", "protocolo de analise supervisionada"].some((marker) => normalizeLegalText(skill.content).startsWith(marker))) {
    score -= 60;
    signals.push("roteiro_generico_sem_densidade_juridica");
    suggestedActions.push("Substituir o roteiro por análise normativa específica, hipóteses, exceções e evidências verificadas por advogado.");
  }
  const src=sources(skill.requiredSources);
  const keys=triggers(skill.triggers);
  if(src.length===0) {
    score-=35;signals.push("fontes_ausentes");suggestedActions.push("Informar fonte oficial, URL e dispositivo aplicável.");
  } else if(!src.some(isOfficial)) {
    score-=25;signals.push("fontes_sem_url_oficial");suggestedActions.push("Conferir a fonte em repositório oficial e registrar URL.");
  }
  if(keys.length<2){
    score-=20;signals.push("gatilhos_insuficientes");suggestedActions.push("Incluir critérios objetivos e sinônimos revistos por advogado.");
  }
  if(skill.content.trim().length<180){
    score-=15;signals.push("orientacao_curta");suggestedActions.push("Completar requisitos, exceções, prova e limites da orientação.");
  }
  if(sources(skill.forbiddenClaims).length===0){
    score-=10;signals.push("vedacoes_ausentes");suggestedActions.push("Declarar alegações e conclusões proibidas.");
  }
  const toks=keys.map(normalizeLegalText);
  if(new Set(toks).size!==toks.length){
    score-=10;signals.push("gatilhos_duplicados");suggestedActions.push("Eliminar duplicações do índice de gatilhos.");
  }
  const maturity=Math.max(0,score);
  return {slug:skill.slug,version:skill.version,maturity,
    level:maturity<55?"needs_review":maturity<85?"needs_enrichment":"ready_for_human_validation",
    signals,suggestedActions};
}
export function reviewCatalogueMaturity(skills:readonly LegalCandidate[],limit=100) {
  const results=skills.map(assessSkillMaturity)
    .sort((a,b)=>a.maturity-b.maturity || a.slug.localeCompare(b.slug));
  const stats={
    total:results.length,
    needsReview:results.filter(x=>x.level==="needs_review").length,
    needsEnrichment:results.filter(x=>x.level==="needs_enrichment").length,
    readyForHumanValidation:results.filter(x=>x.level==="ready_for_human_validation").length,
  };
  return {stats,findings:results.slice(0,Math.min(500,Math.max(1,limit))),
    warning:"Indicadores de completude do cadastro. Nenhum conteúdo foi validado, aprovado ou publicado pelo motor."};
}
