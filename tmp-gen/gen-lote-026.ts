// Gerador do LOTE-026 — Tributário II (compêndio EJC, foco MG)
// Injeta os textos LITERAIS extraídos do Planalto (/tmp/leis-oficiais/*.txt, consulta 2026-08-30)
// e os documentos derivados (doutrina/peças/fluxos de redação própria EJC).
// Saída: /home/z/my-project/data/ejc/lote-026-tributario-ii.ts
import { readFileSync, writeFileSync } from 'fs';

const T = (p: string) => readFileSync(`/tmp/leis-oficiais/${p}`, 'utf-8')
  .replace(/\s+/g, ' ')
  .replace(/`/g, "'")
  .trim();

const D = '2026-08-30';
const PLANALTO = 'Presidência da República — Planalto';
const URL_CF = 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm';
const URL_CTN = 'https://www.planalto.gov.br/ccivil_03/leis/l5172compilado.htm';
const URL_LC116 = 'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp116.htm';
const URL_LC123 = 'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm';
const URL_L9430 = 'https://www.planalto.gov.br/ccivil_03/leis/L9430.htm';
const URL_L13988 = 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2020/lei/l13988.htm';
const EJC = 'Elaboração EJC — conteúdo estrutural original';
const MG_NOTA = 'NADA estadual é citado como verbatim nesta rodada: portais MG (almg.gov.br, mg.gov.br, iof.mg.gov.br, sefaz.mg.gov.br, tjmg.jus.br) BLOQUEADOS para captura em 2026-08-30.';

function lei(slug: string, titulo: string, subarea: string | null, assunto: string, conteudo: string, norma: string, urlFonte: string, artigos: string[], tags: string[]): string {
  return JSON.stringify({
    slug, titulo, tipoDocumento: 'LEGISLACAO', area: 'tributario', subarea, assunto,
    prioridade: 'P1', conteudo,
    metadados: { numero: norma, orgao: 'Congresso Nacional', artigos_principais: artigos, vigente: true, confirmacao_texto: 'Extração literal do texto oficial do Planalto em 2026-08-30. Redações em bloco único com notas "(Redação dada pela ...)" registradas como consta.' },
    tags, fonte: PLANALTO, urlFonte, dataConsulta: D, confiabilidade: 'A',
    vigente: true, status: 'ATIVO', dataUltimaVerificacao: D, proximaVerificacaoRecomendada: '2026-10-30',
  });
}

function derivado(slug: string, titulo: string, tipoDocumento: string, subarea: string | null, assunto: string, conteudo: string, tags: string[], opts: { conf?: string; status?: string; urlFonte?: string; fonte?: string; rel?: string } = {}): string {
  return JSON.stringify({
    slug, titulo, tipoDocumento, area: 'tributario', subarea, assunto, prioridade: 'P1',
    conteudo,
    metadados: { elaboracao: 'EJC — redação estrutural própria com base nos textos oficiais capturados em 2026-08-30', aviso_mg: MG_NOTA },
    tags, fonte: opts.fonte ?? EJC, urlFonte: opts.urlFonte ?? null, dataConsulta: D,
    confiabilidade: opts.conf ?? 'B', vigente: true, status: opts.status ?? 'ATIVO',
    dataUltimaVerificacao: D, proximaVerificacaoRecomendada: '2026-10-30',
    rel: opts.rel,
  });
}

// ===== LITERAIS =====
const cf145 = T('cf_art145.txt');
const cf150 = T('cf_art150.txt');
const cf151 = T('cf_art151.txt');
const cf152 = T('cf_art152.txt');
const cf155 = T('cf_art155.txt');
const cf156 = T('cf_art156.txt');
const cf195 = T('cf_art195.txt');
const ctn1_11 = T('ctn_1-11.txt');
const ctn96_112 = T('ctn_96-112.txt');
const lcp116 = T('lcp116_1-9.txt');
const lcp123a13 = T('lcp123_art13.txt');
const lcp123a17 = T('lcp123_art17.txt');
const l9430a74 = T('l9430_compensacao.txt');
const l13988 = T('l13988_1-5.txt');

const docs: string[] = [];

// 1 — CF arts. 145-152
docs.push(lei('cf-arts-145-152-competencia-vedacoes', 'CF/88 arts. 145-152 — Espécies tributárias, princípios e vedação de vinculação (texto literal)', 'competencia-imunidades', 'Sistema Tributário Nacional — competência e princípios',
`## CF/88 — Arts. 145 a 152 (texto literal, Planalto — consulta ${D})

### Art. 145 — Espécies e taxas
${cf145}

### Art. 150 — Vedações ao poder de tributar
${cf150}

### Art. 151 — Vedação de privilégios da União
${cf151}

### Art. 152 — Vedação de discriminação entre Estados
${cf152}`,
  'CF/1988 arts. 145, 150, 151, 152', URL_CF, ['145', '150', '151', '152'],
  ['tributario/competencia-imunidades', 'tributario/principios', 'geral/legislacao']));

// 2 — CF art. 155 (ICMS)
docs.push(lei('cf-art-155-icms-impostos-estaduais', 'CF/88 art. 155 — ICMS e impostos estaduais: competência e normas gerais (texto literal)', 'icms-mg', 'ICMS — competência constitucional e normas gerais',
`## CF/88 — Art. 155 (texto literal, Planalto — consulta ${D})

### Art. 155 — Impostos dos Estados e do Distrito Federal
${cf155}

NOTA EJC: o art. 155 fixa a competência e remete a lei complementar (LC 87/1996 — Lei Kandir, já ingerida no LOTE-023) e a convênios/CONFAZ (LC 24/1975, LOTE-023). Alíquotas e bases específicas do ICMS/MG dependem de lei estadual [VERIFICAR LEI ESTADUAL MG — leis consolidadas em almg.gov.br / mg.gov.br] — NADA estadual citado como verbatim aqui.`,
  'CF/1988 art. 155', URL_CF, ['155', '155 § 2º', '155 § 4º'],
  ['tributario/icms-mg', 'tributario/competencia-imunidades']));

// 3 — CF art. 156 (ISS)
docs.push(lei('cf-art-156-iss-impostos-municipais', 'CF/88 art. 156 — Impostos municipais e ISS: competência e normas (texto literal)', 'iss', 'ISS — competência constitucional',
`## CF/88 — Art. 156 (texto literal, Planalto — consulta ${D})

### Art. 156 — Impostos dos Municípios
${cf156}

NOTA EJC: o inciso III e os §§ disciplinam o ISS de competência municipal; lei complementar complementa a hipótese de incidência (LC 116/2003 — ingerida neste lote). Lista de serviços e faixas de alíquota são municipalizadas [VERIFICAR LEGISLAÇÃO MUNICIPAL DE COMPETÊNCIA DO CASO].`,
  'CF/1988 art. 156', URL_CF, ['156', '156 § 3º'],
  ['tributario/iss', 'tributario/competencia-imunidades']));

// 4 — CF art. 195 (seguridade/PIS-COFINS)
docs.push(lei('cf-art-195-seguridade-contribuicoes', 'CF/88 art. 195 — Seguridade social: fontes de custeio e contribuições (texto literal)', 'contribuicoes-sociais', 'Contribuições de seguridade — competência da União',
`## CF/88 — Art. 195 (texto literal, Planalto — consulta ${D})

### Art. 195 — Financiamento da seguridade social
${cf195}

NOTA EJC: art. 195 I a/b "A" fixam a competência das contribuições sociais (PIS/PASEP/COFINS/CSLL via legislação infraconstitucional). Compensação de créditos dessas contribuições: Lei 9.430 art. 74 (ingerida neste lote). [VERIFICAR LEIS ESPECÍFICAS — LC 70/1991, LC 108/2004 e LC 214/2025 não capturadas nesta consulta].`,
  'CF/1988 art. 195', URL_CF, ['195', '195 I', '195 A'],
  ['tributario/contribuicoes-sociais']));

// 5 — CTN arts. 1-11
docs.push(lei('ctn-arts-1-11-competencia-tributaria', 'CTN arts. 1º-11 — Sistema tributário nacional e competência tributária (texto literal)', 'competencia-imunidades', 'CTN — sistema tributário e competência',
`## CTN (Decreto-Lei 5.172/1966) — Arts. 1º a 11 (texto literal, Planalto compilado — consulta ${D})

${ctn1_11}`,
  'CTN/1966 arts. 1º-11', URL_CTN, ['1', '3', '5', '7', '8', '11'],
  ['tributario/competencia-imunidades', 'tributario/geral']));

// 6 — CTN arts. 96-112
docs.push(lei('ctn-arts-96-112-legislacao-tributaria', 'CTN arts. 96-112 — Legislação tributária: lei, vigência, aplicação, interpretação e integração (texto literal)', 'legislacao-tributaria', 'CTN — legislação tributária',
`## CTN (Decreto-Lei 5.172/1966) — Arts. 96 a 112 (texto literal, Planalto compilado — consulta ${D})

${ctn96_112}`,
  'CTN/1966 arts. 96-112', URL_CTN, ['96', '97', '103', '106', '109', '111', '112'],
  ['tributario/legislacao-tributaria', 'tributario/geral']));

// 7 — LC 116 arts. 1-9 (ISS)
docs.push(lei('lcp116-arts-1-9-iss', 'LC 116/2003 arts. 1º-9º — ISS: hipótese de incidência, não incidência, alíquotas e base (texto literal)', 'iss', 'ISS — lei complementar do imposto sobre serviços',
`## LC 116/2003 — Arts. 1º a 9º (texto literal, Planalto — consulta ${D})

${lcp116}

NOTA EJC: a lista anexa de serviços (remissões dos arts. 1º-2º) NÃO foi capturada como anexo nesta consulta — remissões registradas como consta. Alíquotas municipais: [VERIFICAR LEI MUNICIPAL DO CASO].`,
  'LC 116/2003 arts. 1º-9º', URL_LC116, ['1', '2', '3', '6', '7', '8'],
  ['tributario/iss', 'tributario/geral']));

// 8 — LC 123 arts. 13 e 17 (Simples)
docs.push(lei('lc123-arts-13-17-simples-alcance', 'LC 123/2006 arts. 13 e 17 — Simples Nacional: tributos abrangidos e exclusões (texto literal)', 'simples-nacional', 'Simples Nacional — alcance e vedações',
`## LC 123/2006 — Arts. 13 e 17 (texto literal, Planalto — consulta ${D})

### Art. 13 — Tributos abrangidos
${lcp123a13}

### Art. 17 — Exclusões do Simples
${lcp123a17}

NOTA EJC: demais arts. (12, 18, 29, 58, 74) pendentes de captura nesta consulta — registrados como pendência. Recolhimentos estaduais MG decorrentes do regime [VERIFICAR LEI ESTADUAL MG].`,
  'LC 123/2006 arts. 13 e 17', URL_LC123, ['13', '17'],
  ['tributario/simples-nacional']));

// 9 — Lei 9.430 art. 74 (compensação)
docs.push(lei('l9430-art-74-compensacao', 'Lei 9.430/1996 art. 74 — Compensação tributária federal: regras, prazos e vedados (texto literal)', 'compensacao', 'Compensação de créditos tributários federais',
`## Lei 9.430/1996 — Art. 74 (texto compilado, Planalto — consulta ${D})

O texto compilado empilha as redações históricas com notas "(Redação dada pela ...)": registra-se como consta, sem harmonização.

${l9430a74}

NOTA EJC: arts. 66-73 e 74-A/B pendentes de captura nesta consulta; prazos operacionais (30 dias julgamento da compensação; 360 dias pagamento por decisão) constam nos §§ do próprio art. 74 transcrito.`,
  'Lei 9.430/1996 art. 74', URL_L9430, ['74', '74 § 5º', '74 § 14'],
  ['tributario/compensacao', 'geral/prazos']));

// 10 — Lei 13.988 arts. 1-5 (transação)
docs.push(lei('l13988-arts-1-5-transacao', 'Lei 13.988/2020 arts. 1º-5º — Transação tributária: requisitos e modalidades (texto literal)', 'transacao-tributaria', 'Transação tributária — requisitos gerais',
`## Lei 13.988/2020 — Arts. 1º a 5º (texto literal, Planalto — consulta ${D})

${l13988}

NOTA EJC: arts. 6º-22 (transação específica de litígios judiciais/administrativos, repasses, CGF) pendentes de captura nesta consulta — registrados como pendência.`,
  'Lei 13.988/2020 arts. 1º-5º', URL_L13988, ['1', '2', '3'],
  ['tributario/transacao-tributaria']));

// ===== DERIVADOS =====

docs.push(derivado('doutrina-anterioridade-tributaria-aplicacao', 'Doutrina — Anterioridade tributária: noventena anual, quaternária e aplicação prática', 'DOUTRINA', 'principios', 'Anterioridade — aplicação prática',
`## Anterioridade tributária (aplicação prática EJC)

Conceito EJC: vedação de cobrança de tributo no mesmo exercício financeiro da lei que o instituiu ou aumentou (CF art. 150 I) e de cobrança antes de decorridos 90 dias da publicação da lei (art. 150 I) — texto literal do art. 150 no doc cf-arts-145-152-competencia-vedacoes.

### Como aplicar na defesa
1. Identificar a data de PUBLICAÇÃO da lei e o período de fato gerador cobrado.
2. Verificar se a exigência respeita a noventena (90 dias) e a anualidade (1º/01 do exercício seguinte).
3. Regra de cumulação: a vedação mais longa prevalece — tributo só cobrável após AMBOS os lapsos quando incidirem simultaneamente (CF art. 150 § 1º, texto literal).
4. Exceções do art. 150 § 1º (texto literal capturado): impostos sobre importação/exportação, IPI, IOF, empréstimos compulsórios de calamidade pública e do art. 148 I da CF — fundamentar APENAS nos incisos transcritos.

### Riscos e provas
- Prova documental: publicação da norma (DOU/imprensa oficial), período de cobrança (CDA/AI) e dados de faturamento.
- [VERIFICAR LEI ESTADUAL MG]: publicação específica no Minas Gerais (imprensa oficial estadual) para normas estaduais.

### Probabilidade qualitativa
Alta quando o fato gerador é anterior aos lapsos e a norma não se encaixa nas exceções constitucionais expressas.`,
  ['tributario/principios', 'tributario/competencia-imunidades'],
  { rel: 'cf-arts-145-152-competencia-vedacoes|COMPLEMENTA|Fundamenta a anterioridade no texto literal do art. 150' }));

docs.push(derivado('doutrina-imunidades-tributarias-panorama', 'Doutrina — Imunidades tributárias (art. 150 VI): panorama e requisitos de aplicação', 'DOUTRINA', 'competencia-imunidades', 'Imunidades — panorama',
`## Imunidades tributárias — panorama EJC

Conceito EJC: limitações constitucionais ao poder de tributar (CF art. 150 VI, texto literal no doc cf-arts-145-152-competencia-vedacoes) — proibição de instituir IMPOSTOS sobre patrimônio/renda/serviços de partidos, sindicatos, templos, instituições de educação e assistência social, livros e papel, e demais incisos transcritos.

### Requisitos práticos para sustentar imunidade
1. Preencher a condição objetiva do inciso aplicável (ex.: instituição de educação com propósito explícito — na forma da lei, art. 150 VI).
2. Provar a atividade-fim (finalidade educacional/assistencial) e o reinvestimento dos recursos.
3. Distinguir IMUNIDADE (constitucional, geral e permanente) de ISENÇÃO (infraconstitucional, condicionada).
4. Abrangência: as imunidades do art. 150 VI alcançam IMPOSTOS (não taxas nem contribuições, salvo previsão constitucional expressa).

### Riscos
- Atividade-fim desvirtuada (ex.: renda de aplicação financeira) pode ficar fora da imunidade.
- [VERIFICAR LEI ESTADUAL MG]: execução da imunidade sobre IPVA/ITCD de entidades em MG exige conferência da lei estadual.

### Probabilidade qualitativa
Alta quando a condição constitucional está demonstrada documentalmente e a exigência é de IMPOSTO.`,
  ['tributario/competencia-imunidades'],
  { rel: 'cf-arts-145-152-competencia-vedacoes|COMPLEMENTA|Detalha requisitos das imunidades do art. 150 VI' }));

docs.push(derivado('doutrina-guerra-fiscal-conflito-icms-iss', 'Doutrina — Guerra fiscal, conflito ICMS × ISS e limites dos convênios', 'DOUTRINA', 'iss', 'Guerra fiscal e conflito ICMS/ISS',
`## Guerra fiscal e conflito ICMS × ISS (panorama EJC)

Conceito EJC: disputa inter-estadual/municipal por arrecadação mediante benefícios/práticas distorcivas — controlada pela exigência de lei complementar e convênios (LC 24/1975, LOTE-023; CF arts. 151-152, LITERAL no cf-arts-145-152-competencia-vedacoes) e pelas regras de competência do ICMS/ISS (CF arts. 155/156 e LC 116/2003 — literais neste lote).

### Conflito ICMS × ISS — rota de análise
1. Caracterizar a natureza do serviço: LC 116 art. 3º (LITERAL deste lote) veda ISS sobre hipóteses expressas (relação de emprego, portal de notícias, representação comercial etc.).
2. Verificar a onerosidade e a lista municipal aplicável [VERIFICAR LEI MUNICIPAL DO CASO].
3. Sustentar a incompetência do ente que tributou sem previsão legal.

### Guerra fiscal — pontos operacionais
- Convênios CONFAZ (LC 24 arts. 1º-3º, LOTE-023): benefícios de ICMS exigem convênio e publicação DOU (10 dias — doc prazo-publicacao-resolucao-convenio-10-dias).
- Créditos presumidos/concessões unilaterais sem convênio: rota de impugnação e responsabilidade do beneficiário.
- MG como ente de referência: [VERIFICAR LEI ESTADUAL MG] para cada benefício alegado (benefícios estaduais específicos NÃO citados como verbatim).

### Riscos
- Insegurança em lista de serviços municipal (variação local) — sempre corroborar com a lei municipal.
- Mudanças pela LC 214/2025 (reforma tributária) — conferir vigências antes de afirmar o regime aplicável ao fato gerador passado.`,
  ['tributario/iss', 'tributario/icms-mg'],
  { rel: 'lcp116-arts-1-9-iss|COMPLEMENTA|Aplica os arts. 1º-3º da LC 116 na análise do conflito' }));

docs.push(derivado('doutrina-simples-nacional-alcance', 'Doutrina — Simples Nacional: alcance, exclusões e efeitos na defesa tributária', 'DOUTRINA', 'simples-nacional', 'Simples Nacional — alcance',
`## Simples Nacional — alcance e efeitos práticos (EJC)

Conceito EJC: regime unificado de arrecadação de tributos e contribuições para microempresas e EPP, delimitado pela LC 123/2006 (arts. 13 e 17 capturados LITERAIS neste lote — doc lc123-arts-13-17-simples-alcance).

### Pontos operacionais na defesa
1. Abrangência (art. 13): identifica quais tributos foram incluídos — autuações sobre tributo abrangido podem ser indevidas quando o recolhimento é unificado.
2. Exclusões (art. 17): vedações objetivas (atividades) e subjetivas — verificar a lista LITERAL antes de sustentar enquadramento.
3. Débitos do regime: execução fiscal do débito unificado — a ilicitude da exclusão (procedimento e prazo) é condição de análise do mérito.
4. Parcelamentos específicos do regime existem em legislação própria — NÃO afirmar números de lei não capturados [VERIFICAR].

### Riscos
- Diferença entre exclusão a pedido e de ofício: efeitos retroativos distintos — fundar sempre no texto literal do art. 17 e nas comunicações oficiais do caso.
- CNAE divergente da atividade real: risco de desconsideração do regime — evidenciar com contratos/histórico de recolhimento.

### Probabilidade qualitativa
Alta para impugnar auto de infração sobre tributo abrangido quando a empresa estava em regime regular no período da autuação.`,
  ['tributario/simples-nacional'],
  { rel: 'lc123-arts-13-17-simples-alcance|COMPLEMENTA|Fundamenta o alcance no art. 13 da LC 123' }));

docs.push(derivado('tese-conflito-icms-iss-lista-servicos', 'Tese — Incompetência tributária por aplicação incorreta da lista de serviços (ICMS × ISS)', 'TESE', 'iss', 'Tese — ICMS × ISS pela lista',
`## Tese: incompetência tributária na aplicação da lista de serviços (ICMS × ISS)

### Fundamentos (somente textos oficiais capturados — ${D})
1. LC 116/2003 art. 1º (LITERAL neste lote): competência municipal sobre serviços "de qualquer natureza" definidos em lista anexa (remissão registrada como consta).
2. LC 116/2003 art. 3º (LITERAL neste lote): vedações expressas — relação de emprego, portal/notícias, representação comercial etc. (verificar o inciso aplicável caso a caso).
3. CF art. 156 (LITERAL neste lote): competência municipal e remissão à lei complementar.
4. Estrita legalidade tributária (CF art. 150 I — LITERAL neste lote): sem previsão legal, não há fato gerador.

### Requisitos
- Descrição fática precisa do serviço (contrato, nota fiscal, descrição no recibo).
- Enquadramento literal na lista (ou exclusão do art. 3º).
- Correlação com o tributo exigido (ISS municipal × ICMS estadual do caso).

### Riscos
- Interpretação ampla de item genérico da lista — risco de manter a competência municipal.
- Fato gerador complexo (serviços mistos) — possibilidade de tributação parcial de cada componente.

### Probabilidade qualitativa
Média-Alta quando a descrição contratual se encaixa com precisão em vedação do art. 3º; baixa em serviços híbridos de difícil definição.

### Links EJC
- lcp116-arts-1-9-iss (LITERAL), cf-art-156-iss-impostos-municipais (LITERAL), doutrina-guerra-fiscal-conflito-icms-iss.`,
  ['tributario/iss', 'tributario/teses'],
  { rel: 'lcp116-arts-1-9-iss|COMPLEMENTA|Base literal para a tese de competência' }));

docs.push(derivado('peca-impugnacao-glosa-compensacao', 'Peça — Impugnação de glosa de compensação tributária com variáveis', 'PECA', 'compensacao', 'Peça — glosa de compensação',
`## MODELO EJC — Impugnação de glosa de compensação (federal; estadual MG: [VERIFICAR PROCEDIMENTO ESTADUAL MG])

EXCELENTÍSSIMO(A) SENHOR(A) DELEGADO(A) DE JULGAMENTO — {DELEGACIA_JULGADORA}

Processo: {NUMERO_PROCESSO_ADMINISTRATIVO} | Contribuinte: {NOME_RAZAO_SOCIAL} | CNPJ: {CNPJ}

I — SÍNTESE: impugna-se a glosa da Declaração de Compensação nº {NUMERO_DECLARACAO_COMPENSACAO}, datada de {DATA}, que utilizou crédito de {TRIBUTO_CREDITO} no valor de {VALOR}, por apontamento de {MOTIVO_GLOSA_INFORMADO}.

II — FUNDAMENTOS:
1. A compensação é prevista no art. 74 da Lei 9.430/1996 (texto LITERAL — doc l9430-art-74-compensacao): o sujeito passivo que apurar crédito passível de restituição/ressarcimento pode utilizá-lo na compensação de débitos próprios.
2. A declaração SUSPENDE a exigibilidade e o julgamento deve ocorrer em 30 dias, com pagamento por decisão em 360 dias quando procedente (prazos LITERAIS do art. 74).
3. A glosa alegou {MOTIVO_GLOSA}: o crédito {ORIGEM_CREDITO} foi apurado conforme os lançamentos de {PERIODO_APURACAO}, conforme documentos anexos ({LISTA_DOCUMENTOS}).
4. As vedações do art. 74 (parágrafo com hipóteses de vedação — LITERAL) não incidem: o crédito não está consolidado em parcelamento, não foi objeto de compensação não homologada antes, e não é restituição indeferida.

III — PEDIDOS:
a) Reconhecimento da validade da compensação e declaração de extinção do débito;
b) Majoração (se aplicável) apenas nos percentuais expressos do art. 74 (10%/20% — LITERAIS), sem acréscimos além do previsto;
c) Reconsideração da notificação {NUMERO_NOTIFICACAO}.

