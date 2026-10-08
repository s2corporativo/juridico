import { atlasKnowledgeSearch } from "../src/lib/atlas_knowledge_retrieval";
import { legalSearch } from "../src/lib/legal_retrieval";
import { embeddingsEnabled } from "../src/lib/embedding_service";
import { db } from "../src/lib/db";

const query = process.env.RAG_QUERY?.trim() ||
  "responsabilidade civil ambiental objetiva art. 14 Lei 6.938 risco integral";

async function main() {
  const [knowledge, legal] = await Promise.all([
    atlasKnowledgeSearch(query, 5),
    legalSearch(query, 5),
  ]);

  if (!knowledge.length) throw new Error("RAG do acervo interno não retornou resultados");
  if (!legal.length) throw new Error("RAG de fontes jurídicas não retornou resultados");

  const knowledgeHasBm25 = knowledge.some((x) => x.signals.bm25Rank !== null);
  const legalHasBm25 = legal.some((x) => x.signals.bm25Rank !== null);
  if (!knowledgeHasBm25 || !legalHasBm25) {
    throw new Error("BM25 não participou do ranking híbrido");
  }

  if (embeddingsEnabled()) {
    const knowledgeHasSemantic = knowledge.some((x) => x.signals.semanticRank !== null && x.semanticScore !== null);
    const legalHasSemantic = legal.some((x) => x.signals.semanticRank !== null && x.signals.semanticScore !== null);
    if (!knowledgeHasSemantic || !legalHasSemantic) {
      throw new Error("Embedding semântico habilitado, mas não participou do ranking");
    }
  }

  if (!legal.some((x) => x.signals.officialSource)) {
    throw new Error("Nenhuma fonte oficial apareceu no resultado jurídico");
  }

  console.log(JSON.stringify({
    query,
    embeddings: embeddingsEnabled(),
    knowledge: knowledge.map((x) => ({
      title: x.title,
      score: x.score,
      bm25Rank: x.signals.bm25Rank,
      semanticRank: x.signals.semanticRank,
      semanticScore: x.semanticScore,
      official: x.signals.official,
    })),
    legal: legal.map((x) => ({
      diploma: x.source.diploma,
      numero: x.source.numero,
      tribunal: x.source.tribunal,
      score: x.score,
      bm25Rank: x.signals.bm25Rank,
      semanticRank: x.signals.semanticRank,
      semanticScore: x.signals.semanticScore,
      official: x.signals.officialSource,
      url: x.source.urlOficial,
    })),
  }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
