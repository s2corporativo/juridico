// LOTE-004 — Execução Fiscal (P1) — textos LITERAIS extraídos do Planalto em 2026-08-29
// + jurisprudência confirmada em fontes oficiais (portal STF, notícias STJ, gov.br/PGFN)
// + correção honesta do registro de prescrição intercorrente (fundamento: Lei 11.051/2004).
import type { InputDocument } from '../../src/lib/ejc/types';

const D = '2026-08-29';
const PLANALTO = 'Presidência da República — Planalto';
const URL_LEF = 'https://www.planalto.gov.br/ccivil_03/leis/l6830.htm';
const EJC = 'Elaboração EJC — conteúdo estrutural original';

function leiLef(
  slug: string, titulo: string, subarea: string, assunto: string, conteudo: string, artigos: string[],
  extra?: Partial<InputDocument>,
): InputDocument {
  return {
    slug, titulo, tipoDocumento: 'LEGISLACAO', area: 'tributario', subarea,
    assunto, prioridade: 'P1', lote: 'LOTE-004',
    conteudo,
    metadados: { numero: 'Lei 6.830/1980 (LEF)', data_norma: '1980-09-22', orgao: 'Congresso Nacional', artigos_principais: artigos, vigente: true, confirmacao_texto: 'Extracao literal do texto oficial do Planalto em 2026-08-29.' },
    tags: ['tributario/execucao-fiscal', 'geral/prazos'],
    fonte: PLANALTO,
    urlFonte: URL_LEF,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-29',
    ...extra,
  };
}

