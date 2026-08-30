// EJC — Pipeline de ingestão com validação CHECK 1-10 (item 32) e
// prevenção de duplicação via canonicalização de slug (item 22).

import { db } from '@/lib/db';
import { gerarChunks } from './rag';
import { TIPOS_DOCUMENTO } from './types';
import type { InputDocument } from './types';

export interface IngestResult {
  slug: string;
  acao: 'CRIADO' | 'ATUALIZADO' | 'DESATUALIZADO' | 'REJEITADO';
  avisos: string[];
}

export interface Validacao {
  ok: boolean;
  erros: string[];
  avisos: string[];
}

// Exportado para reutilização na auditoria de integridade da curadoria (src/lib/ejc/auditoria.ts)
export const URLS_OFICIAIS = ['planalto.gov.br', 'gov.br', 'stf.jus.br', 'stj.jus.br', 'tst.jus.br', 'tcu.gov.br', 'camara.leg.br', 'senado.leg.br', 'cnj.jus.br', 'inss.gov.br', 'anpd.gov.br', 'scon.stj.jus.br', 'portal.stf.jus.br', '.jus.br' // qualquer tribunal/órgão do Poder Judiciário (domínios oficiais *.jus.br, ex.: tjdft, tjsp, tjpr)
];

/** Validação CHECK 1-10 antes da inserção (item 32). */
export function validar(doc: InputDocument): Validacao {
  const erros: string[] = [];
  const avisos: string[] = [];

  // Estrutura mínima + CHECK 9 (metadados adequados)
  if (!doc.slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(doc.slug)) erros.push('CHECK 9: slug inválido (use kebab-case canônico).');
  if (!doc.titulo || doc.titulo.length < 5) erros.push('CHECK 9: título ausente ou muito curto.');
  if (!TIPOS_DOCUMENTO.includes(doc.tipoDocumento as never)) erros.push(`CHECK 10: tipoDocumento "${doc.tipoDocumento}" fora da taxonomia.`);
  if (!doc.area) erros.push('CHECK 10: área ausente.');
  if (!doc.conteudo || doc.conteudo.length < 120) erros.push('CHECK 7/9: conteúdo ausente ou insuficiente.');

  // CHECK 1/2 — fonte existente e oficial quando disponível
  const factual = ['LEGISLACAO', 'JURISPRUDENCIA', 'PRAZO'].includes(doc.tipoDocumento);
  if (factual && !doc.fonte) erros.push(`CHECK 1: documento factual (${doc.tipoDocumento}) sem fonte.`);
  if (factual && (!doc.urlFonte || !doc.dataConsulta)) erros.push(`CHECK 2: ${doc.tipoDocumento} exige urlFonte e dataConsulta.`);
  if (doc.urlFonte) {
    const oficial = URLS_OFICIAIS.some((u) => doc.urlFonte!.includes(u));
    if (factual && !oficial && doc.confiabilidade === 'A') erros.push('CHECK 2: confiabilidade A exige domínio oficial.');
    if (factual && !oficial) avisos.push('CHECK 2: URL fora do domínio oficial — revise a confiabilidade.');
  }
  if (doc.confiabilidade && !['A', 'B', 'C'].includes(doc.confiabilidade)) erros.push('CHECK 9: confiabilidade inválida (A|B|C).');

  // CHECK 3 — conteúdo vigente
  if (factual && doc.vigente === false && doc.status === 'ATIVO') erros.push('CHECK 3: norma/precedente não vigente não pode ter status ATIVO.');

  // CHECK 4/5/6 — jurisprudência exige tribunal e dados do processo quando aplicável
  if (doc.tipoDocumento === 'JURISPRUDENCIA') {
    const meta = (doc.metadados ?? {}) as Record<string, unknown>;
    if (!meta['tribunal']) erros.push('CHECK 5: jurisprudência sem tribunal.');
    if (meta['numero_processo'] && !meta['data_consulta_confirmacao'] && !doc.dataConsulta) avisos.push('CHECK 6: confirme data da consulta do processo.');
    if (doc.confiabilidade === 'A' && !String(doc.urlFonte ?? '').match(/stf|stj|tst|tcu|gov\.br|jus\.br/)) {
      avisos.push('CHECK 5: confiabilidade A para jurisprudência normalmente exige domínio de tribunal.');
    }
  }

  // CHECK 7 — texto não inventado: conteúdo demonstrativo deve estar marcado (item 24)
  if (doc.dadosFicticios && doc.status !== 'DEMONSTRACAO') erros.push('CHECK 7: conteúdo fictício precisa status DEMONSTRACAO (item 24).');

  return { ok: erros.length === 0, erros, avisos };
}

/** Similaridade simples por Jaccard de tokens para detecção de duplicata (item 22). */
function jaccard(a: string, b: string): number {
  const sa = new Set(a.toLowerCase().split(/\s+/));
  const sb = new Set(b.toLowerCase().split(/\s+/));
  const inter = [...sa].filter((x) => sb.has(x)).length;
  const uni = new Set([...sa, ...sb]).size;
  return uni ? inter / uni : 0;
}

