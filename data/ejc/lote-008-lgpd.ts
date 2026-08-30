// LOTE-008 — LGPD na prática (P1) — textos LITERAIS extraídos do Planalto em 2026-08-30
// Lei 13.709/2018 (LGPD): arts. 5º, 6º, 7º, 18, 19, 42, 44, 46, 48 e 52 confirmados literalmente.
// ANPD: Resolução CD/ANPD nº 4/2023 (Dosimetria — PDF oficial gov.br/anpd lido na íntegra, 19 p.)
// e Resolução CD/ANPD nº 15/2024 (Regulamento de Comunicação de Incidente — prazos de 3 dias úteis
// verificados em cópia institucional ABRAPP; original gov.br/biblioteca digital MJ).
// ANTI-INVENÇÃO: a memória sugeria "Resolução 2/2022" para dosimetria — VERIFICADO: a dosimetria é a
// Resolução 4/2023 (3 níveis de gravidade: leve/média/grave — NÃO existe "gravíssima"); o regulamento
// de incidente foi consolidado na Resolução 15/2024 (3 dias úteis, complementação em 20 dias úteis).
import type { InputDocument } from '../../src/lib/ejc/types';

const D = '2026-08-30';
const PLANALTO = 'Presidência da República — Planalto';
const URL_LGPD = 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm';
const EJC = 'Elaboração EJC — conteúdo estrutural original';