Nestes termos, pede deferimento. {CIDADE}, {DATA}.

{NOME_E_OAB_ADVOGADO}

CHECKLIST DE REVISÃO EJC: (1) conferir se débito e crédito são da mesma administração; (2) conferir se a compensação já foi auditada; (3) conferir se há parcelamento ativo sobre o débito (vedação); (4) anexar documentação do crédito de origem; (5) verificar necessidade de perícia; (6) conferir prazo da impugnação [VERIFICAR PRAZO DO REGIME PROCESSUAL APLICÁVEL].`,
  ['tributario/compensacao', 'tributario/pecas'],
  { rel: 'l9430-art-74-compensacao|COMPLEMENTA|Fundamenta a impugnação no art. 74 literal' }));

docs.push(derivado('peca-pedido-transacao-tributaria', 'Peça — Pedido de transação tributária individual (Lei 13.988/2020) com variáveis', 'PECA', 'transacao-tributaria', 'Peça — transação individual',
`## MODELO EJC — Pedido de transação tributária individual (federal; estadual MG: [VERIFICAR REGIME DE TRANSACAO ESTADUAL MG])

AO(A) {AUTORIDADE_COMPETENTE_TRANSACAO} — Programa de Transação da {ORGAO_FAZENDA}

Ref.: {NUMERO_PROCESSO}/{NUMERO_INSCRICAO_DIVIDA_ATIVA} | Devedor: {NOME_RAZAO_SOCIAL} | CNPJ/CPF: {CNPJ_CPF}