export interface RelatorioLote {
  lote: string;
  descricao: string;
  pesquisado: number;
  criados: number;
  atualizados: number;
  rejeitados: number;
  duplicatasEvitadas: number;
  avisos: string[];
  fontesConsultadas: string[];
  necessitaRevisao: string[];
}

/** Ingestão de um lote completo com relatório (item 34). */
export async function ingestLote(codigoLote: string, descricao: string, docs: InputDocument[], fontesConsultadas: string[]): Promise<RelatorioLote> {
  const rel: RelatorioLote = {
    lote: codigoLote,
    descricao,
    pesquisado: docs.length,
    criados: 0,
    atualizados: 0,
    rejeitados: 0,
    duplicatasEvitadas: 0,
    avisos: [],
    fontesConsultadas,
    necessitaRevisao: [],
  };

  for (const doc of docs) {
    const val = validar(doc);
    if (!val.ok) {
      rel.rejeitados++;
      rel.avisos.push(`${doc.slug}: ${val.erros.join(' ')}`);
      continue;
    }
    rel.avisos.push(...val.avisos.map((a) => `${doc.slug}: ${a}`));
    if (val.avisos.length) rel.necessitaRevisao.push(doc.slug);

    // CHECK 8 — duplicata: mesmo slug (canonicalização) ou título/área quase idênticos
    const existente = await db.knowledgeDocument.findUnique({ where: { slug: doc.slug } });
    if (!existente) {
      const candidatos = await db.knowledgeDocument.findMany({
        where: { tipoDocumento: doc.tipoDocumento, area: doc.area },
        select: { id: true, slug: true, titulo: true, conteudo: true, versao: true },
      });
      const duplicata = candidatos.find((c) => jaccard(c.titulo, doc.titulo) > 0.86);
      if (duplicata && jaccard(duplicata.conteudo, doc.conteudo) > 0.6) {
        rel.duplicatasEvitadas++;
        continue;
      }
    }

    const chunksBase = doc.chunks?.length ? doc.chunks : gerarChunks(doc.titulo, doc.tipoDocumento, doc.conteudo);
    const dados = {
      slug: doc.slug,
      titulo: doc.titulo,
      tipoDocumento: doc.tipoDocumento,
      area: doc.area,
      subarea: doc.subarea ?? null,
      assunto: doc.assunto ?? null,
      subassunto: doc.subassunto ?? null,
      prioridade: doc.prioridade ?? 'P2',
      lote: doc.lote ?? null,
      conteudo: doc.conteudo,
      metadados: doc.metadados ? JSON.stringify(doc.metadados) : null,
      tags: doc.tags ? JSON.stringify(doc.tags) : null,
      fonte: doc.fonte ?? null,
      urlFonte: doc.urlFonte ?? null,
      dataConsulta: doc.dataConsulta ?? null,
      confiabilidade: doc.confiabilidade ?? 'B',
      vigente: doc.vigente ?? true,
      status: doc.status ?? 'ATIVO',
      dadosFicticios: doc.dadosFicticios ?? false,
      dataUltimaVerificacao: doc.dataUltimaVerificacao ?? null,
      proximaVerificacaoRecomendada: doc.proximaVerificacaoRecomendada ?? null,
    };

    let documentId: string;
    if (existente) {
      const atualizado = await db.knowledgeDocument.update({ where: { slug: doc.slug }, data: { ...dados, versao: { increment: 1 } } });
      documentId = atualizado.id;
      await db.knowledgeChunk.deleteMany({ where: { documentId } });
      rel.atualizados++;
    } else {
      const criado = await db.knowledgeDocument.create({ data: dados });
      documentId = criado.id;
      rel.criados++;
    }
    await db.knowledgeChunk.createMany({
      data: chunksBase.map((c, i) => ({
        documentId,
        ordem: i,
        contexto: c.contexto,
        texto: c.texto,
        palavras: c.texto.split(/\s+/).length,
      })),
    });
    for (const relc of doc.relacionamentos ?? []) {
      const destino = await db.knowledgeDocument.findUnique({ where: { slug: relc.destinoSlug } });
      if (!destino || destino.id === documentId) continue;
      const jaExiste = await db.knowledgeRelationship.findFirst({ where: { origemId: documentId, destinoId: destino.id, tipo: relc.tipo } });
      if (!jaExiste) await db.knowledgeRelationship.create({ data: { origemId: documentId, destinoId: destino.id, tipo: relc.tipo, descricao: relc.descricao ?? null } });
    }
  }

  await db.ingestBatch.upsert({
    where: { codigo: codigoLote },
    create: {
      codigo: codigoLote,
      descricao,
      status: 'CONCLUIDO',
      pesquisado: rel.pesquisado,
      criados: rel.criados,
      atualizados: rel.atualizados,
      duplicatasEvitadas: rel.duplicatasEvitadas,
      fontesConsultadas: JSON.stringify(rel.fontesConsultadas),
      relatorio: JSON.stringify(rel),
    },
    update: {
      status: 'CONCLUIDO',
      pesquisado: rel.pesquisado,
      criados: rel.criados,
      atualizados: rel.atualizados,
      duplicatasEvitadas: rel.duplicatasEvitadas,
      fontesConsultadas: JSON.stringify(rel.fontesConsultadas),
      relatorio: JSON.stringify(rel),
    },
  });
  return rel;
}
