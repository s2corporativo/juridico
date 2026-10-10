// rag_lite.ts — RAG-lite com TF-IDF cosine similarity (sem pgvector, sem modelo ML)
// Viável para até ~5.000 documentos em SQLite. Para uso pessoal de escritório é suficiente.
//
// Funciona assim:
// 1. Indexa documentos LegalSource gerando vetores TF-IDF
// 2. Dada uma query, gera vetor TF-IDF da query
// 3. Calcula cosine similarity entre query e cada documento
// 4. Retorna top-k mais similares

import { db } from "@/lib/db";

// ── TF-IDF ───────────────────────────────────────────────────────────────────

/** Tokeniza texto em palavras minúsculas sem acento */
function tokenize(text: string): string[] {
  const normalized = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return normalized
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .slice(0, 500); // limita para performance
}

/** Calcula TF (term frequency) para um documento */
function termFreq(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  for (const token of tokens) {
    tf.set(token, (tf.get(token) || 0) + 1);
  }
  // normaliza por tamanho do documento
  const total = tokens.length || 1;
  for (const [key, val] of tf) {
    tf.set(key, val / total);
  }
  return tf;
}

/** IDF (inverse document frequency) */
let idfCache: Map<string, number> | null = null;
let docCountCache = 0;

async function ensureIdfCache() {
  if (idfCache) return;
  const sources = await db.legalSource.findMany({ select: { textoTrecho: true } });
  const N = sources.length || 1;
  const df = new Map<string, number>(); // document frequency

  for (const s of sources) {
    const tokens = new Set(tokenize(s.textoTrecho));
    for (const t of tokens) {
      df.set(t, (df.get(t) || 0) + 1);
    }
  }

  idfCache = new Map();
  for (const [term, freq] of df) {
    idfCache.set(term, Math.log(N / (freq + 1)) + 1);
  }
  docCountCache = N;
}

/** Calcula vetor TF-IDF para um texto */
function tfidfVector(tokens: string[], idf: Map<string, number>): Map<string, number> {
  const tf = termFreq(tokens);
  const vec = new Map<string, number>();
  for (const [term, freq] of tf) {
    const idfVal = idf.get(term) || 1;
    vec.set(term, freq * idfVal);
  }
  return vec;
}

/** Cosine similarity entre dois vetores */
function cosineSimilarity(a: Map<string, number>, b: Map<string, number>): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  // Dot product (interseção de chaves)
  for (const [key, valA] of a) {
    const valB = b.get(key);
    if (valB != null) {
      dotProduct += valA * valB;
    }
    normA += valA * valA;
  }
  for (const [, valB] of b) {
    normB += valB * valB;
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// ── RAG API ─────────────────────────────────────────────────────────────────

export interface RagResult {
  source: {
    id: string;
    diploma: string;
    numero: string;
    tribunal: string | null;
    textoTrecho: string;
    urlOficial: string | null;
    vigente: boolean;
  };
  score: number;
  matchedTerms: string[];
}

/**
 * Busca documentos na base LegalSource usando TF-IDF cosine similarity.
 * Retorna top-k mais similares à query.
 */
/** Read-only FTS5/BM25 preferred, with TF-IDF fallback for unprepared environments.
 * The ranking score is NOT a probability of legal success or source validity.
 */
export async function ragSearch(query: string, topK = 5): Promise<RagResult[]> {
  const dbPath = process.env.JURIDIA_KNOWLEDGE_DB_PATH;
  if (dbPath) {
    try {
      const { openKnowledgeDb } = await import("@/lib/knowledge-local-index");
      const { hybridKnowledgeSearch } = await import("@/lib/knowledge-hybrid-search");
      const local = openKnowledgeDb(dbPath, true);
      let ids: string[] = [];
      try {
        const result = await hybridKnowledgeSearch(local, query, {
          topK: Math.min(30, Math.max(topK * 3, 10)),
          enabled: process.env.JURIDIA_USE_LOCAL_EMBEDDINGS === "true",
        });
        ids = result.hits
          .filter(hit => hit.entityKind === "legal_source" && hit.citable)
          .map(hit => hit.id);
      } finally { local.close(); }
      if (ids.length) {
        const sources = await db.legalSource.findMany({
          where: { id: { in: ids }, vigente: true, revisadoPor: { startsWith: "human:" }, urlOficial: { not: null } },
          select: {
            id: true, diploma: true, numero: true, tribunal: true,
            textoTrecho: true, urlOficial: true, vigente: true,
          },
        });
        const byId = new Map(sources.map(source => [source.id, source]));
        return ids.map((id, rank): RagResult | null => {
          const source = byId.get(id);
          if (!source) return null;
          return { source, score: Math.max(0.05, 0.45 - rank * 0.015), matchedTerms: [] };
        }).filter((r): r is RagResult => r !== null).slice(0, topK);
      }
      // A properly configured FTS5 index with no hits should not switch to
      // stale TF-IDF results. TF-IDF is exclusively a failure fallback.
      return [];
    } catch {
      // Index absent, incompatible runtime or DB locked: continue via TF-IDF.
    }
  }
  return ragSearchTfidf(query, topK);
}

async function ragSearchTfidf(query: string, topK = 5): Promise<RagResult[]> {
  await ensureIdfCache();
  if (!idfCache || docCountCache === 0) return [];

  const queryTokens = tokenize(query);
  const queryVec = tfidfVector(queryTokens, idfCache);

  const sources = await db.legalSource.findMany({
    where: { vigente: true, revisadoPor: { startsWith: "human:" }, urlOficial: { not: null } },
    select: {
      id: true, diploma: true, numero: true, tribunal: true,
      textoTrecho: true, urlOficial: true, vigente: true,
    },
  });

  const results: RagResult[] = [];
  for (const s of sources) {
    const docTokens = tokenize(s.textoTrecho);
    const docVec = tfidfVector(docTokens, idfCache!);
    const score = cosineSimilarity(queryVec, docVec);

    if (score > 0) {
      const matchedTerms = queryTokens.filter((t) => docTokens.includes(t)).slice(0, 10);
      results.push({
        source: {
          id: s.id, diploma: s.diploma, numero: s.numero,
          tribunal: s.tribunal, textoTrecho: s.textoTrecho,
          urlOficial: s.urlOficial, vigente: s.vigente,
        },
        score,
        matchedTerms,
      });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, topK);
}

/** Limpa cache (chamar quando base for atualizada) */
export function clearRagCache() {
  idfCache = null;
  docCountCache = 0;
}