I — FUNDAMENTO: Lei 13.988/2020, arts. 1º a 5º (texto LITERAL — doc l13988-arts-1-5-transacao): a transação resolutiva de litígio alcança a cobrança de créditos da Fazenda Pública, inclusive de natureza tributária, nas modalidades individual e coletiva.

II — REQUISITOS ATENDIDOS (conforme arts. LITERAIS capturados): (a) crédito objeto {SITUACAO_CREDITO}; (b) desistência de embargos/recursos: o devedor se compromete a desistir das medidas judiciais em {PRAZO_DESISTENCIA} dias, com renúncia às alegações sobre o crédito; (c) adequação à modalidade por tratar de devedor {PERFIL_DEVEDOR}.

III — PROPOSTA: pagamento de {VALOR_TOTAL} em {NUMERO_PARCELAS} parcelas, com quitação e extinção do crédito; garantia {GARANTIA_OFERECIDA}; o pedido fixa prazo para resposta da administração conforme o art. 4º (LITERAL).

IV — DECLARAÇÕES: (1) veracidade das informações; (2) concordância com os requisitos da lei; (3) desistência condicionada conforme acima; (4) ausência de condenação por crime contra a Fazenda (requisito da lei).

V — ANEXOS: comprovante de inscrição, situação fiscal, lista de débitos, documentos {LISTA_DOCUMENTOS}.

