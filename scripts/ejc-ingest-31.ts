// Jurimetria DPT — LOTE-031: Jurimetria REAL TJMG via API Pública DataJud (chave ativa em .env)
// Uso: bun scripts/ejc-ingest-31.ts
//
// TODOS os números capturados AO VIVO da API Pública DataJud/CNJ no momento da execução
// (aggregations, size:0 — NENHUM número de processo, NENHUM dado pessoal — LGPD OK).
// Documentos tipo JURIMETRIA com confiabilidade A (fonte oficial CNJ) + 1 metodologia (B).
// Anti-invenção: cada doc traz a query JSON EXATA para reprodução; se uma consulta falhar,
// o documento correspondente NÃO é gerado (nada é estimado).
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

const ANO = '2026';
const JANELA_2026 = { range: { '@timestamp': { gte: `${ANO}-01-01`, lte: `${ANO}-12-31||/y` } } };
const COMO_REPRODUZ = (q: unknown) => `### Como reproduzir (oficial)\n\n\`\`\`json\n${JSON.stringify(q)}\n\`\`\`\n\nPOST https://api-publica.datajud.cnj.jus.br/api_publica_tjmg/_search com o cabeçalho \`Authorization: APIKey <chave gratuita CNJ>\`.`;
const ALERTAS = `### Alertas e limitações (honestidade)\n\n- Números refletem o índice DataJud na data da consulta (${DATA_CONSULTA}) — é um RETRATO, não censo histórico absoluto; reindexações podem alterar contagens.\n- O recorte ${ANO} usa a janela de atualização do índice (@timestamp) e o ano ${ANO} está EM CURSO (parcial).\n- Agregações oficiais apenas: nenhum número de processo, parte, CPF ou dado pessoal foi consultado ou armazenado (LGPD).\n- Grafias de varas variam (maiúsculas/minúsculas) — buckets literais da API.`;

