// EJC — Auditoria de Integridade da Curadoria (item 32/34 da missão)
// Re-executa sobre a BASE PERSISTIDA o mesmo conjunto de regras aplicado na
// ingestão (CHECK 1-10), acrescentando: integridade estrutural do banco,
// consistência com a taxonomia, varredura LGPD de TODA a base, política
// anti-invenção e saúde do RAG. Fonte única usada pela API /api/ejc/integridade
// e pelo script scripts/ejc-audit-curadoria.ts.

import { db } from '@/lib/db';
import { AREAS, TAGS_CANONICAS_P0 } from './taxonomy';
import { URLS_OFICIAIS } from './ingest';
import { TIPOS_DOCUMENTO } from './types';

export type Severidade = 'OK' | 'INFO' | 'AVISO' | 'ERRO';

export interface Achado {
  codigo: string;
  severidade: Severidade;
  titulo: string;
  detalhe: string;
  total: number;
  exemplos: string[]; // máx. 8 identificadores (slug ou descrição curta)
}

export interface SecaoAuditoria {
  nome: string;
  status: Severidade; // pior severidade da seção (ERRO > AVISO > INFO > OK)
  achados: Achado[];
}

export interface AuditoriaCuradoria {
  geradoEm: string;
  relogio: string; // data/hora do servidor para contexto
  base: {
    documentos: number;
    chunks: number;
    relacionamentos: number;
    lotes: number;
    tipos: { tipo: string; total: number }[];
    areas: { area: string; total: number }[];
    confiabilidade: Record<string, number>;
    status: Record<string, number>;
  };
  score: number; // 0-100
  veredito: string;
  secoes: SecaoAuditoria[];
}

const LIMITE_EXEMPLOS = 8;

const PESO: Record<Severidade, number> = { OK: 0, INFO: 0, AVISO: 0.5, ERRO: 4 };

function novoAchado(codigo: string, severidade: Severidade, titulo: string, detalhe: string, exemplos: string[], total?: number): Achado {
  return { codigo, severidade, titulo, detalhe, total: total ?? exemplos.length, exemplos: exemplos.slice(0, LIMITE_EXEMPLOS) };
}

function piorSeveridade(achados: Achado[]): Severidade {
  if (achados.some((a) => a.severidade === 'ERRO')) return 'ERRO';
  if (achados.some((a) => a.severidade === 'AVISO')) return 'AVISO';
  if (achados.some((a) => a.severidade === 'INFO')) return 'INFO';
  return 'OK';
}

// ---------- Regras de domínio ----------

const TIPOS_FACTUAIS = new Set(['LEGISLACAO', 'JURISPRUDENCIA', 'PRAZO']);
const RE_SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// LGPD — mesmas expressões usadas na verificação do LOTE-022 (scripts/lgpd-check-lote-022.ts)
const RE_CPF = /\b\d{3}[.\s-]?\d{3}[.\s-]?\d{3}[-\s]?\d{2}\b/g;
const RE_EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const RE_TELEFONE = /(?:\+?55\s?)?(?:\(?\d{2}\)?\s?)?9?\d{4}[-\s]?\d{4}/g;
const RE_NUM_CNJ = /\b\d{7}-?\d{2}\.?\d{4}\.?\d\.?\d{2}\.?\d{4}\b/g;

/** Falso positivo documentado (LOTE-022): intervalo de anos "2025-2026" casa com o regex de telefone. */
function matchEIntervaloDeAnos(s: string): boolean {
  const m = s.match(/^(?:19|20)\d{2}[-\s](?:19|20)\d{2}$/);
  return m !== null;
}

/** Falso positivo: datas em 8 dígitos (DDMMAAAA ou AAAAMMDD), ex. "01062025", "20151217". */
function ehData8Digitos(s: string): boolean {
  if (!/^\d{8}$/.test(s)) return false;
  const d1 = Number(s.slice(0, 2));
  const m1 = Number(s.slice(2, 4));
  const y1 = Number(s.slice(4, 8));
  if (y1 >= 1900 && y1 <= 2100 && m1 >= 1 && m1 <= 12 && d1 >= 1 && d1 <= 31) return true; // DDMMAAAA
  const y2 = Number(s.slice(0, 4));
  const m2 = Number(s.slice(4, 6));
  const d2 = Number(s.slice(6, 8));
  return y2 >= 1900 && y2 <= 2100 && m2 >= 1 && m2 <= 12 && d2 >= 1 && d2 <= 31; // AAAAMMDD
}

/** Fragmento antigo de nº de julgado (ex.: "2013002386" = REsp 2013/002386) — referência pública,
 *  não dado pessoal. Só é tratado como tal em documentos de jurisprudência. */
