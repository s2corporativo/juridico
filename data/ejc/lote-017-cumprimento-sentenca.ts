// LOTE-017 — Cumprimento de sentença — CPC/2015 arts. 523-530 (P1)
// Textos LITERAIS extraídos do Planalto em 2026-08-30:
// https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105.htm
// Arts. 523 (15 dias, multa/honorários 10%, penhora desde logo), 524 (demonstrativo),
// 525 (impugnação §§ 1º-15), 526 (pagamento anterior), 527 (provisório), 528
// (alimentos: 3 dias, protesto, prisão 1-3 meses, 3 prestações), 529 (desconto em
// folha) e 530 (não cumprimento → arts. 831 e seguintes).
//
// ANTI-INVENÇÃO desta rodada:
// - Tema 810/STF verificou-se tratar de correção monetária/juros da Fazenda
//   Pública (art. 1º-F Lei 9.494) — NÃO da multa do art. 523; nada afirmado sobre
//   retroatividade da multa em contratos anteriores ao CPC (não confirmado).
// - Nenhum REsp sobre cumprimento citado (STF/STJ bloqueados por 403/Cloudflare
//   na consulta; Súmula 453/STJ incluída com enunciado verbatim via enciclopédia
//   oficial do TJMG — confiabilidade B honesta).
import type { InputDocument } from '../../src/lib/ejc/types';

const D = '2026-08-30';
const PLANALTO = 'Presidência da República — Planalto';
const URL_CPC = 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105.htm';
const EJC = 'Elaboração EJC — conteúdo estrutural original';

