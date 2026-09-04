// Jurimetria DPT — Motor de recuperação híbrido para PESQUISA JURÍDICA.
// BM25 (Okapi, k1/b clássicos) + embeddings locais (hashing trick, n-gramas de
// palavras e caracteres, 512 dimensões, L2) + fusão RRF (k=60).
//
// HONESTIDADE: o SDK z-ai não expõe embeddings; os vetores são LOCAIS e
// determinísticos (hashing FNV-1a). São "embeddings" no sentido técnico
// (vetores fixos robustos a morfologia/typos), não neurais — o modo é
// sempre reportado nas respostas das rotas ('bm25+emb-local (RRF)').
// Determinismo total: mesma base + mesma query → mesmos resultados.
// LGPD: opera apenas sobre a base de conhecimento curada (sem dados pessoais).

import type { DocParaRetrieval } from './rag';

export const EMB_DIM = 512;
const BM25_K1 = 1.5;
const BM25_B = 0.75;
const RRF_K = 60;

const STOPWORDS = new Set([
  'a', 'as', 'o', 'os', 'de', 'da', 'do', 'das', 'dos', 'e', 'em', 'um', 'uma', 'uns', 'umas',
  'para', 'por', 'com', 'sem', 'no', 'na', 'nos', 'nas', 'ao', 'aos', 'à', 'às', 'que', 'se',
  'do', 'ou', 'é', 'são', 'ser', 'sua', 'seu', 'suas', 'seus', 'pelo', 'pela', 'como', 'mais',
  'menos', 'entre', 'sobre', 'sob', 'até', 'após', 'ante', 'contra', 'desde', 'perante', 'the',
]);

/** Normaliza: minúsculas, sem acentos (NFD), colapsa espaços. */
export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Tokens: alfanuméricos, sem stopwords, tamanho ≥ 2. */
export function tokenizar(texto: string): string[] {
  return normalizar(texto)
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 2 && !STOPWORDS.has(t));
}

/** FNV-1a 32 bits — hash determinístico. */
function fnv1a(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h >>> 0;
}

/** Embedding local: hashing de tokens, bigramas de palavras e trigramas de caracteres. */
function embed(tokens: string[], df: Map<string, number>, total: number): Float32Array {
  const v = new Float32Array(EMB_DIM);
  const idf = (t: string) => Math.log(1 + (total - (df.get(t) ?? 0) + 0.5) / ((df.get(t) ?? 0) + 0.5));
  const add = (feat: string, peso: number) => {
    const h = fnv1a(feat);
    const idx = (h % EMB_DIM + EMB_DIM) % EMB_DIM;
    const sinal = (h >>> 31) & 1 ? -1 : 1;
    v[idx] += sinal * peso;
  };
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    add(t, idf(t));
    if (i + 1 < tokens.length) add(`${t}~${tokens[i + 1]}`, idf(`${t} ${tokens[i + 1]}`) * 0.7);
    if (t.length > 4) {
      for (let j = 0; j + 3 <= t.length; j++) add(`#${t.slice(j, j + 3)}`, 0.25);
    }
  }
  let norm = 0;
  for (let i = 0; i < EMB_DIM; i++) norm += v[i] * v[i];
  norm = Math.sqrt(norm) || 1;
  for (let i = 0; i < EMB_DIM; i++) v[i] /= norm;
  return v;
}

export interface HitHibrido {
  slug: string;
  chunkId: string;
  titulo: string;
  tipoDocumento: string;
  area: string;
  confiabilidade: string;
  status: string;
  fonte: string | null;
  urlFonte: string | null;
  dataConsulta: string | null;
  chunkTexto: string;
  chunkContexto: string | null;
  scoreBm25: number;
  scoreEmb: number;
  score: number; // RRF normalizado (1/(k+rank)) somado sobre os dois motores
  motor: string;
}

interface ItemIndice {
  d: DocParaRetrieval;
  tf: Map<string, number>;
  len: number;
  emb: Float32Array;
  tokens: string[];
}

export interface CorpusBM25 {
  itens: ItemIndice[];
  df: Map<string, number>;
  avgLen: number;
  nChunks: number;
  geradoEm: number;
}