function ehFragmentoDeJulgado(s: string): boolean {
  const m = s.replace(/\D/g, '').match(/^(19|20)\d{2}\d{6}$/);
  return m !== null;
}

/** O match está dentro de uma URL (parâmetros públicos de fonte oficial, ex.: "nreg=201300238686")? */
function emContextoDeUrl(texto: string, idx: number, len: number): boolean {
  const ini = Math.max(0, idx - 48);
  const ctx = texto.slice(ini, idx + len + 24);
  return /https?:\/\/|nreg=|\.cgi|\?[\w-]+=|&\w+=/.test(ctx);
}

/** O match está colado a contexto de slug/palavra (ex.: "cpc-arts-1022-1026-embargos")? */
function emContextoDeSlug(texto: string, idx: number, len: number): boolean {
  const esq = idx > 0 ? texto[idx - 1] : '';
  const dir = idx + len < texto.length ? texto[idx + len] : '';
  return /[a-z0-9-]/.test(esq) && /[a-z0-9-]/.test(dir);
}

function ehDominioOficial(url: string): boolean {
  return URLS_OFICIAIS.some((u) => url.includes(u));
}

function jaccard(a: string, b: string): number {
  const sa = new Set(a.toLowerCase().split(/\s+/));
  const sb = new Set(b.toLowerCase().split(/\s+/));
  const inter = [...sa].filter((x) => sb.has(x)).length;
  const uni = new Set([...sa, ...sb]).size;
  return uni ? inter / uni : 0;
}

interface DocLinha {
  id: string;
  slug: string;
  titulo: string;
  tipoDocumento: string;
  area: string;
  subarea: string | null;
  assunto: string | null;
  prioridade: string;
  lote: string | null;
  conteudo: string;
  metadados: string | null;
  tags: string | null;
  fonte: string | null;
  urlFonte: string | null;
  dataConsulta: string | null;
  confiabilidade: string;
  vigente: boolean;
  status: string;
  dadosFicticios: boolean;
  dataUltimaVerificacao: string | null;
}

function registrar(secao: Achado[], a: Achado) {
  if (a.total > 0) secao.push(a);
}

