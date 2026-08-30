import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AREAS, subareaNome } from '@/lib/ejc/taxonomy';

export const dynamic = 'force-dynamic';

// Compêndio EJC — índice hierárquico completo: Área → Subárea → documentos.
// Categorização máxima da base para navegação enciclopédica.
export async function GET(req: NextRequest) {
  try {
    const porSlug = req.nextUrl.searchParams.get('slug');
    if (porSlug) {
      const doc = await db.knowledgeDocument.findFirst({
        where: { slug: porSlug },
        select: {
          slug: true, titulo: true, tipoDocumento: true, area: true, subarea: true,
          assunto: true, prioridade: true, confiabilidade: true, status: true, lote: true,
        },
      });
      return NextResponse.json({ documento: doc });
    }

    const docs = await db.knowledgeDocument.findMany({
      select: {
        slug: true, titulo: true, tipoDocumento: true, area: true, subarea: true,
        assunto: true, prioridade: true, confiabilidade: true, status: true, lote: true, updatedAt: true,
      },
      orderBy: [{ prioridade: 'asc' }, { updatedAt: 'desc' }],
    });

    interface Capitulo {
      id: string; nome: string; quantidade: number;
      documentos: Array<{
        slug: string; titulo: string; tipoDocumento: string; assunto: string | null;
        prioridade: string; confiabilidade: string; status: string; lote: string | null;
      }>;
    }
    const capitulos = new Map<string, Capitulo>();

    for (const d of docs) {
      const areaId = d.area ?? 'geral';
      const subId = d.subarea ?? 'sem-subarea';
      const key = `${areaId}/${subId}`;
      let cap = capitulos.get(key);
      if (!cap) {
        cap = { id: key, nome: subareaNome(areaId, subId), quantidade: 0, documentos: [] };
        capitulos.set(key, cap);
      }
      cap.quantidade += 1;
      if (cap.documentos.length < 8) {
        cap.documentos.push({
          slug: d.slug, titulo: d.titulo, tipoDocumento: d.tipoDocumento, assunto: d.assunto,
          prioridade: d.prioridade, confiabilidade: d.confiabilidade, status: d.status, lote: d.lote,
        });
      }
    }

    // Monta árvore: áreas da taxonomia (ordem canônica) + capítulos encontrados
    const areas = AREAS.map((a) => ({
      id: a.id,
      nome: a.nome,
      quantidade: 0,
      subareas: a.subareas
        .map((s) => capitulos.get(`${a.id}/${s.id}`))
        .filter((s): s is Capitulo => Boolean(s))
        .map((s) => ({ ...s, id: s.id.split('/')[1] ?? s.id })),
    }));
    for (const a of areas) a.quantidade = a.subareas.reduce((s, x) => s + x.quantidade, 0);

    // Capítulos fora da taxonomia (honestidade — devem ser raros/zero)
    const orfas = Array.from(capitulos.entries())
      .filter(([key]) => {
        const [areaId, subId] = key.split('/');
        const area = areas.find((a) => a.id === areaId);
        return !area || !area.subareas.some((s) => s.id === subId);
      })
      .map(([key, cap]) => ({ ...cap, id: key, foraDaTaxonomia: true }));

    return NextResponse.json({
      total: docs.length,
      areas,
      orfas,
      estatisticas: {
        areas: areas.filter((a) => a.quantidade > 0).length,
        capitulos: capitulos.size,
      },
      atualizadoEm: new Date().toISOString(),
    });
  } catch (e) {
    return NextResponse.json(
      { error: 'Erro ao montar o compêndio', detalhe: String(e) },
      { status: 500 },
    );
  }
}
