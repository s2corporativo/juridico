// EJC — Querido Diário (guia de integrações, P3): diários oficiais municipais
// das cidades de atuação do EJC (BH, Betim, Contagem, Igarapé). Retorna excertos
// com data/edição e link ao documento de origem (metadados + trecho — não ingere
// conteúdo na base RAG; regra anti-loop preservada).

import { NextRequest, NextResponse } from 'next/server';
import { buscarPublicacoes, CIDADES } from '@/lib/ejc/integracoes/querido-diario';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const municipio = (req.nextUrl.searchParams.get('municipio') ?? '').trim();
  const termo = (req.nextUrl.searchParams.get('termo') ?? '').trim();
  try {
    const publicacoes = await buscarPublicacoes(municipio, termo);
    return NextResponse.json({ municipio, cidade: CIDADES[municipio] ?? municipio, termo, total: publicacoes.length, publicacoes });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 502 });
  }
}
