/**
 * Motor de busca lexical da base de conhecimento — porta de src/lib/ejc/rag.ts
 * (EJC, Zai GLM) para o Atlas. Continua lexical/ponderado (sem embeddings — o
 * EJC também não tinha; o campo de embedding fica reservado para o futuro).
 * Funções puras, sem dependência de framework nem de banco.
 */

const STOPWORDS = new Set([
  "a","o","e","de","da","do","das","dos","em","no","na","nas","nos","para","por","com","que",
  "se","ao","aos","às","à","um","uma","uns","umas","os","as","ou","ser","são","é","foi",
  "como","pelo","pela","até","sobre","entre","seu","sua","seus","suas","quando","mais",
  "será","serao","não","nao","também","tambem","qual","quais","the","of","art","artigo","nº",
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

/** Variações candidatas de um token (stemmer mínimo de plural PT/EN) — token exato sempre vem primeiro. */
export function tokenVariants(t: string): string[] {
  const v = [t];
  if (t.endsWith("coes")) v.push(t.slice(0, -4) + "ao");
  if (t.endsWith("ces")) v.push(t.slice(0, -3) + "a");
  if (t.endsWith("oes")) v.push(t.slice(0, -3) + "ao");
  if (t.endsWith("aes")) v.push(t.slice(0, -3) + "ao");
  if (t.endsWith("s") && t.length > 3) v.push(t.slice(0, -1));
  if (t.endsWith("es") && t.length > 3) v.push(t.slice(0, -2));
  if (t.endsWith("ns") && t.length > 3) v.push(t.slice(0, -2) + "m");
  if (!t.endsWith("s")) {
    v.push(t + "s");
    if (t.endsWith("ao")) v.push(t.slice(0, -2) + "oes");
  }
  return v;
}

export type SearchableChunk = {
  documentId: number;
  documentKind: "knowledge_document" | "legislation";
  documentType?: string;
  slug: string;
  title: string;
  area: string;
  sourceStatus: string;
  /** Status de curadoria (ativo/revisao_humana/desativado/demonstracao) — só existe em knowledgeDocuments; legislação é sempre tratada como ativa. */
  status?: string;
  priority?: string;
  chunkId: number | null;
  chunkContext: string | null;
  chunkText: string;
};

export type SearchHit = SearchableChunk & { score: number };

type ScoredIndex = {
  chunk: SearchableChunk;
  freq: Map<string, number>;
  len: number;
  bonus: Map<string, number>;
  priorityBoost: number;
  statusBoost: number;
  curationPenalty: number;
};

const PRIORITY_BOOST: Record<string, number> = { P0: 0.3, P1: 0.15 };
const OFFICIAL_STATUS_BOOST = 0.25;
/** Porte de rag.ts (EJC) — registros fora de status "ativo" (revisão pendente, demonstração/dados fictícios, desativado) levam a mesma penalidade que tinham no EJC, em vez de competir em pé de igualdade com conteúdo revisado. Legislação não tem esse campo — trata-se sempre como ativa. */
const NON_ACTIVE_STATUS_PENALTY = -0.8;

export function buildSearchIndex(chunks: SearchableChunk[]): ScoredIndex[] {
  return chunks.map((chunk) => {
    const tokens = tokenize(chunk.chunkText);
    const freq = new Map<string, number>();
    for (const t of tokens) freq.set(t, (freq.get(t) ?? 0) + 1);
    const bonus = new Map<string, number>();
    const add = (token: string, value: number) => bonus.set(token, (bonus.get(token) ?? 0) + value);
    for (const t of new Set(tokenize(chunk.chunkContext ?? ""))) add(t, 0.35);
    for (const t of new Set(tokenize(chunk.title))) add(t, 0.5);
    return {
      chunk,
      freq,
      len: tokens.length,
      bonus,
      priorityBoost: chunk.priority ? (PRIORITY_BOOST[chunk.priority] ?? 0) : 0,
      statusBoost: chunk.sourceStatus === "official_confirmed" ? OFFICIAL_STATUS_BOOST : 0,
      curationPenalty: chunk.status && chunk.status !== "ativo" ? NON_ACTIVE_STATUS_PENALTY : 0,
    };
  });
}

function freqWithVariants(idx: ScoredIndex, t: string): number {
  for (const v of tokenVariants(t)) {
    const f = idx.freq.get(v);
    if (f) return f;
  }
  return 0;
}
function bonusWithVariants(idx: ScoredIndex, t: string): number {
  for (const v of tokenVariants(t)) {
    const b = idx.bonus.get(v);
    if (b) return b;
  }
  return 0;
}

/** Busca no índice pré-computado; melhor chunk por documento, top-K documentos distintos. */
export function searchIndex(query: string, index: ScoredIndex[], topK = 20): SearchHit[] {
  const qTokens = tokenize(query);
  if (!qTokens.length) return [];
  const qSet = new Set(qTokens);
  const hits: SearchHit[] = [];
  for (const idx of index) {
    if (!idx.len) continue;
    let overlap = 0;
    for (const t of qSet) {
      const f = freqWithVariants(idx, t);
      if (f) overlap += 1 + Math.log(f);
    }
    if (overlap === 0) continue;
    let bonus = 0;
    for (const t of qSet) bonus += bonusWithVariants(idx, t);
    if (qSet.has(idx.chunk.area.toLowerCase())) bonus += 0.4;
    const score = overlap / Math.sqrt(idx.len) + bonus + idx.priorityBoost + idx.statusBoost + idx.curationPenalty;
    hits.push({ ...idx.chunk, score: Math.round(score * 1000) / 1000 });
  }
  hits.sort((a, b) => b.score - a.score);
  const best = new Map<string, SearchHit>();
  for (const h of hits) {
    const key = `${h.documentKind}:${h.documentId}`;
    if (!best.has(key)) best.set(key, h);
  }
  return [...best.values()].sort((a, b) => b.score - a.score).slice(0, topK);
}
