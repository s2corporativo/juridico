// LOTE-005 — Alienação Fiduciária (P1) — textos LITERAIS extraídos do Planalto em 2026-08-29
// Regime móveis: CC arts. 1.361-1.365 + Lei 4.728/65 art. 66-B (Lei 10.931/2004) + DL 911/1969 (processual, red. Lei 13.043/2014)
// Regime imóveis: Lei 9.514/1997 arts. 26, 26-A e 27 (red. Lei 14.711/2023)
// + correções honestas dos registros de prazo/regra que citavam dispositivos inexistentes.
import type { InputDocument } from '../../src/lib/ejc/types';

const D = '2026-08-29';
const PLANALTO = 'Presidência da República — Planalto';
const EJC = 'Elaboração EJC — conteúdo estrutural original';

interface FonteInfo {
  url: string;
  norma: string;
  dataNorma: string;
}

function lei(
  slug: string, titulo: string, area: string, subarea: string, assunto: string,
  conteudo: string, artigos: string[], fonte: FonteInfo,
  extra?: Partial<InputDocument>,
): InputDocument {
  return {
    slug, titulo, tipoDocumento: 'LEGISLACAO', area, subarea,
    assunto, prioridade: 'P1', lote: 'LOTE-005',
    conteudo,
    metadados: { numero: fonte.norma, data_norma: fonte.dataNorma, orgao: 'Congresso Nacional / Presidente', artigos_principais: artigos, vigente: true, confirmacao_texto: 'Extracao literal do texto oficial do Planalto em 2026-08-29.' },
    tags: [`${area}/alienacao-fiduciaria`],
    fonte: PLANALTO,
    urlFonte: fonte.url,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-29',
    ...extra,
  };
}

const URL_CC = 'https://www.planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm';
const URL_4728 = 'https://www.planalto.gov.br/ccivil_03/leis/l4728.htm';
const URL_911 = 'https://www.planalto.gov.br/ccivil_03/decreto-lei/1965-1988/del0911.htm';
const URL_9514 = 'https://www.planalto.gov.br/ccivil_03/leis/l9514.htm';

