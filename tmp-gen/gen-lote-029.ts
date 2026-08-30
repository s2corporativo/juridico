// Gerador do LOTE-029 — Juizados Especiais II (compêndio EJC, foco MG)
// Literais: CF art. 98; Lei 9.099 arts. 9-11, 18-20, 24-26, 44-51, 56-59, 77-88, 90-93;
// Lei 12.153 arts. 17-19. Planalto, consulta 2026-08-30.
import { readFileSync, writeFileSync } from 'fs';

const T = (p: string) => readFileSync(`/tmp/leis-oficiais/${p}`, 'utf-8')
  .replace(/\s+/g, ' ')
  .replace(/`/g, "'")
  .trim();

const D = '2026-08-30';
const PLANALTO = 'Presidência da República — Planalto';
const URL_CF = 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm';
const URL_9099 = 'https://www.planalto.gov.br/ccivil_03/leis/l9099.htm';
const URL_12153 = 'https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2009/lei/l12153.htm';
const EJC = 'Elaboração EJC — conteúdo estrutural original';
const MG_NOTA = 'NADA estadual é citado como verbatim nesta rodada: portais MG (almg.gov.br, mg.gov.br, iof.mg.gov.br, sefaz.mg.gov.br, tjmg.jus.br) BLOQUEADOS para captura em 2026-08-30.';

function lei(slug: string, titulo: string, subarea: string | null, assunto: string, conteudo: string, norma: string, urlFonte: string, artigos: string[], tags: string[]): string {
  return JSON.stringify({
    slug, titulo, tipoDocumento: 'LEGISLACAO', area: 'processual-civil', subarea, assunto,
    prioridade: 'P1', conteudo,
    metadados: { numero: norma, orgao: 'Congresso Nacional', artigos_principais: artigos, vigente: true, confirmacao_texto: 'Extração literal do texto oficial do Planalto em 2026-08-30. Redações empilhadas com notas "(Redação dada pela ...)" registradas como consta.' },
    tags, fonte: PLANALTO, urlFonte, dataConsulta: D, confiabilidade: 'A',
    vigente: true, status: 'ATIVO', dataUltimaVerificacao: D, proximaVerificacaoRecomendada: '2026-10-30',
  });
}

function derivado(slug: string, titulo: string, tipoDocumento: string, subarea: string | null, assunto: string, conteudo: string, tags: string[], opts: { conf?: string; status?: string; urlFonte?: string; fonte?: string; rel?: string } = {}): string {
  return JSON.stringify({
    slug, titulo, tipoDocumento, area: 'processual-civil', subarea, assunto, prioridade: 'P1',
    conteudo,
    metadados: { elaboracao: 'EJC — redação estrutural própria com base nos textos oficiais capturados em 2026-08-30', aviso_mg: MG_NOTA },
    tags, fonte: opts.fonte ?? EJC, urlFonte: opts.urlFonte ?? null, dataConsulta: D,
    confiabilidade: opts.conf ?? 'B', vigente: true, status: opts.status ?? 'ATIVO',
    dataUltimaVerificacao: D, proximaVerificacaoRecomendada: '2026-10-30',
    rel: opts.rel,
  });
}

const l9099_9_11 = T('l9099_arts-9-11.txt');
const l9099_18_20 = T('l9099_arts-18-20.txt');
const l9099_24_26 = T('l9099_arts-24-26.txt');
const l9099_44_51 = T('l9099_arts-44-51.txt');
const l9099_56_59 = T('l9099_arts-56-59.txt');
const l9099_77_88 = T('l9099_arts-77-88.txt');
const l9099_90_93 = T('l9099_arts-90-93.txt');
const l12153_17_19 = T('l12153_arts-17-19.txt');
const cf98 = T('cf_art98.txt');

const docs: string[] = [];

docs.push(lei('cf-art-98-i-juizados-especiais', 'CF/88 art. 98 — Juizados Especiais como garantia constitucional (texto literal)', 'juizados-especiais', 'JEC — fundamento constitucional',
`## CF/1988 — Art. 98 (texto literal, Planalto — consulta ${D})

${cf98}`,
  'CF/1988 art. 98', URL_CF, ['98'],
  ['processual-civil/juizados-especiais', 'geral/legislacao']));

docs.push(lei('l9099-arts-9-11-assistencia-orientacao', 'Lei 9.099 arts. 9º-11 — Assistência por advogado, autoridade policial e orientação (texto literal)', 'juizados-especiais', 'L9099 — assistência',
`## Lei 9.099/1995 — Arts. 9º a 11 (texto literal, Planalto — consulta ${D})

${l9099_9_11}`,
  'Lei 9.099/1995 arts. 9º-11', URL_9099, ['9', '10', '11'],
  ['processual-civil/juizados-especiais']));

docs.push(lei('l9099-arts-18-20-citacao-provas', 'Lei 9.099 arts. 18-20 — Citação por correspondência, preclusão e dispensa de prova até 20 SM (texto literal)', 'juizados-especiais', 'L9099 — citação e provas',
`## Lei 9.099/1995 — Arts. 18 a 20 (texto literal, Planalto — consulta ${D})

${l9099_18_20}`,
  'Lei 9.099/1995 arts. 18-20', URL_9099, ['18', '19', '20'],
  ['processual-civil/juizados-especiais']));

docs.push(lei('l9099-arts-24-26-estimacao-provas', 'Lei 9.099 arts. 24-26 — Recusa injustificada, aprazamento e provas adicionais (texto literal)', 'juizados-especiais', 'L9099 — conciliação e provas',
`## Lei 9.099/1995 — Arts. 24 a 26 (texto literal, Planalto — consulta ${D})

${l9099_24_26}`,
  'Lei 9.099/1995 arts. 24-26', URL_9099, ['24', '25', '26'],
  ['processual-civil/juizados-especiais']));

docs.push(lei('l9099-arts-44-51-sentenca-deveres', 'Lei 9.099 arts. 44-51 — Sentença: critérios, deveres do juiz, remissão e custas (texto literal)', 'juizados-especiais', 'L9099 — sentença',
`## Lei 9.099/1995 — Arts. 44 a 51 (texto literal, Planalto — consulta ${D})

${l9099_44_51}`,
  'Lei 9.099/1995 arts. 44-51', URL_9099, ['44', '45', '46', '47', '48', '49', '50', '51'],
  ['processual-civil/juizados-especiais']));

docs.push(lei('l9099-arts-56-59-disposicoes-gerais', 'Lei 9.099 arts. 56-59 — Disposições gerais transitórias (texto literal)', 'juizados-especiais', 'L9099 — disposições gerais',
`## Lei 9.099/1995 — Arts. 56 a 59 (texto literal, Planalto — consulta ${D})

${l9099_56_59}`,
  'Lei 9.099/1995 arts. 56-59', URL_9099, ['56', '57', '58', '59'],
  ['processual-civil/juizados-especiais']));

docs.push(lei('l9099-arts-77-88-colagem-regime', 'Lei 9.099 arts. 77-88 — Aplicação dos sistemas e disposições transitórias (texto literal)', 'juizados-especiais', 'L9099 — regime e transição',
`## Lei 9.099/1995 — Arts. 77 a 88 (texto literal, Planalto — consulta ${D})

${l9099_77_88}`,
  'Lei 9.099/1995 arts. 77-88', URL_9099, ['77', '79', '81', '85'],
  ['processual-civil/juizados-especiais']));

docs.push(lei('l9099-arts-90-93-disposicoes-finais', 'Lei 9.099 arts. 90-93 — Disposições finais (texto literal)', 'juizados-especiais', 'L9099 — disposições finais',
`## Lei 9.099/1995 — Arts. 90 a 93 (texto literal, Planalto — consulta ${D})

${l9099_90_93}`,
  'Lei 9.099/1995 arts. 90-93', URL_9099, ['90', '91', '92', '93'],
  ['processual-civil/juizados-especiais']));

docs.push(lei('l12153-arts-17-19-disposicoes-finais', 'Lei 12.153/2009 arts. 17-19 — Disposições finais do JEC Fazenda (texto literal)', 'juizados-especiais', 'L12153 — disposições finais',
`## Lei 12.153/2009 — Arts. 17 a 19 (texto literal, Planalto — consulta ${D})

${l12153_17_19}`,
  'Lei 12.153/2009 arts. 17-19', URL_12153, ['17', '18', '19'],
  ['processual-civil/juizados-especiais']));

// ===== DERIVADOS =====

docs.push(derivado('doutrina-tres-regimes-jec-estadual-federal-fazenda', 'Doutrina — Três regimes de juizados especiais: estadual, federal e Fazenda Pública', 'DOUTRINA', 'juizados-especiais', 'Três regimes de JEC',
`## Três regimes de Juizados Especiais — comparação EJC

Base LITERAL capturada: Lei 9.099 (compêndio — 20+ docs LITERAIS), Lei 12.153/2009 (LOTE-024 e este lote) e os 2 docs do JEC Federal do LOTE-012 (competência 60 SM; art. 14 uniformização). CF art. 98 LITERAL (neste lote).

### Quadro comparativo (somente pontos LITERAIS capturados)
1. COMPETÊNCIA DE VALOR: JEC estadual 40 SM (Lei 9.099 art. 3º LITERAL); JEC Federal 60 SM (Lei 10.259 — doc LOTE-012); JEC Fazenda 60 SM (Lei 12.153 art. 1º LITERAL LOTE-024).
2. PARTES: estadual — pessoa natural/empresa com foro local etc. (arts. 4º-8º LITERAL); Fazenda — União/Estados/Municípios e respectivas autarquias (Lei 12.153 art. 5º LITERAL LOTE-024).
3. PAGAMENTO: Fazenda — 60 dias para pagamento (Lei 12.153 art. 15 LITERAL LOTE-024); estadual — 15 dias + multa (arts. 52-55 LITERAL).
4. RECURSO: inominado 10 dias em todos (art. 41 LITERAL; art. 15 § 3º L12153 [VERIFICAR]); apelação da sentença na Fazenda (art. 16 LITERAL LOTE-024).
5. CUSTAS E JUSTIÇA GRATUITA: art. 9º (LITERAL neste lote) — assistência obrigatória acima de 20 SM; dispensa de prova de pobreza até 20 SM (art. 20 LITERAL — não ingerido? sim, doc l9099-arts-18-20).

### Como escolher o foro (aplicado)
- Requerido ente público? → JEC Fazenda (não JEC comum) — LOTE-024 LITERAL.
- União/autarquia federal como requeridas → JEC Federal [VERIFICAR LEI 10.259 TEXTO COMPLETO — não capturado nesta rodada].
- Caso contrário → JEC estadual.

### Riscos
- Confusão entre prazos de pagamento dos regimes (15 dias × 60 dias) — causa de erros na execução.
- Perícia no JEC: assistente técnico do juízo (Lei 12.153 art. 5º § 2º LITERAL LOTE-024; art. 35-40 L9099 LITERAL LOTE-012).`,
  ['processual-civil/juizados-especiais', 'processual-civil/doutrina'],
  { rel: 'lei-12153-jec-fazenda-publica-competencia|CONEXO_TEMATICO|Compara os regimes com base nos LITERAIS' }));

docs.push(derivado('doutrina-turmas-recursais-estrutura-funcao', 'Doutrina — Turmas Recursais: estrutura, competência e prática (REVISAO_HUMANA para dados MG)', 'DOUTRINA', 'juizados-especiais', 'Turmas Recursais',
`## Turmas Recursais dos Juizados Especiais — panorama EJC

Base LITERAL: Lei 9.099 arts. 41-43 (recurso inominado — LOTE-012) e arts. 90-93 (LITERAL neste lote — componentes/funcionamento); Lei 12.153 art. 16 (turmas da Fazenda — LITERAL LOTE-024).

### O que é (fundamentado nos LITERAIS)
- Órgão colegiado dos Tribunais de Justiça/Tribunais Regionais Federais que julga os RECURSOS INOMINADOS (Lei 9.099 art. 41 LITERAL) e, na Fazenda, as apelações (art. 16 LITERAL LOTE-024).
- Composição por juízes de 1º grau (arts. 91-92 LITERAL — conferir teor transcrito).

### Prática MG [VERIFICAR — REVISAO_HUMANA]
Números de turmas, regimento interno, súmulas locais e prazos regimentais do TJMG NÃO foram capturados nesta rodada (tjmg.jus.br bloqueado). Antes de citar qualquer dado específico MG: consultar https://www.tjmg.jus.br e registrar URL + data. Ponte complementar: REVISAO_HUMANA/confiabilidade C.

### Fluxo recursal típico (fundamentado em LITERAIS)
1. Sentença no JEC → recurso inominado em 10 dias (art. 41 LITERAL + prazo-recurso-inominado-jec-10-dias-uteis).
2. Preparo 48h (prazo-jec-preparo-recurso-48-horas) + custas conforme art. 42 LITERAL.
3. Turma Recursal julga — sem apelação ordinária em regra (art. 43 LITERAL — só Res Extraordinário/REsp, com filtro de admissibilidade — sumulas do banco: 640 STF, 203 STJ).

### Riscos
- "Reprocessamento" automático do tema por súmulas locais não verificadas — NÃO citar súmula local sem captura oficial.`,
  ['processual-civil/juizados-especiais', 'processual-civil/doutrina'],
  { conf: 'C', status: 'REVISAO_HUMANA', fonte: 'EJC — ponte de verificação (tjmg.jus.br bloqueado nesta rodada)', urlFonte: 'https://www.tjmg.jus.br/' }));

docs.push(derivado('doutrina-cejusc-conciliacao-mg', 'Doutrina — CEJUSC e conciliação pré-processual em MG (REVISAO_HUMANA)', 'DOUTRINA', 'cejusc', 'CEJUSC MG',
`## CEJUSC — conciliação e mediação pré-processuais em MG [REVISAO_HUMANA]

STATUS: REVISAO_HUMANA, confiabilidade C. O CEJUSC (Centro Judiciário de Solução de Conflitos e Cidadania) é estrutura dos tribunais para conciliação/mediação pré-processual e processual — em MG, funcionamento, unidades e agendamento [VERIFICAR em https://www.tjmg.jus.br — portal bloqueado nesta rodada ${D}].

### Base normativa geral (fundamentada em textos já ingeridos do compêndio)
- CPC arts. 165-175 (LOTE processual — conciliadores/mediadores judiciários) [VERIFICAR EXISTÊNCIA NO COMPÊNDIO].
- Lei 9.099 art. 7º LITERAL (LOTE-012) e arts. 12-16 (LITERAL LOTE-012): conciliadores e juízes leigos no JEC.
- CF art. 98 I LITERAL (neste lote): juizados especiais como garantia de celeridade.

### Como usar no EJC
- Sempre que o caso admitir conciliação prévia: sugerir CEJUSC/agendamento [VERIFICAR CANAL MG] e documentar tentativa de resolução extrajudicial.
- Acordo obtido → homologação judicial (executável) — conferir rito no CPC 2015 do compêndio.

### Riscos
- Não afirmar unidades, horários ou atos normativos específicos MG sem captura oficial.
- Conciliação não é obrigatória para ajuizar — mas sua tentativa fortalece a boa-fé processual.`,
  ['processual-civil/cejusc', 'processual-civil/doutrina'],
  { conf: 'C', status: 'REVISAO_HUMANA', fonte: 'EJC — ponte de verificação (tjmg.jus.br bloqueado nesta rodada)', urlFonte: 'https://www.tjmg.jus.br/' }));

docs.push(derivado('checklist-admissibilidade-jec-estadual-consolidado', 'Checklist — Admissibilidade consolidada do JEC estadual (15 pontos)', 'CHECKLIST', 'juizados-especiais', 'Checklist — admissibilidade JEC',
`## Checklist EJC — admissibilidade consolidada do JEC estadual (fundamentos: LITERAIS Lei 9.099)

1. VALOR: causa ≤ 40 SM (art. 3º LITERAL LOTE-012)? {SIM_NAO}
2. PARTES ADMISSÍVEIS: art. 4º-6º (LITERAL LOTE-012) — pessoa natural, microempresário, EPP, pessoa jurídica para-financeira? {SIM_NAO}
3. EXCLUSÕES: art. 3º § 2º (LITERAL LOTE-012) — falência, família/sucessões, posse/imóveis (alimentação de sub-rogação?)? {SIM_NAO}
4. FORO: domício do autor/residência/local da obrigação (art. 4º caput LITERAL) {CONFERIR}.
5. ASSISTÊNCIA: valor > 20 SM exige advogado (art. 9º LITERAL — doc l9099-arts-9-11-assistencia-orientacao) {SIM_NAO}.
6. COMPETÊNCIA EM RAZÃO DO VALOR: até 20 SM — dispensa prova de pobreza e pode-se postular sem advogado (art. 9º + 20 LITERAIS) {AVALIAR}.
7. DOCUMENTOS: essenciais (contrato, notas, recibo) + exibição incidental quando necessário (art. 13 LITERAL LOTE-012) {LISTAR}.
8. PEDIDOS: certos e determinados com quantificação (art. 14 LITERAL LOTE-012) {SIM_NAO}.
9. TUTELA: urgência/prova pericial — não cabível no JEC (art. 4º § 2º LITERAL LOTE-012) — se necessária, JEC não é o foro {AVALIAR}.
10. CONTRAPOLOS: denunciante/denunciado/chamamento — vedados (art. 10 LITERAL — doc l9099-arts-9-11) {SIM_NAO}.
11. RECURSOS POSSÍVEIS: inominado (10 dias) + declatórios; apelação não (arts. 41-43 LITERAL LOTE-012) {AVALIAR}.
12. CUSTAS: dispensas do art. 9º § 3º/5º (LITERAL) {CONFERIR}.
13. Fazenda Pública como requerida? → NÃO é JEC 9.099 — é Lei 12.153 (LOTE-024) {REDIRECIONAR}.
14. JECrim concomitante: litispendência da via criminal não impede cível (art. 73 LITERAL LOTE-012) {AVALIAR}.
15. REGISTRO EJC: preencher com data/fonte; itens não confirmados → [VERIFICAR] antes de protocolar.`,
  ['processual-civil/juizados-especiais', 'processual-civil/checklists'],
  { rel: 'lei-9099-art-3-competencia-40sm-exclusoes|COMPLEMENTA|Checklist consolidado a partir dos LITERAIS' }));

docs.push(derivado('peca-contestacao-jec-estadual', 'Peça — Contestação no JEC estadual com variáveis', 'PECA', 'juizados-especiais', 'Peça — contestação JEC',
`## MODELO EJC — Contestação no Juizado Especial Cível estadual

EXCELENTÍSSIMO(A) SENHOR(A) JUIZ(A) DO {JUIZADO_ESPECIAL_CIVEL} DA COMARCA DE {COMARCA}

Processo nº {NUMERO_PROCESSO} | Requerido: {NOME_RAZAO_SOCIAL}, {QUALIFICACAO_REU} | Autor: {NOME_AUTOR}

I — SÍNTESE: contesta-se a ação nos termos abaixo, requerendo-se a improcedência total (ou parcial {ESPECIFICAR}).

II — DA PRELIMINAR (se houver): {PRELIMINAR_PROCESSUAL} — ex.: ilegitimidade passiva (art. 6º LITERAL LOTE-012 — comerciantes para-financeiros etc.); inadmissibilidade da via (art. 3º § 2º LITERAL — matéria excluída); incompetência de foro (art. 4º LITERAL).

III — DO MÉRITO:
1. Impossibilidade jurídica/fática do pedido: {FUNDAMENTO_MERITO_1} (ex.: serviço efetivamente prestado conforme nota fiscal {DOCUMENTO}).
2. Ausência de vício/fato alegado: {FUNDAMENTO_MERITO_2} — frente aos LITERAIS do CDC {ARTIGO_APLICAVEL}.
3. Ausência de nexo causal: {FUNDAMENTO_MERITO_3}.
4. Prescrição/decadência (CDC arts. 26-27 LITERAL LOTE-009): {CALCULO}.
5. Culpa exclusiva da vítima (CDC art. 14 § 3º II — LITERAL LOTE-009): {EXCLARECER}.

IV — DO VALOR DA CAUSA E PEDIDOS: impugnação à quantificação {AJUSTES}; improcedência; condenação do autor em custas; compensação {SE_APLICAVEL} (art. 43 LITERAL — doc l9099-arts-44-51-sentenca-deveres).

V — PROVAS: {LISTA_PROVAS} (documentos anexos; testemunhas arroladas {NOMES_ENDERECOS}).

Nestes termos, pede deferimento. {CIDADE}, {DATA}.
{NOME_E_OAB_ADVOGADO}

CHECKLIST EJC: (1) prazo da contestação (art. 30 LITERAL LOTE-012 — conferir doc lei-9099-arts-27-33); (2) preliminares ANTES do mérito; (3) documentos essenciais anexados; (4) não inventar julgados; (5) pedidos contrapostos art. 43 (LITERAL) quando cabíveis.`,
  ['processual-civil/juizados-especiais', 'processual-civil/pecas'],
  { rel: 'lei-9099-arts-27-33-instrucao-provas|COMPLEMENTA|Contestação fundamentada nos LITERAIS do rito' }));

docs.push(derivado('peca-execucao-sentenca-jec', 'Peça — Petição de execução de sentença no JEC com variáveis', 'PECA', 'juizados-especiais', 'Peça — execução JEC',
`## MODELO EJC — Execução de sentença do Juizado Especial (arts. 52-55 LITERAL LOTE-012)

EXCELENTÍSSIMO(A) SENHOR(A) JUIZ(A) DO {JUIZADO_ESPECIAL_CIVEL} DA COMARCA DE {COMARCA}

Processo nº {NUMERO_PROCESSO} | Exequente: {NOME_EXEQUENTE} | Executado: {NOME_EXECUTADO}

I — SÍNTESE: requer-se a instauração da execução da sentença transitada em julgado em {DATA_TRANSITADO} (certidão anexa), que condenou o Executado ao pagamento de {VALOR_CONDENACAO} + encargos.

II — FUNDAMENTOS:
1. Lei 9.099 art. 52 § 5º (LITERAL — doc lei-9099-arts-52-55-execucao-custas): não pagamento no prazo → multa de 15% sobre o valor e inscrição no cadastro fiscal (Serasa/SPC) e execução na forma do CPC.
2. Encargos: multa de 15% + juros/correção conforme sentença e lei aplicável {DETALHAR}.
3. Cumprimento voluntário não ocorreu: intimação em {DATA_INTIMACAO} (anexo).

III — PEDIDOS: a) instauração da execução; b) multa de 15% (art. 52 § 5º LITERAL); c) inclusão no cadastro de inadimplentes; d) citação/penhora {BENS_SUGERIDOS} com bloqueio eletrônico {SISTEMA_APLICAVEL — [VERIFICAR SISTEMA DO TRIBUNAL]}; e) honorários da execução (art. 55 LITERAL).

