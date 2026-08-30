// LOTE-025 — Penal: crimes contra as relações de consumo (CDC) + estelionato/fraude eletrônica (CP) + JECrim (Lei 9.099)
// Textos LITERAIS extraídos do Planalto em 2026-08-30 (downloads verbatim):
//   - CDC (Lei 8.078/1990): https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm
//   - CP (Decreto-Lei 2.848/1940): https://www.planalto.gov.br/ccivil_03/decreto-lei/del2848compilado.htm
//   - Lei 9.099/1995: https://www.planalto.gov.br/ccivil_03/leis/l9099.htm
//
// ANTI-INVENÇÃO desta rodada (constatações da consulta — 3 premissas da tarefa RETIFICADAS pelo texto oficial):
// (1) CP art. 171 § 2º VI = FRAUDE NO PAGAMENTO POR MEIO DE CHEQUE (não é "fraude eletrônica"); a fraude
//     eletrônica é o § 2º-A do art. 171 (incluído pela Lei 14.155/2021; texto oficial atual traz redação
//     dada pela Lei 15.397, de 2026, com pena de reclusão de 4 a 8 anos e multa) — registrado COMO CONSTA.
//     O § 2º VII (conta laranja) e a redação do caput também constam com a Lei 15.397/2026 no Planalto.
// (2) CP art. 311-A = FRAUDES EM CERTAMES DE INTERESSE PÚBLICO (concurso/avaliação — Lei 12.550/2011),
//     NÃO é dispositivo de "fraude eletrônica" — retificado no documento.
// (3) CDC arts. 63-67: NÃO existe disposição de "reincidência" nem de "óbice à fiscalização" no rol
//     63-75 (o art. 71 trata de cobrança constrangedora; a premessa não se confirma no texto oficial).
//     Arts. 63-68 reproduzidos LITERAIS com as notas.
// - Lei 9.099: arts. 60, 61 (red. Lei 11.313/2006), 72, 74 e 76 JÁ estão literais na base (lote-012) —
//   complementação nos arts. 62, 63, 65-68, 75, 76 §§ 3º/5º e 89 (sem duplicar).
// - Portais MG (almg/mg.gov.br/tjmg) bloqueados → ponte penal-estadual como REVISAO_HUMANA/C.
import type { InputDocument } from '../../src/lib/ejc/types';

const D = '2026-08-30';
const PLANALTO = 'Presidência da República — Planalto';
const URL_CDC = 'https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm';
const URL_CP = 'https://www.planalto.gov.br/ccivil_03/decreto-lei/del2848compilado.htm';
const URL_9099 = 'https://www.planalto.gov.br/ccivil_03/leis/l9099.htm';
const EJC = 'Elaboração EJC — conteúdo estrutural original';

