import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Grafo jurídico de conhecimento (item 29 da missão)
export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const slug = sp.get('slug') ?? '';

    if (slug) {
      // Grafo focado: documento central + vizinhos diretos (e vizinhos dos vizinhos até grau 2)
      const centro = await db.knowledgeDocument.findUnique({
        where: { slug },
        include: {
          relacaoOrigem: { include: { destino: { select: { id: true, slug: true, titulo: true, tipoDocumento: true, area: true, confiabilidade: true, status: true } } } },
          relacaoDestino: { include: { origem: { select: { id: true, slug: true, titulo: true, tipoDocumento: true, area: true, confiabilidade: true, status: true } } } },
        },
      });
      if (!centro) return NextResponse.json({ error: 'Documento não encontrado' }, { status: 404 });
      const nodes: Record<string, unknown>[] = [];
      const edges: Record<string, unknown>[] = [];
      const addNode = (d: { id: string; slug: string; titulo: string; tipoDocumento: string; area: string; confiabilidade: string; status: string }, grau: number) => {
        if (!nodes.some((n) => n.id === d.id)) nodes.push({ ...d, grau });
      };
      addNode(centro, 0);
      for (const r of centro.relacaoOrigem) {
        edges.push({ origem: centro.id, destino: r.destino.id, tipo: r.tipo, descricao: r.descricao });
        addNode(r.destino, 1);
      }
      for (const r of centro.relacaoDestino) {
        edges.push({ origem: r.origem.id, destino: centro.id, tipo: r.tipo, descricao: r.descricao });
        addNode(r.origem, 1);
      }
      return NextResponse.json({ centro: { id: centro.id, slug: centro.slug, titulo: centro.titulo }, nodes, edges });
    }

    // Grafo global: todos os relacionamentos + todos os nós envolvidos
    const [rels, total] = await Promise.all([
      db.knowledgeRelationship.findMany({
        include: {
          origem: { select: { id: true, slug: true, titulo: true, tipoDocumento: true, area: true, confiabilidade: true, status: true } },
          destino: { select: { id: true, slug: true, titulo: true, tipoDocumento: true, area: true, confiabilidade: true, status: true } },
        },
      }),
      db.knowledgeDocument.count(),
    ]);
    const nodes: Record<string, unknown>[] = [];
    const push = (d: { id: string; slug: string; titulo: string; tipoDocumento: string; area: string; confiabilidade: string; status: string }) => {
      if (!nodes.some((n) => n.id === d.id)) nodes.push(d);
    };
    const edges = rels.map((r) => {
      push(r.origem);
      push(r.destino);
      return { origem: r.origem.id, destino: r.destino.id, tipo: r.tipo, descricao: r.descricao };
    });
    return NextResponse.json({ total, nodes, edges });
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao carregar grafo', detalhe: String(e) }, { status: 500 });
  }
}