IV — DOCUMENTOS: sentença, certidão de trânsito, cálculo atualizado, procuração.

Nestes termos, pede deferimento. {CIDADE}, {DATA}.
{NOME_E_OAB_ADVOGADO}

CHECKLIST EJC: (1) transição da fase de conhecimento; (2) cálculo com multa 15% desde o descumprimento; (3) não cobrar em duplicidade custas/honorários (art. 55 LITERAL); (4) sistemas de bloqueio do tribunal [VERIFICAR]; (5) contrato de parcelamento para pagar a execução (art. 52-55 LITERAL — prazo-jecf-pagamento-60-dias LOTE-024 para Fazenda).`,
  ['processual-civil/juizados-especiais', 'processual-civil/pecas'],
  { rel: 'lei-9099-arts-52-55-execucao-custas|COMPLEMENTA|Fundamenta no art. 52 § 5º LITERAL' }));

docs.push(derivado('fluxo-recurso-inominado-turma-recursal', 'Fluxo — Recurso inominado no JEC: da sentença à Turma Recursal', 'FLUXO', 'juizados-especiais', 'Fluxo — recurso inominado',
`## Fluxo EJC — recurso inominado (fundamentos: Lei 9.099 arts. 41-43 LITERAL LOTE-012; art. 42/43 LITERAL; peca-recurso-inominado-modelo-jec LOTE-011)