function legPenal(
  slug: string, titulo: string, area: string, subarea: string, assunto: string,
  conteudo: string, numero: string, url: string, artigos: string[],
  extra?: Partial<InputDocument>,
): InputDocument {
  return {
    slug, titulo, tipoDocumento: 'LEGISLACAO', area, subarea,
    assunto, prioridade: 'P1', lote: 'LOTE-025',
    conteudo,
    metadados: { numero, orgao: 'Congresso Nacional', artigos_principais: artigos, vigente: true, confirmacao_texto: 'Extração literal do texto oficial do Planalto em 2026-08-30 (download verbatim).' },
    tags: [`${area}/${subarea}`],
    fonte: PLANALTO,
    urlFonte: url,
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
  legPenal(
    'cdc-art63-64-nocividade-comunicacao',
    'CDC arts. 63-64 — Omissão de nocividade/periculosidade em produtos e deixar de comunicar/recolher produto nocivo (crimes; texto literal confirmado)',
    'penal', 'jecrim-menor-ofensividade', 'Crimes contra as relações de consumo — perigo à saúde',
    `## Ficha da Norma
- **Norma:** Lei 8.078/1990 (CDC) — Capítulo VII (Dos Crimes contra as Relações de Consumo).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 63. Omitir dizeres ou sinais ostensivos sobre a nocividade ou periculosidade de produtos, nas embalagens, nos invólucros, recipientes ou publicidade:
Pena - Detenção de seis meses a dois anos e multa.
§ 1º Incorrerá nas mesmas penas quem deixar de alertar, mediante recomendações escritas ostensivas, sobre a periculosidade do serviço a ser prestado.
§ 2º Se o crime é culposo:
Pena Detenção de um a seis meses ou multa.
Art. 64. Deixar de comunicar à autoridade competente e aos consumidores a nocividade ou periculosidade de produtos cujo conhecimento seja posterior à sua colocação no mercado:
Pena - Detenção de seis meses a dois anos e multa.
Parágrafo único. Incorrerá nas mesmas penas quem deixar de retirar do mercado, imediatamente quando determinado pela autoridade competente, os produtos nocivos ou perigosos, na forma deste artigo."

## Leitura aplicada
- Art. 63: crime OMISSIVO de informação de perigo — embalagem/invólucro/recipientes/publicidade; § 1º estende ao SERVIÇO (alertas escritos ostensivos); § 2º modalidade CULPOSA.
- Art. 64: descoberta POSTERIOR do perigo → dever DUPLO (comunicar autoridade + comunicar consumidores); § único — recolhimento IMEDIATO quando determinado pela autoridade.
- Complemento cível: recall/fato do produto-serviço (CDC arts. 12/14, já na base) — mesma conduta alimenta as três esferas (penal, administrativa, cível).
- Atento JECrim: pena máxima de 2 anos → infração de menor potencial ofensivo no teto da Lei 11.313/2006 (art. 61).`,
    ['63', '64'], URL_CDC,
    {
      tags: ['penal/jecrim-menor-ofensividade', 'consumidor/fato-produto-servico'],
      relacionamentos: [
        { destinoSlug: 'cdc-art-12-fato-produto-texto-literal', tipo: 'CONEXO_TEMATICO', descricao: 'Face cível do mesmo risco.' },
        { destinoSlug: 'cdc-art-14-fato-servico-texto-literal', tipo: 'CONEXO_TEMATICO', descricao: 'Face cível em serviços.' },
      ],
    },
  ),
  legPenal(
    'cdc-art65-67-periculosidade-publicidade',
    'CDC arts. 65-67 — Serviço perigoso contra ordem de autoridade, afirmação falsa/omissão relevante e publicidade enganosa ou abusiva como crime (texto literal confirmado, com notas de retificação)',
    'penal', 'jecrim-menor-ofensividade', 'Crimes contra as relações de consumo — publicidade',
    `## Ficha da Norma
- **Norma:** Lei 8.078/1990 (CDC) — Capítulo VII.

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 65. Executar serviço de alto grau de periculosidade, contrariando determinação de autoridade competente:
Pena Detenção de seis meses a dois anos e multa.
§ 1º As penas deste artigo são aplicáveis sem prejuízo das correspondentes à lesão corporal e à morte. (Redação dada pela Lei nº 13.425, de 2017)
§ 2º A prática do disposto no inciso XIV do art. 39 desta Lei também caracteriza o crime previsto no caput deste artigo. (Incluído pela Lei nº 13.425, de 2017)
Art. 66. Fazer afirmação falsa ou enganosa, ou omitir informação relevante sobre a natureza, característica, qualidade, quantidade, segurança, desempenho, durabilidade, preço ou garantia de produtos ou serviços:
Pena - Detenção de três meses a um ano e multa.
§ 1º Incorrerá nas mesmas penas quem patrocinar a oferta.
§ 2º Se o crime é culposo:
Pena Detenção de um a seis meses ou multa.
Art. 67. Fazer ou promover publicidade que sabe ou deveria saber ser enganosa ou abusiva:
Pena Detenção de três meses a um ano e multa.
Parágrafo único. (Vetado)."

## NOTA HONESTA (retificação da premissa da rodada)
No rol dos arts. 63-75 do CDC NÃO há disposição expressa de "reincidência" nem de "óbice à fiscalização" — a premissa não se confirma no texto oficial. O art. 67 pune a publicidade enganosa/abusiva; o art. 71 pune cobrança com constrangimento; o art. 75 (concurso de pessoas) e o tratamento da reincidência ficam no regime geral (CP). Registrado como consta.

## Leitura aplicada
- Art. 65: crime de desobediência QUALIFICADA por perigo (contrariar determinação de autoridade); § 1º — concurso com lesão corporal/homicídio; § 2º — inciso XIV do art. 39 (promoção/publicidade de serviços perigosos).
- Art. 66: afirmação falsa/enganosa ou OMISSÃO RELEVANTE sobre natureza/qualidade/quantidade/segurança/desempenho/durabilidade/preço/garantia; § 1º pega quem PATROCINA a oferta (anunciante/agência); § 2º culposo.
- Art. 67: publicidade enganosa ou abusiva com DOLO eventual (sabe ou deveria saber) — espelho penal da conduta do art. 37 CDC (civil, já na base).
- JECrim: penas de 3 meses a 2 anos → menor potencial ofensivo (art. 61 da 9.099).`,
    ['65', '66', '67'], URL_CDC,
    {
      tags: ['penal/jecrim-menor-ofensividade', 'consumidor/fato-produto-servico'],
      relacionamentos: [
        { destinoSlug: 'cdc-art63-64-nocividade-comunicacao', tipo: 'COMPLEMENTA', descricao: 'Mesmo Capítulo VII.' },
      ],
    },
  ),
  legPenal(
    'cp-art171-estelionato-fraude-eletronica',
    'CP art. 171 — Estelionato: caput (red. Lei 15.397/2026 como consta no Planalto), § 2º VI (cheque), § 2º VII (conta laranja), § 2º-A fraude eletrônica, § 2º-B (servidor no exterior), § 3º e § 4º (idoso/vulnerável) (texto literal confirmado)',
    'penal', 'crimes-patrimoniais', 'Estelionato e fraude eletrônica',
    `## Ficha da Norma
- **Norma:** Decreto-Lei 2.848/1940 (Código Penal) — art. 171.

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 171 - Obter, para si ou para outrem, vantagem ilícita, em prejuízo alheio, induzindo ou mantendo alguém em erro, mediante artifício, ardil, ou qualquer outro meio fraudulento:
Pena - reclusão, de 1 (um) a 5 (cinco) anos, e multa. (Redação dada pela Lei nº 15.397, de 2026)
§ 1º - Se o criminoso é primário, e é de pequeno valor o prejuízo, o juiz pode aplicar a pena conforme o disposto no art. 155, § 2º.
§ 2º - Nas mesmas penas incorre quem:
[...] Fraude no pagamento por meio de cheque
VI - emite cheque, sem suficiente provisão de fundos em poder do sacado, ou lhe frustra o pagamento.
Cessão de conta laranja (Incluído pela Lei nº 15.397, de 2026)
VII – cede, gratuita ou onerosamente, conta bancária para que nela transitem recursos destinados ao financiamento de atividade criminosa ou que dela sejam fruto. (Incluído pela Lei nº 15.397, de 2026)
Fraude eletrônica
§ 2º-A. A pena é de reclusão, de 4 (quatro) a 8 (oito) anos, e multa, se a fraude é cometida com a utilização de informações fornecidas pela vítima ou por terceiro induzido a erro por meio de redes sociais, contatos telefônicos, envio de correio eletrônico fraudulento, duplicação de dispositivo eletrônico ou aplicação de internet, ou por qualquer outro meio fraudulento análogo. (Redação dada pela Lei nº 15.397, de 2026)
§ 2º-B. A pena prevista no § 2º-A deste artigo, considerada a relevância do resultado gravoso, aumenta-se de 1/3 (um terço) a 2/3 (dois terços), se o crime é praticado mediante a utilização de servidor mantido fora do território nacional. (Incluído pela Lei nº 14.155, de 2021)
§ 3º - A pena aumenta-se de um terço, se o crime é cometido em detrimento de entidade de direito público ou de instituto de economia popular, assistência social ou beneficência.
Estelionato contra idoso ou vulnerável (Redação dada pela Lei nº 14.155, de 2021)
§ 4º A pena aumenta-se de 1/3 (um terço) ao dobro, se o crime é cometido contra idoso ou vulnerável, considerada a relevância do resultado gravoso. (Redação dada pela Lei nº 14.155, de 2021)"

## NOTA HONESTA (retificações da premissa da rodada)
1. O § 2º VI do art. 171 é a FRAUDE NO PAGAMENTO POR MEIO DE CHEQUE — NÃO é a "fraude eletrônica". A fraude eletrônica é o § 2º-A (incluído pela Lei 14.155/2021; o texto oficial do Planalto na consulta traz a redação dada pela Lei 15.397, de 2026, pena reclusão 4-8 anos + multa, e § 1º do caput/caput e inciso VII também com redações da mesma lei) — registrado COMO CONSTA, sem julgar vigência além do que a fonte oficial exibe.
2. Consequência prática de rota: com pena MÍNIMA de reclusão SUPERIOR a 2 anos (4-8), o § 2º-A NÃO é infração de menor potencial ofensivo → NÃO vai a JECrim; o § 2º VI (cheque, mesmas penas do caput: reclusão 1-5) também excede o teto do art. 61 da 9.099 → vara criminal comum.
3. O art. 311-A do CP é "fraudes em certames de interesse público" (ficha própria) — não confundir com fraude eletrônica.

## Leitura aplicada
- Elementos do caput: vantagem ilícita + prejuízo alheio + erro (induzido/mantido) + meio fraudulento.
- § 2º VI (cheque): emissão SEM provisão de fundos em poder do SACADO ou frustração do pagamento — defesa típica: provisão disponível no prazo legal de apresentação, pós-datado com acordo.
- § 2º-A: fraude eletrônica por obtenção de INFORMAÇÕES da vítima/terceiro induzido a erro (phishing, golpes de telefone, redes sociais) — pena agrava: reclusão 4-8.
- § 2º-B: servidor no exterior → +1/3 a 2/3; § 3º: contra ente público/institutos → +1/3; § 4º: idoso/vulnerável → +1/3 a 2x.
- § 1º: substituição de pena para primário com prejuízo de pequeno valor (referência ao art. 155 § 2º).`,
    ['171'], URL_CP,
    {
      tags: ['penal/crimes-patrimoniais', 'penal/jecrim-menor-ofensividade'],
      relacionamentos: [
        { destinoSlug: 'lei-9099-jecrim-arts-60-61-72-76', tipo: 'CONEXO_TEMATICO', descricao: 'Teto do menor potencial ofensivo (2 anos) exclui o § 2º-A do JECrim.' },
        { destinoSlug: 'cp-art311-a-fraude-certames', tipo: 'CONEXO_TEMATICO', descricao: 'Ficha da 311-A retificando a premissa.' },
      ],
    },
  ),
  legPenal(
    'cp-art311-a-fraude-certames',
    'CP art. 311-A — Fraudes em certames de interesse público: conteúdo sigiloso de concurso, avaliação/exame públicos, vestibular e exames previstos em lei (texto literal confirmado)',
    'penal', 'crimes-patrimoniais', 'Fraude em concursos e certames',
    `## Ficha da Norma
- **Norma:** Decreto-Lei 2.848/1940 (CP) — Capítulo V do Título XI, "Das fraudes em certames de interesse público" (Incluído pela Lei 12.550, de 2011).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30) — condensado
"Art. 311-A. Utilizar ou divulgar, indevidamente, com o fim de beneficiar a si ou a outrem, ou de comprometer a credibilidade do certame, conteúdo sigiloso de:
I - concurso público;
II - avaliação ou exame públicos;
III - processo seletivo para ingresso no ensino superior; ou
IV - exame ou processo seletivo previstos em lei:
Pena - reclusão, de 1 (um) a 4 (quatro) anos, e multa. (Incluído pela Lei 12.550, de 2011)
§ 1º Nas mesmas penas incorre quem permite ou facilita, por qualquer meio, o acesso de pessoas não autorizadas às informações mencionadas no caput. (Incluído pela Lei 12.550, de 2011)"

## NOTA HONESTA
O art. 311-A do CP é o crime de FRAUDE EM CERTAMES (conteúdo sigiloso de concurso/avaliação/vestibular) — NÃO é dispositivo de "fraude eletrônica" (que é o art. 171 § 2º-A). Retificação registrada para impedir enquadramento trocado.

## Leitura aplicada
- Núcleo: UTILIZAR ou DIVULGAR indevidamente conteúdo SIGILOSO, para beneficiar a si/outrem ou comprometer a credibilidade do certame.
- § 1º: facilitador (quem permite/facilita acesso não autorizado) — ex.: servidor da banca.
- Pena: reclusão 1-4 anos → fora do JECrim (art. 61 da 9.099: máximo 2 anos).`,
    ['311-A'], URL_CP,
    {
      metadados: { numero: 'Decreto-Lei 2.848/1940 (CP)', orgao: 'Congresso Nacional', artigos_principais: ['311-A'], vigente: true, confirmacao_texto: 'Extração literal do Planalto em 2026-08-30 (download verbatim).' },
    },
  ),
  legPenal(
    'lei9099-art62-63-criterios-competencia',
    'Lei 9.099/1995 arts. 62-63 — Critérios do processo no Juizado Especial (oralidade, simplicidade, informalidade — redação Lei 13.603/2018) e competência territorial pelo lugar da infração (texto literal confirmado)',
    'penal', 'jecrim-menor-ofensividade', 'JECrim — critérios e competência territorial',
    `## Ficha da Norma
- **Norma:** Lei 9.099/1995. NOTA HONESTA: os arts. 60, 61, 72, 74 e 76 JÁ estão literais na base (lei-9099-jecrim-arts-60-61-72-76, LOTE-012) — este documento COMPLETA a sequência sem duplicar.

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 62. O processo perante o Juizado Especial orientar-se-á pelos critérios da oralidade, simplicidade, informalidade, economia processual e celeridade, objetivando, sempre que possível, a reparação dos danos sofridos pela vítima e a aplicação de pena não privativa de liberdade. (Redação dada pela Lei nº 13.603, de 2018)
Seção I
Da Competência e dos Atos Processuais
Art. 63. A competência do Juizado será determinada pelo lugar em que foi praticada a infração penal."

## Leitura aplicada
- Art. 62: os 5 critérios + 2 OBJETIVOS do sistema (reparação da vítima; pena não privativa de liberdade) — bússola para aceitar transação/composição.
- Art. 63: competência TERRITORIAL = lugar da infração (ponte com CPP; no JECrim sem "domicílio do réu") — perguntar de triagem: ONDE ocorreu o fato.`,
    ['62', '63'], URL_9099,
    {
      relacionamentos: [
        { destinoSlug: 'lei-9099-jecrim-arts-60-61-72-76', tipo: 'COMPLEMENTA', descricao: 'Completa arts. 62-63; 60-61 já literais na base (LOTE-012).' },
      ],
    },
  ),
  legPenal(
    'lei9099-art65-68-atos-processuais',
    'Lei 9.099/1995 arts. 65-68 — Validade sem prejuízo, citação pessoal no Juizado ou por mandado, intimação e comparecimento com advogado sob pena de defensor público (texto literal confirmado)',
    'penal', 'jecrim-menor-ofensividade', 'JECrim — atos processuais',
    `## Ficha da Norma
- **Norma:** Lei 9.099/1995.

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 65. Os atos processuais serão válidos sempre que preencherem as finalidades para as quais foram realizados, atendidos os critérios indicados no art. 62 desta Lei.
§ 1º Não se pronunciará qualquer nulidade sem que tenha havido prejuízo.
§ 2º A prática de atos processuais em outras comarcas poderá ser solicitada por qualquer meio hábil de comunicação.
§ 3º Serão objeto de registro escrito exclusivamente os atos havidos por essenciais. Os atos realizados em audiência de instrução e julgamento poderão ser gravados em fita magnética ou equivalente.
Art. 66. A citação será pessoal e far-se-á no próprio Juizado, sempre que possível, ou por mandado.
Parágrafo único. Não encontrado o acusado para ser citado, o Juiz encaminhará as peças existentes ao Juízo comum para adoção do procedimento previsto em lei.
Art. 67. A intimação far-se-á por correspondência, com aviso de recebimento pessoal ou, tratando-se de pessoa jurídica ou firma individual, mediante entrega ao encarregado da recepção, que será obrigatoriamente identificado, ou, sendo necessário, por oficial de justiça, independentemente de mandado ou carta precatória, ou ainda por qualquer meio idôneo de comunicação.
Parágrafo único. Dos atos praticados em audiência considerar-se-ão desde logo cientes as partes, os interessados e defensores.
Art. 68. Do ato de intimação do autor do fato e do mandado de citação do acusado, constará a necessidade de seu comparecimento acompanhado de advogado, com a advertência de que, na sua falta, ser-lhe-á designado defensor público."

## Leitura aplicada
- Art. 65: PAS de nada (nulidade sem prejuízo) + registro mínimo (essenciais; gravação no AIJ) — arsenal de defesa contra "regras de forma" no sumariíssimo.
- Art. 66: citação PESSOAL (juizado ou mandado); § único — acusado não localizado → peças ao JUÍZO COMUM (procedimento comum; NÃO há citação editalícia no JECrim).
- Art. 67: intimações flexíveis; § único — ciência desde logo dos atos em audiência (preclusão imediata: protestar NA audiência).
- Art. 68: advertência de comparecer COM advogado, sob pena de designação de defensor público — direito do acusado; para o autor do fato, a intimação já traz o aviso.`,
    ['65', '66', '67', '68'], URL_9099,
  ),
  legPenal(
    'lei9099-art75-76-representacao-transacao',
    'Lei 9.099/1995 arts. 75-76 — Representação verbal na audiência preliminar (sem decadência) e proposta de transação penal: impedimentos, redução da multa pela metade e não reincidência (texto literal confirmado — complemento dos arts. 74/76 já na base)',
    'penal', 'jecrim-menor-ofensividade', 'JECrim — representação e transação penal',
    `## Ficha da Norma
- **Norma:** Lei 9.099/1995. NOTA HONESTA: art. 74 e art. 76 (caput, §§ 1º, 2º I-III, 4º e 6º) JÁ estão literais na base (LOTE-012) — esta ficha COMPLETA com o art. 75 e os §§ 3º e 5º do art. 76.

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 75. Não obtida a composição dos danos civis, será dada imediatamente ao ofendido a oportunidade de exercer o direito de representação verbal, que será reduzida a termo.
Parágrafo único. O não oferecimento da representação na audiência preliminar não implica decadência do direito, que poderá ser exercido no prazo previsto em lei.
Art. 76. [...] (caput e §§ 1º, 2º I-III, 4º e 6º — ver LOTE-012)
§ 3º Aceita a proposta pelo autor da infração e seu defensor, será submetida à apreciação do Juiz.
§ 5º Da sentença prevista no parágrafo anterior caberá a apelação referida no art. 82 desta Lei."

## Leitura aplicada
- Art. 75: se a composição falha, o ofendido pode REPRESENTAR VERBALMENTE ali mesmo (reduzida a termo); § único — a omissão NÃO decadencia o direito (prazo legal de representação permanece — art. 38 CPP: 6 meses, verificação em ficha própria).
- Art. 76 § 3º: proposta aceita pelo autor + defensor → homologação pelo juiz; § 5º — caberá APELAÇÃO (art. 82) contra a sentença da transação.
- Defesa da vítima: composição feita NÃO exige renúncia fora do art. 74 § único (ações penais públicas incondicionadas seguem independentemente da composição civil).`,
    ['75', '76'], URL_9099,
    {
      relacionamentos: [
        { destinoSlug: 'lei-9099-jecrim-arts-60-61-72-76', tipo: 'COMPLEMENTA', descricao: 'Completa art. 75 e §§ 3º/5º do 76.' },
      ],
    },
  ),
  legPenal(
    'lei9099-art89-suspensao-processo',
    'Lei 9.099/1995 art. 89 — Suspensão condicional do processo (2 a 4 anos): condições, revogação, extinção da punibilidade e não-prescrição (texto literal confirmado)',
    'penal', 'jecrim-menor-ofensividade', 'JECrim — suspensão condicional do processo',
    `## Ficha da Norma
- **Norma:** Lei 9.099/1995.

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 89. Nos crimes em que a pena mínima cominada for igual ou inferior a um ano, abrangidos ou não por esta Lei, o Ministério Público, ao oferecer a denúncia, poderá propor a suspensão do processo, por dois a quatro anos, desde que o acusado não esteja sendo processado ou não tenha sido condenado por outro crime, presentes os demais requisitos que autorizariam a suspensão condicional da pena (art. 77 do Código Penal).
§ 1º Aceita a proposta pelo acusado e seu defensor, na presença do Juiz, este, recebendo a denúncia, poderá suspender o processo, submetendo o acusado a período de prova, sob as seguintes condições:
I - reparação do dano, salvo impossibilidade de fazê-lo;
II - proibição de freqüentar determinados lugares;
III - proibição de ausentar-se da comarca onde reside, sem autorização do Juiz;
IV - comparecimento pessoal e obrigatório a juízo, mensalmente, para informar e justificar suas atividades.
§ 2º O Juiz poderá especificar outras condições a que fica subordinada a suspensão, desde que adequadas ao fato e à situação pessoal do acusado.
§ 3º A suspensão será revogada se, no curso do prazo, o beneficiário vier a ser processado por outro crime ou não efetuar, sem motivo justificado, a reparação do dano.
§ 4º A suspensão poderá ser revogada se o acusado vier a ser processado, no curso do prazo, por contravenção, ou descumprir qualquer outra condição imposta.
§ 5º Expirado o prazo sem revogação, o Juiz declarará extinta a punibilidade.
§ 6º Não correrá a prescrição durante o prazo de suspensão do processo.
§ 7º Se o acusado não aceitar a proposta prevista neste artigo, o processo prosseguirá em seus ulteriores termos."

## Leitura aplicada
- Cabimento: pena MÍNIMA ≤ 1 ano (mesmo fora da 9.099) — rota do "sursis processual".
- Requisitos pessoais: não estar processado/condenado por outro crime + requisitos do art. 77 CP (referência do próprio texto).
- Condições legais (I-IV) + outras condições (§ 2º); REVOGAÇÃO obrigatória (§ 3º: novo crime ou reparação não feita sem justificativa) e FACULTATIVA (§ 4º).
- Prêmio: extinção da punibilidade (§ 5º); CUSTO: prescrição NÃO corre durante o período (§ 6º) — decidir aceitar × prosseguir (§ 7º) com o cliente.
- Estratégia da vítima/consumidor: negociar a REPARAÇÃO DO DANO como condição I antes de aceitar.`,
    ['89'], URL_9099,
  ),
  {
    slug: 'ponte-mg-legislacao-penal-estadual',
    titulo: 'PONTE MG — Mapa de verificação da legislação penal ESTADUAL mineira (Código Ambiental MG etc. — REVISÃO HUMANA, zero artigos citados como verificados)',
    tipoDocumento: 'DOUTRINA',
    area: 'penal',
    subarea: 'crimes-ambientais',
    assunto: 'Legislação penal estadual MG — documento-ponte',
    prioridade: 'P2',
    lote: 'LOTE-025',
    conteudo: `# PONTE DE VERIFICAÇÃO — LEGISLAÇÃO PENAL ESTADUAL DE MINAS GERAIS
**Status: REVISAO_HUMANA | Confiabilidade C.** Os portais estaduais (almg.gov.br, mg.gov.br, iof.mg, tjmg.jus.br) ficaram INACESSÍVEIS nesta consulta (2026-08-30). Este documento registra a EXISTÊNCIA presumida de normas estaduais com natureza penal/administrativa sancionadora para verificação futura — ZERO artigos ou números de lei estadual são afirmados como verificados (regra anti-invenção).

## Normas a verificar (só existência e vigência nesta ponte)
1. Código Ambiental do Estado de Minas Gerais (norma estadual de proteção ambiental com parte sancionatória administrativa) — verificar número, vigência e parte penal/administrativa na ALMG.
2. Lei estadual de infrações administrativas ambientais correlata (multas e sanções do órgão ambiental estadual).
3. Legislação estadual correlata ao CDC (defesa do consumidor) — ponte do LOTE-024.
4. Regulamento de organização judiciária do TJMG para JECrim/JEC FP (instalação de juizados — arts. 14/22 da Lei 12.153).

## Por que importa
Infrações de menor potencial ofensivo criadas em LEI ESTADUAL (ex.: ambientais) podem trafegar no JECrim estadual (art. 61 da 9.099) — mas SÓ após captura literal do texto na fonte oficial.

## URLs oficiais candidatas para a rodada futura (NÃO verificadas nesta consulta)
- https://www.almg.gov.br (busca de normas estaduais)
- https://www.mg.gov.br (portal do Estado — órgãos de fiscalização)
- https://www.tjmg.jus.br (organização judiciária, juizados instalados)

## Regra de uso no EJC
Este documento NÃO fundamenta afirmação sobre direito penal estadual mineiro. Enquanto não capturado, responder apenas com fontes FEDERAIS (A) e marcar o dado estadual como "a verificar".`,
    tags: ['penal/crimes-ambientais', 'geral/metodologia'],
    fonte: 'Portais oficiais MG — PENDENTES de captura (almg.gov.br / mg.gov.br / tjmg.jus.br bloqueados na consulta 2026-08-30)',
    urlFonte: 'https://www.mg.gov.br',
    dataConsulta: D,
    confiabilidade: 'C',
    vigente: true,
    status: 'REVISAO_HUMANA',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-09-30',
    relacionamentos: [
      { destinoSlug: 'ponte-mg-procon-defesa-consumidor', tipo: 'CONEXO_TEMATICO', descricao: 'Ponte irmã do LOTE-024.' },
      { destinoSlug: 'lei9099-art62-63-criterios-competencia', tipo: 'CONEXO_TEMATICO', descricao: 'Rota estadual no JECrim pendente de verificação.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'tese-crimes-consumidor-cdc-cp',
    titulo: 'Tese — Enquadramento penal das relações de consumo: crimes do CDC (63-68) no JECrim × estelionato/fraude eletrônica (CP 171) no juízo comum',
    tipoDocumento: 'TESE',
    area: 'penal',
    subarea: 'jecrim-menor-ofensividade',
    assunto: 'Enquadramento de crimes de consumo',
    prioridade: 'P1',
    lote: 'LOTE-025',
    conteudo: `## Tese
Condutas lesivas ao consumidor se dividem em DUAS rotas penais: (a) crimes PROPRIAMENTE do CDC (arts. 63-68) — omissão de perigo, não-comunicação/recolhimento, serviço perigoso contra ordem, afirmação falsa e publicidade enganosa/abusiva — com penas de detenção ≤ 2 anos → JECrim (art. 61 da 9.099); (b) ESTELIONATO e fraude eletrônica (CP art. 171 caput/§ 2º VI/§ 2º-A) — penas de RECLUSÃO acima do teto → vara criminal comum, com as agravantes do § 3º (ente público) e § 4º (idoso/vulnerável) na prática de golpes.

## Requisitos da rota (a) — CDC no JECrim
1. Conduta típica literal (arts. 63-67 — fichas deste lote).
2. Pena máxima ≤ 2 anos e sem procedimento especial (art. 61 da 9.099, red. Lei 11.313/2006).
3. Fase preliminar (termo circunstanciado — art. 69) com composição/transação.

## Requisitos da rota (b) — CP 171
1. Engodo (erro/ardil) + vantagem ilícita + prejuízo (caput).
2. Cheque sem fundos: § 2º VI (defesa: provisão em poder do sacado no prazo de apresentação).
3. Golpe eletrônico: § 2º-A (informações obtidas por redes sociais/telefone/e-mail/internet) — reclusão 4-8, JAMAIS JECrim; agravações §§ 2º-B/3º/4º.

## Contra-argumentos e respostas
- "Sempre caberá JECrim por ser crime de consumo." RESPOSTA: NÃO — o critério é a PENA (art. 61); fraude eletrônica excede o teto.
- "Publicidade enganosa exige prova do prejuízo individual." RESPOSTA: crime de PERIGO abstrato à coletividade (art. 67); o dano individual corre na esfera cível (art. 14/37 CDC).
- "Nulidade por ausência de advogado na citação." RESPOSTA: art. 68 advertência + defensor público designado; nulidade só com PREJUÍZO (art. 65 § 1º).

## Probabilidade qualitativa
- Enquadramento CDC no JECrim: ALTA quando a conduta está literal no rol 63-68.
- Desclassificação de fraude eletrônica para JECrim: NULA (incompatível com o teto).`,
    tags: ['penal/jecrim-menor-ofensividade', 'penal/crimes-patrimoniais'],
    fonte: EJC,
    urlFonte: URL_9099,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'regra-se-entao-jecrim', tipo: 'REGRA_INTELIGENCIA', descricao: 'Implementação SE-ENTÃO.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'peca-defesa-preliminar-jecrim',
    titulo: 'Peça-modelo — Defesa preliminar/resposta no JECrim (Lei 9.099) com 18 variáveis e checklist embutido',
    tipoDocumento: 'PECA',
    area: 'penal',
    subarea: 'jecrim-menor-ofensividade',
    assunto: 'Defesa no JECrim',
    prioridade: 'P1',
    lote: 'LOTE-025',
    conteudo: `# DEFESA NO PROCEDIMENTO SUMARIÍSSIMO — JECrim (Lei 9.099/1995)
**Modelo com variáveis {{ }} — NÃO é minuta definitiva sem revisão humana.**

EXCELENTÍSSIMO(A) SENHOR(A) JUIZ(A) DO {{nome_juizado}} — JUIZADO ESPECIAL CRIMINAL DE {{comarca}}

Processo nº {{numero_processo}} — Autor do fato/Acusado: {{nome_acusado}}, {{nacionalidade_acusado}}, {{estado_civil_acusado}}, {{profissao_acusado}}, RG {{rg_acusado}}, CPF {{cpf_acusado}}, residente em {{endereco_acusado}}, por seu advogado ({{advogado_nome}}, OAB {{oab_advogado}}) ou Defensor Público ({{defensoria_nome}}), vem, respeitosamente, apresentar

## DEFESA / MANIFESTAÇÃO
em face da denúncia/termo de ocorrência pelo crime do art. {{artigo_apontado}} ({{tipo_crime}} — {{nome_da_lei}}).

## 1. PRELIMINARES (art. 65 da Lei 9.099)
a) {{preliminar_1 — ex.: incompetência territorial: infração praticada em {{local_infracao}}, fora desta circunscrição (art. 63)}};
b) {{preliminar_2 — ex.: ausência de prejuízo/invalidade do termo}} — sem prejuízo, não há nulidade (art. 65 § 1º).

## 2. MÉRITO
a) Atipicidade/inexigibilidade: {{motivo_atipicidade}};
b) Excludentes: {{excludente}};
c) Circunstâncias pessoais: {{antecedentes}}, {{conduta_social}}, {{personalidade_acusado}}.

## 3. DOS INSTITUTOS DESLEZADORES (Lei 9.099)
a) COMPROMISSO de comparecimento: {{aceita_composicao}} — proposta de composição civil (art. 74) em {{condicoes_composicao}};
b) Transação penal (art. 76): {{aceita_transacao}} — aceita proposta de {{pena_proposta}} por {{razoes_transacao}};
c) Suspensão condicional do processo (art. 89, se cabível): {{aceita_suspensao}} — condições {{condicoes_suspensao}}.

## 4. DOS PEDIDOS
a) {{pedido_final}}; b) produção de prova: {{testemunhas_defesa}} (requer intimação mínima de 5 dias antes — art. 78 § 1º); c) presença em audiência em {{data_audiencia}}.

{{local_data}} — {{advogado_nome}}

## CHECKLIST EMBUTIDO
- [ ] É menor potencial ofensivo? (pena máxima ≤ 2 anos — art. 61; se fraude eletrônica 171 § 2º-A → JECrim INCOMPATÍVEL)
- [ ] Território: lugar da infração (art. 63)?
- [ ] Composição civil propuesta? (renúncia à queixa/representação — art. 74 § único)
- [ ] Transação aceitável? (verificar impedimentos do art. 76 § 2º — condenação anterior / benefício nos últimos 5 anos)
- [ ] Suspensão condicional do processo cabível? (pena mínima ≤ 1 ano — art. 89)
- [ ] Testemunhas requeridas com 5 dias de antecedência (art. 78 § 1º)`,
    tags: ['penal/jecrim-menor-ofensividade'],
    fonte: EJC,
    urlFonte: URL_9099,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'checklist-jecrim-defesa', tipo: 'BASE_PRATICA', descricao: 'Checklist completo.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'checklist-jecrim-defesa',
    titulo: 'Checklist — Defesa no JECrim (12 pontos: admissibilidade do menor potencial ofensivo, fase preliminar e institutos despenalizadores)',
    tipoDocumento: 'CHECKLIST',
    area: 'penal',
    subarea: 'jecrim-menor-ofensividade',
    assunto: 'Checklist de defesa — JECrim',
    prioridade: 'P1',
    lote: 'LOTE-025',
    conteudo: `# CHECKLIST DE DEFESA — JECrim (Lei 9.099/1995)
1. **Menor potencial ofensivo**: pena máxima ≤ 2 anos, cumulada ou não com multa (art. 61, red. Lei 11.313/2006); sem procedimento especial.
2. **Exclusão automática**: se a imputação é fraude eletrônica (CP 171 § 2º-A — reclusão 4-8) ou fraude em certames (311-A — reclusão 1-4) → NÃO é JECrim.
3. **Território**: infração praticada NESTE juizado (art. 63) — senão, preliminar de incompetência.
4. **Termo circunstanciado** (art. 69): lavrado? autor encaminhado/compromisso de comparecimento → sem flagrante/fiança (§ único).
5. **Citação pessoal** (art. 66): no próprio juizado ou mandado; não localizado → juízo comum (§ único) — verificar se o rito permanece sumariíssimo.
6. **Advogado/defensor** (art. 68): advertência presente no ato? Falta de advogado → designar defensor público, não fechar audiência.
7. **Nulidades** (art. 65): só com PREJUÍZO demonstrado (§ 1º) — apontar prejuízo concreto.
8. **Composição civil** (art. 74): título executivo no juízo civil + renúncia à queixa/representação (ações privadas/condicionadas).
9. **Transação penal** (art. 76): impedimentos do § 2º (condenado à privativa por sentença definitiva; beneficiado nos últimos 5 anos; medidas insuficientes); multa reduzida até a metade (§ 1º); não gera reincidência (§ 4º).
10. **Suspensão condicional do processo** (art. 89): pena mínima ≤ 1 ano; condições I-IV; prescrição NÃO corre durante (§ 6º) — pesar no cliente.
11. **Audiência** (arts. 80-81): nada se adia; defensor responde à acusação; provas podem ser limitadas (§ 1º) — requerer as essenciais.
12. **Recursos** (arts. 82-83): apelação 10 dias (sentença/rejeição); resposta do recorrido 10 dias (§ 2º); embargos 5 dias (art. 83).`,
    tags: ['penal/jecrim-menor-ofensividade'],
    fonte: EJC,
    urlFonte: URL_9099,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'peca-defesa-preliminar-jecrim', tipo: 'BASE_PRATICA', descricao: 'Peça correspondente.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'fluxo-jecrim',
    titulo: 'Fluxo — JECrim em 6 etapas: termo circunstanciado → audiência preliminar (composição/transação) → denúncia oral → AIJ → sentença/apelação → extinções',
    tipoDocumento: 'FLUXO',
    area: 'penal',
    subarea: 'jecrim-menor-ofensividade',
    assunto: 'Fluxo completo — JECrim',
    prioridade: 'P1',
    lote: 'LOTE-025',
    conteudo: `# FLUXO DO JUIZADO ESPECIAL CRIMINAL (Lei 9.099/1995)

## Etapa 1 — Termo circunstanciado (art. 69)
Autoridade policial lavra TC e encaminha IMEDIATAMENTE ao Juizado com autor do fato e vítima; se encaminhado/compromissado, SEM flagrante nem fiança (§ único).

## Etapa 2 — Audiência preliminar (arts. 72-75)
Juiz esclarece composição dos danos e transação (art. 72); conciliação conduzida por juiz/conciliador (art. 73); COMPOSIÇÃO → sentença irrecorrível + título civil + renúncia à queixa/representação (art. 74); sem composição → representação VERBAL na hora (art. 75), sem decadência (§ único).

## Etapa 3 — Proposta/denúncia (art. 76-77)
MP propõe transação (aplicação imediata de restritiva/multa) OU denúncia ORAL, dispensado inquérito (art. 77); complexidade → peças ao juízo comum (§ 2º).

## Etapa 4 — Citação e AIJ (arts. 78, 80-81)
Citado na denúncia ou por mandado; testemunhas requeridas 5 dias antes (art. 78 § 1º); audiência única: defensor responde → recebimento → vítima/testemunhas → interrogatório → debates → sentença (art. 81).

## Etapa 5 — Recursos (arts. 82-83)
Apelação (rejeição de denúncia/queixa e sentença) em 10 dias; resposta em 10 dias (§ 2º); embargos de declaração 5 dias (art. 83).

## Etapa 6 — Extinções e execução
Composição homologada (renúncia em ações privadas/condicionadas); transação aplicada (não gera reincidência — art. 76 § 4º); suspensão condicional do processo cumprida → EXTINÇÃO DA PUNIBILIDADE (art. 89 § 5º).`,
    tags: ['penal/jecrim-menor-ofensividade'],
    fonte: EJC,
    urlFonte: URL_9099,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'fluxo-jec-pedido-a-execucao', tipo: 'CONEXO_TEMATICO', descricao: 'Fluxo cível do JEC (LOTE-012).' },
    ],
  } satisfies InputDocument,
  {
    slug: 'prazo-jecrim-suspensao-processo-2-4-anos',
    titulo: 'Prazo — Suspensão condicional do processo (JECrim): período de prova de 2 a 4 anos, sem prescrição durante (art. 89 da Lei 9.099)',
    tipoDocumento: 'PRAZO',
    area: 'penal',
    subarea: 'jecrim-menor-ofensividade',
    assunto: 'Suspensão condicional do processo',
    prioridade: 'P1',
    lote: 'LOTE-025',
    conteudo: `## Prazo LITERAL
**2 a 4 anos** — período de suspensão do processo submetido a condições.

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 89. [...] o Ministério Público, ao oferecer a denúncia, poderá propor a suspensão do processo, por dois a quatro anos, desde que o acusado não esteja sendo processado ou não tenha sido condenado por outro crime [...] (...)
§ 5º Expirado o prazo sem revogação, o Juiz declarará extinta a punibilidade.
§ 6º Não correrá a prescrição durante o prazo de suspensão do processo."

## Termo inicial e operação
- Termo: recebimento da denúncia com a suspensão (art. 89 § 1º).
- Efeitos: cumprido sem revogação → extinção da punibilidade (§ 5º); revogação por novo crime/falta de reparação (§ 3º) ou descumprimento (§ 4º); PRESCRIÇÃO SUSPENSA durante o período (§ 6º).`,
    metadados: { numero: 'Lei 9.099/1995', artigos_principais: ['89'], vigente: true, confirmacao_texto: 'Extração literal do Planalto em 2026-08-30' },
    tags: ['penal/jecrim-menor-ofensividade', 'geral/prazos'],
    fonte: PLANALTO,
    urlFonte: URL_9099,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'lei9099-art89-suspensao-processo', tipo: 'BASE_PRATICA', descricao: 'Ficha completa do instituto.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'prazo-jecrim-transacao-beneficio-5-anos',
    titulo: 'Prazo — Transação penal (JECrim): benefício anterior nos últimos 5 anos impede nova proposta e registro vale só por 5 anos (art. 76 §§ 2º II e 4º da Lei 9.099)',
    tipoDocumento: 'PRAZO',
    area: 'penal',
    subarea: 'jecrim-menor-ofensividade',
    assunto: 'Transação penal — janela de 5 anos',
    prioridade: 'P2',
    lote: 'LOTE-025',
    conteudo: `## Prazo LITERAL
**5 (cinco) anos** — janela do benefício da transação penal.

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 76. [...]
§ 2º Não se admitirá a proposta se ficar comprovado: [...]
II - ter sido o agente beneficiado anteriormente, no prazo de cinco anos, pela aplicação de pena restritiva ou multa, nos termos deste artigo; [...]
§ 4º Acolhendo a proposta do Ministério Público aceita pelo autor da infração, o Juiz aplicará a pena restritiva de direitos ou multa, que não importará em reincidência, sendo registrada apenas para impedir novamente o mesmo benefício no prazo de cinco anos."

## Termo inicial e operação
- Termo: data da aplicação anterior da pena restritiva/multa em transação.
- Operação: antes de pedir/aceitar transação, conferir se houve benefício nos últimos 5 anos (impedimento legal); a anotação serve APENAS a esse fim (§ 4º) e não gera reincidência.`,
    metadados: { numero: 'Lei 9.099/1995', artigos_principais: ['76'], vigente: true, confirmacao_texto: 'Extração literal do Planalto em 2026-08-30' },
    tags: ['penal/jecrim-menor-ofensividade', 'geral/prazos'],
    fonte: PLANALTO,
    urlFonte: URL_9099,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'lei9099-art75-76-representacao-transacao', tipo: 'BASE_PRATICA', descricao: 'Ficha do art. 76.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'prazo-jecrim-apelacao-embargos-10-5-dias',
    titulo: 'Prazo — JECrim: apelação em 10 dias e resposta do recorrido em 10 dias (art. 82); embargos de declaração em 5 dias (art. 83 da Lei 9.099)',
    tipoDocumento: 'PRAZO',
    area: 'penal',
    subarea: 'jecrim-menor-ofensividade',
    assunto: 'Recursos no JECrim',
    prioridade: 'P1',
    lote: 'LOTE-025',
    conteudo: `## Prazos LITERAIS
- **Apelação: 10 dias** (decisão de rejeição de denúncia/queixa e sentença), com razões na petição;
- **Resposta do recorrido: 10 dias**;
- **Embargos de declaração: 5 dias** (por escrito ou oralmente), suspendendo o prazo recursal quando opostos contra sentença (redação original do art. 83 § 2º — o texto oficial traz também a redação dada pela Lei 13.105/2015 com interrupção; anotado como consta).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 82. Da decisão de rejeição da denúncia ou queixa e da sentença caberá apelação, que poderá ser julgada por turma composta de três Juízes em exercício no primeiro grau de jurisdição, reunidos na sede do Juizado.
§ 1º A apelação será interposta no prazo de dez dias, contados da ciência da sentença pelo Ministério Público, pelo réu e seu defensor, por petição escrita, da qual constarão as razões e o pedido do recorrente.
§ 2º O recorrido será intimado para oferecer resposta escrita no prazo de dez dias. [...]
Art. 83. Cabem embargos de declaração quando, em sentença ou acórdão, houver obscuridade, contradição ou omissão. (Redação dada pela Lei nº 13.105, de 2015)
§ 1º Os embargos de declaração serão opostos por escrito ou oralmente, no prazo de cinco dias, contados da ciência da decisão. [...]"

## Operação
- Diferente do recurso INOMINADO cível (10 dias ÚTEIS — art. 42), a apelação do JECrim é de 10 dias CORRIDOS do texto (art. 82 § 1º) — conferir a contagem no caso concreto e a jurisprudência local antes de protocolar (nota honesta: o texto não diz "úteis").`,
    metadados: { numero: 'Lei 9.099/1995', artigos_principais: ['82', '83'], vigente: true, confirmacao_texto: 'Extração literal do Planalto em 2026-08-30' },
    tags: ['penal/jecrim-menor-ofensividade', 'geral/prazos'],
    fonte: PLANALTO,
    urlFonte: URL_9099,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'prazo-recurso-inominado-jec-10-dias-uteis', tipo: 'CONEXO_TEMATICO', descricao: 'Recurso cível (dias úteis) × apelação penal.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'triagem-jecrim',
    titulo: 'Triagem — JECrim: roteiro de 10 perguntas (menor potencial ofensivo, território, fase preliminar e institutos)',
    tipoDocumento: 'TRIAGEM',
    area: 'penal',
    subarea: 'jecrim-menor-ofensividade',
    assunto: 'Triagem de entrada — JECrim',
    prioridade: 'P1',
    lote: 'LOTE-025',
    conteudo: `# TRIAGEM — JECrim
1. Qual o crime apontado e a PENA MÁXIMA? ≤ 2 anos (art. 61)? — se CP 171 § 2º-A (4-8) ou 311-A (1-4), NÃO é JECrim.
2. Onde ocorreu a infração? (art. 63 — competência territorial).
3. Há termo circunstanciado (art. 69)? Autor encaminhado/compromissado (sem flagrante/fiança)?
4. O ofendido quer RECEBER a composição dos danos? (art. 74 — título executivo + renúncia à representação em ações privadas/condicionadas).
5. O MP propôs transação penal? Quais impedimentos do art. 76 § 2º (condenação definitiva; benefício nos 5 anos; medidas insuficientes)?
6. Pena mínima ≤ 1 ano? (art. 89 — suspensão condicional do processo com período de 2-4 anos).
7. O acusado tem advogado/condições de ser defendido? (art. 68 — defensor público se faltar).
8. Testemunhas: quantas e requeridas 5 dias antes (art. 78 § 1º)?
9. Para vítima/consumidor: a conduta é crime do CDC (arts. 63-67)? Qual face cível paralela (arts. 12/14/20 CDC)?
10. Recursos: ciência da sentença → apelação 10 dias (art. 82 § 1º) — calendário marcado?`,
    tags: ['penal/jecrim-menor-ofensividade'],
    fonte: EJC,
    urlFonte: URL_9099,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'fluxo-jecrim', tipo: 'BASE_PRATICA', descricao: 'Fluxo correspondente.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'argumentacao-jecrim-duas-portas',
    titulo: 'Argumentação — JECrim sob os dois lados (4 controvérsias: composição×representação, transação e impedimentos, suspensão do processo, nulidades sem prejuízo)',
    tipoDocumento: 'ARGUMENTACAO',
    area: 'penal',
    subarea: 'jecrim-menor-ofensividade',
    assunto: 'Argumentos e contra-argumentos',
    prioridade: 'P1',
    lote: 'LOTE-025',
    conteudo: `# CONTROVÉRSIA 1 — Composição civil × representação
- **Acusado:** "Composição homologada fecha o caso" (art. 74 — renúncia à queixa/representação em ação privada/condicionada).
- **Vítima/MP:** "Em ação penal PÚBLICA incondicionada a composição civil não afasta a persecução; e a não-representação na audiência não decadencia o direito (art. 75 § único)."
# CONTROVÉRSIA 2 — Transação penal
- **MP:** "Proposta cabível; recusa → processo normal."
- **Acusado:** "Impedimentos do art. 76 § 2º (condenação definitiva à privativa; benefício nos últimos 5 anos); multa reduzida até metade (§ 1º); sanção não gera reincidência (§ 4º)." Decisão estratégica: aceitar × litigar com risco.
# CONTROVÉRSIA 3 — Suspensão condicional do processo
- **Defesa:** "Pena mínima ≤ 1 ano → art. 89; cumprido, extinção da punibilidade (§ 5º)."
- **MP/vítima:** "Exige reparação do dano (condição I) e revoga por novo processo (§ 3º); prescrição NÃO corre durante (§ 6º) — sem 'ganhar tempo'."
# CONTROVÉRSIA 4 — Nulidades no rito
- **Defesa:** "Vício de citação/intimação/advogado (arts. 66-68)."
- **MP/Juízo:** "Art. 65: validade por finalidade; NULIDADE SEM PREJUÍZO não se pronuncia (§ 1º); atos em audiência geram ciência desde logo (art. 67 § único)."

## Trava anti-invenção
Cada argumento amarra em texto literal (fichas LOTE-025 e LOTE-012); sem jurisprudência não confirmada em fonte oficial nesta rodada.`,
    tags: ['penal/jecrim-menor-ofensividade'],
    fonte: EJC,
    urlFonte: URL_9099,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'tese-crimes-consumidor-cdc-cp', tipo: 'BASE_PRATICA', descricao: 'Tese-mãe.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'doutrina-crimes-consumidor',
    titulo: 'Doutrina — Crimes contra as relações de consumo: estrutura, criminalidade de massa e funções dos institutos do JECrim (conceitos EJC)',
    tipoDocumento: 'DOUTRINA',
    area: 'penal',
    subarea: 'jecrim-menor-ofensividade',
    assunto: 'Conceitos fundamentais',
    prioridade: 'P2',
    lote: 'LOTE-025',
    conteudo: `## Criminalidade de massa e minimalismo
Os crimes do CDC (arts. 63-68) são delitos de PERIGO à coletividade de consumidores, penas breves (detenção 3 meses a 2 anos) — trafegam por definição no JECrim (art. 61 da 9.099): o sistema instrumentaliza composição/transação como formas predominantemente despenalizadoras.

## Duas famílias de conduta
1. PROTEÇÃO à saúde/segurança (arts. 63-65): omissão de alerta, não-comunicação/recolhimento, serviço perigoso contra ordem — punitivos mesmo na modalidade CULPOSA (63 § 2º; 66 § 2º).
2. PROTEÇÃO à informação/boa-fé (arts. 66-67): afirmação falsa/omissão relevante e publicidade enganosa/abusiva (dolo "sabe ou deveria saber") — espelho penal das práticas do art. 37 CDC.

## Fraude eletrônica ≠ crimes do CDC
O golpe eletrônico (CP 171 § 2º-A) é contra o PATRIMÔNIO individual (enganar obter vantagem), não contra as relações de consumo como instituição — por isso a pena (reclusão 4-8, conforme a redação que consta no Planalto) o exclui do JECrim.

## JECrim como "tribunal do acordo"
Termo circunstanciado (sem inquérito), denúncia oral, audiência preliminar com composição (título civil + renúncia), transação (sem reincidência) e suspensão do processo (extinção após 2-4 anos) — a DEFESA precisa dominar custos/benefícios de cada instituto antes da audiência.

## Limites honestos
Conceitos estruturais próprios (EJC) derivados do texto legal literal; doutrina externa não consultada nesta rodada (portais bloqueados) — sem citações de autores.`,
    tags: ['penal/jecrim-menor-ofensividade'],
    fonte: EJC,
    urlFonte: URL_9099,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'doutrina-jec-fazenda', tipo: 'CONEXO_TEMATICO', descricao: 'Doutrina irmã do LOTE-024.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'regra-se-entao-jecrim',
    titulo: 'Regra SE-ENTÃO — Roteamento penal de consumo: CDC (JECrim) × CP 171 (comum) e escolha dos institutos despenalizadores',
    tipoDocumento: 'REGRA_INTELIGENCIA',
    area: 'penal',
    subarea: 'jecrim-menor-ofensividade',
    assunto: 'Inteligência de roteamento',
    prioridade: 'P1',
    lote: 'LOTE-025',
    conteudo: `## Regras de roteamento (textos literais LOTE-025)
**SE** a imputação tem pena máxima ≤ 2 anos, cumulada ou não com multa, sem procedimento especial **ENTÃO** JECrim (art. 61 da 9.099, red. Lei 11.313/2006) — ex.: crimes do CDC arts. 63-67.

**SE** a imputação é fraude eletrônica (CP 171 § 2º-A — reclusão 4-8) ou fraude em certames (CP 311-A — reclusão 1-4) **ENTÃO** juízo criminal COMUM (fora do teto do art. 61).

**SE** o fato ocorreu fora da circunscrição **ENTÃO** preliminar de competência territorial (art. 63).

**SE** há vítima com dano patrimonial em ação privada/condicionada **ENTÃO** priorizar COMPOSIÇÃO (art. 74) — título civil + renúncia; **SE** ação pública incondicionada **ENTÃO** a composição não impede a persecução.

**SE** o MP propõe transação (art. 76) **ENTÃO** conferir impedimentos do § 2º (condenação definitiva; benefício nos últimos 5 anos) antes de aceitar; multa única → redução até a metade (§ 1º).

**SE** pena mínima ≤ 1 ano **ENTÃO** avaliar suspensão condicional do processo (art. 89: 2-4 anos; prescrição suspensa § 6º; extinção após o prazo § 5º).

**SE** alegar nulidade **ENTÃO** demonstrar PREJUÍZO (art. 65 § 1º) — sem prejuízo, não há nulidade.

## Trava anti-invenção
Não afirmar vigência de redação além do que a fonte oficial exibe (Lei 15.397/2026 no CP registrada como consta); sem jurisprudência não confirmada.`,
    tags: ['penal/jecrim-menor-ofensividade', 'geral/metodologia'],
    fonte: EJC,
    urlFonte: URL_9099,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'triagem-jecrim', tipo: 'BASE_PRATICA', descricao: 'Triagem que alimenta a regra.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'jurimetria-jecrim-vazia',
    titulo: 'Jurimetria — JECrim e crimes de consumo (estrutura vazia — sem dados reais)',
    tipoDocumento: 'JURIMETRIA',
    area: 'penal',
    subarea: 'jecrim-menor-ofensividade',
    assunto: 'Estrutura para dados futuros',
    prioridade: 'P3',
    lote: 'LOTE-025',
    conteudo: `# JURIMETRIA — JECrim / CRIMES DE CONSUMO
**Status: SEM DADOS.** Nenhuma estatística real nesta consulta (2026-08-30) — o EJC NÃO inventa percentuais.

## Campos preparados
- tribunal/classe/período/amostra/metodologia/fonte;
- indicadores futuros: taxa de composição homologada; taxa de aceite de transação; proporção CDC × CP 171 nas imputações; tempo médio termo→audiência preliminar; taxa de extinção por suspensão condicional do processo (art. 89 § 5º).

## Separação obrigatória: DADO ESTATÍSTICO REAL (com fonte) × ANÁLISE QUALITATIVA.`,
    tags: ['penal/jecrim-menor-ofensividade', 'geral/metodologia'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  } satisfies InputDocument,
];