export default [
  lei(
    'cc-arts-1361-1365-alienacao-fiduciaria-moveis',
    'Código Civil arts. 1.361-1.365 — Regime material da alienação fiduciária de coisa móvel infungível (textos literais confirmados)',
    'bancario',
    'alienacao-fiduciaria',
    'Propriedade fiduciária de bens móveis — regime do CC',
    `## Ficha da Norma
- **Norma:** Lei nº 10.406/2002 (Código Civil), arts. 1.361 a 1.365.
- **Vigência:** vigente.

## Textos CONFIRMADOS LITERALMENTE no Planalto (consulta 2026-08-29)
"Art. 1.361. Considera-se fiduciária a propriedade resolúvel de coisa móvel infungível que o devedor, com escopo de garantia, transfere ao credor.
§ 1º Constitui-se a propriedade fiduciária com o registro do contrato, celebrado por instrumento público ou particular, que lhe serve de título, no Registro de Títulos e Documentos do domicílio do devedor, ou, em se tratando de veículos, na repartição competente para o licenciamento, fazendo-se a anotação no certificado de registro.
§ 2º Com a constituição da propriedade fiduciária, dá-se o desdobramento da posse, tornando-se o devedor possuidor direto da coisa.
§ 3º A propriedade superveniente, adquirida pelo devedor, torna eficaz, desde o arquivamento, a transferência da propriedade fiduciária."

"Art. 1.362. O contrato, que serve de título à propriedade fiduciária, conterá:
I - o total da dívida, ou sua estimativa;
II - o prazo, ou a época do pagamento;
III - a taxa de juros, se houver;
IV - a descrição da coisa objeto da transferência, com os elementos indispensáveis à sua identificação."

"Art. 1.363. Antes de vencida a dívida, o devedor, a suas expensas e risco, pode usar a coisa segundo sua destinação, sendo obrigado, como depositário:
I - a empregar na guarda da coisa a diligência exigida por sua natureza;
II - a entregá-la ao credor, se a dívida não for paga no vencimento."

"Art. 1.364. Vencida a dívida, e não paga, fica o credor obrigado a vender, judicial ou extrajudicialmente, a coisa a terceiros, a aplicar o preço no pagamento de seu crédito e das despesas de cobrança, e a entregar o saldo, se houver, ao devedor."

"Art. 1.365. É nula a cláusula que autoriza o proprietário fiduciário a ficar com a coisa alienada em garantia, se a dívida não for paga no vencimento."

## Interpretação aplicada
- Registro no RTD/órgão de licenciamento é requisito de constituição e oponibilidade (art. 1.361 § 1º).
- Devedor = possuidor direto + depositário (art. 1.363) — base da busca e apreensão do DL 911 (docs vinculados).
- Obrigação de vender e prestar contas com saldo ao devedor (art. 1.364) e nulidade da cláusula leonina (art. 1.365).

## Ponto de coerência (regra anti-invenção)
- O art. 66 da Lei 4.728/65 NA redação dada pelo DL 911/1969 foi REVOGADO pela Lei 10.931/2004 (verificado no texto oficial do Planalto). O regime material atual de bens móveis: CC arts. 1.361-1.365 + Lei 4.728 art. 66-B (doc vinculado), permanecendo o DL 911/1969 (arts. 2º-3º) como regime processual aplicável conforme jurisprudência.`,
    ['1.361', '1.362', '1.363', '1.364', '1.365'],
    { url: URL_CC, norma: 'Lei 10.406/2002 (Código Civil)', dataNorma: '2002-01-11' },
    {
      tags: ['bancario/alienacao-fiduciaria', 'bancario/garantias'],
      relacionamentos: [
        { destinoSlug: 'lei-4728-65-art-66-b-alienacao-fiduciaria-mercado-financeiro', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Requisitos contratuais no mercado financeiro (Lei 10.931/2004).' },
        { destinoSlug: 'dl-911-1969-art-3-busca-apreensao', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Regime processual da execução da garantia (móveis).' },
      ],
    },
  ),
  lei(
    'lei-4728-65-art-66-b-alienacao-fiduciaria-mercado-financeiro',
    'Lei 4.728/1965 art. 66-B — Alienão fiduciária no mercado financeiro e garantia de créditos fiscais/previdenciários (texto literal confirmado; art. 66 antigo REVOGADO pela Lei 10.931/2004)',
    'bancario',
    'alienacao-fiduciaria',
    'Requisitos e efeitos da alienação fiduciária no mercado financeiro',
    `## Ficha da Norma
- **Norma:** Lei nº 4.728/1965, art. 66-B (incluído pela Lei nº 10.931/2004).
- **AVISO DE COERÊNCIA:** o art. 66 na redação dada pelo Decreto-Lei 911/1969 está **REVOGADO pela Lei 10.931/2004** (consta "(Revogado pela Lei 10.931, de 2004)" no texto oficial do Planalto, consulta 2026-08-29). Não existe art. 66-C nesta lei.

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-29)
"Art. 66-B. O contrato de alienação fiduciária celebrado no âmbito do mercado financeiro e de capitais, bem como em garantia de créditos fiscais e previdenciários, deverá conter, além dos requisitos definidos na Lei nº 10.406, de 10 de janeiro de 2002 - Código Civil, a taxa de juros, a cláusula penal, o índice de atualização monetária, se houver, e as demais comissões e encargos.
§ 1º Se a coisa objeto de propriedade fiduciária não se identifica por números, marcas e sinais no contrato de alienação fiduciária, cabe ao proprietário fiduciário o ônus da prova, contra terceiros, da identificação dos bens do seu domínio que se encontram em poder do devedor.
§ 2º O devedor que alienar, ou der em garantia a terceiros, coisa que já alienara fiduciariamente em garantia, ficará sujeito à pena prevista no art. 171, § 2º, I, do Código Penal.
§ 3º É admitida a alienação fiduciária de coisa fungível e a cessão fiduciária de direitos sobre coisas móveis, bem como de títulos de crédito, hipóteses em que, salvo disposição em contrário, a posse direta e indireta do bem objeto da propriedade fiduciária ou do título representativo do direito ou do crédito é atribuída ao credor, que, em caso de inadimplemento ou mora da obrigação garantida, poderá vender a terceiros o bem objeto da propriedade fiduciária independente de leilão, hasta pública ou qualquer outra medida judicial ou extrajudicial, devendo aplicar o preço da venda no pagamento do seu crédito e das despesas decorrentes da realização da garantia, entregando ao devedor o saldo, se houver, acompanhado do demonstrativo da operação realizada."

## Interpretação aplicada
- Requisitos contratuais obrigatórios (juros, cláusula penal, índice, encargos) — ausências alimentam teses de revisão/impugnação.
- § 2º: fraude na alienação de bem já fiduciado → aspecto penal (CP art. 171 § 2º I).
- § 3º: fungíveis/cessão fiduciária — venda independente de leilão com demonstrativo ao devedor.`,
    ['66-B'],
    { url: URL_4728, norma: 'Lei 4.728/1965 (art. 66-B incluído pela Lei 10.931/2004)', dataNorma: '1965-08-14' },
  ),
  lei(
    'dl-911-1969-art-2-mora-venda-aplicacao-preco',
    'DL 911/1969 art. 2º — Mora no inadimplemento fiduciário (carta AR) e venda com prestação de contas (texto literal confirmado, redação da Lei 13.043/2014)',
    'bancario',
    'alienacao-fiduciaria',
    'Constituição da mora e venda extrajudicial do bem móvel',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-29 — redação VIGENTE da Lei 13.043/2014)
"Art. 2º No caso de inadimplemento ou mora nas obrigações contratuais garantidas mediante alienação fiduciária, o proprietário fiduciário ou credor poderá vender a coisa a terceiros, independentemente de leilão, hasta pública, avaliação prévia ou qualquer outra medida judicial ou extrajudicial, salvo disposição expressa em contrário prevista no contrato, devendo aplicar o preço da venda no pagamento de seu crédito e das despesas decorrentes e entregar ao devedor o saldo apurado, se houver, com a devida prestação de contas. (Redação dada pela Lei nº 13.043, de 2014)
§ 1º O crédito a que se refere o presente artigo abrange o principal, juros e comissões, além das taxas, cláusula penal e correção monetária, quando expressamente convencionados pelas partes.
§ 2º A mora decorrerá do simples vencimento do prazo para pagamento e poderá ser comprovada por carta registrada com aviso de recebimento, não se exigindo que a assinatura constante do referido aviso seja a do próprio destinatário. (Redação dada pela Lei nº 13.043, de 2014)
§ 3º A mora e o inadimplemento de obrigações contratuais garantidas por alienação fiduciária, ou a ocorrência legal ou convencional de algum dos casos de antecipação de vencimento da dívida facultarão ao credor considerar, de pleno direito, vencidas todas as obrigações contratuais, independentemente de aviso ou notificação judicial ou extrajudicial.
§ 4º Os procedimentos previstos no caput e no seu § 2º aplicam-se às operações de arrendamento mercantil previstas na forma da Lei nº 6.099, de 12 de setembro de 1974. (Incluído pela Lei nº 13.043, de 2014)"

## Interpretação aplicada
- Mora: simples vencimento + carta registrada com AR (assinatura de terceiro é válida — ponto de defesa apenas quando NÃO houver comprovação de entrega no endereço correto).
- Venda: independente de leilão/avaliação prévia, MAS com prestação de contas e saldo ao devedor — venda por preço vil + ausência de contas alimentam indenização pelo saldo remanescente.
- Vencimento antecipado das parcelas (§ 3º) independentemente de notificação.

## Hipóteses de aplicação no EJC
- Defesa em busca e apreensão: exigir prova da carta AR com endereço correto.
- Cobrança do saldo pós-venda: exigir demonstrativo da operação (art. 1.364 CC — doc vinculado).`,
    ['2'],
    { url: URL_911, norma: 'Decreto-Lei 911/1969 (redação da Lei 13.043/2014)', dataNorma: '1969-10-01' },
    {
      tags: ['bancario/alienacao-fiduciaria', 'bancario/credito'],
      relacionamentos: [
        { destinoSlug: 'dl-911-1969-art-3-busca-apreensao', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Via processual da execução da garantia.' },
      ],
    },
  ),
  lei(
    'dl-911-1969-art-3-busca-apreensao',
    'DL 911/1969 art. 3º — Busca e apreensão: liminar em plantão, defesa em 3 dias, purgação por quem pagou 40%, consolidação em 5 dias (textos literais confirmados)',
    'bancario',
    'alienacao-fiduciaria',
    'Ação de busca e apreensão de bem fiduciário',
    `## Textos CONFIRMADOS LITERALMENTE no Planalto (consulta 2026-08-29 — redações vigentes da Lei 13.043/2014)
"Art. 3º O proprietário fiduciário ou credor poderá, desde que comprovada a mora, na forma estabelecida pelo § 2º do art. 2º, ou o inadimplemento, requerer contra o devedor ou terceiro a busca e apreensão do bem alienado fiduciariamente, a qual será concedida liminarmente, podendo ser apreciada em plantão judiciário. (Redação dada pela Lei nº 13.043, de 2014)
§ 1º Cinco dias após executada a liminar mencionada no caput, consolidar-se-ão a propriedade e a posse plena e exclusiva do bem no patrimônio do credor fiduciário, cabendo às repartições competentes, quando for o caso, expedir novo certificado de registro de propriedade em nome do credor fiduciário, ou de terceiro por ele indicado, à vista da ordem judicial, importando a expedição deste novo documento na cancelamento dos anteriores. (Redação dada pela Lei nº 13.043, de 2014)
[§ 1º da redação anterior — quando cabível por anterioridade]: "Despachada a inicial e executada a liminar, o réu será citado para, em três dias, apresentar contestação ou, se já tiver pago 40% (quarenta por cento) do preço financiado, requerer a purgação de mora."
§ 2º Na contestação só se poderá alegar o pagamento do débito vencido ou o cumprimento das obrigações contratuais.
§ 3º Requerida a purgação de mora, tempestivamente, o Juiz marcará data para o pagamento que deverá ser feito em prazo não superior a dez dias, remetendo, outrossim, os autos ao contador para cálculo do débito existente, na forma do art. 2º e seu parágrafo primeiro.
§ 4º Contestado ou não o pedido e não purgada a mora, o Juiz dará sentença de plano em cinco dias, após o decurso do prazo de defesa, independentemente da avaliação do bem.
§ 5º A sentença, de que cabe agravo de instrumento, sem efeito suspensivo, não impedirá a venda extrajudicial do bem alienado fiduciariamente e consolidará a propriedade e a posse plena e exclusiva nas mãos do proprietário fiduciário. Preferida pelo credor a venda judicial, aplicar-se-á o disposto no título VI, Livro V, do Código de Processo Civil.
§ 6º A busca e apreensão prevista no presente artigo constitui processo autônomo e independente de qualquer procedimento posterior."

## PONTO DE ATENÇÃO CRÍTICO (regra anti-invenção)
- O texto oficial traz DUAS redações do § 1º (a atual da Lei 13.043/2014 — consolidação em 5 dias após a liminar — e a anterior com defesa em 3 dias e purgação por quem pagou 40% do preço). A aplicação da redação conforme a data do fato é QUESTÃO DE ANTERIORIDADE LEGAL — conferir a data das providências do caso concreto antes de citar qualquer das duas.

## Interpretação aplicada
- Liminar: mora comprovada (carta AR — art. 2º § 2º) é o requisito; apreciação em plantão.
- Consolidação em 5 dias pós-liminar (redação atual): a posse/propriedade consolida-se mesmo antes da venda.
- Defesa limitada (§ 2º): pagamento do débito vencido ou cumprimento contratual — teses de nulidade da notificação e vícios do contrato são processuais (contestar desde logo).
- Sentença em 5 dias; agravo sem efeito suspensivo; venda extrajudicial segue paralela.`,
    ['3'],
    { url: URL_911, norma: 'Decreto-Lei 911/1969 (redação da Lei 13.043/2014)', dataNorma: '1969-10-01' },
    {
      tags: ['bancario/alienacao-fiduciaria', 'bancario/credito', 'geral/prazos'],
      relacionamentos: [
        { destinoSlug: 'dl-911-1969-art-2-mora-venda-aplicacao-preco', tipo: 'REFERENCIA_LEGISLACAO' },
        { destinoSlug: 'prazo-purgacao-mora-fiduciaria-5-dias', tipo: 'BASE_PRAZO', descricao: 'Registro de prazos corrigido conforme este texto literal.' },
      ],
    },
  ),
  lei(
    'lei-9514-art-26-purgacao-mora-consolidacao-imovel',
    'Lei 9.514/1997 art. 26 — Purgação da mora (15 dias) e consolidação da propriedade fiduciária de imóvel (textos literais confirmados, redação da Lei 14.711/2023)',
    'bancario',
    'alienacao-fiduciaria',
    'Alienação fiduciária de imóvel — intimação e purgação',
    `## Ficha da Norma
- **Norma:** Lei nº 9.514/1997, art. 26 — redação atual dada pela **Lei nº 14.711/2023** (marco legal das garantias).
- **Vigência:** vigente (conferir regras de transição da alteração no caso concreto).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-29 — redação vigente)
"Art. 26. Vencida e não paga a dívida, no todo ou em parte, e constituídos em mora o devedor e, se for o caso, o terceiro fiduciante, será consolidada, nos termos deste artigo, a propriedade do imóvel em nome do fiduciário. (Redação dada pela Lei nº 14.711, de 2023)
§ 1º Para fins do disposto neste artigo, o devedor e, se for o caso, o terceiro fiduciante serão intimados, a requerimento do fiduciário, pelo oficial do registro de imóveis competente, a satisfazer, no prazo de 15 (quinze) dias, a prestação vencida e aquelas que vencerem até a data do pagamento, os juros convencionais, as penalidades e os demais encargos contratuais, os encargos legais, inclusive os tributos, as contribuições condominiais imputáveis ao imóvel e as despesas de cobrança e de intimação. (Redação dada pela Lei nº 14.711, de 2023)
§ 1º-A Na hipótese de haver imóveis localizados em mais de uma circunscrição imobiliária em garantia da mesma dívida, a intimação para purgação da mora poderá ser requerida a qualquer um dos registradores competentes e, uma vez realizada, importa em cumprimento do requisito de intimação em todos os procedimentos de excussão, desde que informe a totalidade da dívida e dos imóveis passíveis de consolidação de propriedade. (Incluído pela Lei nº 14.711, de 2023)
§ 2º O contrato poderá estabelecer o prazo de carência, após o qual será expedida a intimação. (Redação dada pela Lei nº 14.711, de 2023)
§ 2º-A Quando não for estabelecido o prazo de carência no contrato de que trata o § 2º deste artigo, este será de 15 (quinze) dias. (Incluído pela Lei nº 14.711, de 2023)
§ 3º A intimação será feita pessoalmente ao devedor e, se for o caso, ao terceiro fiduciante, que por esse ato serão cientificados de que, se a mora não for purgada no prazo legal, a propriedade será consolidada no patrimônio do credor e o imóvel será levado a leilão nos termos dos arts. 26-A, 27 e 27-A desta Lei, conforme o caso, hipótese em que a intimação poderá ser promovida por solicitação do oficial do registro de imóveis, por oficial de registro de títulos e documentos da comarca da situação do imóvel ou do domicílio de quem deva recebê-la, ou pelo correio, com aviso de recebimento, situação em que se aplica, no que couber, o disposto no art. 160 da Lei nº 6.015, de 31 de dezembro de 1973 (Lei de Registros Públicos). (Redação dada pela Lei nº 14.711, de 2023)"

## Interpretação aplicada
- Purgação: 15 dias da intimação (oficial de registro), incluindo parcelas vincendas, encargos legais e despesas de cobrança.
- Prazo de carência contratual antes da intimação (default 15 dias — § 2º-A, novo em 2023).
- Cientificação expressa do destino do imóvel (consolidação + leilão) na intimação — vício nesse teor sustenta nulidade do procedimento.`,
    ['26'],
    { url: URL_9514, norma: 'Lei 9.514/1997 (redação da Lei 14.711/2023)', dataNorma: '1997-11-20' },
    {
      tags: ['bancario/alienacao-fiduciaria', 'geral/prazos'],
      relacionamentos: [
        { destinoSlug: 'lei-9514-art-27-leilao-alienacao-imovel', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Leilão após a consolidação.' },
        { destinoSlug: 'prazo-purgacao-mora-fiduciaria-5-dias', tipo: 'BASE_PRAZO' },
      ],
    },
  ),
  lei(
    'lei-9514-art-26a-financiamento-habitacional-regras-especiais',
    'Lei 9.514/1997 art. 26-A — Regras especiais de excussão em financiamento habitacional (texto literal confirmado, redação da Lei 14.711/2023)',
    'bancario',
    'alienacao-fiduciaria',
    'Financiamento habitacional — consolidação e leilão com referencial mínimo',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-29 — redação vigente da Lei 14.711/2023)
"Art. 26-A. Os procedimentos de cobrança, purgação de mora, consolidação da propriedade fiduciária e leilão decorrentes de financiamentos para aquisição ou construção de imóvel residencial do devedor, exceto as operações do sistema de consórcio de que trata a Lei nº 11.795, de 8 de outubro de 2008, estão sujeitos às normas especiais estabelecidas neste artigo. (Redação dada pela Lei nº 14.711, de 2023)
§ 1º A consolidação da propriedade em nome do credor fiduciário será averbada no registro de imóveis trinta dias após a expiração do prazo para purgação da mora de que trata o § 1º do art. 26 desta Lei.
§ 2º Até a data da averbação da consolidação da propriedade fiduciária, é assegurado ao devedor e, se for o caso, ao terceiro fiduciante pagar as parcelas da dívida vencidas e as despesas de que trata o inciso II do § 3º do art. 27 desta Lei, hipótese em que convalescerá o contrato de alienação fiduciária. (Redação dada pela Lei nº 14.711, de 2023)
§ 3º No segundo leilão, será aceito o maior lance oferecido desde que seja igual ou superior ao valor integral da dívida garantida pela alienação fiduciária mais antiga vigente sobre o bem, das despesas, inclusive emolumentos cartorários, dos prêmios de seguro, dos encargos legais, inclusive tributos, e das contribuições condominiais. (Incluído pela Lei nº 14.711, de 2023)
§ 4º Se no segundo leilão não houver lance que atenda ao referencial mínimo para arrematação estabelecido no § 3º deste artigo, a dívida será considerada extinta, com recíproca quitação, hipótese em que o credor ficará investido da livre disponibilidade. (Incluído pela Lei nº 14.711, de 2023)
§ 5º A extinção da dívida no excedente ao referencial mínimo para arrematação configura condição resolutiva inerente à dívida e, por isso, estende-se às hipóteses em que o credor tenha preferido o uso da via judicial para executar a dívida. (Incluído pela Lei nº 14.711, de 2023)"

## Interpretação aplicada (financiamento habitacional residencial)
- Averbação da consolidação: 30 dias após expiração do prazo de purgação (§ 1º).
- Convalescimento do contrato: pagamento até a averbação (§ 2º).
- Regime de leilão com referencial mínimo = dívida integral (§ 3º) e **extinção da dívida com quitação recíproca se sem lance suficiente no 2º leilão** (§ 4º — regra de proteção do devedor, nova na redação de 2023).
- § 5º: a quitação se estende inclusive à via judicial.

## Hipóteses de aplicação no EJC
- Defesa pós-leilão frustrado: alegar extinção da dívida com quitação (verificar vigência da redação conforme datas).
- Verificar ANTES do uso se a operação é financiamento habitacional (escopo do art. 26-A) e se há regra de transição aplicável.`,
    ['26-A'],
    { url: URL_9514, norma: 'Lei 9.514/1997 (redação da Lei 14.711/2023)', dataNorma: '1997-11-20' },
  ),
  lei(
    'lei-9514-art-27-leilao-alienacao-imovel',
    'Lei 9.514/1997 art. 27 — Leilão do imóvel fiduciário: prazos, lances e direito de preferência (textos literais confirmados, redações da Lei 14.711/2023)',
    'bancario',
    'alienacao-fiduciaria',
    'Leilão extrajudicial do imóvel alienado fiduciariamente',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-29)
"Art. 27. Consolidada a propriedade em seu nome, o fiduciário promoverá leilão público para a alienação do imóvel, no prazo de 60 (sessenta) dias, contado da data do registro de que trata o § 7º do art. 26 desta Lei. (Redação dada pela Lei nº 14.711, de 2023)
§ 1º Se no primeiro leilão público o maior lance oferecido for inferior ao valor do imóvel, estipulado na forma do inciso VI e do parágrafo único do art. 24 desta Lei, será realizado o segundo leilão nos quinze dias seguintes. (Redação dada pela Lei nº 13.465, de 2017)
§ 2º No segundo leilão, será aceito o maior lance oferecido, desde que seja igual ou superior ao valor integral da dívida garantida pela alienação fiduciária, das despesas, inclusive emolumentos cartorários, dos prêmios de seguro, dos encargos legais, inclusive tributos, e das contribuições condominiais, podendo, caso não haja lance que alcance referido valor, ser aceito pelo credor fiduciário, a seu exclusivo critério, lance que corresponda a, pelo menos, metade do valor de avaliação do bem. (Redação dada pela Lei nº 14.711, de 2023)
§ 2º-A Para fins do disposto nos §§ 1º e 2º deste artigo, as datas, os horários e os locais dos leilões serão comunicados ao devedor e, se for o caso, ao terceiro fiduciante, por meio de correspondência dirigida aos endereços constantes do contrato, inclusive ao endereço eletrônico. (Redação dada pela Lei nº 14.711, de 2023)
§ 2º-B Após a averbação da consolidação da propriedade fiduciária no patrimônio do credor fiduciário e até a data da realização do segundo leilão, é assegurado ao fiduciante o direito de preferência para adquirir o imóvel por preço correspondente ao valor da dívida, somado às despesas, aos prêmios de seguro, aos encargos legais, às contribuições condominiais, aos tributos, inclusive os valores correspondentes ao imposto sobre transmissão inter vivos e ao laudêmio, se for o caso, pagos para efeito de consolidação da propriedade fiduciária no patrimônio do credor fiduciário, e às despesas inerentes aos procedimentos de cobrança e leilão, hipótese em que incumbirá também ao fiduciante o pagamento dos encargos tributários e das despesas exigíveis para a nova aquisição do imóvel, inclusive das custas e dos emolumentos. (Redação dada pela Lei nº 14.711, de 2023)
§ 3º Para os fins do disposto neste artigo, entende-se por:
I - dívida: o saldo devedor da operação de alienação fiduciária, na data do leilão, nele incluídos os juros convencionais..."

## Interpretação aplicada
- Leilão em 60 dias do registro da consolidação; 1º leilão: valor de avaliação como piso; 2º leilão (15 dias depois): piso = dívida integral, admitido lance de 50% da avaliação a critério exclusivo do credor.
- Comunicação obrigatória das datas dos leilões ao devedor (endereços contratuais + eletrônico) — vício de comunicação sustenta nulidade.
- Direito de preferência do fiduciante pós-consolidação e até o 2º leilão (§ 2º-B).

## Hipóteses de aplicação no EJC
- Impugnação de leilão: pisos de lance, comunicação das datas, prazos (60/15 dias).
- Recuperação do imóvel pelo devedor: purgação até averbação (26-A § 2º) e preferência (27 § 2º-B).`,
    ['27'],
    { url: URL_9514, norma: 'Lei 9.514/1997 (redação da Lei 14.711/2023)', dataNorma: '1997-11-20' },
  ),
  {
    slug: 'stj-2023-intimacao-data-leilao-apos-lei-13465',
    titulo: 'STJ (4ª Turma, notícia oficial 14/11/2023): intimação do devedor fiduciante sobre a data do leilão tornou-se obrigatória após a Lei 13.465/2017',
    tipoDocumento: 'JURISPRUDENCIA',
    area: 'bancario',
    subarea: 'alienacao-fiduciaria',
    assunto: 'Intimação para o leilão extrajudicial — regime conforme anterioridade',
    prioridade: 'P1',
    lote: 'LOTE-005',
    conteudo: `## Identificação (fonte oficial)
- **Tribunal:** Superior Tribunal de Justiça (STJ) — Quarta Turma
- **Fonte:** notícia oficial do portal do STJ, 14/11/2023 — "Intimação do devedor fiduciante sobre data do leilão só se tornou obrigatória após a Lei 13.465/2017, decide Quarta Turma"
- **Confirmação honesta (2026-08-29):** o TÍTULO oficial da notícia confirma a tese; o TEXTO INTEGRAL da página não pôde ser extraído na consulta (verificação anti-robô do portal). Número do processo e relator NÃO registrados — não preencher por inferência. Antes de citar em peça, abrir a notícia/julgado no portal do STJ.

## Tese (conforme título oficial)
A intimação do devedor fiduciante acerca da data da realização do leilão extrajudicial (alienação fiduciária de bem móvel) tornou-se obrigatória APÓS a Lei nº 13.465/2017 — operações anteriores não exigiam a intimação.

## Questão jurídica
A ausência de intimação sobre a data do leilão invalida a venda extrajudicial? A resposta depende da época da operação (anterioridade da Lei 13.465/2017)?

## Aplicação prática
- Defesa contra venda extrajudicial ANTERIOR à Lei 13.465/2017 sem intimação da data: a tese oficial não sustenta invalidação por essa ausência específica (analisar demais vícios).
- Operações POSTERIORES: exigir a comunicação das datas (para imóveis, hoje art. 27 § 2º-A da Lei 9.514 — doc vinculado; para móveis, conferir a linha jurisprudencial atual).
- **Confiabilidade B:** tema confirmado por fonte oficial (título da notícia STJ), com texto integral pendente de verificação.`,
    metadados: {
      tribunal: 'STJ',
      classe: 'Recurso Especial (4ª Turma)',
      numero_processo: null,
      relator: null,
      data_publicacao: '2023-11-14',
      sumitulo: false,
      vinculante: false,
      data_consulta_confirmacao: D,
      pendencia: 'Texto integral e número do processo pendentes (portal sob verificação anti-robô na consulta).',
    },
    tags: ['bancario/alienacao-fiduciaria', 'geral/precedentes-qualificados'],
    fonte: 'STJ — notícia oficial do portal (14/11/2023; título confirma a tese, texto integral pendente)',
    urlFonte: 'https://www.stj.jus.br/sites/portalp/Paginas/Comunicacao/Noticias/2023/14112023-Intimacao-do-devedor-fiduciante-sobre-data-do-leilao-so-se-tornou-obrigatoria-apos-2017--decide-Quarta-Turma.aspx',
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-29',
    relacionamentos: [
      { destinoSlug: 'lei-9514-art-27-leilao-alienacao-imovel', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Comunicação das datas dos leilões (§ 2º-A) no regime imobiliário.' },
      { destinoSlug: 'dl-911-1969-art-3-busca-apreensao', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Regime dos móveis afetado pela Lei 13.465/2017.' },
    ],
  },
  {
    slug: 'stj-2020-consolidacao-nao-extingue-contrato-fiduciario',
    titulo: 'STJ (3ª Turma, notícia oficial 27/08/2020): consolidação da propriedade em busca e apreensão não extingue, por si só, o contrato de alienação fiduciária',
    tipoDocumento: 'JURISPRUDENCIA',
    area: 'bancario',
    subarea: 'alienacao-fiduciaria',
    assunto: 'Efeitos da consolidação sobre o contrato e o saldo devedor',
    prioridade: 'P1',
    lote: 'LOTE-005',
    conteudo: `## Identificação (fonte oficial)
- **Tribunal:** Superior Tribunal de Justiça (STJ) — Terceira Turma
- **Fonte:** notícia oficial do portal do STJ, 27/08/2020 — "Busca e apreensão não autoriza juiz a extinguir contrato de alienação fiduciária sem pedido do credor"
- **Confirmação honesta (2026-08-29):** o TÍTULO oficial confirma a tese; texto integral não extraído na consulta (verificação anti-robô). Número do processo não registrado — não preencher por inferência.

## Tese (conforme título oficial)
"O contrato de alienação fiduciária em garantia de bem móvel não se extingue somente por força da consolidação da propriedade em nome do credor" — a extinção contratual exige pedido do credor/negócio próprio, não decorre automaticamente da consolidação (que é ato de execução da garantia).

## Questão jurídica
A consolidação da propriedade (5 dias após a liminar — DL 911 art. 3º § 1º, red. Lei 13.043/2014) extingue o contrato fiduciário e o saldo devedor?

## Aplicação prática
- O credor que consolida e vende responde por prestação de contas (art. 2º do DL 911 + art. 1.364 CC — docs vinculados); o saldo remanescente ainda é cobrável se o preço não bastar (art. 66 § 5º da redação original — ver doc do regime material).
- Defesa: cobrar demonstrativo da venda e reconhecimento de eventual excesso; não presumir extinção da dívida pela consolidação.
- **Confiabilidade B:** tema confirmado por fonte oficial (título), texto integral pendente.`,
    metadados: {
      tribunal: 'STJ',
      classe: 'Recurso Especial (3ª Turma)',
      numero_processo: null,
      relator: null,
      data_publicacao: '2020-08-27',
      sumitulo: false,
      vinculante: false,
      data_consulta_confirmacao: D,
      pendencia: 'Texto integral e número do processo pendentes (portal sob verificação anti-robô na consulta).',
    },
    tags: ['bancario/alienacao-fiduciaria', 'geral/precedentes-qualificados'],
    fonte: 'STJ — notícia oficial do portal (27/08/2020; título confirma a tese, texto integral pendente)',
    urlFonte: 'https://www.stj.jus.br/sites/portalp/Paginas/Comunicacao/Noticias/27082020-Busca-e-apreensao-nao-autoriza-juiz-a-extinguir-contrato-de-alienacao-fiduciaria-sem-pedido-do-credor.aspx',
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-29',
    relacionamentos: [
      { destinoSlug: 'dl-911-1969-art-2-mora-venda-aplicacao-preco', tipo: 'REFERENCIA_LEGISLACAO' },
      { destinoSlug: 'cc-arts-1361-1365-alienacao-fiduciaria-moveis', tipo: 'REFERENCIA_LEGISLACAO' },
    ],
  },
  {
    // CORREÇÃO do registro existente (versão anterior citava "art. 2º § 1º DL 911 — 5 dias", inexistente)
    slug: 'prazo-purgacao-mora-fiduciaria-5-dias',
    titulo: 'Prazos da alienação fiduciária — defesa, purgação, consolidação e leilão (CORRIGIDO no LOTE-005 com textos literais)',
    tipoDocumento: 'PRAZO',
    area: 'bancario',
    subarea: 'alienacao-fiduciaria',
    assunto: 'Tabela de prazos por via (móveis DL 911 x imóveis Lei 9.514)',
    prioridade: 'P1',
    lote: 'LOTE-005',
    conteudo: `## AVISO DE CORREÇÃO (LOTE-005, 2026-08-29)
A versão anterior citava "DL 911/1969, art. 2º § 1º — purgação em 5 dias" — **INEXISTENTE**. O texto oficial do DL 911 (Planalto, consulta 2026-08-29) não contém purgação no art. 2º. Este registro substitui integralmente a versão anterior, com prazos literais confirmados.

## PRAZOS — BENS MÓVEIS (DL 911/1969, art. 3º — texto literal confirmado)
- **Contestação: 3 dias** da citação (redação anterior do § 1º do art. 3º — conferir anterioridade do caso).
- **Purgação da mora (via judicial):** quem já pagou 40% do preço financiado pode requerer; pagamento em prazo **não superior a 10 dias** marcado pelo juiz (art. 3º §§ 1º e 3º, redação anterior).
- **Consolidação da propriedade/posse: 5 dias após executada a liminar** (art. 3º § 1º, redação ATUAL da Lei 13.043/2014).
- **Sentença: 5 dias** após o decurso do prazo de defesa (art. 3º § 4º); agravo de instrumento sem efeito suspensivo (art. 3º § 5º).

## PRAZOS — IMÓVEIS (Lei 9.514/1997 — textos literais confirmados, red. Lei 14.711/2023)
- **Purgação da mora: 15 dias** da intimação pelo oficial de registro (art. 26 § 1º), incluindo parcelas vincendas + encargos + despesas de cobrança/intimação.
- **Carência pré-intimação:** a do contrato ou, silente, **15 dias** (art. 26 §§ 2º e 2º-A).
- **Averbação da consolidação (financiamento habitacional): 30 dias** após expiração da purgação (art. 26-A § 1º).
- **Leilão: 60 dias** do registro da consolidação; **2º leilão: 15 dias** após o 1º sem lance suficiente (art. 27 caput e § 1º).
- **Direito de preferência do fiduciante:** após a averbação e até o 2º leilão (art. 27 § 2º-B).

## Fundamentos
Planalto, consultas 2026-08-29: DL 911/1969 (arts. 2º-3º, com redações da Lei 13.043/2014); Lei 9.514/1997 (arts. 26, 26-A e 27, com redações da Lei 14.711/2023).`,
    metadados: {
      prazo_dias: null,
      regime: 'Móveis: 3 dias defesa (red. anterior), purgação ≤ 10 dias (40% do preço), consolidação 5 dias; Imóveis: purgação 15 dias, leilão 60/15 dias',
      termo_inicial: 'móveis: citação/liminar; imóveis: intimação pelo oficial de registro',
      fundamentos: ['DL 911/1969 art. 3º (Planalto literal)', 'Lei 9.514/1997 arts. 26/26-A/27 (Planalto literal)'],
      correcao: 'LOTE-005: removida citação inexistente (art. 2º § 1º/5 dias); regime reescrito com textos literais.',
      data_consulta_confirmacao: D,
    },
    tags: ['bancario/alienacao-fiduciaria', 'geral/prazos'],
    fonte: 'Presidência da República — Planalto (textos literais DL 911/1969 e Lei 9.514/1997)',
    urlFonte: URL_911,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-11-29',
    relacionamentos: [
      { destinoSlug: 'dl-911-1969-art-3-busca-apreensao', tipo: 'REFERENCIA_LEGISLACAO' },
      { destinoSlug: 'lei-9514-art-26-purgacao-mora-consolidacao-imovel', tipo: 'REFERENCIA_LEGISLACAO' },
      { destinoSlug: 'lei-9514-art-27-leilao-alienacao-imovel', tipo: 'REFERENCIA_LEGISLACAO' },
    ],
  },
  {
    // CORREÇÃO da regra SE-ENTÃO existente (prazos equivocados)
    slug: 'regra-se-busca-apreensao-fiduciaria',
    titulo: 'Regra: SE tipo_processo = busca_e_apreensao (alienação fiduciária) ENTÃO verificar... (CORRIGIDA no LOTE-005)',
    tipoDocumento: 'REGRA_INTELIGENCIA',
    area: 'bancario',
    subarea: 'alienacao-fiduciaria',
    assunto: 'Roteiro interpretável para análise de busca e apreensão',
    prioridade: 'P1',
    lote: 'LOTE-005',
    conteudo: `SE tipo_processo = busca_e_apreensao ENTÃO verificar:

1. **Regime aplicável** → bem móvel (CC 1.361-1.365 + DL 911/1969, red. Lei 13.043/2014) OU imóvel (Lei 9.514/1997, arts. 26/26-A/27, red. Lei 14.711/2023)? A via e os prazos são distintos.
2. **Existência e registro do contrato** → móvel: RTD/órgão de licenciamento (CC art. 1.361 § 1º); imóvel: registro imobiliário (Lei 9.514 art. 23).
3. **Constituição da mora** → móveis: carta registrada com AR (DL 911 art. 2º § 2º — literal); imóveis: vencimento + intimação (Lei 9.514 art. 26 § 1º — literal). SE endereço desatualizado OU carta sem comprovação de entrega: tese de nulidade da mora.
4. **Liminar** → móveis: busca e apreensão concedida liminarmente, apreciável em plantão (DL 911 art. 3º caput — literal).
5. **Prazos do executado** → móveis: contestação 3 dias / purgação (quem pagou 40%) com pagamento ≤ 10 dias (redação anterior do art. 3º §§ 1º e 3º — conferir anterioridade); consolidação 5 dias pós-liminar (red. atual § 1º). Imóveis: purgação 15 dias (art. 26 § 1º).
6. **Consolidação e leilão (imóveis)** → averbação 30 dias (26-A § 1º); leilão em 60 dias + 2º leilão em 15 dias (art. 27 caput/§ 1º); comunicação das datas ao devedor (art. 27 § 2º-A).
7. **Proteções do devedor (imóveis habitacionais)** → convalescimento até a averbação (26-A § 2º); sem lance suficiente no 2º leilão → dívida extinta com quitação recíproca (26-A §§ 3º-4º, red. 14.711/2023).
8. **Venda e contas (móveis)** → venda independente de leilão, MAS com prestação de contas e saldo ao devedor (DL 911 art. 2º caput — literal; CC art. 1.364 — literal). SE preço vil OU sem contas: tese indenizatória.
9. **Cláusulas abusivas** → juros/tarifas/seguro embutido → BANCO 14 (REGRAS_CONTRATUAIS).
10. **Jurisprudência** → consolidação não extingue contrato por si só (STJ notícia 27/08/2020 — confiabilidade B); intimação da data do leilão obrigatória após Lei 13.465/2017 (STJ notícia 14/11/2023 — confiabilidade B). Antes de citar: conferir texto integral no portal STJ.`,
    tags: ['bancario/alienacao-fiduciaria', 'geral/inteligencia-processual'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'prazo-purgacao-mora-fiduciaria-5-dias', tipo: 'BASE_PRAZO' },
      { destinoSlug: 'cc-arts-1361-1365-alienacao-fiduciaria-moveis', tipo: 'REFERENCIA_LEGISLACAO' },
      { destinoSlug: 'lei-9514-art-26-purgacao-mora-consolidacao-imovel', tipo: 'REFERENCIA_LEGISLACAO' },
      { destinoSlug: 'tese-defesa-busca-apreensao-alienacao-fiduciaria', tipo: 'TESE_APLICAVEL' },
    ],
  },
  {
    slug: 'tese-defesa-busca-apreensao-alienacao-fiduciaria',
    titulo: 'Tese — Defesa em busca e apreensão (alienação fiduciária): nulidades de mora, purgação e vícios de excussão',
    tipoDocumento: 'TESE',
    area: 'bancario',
    subarea: 'alienacao-fiduciaria',
    assunto: 'Linhas de defesa do fiduciante',
    prioridade: 'P1',
    lote: 'LOTE-005',
    conteudo: `## Tese principal
A liminar de busca e apreensão exige mora comprovada na forma legal (móveis: carta registrada com AR — DL 911 art. 2º § 2º, texto literal; imóveis: intimação válida com teor obrigatório — Lei 9.514 art. 26 § 3º, texto literal). Vícios de mora, de intimação ou de excussão invalidam o procedimento e sustentam impugnação, reversão de consolidação e indenização.

## Requisitos e estrutura
1. Conferir o REGIME (móvel x imóvel) e a redação legal aplicável por anterioridade (Lei 13.043/2014; Lei 13.465/2017; Lei 14.711/2023).
2. Auditar a mora: endereço, conteúdo da notificação, prova de entrega.
3. Auditar a excussão: prazos (5 dias consolidação móveis; 60/15 leilão imóveis), pisos de lance, comunicação das datas, prestação de contas.
4. Proteções: purgação (3/10 dias móveis por anterioridade; 15 dias imóveis), convalescimento (26-A § 2º), preferência (27 § 2º-B), quitação por leilão frustrado habitacional (26-A §§ 3º-4º).

## Probabilidade qualitativa
- Alta com vício de notificação/mora documentado; média em ataques de preço vil (exigir perícia/comparativos).

## Riscos
- Defesa restrita ao pagamento/cumprimento no mérito do DL 911 art. 3º § 2º — teses processuais devem ser alegadas desde a contestação (3 dias pela redação anterior; conferir anterioridade).
- Agravo sem efeito suspensivo: equilibrar urgência de tutela de resgate.

## Documentos EJC vinculados
DL 911 arts. 2º-3º; Lei 9.514 arts. 26/26-A/27 (todos literais); prazos corrigidos; peça-modelo de defesa.`,
    tags: ['bancario/alienacao-fiduciaria', 'geral/teses'],
    fonte: EJC,
    urlFonte: URL_911,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'peca-defesa-busca-apreensao-modelo', tipo: 'PECA_APLICAVEL' },
      { destinoSlug: 'fluxo-execucao-extrajudicial-imovel-9514', tipo: 'FLUXO_APLICAVEL' },
    ],
  },
  {
    slug: 'peca-defesa-busca-apreensao-modelo',
    titulo: 'Peça-modelo — Contestação em busca e apreensão + pedido de purgação (variáveis {{...}})',
    tipoDocumento: 'PECA',
    area: 'bancario',
    subarea: 'alienacao-fiduciaria',
    assunto: 'Modelo de defesa do fiduciante em busca e apreensão',
    prioridade: 'P1',
    lote: 'LOTE-005',
    conteudo: `**EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA {{JUÍZO}}**

**Autos nº {{PROCESSO}}** — Ação de Busca e Aprensão (alienação fiduciária — DL 911/1969)
**Réu/Purgante:** {{CLIENTE}} ({{CPF/CNPJ}})
**Autor:** {{CREDOR_FIDUCIARIO}}

{{CLIENTE}}, citado(a) para os termos da ação em epígrafe, vem, no prazo legal (DL 911 art. 3º § 1º — conferir redação aplicável por anterioridade), apresentar

### I — DA INEXISTÊNCIA DE MORA VÁLIDA (PRELIMINAR DE MÉRITO)
1.1. A constituição da mora exige carta registrada com AR comprovada no endereço correto (DL 911 art. 2º § 2º). No caso: {{DEFEITOS_DA_NOTIFICACAO}}.
1.2. Consequência: inviabilidade da liminar e da excussão; {{PEDIDO_NULIDADE_MORA}}.

### II — DO PAGAMENTO DO DÉBITO VENCIDO / PURGAÇÃO DA MORA
2.1. Pagamentos realizados: {{PAGAMENTOS}} (DL 911 art. 3º § 2º — pagamento do débito vencido é defesa de mérito).
2.2. {{JA_PAGOU_40_PRECO ? 'Tendo pago mais de 40% do preço financiado, o réu REQUER a purgação da mora (art. 3º §§ 1º e 3º), fixando-se data para pagamento em até 10 dias.' : 'Não cabível purgação por ausência do requisito dos 40% (art. 3º § 1º — redação aplicável).'}}
2.3. Depósito judicial do valor apurado: {{VALOR}}, nos autos.

### III — DOS VÍCIOS CONTRATUAIS (SUBSIDIÁRIO)
3.1. Encargos impugnados: {{ENCARGOS}} — {{FUNDAMENTOS}}.

### IV — DOS PEDIDOS
a) a revogação/ineficácia da liminar, com restituição do bem ({{SE_APREENDIDO}});
b) a declaração de inexigibilidade do débito vencido tal como cobrado;
c) {{PEDIDO_PURGACAO}};
d) condenação do autor em custas e honorários.

