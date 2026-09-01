import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/ejc/casos — lista de casos privados (com contagens)
export async function GET() {
  try {
    const casos = await db.caseWorkspace.findMany({
      orderBy: [{ status: 'asc' }, { updatedAt: 'desc' }],
      include: { _count: { select: { documentos: true, notas: true } } },
    });
    return NextResponse.json({ casos, total: casos.length });
  } catch (e) {
    console.error('[api/ejc/casos][GET]', e);
    return NextResponse.json({ error: 'Falha ao listar casos' }, { status: 500 });
  }
}

// POST /api/ejc/casos — cria caso privado { nome, cliente? }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const nome = String(body?.nome ?? '').trim();
    if (!nome) return NextResponse.json({ error: 'Informe o nome/identificação do caso' }, { status: 400 });
    if (nome.length > 200) return NextResponse.json({ error: 'Nome muito longo (máx. 200)' }, { status: 400 });
    const cliente = String(body?.cliente ?? '').trim() || null;

    const caso = await db.caseWorkspace.create({
      data: { nome, cliente, privado: true, status: 'ATIVO' },
      include: { _count: { select: { documentos: true, notas: true } } },
    });
    return NextResponse.json({ caso }, { status: 201 });
  } catch (e) {
    console.error('[api/ejc/casos][POST]', e);
    return NextResponse.json({ error: 'Falha ao criar caso' }, { status: 500 });
  }
}
