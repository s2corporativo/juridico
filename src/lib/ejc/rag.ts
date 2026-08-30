// EJC — Motor RAG (item 21 da missão)
// Chunks semanticamente completos + retrieval lexical ponderado.
// Arquitetura preparada para troca por embeddings (campo `embedding` no chunk).

import type { Chunk, RetrievalHit } from './types';

const STOPWORDS = new Set([
  'a', 'o', 'e', 'de', 'da', 'do', 'das', 'dos', 'em', 'no', 'na', 'nas', 'nos', 'para', 'por', 'com', 'que',
  'se', 'ao', 'aos', 'às', 'à', 'um', 'uma', 'uns', 'umas', 'os', 'as', 'ou', 'ser', 'são', 'é', 'foi',
  'do', 'como', 'pelo', 'pela', 'até', 'sobre', 'entre', 'seu', 'sua', 'seus', 'suas', 'quando', 'mais',
  'será', 'serao', 'não', 'nao', 'também', 'tambem', 'qual', 'quais', 'the', 'of', 'art', 'artigo', 'nº', 'no',
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

/**
 * Divide o conteúdo markdown em unidades semanticamente completas (item 21):
 * - separa por seções (## / ###);
 * - cada chunk recebe contexto próprio (título do documento + título da seção);
 * - não separa artigo de sua explicação (blocos contíguos menores que o mínimo são mesclados).
 */
export function gerarChunks(titulo: string, tipoDocumento: string, conteudo: string): Chunk[] {
  const MIN = 280;
  const MAX = 2400;
  const linhas = conteudo.split('\n');
  const secoes: { titulo: string; corpo: string[] }[] = [{ titulo: 'Introdução', corpo: [] }];
  for (const linha of linhas) {
    const m = /^(#{2,3})\s+(.+)$/.exec(linha);
    if (m) secoes.push({ titulo: m[2].trim(), corpo: [linha] });
    else secoes[secoes.length - 1].corpo.push(linha);
  }
  const chunks: Chunk[] = [];
  let buffer = '';
  let bufferTitulo = secoes[0].titulo;
  const flush = () => {
    const texto = buffer.trim();
    if (texto.length < 40) return;
    const contexto = `${titulo} — ${bufferTitulo} [${tipoDocumento}]`;
    if (texto.length <= MAX) {
      chunks.push({ contexto, texto });
    } else {
      // quebra por parágrafos sem cortar raciocínio no meio
      let atual = '';
      for (const p of texto.split('\n\n')) {
        if ((atual + '\n\n' + p).length > MAX && atual.length >= MIN) {
          chunks.push({ contexto, texto: atual.trim() });
          atual = p;
        } else atual = atual ? atual + '\n\n' + p : p;
      }
      if (atual.trim().length >= 40) chunks.push({ contexto, texto: atual.trim() });
    }
    buffer = '';
  };
  for (const secao of secoes) {
    const corpo = secao.corpo.join('\n').trim();
    if (!corpo && secao === secoes[0]) continue;
    if (buffer && (buffer.length + corpo.length > MAX)) {
      flush();
      bufferTitulo = secao.titulo || bufferTitulo;
      buffer = corpo;
    } else if (secao !== secoes[0] && secao.titulo !== 'Introdução') {
      if (buffer) flush();
      bufferTitulo = secao.titulo;
      buffer = corpo;
    } else {
      buffer = buffer ? buffer + '\n\n' + corpo : corpo;
    }
  }
  flush();
  return chunks;
}

export interface DocParaRetrieval {
  documentId: string;
  slug: string;
  titulo: string;
  tipoDocumento: string;
  area: string;
  confiabilidade: string;
  status: string;
  fonte: string | null;
  urlFonte: string | null;
  dataConsulta: string | null;
  prioridade: string;
  tags: string[] | null;
  chunkId: string;
  chunkContexto: string;
  chunkTexto: string;
}

/** Índice pré-computado por chunk (evita re-tokenizar o corpus a cada consulta). */
export interface ChunkIndex {
  doc: DocParaRetrieval;
  freq: Map<string, number>;
  len: number;
  areaLower: string;
  bonus: Map<string, number>; // tokens q → soma dos bônus contextuais (contexto + título + área + tags)
  prioridade: number;
  conf: number;
  penalidade: number;
}

/** Constrói o índice lexical do corpus uma única vez (mesma matemática de retrieve). */
export function buildIndex(docs: DocParaRetrieval[]): ChunkIndex[] {
  return docs.map((d) => {
    const cTokens = tokenize(d.chunkTexto);
    const freq = new Map<string, number>();
    for (const t of cTokens) freq.set(t, (freq.get(t) ?? 0) + 1);
    const bonus = new Map<string, number>();
    const add = (token: string, valor: number) => bonus.set(token, (bonus.get(token) ?? 0) + valor);
    for (const t of new Set(tokenize(d.chunkContexto))) add(t, 0.35);
    for (const t of new Set(tokenize(d.titulo))) add(t, 0.5);
    const areaLower = d.area.toLowerCase();
    for (const tag of d.tags ?? []) {
      for (const t of new Set(tokenize(tag))) add(t, 0.25);
    }
    return {
      doc: d,
      freq,
      len: cTokens.length,
      areaLower,
      bonus,
      prioridade: d.prioridade === 'P0' ? 0.3 : d.prioridade === 'P1' ? 0.15 : 0,
      conf: d.confiabilidade === 'A' ? 0.25 : d.confiabilidade === 'B' ? 0.1 : 0,
      penalidade: d.status === 'ATIVO' ? 0 : -0.8,
    };
  });
}

/**
 * Retrieval lexical ponderado:
 * - overlap de termos do chunk (principal);
 * - bônus por match no contexto do chunk (assunto identificado);
 * - bônus por match no título, área e tags do documento;
 * - desempate por prioridade (P0 > P1) e confiabilidade (A > B > C).
 * Registros com status REVISAO_HUMANA/DEMONSTRACAO são sinalizados no resultado.
 */
export function retrieve(query: string, docs: DocParaRetrieval[], topK = 8): RetrievalHit[] {
  return retrieveFromIndex(query, buildIndex(docs), topK);
}

/**
 * Stemmer mínimo de plural (português/inglês) para matching lexical:
 * devolve variações candidatas do token para busca no índice do documento.
 * O token exato sempre vem primeiro — match idêntico mantém a pontuação original.
 */
export function variacoesToken(t: string): string[] {
  const v = [t];
  if (t.endsWith('coes')) v.push(t.slice(0, -4) + 'ao');
  if (t.endsWith('ces')) v.push(t.slice(0, -3) + 'a');
  if (t.endsWith('oes')) v.push(t.slice(0, -3) + 'ao');
  if (t.endsWith('aes')) v.push(t.slice(0, -3) + 'ao');
  if (t.endsWith('s') && t.length > 3) v.push(t.slice(0, -1));
  if (t.endsWith('es') && t.length > 3) v.push(t.slice(0, -2));
  if (t.endsWith('ns') && t.length > 3) v.push(t.slice(0, -2) + 'm');
  // singular → plural (para quando a QUERY usa singular e o DOC plural)
  if (!t.endsWith('s')) {
    v.push(t + 's');
    if (t.endsWith('ao')) v.push(t.slice(0, -2) + 'oes');
    if (t.endsWith('a') || t.endsWith('e') || t.endsWith('o')) v.push(t.slice(0, -1) + t.slice(-1) + 's');
  }
  return v;
}

/**
 * Busca a frequência do token no chunk aceitando variações de plural (stemmer mínimo).
 */
function freqComVariacoes(idx: ChunkIndex, t: string): number {
  for (const v of variacoesToken(t)) {
    const f = idx.freq.get(v);
    if (f) return f;
  }
  return 0;
}

/**
 * Soma bônus contextual do token aceitando variações de plural (stemmer mínimo).
 */
function bonusComVariacoes(idx: ChunkIndex, t: string): number {
  for (const v of variacoesToken(t)) {
    const b = idx.bonus.get(v);
    if (b) return b;
  }
  return 0;
}

/** Retrieval sobre índice pré-computado — O(corpus) uma única vez.
 *  Extensão 2026-08-30 (LOTE-026): matching com stemmer mínimo de plural —
 *  token exato mantém pontuação idêntica à versão anterior; variações ampliam recall. */
export function retrieveFromIndex(query: string, index: ChunkIndex[], topK = 8): RetrievalHit[] {
  const qTokens = tokenize(query);
  if (!qTokens.length) return [];
  const qSet = new Set(qTokens);
  const hits: RetrievalHit[] = [];
  for (const idx of index) {
    if (!idx.len) continue;
    let overlap = 0;
    for (const t of qSet) {
      const f = freqComVariacoes(idx, t);
      if (f) overlap += 1 + Math.log(f);
    }
    if (overlap === 0) continue;
    let bonus = 0;
    for (const t of qSet) bonus += bonusComVariacoes(idx, t);
    if (qSet.has(idx.doc.area) || qSet.has(idx.areaLower)) bonus += 0.4;
    const score = overlap / Math.sqrt(idx.len) + bonus + idx.prioridade + idx.conf + idx.penalidade;
    const d = idx.doc;
    hits.push({
      documentId: d.documentId,
      slug: d.slug,
      titulo: d.titulo,
      tipoDocumento: d.tipoDocumento,
      area: d.area,
      chunkId: d.chunkId,
      chunkContexto: d.chunkContexto,
      chunkTexto: d.chunkTexto,
      score: Math.round(score * 1000) / 1000,
      confiabilidade: d.confiabilidade,
      fonte: d.fonte,
      urlFonte: d.urlFonte,
      dataConsulta: d.dataConsulta,
      status: d.status,
    });
  }
  // melhor chunk por documento, depois documentos distintos no topK
  hits.sort((a, b) => b.score - a.score);
  const melhores = new Map<string, RetrievalHit>();
  for (const h of hits) if (!melhores.has(h.documentId)) melhores.set(h.documentId, h);
  return [...melhores.values()].sort((a, b) => b.score - a.score).slice(0, topK);
}
