import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { retrieve, type DocParaRetrieval } from '@/lib/ejc/rag';

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const q = sp.get('q')?.trim() ?? '';
    const tipo = sp.get('tipo') ?? '';
    const area = sp.get('area') ?? '';
    const status = sp.get('status') ?? '';
    const conf = sp.get('conf') ?? '';
    const lote = sp.get('lote') ?? '';
    const slugsParam = sp.get('slugs') ?? '';
    const slug = sp.get('slug') ?? '';
    const page = Math.max(1, parseInt(sp.get('page') ?? '1') || 1);
    const pageSize = Math.min(500, Math.max(5, parseInt(sp.get('pageSize') ?? '12') || 12));

    if (slug) {
      const doc = await db.knowledgeDocument.findUnique({
        where: { slug },
        include: {
          chunks: { orderBy: { ordem: 'asc' } },
          relacaoOrigem: { include: { destino: { select: { slug: true, titulo: true, tipoDocumento: true } } } },
          relacaoDestino: { include: { origem: { select: { slug: true, titulo: true, tipoDocumento: true } } } },
        },
      });
      if (!doc) return NextResponse.json({ error: 'Documento não encontrado' }, { status: 404 });
      return NextResponse.json({ documento: { ...doc, tags: doc.tags ? JSON.parse(doc.tags) : [], metadados: doc.metadados ? JSON.parse(doc.metadados) : null } });
    }

    if (q) {
      // Busca RAG sobre chunks com filtros (filtros de governança aplicados ao DOCUMENTO)
      const where = {
        document: {
          tipoDocumento: tipo || undefined,
          area: area || undefined,
          confiabilidade: conf || undefined,
          lote: lote || undefined,
          ...(status ? { status: { in: status.split(',') } } : {}),
        },
      };
      const all = await db.knowledgeChunk.findMany({
        where,
        include: {
          document: { select: { id: true, slug: true, titulo: true, tipoDocumento: true, area: true, confiabilidade: true, status: true, fonte: true, urlFonte: true, dataConsulta: true, prioridade: true, tags: true } },
        },
      });
      const paraRetrieval: DocParaRetrieval[] = all.map((c) => ({
        documentId: c.document.id,
        slug: c.document.slug,
        titulo: c.document.titulo,
        tipoDocumento: c.document.tipoDocumento,
        area: c.document.area,
        confiabilidade: c.document.confiabilidade,
        status: c.document.status,
        fonte: c.document.fonte,
        urlFonte: c.document.urlFonte,
        dataConsulta: c.document.dataConsulta,
        prioridade: c.document.prioridade,
        tags: c.document.tags ? JSON.parse(c.document.tags) : [],
        chunkId: c.id,
        chunkContexto: c.contexto,
        chunkTexto: c.texto,
      }));
      const hits = retrieve(q, paraRetrieval, pageSize);
      const unicos = new Map<string, (typeof hits)[number]>();
      for (const h of hits) if (!unicos.has(h.documentId)) unicos.set(h.documentId, h);
      return NextResponse.json({ resultados: [...unicos.values()], modo: 'rag-lexical', total: unicos.size });
    }

    const where = {
      tipoDocumento: tipo || undefined,
      area: area || undefined,
      confiabilidade: conf || undefined,
      lote: lote || undefined,
      ...(status ? { status: { in: status.split(',') } } : {}),
      ...(slugsParam ? { slug: { in: slugsParam.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 200) } } : {}),
    };
    const [total, docs] = await Promise.all([
      db.knowledgeDocument.count({ where }),
      db.knowledgeDocument.findMany({
        where,
        orderBy: [{ prioridade: 'asc' }, { updatedAt: 'desc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: { id: true, slug: true, titulo: true, tipoDocumento: true, area: true, subarea: true, assunto: true, prioridade: true, confiabilidade: true, status: true, fonte: true, urlFonte: true, dataConsulta: true, lote: true, tags: true, dataUltimaVerificacao: true, updatedAt: true },
      }),
    ]);
    return NextResponse.json({ total, page, pageSize, documentos: docs.map((d) => ({ ...d, tags: d.tags ? JSON.parse(d.tags) : [] })) });
  } catch (e) {
    return NextResponse.json({ error: 'Erro na consulta EJC', detalhe: String(e) }, { status: 500 });
  }
}
