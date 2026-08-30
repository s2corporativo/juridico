// LOTE-013 — LGPD: dados pessoais sensíveis, crianças e adolescentes, transferência internacional (P1)
// Textos LITERAIS extraídos do Planalto (Lei 13.709/2018, consulta 2026-08-30):
//  - arts. 11 (dados sensíveis), 12 (anonimização), 13 (estudos em saúde), 14 (crianças/adolescentes)
//  - arts. 33, 34, 35, 36 (transferência internacional)
// Regulação ANPD confirmada em página oficial gov.br (consulta 2026-08-30):
//  - Resolução CD/ANPD nº 19/2024 (Regulamento de Transferência Internacional de Dados + cláusulas-padrão)
//    — mecanismos regulados e prazo de implementação registrados da página oficial da ANPD (confiabilidade B —
//    texto integral do regulamento via gov.br; mecanismos conferidos na página temática oficial)
// ANTI-INVENÇÃO registrada nesta fase:
//  - Não citados números de decisão da ANPD ou REsp sem confirmação oficial na consulta.
import type { InputDocument } from '../../src/lib/ejc/types';

const D = '2026-08-30';
const LGPD = 'Presidência da República — Planalto (Lei 13.709/2018 — LGPD)';
const URL_LGPD = 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm';
const ANPD_GOV = 'ANPD — página oficial gov.br (Transferência Internacional de Dados)';
const URL_ANPD_TID = 'https://www.gov.br/anpd/pt-br/assuntos/assuntos-internacionais/transferencia-internacional-de-dados';
const EJC = 'Elaboração EJC — conteúdo estrutural original';