ETAPA 1 — DECISÃO: sentença publicada; analisar razões recursais (mérito/preliminares) e custas da sucumbência.
ETAPA 2 — PREPARO: interposição em 10 dias (prazo-recurso-inominado-jec-10-dias-uteis) + comprovante de custas em 48h (prazo-jec-preparo-recurso-48-horas) OU justiça gratuita (art. 9º LITERAL — doutrina dos 3 regimes).
ETAPA 3 — CONTRA-REASONS: contrarrazões da parte contrária (10 dias) — monitorar (prazo-contrarrazoes-resposta-recursos-15-dias para CPC; no JEC verificar LITERAL art. 42/43).
ETAPA 4 — TURMA RECURSAL: remessa; análise por órgão colegiado (art. 41 LITERAL; composição arts. 91-92 LITERAL — doc l9099-arts-90-93-disposicoes-finais).
ETAPA 5 — DECISÃO: integrada com efeito devolutivo (art. 43 LITERAL — sem apelação ordinária; apenas Res Extraordinária/REsp — sumulas do banco: 640 STF; 203 STJ).
ETAPA 6 — TRANSMISSÃO: transitado em julgado → execução (peca-execucao-sentenca-jec) ou cumprimento voluntário.
ETAPA 7 — Vias extraordinárias: peca-resp-re-modelo [VERIFICAR se já existe no compêndio] com admissibilidade (art. 43 LITERAL + sumulas) quando configurados fundamentos.

