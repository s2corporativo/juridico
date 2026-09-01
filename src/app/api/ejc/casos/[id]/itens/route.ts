import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

type Params = { params: Promise<{ id: string }> };

// POST /api/ejc/casos/[id]/itens — vincula documento { tipo:'documento', slug|documentId, anotacao? }
// ou adiciona nota { tipo:'nota', texto }
export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const tipo = String(body?.tipo ?? '');

    if (tipo === 'documento') {
      const slug = String(body?.slug ?? '').trim();
      const documentId = String(body?.documentId ?? '').trim();
      if (!slug && !documentId) return NextResponse.json({ error: 'Informe slug ou documentId' }, { status: 400 });
      const doc = await db.knowledgeDocument.findFirst({
        where: documentId ? { id: documentId } : { slug },
        select: { id: true, slug: true, titulo: true },
      });
      if (!doc) return NextResponse.json({ error: 'Documento não encontrado na base' }, { status: 404 });
      const item = await db.caseDocument.upsert({
        where: { casoId_documentId: { casoId: id, documentId: doc.id } },
        create: { casoId: id, documentId: doc.id, anotacao: String(body?.anotacao ?? '').trim() || null },
        update: body?.anotacao !== undefined ? { anotacao: String(body.anotacao).trim() || null } : {},
        include: { document: { select: { slug: true, titulo: true, tipoDocumento: true, area: true, confiabilidade: true, status: true, urlFonte: true } } },
      });
      return NextResponse.json({ item }, { status: 201 });
    }

    if (tipo === 'nota') {
      const texto = String(body?.texto ?? '').trim();
      if (!texto) return NextResponse.json({ error: 'Texto da nota é obrigatório' }, { status: 400 });
      const nota = await db.caseNote.create({ data: { casoId: id, texto: texto.slice(0, 5000) } });
      return NextResponse.json({ nota }, { status: 201 });
    }

    return NextResponse.json({ error: "tipo deve ser 'documento' ou 'nota'" }, { status: 400 });
  } catch (e) {
    console.error('[api/ejc/casos/:id/itens][POST]', e);
    return NextResponse.json({ error: 'Falha ao adicionar item ao caso' }, { status: 500 });
  }
}

// DELETE /api/ejc/casos/[id]/itens?documento=<caseDocId> ou ?nota=<caseNoteId>
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await params; // id validado implicitamente pelos where compostos abaixo
    const sp = req.nextUrl.searchParams;
    const documento = sp.get('documento');
    const nota = sp.get('nota');
    if (documento) {
      await db.caseDocument.delete({ where: { id: documento } });
      return NextResponse.json({ ok: true });
    }
    if (nota) {
      await db.caseNote.delete({ where: { id: nota } });
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: 'Informe ?documento= ou ?nota=' }, { status: 400 });
  } catch (e) {
    console.error('[api/ejc/casos/:id/itens][DELETE]', e);
    return NextResponse.json({ error: 'Falha ao remover item do caso' }, { status: 500 });
  }
}