export default [
  {
    slug: 'lgpd-art-11-dados-sensiveis-hipoteses',
    titulo: 'LGPD art. 11 — Tratamento de dados pessoais sensíveis: consentimento específico e 7 hipóteses de dispensa (texto literal confirmado)',
    tipoDocumento: 'LEGISLACAO',
    area: 'digital',
    subarea: 'dados-sensiveis',
    assunto: 'Dados sensíveis — bases de tratamento',
    prioridade: 'P0',
    conteudo: `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)

"Art. 11. O tratamento de dados pessoais sensíveis somente poderá ocorrer nas seguintes hipóteses:
I - quando o titular ou seu responsável legal consentir, de forma específica e destacada, para finalidades específicas;
II - sem fornecimento de consentimento do titular, nas hipóteses em que for indispensável para:
a) cumprimento de obrigação legal ou regulatória pelo controlador;
b) tratamento compartilhado de dados necessários à execução, pela administração pública, de políticas públicas previstas em leis ou regulamentos;
c) realização de estudos por órgão de pesquisa, garantida, sempre que possível, a anonimização dos dados pessoais sensíveis;
d) exercício regular de direitos, inclusive em contrato e em processo judicial, administrativo e arbitral;
e) proteção da vida ou da incolumidade física do titular ou de terceiro;
f) tutela da saúde, exclusivamente, em procedimento realizado por profissionais de saúde, serviços de saúde ou autoridade sanitária; ou
g) garantia da prevenção à fraude e à segurança do titular, nos processos de identificação e autenticação de cadastro em sistemas eletrônicos, resguardados os direitos mencionados no art. 9º desta Lei e exceto no caso de prevalecerem direitos e liberdades fundamentais do titular que exijam a proteção dos dados pessoais.
§ 1º Aplica-se o disposto neste artigo a qualquer tratamento de dados pessoais que revele dados pessoais sensíveis e que possa causar dano ao titular, ressalvado o disposto em legislação específica.
§ 3º A comunicação ou o uso compartilhado de dados pessoais sensíveis entre controladores com objetivo de obter vantagem econômica poderá ser objeto de vedação ou de regulamentação por parte da autoridade nacional, ouvidos os órgãos setoriais do Poder Público, no âmbito de suas competências.
§ 4º É vedada a comunicação ou o uso compartilhado entre controladores de dados pessoais sensíveis referentes à saúde com objetivo de obter vantagem econômica, exceto nas hipóteses relativas a prestação de serviços de saúde, de assistência farmacêutica e de assistência à saúde, desde que observado o § 5º deste artigo, incluídos os serviços auxiliares de diagnose e terapia, em benefício dos interesses dos titulares de dados, e para permitir:
I - a portabilidade de dados quando solicitada pelo titular; ou
II - as transações financeiras e administrativas resultantes do uso e da prestação dos serviços de que trata este parágrafo.
§ 5º É vedado às operadoras de planos privados de assistência à saúde o tratamento de dados de saúde para a prática de seleção de riscos na contratação de qualquer modalidade, assim como na contratação e exclusão de beneficiários."

## Interpretação operacional
- O consentimento para dados sensíveis é SEMPRE específico e destacado para finalidades específicas (inciso I) — consentimento genérico em termos de uso é irregular;
- A alínea f vigente (red. Lei 13.853/2019) restringe a tutela da saúde a profissionais/serviços de saúde ou autoridade sanitária — o texto anterior era mais amplo; alerta de redação dupla registrado;
- Vedações expressas: compartilhamento de dados de saúde para vantagem econômica fora das hipóteses legais (§ 4º) e seleção de riscos por operadoras de plano (§ 5º).`,
    metadados: { numero: 'Lei 13.709/2018', artigos_principais: ['11'], vigente: true, confirmacao_texto: 'Extração literal do Planalto em 2026-08-30; alínea f com redação da Lei 13.853/2019 e § 4º com redação da mesma lei registrados' },
    tags: ['digital/dados-sensiveis', 'digital/bases-legais'],
    fonte: LGPD,
    urlFonte: URL_LGPD,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'lgpd-art-7-bases-legais-texto-literal', tipo: 'CONTEXTO_REGULACAO', descricao: 'Bases gerais (art. 7º) x sensíveis (art. 11).' },
      { destinoSlug: 'tese-dados-sensiveis-vedacao-vantagem-economica', tipo: 'INTERPRETA_DISPOSITIVO', descricao: 'Tese dos §§ 4º-5º.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'lgpd-art-12-anonimizacao-limites',
    titulo: 'LGPD art. 12 — Anonimização: dados anonimizados não são pessoais, salvo reversibilidade por esforços razoáveis (texto literal confirmado)',
    tipoDocumento: 'LEGISLACAO',
    area: 'digital',
    subarea: 'dados-sensiveis',
    assunto: 'Anonimização e pseudonimização',
    prioridade: 'P1',
    conteudo: `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)

"Art. 12. Os dados anonimizados não serão considerados dados pessoais para os fins desta Lei, salvo quando o processo de anonimização ao qual foram submetidos for revertido, utilizando exclusivamente meios próprios, ou quando, com esforços razoáveis, puder ser revertido.
§ 1º A determinação do que seja razoável deve levar em consideração fatores objetivos, tais como custo e tempo necessários para reverter o processo de anonimização, de acordo com as tecnologias disponíveis, e a utilização exclusiva de meios próprios.
§ 2º Poderão ser igualmente considerados como dados pessoais, para os fins desta Lei, aqueles utilizados para formação do perfil comportamental de determinada pessoa natural, se identificada.
§ 3º A autoridade nacional poderá dispor sobre padrões e técnicas utilizados em processos de anonimização e realizar verificações acerca de sua segurança, ouvido o Conselho Nacional de Proteção de Dados Pessoais."

## Interpretação operacional
- Teste da reversibilidade: custo + tempo + tecnologias disponíveis + meios EXCLUSIVAMENTE próprios do controlador;
- Perfil comportamental de pessoa identificada segue sendo dado pessoal (§ 2º) — "anonymized analytics" que remonta ao perfil não escapa da LGPD.}`,
    metadados: { numero: 'Lei 13.709/2018', artigos_principais: ['12'], vigente: true, confirmacao_texto: 'Extração literal do Planalto em 2026-08-30' },
    tags: ['digital/dados-sensiveis'],
    fonte: LGPD,
    urlFonte: URL_LGPD,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'doutrina-anonimizacao-pseudonimizacao', tipo: 'INTERPRETA_DISPOSITIVO', descricao: 'Conceitos detalhados.' },
      { destinoSlug: 'lgpd-art-13-estudos-saude-pesquisa', tipo: 'CONEXO_TEMATICO', descricao: 'Pesquisa e anonimização.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'lgpd-art-13-estudos-saude-pesquisa',
    titulo: 'LGPD art. 13 — Acesso de órgãos de pesquisa a bases com dados sensíveis: ambiente controlado, vedação de transferência a terceiro e não revelação (texto literal confirmado)',
    tipoDocumento: 'LEGISLACAO',
    area: 'digital',
    subarea: 'dados-sensiveis',
    assunto: 'Pesquisa em saúde pública',
    prioridade: 'P1',
    conteudo: `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)

"Art. 13. Na realização de estudos em saúde pública, os órgãos de pesquisa poderão ter acesso a bases de dados pessoais, que serão tratados exclusivamente dentro do órgão e estritamente para a finalidade de realização de estudos e pesquisas e mantidos em ambiente controlado e seguro, conforme práticas de segurança previstas em regulamento específico e que incluam, sempre que possível, a anonimização ou pseudonimização dos dados, bem como considerem os devidos padrões éticos relacionados a estudos e pesquisas.
§ 1º A divulgação dos resultados ou de qualquer excerto do estudo ou da pesquisa de que trata o caput deste artigo em nenhuma hipótese poderá revelar dados pessoais.
§ 2º O órgão de pesquisa será o responsável pela segurança da informação prevista no caput deste artigo, não permitida, em circunstância alguma, a transferência dos dados a terceiro.
§ 4º Para os efeitos deste artigo, a pseudonimização é o tratamento por meio do qual um dado perde a possibilidade de associação, direta ou indireta, a um indivíduo, senão pelo uso de informação adicional mantida separadamente pelo controlador em ambiente controlado e seguro."`,
    metadados: { numero: 'Lei 13.709/2018', artigos_principais: ['13'], vigente: true, confirmacao_texto: 'Extração literal do Planalto em 2026-08-30' },
    tags: ['digital/dados-sensiveis'],
    fonte: LGPD,
    urlFonte: URL_LGPD,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'lgpd-art-11-dados-sensiveis-hipoteses', tipo: 'FUNDAMENTA_EM', descricao: 'Base de pesquisa no art. 11 II c.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'lgpd-art-14-criancas-adolescentes-melhor-interesse',
    titulo: 'LGPD art. 14 — Crianças e adolescentes: melhor interesse, consentimento específico e destacado de um dos pais, vedação de condicionamento e esforço de verificação (texto literal confirmado)',
    tipoDocumento: 'LEGISLACAO',
    area: 'digital',
    subarea: 'criancas-adolescentes',
    assunto: 'Tratamento de dados de crianças',
    prioridade: 'P0',
    conteudo: `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)

"Art. 14. O tratamento de dados pessoais de crianças e de adolescentes deverá ser realizado em seu melhor interesse, nos termos deste artigo e da legislação pertinente.
§ 1º O tratamento de dados pessoais de crianças deverá ser realizado com o consentimento específico e em destaque dado por pelo menos um dos pais ou pelo responsável legal.
§ 2º No tratamento de dados de que trata o § 1º deste artigo, os controladores deverão manter pública a informação sobre os tipos de dados coletados, a forma de sua utilização e os procedimentos para o exercício dos direitos a que se refere o art. 18 desta Lei.
§ 3º Poderão ser coletados dados pessoais de crianças sem o consentimento a que se refere o § 1º deste artigo quando a coleta for necessária para contatar os pais ou o responsável legal, utilizados uma única vez e sem armazenamento, ou para sua proteção, e em nenhum caso poderão ser repassados a terceiro sem o consentimento de que trata o § 1º deste artigo.
§ 4º Os controladores não deverão condicionar a participação dos titulares de que trata o § 1º deste artigo em jogos, aplicações de internet ou outras atividades ao fornecimento de informações pessoais além das estritamente necessárias à atividade.
§ 5º O controlador deve realizar todos os esforços razoáveis para verificar que o consentimento a que se refere o § 1º deste artigo foi dado pelo responsável pela criança, consideradas as tecnologias disponíveis.
§ 6º As informações sobre o tratamento de dados referidas neste artigo deverão ser fornecidas de maneira simples, clara e acessível, consideradas as características físico-motoras, perceptivas, sensoriais, intelectuais e mentais do usuário, com uso de recursos audiovisuais quando adequado, de forma a proporcionar a informação necessária aos pais ou ao responsável legal e adequada ao entendimento da criança."

## Interpretação operacional
- Cinco obrigações concretas para apps/games/sites para crianças: (1) consentimento específico+destacado de um dos pais (§ 1º); (2) política pública sobre dados coletados e uso (§ 2º); (3) exceção única de contato com pais, sem armazenamento e sem repasse (§ 3º); (4) vedação de condicionar participação à coleta excessiva (§ 4º); (5) esforços razoáveis de verificação da parentalidade (§ 5º) com linguagem adaptada (§ 6º).`,
    metadados: { numero: 'Lei 13.709/2018', artigos_principais: ['14'], vigente: true, confirmacao_texto: 'Extração literal do Planalto em 2026-08-30' },
    tags: ['digital/criancas-adolescentes', 'digital/bases-legais'],
    fonte: LGPD,
    urlFonte: URL_LGPD,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'lgpd-arts-18-19-direitos-titular-texto-literal', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Direitos mencionados no § 2º.' },
      { destinoSlug: 'checklist-conformidade-apps-criancas', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Conferência por item.' },
      { destinoSlug: 'tese-melhor-interesse-crianca-consentimento-pais', tipo: 'INTERPRETA_DISPOSITIVO', descricao: 'Tese operacional.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'lgpd-arts-33-36-transferencia-internacional',
    titulo: 'LGPD arts. 33-36 — Transferência internacional: 9 hipóteses legais, avaliação de adequação pela ANPD, cláusulas-padrão e comunicação de alterações (textos literais confirmados)',
    tipoDocumento: 'LEGISLACAO',
    area: 'digital',
    subarea: 'transferencia-internacional',
    assunto: 'Transferência internacional de dados',
    prioridade: 'P0',
    conteudo: `## Textos CONFIRMADOS LITERALMENTE no Planalto (consulta 2026-08-30)

### Art. 33 — hipóteses
"Art. 33. A transferência internacional de dados pessoais somente é permitida nos seguintes casos:
I - para países ou organismos internacionais que proporcionem grau de proteção de dados pessoais adequado ao previsto nesta Lei;
II - quando o controlador oferecer e comprovar garantias de cumprimento dos princípios, dos direitos do titular e do regime de proteção de dados previstos nesta Lei, na forma de:
a) cláusulas contratuais específicas para determinada transferência;
b) cláusulas-padrão contratuais;
c) normas corporativas globais;
d) selos, certificados e códigos de conduta regularmente emitidos;
III - quando a transferência for necessária para a cooperação jurídica internacional entre órgãos públicos de inteligência, de investigação e de persecução, de acordo com os instrumentos de direito internacional;
IV - quando a transferência for necessária para a proteção da vida ou da incolumidade física do titular ou de terceiro;
V - quando a autoridade nacional autorizar a transferência;
VI - quando a transferência resultar em compromisso assumido em acordo de cooperação internacional;
VII - quando a transferência for necessária para a execução de política pública ou atribuição legal do serviço público, sendo dada publicidade nos termos do inciso I do caput do art. 23 desta Lei;
VIII - quando o titular tiver fornecido o seu consentimento específico e em destaque para a transferência, com informação prévia sobre o caráter internacional da operação, distinguindo claramente esta de outras finalidades; ou
IX - quando necessário para atender as hipóteses previstas nos incisos II, V e VI do art. 7º desta Lei."

### Art. 34 — adequação
"Art. 34. O nível de proteção de dados do país estrangeiro ou do organismo internacional mencionado no inciso I do caput do art. 33 desta Lei será avaliado pela autoridade nacional, que levará em consideração:
I - as normas gerais e setoriais da legislação em vigor no país de destino ou no organismo internacional;
II - a natureza dos dados;
III - a observância dos princípios gerais de proteção de dados pessoais e direitos dos titulares previstos nesta Lei;
IV - a adoção de medidas de segurança previstas em regulamento;
V - a existência de garantias judiciais e institucionais para o respeito aos direitos de proteção de dados pessoais; e
VI - outras circunstâncias específicas relativas à transferência."

### Art. 35 — cláusulas-padrão
"Art. 35. A definição do conteúdo de cláusulas-padrão contratuais, bem como a verificação de cláusulas contratuais específicas para uma determinada transferência, normas corporativas globais ou selos, certificados e códigos de conduta, a que se refere o inciso II do caput do art. 33 desta Lei, será realizada pela autoridade nacional.
§ 3º A autoridade nacional poderá designar organismos de certificação para a realização do previsto no caput deste artigo, que permanecerão sob sua fiscalização nos termos definidos em regulamento."

### Art. 36 — alterações
"Art. 36. As alterações nas garantias apresentadas como suficientes de observância dos princípios gerais de proteção e dos direitos do titular referidas no inciso II do art. 33 desta Lei deverão ser comunicadas à autoridade nacional."

## Interpretação operacional
- Na prática corporativa, as vias principais são: inciso I (decisão de adequação da ANPD para o país — ainda inexistente para a maioria dos países na consulta), inciso II (cláusulas-padrão da Resolução 19/2024), inciso VIII (consentimento específico) e inciso IX (execução de contrato, proteção da vida — art. 7º II, V e VI).`,
    metadados: { numero: 'Lei 13.709/2018', artigos_principais: ['33', '34', '35', '36'], vigente: true, confirmacao_texto: 'Extração literal do Planalto em 2026-08-30' },
    tags: ['digital/transferencia-internacional', 'digital/bases-legais'],
    fonte: LGPD,
    urlFonte: URL_LGPD,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'anpd-resolucao-19-2024-transferencia-internacional', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Regulamentação ANPD do inciso II.' },
      { destinoSlug: 'fluxo-transferencia-internacional-selecao-mecanismo', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Roteiro de seleção da via.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'anpd-resolucao-19-2024-transferencia-internacional',
    titulo: 'Resolução CD/ANPD nº 19/2024 — Regulamento de Transferência Internacional de Dados e cláusulas-padrão contratuais (mecanismos confirmados na página oficial gov.br)',
    tipoDocumento: 'LEGISLACAO',
    area: 'digital',
    subarea: 'transferencia-internacional',
    assunto: 'Regulação ANPD da transferência internacional',
    prioridade: 'P1',
    conteudo: `## Confirmação em página OFICIAL da ANPD/gov.br (consulta 2026-08-30)

A página oficial "Transferência Internacional de Dados" da ANPD (gov.br) confirma:

"A Resolução CD/ANPD Nº 19, de 23 de agosto de 2024 (Regulamento de Transferência Internacional de Dados) estabelece procedimentos e regras aplicáveis para a transferência internacional de dados pessoais, em conformidade com as disposições da Lei Geral de Proteção de Dados Pessoais (Lei n. 13.709, de 2018)..."

## Mecanismos regulados (descritos na página oficial)
1. **Decisões de adequação** — decisões da ANPD que reconhecem países/organismos com proteção equivalente; transferências para esses destinos dispensam mecanismos adicionais;
2. **Cláusulas-padrão contratuais** — cláusulas predefinidas pela ANPD (Anexo II do Regulamento), a serem incorporadas SEM MODIFICAÇÕES, em até 12 meses da publicação do Regulamento (Art. 2º, parágrafo único);
3. **Cláusulas-padrão equivalentes** — aprovadas por países estrangeiros/organismos e reconhecidas como equivalentes pela ANPD;
4. **Cláusulas contratuais específicas** — uso excepcional, quando comprovadamente inviável o uso das cláusulas-padrão; exigem APROVAÇÃO PRÉVIA da ANPD;
5. **Normas corporativas globais** — regras internas de grupo, também com aprovação prévia da ANPD;
6. **Peticionamento eletrônico** — pedidos via SEI.

## HONESTIDADE REGISTRADA
- O texto INTEGRAL do Regulamento foi confirmado como disponível no gov.br (listagem oficial das regulamentações ANPD e página temática); o conteúdo dos mecanismos acima foi extraído literalmente da página temática oficial na consulta 2026-08-30. Para citação artigo por artigo do Regulamento em peça, baixar o PDF oficial do gov.br e verificar. Confiabilidade B.`,
    metadados: { numero: 'Resolução CD/ANPD nº 19/2024', data_norma: '2024-08-23', orgao: 'ANPD', artigos_principais: ['Art. 2º parágrafo único (prazo de 12 meses)', 'Anexo II (cláusulas-padrão)'], vigente: true, confirmacao_texto: 'Página oficial gov.br/ANPD consulta 2026-08-30' },
    tags: ['digital/transferencia-internacional', 'digital/anpd'],
    fonte: ANPD_GOV,
    urlFonte: URL_ANPD_TID,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-09-30',
    relacionamentos: [
      { destinoSlug: 'lgpd-arts-33-36-transferencia-internacional', tipo: 'INTERPRETA_DISPOSITIVO', descricao: 'Regulamenta o art. 33 II.' },
      { destinoSlug: 'prazo-adocao-clausulas-padroes-tid', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Prazo de implementação.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'tese-melhor-interesse-crianca-consentimento-pais',
    titulo: 'Tese — Tratamento de dados de crianças sem consentimento parental verificado é irregular: consequências (invalidez da base, direitos do art. 18 e responsabilidade)',
    tipoDocumento: 'TESE',
    area: 'digital',
    subarea: 'criancas-adolescentes',
    assunto: 'Ilícito no tratamento de dados de crianças',
    prioridade: 'P1',
    conteudo: `## Tese operacional (elaboração EJC — conteúdo estrutural próprio)

**Enunciado de trabalho:** o tratamento de dados de CRIANÇA sem consentimento específico e destacado de pelo menos um dos pais/responsável (art. 14 § 1º) — ou sem a única exceção do § 3º (contato único com pais, sem armazenamento) — é tratamento IRREGULAR (art. 44), que: (a) torna a base de dados inválida como fundamento; (b) ativa os direitos do titular (art. 18 — confirmação, acesso, correção, anonimização, bloqueio, eliminação); (c) gera responsabilidade civil do controlador (art. 42, com inversão em favor do titular na prática processual da prova da culpa) e exposição à sanção administrativa (art. 52, ponderando a vulnerabilidade do titular — critério do § 2º).

**Estrutura:**
1. Art. 14 § 1º (literal): consentimento específico e destacado de um dos pais;
2. Art. 14 § 4º (literal): vedação de condicionar uso do jogo/app à coleta excessiva;
3. Art. 14 § 5º (literal): dever de VERIFICAR a origem do consentimento;
4. Art. 44 (tratamento irregular): nulidade dos atos + ensejo de responsabilidade;
5. Art. 52 § 2º IV (criteriologia): o grau de vulnerabilidade do titular agrava a sanção.

**Riscos:** exceção do § 3º é ESTREITA (contato único, sem armazenamento, sem repasse) — não legitima criação de perfil de criança; provas: prints do fluxo de cadastro, política de privacidade e logs (papel do operador).`,
    metadados: { fonte_do_fundamento: 'LGPD arts. 14, 18, 42, 44 e 52 (textos literais no lote e no LOTE-008)', probabilidade_qualitativa: 'Alta em fluxos sem verificação parental documentada; média quanto ao quantum indenizatório', vigente: true },
    tags: ['digital/criancas-adolescentes', 'digital/bases-legais'],
    fonte: EJC,
    urlFonte: null,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'lgpd-art-14-criancas-adolescentes-melhor-interesse', tipo: 'INTERPRETA_DISPOSITIVO', descricao: 'Base literal da tese.' },
      { destinoSlug: 'lgpd-art-42-responsabilidade-civil-texto-literal', tipo: 'FUNDAMENTA_EM', descricao: 'Responsabilidade civil.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'tese-dados-sensiveis-vedacao-vantagem-economica',
    titulo: 'Tese — Uso compartilhado de dados de saúde para vantagem econômica fora das hipóteses legais é vedado (LGPD art. 11 §§ 4º-5º): estrutura de defesa do titular',
    tipoDocumento: 'TESE',
    area: 'digital',
    subarea: 'dados-sensiveis',
    assunto: 'Dados de saúde e interesses comerciais',
    prioridade: 'P1',
    conteudo: `## Tese operacional (elaboração EJC — conteúdo estrutural próprio)

**Enunciado de trabalho:** a comunicação ou o uso compartilhado entre controladores de dados pessoais sensíveis referentes à SAÚDE com objetivo de obter VANTAGEM ECONÔMICA é vedado (art. 11 § 4º), admitidas apenas as hipóteses de prestação de serviços de saúde/assistência farmacêutica/assistência à saúde (com portabilidade ou transações decorrentes) — e é PROIBIDO o uso de dados de saúde por operadoras de planos para seleção de riscos na contratação ou exclusão de beneficiários (§ 5º).

**Estrutura para o titular:**
1. Demonstrar o tratamento/compartilhamento (art. 18 I-VI — pedir informação sobre compartilhamentos);
2. Enquadrar o uso fora das hipóteses do § 4º (ex.: marketing, precificação, segmentação comercial);
3. Requerer bloqueio/eliminação + eliminação dos tratamentos realizados exclusivamente com base irregular (art. 18 § 2º);
4. Responsabilidade civil (art. 42) e notícia de incidente/infração à ANPD (art. 52).

**Contra-argumento esperado:** a exceção da "prestação de serviços de saúde" (incl. serviços auxiliares de diagnose e terapia, em benefício dos titulares) — o EJC deve delimitar o OBJETIVO real do compartilhamento (prova documental dos contratos/comissões).`,
    metadados: { fonte_do_fundamento: 'LGPD art. 11 §§ 4º-5º e art. 18 (textos literais no lote e no LOTE-008)', probabilidade_qualitativa: 'Alta quando o objetivo comercial é documentado; média sem essa prova', vigente: true },
    tags: ['digital/dados-sensiveis'],
    fonte: EJC,
    urlFonte: null,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'lgpd-art-11-dados-sensiveis-hipoteses', tipo: 'INTERPRETA_DISPOSITIVO', descricao: 'Base literal dos §§ 4º-5º.' },
      { destinoSlug: 'peca-requerimento-art18-titular', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Peça para exercer direitos.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'checklist-conformidade-apps-criancas',
    titulo: 'Checklist — Conformidade LGPD para apps/sites/jogos dirigidos a crianças (art. 14 em 10 pontos)',
    tipoDocumento: 'CHECKLIST',
    area: 'digital',
    subarea: 'criancas-adolescentes',
    assunto: 'Auditoria de produto digital infantil',
    prioridade: 'P1',
    conteudo: `# CHECKLIST EJC — Art. 14 LGPD para produtos digitais infantis (base literal)

## Fluxo de cadastro
- [ ] 1. Há consentimento ESPECÍFICO e EM DESTAQUE de pelo menos um dos pais/responsável (§ 1º) — não mesclado em termos gerais?
- [ ] 2. Existe mecanismo de VERIFICAÇÃO da parentalidade (§ 5º) — e-mail de confirmação, fluxo de assinatura, ferramenta disponível?
- [ ] 3. A exceção do § 3º (contato com pais) é usada UMA única vez, SEM armazenamento e SEM repasse a terceiros?

## Transparência
- [ ] 4. A informação sobre tipos de dados coletados, forma de uso e direitos do art. 18 está PÚBLICA (§ 2º)?
- [ ] 5. A linguagem é SIMPLES, CLARA e ACESSÍVEL, com recursos audiovisuais adequados ao entendimento da criança (§ 6º)?

## Minimização
- [ ] 6. A participação em jogos/apps/atividades NÃO é condicionada a fornecer mais dados do que o estritamente necessário (§ 4º)?
- [ ] 7. Perfis comportamentais de crianças identifiáveis evitados (art. 12 § 2º — perfil = dado pessoal)?

## Governança e risco
- [ ] 8. Relatório de impacto (art. 5º XVII; art. 38) registrado para o tratamento de dados de crianças?
- [ ] 9. Incidentes envolvendo crianças têm protocolo reforçado (art. 48 — comunicação ANPD 3 dias úteis, LOTE-008)?
- [ ] 10. Base legal documentada por operação de tratamento (art. 11 ou art. 7º) com trilha de auditoria?`,
    metadados: { base_literal: 'LGPD arts. 12, 14, 18, 38, 48 (literais)', vigente: true },
    tags: ['digital/criancas-adolescentes'],
    fonte: EJC,
    urlFonte: null,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'lgpd-art-14-criancas-adolescentes-melhor-interesse', tipo: 'FUNDAMENTA_EM', descricao: 'Base literal.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'checklist-mapeamento-transferencias-internacionais',
    titulo: 'Checklist — Mapeamento e conformidade de transferências internacionais de dados (arts. 33-36 LGPD + Resolução ANPD 19/2024)',
    tipoDocumento: 'CHECKLIST',
    area: 'digital',
    subarea: 'transferencia-internacional',
    assunto: 'Auditoria de TID',
    prioridade: 'P1',
    conteudo: `# CHECKLIST EJC — Transferências internacionais (base literal + regulamentação ANPD confirmada)

## Inventário
- [ ] 1. Inventário completo de fluxos internacionais (destino, finalidade, categoria de dados, sensível?) — art. 33;
- [ ] 2. Papéis mapeados: quem é exportador/importador (controlador/operador)? Art. 35 § 5º menciona análise de medidas do operador.

## Seleção do mecanismo (por fluxo)
- [ ] 3. País tem DECISÃO DE ADEQUAÇÃO da ANPD? (art. 33 I; Res. 19/2024 — mecanismo 1) → se sim, sem mecanismo adicional;
- [ ] 4. Sem adequação: usar CLÁUSULAS-PADRÃO contratuais ANEXO II SEM MODIFICAÇÕES (art. 33 II b; Res. 19/2024);
- [ ] 5. Casos excepcionais: cláusulas específicas com aprovação PRÉVIA da ANPD (art. 33 II a; Res. 19/2024);
- [ ] 6. Grupo multinacional: normas corporativas globais com aprovação prévia (art. 33 II c);
- [ ] 7. Consentimento específico e destacado do titular com informação prévia do caráter internacional (art. 33 VIII) — reservar a situações residuais.

## Execução e governança
- [ ] 8. Cláusulas incorporadas aos contratos e registradas (data, versão, partes);
- [ ] 9. Alterações nas garantias comunicadas à ANPD (art. 36);
- [ ] 10. Trilha de auditoria: registro de consulta ao regulamento, versionamento e revisão periódica (proximaVerificacaoRecomendada do EJC).`,
    metadados: { base_literal: 'LGPD arts. 33-36 (literais) + Resolução CD/ANPD 19/2024 (mecanismos confirmados na página oficial)', vigente: true },
    tags: ['digital/transferencia-internacional'],
    fonte: EJC,
    urlFonte: null,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'anpd-resolucao-19-2024-transferencia-internacional', tipo: 'FUNDAMENTA_EM', descricao: 'Mecanismos da ANPD.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'fluxo-transferencia-internacional-selecao-mecanismo',
    titulo: 'Fluxo — Seleção do mecanismo de transferência internacional: inventário → adequação → cláusulas-padrão → exceções (com prazos e riscos)',
    tipoDocumento: 'FLUXO',
    area: 'digital',
    subarea: 'transferencia-internacional',
    assunto: 'Roteiro operacional TID',
    prioridade: 'P1',
    conteudo: `# FLUXO EJC — Transferência internacional de dados (arts. 33-36 LGPD + Res. ANPD 19/2024)

## ETAPA 1 — Inventário
- **Evento:** mapear todos os fluxos que envolvem acesso/remessa de dados para fora do Brasil (inclui acesso remoto por fornecedor estrangeiro — leitura da doutrina da ANPD registrada na página oficial).
- **Documento:** planilha de inventário (destino, finalidade, dados, sensível, prazo de retenção).
- **Risco:** fluxo oculto em ferramenta SaaS.

## ETAPA 2 — Teste de adequação
- **Evento:** verificar se o país/organismo tem DECISÃO DE ADEQUAÇÃO da ANPD (art. 33 I).
- **Providência:** consultar a página oficial de TID da ANPD (lista atualizada).
- **SE adequado:** transferência direta permitida (documento a decisão).

## ETAPA 3 — Cláusulas-padrão
- **Evento:** sem adequação, incorporar as cláusulas-padrão do Anexo II da Res. 19/2024 SEM modificações (art. 33 II b).
- **Prazo:** o Regulamento fixou a implementação em até 12 meses da publicação (art. 2º, parágrafo único — confirmado na página oficial).
- **Risco:** alteração das cláusulas = invalidação do mecanismo.

## ETAPA 4 — Exceções
- **Evento:** se as cláusulas-padrão forem comprovadamente inviáveis: cláusulas específicas ou normas corporativas globais com APROVAÇÃO PRÉVIA da ANPD (via SEI).
- **Prazo:** instrução via peticionamento eletrônico (tempo variável — não estimar).
- **Alternativas legais diretas:** consentimento específico (art. 33 VIII), proteção da vida (IV), execução de política pública (VII), art. 7º II/V/VI (IX).

## ETAPA 5 — Governança contínua
- **Evento:** alterações nas garantias comunicadas à ANPD (art. 36); revisão periódica do inventário; registro de data de consulta das fontes oficiais (regra EJC).`,
    metadados: { base_literal: 'LGPD arts. 33-36; Res. CD/ANPD 19/2024 (mecanismos e prazo confirmados na página oficial)', vigente: true },
    tags: ['digital/transferencia-internacional'],
    fonte: EJC,
    urlFonte: null,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'anpd-resolucao-19-2024-transferencia-internacional', tipo: 'FUNDAMENTA_EM', descricao: 'Mecanismos regulados.' },
      { destinoSlug: 'prazo-adocao-clausulas-padroes-tid', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Prazo da etapa 3.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'prazo-adocao-clausulas-padroes-tid',
    titulo: 'Prazo — Implementação das cláusulas-padrão contratuais da Resolução CD/ANPD 19/2024: até 12 meses da publicação do Regulamento (art. 2º, parágrafo único)',
    tipoDocumento: 'PRAZO',
    area: 'digital',
    subarea: 'transferencia-internacional',
    assunto: 'Prazo regulatório ANPD',
    prioridade: 'P1',
    conteudo: `## Prazo: 12 MESES da publicação do Regulamento

- **Fundamento confirmado:** página oficial da ANPD (gov.br) descreve: "A implementação dessas cláusulas deve ser feita sem modificações (Anexo II do Regulamento), em até 12 meses da publicação do Regulamento (Art. 2º, parágrafo único)".
- **Publicação do Regulamento:** Resolução CD/ANPD nº 19, de 23/08/2024 (confirmada na página oficial e no DSpace do MJ).
- **Status na consulta (2026-08-30):** prazo regulatório já esgotado — contratos internacionais pendentes de adequação configuram risco imediato de tratamento irregular.
- **Atenção:** a verificação da data exata de vigência deve ser feita no texto oficial da Resolução antes de citar o prazo em peça (regra EJC).`,
    metadados: { quantidade: '12 meses da publicação', termo_inicial: 'publicação da Resolução CD/ANPD 19/2024 (23/08/2024)', base_literal: 'Res. CD/ANPD 19/2024, art. 2º parágrafo único (confirmado na página oficial ANPD)', vigente: true, pendencia: 'Verificar vigência exata no texto oficial antes de citar em peça' },
    tags: ['digital/transferencia-internacional', 'geral/prazos'],
    fonte: ANPD_GOV,
    urlFonte: URL_ANPD_TID,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-09-30',
    relacionamentos: [
      { destinoSlug: 'anpd-resolucao-19-2024-transferencia-internacional', tipo: 'FUNDAMENTA_EM', descricao: 'Fonte do prazo.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'triagem-dados-sensiveis-crianca-tid',
    titulo: 'Triagem — Script de perguntas LGPD avançada: dados sensíveis, crianças e transferências internacionais',
    tipoDocumento: 'TRIAGEM',
    area: 'digital',
    subarea: 'dados-sensiveis',
    assunto: 'Triagem de casos complexos',
    prioridade: 'P1',
    conteudo: `# TRIAGEM EJC — Casos LGPD complexos

## Bloco 1 — Dados sensíveis
1. Quais categorias de dados envolvidas? (origem racial/étnica, convicção religiosa, opinião política, saúde, vida sexual, genético/biometria — conceito do art. 5º II)
2. Qual a BASE de tratamento alegada? (art. 11 — consentimento específico e destacado OU uma das 7 dispensas)
3. Há compartilhamento entre controladores? Qual o objetivo declarado? (vedação de vantagem econômica em saúde — § 4º)

## Bloco 2 — Crianças/adolescentes
4. O titular é menor de idade? Como o controlador verifica a idade?
5. Há consentimento de um dos pais/responsável específico e destacado? Como foi verificado? (art. 14 §§ 1º e 5º)
6. O uso do serviço é condicionado a fornecimento de dados além do necessário? (art. 14 § 4º)

## Bloco 3 — Transferência internacional
7. Alguma empresa/fornecedor/infraestrutura fora do Brasil acessa os dados (inclusive acesso remoto)?
8. Qual mecanismo alegado? (adequação, cláusulas-padrão, específicas, normas globais, consentimento — art. 33)
9. Há documentação das cláusulas-padrão sem modificações? (Res. 19/2024)

## Bloco 4 — Remédios
10. Quais direitos do art. 18 foram exercidos e em que data? (resposta em 15 dias — art. 19 II)
11. Há indícios de incidente com esses dados? (art. 48 — 3 dias úteis ANPD)

## Saída
- Tratamento irregular provável? → rights + peca + ANPD + civil (art. 42);
- Apenas descumprimento formal? → requerimento de ajuste + compliance.`,
    metadados: { base_literal: 'LGPD arts. 5º, 11, 14, 18-19, 33, 42, 48 (literais)', vigente: true },
    tags: ['digital/dados-sensiveis', 'digital/criancas-adolescentes', 'digital/transferencia-internacional'],
    fonte: EJC,
    urlFonte: null,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'triagem-demandas-dados-pessoais', tipo: 'COMPLEMENTA', descricao: 'Triagem básica LGPD do LOTE-008.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'tabela-mecanismos-tid-comparativo',
    titulo: 'Tabela — Comparativo dos mecanismos de transferência internacional (art. 33 LGPD x Resolução ANPD 19/2024): exigências, aprovação e uso típico',
    tipoDocumento: 'TABELA_DOCUMENTOS',
    area: 'digital',
    subarea: 'transferencia-internacional',
    assunto: 'Comparativo de mecanismos',
    prioridade: 'P1',
    conteudo: `# TABELA EJC — Mecanismos de transferência internacional

| Mecanismo | Base legal (literal) | Aprovação ANPD | Uso típico | Risco principal |
|---|---|---|---|---|
| Decisão de adequação (país) | art. 33 I; art. 34 | Emitida pela ANPD (critérios do art. 34) | Países reconhecidos como adequados | Lista ainda limitada — verificar página oficial |
| Cláusulas-padrão contratuais | art. 33 II b; Res. 19/2024 Anexo II | Pré-aprovadas (usar SEM modificações) | Contratos com fornecedor estrangeiro | Alteração das cláusulas invalida o mecanismo |
| Cláusulas-padrão equivalentes | Res. 19/2024 | Reconhecimento ANPD de equivalência | Empresas já usando cláusulas estrangeiras | Condicionantes da ANPD |
| Cláusulas contratuais específicas | art. 33 II a; Res. 19/2024 | APROVAÇÃO PRÉVIA exigida | Operações atípicas/complexas | Demora no peticionamento SEI |
| Normas corporativas globais | art. 33 II c; Res. 19/2024 | APROVAÇÃO PRÉVIA exigida | Grupos multinacionais | Manutenção das garantias (art. 36) |
| Selos/certificados/códigos de conduta | art. 33 II d; art. 35 § 3º | Emissão por organismo designado | Ecossistemas setoriais | Fiscalização pelo organismo |
| Consentimento específico e destacado | art. 33 VIII | Não requer | Residual (após esgotar outras vias) | Carga probatória da liberdade do consentimento |
| Remissões a bases do art. 7º (II, V, VI) | art. 33 IX | Não requer | Execução de contrato/proteção da vida/exercício regular | Interpretação estrita das bases |

## Como usar
1. Classificar o fluxo no inventário; 2. Aplicar a coluna "Aprovação"; 3. Registrar a URL e data da consulta à fonte oficial (regra EJC).`,
    metadados: { base_literal: 'LGPD arts. 33-35; Res. CD/ANPD 19/2024 (mecanismos confirmados na página oficial)', vigente: true },
    tags: ['digital/transferencia-internacional'],
    fonte: EJC,
    urlFonte: null,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'fluxo-transferencia-internacional-selecao-mecanismo', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Uso no fluxo de seleção.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'argumentacao-tid-fornecedor-estrangeiro-bilateral',
    titulo: 'Argumentação — Transferência internacional para fornecedor estrangeiro sem cláusulas-padrão: tese do titular x defesa do controlador (bilateral)',
    tipoDocumento: 'ARGUMENTACAO',
    area: 'digital',
    subarea: 'transferencia-internacional',
    assunto: 'Controvérsia de TID irregular',
    prioridade: 'P1',
    conteudo: `# ARGUMENTAÇÃO EJC — TID sem mecanismo (bilateral)

## Lado A — Titular (irregularidade)
1. O art. 33 é TAXATIVO: transferência somente nas hipóteses listadas (caput: "somente é permitida");
2. Fornecedor estrangeiro com acesso remoto = transferência internacional; sem cláusulas-padrão incorporadas (Res. 19/2024) e sem adequação/autorização, o tratamento é IRREGULAR (art. 44) com base inválida;
3. Remédios: bloqueio/eliminação (art. 18), indenização (art. 42), sanção (art. 52 — dosimetria Res. 4/2023, LOTE-008).

## Lado B — Controlador (regularidade/justificativa)
1. O acesso remoto eventual pode não configurar "transferência" na acepção regulatória — ANPD/Regulamento têm definição própria que deve ser conferida no texto oficial antes de sustentar;
2. Bases do art. 33 IX (execução de contrato — art. 7º V) podem amparar a operação SEM instrumento adicional, na medida estrita;
3. O consentimento específico (art. 33 VIII) foi obtido de forma destacada, com distinção clara da finalidade internacional;
4. Medidas do operador (art. 35 § 5º; art. 46) demonstram segurança equivalente — mitigação do dano.

## Síntese operacional
- O desfecho depende de: (a) definição regulatória de "transferência" no texto oficial da Res. 19/2024; (b) prova do mecanismo adotado (contratos com anexos); (c) base do art. 33 IX invocada de forma estrita. Recomendação EJC: antes de peticionar, capturar o texto oficial do Regulamento no gov.br.`,
    metadados: { fonte_do_fundamento: 'LGPD arts. 33, 35 § 5º, 42, 44, 46 e 52; Res. CD/ANPD 19/2024 (mecanismos confirmados na página oficial)', vigente: true },
    tags: ['digital/transferencia-internacional', 'digital/dados-sensiveis'],
    fonte: EJC,
    urlFonte: null,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'lgpd-arts-33-36-transferencia-internacional', tipo: 'FUNDAMENTA_EM', descricao: 'Base literal do art. 33.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'doutrina-anonimizacao-pseudonimizacao',
    titulo: 'Doutrina — Anonimização x pseudonimização x criptografia: conceitos operacionais da LGPD (arts. 12-13)',
    tipoDocumento: 'DOUTRINA',
    area: 'digital',
    subarea: 'dados-sensiveis',
    assunto: 'Conceitos técnicos-jurídicos',
    prioridade: 'P1',
    conteudo: `# DOUTRINA EJC — Conceitos de desidentificação (elaboração própria com base literal)

## 1. Anonimização (art. 12)
Tratamento que torna o dado NÃO pessoal — só vale se a reversão for impossível por meios exclusivamente próprios do controlador e sem esforço razoável (custo/tempo/tecnologias). Anonimização mal feita = dado pessoal disfarçado.

## 2. Pseudonimização (art. 13 § 4º — definição literal)
"o tratamento por meio do qual um dado perde a possibilidade de associação, direta ou indireta, a um indivíduo, senão pelo uso de informação adicional mantida separadamente pelo controlador em ambiente controlado e seguro." O dado pseudonimizado CONTINUA sendo pessoal (a chave existe).

## 3. Criptografia (art. 5º XVI — LOTE-001)
Medida de SEGURANÇA (proteção da confidencialidade), NÃO de desidentificação: dado criptografado continua dado pessoal se o controlador detém a chave.

## 4. Perfil comportamental (art. 12 § 2º)
Dados usados para formação de perfil de pessoa identificável = dados pessoais — "análise agregada" que remonta a indivíduo identificado não escapa da LGPD.

## Consequências práticas
- Argumento comum "os dados são anônimos" exige PROVA técnica (metodologia, k-anonimato etc.);
- A ANPD pode dispor sobre padrões e técnicas (art. 12 § 3º) — verificar regulamentos vigentes antes de auditar.`,
    metadados: { base_literal: 'LGPD arts. 12, 13 § 4º e 5º XVI (literais no lote e LOTE-001)', vigente: true },
    tags: ['digital/dados-sensiveis'],
    fonte: EJC,
    urlFonte: null,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'lgpd-art-12-anonimizacao-limites', tipo: 'INTERPRETA_DISPOSITIVO', descricao: 'Base literal.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'doutrina-melhor-interesse-crianca-lgpd',
    titulo: 'Doutrina — O padrão do "melhor interesse" da criança na LGPD e sua interação com o ECA (conceitos operacionais)',
    tipoDocumento: 'DOUTRINA',
    area: 'digital',
    subarea: 'criancas-adolescentes',
    assunto: 'Padrão do melhor interesse',
    prioridade: 'P1',
    conteudo: `# DOUTRINA EJC — Melhor interesse da criança (elaboração própria com base literal)

## 1. Origem e conteúdo
O art. 14 caput remete ao "melhor interesse, nos termos deste artigo e da legislação pertinente" — standard aberto que importa o princípio do art. 227 da CF/88 e o art. 3º do ECA: a proteção integral e prioridade absoluta. Na LGPD, o standard se CONCRETLIZA nos §§ 1º-6º (consentimento parental, transparência pública, vedação de condicionamento, verificação, linguagem adaptada).

## 2. Criança x adolescente
O art. 14 §§ 1º-6º disciplina expressamente o tratamento de dados de CRIANÇAS (consentimento dos pais). O TÍTULO do artigo menciona "crianças e de adolescentes" — para adolescentes, a doutrina discute a aplicação do standard de melhor interesse com autonomia progressiva; o EJC registra a distinção sem decidir controvérsia não pacificada.

## 3. Efeitos práticos
- Configuração padrão "privacy by design" para o público infantil (mínimo de coleta);
- Publicidade dirigida e perfis comportamentais de crianças = risco máximo (art. 12 § 2º + vulnerabilidade no art. 52 § 2º);
- Em litígio, o ônus prático do controlador é documentar verificação parental e fluxo de minimização.`,
    metadados: { base_literal: 'LGPD art. 14 (literal no lote); referências normativas CF art. 227 e ECA art. 3º (conceito consolidado — verificar textos oficiais ao citar integralmente)', vigente: true },
    tags: ['digital/criancas-adolescentes'],
    fonte: EJC,
    urlFonte: null,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'lgpd-art-14-criancas-adolescentes-melhor-interesse', tipo: 'INTERPRETA_DISPOSITIVO', descricao: 'Base literal do art. 14.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'regra-se-dados-sensiveis-baseregular',
    titulo: 'Regra SE-ENTÃO — Validação de base legal para dados sensíveis e remédios quando irregular',
    tipoDocumento: 'REGRA_INTELIGENCIA',
    area: 'digital',
    subarea: 'dados-sensiveis',
    assunto: 'Roteiro automático art. 11',
    prioridade: 'P1',
    conteudo: `# REGRAS SE-ENTÃO — Dados sensíveis (elaboração EJC)

## SE dado é sensível E não há consentimento específico e destacado E nenhuma das 7 dispensas do art. 11 II se aplica ENTÃO
- ENTÃO tratamento IRREGULAR (art. 44): exigir bloqueio/eliminação (art. 18), documentar e avaliar ANPD + civil (art. 42).

## SE consentimento para dado sensível consta de termos genéricos de uso ENTÃO
- ENTÃO consentimento INVÁLIDO (art. 11 I exige "específica e destacada, para finalidades específicas").

## SE dado de saúde compartilhado ENTÃO
- SE objetivo é vantagem econômica E não se encaixa nas exceções do art. 11 § 4º ENTÃO vedação absoluta;
- SE operadora de plano usa o dado para seleção de riscos ENTÃO vedação do art. 11 § 5º.

## SE dado de criança ENTÃO
- SE sem consentimento parental específico verificado E fora da exceção única do art. 14 § 3º ENTÃO irregular + prioritário (vulnerabilidade — art. 52 § 2º).

## SE transferência internacional de dado ENTÃO
- SE país sem adequação E sem cláusulas-padrão/autorização/consentimento específico ENTÃO irregular (art. 33 caput — "somente é permitida").`,
    metadados: { base_literal: 'LGPD arts. 11, 14, 18, 33, 42, 44 e 52 (literais)', vigente: true },
    tags: ['digital/dados-sensiveis', 'digital/criancas-adolescentes', 'digital/transferencia-internacional'],
    fonte: EJC,
    urlFonte: null,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'lgpd-art-11-dados-sensiveis-hipoteses', tipo: 'FUNDAMENTA_EM', descricao: 'Fonte literal.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'regra-se-crianca-consentimento-verificado',
    titulo: 'Regra SE-ENTÃO — Criança: verificação de consentimento parental e exceções permitidas (art. 14)',
    tipoDocumento: 'REGRA_INTELIGENCIA',
    area: 'digital',
    subarea: 'criancas-adolescentes',
    assunto: 'Roteiro automático art. 14',
    prioridade: 'P1',
    conteudo: `# REGRAS SE-ENTÃO — Crianças (elaboração EJC)

## SE produto digital dirigido a crianças ENTÃO
- (a) SE consentimento específico e destacado de um dos pais com verificação razoável (§§ 1º e 5º) ENTÃO base válida;
- (b) SENÃO SE coleta apenas para CONTATAR os pais, uma única vez, SEM armazenamento E SEM repasse (§ 3º) ENTÃO base excepcional válida;
- (c) SENÃO ENTÃO tratamento irregular.

## SE uso do jogo/app condicionado a fornecer dados além do estritamente necessário ENTÃO
- ENTÃO violação direta do art. 14 § 4º (vedação de condicionamento).

## SE informação sobre tratamento não está pública e acessível ENTÃO
- ENTÃO violação do art. 14 §§ 2º e 6º (transparência e linguagem adequada).

## SE incidente envolver dados de crianças ENTÃO
- ENTÃO comunicar ANPD em 3 dias úteis (art. 48 — LOTE-008) com prioridade reforçada pela vulnerabilidade (critério do art. 52 § 2º).`,
    metadados: { base_literal: 'LGPD arts. 14, 48 e 52 (literais no lote e LOTE-008)', vigente: true },
    tags: ['digital/criancas-adolescentes'],
    fonte: EJC,
    urlFonte: null,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'lgpd-art-14-criancas-adolescentes-melhor-interesse', tipo: 'FUNDAMENTA_EM', descricao: 'Fonte literal.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'jurimetria-lgpd-sensiveis-tid-esquema',
    titulo: 'Jurimetria — Estrutura de coleta para casos de dados sensíveis e transferência internacional (esquema vazio, NUNCA números inventados)',
    tipoDocumento: 'JURIMETRIA',
    area: 'digital',
    subarea: 'dados-sensiveis',
    assunto: 'Coleta de métricas LGPD avançada',
    prioridade: 'P2',
    conteudo: `# JURIMETRIA EJC — Dados sensíveis/TID (ESQUEMA PARA PREENCHER COM DADOS REAIS)

## ⚠️ Regra da casa (item 24): números JAMAIS inventados. Preencher com decisões/atos reais com URL e data.

## Campos por caso
- tipo de sensibilidade (saúde, biometria, genético...);
- base legal alegada (art. 11 I/II);
- titular criança? verificação parental documentada?
- transferência internacional? mecanismo usado?
- resposta ao pedido do art. 18 (prazo cumprido? 15 dias — art. 19 II);
- desfecho administrativo (ANPD) ou judicial;
- URL da decisão/ato e data de consulta.

## Indicadores a calcular (quando houver amostra)
1. proporção de tratamentos de sensíveis sem base documentada;
2. tempo médio de resposta aos titulares;
3. padrões de dosimetria aplicados pela ANPD em casos de sensíveis (art. 52 + Res. 4/2023 — LOTE-008);
4. litigiosidade por mecanismo de TID.`,
    metadados: { esquema_vazio: true, dadosFicticios: true, status: 'DEMONSTRACAO', instrucao: 'Preencher somente com dados reais verificados' },
    tags: ['digital/dados-sensiveis', 'digital/transferencia-internacional'],
    fonte: EJC,
    urlFonte: null,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'DEMONSTRACAO',
    dadosFicticios: true,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: null,
    relacionamentos: [],
  } satisfies InputDocument,
];

export const FONTES_LOTE13 = [
  'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm (LGPD — textos literais arts. 11, 12, 13, 14, 33, 34, 35, 36 — consulta 2026-08-30)',
  'https://www.gov.br/anpd/pt-br/assuntos/assuntos-internacionais/transferencia-internacional-de-dados (ANPD — página oficial gov.br: Resolução CD/ANPD nº 19/2024, mecanismos regulados e prazo de implementação das cláusulas-padrão — consulta 2026-08-30)',
  'https://www.gov.br/anpd/pt-br/acesso-a-informacao/institucional/atos-normativos/regulamentacoes_anpd (ANPD — listagem oficial de regulamentações: Resolução 19/2024, 23/08/2024 — consulta 2026-08-30)',
];
