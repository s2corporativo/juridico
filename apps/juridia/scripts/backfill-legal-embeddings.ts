import { db } from "../src/lib/db";
import { embedTexts, embeddingModel } from "../src/lib/embedding_service";

const BATCH = 32;

async function main() {
  const model = embeddingModel();
  const sources = await db.legalSource.findMany({
    where: { OR: [{ embedding: null }, { embeddingModel: { not: model } }] },
    orderBy: { updatedAt: "asc" },
    select: { id: true, tipo: true, diploma: true, numero: true, tribunal: true, textoTrecho: true },
  });
  console.log(`Fontes a vetorizar: ${sources.length}; modelo: ${model}`);

  for (let i = 0; i < sources.length; i += BATCH) {
    const batch = sources.slice(i, i + BATCH);
    const inputs = batch.map((s) => [s.tipo, s.diploma, s.numero, s.tribunal || "", s.textoTrecho].join("\n").slice(0, 12000));
    const result = await embedTexts(inputs);
    if (!result) throw new Error("EMBEDDINGS_ENABLED/OLLAMA_BASE_URL não configurados");
    await db.$transaction(batch.map((s, idx) => db.legalSource.update({
      where: { id: s.id },
      data: {
        embedding: JSON.stringify(result.vectors[idx]),
        embeddingModel: result.model,
        embeddedAt: new Date(),
      },
    })));
    console.log(`${Math.min(i + BATCH, sources.length)}/${sources.length}`);
  }
}

main().finally(() => db.$disconnect());
