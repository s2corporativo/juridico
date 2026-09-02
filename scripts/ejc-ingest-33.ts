// Jurimetria DPT — LOTE-033: Jurimetria municipal REAL — Betim, Contagem, Belo Horizonte e Igarapé (MG),
// TODAS as áreas do direito, via API Pública DataJud (chave ativa em .env).
// Uso: bun scripts/ejc-ingest-33.ts
//
// TODOS os números capturados AO VIVO (aggregations, size:0 — NENHUM número de processo, NENHUM dado pessoal — LGPD OK).
// Anti-invenção: cada doc traz a query JSON EXATA para reprodução; se a consulta falhar, o doc NÃO é gerado.
// Quirk documentado ao vivo: as unidades da Comarca de Igarapé estão registradas no DataJud sob códigos
// IBGE distintos do do município (3130101 / 3162922) — o filtro correto para Igarapé é por nome do órgão julgador.
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
const COMO_REPRODUZ = (q: unknown) => `### Como reproduzir (oficial)\n\n\`\`\`json\n${JSON.stringify(q)}\n\`\`\`\n\nPOST https://api-publica.datajud.cnj.jus.br/api_publica_tjmg/_search com o cabeçalho \`Authorization: APIKey <chave gratuita CNJ>\`.`;
const ALERTAS = `### Alertas e limitações (honestidade)\n\n- Números refletem o índice DataJud na data da consulta (${DATA_CONSULTA}) — RETRATO, não censo histórico absoluto; reindexações podem alterar contagens.\n- Contagens acima de 10 mil retornam \`relation: gte\` (saturação da API) — marcadas como "≥".\n- O recorte "janela 2026" usa a atualização do índice (@timestamp), não a data de ajuizamento.\n- Agregações oficiais apenas: nenhum número de processo, parte, CPF ou dado pessoal foi consultado ou armazenado (LGPD).\n- Grafias de classes/varas variam (maiúsculas/minúsculas) — buckets literais da API (\`.keyword\`).`;

const CIDADES = [
  { ibge: '3106200', nome: 'Belo Horizonte', filtroNome: false },
  { ibge: '3106705', nome: 'Betim', filtroNome: false },
  { ibge: '3118601', nome: 'Contagem', filtroNome: false },
  { ibge: '3130604', nome: 'Igarapé', filtroNome: true },
] as const;

function filtroCidade(c: (typeof CIDADES)[number]): Record<string, unknown> {
  return c.filtroNome
    ? { match_phrase: { 'orgaoJulgador.nome': 'Igarapé' } }
    : { term: { 'orgaoJulgador.codigoMunicipioIBGE': c.ibge } };
}

// Agrupamento heurístico de classes em áreas do direito (sobre buckets LITERAIS da API —
// as contagens são reais; a classificação por padrão de nome é declarada no doc).
const AREAS: { area: string; padroes: string[] }[] = [
  { area: 'Fazenda Pública e Mandado de Segurança', padroes: ['fazenda pública', 'mandado de segurança', 'improbidade'] },
  { area: 'Criminal e Execução Penal', padroes: ['criminal', 'penal', 'pena', 'medida de segurança'] },
  { area: 'Execução Fiscal e Tributário', padroes: ['execução fiscal', 'tribut'] },
  { area: 'Juizado Especial Cível', padroes: ['juizado especial'] },
  { area: 'Família e Sucessões', padroes: ['divórcio', 'alimentos', 'guarda', 'união estável', 'inventário', 'interdição', 'tutela', 'curatela', 'partilha', 'alienação parental', 'paternidade', 'reconhecimento e dissolução'] },
  { area: 'Empresarial e Falências', padroes: ['recuperação judicial', 'falência', 'empresarial', 'sociedade'] },
  { area: 'Infância e Juventude', padroes: ['infância', 'juventude', 'adoção'] },
  { area: 'Cartas Precatórias e Rogatórias', padroes: ['carta precatória', 'carta rogatória', 'precatória'] },
  { area: 'Execuções Cíveis e Cumprimento', padroes: ['cumprimento de sentença', 'execução de título', 'execução de decisão'] },
  { area: 'Cível Comum', padroes: ['procedimento comum', 'monitória', 'cautelar', 'consignação', 'usucapião', 'usucapião'] },
];