function leiLgpd(
  slug: string, titulo: string, subarea: string, assunto: string, conteudo: string, artigos: string[],
  extra?: Partial<InputDocument>,
): InputDocument {
  return {
    slug, titulo, tipoDocumento: 'LEGISLACAO', area: 'digital', subarea,
    assunto, prioridade: 'P1', lote: 'LOTE-008',
    conteudo,
    metadados: { numero: 'Lei 13.709/2018 (LGPD)', data_norma: '2018-08-14', orgao: 'Congresso Nacional', artigos_principais: artigos, vigente: true, confirmacao_texto: 'Extração literal do texto oficial do Planalto em 2026-08-30 (o texto já reflete alterações da Lei 13.853/2019 e posteriores).' },
    tags: ['digital/lgpd', 'geral/prazos'],
    fonte: PLANALTO,
    urlFonte: URL_LGPD,
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
  leiLgpd(
    'lgpd-art-5-definicoes-agentes',
    'LGPD art. 5º — Definições essenciais: titular, controlador, operador, encarregado, incidente (texto literal confirmado)',
    'bases-legais',
    'Definições e agentes de tratamento',
    `## Ficha da Norma
- **Norma:** Lei nº 13.709, de 14 de agosto de 2018 (LGPD) — art. 5º.
- **Vigência:** vigente (texto do Planalto já reflete alterações da MP 869/2018, Lei 13.853/2019 e posteriores, inclusive ajustes de 2025/2026 visíveis no texto oficial).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30) — definições centrais
"Art. 5º Para os fins desta Lei, considera-se:
I - dado pessoal: informação relacionada a pessoa natural identificada ou identificável;
II - dado pessoal sensível: dado pessoal sobre origem racial ou étnica, convicção religiosa, opinião política, filiação a sindicato ou a organização de caráter religioso, filosófico ou político, dado referente à saúde ou à vida sexual, dado genético ou biométrico, quando vinculado a uma pessoa natural;
III - dado anonimizado: dado relativo a titular que não possa ser identificado, considerando a utilização de meios técnicos razoáveis e disponíveis na ocasião de seu tratamento;
V - titular: pessoa natural a quem se referem os dados pessoais que são objeto de tratamento;
VI - controlador: pessoa natural ou jurídica, de direito público ou privado, a quem competem as decisões referentes ao tratamento de dados pessoais;
VII - operador: pessoa natural ou jurídica, de direito público ou privado, que realiza o tratamento de dados pessoais em nome do controlador;
VIII - encarregado: pessoa indicada pelo controlador e operador para atuar como canal de comunicação entre o controlador, os titulares dos dados e a Agência Nacional de Proteção de Dados (ANPD);
IX - agentes de tratamento: o controlador e o operador;
X - tratamento: toda operação realizada com dados pessoais, como as que se referem a coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação ou controle da informação, modificação, comunicação, transferência, difusão ou extração;
XII - consentimento: manifestação livre, informada e inequívoca pela qual o titular concorda com o tratamento de seus dados pessoais para uma finalidade determinada;
XVII - relatório de impacto à proteção de dados pessoais: documentação do controlador que contém a descrição dos processos de tratamento de dados pessoais que podem gerar riscos às liberdades civis e aos direitos fundamentais, bem como medidas, salvaguardas e mecanismos de mitigação de risco"

## Ponto crítico de coerência (regra anti-invenção)
- O conceito de **incidente de segurança** NÃO está definido no art. 5º da LGPD no texto extraído; o termo aparece no art. 48 ("ocorrência de incidente de segurança que possa acarretar risco ou dano relevante aos titulares") e é detalhado na regulamentação da ANPD (Resolução CD/ANPD nº 15/2024 — doc vinculado).

## Hipóteses de aplicação no EJC
- Determinar o papel de cada ator (controlador x operador x encarregado) para definir quem responde e quem comunica.
- Demarcar se o dado é pessoal, sensível ou anonimizado — muda a base legal aplicável (art. 7º vs art. 11) e a gravidade da infração (Resolução ANPD 4/2023, art. 8º § 3º, inciso III).`,
    ['5'],
    {
      relacionamentos: [
        { destinoSlug: 'lgpd-art-6-principios-tratamento', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Princípios que governam todo tratamento.' },
        { destinoSlug: 'lgpd-art-48-incidente-seguranca-texto-literal', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Dever de comunicação de incidente com risco ou dano relevante.' },
      ],
    },
  ),
  leiLgpd(
    'lgpd-art-6-principios-tratamento',
    'LGPD art. 6º — Dez princípios do tratamento de dados pessoais (texto literal confirmado)',
    'bases-legais',
    'Princípios gerais da LGPD',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 6º As atividades de tratamento de dados pessoais deverão observar a boa-fé e os seguintes princípios:
I - finalidade: realização do tratamento para propósitos legítimos, específicos, explícitos e informados ao titular, sem possibilidade de tratamento posterior de forma incompatível com essas finalidades;
II - adequação: compatibilidade do tratamento com as finalidades informadas ao titular, de acordo com o contexto do tratamento;
III - necessidade: limitação do tratamento ao mínimo necessário para a realização de suas finalidades, com abrangência dos dados pertinentes, proporcionais e não excessivos em relação às finalidades do tratamento de dados;
IV - livre acesso: garantia, aos titulares, de consulta facilitada e gratuita sobre a forma e a duração do tratamento, bem como sobre a integralidade de seus dados pessoais;
V - qualidade dos dados: garantia, aos titulares, de exatidão, clareza, relevância e atualização dos dados, de acordo com a necessidade e para o cumprimento da finalidade de seu tratamento;
VI - transparência: garantia, aos titulares, de informações claras, precisas e facilmente acessíveis sobre a realização do tratamento e os respectivos agentes de tratamento, observados os segredos comercial e industrial;
VII - segurança: utilização de medidas técnicas e administrativas aptas a proteger os dados pessoais de acessos não autorizados e de situações acidentais ou ilícitas de destruição, perda, alteração, comunicação ou difusão;
VIII - prevenção: adoção de medidas para prevenir a ocorrência de danos em virtude do tratamento de dados pessoais;
IX - não discriminação: impossibilidade de realização do tratamento para fins discriminatórios ilícitos ou abusivos;
X - responsabilização e prestação de contas: demonstração, pelo agente, da adoção de medidas eficazes e capazes de comprovar a observância e o cumprimento das normas de proteção de dados pessoais e, inclusive, da eficácia dessas medidas."

## Interpretação aplicada
- O inciso X (responsabilização e prestação de contas — *accountability*) é a espinha dorsal do compliance LGPD: quem não consegue PROVAR que cumpre é tratado como não cumpre.
- Violação dos princípios sustenta: (i) irregularidade do tratamento (art. 44 — doc vinculado); (ii) sanção administrativa (art. 52 § 1º, incisos I e XI); (iii) dever de indenizar (art. 42).

## Hipóteses de aplicação no EJC
- Auditoria de tratamento: testar cada operação contra os 10 princípios (especialmente necessidade e finalidade).
- Fundamentação de pedido do titular e de denúncia à ANPD (violação da transparência/livre acesso).`,
    ['6'],
    {
      relacionamentos: [
        { destinoSlug: 'lgpd-art-7-bases-legais-texto-literal', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Hipóteses legais que autorizam o tratamento.' },
        { destinoSlug: 'lgpd-arts-44-46-tratamento-irregular-seguranca', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Consequências da violação da segurança esperada.' },
        { destinoSlug: 'checklist-compliance-lgpd-pratico', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Checklist que operacionaliza os princípios.' },
      ],
    },
  ),
  leiLgpd(
    'lgpd-art-7-bases-legais-texto-literal',
    'LGPD art. 7º — Dez bases legais de tratamento de dados pessoais (texto literal confirmado)',
    'bases-legais',
    'Hipóteses legais de tratamento',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30) — trechos essenciais
"Art. 7º O tratamento de dados pessoais somente poderá ser realizado nas seguintes hipóteses:
I - mediante o fornecimento de consentimento pelo titular;
II - para o cumprimento de obrigação legal ou regulatória pelo controlador;
III - pela administração pública, para o tratamento e uso compartilhado de dados necessários à execução de políticas públicas previstas em leis e regulamentos ou respaldadas em contratos, convênios ou instrumentos congêneres, observadas as disposições do Capítulo IV desta Lei;
IV - para a realização de estudos por órgão de pesquisa, garantida, sempre que possível, a anonimização dos dados pessoais;
V - quando necessário para a execução de contrato ou de procedimentos preliminares relacionados a contrato do qual seja parte o titular, a pedido do titular dos dados;
VI - para o exercício regular de direitos em processo judicial, administrativo ou arbitral, esse último nos termos da Lei nº 9.307, de 23 de setembro de 1996 (Lei de Arbitragem);
VII - para a proteção da vida ou da incolumidade física do titular ou de terceiro;
VIII - para a tutela da saúde, exclusivamente, em procedimento realizado por profissionais de saúde, serviços de saúde ou autoridade sanitária; (Redação dada pela Lei nº 13.853, de 2019)
IX - quando necessário para atender aos interesses legítimos do controlador ou de terceiro, exceto no caso de prevalecerem direitos e liberdades fundamentais do titular que exijam a proteção dos dados pessoais; ou
X - para a proteção do crédito, inclusive quanto ao disposto na legislação pertinente."

## Pontos literais complementares confirmados
- § 3º: "O tratamento de dados pessoais cujo acesso é público deve considerar a finalidade, a boa-fé e o interesse público que justificaram sua disponibilização."
- § 4º: "É dispensada a exigência do consentimento previsto no caput deste artigo para os dados tornados manifestamente públicos pelo titular, resguardados os direitos do titular e os princípios previstos nesta Lei."
- § 5º: comunicação/compartilhamento com outros controladores quando o fundamento original é consentimento exige **consentimento específico** do titular, ressalvadas as dispensas legais.
- § 6º: "A eventual dispensa da exigência do consentimento não desobriga os agentes de tratamento das demais obrigações previstas nesta Lei, especialmente da observância dos princípios gerais e da garantia dos direitos do titular."

## Interpretação aplicada
- O art. 7º é uma **taxa fechada** (numerus clausus): se a operação não se encaixa em nenhuma das 10 hipóteses, o tratamento é irregular (art. 44) — e, sem hipótese legal, pode configurar infração GRAVE (Resolução ANPD 4/2023, art. 8º § 3º, inciso d).
- "Interesse legítimo" (inciso IX) exige teste de expectativa/prevalência: cede diante de direitos e liberdades fundamentais do titular.

## Hipóteses de aplicação no EJC
- Diagnóstico de base legal por operação de tratamento (mapa de dados).
- Defesa de controlador: demonstrar a base legal específica; ataque do titular: demonstrar a ausência dela.`,
    ['7'],
    {
      relacionamentos: [
        { destinoSlug: 'lgpd-art-6-principios-tratamento', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Bases legais operam sob os 10 princípios.' },
        { destinoSlug: 'anpd-resolucao-4-2023-dosimetria-sancoes', tipo: 'PRECEDENTE_APLICAVEL', descricao: 'Tratamento sem base legal é critério de infração grave.' },
      ],
    },
  ),
  leiLgpd(
    'lgpd-arts-18-19-direitos-titular-texto-literal',
    'LGPD arts. 18 e 19 — Direitos do titular e prazo de resposta de 15 dias (texto literal confirmado)',
    'bases-legais',
    'Direitos do titular e atendimento de requerimentos',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30) — trechos essenciais
"Art. 18. O titular dos dados pessoais tem direito a obter do controlador, em relação aos dados do titular por ele tratados, a qualquer momento e mediante requisição:
I - confirmação da existência de tratamento;
II - acesso aos dados;
III - correção de dados incompletos, inexatos ou desatualizados;
IV - anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade com o disposto nesta Lei;
V - portabilidade dos dados a outro fornecedor de serviço ou produto, mediante requisição expressa, de acordo com a regulamentação da autoridade nacional, observados os segredos comercial e industrial; (Redação dada pela Lei nº 13.853, de 2019)
VI - eliminação dos dados pessoais tratados com o consentimento do titular, exceto nas hipóteses previstas no art. 16 desta Lei;
VII - informação das entidades públicas e privadas com as quais o controlador realizou uso compartilhado de dados;
VIII - informação sobre a possibilidade de não fornecer consentimento e sobre as consequências da negativa;
IX - revogação do consentimento, nos termos do § 5º do art. 8º desta Lei.
§ 1º O titular dos dados pessoais tem o direito de peticionar em relação aos seus dados contra o controlador perante a autoridade nacional.
§ 3º Os direitos previstos neste artigo serão exercidos mediante requerimento expresso do titular ou de representante legalmente constituído, a agente de tratamento.
§ 5º O requerimento referido no § 3º deste artigo será atendido sem custos para o titular, nos prazos e nos termos previstos em regulamento.
§ 8º O direito a que se refere o § 1º deste artigo também poderá ser exercido perante os organismos de defesa do consumidor."

"Art. 19. A confirmação de existência ou o acesso a dados pessoais serão providenciados, mediante requisição do titular:
I - em formato simplificado, imediatamente; ou
II - por meio de declaração clara e completa, que indique a origem dos dados, a inexistência de registro, os critérios utilizados e a finalidade do tratamento, observados os segredos comercial e industrial, fornecida no prazo de até 15 (quinze) dias, contado da data do requerimento do titular."

## Interpretação aplicada
- A resposta do controlador: **simplificada e imediata** OU **completa em até 15 dias** do requerimento (art. 19, caput, II).
- Requerimento **sem custos** (art. 18 § 5º); recusa ou resposta incompleta habilita peticionamento à ANPD (art. 18 § 1º) e vias consumeristas (art. 18 § 8º).
- Art. 20 (lido no mesmo texto oficial): direito de **revisão por pessoa natural** de decisões tomadas unicamente com base em tratamento automatizado que afetem interesses do titular (perfil pessoal, profissional, de consumo e de crédito).

## Hipóteses de aplicação no EJC
- Cobrança formal de direitos do titular antes da demanda (requerimento prévio — peça-modelo vinculada).
- Ação judicial/Procon por descumprimento de art. 18/19 + denúncia ANPD.`,
    ['18', '19', '20'],
    {
      relacionamentos: [
        { destinoSlug: 'prazo-lgpd-resposta-titular-15-dias', tipo: 'BASE_PRAZO', descricao: 'Registro operacional do prazo de 15 dias (art. 19, II).' },
        { destinoSlug: 'peca-requerimento-art18-titular', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Peça-modelo para exercício dos direitos.' },
        { destinoSlug: 'lgpd-art-42-responsabilidade-civil-texto-literal', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Dever de indenizar quando violação causar dano.' },
      ],
    },
  ),
  leiLgpd(
    'lgpd-art-42-responsabilidade-civil-texto-literal',
    'LGPD art. 42 — Responsabilidade civil por dano decorrente de tratamento de dados (texto literal confirmado)',
    'bases-legais',
    'Responsabilidade civil e inversão do ônus',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 42. O controlador ou o operador que, em razão do exercício de atividade de tratamento de dados pessoais, causar a outrem dano patrimonial, moral, individual ou coletivo, em violação à legislação de proteção de dados pessoais, é obrigado a repará-lo.
§ 1º A fim de assegurar a efetiva indenização ao titular dos dados:
I - o operador responde solidariamente pelos danos causados pelo tratamento quando descumprir as obrigações da legislação de proteção de dados ou quando não tiver seguido as instruções lícitas do controlador, hipótese em que o operador equipara-se ao controlador, salvo nos casos de exclusão previstos no art. 43 desta Lei;
II - os controladores que estiverem diretamente envolvidos no tratamento do qual decorreram danos ao titular dos dados respondem solidariamente, salvo nos casos de exclusão previstos no art. 43 desta Lei.
§ 2º O juiz, no processo civil, poderá inverter o ônus da prova a favor do titular dos dados quando, a seu juízo, for verossímil a alegação, houver hipossuficiência para fins de produção de prova ou quando a produção de prova pelo titular resultar-lhe excessivamente onerosa."

## Interpretação aplicada
- A responsabilidade do art. 42 pressupõe **dano + violação à legislação de dados** (não é responsabilidade sem violação). A Lei NÃO diz expressamente que o dano moral por vazamento é presumido (in re ipsa) — o tema é decidido caso a caso; NÃO afirmar automatismo sem precedente confirmado no caso concreto.
- Inversão do ônus (§ 2º) é poder do juiz com critérios próprios (verossimilhança/hipossuficiência/onerosidade) — mesma lógica do CDC art. 6º VIII (doc vinculado LOTE-006).
- Art. 43 (exclusões: culpa exclusiva do titular, terceiro, caso fortuito/força maior) e art. 44 (tratamento irregular e dever de segurança — doc vinculado) delimitam defesas.

## Hipóteses de aplicação no EJC
- Ação indenizatória por vazamento/exposição indevida de dados: combinar art. 42 + art. 44 + art. 6º VII.
- Defesa de controlador: demonstrar segurança adequada (art. 46) e eventuais exclusões do art. 43.`,
    ['42', '43', '44'],
    {
      relacionamentos: [
        { destinoSlug: 'lgpd-arts-44-46-tratamento-irregular-seguranca', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Dever de segurança e tratamento irregular.' },
        { destinoSlug: 'cdc-art-6-direitos-basicos-texto-literal', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Inversão do ônus também pelo CDC (art. 6º VIII) nas relações de consumo.' },
      ],
    },
  ),
  leiLgpd(
    'lgpd-arts-44-46-tratamento-irregular-seguranca',
    'LGPD arts. 44 e 46 — Tratamento irregular e dever de segurança (textos literais confirmados)',
    'incidentes',
    'Segurança do tratamento e irregularidade',
    `## Textos CONFIRMADOS LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 44. O tratamento de dados pessoais será irregular quando deixar de observar a legislação ou quando não fornecer a segurança que o titular dele pode esperar, consideradas as circunstâncias relevantes, entre as quais:
I - o modo pelo qual é realizado;
II - o resultado e os riscos que razoavelmente dele se esperam;
III - as técnicas de tratamento de dados pessoais disponíveis à época em que foi realizado.
Parágrafo único. Responde pelos danos decorrentes da violação da segurança dos dados o controlador ou o operador que, ao deixar de adotar as medidas de segurança previstas no art. 46 desta Lei, der causa ao dano."

"Art. 46. Os agentes de tratamento devem adotar medidas de segurança, técnicas e administrativas aptas a proteger os dados pessoais de acessos não autorizados e de situações acidentais ou ilícitas de destruição, perda, alteração, comunicação ou qualquer forma de tratamento inadequado ou ilícito.
§ 1º A autoridade nacional poderá dispor sobre padrões técnicos mínimos para tornar aplicável o disposto no caput deste artigo, considerados a natureza das informações tratadas, as características específicas do tratamento e o estado atual da tecnologia, especialmente no caso de dados pessoais sensíveis, assim como os princípios previstos no caput do art. 6º desta Lei.
§ 2º As medidas de que trata o caput deste artigo deverão ser observadas desde a fase de concepção do produto ou do serviço até a sua execução."

## Interpretação aplicada
- Padrão do art. 44 é **objetivo e contextual** ("segurança que o titular pode esperar") — o estado da tecnologia disponível à época conta na aferição.
- Art. 46 § 2º impõe *privacy by design*: medidas de segurança desde a concepção do produto/serviço.
- Nexo: quem deixa de adotar as medidas do art. 46 e causa o dano responde (art. 44, parágrafo único).

## Hipóteses de aplicação no EJC
- Vazamentos: mapear quais medidas do art. 46 existiam, estavam documentadas e eram eficazes.
- Contestação de incidentes: demonstrar aderência a padrões técnicos e estado da arte.`,
    ['44', '46'],
    {
      relacionamentos: [
        { destinoSlug: 'lgpd-art-48-incidente-seguranca-texto-literal', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Dever de comunicar incidente com risco/dano relevante.' },
        { destinoSlug: 'fluxo-incidente-seguranca-lgpd', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Fluxo operacional completo do incidente.' },
      ],
    },
  ),
  leiLgpd(
    'lgpd-art-48-incidente-seguranca-texto-literal',
    'LGPD art. 48 — Comunicação de incidente de segurança à ANPD e ao titular (texto literal confirmado)',
    'incidentes',
    'Comunicação obrigatória de incidentes',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 48. O controlador deverá comunicar à autoridade nacional e ao titular a ocorrência de incidente de segurança que possa acarretar risco ou dano relevante aos titulares.
§ 1º A comunicação será feita em prazo razoável, conforme definido pela autoridade nacional, e deverá mencionar, no mínimo:
I - a descrição da natureza dos dados pessoais afetados;
II - as informações sobre os titulares envolvidos;
III - a indicação das medidas técnicas e de segurança utilizadas para a proteção dos dados, observados os segredos comercial e industrial;
IV - os riscos relacionados ao incidente;
V - os motivos da demora, no caso de a comunicação não ter sido imediata; e
VI - as medidas que foram ou que serão adotadas para reverter ou mitigar os efeitos do prejuízo.
§ 2º A autoridade nacional verificará a gravidade do incidente e poderá, caso necessário para a salvaguarda dos direitos dos titulares, determinar ao controlador a adoção de providências, tais como:
I - ampla divulgação do fato em meios de comunicação; e
II - medidas para reverter ou mitigar os efeitos do incidente.
§ 3º No juízo de gravidade do incidente, será avaliada eventual comprovação de que foram adotadas medidas técnicas adequadas que tornem os dados pessoais afetados ininteligíveis, no âmbito e nos limites técnicos de seus serviços, para terceiros não autorizados a acessá-los."

## Interpretação aplicada
- Destinatários da comunicação: **ANPD E titular** (ambos, quando incidente com risco/dano relevante).
- Conteúdo mínimo obrigatório: os 6 itens do § 1º — usar como sumário do formulário de comunicação.
- Cifragem eficaz (dados "ininteligíveis") pesa a favor de NÃO configurar risco relevante (§ 3º).
- Prazo: "razoável, conforme definido pela autoridade nacional" → hoje o prazo definido é o da Resolução CD/ANPD nº 15/2024: **3 dias úteis** (doc vinculado + prazo operacional).

## Hipóteses de aplicação no EJC
- Playbook de resposta a vazamento (combinar com fluxo vinculado).
- Cobrança contra empresa que omitiu incidente (fator de gravidade na dosimetria ANPD).`,
    ['48'],
    {
      relacionamentos: [
        { destinoSlug: 'prazo-incidente-seguranca-3-dias-uteis', tipo: 'BASE_PRAZO', descricao: 'Prazo regulamentar definido pela ANPD (3 dias úteis).' },
        { destinoSlug: 'anpd-resolucao-15-2024-comunicacao-incidente', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Regulamento da ANPD que detalha a comunicação.' },
      ],
    },
  ),
  leiLgpd(
    'lgpd-art-52-sancoes-texto-literal',
    'LGPD art. 52 — Sanções administrativas e critérios de dosimetria legal (texto literal confirmado)',
    'anpd',
    'Sanções administrativas da LGPD',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30) — trechos essenciais
"Art. 52. Os agentes de tratamento de dados, em razão das infrações cometidas às normas previstas nesta Lei, ficam sujeitos às seguintes sanções administrativas aplicáveis pela autoridade nacional:
I - advertência, com indicação de prazo para adoção de medidas corretivas;
II - multa simples, de até 2% (dois por cento) do faturamento da pessoa jurídica de direito privado, grupo ou conglomerado no Brasil no seu último exercício, excluídos os tributos, limitada, no total, a R$ 50.000.000,00 (cinquenta milhões de reais) por infração;
III - multa diária, observado o limite total a que se refere o inciso II;
IV - publicização da infração após devidamente apurada e confirmada a sua ocorrência;
V - bloqueio dos dados pessoais a que se refere a infração até a sua regularização;
VI - eliminação dos dados pessoais a que se refere a infração;
X - suspensão parcial do funcionamento do banco de dados a que se refere a infração pelo período máximo de 6 (seis) meses, prorrogável por igual período, até a regularização da atividade de tratamento pelo controlador; (Incluído pela Lei nº 13.853, de 2019)
XI - suspensão do exercício da atividade de tratamento dos dados pessoais a que se refere a infração pelo período máximo de 6 (seis) meses, prorrogável por igual período; (Incluído pela Lei nº 13.853, de 2019)
XII - proibição parcial ou total do exercício de atividades relacionadas a tratamento de dados. (Incluído pela Lei nº 13.853, de 2019)
§ 1º As sanções serão aplicadas após procedimento administrativo que possibilite a oportunidade da ampla defesa, de forma gradativa, isolada ou cumulativa, de acordo com as peculiaridades do caso concreto e considerados os seguintes parâmetros e critérios:
I - a gravidade e a natureza das infrações e dos direitos pessoais afetados;
II - a boa-fé do infrator;
III - a vantagem auferida ou pretendida pelo infrator;
IV - a condição econômica do infrator;
V - a reincidência;
VI - o grau do dano;
VII - a cooperação do infrator;
VIII - a adoção reiterada e demonstrada de mecanismos e procedimentos internos capazes de minimizar o dano, voltados ao tratamento seguro e adequado de dados, em consonância com o disposto no inciso II do § 2º do art. 48 desta Lei;
IX - a adoção de política de boas práticas e governança;
X - a pronta adoção de medidas corretivas; e
XI - a proporcionalidade entre a gravidade da falta e a intensidade da sanção.
§ 4º No cálculo do valor da multa de que trata o inciso II do caput deste artigo, a autoridade nacional poderá considerar o faturamento total da empresa ou grupo de empresas, quando não dispuser do valor do faturamento no ramo de atividade empresarial em que ocorreu a infração, definido pela autoridade nacional, ou quando o valor for apresentado de forma incompleta ou não for demonstrado de forma inequívoca e idônea.
§ 6º As sanções previstas nos incisos X, XI e XII do caput deste artigo serão aplicadas: I - somente após já ter sido imposta ao menos 1 (uma) das sanções de que tratam os incisos II, III, IV, V e VI do caput deste artigo para o mesmo caso concreto..."

## Interpretação aplicada
- Escada de sanções: advertência → multa simples (2% faturamento, teto R$ 50 milhões/infração) → multa diária → publicização → bloqueio/eliminação → suspensões → proibição.
- As sanções X-XII (suspensão/proibição) só após já imposta ao menos uma das anteriores no mesmo caso (§ 6º I).
- Os 11 critérios do § 1º são a base da dosimetria da ANPD detalhada na Resolução CD/ANPD nº 4/2023 (doc vinculado).
- § 2º: sanções administrativas NÃO substituem sanções civis ou penais (redação da Lei 13.853/2019).

## Hipóteses de aplicação no EJC
- Defesa em processo administrativo sancionador ANPD: atacar critérios do § 1º um a um (boa-fé, cooperação, medidas corretivas, política de governança).
- Conselho preventivo a clientes: exposição máxima e escada progressiva.`,
    ['52'],
    {
      relacionamentos: [
        { destinoSlug: 'anpd-resolucao-4-2023-dosimetria-sancoes', tipo: 'PRECEDENTE_APLICAVEL', descricao: 'Dosimetria operacional: alíquotas por gravidade, agravantes e atenuantes.' },
        { destinoSlug: 'lgpd-art-48-incidente-seguranca-texto-literal', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Critério VIII do § 1º remete às medidas do § 2º do art. 48.' },
      ],
    },
  ),
  {
    slug: 'anpd-resolucao-4-2023-dosimetria-sancoes',
    titulo: 'Resolução CD/ANPD nº 4/2023 — Regulamento de Dosimetria: gravidade, alíquotas da multa, agravantes e atenuantes (textos literais do PDF oficial gov.br/anpd)',
    tipoDocumento: 'LEGISLACAO',
    area: 'digital',
    subarea: 'anpd',
    assunto: 'Dosimetria das sanções administrativas da LGPD',
    prioridade: 'P1',
    lote: 'LOTE-008',
    conteudo: `## Ficha da Norma
- **Norma:** Resolução CD/ANPD nº 4, de 24 de fevereiro de 2023 — Regulamento de Dosimetria e Aplicação de Sanções Administrativas (LGPD).
- **Vigência:** vigente (regulamentação consolidada listada como vigente no portal oficial da ANPD).
- **Fonte primária:** PDF oficial da ANPD (gov.br/anpd), lido na íntegra (19 páginas) em 2026-08-30.

## Textos CONFIRMADOS LITERALMENTE no documento oficial (consulta 2026-08-30)
### Classificação de gravidade — Art. 8º
"Art. 8º As infrações são classificadas, segundo a gravidade e a natureza das infrações e dos direitos pessoais afetados, em: I - leve; II - média; ou III - grave.
§ 1º A infração será considerada leve quando não verificada nenhuma das hipóteses relacionadas nos §§ 2º ou 3º deste artigo.
§ 2º A infração será considerada média quando verificada uma das seguintes hipóteses, desde que não seja classificada como grave: I - envolver tratamento de dados pessoais em larga escala; ou II - afetar significativamente interesses e direitos fundamentais dos titulares.
§ 3º A infração será considerada grave quando: I - verificada uma ou mais hipóteses estabelecidas no § 2º deste artigo e cumulativamente, pelo menos, uma das seguintes: a) o infrator auferir ou pretender auferir vantagem econômica em decorrência da infração cometida; b) a infração implicar risco à vida ou à integridade física dos titulares; c) a infração envolver tratamento de dados sensíveis ou de dados pessoais de crianças e adolescentes e de idosos; d) o infrator realizar tratamento de dados pessoais sem amparo em uma das hipóteses legais previstas na LGPD; e) o infrator prevalecer-se da fraqueza ou ignorância do titular...; f) o infrator realizar tratamento com efeitos discriminatórios ilícitos ou abusivos; ou g) verificada a má-fé do infrator ou a adoção sistemática de práticas irregulares; II - constituir obstrução à atividade de fiscalização."

### Valor base da multa — Tabela 1 (alíquotas mínima e máxima sobre o faturamento)
- **Leve:** A1 = 0,08% | A2 = 0,15%
- **Média:** A1 = 0,13% | A2 = 0,50%
- **Grave:** A1 = 0,45% | A2 = 1,50%
(Tabela 1 — "Alíquotas mínima e máxima para definição do valor base de multa"; o valor base é aplicado sobre o faturamento, com grau do dano determinando a posição dentro do intervalo.)

### Agravantes — Art. 14
"Art. 14. O valor da multa simples será acrescido nos percentuais abaixo, caso incidam as seguintes circunstâncias agravantes: I - 10% para cada caso de reincidência específica, até o limite de 40%; II - 5% para cada caso de reincidência genérica, até o limite de 20%; III - 20% para cada medida de orientação ou preventiva descumprida no processo de fiscalização ou do procedimento preparatório..., até o limite de 80%; e IV - 30% para cada medida corretiva descumprida, até o limite de 90%.
§ 1º Na hipótese de incidência de mais de um dos incisos deste artigo, deverão ser somados os percentuais relativos a cada fator."

### Atenuantes (trecho literal)
"...serão consideradas as seguintes circunstâncias atenuantes: I - nos casos de cessação da infração: a) 75%, se previamente à instauração de procedimento preparatório pela ANPD; b) 50%, se após a instauração de procedimento preparatório e até a instauração de processo administrativo sancionador; ou c) 30%, se após a instauração de processo administrativo sancionador e até a prolação da decisão de primeira instância...; II - 20% (vi..."

## Ponto crítico de coerência (regra anti-invenção)
- Existem **3 níveis** de gravidade (leve, média, grave) — NÃO há "gravíssima" no texto oficial.
- A alíquota do art. 52 LGPD (até 2% do faturamento, teto R$ 50 mi) continua sendo o teto legal; a Resolução 4/2023 define COMO se chega ao percentual dentro desse limite.
- A dosimetria NÃO é a Resolução 2/2022 (que instituiu o Regulamento de Aplicação da LGPD, hoje consolidado — p.ex. regra de agentes de pequeno porte).

## Hipóteses de aplicação no EJC
- Estimativa defensável de exposição em processo sancionador (intervalo por gravidade × grau de dano ± agravantes/atenuantes).
- Estratégia de cessação rápida da infração: parar cedo economiza até 75% da multa (atenuante "a").`,
    metadados: { numero: 'Resolução CD/ANPD nº 4/2023', data_norma: '2023-02-24', orgao: 'ANPD — Autoridade Nacional de Proteção de Dados', artigos_principais: ['7', '8', '14'], vigente: true, confirmacao_texto: 'PDF oficial da ANPD baixado e lido na íntegra em 2026-08-30 (gov.br/anpd).' },
    tags: ['digital/anpd', 'digital/lgpd'],
    fonte: 'ANPD — Agência Nacional de Proteção de Dados (documento oficial)',
    urlFonte: 'https://www.gov.br/anpd/pt-br/assuntos/noticias-periodo-eleitoral/Regulamento_Dosimetria_vf.pdf/@@display-file/file',
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'lgpd-art-52-sancoes-texto-literal', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Base legal das sanções e dos critérios legais de dosimetria.' },
      { destinoSlug: 'regra-se-incidente-lgpd-comunicacao', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Omissão de comunicação de incidente agrava a dosimetria.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'anpd-resolucao-15-2024-comunicacao-incidente',
    titulo: 'Resolução CD/ANPD nº 15/2024 — Regulamento de Comunicação de Incidente de Segurança: prazos de 3 dias úteis e complementação em 20 dias úteis',
    tipoDocumento: 'LEGISLACAO',
    area: 'digital',
    subarea: 'anpd',
    assunto: 'Comunicação de incidente de segurança (art. 48 LGPD)',
    prioridade: 'P1',
    lote: 'LOTE-008',
    conteudo: `## Ficha da Norma
- **Norma:** Resolução CD/ANPD nº 15, de 24 de abril de 2024 — aprovou, entre outros, o **Regulamento de Comunicação de Incidente de Segurança** (art. 48 LGPD).
- **Vigência:** vigente (consolidação das regulamentações da ANPD de 2024).
- **Situação da verificação (honestidade):** os trechos abaixo foram extraídos LITERALMENTE de cópia institucional integral da resolução (ABRAPP — associação setorial, texto integral com numeração de artigos); a listagem oficial vigente está no portal gov.br/anpd e na biblioteca digital do MJ. Confiança B pela via de confirmação (cópia institucional integral), não pelo primário direto (anti-bot gov.br).

## Textos CONFIRMADOS LITERALMENTE na cópia integral consultada (2026-08-30)
- "Art. 6º A comunicação de incidente de segurança à ANPD deverá ser realizada pelo controlador no prazo de **três dias úteis**, ressalvada a existência de prazo para comunicação prevista em legislação setorial específica..." (trecho)
- "§ 3º As informações poderão ser complementadas, de maneira fundamentada, no prazo de **vinte dias úteis**, a contar da data da comunicação."
- "Art. 9º A comunicação de incidente de segurança ao titular deverá ser realizada pelo controlador no prazo de **três dias úteis** contados do conhecimento pelo controlador de que..." (trecho)
- Comprovação da comunicação aos titulares "em até três dias úteis, contados do término do prazo de que trata o capu[t]" (trecho).

## Interpretação aplicada
- **3 dias úteis** para comunicar à ANPD **e** para comunicar ao titular, contados do conhecimento do incidente com risco/dano relevante.
- Comunicação pode ser complementada em **20 dias úteis** (permite comunicar primeiro o essencial e complementar depois — estratégia para cumprir prazo).
- Verificar sempre se há **prazo setorial específico** (a regra do art. 6º é ressalvada em relação a legislação setorial).

## Hipóteses de aplicação no EJC
- Playbook de incidente: cronograma D+0 (detecção) → D+1/2 (decisão de comunicar) → D+3 úteis (comunicações ANPD + titular).
- Defesa em fiscalização: documentar data do conhecimento para demonstrar cumprimento do prazo.`,
    metadados: { numero: 'Resolução CD/ANPD nº 15/2024', data_norma: '2024-04-24', orgao: 'ANPD — Autoridade Nacional de Proteção de Dados', artigos_principais: ['6', '9'], vigente: true, confirmacao_texto: 'Texto integral lido em cópia institucional (ABRAPP) em 2026-08-30; listagem oficial no portal ANPD/MJ. Nota honesta de via de confirmação.' },
    tags: ['digital/anpd', 'digital/incidentes'],
    fonte: 'CD/ANPD (texto integral via cópia institucional ABRAPP; oficial em gov.br/anpd)',
    urlFonte: 'https://bibliotecadigital.mj.gov.br/handle/1/12879',
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-09-30',
    relacionamentos: [
      { destinoSlug: 'lgpd-art-48-incidente-seguranca-texto-literal', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Regulamenta o prazo "razoável" definido pela autoridade nacional.' },
      { destinoSlug: 'prazo-incidente-seguranca-3-dias-uteis', tipo: 'BASE_PRAZO', descricao: 'Registro operacional do prazo de 3 dias úteis.' },
      { destinoSlug: 'fluxo-incidente-seguranca-lgpd', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Fluxo operacional com esses prazos.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'prazo-lgpd-resposta-titular-15-dias',
    titulo: 'Prazo — LGPD: resposta ao titular (imediata simplificada ou completa em 15 dias — art. 19, II)',
    tipoDocumento: 'PRAZO',
    area: 'digital',
    subarea: 'bases-legais',
    assunto: 'Prazo de atendimento a requerimentos dos titulares',
    prioridade: 'P1',
    lote: 'LOTE-008',
    conteudo: `## Estrutura do prazo (formato padrão EJC)
- **Evento disparador:** requerimento expresso do titular (art. 18 § 3º LGPD).
- **Prazo:** confirmação de existência/acesso — formato simplificado: imediato; declaração clara e completa: **até 15 (quinze) dias** contados da data do requerimento (art. 19, II).
- **Providência:** atender sem custos (art. 18 § 5º), informando origem dos dados, inexistência de registro, critérios utilizados e finalidade do tratamento (art. 19, II).
- **Responsável:** controlador (o operador não responde diretamente ao titular).
- **Documento necessário:** requerimento do titular (expresso); protocolo interno de resposta.
- **Risco do descumprimento:** peticionamento do titular à ANPD (art. 18 § 1º), reclamação a órgãos de defesa do consumidor (art. 18 § 8º), e evidência de infração para sanções (art. 52).
- **Próxima etapa:** se não atendido, requerimento ANPD → fiscalização → possível processo sancionador.

## Fundamento literal (Planalto, consulta 2026-08-30)
"Art. 19. A confirmação de existência ou o acesso a dados pessoais serão providenciados, mediante requisição do titular: I - em formato simplificado, imediatamente; ou II - por meio de declaração clara e completa... fornecida no prazo de até 15 (quinze) dias, contado da data do requerimento do titular."

## Observação honesta
- Para os demais direitos do art. 18 (correção, eliminação, portabilidade etc.), o caput do art. 18 § 5º remete a "prazos... previstos em regulamento" — a LGPD não fixa prazo único expresso para todos os direitos; monitorar regulamentação ANPD aplicável ao caso.`,
    metadados: { prazo: '15 dias (declaração completa) / imediato (simplificado)', contagem: 'dias corridos, da data do requerimento', fundamento: 'LGPD arts. 18 § 5º e 19, II' },
    tags: ['digital/lgpd', 'geral/prazos'],
    fonte: PLANALTO,
    urlFonte: URL_LGPD,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'lgpd-arts-18-19-direitos-titular-texto-literal', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Texto literal dos arts. 18 e 19.' },
      { destinoSlug: 'peca-requerimento-art18-titular', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Peça que dispara o prazo.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'prazo-incidente-seguranca-3-dias-uteis',
    titulo: 'Prazo — Comunicação de incidente de segurança: 3 dias úteis (ANPD e titular) + complementação em 20 dias úteis',
    tipoDocumento: 'PRAZO',
    area: 'digital',
    subarea: 'incidentes',
    assunto: 'Prazo regulamentar de comunicação de incidente',
    prioridade: 'P1',
    lote: 'LOTE-008',
    conteudo: `## Estrutura do prazo (formato padrão EJC)
- **Evento disparador:** conhecimento pelo controlador de incidente de segurança com potencial de risco ou dano relevante (art. 48 LGPD).
- **Prazo:** **3 dias úteis** para comunicar à ANPD (art. 6º) **e** ao titular (art. 9º) — Resolução CD/ANPD nº 15/2024; complementação fundamentada das informações em **20 dias úteis** (art. 6º § 3º).
- **Providência:** comunicação com conteúdo mínimo do art. 48 § 1º LGPD (natureza dos dados, titulares envolvidos, medidas de segurança, riscos, motivos da demora, medidas de reversão/mitigação).
- **Responsável:** controlador.
- **Documento necessário:** registro da data de conhecimento do incidente; formulário de comunicação ANPD; mensagem/aviso aos titulares.
- **Risco do descumprimento:** omissão agrava dosimetria; viabiliza sanções (art. 52) e ações civis.
- **Próxima etapa:** acompanhar determinações da ANPD (art. 48 § 2º — ampla divulgação ou medidas de reversão).

## Cuidado anti-invenção
- A LGPD diz apenas "prazo razoável, conforme definido pela autoridade nacional" — o prazo de 3 dias úteis vem da regulamentação ANPD (confiança B, via cópia institucional integral). Se houver legislação setorial específica com prazo próprio, ela prevalece (ressalva do art. 6º da Resolução).`,
    metadados: { prazo: '3 dias úteis (complementação: 20 dias úteis)', contagem: 'dias úteis, do conhecimento do incidente', fundamento: 'Resolução CD/ANPD nº 15/2024, arts. 6º e 9º; art. 48 LGPD' },
    tags: ['digital/incidentes', 'geral/prazos'],
    fonte: 'CD/ANPD (texto integral via cópia institucional ABRAPP; oficial em gov.br/anpd)',
    urlFonte: 'https://bibliotecadigital.mj.gov.br/handle/1/12879',
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-09-30',
    relacionamentos: [
      { destinoSlug: 'anpd-resolucao-15-2024-comunicacao-incidente', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Fonte regulamentar do prazo.' },
      { destinoSlug: 'fluxo-incidente-seguranca-lgpd', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Fluxo operacional do incidente.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'peca-requerimento-art18-titular',
    titulo: 'Peça-modelo — Requerimento de direitos do titular (LGPD art. 18) ao controlador',
    tipoDocumento: 'PECA',
    area: 'digital',
    subarea: 'bases-legais',
    assunto: 'Exercício dos direitos do titular de dados pessoais',
    prioridade: 'P1',
    lote: 'LOTE-008',
    conteudo: `# REQUERIMENTO DE DIREITOS DO TITULAR — ART. 18 DA LEI Nº 13.709/2018 (LGPD)

**Para:** {{CONTROLADOR}} (CNPJ {{CNPJ}}), na pessoa de seu Encarregado (DPO) — canal {{CANAL_ENCARREGADO}}
**Requerente:** {{TITULAR}}, CPF {{CPF}}, endereço {{ENDERECO}}, e-mail {{EMAIL}}

## Assunto: exercício de direitos previstos no art. 18 da LGPD

{{TITULAR}}, pessoa natural identificada, requer, com fundamento nos arts. 5º VIII, 18 § 3º e § 5º e 19 da Lei nº 13.709/2018, o atendimento **sem custos** dos direitos abaixo, relativos aos dados pessoais que trata a requerida:

## [ ] Marcar os direitos requeridos
- [ ] **Confirmação da existência de tratamento** (art. 18, I), com resposta em formato simplificado imediato ou declaração completa em até 15 (quinze) dias (art. 19, II);
- [ ] **Acesso aos dados** (art. 18, II), incluindo origem dos dados, critérios utilizados e finalidade do tratamento (art. 19, II);
- [ ] **Correção** de dados incompletos, inexatos ou desatualizados (art. 18, III), especificamente: {{DADOS_INCORRETOS}};
- [ ] **Anonimização, bloqueio ou eliminação** de dados desnecessários, excessivos ou tratados em desconformidade com a lei (art. 18, IV);
- [ ] **Informação das entidades públicas e privadas** com as quais houve uso compartilhado de dados (art. 18, VII);
- [ ] **Revogação do consentimento** para as finalidades {{FINALIDADES}} (art. 18, IX c/c art. 8º § 5º);
- [ ] **Revisão por pessoa natural** de decisão tomada unicamente com base em tratamento automatizado (art. 20), especificamente {{DECISAO_AUTOMATIZADA}}.

## Fatos
{{FATOS}}

## Observações legais
1. O requerimento será atendido sem custos, nos prazos e termos previstos em regulamento (art. 18 § 5º);
2. A confirmação/acesso por declaração completa deve ser fornecida em até 15 dias da data do requerimento (art. 19, II);
3. Caso a resposta seja negativa ou parcial, requer-se a indicação das razões de fato ou de direito (art. 18 § 4º, II);
4. O descumprimento autoriza peticionamento perante a ANPD (art. 18 § 1º), reclamação a órgãos de defesa do consumidor (art. 18 § 8º) e medidas judiciais, sem prejuízo do dever de indenizar (art. 42).

**Local/data:** {{LOCAL}}, {{DATA}}
**Assinatura:** {{TITULAR}}

---
### Checklist de revisão da peça (antes do envio)
- [ ] Identificar canal correto do Encarregado (site da empresa/ANPD);
- [ ] Guardar protocolo e prova do envio (data — conta o prazo de 15 dias);
- [ ] Marcar somente os direitos efetivamente pretendidos;
- [ ] Anexar documento de identidade se exigido para confirmação de identidade;
- [ ] Definir acompanhamento: se não houver resposta em 15 dias → ANPD/Procon.
`,
    metadados: { tipo_modelo: 'requerimento extrajudicial', variaveis: ['{{CONTROLADOR}}', '{{CNPJ}}', '{{CANAL_ENCARREGADO}}', '{{TITULAR}}', '{{CPF}}', '{{ENDERECO}}', '{{EMAIL}}', '{{DADOS_INCORRETOS}}', '{{FINALIDADES}}', '{{DECISAO_AUTOMATIZADA}}', '{{FATOS}}', '{{LOCAL}}', '{{DATA}}'], dadosFicticios: false },
    tags: ['digital/lgpd'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'lgpd-arts-18-19-direitos-titular-texto-literal', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Base legal do requerimento.' },
      { destinoSlug: 'prazo-lgpd-resposta-titular-15-dias', tipo: 'BASE_PRAZO', descricao: 'Prazo de resposta que este requerimento dispara.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'checklist-compliance-lgpd-pratico',
    titulo: 'Checklist — Conformidade LGPD prática: 18 pontos de governança mínima',
    tipoDocumento: 'CHECKLIST',
    area: 'digital',
    subarea: 'bases-legais',
    assunto: 'Programa de conformidade e accountability',
    prioridade: 'P1',
    lote: 'LOTE-008',
    conteudo: `# CHECKLIST LGPD — GOVERNANÇA MÍNIMA DEMONSTRÁVEL (ACCOUNTABILITY)

Base legal: LGPD arts. 6º X (responsabilização e prestação de contas), 41 (encarregado), 46 (segurança), 48 (incidente), 52 § 1º VIII-IX (mitigadores de sanção).

## 1. Mapa e bases legais
- [ ] Inventário de operações de tratamento (mapa de dados: fluxos, finalidades, categorias, prazos de guarda);
- [ ] Base legal identificada para cada operação (art. 7º) — para dados sensíveis, art. 11;
- [ ] Avisos de privacidade coerentes com o mapa (princípio da transparência — art. 6º VI).

## 2. Papéis e canais
- [ ] Encarregado indicado e canal de comunicação publicado (art. 5º VIII; art. 41);
- [ ] Contratos controlador↔operador com obrigações de dados (art. 39);
- [ ] Matriz de decisões (quem decide o tratamento — controlador x operador).

## 3. Direitos do titular
- [ ] Processo operacional de atendimento a requerimentos art. 18 (com registro de protocolo);
- [ ] Resposta imediata simplificada / completa em 15 dias (art. 19, II);
- [ ] Procedimento de revisão de decisões automatizadas (art. 20).

## 4. Segurança e incidentes
- [ ] Medidas técnicas e administrativas (art. 46), documentadas — incluindo desde a concepção do produto (§ 2º);
- [ ] Playbook de incidente: detecção → classificação de risco relevante → comunicação ANPD e titular em 3 dias úteis (Resolução CD/ANPD 15/2024) → complementação em 20 dias úteis;
- [ ] Registro interno de incidentes (mesmo os julgados sem comunicação obrigatória).

## 5. Governança probatória
- [ ] Política de boas práticas e governança (mitigador art. 52 § 1º IX);
- [ ] Treinamento e evidência de capacitação;
- [ ] RIPD (relatório de impacto) para tratamentos de alto risco (art. 5º XVII);
- [ ] Revisão periódica documentada (datas e responsáveis).

## Uso no EJC
- Cada item marcado = evidência para os critérios VIII/IX/X do art. 52 § 1º na dosimetria ANPD (redução de multa) e defesa em ação civil (art. 46).`,
    metadados: { itens: 18, uso: 'auditoria interna e defesa sancionatória' },
    tags: ['digital/lgpd', 'digital/anpd'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'lgpd-art-6-principios-tratamento', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Princípios operacionalizados pelo checklist.' },
      { destinoSlug: 'anpd-resolucao-4-2023-dosimetria-sancoes', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Itens do checklist são atenuantes na dosimetria.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'fluxo-incidente-seguranca-lgpd',
    titulo: 'Fluxo — Resposta a incidente de segurança de dados (LGPD art. 48 + Resolução ANPD 15/2024)',
    tipoDocumento: 'FLUXO',
    area: 'digital',
    subarea: 'incidentes',
    assunto: 'Gestão de vazamentos e incidentes',
    prioridade: 'P1',
    lote: 'LOTE-008',
    conteudo: `# FLUXO DE INCIDENTE DE SEGURANÇA (formato evento → prazo → providência → risco → próxima etapa)

## E1. Detecção
- **Evento:** identificação de acesso não autorizado, vazamento, perda ou exposição de dados.
- **Prazo:** imediato.
- **Providência:** conter o incidente; registrar data/hora da DETECÇÃO e do CONHECIMENTO (base da contagem dos 3 dias úteis).
- **Risco:** não documentar a data do conhecimento fragiliza a defesa do cumprimento de prazo.
- **Próxima etapa:** avaliação de relevância (E2).

## E2. Avaliação — risco ou dano RELEVANTE? (art. 48 caput)
- **Providência:** triagem por critérios: natureza e volume de dados, sensibilidade, nº de titulares, possibilidade de dano patrimonial/moral/reputacional; verificar se dados eram cifrados (art. 48 § 3º — dados ininteligíveis pesam contra a relevância do risco).
- **Risco:** julgar "sem relevância" sem registro fundamentado → ANPD pode desautorizar depois.
- **Próxima etapa:** relevante → E3; não relevante → registrar fundamentação e monitorar.

## E3. Comunicação à ANPD — 3 DIAS ÚTEIS (Res. 15/2024, art. 6º)
- **Providência:** formulário de comunicação com conteúdo mínimo do art. 48 § 1º LGPD; ressalvar prazos setoriais específicos.
- **Risco:** descumprimento = agravante na dosimetria.
- **Próxima etapa:** complementação em até 20 dias úteis (art. 6º § 3º).

## E4. Comunicação ao titular — 3 DIAS ÚTEIS (Res. 15/2024, art. 9º)
- **Providência:** aviso claro (o que ocorreu, quais dados, riscos, medidas, canal de atendimento); comprovar a comunicação em até 3 dias úteis após o término do prazo.
- **Próxima etapa:** suporte ao titular (E5).

## E5. Mitigação e acompanhamento
- **Providência:** medidas de reversão/mitigação (art. 48 §§ 1º VI e 2º); acompanhar determinações da ANPD (ampla divulgação etc.).
- **Risco:** sanções (art. 52), ações civis (art. 42), dano reputacional.
- **Próxima etapa:** pós-mortem interno — atualizar controles (art. 52 § 1º VIII) e treinar times.

## Regra de contagem
- "Conhecimento" do controlador dispara o prazo — política interna deve FIXAR o momento (ex.: alerta do SOC aciona o comitê no mesmo dia).`,
    metadados: { etapas: 5, formato: 'evento → prazo → providência → risco → próxima etapa' },
    tags: ['digital/incidentes', 'geral/prazos'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'lgpd-art-48-incidente-seguranca-texto-literal', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Dever legal de comunicação.' },
      { destinoSlug: 'prazo-incidente-seguranca-3-dias-uteis', tipo: 'BASE_PRAZO', descricao: 'Prazos regulamentares aplicados no fluxo.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'triagem-demandas-dados-pessoais',
    titulo: 'Triagem — Script de perguntas para demandas de proteção de dados (LGPD)',
    tipoDocumento: 'TRIAGEM',
    area: 'digital',
    subarea: 'bases-legais',
    assunto: 'Classificação inicial de casos de dados pessoais',
    prioridade: 'P1',
    lote: 'LOTE-008',
    conteudo: `# TRIAGEM — DEMANDAS LGPD (perguntas objetivas)

## Bloco A — Perfil do cliente
1. Cliente é titular (pessoa natural) ou empresa (controlador/operador)? [titular | controlador | operador | encarregado]
2. Área do tratamento: [comércio eletrônico | RH/funcionários | saúde | financeiro/crédito | marketing | plataforma digital | outro]

## Bloco B — Fato (se titular)
3. O que ocorreu? [vazamento conhecido | uso indevido reveldado | recusa de acesso/eliminação | publicidade sem consentimento | decisão automatizada (crédito/perfil) | outro]
4. Como soube? Data aproximada do conhecimento? (contagem de prazos)
5. Há prova? [prints | e-mails | notícia | comunicação da empresa | laudo | nada ainda]
6. Dados envolvidos: [comuns | sensíveis (saúde, biometria, religião...) | financeiros | de menores]
7. Houve dano concreto? [financeiro | moral | exposição | fraude posterior | nenhum ainda]
8. Já pediu ao controlador (art. 18)? Protocolo/resposta/data?
9. Já reclamou a Procon/ANPD/Plataforma?

## Bloco C — Fato (se controlador/operador)
10. Operação existe há quanto tempo? Há mapa de dados e base legal documentada (art. 7º)?
11. Há encarregado indicado e canal publicado?
12. Medidas de segurança do art. 46 documentadas? (testes, cifragem, acessos)
13. Incidente em curso? Data do conhecimento? Comunicado à ANPD/titular dentro dos 3 dias úteis?
14. Há fiscalização/processo ANPD? Fase? (preparatório | sancionador | decisão)

## Regras de classificação (SE-ENTÃO)
- SE titular + vazamento com dados sensíveis/fraude posterior ENTÃO prioridade ALTA (dano potencial + gravidade ANPD § 3º III) → art. 42 + art. 44 + art. 48.
- SE titular + recusa de acesso/resposta > 15 dias ENTÃO trilha administrativa (ANPD art. 18 § 1º) + consumerista (art. 18 § 8º).
- SE controlador + incidente não comunicado ENTÃO urgência máxima: comunicar dentro do prazo remanescente + documentar fundamentos.
- SE controlador + fiscalização/pré-processo ENTÃO ativar mitigadores (art. 52 § 1º VII-X): cooperação, cessação, políticas — vide Resolução 4/2023 (cessação cedo = até 75% de atenuação).`,
    metadados: { blocos: 3, uso: 'triagem de novos casos' },
    tags: ['digital/lgpd', 'geral/triagem'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'regra-se-incidente-lgpd-comunicacao', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Regras SE-ENTÃO correlatas.' },
      { destinoSlug: 'checklist-compliance-lgpd-pratico', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Para perfil controlador, usar checklist.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'argumentacao-lgpd-dois-lados',
    titulo: 'Argumentação — Demandas de dados pessoais: tese do titular x defesa do controlador',
    tipoDocumento: 'ARGUMENTACAO',
    area: 'digital',
    subarea: 'incidentes',
    assunto: 'Análise bilateral de controvérsias LGPD',
    prioridade: 'P1',
    lote: 'LOTE-008',
    conteudo: `# ARGUMENTAÇÃO BILATERAL — LGPD

## Controvérsia 1 — Vazamento e indenização
### Lado do titular
- Tratamento irregular (art. 44): a segurança esperada não foi fornecida — modo do tratamento, riscos previsíveis, técnicas disponíveis à época;
- Dever de segurança do art. 46 (medidas técnicas e administrativas; privacy by design — § 2º);
- Responsabilidade do art. 42 + inversão do ônus (art. 42 § 2º) se verossímil/hipossuficiente;
- Comunicação omissa do incidente (art. 48) agrava a reprovação e sustenta culpa do controlador.
### Defesa do controlador
- Medidas do art. 46 adotadas e documentadas (estado da arte, testes, cifragem — art. 48 § 3º);
- Exclusões do art. 43 (culpa exclusiva de terceiro/titular; fortuito externo);
- Ausência de dano concreto ou nexo; dano moral não presumido — exigir prova do prejuízo;
- Incidente comunicado tempestivamente dentro do prazo regulamentar.

## Controvérsia 2 — Recusa de direitos do titular
### Lado do titular
- Direitos "a qualquer momento e mediante requisição" (art. 18 caput); resposta sem custos (§ 5º);
- Prazo legal de 15 dias para declaração completa (art. 19, II);
- Vias: ANPD (§ 1º), defesa do consumidor (§ 8º), judiciário.
### Defesa do controlador
- Segredos comercial/industrial limitam o alcance do acesso (art. 19, II);
- Impossibilidade de adoção imediata deve ser comunicada com razões (art. 18 § 4º, II);
- Dados anonimizados ficam fora da portabilidade (art. 18 § 7º).

## Controvérsia 3 — Processo sancionador ANPD
### Lado da ANPD/titular
- Infração grave (Res. 4/2023 art. 8º § 3º: sem base legal / dados sensíveis / vantagem econômica);
- Agravantes: reincidência, medidas descumpridas (art. 14).
### Defesa do controlador
- Atenuantes por cessação (75%/50%/30% conforme momento);
- Critérios favoráveis do art. 52 § 1º: boa-fé, cooperação, política de governança, pronta correção;
- Proporcionalidade (critério XI) — sanção deve caber dentro do teto legal de 2%/R$ 50 mi por infração.

## Peso das evidências (guia prático)
- Documentação de governança pré-existente pesa mais que promessas posteriores;
- Data do conhecimento do incidente é prova-chave (prazo de 3 dias úteis);
- Print/e-mail de recusa do art. 18 vale como início de prova de violação do dever.`,
    metadados: { controversias: 3, formato: 'lado A x lado B + evidências' },
    tags: ['digital/lgpd', 'digital/anpd'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'lgpd-art-42-responsabilidade-civil-texto-literal', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Base da controvérsia 1.' },
      { destinoSlug: 'anpd-resolucao-4-2023-dosimetria-sancoes', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Base da controvérsia 3.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'regra-se-incidente-lgpd-comunicacao',
    titulo: 'Regra de inteligência — SE incidente com risco relevante ENTÃO comunicar ANPD+titular em 3 dias úteis',
    tipoDocumento: 'REGRA_INTELIGENCIA',
    area: 'digital',
    subarea: 'incidentes',
    assunto: 'Automação da decisão de comunicação de incidente',
    prioridade: 'P1',
    lote: 'LOTE-008',
    conteudo: `# REGRA SE-ENTÃO — INCIDENTE DE SEGURANÇA (LGPD)

## REGRA 1 — Obrigatoriedade de comunicação
- **SE** controlador conhece incidente de segurança
- **E** o incidente **possa** acarretar risco ou dano relevante aos titulares (LGPD art. 48 caput)
- **ENTÃO** comunicar à ANPD **E** ao titular
- **NO PRAZO DE:** 3 dias úteis do conhecimento (Res. CD/ANPD 15/2024, arts. 6º e 9º)
- **COM CONTEÚDO MÍNIMO:** art. 48 § 1º (6 itens) — natureza dos dados, titulares envolvidos, medidas de segurança, riscos, motivos de demora, medidas de mitigação
- **OBSERVAÇÃO:** prazos setoriais específicos prevalecem (ressalva do art. 6º)
- **FALSO SE:** dados comprovadamente ininteligíveis a terceiros não autorizados (art. 48 § 3º) podem afastar a relevância do risco — registrar a fundamentação da não comunicação.

## REGRA 2 — Complementação
- **SE** comunicação inicial enviada dentro do prazo
- **ENTÃO** informações podem ser complementadas em até 20 dias úteis (Res. 15/2024, art. 6º § 3º), de maneira fundamentada.

## REGRA 3 — Dose de gravidade
- **SE** incidente NÃO comunicado (ou comunicado fora do prazo)
- **E** instaurado processo sancionador
- **ENTÃO** expectativa de agravamento — avaliar Res. 4/2023 (medidas preventivas descumpridas: +20% até 80%; corretivas descumpridas: +30% até 90%).
- **E SE** cessação/regularização imediata ENTÃO atenuante de até 75% (antes do procedimento preparatório), 50% (até o sancionador) ou 30% (até a 1ª instância).

## REGRA 4 — Vazamento + relação de consumo
- **SE** controlador é fornecedor e titular é consumidor
- **ENTÃO** cumular fundamentos LGPD (arts. 42/44/46/48) e CDC (arts. 6º VI/VIII, 14, 27 — prescrição de 5 anos do fato do serviço; súmulas/temas do LOTE-006 quando aplicáveis).`,
    metadados: { regras: 4, motor: 'SE-ENTÃO interpretável' },
    tags: ['digital/incidentes', 'digital/lgpd'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'fluxo-incidente-seguranca-lgpd', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Fluxo operacional correspondente.' },
      { destinoSlug: 'cdc-art-14-fato-servico-texto-literal', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Regra 4 cumula com responsabilidade do fornecedor (CDC).' },
    ],
  } satisfies InputDocument,
  {
    slug: 'doutrina-conceitos-lgpd-anpd',
    titulo: 'Doutrina — Conceitos operacionais da LGPD: controlador, operador, encarregado, RIPD e accountability',
    tipoDocumento: 'DOUTRINA',
    area: 'digital',
    subarea: 'bases-legais',
    assunto: 'Explicação técnica dos institutos',
    prioridade: 'P1',
    lote: 'LOTE-008',
    conteudo: `# DOUTRINA E CONCEITOS (elaboração própria EJC, ancorada nos textos legais vinculados)

## Controlador x Operador (LGPD art. 5º VI-VII)
- **Controlador:** quem DECIDE (defini finalidade e meios essenciais do tratamento). É ele quem responde ao titular e comunica incidentes.
- **Operador:** quem EXECUTA o tratamento em nome do controlador (ex.: provedor de nuvem, agência de marketing processando listas).
- **Por que importa:** a qualificação define quem responde civilmente (art. 42 § 1º), quem atende o titular (art. 18 § 3º) e como se estrutura o contrato entre as partes (art. 39).

## Encarregado (DPO)
- Canal entre controlador, titulares e ANPD (art. 5º VIII). Não é "o culpado" da empresa — é ponto de contato obrigatório e peça do accountability (art. 41).
- Na prática: publicar canal do encarregado; registrar requerimentos recebidos; alinhar com segurança da informação a resposta de incidentes.

## RIPD — Relatório de Impacto (art. 5º XVII)
- Documento que descreve tratamentos que podem gerar riscos a liberdades civis e direitos fundamentais + salvaguardas/mitigações.
- Uso estratégico: é evidência dos critérios VIII-IX do art. 52 § 1º (mitigação de sanção) e defesa de que o tratamento foi pensado (art. 46 § 2º).

## Accountability (art. 6º X)
- Conceito-chave: a conformidade deve ser PROVÁVEL (registros, políticas, logs, treinamentos). Em fiscalização, "achismo" não pontua; documento datado pontua.
- Ciclo: mapear → basear (art. 7º) → minimizar → proteger (art. 46) → monitorar incidentes (art. 48) → revisar.

## Incidente de segurança relevante
- Não é todo incidente: exige potencial de risco/dano RELEVANTE (art. 48). O juízo de relevância deve ser registrado por escrito (volume, sensibilidade, cifragem, nº de titulares).
- Erro comum: tratar "não vamos comunicar" como decisão sem memória — a ausência de fundamentação é o que posteriormente punir.

## Relação com o CDC
- Nas relações de consumo, LGPD e CDC se somam (art. 52 § 2º LGPD: sanções administrativas não substituem as civis): fornecedor pode responder simultaneamente na ANPD e civilmente perante o consumidor (vício/fato — docs LOTE-009).`,
    metadados: { conceitos: 6, elaboracao: 'própria EJC com referências literais' },
    tags: ['digital/lgpd', 'digital/anpd'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'lgpd-art-5-definicoes-agentes', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Definições legais literais que ancoram os conceitos.' },
      { destinoSlug: 'checklist-compliance-lgpd-pratico', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Operacionalização dos conceitos.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'jurimetria-lgpd-multas-exposicao',
    titulo: 'Jurimetria — Estrutura de acompanhamento de sanções e fiscalizações LGPD (dados a preencher com números REAIS)',
    tipoDocumento: 'JURIMETRIA',
    area: 'digital',
    subarea: 'anpd',
    assunto: 'Métricas de exposição sancionatória',
    prioridade: 'P2',
    lote: 'LOTE-008',
    conteudo: `# JURIMETRIA — LGPD (ESTRUTURA; NUNCA INVENTAR DADOS)

## Regra do banco 15
- Este registro é um ESQUEMA. Preencher exclusivamente com números reais apurados (decisões ANPD publicadas, dados do cliente). Zero registros = zero no relatório.

## Variáveis por decisão sancionatória ANPD (fonte: decisões publicadas pela ANPD)
| Campo | Tipo | Observação |
|---|---|---|
| processo | texto | nº do processo (da publicação oficial) |
| data_decisao | data | |
| tipo_infracao | texto | p.ex. incidente não comunicado, tratamento sem base legal |
| gravidade | enum | leve / média / grave (Res. 4/2023 art. 8º) |
| grau_dano | enum | conforme Tabela 1 (posição no intervalo A1-A2) |
| alíquota_aplicada | decimal | % do faturamento |
| valor_multa | decimal | R$ |
| agravantes | lista | reincidência/medidas descumpridas |
| atenuantes | lista | cessação/cooperação/política de governança |
| resultado_recurso | enum | confirmada / reformada / pendente |

## Variáveis por fiscalização/ataque civil (dados do cliente)
- requerimentos art. 18 recebidos / respondidos no prazo (15 dias);
- incidentes detectados / comunicados em 3 dias úteis;
- ações indenizatórias propostas / procedentes / valor médio.

## Métricas derivadas (quando houver base real)
- Distribuição de gravidade das multas aplicadas;
- Redução média por atenuante de cessação (75/50/30);
- Tempo médio de tramitação ANPD por fase.

## Fontes para preenchimento futuro
- Decisões e sanções publicadas pela ANPD (gov.br/anpd — página de decisões);
- Notícias oficiais ANPD; demais portais oficiais de tribunais para a via civil.`,
    metadados: { status_dados: 'esquema vazio — aguardando dados reais', regra: 'nunca inventar números' },
    tags: ['digital/anpd', 'digital/lgpd'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'anpd-resolucao-4-2023-dosimetria-sancoes', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Variáveis derivadas da dosimetria oficial.' },
    ],
  } satisfies InputDocument,
];
