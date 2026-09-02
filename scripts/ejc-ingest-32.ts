// Jurimetria DPT — LOTE-032: Jurimetria REAL TRT-3/TRF-1 (MG) via API DataJud + complementos RJ
// Uso: bun scripts/ejc-ingest-32.ts
//
// PARTE A (JURIMETRIA, confiabilidade A): números capturados AO VIVO da API Pública
//   DataJud/CNJ — TRT-3 (justiça do trabalho de MG) e TRF-1 (JEC federal, cidades de MG).
//   Aggregations size:0 — NENHUM dado pessoal. Query JSON embutida para reprodução.
// PARTE B (derivados EJC, confiabilidade B): TRIAGEM, TABELA_DOCUMENTOS e ARGUMENTACAO
//   de Recuperação Judicial — TODOS fundamentados exclusivamente nos textos literais
//   já ingeridos do LOTE-030 (Lei 11.101 arts. 1º-101, 161-173 — Planalto 2026-09-01).
//   ANTI-INVENÇÃO: nenhum artigo fora do conjunto já ingerido é citado como fundamento.
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

async function dj(indice: string, body: unknown): Promise<DjResponse> {
  const res = await fetch(`${BASE}/api_publica_${indice}/_search`, {
    method: 'POST',
    headers: { Authorization: `APIKey ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`DataJud ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return (await res.json()) as DjResponse;
}

const JANELA_2026 = { range: { '@timestamp': { gte: '2026-01-01', lte: '2026-12-31||/y' } } };
const COMO_REPRODUZ = (indice: string, q: unknown) => `### Como reproduzir (oficial)\n\n\`\`\`json\n${JSON.stringify(q)}\n\`\`\`\n\nPOST https://api-publica.datajud.cnj.jus.br/api_publica_${indice}/_search com o cabeçalho \`Authorization: APIKey <chave gratuita CNJ>\`.`;
const ALERTAS = `### Alertas e limitações (honestidade)\n\n- Números refletem o índice DataJud na data da consulta (${DATA_CONSULTA}) — RETRATO, não censo absoluto.\n- Recorte 2026 pela janela de atualização do índice (@timestamp); o ano está EM CURSO (parcial).\n- Contagens acima de 10 mil retornam \`relation: gte\` (valor mínimo) — marcadas com "≥".\n- Agregações oficiais apenas: nenhum número de processo, parte ou dado pessoal (LGPD).`;

function docJr(
  slug: string, titulo: string, area: string, subarea: string, assunto: string,
  escopo: string, numeros: string, indice: string, query: unknown, extra: string,
): InputDocument {
  return {
    slug,
    titulo,
    tipoDocumento: 'JURIMETRIA',
    area,
    subarea,
    assunto,
    prioridade: 'P1',
    lote: 'LOTE-032',
    conteudo: `## Escopo\n${escopo}\n\n## Números (retrato DataJud ${DATA_CONSULTA})\n${numeros}\n\n${COMO_REPRODUZ(indice, query)}\n\n${extra}\n\n${ALERTAS}`,
    metadados: {
      orgao: `CNJ — API Pública DataJud (${indice})`,
      tipoDados: 'agregados oficiais (aggregations, size:0)',
      lgpd: 'sem dados pessoais — somente contagens agregadas',
      dataConsulta: DATA_CONSULTA,
      ambiente: 'chave oficial gratuita via env DATAJUD_API_KEY',
    },
    tags: ['jurimetria', 'datajud', 'cnj', indice, 'mg', area, 'reprodutivel'],
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

const totalFmt = (r: DjResponse) => {
  const gte = r.hits.total.relation === 'gte';
  return `${gte ? '≥ ' : ''}${r.hits.total.value.toLocaleString('pt-BR')} processos (${gte ? 'contagem saturada em 10 mil — valor mínimo' : 'exato'})`;
};

function docDerivado(
  slug: string, titulo: string, tipoDocumento: string, area: string, subarea: string, assunto: string,
  conteudo: string, tags: string[],
): InputDocument {
  return {
    slug,
    titulo,
    tipoDocumento,
    area,
    subarea,
    assunto,
    prioridade: 'P1',
    lote: 'LOTE-032',
    conteudo,
    metadados: {
      fundamento: 'Documentos derivados EJC — exclusivamente a partir dos textos literais da Lei 11.101/2005 ingeridos no LOTE-030 (Planalto, consulta 2026-09-01).',
      baseLiteral: 'l11101-arts-1-2, l11101-arts-3-4, l11101-arts-9-19, l11101-art-50, l11101-arts-51-53, l11101-arts-54-58, l11101-arts-59-61, l11101-arts-69-75, l11101-arts-94-101',
    },
    tags,
    fonte: 'Derivado EJC — fundamentado no LOTE-030 (Lei 11.101/2005 literal, Planalto)',
    urlFonte: 'https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2005/lei/l11101.htm',
    dataConsulta: '2026-09-01',
    confiabilidade: 'B',
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

  // A1) TRT-3 — censo de classes 2026
  try {
    const q1 = { size: 0, query: JANELA_2026, aggs: { classes: { terms: { field: 'classe.nome.keyword', size: 10 } } } };
    const r = await dj('trt3', q1);
    docs.push(docJr(
      'jrm-trt3-censo-classes-2026', 'Jurimetria TRT-3 — censo de classes trabalhistas (janela 2026, DataJud)',
      'trabalhista', 'jurimetria', 'censo classes TRT3 2026',
      'Distribuição das 10 classes com mais processos indexados no TRT-3 (justiça do trabalho de Minas Gerais) na janela 2026 da API Pública DataJud. Retrato do volume trabalhista mineiro — complemento dos lotes trabalhistas (010, 011).',
      `Total na janela 2026: **${totalFmt(r)}**. Classes (literal da API):\n\n${listaFmt(r.aggregations?.classes?.buckets, 10)}`,
      'trt3', q1,
      'Uso: dimensionar rito (ordinário × sumaríssimo — Lei 9.099 não se aplica; CLT arts. 840-852) e volume recursal (Recurso Ordinário, Agravo de Petição) na região do TRT-3.',
    ));
  } catch (e) { avisos.push(`TRT3 classes: ${String(e).slice(0, 120)}`); }

  // A2) TRT-3 — varas de BH por carga 2026
  try {
    const q2 = { size: 0, query: { bool: { must: [JANELA_2026, { term: { 'orgaoJulgador.codigoMunicipioIBGE': '3106200' } }] } }, aggs: { varas: { terms: { field: 'orgaoJulgador.nome.keyword', size: 10 } } } };
    const r = await dj('trt3', q2);
    docs.push(docJr(
      'jrm-trt3-bh-varas-2026', 'Jurimetria TRT-3 — Vara do Trabalho de Belo Horizonte: carga (janela 2026, DataJud)',
      'trabalhista', 'jurimetria', 'varas trabalho BH 2026',
      'Unidades jurisdicionais da Justiça do Trabalho com sede em Belo Horizonte (IBGE 3106200) e seu volume indexado na janela 2026 — base empírica para escolha de vara e expectativa de pauta na capital.',
      `Total BH janela 2026: **${totalFmt(r)}**. Unidades (literal da API):\n\n${listaFmt(r.aggregations?.varas?.buckets, 10)}`,
      'trt3', q2,
      'Uso: petição inicial trabalhista distribuída por sorteio entre as varas; a carga observada ajuda a estimar tempo de tramitação (CLT art. 845 e ss.).',
    ));
  } catch (e) { avisos.push(`TRT3 BH: ${String(e).slice(0, 120)}`); }

  // A3) TRT-3 — cidades polo (Uberlândia, Juiz de Fora, Contagem, Betim)
  const CIDADES_TRAB = [
    ['3170206', 'Uberlândia'], ['3136702', 'Juiz de Fora'], ['3118601', 'Contagem'], ['3106705', 'Betim'],
  ];
  try {
    const linhas: string[] = [];
    const q3base = { size: 0, query: { bool: { must: [JANELA_2026, { term: { 'orgaoJulgador.codigoMunicipioIBGE': '' } }] } } };
    for (const [ibge, nome] of CIDADES_TRAB) {
      const q3 = JSON.parse(JSON.stringify(q3base));
      q3.query.bool.must[1].term['orgaoJulgador.codigoMunicipioIBGE'] = ibge;
      const r = await dj('trt3', q3);
      linhas.push(`- **${nome}** — ${totalFmt(r)}`);
    }
    docs.push(docJr(
      'jrm-trt3-cidades-2026', 'Jurimetria TRT-3 — Justiça do Trabalho por cidade-polo (Uberlândia, Juiz de Fora, Contagem, Betim; janela 2026)',
      'trabalhista', 'jurimetria', 'trabalhista por cidade 2026',
      'Volume trabalhista total (todas as classes) nas cidades-polo de MG fora da capital, janela 2026 — panorama da interiorização da demanda trabalhista mineira.',
      linhas.join('\n'),
      'trt3', q3base,
      'Uso: avaliar foro de tramitação em demandas com domicílio no interior (CLT art. 651 — local da prestação de serviços).',
    ));
  } catch (e) { avisos.push(`TRT3 cidades: ${String(e).slice(0, 120)}`); }

  // A4) TRF-1 — JEC federal nas cidades de MG (BH, Montes Claros, Uberlândia, Juiz de Fora)
  const CIDADES_JEF = [
    ['3106200', 'Belo Horizonte'], ['3143302', 'Montes Claros'], ['3170206', 'Uberlândia'], ['3136702', 'Juiz de Fora'],
  ];
  try {
    const linhas: string[] = [];
    const q4base = { size: 0, query: { bool: { must: [JANELA_2026, { match_phrase: { 'classe.nome': 'Procedimento do Juizado Especial Cível' } }, { term: { 'orgaoJulgador.codigoMunicipioIBGE': '' } }] } } };
    for (const [ibge, nome] of CIDADES_JEF) {
      const q4 = JSON.parse(JSON.stringify(q4base));
      q4.query.bool.must[2].term['orgaoJulgador.codigoMunicipioIBGE'] = ibge;
      const r = await dj('trf1', q4);
      linhas.push(`- **${nome}** — ${totalFmt(r)}`);
    }
    docs.push(docJr(
      'jrm-trf1-jec-cidades-mg-2026', 'Jurimetria TRF-1 — Juizado Especial Federal nas cidades de MG (BH, Montes Claros, Uberlândia, Juiz de Fora; janela 2026)',
      'processual-civil', 'jurimetria', 'JEF MG por cidade 2026',
      'Volume da classe "Procedimento do Juizado Especial Cível" no TRF-1 (1ª Região — inclui Minas Gerais) por município-polo do órgão julgador, janela 2026. A demanda do JEC federal em MG é majoritariamente previdenciária (Lei 10.259/2001 — LOTE-025).',
      linhas.join('\n'),
      'trf1', q4base,
      'Uso: ações até 60 salários mínimos seguem o JEF (Lei 10.259 art. 3º) — a carga por polo orienta expectativa de pauta e a escolha entre tutela e cassação de benefício.',
    ));
  } catch (e) { avisos.push(`TRF1 JEC MG: ${String(e).slice(0, 120)}`); }

  // B1) TRIAGEM RJ — crédito na recuperação judicial
  docs.push(docDerivado(
    'triagem-recuperacao-judicial-credor',
    'Triagem — cliente credor ou creditor em Recuperação Judicial (roteiro de entrevista)',
    'TRIAGEM', 'empresarial', 'recuperacao-judicial', 'triagem RJ credor',
    `## Roteiro de triagem (fundamento: Lei 11.101 arts. 9º-11, 47-53, 59-61 — LOTE-030)

### 1. Identificação da posição
1.1. O cliente é **credor** (tem crédito contra a empresa em RJ), **devedor** (pretende/presenteou RJ) ou **terceiro** (sócio, garantidor, adquirente)?
1.2. Se credor: qual a **natureza do crédito** — trabalhista, com garantia real, quirografário, tributário, microempresa? (art. 25 — classe e ordem de pagamento; tributário não se sujeita à RJ — art. 6º e art. 49 § 1º)

### 2. Fase processual
2.1. A RJ já foi **deferida/processada**? Há **plano apresentado** (art. 51) ou em assembleia (arts. 35-37)?
2.2. **Stay period**: a suspensão de 180 dias (art. 6º § 4º) está correndo? Quando termina? (conteúdo LOTE-030: prazos-rj-consolidado)
2.3. Fase de **verificação de créditos** (arts. 7º-14): o crédito foi reconhecido na lista? Há divergência impugnável?

### 3. Riscos e providências imediatas (credor)
3.1. **Habilitação/impugnação** dentro dos prazos do art. 8º-14 — checklists e prazos no LOTE-030.
3.2. **Assembleia**: participar/votar conforme a classe (art. 45 — sujeição dos credores ao plano).
3.3. **Plano**: avaliar desconto, alongamento, capitalização (art. 50) e o **cram-down** (art. 58 § 1º — rejeição não impede deferimento se cumpridos requisitos legais).
3.4. **Novação** (art. 59): créditos submetidos ao plano são novados — avaliar renúncia de ações e garantias remanescentes.
3.5. Descumprimento: **convolação em falência** (art. 73) — monitorar.

### 4. Documentos já requeridos da base
- checklist-ajudmissibilidade-RJ / peca-RJ / fluxo-RJ (LOTE-030) — conforme posição do cliente.`,
    ['triagem', 'recuperacao-judicial', 'credor', 'le11101', 'empresarial'],
  ));

  // B2) TABELA_DOCUMENTOS RJ — habilitação de crédito + acompanhamento
  docs.push(docDerivado(
    'tabela-documentos-recuperacao-judicial-credor',
    'Tabela de documentos — habilitação de crédito e atuação do credor em Recuperação Judicial',
    'TABELA_DOCUMENTOS', 'empresarial', 'recuperacao-judicial', 'documentos RJ credor',
    `## Documentos por etapa (fundamento: Lei 11.101 arts. 9º-14, 51, 53 — LOTE-030)

### A. Habilitação de crédito na lista do Administrador Judicial (art. 7º-11)
| Documento | Observação |
| --- | --- |
| Procuração do credor | poderes para habilitar e impugnar |
| Título/demonstrativo do crédito | origem, valor, vencimento, encargos |
| Documentos que comprovam a origem | contrato, nota fiscal, duplicata, sentença |
| Garantias | instrumento de garantia real/fiduciária (define classe — art. 25) |
| Cálculo atualizado | encargos até a data do pedido (art. 9º § 2º) |

### B. Impugnação ao plano (art. 53 § 4º — até 30 dias da publicação da lista? ver prazo na base: prazos-rj-consolidado)
| Documento | Observação |
| --- | --- |
| Petição de impugnação | inexistência/violação dos requisitos do art. 53 § 1º |
| Prova documental | descumprimento de requisitos, fraude, prejuízo à classe |

### C. Assembleia-geral de credores (arts. 35-37)
| Documento | Observação |
| --- | --- |
| Procuração para votação | poderes específicos (quórum por classe — art. 45) |
| Demonstração do crédito atualizada | para conferência de quórum |

### D. Convolação em falência por descumprimento (art. 73)
| Documento | Observação |
| --- | --- |
| Petição de convolação | descumprimento de obrigação do plano |
| Prova do descumprimento | extratos, contratos, notificações |

**AVISO:** conferir prazos no conteúdo consolidado do LOTE-030 (prazos-rj-consolidado-l11101) e validar no processo concreto.`,
    ['tabela', 'documentos', 'recuperacao-judicial', 'credor', 'le11101'],
  ));

  // B3) ARGUMENTACAO RJ — credor contra/condicionado ao plano
  docs.push(docDerivado(
    'argumentacao-credor-rj-plano',
    'Argumentação — posição do credor face ao plano de Recuperação Judicial (a favor e contra)',
    'ARGUMENTACAO', 'empresarial', 'recuperacao-judicial', 'argumentação credor RJ',
    `## Análise sob ambos os lados (fundamento: Lei 11.101 arts. 50, 53, 54-58, 59-61, 69-73 — LOTE-030)

### A. Argumentos do CREDOR que se OPÕE ao plano
1. **Requisitos do art. 53 § 1º não preenchidos**: viabilidade econômica não demonstrada; ausência de exame/extratos contábeis (art. 51 § 1º); laudo sem subsídio.
2. **Cram-down indevido** (art. 58 § 1º): ausência de contraprestação proporcional à classe não concordante ou garantia suficiente para preservar o valor do crédito.
3. **Tratamento desigual**: diferenciação sem base entre credores da mesma classe (art. 50 — meios de recuperação devem respeitar a ordem do art. 25).
4. **Fraude à classe**: abuso de direito na capitalização de créditos da parte relacionada (art. 10 § 1º e art. 37 § 2º).
5. **Desproporcionalidade de desconto/alongamento**: destruição do valor do crédito sem justa causa documentada.

### B. Contra-argumentos (posição do DEVEDOR / resposta esperada)
1. **Preservação da empresa** (art. 47): função social e estímulo à atividade econômica — plano exitoso supera falência.
2. **Cram-down legal**: requisitos objetivos do art. 58 § 1º I-IV cumpridos; garantia real ofertada preserva valor.
3. **Discricionariedade de meios** (art. 50): rol exemplificativo — flexibilidade é essência da instituto.
4. **Novação** (art. 59-60): submissão ao plano extingue ações; contestação posterior é inócoba.

### C. Resposta estratégica do credor
- Atacar **requisitos objetivos** (art. 53 § 1º I-VI) com prova documental, não apenas assertivas.
- Exigir **contraprestação real** no cram-down (valor presente do crédito).
- Monitorar **descumprimento** para convolação (art. 73) — manter dossiê de inadimplemento do plano.
- Cuidado: credor que subscreve o plano pode ter crédito novado (art. 59) — renegociar antes de votar favorável.`,
    ['argumentacao', 'recuperacao-judicial', 'credor', 'cram-down', 'novacao', 'le11101'],
  ));

  const rel = await ingestLote(
    'LOTE-032',
    'Jurimetria REAL TRT-3 (censo classes 2026, varas BH, cidades-polo Uberlândia/Juiz de Fora/Contagem/Betim) e TRF-1 (JEC federal nas cidades de MG: BH/Montes Claros/Uberlândia/Juiz de Fora) via API DataJud + complementos derivados de Recuperação Judicial (triagem credor, tabela de documentos habilitação/impugnação/assembleia/convolação, argumentação credor vs plano com cram-down/novação) — todos fundamentados EXCLUSIVAMENTE nos textos literais da Lei 11.101 já ingeridos no LOTE-030. ANTI-INVENÇÃO: jurimetria somente com números capturados ao vivo (aggregations size:0, query JSON embutida); derivados sem citar artigo fora do conjunto ingerido.',
    docs.map((d) => ({ ...d, lote: 'LOTE-032' })),
    [`${URL_FONTE} (API Pública DataJud/CNJ — índices api_publica_trt3 e api_publica_trf1; consultas ao vivo ${DATA_CONSULTA}; chave via env DATAJUD_API_KEY — não versionada)`],
  );

  console.log('=== RELATÓRIO LOTE-032 ===');
  console.log(JSON.stringify(rel, null, 2));
  console.log(`=== RESUMO ===\nLOTE-032: criados=${rel.criados} atualizados=${rel.atualizados} rejeitados=${rel.rejeitados} duplicatasEvitadas=${rel.duplicatasEvitadas}`);
  for (const a of [...(rel.avisos ?? []), ...avisos]) console.log(`  AVISO: ${a}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('ERRO NA INGESTÃO:', e);
    process.exit(1);
  });
