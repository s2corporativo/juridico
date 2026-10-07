// atlas_knowledge_retrieval.ts — busca híbrida no acervo jurídico interno.
// Combina BM25 + embedding local + sinais editoriais e RRF.

import { db } from "@/lib/db";
import { cosineVector, embedText, parseEmbedding } from "@/lib/embedding_service";

export interface AtlasKnowledgeHit {
  documentId: string;
  slug: string;
  title: string;
  documentType: string;
  area: string;
  source: string | null;
  sourceUrl: string | null;
  reliability: string;
  priority: string;
  chunkId: string;
  context: string;
  text: string;
  score: number;
  semanticScore: number | null;
  signals: { bm25Rank:number|null; semanticRank:number|null; official:boolean };
}

function toks(s:string){
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/[^a-z0-9§ºª]+/g," ").split(/\s+/).filter((x)=>x.length>2);
}
function official(url:string|null){
  if(!url)return false;
  try{
    const h=new URL(url).hostname.toLowerCase();
    return ["planalto.gov.br","stf.jus.br","stj.jus.br","tst.jus.br","cnj.jus.br","tjmg.jus.br","gov.br","senado.leg.br","camara.leg.br"]
      .some((d)=>h===d||h.endsWith("."+d));
  }catch{return false;}
}
function ranks(entries:[string,number][]){
  return new Map(entries.sort((a,b)=>b[1]-a[1]).map(([id],i)=>[id,i+1]));
}
function bm25(q:string[], docs:{id:string;t:string[]}[]){
  const out=new Map<string,number>(); if(!q.length||!docs.length)return out;
  const uniq=[...new Set(q)], N=docs.length, avg=docs.reduce((a,d)=>a+d.t.length,0)/N||1, k1=1.5,b=.75;
  const df=new Map<string,number>();
  for(const term of uniq)df.set(term,docs.reduce((n,d)=>n+Number(d.t.includes(term)),0));
  for(const d of docs){
    const tf=new Map<string,number>(); for(const t of d.t)tf.set(t,(tf.get(t)||0)+1);
    let s=0;
    for(const term of uniq){
      const f=tf.get(term)||0;if(!f)continue;
      const n=df.get(term)||0,idf=Math.log(1+(N-n+.5)/(n+.5));
      s+=idf*((f*(k1+1))/(f+k1*(1-b+b*d.t.length/avg)));
    }
    if(s>0)out.set(d.id,s);
  } return out;
}

export async function atlasKnowledgeSearch(query:string, topK=10):Promise<AtlasKnowledgeHit[]>{
  const q=query.trim(); if(!q)return [];
  const rows=await db.knowledgeChunk.findMany({
    where:{document:{vigente:true,status:"ATIVO",dadosFicticios:false}},
    include:{document:{select:{slug:true,titulo:true,tipoDocumento:true,area:true,fonte:true,urlFonte:true,confiabilidade:true,prioridade:true}}},
    take:10000,
  });
  if(!rows.length)return [];
  const qt=toks(q);
  const docs=rows.map((r)=>({id:r.id,t:toks(`${r.contexto} ${r.document.titulo} ${r.document.area} ${r.texto}`).slice(0,1600)}));
  const bm=bm25(qt,docs), br=ranks([...bm.entries()]);
  let sem=new Map<string,number>();
  try{
    const qe=await embedText(q);
    if(qe?.vector.length){
      for(const r of rows){
        const v=parseEmbedding(r.embedding);
        if(v && (!r.embeddingModel || r.embeddingModel===qe.model)){
          const s=cosineVector(qe.vector,v); if(s>0)sem.set(r.id,s);
        }
      }
    }
  }catch{sem=new Map();}
  const sr=ranks([...sem.entries()]);
  const k=60;
  const scored=rows.map((r)=>{
    const bmr=br.get(r.id)||null, smr=sr.get(r.id)||null, ss=sem.get(r.id)??null;
    let raw=0;
    if(bmr)raw+=1/(k+bmr);
    if(smr)raw+=1.5/(k+smr);
    if(official(r.document.urlFonte))raw+=.008;
    if(r.document.confiabilidade==="A")raw+=.006; else if(r.document.confiabilidade==="B")raw+=.002;
    if(r.document.prioridade==="P0")raw+=.006; else if(r.document.prioridade==="P1")raw+=.003;
    return {r,raw,bmr,smr,ss};
  }).filter((x)=>x.raw>0).sort((a,b)=>b.raw-a.raw);
  const best=new Map<string,typeof scored[number]>();
  for(const x of scored){ if(!best.has(x.r.documentId))best.set(x.r.documentId,x); }
  const selected=[...best.values()].sort((a,b)=>b.raw-a.raw).slice(0,Math.max(1,Math.min(topK,30)));
  const max=selected[0]?.raw||1;
  return selected.map(({r,raw,bmr,smr,ss})=>({
    documentId:r.documentId,slug:r.document.slug,title:r.document.titulo,documentType:r.document.tipoDocumento,
    area:r.document.area,source:r.document.fonte,sourceUrl:r.document.urlFonte,reliability:r.document.confiabilidade,
    priority:r.document.prioridade,chunkId:r.id,context:r.contexto,text:r.texto,score:Math.min(1,raw/max),semanticScore:ss,
    signals:{bm25Rank:bmr,semanticRank:smr,official:official(r.document.urlFonte)},
  }));
}