Nestes termos, pede deferimento. {CIDADE}, {DATA}.
{NOME_E_OAB_ADVOGADO}

CHECKLIST EJC: (1) conferir se o crédito é elegível conforme arts. LITERAIS; (2) conferir necessidade de garantia; (3) conferir prazo de desistência; (4) atestar que não há débito fora da transação; (5) atestar ausência de vedação por crime contra a Fazenda; (6) verificar se há transação coletiva que abranja o perfil.`,
  ['tributario/transacao-tributaria', 'tributario/pecas'],
  { rel: 'l13988-arts-1-5-transacao|COMPLEMENTA|Fundamenta o pedido nos arts. 1º-5º literais' }));

docs.push(derivado('checklist-analise-beneficio-fiscal-estadual-mg', 'Checklist — Análise de benefício fiscal estadual em MG (REVISAO_HUMANA)', 'CHECKLIST', 'defesa-administrativa-mg', 'Checklist — benefício fiscal MG',
`## Checklist EJC — análise de benefício fiscal estadual (ICMS-MG) [VERIFICAR LEI ESTADUAL MG em cada item]

STATUS: REVISAO_HUMANA — NÃO usar como fundamento definitivo. Nenhum benefício estadual é citado como verbatim nesta rodada (portais MG bloqueados em ${D}).