/** Auditoria completa (leitura — nunca altera a base). */
export async function auditarCuradoria(): Promise<AuditoriaCuradoria> {
  const agora = new Date();

  const docs = (await db.knowledgeDocument.findMany({
    select: {
      id: true, slug: true, titulo: true, tipoDocumento: true, area: true, subarea: true, assunto: true,
      prioridade: true, lote: true, conteudo: true, metadados: true, tags: true, fonte: true, urlFonte: true,
      dataConsulta: true, confiabilidade: true, vigente: true, status: true, dadosFicticios: true, dataUltimaVerificacao: true,
    },
  })) as DocLinha[];

  const [totalChunks, totalRels, lotes, chunksGroup, ragRecentes] = await Promise.all([
    db.knowledgeChunk.count(),
    db.knowledgeRelationship.count(),
    db.ingestBatch.findMany({ select: { codigo: true, descricao: true, status: true, criados: true, atualizados: true } }),
    db.knowledgeChunk.groupBy({ by: ['documentId'], _count: { _all: true }, _min: { palavras: true } }),
    db.ragTest.findMany({ orderBy: { createdAt: 'desc' }, take: 50, select: { status: true, score: true } }),
  ]);

  const codigosLote = new Set(lotes.map((l) => l.codigo));
  const idsComChunks = new Set(chunksGroup.map((c) => c.documentId));
  const minPalavrasPorDoc = new Map(chunksGroup.map((c) => [c.documentId, c._min.palavras ?? 0]));

  const secoes: SecaoAuditoria[] = [];

  // ---------- SEÇÃO 1: Estrutura do banco ----------
  const estr: Achado[] = [];
  {
    // Slugs canônicos
    const slugsInvalidos = docs.filter((d) => !RE_SLUG.test(d.slug)).map((d) => d.slug);
    registrar(estr, novoAchado('EST-01', 'ERRO', 'Slugs fora da canonicalização kebab-case', 'Todo slug deve seguir /^[a-z0-9]+(-[a-z0-9]+)*$/ (CHECK 9).', slugsInvalidos));

    // Docs sem chunk
    const semChunks = docs.filter((d) => !idsComChunks.has(d.id)).map((d) => d.slug);
    registrar(estr, novoAchado('EST-02', 'ERRO', 'Documentos sem nenhum chunk (falha no pipeline de indexação)', 'Todo documento precisa ao menos 1 chunk para ser recuperável pelo RAG.', semChunks));

    // Chunks vazios
    const chunksVazios = docs.filter((d) => (minPalavrasPorDoc.get(d.id) ?? 0) === 0).map((d) => d.slug);
    registrar(estr, novoAchado('EST-03', 'ERRO', 'Documentos com chunk de texto vazio', 'Chunk com 0 palavras é índice morto.', chunksVazios));

    // Órfãos via SQL direto (FK deveria impedir — verificação de sanidade no SQLite)
    const orfChunks = (await db.$queryRaw<{ c: number }[]>`SELECT COUNT(*) AS c FROM KnowledgeChunk kc LEFT JOIN KnowledgeDocument kd ON kc.documentId = kd.id WHERE kd.id IS NULL`)[0];
    registrar(estr, novoAchado('EST-04', 'ERRO', 'Chunks órfãos (sem documento pai)', 'Violação de integridade referencial.', orfChunks.c > 0 ? [`total: ${orfChunks.c}`] : []));

    const orfRels = (await db.$queryRaw<{ c: number }[]>`SELECT COUNT(*) AS c FROM KnowledgeRelationship kr LEFT JOIN KnowledgeDocument o ON kr.origemId = o.id LEFT JOIN KnowledgeDocument d ON kr.destinoId = d.id WHERE o.id IS NULL OR d.id IS NULL`)[0];
    registrar(estr, novoAchado('EST-05', 'ERRO', 'Relacionamentos apontando para documento inexistente', 'Violação de integridade referencial no grafo jurídico.', orfRels.c > 0 ? [`total: ${orfRels.c}`] : []));

    const selfLoops = (await db.$queryRaw<{ c: number }[]>`SELECT COUNT(*) AS c FROM KnowledgeRelationship WHERE origemId = destinoId`)[0];
    registrar(estr, novoAchado('EST-06', 'AVISO', 'Auto-relacionamentos (origem = destino)', 'Relacionamento de um documento com ele mesmo não agrega significado semântico.', selfLoops.c > 0 ? [`total: ${selfLoops.c}`] : []));

    const relsDup = (await db.$queryRaw<{ origemId: string; destinoId: string; tipo: string; c: number }[]>`SELECT origemId, destinoId, tipo, COUNT(*) AS c FROM KnowledgeRelationship GROUP BY origemId, destinoId, tipo HAVING COUNT(*) > 1`)[0];
    registrar(estr, novoAchado('EST-07', 'AVISO', 'Relacionamentos duplicados (mesma origem, destino e tipo)', 'O pipeline deduplica na ingestão; duplicatas indicam escrita fora do pipeline.', Array.isArray(relsDup) ? relsDup.map((r) => `${r.tipo}: ${r.origemId.slice(-6)}→${r.destinoId.slice(-6)} ×${r.c}`) : []));

    // JSON válido em metadados/tags
    const metadadosRuins: string[] = [];
    const tagsRuins: string[] = [];
    for (const d of docs) {
      if (d.metadados) {
        try {
          const p = JSON.parse(d.metadados);
          if (typeof p !== 'object' || p === null) metadadosRuins.push(d.slug);
        } catch {
          metadadosRuins.push(d.slug);
        }
      }
      if (d.tags) {
        try {
          const p = JSON.parse(d.tags);
          if (!Array.isArray(p) || p.some((t: unknown) => typeof t !== 'string')) tagsRuins.push(d.slug);
        } catch {
          tagsRuins.push(d.slug);
        }
      }
    }
    registrar(estr, novoAchado('EST-08', 'ERRO', 'Metadados com JSON inválido', 'Metadados precisam ser objeto JSON parseável (CHECK 9).', metadadosRuins));
    registrar(estr, novoAchado('EST-09', 'ERRO', 'Tags com JSON inválido (deve ser array de strings)', 'Tags alimentam a taxonomia canônica (item 20).', tagsRuins));

    // Documentos sem lote
    const semLote = docs.filter((d) => !d.lote).map((d) => d.slug);
    registrar(estr, novoAchado('EST-10', 'AVISO', 'Documentos sem lote de origem', 'Rastreabilidade: todo documento deve indicar o lote de ingestão.', semLote));

    // Lote declarado fora do registro IngestBatch
    const lotesFantasma = [...new Set(docs.filter((d) => d.lote && !codigosLote.has(d.lote)).map((d) => `${d.lote} (${docs.filter((x) => x.lote === d.lote).length} docs)`))];
    registrar(estr, novoAchado('EST-11', 'ERRO', 'Documentos com lote não registrado em IngestBatch', 'Quebra a rastreabilidade do relatório por lote (item 34).', lotesFantasma));

    // Prioridade válida
    const prioridadeRuim = docs.filter((d) => !['P0', 'P1', 'P2', 'P3'].includes(d.prioridade)).map((d) => `${d.slug} (${d.prioridade})`);
    registrar(estr, novoAchado('EST-12', 'ERRO', 'Prioridade fora de P0/P1/P2/P3', 'Escala de prioridade canônica (item 26/33).', prioridadeRuim));

    // Status válido
    const statusRuim = docs.filter((d) => !['ATIVO', 'REVISAO_HUMANA', 'DESATIVADO', 'DEMONSTRACAO'].includes(d.status)).map((d) => `${d.slug} (${d.status})`);
    registrar(estr, novoAchado('EST-13', 'ERRO', 'Status fora do vocabulário canônico', 'ATIVO | REVISAO_HUMANA | DESATIVADO | DEMONSTRACAO.', statusRuim));

    // Tipo válido
    const tipoRuim = docs.filter((d) => !TIPOS_DOCUMENTO.includes(d.tipoDocumento as never)).map((d) => `${d.slug} (${d.tipoDocumento})`);
    registrar(estr, novoAchado('EST-14', 'ERRO', 'tipoDocumento fora da taxonomia de 15 bancos', 'CHECK 10 — classificação correta (item 32).', tipoRuim));
  }
  secoes.push({ nome: 'Estrutura e rastreabilidade', status: piorSeveridade(estr), achados: estr });

  // ---------- SEÇÃO 2: Taxonomia (compêndio) ----------
  const tax: Achado[] = [];
  {
    const areasValidas = new Set(AREAS.map((a) => a.id));
    const subareasValidas = new Map(AREAS.map((a) => [a.id, new Set(a.subareas.map((s) => s.id))]));

    const areasInvalidas = docs.filter((d) => !areasValidas.has(d.area)).map((d) => `${d.slug} (área "${d.area}")`);
    registrar(tax, novoAchado('TAX-01', 'ERRO', 'Áreas fora da taxonomia oficial', 'Toda área deve existir em taxonomy.ts (AREAS).', areasInvalidas));

    const subInvalidas = docs.filter((d) => d.subarea && !subareasValidas.get(d.area)?.has(d.subarea)).map((d) => `${d.slug} (${d.area}/${d.subarea})`);
    registrar(tax, novoAchado('TAX-02', 'ERRO', 'Subáreas órfãs (não declaradas na respectiva área)', 'Subárea fora do capítulo declarado gera nó fantasma no Compêndio.', subInvalidas));

    // Capítulos declarados e vazios (informativo — compêndio honesto)
    const usadas = new Set(docs.map((d) => `${d.area}/${d.subarea ?? ''}`));
    const capVazios: string[] = [];
    for (const a of AREAS) {
      for (const s of a.subareas) {
        if (!usadas.has(`${a.id}/${s.id}`)) capVazios.push(`${a.id}/${s.id}`);
      }
    }
    registrar(tax, novoAchado('TAX-03', 'INFO', 'Capítulos declarados sem documento ainda', 'Subáreas preparadas para lotes futuros — manter ou preencher em rodadas seguintes.', capVazios));

    // Tags fora do formato area/subarea ou fora do catálogo canônico
    const tagsForaFormato: string[] = [];
    const tagsNaoCanonicas = new Set<string>();
    for (const d of docs) {
      if (!d.tags) continue;
      let arr: unknown;
      try {
        arr = JSON.parse(d.tags);
      } catch {
        continue; // já coberto em EST-09
      }
      if (!Array.isArray(arr)) continue;
      for (const t of arr) {
        if (typeof t !== 'string') continue;
        if (!/^[a-z0-9-]+\/[a-z0-9-]+$/.test(t)) tagsForaFormato.push(`${d.slug}: "${t}"`);
        else if (!TAGS_CANONICAS_P0.includes(t)) tagsNaoCanonicas.add(t);
      }
    }
    registrar(tax, novoAchado('TAX-04', 'AVISO', 'Tags fora do formato canônico <area>/<subarea>', 'Evita sinonímia de tags (item 20). Corrigidas via scripts/ejc-fix-tags.ts na auditoria de 2026-08-30.', tagsForaFormato));
    // Canônico = catálogo P0 OU par <area>/<subarea> válido declarado em AREAS
    const paresValidos = new Set(AREAS.flatMap((a) => a.subareas.map((s) => `${a.id}/${s.id}`)));
    const tematicas = [...tagsNaoCanonicas].filter((t) => !paresValidos.has(t));
    registrar(tax, novoAchado('TAX-05', 'INFO', 'Tags temáticas fora do catálogo P0 (fora de <area>/<subarea> declarado)', 'Não é erro — mas sinonímia deve ser avaliada antes de novas tags.', tematicas));

    // Assunto/subassunto ausente em docs não triviais (informativo)
    const semAssunto = docs.filter((d) => !d.assunto).map((d) => d.slug);
    registrar(tax, novoAchado('TAX-06', 'INFO', 'Documentos sem campo assunto preenchido', 'Aprofundamento do compêndio: assunto/subassunto refinam a navegação.', semAssunto));
  }
  secoes.push({ nome: 'Taxonomia e compêndio', status: piorSeveridade(tax), achados: tax });

  // ---------- SEÇÃO 3: Regras de curadoria (CHECK 1-10 re-executados) ----------
  const reg: Achado[] = [];
  {
    const factuais = docs.filter((d) => TIPOS_FACTUAIS.has(d.tipoDocumento));

    const semFonte = factuais.filter((d) => !d.fonte).map((d) => d.slug);
    registrar(reg, novoAchado('CUR-01', 'ERRO', 'Documentos factuais sem fonte (CHECK 1)', 'LEGISLAÇÃO/JURISPRUDÊNCIA/PRAZO exigem fonte obrigatória.', semFonte));

    const semUrlOuData = factuais.filter((d) => !d.urlFonte || !d.dataConsulta).map((d) => `${d.slug}${!d.urlFonte ? ' [sem urlFonte]' : ''}${!d.dataConsulta ? ' [sem dataConsulta]' : ''}`);
    registrar(reg, novoAchado('CUR-02', 'ERRO', 'Factuais sem urlFonte ou dataConsulta (CHECK 2)', 'Rastreabilidade: URL oficial + data de consulta são obrigatórias.', semUrlOuData));

    const urlNaoOficial = docs.filter((d) => d.urlFonte && !ehDominioOficial(d.urlFonte)).map((d) => `${d.slug} → ${d.urlFonte}`);
    registrar(reg, novoAchado('CUR-03', 'AVISO', 'URLs de fonte fora dos domínios oficiais', 'Planalto/gov.br/*.jus.br/Câmara/Senado/CNJ etc. Avaliar rebaixar confiabilidade ou revisar.', urlNaoOficial));

    const confASemOficial = factuais.filter((d) => d.confiabilidade === 'A' && d.urlFonte && !ehDominioOficial(d.urlFonte)).map((d) => d.slug);
    registrar(reg, novoAchado('CUR-04', 'ERRO', 'Confiabilidade A sem domínio oficial (CHECK 2)', 'Grau A exige confirmação direta em fonte oficial.', confASemOficial));

    const confInval = docs.filter((d) => !['A', 'B', 'C'].includes(d.confiabilidade)).map((d) => `${d.slug} (${d.confiabilidade})`);
    registrar(reg, novoAchado('CUR-05', 'ERRO', 'Confiabilidade fora de A/B/C', 'Sistema de confiança canônico (item 33).', confInval));

    const inativoAtivo = docs.filter((d) => !d.vigente && d.status === 'ATIVO').map((d) => d.slug);
    registrar(reg, novoAchado('CUR-06', 'ERRO', 'vigente=false com status ATIVO (CHECK 3)', 'Norma/precedente revogado não pode ser servido como ativo.', inativoAtivo));

    const ficticioMalMarcado = docs.filter((d) => d.dadosFicticios && d.status !== 'DEMONSTRACAO').map((d) => d.slug);
    registrar(reg, novoAchado('CUR-07', 'ERRO', 'dadosFicticios=true sem status DEMONSTRACAO (CHECK 7)', 'Conteúdo demonstrativo precisa estar etiquetado (item 24).', ficticioMalMarcado));

    const jurisSemTribunal: string[] = [];
    const jurisSemConfirmacao: string[] = [];
    for (const d of docs.filter((x) => x.tipoDocumento === 'JURISPRUDENCIA')) {
      let meta: Record<string, unknown> = {};
      try {
        meta = d.metadados ? (JSON.parse(d.metadados) as Record<string, unknown>) : {};
      } catch {
        jurisSemTribunal.push(`${d.slug} [metadados ilegíveis]`);
        continue;
      }
      if (!meta['tribunal']) jurisSemTribunal.push(d.slug);
      if (meta['numero_processo'] && !meta['data_consulta_confirmacao'] && !d.dataConsulta) jurisSemConfirmacao.push(d.slug);
    }
    registrar(reg, novoAchado('CUR-08', 'ERRO', 'Jurisprudência sem tribunal (CHECK 5)', 'Precedente sem tribunal não é verificável.', jurisSemTribunal));
    registrar(reg, novoAchado('CUR-09', 'AVISO', 'Jurisprudência com nº de processo sem data de confirmação (CHECK 6)', 'Confirme a data da última consulta ao processo.', jurisSemConfirmacao));

    // C sem revisão humana = inconsistência de política (deve ser marcada p/ revisão)
    const cSemRevisao = docs.filter((d) => d.confiabilidade === 'C' && d.status !== 'REVISAO_HUMANA').map((d) => d.slug);
    registrar(reg, novoAchado('CUR-10', 'AVISO', 'Confiabilidade C sem status REVISAO_HUMANA', 'Fonte não validada deve ficar retida para revisão humana antes do uso automático.', cSemRevisao));

    // C com status ATIVO é pior — subset do anterior mas sinaliza uso direto
    const cAtivo = docs.filter((d) => d.confiabilidade === 'C' && d.status === 'ATIVO').map((d) => d.slug);
    registrar(reg, novoAchado('CUR-11', 'ERRO', 'Confiabilidade C com status ATIVO', 'Conteúdo não validado não pode ser servido como ativo (item 33).', cAtivo));

    // Frescor (padrão Atlas Forense — janela de 90 dias)
    const comVerificacao = docs.filter((d) => d.dataUltimaVerificacao).length;
    const pct = docs.length ? Math.round((comVerificacao / docs.length) * 100) : 0;
    registrar(reg, novoAchado('CUR-12', 'INFO', 'Cobertura de frescor documental (janela 90 dias)', `${comVerificacao}/${docs.length} documentos (${pct}%) têm dataUltimaVerificacao registrada — o painel "Revisão documental" do Visão Geral monitora os vencidos.`, []));

    // Data de consulta plausível (não futura, não absurda)
    const datasFuturas: string[] = [];
    for (const d of docs) {
      if (!d.dataConsulta) continue;
      const dt = new Date(d.dataConsulta);
      if (!Number.isNaN(dt.getTime()) && dt.getTime() > agora.getTime() + 48 * 3600 * 1000) datasFuturas.push(`${d.slug} (${d.dataConsulta})`);
    }
    registrar(reg, novoAchado('CUR-13', 'AVISO', 'dataConsulta no futuro (relógio do servidor: ' + agora.toISOString().slice(0, 10) + ')', 'Data de consulta posterior à data atual sugere erro de preenchimento.', datasFuturas));
  }
  secoes.push({ nome: 'Regras de curadoria (CHECK 1-10)', status: piorSeveridade(reg), achados: reg });

  // ---------- SEÇÃO 4: LGPD (varredura de TODA a base) ----------
  const lgpd: Achado[] = [];
  {
    const cpfHits: string[] = [];
    const emailHits: string[] = [];
    const telHits: string[] = [];
    const telJulgados: string[] = []; // fragmentos antigos de nº de julgado em jurisprudência (público — INFO)
    const cnjJurimetria: string[] = [];
    const cnjOutros: string[] = [];

    const campos = (d: DocLinha): string[] => [d.titulo, d.conteudo, d.metadados ?? '', d.tags ?? '', d.fonte ?? '', d.urlFonte ?? '', d.assunto ?? ''];

    for (const d of docs) {
      const texto = campos(d).join('\n');

      for (const m of texto.matchAll(RE_CPF)) {
        if (emContextoDeUrl(texto, m.index ?? 0, m[0].length) || emContextoDeSlug(texto, m.index ?? 0, m[0].length)) continue;
        cpfHits.push(`${d.slug}: "${m[0]}"`);
      }
      for (const m of texto.matchAll(RE_EMAIL)) {
        if (emContextoDeSlug(texto, m.index ?? 0, m[0].length)) continue;
        emailHits.push(`${d.slug}: "${m[0]}"`);
      }
      for (const m of texto.matchAll(RE_TELEFONE)) {
        const t = m[0].trim();
        // Falsos positivos conhecidos: intervalos de anos e datas em 8 dígitos
        if (matchEIntervaloDeAnos(t) || ehData8Digitos(t)) continue;
        // Contextos públicos: parâmetros de URL de fonte oficial e tokens de slug
        if (emContextoDeUrl(texto, m.index ?? 0, m[0].length)) continue;
        if (emContextoDeSlug(texto, m.index ?? 0, m[0].length)) continue;
        // Nº de julgado em formato antigo dentro de jurisprudência = referência pública, não dado pessoal
        if (ehFragmentoDeJulgado(t) && d.tipoDocumento === 'JURISPRUDENCIA') {
          telJulgados.push(`${d.slug}: "${m[0]}"`);
          continue;
        }
        telHits.push(`${d.slug}: "${m[0]}"`);
      }
      for (const m of texto.match(RE_NUM_CNJ) ?? []) {
        // Números CNJ em JURIMETRIA são proibidos por regra do LOTE-022 (dados individuais)
        if (d.tipoDocumento === 'JURIMETRIA') cnjJurimetria.push(`${d.slug}: "${m}"`);
        // Em JURISPRUDÊNCIA o nº CNJ é o identificador público do precedente — legítimo
        else if (d.tipoDocumento !== 'JURISPRUDENCIA') cnjOutros.push(`${d.slug}: "${m}"`);
      }
    }
    registrar(lgpd, novoAchado('LGP-01', 'ERRO', 'Padrão de CPF encontrado no conteúdo', 'LGPD: dado pessoal sensível não pode residir na base geral.', cpfHits));
    registrar(lgpd, novoAchado('LGP-02', 'ERRO', 'Endereço de e-mail encontrado no conteúdo', 'LGPD: e-mail identifica titular — revisar e anonimizar.', emailHits));
    registrar(lgpd, novoAchado('LGP-03', 'AVISO', 'Padrão de telefone encontrado no conteúdo', 'Falsos positivos de intervalos de anos, datas (DDMMAAAA/AAAAMMDD) e nº antigos de julgado em jurisprudência já filtrados; conferir os demais.', telHits));
    registrar(lgpd, novoAchado('LGP-04', 'ERRO', 'Número de processo CNJ em documento JURIMETRIA', 'Regra do LOTE-022: jurimetria carrega apenas agregados — processos individuais são proibidos.', cnjJurimetria));
    registrar(lgpd, novoAchado('LGP-05', 'AVISO', 'Número de processo CNJ fora de JURISPRUDÊNCIA/JURIMETRIA', 'Peças usam {VARIÁVEIS}; um nº CNJ real fora de jurisprudência pode ser dado de parte — conferir.', cnjOutros));
    registrar(lgpd, novoAchado('LGP-06', 'INFO', 'Nº de julgado em formato antigo citado em jurisprudência', 'Ex.: "2013002386" = REsp 2013/002386 — referência pública de precedente, não é dado pessoal.', telJulgados));
  }
  secoes.push({ nome: 'LGPD e privacidade', status: piorSeveridade(lgpd), achados: lgpd });

  // ---------- SEÇÃO 5: Anti-invenção ----------
  const anti: Achado[] = [];
  {
    const jurisSemUrlOficial = docs.filter((d) => d.tipoDocumento === 'JURISPRUDENCIA' && (!d.urlFonte || !ehDominioOficial(d.urlFonte))).map((d) => `${d.slug}${d.urlFonte ? ` → ${d.urlFonte}` : ' [sem url]'}`);
    registrar(anti, novoAchado('INV-01', 'AVISO', 'Jurisprudência sem URL oficial de confirmação', 'Precedente sem link verificável pode estar em REVISAO_HUMANA — conferir status.', jurisSemUrlOficial));

    const legisSemUrl = docs.filter((d) => d.tipoDocumento === 'LEGISLACAO' && !d.urlFonte).map((d) => d.slug);
    registrar(anti, novoAchado('INV-02', 'ERRO', 'Legislação sem URL do texto oficial', 'Textos normativos devem apontar o inteiro teor (Planalto etc.).', legisSemUrl));

    // Jurimetria não pode conter inferência jurídica típica (súmula/julgado citado como FUNDAMENTO)
    // Menções metodológicas ("aderência", listagem de fontes de coleta) são legítimas → INFO.
    const jurimetriaSuspeita = docs
      .filter((d) => d.tipoDocumento === 'JURIMETRIA')
      .filter((d) => /súmula\s+n?º?\s*\d+/i.test(d.conteudo) || /acórdão/i.test(d.conteudo))
      .map((d) => d.slug);
    registrar(anti, novoAchado('INV-03', 'INFO', 'JURIMETRIA mencionando súmula/acórdão no texto', 'Conferir se a menção é metodológica (aderência/fontes de coleta — legítima) ou inferência de mérito (indevida).', jurimetriaSuspeita));

    // Docs marcados como "como consta" (redações empilhadas/vetados) — honestidade declarada
    const vetados = docs.filter((d) => /\(VETADO\)/i.test(d.conteudo)).map((d) => d.slug);
    registrar(anti, novoAchado('INV-04', 'INFO', 'Documentos que registram "(VETADO)" como consta', 'Boa prática de honestidade literal — manter assim.', vetados));

    const redacaoEmpilhada = docs.filter((d) => /\(Redação dada pela/i.test(d.conteudo)).map((d) => d.slug);
    registrar(anti, novoAchado('INV-05', 'INFO', 'Documentos com redações empilhadas declaradas', 'Histórico de redações preservado "(Redação dada pela ...)" — fiel ao texto oficial.', redacaoEmpilhada));
  }
  secoes.push({ nome: 'Anti-invenção e honestidade literal', status: piorSeveridade(anti), achados: anti });

  // ---------- SEÇÃO 6: Duplicidade semântica (CHECK 8 re-executado) ----------
  const dup: Achado[] = [];
  {
    const grupos = new Map<string, DocLinha[]>();
    for (const d of docs) {
      const k = `${d.tipoDocumento}|${d.area}`;
      if (!grupos.has(k)) grupos.set(k, []);
      grupos.get(k)!.push(d);
    }
    const dupTitulos: string[] = [];
    for (const grupo of grupos.values()) {
      for (let i = 0; i < grupo.length; i++) {
        for (let j = i + 1; j < grupo.length; j++) {
          const a = grupo[i];
          const b = grupo[j];
          if (jaccard(a.titulo, b.titulo) > 0.86 && jaccard(a.conteudo, b.conteudo) > 0.6) {
            dupTitulos.push(`${a.slug} ↔ ${b.slug}`);
          }
        }
      }
    }
    registrar(dup, novoAchado('DUP-01', 'ERRO', 'Duplicatas semânticas (título >0,86 e conteúdo >0,6 de similaridade)', 'Mesma regra do CHECK 8 aplicada sobre a base persistida.', dupTitulos));
  }
  secoes.push({ nome: 'Duplicidade semântica', status: piorSeveridade(dup), achados: dup });

  // ---------- SEÇÃO 7: Saúde do RAG ----------
  const rag: Achado[] = [];
  {
    const falhas = ragRecentes.filter((t) => t.status === 'FALHA').length;
    const parciais = ragRecentes.filter((t) => t.status === 'PARCIAL').length;
    const sucesso = ragRecentes.filter((t) => t.status === 'SUCESSO').length;
    const media = ragRecentes.filter((t) => typeof t.score === 'number').reduce((acc, t) => acc + (t.score ?? 0), 0) / Math.max(1, ragRecentes.filter((t) => typeof t.score === 'number').length);
    registrar(rag, novoAchado('RAG-01', falhas > 0 ? 'AVISO' : 'OK', `Últimas ${ragRecentes.length} execuções do suíte RAG`, `SUCESSO=${sucesso} · PARCIAL=${parciais} · FALHA=${falhas} · score médio=${media.toFixed(2)}`, []));

    if (totalChunks === 0) registrar(rag, novoAchado('RAG-02', 'ERRO', 'Base sem nenhum chunk indexado', 'RAG inoperante.', ['total: 0']));

    // Relacionamentos por tipo (cobertura do grafo)
    const relsPorTipo = await db.knowledgeRelationship.groupBy({ by: ['tipo'], _count: { _all: true } });
    if (relsPorTipo.length === 0) registrar(rag, novoAchado('RAG-03', 'AVISO', 'Grafo jurídico vazio', 'Nenhum relacionamento entre documentos.', []));
    else registrar(rag, novoAchado('RAG-03', 'OK', 'Grafo jurídico por tipo de relação', relsPorTipo.map((r) => `${r.tipo}: ${r._count._all}`).join(' · '), []));
  }
  secoes.push({ nome: 'Saúde do RAG e grafo', status: piorSeveridade(rag), achados: rag });

  // ---------- Score global ----------
  let peso = 0;
  for (const s of secoes) for (const a of s.achados) peso += PESO[a.severidade];
  const score = Math.max(0, Math.min(100, Math.round(100 - peso * 2)));
  const erros = secoes.reduce((acc, s) => acc + s.achados.filter((a) => a.severidade === 'ERRO').reduce((x, a) => x + a.total, 0), 0);
  const avisos = secoes.reduce((acc, s) => acc + s.achados.filter((a) => a.severidade === 'AVISO').reduce((x, a) => x + a.total, 0), 0);
  const veredito =
    erros === 0 && avisos === 0
      ? 'INTEGRIDADE PLENA — base íntegra em todas as verificações.'
      : erros === 0
        ? `ÍNTEGRA COM RESERVAS — ${avisos} ponto(s) de atenção, nenhum erro crítico.`
        : `REQUER INTERVENÇÃO — ${erros} ocorrência(s) crítica(s) e ${avisos} aviso(s).`;

  // ---------- Resumo da base ----------
  const tipos: Record<string, number> = {};
  const areasCount: Record<string, number> = {};
  const confiabilidade: Record<string, number> = {};
  const statusCount: Record<string, number> = {};
  for (const d of docs) {
    tipos[d.tipoDocumento] = (tipos[d.tipoDocumento] ?? 0) + 1;
    areasCount[d.area] = (areasCount[d.area] ?? 0) + 1;
    confiabilidade[d.confiabilidade] = (confiabilidade[d.confiabilidade] ?? 0) + 1;
    statusCount[d.status] = (statusCount[d.status] ?? 0) + 1;
  }

  return {
    geradoEm: agora.toISOString(),
    relogio: agora.toISOString(),
    base: {
      documentos: docs.length,
      chunks: totalChunks,
      relacionamentos: totalRels,
      lotes: lotes.length,
      tipos: Object.entries(tipos).map(([tipo, total]) => ({ tipo, total })).sort((a, b) => b.total - a.total),
      areas: Object.entries(areasCount).map(([area, total]) => ({ area, total })).sort((a, b) => b.total - a.total),
      confiabilidade,
      status: statusCount,
    },
    score,
    veredito,
    secoes,
  };
}