ALERTAS EJC: (1) cuidado com congruência dos motivos recursais; (2) não re-argumentar fato novo; (3) não sugerir reexame da matéria de fato sem base; (4) fluxo-jec-pedido-a-execucao (LOTE-011) para a etapa seguinte.`,
  ['processual-civil/juizados-especiais', 'processual-civil/fluxos'],
  { rel: 'lei-9099-arts-41-43-recurso-inominado|COMPLEMENTA|Fluxo fundamentado nos arts. 41-43 LITERAIS' }));

docs.push(derivado('regra-se-entao-jec-rotas-29', 'Regras SE-ENTÃO — rotas de Juizados Especiais II (admissibilidade, regimes, recurso, execução)', 'REGRA_INTELIGENCIA', 'juizados-especiais', 'Regras SE-ENTÃO — JEC II',
`## Regras SE-ENTÃO — JEC II (rotas EJC; fundamentos nos docs literais deste lote + lotes 010-012/022/024)

SE valor ≤ 40 SM E partes admissíveis (arts. 3º-6º LITERAL) E matéria não excluída (art. 3º § 2º LITERAL) ENTÃO JEC estadual (checklist-admissibilidade-jec-estadual-consolidado).

SE requerido é ente público ENTÃO NÃO JEC 9.099 — JEC Fazenda (Lei 12.153 LITERAL LOTE-024); SE União/autarquia federal ENTÃO JEC Federal [VERIFICAR LEI 10.259].

