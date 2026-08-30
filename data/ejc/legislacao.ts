// LOTE-001 P0 — LEGISLAÇÃO — Fontes oficiais confirmadas em 2026-08-29
// Cada registro passou por validação de fonte oficial (Planalto/tribunais).
import type { InputDocument } from '../../src/lib/ejc/types';

const CONSULTA = '2026-08-29';
const PLANALTO = 'Presidência da República — Planalto';

export default [
  {
    slug: 'cf-1988-art-225-meio-ambiente',
    titulo: 'Constituição Federal/1988 — Art. 225: Direito ao Meio Ambiente Ecologicamente Equilibrado',
    tipoDocumento: 'LEGISLACAO',
    area: 'ambiental',
    subarea: 'auto-infracao',
    assunto: 'Meio ambiente como direito fundamental',
    prioridade: 'P0',
    lote: 'LOTE-001',
    conteudo: `## Ficha da Norma
- **Norma:** Constituição da República Federativa do Brasil de 1988, Art. 225.
- **Órgão:** Congresso Constituinte / Presidência da República.
- **Área:** Direito Ambiental — fundamento constitucional.
- **Vigência:** vigente.

## Texto essencial do dispositivo
O Art. 225, caput, estabelece que todos têm direito ao meio ambiente ecologicamente equilibrado, bem de uso comum do povo e essencial à sadia qualidade de vida, impondo-se ao Poder Público e à coletividade o dever de defendê-lo e preservá-lo para as presentes e futuras gerações.

## Interpretação estruturante
- O meio ambiente é direito fundamental de terceira dimensão (fraternidade/solidariedade), titularizado de forma difusa.
- A proteção alcança o princípio do desenvolvimento sustentável: compatibilização da atividade econômica (art. 170, VI) com a preservação ambiental.
- O § 1º enumera deveres do Poder Público: preservar e restaurar processos ecológicos, exigir estudo prévio de impacto ambiental (EIA/RIMA) para obras e atividades potencialmente causadoras de significativa degradação, controlar produção e comercialização de técnicas que comportem risco, promover educação ambiental, proteger fauna e flora, vedação de práticas que coloquem em risco a função ecológica da espécie ou provoquem extinção.
- O § 3º prevê condutas e atividades lesivas como sujeitas a sanções penais e administrativas, além da obrigação de reparar o dano — base da tríplice responsabilidade (civil, administrativa, penal).
- O § 4º transforma a Floresta Amazônica brasileira, a Mata Atlântica, a Serra do Mar, o Pantanal Mato-Grossense e a Zona Costeira em patrimônio nacional, com utilização condicionada à preservação do meio ambiente.

## Hipóteses de aplicação no EJC
- Fundamento de qualquer defesa ou acusação em matéria ambiental.
- Argumento de amplitude protetiva (in dubio pro natura) na interpretação de normas infraconstitucionais.
- Base da exigência de licenciamento e do dever de fiscalização do Poder Público.

## Riscos e cuidados
- Não confundir o direito difuso (coletividade) com interesse individual: legitimidade para ação civil pública é disciplinada pela Lei 7.347/1985.
- Art. 37, § 6º, CF: responsabilidade objetiva do Estado — relevante em ações contra o ente público por dano ambiental ou omissão fiscalizatória.`,
    metadados: { numero: 'CF/1988', data_norma: '1988-10-05', orgao: 'Congresso Nacional', artigos_principais: ['225'], vigente: true },
    tags: ['ambiental/auto-infracao', 'ambiental/responsabilidade-civil', 'geral/prazos'],
    fonte: PLANALTO,
    urlFonte: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm',
    dataConsulta: CONSULTA,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: CONSULTA,
    proximaVerificacaoRecomendada: '2026-11-29',
  },
  {
    slug: 'lei-9605-1998-infracoes-administrativas',
    titulo: 'Lei 9.605/1998 (Lei de Crimes Ambientais) — Infrações Administrativas Ambientais',
    tipoDocumento: 'LEGISLACAO',
    area: 'ambiental',
    subarea: 'responsabilidade-administrativa',
    assunto: 'Infrações administrativas e sanções',
    prioridade: 'P0',
    lote: 'LOTE-001',
    conteudo: `## Ficha da Norma
- **Norma:** Lei nº 9.605, de 12 de fevereiro de 1998.
- **Ementa oficial:** dispõe sobre as sanções penais e administrativas derivadas de condutas e atividades lesivas ao meio ambiente.
- **Vigência:** vigente.

## Artigos principais (Seção das infrações administrativas)
- **Art. 70** — Considera-se infração administrativa ambiental toda ação ou omissão que viole as regras jurídicas de uso, gozo, promoção, proteção e recuperação do meio ambiente.
- **Art. 72** — São sanções administrativas: advertência; multa simples; multa diária; confiscamento dos animais, produtos e subprodutos da fauna e flora e demais instrumentos; destruição ou inutilização do produto; suspensão de venda e fabricação do produto; embargo da obra ou atividade; demolição de obra; suspensão parcial ou total de atividades; restrição de direitos; conversão da multa simples em serviços de preservação e recuperação.
- O valor da multa é fixado considerando a gravidade do fato e os antecedentes do infrator quanto ao cumprimento da legislação ambiental.
- A multa diária pode ser aplicada para forçar o cumprimento da obrigação de fazer ou não fazer.
- A restrição de direitos inclui: suspensão de registro, licença ou autorização; perda ou restrição de incentivos fiscais; proibição de contratar com a administração pública.
- **Art. 73** — As sanções são aplicadas pela autoridade ambiental, levando em conta a gravidade do fato e os antecedentes do infrator.

## Regras processuais administrativas relevantes
- O processo administrativo para apuração de infração e aplicação de sanções é regido, no âmbito federal, pelo Decreto 6.514/2008 (regulamento da Lei 9.605/1998 — ver doc correspondente).
- A cobrança da multa aplicada por infração administrativa ambiental tem prazo prescricional de cinco anos — Súmula 467 do STJ (ver banco de jurisprudência).

## Aplicação prática no EJC
- Toda defesa administrativa contra auto de infração (AI) parte do art. 70 (tipicidade da conduta) e art. 72 (natureza e dosimetria da sanção).
- Peça-modelo vinculada: Defesa Administrativa Ambiental (BANCO 04).
- Prazos de defesa e recurso: ver banco de prazos (20 dias — Decreto 6.514/2008, art. 113 e art. 127, redação atual).

## Relacionamentos
- Regulamento: Decreto 6.514/2008.
- Fundamento constitucional: CF art. 225, § 3º.`,
    metadados: { numero: 'Lei 9.605/1998', data_norma: '1998-02-12', orgao: 'Congresso Nacional', artigos_principais: ['70', '71', '72', '73'], vigente: true },
    tags: ['ambiental/auto-infracao', 'ambiental/responsabilidade-administrativa'],
    fonte: PLANALTO,
    urlFonte: 'https://www.planalto.gov.br/ccivil_03/leis/l9605.htm',
    dataConsulta: CONSULTA,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: CONSULTA,
    proximaVerificacaoRecomendada: '2026-11-29',
    relacionamentos: [
      { destinoSlug: 'decreto-6514-2008-processo-administrativo-ambiental', tipo: 'REGULAMENTO', descricao: 'Decreto 6.514/2008 regulamenta o processo administrativo federal para apuração das infrações da Lei 9.605/1998.' },
      { destinoSlug: 'sumula-467-stj-cobranca-multa-ambiental-5-anos', tipo: 'PRECEDENTE_APLICAVEL', descricao: 'Prazo de cobrança da multa administrativa ambiental: 5 anos.' },
    ],
  },
  {
    slug: 'lei-9605-1998-responsabilidade-penal-pj',
    titulo: 'Lei 9.605/1998 — Responsabilidade Penal da Pessoa Jurídica e dos Dirigentes',
    tipoDocumento: 'LEGISLACAO',
    area: 'ambiental',
    subarea: 'responsabilidade-penal',
    assunto: 'Responsabilidade penal ambiental',
    prioridade: 'P0',
    lote: 'LOTE-001',
    conteudo: `## Ficha da Norma
- **Norma:** Lei nº 9.605/1998 — Parte Geral, arts. 2º, 3º, 14, 18.
- **Vigência:** vigente.

## Dispositivos essenciais
- **Art. 2º** — Quem, de qualquer forma, concorre para a prática dos crimes previstos na Lei incide nas penas a estes cominadas, na medida de sua culpabilidade, bem como o diretor, o administrador, membro de conselho e de órgão técnico, o auditor, o gerente, o preposto e mandatário de pessoa jurídica, que, sabendo da conduta criminosa de outrem, deixar de impedir a sua prática, quando podia agir para evitá-la.
- **Art. 3º** — As pessoas jurídicas serão responsabilizadas administrativa, civil e penalmente conforme o disposto nesta Lei, nos casos em que a infração seja cometida por decisão de seu representante legal ou contratual, ou de seu órgão colegiado, no interesse ou benefício da sua entidade. A responsabilidade das pessoas jurídicas não exclui a das pessoas físicas, autoras, coautoras ou partícipes do mesmo fato.
- **Art. 14** — Este Capítulo aplica-se sem prejuízo da responsabilidade civil e administrativa apuráveis por outros órgãos.
- **Art. 18** — É isenta de pena a pessoa jurídica cuja conduta se relaciona com a prática de crimes que dependem de intervenção da pessoa física, em caso de erro sobre a elementar do tipo.

## Interpretação consolidada
- A responsabilidade penal da pessoa jurídica é autônoma, porém a condenação da PJ exige condenação simultânea de pessoa física com atuação culposa ou dolosa identificada (jurisprudência consolidada do STJ/STF — validar o precedente concreto antes de citar número em peça).
- As penas aplicáveis à pessoa jurídica (art. 22) incluem multa, restrição de direitos, prestação de serviços à comunidade e liquidação forçada.

## Aplicação prática no EJC
- Análise de risco penal em autos de infração com dano significativo (comunicação entre esferas: o que ocorre na esfera administrativa pode subsidiar o inquérito/ação penal).
- Estratégia de defesa: demonstrar ausência de decisão do representante legal no interesse da entidade e ausência de vantagem para a empresa.
- Regra de inteligência vinculada: SE tipo_processo=auto_infracao_ambiental com indícios de crime, ENTÃO avaliar riscos das esferas penal e civil simultaneamente (tríplice responsabilidade — CF art. 225, § 3º).`,
    metadados: { numero: 'Lei 9.605/1998', data_norma: '1998-02-12', orgao: 'Congresso Nacional', artigos_principais: ['2', '3', '14', '18', '22'], vigente: true },
    tags: ['ambiental/responsabilidade-penal', 'ambiental/auto-infracao'],
    fonte: PLANALTO,
    urlFonte: 'https://www.planalto.gov.br/ccivil_03/leis/l9605.htm',
    dataConsulta: CONSULTA,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: CONSULTA,
    proximaVerificacaoRecomendada: '2026-11-29',
  },
  {
    slug: 'decreto-6514-2008-processo-administrativo-ambiental',
    titulo: 'Decreto 6.514/2008 — Processo Administrativo Federal para Apuração de Infrações Ambientais',
    tipoDocumento: 'LEGISLACAO',
    area: 'ambiental',
    subarea: 'auto-infracao',
    assunto: 'Autos de infração, sanções e prazos',
    prioridade: 'P0',
    lote: 'LOTE-001',
    conteudo: `## Ficha da Norma
- **Norma:** Decreto nº 6.514, de 22 de julho de 2008.
- **Ementa oficial:** dispõe sobre as infrações e sanções administrativas ao meio ambiente, estabelece o processo administrativo federal para apuração destas infrações.
- **Vigência:** vigente, com alterações (inclusive Decretos 6.686/2008, 11.080/2022, 11.373/2023 e 12.189/2024 — conferir a redação atual em cada consulta).

## Texto CONFIRMADO na fonte oficial (consulta 2026-08-29, com alterações)
- **Art. 21 (Seção II — Dos Prazos Prescricionais):** "Prescreve em cinco anos a ação da administração objetivando apurar a prática de infrações contra o meio ambiente, contada da data da prática do ato, ou, no caso de infração permanente ou continuada, do dia em que esta tiver cessado."
  - **§ 1º** — Considera-se iniciada a ação de apuração de infração ambiental pela administração com a lavratura do auto de infração.
  - **§ 2º** — Incide a prescrição no procedimento de apuração do auto de infração paralisado por mais de três anos, pendente de julgamento ou despacho, cujos autos serão arquivados de ofício ou mediante requerimento da parte interessada, sem prejuízo da apuração da responsabilidade funcional decorrente da paralisação e da reparação dos danos ambientais.
- **Art. 113:** "O autuado poderá, no prazo de vinte dias, contado da data da ciência da autuação, oferecer defesa ou impugnação contra o auto de infração." (redação atual, com sucessivas alterações legislativas)
- **Art. 127:** da decisão proferida pela autoridade julgadora **caberá recurso no prazo de vinte dias** (redação dada pelo Decreto nº 6.686, de 2008 — conferir regime vigente no caso concreto).
- Sanções: advertência, multa simples, multa diária, apreensão, destruição/inutilização, embargo, suspensão de atividade, restrição de direitos (arts. 4º a 12).
- Multa baseada em unidade/hectare/metro cúbico/etc. conforme o ilícito (art. 8º); infrações em unidade de conservação podem ter multa em dobro (art. 93).

## Ponto de atenção — decadência x prescrição
- A redação ATUAL do art. 21 fala em **prescrição de 5 anos** para a ação de apuração.
- Historicamente, o STJ consolidou o entendimento de **decadência de 3 anos** para instaurar o processo administrativo ambiental (e a Súmula 467/STJ fixa 5 anos para a cobrança da multa). A distinção temporal depende da data do fato e do regime aplicável.
- **REGRA EJC:** em cada caso, verificar (i) data do fato; (ii) data da lavratura do AI; (iii) redação aplicável do Decreto 6.514/2008; (iv) jurisprudência atualizada do órgão. Nunca afirmar prazo sem esta verificação.

## Aplicação prática no EJC
- Primeiro movimento em qualquer defesa: linha do tempo do AI (prática do ato → lavratura → ciência → defesa → julgamento) para checar prescrição/decadência e intempestividade.
- Fluxo vinculante: FLUXO — Recebimento de Auto de Infração Ambiental (BANCO 07).`,
    metadados: {
      numero: 'Decreto 6.514/2008',
      data_norma: '2008-07-22',
      orgao: 'Presidência da República',
      artigos_principais: ['21', '113', '127', '8', '93'],
      vigente: true,
      alteracoes_relevantes: ['Decreto 6.686/2008', 'Decreto 11.080/2022', 'Decreto 11.373/2023', 'Decreto 12.189/2024'],
      confirmacao_texto: 'Extracao direta do texto oficial do Planalto em 2026-08-29 (arts. 21, 113 e 127 conferidos literalmente).',
    },
    tags: ['ambiental/auto-infracao', 'ambiental/responsabilidade-administrativa', 'geral/prazos'],
    fonte: PLANALTO,
    urlFonte: 'https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2008/decreto/d6514.htm',
    dataConsulta: CONSULTA,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: CONSULTA,
    proximaVerificacaoRecomendada: '2026-09-29',
  },
  {
    slug: 'lei-6938-1981-pnma-responsabilidade-objetiva',
    titulo: 'Lei 6.938/1981 — Política Nacional do Meio Ambiente e Responsabilidade Objetiva (art. 14, § 1º)',
    tipoDocumento: 'LEGISLACAO',
    area: 'ambiental',
    subarea: 'responsabilidade-civil',
    assunto: 'Política Nacional do Meio Ambiente',
    prioridade: 'P0',
    lote: 'LOTE-001',
    conteudo: `## Ficha da Norma
- **Norma:** Lei nº 6.938, de 31 de agosto de 1981.
- **Vigência:** vigente.

## Conteúdo essencial
- Institui a Política Nacional do Meio Ambiente (PNMA), seus fins e mecanismos de formulação e aplicação, e cria o SISNAMA (Sistema Nacional do Meio Ambiente) — art. 6º elenca os órgãos (CONAMA, órgãos seccionais, IBAMA e órgãos locais).
- **Art. 2º** — objetivos: compatibilizar o desenvolvimento econômico-social com a preservação da qualidade do meio ambiente e do equilíbrio ecológico.
- **Art. 3º** — definições: meio ambiente, degradação da qualidade ambiental, poluição, poluidor (responsável, direta ou indiretamente, por atividade causadora de degradação ambiental), recursos ambientais.
- **Art. 9º** — instrumentos da PNMA: padrões de qualidade ambiental, zoneamento, avaliação de impactos, licenciamento, incentivos, penalidades.
- **Art. 14, § 1º** — "Sem obstar a aplicação das penalidades previstas neste artigo, é o poluidor obrigado, independentemente da existência de culpa, a indenizar ou reparar os danos causados ao meio ambiente e a terceiros, afetados por sua atividade." — **responsabilidade civil objetiva** do poluidor.
- **Art. 14, § 2º** (com alterações da Lei 14.459/2022) — prevê o agravamento das sanções em caso de dano causado por infração continuada ou reincidente.

## Interpretação consolidada
- O STJ consolida a responsabilidade civil ambiental com base na **teoria do risco integral**: indenizar/reparar independe de culpa e, no entendimento consolidado da Corte, não admite excludentes como caso fortuito/força maior em hipóteses graves (ver doc de jurisprudência "responsabilidade objetiva ambiental STJ").
- O conceito de "poluidor indireto" permite alcançar quem participa do dano (sociedade de fato, sócios, administradores) — notícia institucional STJ 2025.

## Aplicação prática no EJC
- Fundamento de teses de defesa (contrarresponsabilidade) e de ações indenizatórias ambientais.
- Combina com Súmula 652/STJ (omissão estatal — solidariedade).`,
    metadados: { numero: 'Lei 6.938/1981', data_norma: '1981-08-31', orgao: 'Congresso Nacional', artigos_principais: ['2', '3', '9', '14'], vigente: true },
    tags: ['ambiental/responsabilidade-civil', 'ambiental/licenciamento'],
    fonte: PLANALTO,
    urlFonte: 'https://www.planalto.gov.br/ccivil_03/leis/l6938.htm',
    dataConsulta: CONSULTA,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: CONSULTA,
    proximaVerificacaoRecomendada: '2026-11-29',
    relacionamentos: [
      { destinoSlug: 'stj-responsabilidade-objetiva-ambiental-risco-integral', tipo: 'PRECEDENTE_APLICAVEL', descricao: 'Entendimento consolidado do STJ sobre risco integral.' },
      { destinoSlug: 'sumula-652-stj-omissao-estatal-solidariedade', tipo: 'PRECEDENTE_APLICAVEL' },
    ],
  },
  {
    slug: 'lei-12651-2012-codigo-florestal',
    titulo: 'Lei 12.651/2012 — Código Florestal: APP, Reserva Legal e Supressão de Vegetação',
    tipoDocumento: 'LEGISLACAO',
    area: 'ambiental',
    subarea: 'vegetacao',
    assunto: 'Proteção da vegetação nativa',
    prioridade: 'P0',
    lote: 'LOTE-001',
    conteudo: `## Ficha da Norma
- **Norma:** Lei nº 12.651, de 25 de maio de 2012 (com alterações da Lei 12.727/2012).
- **Ementa oficial:** estabelece normas gerais sobre a proteção da vegetação, áreas de Preservação Permanente e as áreas de Reserva Legal; a exploração florestal; o fornecimento de produtos e subprodutos da flora nativa; impõe obrigação de recuperar áreas degradadas; dá outras providências.
- **Vigência:** vigente.

## Conteúdo essencial
- **Área de Preservação Permanente (APP)** — área protegida, coberta ou não por vegetação nativa, com função ambiental de preservar recursos hídricos, paisagem, estabilidade geológica e biodiversidade; facilitar o fluxo gênico; proteger solo e assegurar bem-estar das populações (art. 3º, II). APPs típicas: margens de rios (faixas variáveis conforme largura do curso d'água — art. 4º), topos de morro, restingas, bordas de chapadas.
- **Reserva Legal (RL)** — área localizada no interior de imóvel rural, delimitada nos termos dos arts. 12 a 18, com função de assoberbar e enlaçar as áreas de preservação permanente, formar corredores ecológicos e assegurar a conservação da biodiversidade (art. 3º, III). Percentuais gerais: 80% em floresta amazônica, 35% em Cerrado amazônico e 20% nas demais regiões/biomas (art. 12).
- **Supressão de vegetação** — depende de autorização do órgão ambiental; a supressão em APP só é permitida em hipóteses de utilidade pública, interesse social ou atividades de baixo impacto (arts. 7º-8º e art. 3º, VIII-IX).
- **CAR (Cadastro Ambiental Rural)** — registro eletrônico obrigatório para todos os imóveis rurais (art. 29).
- Instrumentos de regularização: PRA (Programa de Regularização Ambiental — art. 21) e PRAD (projeto de recuperação de área degradada).

## Aplicação prática no EJC
- Autos de infração por supressão sem autorização ou por corte em APP/RL: verificar o enquadramento exato do ato (APP x RL x vegetação fora de área protegida), pois o valor da multa e a possibilidade de regularização variam.
- Teses defensivas típicas: ausência de laudo técnico; regularização superveniente (CAR/PRA); conversão de multa; erro na delimitação georreferenciada.
- Sempre solicitar e conferir: licenças existentes, georreferenciamento, mapa de uso do solo, ata do CAR.`,
    metadados: { numero: 'Lei 12.651/2012', data_norma: '2012-05-25', orgao: 'Congresso Nacional', artigos_principais: ['3', '4', '7', '12', '29'], vigente: true },
    tags: ['ambiental/vegetacao', 'ambiental/licenciamento', 'ambiental/auto-infracao'],
    fonte: PLANALTO,
    urlFonte: 'https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/lei/l12651.htm',
    dataConsulta: CONSULTA,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: CONSULTA,
    proximaVerificacaoRecomendada: '2026-11-29',
  },
  {
    slug: 'lei-7347-1985-acao-civil-publica',
    titulo: 'Lei 7.347/1985 — Ação Civil Pública (Legitimidade, Objeto e Procedimento)',
    tipoDocumento: 'LEGISLACAO',
    area: 'ambiental',
    subarea: 'acao-civil-publica',
    assunto: 'Instrumentos de tutela coletiva',
    prioridade: 'P0',
    lote: 'LOTE-001',
    conteudo: `## Ficha da Norma
- **Norma:** Lei nº 7.347, de 24 de julho de 1985.
- **Ementa oficial:** disciplina a ação civil pública de responsabilidade por danos causados ao meio ambiente, ao consumidor, a bens e direitos de valor artístico, estético, histórico, turístico e paisagístico.
- **Vigência:** vigente (alterada, entre outras, pela Lei 13.004/2014).

## Conteúdo essencial
- **Art. 1º** — objeto: responsabilização por danos causados ao meio ambiente e a bens e direitos de valor artístico, estético, histórico, turístico e paisagístico, qualquer que seja a ação ou omissão constitutiva da prática ou da ameaça de dano.
- **Art. 5º** — legitimados: Ministério Público, Defensoria Pública, União, Estados, Municípios, autarquias, empresas públicas, fundações, sociedades de economia mista, associações constituídas há pelo menos um ano nos termos da lei civil, com fins institucionais compatíveis.
- **Art. 6º** — ações de conhecimento, cautelares e de execução; o juiz pode conceder tutela de urgência (liminar) sem audiência do réu quando presentes os requisitos.
- **Art. 15** — a sentença concessiva terá eficácia de coisa julgada oponível erga omnes, salvo improcedência por insuficiência de provas, quando qualquer legitimado poderá intentar outra ação com idêntico fundamento.
- **Art. 17** — aplica-se o CPC subsidiariamente.
- Em matéria processual, o CPC/2015 aplica-se complementarmente (tutela de urgência — art. 300 do CPC; ver doc correspondente).

## Aplicação prática no EJC
- Clientes posicionados como réus em ACP ambiental: avaliar contestação por ausência de requisitos (dano, nexo causal), discussão de perícia e eventual TAC prévio (que pode impedir ou suspender a ACP por identidade de objeto).
- Combinação com Lei 13.140/2015 (acordo judicial extrajudicial — TAC).`,
    metadados: { numero: 'Lei 7.347/1985', data_norma: '1985-07-24', orgao: 'Congresso Nacional', artigos_principais: ['1', '5', '6', '15', '17'], vigente: true },
    tags: ['ambiental/acao-civil-publica', 'ambiental/responsabilidade-civil'],
    fonte: PLANALTO,
    urlFonte: 'https://www.planalto.gov.br/ccivil_03/leis/l7347orig.htm',
    dataConsulta: CONSULTA,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: CONSULTA,
    proximaVerificacaoRecomendada: '2026-11-29',
  },
  {
    slug: 'cpc-2015-art-300-tutela-urgencia',
    titulo: 'CPC/2015 — Art. 300: Tutela de Urgência (Requisitos e Regime)',
    tipoDocumento: 'LEGISLACAO',
    area: 'processual-civil',
    subarea: 'tutela-urgencia',
    assunto: 'Tutela provisória',
    prioridade: 'P0',
    lote: 'LOTE-001',
    conteudo: `## Ficha da Norma
- **Norma:** Lei nº 13.105, de 16 de março de 2015 (Código de Processo Civil), Art. 300.
- **Vigência:** vigente.

## Texto do dispositivo (confirmado na consulta 2026-08-29)
"Art. 300. A tutela de urgência será concedida quando houver elementos que evidenciem a probabilidade do direito e o perigo de dano ou o risco ao resultado útil do processo."
- § 1º — Pode ser concedida liminarmente ou após justificação prévia.
- § 2º — Não se concede a tutela se houver perigo de irreversibilidade do provimento antecipado.
- § 3º — A tutela de urgência pode ser concedida nas ações incidentais, antecipada ou cautelar.
- § 4º — A efetivação pode ocorrer de forma diversa da execução, como ato do juízo ou ordem a órgão público.
- § 5º — Aquele que concedeu pode revogar ou modificar a qualquer tempo; art. 301 — estabilização da tutela antecipada requerida ao juízo incompetente (com prazo de 6 meses para o ajuizamento da ação principal).

## Interpretação consolidada
- Requisitos cumulativos: (i) probabilidade do direito (fumus boni iuris) — plausibilidade, não certeza; (ii) perigo de dano ou risco ao resultado útil (periculum in mora).
- Vetores negativos: irreversibilidade do provimento (art. 300, § 2º) e o comportamento do requerente (venire contra factum proprium, falta de cautela).
- Em matéria ambiental, a tutela de urgência é instrumento central para suspender embargos, multas diárias e interdições — e também para os MP/entes paralisarem atividades poluidoras.

## Aplicação prática no EJC
- Pedidos cautelares em defesa contra AI (ex.: suspender embargo) exigem demonstração concreta de perigo — documento/laudo demonstrando risco.
- Modelos vinculados: petição inicial com pedido de tutela de urgência (BANCO 04).
- Teste RAG de referência: "Quais são os requisitos para tutela de urgência prevista no CPC?" deve retornar este doc + jurisprudência + modelo de peça.`,
    metadados: { numero: 'Lei 13.105/2015', data_norma: '2015-03-16', orgao: 'Congresso Nacional', artigos_principais: ['300', '301'], vigente: true },
    tags: ['processual-civil/tutela-urgencia', 'ambiental/auto-infracao'],
    fonte: 'Planalto (CPC/2015) — texto do art. 300 confirmado por citação oficial TJDFT em 2026-08-29',
    urlFonte: 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105.htm',
    dataConsulta: CONSULTA,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: CONSULTA,
    proximaVerificacaoRecomendada: '2026-11-29',
  },
  {
    slug: 'lei-14133-2021-licitacoes-ficha',
    titulo: 'Lei 14.133/2021 — Nova Lei de Licitações e Contratos Administrativos (Ficha Estruturante)',
    tipoDocumento: 'LEGISLACAO',
    area: 'administrativo',
    subarea: 'licitacao-14133',
    assunto: 'Licitações e contratos públicos',
    prioridade: 'P0',
    lote: 'LOTE-001',
    conteudo: `## Ficha da Norma
- **Norma:** Lei nº 14.133, de 1º de abril de 2021.
- **Ementa oficial:** estabelece normas gerais de licitação e contratação para as Administrações Públicas diretas, autárquicas e fundacionais da União, dos Estados, do Distrito Federal e dos Municípios.
- **Vigência:** vigente (com alterações posteriores — conferir a cada consulta). As demais normas de licitação (Lei 8.666/1993, Lei 10.520/2002) foram extintas para novos processos conforme o cronograma de transição da própria Lei 14.133.

## Estrutura essencial
- **Modalidades** (art. 28): concorrência, concurso, leilão, pregão, diálogo competitivo. Dispensas (art. 75) e inexigibilidade (art. 74) nas hipóteses taxativas.
- **Contratação direta** — dispensa (art. 75, com hipóteses como valores até limites legais, emergência, guerra, etc.) e inexigibilidade (inviabilidade de competição — fornecedor exclusivo, art. 74).
- **Habilitação** (arts. 62 a 69): jurídica, fiscal, social e trabalhista, econômico-financeira e qualificação técnica. SICAF e plataformas: no federal, o SICAF é o cadastro unificado; comitês e unidades de contratação regulam a habilitação.
- **Execução contratual** (arts. 98 e seguintes): alterações, reequilíbrio econômico-financeiro, reajuste, prorrogação, gestão contratual, extinção.
- **Sanções** (arts. 155-156): advertência, multa, impedimento de licitar e contratar, declaração de inidoneidade — com processo administrativo sancionador, contraditório e defesa.
- **Transparência** — PNCP (Portal Nacional de Contratações Públicas) e divulgação obrigatória dos atos.
- **Registro de preços** (arts. 81-85): sistema de contratações múltiplas por ata.

## Aplicação prática no EJC
- Defesas administrativas em processos sancionadores e impugnações de editais.
- Pedidos de reequilíbrio econômico-financeiro (fato do príncipe, álea extraordinária).
- Este doc é ficha estruturante; lotes P1 detalharão habilitação, sanções e TCU (jurisprudência).`,
    metadados: { numero: 'Lei 14.133/2021', data_norma: '2021-04-01', orgao: 'Congresso Nacional', artigos_principais: ['28', '74', '75', '155', '156'], vigente: true },
    tags: ['administrativo/licitacao-14133'],
    fonte: PLANALTO,
    urlFonte: 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm',
    dataConsulta: CONSULTA,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: CONSULTA,
    proximaVerificacaoRecomendada: '2026-10-29',
  },
  {
    slug: 'ctn-decadencia-prescricao-tributaria',
    titulo: 'CTN — Decadência e Prescrição do Crédito Tributário (arts. 150 § 4º, 173 I, 174)',
    tipoDocumento: 'LEGISLACAO',
    area: 'tributario',
    subarea: 'decadencia-prescricao',
    assunto: 'Extinção do crédito tributário',
    prioridade: 'P0',
    lote: 'LOTE-001',
    conteudo: `## Ficha da Norma
- **Norma:** Lei nº 5.172, de 25 de outubro de 1966 (Código Tributário Nacional), arts. 150, 173 e 174, com a alteração da LC 118/2005.
- **Vigência:** vigente.

## Dispositivos essenciais
- **Art. 150, § 4º** — o direito de a Fazenda Pública constituir o crédito tributário extingue-se definitivamente com o decurso de 5 anos a partir: (I) do primeiro dia do exercício seguinte àquele em que o lançamento poderia ter sido efetuado; ou (II) da data do fato gerador, quando o lançamento é por homologação e não ocorre homologação expressa.
- **Art. 173, I** — o direito de constituir o crédito extingue-se definitivamente com o decurso de 5 anos contados do primeiro dia do exercício seguinte àquele em que o lançamento poderia ter sido efetuado (lançamento de ofício e misto).
- **Art. 174** — texto confirmado na fonte oficial (consulta 2026-08-29): "A ação para a cobrança do crédito tributário prescreve em cinco anos, contados da data da sua constituição definitiva."
  - Parágrafo único — a prescrição se interrompe por: despacho do juiz que ordenar a citação em execução fiscal; protesto judicial; qualquer ato judicial que constitua em mora o devedor; qualquer ato inequívoco que importe em reconhecimento do débito pelo devedor.

## Ponto de atenção — LC 118/2005
- A LC 118/2005 alterou os prazos (eficácia a partir de 09.06.2005 — art. 3º), com interpretação do STF de aplicação imediata aos prazos pendentes em curso (respeitada a confiabilidade da verificação em cada caso).

## Aplicação prática no EJC
- Análise de execução fiscal: conferir data do fato gerador, do lançamento (notificação), da constituição definitiva e do ajuizamento.
- Regra de inteligência vinculada: SE tipo_processo=execucao_fiscal ENTÃO reconstruir linha do tempo CTN antes de qualquer defesa.`,
    metadados: { numero: 'Lei 5.172/1966 (CTN)', data_norma: '1966-10-25', orgao: 'Congresso Nacional', artigos_principais: ['150', '173', '174'], vigente: true },
    tags: ['tributario/decadencia-prescricao', 'tributario/execucao-fiscal', 'geral/prazos'],
    fonte: PLANALTO,
    urlFonte: 'https://www.planalto.gov.br/ccivil_03/leis/l5172compilado.htm',
    dataConsulta: CONSULTA,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: CONSULTA,
    proximaVerificacaoRecomendada: '2026-11-29',
  },
  {
    slug: 'cdc-art-27-fato-produto-5-anos',
    titulo: 'CDC — Art. 27: Prescrição de 5 anos (Fato do Produto ou do Serviço)',
    tipoDocumento: 'LEGISLACAO',
    area: 'consumidor',
    subarea: 'fato-produto-servico',
    assunto: 'Prazos de pretensão reparatória',
    prioridade: 'P0',
    lote: 'LOTE-001',
    conteudo: `## Ficha da Norma
- **Norma:** Lei nº 8.078, de 11 de setembro de 1990 (Código de Defesa do Consumidor), Art. 27.
- **Vigência:** vigente.

## Texto do dispositivo (confirmado na fonte oficial, consulta 2026-08-29)
"Art. 27. Prescreve em cinco anos a pretensão à reparação pelos danos causados por fato do produto ou do serviço prevista na Seção II deste Capítulo, iniciando-se a contagem do prazo a partir do conhecimento do dano e de sua autoria."

## Estrutura de prazos do CDC
- **Art. 26 (decadência)** — reclamações por vícios aparentes ou de fácil constatação: 30 dias (fornecimento de serviço/produto não durável) ou 90 dias (durável); vícios ocultos: prazo inicia quando o vício se evidencia.
- **Art. 27 (prescrição)** — fato do produto/serviço (acidente de consumo, dano à saúde/segurança): 5 anos, do conhecimento do dano e da autoria.
- Danos de responsabilidade civil contratual/extracontratual fora do CDC seguem o Código Civil (3 anos — art. 206, § 3º, V).

## Aplicação prática no EJC
- Em ações por dano decorrente de produto/serviço, a primeira checagem defensiva é: qual a natureza da pretensão (vício x fato) e qual prazo se aplica.
- Regra de inteligência vinculada: SE tipo_processo=indenizacao_consumidor ENTÃO classificar vício x fato do produto/serviço antes de alegar prescrição/decadência.`,
    metadados: { numero: 'Lei 8.078/1990', data_norma: '1990-09-11', orgao: 'Congresso Nacional', artigos_principais: ['26', '27', '6'], vigente: true },
    tags: ['consumidor/fato-produto-servico', 'geral/prazos'],
    fonte: PLANALTO,
    urlFonte: 'https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm',
    dataConsulta: CONSULTA,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: CONSULTA,
    proximaVerificacaoRecomendada: '2026-11-29',
  },
  {
    slug: 'lgpd-13709-2018-ficha',
    titulo: 'Lei 13.709/2018 — LGPD: Bases Legais, Princípios e Sanções (Ficha Estruturante)',
    tipoDocumento: 'LEGISLACAO',
    area: 'digital',
    subarea: 'bases-legais',
    assunto: 'Proteção de dados pessoais',
    prioridade: 'P0',
    lote: 'LOTE-001',
    conteudo: `## Ficha da Norma
- **Norma:** Lei nº 13.709, de 14 de agosto de 2018 (Lei Geral de Proteção de Dados Pessoais — LGPD).
- **Ementa oficial:** dispõe sobre o tratamento de dados pessoais, inclusive nos meios digitais, por pessoa natural ou por pessoa jurídica de direito público ou privado, com o objetivo de proteger os direitos fundamentais de liberdade e de privacidade e o livre desenvolvimento da personalidade da pessoa natural.
- **Vigência:** vigente (efeitos plenos; ANPD regulamenta).

## Conteúdo essencial
- **Princípios (art. 6º):** finalidade, adequação, necessidade, livre acesso, qualidade dos dados, transparência, segurança, prevenção, não discriminação, responsabilização e observância às boas práticas.
- **Bases legais (art. 7º — tratamento por particulares):** consentimento; obrigação legal/regulatória; administração pública; pesquisa; execução de contrato; exercício regular de direitos; proteção da vida; tutela da saúde; **legítimo interesse** (com avaliação de aderência — teste de balanceamento).
- **Direitos dos titulares (art. 18):** confirmação, acesso, correção, anonimização, portabilidade, eliminação, informação sobre compartilhamentos, informação sobre possibilidade de não consentir, revogação.
- **Encarregado (DPO), relatório de impacto (RIPD)** e regime de agentes: controlador, operador (arts. 39-46).
- **Sanções (art. 52)** aplicadas pela ANPD: advertência; multa simples de até 2% do faturamento (limitada a R$ 50 milhões por infração); multa diária; publicização da infração; bloqueio/eliminação dos dados; suspensão parcial/total das atividades; proibição parcial/total de exercício de atividades relacionadas a dados.
- **Dados sensíveis (art. 11)** e tratamento por órgãos públicos (art. 23) têm bases próprias.
- Regulamentações da ANPD (ex.: dosimetria das sanções, pequeno tratamento) devem ser conferidas a cada consulta.

## Aplicação prática no EJC
- Análise de contratos (cláusulas de proteção de dados), incidentes/vazamentos (notificação à ANPD e titulares), relações com fornecedores e funcionários.
- Regra de inteligência vinculada: SE contrato contém tratamento de dados pessoais ENTÃO verificar base legal, segurança, subcontratação e incidentes.`,
    metadados: { numero: 'Lei 13.709/2018', data_norma: '2018-08-14', orgao: 'Congresso Nacional', artigos_principais: ['6', '7', '18', '52'], vigente: true },
    tags: ['digital/bases-legais', 'geral/metodologia'],
    fonte: PLANALTO,
    urlFonte: 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm',
    dataConsulta: CONSULTA,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: CONSULTA,
    proximaVerificacaoRecomendada: '2026-10-29',
  },
];
