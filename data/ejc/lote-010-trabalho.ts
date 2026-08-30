// LOTE-010 — Processo do Trabalho: Reclamatória e Recursos (P1)
// Textos LITERAIS extraídos do Planalto (CLT — Decreto-Lei 5.452/1943, texto compilado, consulta 2026-08-30).
// Jurisprudência: ADI 5766 e ADC 58/59 com TESE/EMENTA LITERAL confirmadas em página oficial do TRT6 (*.jus.br, consulta 2026-08-30).
// ANTI-INVENÇÃO registrada nesta fase:
//  - "Súmula 450" com texto de sucumbência/gratuidade APRESENTA CONFLITO STF x TST nos resultados consultados → NÃO citada;
//  - Súmula 396/TST CONFIRMADA como tema de ESTABILIDADE PROVISÓRIA (não é RO sumaríssimo) → não usada para requisitos recursais;
//  - a previsão de "audiência una e continuada" (art. 845, § 1º) NÃO foi localizada no texto oficial do Planalto → NÃO registrada;
//  - Tema 962/STF NÃO confirmado em fonte oficial → NÃO citado.
import type { InputDocument } from '../../src/lib/ejc/types';

const D = '2026-08-30';
const PLANALTO = 'Presidência da República — Planalto (CLT, Decreto-Lei 5.452/1943, texto compilado)';
const URL_CLT = 'https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm';
const EJC = 'Elaboração EJC — conteúdo estrutural original';

function leiClt(
  slug: string, titulo: string, subarea: string, assunto: string, conteudo: string, artigos: string[],
  extra?: Partial<InputDocument>,
): InputDocument {
  return {
    slug, titulo, tipoDocumento: 'LEGISLACAO', area: 'trabalhista', subarea,
    assunto, prioridade: 'P1', lote: 'LOTE-010',
    conteudo,
    metadados: { numero: 'Decreto-Lei 5.452/1943 (CLT)', data_norma: '1943-05-01', orgao: 'Presidente da República (Decreto-Lei)', artigos_principais: artigos, vigente: true, confirmacao_texto: 'Extração literal do texto compilado oficial do Planalto em 2026-08-30.' },
    tags: ['trabalhista/processo-trabalho', 'geral/prazos'],
    fonte: PLANALTO,
    urlFonte: URL_CLT,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    ...extra,
  };
}

