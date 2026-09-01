// Jurimetria DPT — Camada de busca SEMÂNTICA (item solicitado pelo usuário)
// O SDK z-ai-web-dev-sdk não expõe embeddings; a semântica é implementada com
// técnicas equivalentes e honestas, sem inventar capacidade:
// 1. EXPANSÃO DE CONSULTA via LLM (terminologia jurídica: sinônimos, nomenclatura
//    processual, siglas) — +1 chamada por consulta, com cache em memória;
// 2. FUSÃO DE RANKINGS (Reciprocal Rank Fusion — RRF) entre a busca léxica da
//    consulta original e a da consulta expandida;
// 3. DEGRADAÇÃO HONESTA: se a IA falhar, retorna null e o chamador usa o léxico
//    puro, sinalizando o modo na resposta (nada é simulado).
// A suíte de regressão (/api/ejc/test) permanece 100% LÉXICA e determinística.

import type ZAI from 'z-ai-web-dev-sdk';
import { retrieveFromIndex, type ChunkIndex, type RetrievalHit } from './rag';

interface Expansao {
  termos: string[];
}

const cache = new Map<string, { termos: string[]; expiracao: number }>();
const TTL_MS = 30 * 60 * 1000; // 30 min — terminologia não muda rápido

/**
 * Expande a pergunta do usuário em termos jurídicos equivalentes via LLM.
 * Retorna null em caso de falha (degradação honesta para o léxico puro).
 */
export async function expandirConsulta(pergunta: string): Promise<string[] | null> {
  const chave = pergunta.trim().toLowerCase();
  const hit = cache.get(chave);
  if (hit && hit.expiracao > Date.now()) return hit.termos;

  try {
    const zai = await import('z-ai-web-dev-sdk').then((m) => m.default.create());
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content:
            'Você é um especialista em terminologia jurídica processual brasileira (CPC, CLT, CDC, CTN, Lei 9.099, Lei 11.101). Dada a pergunta de um advogado, produza termos/expressões jurídicas EQUIVALENTES ou RELACIONADOS que aumentem o recall de busca numa base legal: sinônimos técnicos, nomenclatura processual alternativa, siglas usuais, institutos correlatos. Regras: NÃO repita palavras já presentes na pergunta; NÃO invente dispositivos legais numerados; NÃO explique; devolva APENAS JSON válido no formato {"termos": ["...", "..."]} com 4 a 10 itens curtos (1 a 4 palavras cada). Atenção: nesta base "AI" significa "auto de infração".',
        },
        { role: 'user', content: pergunta },
      ],
      thinking: { type: 'disabled' },
    });
    const bruto = completion.choices[0]?.message?.content ?? '';
    const m = /\{[\s\S]*\}/.exec(bruto);
    if (!m) return null;
    const obj = JSON.parse(m[0]) as Expansao;
    const termos = (Array.isArray(obj.termos) ? obj.termos : [])
      .filter((t) => typeof t === 'string' && t.trim().length > 1)
      .map((t) => t.trim())
      .slice(0, 10);
    if (!termos.length) return null;
    cache.set(chave, { termos, expiracao: Date.now() + TTL_MS });
    return termos;
  } catch {
    return null;
  }
}

function tipoZai(): Promise<typeof ZAI> {
  return import('z-ai-web-dev-sdk').then((m) => m.default);
}

/**
 * Reranking semântico opcional via LLM: reordena os candidatos top-N atribuindo
 * nota de pertinência 0-10 (criterioso: conteúdo do chunk vs. pergunta).
 * Falha → devolve a lista original (nunca perde documentos).
 */
export async function rerankSemantico(
  pergunta: string,
  hits: RetrievalHit[],
  max = 12,
): Promise<RetrievalHit[]> {
  if (hits.length < 3) return hits;
  try {
    const ZAIcls = await tipoZai();
    const zai = await ZAIcls.create();
    const candidatos = hits.slice(0, max).map((h, i) => ({ i, texto: h.chunkTexto.slice(0, 400) }));
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content:
            'Você é um avaliador de relevância para busca jurídica. Dada a PERGUNTA e candidatos numerados (trechos de uma base legal), devolva APENAS JSON {"notas":[{"i":<número>,"nota":<0-10>}]} — nota 10 = responde diretamente a pergunta; 0 = irrelevante. Sem explicações.',
        },
        { role: 'user', content: `PERGUNTA: ${pergunta}\n\nCANDIDATOS:\n${candidatos.map((c) => `[${c.i}] ${c.texto}`).join('\n\n')}` },
      ],
      thinking: { type: 'disabled' },
    });
    const bruto = completion.choices[0]?.message?.content ?? '';
    const m = /\{[\s\S]*\}/.exec(bruto);
    if (!m) return hits;
    const obj = JSON.parse(m[0]) as { notas?: { i: number; nota: number }[] };
    if (!obj.notas?.length) return hits;
    const notaPorIndice = new Map<number, number>();
    for (const n of obj.notas) {
      if (Number.isInteger(n.i) && typeof n.nota === 'number') notaPorIndice.set(n.i, Math.max(0, Math.min(10, n.nota)));
    }
    if (!notaPorIndice.size) return hits;
    const reordenados = hits
      .slice(0, max)
      .map((h, i) => ({ h, notaSemantica: notaPorIndice.get(i) }))
      .filter((x) => x.notaSemantica !== undefined)
      .sort((a, b) => (b.notaSemantica ?? 0) - (a.notaSemantica ?? 0))
      .map((x) => x.h);
    const restantes = hits.slice(max);
    return [...reordenados, ...restantes];
  } catch {
    return hits;
  }
}

/**
 * Busca híbrida: léxico original + léxico da consulta expandida, fundidos por RRF.
 * A pontuação RRF (1/(k+rank), k=60) independe das escalas dos dois rankings.
 * Se `expansao` for null, devolve o resultado léxico puro (degradação honesta).
 */
export function retrieveHibrido(
  pergunta: string,
  index: ChunkIndex[],
  topK = 8,
  expansao: string[] | null,
): { hits: RetrievalHit[]; semantico: boolean } {
  const original = retrieveFromIndex(pergunta, index, topK * 2);

  if (!expansao?.length) return { hits: original.slice(0, topK), semantico: false };

  const expandida = `${pergunta} ${expansao.join(' ')}`;
  const alternativo = retrieveFromIndex(expandida, index, topK * 2);

  const K = 60;
  const rrf = new Map<string, { hit: RetrievalHit; soma: number }>();
  const add = (lista: RetrievalHit[]) => {
    lista.forEach((h, rank) => {
      const key = h.documentId;
      const atual = rrf.get(key) ?? { hit: h, soma: 0 };
      atual.soma += 1 / (K + rank + 1);
      rrf.set(key, atual);
    });
  };
  add(original);
  add(alternativo);

  const fundidos = [...rrf.values()]
    .sort((a, b) => b.soma - a.soma)
    .map((x) => x.hit)
    .slice(0, topK);

  return { hits: fundidos, semantico: true };
}