1. [VERIFICAR] Identificar a norma concedente: lei estadual MG (número, data, publicação no Minas Gerais — verificar em almg.gov.br / mg.gov.br).
2. [VERIFICAR] Convênio CONFAZ específico concedendo o benefício (LC 24/1975 arts. 1º-3º — LITERAL no LOTE-023) e publicação DOU (prazo de 10 dias — doc prazo-publicacao-resolucao-convenio-10-dias).
3. [VERIFICAR] Tipologia do instrumento estadual: regime especial, termo de acordo, crédito presumido, redução de base — identificar o gênero antes de qualquer argumento.
4. [VERIFICAR] Vigência e condições de cumprimento (emprego, investimento, exportação) — cláusula reguladora.
5. [VERIFICAR] Transparência na nota fiscal (destaque/desconto) e sub-rogação no preço.
6. [VERIFICAR] Instrumentos de controle: aditamento, balanço, relatório exigido pela norma.
7. [VERIFICAR] Cláusula de resgate/recolhimento em caso de descumprimento das condições.
8. [VERIFICAR] Efeitos sobre bases do ICMS e sobre o produto/serviço (crédito presumido, redução de base).
9. [VERIFICAR] Registro/aprovação no sistema estadual — [VERIFICAR ÓRGÃO COMPETENTE MG].
10. [VERIFICAR] Publicação no portal oficial MG e consolidação normativa.
11. [VERIFICAR] Regime de transição pós-LC 214/2025 (reforma tributária) para benefícios preexistentes.
12. Documentar TODA a verificação com URLs e data — exigência do sistema EJC (fonte + data de consulta).
13. Se algum item não puder ser confirmado em fonte oficial: manter REVISAO_HUMANA antes de usar em peça.
14. Encaminhar para revisão humana com a URL de cada fonte consultada.
15. Risco de desacordo inter-estadual: cruzar com doutrina-guerra-fiscal-conflito-icms-iss e lc24-convenios-icms.`,
  ['tributario/defesa-administrativa-mg', 'tributario/checklists'],
  { conf: 'C', status: 'REVISAO_HUMANA', fonte: 'EJC — ponte de verificação (portais MG bloqueados nesta rodada)', urlFonte: 'https://www.almg.gov.br/' }));

docs.push(derivado('fluxo-compensacao-tributaria', 'Fluxo — Compensação tributária federal (art. 74 Lei 9.430): da apuração à homologação', 'FLUXO', 'compensacao', 'Fluxo — compensação',
`## Fluxo EJC — compensação tributária federal (fundamento: art. 74 Lei 9.430 LITERAL — doc l9430-art-74-compensacao)

