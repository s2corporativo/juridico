// Jurimetria DPT — LOTE-034: BETIM PROFUNDO — jurisprudência/jurimetria real por área do direito
// via API Pública DataJud (chave ativa em .env). Complemento municipal do LOTE-033.
// Uso: bun scripts/ejc-ingest-34.ts
//
// TODOS os números capturados AO VIVO (aggregations, size:0 — nenhum dado pessoal — LGPD OK).
// Anti-invenção: cada doc traz a query JSON EXATA; se a consulta falhar/retornar zero, o doc NÃO nasce.
import { ingestLote } from '../src/lib/ejc/ingest';
import type { InputDocument } from '../src/lib/ejc/types';

const BASE = 'https://api-publica.datajud.cnj.jus.br';
const URL_FONTE = 'https://datajud.cnj.jus.br/';
const DATA_CONSULTA = new Date().toISOString().slice(0, 10);
const KEY = process.env.DATAJUD_API_KEY?.trim() ?? '';

if (!KEY) {
  console.error('ERRO: DATAJUD_API_KEY não configurada no ambiente (.env). Nada será ingerido.');
  process.exit(1);
}

interface DjBucket { key: string | number; doc_count: number }
interface DjResponse { hits: { total: { value: number; relation: string } }; aggregations?: Record<string, { buckets?: DjBucket[] }> }

