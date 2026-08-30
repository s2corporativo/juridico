import { NextRequest, NextResponse } from 'next/server';
import { obterSnapshot, politicaFontes } from '@/lib/ejc/fontes-publicas';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const forcar = req.nextUrl.searchParams.get('refresh') === '1';
    const snapshot = await obterSnapshot({ forcar });
    return NextResponse.json({
      ...snapshot,
      politica: politicaFontes(),
    });
  } catch (e) {
    return NextResponse.json(
      { error: 'Falha ao consultar fontes públicas', detalhe: String(e) },
      { status: 502 },
    );
  }
}

export async function POST() {
  try {
    const snapshot = await obterSnapshot({ forcar: true });
    return NextResponse.json({ ...snapshot, politica: politicaFontes() });
  } catch (e) {
    return NextResponse.json(
      { error: 'Falha ao renovar fontes públicas', detalhe: String(e) },
      { status: 502 },
    );
  }
}
