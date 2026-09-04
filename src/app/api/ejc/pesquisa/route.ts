// EJC — Pesquisa jurídica agêntica (BM25 + embeddings locais, RRF; iterações do agente;
// memo de fundamentação com citações rastreáveis). Memos persistidos sem dados pessoais (LGPD).
// GET  → histórico dos últimos memos
// POST { pergunta, salvar?: boolean } → executa a pesquisa e (por padrão) persiste o memo

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pesquisarAgenticamente } from '@/lib/ejc/pesquisa-agente';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

export async function GET() {
  try {
    const memos = await db.pesquisaMemo.findMany({ orderBy: { createdAt: 'desc' }, take: 30 });
    return NextResponse.json({
      memos: memos.map((m) => ({
        id: m.id,
        pergunta: m.pergunta,
        modo: m.modo,
        motor: m.motor,
        totalFontes: m.totalFontes,
        tempoMs: m.tempoMs,
        createdAt: m.createdAt,
        memo: m.memo ? JSON.parse(m.memo) : null,
        iteracoes: m.iteracoes ? JSON.parse(m.iteracoes) : [],
        fontes: m.fontes ? JSON.parse(m.fontes) : [],
      })),
    });
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao listar memos', detalhe: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as { pergunta?: string; salvar?: boolean };
    const pergunta = (body.pergunta ?? '').trim();
    if (pergunta.length < 8) {
      return NextResponse.json({ error: 'Descreva a tese ou pergunta de pesquisa (mínimo 8 caracteres).' }, { status: 400 });
    }
    const r = await pesquisarAgenticamente(pergunta);
    if (body.salvar !== false) {
      await db.pesquisaMemo.create({
        data: {
          pergunta,
          modo: r.memo.modo,
          motor: r.motor,
          iteracoes: JSON.stringify(r.iteracoes),
          memo: JSON.stringify(r.memo),
          fontes: JSON.stringify(r.fontes.map((f) => ({ slug: f.slug, titulo: f.titulo, urlFonte: f.urlFonte, confiabilidade: f.confiabilidade, status: f.status }))),
          totalFontes: r.fontes.length,
          tempoMs: r.tempoMs,
        },
      });
    }
    return NextResponse.json(r);
  } catch (e) {
    return NextResponse.json({ error: 'Erro na pesquisa agêntica', detalhe: String(e) }, { status: 500 });
  }
}