/** Constrói o índice híbrido (BM25 + embeddings) uma única vez por lote de docs. */
export function buildCorpus(docs: DocParaRetrieval[]): CorpusBM25 {
  const df = new Map<string, number>();
  const itens: ItemIndice[] = docs.map((d) => {
    const tokens = tokenizar(`${d.titulo} ${d.chunkContexto ?? ''} ${d.chunkTexto} ${(d.tags ?? []).join(' ')}`);
    const tf = new Map<string, number>();
    const vistos = new Set<string>();
    for (const t of tokens) {
      tf.set(t, (tf.get(t) ?? 0) + 1);
      if (!vistos.has(t)) { vistos.add(t); df.set(t, (df.get(t) ?? 0) + 1); }
    }
    const emb = embed(tokens, df, docs.length);
    return { d, tf, len: tokens.length, emb, tokens };
  });
  const avgLen = itens.reduce((s, i) => s + i.len, 0) / (itens.length || 1);
  return { itens, df, avgLen, nChunks: itens.length, geradoEm: Date.now() };
}

function bm25Scores(corpus: CorpusBM25, tokensQuery: string[]): { item: ItemIndice; score: number }[] {
  const scores: { item: ItemIndice; score: number }[] = [];
  for (const item of corpus.itens) {
    let s = 0;
    for (const t of tokensQuery) {
      const f = item.tf.get(t);
      if (!f) continue;
      const idf = Math.log(1 + (corpus.nChunks - (corpus.df.get(t) ?? 0) + 0.5) / ((corpus.df.get(t) ?? 0) + 0.5));
      s += idf * ((f * (BM25_K1 + 1)) / (f + BM25_K1 * (1 - BM25_B + (BM25_B * item.len) / (corpus.avgLen || 1))));
    }
    if (s > 0) scores.push({ item, score: s });
  }
  return scores.sort((a, b) => b.score - a.score);
}

function embScores(corpus: CorpusBM25, tokensQuery: string[]): { item: ItemIndice; score: number }[] {
  const scores: { item: ItemIndice; score: number }[] = [];
  const q = embedConsulta(corpus, tokensQuery.join(' '));
  let norm = 0;
  for (let i = 0; i < EMB_DIM; i++) norm += q[i] * q[i];
  norm = Math.sqrt(norm) || 1;
  for (const item of corpus.itens) {
    let s = 0;
    for (let i = 0; i < EMB_DIM; i++) s += q[i] * item.emb[i];
    if (s > 0.02) scores.push({ item, score: s });
  }
  return scores.sort((a, b) => b.score - a.score);
}

/** Embedding de consulta público (para reuso). */
export function embedConsulta(corpus: CorpusBM25, query: string): Float32Array {
  return embed(tokenizar(query), corpus.df, corpus.nChunks);
}

/** Busca híbrida BM25 + embeddings com fusão RRF. Determinística. */
export function buscarHibrido(corpus: CorpusBM25, query: string, k = 10): HitHibrido[] {
  const tokensQuery = tokenizar(query);
  if (!tokensQuery.length) return [];
  const bm = bm25Scores(corpus, tokensQuery).slice(0, 40);
  const em = embScores(corpus, tokensQuery).slice(0, 40);

  const rrf = new Map<string, { hit: HitHibrido; s: number }>();
  const put = (item: ItemIndice, rank: number, bm25?: number, emb?: number) => {
    const id = item.d.chunkId;
    const contrib = 1 / (RRF_K + rank + 1);
    const atual = rrf.get(id);
    if (atual) {
      atual.s += contrib;
      if (bm25 !== undefined) atual.hit.scoreBm25 = bm25;
      if (emb !== undefined) atual.hit.scoreEmb = emb;
    } else {
      rrf.set(id, {
        s: contrib,
        hit: {
          slug: item.d.slug,
          chunkId: item.d.chunkId,
          titulo: item.d.titulo,
          tipoDocumento: item.d.tipoDocumento,
          area: item.d.area,
          confiabilidade: item.d.confiabilidade,
          status: item.d.status,
          fonte: item.d.fonte,
          urlFonte: item.d.urlFonte,
          dataConsulta: item.d.dataConsulta,
          chunkTexto: item.d.chunkTexto,
          chunkContexto: item.d.chunkContexto,
          scoreBm25: bm25 ?? 0,
          scoreEmb: emb ?? 0,
          score: 0,
          motor: 'bm25+emb-local (RRF)',
        },
      });
    }
  };
  bm.forEach((x, i) => put(x.item, i, x.score));
  em.forEach((x, i) => put(x.item, i, undefined, x.score));

  return [...rrf.values()]
    .sort((a, b) => b.s - a.s)
    .slice(0, k)
    .map((x) => ({ ...x.hit, score: x.s }));
}