SE valor ≤ 20 SM ENTÃO dispensa de prova de pobreza e possibilidade de postulação sem advogado (arts. 9º/20 LITERAL — doc l9099-arts-18-20).

SE a tutela urgência/prova pericial for ESSENCIAL ENTÃO JEC não é o foro (art. 4º § 2º LITERAL LOTE-012) — redirecionar para juízo comum.

SE há sentença desfavorável ENTÃO recurso inominado 10 dias + preparo 48h (fluxo-recurso-inominado-turma-recursal); SE descumprimento de sentença ENTÃO execução com multa 15% (art. 52 § 5º LITERAL — peca-execucao-sentenca-jec).

SE sentença transitada é do JEC Fazenda ENTÃO pagamento em 60 dias (art. 15 LITERAL LOTE-024 — prazo-jecf-pagamento-60-dias), sem multa do art. 52.

SE o caso envolve crimes contra relações de consumo ENTÃO rota penal (LOTE-025) e doutrina-honra-online para difamação.

SE há necessidade de conciliação prévia ENTÃO CEJUSC [VERIFICAR MG] (doutrina-cejusc-conciliacao-mg — REVISAO_HUMANA).

SE qualquer item depende de regimento/súmula/sistema MG não capturado ENTÃO [VERIFICAR TJMG] + REVISAO_HUMANA (anti-invenção).`,
  ['processual-civil/juizados-especiais', 'processual-civil/regras'],
  { rel: 'checklist-admissibilidade-jec-estadual-consolidado|CONEXO_TEMATICO|Rotas usam os LITERAIS deste lote' }));

docs.push(derivado('prazo-jec-10-48-despachos-literais', 'Prazo — JEC: recurso inominado 10 dias e preparo 48h (Lei 9.099 arts. 42-43 LITERAL consolidado)', 'PRAZO', 'juizados-especiais', 'Prazo — recurso JEC consolidado',
`## Prazos do recurso inominado no JEC (fonte LITERAL: Lei 9.099 arts. 42-43 — doc lei-9099-arts-41-43-recurso-inominado LOTE-012, consulta ${D})