export default [
  leiLef(
    'lef-art-40-prescricao-intercorrente-texto-literal',
    'LEF art. 40 — Suspensão da execução fiscal e prescrição intercorrente (textos literais confirmados)',
    'execucao-fiscal',
    'Prescrição intercorrente na execução fiscal',
    `## Ficha da Norma
- **Norma:** Lei nº 6.830, de 22 de setembro de 1980 (LEF) — art. 40.
- **Vigência:** vigente (§ 4º incluído pela **Lei nº 11.051/2004**; § 5º incluído pela Lei nº 11.960/2009 — ambas identificadas no próprio texto oficial do Planalto).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-29)
"Art. 40 - O Juiz suspenderá o curso da execução, enquanto não for localizado o devedor ou encontrados bens sobre os quais possa recair a penhora, e, nesses casos, não correrá o prazo de prescrição.
§ 1º - Suspenso o curso da execução, será aberta vista dos autos ao representante judicial da Fazenda Pública.
§ 2º - Decorrido o prazo máximo de 1 (um) ano, sem que seja localizado o devedor ou encontrados bens penhoráveis, o Juiz ordenará o arquivamento dos autos.
§ 3º - Encontrados que sejam, a qualquer tempo, o devedor ou os bens, serão desarquivados os autos para prosseguimento da execução.
§ 4º Se da decisão que ordenar o arquivamento tiver decorrido o prazo prescricional, o juiz, depois de ouvida a Fazenda Pública, poderá, de ofício, reconhecer a prescrição intercorrente e decretá-la de imediato. (Incluído pela Lei nº 11.051, de 2004)
§ 5º A manifestação prévia da Fazenda Pública prevista no § 4º deste artigo será dispensada no caso de cobranças judiciais cujo valor seja inferior ao mínimo fixado por ato do Ministro de Estado da Fazenda. (Incluído pela Lei nº 11.960, de 2009)"

## Ponto crítico de coerência (regra anti-invenção)
- O § 4º do art. 40 foi incluído pela **Lei nº 11.051/2004** — NÃO pela LC 118/2005 (que alterou o CTN). Registros que atribuam o § 4º à LC 118/2005 estão incorretos.
- O art. 40 do texto oficial do Planalto (consulta 2026-08-29) contém apenas os §§ 1º a 5º.

## Interpretação aplicada
- Suspensão de 1 ano (§ 2º) tem **natureza processual** — tese do Tema 390/STF (RE 636.562, doc vinculado). Após o arquivamento, corre a prescrição intercorrente de 5 anos (Súmula 314/STJ e Tema 390/STF — docs vinculados).
- A decisão de arquivamento e o decurso de 5 anos habilitam o reconhecimento de ofício (§ 4º).

## Hipóteses de aplicação no EJC
- Embargos à execução fiscal: preliminar/inéxito por prescrição intercorrente — reconstruir linha do tempo (suspenso → arquivado → 5 anos).
- Efeito do desarquivamento (§ 3º) sobre prazo já consumado.`,
    ['40'],
    {
      relacionamentos: [
        { destinoSlug: 'tema-390-stf-re-636562-constitucionalidade-art-40-lef', tipo: 'PRECEDENTE_APLICAVEL', descricao: 'Constitucionalidade e natureza processual do prazo de 1 ano de suspensão.' },
        { destinoSlug: 'sumula-314-stj-prescricao-intercorrente-arquivamento', tipo: 'PRECEDENTE_APLICAVEL', descricao: 'Prazo intercorrente corre do dia seguinte ao arquivamento.' },
        { destinoSlug: 'ctn-decadencia-prescricao-tributaria', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Prazo prescricional de 5 anos do CTN art. 174 aplicável ao intercorrente.' },
        { destinoSlug: 'prazo-prescricao-intercorrente-lef-art-40', tipo: 'BASE_PRAZO', descricao: 'Registro operacional de prazo atualizado com este texto literal.' },
      ],
    },
  ),
  leiLef(
    'lef-art-2-divida-ativa-inscricao-suspende-180-dias',
    'LEF art. 2º — Dívida Ativa, inscrição e suspensão da prescrição por 180 dias (texto literal confirmado)',
    'execucao-fiscal',
    'Certidão da Dívida Ativa e inscrição',
    `## Textos CONFIRMADOS LITERALMENTE no Planalto (consulta 2026-08-29) — trechos essenciais
"Art. 2º - Constitui Dívida Ativa da Fazenda Pública aquela definida como tributária ou não tributária na Lei nº 4.320, de 17 de março de 1964..."

"§ 3º - A inscrição, que se constitui no ato de controle administrativo da legalidade, será feita pelo órgão competente para apurar a liquidez e certeza do crédito e suspenderá a prescrição, para todos os efeitos de direito, por 180 dias, ou até a distribuição da execução fiscal, se esta ocorrer antes de findo aquele prazo."

"§ 5º - O Termo de Inscrição de Dívida Ativa deverá conter:
I - o nome do devedor, dos co-responsáveis e, sempre que conhecido, o domicílio ou residência de um e de outros;
II - o valor originário da dívida, bem como o termo inicial e a forma de calcular os juros de mora e demais encargos previstos em lei ou contrato;
III - a origem, a natureza e o fundamento legal ou contratual da dívida;
IV - a indicação, se for o caso, de estar a dívida sujeita à atualização monetária, bem como o respectivo fundamento legal e o termo inicial para o cálculo;
V - a data e o número da inscrição, no Registro de Dívida Ativa; e
VI - o número do processo administrativo ou do auto de infração, se neles estiver apurado o valor da dívida."

"§ 6º - A Certidão de Dívida Ativa conterá os mesmos elementos do Termo de Inscrição e será autenticada pela autoridade competente."
"§ 8º - Até a decisão de primeira instância, a Certidão de Dívida Ativa poderá ser emendada ou substituída, assegurada ao executado a devolução do prazo para embargos."

## Interpretação aplicada
- A inscrição suspende a prescrição por 180 dias (ou até a distribuição) — ponto de obrigatória verificação de datas em toda defesa.
- Os requisitos do § 5º espelham-se na CDA: omissões essenciais (falta de termo inicial dos encargos, ausência de número do processo administrativo etc.) sustentam anulação da CDA (requisitos dos arts. 2º § 5º LEF + 203 CTN — conferir no caso).

## Hipóteses de aplicação no EJC
- Análise de CDA nos embargos (contagem de prescrição considerando os 180 dias da inscrição).
- Impugnação por vícios do Termo de Inscrição/CDA (ausência de elementos do § 5º).`,
    ['2'],
  ),
  leiLef(
    'lef-art-7-despacho-deferimento-inicial',
    'LEF art. 7º — Efeitos do despacho que deferir a inicial: citação, penhora, arresto, registro e avaliação (texto literal confirmado)',
    'execucao-fiscal',
    'Despacho inicial e constrições',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-29)
"Art. 7º - O despacho do Juiz que deferir a inicial importa em ordem para:
I - citação, pelas sucessivas modalidades previstas no artigo 8º;
II - penhora, se não for paga a dívida, nem garantida a execução, por meio de depósito, fiança ou seguro garantia; (Redação dada pela Lei nº 13.043, de 2014)
III - arresto, se o executado não tiver domicílio ou dele se ocultar;
IV - registro da penhora ou do arresto, independentemente do pagamento de custas ou outras despesas, observado o disposto no artigo 14; e
V - avaliação dos bens penhorados ou arrestados."

## Interpretação aplicada
- O despacho de deferimento reúne as ordens de citação e constrição — no fluxo atual (Sisbajud/Siafisico), o bloqueio por sistema materializa a penhora do inciso II.
- O registro da penhora (inciso IV) é ato essencial para eficácia frente a terceiros.

## Hipóteses de aplicação no EJC
- Embargos: verificação da legalidade do despacho inicial e das constrições (ordem do art. 11 — doc vinculado).
- Análise de citação válida e seus efeitos interruptivos da prescrição (CTN art. 174 — doc vinculado).`,
    ['7'],
    {
      relacionamentos: [
        { destinoSlug: 'lef-art-11-ordem-de-penhora', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Ordem legal de bens para a penhora.' },
      ],
    },
  ),
  leiLef(
    'lef-art-11-ordem-de-penhora',
    'LEF art. 11 — Ordem preferencial de bens para penhora e arresto (texto literal confirmado)',
    'execucao-fiscal',
    'Ordem de penhora na execução fiscal',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-29)
"Art. 11 - A penhora ou arresto de bens obedecerá à seguinte ordem:
I - dinheiro;
II - título da dívida pública, bem como título de crédito, que tenham cotação em bolsa;
III - pedras e metais preciosos;
IV - imóveis;
V - navios e aeronaves;
VI - veículos;
VII - móveis ou semoventes; e
VIII - direitos e ações.
§ 1º - Excepcionalmente, a penhora poderá recair sobre estabelecimento comercial, industrial ou agrícola, bem como em plantações ou edifícios em construção.
§ 2º - A penhora efetuada em dinheiro será convertida no depósito de que trata o inciso I do artigo 9º.
§ 3º - O Juiz ordenará a remoção do bem penhorado para depósito judicial, particular ou da Fazenda Pública exeqüente, sempre que esta o requerer, em qualquer fase do processo."

## Interpretação aplicada
- A ordem do art. 11 é preferencial (dinheiro em primeiro lugar — na prática, bloqueios Sisbajud). Desrespeito evidente à ordem sustenta impugnação à penhora, com exceções jurisprudenciais (menor gravame).
- Penhora sobre bem fiduciário de terceiro/credor fiduciário gera conflito de prioridades — ver doc de alienação fiduciária (LOTE-005).

## Hipóteses de aplicação no EJC
- Impugnação de constrição (embargos/exceção de pré-executividade) por desobediência à ordem legal.
- Planejamento de substituição de penhora pelo executado.`,
    ['11'],
  ),
  leiLef(
    'lef-art-16-embargos-30-dias-garantia',
    'LEF art. 16 — Embargos à execução fiscal: 30 dias, garantia prévia e matéria de defesa (texto literal confirmado)',
    'execucao-fiscal',
    'Embargos à execução fiscal',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-29)
"Art. 16 - O executado oferecerá embargos, no prazo de 30 (trinta) dias, contados:
I - do depósito;
II - da juntada da prova da fiança bancária ou do seguro garantia; (Redação dada pela Lei nº 13.043, de 2014)
III - da intimação da penhora.
§ 1º - Não são admissíveis embargos do executado antes de garantida a execução.
§ 2º - No prazo dos embargos, o executado deverá alegar toda matéria útil à defesa, requerer provas e juntar aos autos os documentos e rol de testemunhas, até três, ou, a critério do juiz, até o dobro desse limite.
§ 3º - Não será admitida reconvenção, nem compensação, e as exceções, salvo as de suspeição, incompetência e impedimento."

## Interpretação aplicada
- Garantia é pressuposto de admissibilidade (depósito, fiança bancária, seguro garantia, penhora intimação).
- Toda matéria útil deve ser alegada no prazo — preclusão consumativa (prescrição intercorrente e do crédito devem ser alegadas aqui, quando cabíveis).
- Vedação de reconvenção/compensação: pedidos ex vi defendantem são inadmissíveis.

## Hipóteses de aplicação no EJC
- Modelo de embargos (peça vinculada) com checklist de admissibilidade (garantia) e matriz de prescrição (CTN 174 + LEF 40/2º § 3º).`,
    ['16'],
    {
      relacionamentos: [
        { destinoSlug: 'peca-embargos-execucao-fiscal-modelo', tipo: 'PECA_APLICAVEL', descricao: 'Modelo de peça que operacionaliza os requisitos do art. 16.' },
        { destinoSlug: 'prazo-embargos-lef-30-dias', tipo: 'BASE_PRAZO', descricao: 'Prazo de 30 dias com termo inicial variável por modalidade de garantia.' },
      ],
    },
  ),
  {
    slug: 'tema-390-stf-re-636562-constitucionalidade-art-40-lef',
    titulo: 'STF — Tema 390 (RE 636.562): constitucionalidade do art. 40 da LEF; natureza processual da suspensão de 1 ano e prescrição de 5 anos após',
    tipoDocumento: 'JURISPRUDENCIA',
    area: 'tributario',
    subarea: 'execucao-fiscal',
    assunto: 'Prescrição intercorrente — constitucionalidade e regime do art. 40 da LEF',
    prioridade: 'P1',
    lote: 'LOTE-004',
    conteudo: `## Identificação (fontes oficiais)
- **Tribunal:** Supremo Tribunal Federal (STF)
- **Classe/Número:** RE 636.562 — Tema 390 da Repercussão Geral
- **Página oficial do tema:** portal.stf.jus.br (incidente 4043240)
- **Confirmações de 2026-08-29:** tese publicada no portal do STF e reproduzida na página institucional oficial da PGFN (gov.br)

## Tese CONFIRMADA (fonte oficial)
"É constitucional o art. 40 da Lei nº 6.830/1980 (Lei de Execuções Fiscais LEF), tendo natureza processual o prazo de 1 (um) ano de suspensão da execução fiscal. Após o decurso desse prazo, inicia-se automaticamente a contagem do prazo prescricional tributário de 5 (cinco) anos."

## Questão jurídica
O art. 40 da LEF (suspensão de 1 ano + prescrição intercorrente) é constitucional? Qual a natureza do prazo de 1 ano e quando começa a correr a prescrição intercorrente?

## Entendimento
1. O art. 40 da LEF é constitucional (inclusive quanto à disciplina por lei ordinária — não exige lei complementar).
2. O prazo de 1 ano de suspensão é PROCESSUAL.
3. Decorrido o prazo de 1 ano, inicia-se automaticamente a contagem do prazo prescricional tributário de 5 anos (que converge com o arquivamento automático — Súmula 314/STJ, doc vinculado).

## Aplicação prática
- Defesa em EF: demonstrar (i) suspensão nos termos do art. 40; (ii) decurso do ano sem localização; (iii) início automático da prescrição de 5 anos; (iv) ausência de causas interruptivas válidas.
- Combina com: LEF art. 40 (texto literal — doc vinculado), Súmula 314/STJ, Súmula 150/STF (prescrição intercorrente aplica-se também à intercorrente iniciada — conferir doc de CTN).`,
    metadados: {
      tribunal: 'STF',
      classe: 'Recurso Extraordinário — Repercussão Geral',
      numero_processo: 'RE 636.562 (incidente 4043240 — tema 390)',
      relator: null,
      data_publicacao: null,
      sumitulo: false,
      vinculante: true,
      data_consulta_confirmacao: D,
    },
    tags: ['tributario/execucao-fiscal', 'geral/prazos', 'geral/precedentes-qualificados'],
    fonte: 'STF — portal de Repercussão Geral + PGFN (gov.br, página institucional oficial sobre prescrição intercorrente)',
    urlFonte: 'https://portal.stf.jus.br/jurisprudenciaRepercussao/verAndamentoProcesso.asp?incidente=4043240&numeroProcesso=636562&classeProcesso=RE&numeroTema=390',
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-11-29',
    relacionamentos: [
      { destinoSlug: 'lef-art-40-prescricao-intercorrente-texto-literal', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Norma objeto da declaração de constitucionalidade.' },
      { destinoSlug: 'sumula-314-stj-prescricao-intercorrente-arquivamento', tipo: 'PRECEDENTE_RELAZIONADO', descricao: 'Súmula 314/STJ integra o regime (início automático após o arquivamento).' },
    ],
  },
  {
    slug: 'sumula-314-stj-prescricao-intercorrente-arquivamento',
    titulo: 'STJ — Súmula 314: em execução fiscal, não localizados bens penhoráveis, suspende-se o processo por 1 ano; findo o qual se inicia o prazo da prescrição intercorrente',
    tipoDocumento: 'JURISPRUDENCIA',
    area: 'tributario',
    subarea: 'execucao-fiscal',
    assunto: 'Prescrição intercorrente — termo inicial após a suspensão de 1 ano (art. 40 LEF)',
    prioridade: 'P1',
    lote: 'LOTE-004',
    conteudo: `## Identificação (fonte oficial STJ)
- **Tribunal:** Superior Tribunal de Justiça (STJ)
- **Instrumento:** Súmula 314 do STJ
- **Confirmação da consulta (2026-08-29):** notícia OFICIAL do STJ de 27/11/2014 (portal stj.jus.br), que cita expressamente o teor da súmula ao julgar repetitivo sobre execução fiscal (relator do voto citado: Min. Mauro Campbell Marques). Nota honesta: a página de súmulas (scon.stj.jus.br) estava sob verificação anti-robô na data da consulta; o teor abaixo foi confirmado no portal institucional oficial do STJ e em julgados oficiais que o reproduzem.

## Teor CONFIRMADO na fonte oficial (citado em notícia oficial do STJ)
"Em execução fiscal, não localizados bens penhoráveis, suspende-se o processo por um ano, findo o qual se inicia o prazo da prescrição quinquenal intercorrente. Esse é o teor da Súmula 314 do STJ" (notícia STJ 27/11/2014).

## Questão jurídica
Quando começa a correr a prescrição intercorrente na execução fiscal suspensa por não localização de devedor/bens?

## Entendimento
Findo o prazo de 1 ano de suspensão (art. 40 da LEF), inicia-se automaticamente o prazo da prescrição intercorrente de 5 anos. No mesmo sentido, julgados oficiais do STJ registram que "o arquivamento do feito se opera de forma automática após o transcurso de um ano" (REsp 1.340.553/RS — Revista Eletrônica oficial STJ, publicação 16/10/2018, registro 2012/0169193-3).

## Aplicação prática
- Embargos/impugnação: linha do tempo da suspensão → decurso do 1º ano → contagem automática de 5 anos → verificar causas interruptivas/suspensivas (ex.: localização positiva de bens — ver doc do bloqueio Sisbajud 2025).
- A súmula NÃO exige despacho formal de arquivamento para iniciar o prazo (arquivamento automático — segundo a jurisprudência oficial registrada).`,
    metadados: {
      tribunal: 'STJ',
      classe: 'Súmula',
      numero_processo: 'Súmula 314/STJ',
      relator: null,
      data_publicacao: null,
      sumitulo: true,
      vinculante: false,
      data_consulta_confirmacao: D,
      nota_verificacao: 'scon.stj.jus.br sob verificação anti-robô na consulta; teor confirmado via notícia oficial stj.jus.br (27/11/2014) e julgados oficiais que reproduzem o verbete.',
    },
    tags: ['tributario/execucao-fiscal', 'geral/prazos', 'geral/precedentes-qualificados'],
    fonte: 'STJ — notícia oficial do portal (27/11/2014) citando o verbete + REsp 1.340.553/RS (Revista Eletrônica oficial)',
    urlFonte: 'https://www.stj.jus.br/sites/portalp/Paginas/Comunicacao/Noticias-antigas/2014/2014-11-27_13-10_Pedido-de-vista-interrompe-julgamento-de-recurso-repetitivo-sobre-execucao-fiscal.aspx',
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-11-29',
    relacionamentos: [
      { destinoSlug: 'lef-art-40-prescricao-intercorrente-texto-literal', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Regime legal da suspensão de 1 ano.' },
      { destinoSlug: 'tema-390-stf-re-636562-constitucionalidade-art-40-lef', tipo: 'PRECEDENTE_RELAZIONADO', descricao: 'Tema 390/STF consolida o mesmo regime.' },
    ],
  },
  {
    slug: 'stj-2025-bloqueio-sisbajud-interrompe-prescricao-intercorrente',
    titulo: 'STJ (2ª Turma, notícia oficial 10/03/2025): simples bloqueio de bens (Sisbajud) basta para interromper a prescrição intercorrente na execução fiscal',
    tipoDocumento: 'JURISPRUDENCIA',
    area: 'tributario',
    subarea: 'execucao-fiscal',
    assunto: 'Interrupção da prescrição intercorrente por constrição via sistema',
    prioridade: 'P1',
    lote: 'LOTE-004',
    conteudo: `## Identificação (fonte oficial STJ)
- **Tribunal:** Superior Tribunal de Justiça (STJ) — Segunda Turma
- **Relator citado na notícia:** Ministro Francisco Falcão
- **Fonte oficial:** notícia do portal do STJ, publicada em 10/03/2025 ("Na execução fiscal, simples bloqueio de bens basta para interromper a prescrição intercorrente")
- **Natureza:** recurso especial não provido (reafirmação de entendimento)

## Entendimento CONFIRMADO na fonte oficial (consulta 2026-08-29)
1. Para interromper o prazo da prescrição intercorrente, **basta que a Fazenda encontre bens** do devedor, independentemente da modalidade de constrição (arresto, penhora, bloqueio de ativos ou via Sisbajud).
2. Na citação por correio com AR, é suficiente a comprovação de entrega no endereço do executado (validade da citação postal com AR assinado por terceiro, no caso julgado).

## Questão jurídica
A mera indisponibilidade/bloqueio eletrônico de ativos interrompe a prescrição intercorrente, ou é necessária efetiva penhora?

## Aplicação prática
- Contagem da prescrição intercorrente: mapear TODOS os bloqueios Sisbajud/Siafisico do processo (mesmo frustados e liberados) como possíveis marcos interruptivos.
- Defesa: atacar a eficácia interruptiva quando o "achado" foi mero indicativo sem constrição efetiva consumada (verificar o caso concreto contra a tese registrada).
- Citação postal com AR: presunção de validade com entrega no endereço — ponto de atenção para citações fictas.`,
    metadados: {
      tribunal: 'STJ',
      classe: 'Recurso Especial (2ª Turma)',
      numero_processo: null,
      relator: 'Ministro Francisco Falcão (relator citado na notícia oficial)',
      data_publicacao: '2025-03-10',
      data_julgamento: null,
      sumitulo: false,
      vinculante: false,
      data_consulta_confirmacao: D,
      pendencia: 'Número do processo não registrado na notícia consultada — não preencher por inferência.',
    },
    tags: ['tributario/execucao-fiscal', 'geral/prazos'],
    fonte: 'STJ — notícia oficial do portal (10/03/2025)',
    urlFonte: 'https://www.stj.jus.br/sites/portalp/Paginas/Comunicacao/Noticias/2025/10032025-Na-execucao-fiscal--simples-bloqueio-de-bens-basta-para-interromper-a-prescricao-intercorrente.aspx',
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-11-29',
    relacionamentos: [
      { destinoSlug: 'sumula-314-stj-prescricao-intercorrente-arquivamento', tipo: 'PRECEDENTE_RELAZIONADO', descricao: 'Definidas as causas interruptivas do prazo intercorrente.' },
    ],
  },
  {
    slug: 'temas-100-stf-125-stj-ef-baixo-valor-arquivamento',
    titulo: 'Execução fiscal de baixo valor — Tema 100/STF, Tema 125/STJ, Súmula CARF 11 e Ato Declaratório PGFN 9/2008 (teses oficiais registradas na página da PGFN)',
    tipoDocumento: 'JURISPRUDENCIA',
    area: 'tributario',
    subarea: 'execucao-fiscal',
    assunto: 'Arquivamento sem baixa, prescrição intercorrente e regimes especiais',
    prioridade: 'P1',
    lote: 'LOTE-004',
    conteudo: `## Identificação (fonte oficial)
- **Fonte:** página institucional oficial da PGFN (gov.br) sobre "Prescrição intercorrente e extinção da EF por inércia do credor" — consulta 2026-08-29. A página registra teses julgadas pelos tribunais superiores com números de tema.

## Teses CONFIRMADAS na fonte oficial
1. **Tema 100/STF (Repercussão Geral):** "Ainda que a execução fiscal tenha sido arquivada em razão do pequeno valor do débito executado, sem baixa na distribuição, nos termos do art. 20 da Lei 10.522/2002, deve ser reconhecida a prescrição intercorrente se o processo ficar paralisado por mais de cinco anos a contar da decisão que determina o arquivamento, pois essa norma não constitui causa de suspensão do prazo prescricional."
2. **Tema 125/STJ (Repetitivos):** "As execuções fiscais relativas a débitos iguais ou inferiores a R$ 10.000,00 (dez mil reais) devem ter seus autos arquivados, sem baixa na distribuição." (transitado em julgado em 26/06/2009)
3. **Súmula CARF nº 11** (vinculante no âmbito CARF — Portaria MF 277/2018): "Não se aplica a prescrição intercorrente no processo administrativo fiscal."
4. **Ato Declaratório PGFN nº 9/2008** (com Parecer PGFN/CRJ 2605/2008): PGFN autorizada a não contestar/não recorrer em EF extintas por prescrição intercorrente nos casos de arquivamento nos termos do art. 20 da Lei 10.522/2002.
5. **Ato Declaratório PGFN nº 03/2011:** reconhece que "exarado ou não o despacho judicial de arquivamento, o prazo da prescrição intercorrente transcorre automaticamente, ao teor da Súmula 314 do STJ" — e que a ausência de intimação prévia da Fazenda (art. 40 § 4º) não invalida a extinção quando sem prejuízo.

## Aplicação prática
- Débitos ≤ R$ 10.000: esperado arquivamento sem baixa + prescrição intercorrente após 5 anos de paralisação (Tema 100/STF).
- Cobrança administrativa (CARF): prescrição intercorrente NÃO corre no PAF — somente na fase judicial.
- Planejamento: usar os atos da PGFN como parâmetro de postuação esperada da Fazenda.`,
    metadados: {
      tribunal: 'STF/STJ/CARF — teses registradas em fonte oficial PGFN',
      classe: 'Teses de Repercussão Geral e Repetitivos',
      numero_processo: 'Tema 100/STF; Tema 125/STJ; Súmula CARF 11',
      relator: null,
      sumitulo: false,
      vinculante: true,
      data_consulta_confirmacao: D,
    },
    tags: ['tributario/execucao-fiscal', 'geral/prazos', 'geral/precedentes-qualificados'],
    fonte: 'PGFN — gov.br (página institucional oficial sobre prescrição intercorrente)',
    urlFonte: 'https://www.gov.br/pgfn/pt-br/cidadania-tributaria/por-assunto/execucao-fiscal/prescricao-intercorrente-e-extincao-da-ef-por-inercia-do-credor',
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-11-29',
    relacionamentos: [
      { destinoSlug: 'sumula-314-stj-prescricao-intercorrente-arquivamento', tipo: 'PRECEDENTE_RELAZIONADO', descricao: 'Ato Declaratório PGFN 03/2011 aplica a Súmula 314.' },
      { destinoSlug: 'lef-art-40-prescricao-intercorrente-texto-literal', tipo: 'REFERENCIA_LEGISLACAO' },
    ],
  },
  {
    // CORREÇÃO do registro existente (versão anterior atribuía o § 4º do art. 40 à LC 118/2005 — INCORRETO)
    slug: 'prazo-prescricao-intercorrente-lef-art-40',
    titulo: 'Prescrição intercorrente na execução fiscal — regime consolidado do art. 40 da LEF (CORRIGIDO no LOTE-004)',
    tipoDocumento: 'PRAZO',
    area: 'tributario',
    subarea: 'execucao-fiscal',
    assunto: 'Prazo operacional da prescrição intercorrente',
    prioridade: 'P1',
    lote: 'LOTE-004',
    conteudo: `## AVISO DE CORREÇÃO (LOTE-004, 2026-08-29)
A versão anterior deste registro atribuía o § 4º do art. 40 da LEF à "LC 118/2005" — **INCORRETO**. O texto oficial do Planalto (consulta 2026-08-29) confirma: **§ 4º incluído pela Lei nº 11.051/2004**; **§ 5º incluído pela Lei nº 11.960/2009**. Este registro substitui integralmente a versão anterior.

## Situação
Execução fiscal suspensa por não localização do devedor ou de bens penhoráveis (art. 40 da LEF — texto literal confirmado, doc vinculado).

## Prazo
**1 ano de suspensão (natureza processual — Tema 390/STF) + 5 anos de prescrição intercorrente após findo o prazo de suspensão (Súmula 314/STJ e Tema 390/STF).**

## Fundamento
- LEF art. 40 (caput e §§ 1º-5º) — Planalto, consulta 2026-08-29.
- Súmula 314/STJ — teor confirmado em notícia oficial do STJ (27/11/2014).
- Tema 390/STF (RE 636.562) — tese confirmada no portal do STF e na página oficial da PGFN.
- REsp 1.340.553/RS (Revista Eletrônica oficial STJ, 16/10/2018): arquivamento automático após 1 ano.

## Termo inicial
1. Suspensão de 1 ano: início automático quando constatada a não localização do devedor/bens (jurisprudência oficial registra que o prazo corre automaticamente, independentemente de despacho).
2. Prescrição intercorrente de 5 anos: inicia-se automaticamente após o decurso do prazo de 1 ano (não exige despacho de arquivamento — Súmula 314/STJ + Ato Declaratório PGFN 03/2011).

## Interrupções (causas confirmadas)
- Localização positiva de bens: simples bloqueio (Sisbajud/Siafisico) basta para interromper — STJ 2ª Turma, notícia oficial 10/03/2025 (doc vinculado).
- Desarquivamento e prosseguimento efetivo (art. 40 § 3º).

## Exceções
- Débitos ≤ R$ 10.000 arquivados sem baixa (art. 20 da Lei 10.522/2002): prescrição intercorrente após 5 anos da decisão de arquivamento (Tema 100/STF; Tema 125/STJ — doc vinculado).
- Prescrição intercorrente NÃO corre no processo administrativo fiscal (Súmula CARF 11).

## Observações
- Causa de extinção do feito com resolução de mérito (CPC art. 924/925 aplicado à EF — conferir no caso).`,
    metadados: {
      prazo_dias: null,
      regime: '1 ano (suspensão processual) + 5 anos (prescrição intercorrente)',
      termo_inicial: 'suspensão: constatação automática da não localização; intercorrente: findo o 1º ano',
      fundamentos: ['LEF art. 40 (Planalto literal)', 'Súmula 314/STJ', 'Tema 390/STF (RE 636.562)', 'REsp 1.340.553/RS'],
      correcao: 'LOTE-004: fundamento do § 4º corrigido para Lei 11.051/2004 (era atribuído erroneamente à LC 118/2005).',
      data_consulta_confirmacao: D,
    },
    tags: ['tributario/execucao-fiscal', 'geral/prazos'],
    fonte: 'Planalto (LEF literal) + STJ (notícia oficial 27/11/2014) + STF/PGFN (Tema 390)',
    urlFonte: URL_LEF,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-11-29',
    relacionamentos: [
      { destinoSlug: 'lef-art-40-prescricao-intercorrente-texto-literal', tipo: 'REFERENCIA_LEGISLACAO' },
      { destinoSlug: 'sumula-314-stj-prescricao-intercorrente-arquivamento', tipo: 'PRECEDENTE_APLICAVEL' },
      { destinoSlug: 'tema-390-stf-re-636562-constitucionalidade-art-40-lef', tipo: 'PRECEDENTE_APLICAVEL' },
      { destinoSlug: 'stj-2025-bloqueio-sisbajud-interrompe-prescricao-intercorrente', tipo: 'PRECEDENTE_APLICAVEL', descricao: 'Causas interruptivas do prazo.' },
    ],
  },
  {
    slug: 'tese-defesa-execucao-fiscal-prescricao-cda',
    titulo: 'Tese — Defesa em execução fiscal: prescrição (CTN 174 + LEF 2º § 3º + LEF 40) e impugnação da CDA',
    tipoDocumento: 'TESE',
    area: 'tributario',
    subarea: 'execucao-fiscal',
    assunto: 'Linhas de defesa do executado',
    prioridade: 'P1',
    lote: 'LOTE-004',
    conteudo: `## Tese principal
A cobrança judicial do crédito tributário prescreve em 5 anos (CTN art. 174 — doc vinculado na base), considerando: (i) suspensão de 180 dias pela inscrição em dívida ativa (LEF art. 2º § 3º — texto literal confirmado); (ii) interrupção pela citação válida (CTN art. 174 § 1º); (iii) prescrição intercorrente pelo regime do art. 40 da LEF + Súmula 314/STJ + Tema 390/STF.

## Requisitos e estrutura da argumentação
1. Reconstruir a linha do tempo: fato gerador → constituição definitiva → inscrição (+180 dias) → distribuição → citação → suspensões/arquivamentos (art. 40).
2. Identificar causas de suspensão (CTN arts. 151; LEF 2º § 3º) e interrupção (CTN 174 § 1º; bloqueios — STJ 2025).
3. Concluir o prazo consumido OU a prescrição intercorrente (1 ano + 5 anos do arquivamento automático).

## Vícios da CDA (tese acessória)
- Ausência de elementos obrigatórios do Termo de Inscrição/CDA (LEF art. 2º §§ 5º-6º — literal confirmado).
- Emenda/substituição da CDA até a decisão de 1º grau com devolução do prazo de embargos (LEF art. 2º § 8º — literal confirmado).

## Probabilidade qualitativa
- Alta quando a linha do tempo demonstra decurso sem causas interruptivas/suspensivas; média a baixa quando há bloqueios Sisbajud regulares (STJ 2025 — doc vinculado).

## Riscos
- Preclusão: toda matéria útil deve constar dos embargos (LEF art. 16 § 2º — literal confirmado).
- Necessidade de garantia prévia para admissibilidade dos embargos (LEF art. 16 § 1º).

## Documentos EJC vinculados
LEF arts. 40, 2º e 16 (textos literais); Súmula 314/STJ; Tema 390/STF; peça-modelo de embargos.`,
    tags: ['tributario/execucao-fiscal', 'geral/prazos'],
    fonte: EJC,
    urlFonte: URL_LEF,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'peca-embargos-execucao-fiscal-modelo', tipo: 'PECA_APLICAVEL' },
      { destinoSlug: 'ctn-decadencia-prescricao-tributaria', tipo: 'REFERENCIA_LEGISLACAO' },
      { destinoSlug: 'prazo-prescricao-intercorrente-lef-art-40', tipo: 'BASE_PRAZO' },
    ],
  },
  {
    slug: 'peca-embargos-execucao-fiscal-modelo',
    titulo: 'Peça-modelo — Embargos à execução fiscal (variáveis {{...}}, sem fatos fictícios)',
    tipoDocumento: 'PECA',
    area: 'tributario',
    subarea: 'execucao-fiscal',
    assunto: 'Modelo de embargos com estrutura de prescrição e impugnação de CDA',
    prioridade: 'P1',
    lote: 'LOTE-004',
    conteudo: `**EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA {{JUÍZO}}**

**Autos nº {{PROCESSO}}** — Execução Fiscal
**Embargante:** {{CLIENTE}} ({{CPF/CNPJ}})
**Exequente:** {{FAZENDA}}

{{CLIENTE}}, por seu advogado (procuração anexa), vem, **tempestivamente** (LEF art. 16 — prazo de 30 dias contados de {{TERMO_INICIAL}}), oferecer **EMBARGOS À EXECUÇÃO FISCAL**, garantida a execução por {{MODALIDADE_GARANTIA}}, pelos fundamentos a seguir.

### I — DA ADMISSIBILIDADE
1.1. Execução garantida (LEF art. 16 § 1º) por {{DESCRICAO_GARANTIA}} na data {{DATA_GARANTIA}}.
1.2. Tempestividade e legitimidade.

### II — DA LINHA DO TEMPO DA PRESCRIÇÃO (PRELIMINAR/DE MÉRITO)
2.1. Fato gerador: {{DATA_FATO}}. Constituição definitiva: {{DATA_CONSTITUICAO}}.
2.2. Inscrição em dívida ativa: {{DATA_INSCRICAO}} — suspende a prescrição por 180 dias (LEF art. 2º § 3º).
2.3. Distribuição: {{DATA_DISTRIBUICAO}}. Citação: {{DATA_CITACAO}} (interrupção — CTN art. 174 § 1º).
2.4. Suspensão/arquivamento (LEF art. 40): {{PERIODO_SUSPENSAO}}; transcurso do prazo intercorrente (Súmula 314/STJ; Tema 390/STF; LEF art. 40 §§ 2º e 4º).
2.5. Conclusão: consumada a prescrição {{TRIBUTÁRIA/INTERCORRENTE}} — extinção do feito ({{FUNDAMENTO_EXTINCAO}}).

### III — DA NULIDADE/IMPUGNAÇÃO DA CDA (QUANDO HOUVER)
3.1. Ausência dos elementos do LEF art. 2º §§ 5º-6º: {{VICIOS_IDENTIFICADOS}}.
3.2. Divergência entre CDA e processo administrativo: {{DIVERGENCIAS}}.

### IV — DO MÉRITO
4.1. Impugnação específica de cada parcela (juros/multa/correção): {{PARCELAS}}.
4.2. {{MATERIA_DE_FUNDO_DISPONIBILIZADA}}.

### V — DOS PEDIDOS
a) a extinção da execução pela prescrição {{TRIBUTÁRIA/INTERCORRENTE}};
b) a anulação da CDA (se configurados vícios), com consequente extinção;
c) subsidiariamente, a exclusão das parcelas impugnadas;
d) a liberação da garantia e condenação em honorários.