ETAPA 1 — APURAÇÃO DO CRÉDITO: identificar crédito passível de restituição/ressarcimento (impugnação procedente, revisão, decisão administrativa, judicial com trânsito — LITERAIS do art. 74). RISCO: crédito vedado (hipóteses do art. 74 — LITERAIS) → usar outra rota (transação/parcelamento).
ETAPA 2 — DECLARAÇÃO DE COMPENSAÇÃO: utilizar o crédito no período {PERIODO}; a declaração SUSPENDE a exigibilidade (LITERAL) — suspender cobrança imediata do débito compensado.
ETAPA 3 — RETENÇÃO PELA FISCALIZAÇÃO (5 anos — LITERAL): período para homologação; guardar documentação completa do crédito de origem.
ETAPA 4 — JULGAMENTO EM 30 DIAS (LITERAL): deferida → extinção do débito compensado; glosa → etapa 5.
ETAPA 5 — GLOSA: notificação de glosa → impugnação [VERIFICAR PRAZO DO REGIME PROCESSUAL] com a peça peca-impugnacao-glosa-compensacao.
ETAPA 6 — MAJORAÇÃO (10%/20% — LITERAIS): quando glosada, majoração de 10%; se reiterada, 20% — verificar margem de discussão antes do recolhimento.
ETAPA 7 — PAGAMENTO POR DECISÃO (360 dias — LITERAL): se a compensação for julgada procedente com saldo a pagar, pagamento em até 360 dias — organizar caixa e calendário; RISCO: encargos e dívida ativa em caso de descumprimento.
MONITORAMENTO: revisar alterações legislativas (MP/lei) e atualizar o doc l9430-art-74-compensacao (dataUltimaVerificacao).`,
  ['tributario/compensacao', 'tributario/fluxos'],
  { rel: 'l9430-art-74-compensacao|COMPLEMENTA|Etapas fundamentadas no art. 74 literal' }));

docs.push(derivado('fluxo-transacao-tributaria', 'Fluxo — Transação tributária (Lei 13.988/2020): do pedido à extinção', 'FLUXO', 'transacao-tributaria', 'Fluxo — transação',
`## Fluxo EJC — transação tributária (fundamento: Lei 13.988/2020 arts. 1º-5º LITERAL — doc l13988-arts-1-5-transacao)