async function dj(body: unknown): Promise<DjResponse> {
  const res = await fetch(`${BASE}/api_publica_tjmg/_search`, {
    method: 'POST',
    headers: { Authorization: `APIKey ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`DataJud ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return (await res.json()) as DjResponse;
}

const JANELA_2026 = { range: { '@timestamp': { gte: '2026-01-01', lte: '2026-12-31||/y' } } };
const FILTRO_BETIM = { term: { 'orgaoJulgador.codigoMunicipioIBGE': '3106705' } };
const COMO_REPRODUZ = (q: unknown) => `### Como reproduzir (oficial)\n\n\`\`\`json\n${JSON.stringify(q)}\n\`\`\`\n\nPOST https://api-publica.datajud.cnj.jus.br/api_publica_tjmg/_search com o cabeçalho \`Authorization: APIKey <chave gratuita CNJ>\`.`;
const ALERTAS = `### Alertas e limitações (honestidade)\n\n- Números refletem o índice DataJud na data da consulta (${DATA_CONSULTA}) — RETRATO, não censo absoluto; reindexações podem alterar contagens.\n- Contagens acima de 10 mil retornam \`relation: gte\` (saturação) — marcadas como "≥".\n- O recorte "janela 2026" usa a atualização do índice (@timestamp), não a data de ajuizamento.\n- Agregações oficiais apenas: nenhum número de processo, parte, CPF ou dado pessoal (LGPD).\n- Grafias de classes/varas variam — buckets literais da API (\`.keyword\`).`;

function docJr(
  slug: string, titulo: string, area: string, assunto: string,
  escopo: string, numeros: string, query: unknown, extra: string,
): InputDocument {
  return {
    slug,
    titulo,
    tipoDocumento: 'JURIMETRIA',
    area,
    subarea: 'jurimetria',
    assunto,
    prioridade: 'P1',
    lote: 'LOTE-034',
    conteudo: `## Escopo\n${escopo}\n\n## Números (retrato DataJud ${DATA_CONSULTA})\n${numeros}\n\n${COMO_REPRODUZ(query)}\n\n${extra}\n\n${ALERTAS}`,
    metadados: {
      orgao: 'CNJ — API Pública DataJud (TJMG)',
      tipoDados: 'agregados oficiais (aggregations, size:0)',
      lgpd: 'sem dados pessoais — somente contagens agregadas',
      dataConsulta: DATA_CONSULTA,
      ambiente: 'chave oficial gratuita via env DATAJUD_API_KEY',
      municipio: 'Betim (IBGE 3106705)',
    },
    tags: ['jurimetria', 'datajud', 'cnj', 'tjmg', 'mg', 'betim', area, 'reprodutivel'],
    fonte: 'CNJ — API Pública DataJud (consulta ao vivo, chave oficial)',
    urlFonte: URL_FONTE,
    dataConsulta: DATA_CONSULTA,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: DATA_CONSULTA,
    proximaVerificacaoRecomendada: '2026-12-01',
  };
}

const listaFmt = (buckets: DjBucket[] | undefined, n = 12) =>
  (buckets ?? []).slice(0, n).map((b, i) => `${i + 1}. ${b.key} — **${b.doc_count.toLocaleString('pt-BR')}** processos`).join('\n');

const fmtTotal = (r: DjResponse) => `**≥ ${r.hits.total.value.toLocaleString('pt-BR')}** (${r.hits.total.relation === 'gte' ? 'contagem saturada — valor mínimo' : 'exato'})`;

// consulta padrão: filtro Betim + wildcards/phrases na classe + agregações
interface AreaSpec {
  slug: string; titulo: string; area: string; assunto: string; escopo: string; uso: string;
  match: Record<string, unknown>; // clause única (match_phrase ou bool should wildcards)
  aggs: Record<string, { terms: { field: string; size: number } }>;
  rotulos: string[]; // ordem dos aggs a exibir
}
async function coletarArea(spec: AreaSpec, docs: InputDocument[], avisos: string[]) {
  try {
    const q = { size: 0, query: { bool: { must: [FILTRO_BETIM, spec.match] } }, aggs: spec.aggs };
    const r = await dj(q);
    if (r.hits.total.value === 0) {
      avisos.push(`${spec.slug}: zero resultados — doc não gerado`);
      return;
    }
    const partes = [`Total Betim (histórico do índice): ${fmtTotal(r)}.`];
    for (const rot of spec.rotulos) {
      const b = r.aggregations?.[rot]?.buckets;
      if (b?.length) partes.push(`**${rot}**:\n\n${listaFmt(b, 15)}`);
    }
    docs.push(docJr(spec.slug, spec.titulo, spec.area, spec.assunto, spec.escopo, partes.join('\n\n'), q, spec.uso));
  } catch (e) { avisos.push(`${spec.slug}: ${String(e).slice(0, 140)}`); }
}

async function main() {
  const docs: InputDocument[] = [];
  const avisos: string[] = [];

  // 0) Varas de Betim — carga por unidade (histórico) + pulso 2026
  try {
    const q = { size: 0, query: FILTRO_BETIM, aggs: { varas: { terms: { field: 'orgaoJulgador.nome.keyword', size: 15 } } } };
    const r = await dj(q);
    const q26 = { size: 0, query: { bool: { must: [FILTRO_BETIM, JANELA_2026] } } };
    const r26 = await dj(q26);
    if (r.hits.total.value > 0) {
      docs.push(docJr(
        'jrm-tjmg-betim-varas-carga', 'Jurimetria municipal — Betim: carga por vara/unidade e pulso 2026 (DataJud, histórico completo)',
        'geral', 'varas Betim carga por unidade',
        'Unidades jurisdicionais da Comarca de Betim (IBGE 3106705) ordenadas pela carga processual indexada no DataJud (histórico completo do TJMG), com pulso da janela 2026. Identifica qual vara concentra cada natureza de demanda e dimensiona a pauta do foro — base para a seleção por cidade e vara da aba Jurimetria.',
        `Total Betim (histórico do índice): ${fmtTotal(r)}. Janela 2026: ≥ ${r26.hits.total.value.toLocaleString('pt-BR')} processos.\n\n**Unidades por carga** (literal da API):\n\n${listaFmt(r.aggregations?.varas?.buckets, 15)}`,
        { multi: true, desc: 'total por município + agregação de unidades; janela 2026 em consulta separada (queries em ordem)', queries: [q, q26] },
        'Uso: distribuição correta da inicial (competência das varas cíveis/criminal/JEC de Betim); comparar a carga de Betim com as varas empresariais de Contagem e BH para estratégia de foro (CPC art. 46 — foro do domicílio/local da obrigação).',
      ));
    }
  } catch (e) { avisos.push(`betim varas: ${String(e).slice(0, 140)}`); }

  const AREAS: AreaSpec[] = [
    {
      slug: 'jrm-tjmg-betim-familia', titulo: 'Jurimetria municipal — Betim: Família e Sucessões (DataJud)', area: 'familia',
      assunto: 'família sucessões Betim',
      escopo: 'Volume de processos de Família e Sucessões na Comarca de Betim (IBGE 3106705): divórcio, alimentos, guarda, união estável, inventário, interdição, tutela e curatela — por correspondência de padrão no nome da classe (wildcards literais). Composição detalhada nas classes literais.',
      uso: 'Uso: dimensionar a demanda familiar de Betim para oferta de planejamento sucessório e consensos (inventário/arrolamento em cartório quando há acordo e herdeiros capazes — Lei 11.441/2007); alimentos têm execução própria (Lei 5.478 e CPC art. 528).',
      match: { bool: { should: ['*Divórcio*', '*Alimentos*', '*Inventário*', '*União Estável*', '*Interdição*', '*Guarda*', '*Curatela*'].map((p) => ({ wildcard: { 'classe.nome.keyword': p } })), minimum_should_match: 1 } },
      aggs: { classes: { terms: { field: 'classe.nome.keyword', size: 15 } }, assuntos: { terms: { field: 'assuntos.nome.keyword', size: 10 } } },
      rotulos: ['classes', 'assuntos'],
    },
    {
      slug: 'jrm-tjmg-betim-criminal', titulo: 'Jurimetria municipal — Betim: Criminal e Execução Penal (DataJud)', area: 'criminal',
      assunto: 'criminal execução penal Betim',
      escopo: 'Volume de processos criminais na Comarca de Betim (IBGE 3106705): ação penal, execução penal, medidas de segurança e juizados especiais criminais — por padrão no nome da classe. Composição detalhada nas classes literais.',
      uso: 'Uso: defesa técnica em Betim — identificar a concentração de Execução Penal (progressão/livramento, Lei 7.210) versus juizados (Lei 9.099, transação e ANPP) e calibrar a estratégia recursal (Turma Recursal BH/Betim/Contagem para JECrim).',
      match: { bool: { should: ['*Criminal*', '*Penal*', '*Pena*'].map((p) => ({ wildcard: { 'classe.nome.keyword': p } })), minimum_should_match: 1 } },
      aggs: { classes: { terms: { field: 'classe.nome.keyword', size: 15 } }, assuntos: { terms: { field: 'assuntos.nome.keyword', size: 10 } } },
      rotulos: ['classes', 'assuntos'],
    },
    {
      slug: 'jrm-tjmg-betim-jec', titulo: 'Jurimetria municipal — Betim: Juizado Especial Cível (DataJud)', area: 'processual-civil',
      assunto: 'JEC Betim assuntos',
      escopo: 'Processos da classe "Procedimento do Juizado Especial Cível" na Comarca de Betim (IBGE 3106705), com os assuntos mais frequentes e a distribuição por unidade. Complemento do LOTE-012 (JEC), LOTE-022 (Atlas Forense) e do censo por cidade do LOTE-031.',
      uso: 'Uso: pequenas causas de consumo em Betim (polo industrial) — alçada de 40 salários mínimos (Lei 9.099 art. 3º), recursos para a Turma Recursal única de BH/Betim/Contagem (art. 39) e conciliação obrigatória (art. 22).',
      match: { match_phrase: { 'classe.nome': 'Procedimento do Juizado Especial Cível' } },
      aggs: { assuntos: { terms: { field: 'assuntos.nome.keyword', size: 12 } }, varas: { terms: { field: 'orgaoJulgador.nome.keyword', size: 8 } } },
      rotulos: ['assuntos', 'varas'],
    },
    {
      slug: 'jrm-tjmg-betim-execucao-fiscal', titulo: 'Jurimetria municipal — Betim: Execução Fiscal (DataJud)', area: 'tributario',
      assunto: 'execução fiscal Betim assuntos',
      escopo: 'Processos da classe "Execução Fiscal" na Comarca de Betim (IBGE 3106705) com os assuntos mais frequentes (créditos da Fazenda Nacional e municipal aí incluídos conforme o registro) e a distribuição por unidade. Complemento do LOTE-004 e do retrato estadual do LOTE-031.',
      uso: 'Uso: triagem de execuções fiscais em Betim — prescrição quinquenal (CTN art. 174), Súmula 102 STJ (prestação de informações), suspensão por parcelamento (Lei 13.988/2020) e embargos em 30 dias (LEF art. 16).',
      match: { match_phrase: { 'classe.nome': 'Execução Fiscal' } },
      aggs: { assuntos: { terms: { field: 'assuntos.nome.keyword', size: 12 } }, varas: { terms: { field: 'orgaoJulgador.nome.keyword', size: 8 } } },
      rotulos: ['assuntos', 'varas'],
    },
    {
      slug: 'jrm-tjmg-betim-fazenda-publica', titulo: 'Jurimetria municipal — Betim: Fazenda Pública e Mandado de Segurança (DataJud)', area: 'fazenda-publica',
      assunto: 'fazenda pública MS Betim',
      escopo: 'Volume de demandas contra a Fazenda Pública e mandados de segurança na Comarca de Betim (IBGE 3106705): classes por padrão no nome (fazenda pública, MS, improbidade). Composição literal exposta.',
      uso: 'Uso: demandas contra o município de Betim seguem competência da comarca do ente; MS contra atos de oficial de justiça/cartório (Lei 12.016 art. 1º §1º) — atentar às vedações do art. 5º e ao prazo de 120 dias.',
      match: { bool: { should: ['*Fazenda Pública*', '*Mandado de Segurança*', '*Improbidade*'].map((p) => ({ wildcard: { 'classe.nome.keyword': p } })), minimum_should_match: 1 } },
      aggs: { classes: { terms: { field: 'classe.nome.keyword', size: 10 } } },
      rotulos: ['classes'],
    },
    {
      slug: 'jrm-tjmg-betim-empresarial', titulo: 'Jurimetria municipal — Betim: Empresarial, RJ e Falência (DataJud)', area: 'empresarial',
      assunto: 'RJ falência Betim',
      escopo: 'Volume de processos empresariais na Comarca de Betim (IBGE 3106705): Recuperação Judicial, Falência e classes empresariais por padrão no nome da classe. Betim abriga varas empresariais reconhecidas no LOTE-031 (RJ por comarca).',
      uso: 'Uso: credores de empresas de Betim — habilitação de crédito (Lei 11.101 arts. 7º-9º), impugnações e assembleia; verificar a vara empresarial competente conforme o principal estabelecimento (art. 3º).',
      match: { bool: { should: ['*Recuperação Judicial*', '*Falência*', '*Empresarial*'].map((p) => ({ wildcard: { 'classe.nome.keyword': p } })), minimum_should_match: 1 } },
      aggs: { classes: { terms: { field: 'classe.nome.keyword', size: 10 } } },
      rotulos: ['classes'],
    },
    {
      slug: 'jrm-tjmg-betim-infancia', titulo: 'Jurimetria municipal — Betim: Infância e Juventude (DataJud)', area: 'infancia-juventude',
      assunto: 'infância juventude adoção Betim',
      escopo: 'Volume de processos de Infância e Juventude na Comarca de Betim (IBGE 3106705): adoção, guarda, atos infracionais e outras classes da ECA por padrão no nome da classe. Composição literal exposta.',
      uso: 'Uso: atuação infantojuvenil em Betim — competência da vara especializada ou acumulada conforme a comarca (ECA art. 148); adoção segue habilitação no Cadastro Nacional (Lei 12.010/2009).',
      match: { bool: { should: ['*Infância*', '*Juventude*', '*Adoção*'].map((p) => ({ wildcard: { 'classe.nome.keyword': p } })), minimum_should_match: 1 } },
      aggs: { classes: { terms: { field: 'classe.nome.keyword', size: 10 } } },
      rotulos: ['classes'],
    },
    {
      slug: 'jrm-tjmg-betim-cartas-execucoes', titulo: 'Jurimetria municipal — Betim: Cartas Precatórias, Cumprimento de Sentença e Execuções Cíveis (DataJud)', area: 'processual-civil',
      assunto: 'precatórias cumprimento execuções Betim',
      escopo: 'Volume de cartas precatórias, cumprimentos de sentença e execuções de título extrajudicial na Comarca de Betim (IBGE 3106705) — o fluxo cooperativo entre comarcas e a fase de satisfação do julgado. Composição literal por classe.',
      uso: 'Uso: coordenação de atos cooperativos (CPC arts. 260-263) e defesa na fase de cumprimento (impugnação 15 dias — art. 525; embargos à execução) com verificação da vara destinatária da precatória.',
      match: { bool: { should: ['*Carta Precatória*', '*Cumprimento de sentença*', '*Execução de Título*'].map((p) => ({ wildcard: { 'classe.nome.keyword': p } })), minimum_should_match: 1 } },
      aggs: { classes: { terms: { field: 'classe.nome.keyword', size: 10 } } },
      rotulos: ['classes'],
    },
    {
      slug: 'jrm-tjmg-betim-civel-comum', titulo: 'Jurimetria municipal — Betim: Cível Comum — Procedimento Comum, Monitória, Usucapião (DataJud)', area: 'processual-civil',
      assunto: 'cível comum Betim monitória usucapião',
      escopo: 'Volume de procedimentos comuns, ações monitórias, cautelares, consignações em pagamento e usucapiões na Comarca de Betim (IBGE 3106705) — o núcleo cível de amplo valor da comarca. Composição literal por classe e assuntos mais frequentes.',
      uso: 'Uso: estratégia cível em Betim — monitória para títulos sem força executiva (CPC art. 700), usucapião extrajudicial quando o cartório for invocado (art. 1.071/Lei 11.977), consignação e tutela de urgência.',
      match: { bool: { should: ['*Procedimento Comum*', '*Monitória*', '*Cautelar*', '*Consignação*', '*Usucapião*'].map((p) => ({ wildcard: { 'classe.nome.keyword': p } })), minimum_should_match: 1 } },
      aggs: { classes: { terms: { field: 'classe.nome.keyword', size: 12 } }, assuntos: { terms: { field: 'assuntos.nome.keyword', size: 10 } } },
      rotulos: ['classes', 'assuntos'],
    },
  ];

  for (const spec of AREAS) await coletarArea(spec, docs, avisos);

  const rel = await ingestLote(
    'LOTE-034',
    'BETIM PROFUNDO — jurisprudência/jurimetria REAL por área do direito via API Pública DataJud: carga por vara/unidade + pulso 2026; Família e Sucessões (wildcards divórcio/alimentos/inventário/guarda); Criminal e Execução Penal; Juizado Especial Cível (assuntos + varas); Execução Fiscal (assuntos + varas); Fazenda Pública e MS; Empresarial RJ/Falência; Infância e Juventude; Cartas Precatórias/Cumprimento/Execuções Cíveis; Cível Comum (comum/monitória/usucapião/consignação). Recorte IBGE 3106705; TODOS os números capturados AO VIVO (aggregations size:0, LGPD OK); query JSON de reprodução embutida; ANTI-INVENÇÃO: doc só nasce se a consulta real retornar dados.',
    docs.map((d) => ({ ...d, lote: 'LOTE-034' })),
    [`${URL_FONTE} (API Pública DataJud/CNJ — índice api_publica_tjmg; consultas ao vivo ${DATA_CONSULTA}; chave via env DATAJUD_API_KEY — não versionada)`],
  );

  console.log('=== RELATÓRIO LOTE-034 ===');
  console.log(JSON.stringify(rel, null, 2));
  console.log(`=== RESUMO ===\nLOTE-034: criados=${rel.criados} atualizados=${rel.atualizados} rejeitados=${rel.rejeitados} duplicatasEvitadas=${rel.duplicatasEvitadas}`);
  for (const a of [...(rel.avisos ?? []), ...avisos]) console.log(`  AVISO: ${a}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('ERRO NA INGESTÃO:', e);
    process.exit(1);
  });
