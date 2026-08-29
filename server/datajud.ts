const DATAJUD_BASE_URL="https://api-publica.datajud.cnj.jus.br";const DATAJUD_ACCESS_URL="https://datajud-wiki.cnj.jus.br/api-publica/acesso/";export const DATAJUD_ALIASES=["tjmg","trt3","trf6","tre-mg","tjmmg"] as const;export const NATIONAL_DATAJUD_ALIASES=["tjac","tjal","tjam","tjap","tjba","tjce","tjdft","tjes","tjgo","tjma","tjmg","tjms","tjmt","tjpa","tjpb","tjpe","tjpi","tjpr","tjrj","tjrn","tjro","tjrr","tjrs","tjsc","tjse","tjsp","tjto"] as const;export type DataJudAlias=(typeof DATAJUD_ALIASES)[number];export type NationalDataJudAlias=(typeof NATIONAL_DATAJUD_ALIASES)[number];
export function getDataJudConnectionStatus(){const configured=Boolean(process.env.DATAJUD_API_KEY?.trim());return{configured,label:configured?"Conector DataJud pronto com chave do ambiente":"Conector pronto para obter a chave pública oficial em memória",citation:"Fonte: Conselho Nacional de Justiça — DataJud.",storagePolicy:"A chave é resolvida em memória e não é persistida pelo Atlas."}}
export function extractPublicDataJudKey(page:string){const text=page.replace(/<[^>]*>/g," ").replace(/&nbsp;/g," ");const marker=text.indexOf("Authorization: APIKey");if(marker<0)return null;return text.slice(marker,marker+300).match(/[A-Za-z0-9_-]{40,}={0,2}/)?.[0]??null}
async function key(){const env=process.env.DATAJUD_API_KEY?.trim();if(env)return env;const r=await fetch(DATAJUD_ACCESS_URL,{signal:AbortSignal.timeout(10000),headers:{Accept:"text/html"}});if(!r.ok)throw new Error("Não foi possível consultar a página oficial de acesso do DataJud.");const k=extractPublicDataJudKey(await r.text());if(!k)throw new Error("A página oficial não apresentou chave pública reconhecível.");return k}
export const DATAJUD_COVERAGE_CONCURRENCY=6;
const DATAJUD_COVERAGE_BUDGET_MS=45_000;
const DATAJUD_PROBE_TIMEOUT_MS=8_000;
/**
 * Sonda os aliases em paralelo com concorrência limitada e orçamento total.
 *
 * A versão sequencial anterior levava, no pior caso, 27 × 15 s = 405 s — muito
 * além do `proxy_read_timeout` de 60 s do Nginx, então o administrador recebia
 * 504 enquanto o servidor seguia consultando o CNJ. Aliases não sondados dentro
 * do orçamento voltam como `skipped`, para que o resultado parcial seja
 * honesto em vez de indistinguível de indisponibilidade.
 */
export async function checkDataJudCoverage(requested:readonly NationalDataJudAlias[]=NATIONAL_DATAJUD_ALIASES){
 const apiKey=await key(),checkedAt=new Date().toISOString(),aliases=[...new Set(requested)];
 const deadline=Date.now()+DATAJUD_COVERAGE_BUDGET_MS;
 const items:Array<{alias:NationalDataJudAlias;status:"available"|"unavailable"|"rejected"|"skipped"}>=[];
 let cursor=0;
 async function worker(){
  while(cursor<aliases.length){
   const alias=aliases[cursor++]!;
   const remaining=deadline-Date.now();
   if(remaining<=0){items.push({alias,status:"skipped"});continue}
   try{
    const r=await fetch(`${DATAJUD_BASE_URL}/api_publica_${alias}/_search`,{method:"POST",headers:{Authorization:`APIKey ${apiKey}`,"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({size:0,track_total_hits:false,query:{match_none:{}}}),signal:AbortSignal.timeout(Math.min(DATAJUD_PROBE_TIMEOUT_MS,remaining))});
    items.push({alias,status:r.ok?"available":r.status===401||r.status===403?"rejected":"unavailable"});
   }catch{items.push({alias,status:"unavailable"})}
  }
 }
 await Promise.all(Array.from({length:Math.min(DATAJUD_COVERAGE_CONCURRENCY,aliases.length)},worker));
 items.sort((a,b)=>aliases.indexOf(a.alias)-aliases.indexOf(b.alias));
 const available=items.filter(x=>x.status==="available").length;
 const tested=items.filter(x=>x.status!=="skipped").length;
 const skipped=items.length-tested;
 return{checkedAt,total:items.length,available,responded:available,tested,skipped,coveragePct:tested?Math.round(available/tested*1000)/10:0,items,citation:"Fonte: CNJ/DataJud. Resposta do alias não prova completude do acervo."+(skipped?` ${skipped} alias(es) não foram sondados dentro do orçamento de tempo.`:"")};
}

function readName(v:unknown){return v&&typeof v==="object"&&typeof(v as any).nome==="string"?(v as any).nome:null}function sanitize(source:Record<string,unknown>){const movements=Array.isArray(source.movimentos)?source.movimentos:[];return{numeroProcesso:typeof source.numeroProcesso==="string"?source.numeroProcesso:null,tribunal:typeof source.tribunal==="string"?source.tribunal:null,updatedAt:typeof source["@timestamp"]==="string"?source["@timestamp"]:null,classe:readName(source.classe),orgaoJulgador:readName(source.orgaoJulgador),assuntos:(Array.isArray(source.assuntos)?source.assuntos:[]).map(readName).filter(Boolean).slice(0,12),movimentos:movements.map(m=>{const r=m&&typeof m==="object"?m as Record<string,unknown>:{};return{date:typeof r.dataHora==="string"?r.dataHora:typeof r.data==="string"?r.data:null,name:readName(r)??(typeof r.nome==="string"?r.nome:null)}}).filter(x=>x.date||x.name).slice(-40)}}
export async function lookupDataJudByProcess(alias:DataJudAlias,processNumber:string){const normalized=processNumber.replace(/\D/g,"");if(normalized.length<15||normalized.length>25)throw new Error("Informe número CNJ válido.");const apiKey=await key();const r=await fetch(`${DATAJUD_BASE_URL}/api_publica_${alias}/_search`,{method:"POST",headers:{Authorization:`APIKey ${apiKey}`,"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({size:1,query:{match:{numeroProcesso:normalized}},_source:["numeroProcesso","tribunal","@timestamp","classe","assuntos","orgaoJulgador","movimentos"]}),signal:AbortSignal.timeout(15000)});if(!r.ok)throw new Error(`DataJud indisponível (${r.status}).`);const body=await r.json() as any,hit=body.hits?.hits?.[0]?._source;return{found:Boolean(hit),record:hit?sanitize(hit):null,citation:"Fonte: Conselho Nacional de Justiça — DataJud."}}