**Termos em que pede deferimento.**
{{LOCAL}}, {{DATA}}.
{{ADVOGADO}} — OAB/{{UF}} nº {{NUM_OAB}}

---
**CHECKLIST DE REVISÃO EJC (antes do protocolo):**
- [ ] Garantia prévia comprovada nos autos (LEF art. 16 § 1º);
- [ ] Toda matéria útil incluída (LEF art. 16 § 2º — preclusão consumativa);
- [ ] Linha do tempo da prescrição conferida contra os autos (datas reais);
- [ ] Temas com confiabilidade C (se usados) não foram citados como fundamento exclusivo;
- [ ] Documentos: CDA, termo de inscrição, memórias de cálculo, certidões da execução, decisões de suspensão/arquivamento.`,
    tags: ['tributario/execucao-fiscal', 'geral/pecas'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'lef-art-16-embargos-30-dias-garantia', tipo: 'REFERENCIA_LEGISLACAO' },
      { destinoSlug: 'tese-defesa-execucao-fiscal-prescricao-cda', tipo: 'TESE_APLICAVEL' },
      { destinoSlug: 'documentos-embargos-execucao-fiscal', tipo: 'DOCUMENTOS_NECESSARIOS' },
    ],
  },
  {
    slug: 'argumentacao-embargos-execucao-fiscal',
    titulo: 'Argumentação bilateral — Embargos à execução fiscal (ataques e réplicas esperadas)',
    tipoDocumento: 'ARGUMENTACAO',
    area: 'tributario',
    subarea: 'execucao-fiscal',
    assunto: 'Antecipação de contraposições Fazenda x executado',
    prioridade: 'P1',
    lote: 'LOTE-004',
    conteudo: `## Eixo 1 — Prescrição intercorrente
