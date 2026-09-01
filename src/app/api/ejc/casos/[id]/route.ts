import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

type Params = { params: Promise<{ id: string }> };

// GET /api/ejc/casos/[id] — detalhe com documentos vinculados e notas
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const caso = await db.caseWorkspace.findUnique({
      where: { id },
      include: {
        documentos: {
          orderBy: { createdAt: 'desc' },
          include: {
            document: {
              select: { slug: true, titulo: true, tipoDocumento: true, area: true, confiabilidade: true, status: true, urlFonte: true },
            },
          },
        },
        notas: { orderBy: { createdAt: 'asc' } },
      },
    });
    if (!caso) return NextResponse.json({ error: 'Caso não encontrado' }, { status: 404 });
    return NextResponse.json({ caso });
  } catch (e) {
    console.error('[api/ejc/casos/:id][GET]', e);
    return NextResponse.json({ error: 'Falha ao carregar caso' }, { status: 500 });
  }
}

// PATCH /api/ejc/casos/[id] — renomeia, muda cliente ou arquiva/reativa
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const data: { nome?: string; cliente?: string | null; status?: string } = {};
    if (body?.nome !== undefined) {
      const nome = String(body.nome).trim();
      if (!nome) return NextResponse.json({ error: 'Nome não pode ficar vazio' }, { status: 400 });
      data.nome = nome.slice(0, 200);
    }
    if (body?.cliente !== undefined) data.cliente = String(body.cliente).trim() || null;
    if (body?.status !== undefined) {
      if (!['ATIVO', 'ARQUIVADO'].includes(body.status)) return NextResponse.json({ error: 'Status inválido' }, { status: 400 });
      data.status = body.status;
    }
    const caso = await db.caseWorkspace.update({ where: { id }, data, include: { _count: { select: { documentos: true, notas: true } } } });
    return NextResponse.json({ caso });
  } catch (e) {
    console.error('[api/ejc/casos/:id][PATCH]', e);
    return NextResponse.json({ error: 'Falha ao atualizar caso' }, { status: 500 });
  }
}

// DELETE /api/ejc/casos/[id] — exclui caso (documentos da base NÃO são afetados)
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await db.caseWorkspace.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[api/ejc/casos/:id][DELETE]', e);
    return NextResponse.json({ error: 'Falha ao excluir caso' }, { status: 500 });
  }
}