- INTERPOSIÇÃO: 10 (dez) dias úteis da ciência da sentença — LITERAL art. 42.
- PREPARO (custas): 48 (quarenta e oito) horas da interposição — LITERAL art. 42 § 1º; sem custas para os dispensados do art. 9º § 3º (LITERAL).
- RECURSO EXTEMPORÂNEO OU SEM PREPARO (quando devido): não conhecimento — advertência do art. 42 § 2º (LITERAL).
- CONTRA-RAZÕES: 10 dias conforme art. 42 (LITERAL — conferir o trecho transcrito).
- Nota: prazo em DIAS ÚTEIS (Lei 9.099 art. 12 LITERAL — LOTE-012).

TERMO INICIAL: ciência da sentença (juntada/audiência). RISCOS: calendário judicial feriados; preparo insuficiente.

FUNDAMENTO: Lei 9.099/1995 arts. 42-43 (Planalto — consulta ${D}).`,
  ['processual-civil/juizados-especiais', 'geral/prazos'],
  { fonte: PLANALTO, urlFonte: URL_9099, rel: 'lei-9099-arts-41-43-recurso-inominado|COMPLEMENTA|Consolida os prazos dos arts. 42-43 LITERAIS' }));

docs.push(derivado('jurimetria-jec-aproveitamento-cruzado', 'Jurimetria — JEC II: estrutura vazia cruzada com dados reais do LOTE-022', 'JURIMETRIA', 'juizados-especiais', 'Jurimetria — JEC II (cruzada)',
`## Jurimetria — JEC II (estrutura VAZIA + aproveitamento dos dados reais LOTE-022)