export default [
  leiClt(
    'clt-arts-840-841-reclamacao-notificacao',
    'CLT arts. 840 e 841 — Requisitos da reclamação, pedidos certos/determinados e notificação para audiência (textos literais confirmados)',
    'processo-trabalho',
    'Petição inicial e citação no processo do trabalho',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30) — redação atual

### Art. 840 (redação da Lei 13.467/2017)
"Art. 840 - A reclamação poderá ser escrita ou verbal.
§ 1º Sendo escrita, a reclamação deverá conter a designação do juízo, a qualificação das partes, a breve exposição dos fatos de que resulte o dissídio, o pedido, que deverá ser certo, determinado e com indicação de seu valor, a data e a assinatura do reclamante ou de seu representante. (Redação dada pela Lei nº 13.467, de 2017)
§ 2º Se verbal, a reclamação será reduzida a termo, em duas vias datadas e assinadas pelo escrivão ou secretário, observado, no que couber, o disposto no § 1º deste artigo. (Redação dada pela Lei nº 13.467, de 2017)
§ 3º Os pedidos que não atendam ao disposto no § 1º deste artigo serão julgados extintos sem resolução do mérito. (Incluído pela Lei nº 13.467, de 2017)"

### Art. 841
"Art. 841 - Recebida e protocolada a reclamação, o escrivão ou secretário, dentro de 48 (quarenta e oito) horas, remeterá a segunda via da petição, ou do termo, ao reclamado, notificando-o ao mesmo tempo, para comparecer à audiência do julgamento, que será a primeira desimpedida, depois de 5 (cinco) dias.
§ 1º - A notificação será feita em registro postal com franquia. Se o reclamado criar embaraços ao seu recebimento ou não for encontrado, far-se-á a notificação por edital, inserto no jornal oficial ou no que publicar o expediente forense, ou, na falta, afixado na sede da Junta ou Juízo.
§ 2º - O reclamante será notificado no ato da apresentação da reclamação ou na forma do parágrafo anterior.
§ 3º Oferecida a contestação, ainda que eletronicamente, o reclamante não poderá, sem o consentimento do reclamado, desistir da ação. (Incluído pela Lei nº 13.467, de 2017)"

## Pontos críticos para prática
- **Pedido certo, determinado e com valor** (art. 840, § 1º): pedido genérico ou sem valor = extinção sem resolução do mérito do pedido específico (§ 3º) — sanitizamos todos os pedidos antes do protocolo.
- **Após contestação, desistir exige consentimento do réu** (art. 841, § 3º): impacto em homologação de acordo unilateral.
- Notificação por postal (§ 1º); sumaríssimo veda citação por edital (CLT art. 852-B, II — doc vinculado).

## Hipóteses de aplicação no EJC
- Conferência de sanidade da inicial (checklist de protocolo).
- Decisão sobre aditamento da ação após contestação (impedimento de desistência).`,
    ['840', '841'],
    {
      relacionamentos: [
        { destinoSlug: 'clt-art-844-revelia-arquivamento-audiencia', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Consequências do não comparecimento à audiência designada nos termos do art. 841.' },
        { destinoSlug: 'peca-reclamacao-trabalhista-modelo-variaveis', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Modelo de peça que implementa os requisitos do art. 840, § 1º.' },
        { destinoSlug: 'fluxo-reclamatoria-trabalhista-comum', tipo: 'ETAPA_PROCESSO', descricao: 'Etapa inicial do fluxo da reclamatória.' },
      ],
    },
  ),
  leiClt(
    'clt-art-844-revelia-arquivamento-audiencia',
    'CLT art. 844 — Arquivamento por ausência do reclamante, revelia/confissão do reclamado e restrições (§§ 1º-5º, textos literais confirmados)',
    'processo-trabalho',
    'Revelia e arquivamento na audiência',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)

"Art. 844 - O não-comparecimento do reclamante à audiência importa o arquivamento da reclamação, e o não-comparecimento do reclamado importa revelia, além de confissão quanto à matéria de fato.
§ 1º Ocorrendo motivo relevante, poderá o juiz suspender o julgamento, designando nova audiência. (Redação dada pela Lei nº 13.467, de 2017)
§ 2º Na hipótese de ausência do reclamante, este será condenado ao pagamento das custas calculadas na forma do art. 789 desta Consolidação, ainda que beneficiário da justiça gratuita, salvo se comprovar, no prazo de quinze dias, que a ausência ocorreu por motivo legalmente justificável. (Incluído pela Lei nº 13.467, de 2017) (Vide ADIN 5766)
§ 3º O pagamento das custas a que se refere o § 2º é condição para a propositura de nova demanda. (Incluído pela Lei nº 13.467, de 2017)
§ 4º A revelia não produz o efeito mencionado no caput deste artigo se: (Incluído pela Lei nº 13.467, de 2017)
I - havendo pluralidade de reclamados, algum deles contestar a ação;
II - o litígio versar sobre direitos indisponíveis;
III - a petição inicial não estiver acompanhada de instrumento que a lei considere indispensável à prova do ato;
IV - as alegações de fato formuladas pelo reclamante forem inverossímeis ou estiverem em contradição com prova constante dos autos.
§ 5º Ainda que ausente o reclamado, presente o advogado na audiência, serão aceitos a contestação e os documentos eventualmente apresentados. (Incluído pela Lei nº 13.467, de 2017)"

## Interpretação aplicada
- **Confissão ficta** apenas quanto à matéria de fato — verossimilhança, prova documental mínima e direitos indisponíveis mitigam o efeito (§ 4º).
- § 2º-§ 3º: custas por ausência do reclamante foram **julgadas CONSTITUCIONAIS pela ADI 5766** (vencidos Fachin, Lewandowski e Rosa Weber — doc vinculado). A condição do § 3º segue expressa no texto.
- § 5º: presença do advogado substitui a do reclamado.

## Hipóteses de aplicação no EJC
- Estratégia em audiência para réu: contestar oralmente mesmo sem preposto (§ 5º).
- Defesa do autor contra confissão ficta: articular § 4º, I-IV.`,
    ['844'],
    {
      relacionamentos: [
        { destinoSlug: 'adi-5766-sucumbencia-gratuidade-jt', tipo: 'PRECEDENTE_APLICAVEL', descricao: 'ADI 5766: § 2º do art. 844 declarado constitucional; §§ sobre sucumbência de gratuidade inconstitucionais.' },
        { destinoSlug: 'doutrina-conceitos-processo-trabalho', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Conceito de confissão ficta e verossimilhança.' },
      ],
    },
  ),
  leiClt(
    'clt-arts-845-848-850-audiencia-instrucao',
    'CLT arts. 845, 848 e 850 — Audiência com testemunhas, instrução e razões finais (textos literais confirmados)',
    'processo-trabalho',
    'Audiência de instrução e julgamento',
    `## Textos CONFIRMADOS LITERALMENTE no Planalto (consulta 2026-08-30)

### Art. 845
"Art. 845 - O reclamante e o reclamado comparecerão à audiência acompanhados das suas testemunhas, apresentando, nessa ocasião, as demais provas."

### Art. 848 (instrução)
"Art. 848 - Terminada a defesa, seguir-se-á a instrução do processo, podendo o presidente, ex officio ou a requerimento de qualquer juiz temporário, interrogar os litigantes."

### Art. 850 (razões finais)
"Art. 850 - Terminada a instrução, poderão as partes aduzir razões finais, em prazo não excedente de 10 (dez) minutos para cada uma. Em seguida, o juiz ou presidente renovará a proposta de conciliação, e, não havendo acordo, proferirá a sua decisão."

## ALERTA ANTI-INVENÇÃO (registrado)
- A previsão de "audiência una e continuada" frequentemente atribuída a um § 1º do art. 845 **NÃO foi localizada no texto oficial do Planalto** na consulta de 2026-08-30. NÃO citar essa disposição como literal.

## Hipóteses de aplicação no EJC
- Roteiro de audiência: testemunhas já comparecem independentemente de intimação (rito comum, art. 845) — planejamento de condução.
- Razões finais orais de até 10 minutos + renovação da conciliação antes da sentença.`,
    ['845', '848', '850'],
    {
      relacionamentos: [
        { destinoSlug: 'clt-arts-840-841-reclamacao-notificacao', tipo: 'SEQUENCIA_PROCESSUAL', descricao: 'Ordem dos atos: reclamação → audiência → defesa → instrução → razões finais.' },
        { destinoSlug: 'fluxo-reclamatoria-trabalhista-comum', tipo: 'ETAPA_PROCESSO', descricao: 'Fase de instrução do fluxo.' },
      ],
    },
  ),
  leiClt(
    'clt-arts-852-a-i-rito-sumarissimo',
    'CLT arts. 852-A a 852-I — Rito sumaríssimo: cabimento (até 40 salários mínimos), sanidade do pedido, audiência única e julgamento (textos literais confirmados)',
    'processo-trabalho',
    'Procedimento sumaríssimo',
    `## Textos CONFIRMADOS LITERALMENTE no Planalto (consulta 2026-08-30)

### Art. 852-A — Cabimento
"Art. 852-A. Os dissídios individuais cujo valor não exceda a quarenta vezes o salário mínimo vigente na data do ajuizamento da reclamação ficam submetidos ao procedimento sumaríssimo.
Parágrafo único. Estão excluídas do procedimento sumaríssimo as demandas em que é parte a Administração Pública direta, autárquica e fundacional."

### Art. 852-B — Sanidade
"Art. 852-B. Nas reclamações enquadradas no procedimento sumaríssimo:
I - o pedido deverá ser certo ou determinado e indicará o valor correspondente;
II - não se fará citação por edital, incumbindo ao autor a correta indicação do nome e endereço do reclamado;
III - a apreciação da reclamação deverá ocorrer no prazo máximo de quinze dias do seu ajuizamento [...]
§ 1º O não atendimento, pelo reclamante, do disposto nos incisos I e II deste artigo importará no arquivamento da reclamação e condenação ao pagamento de custas sobre o valor da causa.
§ 2º As partes e advogados comunicarão ao juízo as mudanças de endereço ocorridas no curso do processo [...]."

### Arts. 852-C, 852-D, 852-H e 852-I — Procedimento e sentença
"Art. 852-C. As demandas sujeitas a rito sumaríssimo serão instruídas e julgadas em audiência única [...]
Art. 852-D. O juiz dirigirá o processo com liberdade para determinar as provas a serem produzidas [...] podendo limitar ou excluir as que considerar excessivas, impertinentes ou protelatórias [...]
Art. 852-H. Todas as provas serão produzidas na audiência de instrução e julgamento, ainda que não requeridas previamente. § 2º As testemunhas, até o máximo de duas para cada parte, comparecerão à audiência de instrução e julgamento independentemente de intimação. § 4º Somente quando a prova do fato o exigir, ou for legalmente imposta, será deferida prova técnica [...]. § 6º As partes serão intimadas a manifestar-se sobre o laudo, no prazo comum de cinco dias. § 7º Interrompida a audiência, o seu prosseguimento e a solução do processo dar-se-ão no prazo máximo de trinta dias [...].
Art. 852-I. A sentença mencionará os elementos de convicção do juízo, com resumo dos fatos relevantes ocorridos em audiência, dispensado o relatório. § 1º O juízo adotará em cada caso a decisão que reputar mais justa e equânime [...]. § 3º As partes serão intimadas da sentença na própria audiência em que prolatada."

## Interpretação aplicada
- Critério de rito: **valor da causa ≤ 40 salários mínimos na data do ajuizamento**; exclusão obrigatória com Fazenda/administração pública.
- Sanidade: pedido certo/determinado com valor + endereço correto → senão **arquivamento + custas** (852-B, § 1º).
- Máximo de 2 testemunhas por parte; laudo em 5 dias comuns; retomada em até 30 dias.`,
    ['852-A', '852-B', '852-C', '852-D', '852-H', '852-I'],
    {
      relacionamentos: [
        { destinoSlug: 'clt-art-895-recurso-ordinario-texto-atual', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Procedimento especial do RO no sumaríssimo (art. 895, § 1º).' },
        { destinoSlug: 'regra-se-sumarissimo-valor-causa', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Regra SE-ENTÃO de classificação do rito.' },
      ],
    },
  ),
  leiClt(
    'clt-art-895-recurso-ordinario-texto-atual',
    'CLT art. 895 — Recurso ordinário: cabimento, prazo de 8 dias e regras do RO sumaríssimo (texto literal confirmado)',
    'processo-trabalho',
    'Recurso ordinário',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)

"Art. 895. Cabe recurso ordinário para a instância superior:
I - das decisões definitivas ou terminativas das Varas e Juízos, no prazo de 8 (oito) dias; e (Incluído pela Lei nº 11.925, de 2009)
II - das decisões definitivas ou terminativas dos Tribunais Regionais, em processos de sua competência originária, no prazo de 8 (oito) dias, quer nos dissídios individuais, quer nos dissídios coletivos. (Incluído pela Lei nº 11.925, de 2009)
§ 1º Nas reclamações sujeitas ao procedimento sumaríssimo, o recurso ordinário: (Incluído pela Lei nº 9.957, de 2000)
I - (VETADO)
II - será imediatamente distribuído, uma vez recebido no Tribunal, devendo o relator liberá-lo no prazo máximo de dez dias, e a Secretaria do Tribunal ou Turma colocá-lo imediatamente em pauta para julgamento, sem revisor;
III - terá parecer oral do representante do Ministério Público presente à sessão de julgamento, se este entender necessário o parecer, com registro na certidão;
IV - terá acórdão consistente unicamente na certidão de julgamento, com a indicação suficiente do processo e parte dispositiva, e das razões de decidir do voto prevalente. Se a sentença for confirmada pelos próprios fundamentos, a certidão de julgamento, registrando tal circunstância, servirá de acórdão.
§ 2º Os Tribunais Regionais, divididos em Turmas, poderão designar Turma para o julgamento dos recursos ordinários interpostos das sentenças prolatadas nas demandas sujeitas ao procedimento sumaríssimo."

## ALERTA ANTI-INVENÇÃO (registrado)
- O inciso I do § 1º está **VETADO**: a exigência estatutária de requisitos adicionais do RO sumaríssimo (ex.: consignação de valor e requerimento de vista) **não consta do texto legal vigente do Planalto**. Regulamentação via atos normativos internos do TST (súmulas/OJ) NÃO foi confirmada em fonte oficial nesta consulta — não citar números de súmula/OJ a respeito sem verificação.
- Prazos contam-se em **dias úteis** (art. 775, red. Lei 13.467/2017 — doc vinculado).`,
    ['895'],
    {
      relacionamentos: [
        { destinoSlug: 'prazo-recurso-ordinario-contrarrazoes-8-dias', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Prazo operacional derivado do art. 895 e do art. 900.' },
        { destinoSlug: 'clt-art-899-deposito-recursal-hipoteses', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Depósito recursal como requisito de admissibilidade em certas hipóteses.' },
      ],
    },
  ),
  leiClt(
    'clt-art-899-deposito-recursal-hipoteses',
    'CLT art. 899 — Depósito recursal: efeitos, §§ 1º-11 (valor, conta vinculada, reduções, isenções e substituição) (texto literal confirmado)',
    'processo-trabalho',
    'Depósito recursal',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30) — parágrafos vigentes

"Art. 899 - Os recursos serão interpostos por simples petição e terão efeito meramente devolutivo, salvo as exceções previstas neste Título, permitida a execução provisória até a penhora. (Redação dada pela Lei nº 5.442, de 24.5.1968)
§ 4º O depósito recursal será feito em conta vinculada ao juízo e corrigido com os mesmos índices da poupança. (Redação dada pela Lei nº 13.467, de 2017) (Vide ADC 58) (Vide ADC 59) (Vide ADI 5867) (Vide ADI 6021)
§ 6º Quando o valor da condenação, ou o arbitrado para fins de custas, exceder o limite de 10 (dez) vêzes o salário-mínimo da região, o depósito para fins de recursos será limitado a êste valor. (Incluído pela Lei nº 5.442, 24.5.1968)
§ 7º No ato de interposição do agravo de instrumento, o depósito recursal corresponderá a 50% (cinquenta por cento) do valor do depósito do recurso ao qual se pretende destrancar. (Incluído pela Lei nº 12.275, de 2010)
§ 8º Quando o agravo de instrumento tem a finalidade de destrancar recurso de revista que se insurge contra decisão que contraria a jurisprudência uniforme do Tribunal Superior do Trabalho, consubstanciada nas suas súmulas ou em orientação jurisprudencial, não haverá obrigatoriedade de se efetuar o depósito referido no § 7º deste artigo. (Incluído pela Lei nº 13.015, de 2014)
§ 9º O valor do depósito recursal será reduzido pela metade para entidades sem fins lucrativos, empregadores domésticos, microempreendedores individuais, microempresas e empresas de pequeno porte. (Incluído pela Lei nº 13.467, de 2017)
§ 10. São isentos do depósito recursal os beneficiários da justiça gratuita, as entidades filantrópicas e as empresas em recuperação judicial. (Incluído pela Lei nº 13.467, de 2017)
§ 11. O depósito recursal poderá ser substituído por fiança bancária ou seguro garantia judicial. (Incluído pela Lei nº 13.467, de 2017)"

## Nota de coerência
- Os §§ 1º, 2º e 5º originais estão revogados ou com redações históricas; o plano da base registra apenas o texto vigente confirmado acima.
- Atualização dos depósitos recursais: **IPCA-E na fase pré-judicial + SELIC a partir da citação** por interpretação conforme (ADC 58/59 — doc vinculado).
- Isenção do beneficiário de gratuidade (§ 10) permanece — a ADI 5766 NÃO atingiu este inciso (atingiu 790-B caput/§ 4º e 791-A § 4º).`,
    ['899'],
    {
      relacionamentos: [
        { destinoSlug: 'adc-58-59-ipca-e-selic-atualizacao-jt', tipo: 'PRECEDENTE_APLICAVEL', descricao: 'Interpretação conforme sobre correção de depósitos e créditos (IPCA-E + SELIC).' },
        { destinoSlug: 'clt-art-895-recurso-ordinario-texto-atual', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Depósito como questão de admissibilidade do recurso.' },
      ],
    },
  ),
  leiClt(
    'clt-arts-790-791-a-custas-gratuidade-honorarios',
    'CLT arts. 790, 790-A, 790-B e 791-A — Gratuidade (40% do teto do RGPS), isenções, honorários periciais e de sucumbência com anotações da ADI 5766 (textos literais confirmados)',
    'gratuidade-custas',
    'Custas, gratuidade e honorários',
    `## Textos CONFIRMADOS LITERALMENTE no Planalto (consulta 2026-08-30)

### Art. 790, §§ 3º e 4º — gratuidade
"§ 3º É facultado aos juízes, órgãos julgadores e presidentes dos tribunais do trabalho de qualquer instância conceder, a requerimento ou de ofício, o benefício da justiça gratuita, inclusive quanto a traslados e instrumentos, àqueles que perceberem salário igual ou inferior a 40% (quarenta por cento) do limite máximo dos benefícios do Regime Geral de Previdência Social. (Redação dada pela Lei nº 13.467, de 2017)
§ 4º O benefício da justiça gratuita será concedido à parte que comprovar insuficiência de recursos para o pagamento das custas do processo. (Incluído pela Lei nº 13.467, de 2017)"

### Art. 790-A — isentos de custas
"Art. 790-A. São isentos do pagamento de custas, além dos beneficiários de justiça gratuita: I - a União, os Estados, o Distrito Federal, os Municípios e respectivas autarquias e fundações públicas federais, estaduais ou municipais que não explorem atividade econômica; II - o Ministério Público do Trabalho. Parágrafo único. A isenção prevista neste artigo não alcança as entidades fiscalizadoras do exercício profissional, nem exime as pessoas jurídicas referidas no inciso I da obrigação de reembolsar as despesas judiciais realizadas pela parte vencedora."

### Art. 790-B — honorários periciais (com anotação oficial da ADI 5766)
"Art. 790-B. A responsabilidade pelo pagamento dos honorários periciais é da parte sucumbente na pretensão objeto da perícia, ainda que beneficiária da justiça gratuita. (Redação dada pela Lei nº 13.467, de 2017) **(Declarado inconstitucional pela ADI 5766)**
§ 1º Ao fixar o valor dos honorários periciais, o juízo deverá respeitar o limite máximo estabelecido pelo Conselho Superior da Justiça do Trabalho.
§ 2º O juízo poderá deferir parcelamento dos honorários periciais.
§ 3º O juízo não poderá exigir adiantamento de valores para realização de perícias.
§ 4º Somente no caso em que o beneficiário da justiça gratuita não tenha obtido em juízo créditos capazes de suportar a despesa referida no caput, ainda que em outro processo, a União responderá pelo encargo. (Incluído pela Lei nº 13.467, de 2017) **(Declarado inconstitucional pela ADI 5766)**"

### Art. 791-A — honorários de sucumbência (com anotação oficial da ADI 5766)
"Art. 791-A. Ao advogado, ainda que atue em causa própria, serão devidos honorários de sucumbência, fixados entre o mínimo de 5% (cinco por cento) e o máximo de 15% (quinze por cento) sobre o valor que resultar da liquidação da sentença, do proveito econômico obtido ou, não sendo possível mensurá-lo, sobre o valor atualizado da causa. (Incluído pela Lei nº 13.467, de 2017)
§ 1º Os honorários são devidos também nas ações contra a Fazenda Pública e nas ações em que a parte estiver assistida ou substituída pelo sindicato de sua categoria.
§ 2º Ao fixar os honorários, o juízo observará: I - o grau de zelo do profissional; II - o lugar de prestação do serviço; III - a natureza e a importância da causa; IV - o trabalho realizado pelo advogado e o tempo exigido para o seu serviço.
§ 3º Na hipótese de procedência parcial, o juízo arbitrará honorários de sucumbência recíproca, vedada a compensação entre os honorários.
§ 4º Vencido o beneficiário da justiça gratuita, desde que não tenha obtido em juízo, ainda que em outro processo, créditos capazes de suportar a despesa, as obrigações decorrentes de sua sucumbência ficarão sob condição suspensiva de exigibilidade [...]. (Incluído pela Lei nº 13.467, de 2017) **(Declarado inconstitucional pela ADI 5766)**
§ 5º São devidos honorários de sucumbência na reconvenção."

## Interpretação aplicada (pós-ADI 5766)
- **Inconstitucionais** (Plenário STF, 20.10.2021): art. 790-B caput e § 4º, e art. 791-A § 4º — o beneficiário de gratuidade vencido NÃO responde por honorários/perícia nem fica sob condição suspensiva de exigibilidade.
- **Constitucional**: custas da ausência do reclamante (art. 844, § 2º).
- Honorários de sucumbência (791-A, caput-§ 3º e § 5º) permanecem exigíveis em regra.`,
    ['790', '790-A', '790-B', '791-A'],
    {
      relacionamentos: [
        { destinoSlug: 'adi-5766-sucumbencia-gratuidade-jt', tipo: 'PRECEDENTE_APLICAVEL', descricao: 'Controle de constitucionalidade que define a eficácia prática destes dispositivos.' },
        { destinoSlug: 'argumentacao-honorarios-gratuidade-clt-bilateral', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Argumentos pro e contra na aplicação pós-ADI 5766.' },
      ],
    },
  ),
  leiClt(
    'clt-art-477-verbas-rescisorias-multas',
    'CLT art. 477 — Verbas rescisórias: quitação especificada, prazos de pagamento (10 dias) e multa por atraso (textos literais confirmados)',
    'rescisao',
    'Verbas rescisórias e multas do art. 477',
    `## Textos CONFIRMADOS LITERALMENTE no Planalto (consulta 2026-08-30) — dispositivos vigentes

"Art. 477. Na extinção do contrato de trabalho, o empregador deverá proceder à anotação na Carteira de Trabalho e Previdência Social, comunicar a dispensa aos órgãos competentes e realizar o pagamento das verbas rescisórias no prazo e na forma estabelecidos neste artigo. (Redação dada pela Lei nº 13.467, de 2017)
§ 2º - O instrumento de rescisão ou recibo de quitação, qualquer que seja a causa ou forma de dissolução do contrato, deve ter especificada a natureza de cada parcela paga ao empregado e discriminado o seu valor, sendo válida a quitação, apenas, relativamente às mesmas parcelas. (Redação dada pela Lei nº 5.584, de 26.6.1970)
§ 4º O pagamento a que fizer jus o empregado será efetuado: I - em dinheiro, depósito bancário ou cheque visado, conforme acordem as partes; ou II - em dinheiro ou depósito bancário quando o empregado for analfabeto. (Redação dada pela Lei nº 13.467, de 2017)
§ 6º A entrega ao empregado de documentos que comprovem a comunicação da extinção contratual aos órgãos competentes bem como o pagamento dos valores constantes do instrumento de rescisão ou recibo de quitação deverão ser efetuados até dez dias contados a partir do término do contrato. (Redação dada pela Lei nº 13.467, de 2017)
§ 8º A inobservância do disposto no § 6º deste artigo sujeitará o infrator à multa de 160 BTN, por trabalhador, bem assim ao pagamento da multa a favor do empregado, em valor equivalente ao seu salário, devidamente corrigido pelo índice de variação do BTN, salvo quando, comprovadamente, o trabalhador der causa à mora. (Incluído pela Lei nº 7.855, de 24.10.1989)"

## Nota honesta sobre o § 8º
- O texto do § 8º teve redação dada pela MP 905/2019 que foi **revogada pela MP 955/2020** (vigência encerrada), restando em vigor, conforme ordem de apresentação da própria página oficial, a redação da Lei 7.855/1989 acima reproduzida (multa de 160 BTN + salário corrigido pelo BTN). A conversão do BTN em valor atual é objeto de análise caso a caso pelo juízo — sem parâmetro oficial registado nesta consulta.

## Interpretação aplicada
- Prazo único: **até 10 dias do término do contrato** (§ 6º, red. 13.467) para documentos e pagamento.
- Quitação válida só para parcelas especificadas (§ 2º) — quitação genérica não impede reclamação de verbas não discriminadas.`,
    ['477'],
    {
      relacionamentos: [
        { destinoSlug: 'prazo-pagamento-verbas-rescisorias-10-dias', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Prazo operacional do § 6º com termo inicial e risco.' },
        { destinoSlug: 'clt-art-467-parte-incontroversa', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Multa sobre a parte incontroversa paga após o comparecimento.' },
        { destinoSlug: 'fluxo-reclamatoria-trabalhista-comum', tipo: 'ETAPA_PROCESSO', descricao: 'Verbas típicas do objeto da reclamatória.' },
      ],
    },
  ),
  leiClt(
    'clt-art-467-parte-incontroversa',
    'CLT art. 467 — Verbas incontroversas na rescisão: pagamento no comparecimento à JT sob pena de acréscimo de 50% (texto literal confirmado)',
    'rescisao',
    'Multa da parte incontroversa',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)

"Art. 467. Em caso de rescisão de contrato de trabalho, havendo controvérsia sobre o montante das verbas rescisórias, o empregador é obrigado a pagar ao trabalhador, à data do comparecimento à Justiça do Trabalho, a parte incontroversa dessas verbas, sob pena de pagá-las acrescidas de cinqüenta por cento". (Redação dada pela Lei nº 10.272, de 5.9.2001)
Parágrafo único. O disposto no caput não se aplica à União, aos Estados, ao Distrito Federal, aos Municípios e as suas autarquias e fundações públicas. (Incluído pela Medida provisória nº 2.180-35, de 2001)"

## Interpretação aplicada
- Âmbito: **verbas rescisórias** com controvérsia sobre o montante; termo de cobrança do acréscimo: pagamento só no comparecimento à JT.
- Exceção personificada: não incide contra fazendas públicas (parágrafo único).
- Combinação com art. 477 § 8º (multa pelo atraso global) é matéria de análise em cada caso.`,
    ['467'],
    {
      relacionamentos: [
        { destinoSlug: 'clt-art-477-verbas-rescisorias-multas', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Sistema de multas rescisórias (477 § 8º x 467).' },
      ],
    },
  ),
  leiClt(
    'clt-arts-775-775-a-prazos-dias-uteis',
    'CLT arts. 775 e 775-A — Contagem em dias úteis, prorrogação e suspensão de 20/12 a 20/01 (textos literais confirmados)',
    'processo-trabalho',
    'Prazos processuais trabalhistas',
    `## Textos CONFIRMADOS LITERALMENTE no Planalto (consulta 2026-08-30)

"Art. 775. Os prazos estabelecidos neste Título serão contados em dias úteis, com exclusão do dia do começo e inclusão do dia do vencimento. (Redação dada pela Lei nº 13.467, de 2017)
§ 1º Os prazos podem ser prorrogados, pelo tempo estritamente necessário, nas seguintes hipóteses: I - quando o juízo entender necessário; II - em virtude de força maior, devidamente comprovada.
§ 2º Ao juízo incumbe dilatar os prazos processuais e alterar a ordem de produção dos meios de prova, adequando-os às necessidades do conflito de modo a conferir maior efetividade à tutela do direito.

Art. 775-A. Suspende-se o curso do prazo processual nos dias compreendidos entre 20 de dezembro e 20 de janeiro, inclusive. (Incluído pela Lei nº 13.545, de 2017)
§ 1º Ressalvadas as férias individuais e os feriados instituídos por lei, os juízes, os membros do Ministério Público, da Defensoria Pública e da Advocacia Pública e os auxiliares da Justiça exercerão suas atribuições durante o período previsto no caput deste artigo.
§ 2º Durante a suspensão do prazo, não se realizarão audiências nem sessões de julgamento."

## Pontos críticos
- **Dias úteis** (caput, red. 13.467) — difere de prazos legais materiais (ex.: rescisórios do art. 477 § 6º, contados em dias corridos por serem prazos de obrigação, não processuais).
- Suspensão de fim de ano: 20/12 a 20/01 (inclusive) — nenhum prazo processual corre nesse intervalo e audiências não são realizadas.
- Calculadora de prazos do EJC (aba Ferramentas) opera com dias úteis CPC; prazos trabalhistas seguem a mesma mecânica de exclusão de fins de semana e feriados, com a ressalva da suspensão anual do 775-A.`,
    ['775', '775-A'],
    {
      relacionamentos: [
        { destinoSlug: 'prazo-suspensao-fim-de-ano-775-a', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Prazo-operacional da suspensão de dezembro a janeiro.' },
        { destinoSlug: 'prazo-recurso-ordinario-contrarrazoes-8-dias', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Contagem em dias úteis aplicada aos recursos.' },
      ],
    },
  ),
  leiClt(
    'clt-art-11-prescricao-creditos-trabalhistas',
    'CLT art. 11 — Prescrição dos créditos trabalhistas: 5 anos (limite de 2 após extinção) e 2 anos para o rural (texto literal confirmado)',
    'vinculo',
    'Prescrição trabalhista',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)

"Art. 11 - O direito de ação quanto a créditos resultantes das relações de trabalho prescreve: (Redação dada pela Lei nº 9.658, de 5.6.1998)
I - em cinco anos para o trabalhador urbano, até o limite de dois anos após a extinção do contrato; (Incluído pela Lei nº 9.658, de 5.6.1998) (Vide Emenda Constitucional nº 28 de 25.5.2000)
II - em dois anos, após a extinção do contrato de trabalho, para o trabalhador rural. (Incluído pela Lei nº 9.658, de 5.6.1998) (Vide Emenda Constitucional nº 28 de 25.5.2000)"

## Nota de alinhamento
- Corresponde ao art. 7º, XXIX, da Constituição Federal para o trabalhador urbano (prescrição quinquenal com limite bienal pós-extinção).
- **Não é duplicata** do registro PRAZO 'prazo-reclamacao-trabalhista-2-anos' (LOTE-001): este é o banco de legislação (texto literal); aquele é o banco de prazos (operações de triagem).

## Hipóteses de aplicação no EJC
- Sanidade temporal da inicial: retroagir no máximo 5 anos + eventual prescrição intercorrente.
- Contratos extintos há mais de 2 anos: análise de prescrição total dos créditos.`,
    ['11'],
    {
      relacionamentos: [
        { destinoSlug: 'prazo-reclamacao-trabalhista-2-anos', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Registro de prazo (LOTE-001) derivado deste dispositivo.' },
        { destinoSlug: 'checklist-dossie-reclamatoria-trabalhista', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Conferência de datas na montagem do dossiê.' },
      ],
    },
  ),

  {
    slug: 'adi-5766-sucumbencia-gratuidade-jt',
    titulo: 'ADI 5766/STF — Inconstitucionais os arts. 790-B (caput e § 4º) e 791-A § 4º da CLT; constitucional o art. 844 § 2º (tese e ementa literais confirmadas)',
    tipoDocumento: 'JURISPRUDENCIA',
    area: 'trabalhista',
    subarea: 'gratuidade-custas',
    assunto: 'Gratuidade de justiça e ônus sucumbenciais na Justiça do Trabalho',
    prioridade: 'P1',
    lote: 'LOTE-010',
    conteudo: `## Tese firmada (texto LITERAL confirmado em página oficial do TRT6 — consulta 2026-08-30)

"O Tribunal, por maioria, julgou parcialmente procedente o pedido formulado na ação direta, para declarar inconstitucionais os arts. 790-B, caput e § 4º, e 791-A, § 4º, da Consolidação das Leis do Trabalho (CLT), vencidos, em parte, os Ministros Roberto Barroso (Relator), Luiz Fux (Presidente), Nunes Marques e Gilmar Mendes. Por maioria, julgou improcedente a ação no tocante ao art. 844, § 2º, da CLT, declarando-o constitucional, vencidos os Ministros Edson Fachin, Ricardo Lewandowski e Rosa Weber. Redigirá o acórdão o Ministro Alexandre de Moraes. Plenário, 20.10.2021."

## Ementa (trecho LITERAL — ponto 1)
"1. É inconstitucional a legislação que presume a perda da condição de hipossuficiência econômica para efeito de aplicação do benefício de gratuidade de justiça, apenas em razão da apuração de créditos em favor do trabalhador em outra relação processual, dispensado o empregador do ônus processual de comprovar eventual modificação na capacidade econômica do beneficiário.
2. A ausência injustificada à audiência de julgamento frustra o exercício da jurisdição e acarreta prejuízos materiais para o órgão judiciário e para a parte reclamada, o que não se coaduna com deveres mínimos de boa-fé, cooperação e lealdade processual, mostrando-se proporcional a restrição do benefício de gratuidade de justiça nessa hipótese."

## Dados do processo (confirmação oficial)
- Tribunal: STF (Tribunal Pleno) | Classe: ADI 5766 | Relator: Min. Roberto Barroso | Redator do acórdão: Min. Alexandre de Moraes
- Julgamento: 20/10/2021 | Publicação: DJe-084, DIVULG 02-05-2022, PUBLIC 03-05-2022 | Trânsito em julgado: 04/08/2022

## Efeitos práticos para o escritório
- **Autor (beneficiário de gratuidade) vencido NÃO responde** por honorários de sucumbência (791-A § 4º) nem por honorários periciais (790-B caput/§ 4º) — dispositivos formalmente inconstitucionais.
- **Custas por ausência à audiência (art. 844, § 2º) permanecem** — o pagamento delas segue sendo condição para nova demanda (844, § 3º).
- A isenção de depósito recursal do beneficiário de gratuidade (art. 899, § 10) NÃO foi atingida pela ADI.`,
    metadados: { tribunal: 'STF', classe: 'ADI', numero_processo: 'ADI 5766', orgao_julgador: 'Tribunal Pleno', relator: 'Min. Roberto Barroso', redator_acordao: 'Min. Alexandre de Moraes', data_julgamento: '2021-10-20', data_publicacao: '2022-05-03', transito_julgado: '2022-08-04', tema_controle: 'Reforma Trabalhista — gratuidade de justiça', confirmacao_fonte: 'Tese e ementa literais reproduzidas na página oficial "Temas e Precedentes" do TRT6 (*.jus.br), com link para o acórdão em PDF' },
    tags: ['trabalhista/gratuidade-custas', 'trabalhista/processo-trabalho'],
    fonte: 'TRT6 — Tribunal Regional do Trabalho da 6ª Região (portal oficial, Temas e Precedentes)',
    urlFonte: 'https://www.trt6.jus.br/portal/jurisprudencia/temas-e-precedentes/23274',
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'clt-arts-790-791-a-custas-gratuidade-honorarios', tipo: 'CONTROLA_VIGENCIA', descricao: 'Define os dispositivos inconstitucionais (790-B caput/§ 4º; 791-A § 4º) e o constitucional (844 § 2º).' },
      { destinoSlug: 'tese-honorarios-gratuidade-apos-adi-5766', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Tese operacional derivada do julgamento.' },
      { destinoSlug: 'argumentacao-honorarios-gratuidade-clt-bilateral', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Argumentos das partes com base na decisão.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'adc-58-59-ipca-e-selic-atualizacao-jt',
    titulo: 'ADC 58/59 STF — Créditos trabalhistas e depósitos recursais: IPCA-E na fase pré-judicial e SELIC a partir da citação (decisão literal confirmada)',
    tipoDocumento: 'JURISPRUDENCIA',
    area: 'trabalhista',
    subarea: 'processo-trabalho',
    assunto: 'Atualização monetária e juros na Justiça do Trabalho',
    prioridade: 'P1',
    lote: 'LOTE-010',
    conteudo: `## Decisão (texto LITERAL confirmado em página oficial do TRT6 — consulta 2026-08-30)

"O Tribunal, por maioria, julgou parcialmente procedente a ação, para conferir interpretação conforme à Constituição ao art. 879, § 7º, e ao art. 899, § 4º, da CLT, na redação dada pela Lei 13.467 de 2017, no sentido de considerar que à atualização dos créditos decorrentes de condenação judicial e à correção dos depósitos recursais em contas judiciais na Justiça do Trabalho deverão ser aplicados, até que sobrevenha solução legislativa, os mesmos índices de correção monetária e de juros que vigentes para as condenações cíveis em geral, quais sejam a incidência do IPCA-E na fase pré-judicial e, a partir da citação, a incidência da taxa SELIC (art. 406 do Código Civil)."

## Modulação (resumo literal essencial)
- Pagamentos realizados com TR (ou outros índices) no tempo e modo oportunos permanecem válidos e não ensejam rediscussão, inclusive depósitos judiciais e juros de mora de 1% ao mês;
- Processos sobrestados na fase de conhecimento aplicam SELIC de forma retroativa (juros e correção);
- Eficácia erga omnes e vinculante também sobre feitos já transitados em julgado sem manifestação expressa sobre índices.

## Objeto das ADCs (confirmação oficial)
- Constitucionalidade dos arts. 879, § 7º, e 899, § 1º (e § 4º na aplicação), da CLT (red. Lei 13.467/2017) e do art. 39, caput e § 1º, da Lei 8.177/1991.

## Efeitos práticos
- Cálculo de liquidação/cumprimento de sentença e de depósitos recursais: **IPCA-E pré-judicial + SELIC após a citação** até nova legislação.
- Cálculos antigos com TR não são automaticamente refeitos (modulação) — verificar em cada caso.`,
    metadados: { tribunal: 'STF', classe: 'ADC', numero_processo: 'ADC 58/DF e ADC 59/DF (julgadas em conjunto)', orgao: 'Tribunal Pleno', tema_controle: 'Atualização monetária TR x IPCA-E e juros na Justiça do Trabalho', confirmacao_fonte: 'Decisão literal reproduzida na página oficial "Temas e Precedentes" do TRT6 (*.jus.br)' },
    tags: ['trabalhista/processo-trabalho', 'geral/prazos'],
    fonte: 'TRT6 — Tribunal Regional do Trabalho da 6ª Região (portal oficial, Temas e Precedentes)',
    urlFonte: 'https://www.trt6.jus.br/portal/jurisprudencia/temas-e-precedentes/20228',
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'clt-art-899-deposito-recursal-hipoteses', tipo: 'INTERPRETA_DISPOSITIVO', descricao: 'Interpretação conforme dos §§ 4º (e 879 § 7º) para atualização.' },
      { destinoSlug: 'clt-art-477-verbas-rescisorias-multas', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Índices aplicáveis na liquidação de verbas rescisórias condenadas.' },
    ],
  } satisfies InputDocument,

  {
    slug: 'prazo-recurso-ordinario-contrarrazoes-8-dias',
    titulo: 'PRAZO — Recurso ordinário e contrarrazões: 8 dias úteis (CLT arts. 895 e 900 c/c art. 775)',
    tipoDocumento: 'PRAZO',
    area: 'trabalhista',
    subarea: 'processo-trabalho',
    assunto: 'Prazos de recurso no processo do trabalho',
    prioridade: 'P1',
    lote: 'LOTE-010',
    conteudo: `# PRAZO — Recurso ordinário (CLT)

## Regra
- **Recurso ordinário: 8 (oito) dias úteis** — CLT art. 895, I e II (red. Lei 11.925/2009), contados em dias úteis (art. 775, red. Lei 13.467/2017).
- **Contrarrazões: 8 (oito) dias úteis** — CLT art. 900 ("Interposto o recurso, será notificado o recorrido para oferecer as suas razões, em prazo igual ao que tiver tido o recorrente").

## Termo inicial
- Publicação da sentença (intimação da decisão) para o RO; juntada do comprovante de intimação para a contagem — convenção processual do processo do trabalho.

## Providências e documento necessário
| Dia | Providência | Documento |
|---|---|---|
| D+0 | Confere pré-requisitos (custas 2% art. 789; depósito recursal quando exigível — art. 899 §§ 4º/9º-11) | comprovantes |
| até D+8 | Protocolo do RO / contrarrazões | petição |
| após | Acompanhamento de pauta (sumaríssimo: liberação em 10 dias — art. 895 § 1º II) | |

## Risco
- Prazo é fatal (preclusão temporal); custas/depósito ausentes = recurso não admitido.
- Suspensão de fim de ano (20/12 a 20/01 — art. 775-A) NÃO conta prazo.

## Próxima etapa
- RO provido → retorno à origem para execução; improvido → prazos de instâncias superiores.`,
    metadados: { fundamento: 'CLT arts. 895, 900, 775 e 789', tipo_prazo: 'processual (dias úteis)', destino: 'TRT — Vara/Tribunal' },
    tags: ['trabalhista/processo-trabalho', 'geral/prazos'],
    fonte: 'Presidência da República — Planalto (CLT)',
    urlFonte: 'https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm',
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'clt-art-895-recurso-ordinario-texto-atual', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Texto literal do art. 895.' },
      { destinoSlug: 'clt-arts-775-775-a-prazos-dias-uteis', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Contagem em dias úteis e suspensão de fim de ano.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'prazo-pagamento-verbas-rescisorias-10-dias',
    titulo: 'PRAZO — Pagamento e documentos rescisórios: 10 dias do término do contrato; multa do art. 477 § 8º e acréscimo de 50% do art. 467',
    tipoDocumento: 'PRAZO',
    area: 'trabalhista',
    subarea: 'rescisao',
    assunto: 'Prazos de verbas rescisórias',
    prioridade: 'P1',
    lote: 'LOTE-010',
    conteudo: `# PRAZO — Verbas rescisórias (CLT arts. 477 § 6º e 467)

## Regra
- **Documentos + pagamento: até 10 dias corridos do término do contrato** (CLT art. 477, § 6º, red. Lei 13.467/2017).
- **Multa por atraso (477, § 8º)**: multa de 160 BTN por trabalhador + multa em favor do empregado equivalente ao salário (corrigida pelo BTN), salvo mora causada pelo trabalhador.
- **Parte incontroversa (art. 467)**: pagar à data do comparecimento à JT sob pena de acréscimo de 50% — não incide contra fazendas públicas.

## Termo inicial
- Término do contrato de trabalho (§ 6º).

## Risco
- Acumulação potencial das multas 477 § 8º x 467 conforme a espécie (análise caso a caso).
- Quitação genérica não vale: só parcelas especificadas (477, § 2º).

## Próxima etapa
- Sem pagamento em 10 dias: notification extrajudicial + reclamatória com pedidos de multas.`,
    metadados: { fundamento: 'CLT arts. 477 §§ 2º, 6º e 8º; art. 467', tipo_prazo: 'material (dias corridos)', responsavel: 'empregador' },
    tags: ['trabalhista/rescisao', 'geral/prazos'],
    fonte: 'Presidência da República — Planalto (CLT)',
    urlFonte: 'https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm',
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'clt-art-477-verbas-rescisorias-multas', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Texto literal dos §§ 6º e 8º.' },
      { destinoSlug: 'clt-art-467-parte-incontroversa', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Acréscimo de 50% da parte incontroversa.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'prazo-audiencia-notificacao-48h-5-dias',
    titulo: 'PRAZO — Notificação para audiência: envio em 48h e audiência após 5 dias (CLT art. 841)',
    tipoDocumento: 'PRAZO',
    area: 'trabalhista',
    subarea: 'processo-trabalho',
    assunto: 'Prazos da fase inicial da reclamatória',
    prioridade: 'P1',
    lote: 'LOTE-010',
    conteudo: `# PRAZO — Designação de audiência (CLT art. 841)

## Regra
- Protocolada a reclamação, o escrivão/secretário tem **48 horas** para remeter a segunda via ao reclamado com a notificação para audiência (CLT art. 841, caput).
- A audiência será **a primeira desimpedida depois de 5 dias** (caput).

## Termo inicial
- 48h: recebimento e protocolo da reclamação.
- 5 dias: contagem para a data mínima de audiência.

## Providências
- Reclamante: comparecer com testemunhas (art. 845) e provas.
- Reclamado: defesa oral de 20 minutos (art. 847 — estrutura do rito comum confirmada na página oficial como texto histórico corrente da CLT).

## Risco
- Ausência do reclamante = arquivamento + custas (art. 844 §§ 2º-3º — constitucionalidade confirmada na ADI 5766).
- Ausência do reclamado = revelia + confissão quanto à matéria de fato, com exceções do art. 844 § 4º.

## Próxima etapa
- Audiência → conciliação (arts. 846-847) → defesa → instrução (art. 848) → razões finais (art. 850) → sentença.`,
    metadados: { fundamento: 'CLT arts. 841, 844-847', tipo_prazo: 'processual', responsavel: 'cartório/juízo e partes' },
    tags: ['trabalhista/processo-trabalho', 'geral/prazos'],
    fonte: 'Presidência da República — Planalto (CLT)',
    urlFonte: 'https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm',
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'clt-arts-840-841-reclamacao-notificacao', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Texto literal do art. 841.' },
      { destinoSlug: 'fluxo-reclamatoria-trabalhista-comum', tipo: 'ETAPA_PROCESSO', descricao: 'Posição no fluxo.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'prazo-suspensao-fim-de-ano-775-a',
    titulo: 'PRAZO — Suspensão de prazos processuais trabalhistas de 20/12 a 20/01 (CLT art. 775-A)',
    tipoDocumento: 'PRAZO',
    area: 'trabalhista',
    subarea: 'processo-trabalho',
    assunto: 'Suspensão anual de prazos',
    prioridade: 'P2',
    lote: 'LOTE-010',
    conteudo: `# PRAZO — Suspensão de fim de ano (CLT art. 775-A)

## Regra
- O curso do prazo processual fica **suspenso entre 20 de dezembro e 20 de janeiro, inclusive** (CLT art. 775-A, incluído pela Lei 13.545/2017).
- Durante a suspensão, **não se realizam audiências nem sessões de julgamento** (§ 2º); ressalvadas férias individuais e feriados, os magistrados e auxiliares exercem atribuições (§ 1º).

## Termo inicial/retomada
- Suspensão: 20/12. Retomada da contagem: 21/01.

## Providências
- Planejar protocolos de recursos e audiências fora do intervalo; pedidos ajuizados nesse período ainda recebem protocolo, mas prazos processuais não correm.

## Risco
- Confundir prazo processual (suspenso) com prazos de obrigação material (ex.: rescisórios do art. 477 § 6º) — estes continuam a correr (análise por natureza do prazo).`,
    metadados: { fundamento: 'CLT art. 775-A (Lei 13.545/2017)', tipo_prazo: 'suspensão processual anual' },
    tags: ['trabalhista/processo-trabalho', 'geral/prazos'],
    fonte: 'Presidência da República — Planalto (CLT)',
    urlFonte: 'https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm',
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'clt-arts-775-775-a-prazos-dias-uteis', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Texto literal do 775-A.' },
    ],
  } satisfies InputDocument,

  {
    slug: 'tese-honorarios-gratuidade-apos-adi-5766',
    titulo: 'TESE — Beneficiário de justiça gratuita vencido não paga honorários de sucumbência nem periciais na JT (pós-ADI 5766)',
    tipoDocumento: 'TESE',
    area: 'trabalhista',
    subarea: 'gratuidade-custas',
    assunto: 'Sucumbência do beneficiário de gratuidade',
    prioridade: 'P1',
    lote: 'LOTE-010',
    conteudo: `# TESE — Gratuidade de justiça x sucumbência na Justiça do Trabalho (estado atual)

## Enunciado operacional
- Não pode ser cobrado do trabalhador beneficiário da gratuidade vencido: (i) honorários de sucumbência sob condição suspensiva (CLT art. 791-A, § 4º); (ii) honorários periciais (CLT art. 790-B, caput e § 4º) — dispositivos **declarados inconstitucionais** pelo STF (ADI 5766, Plenário, 20.10.2021, DJe 03/05/2022).
- Permanecem válidos: honorários de sucumbência na regra geral (791-A, caput a § 3º e § 5º — 5% a 15%) e as custas da ausência do reclamante (844, §§ 2º-3º, declarados constitucionais).

## Requisitos lógicos da tese defensiva
1. Concessão de gratuidade no processo (ou em outro processo da parte);
2. Resultado desfavorável (total ou na sucumbência recíproca — 791-A § 3º);
3. Opposição da execução da sucumbência com base na ADI 5766.

## Fundamentos
- ADI 5766/STF — tese e ementa literais (docs vinculados: legislação CLT com anotações oficiais + registro de jurisprudência).
- Presunção de hipossuficiência não pode decorrer apenas de créditos obtidos em outra relação processual (ponto 1 da ementa).

## Riscos e controvérsias
- Reconvenção (791-A § 5º) e litigância de má-fé não foram objeto da ADI — cobranças nessas hipóteses seguem em análise caso a caso.
- Honorários de advogado do sindicato/substituição processual (art. 22 da Lei 5.584/1970) NÃO foram confirmados em fonte oficial nesta consulta — não citar parâmetros sem verificação.`,
    metadados: { probabilidade: 'alta (fundamento constitucional consolidado)', tipo_tese: 'defesa do trabalhador / risco do empregador', areas_uso: ['reclamatória', 'cumprimento de sentença'] },
    tags: ['trabalhista/gratuidade-custas'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'adi-5766-sucumbencia-gratuidade-jt', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Precedente-fonte da tese.' },
      { destinoSlug: 'clt-arts-790-791-a-custas-gratuidade-honorarios', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Dispositivos com anotações oficiais de inconstitucionalidade.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'tese-rito-sumarissimo-cabimento-efeitos',
    titulo: 'TESE — Rito sumaríssimo: cabimento até 40 salários mínimos, sanidade obrigatória e julgamento em audiência única',
    tipoDocumento: 'TESE',
    area: 'trabalhista',
    subarea: 'processo-trabalho',
    assunto: 'Procedimento sumaríssimo',
    prioridade: 'P1',
    lote: 'LOTE-010',
    conteudo: `# TESE — Estratégia no rito sumaríssimo (CLT arts. 852-A a 852-I)

## Enunciado operacional
- Demanda com valor ≤ **40 salários mínimos** na data do ajuizamento segue sumaríssimo, **exceto** se parte for Administração Pública direta/autárquica/fundacional (art. 852-A e parágrafo único).
- Pedido deve ser **certo ou determinado com valor** e endereço correto do reclamado; inobservância → **arquivamento + custas sobre o valor da causa** (art. 852-B, § 1º) — regra de sanidade mais severa que a do rito comum (extinção por pedido — art. 840 § 3º).
- Tudo (provas, laudo com manifestação em 5 dias, sentença) concentra-se em **audiência única** (arts. 852-C, 852-H e 852-I); máximo de 2 testemunhas por parte.

## Requisitos lógicos
1. Valor da causa apurado na data do ajuizamento;
2. Ausência de fazenda pública como parte;
3. Pedido líquido e endereço verificável.

## Riscos
- Erro de valor/qualificação → arquivamento com custas (852-B § 1º);
- Recurso ordinário com tramitação especial (art. 895 § 1º II-IV: distribuição imediata, parecer oral, acórdão-certidão).`,
    metadados: { probabilidade: 'alta (texto legal literal)', tipo_tese: 'procedimental', areas_uso: ['reclamatória', 'auditoria de petições'] },
    tags: ['trabalhista/processo-trabalho'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'clt-arts-852-a-i-rito-sumarissimo', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Textos literais dos arts. 852-A a 852-I.' },
      { destinoSlug: 'regra-se-sumarissimo-valor-causa', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Classificação automática do rito.' },
    ],
  } satisfies InputDocument,

  {
    slug: 'peca-reclamacao-trabalhista-modelo-variaveis',
    titulo: 'PEÇA — Reclamação trabalhista (rito comum): modelo estruturado com variáveis {{...}}',
    tipoDocumento: 'PECA',
    area: 'trabalhista',
    subarea: 'processo-trabalho',
    assunto: 'Modelo de petição inicial trabalhista',
    prioridade: 'P1',
    lote: 'LOTE-010',
    conteudo: `# EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DO TRABALHO DA VARA DO TRABALHO DE {{CIDADE_VARA}}

## Qualificação e fundamentos
{{NOME_RECLAMANTE}}, {{NACIONALIDADE}}, {{ESTADO_CIVIL}}, {{PROFISSAO}}, portador(a) da CTPS nº {{CTPS}} e CPF nº {{CPF_RECLAMANTE}}, residente em {{ENDERECO_RECLAMANTE}}, por seu advogado infra-assinado (procuração anexa), vem ajuizar RECLAMAÇÃO TRABALHISTA em face de {{NOME_RECLAMADO}} ({{CNPJ_CPF_RECLAMADO}}), com sede em {{ENDERECO_RECLAMADO}}, pelos fatos e fundamentos a seguir.

## I — DOS FATOS
{{EXPOSICAO_BREVE_FATOS}} (CLT art. 840, § 1º: exposição breve).
- Data de admissão: {{DATA_ADMISSAO}} | Data de saída: {{DATA_SAIDA}} | Função: {{FUNCAO}} | Última remuneração: {{ULTIMA_REMUNERACAO}}.

## II — DO DIREITO
{{FUNDAMENTOS_JURIDICOS_POR_PEDIDO}} — remissão a dispositivos da CLT constantes da base (arts. 467, 477, 844 § 4º, conforme o caso).

## III — DOS PEDIDOS (certos, determinados e com valor — art. 840, § 1º)
1. {{PEDIDO_1_VALOR}};
2. {{PEDIDO_2_VALOR}};
3. {{PEDIDO_3_VALOR}};
[...] Total estimado: R$ {{VALOR_CAUSA}}.

## IV — DA JUSTIÇA GRATUITA (se cabível)
{{REQUERIMENTO_GRATUIDADE}} (CLT art. 790 §§ 3º-4º — ver doc CLT gratuidade).

## V — DOS REQUERIMENTOS
- Citação/notificação da reclamada na forma do art. 841;
- Provas: {{PROVAS_REQUERIDAS}};
- Audiência com testemunhas listadas: {{LISTA_TESTEMUNHAS}}.

Nestes termos, pede deferimento.
{{CIDADE_VARA}}, {{DATA}}.
{{NOME_ADVOGADO}} — OAB/{{UF}} nº {{NUMERO_OAB}}`,
    metadados: { dadosFicticios: false, variaveis: ['{{NOME_RECLAMANTE}}', '{{CPF_RECLAMANTE}}', '{{CNPJ_CPF_RECLAMADO}}', '{{VALOR_CAUSA}}', '{{PEDIDOS}}'], rito: 'comum (ver doc 852-A/I para sumaríssimo)', revisao_obrigatoria: 'conferir sanidade dos pedidos (art. 840 § 1º e 852-B § 1º)' },
    tags: ['trabalhista/processo-trabalho'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'clt-arts-840-841-reclamacao-notificacao', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Requisitos da peça.' },
      { destinoSlug: 'checklist-dossie-reclamatoria-trabalhista', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Documentos que instruem a inicial.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'checklist-dossie-reclamatoria-trabalhista',
    titulo: 'CHECKLIST — Dossiê da reclamatória trabalhista: 14 pontos de conferência antes do protocolo',
    tipoDocumento: 'CHECKLIST',
    area: 'trabalhista',
    subarea: 'processo-trabalho',
    assunto: 'Documentos e conferências pré-protocolo',
    prioridade: 'P1',
    lote: 'LOTE-010',
    conteudo: `# CHECKLIST — Dossiê de reclamatória trabalhista

## Identificação e competência
1. [ ] Qualificação completa das partes (CTPS/CPF/CNPJ — art. 840 § 1º).
2. [ ] Endereço correto do reclamado (vedada citação por edital no sumaríssimo — art. 852-B, II).
3. [ ] Vara de trabalho competente (local da prestação de serviço).

## Temporalidade
4. [ ] Datas de admissão e saída conferidas (prescrição — art. 11: 5 anos + limite de 2 após extinção).
5. [ ] Cálculos retroativos limitados ao quinquênio.

## Sanidade dos pedidos
6. [ ] Cada pedido é certo, determinado e tem valor (art. 840, § 1º) — sem isso, extinção sem mérito (§ 3º).
7. [ ] Valor da causa apurado (define rito: ≤ 40 SM = sumaríssimo — art. 852-A).
8. [ ] Pedidos não cumulativos de direitos indisponíveis já quitados de forma especificada (art. 477, § 2º).

## Documentos anexos
9. [ ] CTPS (frente/verso e anotações) e contrato social da ré.
10. [ ] Comprovantes de salários (holerites), trabalho extraordinário (controle de ponto) e demissão.
11. [ ] TRCT discriminado (conferir quitação apenas das parcelas especificadas — art. 477, § 2º).
12. [ ] Procuração e documentos pessoais.

## Gratuidade e custas
13. [ ] Pedido de gratuidade com prova de salário ≤ 40% do teto do RGPS ou insuficiência (art. 790 §§ 3º-4º) — lembrando dos efeitos pós-ADI 5766.
14. [ ] Conferência de custas por ausência anterior não quitadas (art. 844, § 3º — condição para nova demanda).`,
    metadados: { dadosFicticios: false, quantidade_itens: 14 },
    tags: ['trabalhista/processo-trabalho'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'clt-art-11-prescricao-creditos-trabalhistas', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Item 4-5.' },
      { destinoSlug: 'clt-arts-790-791-a-custas-gratuidade-honorarios', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Item 13.' },
      { destinoSlug: 'tabela-documentos-reclamatoria-trabalhista', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Tabela complementar de documentos.' },
    ],
  } satisfies InputDocument,

  {
    slug: 'fluxo-reclamatoria-trabalhista-comum',
    titulo: 'FLUXO — Reclamatória trabalhista (rito comum): do protocolo ao recurso ordinário',
    tipoDocumento: 'FLUXO',
    area: 'trabalhista',
    subarea: 'processo-trabalho',
    assunto: 'Mapa evento → prazo → providência → risco → próxima etapa',
    prioridade: 'P1',
    lote: 'LOTE-010',
    conteudo: `# FLUXO — Reclamatória trabalhista (rito comum)

## E1 — Protocolo da reclamação
- **Documento:** petição com pedidos líquidos (art. 840 § 1º) + documentos (checklist).
- **Prazo gerado:** cartório remete a 2ª via em 48h (art. 841).
- **Risco:** pedido sem valor → extinção do pedido (art. 840 § 3º).

## E2 — Audiência (primeira desimpedida após 5 dias)
- **Evento:** tentativa de conciliação (arts. 846-847) → defesa oral (20 min) → recebimento de contestação.
- **Prazo:** designação após 5 dias (art. 841 caput).
- **Risco:** ausência do autor = arquivamento + custas (844 §§ 2º-3º); ausência do réu = revelia/confissão de fato, salvo § 4º.
- **Próxima etapa:** instrução.

## E3 — Instrução e razões finais
- **Evento:** testemunhas do art. 845; interrogatório (art. 848); razões finais até 10 min por parte (art. 850).
- **Providência:** impugnar documentos em audiência; requerer juntadas essenciais.

## E4 — Sentença e custas/depósito
- **Providência:** verificar condenação; contar prazos em dias úteis (art. 775); efetuar custas 2% e depósito recursal quando exigível (art. 899 §§ 4º, 9º-11).

## E5 — Recurso ordinário (8 dias úteis) e contrarrazões (8 dias)
- **Fundamento:** arts. 895 e 900.
- **Risco:** preclusão temporal; recurso não admitido por ausência de custas/depósito.
- **Próxima etapa:** julgamento no TRT (sumaríssimo: procedimento do art. 895 § 1º).

## E6 — Pós-julgamento
- **Providência:** cumprimento/execução; atualização de créditos por IPCA-E + SELIC (ADC 58/59).`,
    metadados: { dadosFicticios: false, eventos: 6, rito: 'comum' },
    tags: ['trabalhista/processo-trabalho', 'geral/prazos'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'clt-arts-840-841-reclamacao-notificacao', tipo: 'ETAPA_PROCESSO', descricao: 'E1-E2.' },
      { destinoSlug: 'prazo-recurso-ordinario-contrarrazoes-8-dias', tipo: 'ETAPA_PROCESSO', descricao: 'E5.' },
      { destinoSlug: 'adc-58-59-ipca-e-selic-atualizacao-jt', tipo: 'APLICACAO_OPERACIONAL', descricao: 'E6.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'tabela-documentos-reclamatoria-trabalhista',
    titulo: 'TABELA — Documentos necessários por fase da reclamatória trabalhista',
    tipoDocumento: 'TABELA_DOCUMENTOS',
    area: 'trabalhista',
    subarea: 'processo-trabalho',
    assunto: 'Documentos por fase processual',
    prioridade: 'P1',
    lote: 'LOTE-010',
    conteudo: `# TABELA — Documentos da reclamatória trabalhista

| Fase | Documento | Finalidade | Origem |
|---|---|---|---|
| Inicial | CTPS com anotações | vínculo, função, salário | trabalhador |
| Inicial | Contratos de trabalho e rescisórios | termos da relação | trabalhador/empresa |
| Inicial | Holerites (últimos 5 anos disponíveis) | remuneração base de cálculo | trabalhador |
| Inicial | Controle de ponto / registros | horas extras e intervalos | trabalhador/empresa |
| Inicial | TRCT e homologações | quitação especificada (art. 477 § 2º) | trabalhador |
| Inicial | Comprovante de insuficiência (gratuidade) | art. 790 §§ 3º-4º | trabalhador |
| Audiência | Lista de testemunhas (comparecimento próprio — art. 845) | prova pessoal | partes |
| Recursal | Comprovante de custas (2% — art. 789) | admissibilidade | advogado |
| Recursal | Comprovante de depósito recursal (quando exigível — art. 899 §§ 4º/9º-11) | admissibilidade | empregador |
| Execução | Cálculos com IPCA-E + SELIC | ADC 58/59 | contador |

## Nota
- Documentos em poder do empregador: requerer exibição em audiência (art. 845 — apresentação de provas) com pedido específico.`,
    metadados: { dadosFicticios: false, coberturas: ['inicial', 'audiencia', 'recursal', 'execucao'] },
    tags: ['trabalhista/processo-trabalho'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'checklist-dossie-reclamatoria-trabalhista', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Checklist operacional correlato.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'triagem-reclamatoria-trabalhista',
    titulo: 'TRIAGEM — Roteiro de perguntas para classificação de caso trabalhista',
    tipoDocumento: 'TRIAGEM',
    area: 'trabalhista',
    subarea: 'processo-trabalho',
    assunto: 'Entrevista inicial e classificação',
    prioridade: 'P1',
    lote: 'LOTE-010',
    conteudo: `# TRIAGEM — Reclamatória trabalhista

## Bloco A — Vínculo e datas
1. Quando começou e quando terminou o trabalho? (prescrição art. 11)
2. Há CTPS assinada? Se não, como constava o pagamento (recibos, PIX, comprovantes)?
3. Qual a função e a remuneração final?

## Bloco B — Saída e verbas
4. Como foi a saída (dispensa sem justa causa, pedido, justa causa)?
5. Recebeu TRCT? Quais parcelas especificadas? (quitação só das discriminadas — art. 477 § 2º)
6. Documentos e pagamento ocorreram até 10 dias do término? (art. 477 § 6º)

## Bloco C — Objetos adicionais
7. Fazia horas extras? Havia controle de ponto?
8. Recebia adicional de insalubridade/periculosidade?
9. Sofreu acidente ou doença relacionada ao trabalho?

## Bloco D — Condições processuais
10. Salário atual ou insuficiência de recursos (gratuidade — art. 790 §§ 3º-4º)?
11. Já fez reclamação trabalhista anterior? Pagou custas de ausência? (art. 844 § 3º)
12. Valor estimado da causa? (definição do rito — art. 852-A)

## Saída da triagem
- objeto principal + verbas acessórias (multas 467/477) + rito provável + documentos faltantes.`,
    metadados: { dadosFicticios: false, blocos: 4, perguntas: 12 },
    tags: ['trabalhista/processo-trabalho'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'checklist-dossie-reclamatoria-trabalhista', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Continuidade da triagem para montagem.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'argumentacao-honorarios-gratuidade-clt-bilateral',
    titulo: 'ARGUMENTAÇÃO — Sucumbência x gratuidade na JT: argumentos do autor e do réu (pós-ADI 5766)',
    tipoDocumento: 'ARGUMENTACAO',
    area: 'trabalhista',
    subarea: 'gratuidade-custas',
    assunto: 'Argumentos e contra-argumentos',
    prioridade: 'P1',
    lote: 'LOTE-010',
    conteudo: `# ARGUMENTAÇÃO BILATERAL — Gratuidade x sucumbência (CLT + ADI 5766)

## Questão 1: beneficiário de gratuidade vencido responde por honorários?
- **AUTOR (não deve pagar):** art. 791-A § 4º e art. 790-B caput/§ 4º estão INCONSTITUCIONAIS (ADI 5766, Plenário 20.10.2021 — tese literal na base). Presumir perda da hipossuficiência por créditos em outro processo é vedado (ponto 1 da ementa).
- **RÉU (deve pagar ao menos custas):** a ADI 5766 confirmou o art. 844 § 2º (custas da ausência); honorários de sucumbência gerais (791-A caput-§ 3º) seguem constitucionais para quem NÃO é beneficiário de gratuidade.
- **PONTO MÉDIO:** honorários em reconvencional (791-A § 5º) e litigância de má-fé não foram afetados pela ADI.

## Questão 2: honorários recíprocos (791-A § 3º)
- **AUTOR:** procedência parcial não afasta sua vitória essencial — requer arbitramento mínimo (5%) e vedação de compensação.
- **RÉU:** sucumbência recíproca é automática; cada parte responde pelos pedidos rejeitados.

## Questão 3: perícia e gratuidade
- **AUTOR:** não pode ser cobrada antecipação (art. 790-B § 3º — vigente); a responsabilidade pela perícia não pode recair sobre beneficiário (790-B caput inconstitucional).
- **RÉU:** o § 3º do 790-B apenas veda adiantamento; o destino final dos honorários periciais após a ADI recai na União quando o beneficiário não obteve créditos — controvérsia administrativa em curso, sem disposição legal substitutiva confirmada na consulta.`,
    metadados: { dadosFicticios: false, controvérsias: 3, base: 'CLT arts. 790-B/791-A com anotações oficiais + ADI 5766' },
    tags: ['trabalhista/gratuidade-custas'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'adi-5766-sucumbencia-gratuidade-jt', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Decisão que define os argumentos.' },
      { destinoSlug: 'tese-honorarios-gratuidade-apos-adi-5766', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Tese correspondente.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'doutrina-conceitos-processo-trabalho',
    titulo: 'DOUTRINA — Conceitos do processo do trabalho: revelia/confissão ficta, justiça gratuita, rito sumaríssimo e multas rescisórias',
    tipoDocumento: 'DOUTRINA',
    area: 'trabalhista',
    subarea: 'processo-trabalho',
    assunto: 'Explicações técnicas dos institutos',
    prioridade: 'P2',
    lote: 'LOTE-010',
    conteudo: `# DOUTRINA EJC — Conceitos essenciais do processo do trabalho

## 1. Revelia e confissão ficta (CLT art. 844)
Ausência do reclamado gera revelia e confissão QUANTO À MATÉRIA DE FATO — não de direito. Mitigadores legais (art. 844 § 4º): contestação por co-réu, direitos indisponíveis, ausência de documento indispensável, alegações inverossímeis. A presença do advogado sem o preposto preserva a defesa (§ 5º).

## 2. Justiça gratuita (arts. 790 §§ 3º-4º)
Duas portas: salário ≤ 40% do teto do RGPS (presunção relativa) OU declaração de insuficiência. Após ADI 5766, o vencido beneficiário não responde por honorários (791-A § 4º e 790-B inconstitucionais), mas continua sujeito a custas da ausência (844 § 2º — constitucional).

## 3. Rito sumaríssimo (arts. 852-A a 852-I)
Concentração máxima: pedidos líquidos, audiência única, 2 testemunhas, sentença sem relatório, intimada na própria audiência. Sanidade estrita: arquivamento + custas se pedido/endereço falharem (852-B § 1º).

## 4. Multas rescisórias (arts. 467 e 477)
- 477 § 8º: atraso global além de 10 dias (multa 160 BTN + salário);
- 467: parte incontroversa não paga no comparecimento → +50%;
- Quitação vale apenas para parcelas especificadas (477 § 2º).

## 5. Atualização de créditos (ADC 58/59)
IPCA-E na fase pré-judicial e SELIC a partir da citação, até solução legislativa — aplica-se a créditos de condenação e depósitos recursais, com modulação dos casos sobrestados.

## 6. Prazos (arts. 775 e 775-A)
Dias úteis para prazos processuais; suspensão de 20/12 a 20/01; prazos materiais (ex.: 477 § 6º — 10 dias corridos) não se confundem com processuais.`,
    metadados: { dadosFicticios: false, conceitos: 6 },
    tags: ['trabalhista/processo-trabalho', 'trabalhista/gratuidade-custas'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'clt-art-844-revelia-arquivamento-audiencia', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Conceito 1.' },
      { destinoSlug: 'tese-rito-sumarissimo-cabimento-efeitos', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Conceito 3.' },
    ],
  } satisfies InputDocument,

  {
    slug: 'regra-se-sumarissimo-valor-causa',
    titulo: 'REGRA — SE valor da causa ≤ 40 SM ENTÃO rito sumaríssimo (com exceções de sanidade e Fazenda)',
    tipoDocumento: 'REGRA_INTELIGENCIA',
    area: 'trabalhista',
    subarea: 'processo-trabalho',
    assunto: 'Classificação de rito e sanidade',
    prioridade: 'P1',
    lote: 'LOTE-010',
    conteudo: `# REGRAS SE-ENTÃO — Rito sumaríssimo (CLT arts. 852-A/I)

## REGRA 1 — Classificação do rito
SE valor_causa <= 40 * salario_minimo_ajuizamento E parte_nao_for_administracao_publica
ENTÃO rito = SUMARISSIMO (arts. 852-A caput e parágrafo único)
SENÃO rito = COMUM

## REGRA 2 — Sanidade do pedido
SE rito = SUMARISSIMO E (pedido_nao_liquido OU endereco_reclamado_errado)
ENTÃO RISCO_ARQUIVAMENTO = ALTO + custas_sobre_valor_causa (art. 852-B § 1º)

## REGRA 3 — Audiência única
SE rito = SUMARISSIMO
ENTÃO todas_as_provas_na_audiencia_unic E testemunhas_max = 2_por_parte E laudo_manifestacao_5_dias (arts. 852-C e 852-H)

## REGRA 4 — Recurso ordinário especial
SE rito = SUMARISSIMO E interposto_RO
ENTÃO distribuicao_imediata E liberacao_relator_10_dias E acordao_certidao_julgamento (art. 895 § 1º II-IV)

## REGRA 5 — Verificação pré-protocolo (comum e sumaríssimo)
SE algum_pedido_sem_valor_indicado
ENTÃO RISCO_EXTINCAO_PEDIDO = CONFIRMADO (art. 840 § 3º)`,
    metadados: { dadosFicticios: false, regras: 5, fundamento: 'CLT arts. 840 § 3º, 852-A a 852-I, 895 § 1º' },
    tags: ['trabalhista/processo-trabalho'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'clt-arts-852-a-i-rito-sumarissimo', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Regras 1-4.' },
      { destinoSlug: 'clt-arts-840-841-reclamacao-notificacao', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Regra 5.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'regra-se-gratuidade-sucumbencia-clt',
    titulo: 'REGRA — SE beneficiário de gratuidade vencido ENTÃO não cobrar honorários (ADI 5766); custas de ausência permanecem',
    tipoDocumento: 'REGRA_INTELIGENCIA',
    area: 'trabalhista',
    subarea: 'gratuidade-custas',
    assunto: 'Motor de decisões sobre sucumbência',
    prioridade: 'P1',
    lote: 'LOTE-010',
    conteudo: `# REGRAS SE-ENTÃO — Gratuidade x sucumbência (CLT + ADI 5766)

## REGRA 1 — Honorários de sucumbência
SE parte = beneficiaria_gratuidade E parte = vencida
ENTÃO NAO_COBRAR honorarios_sucumbencia (art. 791-A § 4º — INCONSTITUCIONAL, ADI 5766)
SENÃO honorarios_sucumbencia = 5% a 15% (art. 791-A caput)

## REGRA 2 — Honorários periciais
SE parte = beneficiaria_gratuidade
ENTÃO NAO_COBRAR honorarios_periciais (art. 790-B caput e § 4º — INCONSTITUCIONAIS, ADI 5766)
E SEMPRE vedado adiantamento para perícia (art. 790-B § 3º — vigente)

## REGRA 3 — Custas da ausência
SE reclamante = beneficiaria_gratuidade E ausente_audiencia_sem_justificativa_15_dias
ENTÃO COBRAR custas (art. 844 § 2º — CONSTITUCIONAL, ADI 5766) E pagamento = condicao_para_nova_demanda (art. 844 § 3º)

## REGRA 4 — Depósito recursal
SE parte = beneficiaria_gratuidade
ENTÃO isento_de_deposito_recursal (art. 899 § 10 — não afetado pela ADI)

## REGRA 5 — Honrarias da reconvencional
SE sucumbencia_originar_reconvencao
ENTÃO honorarios_devidos (art. 791-A § 5º — não afetado pela ADI)`,
    metadados: { dadosFicticios: false, regras: 5, fundamento: 'CLT arts. 790-B, 791-A, 844, 899 § 10 + ADI 5766' },
    tags: ['trabalhista/gratuidade-custas'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'adi-5766-sucumbencia-gratuidade-jt', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Base do controle de constitucionalidade.' },
      { destinoSlug: 'clt-arts-790-791-a-custas-gratuidade-honorarios', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Dispositivos anotados.' },
    ],
  } satisfies InputDocument,
];