**Executado:** regime do art. 40 + Súmula 314/STJ + Tema 390/STF: 1 ano de suspensão (automático e de natureza processual) e 5 anos de intercorrente a contar do fim da suspensão, sem exigência de despacho de arquivamento (REsp 1.340.553/RS; Ato Decl. PGFN 03/2011).
**Réplica esperada da Fazenda:** existência de providências úteis e de causas interruptivas (bloqueios Sisbajud — STJ 2ª Turma, 10/03/2025).
**Contra-argumento:** demonstrar que os bloqueios não constituíram "localização positiva e útil" (ex.: bloqueios frustados, liberados, sem constrição consumada) — o registro oficial do STJ 2025 exige localização de bens como interrupção; cada caso deve ser confrontado com os autos.

## Eixo 2 — Vícios da CDA
**Executado:** ausência de requisitos do art. 2º §§ 5º-6º da LEF nulifica a CDA (falta de termo inicial dos encargos, número do processo administrativo etc.).
**Réplica esperada:** emenda/substituição da CDA até decisão de 1º grau (art. 2º § 8º) com devolução do prazo.
**Contra-argumento:** emenda não pode suprir ausência de pressupostos de constituição (crédito inexigível/indeterminado) nem alterar o sujeito passivo.

## Eixo 3 — Garantia e admissibilidade
**Executado:** exceção de pré-executividade para matérias de direito sem constrição.
**Réplica esperada:** EPE limitada a vícios palliativos (cognição sumária).
**Contra-argumento:** manter EPE restrita; prescrição intercorrente é matéria cognoscível de ofício (art. 40 § 4º da LEF — literal confirmado).`,
    tags: ['tributario/execucao-fiscal', 'geral/argumentacao'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'peca-embargos-execucao-fiscal-modelo', tipo: 'PECA_APLICAVEL' },
      { destinoSlug: 'stj-2025-bloqueio-sisbajud-interrompe-prescricao-intercorrente', tipo: 'PRECEDENTE_RELAZIONADO' },
    ],
  },
  {
    slug: 'documentos-embargos-execucao-fiscal',
    titulo: 'Documentos necessários — Embargos à execução fiscal (tabela operacional)',
    tipoDocumento: 'TABELA_DOCUMENTOS',
    area: 'tributario',
    subarea: 'execucao-fiscal',
    assunto: 'Documentos para instruir embargos e análise de viabilidade',
    prioridade: 'P1',
    lote: 'LOTE-004',
    conteudo: `| # | Documento | Finalidade | Onde obter | Obrigatório? |
