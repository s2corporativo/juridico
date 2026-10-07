// legal_retrieval.ts — recuperação jurídica híbrida inspirada no EJC.
// SQLite-friendly: TF-IDF existente + BM25 + match exato + autoridade oficial + RRF.
// Quando a base migrar para PostgreSQL/pgvector, esta interface permanece estável.

import { db } from "@/lib/db";
import { ragSearch } from "@/lib/rag_lite";
import { cosineVector, embedText, parseEmbedding } from "@/lib/embedding_service";

type LegalSourceRecord = {
  id: string;
  tipo: string;
  diploma: string;
  numero: string;
  tribunal: string | null;
  textoTrecho: string;
  urlOficial: string | null;
  vigente: boolean;
  dataConsulta: Date | null;
  embedding: string | null;
  embeddingModel: string | null;
};

export interface LegalRetrievalResult {
  source: LegalSourceRecord;
  score: number;
  matchedTerms: string[];
  signals: {
    bm25Rank: number | null;
    tfidfRank: number | null;
    exactMatch: boolean;
    officialSource: boolean;
    semanticRank: number | null;
    semanticScore: number | null;
  };
}

function tokenize(text: string): string[] {
  return text.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9§ºª]+/g, " ")
    .split(/\s+/)
    .filter((x) => x.length > 2);
}

function isOfficial(url: string | null): boolean {
  if (!url) return false;
  try {
    const host = new URL(url).hostname.toLowerCase();
    return [
      "planalto.gov.br", "stf.jus.br", "stj.jus.br", "tst.jus.br", "cnj.jus.br",
      "senado.leg.br", "camara.leg.br", "gov.br", "trf1.jus.br", "trf2.jus.br",
      "trf3.jus.br", "trf4.jus.br", "trf5.jus.br", "trf6.jus.br", "tjmg.jus.br",
    ].some((d) => host === d || host.endsWith("." + d));
  } catch {
    return false;
  }
}

function bm25(queryTokens: string[], docs: { id: string; tokens: string[] }[]): Map<string, number> {
  const result = new Map<string, number>();
  if (!queryTokens.length || !docs.length) return result;
  const k1 = 1.5;
  const b = 0.75;
  const avgdl = docs.reduce((a, d) => a + d.tokens.length, 0) / docs.length || 1;
  const df = new Map<string, number>();
  for (const term of new Set(queryTokens)) {
    let count = 0;
    for (const doc of docs) if (doc.tokens.includes(term)) count++;
    df.set(term, count);
  }
  for (const doc of docs) {
    const tf = new Map<string, number>();
    for (const t of doc.tokens) tf.set(t, (tf.get(t) || 0) + 1);
    let score = 0;
    for (const term of queryTokens) {
      const f = tf.get(term) || 0;
      if (!f) continue;
      const n = df.get(term) || 0;
      const idf = Math.log(1 + (docs.length - n + 0.5) / (n + 0.5));
      score += idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + b * doc.tokens.length / avgdl)));
    }
    result.set(doc.id, score);
  }
  return result;
}

function rankMap(entries: [string, number][]): Map<string, number> {
  return new Map(entries.sort((a, b) => b[1] - a[1]).map(([id], i) => [id, i + 1]));
}

export async function legalSearch(query: string, topK = 8): Promise<LegalRetrievalResult[]> {
  const q = query.trim();
  if (!q) return [];

  const [tfidf, sources] = await Promise.all([
    ragSearch(q, Math.max(20, topK * 4)),
    db.legalSource.findMany({
      where: { vigente: true },
      orderBy: [{ dataConsulta: "desc" }, { updatedAt: "desc" }],
      take: 5000,
      select: {
        id: true, tipo: true, diploma: true, numero: true, tribunal: true,
        textoTrecho: true, urlOficial: true, vigente: true, dataConsulta: true,
        embedding: true, embeddingModel: true,
      },
    }),
  ]);

  if (!sources.length) return [];
  const queryTokens = tokenize(q);
  const docs = sources.map((s) => ({
    id: s.id,
    tokens: tokenize(`${s.diploma} ${s.numero} ${s.tribunal || ""} ${s.textoTrecho}`).slice(0, 1000),
  }));
  const bm = bm25(queryTokens, docs);
  const bmRanks = rankMap([...bm.entries()]);
  const tfidfRanks = new Map(tfidf.map((r, i) => [r.source.id, i + 1]));
  const tfidfById = new Map(tfidf.map((r) => [r.source.id, r]));

  let semanticScores = new Map<string, number>();
  try {
    const qEmbedding = await embedText(q);
    if (qEmbedding?.vector.length) {
      for (const s of sources) {
        const v = parseEmbedding(s.embedding);
        if (v && (!s.embeddingModel || s.embeddingModel === qEmbedding.model)) {
          const score = cosineVector(qEmbedding.vector, v);
          if (score > 0) semanticScores.set(s.id, score);
        }
      }
    }
  } catch {
    semanticScores = new Map();
  }
  const semanticRanks = rankMap([...semanticScores.entries()]);

  const normalizedQ = q.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const k = 60;
  const scored = sources.map((s) => {
    const br = bmRanks.get(s.id);
    const tr = tfidfRanks.get(s.id);
    const sr = semanticRanks.get(s.id);
    const semanticScore = semanticScores.get(s.id) ?? null;
    const diploma = s.diploma.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const numero = s.numero.toLowerCase();
    const exactMatch = (diploma.length > 1 && normalizedQ.includes(diploma)) ||
      (numero.length > 1 && normalizedQ.includes(numero));
    const officialSource = isOfficial(s.urlOficial);
    let raw = 0;
    if (br) raw += 1 / (k + br);
    if (tr) raw += 1 / (k + tr);
    if (sr) raw += 1.35 / (k + sr);
    if (exactMatch) raw += 0.025;
    if (officialSource) raw += 0.008;
    if (s.dataConsulta && Date.now() - s.dataConsulta.getTime() < 365 * 86400000) raw += 0.003;
    const matchedTerms = tfidfById.get(s.id)?.matchedTerms ||
      queryTokens.filter((t) => docs.find((d) => d.id === s.id)?.tokens.includes(t)).slice(0, 10);
    return { source: s, raw, matchedTerms, br: br || null, tr: tr || null, sr: sr || null, semanticScore, exactMatch, officialSource };
  }).filter((x) => x.raw > 0);

  scored.sort((a, b) => b.raw - a.raw);
  const max = scored[0]?.raw || 1;
  return scored.slice(0, topK).map((x) => ({
    source: x.source,
    score: Math.min(1, x.raw / max),
    matchedTerms: x.matchedTerms,
    signals: {
      bm25Rank: x.br,
      tfidfRank: x.tr,
      exactMatch: x.exactMatch,
      officialSource: x.officialSource,
      semanticRank: x.sr,
      semanticScore: x.semanticScore,
    },
  }));
}
