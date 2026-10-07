import { db } from "../src/lib/db";
import { embedTexts, embeddingModel } from "../src/lib/embedding_service";

const BATCH = Math.max(1, Math.min(Number(process.env.EMBEDDING_BATCH || 32), 64));
const SCOPE = (process.env.ATLAS_EMBEDDING_SCOPE || "document").toLowerCase();

function documentEmbeddingText(doc: {
  titulo: string;
  area: string;
  subarea: string | null;
  assunto: string | null;
  subassunto: string | null;
  tags: string | null;
}): string {
  return [
    doc.titulo,
    doc.area ? `Área: ${doc.area}` : "",
    doc.subarea ? `Subárea: ${doc.subarea}` : "",
    doc.assunto ? `Assunto: ${doc.assunto}` : "",
    doc.subassunto ? `Subassunto: ${doc.subassunto}` : "",
    doc.tags ? `Tags: ${doc.tags.slice(0, 500)}` : "",
  ].filter(Boolean).join("\n").slice(0, 1200);
}

async function backfillByDocument(model: string) {
  const docs = await db.knowledgeDocument.findMany({
    where: {
      chunks: {
        some: {
          OR: [
            { embedding: null },
            { embeddingModel: { not: model } },
          ],
        },
      },
    },
    orderBy: { id: "asc" },
    select: {
      id: true,
      titulo: true,
      area: true,
      subarea: true,
      assunto: true,
      subassunto: true,
      tags: true,
      _count: { select: { chunks: true } },
    },
  });

  console.log(`Documentos a vetorizar: ${docs.length}; modelo=${model}; batch=${BATCH}; estratégia=document`);

  let chunksUpdated = 0;
  for (let i = 0; i < docs.length; i += BATCH) {
    const batch = docs.slice(i, i + BATCH);
    const result = await embedTexts(batch.map(documentEmbeddingText));
    if (!result) throw new Error("Embeddings locais não habilitados");

    const now = new Date();
    const updates = batch.map((doc, idx) =>
      db.knowledgeChunk.updateMany({
        where: { documentId: doc.id },
        data: {
          embedding: JSON.stringify(result.vectors[idx]),
          embeddingModel: result.model,
          embeddedAt: now,
        },
      })
    );
    const results = await db.$transaction(updates);
    chunksUpdated += results.reduce((sum, x) => sum + x.count, 0);
    console.log(`${Math.min(i + BATCH, docs.length)}/${docs.length} documentos · ${chunksUpdated} chunks`);
  }
}

async function backfillByChunk(model: string) {
  const chunks = await db.knowledgeChunk.findMany({
    where: { OR: [{ embedding: null }, { embeddingModel: { not: model } }] },
    orderBy: { id: "asc" },
    select: { id: true, contexto: true, texto: true },
  });
  console.log(`KnowledgeChunks a vetorizar: ${chunks.length}; modelo=${model}; batch=${BATCH}; estratégia=chunk`);

  for (let i = 0; i < chunks.length; i += BATCH) {
    const batch = chunks.slice(i, i + BATCH);
    const result = await embedTexts(
      batch.map((c) => `${c.contexto}\n${c.texto}`.slice(0, 2500))
    );
    if (!result) throw new Error("Embeddings locais não habilitados");
    await db.$transaction(
      batch.map((c, idx) =>
        db.knowledgeChunk.update({
          where: { id: c.id },
          data: {
            embedding: JSON.stringify(result.vectors[idx]),
            embeddingModel: result.model,
            embeddedAt: new Date(),
          },
        })
      )
    );
    console.log(`${Math.min(i + BATCH, chunks.length)}/${chunks.length}`);
  }
}

async function syncLegalSourceEmbeddings(model: string) {
  const sources = await db.legalSource.findMany({
    where: {
      urlOficial: { not: null },
      OR: [{ embedding: null }, { embeddingModel: { not: model } }],
    },
    select: { id: true, urlOficial: true },
  });
  const urls = [...new Set(sources.map((s) => s.urlOficial).filter((x): x is string => Boolean(x)))];
  if (!urls.length) return 0;

  const docs = await db.knowledgeDocument.findMany({
    where: { urlFonte: { in: urls } },
    select: {
      urlFonte: true,
      chunks: {
        where: { embedding: { not: null }, embeddingModel: model },
        orderBy: { ordem: "asc" },
        take: 1,
        select: { embedding: true, embeddingModel: true, embeddedAt: true },
      },
    },
  });

  const byUrl = new Map(
    docs
      .filter((d) => d.urlFonte && d.chunks[0]?.embedding)
      .map((d) => [d.urlFonte as string, d.chunks[0]])
  );

  let updated = 0;
  for (let i = 0; i < sources.length; i += 100) {
    const batch = sources.slice(i, i + 100)
      .filter((s) => s.urlOficial && byUrl.has(s.urlOficial));
    if (!batch.length) continue;
    const results = await db.$transaction(
      batch.map((s) => {
        const v = byUrl.get(s.urlOficial as string)!;
        return db.legalSource.update({
          where: { id: s.id },
          data: {
            embedding: v.embedding,
            embeddingModel: v.embeddingModel,
            embeddedAt: v.embeddedAt || new Date(),
          },
        });
      })
    );
    updated += results.length;
  }
  return updated;
}

async function main() {
  const model = embeddingModel();
  if (SCOPE === "chunk") await backfillByChunk(model);
  else await backfillByDocument(model);

  const legalSourcesUpdated = await syncLegalSourceEmbeddings(model);
  const [totalChunks, embeddedChunks, totalSources, embeddedSources] = await Promise.all([
    db.knowledgeChunk.count(),
    db.knowledgeChunk.count({ where: { embedding: { not: null }, embeddingModel: model } }),
    db.legalSource.count(),
    db.legalSource.count({ where: { embedding: { not: null }, embeddingModel: model } }),
  ]);

  console.log(JSON.stringify({
    model,
    scope: SCOPE,
    chunks: { embedded: embeddedChunks, total: totalChunks },
    legalSources: { embedded: embeddedSources, total: totalSources, updatedFromKnowledge: legalSourcesUpdated },
  }, null, 2));
}

main().finally(() => db.$disconnect());
