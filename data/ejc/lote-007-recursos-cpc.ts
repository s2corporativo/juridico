// LOTE-007 — Sistema Recursal do CPC/2015 (P1) — textos LITERAIS extraídos do Planalto em 2026-08-30
// Lei 13.105/2015 (CPC): arts. 994-995, 1.003 (red. Lei 14.939/2024 no § 6º), 1.009-1.010, 1.013,
// 1.021, 1.022-1.026, 1.029. Complementa o doc existente prazo-apelacao-cpc-15-dias-uteis (sem duplicar).
import type { InputDocument } from '../../src/lib/ejc/types';

const D = '2026-08-30';
const PLANALTO = 'Presidência da República — Planalto';
const EJC = 'Elaboração EJC — conteúdo estrutural original';
const URL_CPC = 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105.htm';

function lei(
  slug: string, titulo: string, assunto: string,
  conteudo: string, artigos: string[],
  extra?: Partial<InputDocument>,
): InputDocument {
  return {
    slug, titulo, tipoDocumento: 'LEGISLACAO', area: 'processual-civil', subarea: 'recursos',
    assunto, prioridade: 'P1',
    conteudo,
    metadados: { numero: 'Lei 13.105/2015 (CPC)', data_norma: '2015-03-16', orgao: 'Congresso Nacional', artigos_principais: artigos, vigente: true, confirmacao_texto: 'Extracao literal do texto oficial do Planalto em 2026-08-30.' },
    tags: ['processual-civil/recursos'],
    fonte: PLANALTO,
    urlFonte: URL_CPC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-11-30',
    ...extra,
  };
}

