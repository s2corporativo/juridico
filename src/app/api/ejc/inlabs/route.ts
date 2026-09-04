// EJC — INLABS / DOU (guia de integrações, P5): exige credencial PESSOAL do
// usuário (cadastro gratuito em inlabs.in.gov.br). Sem credencial, responde
// honestamente { configurado: false } — nada é simulado.
// GET  /api/ejc/inlabs           → status da integração
// POST { termo }                 → busca no DOU (se configurado; efêmero, LGPD)

import { NextRequest, NextResponse } from 'next/server';
import { statusInlabs, buscarDou } from '@/lib/ejc/integracoes/inlabs';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(statusInlabs());
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { termo?: string };
    if (!body.termo?.trim()) return NextResponse.json({ error: 'Informe { termo }.' }, { status: 400 });
    const publicacoes = await buscarDou(body.termo);
    return NextResponse.json({ termo: body.termo.trim(), total: publicacoes.length, publicacoes });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 502 });
  }
}