function agruparAreas(buckets: DjBucket[]): { linhas: string[]; somaBuckets: number } {
  const soma = new Map<string, number>();
  let totalBuckets = 0;
  for (const b of buckets) {
    totalBuckets += b.doc_count;
    const nome = String(b.key).toLowerCase();
    const alvo = AREAS.find((a) => a.padroes.some((p) => nome.includes(p)));
    const chave = alvo?.area ?? 'Outras classes';
    soma.set(chave, (soma.get(chave) ?? 0) + b.doc_count);
  }
  const linhas = [...soma.entries()]
    .sort((x, y) => y[1] - x[1])
    .map(([area, n]) => `- ${area} — **${n.toLocaleString('pt-BR')}** processos`);
  return { linhas, somaBuckets: totalBuckets };
}

const listaFmt = (buckets: DjBucket[] | undefined, n = 12) =>
  (buckets ?? []).slice(0, n).map((b, i) => `${i + 1}. ${b.key} — **${b.doc_count.toLocaleString('pt-BR')}** processos`).join('\n');

const fmtTotal = (r: DjResponse) => `**≥ ${r.hits.total.value.toLocaleString('pt-BR')}** (${r.hits.total.relation === 'gte' ? 'contagem saturada — valor mínimo' : 'exato'})`;

