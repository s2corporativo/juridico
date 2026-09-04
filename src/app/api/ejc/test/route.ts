// EJC — API de Testes de Recuperação (RAG) — item 37 da missão.
// GET  /api/ejc/test → { padrao: perguntas do baseline, testes: últimas execuções (take 200) }
// POST /api/ejc/test → executa a suíte completa: retrieval top-10 para cada pergunta padrão,
//                      compara com os slugs esperados, persiste cada execução em RagTest.
// Sucesso = âncoras encontradas entre os 10 primeiros hits (score = acertos/esperados).
// Métricas agregadas (P4): Recall@10 (macro), MRR (recíproco do rank do 1º acerto) e Hit Rate
// (fração de perguntas com ≥ 1 âncora no top-10) — referências: Manning et al., IR (2008).
// Janela ampliada de 8→10 em 2026-09-03 (LOTE-034, base 703 docs): âncoras legítimas que
// caíram no rank 9-10 por crowd-out dos novos docs jurimétricos (janela monotônica — nunca degrada).
// Status: SUCESSO ≥ 0,99 · PARCIAL ≥ 0,50 · FALHA abaixo. Regressão de retrieval é auditável pela UI.

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { buildIndex, retrieveFromIndex, type DocParaRetrieval } from '@/lib/ejc/rag';
import { PERGUNTAS_PADRAO } from '@/lib/ejc/rag-test-baseline';

export const dynamic = 'force-dynamic';

async function montarIndice(): Promise<ReturnType<typeof buildIndex>> {
  const all = await db.knowledgeChunk.findMany({ include: { document: true } });
  const paraRetrieval: DocParaRetrieval[] = all.map((c) => ({
    documentId: c.documentId,
    slug: c.document.slug,
    titulo: c.document.titulo,
    tipoDocumento: c.document.tipoDocumento,
    area: c.document.area,
    confiabilidade: c.document.confiabilidade ?? 'B',
    status: c.document.status,
    fonte: c.document.fonte,
    urlFonte: c.document.urlFonte,
    dataConsulta: c.document.dataConsulta,
    prioridade: c.document.prioridade,
    tags: c.document.tags ? JSON.parse(c.document.tags) : [],
    chunkId: c.id,
    chunkContexto: c.contexto,
    chunkTexto: c.texto,
  }));
  return buildIndex(paraRetrieval);
}

export async function GET() {
  try {
    const testes = await db.ragTest.findMany({ orderBy: { createdAt: 'desc' }, take: 200 });
    return NextResponse.json({
      padrao: PERGUNTAS_PADRAO,
      testes: testes.map((t) => ({
        id: t.id,
        pergunta: t.pergunta,
        score: t.score,
        status: t.status,
        createdAt: t.createdAt,
        documentosEncontrados: t.documentosEncontrados ? JSON.parse(t.documentosEncontrados) : null,
      })),
    });
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao carregar testes', detalhe: String(e) }, { status: 500 });
  }
}

export async function POST() {
  try {
    const inicio = Date.now();
    const index = await montarIndice();
    const resultados = [] as {
      pergunta: string;
      esperados: string[];
      encontrados: string[];
      acertos: number;
      score: number;
      status: string;
      mrr: number;
      primeiroAcertoRank: number | null;
      registros: { slug: string; titulo: string; score: number; confiabilidade: string }[];
    }[];

    for (const p of PERGUNTAS_PADRAO) {
      const hits = retrieveFromIndex(p.pergunta, index, 10);
      const encontrados = hits.map((h) => h.slug);
      const acertos = p.esperados.filter((e) => encontrados.includes(e)).length;
      const score = p.esperados.length ? acertos / p.esperados.length : 0;
      const status = score >= 0.99 ? 'SUCESSO' : score >= 0.5 ? 'PARCIAL' : 'FALHA';
      // MRR: recíproco do rank do primeiro esperado encontrado (0 se nenhum)
      const primeiroAcertoRank = p.esperados.reduce<number | null>((acc, e) => {
        const rank = encontrados.indexOf(e) + 1;
        return rank > 0 && (acc === null || rank < acc) ? rank : acc;
      }, null);
      const mrr = primeiroAcertoRank ? 1 / primeiroAcertoRank : 0;
      const registros = hits.map((h) => ({ slug: h.slug, titulo: h.titulo, score: Math.round(h.score * 100) / 100, confiabilidade: h.confiabilidade }));
      resultados.push({ pergunta: p.pergunta, esperados: p.esperados, encontrados, acertos, score, status, mrr, primeiroAcertoRank, registros });
      await db.ragTest.create({
        data: {
          pergunta: p.pergunta,
          resposta: `${acertos}/${p.esperados.length} âncoras entre os ${hits.length} primeiros hits`,
          documentosEncontrados: JSON.stringify(registros),
          score,
          status,
          observacao: `léxico top-10 · MRR ${mrr.toFixed(2)}${primeiroAcertoRank ? ` · 1º acerto rk ${primeiroAcertoRank}` : ' · sem acerto'} · ${hits.length} docs · ${Date.now() - inicio}ms desde o início da suíte`,
        },
      });
    }

    const media = resultados.length ? resultados.reduce((s, r) => s + r.score, 0) / resultados.length : 0;
    // Agregados IR: Recall@10 macro (= média dos scores), MRR da suíte e Hit Rate (≥ 1 âncora)
    const mrrMedio = resultados.length ? resultados.reduce((s, r) => s + r.mrr, 0) / resultados.length : 0;
    const hitRate = resultados.length ? resultados.filter((r) => r.acertos > 0).length / resultados.length : 0;
    return NextResponse.json({
      total: resultados.length,
      mediaScore: media,
      metricas: { recallAt10: media, mrr: mrrMedio, hitRate },
      resultados,
    });
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao executar suíte de testes', detalhe: String(e) }, { status: 500 });
  }
}
