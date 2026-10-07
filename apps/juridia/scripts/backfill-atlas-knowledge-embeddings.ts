import { db } from "../src/lib/db";
import { embedTexts, embeddingModel } from "../src/lib/embedding_service";

const BATCH = Math.max(1, Math.min(Number(process.env.EMBEDDING_BATCH || 8), 32));

async function main(){
  const model=embeddingModel();
  const chunks=await db.knowledgeChunk.findMany({
    where:{OR:[{embedding:null},{embeddingModel:{not:model}}]},
    orderBy:{id:"asc"},
    select:{id:true,contexto:true,texto:true},
  });
  console.log(`KnowledgeChunks a vetorizar: ${chunks.length}; modelo=${model}; batch=${BATCH}`);
  for(let i=0;i<chunks.length;i+=BATCH){
    const batch=chunks.slice(i,i+BATCH);
    const result=await embedTexts(batch.map((c)=>`${c.contexto}\n${c.texto}`.slice(0,12000)));
    if(!result) throw new Error("Embeddings locais não habilitados");
    await db.$transaction(batch.map((c,idx)=>db.knowledgeChunk.update({
      where:{id:c.id},
      data:{embedding:JSON.stringify(result.vectors[idx]),embeddingModel:result.model,embeddedAt:new Date()},
    })));
    console.log(`${Math.min(i+BATCH,chunks.length)}/${chunks.length}`);
  }
}
main().finally(()=>db.$disconnect());