export default [
  lei(
    'cpc-arts-994-995-rol-recursos-efeitos',
    'CPC arts. 994 e 995 — Rol taxativo dos nove recursos e regime de efeitos (textos literais confirmados)',
    'Rol dos recursos cabíveis e efeitos da interposição',
    `## Ficha da Norma
- **Norma:** Lei nº 13.105/2015 (CPC), arts. 994 e 995.
- **Vigência:** vigente.

## Textos CONFIRMADOS LITERALMENTE no Planalto (consulta ${D})
"Art. 994. São cabíveis os seguintes recursos:
I - apelação;
II - agravo de instrumento;
III - agravo interno;
IV - embargos de declaração;
V - recurso ordinário;
VI - recurso especial;
VII - recurso extraordinário;
VIII - agravo em recurso especial ou extraordinário;
IX - embargos de divergência.
Art. 995. Os recursos não impedem a eficácia da decisão, salvo disposição legal ou decisão judicial em sentido diverso.
Parágrafo único. A eficácia da decisão recorrida poderá ser suspensa por decisão do relator, se da imediata produção de seus efeitos houver risco de dano grave, de difícil ou impossível reparação, e ficar demonstrada a probabilidade de provimento do recurso."

## Interpretação aplicada
- Rol TAXATIVO: só esses nove recursos; pedidos "atípicos" não têm cabimento.
- REGRA: recursos NÃO têm efeito suspensivo automático — exceções legais (ex.: apelação contra sentença de procedência de execução fiscal — LEF art. 20) ou tutela de suspenção pelo relator (art. 995 § único: dano grave + probabilidade de provimento).`,
    ['994', '995'],
    {
      relacionamentos: [
        { destinoSlug: 'cpc-2015-art-300-tutela-urgencia', tipo: 'APLICA_ARTIGO', descricao: 'Suspenção de eficácia usa técnica da tutela de urgência.' },
      ],
    },
  ),
  lei(
    'cpc-arts-1003-1007-prazo-preparo',
    'CPC arts. 1.003 e 1.007 — Prazo geral de 15 dias para interpor e responder (exceto embargos), postagem, feriado local e preparo (textos literais confirmados)',
    'Prazo recursal, tempestividade por postagem e preparo',
    `## Ficha da Norma
- **Norma:** Lei nº 13.105/2015 (CPC), arts. 1.003 e 1.007.
- **Vigência:** vigente.

## Textos CONFIRMADOS LITERALMENTE no Planalto (consulta ${D})
"Art. 1.003. O prazo para interposição de recurso conta-se da data em que os advogados, a sociedade de advogados, a Advocacia Pública, a Defensoria Pública ou o Ministério Público são intimados da decisão.
§ 1º Os sujeitos previstos no caput considerar-se-ão intimados em audiência quando nesta for proferida a decisão.
§ 2º Aplica-se o disposto no art. 231, incisos I a VI, ao prazo de interposição de recurso pelo réu contra decisão proferida anteriormente à citação.
§ 3º No prazo para interposição de recurso, a petição será protocolada em cartório ou conforme as normas de organização judiciária, ressalvado o disposto em regra especial.
§ 4º Para aferição da tempestividade do recurso remetido pelo correio, será considerada como data de interposição a data de postagem.
§ 5º Excetuados os embargos de declaração, o prazo para interpor os recursos e para responder-lhes é de 15 (quinze) dias.
§ 6º O recorrente comprovará a ocorrência de feriado local no ato de interposição do recurso, e, se não o fizer, o tribunal determinará a correção do vício formal, ou poderá desconsiderá-lo caso a informação já conste do processo eletrônico.
(Redação dada pela Lei nº 14.939, de 2024)"
"Art. 1.007. No ato de interposição do recurso, o recorrente comprovará, quando exigido pela legislação pertinente, o respectivo preparo, inclusive porte de remessa e de retorno, sob pena de deserção."

## Interpretação aplicada
- Prazo: 15 dias para TODOS os recursos (apelação, agravos, REsp, RE, ordinário, divergência e RESPOSTA), EXCETO embargos de declaração (5 dias — art. 1.023).
- Termo inicial: intimação (CPC art. 231 — prova a ser anexada em consultas). Postagem vale para tempestividade (§ 4º).
- Preparo no ato de interposição — falha → deserção (regimes de grau: dispensas do § 1º do art. 1.007; sanabilidade do art. 1.007 §§ 2º-4º não transcritos aqui — conferir no texto integral quando operar com gratuidade/custas).
- Feriado local: comprovar na interposição (§ 6º, red. Lei 14.939/2024).`,
    ['1.003', '1.007'],
    {
      relacionamentos: [
        { destinoSlug: 'prazo-apelacao-cpc-15-dias-uteis', tipo: 'FUNDAMENTA_PRAZO', descricao: 'Fundamento literal do prazo da apelação.' },
      ],
    },
  ),
  lei(
    'cpc-arts-1009-1010-1013-apelacao',
    'CPC arts. 1.009, 1.010 e 1.013 — Apelação: questões não cobertas por preclusão, requisitos, contrarrazões em 15 dias e efeito devolutivo (textos literais confirmados)',
    'Regime processual da apelação',
    `## Ficha da Norma
- **Norma:** Lei nº 13.105/2015 (CPC), arts. 1.009, 1.010 e 1.013.
- **Vigência:** vigente.

## Textos CONFIRMADOS LITERALMENTE no Planalto (consulta ${D})
"Art. 1.009. Da sentença cabe apelação.
§ 1º As questões resolvidas na fase de conhecimento, se a decisão a seu respeito não comportar agravo de instrumento, não são cobertas pela preclusão e devem ser suscitadas em preliminar de apelação, eventualmente interposta contra a decisão final, ou nas contrarrazões.
§ 2º Se as questões referidas no § 1º forem suscitadas em contrarrazões, o recorrente será intimado para, em 15 (quinze) dias, manifestar-se a respeito delas.
§ 3º O disposto no caput deste artigo aplica-se mesmo quando as questões mencionadas no art. 1.015 integrarem capítulo da sentença."
"Art. 1.010. A apelação, interposta por petição dirigida ao juízo de primeiro grau, conterá:
I - os nomes e a qualificação das partes;
II - a exposição do fato e do direito;
III - as razões do pedido de reforma ou de decretação de nulidade;
IV - o pedido de nova decisão.
§ 1º O apelado será intimado para apresentar contrarrazões no prazo de 15 (quinze) dias.
§ 2º Se o apelado interpuser apelação adesiva, o juiz intimará o apelante para apresentar contrarrazões.
§ 3º Após as formalidades previstos nos §§ 1º e 2º, os autos serão remetidos ao tribunal pelo juiz, independentemente de juízo de admissibilidade."
"Art. 1.013. A apelação devolverá ao tribunal o conhecimento da matéria impugnada.
§ 1º Serão, porém, objeto de apreciação e julgamento pelo tribunal todas as questões suscitadas e discutidas no processo, ainda que não tenham sido solucionadas, desde que relativas ao capítulo impugnado.
§ 2º Quando o pedido ou a defesa tiver mais de um fundamento e o juiz acolher apenas um deles, a apelação devolverá ao tribunal o conhecimento dos demais.
§ 3º Se o processo estiver em condições de imediato julgamento, o tribunal deve decidir desde logo o mérito quando:
I - reformar sentença fundada no art. 485;
II - decretar a nulidade da sentença por não ser ela congruente com os limites do pedido ou da causa de pedir;
III - constatar a omissão no exame de um dos pedidos, hipótese em que poderá julgá-lo;
IV - decretar a nulidade de sentença por falta de fundamentação.
§ 4º Quando reformar sentença que reconheça a decadência ou a prescrição, o tribunal, se possível, julgará o mérito, examinando as demais questões, sem determinar o retorno do processo ao juízo de primeiro grau.
§ 5º O capítulo da sentença que confirma, concede ou revoga a tutela provisória é impugnável na apelação."

## Interpretação aplicada
- REGRA DE OURO do § 1º do art. 1.009: decisões interlocutórias NÃO agraváveis não precluem — suscitar em PRELIMINAR da apelação (ou contrarrazões).
- § 3º do art. 1.010: SEM juízo de admissibilidade na origem (diferença central do CPC/2015 em relação ao CPC/73).
- Efeito devolutivo POR IMPUGNAÇÃO (tantum devolutum quantum appellatum, § 1º do art. 1.013) + efeito transitivo dos fundamentos acolhidos (§ 2º).`,
    ['1.009', '1.010', '1.013'],
  ),
  lei(
    'cpc-art-1021-agravo-interno',
    'CPC art. 1.021 — Agravo interno: cabimento contra decisão de relator, impugnação específica, multa de 1% a 5% por decisão unânime e depósito prévio (texto literal confirmado)',
    'Regime do agravo interno',
    `## Ficha da Norma
- **Norma:** Lei nº 13.105/2015 (CPC), art. 1.021.
- **Vigência:** vigente.

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta ${D})
"Art. 1.021. Contra decisão proferida pelo relator caberá agravo interno para o respectivo órgão colegiado, observadas, quanto ao processamento, as regras do regimento interno do tribunal.
§ 1º Na petição de agravo interno, o recorrente impugnará especificadamente os fundamentos da decisão agravada.
§ 2º O agravo será dirigido ao relator, que intimará o agravado para manifestar-se sobre o recurso no prazo de 15 (quinze) dias, ao final do qual, não havendo retratação, o relator levá-lo-á a julgamento pelo órgão colegiado, com inclusão em pauta.
§ 3º É vedado ao relator limitar-se à reprodução dos fundamentos da decisão agravada para julgar improcedente o agravo interno.
§ 4º Quando o agravo interno for declarado manifestamente inadmissível ou improcedente em votação unânime, o órgão colegiado, em decisão fundamentada, condenará o agravante a pagar ao agravado multa fixada entre um e cinco por cento do valor atualizado da causa.
§ 5º A interposição de qualquer outro recurso está condicionada ao depósito prévio do valor da multa prevista no § 4º, à exceção da Fazenda Pública e do beneficiário de gratuidade da justiça, que farão o pagamento ao final."

## Interpretação aplicada
- ESTRATÉGIA: agravo interno só com impugnação ESPECIFICADA dos fundamentos (§ 1º) — cópia de razões anteriores = risco de multa (§ 4º).
- Multa 1-5% do valor atualizado da causa + depósito PRÉVIO para recorrer depois (§ 5º) — avaliar custo-benefício antes de agravar. Fazenda Pública e gratuidade pagam ao final.`,
    ['1.021'],
  ),
  lei(
    'cpc-arts-1022-1026-embargos-declaracao',
    'CPC arts. 1.022 a 1.026 — Embargos de declaração: hipóteses, prazo de 5 dias, interrupção do prazo recursal, pré-questionamento e conversão em agravo interno (textos literais confirmados)',
    'Regime dos embargos de declaração',
    `## Ficha da Norma
- **Norma:** Lei nº 13.105/2015 (CPC), arts. 1.022 a 1.026.
- **Vigência:** vigente.

## Textos CONFIRMADOS LITERALMENTE no Planalto (consulta ${D})
"Art. 1.022. Cabem embargos de declaração contra qualquer decisão judicial para:
I - esclarecer obscuridade ou eliminar contradição;
II - suprir omissão de ponto ou questão sobre o qual devia se pronunciar o juiz de ofício ou a requerimento;
III - corrigir erro material.
Parágrafo único. Considera-se omissa a decisão que:
I - deixe de se manifestar sobre tese firmada em julgamento de casos repetitivos ou em incidente de assunção de competência aplicável ao caso sob julgamento;
II - incorra em qualquer das condutas descritas no art. 489, § 1º."
"Art. 1.023. Os embargos serão opostos, no prazo de 5 (cinco) dias, em petição dirigida ao juiz, com indicação do erro, obscuridade, contradição ou omissão, e não se sujeitam a preparo.
§ 1º Aplica-se aos embargos de declaração o art. 229.
§ 2º O juiz intimará o embargado para, querendo, manifestar-se, no prazo de 5 (cinco) dias, sobre os embargos opostos, caso seu eventual acolhimento implique a modificação da decisão embargada."
"Art. 1.024. O juiz julgará os embargos em 5 (cinco) dias.
§ 1º Nos tribunais, o relator apresentará os embargos em mesa na sessão subsequente, proferindo voto, e, não havendo julgamento nessa sessão, será o recurso incluído em pauta automaticamente.
§ 2º Quando os embargos de declaração forem opostos contra decisão de relator ou outra decisão unipessoal proferida em tribunal, o órgão prolator da decisão embargada decidi-los-á monocraticamente.
§ 3º O órgão julgador conhecerá dos embargos de declaração como agravo interno se entender ser este o recurso cabível, desde que determine previamente a intimação do recorrente para, no prazo de 5 (cinco) dias, complementar as razões recursais, de modo a ajustá-las às exigências do art. 1.021, § 1º.
§ 4º Caso o acolhimento dos embargos de declaração implique modificação da decisão embargada, o embargado que já tiver interposto outro recurso contra a decisão originária tem o direito de complementar ou alterar suas razões, nos exatos limites da modificação, no prazo de 15 (quinze) dias, contado da intimação da decisão dos embargos de declaração.
§ 5º Se os embargos de declaração forem rejeitados ou não alterarem a conclusão do julgamento anterior, o recurso interposto pela outra parte antes da publicação do julgamento dos embargos de declaração será processado e julgado independentemente de ratificação."
"Art. 1.025. Consideram-se incluídos no acórdão os elementos que o embargante suscitou, para fins de pré-questionamento, ainda que os embargos de declaração sejam inadmitidos ou rejeitados, caso o tribunal superior considere existentes erro, omissão, contradição ou obscuridade."
"Art. 1.026. Os embargos de declaração não possuem efeito suspensivo e interrompem o prazo para a interposição de recurso."

## Interpretação aplicada
- Prazo 5 dias, SEM preparo; interrompem (não suspendem) o prazo recursal.
- ESTRATÉGIA: embargos omissos para PRÉ-QUESTIONAR (art. 1.025) → habilitam REsp/RE.
- Uso indevido protelatório → multa (art. 1.026 §§ 2º-4º não transcritos aqui — conferir no texto integral antes de operar com multa).
- Conversão em agravo interno com complementação de razões em 5 dias (art. 1.024 § 3º).`,
    ['1.022', '1.023', '1.024', '1.025', '1.026'],
  ),
  lei(
    'cpc-art-1029-resp-re-requisitos',
    'CPC art. 1.029 — Recurso especial e extraordinário: requisitos formais, prova do dissídio e desconsideração de vício formal (texto literal confirmado)',
    'Regime dos recursos extraordinários',
    `## Ficha da Norma
- **Norma:** Lei nº 13.105/2015 (CPC), art. 1.029.
- **Vigência:** vigente.

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta ${D} — excertos)
"Art. 1.029. O recurso extraordinário e o recurso especial, nos casos previstos na Constituição Federal, serão interpostos perante o presidente ou o vice-presidente do tribunal recorrido, em petições distintas que conterão:
I - a exposição do fato e do direito;
II - a demonstração do cabimento do recurso interposto;
III - as razões do pedido de reforma ou de invalidação da decisão recorrida.
§ 1º Quando o recurso fundar-se em dissídio jurisprudencial, o recorrente fará a prova da divergência com a certidão, cópia ou citação do repositório de jurisprudência, oficial ou credenciado, inclusive em mídia eletrônica, em que houver sido publicado o acórdão divergente, ou ainda com a reprodução de julgado disponível na rede mundial de computadores, com indicação da respectiva fonte, devendo-se, em qualquer caso, mencionar as circunstâncias que identifiquem ou assemelhem os casos confrontados.
§ 2º Quando o recurso estiver fundado em dissídio jurisprudencial, é vedado ao tribunal inadmiti-lo com base em fundamento genérico de que as circunstâncias fáticas são diferentes, sem demonstrar a existência da distinção.
§ 3º O Supremo Tribunal Federal ou o Superior Tribunal de Justiça poderá desconsiderar vício formal de recurso tempestivo ou determinar sua correção, desde que não o repute grave."

## Interpretação aplicada
- PETIÇÕES DISTINTAS: REsp (STJ — violação de lei federal) e RE (STF — violação constitucional) nunca na mesma peça.
- Dissídio: prova formal + COMPARAÇÃO DO CASO (situações idênticas); § 2º impede indeferimento por fundamento genérico de distinção fática.
- Generalização: só questões PRÉ-QUESTIONADAS (art. 1.025) e a juízo de admissibilidade do tribunal de origem (art. 1.030 — não transcrito).`,
    ['1.029'],
  ),
  {
    slug: 'prazo-embargos-declaracao-cpc-5-dias',
    titulo: 'PRAZO — Embargos de declaração: 5 dias, sem preparo, com interrupção do prazo recursal (CPC arts. 1.023 e 1.026)',
    tipoDocumento: 'PRAZO',
    area: 'processual-civil',
    subarea: 'recursos',
    assunto: 'Prazo dos embargos de declaração e efeitos no prazo recursal',
    prioridade: 'P1',
    conteudo: `## Prazo: embargos de declaração
- **Prazo:** 5 (cinco) dias.
- **Fundamento literal:** CPC art. 1.023 ("Os embargos serão opostos, no prazo de 5 (cinco) dias... e não se sujeitam a preparo.").
- **Termo inicial:** intimação da decisão (art. 1.003).

## Efeitos sobre os prazos
- INTERROMPEM (não suspendem) o prazo para interposição de outro recurso (art. 1.026) — o prazo recomeça INTEIRO da intimação da decisão dos embargos.
- Resposta dos embargados: 5 dias quando acolhimento pode modificar a decisão (art. 1.023 § 2º).
- Julgamento: 5 dias pelo juiz (art. 1.024); em tribunal, monocrático quando a decisão embargada for unipessoal (art. 1.024 § 2º).
- Complementação de razões se convertidos em agravo interno: 5 dias (art. 1.024 § 3º).

## Rastreabilidade
- Fonte: Planalto (CPC literal, consulta ${D}); doc legislativo vinculado cpc-arts-1022-1026-embargos-declaracao.`,
    metadados: { prazo: '5 dias', preparo: 'dispensado', efeito: 'interrupção', termo_inicial: 'intimação da decisão' },
    tags: ['processual-civil/recursos', 'processual-civil/prazos'],
    fonte: PLANALTO,
    urlFonte: URL_CPC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'cpc-arts-1022-1026-embargos-declaracao', tipo: 'FUNDAMENTA_PRAZO', descricao: 'Base legislativa literal.' },
      { destinoSlug: 'prazo-apelacao-cpc-15-dias-uteis', tipo: 'INTERAGE_COM', descricao: 'Embargos interrompem o prazo da apelação.' },
    ],
  },
  {
    slug: 'prazo-contrarrazoes-resposta-recursos-15-dias',
    titulo: 'PRAZO — Contrarrazões/resposta aos recursos: 15 dias (CPC arts. 1.003 § 5º e 1.010 § 1º); resposta aos embargos: 5 dias',
    tipoDocumento: 'PRAZO',
    area: 'processual-civil',
    subarea: 'recursos',
    assunto: 'Prazo de resposta aos recursos',
    prioridade: 'P1',
    conteudo: `## Prazo: resposta aos recursos
- **Prazo geral:** 15 (quinze) dias para interpor E RESPONDER os recursos (CPC art. 1.003 § 5º — texto literal: "Excetuados os embargos de declaração, o prazo para interpor os recursos e para responder-lhes é de 15 (quinze) dias.").
- **Contrarrazões da apelação:** 15 dias (art. 1.010 § 1º).
- **Resposta ao agravo interno:** 15 dias (art. 1.021 § 2º).
- **Resposta aos embargos:** 5 dias (art. 1.023 § 2º) — só quando o acolhimento puder modificar a decisão.
- **Cruzadas em contrarrazões (art. 1.009 § 1º):** questões não agraváveis suscitadas pelo apelado → recorrente intimado a se manifestar em 15 dias (art. 1.009 § 2º).

## Termo inicial
- Intimação (CPC art. 231 para réu pré-citação; regra geral art. 1.003 caput).

## Rastreabilidade
- Fonte: Planalto (CPC literal, consulta ${D}).`,
    metadados: { prazo: '15 dias', embargos: '5 dias', termo_inicial: 'intimação' },
    tags: ['processual-civil/recursos', 'processual-civil/prazos'],
    fonte: PLANALTO,
    urlFonte: URL_CPC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'cpc-arts-1009-1010-1013-apelacao', tipo: 'FUNDAMENTA_PRAZO', descricao: 'Contrarrazões da apelação.' },
    ],
  },
  {
    slug: 'prazo-resp-re-15-dias-tribunal-origem',
    titulo: 'PRAZO — REsp e RE: 15 dias, interposição perante o tribunal recorrido, petições distintas (CPC arts. 1.003 § 5º e 1.029)',
    tipoDocumento: 'PRAZO',
    area: 'processual-civil',
    subarea: 'recursos',
    assunto: 'Prazo e forma dos recursos extraordinários',
    prioridade: 'P1',
    conteudo: `## Prazo: recurso especial e recurso extraordinário
- **Prazo:** 15 (quinze) dias (CPC art. 1.003 § 5º).
- **Interposição:** perante o presidente/vice-presidente do tribunal recorrido (art. 1.029 caput), em PETIÇÕES DISTINTAS (uma para REsp, outra para RE).
- **Pré-requisitos:** pré-questionamento (art. 1.025 — embargos declaratórios) e prequestionamento da violação: REsp = lei federal (CF art. 105 III); RE = constitucional (CF art. 102 III) — os pressupostos constitucionais NÃO estão transcritos aqui (fonte: CF).
- **Dissídio jurisprudencial:** prova formal do precedente + comparação dos casos (art. 1.029 § 1º); vedado indeferimento por fundamento genérico de distinção fática (§ 2º).
- **Vício formal leve:** desconsideração/correção (art. 1.029 § 3º).

## Fluxo típico
sentença/acórdão → apelação → acórdão → (se preciso) embargos → 15 dias p/ REsp e/ou RE na origem → admissibilidade na presidência (art. 1.030) → STJ/STF.

## Rastreabilidade
- Fonte: Planalto (CPC literal, consulta ${D}).`,
    metadados: { prazo: '15 dias', forma: 'petições distintas na origem', pressupostos: 'pré-questionamento art. 1.025' },
    tags: ['processual-civil/recursos', 'processual-civil/prazos', 'stj', 'stf'],
    fonte: PLANALTO,
    urlFonte: URL_CPC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'cpc-art-1029-resp-re-requisitos', tipo: 'FUNDAMENTA_PRAZO', descricao: 'Base legislativa literal.' },
      { destinoSlug: 'prazo-embargos-declaracao-cpc-5-dias', tipo: 'PRECEDE', descricao: 'Embargos habilitam o pré-questionamento.' },
    ],
  },
  {
    slug: 'fluxo-tramite-apelacao-cpc-2015',
    titulo: 'FLUXO — Trâmite da apelação no CPC/2015 (interposição sem admissibilidade na origem → tribunal)',
    tipoDocumento: 'FLUXO',
    area: 'processual-civil',
    subarea: 'recursos',
    assunto: 'Fluxo processual da apelação',
    prioridade: 'P1',
    conteudo: `# FLUXO — Apelação (CPC/2015)
Formato: evento → prazo → providência → responsável → documento necessário → risco → próxima etapa

1. **Publicação/intimação da sentença** → — → verificar data e meio de intimação (CPC art. 231) → advogado → certidão de intimação → risco: contagem errada do prazo → próxima: preparo da peça.
2. **Preparo da apelação** → dentro de 15 dias → petição ao JUÍZO DE 1º GRAU com: qualificação, exposição fato/direito, razões de reforma/nulidade, pedido de nova decisão (art. 1.010) + PREPARO se exigido (art. 1.007) + preliminares do art. 1.009 § 1º → advogado → peça + comprovante de custas → risco: deserção por falta de preparo → próxima: protocolo.
3. **Protocolo/tempestividade** → 15 dias (postagem vale — art. 1.003 § 4º; feriado local: comprovar no ato — § 6º) → advogado → protocolo → risco: intempestividade → próxima: contrarrazões.
4. **Contrarrazões do apelado** → 15 dias (art. 1.010 § 1º) → atenção: se trouxer questões do art. 1.009 § 1º em contrarrazões, apelante é intimado por 15 dias (§ 2º) → advogado contrarrazões/manifestação → risco: questões novas → próxima: remessa.
5. **Remessa ao tribunal** → SEM juízo de admissibilidade na origem (art. 1.010 § 3º) → juiz remete direto → cartório → risco: nenhuma → próxima: distribuição.
6. **Distribuição e relator no tribunal** → — → relator pode: dar provimento monocrático ao apelo favorável (art. 932 e ss.), negar seguimento a monocrático contra jurisprudência dominante etc. → partes monitoram → risco: decisão monocrática desfavorável → próxima: agravo interno (art. 1.021) ou pauta.
7. **Julgamento colegiado** → pauta → acórdão substitui a sentença no que recorrido (art. 1.008) → relator → certidão de julgamento → risco: capítulos novos → próxima: embargos (5 dias) p/ omissões e pré-questionamento.
8. **Trânsito em julgado / recursos extraordinários** → 15 dias para REsp/RE na origem (petições distintas) quando preenchidos pressupostos → advogado → peças + prova de dissídio → risco: não preenchimento (generalização/multifinalidade) → próxima: admissibilidade e STJ/STF.

**Vinculados:** prazos (docs PRAZO deste lote), peça-modelo de apelação, checklist de admissibilidade.`,
    metadados: { etapas: 8, regime: 'sem admissibilidade na origem' },
    tags: ['processual-civil/recursos', 'fluxo-processual'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'cpc-arts-1009-1010-1013-apelacao', tipo: 'DERIVA_DE', descricao: 'Base legislativa do fluxo.' },
      { destinoSlug: 'peca-apelacao-modelo-cpc-2015', tipo: 'USA_PECA', descricao: 'Peça da etapa 2.' },
      { destinoSlug: 'prazo-apelacao-cpc-15-dias-uteis', tipo: 'REFERENCIA_PRAZO', descricao: 'Prazo da etapa 2-3.' },
    ],
  },
  {
    slug: 'peca-apelacao-modelo-cpc-2015',
    titulo: 'PEÇA-MODELO — Apelação cível (CPC/2015, art. 1.010) com preliminares do art. 1.009 § 1º — campos variáveis',
    tipoDocumento: 'PECA',
    area: 'processual-civil',
    subarea: 'recursos',
    assunto: 'Modelo de apelação',
    prioridade: 'P1',
    conteudo: `# MODELO — APELAÇÃO
**ADVERTÊNCIA EJC:** modelo estrutural com VARIÁVEIS. Ajustar ao processo concreto; nunca inserir precedente não verificado.

## Endereçamento
EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA {{VARA}} DA COMARCA DE {{COMARCA}} — {{UF}}
(Processo nº {{NUMERO_PROCESSO}})

## Enquadramento
{{APELANTE}}, já qualificado ({{QUALIFICACAO}}), por seu advogado, vem interpor **APELAÇÃO** contra a sentença de {{DATA_SENTENCA}} (doc. {{DOC_SENTENCA}}), que {{RESUMO_DISPOSITIVO}}, pelas razões anexas, requerendo o recebimento e processamento do recurso, com remessa ao E. Tribunal (CPC art. 1.010 § 3º — sem juízo de admissibilidade na origem).
{{CIDADE}}, {{DATA}}.
{{ADVOGADO}} — OAB/{{UF}} {{OAB}}

## RAZÕES DE APELAÇÃO
E. TRIBUNAL DE JUSTIÇA DE {{ESTADO}}

### I — SÍNTESE
{{SINTESE_FATOS}} — sentença de {{DATA}} {{DISPOSITIVO}}.

### II — PRELIMINARES (questões do art. 1.009 § 1º não cobertas por preclusão)
P1. {{PRELIMINAR_1}} (nulidade/omissão na fase de conhecimento — art. 1.009 § 1º c/c art. 1.022) — {{FUNDAMENTO_P1}}.
P2. {{PRELIMINAR_2}}.

### III — MÉRITO
M1. {{TESE_1}} — violação de {{DISPOSITIVO}} — {{ARGUMENTO}} (comprovante/documentos docs. {{DOCS}}).
M2. {{TESE_2}}.

### IV — PEDIDO
- Conhecer da apelação e dar-lhe PROVIMENTO para {{PEDIDO_NOVA_DECISAO}} (art. 1.010 IV);
- Caso reforme sentença do art. 485 ou decrete nulidade, julgar desde logo o mérito (art. 1.013 § 3º);
- Reverter decisão de prescrição/decadência, se possível sem retorno aos autos (art. 1.013 § 4º);
- {{PEDIDOS}}.

## CHECKLIST ANTES DO PROTOCOLO
- [ ] Prazo: 15 dias da intimação (art. 1.003 § 5º); postagem preserva tempestividade (§ 4º)
- [ ] Preparo conferido conforme organização judiciária local (art. 1.007)
- [ ] TODAS as questões não agraváveis na preliminar (art. 1.009 § 1º)
- [ ] Requisitos do art. 1.010 I-IV completos
- [ ] Impugnação específica de TODOS os capítulos desfavoráveis (senão trânsito — art. 505)`,
    metadados: { variaveis: ['NUMERO_PROCESSO','APELANTE','PRELIMINAR_1','TESE_1','DATA','ADVOGADO'], tipo: 'recurso de apelação' },
    tags: ['processual-civil/recursos', 'peca-modelo'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'cpc-arts-1009-1010-1013-apelacao', tipo: 'IMPLEMENTA_ARTIGO', descricao: 'Peça materializa os arts. 1.009-1.010.' },
      { destinoSlug: 'fluxo-tramite-apelacao-cpc-2015', tipo: 'USA_EM_FLUXO', descricao: 'Etapa 2 do fluxo.' },
    ],
  },
  {
    slug: 'checklist-admissibilidade-recursal',
    titulo: 'CHECKLIST — Admissibilidade recursal: os 9 pontos a conferir antes de protocolar qualquer recurso',
    tipoDocumento: 'CHECKLIST',
    area: 'processual-civil',
    subarea: 'recursos',
    assunto: 'Checklist de admissibilidade recursal',
    prioridade: 'P1',
    conteudo: `# CHECKLIST — Admissibilidade de recursos (CPC/2015)
Conferir NA ORDEM antes de qualquer protocolo.

## 1. Cabimento
- [ ] A decisão está no rol? (art. 994: apelação, agravo de instrumento, agravo interno, embargos, ordinário, REsp, RE, agravo em REsp/RE, embargos de divergência) — rol taxativo.
- [ ] Decisão interlocutória agravável? (art. 1.015) — senão: NÃO preclui, suscitar na apelação (art. 1.009 § 1º).

## 2. Legitimidade e interesse
- [ ] Parte vencida, terceiro prejudicado ou MP (art. 996); interesse de recorrer concreto.

## 3. Tempestividade
- [ ] Prazo: 15 dias (art. 1.003 § 5º); embargos: 5 dias (art. 1.023).
- [ ] Termo inicial = intimação (art. 1.003); postagem preserva (§ 4º); feriado local comprovado no ato (§ 6º, red. Lei 14.939/2024).

## 4. Preparo
- [ ] Preparo + porte exigidos? comprovados no ATO (art. 1.007) — senão: deserção (regimes de gratuidade/recolhimento posterior conforme §§ do art. 1.007 e norma local).

## 5. Procedimento formal
- [ ] Endereçamento correto (apelação: 1º grau — art. 1.010; agravo interno: relator — art. 1.021 § 2º; REsp/RE: presidência do tribunal recorrido, peças distintas — art. 1.029).
- [ ] Impugnação ESPECÍFICA (agravo interno: art. 1.021 § 1º — risco de multa 1-5%).

## 6. Pré-questionamento (REsp/RE)
- [ ] Questão pré-questionada? senão: embargos declaratórios antes (arts. 1.022 e 1.025).

## 7. Preclusões
- [ ] Questões ainda abertas? consumadas as preclusões temporal/lógica/consumativa?

## 8. Efeitos
- [ ] Recurso NÃO suspende por regra (art. 995) — avaliar pedido de suspenção ao relator (§ único).

## 9. Riscos financeiros
- [ ] Multa do agravo interno 1-5% + depósito prévio (art. 1.021 §§ 4º-5º);
- [ ] Multa por embargos protelatórios (art. 1.026 §§ 2º-4º — conferir texto integral antes de operar).`,
    metadados: { itens: 9, uso: 'protocolo recursal' },
    tags: ['processual-civil/recursos', 'checklist'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'cpc-arts-994-995-rol-recursos-efeitos', tipo: 'DERIVA_DE', descricao: 'Cabimento do rol.' },
      { destinoSlug: 'cpc-art-1021-agravo-interno', tipo: 'APLICA_ARTIGO', descricao: 'Item 5 e 9.' },
    ],
  },
  {
    slug: 'tese-preliminar-apelacao-art-1009',
    titulo: 'TESE — Preliminar de apelação para questões interlocutórias não agraváveis (CPC art. 1.009 § 1º): não há preclusão',
    tipoDocumento: 'TESE',
    area: 'processual-civil',
    subarea: 'recursos',
    assunto: 'Tese de sobrevivência das questões interlocutórias',
    prioridade: 'P1',
    conteudo: `## Tese estruturada — art. 1.009 § 1º
**Enunciado:** a decisão interlocutória sobre matéria NÃO listada no art. 1.015 não gera preclusão; a questão deve (e pode) ser suscitada em PRELIMINAR de apelação (ou em contrarrazões), sob pena de... nenhuma — o silêncio prévio NÃO impede a rediscussão na apelação.

### Requisitos
1. Decisão interlocutória da fase de conhecimento NÃO agravável (fora do art. 1.015).
2. Suscitação em PRELIMINAR da apelação (ou contrarrazões — com direito de réplica de 15 dias, art. 1.009 § 2º).

### Fundamentos literais
- CPC art. 1.009 § 1º: "...não são cobertas pela preclusão e devem ser suscitadas em preliminar de apelação...".
- CPC art. 1.013 § 3º: tribunal pode decidir desde logo o mérito ao reformar/decretar nulidade.

### Probabilidade qualitativa
- ALTA para o CABIMENTO da preliminar (texto expresso); o êxito de fundo depende da matéria.

### Riscos e contrademandas
- Se a interlocutória ERA agravável (art. 1.015) e não se agravou → preclusão real — conferir art. 1.015 antes.
- Alegação tardia em contrarrazões → direito de manifestação do recorrente (§ 2º).

### Aplicação
- Mapear TODAS as interlocutórias do processo desde a contestação; checklist por questão (provas rejeitadas, imparidade da perícia, intervenções etc.).`,
    metadados: { probabilidade: 'alta no cabimento', fundamento_literal: 'CPC art. 1.009 § 1º' },
    tags: ['processual-civil/recursos', 'tese'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'cpc-arts-1009-1010-1013-apelacao', tipo: 'DERIVA_DE', descricao: 'Base literal do § 1º.' },
      { destinoSlug: 'peca-apelacao-modelo-cpc-2015', tipo: 'IMPLEMENTA_PECA', descricao: 'Bloco de preliminares da peça.' },
    ],
  },
  {
    slug: 'triagem-recursal-script',
    titulo: 'TRIAGEM — Script de análise recursal: qual recurso cabe, quando e com que riscos',
    tipoDocumento: 'TRIAGEM',
    area: 'processual-civil',
    subarea: 'recursos',
    assunto: 'Roteiro de triagem recursal',
    prioridade: 'P1',
    conteudo: `# TRIAGEM — Análise recursal (script)
Objetivo: decidir recurso cabível, prazo, riscos e custo.

## Bloco A — A decisão
1. Que decisão foi proferida? (sentença / interlocutória / acórdão / decisão monocrática de relator) {{TIPO_DECISAO}}
2. Data de intimação (art. 231)? {{DATA_INTIMACAO}}
3. O que decidiu, capítulo por capítulo? {{CAPITULOS}}

## Bloco B — Cabimento
4. Sentença → APELAÇÃO (15 dias). Interlocutória → está no art. 1.015? sim: AGRAVO DE INSTRUMENTO (15 dias); não: aguardar sentença e usar PRELIMINAR (art. 1.009 § 1º). Decisão de relator → AGRAVO INTERNO (15 dias, impugnação específica — risco de multa 1-5%). Acórdão → EMBARGOS (5 dias) e/ou REsp/RE (15 dias, petições distintas, pré-questionamento).
5. Decisão já transitada? {{TRANSITO}}

## Bloco C — Prazo e forma
6. Quantos dias desde a intimação? {{DIAS_CORRIDOS}} (prazos processuais em dias ÚTEIS — CPC art. 219; conferir calendário forense local)
7. Preparo exigido? valor? {{PREPARO}}
8. Gratuidade deferida? {{GRATUIDADE}}

## Bloco D — Estratégia
9. A questão já foi decidida por tribunal superior? (teses repetitivas — doc base) {{JURISPRUDENCIA}}
10. Há omissões p/ embargos pré-questionando REsp/RE? {{OMISSOES}}
11. Risco financeiro: multa agravo interno (1-5% + depósito prévio)? {{RISCO_MULTA}}
12. Recurso NÃO suspende a execução — precisa de tutela de suspenção (art. 995 § único)? {{SUSPENSAO}}

**Saída automática EJC (regras):**
- sentença + ≤15 dias → apelação (fluxo + peça vinculadas);
- interlocutória do art. 1.015 + ≤15 dias → agravo de instrumento;
- monocrática desfavorável + ≤15 dias → agravo interno SE impugnação específica viável e custo-benefício positivo;
- acórdão + omissão → embargos 5 dias → depois REsp/RE 15 dias;
- interlocutória fora do 1.015 → registrar para preliminar futura.`,
    metadados: { perguntas: 12, saida: 'recurso cabível + riscos' },
    tags: ['processual-civil/recursos', 'triagem'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'cpc-arts-994-995-rol-recursos-efeitos', tipo: 'USA_ARTIGO', descricao: 'Decisão de cabimento.' },
      { destinoSlug: 'checklist-admissibilidade-recursal', tipo: 'SEGUE_PARA', descricao: 'Conferência final antes do protocolo.' },
    ],
  },
  {
    slug: 'argumentacao-embargos-vs-agravo-interno',
    titulo: 'ARGUMENTAÇÃO — Embargos de declaração x agravo interno: quando usar cada recurso contra decisão de relator',
    tipoDocumento: 'ARGUMENTACAO',
    area: 'processual-civil',
    subarea: 'recursos',
    assunto: 'Escolha entre embargos e agravo interno',
    prioridade: 'P2',
    conteudo: `# ARGUMENTAÇÃO — Embargos x agravo interno (decisão de relator)
**USAR EMBARGOS (5 dias) quando:**
- o problema é OMISSÃO/contradição/obscuridade/erro material (art. 1.022);
- objetivo é PRÉ-QUESTIONAR para REsp/RE (art. 1.025 — incluídos no acórdão ainda que rejeitados);
- sem preparo e SEM risco de multa (a não ser uso protelatório — conferir art. 1.026 §§ antes);
- aceita-se julgamento monocrático pelo próprio relator (art. 1.024 § 2º).

**USAR AGRAVO INTERNO (15 dias) quando:**
- pretende-se REVER o conteúdo da decisão (mérito da questão), não só esclarecer;
- há impugnação ESPECÍFICA possível dos fundamentos (art. 1.021 § 1º) — decisão motivada de forma superável;
- o órgão colegiado pode reverter (pauta, § 2º);
- aceita-se o risco de multa 1-5% + depósito prévio em caso de derrota unânime (§§ 4º-5º).

**CONTRA-ARGUMENTOS TÍPICOS**
- Contra embargos: "protelatórios — inovação indevida, reiteração" → responder: pedido de esclarecimento delimitado, sem inovação.
- Contra agravo interno: "impugnação genérica — mero inconformismo; multa" → responder: afronta ponto a ponto dos fundamentos (§ 1º) + vedação de reprodução do relator (§ 3º).

**REGRA PRÁTICA EJC:** omissão p/ pré-questionar = embargos; discordância de conteúdo = agravo interno (ou embargos + agravo interno sucessivos, respeitando prazos e custos).`,
    metadados: { cenarios: 2, riscos: 'multa art. 1.021 § 4º' },
    tags: ['processual-civil/recursos', 'argumentacao'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'cpc-arts-1022-1026-embargos-declaracao', tipo: 'USA_ARTIGO', descricao: 'Regime dos embargos.' },
      { destinoSlug: 'cpc-art-1021-agravo-interno', tipo: 'USA_ARTIGO', descricao: 'Regime do agravo interno.' },
    ],
  },
  {
    slug: 'doutrina-principios-recursais-cpc',
    titulo: 'DOUTRINA/CONCEITOS — Princípios recursais do CPC/2015: taxatividade, dialetismo, devolutivo (tantumdevolutum), fungibilidade e sem juízo de admissibilidade na origem',
    tipoDocumento: 'DOUTRINA',
    area: 'processual-civil',
    subarea: 'recursos',
    assunto: 'Princípios do sistema recursal',
    prioridade: 'P2',
    conteudo: `# Conceitos — princípios recursais (elaboração própria EJC, sintética)

## 1. Taxatividade
Só os recursos do art. 994 existem (rol fechado); instrumentos "atípicos" não são recebidos.

## 2. Unirrecorribilidade (regra)
Cada decisão tem um recurso próprio; exceções legais (ex.: conversão de embargos em agravo interno — art. 1.024 § 3º).

## 3. Dialetismo
Contraditório recursal: resposta em 15 dias (art. 1.003 § 5º); § 2º do art. 1.009 (manifestação sobre questões em contrarrazões).

## 4. Devolutivo (tantum devolutum quantum appellatum)
Tribunal conhece do IMPUGNADO (art. 1.013 caput), com devolução automática dos fundamentos acolhidos (§ 2º) e reexame integral do capítulo impugnado (§ 1º).

## 5. Sem juízo de admissibilidade na origem
Apelação sobe direto (art. 1.010 § 3º) — admissibilidade é do tribunal; diferencial estrutural do CPC/2015.

## 6. Fungibilidade (limitada)
Recebimento de um recurso por outro cabível exige erro escusável e inexistência de erro grosseiro + ausência de requisitos subjetivos que impeçam o juízo de outro recurso. Embargos→agravo interno: conversão legal expressa (art. 1.024 § 3º).

## 7. Efeitos suspensivo e devolutivo
Regra: recursos sem efeito suspensivo (art. 995); suspenção judicial possível pelo relator (§ único) nos moldes da tutela de urgência.`,
    metadados: { conceitos: 7, natureza: 'elaboração própria sintética' },
    tags: ['processual-civil/recursos', 'doutrina'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'cpc-arts-994-995-rol-recursos-efeitos', tipo: 'EXPLICA', descricao: 'Taxatividade e efeitos.' },
    ],
  },
  {
    slug: 'regra-se-tipo-decisao-recurso-cabivel',
    titulo: 'REGRA DE INTELIGÊNCIA — Mapeamento tipo de decisão → recurso cabível (CPC arts. 994, 1.009, 1.015, 1.021, 1.022, 1.029)',
    tipoDocumento: 'REGRA_INTELIGENCIA',
    area: 'processual-civil',
    subarea: 'recursos',
    assunto: 'Determinação automática do recurso cabível',
    prioridade: 'P1',
    conteudo: `## SE-ENTÃO (interpretável pelo EJC)
**SE** decisão = SENTENÇA **ENTÃO** APELAÇÃO — 15 dias — origem 1º grau — questões não agraváveis em preliminar (art. 1.009 § 1º).

**SE** decisão = INTERLOCUTÓRIA **E** matéria ∈ art. 1.015 **ENTÃO** AGRAVO DE INSTRUMENTO — 15 dias.
**SE** decisão = INTERLOCUTÓRIA **E NÃO** ∈ art. 1.015 **ENTÃO** SEM recurso imediato → guardar para PRELIMINAR de apelação (não preclui — art. 1.009 § 1º).

**SE** decisão = DE MONOCRÁTICA DE RELATOR **ENTÃO** AGRAVO INTERNO — 15 dias — impugnação específica obrigatória — risco de multa 1-5% se unânime.

**SE** decisão = ACÓRDÃO **E** há omissão/contradição/obscuridade **ENTÃO** EMBARGOS — 5 dias — sem preparo — interrompem prazo — pré-questionamento (art. 1.025).

**SE** acórdão de tribunal de justiça/TRF **E** pré-questionamento ok **E** violação de lei federal **ENTÃO** REsp (STJ) — 15 dias — petição própria.
**SE** ... violação da Constituição **ENTÃO** RE (STF) — 15 dias — petição distinta do REsp.

**SE** decisão de presidente/vice do tribunal recorrido inadmitiu REsp/RE **ENTÃO** AGRAVO (art. 1.042 — regime específico; conferir texto integral antes de operar).

**FONTE:** CPC arts. 994-1.029 (textos literais neste EJC, consulta ${D}).`,
    metadados: { tipo: 'SE-ENTÃO', entrada: 'tipo de decisão + matéria', saida: 'recurso + prazo + forma' },
    tags: ['processual-civil/recursos', 'inteligencia-processual'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'cpc-arts-994-995-rol-recursos-efeitos', tipo: 'DERIVA_DE', descricao: 'Rol dos recursos.' },
      { destinoSlug: 'triagem-recursal-script', tipo: 'AUTOMATIZA', descricao: 'Motor do script de triagem.' },
    ],
  },
  {
    slug: 'tabela-documentos-recursos-civis',
    titulo: 'TABELA — Documentos e anexos necessários por recurso (apelação, agravos, embargos, REsp/RE)',
    tipoDocumento: 'TABELA_DOCUMENTOS',
    area: 'processual-civil',
    subarea: 'recursos',
    assunto: 'Documentos para recursos',
    prioridade: 'P2',
    conteudo: `# Documentos necessários — recursos cíveis (CPC/2015)

| Recurso | Prazo | Anexos essenciais | Observações |
|---|---|---|---|
| Apelação | 15 dias | peça + preparo (se exigido) + procuração nos autos | dirigida ao 1º grau (art. 1.010 § 3º) |
| Agravo de instrumento | 15 dias | peça + cópias da decisão, da petição que a originou + certidões (art. 1.017 § 5º) + preparo | conferir requisitos do art. 1.017 (não transcritos aqui — conferir texto integral) |
| Agravo interno | 15 dias | peça com impugnação específica | sem preparo em regra; risco de multa 1-5% |
| Embargos de declaração | 5 dias | peça com indicação do erro/omissão | sem preparo (art. 1.023) |
| REsp / RE | 15 dias | 2 petições distintas + prova do dissídio (certidão/cópia/citação de repositório — art. 1.029 § 1º) + comprovante de pagamento de porte (normas STJ/STF) | pré-questionamento (art. 1.025) |

**Nota EJC:** custas/portes variam por tribunal — confirmar tabela local antes do protocolo; requisitos não transcritos (art. 1.017) exigem leitura do texto integral (doc legislativo vinculado).`,
    metadados: { recursos: 5 },
    tags: ['processual-civil/recursos', 'documentos'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'checklist-admissibilidade-recursal', tipo: 'COMPLEMENTA', descricao: 'Checklist de conferência.' },
    ],
  },
];