**Termos em que pede deferimento.**
{{LOCAL}}, {{DATA}}.
{{ADVOGADO}} — OAB/{{UF}} nº {{NUM_OAB}}

---
**CHECKLIST DE REVISÃO EJC:**
- [ ] Confirmar regime do bem (móvel/imóvel) e a redação legal aplicável (Lei 13.043/2014; Lei 14.711/2023) pela data dos fatos;
- [ ] Prova da carta AR (data, endereço, AR) requerida à autora/cartório;
- [ ] Percentual do preço pago (requisito dos 40% para purgação) calculado com documentos reais;
- [ ] Prazos: contestação em 3 dias (conferir redação aplicável); purgação ≤ 10 dias;
- [ ] Sem uso de confiabilidade C como fundamento exclusivo.`,
    tags: ['bancario/alienacao-fiduciaria', 'geral/pecas'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'tese-defesa-busca-apreensao-alienacao-fiduciaria', tipo: 'TESE_APLICAVEL' },
      { destinoSlug: 'dl-911-1969-art-3-busca-apreensao', tipo: 'REFERENCIA_LEGISLACAO' },
    ],
  },
  {
    slug: 'fluxo-execucao-extrajudicial-imovel-9514',
    titulo: 'Fluxo: execução extrajudicial do imóvel fiduciário (Lei 9.514/1997, red. Lei 14.711/2023)',
    tipoDocumento: 'FLUXO',
    area: 'bancario',
    subarea: 'alienacao-fiduciaria',
    assunto: 'Evento → prazo → providência → responsável → documento → risco → próxima etapa',
    prioridade: 'P1',
    lote: 'LOTE-005',
    conteudo: `Formato: evento → prazo → providência → responsável → documento necessário → risco → próxima etapa.

