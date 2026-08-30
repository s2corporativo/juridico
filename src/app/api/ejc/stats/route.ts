import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { BANCOS_EJC, CONFIANCA_LABELS, CHECKS_INGESTAO, TIPOS_DOCUMENTO } from '@/lib/ejc/types';
import { AREAS } from '@/lib/ejc/taxonomy';

export async function GET() {
  try {
    const [total, chunks, porTipo, porArea, porConf, porStatus, lotes, docsVerificacao] = await Promise.all([
      db.knowledgeDocument.count(),
      db.knowledgeChunk.count(),
      db.knowledgeDocument.groupBy({ by: ['tipoDocumento'], _count: true }),
      db.knowledgeDocument.groupBy({ by: ['area'], _count: true }),
      db.knowledgeDocument.groupBy({ by: ['confiabilidade'], _count: true }),
      db.knowledgeDocument.groupBy({ by: ['status'], _count: true }),
      db.ingestBatch.findMany({ orderBy: { createdAt: 'desc' } }),
      db.knowledgeDocument.findMany({
        select: { slug: true, titulo: true, dataUltimaVerificacao: true, proximaVerificacaoRecomendada: true },
      }),
    ]);

    // Painel editorial de frescor documental (padrão adotado do anexo do cliente — pipeline editorial):
    // revisão devida quando a próxima verificação recomendada venceu OU a última verificação tem +90 dias.
    const hoje = new Date();
    const JANELA_MS = 90 * 86_400_000;
    const frescor = { ok: 0, revisaoDevida: 0, semVerificacao: 0 };
    const devidos: Array<{ slug: string; titulo: string; diasAtraso: number }> = [];
    for (const d of docsVerificacao) {
      const ultima = d.dataUltimaVerificacao ? new Date(d.dataUltimaVerificacao) : null;
      const proxima = d.proximaVerificacaoRecomendada ? new Date(d.proximaVerificacaoRecomendada) : null;
      if (!ultima) {
        frescor.semVerificacao += 1;
        continue;
      }
      const vencida = (proxima && proxima <= hoje) || hoje.getTime() - ultima.getTime() > JANELA_MS;
      if (vencida) {
        frescor.revisaoDevida += 1;
        if (devidos.length < 8) {
          const base = proxima ?? ultima;
          devidos.push({ slug: d.slug, titulo: d.titulo, diasAtraso: Math.max(0, Math.floor((hoje.getTime() - base.getTime()) / 86_400_000)) });
        }
      } else frescor.ok += 1;
    }
    devidos.sort((a, b) => b.diasAtraso - a.diasAtraso);

    const bancos = Object.entries(BANCOS_EJC).map(([nome, b]) => {
      const docs = porTipo.filter((t) => b.tipo.includes(t.tipoDocumento as never));
      return {
        banco: nome,
        nome: b.nome,
        descricao: b.descricao,
        tipos: b.tipo,
        quantidade: docs.reduce((s, d) => s + d._count, 0),
      };
    });

    const areas = AREAS.map((a) => ({
      id: a.id,
      nome: a.nome,
      subareas: a.subareas,
      quantidade: porArea.find((x) => x.area === a.id)?._count ?? 0,
    }));

    return NextResponse.json({
      total,
      chunks,
      lotes: lotes.map((l) => ({
        codigo: l.codigo,
        descricao: l.descricao,
        status: l.status,
        pesquisado: l.pesquisado,
        criados: l.criados,
        atualizados: l.atualizados,
        duplicatasEvitadas: l.duplicatasEvitadas,
        createdAt: l.createdAt,
        relatorio: l.relatorio ? JSON.parse(l.relatorio) : null,
      })),
      bancos,
      areas,
      confiabilidade: porConf.map((c) => ({ nivel: c.confiabilidade, ...CONFIANCA_LABELS[c.confiabilidade], quantidade: c._count })),
      status: porStatus.map((s) => ({ status: s.status, quantidade: s._count })),
      frescor: { ...frescor, devidos },
      taxonomia: { areas: AREAS, tiposDocumento: TIPOS_DOCUMENTO },
      checks: CHECKS_INGESTAO,
    });
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao carregar estatísticas EJC', detalhe: String(e) }, { status: 500 });
  }
}