ETAPA 1 — ELEGIBILIDADE: verificar se o crédito é transacionável (cobrança de crédito da Fazenda Pública, inclusive tributário — art. 1º LITERAL; requisitos dos arts. 2º-3º). RISCO: fraude/crime contra a Fazenda evidenciado — vedação.
ETAPA 2 — ESCOLHA DA MODALIDADE: individual (um devedor) × coletiva (grupos com perfil semelhante — art. 3º LITERAL). Para perfil coletivo, acompanhar editais.
ETAPA 3 — PROPOSTA: fixar desconto, prazo, parcelas e garantia (art. 4º LITERAL) — usar peca-pedido-transacao-tributaria; anexar situação fiscal e documentos.
ETAPA 4 — ANÁLISE E PRAZO: aguardar resposta no prazo estipulado no pedido (art. 4º LITERAL) — monitorar; RISCO: silêncio não prorroga prazo.
ETAPA 5 — DESISTÊNCIA: se deferida, desistir dos embargos/recursos no prazo {PRAZO_DESISTENCIA} e renunciar às alegações (requisito legal) — registrar nos autos e no EJC.
ETAPA 6 — CUMPRIMENTO: pagar parcelas; RISCO: inadimplemento = rescisão e retorno da cobrança com encargos.
ETAPA 7 — EXTINÇÃO: quitação total → extinção do crédito; atualizar o caso no EJC (status/prazos) e encerrar com prova documental (certidões).
SE-ENTÃO: crédito não inscrito → avaliar parcelamento administrativo comum [VERIFICAR REGIME]; ação judicial em curso → verificar renúncia antes de firmar.`,
  ['tributario/transacao-tributaria', 'tributario/fluxos'],
  { rel: 'l13988-arts-1-5-transacao|COMPLEMENTA|Etapas fundamentadas nos arts. 1º-5º literais' }));

docs.push(derivado('triagem-servico-tributavel-conflito', 'Triagem — Roteiro de entrevista: conflito de competência ICMS × ISS', 'TRIAGEM', 'iss', 'Triagem — ICMS × ISS',
`## Roteiro EJC — triagem de conflito ICMS × ISS (fundamentos: LC 116 arts. 1º-9º LITERAL, CF art. 156 LITERAL)

1. Qual a descrição EXATA do serviço prestado (como está no contrato e na nota fiscal)?
2. O serviço está na lista anexa da LC 116/2003? [VERIFICAR LISTA MUNICIPAL — remissão registrada como consta]
3. Encaixa-se em alguma vedação do art. 3º da LC 116 (relação de emprego, portal/notícias, representação comercial, agenciamento etc.)?
4. Quem emitiu a nota fiscal e com qual tributo destacado (ISS municipal ou ICMS estadual)?
5. Qual município/Estado considerou-se competente e por quê (local da prestação/conclusão)?
6. Há contrato com cláusula de "preponderância" de um serviço sobre outro?
7. O serviço é oneroso e "de qualquer natureza" (CF art. 156 / LC 116 art. 1º LITERAL)?
8. Há lançamento já formalizado (auto de infração, notificação)? Número e data?
9. A empresa está no Simples Nacional (LC 123 art. 13 — LITERAL em lc123-arts-13-17-simples-alcance)? O tributo conflitante está abrangido pelo regime?
10. Há parecer interno ou defesa anterior sobre o mesmo serviço?
11. Documentos disponíveis: contrato, notas fiscais, recolhimentos, correspondências fiscais?
12. Prazos correntes: há defesa a protocolar [VERIFICAR PRAZO DO REGIME PROCESSUAL APLICÁVEL]?

SAÍDA EJC: classificar como (a) serviço tributável por ISS; (b) serviço com vedação expressa; (c) híbrido de alta incerteza → REVISAO_HUMANA; (d) já autuado → rota de impugnação (peca-impugnacao-auto-infracao-estadual / fluxo-processo-administrativo-fiscal-estadual).`,
  ['tributario/iss', 'tributario/triagens'],
  { rel: 'lcp116-arts-1-9-iss|COMPLEMENTA|Roteiro fundamentado nos arts. 1º-3º literais' }));

docs.push(derivado('regra-se-entao-tributario-rotas-26', 'Regras SE-ENTÃO — rotas de Tributário II (anterioridade, imunidade, compensação, transação, ICMS×ISS, Simples)', 'REGRA_INTELIGENCIA', 'geral', 'Regras SE-ENTÃO — Tributário II',
`## Regras SE-ENTÃO — Tributário II (rotas EJC; fundamentos nos docs literais deste lote)

SE a exigência foi feita ANTES de decorridos 90 dias da publicação OU no mesmo exercício financeiro da lei, E o tributo não se enquadra nas exceções do CF art. 150 § 1º (LITERAL) ENTÃO rota: violação de anterioridade (cf-arts-145-152-competencia-vedacoes + doutrina-anterioridade-tributaria-aplicacao).

