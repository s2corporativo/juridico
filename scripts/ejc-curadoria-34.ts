// EJC — Curadoria completa (LOTE-034, auditoria 2026-09-03):
// 1) Remap de áreas fora da taxonomia (TAX-01): familia→civil, criminal→penal,
//    infancia-juventude→geral, fazenda-publica→administrativo (somente JURIMETRIA).
// 2) Normalização de tags com NAMESPACING (TAX-04): preserva informação temática
//    (cidade/, tribunal/, fonte/, estado/, tema/) no formato canônico <x>/<y> —
//    difere do ejc-fix-tags.ts (que REMOVIA) para não degradar o bônus léxico do RAG.
// 3) CUR-10/CUR-11: jurimetria-rj-tjmg-campo-aberto → status REVISAO_HUMANA (confiabilidade C
//    não pode ser servido como ATIVO — item 33).
// 4) CUR-03/INV-01: sumula-150-stf-prescricao-execucao → urlFonte oficial STF (portal.stf.jus.br).
// Uso: bun scripts/ejc-curadoria-34.ts
import { db } from '../src/lib/db';

const REMAP_AREA: Record<string, string> = {
  familia: 'civil',
  criminal: 'penal',
  'infancia-juventude': 'geral',
  'fazenda-publica': 'administrativo',
};

const NAMESPACE: Record<string, string> = {
  // fonte
  datajud: 'fonte/datajud',
  cnj: 'fonte/cnj',
  // tribunal
  tjmg: 'tribunal/tjmg',
  trt3: 'tribunal/trt3',
  trf1: 'tribunal/trf1',
  // estado
  mg: 'estado/mg',
  // cidade (MG — 4 comarcas do escopo + polos citados)
  betim: 'cidade/betim',
  contagem: 'cidade/contagem',
  igarape: 'cidade/igarape',
  'belo-horizonte': 'cidade/belo-horizonte',
  'belo horizonte': 'cidade/belo-horizonte',
  uberlandia: 'cidade/uberlandia',
  'juiz-de-fora': 'cidade/juiz-de-fora',
  // tema
  reprodutivel: 'tema/reprodutivel',
  reprodutibilidade: 'tema/reprodutibilidade',
  comparativo: 'tema/comparativo',
  'regiao-metropolitana': 'tema/regiao-metropolitana',
  'quirk-registro-ibge': 'tema/quirk-registro-ibge',
  credor: 'tema/credor',
  le11101: 'norma/le11101',
  tabela: 'tema/tabela',
  documentos: 'tema/documentos',
  argumentacao: 'tema/argumentacao',
  'cram-down': 'tema/cram-down',
  novacao: 'tema/novacao',
  // redundantes com subarea/tipoDocumento — removidos (prática estabelecida do ejc-fix-tags.ts)
  jurimetria: '',
  geral: '',
  metodologia: '',
  triagem: '',
  empresarial: '',
  'processual-civil': '',
  tributario: '',
  trabalhista: '',
  familia: '',
  criminal: '',
  'infancia-juventude': '',
  'fazenda-publica': '',
  'recuperacao-judicial': '',
};

const RE_TAG = /^[a-z0-9-]+\/[a-z0-9-]+$/;

async function main() {
  let remapCount = 0;
  let tagDocs = 0;
  const dropLog: string[] = [];

  // 1) Remap de áreas
  const docs = await db.knowledgeDocument.findMany({
    where: { tipoDocumento: 'JURIMETRIA' },
    select: { id: true, slug: true, area: true, subarea: true, tags: true },
  });
  for (const d of docs) {
    const novo = REMAP_AREA[d.area];
    if (novo && novo !== d.area) {
      await db.knowledgeDocument.update({ where: { id: d.id }, data: { area: novo } });
      remapCount++;
    }
  }

  // 2) Tags — namespacing canônico (todos os docs, não só JURIMETRIA)
  const todos = await db.knowledgeDocument.findMany({ select: { id: true, slug: true, area: true, subarea: true, tags: true } });
  for (const d of todos) {
    if (!d.tags) continue;
    let arr: unknown;
    try { arr = JSON.parse(d.tags); } catch { continue; }
    if (!Array.isArray(arr)) continue;
    const tags = arr.filter((t): t is string => typeof t === 'string');
    const mapeadas = tags
      .filter((t) => !RE_TAG.test(t))
      .map((t) => {
        const ns = NAMESPACE[t];
        if (ns === undefined) { dropLog.push(`${d.slug}: "${t}" (não mapeada — removida)`); return ''; }
        return ns;
      })
      .filter((t) => t !== '');
    const areaAtual = REMAP_AREA[d.area] ?? d.area;
    const parProprio = `${areaAtual}/${d.subarea ?? 'geral'}`;
    if (RE_TAG.test(parProprio)) mapeadas.push(parProprio);
    const mantidas = tags.filter((t) => RE_TAG.test(t));
    const nova = [...new Set([...mantidas, ...mapeadas])];
    if (JSON.stringify(nova) !== JSON.stringify(tags)) {
      await db.knowledgeDocument.update({ where: { id: d.id }, data: { tags: JSON.stringify(nova) } });
      tagDocs++;
    }
  }

  // 3) CUR-10/CUR-11 — confiabilidade C não pode ser ATIVO
  const campo = await db.knowledgeDocument.findUnique({ where: { slug: 'jurimetria-rj-tjmg-campo-aberto' } });
  if (campo && campo.status === 'ATIVO' && campo.confiabilidade === 'C') {
    await db.knowledgeDocument.update({
      where: { id: campo.id },
      data: {
        status: 'REVISAO_HUMANA',
        metadados: JSON.stringify({
          ...(campo.metadados ? JSON.parse(campo.metadados) : {}),
          retido_em: new Date().toISOString().slice(0, 10),
          motivo: 'CUR-11: confiabilidade C não pode ser servida como ATIVO — aguarda validação humana de campo',
        }),
      },
    });
    console.log('CUR-11 corrigido: jurimetria-rj-tjmg-campo-aberto → REVISAO_HUMANA');
  }

  // 4) CUR-03/INV-01 — súmula 150 com URL não-oficial
  const s150 = await db.knowledgeDocument.findUnique({ where: { slug: 'sumula-150-stf-prescricao-execucao' } });
  if (s150 && !s150.urlFonte.includes('stf.jus.br')) {
    await db.knowledgeDocument.update({
      where: { id: s150.id },
      data: {
        urlFonte: 'https://portal.stf.jus.br/jurisprudencia/sumulos.asp',
        fonte: 'STF — Portal de Jurisprudência (súmulas vinculantes e ordinárias; enunciado verbatim conferido via bancos institucionais)',
        dataConsulta: new Date().toISOString().slice(0, 10),
      },
    });
    console.log('CUR-03/INV-01 corrigido: sumula-150 → urlFonte oficial STF');
  }

  console.log(`\n=== CURADORIA LOTE-034 ===`);
  console.log(`Áreas remapeadas: ${remapCount}`);
  console.log(`Docs com tags normalizadas: ${tagDocs}`);
  for (const l of dropLog.slice(0, 15)) console.log(`  DROP: ${l}`);
  process.exit(0);
}

main().catch((e) => { console.error('ERRO:', e); process.exit(1); });
