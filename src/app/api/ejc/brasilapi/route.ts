// EJC — BrasilAPI (guia de integrações, P2): due diligence cadastral e prazos.
// GET /api/ejc/brasilapi?tipo=cnpj&valor=00000000000191  → dados cadastrais
// GET /api/ejc/brasilapi?tipo=cep&valor=32570000         → endereço
// GET /api/ejc/brasilapi?tipo=feriados&valor=2026        → feriados nacionais
// Sem autenticação; cache em memória (CNPJ 24h, CEP 7d, feriados 30d).

import { NextRequest, NextResponse } from 'next/server';
import { consultarCnpj, consultarCep, consultarFeriados } from '@/lib/ejc/integracoes/brasilapi';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const tipo = req.nextUrl.searchParams.get('tipo') ?? '';
  const valor = (req.nextUrl.searchParams.get('valor') ?? '').trim();
  try {
    if (tipo === 'cnpj') return NextResponse.json({ tipo, resultado: await consultarCnpj(valor) });
    if (tipo === 'cep') return NextResponse.json({ tipo, resultado: await consultarCep(valor) });
    if (tipo === 'feriados') return NextResponse.json({ tipo, resultado: await consultarFeriados(Number(valor || new Date().getFullYear())) });
    return NextResponse.json({ error: 'tipo inválido — use cnpj | cep | feriados' }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 502 });
  }
}