function leiCpc(
  slug: string, titulo: string, assunto: string, conteudo: string, artigos: string[],
  extra?: Partial<InputDocument>,
): InputDocument {
  return {
    slug, titulo, tipoDocumento: 'LEGISLACAO', area: 'processual-civil', subarea: 'execucao',
    assunto, prioridade: 'P1', lote: 'LOTE-017',
    conteudo,
    metadados: { numero: 'Lei 13.105/2015 (CPC)', data_norma: '2015-03-16', orgao: 'Congresso Nacional', artigos_principais: artigos, vigente: true, confirmacao_texto: 'Extração literal do texto oficial do Planalto em 2026-08-30.' },
    tags: ['processual-civil/execucao', 'geral/prazos'],
    fonte: PLANALTO,
    urlFonte: URL_CPC,
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
  leiCpc(
    'cpc-art-523-pagamento-15-dias-multa',
    'CPC art. 523 — Cumprimento de sentença: 15 dias para pagar, multa e honorários de 10%, penhora desde logo (texto literal confirmado)',
    'Quantia certa — pagamento voluntário e sanções',
    `## Ficha da Norma
- **Norma:** Lei 13.105/2015 (CPC) — Livro II, Título II, Capítulo II "O Cumprimento da Sentença que Reconheça a Exigibilidade de Obrigação de Prestar Quantia Certa".

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 523. No caso de condenação em quantia certa, ou já fixada em liquidação, e no caso de decisão sobre parcela incontroversa, o cumprimento definitivo da sentença far-se-á a requerimento do exequente, sendo o executado intimado para pagar o débito, no prazo de 15 (quinze) dias, acrescido de custas, se houver.

§ 1º Não ocorrendo pagamento voluntário no prazo do caput, o débito será acrescido de multa de dez por cento e, também, de honorários de advogado de dez por cento.

§ 2º Efetuado o pagamento parcial no prazo previsto no caput, a multa e os honorários previstos no § 1º incidirão sobre o restante.

§ 3º Não efetuado tempestivamente o pagamento voluntário, será expedido, desde logo, mandado de penhora e avaliação, seguindo-se os atos de expropriação."

## Leitura aplicada
- **Cabo do cumprimento:** condenação em quantia certa, valor já liquidado ou PARCELA INCONTROVERSA (antecipação da execução parcial).
- **15 dias para pagar** após intimação (dia útil — art. 219; na intimação via advogado constitucido nos autos, a intimação é pelo DJe, art. 513 § 2º CPC — conferir no texto oficial antes de usar em tese).
- **Multa 10% + honorários 10%** sobre o que NÃO foi pago (parcial: incide sobre o RESTANTE — § 2º).
- **Mecânica:** inadimplemento → penhora "desde logo" (§ 3º) — o devedor não é intimado de novo para penhora.

## Hipóteses de aplicação no EJC
- Cálculo de honorários: valor do débito + 10% multa + 10% honorários quando inadimplido o prazo.
- Alerta de contingência para devedores: pagar parcial não protege o restante (§ 2º).`,
    ['523', '523 § 1º', '523 § 2º', '523 § 3º'],
    {
      relacionamentos: [
        { destinoSlug: 'cpc-art-525-impugnacao-fundamentos', tipo: 'SEQUENCIA', descricao: 'Defesa após inadimplemento.' },
        { destinoSlug: 'prazo-pagamento-voluntario-15-dias', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Prazo de 15 dias no Banco 10.' },
      ],
    },
  ),
  leiCpc(
    'cpc-art-524-demonstrativo-credito',
    'CPC art. 524 — Demonstrativo discriminado e atualizado do crédito (texto literal confirmado)',
    'Requerimento do exequente',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 524. O requerimento previsto no art. 523 será instruído com demonstrativo discriminado e atualizado do crédito, devendo a petição conter:
I - o nome completo, o número de inscrição no Cadastro de Pessoas Físicas ou no Cadastro Nacional da Pessoa Jurídica do exequente e do executado, observado o disposto no art. 319, §§ 1º a 3º;
II - o índice de correção monetária adotado;
III - os juros aplicados e as respectivas taxas;
IV - o termo inicial e o termo final dos juros e da correção monetária utilizados;
V - a periodicidade da capitalização dos juros, se for o caso;
VI - especificação dos eventuais descontos obrigatórios realizados;
VII - indicação dos bens passíveis de penhora, sempre que possível.

§ 1º Quando o valor apontado no demonstrativo aparentemente exceder os limites da condenação, a execução será iniciada pelo valor pretendido, mas a penhora terá por base a importância que o juiz entender adequada.

§ 2º Para a verificação dos cálculos, o juiz poderá valer-se de contabilista do juízo, que terá o prazo máximo de 30 (trinta) dias para efetuá-la, exceto se outro lhe for determinado.

§ 3º Quando a elaboração do demonstrativo depender de dados em poder de terceiros ou do executado, o juiz poderá requisitá-los, sob cominação do crime de desobediência.

§ 4º Quando a complementação do demonstrativo depender de dados adicionais em poder do executado, o juiz poderá, a requerimento do exequente, requisitá-los, fixando prazo de até 30 (trinta) dias para o cumprimento da diligência.

§ 5º Se os dados adicionais a que se refere o § 4º não forem apresentados pelo executado, sem justificativa, no prazo designado, reputar-se-ão corretos os cálculos apresentados pelo exequente apenas com base nos dados de que dispõe."

## Leitura aplicada
- **7 itens obrigatórios** do demonstrativo (nomes/CPF-CNPJ, índice, juros, termos inicial/final, capitalização, descontos, bens à penhora).
- **Excesso aparente (§ 1º):** executa pelo valor pretendido, penhora baseia-se no que o juiz entender adequado.
- **Dados em poder do executado (§§ 4º-5º):** não apresentados sem justificativa → cálculos do exequente reputados CORRETOS com os dados disponíveis — ferramenta anti-procrastinação.
- Verificação por contabilista do juízo em até 30 dias (§ 2º).`,
    ['524', '524 § 1º', '524 § 4º', '524 § 5º'],
    {
      relacionamentos: [
        { destinoSlug: 'peca-requerimento-cumprimento-quantia-certa', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Peça-modelo com demonstrativo.' },
      ],
    },
  ),
  leiCpc(
    'cpc-art-525-impugnacao-fundamentos',
    'CPC art. 525 — Impugnação ao cumprimento de sentença: fundamentos taxativos, efeitos e inconstitucionalidade reconhecida pelo STF (texto literal confirmado)',
    'Impugnação',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 525. Transcorrido o prazo previsto no art. 523 sem o pagamento voluntário, inicia-se o prazo de 15 (quinze) dias para que o executado, independentemente de penhora ou nova intimação, apresente, nos próprios autos, sua impugnação.

§ 1º Na impugnação, o executado poderá alegar:
I - falta ou nulidade da citação se, na fase de conhecimento, o processo correu à revelia;
II - ilegitimidade de parte;
III - inexequibilidade do título ou inexigibilidade da obrigação;
IV - penhora incorreta ou avaliação errônea;
V - excesso de execução ou cumulação indevida de execuções;
VI - incompetência absoluta ou relativa do juízo da execução;
VII - qualquer causa modificativa ou extintiva da obrigação, como pagamento, novação, compensação, transação ou prescrição, desde que supervenientes à sentença.

§ 2º A alegação de impedimento ou suspeição observará o disposto nos arts. 146 e 148.

§ 3º Aplica-se à impugnação o disposto no art. 229.

§ 4º Quando o executado alegar que o exequente, em excesso de execução, pleiteia quantia superior à resultante da sentença, cumprir-lhe-á declarar de imediato o valor que entende correto, apresentando demonstrativo discriminado e atualizado de seu cálculo.

§ 5º Na hipótese do § 4º, não apontado o valor correto ou não apresentado o demonstrativo, a impugnação será liminarmente rejeitada, se o excesso de execução for o seu único fundamento, ou, se houver outro, a impugnação será processada, mas o juiz não examinará a alegação de excesso de execução.

§ 6º A apresentação de impugnação não impede a prática dos atos executivos, inclusive os de expropriação, podendo o juiz, a requerimento do executado e desde que garantido o juízo com penhora, caução ou depósito suficientes, atribuir-lhe efeito suspensivo, se seus fundamentos forem relevantes e se o prosseguimento da execução for manifestamente suscetível de causar ao executado grave dano de difícil ou incerta reparação.

§ 7º A concessão de efeito suspensivo a que se refere o § 6º não impedirá a efetivação dos atos de substituição, de reforço ou de redução da penhora e de avaliação dos bens.

§ 8º Quando o efeito suspensivo atribuído à impugnação disser respeito apenas a parte do objeto da execução, esta prosseguirá quanto à parte restante.

§ 9º A concessão de efeito suspensivo à impugnação deduzida por um dos executados não suspenderá a execução contra os que não impugnaram, quando o respectivo fundamento disser respeito exclusivamente ao impugnante.

§ 10. Ainda que atribuído efeito suspensivo à impugnação, é lícito ao exequente requerer o prosseguimento da execução, oferecendo e prestando, nos próprios autos, caução suficiente e idônea a ser arbitrada pelo juiz.

§ 11. As questões relativas a fato superveniente ao término do prazo para apresentação da impugnação, assim como aquelas relativas à validade e à adequação da penhora, da avaliação e dos atos executivos subsequentes, podem ser arguidas por simples petição, tendo o executado, em qualquer dos casos, o prazo de 15 (quinze) dias para formular esta arguição, contado da comprovada ciência do fato ou da intimação do ato.

§ 12. Para efeito do disposto no inciso III do § 1º deste artigo, considera-se também inexigível a obrigação reconhecida em título executivo judicial fundado em lei ou ato normativo considerado inconstitucional pelo Supremo Tribunal Federal, ou fundado em aplicação ou interpretação da lei ou do ato normativo tido pelo Supremo Tribunal Federal como incompatível com a Constituição Federal, em controle de constitucionalidade concentrado ou difuso.

§ 13. No caso do § 12, os efeitos da decisão do Supremo Tribunal Federal poderão ser modulados no tempo, em atenção à segurança jurídica.

§ 14. A decisão do Supremo Tribunal Federal referida no § 12 deve ser anterior ao trânsito em julgado da decisão exequenda. (Vide AR 2876)

§ 15. Se a decisão referida no § 12 for proferida após o trânsito em julgado da decisão exequenda, caberá ação rescisória, cujo prazo será contado do trânsito em julgado da decisão proferida pelo Supremo Tribunal Federal. (Vide AR 2876)"

## Leitura aplicada
- **15 dias para impugnar** (sem nova intimação/penhora), nos próprios autos.
- **Fundamentos taxativos (§ 1º I-VII)** — fato posterior sai da impugnação e vira simples petição (§ 11, 15 dias da ciência).
- **Excesso de execução (§§ 4º-5º):** declarar de IMEDIATO o valor correto com demonstrativo — senão rejeição liminar (se único fundamento) ou preclusão da alegação.
- **Efeito suspensivo NÃO automático (§ 6º):** exige garantia (penhora/caução/depósito) + fundamentos relevantes + grave dano de difícil/incerta reparação; §§ 7º-10 desenham os limites (penhora continua, prosseguimento parcial, caução do exequente).
- **Inexigibilidade por inconstitucionalidade (§§ 12-15):** decisão do STF ANTERIOR ao trânsito em julgado; depois → rescisória (prazo do trânsito da decisão do STF).

## Hipóteses de aplicação no EJC
- Defesa: mapear cada alegação ao inciso correto; excesso SEMPRE com demonstrativo próprio (§ 4º).
- Exequente: almejar atos executivos imediatos (§ 6º) e caução para prosseguir (§ 10).`,
    ['525', '525 § 1º', '525 § 4º', '525 § 5º', '525 § 6º', '525 § 11', '525 § 12'],
    {
      relacionamentos: [
        { destinoSlug: 'cpc-art-523-pagamento-15-dias-multa', tipo: 'SEQUENCIA', descricao: 'Inadimplemento abre o prazo da impugnação.' },
        { destinoSlug: 'peca-impugnacao-cumprimento-sentenca', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Peça-modelo da impugnação.' },
        { destinoSlug: 'cpc-2015-art-300-tutela-urgencia', tipo: 'CONTEXTO', descricao: 'Contraste: urgência na fase cognitiva × suspensão na executiva.' },
      ],
    },
  ),
  leiCpc(
    'cpc-arts-526-527-pagamento-anterior-provisorio',
    'CPC arts. 526-527 — Pagamento espontâneo antes da intimação e cumprimento provisório (texto literal confirmado)',
    'Pagamento anterior e provisório',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 526. É lícito ao réu, antes de ser intimado para o cumprimento da sentença, comparecer em juízo e oferecer em pagamento o valor que entender devido, apresentando memória discriminada do cálculo.

§ 1º O autor será ouvido no prazo de 5 (cinco) dias, podendo impugnar o valor depositado, sem prejuízo do levantamento do depósito a título de parcela incontroversa.

§ 2º Concluindo o juiz pela insuficiência do depósito, sobre a diferença incidirão multa de dez por cento e honorários advocatícios, também fixados em dez por cento, seguindo-se a execução com penhora e atos subsequentes.

§ 3º Se o autor não se opuser, o juiz declarará satisfeita a obrigação e extinguirá o processo.

Art. 527. Aplicam-se as disposições deste Capítulo ao cumprimento provisório da sentença, no que couber."

## Leitura aplicada
- **Pagamento inteligente (art. 526):** antes da intimação, o réu pode depositar o valor que entende devido com memória de cálculo; autor ouvido em 5 dias; insuficiência → multa + honorários de 10% SÓ sobre a diferença; concordância → extinção.
- **Cumprimento provisório (art. 527):** mesmas regras "no que couber" (com as salvaguardas próprias do provisório — art. 520, conferir).

## Hipóteses de aplicação no EJC
- Estratégia do devedor: depositar parcela incontroversa antes da intimação → evita multa sobre ela (art. 526 §§ 1º-2º) — alinhado ao art. 523 § 2º.`,
    ['526', '526 § 1º', '526 § 2º', '526 § 3º', '527'],
  ),
  leiCpc(
    'cpc-art-528-alimentos-prisao',
    'CPC art. 528 — Cumprimento de sentença de alimentos: 3 dias, protesto, prisão de 1 a 3 meses e limite das 3 prestações (texto literal confirmado)',
    'Alimentos — coerção pessoal',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 528. No cumprimento de sentença que condene ao pagamento de prestação alimentícia ou de decisão interlocutória que fixe alimentos, o juiz, a requerimento do exequente, mandará intimar o executado pessoalmente para, em 3 (três) dias, pagar o débito, provar que o fez ou justificar a impossibilidade de efetuá-lo.

§ 1º Caso o executado, no prazo referido no caput, não efetue o pagamento, não prove que o efetuou ou não apresente justificativa da impossibilidade de efetuá-lo, o juiz mandará protestar o pronunciamento judicial, aplicando-se, no que couber, o disposto no art. 517.

§ 2º Somente a comprovação de fato que gere a impossibilidade ABSOLUTA de pagar justificará o inadimplemento.

§ 3º Se o executado não pagar ou se a justificativa apresentada não for aceita, o juiz, além de mandar protestar o pronunciamento judicial na forma do § 1º, decretar-lhe-á a prisão pelo prazo de 1 (um) a 3 (três) meses.

§ 4º A prisão será cumprida em regime fechado, devendo o preso ficar separado dos presos comuns.

§ 5º O cumprimento da pena não exime o executado do pagamento das prestações vencidas e vincendas.

§ 6º Paga a prestação alimentícia, o juiz suspenderá o cumprimento da ordem de prisão.

§ 7º O débito alimentar que autoriza a prisão civil do alimentante é o que compreende até as 3 (três) prestações anteriores ao ajuizamento da execução e as que se vencerem no curso do processo.

§ 8º O exequente pode optar por promover o cumprimento da sentença ou decisão desde logo, nos termos do disposto neste Livro, Título II, Capítulo III, caso em que não será admissível a prisão do executado, e, recaindo a penhora em dinheiro, a concessão de efeito suspensivo à impugnação não obsta a que o exequente levante mensalmente a importância da prestação.

§ 9º Além das opções previstas no art. 516, parágrafo único, o exequente pode promover o cumprimento da sentença ou decisão que condena ao pagamento de prestação alimentícia no juízo de seu domicílio."

## Leitura aplicada
- **Intimação PESSOAL + 3 dias** para pagar/provar/justificar.
- **Justificativa:** somente impossibilidade ABSOLUTA de pagar (§ 2º) — perda de emprego não é, por si, impossibilidade absoluta (leitura comum — EJC não afirma percentuais).
- **Prisão 1-3 meses** (regime fechado, separado — § 4º); paga a prestação → suspensão da ordem (§ 6º).
- **Débito que autoriza prisão (§ 7º):** 3 prestações ANTERIORES ao ajuizamento + as vincendas no processo.
- **Duas vias (§ 8º):** coerção (prisão) OU expropriação (não cumuláveis na mesma execução); penhora em dinheiro → levantamento mensal mesmo com impugnação suspensa.
- **Foro do domicílio do credor (§ 9º)** como opção.

## Hipóteses de aplicação no EJC
- Execução de alimentos: decidir entre via coerção (3 dias/prisão) e via expropriação desde logo.`,
    ['528', '528 § 2º', '528 § 3º', '528 § 7º', '528 § 8º'],
    {
      relacionamentos: [
        { destinoSlug: 'prazo-alimentos-intimacao-3-dias', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Prazo de 3 dias no Banco 10.' },
      ],
    },
  ),
  leiCpc(
    'cpc-arts-529-530-desconto-folha-arresto',
    'CPC arts. 529-530 — Desconto em folha de alimentos e remissão à expropriação (texto literal confirmado)',
    'Alimentos — desconto; não cumprimento',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 529. Quando o executado for funcionário público, militar, diretor ou gerente de empresa ou empregado sujeito à legislação do trabalho, o exequente poderá requerer o desconto em folha de pagamento da importância da prestação alimentícia.

§ 1º Ao proferir a decisão, o juiz oficiará à autoridade, à empresa ou ao empregador, determinando, sob pena de crime de desobediência, o desconto a partir da primeira remuneração posterior ao requerimento.

§ 2º O desconto não poderá incidir sobre os valores que, por força de lei, devem ficar à disposição do executado.

Art. 530. Não cumprida a obrigação, observar-se-á o disposto nos arts. 831 e seguintes."

## Leitura aplicada
- **Desconto em folha** para funcionário público, militar, diretor/gerente ou empregado CLT (art. 529): ofício sob pena de desobediência; desconto já na PRIMEIRA remuneração posterior; limite legal das parcelas indisponíveis (§ 2º).
- **Art. 530:** não cumprida a obrigação → regime da expropriação (arts. 831 e seguintes — penhora e leilão).

## Hipóteses de aplicação no EJC
- Combinação prática: desconto em folha para parcelas vincendas + expropriação para vencidas.`,
    ['529', '529 § 1º', '530'],
  ),
  {
    slug: 'tese-multa-honorarios-parcial-cumprimento',
    titulo: 'Tese — Multa e honorários de 10% incidem sobre o restante no pagamento parcial do cumprimento (CPC art. 523 §§ 1º-2º)',
    tipoDocumento: 'TESE',
    area: 'processual-civil',
    subarea: 'execucao',
    assunto: 'Sanções do pagamento parcial',
    prioridade: 'P1',
    lote: 'LOTE-017',
    conteudo: `## Tese estruturada (fundada em texto legal literal)
**Enunciado:** No cumprimento de sentença de quantia certa, paga parcialmente o débito no prazo de 15 dias, a multa de 10% e os honorários de 10% incidem sobre o RESTANTE inadimplido — e não sobre o total — conforme o texto do art. 523 § 2º do CPC.

## Fundamento legal (literal)
- "Efetuado o pagamento parcial no prazo previsto no caput, a multa e os honorários previstos no § 1º incidirão sobre o restante." (CPC art. 523 § 2º — Planalto, consulta 2026-08-30)

## Aplicação prática
- Devedor que paga parte dentro dos 15 dias reduz a base da multa/honorários.
- Depositante antecipado (art. 526): insuficiência → multa/honorários de 10% sobre a DIFERENÇA (§ 2º do 526).

## Limitações e riscos
- O texto NÃO define procedimento de cálculo em caso de discussão do que é "restante" — argumentar com o demonstrativo (art. 524).
- Não citar jurisprudência sobre incidência em títulos anteriores ao CPC: NÃO confirmada em fonte oficial nesta consulta (2026-08-30).

## Probabilidade qualitativa: ALTA (texto legal claro e vigente).`,
    metadados: { palavras_chave: ['multa 10%', 'honorários 10%', 'pagamento parcial', 'art. 523 § 2º'], probabilidade: 'alta' },
    tags: ['processual-civil/execucao'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'cpc-art-523-pagamento-15-dias-multa', tipo: 'FUNDAMENTA_EM', descricao: 'Texto literal do art. 523.' },
    ],
  },
  {
    slug: 'peca-requerimento-cumprimento-quantia-certa',
    titulo: 'Peça-modelo — Requerimento de cumprimento de sentença por quantia certa (com demonstrativo — art. 524)',
    tipoDocumento: 'PECA',
    area: 'processual-civil',
    subarea: 'execucao',
    assunto: 'Exequente — início do cumprimento',
    prioridade: 'P1',
    lote: 'LOTE-017',
    conteudo: `# REQUERIMENTO DE CUMPRIMENTO DE SENTENÇA — QUANTIA CERTA (MODELO EJC)
## Uso: exequente dá início ao cumprimento (CPC arts. 523-524). Definitivo (art. 523) ou provisório (art. 527 — "no que couber").

AO JUÍZO DA {{VARA_COMARCA}}
Processo nº {{PROCESSO}}
{{EXEQUENTE}}, CPF/CNPJ {{CPF_CNPJ_EXEQUENTE}}, requer a expedição de intimação para {{EXECUTADO}}, CPF/CNPJ {{CPF_CNPJ_EXECUTADO}}, pagar em 15 dias (art. 523 CPC), acrescido de custas.

## DEMONSTRATIVO DISCRIMINADO E ATUALIZADO (art. 524)
- Principal: {{VALOR_PRINCIPAL}}
- Índice de correção: {{INDICE}} (termo inicial {{TERMO_INICIAL_CORRECAO}} / termo final {{TERMO_FINAL_CORRECAO}})
- Juros aplicados e taxas: {{JUROS}} (termo inicial {{TERMO_INICIAL_JUROS}} / termo final {{TERMO_FINAL_JUROS}})
- Capitalização (se houver): {{CAPITALIZACAO}}
- Descontos obrigatórios: {{DESCONTOS}}
- Bens passíveis de penhora: {{BENS_A_PENHORAR}}
- Multa/honorários do art. 523 § 1º: a incidir APÓS o prazo de 15 dias sem pagamento integral (§ 2º: sobre o restante, se parcial)

## Pedidos
a) Intimação para pagamento em 15 dias (art. 523);
b) Não pago: multa de 10% + honorários de 10% (art. 523 § 1º);
c) Expedição "desde logo" do mandado de penhora e avaliação (art. 523 § 3º);
d) {{PEDIDOS_ACESSORIOS}} (ex.: penhora eletrônica, incidente de desconsideração — arts. 133-137).

Nestes termos, pede deferimento. {{LOCAL_DATA}} — {{ADVOGADO_OAB}}

## CHECKLIST DE REVISÃO (embutido)
- [ ] Demonstrativo com os 7 itens do art. 524 (I-VII)
- [ ] Termos inicial/final de juros e correção indicados (art. 524 IV)
- [ ] Bens à penhora indicados "sempre que possível" (art. 524 VII)
- [ ] Definitivo × provisório (art. 527) — salvaguardas do provisório conferidas
- [ ] Dados em poder do executado: requerer sob pena de aplicação dos §§ 4º-5º do 524
- [ ] Fonte verificada no Planalto (consulta {{DATA_CONSULTA}})`,
    metadados: { variaveis: ['VARA_COMARCA', 'PROCESSO', 'EXEQUENTE', 'CPF_CNPJ_EXEQUENTE', 'EXECUTADO', 'CPF_CNPJ_EXECUTADO', 'VALOR_PRINCIPAL', 'INDICE', 'TERMO_INICIAL_CORRECAO', 'TERMO_FINAL_CORRECAO', 'JUROS', 'TERMO_INICIAL_JUROS', 'TERMO_FINAL_JUROS', 'CAPITALIZACAO', 'DESCONTOS', 'BENS_A_PENHORAR', 'PEDIDOS_ACESSORIOS', 'LOCAL_DATA', 'ADVOGADO_OAB', 'DATA_CONSULTA'] },
    tags: ['processual-civil/execucao'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'cpc-art-524-demonstrativo-credito', tipo: 'FUNDAMENTA_EM', descricao: 'Base legal do demonstrativo.' },
    ],
  },
  {
    slug: 'peca-impugnacao-cumprimento-sentenca',
    titulo: 'Peça-modelo — Impugnação ao cumprimento de sentença (art. 525, com regra do excesso)',
    tipoDocumento: 'PECA',
    area: 'processual-civil',
    subarea: 'execucao',
    assunto: 'Executado — defesa',
    prioridade: 'P1',
    lote: 'LOTE-017',
    conteudo: `# IMPUGNAÇÃO AO CUMPRIMENTO DE SENTENÇA (MODELO EJC)
## Uso: executado, em 15 dias do fim do prazo de pagamento (art. 525 caput), nos próprios autos, sem necessidade de penhora prévia.

AO JUÍZO DA {{VARA_COMARCA}}
Processo nº {{PROCESSO}}
{{EXECUTADO}}, por seu advogado, apresenta IMPUGNAÇÃO, aduzindo:

### Fundamentos (art. 525 § 1º — indicar os incisos aplicáveis)
- {{INCISO}}: {{FUNDAMENTO}} (I citação na revelia; II ilegitimidade; III inexequibilidade/inexigibilidade — inclui inconstitucionalidade declarada pelo STF ANTES do trânsito em julgado, §§ 12-14; IV penhora/avaliação; V excesso; VI incompetência; VII causa superveniente)
### Excesso de execução (§ 4º) — se alegado
DECLARAR DE IMEDIATO o valor correto: {{VALOR_CORRETO}}, com demonstrativo discriminado anexo (senão: rejeição liminar/preclusão da alegação — § 5º).
### Efeito suspensivo (§ 6º)
Requerer com GARANTIA do juízo (penhora/caução/depósito: {{GARANTIA}}), demonstrando fundamentos relevantes e grave dano de difícil ou incerta reparação: {{DANO_DEMONSTRADO}}.
### Pedidos
{{PEDIDOS}}
Nestes termos, pede deferimento. {{LOCAL_DATA}} — {{ADVOGADO_OAB}}

## CHECKLIST DE REVISÃO (embutido)
- [ ] Tempestividade: 15 dias após esvazio o prazo do art. 523 (art. 525 caput)
- [ ] Cada alegação mapeada a um inciso do § 1º (rol taxativo)
- [ ] Fato SUPERVENIENTE ao prazo da impugnação → simples petição 15 dias (§ 11), não impugnação
- [ ] Excesso: valor correto declarado de imediato + demonstrativo (§§ 4º-5º)
- [ ] Efeito suspensivo: SEM garantia não é concedido (§ 6º); penhora continua mesmo com suspensão (§ 7º)
- [ ] Impugnação NÃO impede expropriação (§ 6º) — avaliar pedido de caução do exequente (§ 10)
- [ ] Fonte verificada no Planalto (consulta {{DATA_CONSULTA}})`,
    metadados: { variaveis: ['VARA_COMARCA', 'PROCESSO', 'EXECUTADO', 'INCISO', 'FUNDAMENTO', 'VALOR_CORRETO', 'GARANTIA', 'DANO_DEMONSTRADO', 'PEDIDOS', 'LOCAL_DATA', 'ADVOGADO_OAB', 'DATA_CONSULTA'] },
    tags: ['processual-civil/execucao'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'cpc-art-525-impugnacao-fundamentos', tipo: 'FUNDAMENTA_EM', descricao: 'Base literal da impugnação.' },
    ],
  },
  {
    slug: 'fluxo-cumprimento-quantia-certa',
    titulo: 'Fluxo — Cumprimento de sentença por quantia certa (requerimento → extinção)',
    tipoDocumento: 'FLUXO',
    area: 'processual-civil',
    subarea: 'execucao',
    assunto: 'Mapa processual completo',
    prioridade: 'P1',
    lote: 'LOTE-017',
    conteudo: `# FLUXO DO CUMPRIMENTO — QUANTIA CERTA (CPC arts. 523-527; textos literais, consulta 2026-08-30)
1. **Trânsito em julgado/direto (art. 523 caput)** → exequente requer com demonstrativo (art. 524, 7 itens).
2. **Intimação do executado** → 15 dias para pagar + custas (art. 523 caput).
3a. **PAGOU TUDO** → extinção.
3b. **PAGOU PARTE** → multa/honorários de 10% sobre o RESTANTE (§ 2º).
3c. **NÃO PAGOU** → débito + multa 10% + honorários 10% (§ 1º) e mandado de penhora "desde logo" (§ 3º).
4. **Impugnação em 15 dias** (art. 525 caput) — sem nova intimação; fundamentos taxativos (§ 1º); excesso com demonstrativo próprio (§§ 4º-5º).
5. **Efeito suspensivo (§ 6º):** só com garantia + relevância + grave dano; penhora continua (§ 7º); parte restante prossegue (§ 8º); caução do exequente para prosseguir (§ 10).
6. **Fatos supervenientes:** simples petição em 15 dias da ciência (§ 11).
7. **Julgamento da impugnação** → penhora → expropriação (art. 530 → arts. 831 e seguintes).
8. **Via alternativa do devedor (art. 526):** depositar ANTES da intimação com memória de cálculo → autor ouvido em 5 dias; insuficiência → multa/honorários sobre a diferença.
**Riscos:** intimação pessoal ausente (defesa de nulidade); pagar 15 dias atrasado = multa integral (não há "redução" no texto).`,
    tags: ['processual-civil/execucao', 'geral/prazos'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'cpc-art-523-pagamento-15-dias-multa', tipo: 'FUNDAMENTA_EM', descricao: 'Núcleo do fluxo.' },
      { destinoSlug: 'peca-requerimento-cumprimento-quantia-certa', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Peça do passo 1.' },
      { destinoSlug: 'peca-impugnacao-cumprimento-sentenca', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Peça do passo 4.' },
    ],
  },
  {
    slug: 'checklist-cumprimento-exequente-executado',
    titulo: 'Checklist — Cumprimento de sentença: controle para exequente e executado (CPC arts. 523-528)',
    tipoDocumento: 'CHECKLIST',
    area: 'processual-civil',
    subarea: 'execucao',
    assunto: 'Controle operacional',
    prioridade: 'P1',
    lote: 'LOTE-017',
    conteudo: `# CHECKLIST DUPLO DO CUMPRIMENTO (textos literais, consulta 2026-08-30)
## Exequente
1. Demonstrativo com os 7 itens do art. 524 (índice, juros, termos inicial/final, capitalização, descontos, bens).
2. Requerer multa/honorários de 10% SOMENTE após vazio o prazo de 15 dias (art. 523 § 1º) — parcial: sobre o restante (§ 2º).
3. Penhora "desde logo" (§ 3º) — pedir na mesma petição de inadimplemento.
4. Excesso aparente no valor (art. 524 § 1º): executa pelo pretendido, penhora pelo valor adequado.
5. Dados do executado: requisitar (§ 4º) — silêncio sem justificativa → cálculos reputados corretos (§ 5º).
6. Impugnação apresentada NÃO trava a execução (art. 525 § 6º) — monitorar e requerer caução para prosseguir (§ 10).
## Executado
7. Pagar em 15 dias OU depositar antes da intimação (art. 526) — parcial reduz a base da multa (art. 523 § 2º).
8. Impugnação em 15 dias, fundamentos taxativos (art. 525 § 1º I-VII).
9. Excesso: declarar valor correto + demonstrativo de imediato (§§ 4º-5º).
10. Efeito suspensivo exige garantia + grave dano (§ 6º); fato superveniente → petição simples 15 dias (§ 11).
## Alimentos (art. 528)
11. Intimação PESSOAL 3 dias; justificativa apenas com impossibilidade ABSOLUTA (§ 2º); prisão 1-3 meses (§ 3º); 3 prestações anteriores + vincendas (§ 7º); opção pela via expropriativa sem prisão (§ 8º).
12. **Aviso EJC:** validar prazos no processo concreto (expediente, portais, decisões).`,
    tags: ['processual-civil/execucao'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'prazo-pagamento-voluntario-15-dias',
    titulo: 'Prazo — Pagamento voluntário no cumprimento: 15 dias (CPC art. 523 caput)',
    tipoDocumento: 'PRAZO',
    area: 'processual-civil',
    subarea: 'execucao',
    assunto: 'Cumprimento de sentença',
    prioridade: 'P1',
    lote: 'LOTE-017',
    conteudo: `## Prazo registrado
- **Situação:** intimação do executado para pagar débito de condenação em quantia certa (ou liquidadas/parcela incontroversa).
- **Prazo:** 15 dias úteis (CPC art. 219).
- **Fundamento:** CPC art. 523 caput (Planalto, 2026-08-30).
- **Consequência do vazio:** multa 10% + honorários 10% (§ 1º) e penhora desde logo (§ 3º); parcial → sanções sobre o restante (§ 2º).
- **Observações:** prazo da impugnação inicia ao transcorrer este prazo (art. 525 caput), sem nova intimação.
- **Aviso EJC:** validar no processo concreto.`,
    metadados: { tipo: 'processual', contagem: 'dias úteis', fundamento_literal: 'CPC art. 523 caput' },
    tags: ['processual-civil/execucao', 'geral/prazos'],
    fonte: PLANALTO,
    urlFonte: URL_CPC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'prazo-impugnacao-cumprimento-15-dias',
    titulo: 'Prazo — Impugnação ao cumprimento: 15 dias (CPC art. 525 caput)',
    tipoDocumento: 'PRAZO',
    area: 'processual-civil',
    subarea: 'execucao',
    assunto: 'Cumprimento de sentença',
    prioridade: 'P1',
    lote: 'LOTE-017',
    conteudo: `## Prazo registrado
- **Situação:** transcorrido o prazo de pagamento (art. 523) sem pagamento integral.
- **Prazo:** 15 dias úteis, independentemente de penhora ou nova intimação, nos próprios autos.
- **Fundamento:** CPC art. 525 caput (Planalto, 2026-08-30).
- **Observações:** a apresentação NÃO impede atos executivos (§ 6º); efeito suspensivo só com garantia (§ 6º); fato superveniente → simples petição em 15 dias da ciência (§ 11).
- **Aviso EJC:** validar no processo concreto.`,
    metadados: { tipo: 'processual', contagem: 'dias úteis', fundamento_literal: 'CPC art. 525 caput' },
    tags: ['processual-civil/execucao', 'geral/prazos'],
    fonte: PLANALTO,
    urlFonte: URL_CPC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'prazo-alimentos-intimacao-3-dias',
    titulo: 'Prazo — Alimentos: intimação pessoal para pagar/justificar em 3 dias (CPC art. 528 caput)',
    tipoDocumento: 'PRAZO',
    area: 'processual-civil',
    subarea: 'execucao',
    assunto: 'Execução de alimentos',
    prioridade: 'P1',
    lote: 'LOTE-017',
    conteudo: `## Prazo registrado
- **Situação:** execução de sentença/decisão interlocutória de alimentos pela via da coerção.
- **Prazo:** 3 dias para pagar, provar o pagamento ou justificar impossibilidade ABSOLUTA.
- **Fundamento:** CPC art. 528 caput e § 2º (Planalto, 2026-08-30).
- **Consequências:** protesto do pronunciamento (§ 1º) + prisão de 1 a 3 meses (§ 3º) se não pagar/justificativa rejeitada; prisão cobre até 3 prestações anteriores ao ajuizamento + vincendas (§ 7º).
- **Alternativa:** via expropriativa desde logo SEM prisão (§ 8º); desconto em folha (art. 529).
- **Aviso EJC:** validar no processo concreto.`,
    metadados: { tipo: 'processual', contagem: 'dias corridos (intimação pessoal)', fundamento_literal: 'CPC art. 528' },
    tags: ['processual-civil/execucao', 'geral/prazos'],
    fonte: PLANALTO,
    urlFonte: URL_CPC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'sumula-453-stj-honorarios-omitidos',
    titulo: 'Súmula 453/STJ — Honorários omitidos em decisão transitada em julgado não podem ser cobrados em execução ou ação própria',
    tipoDocumento: 'JURISPRUDENCIA',
    area: 'processual-civil',
    subarea: 'execucao',
    assunto: 'Honorários sucumbenciais',
    prioridade: 'P1',
    lote: 'LOTE-017',
    metadados: { tribunal: 'STJ', tipo_precedente: 'súmula', orgao: 'Arquivo Cidadão (referência institucional)', situacao: 'cobrança de honorários omitidos' },
    conteudo: `## Enunciado
"Os honorários sucumbenciais, quando omitidos em decisão transitada em julgado, não podem ser cobrados em execução ou em ação própria."

## Dados do precedente
- **Tribunal:** Superior Tribunal de Justiça (Súmula 453).
- **Fonte consultada (2026-08-30):** Enciclopédia oficial de precedentes do TJMG (www8.tjmg.jus.br) — enunciado verbatim exibido na página oficial do tribunal; portal STJ (arquivocidadao/SCON) BLOQUEADO por Cloudflare/403 na data da consulta.
- **Confiabilidade B (honesto):** enunciado confirmado em fonte tribunal oficial (TJMG); faltou a página original do STJ — RE-CAPTURAR no arquivo oficial do STJ quando acessível antes de citar em documento definitivo.

## Aplicação prática
- Verificar se a decisão exequenda FIXOU honorários: omitidos + trânsito em julgado → não cobríveis por execução nem por ação própria (a via fica bloqueada pelo enunciado).
- Cuidado com a expressão "quando omitidos": honorários FIXADOS (mesmo arbitrados depois por IRDR/legislação transitória) seguem regime próprio — EJC não estende o enunciado além de seu texto.`,
    tags: ['processual-civil/execucao'],
    fonte: 'TJMG — Enciclopédia de precedentes (www8.tjmg.jus.br)',
    urlFonte: 'https://www8.tjmg.jus.br/enciclopedia-nugep/DasDespesasdosHonorariosAdvocati.html',
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-09-30 (re-capturar no STJ)',
  },
  {
    slug: 'argumentacao-cumprimento-impugnacao',
    titulo: 'Argumentação bilateral — Impugnação do devedor × prosseguimento do exequente (CPC art. 525)',
    tipoDocumento: 'ARGUMENTACAO',
    area: 'processual-civil',
    subarea: 'execucao',
    assunto: 'Controvérsias do cumprimento',
    prioridade: 'P1',
    lote: 'LOTE-017',
    conteudo: `# CONTROVÉRSIA 1 — Excesso de execução
- **Devedor:** demonstrativo do exequente excede o julgado (art. 525 § 1º V); declarar valor correto de imediato com cálculo próprio (§ 4º).
- **Exequente:** valor segue fielmente o demonstrativo (art. 524); excesso não declarado nos moldes do § 4º → preclusão/rejeição (§ 5º).
- **Provocar:** memórias de cálculo cruzadas + verificação pelo contabilista do juízo (art. 524 § 2º).

# CONTROVÉRSIA 2 — Efeito suspensivo da impugnação
- **Devedor:** fundamentos relevantes + grave dano de difícil/incerta reparação (§ 6º) — leilão iminente, leilão de ativo essencial etc.
- **Exequente:** impugnação NÃO trava nada por si (§ 6º caput); com suspensão, ainda assim penhora é substituída/reforçada (§ 7º) e o exequente pode caucionar para prosseguir (§ 10).
- **Pontos:** valor da garantia × dano alegado; suspensão parcial (§ 8º).

# CONTROVÉRSIA 3 — Inexigibilidade por inconstitucionalidade (§§ 12-15)
- **Devedor:** decisão do STF ANTERIOR ao trânsito em julgado torna inexigível o título (§ 12).
- **Exequente:** modulação temporal (§ 13) e decisão POSTERIOR ao trânsito → via única é rescisória (§ 15).

# CONTROVÉRSIA 4 — Honorários do § 1º do 523
- **Devedor:** pagamento parcial limita a base (§ 2º) — cobrança sobre total é excesso.
- **Exequente:** parcial feito FORA do prazo de 15 dias não limita nada (o texto do § 2º exige pagamento "no prazo previsto no caput").`,
    tags: ['processual-civil/execucao'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'doutrina-multas-executivas-cumprimento',
    titulo: 'Doutrina EJC — Multas do sistema executivo (art. 523 e art. 526)',
    tipoDocumento: 'DOUTRINA',
    area: 'processual-civil',
    subarea: 'execucao',
    assunto: 'Natureza e função',
    prioridade: 'P1',
    lote: 'LOTE-017',
    conteudo: `# CONCEITO (elaboração própria EJC — sem cópia extensa de obras protegidas)
As multas do cumprimento de sentença têm **função coercitiva indireta**: induzir o pagamento voluntário em 15 dias, poupando a fase de expropriação.

## Normas do sistema (textos literais)
- **Art. 523 § 1º:** multa 10% + honorários 10% pelo inadimplemento do prazo.
- **Art. 523 § 2º:** parcial → incidência sobre o restante (proporcionalidade expressa).
- **Art. 526 §§ 1º-2º:** pagamento espontâneo anterior à intimação — insuficiente → multa/honorários só sobre a diferença (incentivo ao depósito inteligente).
- **Art. 528 § 3º:** nos alimentos, a coerção é PESSOAL (prisão 1-3 meses) — lógica diversa da patrimonial.

## Finalidade
- Equilíbrio: pune o inadimplemento INTEGRADO no prazo e PREMIA o pagamento parcial/antecipado — leitura direta dos §§ 2º do 523 e 526.

## Controvérsias clássicas
- Momento de contagem (intimação pelo advogado constitucido × pessoa).
- Aplicação a títulos constituídos antes do CPC/2015 — EJC NÃO registra tese: confirmou-se apenas que o Tema 810/STF trata de outro assunto (art. 1º-F da Lei 9.494); retroatividade da multa NÃO confirmada em fonte oficial nesta consulta (2026-08-30).`,
    tags: ['processual-civil/execucao'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'triagem-cumprimento-sentenca',
    titulo: 'Triagem — Cumprimento de sentença: tipo de obrigação e via adequada',
    tipoDocumento: 'TRIAGEM',
    area: 'processual-civil',
    subarea: 'execucao',
    assunto: 'Diagnóstico por perguntas',
    prioridade: 'P1',
    lote: 'LOTE-017',
    conteudo: `# ROTEIRO DE TRIAGEM — CUMPRIMENTO (CPC arts. 523-530)
1. **Obrigação de pagar quantia certa?** → arts. 523-527 (definitivo) ou art. 527 (provisório, "no que couber").
2. **Obrigação de prestar alimentos?** → art. 528: escolher via COERÇÃO (intimação pessoal 3 dias → protesto + prisão 1-3 meses; 3 prestações anteriores + vincendas, § 7º) ou EXPROPRIAÇÃO desde logo (§ 8º, sem prisão) + desconto em folha (art. 529, se empregado/funcionário/diretor-gerente).
3. **Obrigação de fazer/não fazer ou entregar coisa?** → fora desta rodada (cáp. III — "não cumprida a obrigação, arts. 831 e seguintes" para quantia — art. 530).
4. **Você é exequente?** → demonstrativo 7 itens (art. 524); requerer penhora desde logo (art. 523 § 3º); monitorar impugnação (não trava — art. 525 § 6º).
5. **Você é executado?** → pagar 15 dias (art. 523); parcial reduz multa (§ 2º); impugnar em 15 dias com incisos do § 1º; excesso com demonstrativo (§§ 4º-5º); suspensão exige garantia (§ 6º).
6. **Há título fundado em lei declarada inconstitucional pelo STF?** → inexigibilidade (art. 525 §§ 12-15): decisão ANTES do trânsito; depois → rescisória (§ 15).
7. **Documentos:** sentença/certidão de trânsito, demonstrativo, endereço, memória de cálculo própria (se impugnar excesso).
8. **Confidencialidade:** valores/negócios na BASE PRIVADA DO CASO.`,
    tags: ['processual-civil/execucao', 'geral/triagem'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'fluxo-cumprimento-quantia-certa', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Fluxo detalhado equivalente.' },
    ],
  },
  {
    slug: 'regra-se-cumprimento-sentenca-rotas',
    titulo: 'Regra SE-ENTÃO — Rotas do cumprimento de sentença (CPC arts. 523-530)',
    tipoDocumento: 'REGRA_INTELIGENCIA',
    area: 'processual-civil',
    subarea: 'execucao',
    assunto: 'Inteligência processual',
    prioridade: 'P1',
    lote: 'LOTE-017',
    conteudo: `# REGRA DE INTELIGÊNCIA — EJC (fundada em textos literais, consulta 2026-08-30)

SE tipo_processo = cumprimento_quantia_certa ENTÃO verificar:
- demonstrativo completo (art. 524, 7 itens);
- intimação e prazo de 15 dias (art. 523);
- SE pagou integral no prazo ENTÃO extinção;
- SE pagou parcial ENTÃO multa/honorários 10% sobre o RESTANTE (§ 2º);
- SE não pagou ENTÃO multa+honorários (§ 1º) + penhora desde logo (§ 3º);
- SE impugnação ENTÃO fundamentos do art. 525 § 1º (taxativos) + excesso com demonstrativo (§§ 4º-5º) + suspensão SEM garantia não é concedida (§ 6º);
- SE fato superveniente ENTÃO petição simples 15 dias (§ 11);
- SE título fundado em norma declarada inconstitucional pelo STF ENTÃO §§ 12-15 (antes do trânsito = inexigível; depois = rescisória).

SE tipo_processo = cumprimento_alimentos ENTÃO verificar:
- via coerção (art. 528: intimação pessoal 3 dias; impossibilidade ABSOLUTA; prisão 1-3 meses; 3 prestações anteriores + vincendas) OU via expropriação desde logo (§ 8º, sem prisão);
- SE executado é funcionário/militar/diretor-gerente/empregado ENTÃO desconto em folha (art. 529, ofício sob pena de desobediência);
- SE penhora em dinheiro na via expropriativa ENTÃO levantamento mensal mesmo com impugnação suspensa (art. 528 § 8º).

SE devedor quer evitar multa ENTÃO art. 526: depositar antes da intimação com memória de cálculo (insuficiência → multa/honorários só sobre a diferença).`,
    tags: ['processual-civil/execucao'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'jurimetria-vazia-cumprimento-sentenca',
    titulo: 'Jurimetria — Cumprimento de sentença (estrutura vazia — sem dados reais)',
    tipoDocumento: 'JURIMETRIA',
    area: 'processual-civil',
    subarea: 'execucao',
    assunto: 'Estrutura para dados futuros',
    prioridade: 'P3',
    lote: 'LOTE-017',
    conteudo: `# JURIMETRIA — CUMPRIMENTO DE SENTENÇA
**Status: SEM DADOS.** Nenhuma estatística real nesta consulta (2026-08-30) — o EJC NÃO inventa percentuais (item 18 da missão).

## Campos preparados
- tribunal/classe/período/amostra/metodologia/fonte;
- indicadores futuros: taxa de pagamento voluntário em 15 dias; concessão de efeito suspensivo; procedência de alegações de excesso; duração média até penhora.

## Separação obrigatória: DADO ESTATÍSTICO REAL (com fonte) × ANÁLISE QUALITATIVA.`,
    tags: ['processual-civil/execucao', 'geral/metodologia'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
];