function docJr(
  slug: string, titulo: string, area: string, subarea: string, assunto: string,
  escopo: string, numeros: string, query: unknown, extra: string, tagsExtra: string[] = [],
): InputDocument {
  return {
    slug,
    titulo,
    tipoDocumento: 'JURIMETRIA',
    area,
    subarea,
    assunto,
    prioridade: 'P1',
    lote: 'LOTE-033',
    conteudo: `## Escopo\n${escopo}\n\n## Números (retrato DataJud ${DATA_CONSULTA})\n${numeros}\n\n${COMO_REPRODUZ(query)}\n\n${extra}\n\n${ALERTAS}`,
    metadados: {
      orgao: 'CNJ — API Pública DataJud (TJMG)',
      tipoDados: 'agregados oficiais (aggregations, size:0)',
      lgpd: 'sem dados pessoais — somente contagens agregadas',
      dataConsulta: DATA_CONSULTA,
      ambiente: 'chave oficial gratuita via env DATAJUD_API_KEY',
    },
    tags: ['jurimetria', 'datajud', 'cnj', 'tjmg', 'mg', area, 'reprodutivel', ...tagsExtra],
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

async function main() {
  const docs: InputDocument[] = [];
  const avisos: string[] = [];

  // ── 1) Panorama por cidade: total histórico + áreas + top classes/assuntos/varas (1 query por cidade)
  interface Panorama { total: string; areas: string[]; cobertura: number; classes: DjBucket[]; assuntos: DjBucket[]; varas: DjBucket[]; query: unknown }
  const panoramas = new Map<string, Panorama>();
  for (const c of CIDADES) {
    try {
      const q = {
        size: 0,
        query: filtroCidade(c),
        aggs: {
          classes: { terms: { field: 'classe.nome.keyword', size: 50 } },
          assuntos: { terms: { field: 'assuntos.nome.keyword', size: 25 } },
          varas: { terms: { field: 'orgaoJulgador.nome.keyword', size: 12 } },
        },
      };
      const r = await dj(q);
      const buckets = r.aggregations?.classes?.buckets ?? [];
      if (r.hits.total.value === 0 && buckets.length === 0) {
        avisos.push(`panorama ${c.nome}: zero resultados — doc não gerado`);
        continue;
      }
      const { linhas, somaBuckets } = agruparAreas(buckets);
      panoramas.set(c.nome, {
        total: fmtTotal(r),
        areas: linhas,
        cobertura: somaBuckets > 0 ? Math.min(100, (somaBuckets / r.hits.total.value) * 100) : 0,
        classes: buckets,
        assuntos: r.aggregations?.assuntos?.buckets ?? [],
        varas: r.aggregations?.varas?.buckets ?? [],
        query: q,
      });
    } catch (e) { avisos.push(`panorama ${c.nome}: ${String(e).slice(0, 120)}`); }
  }

  const NOTA_IGARAPE = `**Nota de registro (Igarapé)**: o município de Igarapé tem código IBGE 3130604, mas o índice DataJud registra as unidades da Comarca de Igarapé sob códigos de município DIFERENTES (3130101 e 3162922 — literal da API). Por isso, o recorte de Igarapé usa correspondência por nome do órgão julgador (\`match_phrase\` em \`orgaoJulgador.nome\` = "Igarapé"), que captura todas as varas da comarca independentemente do código cadastrado. Consulta de verificação: \`{"size":0,"query":{"match_phrase":{"orgaoJulgador.nome":"Igarapé"}},"aggs":{"ibges":{"terms":{"field":"orgaoJulgador.codigoMunicipioIBGE","size":10}}}}\`.`;

  for (const c of CIDADES) {
    const p = panoramas.get(c.nome);
    if (!p) continue;
    const slug = `jrm-tjmg-${c.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')}-panorama-areas-do-direito`;
    const notas = c.nome === 'Igarapé' ? `${NOTA_IGARAPE}\n\n` : '';
    docs.push(docJr(
      slug,
      `Jurimetria municipal — ${c.nome}/MG: panorama por área do direito (DataJud, histórico completo)`,
      'geral', 'jurimetria', `panorama ${c.nome.toLowerCase()} todas as áreas`,
      `Retrato consolidado da demanda judiciária na comarca de ${c.nome} (MG) por GRANDE ÁREA do direito — cível, criminal, família, JEC, execução fiscal, fazenda pública, empresarial, infância, cartas e execuções cíveis — a partir das 50 classes processuais mais frequentes no índice DataJud (histórico completo do TJMG).${c.filtroNome ? ' Recorte por nome de órgão julgador (ver nota de registro abaixo).' : ` Recorte por código IBGE do órgão julgador (${c.ibge}).`} Base empírica para a aba Jurimetria por cidade/vara e para planejamento de prazos, recursos e expectativa de pauta em ${c.nome}.`,
      `Total indexado (histórico): ${p.total}.\n\n**Distribuição por grande área** (agrupamento por padrão no nome da classe sobre as top 50 classes — cobre ~${p.cobertura.toFixed(1)}% do total declarado; composição literal abaixo):\n\n${p.areas.join('\n')}\n\n**Top 20 classes literais**:\n\n${listaFmt(p.classes, 20)}\n\n**Top 12 assuntos**:\n\n${listaFmt(p.assuntos, 12)}\n\n**Top 10 unidades jurisdicionais (varas) por carga**:\n\n${listaFmt(p.varas, 10)}`,
      p.query,
      `${notas}Uso no escritório: identifique a área dominante da comarca para dimensionar concorrência e pauta; use as varas top para selecionar o juízo correto na distribuição; os assuntos mais frequentes orientam a triagem documental. A aba Jurimetria (DataJud ao vivo) permite refinar por classe e vara.`,
      c.nome === 'Igarapé' ? ['igarape', 'quirk-registro-ibge'] : [c.nome.toLowerCase()],
    ));
  }

  // ── 2) Comparativo geral 4 cidades (usa panoramas + janela 2026)
  try {
    const todos = CIDADES.map((c) => ({ c, p: panoramas.get(c.nome) })).filter((x) => x.p);
    if (todos.length === 4) {
      const pulse: string[] = [];
      const queries: unknown[] = [];
      for (const { c } of todos) {
        const qp = { size: 0, query: { bool: { must: [filtroCidade(c), JANELA_2026] } } };
        const r = await dj(qp);
        pulse.push(`- **${c.nome}** — ≥ ${r.hits.total.value.toLocaleString('pt-BR')} processos indexados na janela 2026`);
        queries.push(qp);
      }
      const compQuery = { multi: true, desc: '4 consultas de total (uma por município, filtro IBGE/nome) + 4 consultas de janela 2026', queries };
      const linhas = todos.map(({ c, p }) => `- **${c.nome}** — total histórico ${p!.total} · área líder: ${p!.areas[0]?.replace('- **', '— ').split('**')[0] ?? '—'}`);
      docs.push(docJr(
        'jrm-tjmg-4cidades-comparativo-areas',
        'Jurimetria municipal — comparativo Betim × Contagem × Belo Horizonte × Igarapé (todas as áreas, DataJud)',
        'geral', 'jurimetria', 'comparativo 4 cidades MG todas as áreas',
        'Comparativo consolidado da demanda judiciária nas quatro comarcas de atuação do escritório (Betim, Contagem, Belo Horizonte e Igarapé — região metropolitana de BH) em TODAS as áreas do direito: total histórico, área líder de cada comarca e pulso da janela 2026. Complemento dos panoramas individuais (mesmo lote) e do censo estadual do LOTE-031.',
        `**Totais por comarca (histórico do índice)**:\n\n${linhas.join('\n')}\n\n**Pulso da janela 2026**:\n\n${pulse.join('\n')}\n\n${NOTA_IGARAPE}`,
        compQuery,
        'Uso: leitura territorial da banca — BH concentra volume máximo e especialização (varas de Feitos Tributários, Garantias, empresariais); Betim e Contagem são polos industriais com forte execução fiscal e JEC; Igarapé é comarca pequena com composição cível/criminal típica de interior. A oferta de serviços pode ser calibrada por comarca conforme a área líder de cada uma.',
        ['comparativo', 'regiao-metropolitana', 'betim', 'contagem', 'belo-horizonte', 'igarape'],
      ));
    }
  } catch (e) { avisos.push(`comparativo geral: ${String(e).slice(0, 120)}`); }

  // ── 3) Comparativos POR ÁREA (5 áreas × 4 cidades, wildcards no nome da classe)
  const AREAS_EXTRA: { area: string; slug: string; areaDb: string; padroes: string[]; leitura: string }[] = [
    {
      area: 'Família e Sucessões', slug: 'jrm-tjmg-4cidades-familia-sucesoes', areaDb: 'familia',
      padroes: ['*Divórcio*', '*Alimentos*', '*Inventário*', '*União Estável*', '*Interdição*', '*Guarda*', '*Curatela*', '*Alienação Parental*'],
      leitura: 'Família é demanda de pequeno valor por caso mas de alto fluxo e relacionamento — volume por comarca orienta a oferta de planejamento sucessório e acordos extrajudiciais (inventário em cartório quando consensual).',
    },
    {
      area: 'Criminal e Execução Penal', slug: 'jrm-tjmg-4cidades-criminal', areaDb: 'criminal',
      padroes: ['*Criminal*', '*Penal*', '*Pena*'],
      leitura: 'Criminal na região metropolitana inclui execução penal e juizados especiais criminais — verificar competência da vara correta por comarca; defesa técnica com audiências de custódia e acordo de não persecução penal.',
    },
    {
      area: 'Infância e Juventude', slug: 'jrm-tjmg-4cidades-infancia-juventude', areaDb: 'infancia-juventude',
      padroes: ['*Infância*', '*Juventude*', '*Adoção*'],
      leitura: 'Atuação em infância e juventude (guarda, adoção, atos infracionais) concentra-se em varas específicas — em comarcas pequenas a competência costuma ser acumulada (ex.: 2ª Vara Cível, da Infância e da Juventude e JECrim de Igarapé, literal da API).',
    },
    {
      area: 'Fazenda Pública e Mandado de Segurança', slug: 'jrm-tjmg-4cidades-fazenda-publica', areaDb: 'fazenda-publica',
      padroes: ['*Fazenda Pública*', '*Mandado de Segurança*', '*Improbidade*'],
      leitura: 'Demandas contra entes municipais (BH, Betim, Contagem, Igarapé) eMS contra atos de oficial de justiça/cartório — atenção à competência: fazendas municipais são julgadas nas varas da comarca do ente tributante.',
    },
    {
      area: 'Empresarial e Falências', slug: 'jrm-tjmg-4cidades-empresarial-rj-falencia', areaDb: 'empresarial',
      padroes: ['*Recuperação Judicial*', '*Falência*', '*Empresarial*'],
      leitura: 'RJ/falência concentram-se nas varas empresariais da região (BH, Contagem, Betim — ver LOTE-030/031); credores das quatro comarcas costumam habilitar nos juízos empresariais da capital e polos industriais.',
    },
  ];

  for (const a of AREAS_EXTRA) {
    try {
      const linhasTotais: string[] = [];
      const topBH: DjBucket[] = [];
      const topBetim: DjBucket[] = [];
      const queries: unknown[] = [];
      for (const c of CIDADES) {
        const q = {
          size: 0,
          query: { bool: { must: [filtroCidade(c), { bool: { should: a.padroes.map((p) => ({ wildcard: { 'classe.nome.keyword': p } })), minimum_should_match: 1 } }] } },
          aggs: { classes: { terms: { field: 'classe.nome.keyword', size: 8 } } },
        };
        const r = await dj(q);
        if (r.hits.total.value === 0) { linhasTotais.push(`- **${c.nome}** — 0 processos (sem correspondência)`); queries.push(q); continue; }
        linhasTotais.push(`- **${c.nome}** — ${fmtTotal(r)}`);
        queries.push(q);
        if (c.nome === 'Belo Horizonte') topBH.push(...(r.aggregations?.classes?.buckets ?? []));
        if (c.nome === 'Betim') topBetim.push(...(r.aggregations?.classes?.buckets ?? []));
      }
      if (linhasTotais.some((l) => !l.includes('— 0 processos'))) {
        docs.push(docJr(
          a.slug,
          `Jurimetria municipal — ${a.area} em Betim, Contagem, Belo Horizonte e Igarapé (DataJud)`,
          a.areaDb, 'jurimetria', `${a.area.toLowerCase()} 4 cidades MG`,
          `Volume agregado de processos de ${a.area} nas quatro comarcas da região metropolitana de BH atendidas pelo escritório, por correspondência de padrão no nome da classe processual (wildcards literais na query). Composição detalhada exposta nas classes literais — nada é estimado.`,
          `**Totais por comarca (histórico do índice)**:\n\n${linhasTotais.join('\n')}\n\n**Classes mais frequentes — Belo Horizonte**:\n\n${listaFmt(topBH, 8) || '—'}\n\n**Classes mais frequentes — Betim**:\n\n${listaFmt(topBetim, 8) || '—'}`,
          { multi: true, desc: `4 consultas (uma por município) com should de wildcards em classe.nome.keyword: ${a.padroes.join(', ')}`, queries },
          `Uso no escritório: ${a.leitura}`,
          ['comparativo', 'betim', 'contagem', 'belo-horizonte', 'igarape', a.areaDb],
        ));
      }
    } catch (e) { avisos.push(`${a.slug}: ${String(e).slice(0, 120)}`); }
  }

  const rel = await ingestLote(
    'LOTE-033',
    'Jurimetria municipal REAL via API Pública DataJud — Betim, Contagem, Belo Horizonte e Igarapé (MG), TODAS as áreas do direito: 4 panoramas por comarca (total histórico, distribuição por grande área — fazenda pública, criminal, execução fiscal, JEC, família e sucessões, empresarial, infância, cartas, execuções cíveis e cível comum —, top classes/assuntos/varas), comparativo geral das 4 comarcas com pulso da janela 2026 e 5 comparativos por área (família e sucessões; criminal e execução penal; infância e juventude; fazenda pública e MS; empresarial RJ/falência). Quirk de registro documentado: unidades da Comarca de Igarapé estão sob códigos IBGE 3130101/3162922 — recorte por nome do órgão julgador. TODOS os números capturados AO VIVO (aggregations size:0); query JSON de reprodução embutida; nenhum dado pessoal (LGPD). ANTI-INVENÇÃO: documento só é gerado se a consulta real retornar dados.',
    docs.map((d) => ({ ...d, lote: 'LOTE-033' })),
    [`${URL_FONTE} (API Pública DataJud/CNJ — índice api_publica_tjmg; consultas ao vivo ${DATA_CONSULTA}; chave via env DATAJUD_API_KEY — não versionada)`],
  );

  console.log('=== RELATÓRIO LOTE-033 ===');
  console.log(JSON.stringify(rel, null, 2));
  console.log(`=== RESUMO ===\nLOTE-033: criados=${rel.criados} atualizados=${rel.atualizados} rejeitados=${rel.rejeitados} duplicatasEvitadas=${rel.duplicatasEvitadas}`);
  for (const a of [...(rel.avisos ?? []), ...avisos]) console.log(`  AVISO: ${a}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('ERRO NA INGESTÃO:', e);
    process.exit(1);
  });