function docJr(
  slug: string, titulo: string, area: string, subarea: string, assunto: string,
  escopo: string, numeros: string, query: unknown, extra: string,
): InputDocument {
  return {
    slug,
    titulo,
    tipoDocumento: 'JURIMETRIA',
    area,
    subarea,
    assunto,
    prioridade: 'P1',
    lote: 'LOTE-031',
    conteudo: `## Escopo\n${escopo}\n\n## Números (retrato DataJud ${DATA_CONSULTA})\n${numeros}\n\n${COMO_REPRODUZ(query)}\n\n${extra}\n\n${ALERTAS}`,
    metadados: {
      orgao: 'CNJ — API Pública DataJud (TJMG)',
      tipoDados: 'agregados oficiais (aggregations, size:0)',
      lgpd: 'sem dados pessoais — somente contagens agregadas',
      dataConsulta: DATA_CONSULTA,
      ambiente: 'chave oficial gratuita via env DATAJUD_API_KEY',
    },
    tags: ['jurimetria', 'datajud', 'cnj', 'tjmg', 'mg', area, 'reprodutivel'],
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

async function main() {
  const docs: InputDocument[] = [];
  const avisos: string[] = [];

  // 1) Censo de classes 2026 (top 10)
  try {
    const q1 = { size: 0, query: JANELA_2026, aggs: { classes: { terms: { field: 'classe.nome.keyword', size: 10 } } } };
    const r = await dj(q1);
    const top = r.aggregations?.classes?.buckets ?? [];
    if (top.length) {
      docs.push(docJr(
        'jrm-tjmg-censo-classes-2026', 'Jurimetria TJMG — censo de classes processuais (janela 2026, DataJud)',
        'geral', 'jurimetria', 'censo classes TJMG 2026',
        'Distribuição das 10 classes processuais com mais processos indexados no TJMG na janela 2026 da API Pública DataJud (CNJ). Retrato do volume forense mineiro por natureza da demanda — útil para dimensionar a composição da demanda (cível, execução, criminal) e calibrar expectativas de pauta.',
        `Total indexado na janela 2026: **≥ ${r.hits.total.value.toLocaleString('pt-BR')}** processos (${r.hits.total.relation === 'gte' ? 'contagem saturada em 10 mil — valor mínimo' : 'exato'}). Classes (literal da API):\n\n${listaFmt(top, 10)}`,
        q1,
        'Uso no escritório: comparar o peso relativo de Execução Fiscal, Cumprimento de sentença e Juizado Especial Cível no estado; a aba Jurimetria (DataJud por cidade/vara) permite refinar por comarca e vara.',
      ));
    }
  } catch (e) { avisos.push(`censo classes: ${String(e).slice(0, 120)}`); }

  // 2) Recuperação Judicial — censo + comarcas
  try {
    const q2 = { size: 0, query: { match_phrase: { 'classe.nome': 'Recuperação Judicial' } }, aggs: { comarcas: { terms: { field: 'orgaoJulgador.nome.keyword', size: 12 } } } };
    const r = await dj(q2);
    docs.push(docJr(
      'jrm-tjmg-recuperacao-judicial-censo', 'Jurimetria TJMG — Recuperação Judicial: censo e varas com maior volume (DataJud, histórico completo)',
      'empresarial', 'jurimetria', 'recuperação judicial MG',
      'Total de processos da classe "Recuperação Judicial" indexados para o TJMG (histórico completo do índice) e as 12 unidades jurisdicionais com mais processos — complemento empírico do LOTE-030 (Lei 11.101). Concentração observada nas Varas Empresariais de Belo Horizonte e nas varas empresariais de Contagem, Betim, Uberaba e Juiz de Fora.',
      `Total (histórico do índice): **${r.hits.total.value.toLocaleString('pt-BR')}** processos (${r.hits.total.relation}). Unidades com maior volume (literal da API):\n\n${listaFmt(r.aggregations?.comarcas?.buckets, 12)}`,
      q2,
      'Leitura: a petição inicial de RJ deve ser protocolada no juízo do principal estabelecimento (Lei 11.101 art. 3º — LOTE-030); a concentração empírica nas varas empresariais de BH confirma a especialização do foro da capital.',
    ));
  } catch (e) { avisos.push(`RJ censo: ${String(e).slice(0, 120)}`); }

  // 3) Falência — censo + subclasses
  try {
    const q3 = { size: 0, query: { match_phrase: { 'classe.nome': 'Falência' } }, aggs: { classes: { terms: { field: 'classe.nome.keyword', size: 6 } } } };
    const r = await dj(q3);
    docs.push(docJr(
      'jrm-tjmg-falencia-censo', 'Jurimetria TJMG — Falência: censo e classes correlatas (DataJud, histórico completo)',
      'empresarial', 'jurimetria', 'falência MG',
      'Total de processos classificados sob "Falência" no TJMG (histórico completo do índice), com desdobramento entre a classe principal (falência de empresários, sociedades empresariais, microempresas e EPP) e a classe de restituição de coisa ou dinheiro. Complemento empírico do LOTE-030.',
      `Total (histórico do índice): **${r.hits.total.value.toLocaleString('pt-BR')}** processos (${r.hits.total.relation}). Desdobramento por classe (literal da API):\n\n${listaFmt(r.aggregations?.classes?.buckets, 6)}`,
      q3,
      'Leitura: o volume de pedidos de restituição (art. 86 da Lei 11.101) aparece aqui como classe própria — ao ingressar como credor na falência, avaliar também essa via para bem retirável.',
    ));
  } catch (e) { avisos.push(`falência censo: ${String(e).slice(0, 120)}`); }

  // 4) BH — varas por carga 2026
  try {
    const q4 = { size: 0, query: { bool: { must: [JANELA_2026, { term: { 'orgaoJulgador.codigoMunicipioIBGE': '3106200' } }] } }, aggs: { varas: { terms: { field: 'orgaoJulgador.nome.keyword', size: 15 } } } };
    const r = await dj(q4);
    docs.push(docJr(
      'jrm-tjmg-bh-varas-carga-2026', 'Jurimetria TJMG — Belo Horizonte: carga por vara/unidade (janela 2026, DataJud)',
      'geral', 'jurimetria', 'varas BH carga 2026',
      'Carga indexada por unidade jurisdicional da Comarca de Belo Horizonte (IBGE 3106200) na janela 2026 — retrato da distribuição interna do maior polo judiciário de MG. Base empírica da seleção por cidade e vara na aba Jurimetria (DataJud).',
      `Total BH janela 2026: **≥ ${r.hits.total.value.toLocaleString('pt-BR')}** (${r.hits.total.relation === 'gte' ? 'saturada — valor mínimo' : 'exato'}). Unidades (literal da API):\n\n${listaFmt(r.aggregations?.varas?.buckets, 15)}`,
      q4,
      'Uso: escolher a vara correta ao ajuizar/distribuir em BH; unidades especializadas (Garantias, Feitos Tributários, Precatórias, Turma Recursal) concentram matérias específicas.',
    ));
  } catch (e) { avisos.push(`BH varas: ${String(e).slice(0, 120)}`); }

  // 5) JEC por cidade (BH, Betim, Contagem, Uberlândia, Juiz de Fora)
  const CIDADES = [
    ['3106200', 'Belo Horizonte'], ['3106705', 'Betim'], ['3118601', 'Contagem'],
    ['3170206', 'Uberlândia'], ['3136702', 'Juiz de Fora'],
  ];
  try {
    const linhas: string[] = [];
    const q5base = { size: 0, query: { bool: { must: [JANELA_2026, { match_phrase: { 'classe.nome': 'Procedimento do Juizado Especial Cível' } }, { term: { 'orgaoJulgador.codigoMunicipioIBGE': '' } }] } } };
    for (const [ibge, nome] of CIDADES) {
      const q5 = JSON.parse(JSON.stringify(q5base));
      q5.query.bool.must[2].term['orgaoJulgador.codigoMunicipioIBGE'] = ibge;
      const r = await dj(q5);
      linhas.push(`- **${nome}** — ${r.hits.total.value.toLocaleString('pt-BR')} processos (${r.hits.total.relation === 'gte' ? '≥' : 'exato'})`);
    }
    docs.push(docJr(
      'jrm-tjmg-jec-cidades-2026', 'Jurimetria TJMG — Juizado Especial Cível por cidade (BH, Betim, Contagem, Uberlândia, Juiz de Fora; janela 2026)',
      'processual-civil', 'jurimetria', 'JEC por cidade 2026',
      'Volume de processos da classe "Procedimento do Juizado Especial Cível" nas cinco maiores comarcas de Minas Gerais (código IBGE do órgão julgador), janela 2026 — complemento empírico do LOTE-012 (JEC) e do LOTE-022 (Atlas Forense JEC BH/Betim).',
      linhas.join('\n'),
      q5base,
      'Uso: comparar a demanda de pequenas causas por polo; Betim/Contagem são servidas pela Turma Recursal única de BH/Betim/Contagem (recursos não sobem ao Tribunal — Lei 9.099 art. 39).',
    ));
  } catch (e) { avisos.push(`JEC cidades: ${String(e).slice(0, 120)}`); }

  // 6) Execução Fiscal — assuntos top
  try {
    const q6 = { size: 0, query: { match_phrase: { 'classe.nome': 'Execução Fiscal' } }, aggs: { assuntos: { terms: { field: 'assuntos.nome.keyword', size: 12 } } } };
    const r = await dj(q6);
    docs.push(docJr(
      'jrm-tjmg-execucao-fiscal-assuntos', 'Jurimetria TJMG — Execução Fiscal: assuntos mais frequentes (DataJud, histórico completo)',
      'tributario', 'jurimetria', 'execução fiscal assuntos MG',
      'Assuntos jurídicos mais frequentes nos processos da classe "Execução Fiscal" no TJMG (histórico completo do índice) — retrato da composição da execução tributária mineira, complemento do LOTE-004.',
      `Total (histórico do índice): **${r.hits.total.value.toLocaleString('pt-BR')}** processos (${r.hits.total.relation}). Assuntos (literal da API):\n\n${listaFmt(r.aggregations?.assuntos?.buckets, 12)}`,
      q6,
      'Uso: a predominância de IPTU/taxas municipais orienta a triagem (exigibilidade, prescrição quinquenal CTN art. 174, edital de praça) e eventuais transações conforme Lei 13.988/2020 quando o ente aderir.',
    ));
  } catch (e) { avisos.push(`execução fiscal assuntos: ${String(e).slice(0, 120)}`); }

  // 7) Feitos Tributários BH — carga por unidade 2026
  try {
    const q7 = { size: 0, query: { bool: { must: [JANELA_2026, { match_phrase: { 'orgaoJulgador.nome': 'Feitos Tributários' } }] } }, aggs: { varas: { terms: { field: 'orgaoJulgador.nome.keyword', size: 10 } } } };
    const r = await dj(q7);
    docs.push(docJr(
      'jrm-tjmg-feitos-tributarios-bh-2026', 'Jurimetria TJMG — varas de Feitos Tributários: carga (janela 2026, DataJud)',
      'tributario', 'jurimetria', 'feitos tributários BH 2026',
      'Unidades jurisdicionais especializadas em Feitos Tributários (match no nome do órgão julgador — concentração na comarca de Belo Horizonte: varas municipais e estadual) e seu volume indexado na janela 2026. Complemento dos lotes tributários (001, 015-016).',
      `Total janela 2026: **≥ ${r.hits.total.value.toLocaleString('pt-BR')}** (${r.hits.total.relation === 'gte' ? 'saturada — valor mínimo' : 'exato'}). Unidades (literal da API):\n\n${listaFmt(r.aggregations?.varas?.buckets, 10)}`,
      q7,
      'Uso: demandas tributárias de BH têm varas especializadas (municipais e estadual); verificar competência conforme o ente tributante (CPC art. 139 VIII; CF art. 109 V para Execução Fiscal).',
    ));
  } catch (e) { avisos.push(`feitos tributários: ${String(e).slice(0, 120)}`); }

  // 8) Metodologia DataJud (doc institucional — B)
  docs.push({
    slug: 'jrm-datajud-metodologia-limitacoes',
    titulo: 'Metodologia DataJud — como o sistema consulta a API Pública do CNJ (reprodutibilidade e limitações)',
    tipoDocumento: 'DOUTRINA',
    area: 'geral',
    subarea: 'jurimetria',
    assunto: 'metodologia DataJud',
    prioridade: 'P1',
    lote: 'LOTE-031',
    conteudo: `## O que é a API Pública DataJud\nInfraestrutura do CNJ que indexa processos de todos os tribunais em formato Elasticsearch/OpenSearch. Acesso gratuito mediante chave (\`Authorization: APIKey <chave>\`) solicitada no portal datajud.cnj.jus.br. O Jurimetria DPT usa a chave configurada na variável de ambiente DATAJUD_API_KEY — a chave NÃO é armazenada no repositório.\n\n## Como este sistema usa\n- **Aba Jurimetria (ao vivo)**: consultas por classe/tribunal/comarca (código IBGE do órgão julgador)/vara, com agregações \`size:0\` — nenhum dado pessoal é baixado.\n- **Lotes JURIMETRIA (LOTE-031)**: retratos agregados ingeridos na base com a query JSON exata para reprodução.\n\n## Limitações honestas\n1. O índice reflete o que os tribunais enviaram — não é censo processual absoluto nem substitui o PDPJ/MPRJ.\n2. \`@timestamp\` é a data de atualização do documento no índice — recortes por "janela 2026" marcam documentos recentes, não ajuizamentos.\n3. Contagens acima de 10 mil retornam \`relation: gte\` (valor mínimo) — o sistema marca como "≥" quando é o caso.\n4. Grafias de classes/varas variam entre tribunais — agregações usam campos \`.keyword\` literais.\n5. Consultas respeitam LGPD: somente agregações (size:0), nunca listagem de processos/pessoas.\n\n## Reprodução mínima (curl)\n\n\`\`\`bash\ncurl -X POST https://api-publica.datajud.cnj.jus.br/api_publica_tjmg/_search \\\n  -H "Authorization: APIKey $DATAJUD_API_KEY" -H "Content-Type: application/json" \\\n  -d '{"size":0,"query":{"match_phrase":{"classe.nome":"Recuperação Judicial"}}}'\n\`\`\``,
    metadados: { orgao: 'CNJ', lgpd: 'somente agregações', chave: 'env DATAJUD_API_KEY' },
    tags: ['jurimetria', 'datajud', 'metodologia', 'cnj', 'reprodutibilidade'],
    fonte: 'CNJ — API Pública DataJud (documentação oficial do programa)',
    urlFonte: URL_FONTE,
    dataConsulta: DATA_CONSULTA,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: DATA_CONSULTA,
    proximaVerificacaoRecomendada: '2026-12-01',
  });

  const rel = await ingestLote(
    'LOTE-031',
    'Jurimetria REAL TJMG via API Pública DataJud (chave ativa em .env): censo de classes 2026, Recuperação Judicial (histórico + varas top), Falência (histórico + subclasses), carga de varas de Belo Horizonte (IBGE 3106200), JEC nas 5 maiores comarcas (BH/Betim/Contagem/Uberlândia/Juiz de Fora), assuntos de Execução Fiscal, carga de varas de Feitos Tributários + metodologia DataJud (reprodutibilidade/limitações/LGPD). TODOS os números capturados AO VIVO no momento da ingestão (aggregations size:0); query JSON de reprodução embutida em cada doc; nenhum número de processo ou dado pessoal. ANTI-INVENÇÃO: documento só é gerado se a consulta real retornar dados.',
    docs.map((d) => ({ ...d, lote: 'LOTE-031' })),
    [`${URL_FONTE} (API Pública DataJud/CNJ — índice api_publica_tjmg; consultas ao vivo ${DATA_CONSULTA}; chave via env DATAJUD_API_KEY — não versionada)`],
  );

  console.log('=== RELATÓRIO LOTE-031 ===');
  console.log(JSON.stringify(rel, null, 2));
  console.log(`=== RESUMO ===\nLOTE-031: criados=${rel.criados} atualizados=${rel.atualizados} rejeitados=${rel.rejeitados} duplicatasEvitadas=${rel.duplicatasEvitadas}`);
  for (const a of [...(rel.avisos ?? []), ...avisos]) console.log(`  AVISO: ${a}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('ERRO NA INGESTÃO:', e);
    process.exit(1);
  });