|---|-----------|------------|------------|--------------|
| 1 | Procuração e documentos de representação | Legitimação processual | Cliente | Sim |
| 2 | Comprovante da garantia (depósito/fiança/seguro garantia) | Admissibilidade (LEF art. 16 § 1º) | Banco/corretora | Sim |
| 3 | CDA + Termo de Inscrição | Impugnação dos requisitos (LEF art. 2º §§ 5º-6º) | Autos | Sim |
| 4 | Petição inicial da execução e despacho | Verificar ordem de constrições (LEF art. 7º) | Autos | Sim |
| 5 | Certidões da execução (citação, bloqueios, penhoras, suspensões) | Linha do tempo da prescrição (LEF 40 + Súmula 314/STJ) | Autos | Sim |
| 6 | Processo administrativo fiscal (lançamento, notificação, decisão) | Constituição do crédito; termo inicial (CTN 174) | Órgão fiscal/cliente | Sim (tributário) |
| 7 | Memórias de cálculo do débito | Impugnação de parcelas | Autos/PGFN | Recomendado |
| 8 | Certidão de dados cadastrais do executado | Qualificação | Receita/Junta | Sim |
| 9 | Documentos de pagamento/compensações alegadas | Defesa de mérito | Cliente | Se aplicável |
| 10 | Jurisprudência aplicável atualizada (fontes oficiais EJC) | Fundamentação | Base EJC | Recomendado |

**Regra EJC:** nenhum documento "exemplo/fictício" instrui peça real — preencher apenas com documentos reais dos autos.`,
    tags: ['tributario/execucao-fiscal', 'geral/documentos'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'peca-embargos-execucao-fiscal-modelo', tipo: 'PECA_APLICAVEL' },
    ],
  },
];
