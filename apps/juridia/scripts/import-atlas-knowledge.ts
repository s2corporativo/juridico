import { PrismaClient } from "@prisma/client";
import { db } from "../src/lib/db";

const sourcePath = process.env.ATLAS_KNOWLEDGE_DB_PATH || "/opt/atlas-juridico/shared/custom.db";
const targetUrl = process.env.DATABASE_URL || "";
const sourceUrl = `file:${sourcePath}`;

if (!targetUrl) throw new Error("DATABASE_URL obrigatório");
if (targetUrl === sourceUrl) throw new Error("Origem Atlas e destino JuridIA não podem ser o mesmo banco");

const source = new PrismaClient({ datasources: { db: { url: sourceUrl } } });
const includeDemo = /^(1|true|yes)$/i.test(process.env.INCLUDE_ATLAS_DEMO || "");

async function main() {
  const docs = await source.knowledgeDocument.findMany({
    where: includeDemo ? {} : { dadosFicticios: false },
    select: {
      id:true,slug:true,titulo:true,tipoDocumento:true,area:true,subarea:true,assunto:true,subassunto:true,
      prioridade:true,lote:true,conteudo:true,metadados:true,tags:true,fonte:true,urlFonte:true,dataConsulta:true,
      confiabilidade:true,vigente:true,status:true,dadosFicticios:true,versao:true,dataUltimaVerificacao:true,
      proximaVerificacaoRecomendada:true,municipio:true,codigoIbgeMunicipio:true,createdAt:true,updatedAt:true,
    },
  });
  const allowed = new Set(docs.map((d) => d.id));

  let docsWritten = 0;
  for (let i=0;i<docs.length;i+=50) {
    const batch=docs.slice(i,i+50);
    await db.$transaction(batch.map((d) => db.knowledgeDocument.upsert({
      where:{id:d.id},
      update:{...d},
      create:{...d},
    })));
    docsWritten += batch.length;
    process.stdout.write(`\rdocumentos ${docsWritten}/${docs.length}`);
  }

  const chunks = await source.knowledgeChunk.findMany({
    where:{documentId:{in:[...allowed]}},
    select:{id:true,documentId:true,ordem:true,contexto:true,texto:true,palavras:true,embedding:true},
  });
  let chunksWritten=0;
  for(let i=0;i<chunks.length;i+=100){
    const batch=chunks.slice(i,i+100);
    await db.$transaction(batch.map((c)=>db.knowledgeChunk.upsert({
      where:{id:c.id},
      update:{documentId:c.documentId,ordem:c.ordem,contexto:c.contexto,texto:c.texto,palavras:c.palavras,embedding:c.embedding,embeddingModel:null,embeddedAt:null},
      create:{documentId:c.documentId,id:c.id,ordem:c.ordem,contexto:c.contexto,texto:c.texto,palavras:c.palavras,embedding:c.embedding},
    })));
    chunksWritten+=batch.length;
  }

  const rels = await source.knowledgeRelationship.findMany({
    where:{AND:[{origemId:{in:[...allowed]}},{destinoId:{in:[...allowed]}}]},
    select:{id:true,origemId:true,destinoId:true,tipo:true,descricao:true},
  });
  let relsWritten=0;
  for(let i=0;i<rels.length;i+=100){
    const batch=rels.slice(i,i+100);
    await db.$transaction(batch.map((r)=>db.knowledgeRelationship.upsert({
      where:{id:r.id}, update:{...r}, create:{...r},
    })));
    relsWritten+=batch.length;
  }

  const counts = await Promise.all([
    db.knowledgeDocument.count(),
    db.knowledgeChunk.count(),
    db.knowledgeRelationship.count(),
  ]);
  console.log(`\nAtlas importado: docs=${docsWritten}, chunks=${chunksWritten}, relações=${relsWritten}; destino=${counts.join("/")}`);
}

main().finally(async()=>{await source.$disconnect();await db.$disconnect();});
