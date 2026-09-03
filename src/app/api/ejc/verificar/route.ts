// EJC — Verificador de citação jurídica.
// POST { texto } → verifica números CNJ (checksum + DataJud ao vivo), súmulas e precedentes
// contra a base curada. Rastreabilidade até a página dos autos via links oficiais.
// LGPD: NADA é persistido — verificação runtime e efêmera.

import { NextRequest, NextResponse } from 'next/server';
import { verificarCitacao } from '@/lib/ejc/verificar-citacao';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as { texto?: string };
    const texto = (body.texto ?? '').trim();
    if (texto.length < 6) {
      return NextResponse.json({ error: 'Cole o trecho da peça contendo a(s) citação(ões) a verificar.' }, { status: 400 });
    }
    const verificacoes = await verificarCitacao(texto);
    return NextResponse.json({ texto, total: verificacoes.length, verificacoes });
  } catch (e) {
    return NextResponse.json({ error: 'Erro na verificação', detalhe: String(e) }, { status: 500 });
  }
}
