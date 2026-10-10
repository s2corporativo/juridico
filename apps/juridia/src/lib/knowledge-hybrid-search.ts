import type { Database } from "bun:sqlite";
import { searchKnowledgeBm25, type LocalHit } from "./knowledge-local-index";
import { embedWithLocalOllama, validEmbedding, cosineSimilarity } from "./local-embeddings";

export type HybridKnowledgeResult = {
  strategy: "bm25" | "bm25_local_embedding";
  hits: LocalHit[];
};

function indexedVector(db: Database, hit: LocalHit, model: string): number[] | null {
  const table = hit.entityKind === "legal_source" ? "LegalSource" : "KnowledgeChunk";
  const row = db.query("SELECT embedding, embeddingModel FROM " + table + " WHERE id=?")
    .get(hit.id) as { embedding: string | null; embeddingModel: string | null } | null;
  if (!row?.embedding || row.embeddingModel !== model || row.embedding.length > 100_000) return null;
  try {
    const vector: unknown = JSON.parse(row.embedding);
    return validEmbedding(vector) ? vector : null;
  } catch {
    return null;
  }
}

/** Optional semantic re-rank over FTS5 candidates, never unbounded full-table vector scans.
 * All embeddings remain local. A missing Ollama service simply returns lexical hits.
 */
export async function hybridKnowledgeSearch(
  db: Database,
  query: string,
  options: { topK?: number; enabled?: boolean; fetchImpl?: typeof fetch; sourceKind?: "legal_source" | "knowledge_chunk" } = {},
): Promise<HybridKnowledgeResult> {
  const count = Math.max(1, Math.min(30, options.topK ?? 8));
  const hits = searchKnowledgeBm25(db, query, Math.max(30, count), options.sourceKind);
  const lexical = { strategy: "bm25" as const, hits: hits.slice(0, count) };
  if (!options.enabled || !hits.length) return lexical;
  try {
    const { model, vector } = await embedWithLocalOllama(query.slice(0, 2000), {
      fetchImpl: options.fetchImpl,
    });
    const reranked = hits.map((hit, index) => {
      const candidate = indexedVector(db, hit, model);
      const semantic = candidate ? Math.max(0, cosineSimilarity(vector, candidate)) : null;
      return { hit, index, semantic };
    });
    if (!reranked.some(item => item.semantic !== null)) return lexical;
    reranked.sort((a, b) =>
      ((b.semantic ?? 0) * 0.4 + 0.6 / (1 + b.index))
      - ((a.semantic ?? 0) * 0.4 + 0.6 / (1 + a.index))
    );
    return { strategy: "bm25_local_embedding", hits: reranked.slice(0, count).map(x => x.hit) };
  } catch {
    return lexical;
  }
}
