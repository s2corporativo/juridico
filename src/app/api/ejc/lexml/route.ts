// EJC — LexML Brasil (guia de integrações, P4): descoberta de referências
// normativas via SRU/CQL. Retorna metadados (URN, título, tipo, data) com link
// ao documento oficial — nunca conteúdo integral.

import { NextRequest, NextResponse } from 'next/server';
import { buscarReferencias } from '@/lib/ejc/integracoes/lexml';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const query = (req.nextUrl.searchParams.get('query') ?? '').trim();
  const maximo = Math.min(20, Math.max(1, Number(req.nextUrl.searchParams.get('max') ?? 10)));
  if (!query) return NextResponse.json({ error: 'Informe ?query=' }, { status: 400 });
  try {
    const itens = await buscarReferencias(query, maximo);
    return NextResponse.json({ query, total: itens.length, itens });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 502 });
  }
}