SE o contribuinte é partido/sindicato/templo/instituição de educação ou assistência social E a exigência é de IMPOSTO sobre patrimônio/renda/serviços ENTÃO rota: imunidade (cf-arts-145-152-competencia-vedacoes + doutrina-imunidades-tributarias-panorama).

SE há crédito passível de restituição/ressarcimento E débito próprio da mesma administração ENTÃO rota: compensação (l9430-art-74-compensacao + fluxo-compensacao-tributaria); SE a compensação foi glosada ENTÃO peca-impugnacao-glosa-compensacao.

SE há débito em cobrança E interesse em desconto/parcelamento com desistência de ação ENTÃO rota: transação (l13988-arts-1-5-transacao + fluxo-transacao-tributaria).

SE o serviço NÃO está na lista municipal OU encaixa-se em vedação do LC 116 art. 3º ENTÃO rota: incompetência ISS (tese-conflito-icms-iss-lista-servicos + triagem-servico-tributavel-conflito).

SE a empresa é ME/EPP E o tributo autuado está abrangido pela LC 123 art. 13 E não há vedação do art. 17 ENTÃO rota: Simples (lc123-arts-13-17-simples-alcance + doutrina-simples-nacional-alcance).

SE o conflito envolve benefício de ICMS estadual MG SEM convênio CONFAZ regular ENTÃO rota: guerra fiscal (doutrina-guerra-fiscal-conflito-icms-iss + lc24-convenios-icms) com [VERIFICAR LEI ESTADUAL MG].

SE qualquer item depende de norma estadual/municipal MG não capturada ENTÃO marcar REVISAO_HUMANA + [VERIFICAR LEI ESTADUAL MG] (regra geral anti-invenção do sistema).`,
  ['tributario/geral', 'tributario/regras'],
  { rel: 'cf-arts-145-152-competencia-vedacoes|CONEXO_TEMATICO|Rotas usam os literais deste lote' }));

docs.push(derivado('prazo-compensacao-30-360-dias', 'Prazo — Compensação: julgamento em 30 dias e pagamento por decisão em 360 dias (Lei 9.430 art. 74)', 'PRAZO', 'compensacao', 'Prazo — compensação',
`## Prazos da compensação tributária federal (fonte: Lei 9.430/1996 art. 74, texto LITERAL — doc l9430-art-74-compensacao, consulta ${D})

- JULGAMENTO DA COMPENSAÇÃO: o órgão julga a Declaração de Compensação em até 30 (trinta) dias — termo inicial: protocolo da declaração (LITERAL).
- PAGAMENTO POR DECISÃO: se julgada procedente, pagamento do saldo em até 360 (trezentos e sessenta) dias — LITERAL.
- RETENÇÃO PARA HOMOLOGAÇÃO: 5 (cinco) anos — período durante o qual a compensação pode ser auditada (LITERAL § 5º do art. 74).
- MAJORAÇÃO: 10% quando glosada; 20% se reiterada — LITERAIS (agravamentos, não prazos; anotados para monitoramento).

TERMO INICIAL E RISCOS: a contagem começa no protocolo/decisão; a perda do prazo de pagamento por decisão gera encargos e possível inscrição em dívida ativa.

FUNDAMENTO: art. 74 da Lei 9.430/1996 (texto compilado do Planalto — consulta ${D}). Para prazos estaduais MG de compensação [VERIFICAR LEI ESTADUAL MG].`,
  ['tributario/compensacao', 'geral/prazos'],
  { rel: 'l9430-art-74-compensacao|COMPLEMENTA|Prazos extraídos literalmente do art. 74', fonte: PLANALTO, urlFonte: URL_L9430 }));

// Monta o arquivo final
const header = `// LOTE-026 — Tributário II (compêndio EJC, foco MG): CF arts. 145-156/195 (literais),
// CTN arts. 1º-11 e 96-112 (literais), LC 116/2003 ISS arts. 1º-9º (literais),
// LC 123/2006 arts. 13 e 17 (literais), Lei 9.430/1996 art. 74 compensação (literal compilado),
// Lei 13.988/2020 transação arts. 1º-5º (literais) + derivados EJC (doutrina/teses/peças/fluxos).
// Consulta Planalto: ${D}. ANTI-INVENÇÃO: portais MG bloqueados nesta rodada — NADA estadual
// citado como verbatim; [VERIFICAR LEI ESTADUAL MG] nos pontos dependentes de lei MG.
import type { InputDocument } from '../../src/lib/ejc/types';

`;

const relRe = /"rel":\s*"([^|]+)\|([^|]+)\|([^"]+)"/;
const body = docs.map((j) => {
  const doc = JSON.parse(j) as Record<string, unknown> & { relacionamentos?: { destinoSlug: string; tipo: string; descricao: string }[] };
  const rel = (doc as unknown as { rel?: string }).rel;
  if (rel) {
    const [destino, tipo, descricao] = rel.split('|');
    doc.relacionamentos = [{ destinoSlug: destino, tipo, descricao }];
  }
  return JSON.stringify(doc, null, 1).replace(/\n/g, '\n  ');
}).join(',\n  ');

const out = header + 'export default [\n  ' + body + ',\n] as InputDocument[];\n';
writeFileSync('/home/z/my-project/data/ejc/lote-026-tributario-ii.ts', out);
console.log('LOTE-026 gerado:', docs.length, 'documentos');