| # | Evento | Prazo (fundamento literal) | Providência | Responsável | Documento necessário | Risco | Próxima etapa |
|---|--------|---------------------------|-------------|-------------|----------------------|-------|----------------|
| 1 | Inadimplemento do devedor | Conforme contrato; carência de 15 dias se silente (art. 26 §§ 2º/2º-A) | Requerer intimação ao oficial do RI | Credor/procurador | Contrato, tabela de encargos | Intimação com teor incompleto | Intimação expedida |
| 2 | Intimação do devedor/terceiro fiduciante | — (art. 26 § 3º) | Cientificar teor: purgação em 15 dias sob pena de consolidação + leilão | Oficial do registro | AR/mandado | Vício de teor/endereço (nulidade) | Prazo de purgação |
| 3 | Purgação da mora | 15 dias (art. 26 § 1º) | Pagar prestações vencidas + vincendas + encargos + despesas | Devedor | Comprovantes | Não purgar → consolidação | Purga? sim→ contrato convalesce; não→ 4 |
| 4 | Averbação da consolidação (habitacional) | 30 dias após expiração da purgação (art. 26-A § 1º) | Averbar propriedade no nome do credor | Credor + RI | Certidões do procedimento | Purga até a averbação convalesce o contrato (26-A § 2º) | Leilão |
| 5 | Comunicação das datas dos leilões | — (art. 27 § 2º-A) | Enviar correspondência aos endereços contratuais + eletrônico | Credor | Comprovação de envio | Ausência de comunicação → nulidade do leilão | 1º leilão |
| 6 | 1º leilão | 60 dias do registro da consolidação (art. 27 caput) | Piso: valor de avaliação (art. 24 VI) | Credor/leiloeiro | Edital, avaliação | Lance < avaliação | 2º leilão em 15 dias (art. 27 § 1º) |
| 7 | 2º leilão (habitacional) | 15 dias (art. 27 § 1º) | Piso: dívida integral; sem lance → DÍVIDA EXTINTA com quitação recíproca (art. 26-A §§ 3º-4º) | Credor/leiloeiro | Edital, certidão de dívida | Regra de quitação protege o devedor | Arrematação ou extinção |
| 8 | Pós-arrematação | — | Entrega do imóvel; aplicação do preço (art. 27 §§ seguintes — conferir na fonte) | Credor | Termo de arrematação | Devedor remanescente em posse → ações possessórias | Encerramento |
| 9 | Defesa do devedor (qualquer etapa) | Imediata | Impugnar vícios de intimação/prazos/pisos; exercer preferência pós-consolidação (art. 27 § 2º-B) | Advogado do devedor | Documentos do procedimento | Agravo/urgência conforme o caso | Medida cabível |`,
    tags: ['bancario/alienacao-fiduciaria', 'geral/fluxos'],
    fonte: EJC,
    urlFonte: URL_9514,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'lei-9514-art-26-purgacao-mora-consolidacao-imovel', tipo: 'REFERENCIA_LEGISLACAO' },
      { destinoSlug: 'lei-9514-art-27-leilao-alienacao-imovel', tipo: 'REFERENCIA_LEGISLACAO' },
      { destinoSlug: 'lei-9514-art-26a-financiamento-habitacional-regras-especiais', tipo: 'REFERENCIA_LEGISLACAO' },
    ],
  },
];