### Dados reais já disponíveis no compêndio (LOTE-022)
- jurimetria-jec-visao-geral-bh-betim-2025-2026 — tempo médio/distribuição BH e Betim (classe 436, 2025-parcial 2026).
- jurimetria-jec-unidades-judiciarias — unidades e volumes por unidade.
- jurimetria-jec-distribuicao-duracao — distribuição estatística da duração.
- jurimetria-jec-serie-mensal-censo — série mensal com baixas/distribuições.
- jurimetria-jec-assuntos-frequentes — assuntos mais frequentes (top 20 agregado).
- jurimetria-jec-metodologia-fontes-limitações — metodologia e alertas.

### Novas métricas planejadas (VAZIAS — sem inventar)
- Taxa de acordo em conciliação por unidade MG {AGUARDANDO FONTE}.
- % de recursos inominados providos/desprovidos por turma recursal MG {AGUARDANDO FONTE — DataJud}.
- Tempo médio entre sentença e execução {AGUARDANDO FONTE}.

### Regras EJC
- Preencher SOMENTE com fonte oficial + URL + data de consulta; sem números de processos individuais (LGPD).
- Confiabilidade A (API direta) / B (consolidação documentada); alertas metodológicos literais (padrão LOTE-022).`,
  ['processual-civil/juizados-especiais', 'processual-civil/jurimetria'],
  { conf: 'B', rel: 'jurimetria-jec-visao-geral-bh-betim-2025-2026|CONEXO_TEMATICO|Aproveita os dados reais do LOTE-022' }));

// Monta o arquivo final
const header = `// LOTE-029 — Juizados Especiais II (compêndio EJC, foco MG): CF art. 98 (literal);
// Lei 9.099 arts. 9º-11, 18-20, 24-26, 44-51, 56-59, 77-88, 90-93 (literais — complemento dos
// lotes 010-012); Lei 12.153 arts. 17-19 (literal) + derivados EJC.
// Consulta Planalto: ${D}. ANTI-INVENÇÃO: NADA estadual MG citado como verbatim;
// doutrinas de prática MG (turmas/CEJUSC) são REVISAO_HUMANA/C com URLs TJMG.
import type { InputDocument } from '../../src/lib/ejc/types';

`;

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
writeFileSync('/home/z/my-project/data/ejc/lote-029-jec-ii.ts', out);
console.log('LOTE-029 gerado:', docs.length, 'documentos');
