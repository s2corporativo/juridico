// LOTE-015 — Mandado de segurança — Lei 12.016/2009, dispositivos remanescentes (P1)
// Textos LITERAIS extraídos do Planalto em 2026-08-30:
// https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2009/lei/l12016.htm
// Arts. 5º (vedações + p.ú. VETADO), 6º (inicial + exibição 10 dias), 7º (liminar/caução, "Vide ADIN 4296"),
// 8º-12 (perempção 3 dias úteis, remessa 48h, indeferimento, MP 10 dias, decisão 30 dias), 13-14
// (ofício, apelação, duplo grau obrigatório, execução provisória, vencimentos), 15 (suspensão pelo
// presidente do tribunal, agravo 5 dias) e 23 (decadência 120 dias, "Vide ADIN 4296").
//
// ANTI-INVENÇÃO desta rodada:
// - ADI 4296: confirmado APENAS em snippet da página oficial portal.stf.jus.br (captura integral
//   falhou por JS — 404 template): "Por maioria dos votos, a Corte considerou inconstitucional o
//   dispositivo que proíbe a concessão de liminar para a compensação de créditos..." + constitucional
//   o art. 7º, III (caução). OUTROS desfechos (art. 15 § 1º, art. 25 etc.) NÃO confirmados nesta
//   consulta — NÃO afirmados. Registro com confiabilidade B e notas honestas.
// - Art. 5º, parágrafo único: "(VETADO)" no texto oficial — nenhum conteúdo atribuído.
// - Não citado nenhum REsp/acórdão específico de MS nesta consulta além da ADI 4296 (único confirmado).
import type { InputDocument } from '../../src/lib/ejc/types';

const D = '2026-08-30';
const PLANALTO = 'Presidência da República — Planalto';
const URL_MS = 'https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2009/lei/l12016.htm';
const EJC = 'Elaboração EJC — conteúdo estrutural original';

function leiMs(
  slug: string, titulo: string, assunto: string, conteudo: string, artigos: string[],
  extra?: Partial<InputDocument>,
): InputDocument {
  return {
    slug, titulo, tipoDocumento: 'LEGISLACAO', area: 'processual-civil', subarea: 'mandado-de-seguranca',
    assunto, prioridade: 'P1', lote: 'LOTE-015',
    conteudo,
    metadados: { numero: 'Lei 12.016/2009', data_norma: '2009-08-07', orgao: 'Congresso Nacional', artigos_principais: artigos, vigente: true, confirmacao_texto: 'Extração literal do texto oficial do Planalto em 2026-08-30.' },
    tags: ['processual-civil/mandado-de-seguranca', 'geral/prazos'],
    fonte: PLANALTO,
    urlFonte: URL_MS,
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
  leiMs(
    'l12016-art-5-vedacoes-cabimento',
    'Lei 12.016/2009 art. 5º — Vedações ao mandado de segurança e parágrafo único VETADO (texto literal confirmado)',
    'Cabimento e vedações',
    `## Ficha da Norma
- **Norma:** Lei nº 12.016, de 7 de agosto de 2009 (Mandado de Segurança) — art. 5º.

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 5º Não se concederá mandado de segurança quando se tratar:
I - de ato do qual caiba recurso administrativo com efeito suspensivo, independentemente de caução;
II - de decisão judicial da qual caiba recurso com efeito suspensivo;
III - de decisão judicial transitada em julgado.

Parágrafo único. (VETADO)"

## Leitura aplicada — as 3 vedaçãoes de cabimento
- **Recurso administrativo com efeito suspensivo:** a existência do recurso suspensivo esgota a via administrativa antes da via judicial (o inciso NÃO exige caução — "independentemente de caução").
- **Decisão judicial com recurso suspensivo:** não se usa MS para escapar do sistema recursal — apelação com efeito suspensivo (p.ex. CPC art. 1.012 § 2º) fecha o writ.
- **Coisa julgada:** decisões transitadas em julgado NÃO são impugnáveis por MS (reexame vedado).
- **Parágrafo único VETADO:** qualquer doutrina que cite "art. 5º p.ú. da Lei 12.016" como norma vigente está equivocada — o texto oficial registra o veto; não há conteúdo a atribuir.

## Hipóteses de aplicação no EJC
- Triagem: verificar as três vedações ANTES de impetrar (rota de triagem vinculada).
- Conexão com o regime recursal da base (agrávo/apelação — docs vinculados).`,
    ['5', '5 p.ú.'],
    {
      relacionamentos: [
        { destinoSlug: 'l12016-art-23-decadencia-120-dias', tipo: 'REFINA', descricao: 'Vedação temporal paralela: decadência de 120 dias.' },
        { destinoSlug: 'regra-se-ms-cabimento-vedacoes', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Regra SE-ENTÃO de checagem das vedações.' },
        { destinoSlug: 'cpc-art-1015-cabimento-agravo-texto-atual', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Sistema recursal do CPC citado no inciso II.' },
      ],
    },
  ),
  leiMs(
    'l12016-art-6-peticao-inicial-exibicao',
    'Lei 12.016/2009 art. 6º — Petição inicial do MS, autoridade coatora e exibição de documento em 10 dias (texto literal confirmado)',
    'Petição inicial e prova documental',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 6º A petição inicial, que deverá preencher os requisitos estabelecidos pela lei processual, será apresentada em 2 (duas) vias com os documentos que instruírem a primeira reproduzidos na segunda e indicará, além da autoridade coatora, a pessoa jurídica que esta integra, à qual se acha vinculada ou da qual exerce atribuições.

§ 1º No caso em que o documento necessário à prova do alegado se ache em repartição ou estabelecimento público ou em poder de autoridade que se recuse a fornecê-lo por certidão ou de terceiro, o juiz ordenará, preliminarmente, por ofício, a exibição desse documento em original ou em cópia autêntica e marcará, para o cumprimento da ordem, o prazo de 10 (dez) dias. O escrivão extrairá cópias do documento para juntá-las à segunda via da petição.

§ 2º Se a autoridade que tiver procedido dessa maneira for a própria coatora, a ordem far-se-á no próprio instrumento da notificação.

§ 3º Considera-se autoridade coatora aquela que tenha praticado o ato impugnado ou da qual emane a ordem para a sua prática.

§ 4º (VETADO)

§ 5º Denega-se o mandado de segurança nos casos previstos pelo art. 267 da Lei nº 5.869, de 11 de janeiro de 1973 - Código de Processo Civil.

§ 6º O pedido de mandado de segurança poderá ser renovado dentro do prazo decadencial, se a decisão denegatória não lhe houver apreciado o mérito."

## Leitura aplicada
- **Duas vias obrigatórias** com cópias dos documentos (estrutura própria do writ — a segunda via é notificada ao coator, art. 7º I).
- **Autoridade coatora (§ 3º):** quem PRATICOU o ato ou de quem EMANA a ordem — apontar coatora errada é risco de extinção.
- **Exibição preliminar (§ 1º):** documento retido por órgão/autoridade/terceiro → juiz manda exibir em 10 dias antes da notificação — ferramenta essencial quando a prova está com a própria Administração.
- **Renovação (§ 6º):** denegação sem mérito NÃO preclui a impetração dentro do prazo decadencial (120 dias — art. 23, doc vinculado).
- **§ 4º VETADO** no texto oficial (nada a atribuir); § 5º remete às hipóteses de extinção do CPC/1973 (aplicação hoje subsidiária — sem prejuízo da leitura pelo CPC/2015).

## Hipóteses de aplicação no EJC
- Checklist da inicial: 2 vias + docs reproduzidos + coatora (pessoa física/cargo) + pessoa jurídica vinculada.
- Pedido prévio de exibição quando o cliente não tem a prova (certidões,protocolos retidos).`,
    ['6', '6 § 1º', '6 § 3º', '6 § 6º'],
    {
      relacionamentos: [
        { destinoSlug: 'l12016-art-7-liminar-caucao', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Notificação da coatora e liminar (art. 7º).' },
        { destinoSlug: 'checklist-dossie-mandado-seguranca', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Checklist da inicial e do dossiê.' },
      ],
    },
  ),
  leiMs(
    'l12016-art-7-liminar-caucao',
    'Lei 12.016/2009 art. 7º — Liminar, caução/fiança/depósito e vedações (texto literal confirmado, com "Vide ADIN 4296")',
    'Medida liminar',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 7º Ao despachar a inicial, o juiz ordenará:
I - que se notifique o coator do conteúdo da petição inicial, enviando-lhe a segunda via apresentada com as cópias dos documentos, a fim de que, no prazo de 10 (dez) dias, preste as informações;
II - que se dê ciência do feito ao órgão de representação judicial da pessoa jurídica interessada, enviando-lhe cópia da inicial sem documentos, para que, querendo, ingresse no feito;
III - que se suspenda o ato que deu motivo ao pedido, quando houver fundamento relevante e do ato impugnado puder resultar a ineficácia da medida, caso seja finalmente deferida, sendo facultado exigir do impetrante caução, fiança ou depósito, com o objetivo de assegurar o ressarcimento à pessoa jurídica. (Vide ADIN 4296)

§ 1º Da decisão do juiz de primeiro grau que conceder ou denegar a liminar caberá agravo de instrumento, observado o disposto na Lei nº 5.869, de 11 de janeiro de 1973 - Código de Processo Civil.

§ 2º Não será concedida medida liminar que tenha por objeto a compensação de créditos tributários, a entrega de mercadorias e bens provenientes do exterior, a reclassificação ou equiparação de servidores públicos e a concessão de aumento ou a extensão de vantagens ou pagamento de qualquer natureza. (Vide ADIN 4296)

§ 3º Os efeitos da medida liminar, salvo se revogada ou cassada, persistirão até a prolação da sentença.

§ 4º Deferida a medida liminar, o processo terá prioridade para julgamento.

§ 5º As vedações relacionadas com a concessão de liminares previstas neste artigo se estendem à tutela antecipada a que se referem os arts. 273 e 461 da Lei nº 5.869, de 11 de janeiro de 1973 - Código de Processo Civil."

## Leitura aplicada
- **Notificação + 10 dias para informações** (inciso I — prazo doc vinculado); ciência da Procuradoria (II).
- **Caução facultativa (III):** o juiz PODE exigir caução/fiança/depósito para liminar — constitucionalidade confirmada no julgamento da ADI 4296 (registro de jurisprudência vinculado, confiabilidade B).
- **§ 2º parcialmente fulminado:** o dispositivo que vedava liminar de "compensação de créditos tributários" e "entrega de mercadorias e bens provenientes do exterior" foi declarado INCONSTITUCIONAL pela ADI 4296 (STF, por maioria — registro B honesto, captura integral pendente). A parte relativa a reclassificação/equiparação de servidores e aumento de vantagens NÃO foi confirmada como afetada nesta consulta — tratar por cautela como ainda aplicável àquelas parcelas até confirmação.
- **§ 3º:** efeitos da liminar persistem até a sentença (estabilização).
- **§ 4º:** prioridade de julgamento com liminar deferida.
- **§ 5º:** vedações estendem-se à tutela antecipada (remissão às normas do CPC/1973 — hoje lida com o CPC/2015 sem alteração do teor da vedação).

## Hipóteses de aplicação no EJC
- Impetração tributária: liminar de compensação de créditos POSSÍVEL após ADI 4296 (tese vinculada).
- Recurso: agravo de instrumento contra decisão de liminar (remissão ao sistema do CPC — docs de agravo da base).`,
    ['7 I', '7 III', '7 § 1º', '7 § 2º', '7 § 3º', '7 § 4º'],
    {
      relacionamentos: [
        { destinoSlug: 'adin-4296-stf-mandado-seguranca', tipo: 'DECIDE', descricao: 'ADI que atingiu o § 2º e confirmou o inciso III.' },
        { destinoSlug: 'tese-ms-liminar-compensacao-creditos-possivel', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Tese pós-ADI 4296.' },
        { destinoSlug: 'prazo-ms-informacoes-coator-10-dias', tipo: 'EXTRAI', descricao: 'Prazo de 10 dias do inciso I.' },
        { destinoSlug: 'cpc-art-1015-cabimento-agravo-texto-atual', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Agravo de instrumento remetido no § 1º.' },
      ],
    },
  ),
  leiMs(
    'l12016-arts-8-12-procedimento',
    'Lei 12.016/2009 arts. 8º a 12 — Perempção da liminar (3 dias úteis), remessa em 48 horas, indeferimento da inicial, parecer do MP (10 dias) e decisão em 30 dias (texto literal confirmado)',
    'Procedimento do writ',
    `## Textos CONFIRMADOS LITERALMENTE no Planalto (consulta 2026-08-30) — trechos essenciais
"Art. 8º Será decretada a perempção ou caducidade da medida liminar ex officio ou a requerimento do Ministério Público quando, concedida a medida, o impetrante criar obstáculo ao normal andamento do processo ou deixar de promover, por mais de 3 (três) dias úteis, os atos e as diligências que lhe cumprirem.

Art. 9º As autoridades administrativas, no prazo de 48 (quarenta e oito) horas da notificação da medida liminar, remeterão ao Ministério ou órgão a que se acham subordinadas e ao Advogado-Geral da União ou a quem tiver a representação judicial da União, do Estado, do Município ou da entidade apontada como coatora cópia autenticada do mandado notificatório, assim como indicações e elementos outros necessários às providências a serem tomadas para a eventual suspensão da medida e defesa do ato apontado como ilegal ou abusivo de poder.

Art. 10. A inicial será desde logo indeferida, por decisão motivada, quando não for o caso de mandado de segurança ou lhe faltar algum dos requisitos legais ou quando decorrido o prazo legal para a impetração.
§ 1º Do indeferimento da inicial pelo juiz de primeiro grau caberá apelação e, quando a competência para o julgamento do mandado de segurança couber originariamente a um dos tribunais, do ato do relator caberá agravo para o órgão competente do tribunal que integre.
§ 2º O ingresso de litisconsorte ativo não será admitido após o despacho da petição inicial.

Art. 12. Findo o prazo a que se refere o inciso I do caput do art. 7º desta Lei, o juiz ouvirá o representante do Ministério Público, que opinará, dentro do prazo improrrogável de 10 (dez) dias.
Parágrafo único. Com ou sem o parecer do Ministério Público, os autos serão conclusos ao juiz, para a decisão, a qual deverá ser necessariamente proferida em 30 (trinta) dias."

## Leitura aplicada — riscos operacionais
- **Caducidade da liminar em 3 DIAS ÚTEIS de inércia do impetrante** (art. 8º) — agenda do cliente impetrante é crítica: qualquer diligência que caiba ao impetrante não pode parar.
- **48 horas** para a Administração internalizar a liminar (art. 9º) — prazo para a defesa se organizar (incluindo pedir suspensão — art. 15).
- **Indeferimento liminar da inicial** por falta de requisitos OU por decadência (art. 10); apelação do indeferimento; agravo quando competência originária de tribunal.
- **Litisconsorte ativo só ANTES do despacho da inicial** (art. 10 § 2º).
- **MP 10 dias (improrrogável) + decisão do juiz em 30 dias** (art. 12) — prazos doc vinculados.

## Hipóteses de aplicação no EJC
- Gestão do impetrante: alerta automático de caducidade (regra SE-ENTÃO vinculada).
- Fluxo completo (doc vinculado) integra estes prazos ao circuito do writ.`,
    ['8', '9', '10', '10 § 1º', '10 § 2º', '12'],
    {
      relacionamentos: [
        { destinoSlug: 'fluxo-mandado-seguranca', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Fluxo com estas etapas.' },
        { destinoSlug: 'prazo-ms-mp-parecer-10-dias-decisao-30-dias', tipo: 'EXTRAI', descricao: 'Prazos do art. 12.' },
        { destinoSlug: 'prazo-caducidade-liminar-ms-3-dias-uteis', tipo: 'EXTRAI', descricao: 'Prazo crítico do art. 8º.' },
      ],
    },
  ),
  leiMs(
    'l12016-arts-13-14-sentenca-apelacao',
    'Lei 12.016/2009 arts. 13-14 — Ofício da concessão, apelação, duplo grau obrigatório, execução provisória e vencimentos (texto literal confirmado)',
    'Sentença e recurso',
    `## Textos CONFIRMADOS LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 13. Concedido o mandado, o juiz transmitirá em ofício, por intermédio do oficial do juízo, ou pelo correio, mediante correspondência com aviso de recebimento, o inteiro teor da sentença à autoridade coatora e à pessoa jurídica interessada.
Parágrafo único. Em caso de urgência, poderá o juiz observar o disposto no art. 4º desta Lei.

Art. 14. Da sentença, denegando ou concedendo o mandado, cabe apelação.
§ 1º Concedida a segurança, a sentença estará sujeita obrigatoriamente ao duplo grau de jurisdição.
§ 2º Estende-se à autoridade coatora o direito de recorrer.
§ 3º A sentença que conceder o mandado de segurança pode ser executada provisoriamente, salvo nos casos em que for vedada a concessão da medida liminar.
§ 4º O pagamento de vencimentos e vantagens pecuniárias assegurados em sentença concessiva de mandado de segurança a servidor público da administração direta ou autárquica federal, estadual e municipal somente será efetuado relativamente às prestações que se vencerem a contar da data do ajuizamento da inicial."

## Leitura aplicada
- **Execução por ofício** com AR (art. 13) — sem novo processo autônomo.
- **Duplo grau OBRIGATÓRIO quando a segurança é concedida** (art. 14 § 1º): a sentença favorável não produz efeito definitivo antes do reexame — gestão de expectativa do cliente.
- **Autoridade coatora pode recorrer** (§ 2º).
- **Execução provisória possível**, salvo nos casos de vedação de liminar (§ 3º — conexão com art. 7º § 2º e ADI 4296).
- **Vencimentos de servidor: só prestações VENCIDAS A PARTIR do ajuizamento** (§ 4º) — limita a retroatividade econômica.

## Hipóteses de aplicação no EJC
- Prever apelação obrigatória (da coatora) no planejamento do caso concedido.
- Calcular o corte temporal dos vencimentos em MS previdenciário/funcional.`,
    ['13', '14', '14 § 1º', '14 § 3º', '14 § 4º'],
    {
      relacionamentos: [
        { destinoSlug: 'fluxo-mandado-seguranca', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Etapas finais do fluxo.' },
        { destinoSlug: 'l12016-art-7-liminar-caucao', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Vedações citadas no § 3º.' },
      ],
    },
  ),
  leiMs(
    'l12016-art-15-suspensao-presidente',
    'Lei 12.016/2009 art. 15 — Suspensão da liminar e da sentença pelo presidente do tribunal e agravo de 5 dias (texto literal confirmado)',
    'Suspensão de segurança',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 15. Quando, a requerimento de pessoa jurídica de direito público interessada ou do Ministério Público e para evitar grave lesão à ordem, à saúde, à segurança e à economia públicas, o presidente do tribunal ao qual couber o conhecimento do respectivo recurso suspender, em decisão fundamentada, a execução da liminar e da sentença, dessa decisão caberá agravo, sem efeito suspensivo, no prazo de 5 (cinco) dias, que será levado a julgamento na sessão seguinte à sua interposição.

§ 1º Indeferido o pedido de suspensão ou provido o agravo a que se refere o caput deste artigo, caberá novo pedido de suspensão ao presidente do tribunal competente para conhecer de eventual recurso especial ou extraordinário.

§ 2º É cabível também o pedido de suspensão a que se refere o § 1º deste artigo, quando negado provimento a agravo de instrumento interposto contra a liminar a que se refere este artigo.

§ 3º A interposição de agravo de instrumento contra liminar concedida nas ações movidas contra o poder público e seus agentes não prejudica nem condiciona o julgamento do pedido de suspensão a que se refere este artigo.

§ 4º O presidente do tribunal poderá conferir ao pedido efeito suspensivo liminar se constatar, em juízo prévio, a plausibilidade do direito invocado e a urgência na concessão da medida.

§ 5º As liminares cujo objeto seja idêntico poderão ser suspensas em uma única decisão, podendo o presidente do tribunal estender os efeitos da suspensão a liminares supervenientes, mediante simples aditamento do pedido original."

## Leitura aplicada
- **Requisitos do pedido de suspensão:** requerimento da PESSOA JURÍDICA pública interessada OU do MP + grave lesão à ordem/saúde/segurança/economia públicas + decisão fundamentada do presidente do tribunal "ao qual couber o conhecimento do respectivo recurso".
- **Agravo SEM efeito suspensivo, 5 dias, julgamento na sessão seguinte** (caput) — prazo doc vinculado.
- **Nova instância de suspensão** ao presidente do tribunal superior quando houver REsp/RE (§ 1º).
- **Independência entre agravo e suspensão** (§ 3º) e **efeito suspensivo liminar do pedido** (§ 4º).
- **Suspensão coletiva** de liminares idênticas com extensão a liminares supervenientes (§ 5º).

## Nota de cautela (regra anti-invenção)
- O desfecho da ADI 4296 quanto a eventuais vícios deste artigo NÃO foi confirmado nesta consulta — nada afirmado; verificar o julgado integral antes de sustentar inconstitucionalidade aqui.

## Hipóteses de aplicação no EJC
- Monitorar pedido de suspensão no fluxo do cliente concedido (risco documentado no fluxo vinculado).
- Preparar agravo de 5 dias com alegação da ausência dos requisitos do caput.`,
    ['15', '15 § 1º', '15 § 3º', '15 § 4º', '15 § 5º'],
    {
      relacionamentos: [
        { destinoSlug: 'prazo-agravo-suspensao-liminar-ms-5-dias', tipo: 'EXTRAI', descricao: 'Prazo do agravo do caput.' },
        { destinoSlug: 'fluxo-mandado-seguranca', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Ramal de risco do fluxo.' },
        { destinoSlug: 'cpc-art-1015-cabimento-agravo-texto-atual', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Agravo de instrumento no CPC vigente.' },
      ],
    },
  ),
  leiMs(
    'l12016-art-23-decadencia-120-dias',
    'Lei 12.016/2009 art. 23 — Decadência de 120 dias do direito de requerer mandado de segurança (texto literal confirmado, "Vide ADIN 4296")',
    'Decadência',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 23. O direito de requerer mandado de segurança extinguir-se-á decorridos 120 (cento e vinte) dias, contados da ciência, pelo interessado, do ato impugnado. (Vide ADIN 4296)"

## Leitura aplicada
- **Prazo FATAL (decadência material):** 120 dias da CIÊNCIA do ato impugnado — não admite suspensão/interrupção do próprio texto; a contagem rege-se pelas regras processuais aplicáveis (dias úteis na justiça federal, art. 219 CPC — consulta: docs de prazos da base).
- **Termo inicial = ciência:** notificação, publicação do ato, decisão em plenário de colegiado, recusa de atendimento — documentar QUANDO o cliente soube (prova da ciência é crítica).
- **Ato complexo/oportuno:** por segurança operacional, contar 120 dias da ciência do último elemento do ato (prática do EJC — não substitui análise casuística).
- **Renovação (art. 6º § 6º):** denegação sem mérito permite reimpetração DENTRO do prazo decadencial.
- **"Vide ADIN 4296":** a anotação oficial existe; nesta consulta NÃO foi confirmado se a ADI afetou este artigo — nada afirmado.

## Hipóteses de aplicação no EJC
- Primeira checagem de triagem (doc de prazo vinculado; doc de jurisprudência Súmula 376/STJ para JEC).`,
    ['23'],
    {
      relacionamentos: [
        { destinoSlug: 'prazo-mandado-seguranca-120-dias', tipo: 'REFINA', descricao: 'Doc de prazo operacional já na base (LOTE-012).' },
        { destinoSlug: 'l12016-art-5-vedacoes-cabimento', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Vedações de cabimento.' },
        { destinoSlug: 'adin-4296-stf-mandado-seguranca', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'ADI anotada oficialmente ("Vide ADIN 4296").' },
      ],
    },
  ),

  // ============ JURISPRUDÊNCIA ============
  {
    slug: 'adin-4296-stf-mandado-seguranca',
    titulo: 'ADI 4296/DF (STF) — Liminar de compensação de créditos tributários: vedação do art. 7º § 2º Lei 12.016 declarada inconstitucional; caução do art. 7º III constitucional',
    tipoDocumento: 'JURISPRUDENCIA', area: 'processual-civil', subarea: 'mandado-de-seguranca',
    assunto: 'Controle de constitucionalidade da Lei do Mandado de Segurança', prioridade: 'P1', lote: 'LOTE-015',
    conteudo: `## Ficha do precedente
- **Processo:** Ação Direta de Inconstitucionalidade nº 4.296/DF — ajuizada pelo Conselho Federal da OAB (nº único 0007424-92.2009.1.00.0000, conforme registro público do processo).
- **Órgão:** Supremo Tribunal Federal — Plenário; decisão por maioria de votos.
- **Data do noticiário oficial consultado:** página de notícia do portal STF referenciada pela busca de 2026-08-30 (publicação registrada como 09/06/2021 no resultado de busca).

## O que FOI CONFIRMADO nesta consulta (fontes oficiais)
- **Página oficial do STF (portal.stf.jus.br — notícia 467335), capturada via snippet de busca (captura integral da página falhou por JS):** "Por maioria dos votos, a Corte considerou inconstitucional o dispositivo que proíbe a concessão de liminar para a compensação de créditos..." — o dispositivo em questão é o art. 7º, § 2º, da Lei 12.016/2009 (que vedava liminar de compensação de créditos tributários e entrega de mercadorias e bens do exterior).
- **Constitucionalidade do art. 7º, III (caução/fiança/depósito):** confirmada por noticiário jurídico e resumo do julgado (fontes secundárias de médio porte) — a exigência facultativa de caução foi mantida.
- O texto oficial do Planalto carrega as anotações "(Vide ADIN 4296)" nos arts. 7º (inciso III e § 2º), 23 e 25 — confirmando que o julgamento atingiu dispositivos desta lei.

## O que NÃO foi confirmado nesta consulta (honestidade do registro)
- **Não confirmado:** desfecho específico quanto ao art. 15 § 1º (suspensão de segurança), art. 23 (decadência) e art. 25 (honorários) — NADA afirmado sobre esses dispositivos.
- **Não confirmado:** número de votos, relator(a) e a íntegra da tese — exigem leitura do inteiro teor (rodada futura: STF/inteiro teor oficial).

## Uso no EJC
- Sustentar cabimento de LIMINAR em MS para COMPENSAÇÃO DE CRÉDITOS TRIBUTÁRIOS (a vedação do art. 7º § 2º, primeira parte, não subsiste — tese vinculada).
- Enfrentar pedido de caução: a exigência facultativa é CONSTITUCIONAL — discutir a adequação no caso concreto, não a validade do instrumento.
- NÃO citar esta ADI como fundamento contra o art. 15/23/25 sem confirmação integral.`,
    metadados: { processo: 'ADI 4296/DF', tribunal: 'Supremo Tribunal Federal', orgao: 'Plenário', data_decisao_aprox: '2021 (noticiário oficial; confirmação do dia exato pendente na captura integral)', confiabilidade_notas: 'B — página oficial confirmada por snippet (anti-bot/JS); inteiro teor pendente' },
    tags: ['processual-civil/mandado-de-seguranca', 'tributario/liminares'],
    fonte: 'Supremo Tribunal Federal — portal.stf.jus.br (notícia oficial 467335)', urlFonte: 'https://portal.stf.jus.br/noticias/verNoticiaDetalhe.asp?idConteudo=467335', dataConsulta: D,
    confiabilidade: 'B', vigente: true, status: 'ATIVO',
    dataUltimaVerificacao: D, proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'l12016-art-7-liminar-caucao', tipo: 'DECIDE', descricao: 'Atinge o § 2º e confirma o inciso III do art. 7º.' },
      { destinoSlug: 'tese-ms-liminar-compensacao-creditos-possivel', tipo: 'FUNDAMENTA', descricao: 'Tese operacional do desfecho confirmado.' },
    ],
  },

  // ============ TESE ============
  {
    slug: 'tese-ms-liminar-compensacao-creditos-possivel',
    titulo: 'Tese — Liminar em MS para compensação de créditos tributários é cabível: a vedação do art. 7º § 2º da Lei 12.016 caiu na ADI 4296 (STF)',
    tipoDocumento: 'TESE', area: 'tributario', subarea: 'mandado-de-seguranca',
    assunto: 'Medida liminar tributária no writ', prioridade: 'P1', lote: 'LOTE-015',
    conteudo: `## Tese
**A vedação de conceder medida liminar em mandado de segurança para "compensação de créditos tributários" (e entrega de mercadorias e bens provenientes do exterior) foi declarada INCONSTITUCIONAL pelo STF na ADI 4296 — portanto, a liminar visando autorizar compensação tributária via MS é juridicamente possível. A exigência FACULTATIVA de caução/fiança/depósito (art. 7º, III) permanece constitucional.**

## Requisitos de aplicação
1. Direito líquido e certo demonstrado documentalmente (créditos lançados e homologados, exemplo: declarações/períodos sem pendências).
2. Impetração dentro dos 120 dias da ciência do ato que recusa a compensação (art. 23).
3. Ausência das vedações do art. 5º (não há recurso administrativo com efeito suspensivo pendente para o mesmo objeto).
4. Fumus boni iuris + ineficácia da medida final sem liminar (art. 7º, III — fundamento relevante).

## Argumentos a favor (impetrante)
- ADI 4296 (STF, por maioria): inconstitucionalidade da vedação — registro de jurisprudência na base (confiabilidade B, captura integral pendente).
- A vedação restringia jurisdição em tema tributário sem justificativa compatível com a garantia do art. 5º LXIX.
- Caução continua possível mas facultativa — discutir adequação/valor.

## Argumentos contra (coatora)
- Cautela pós-ADI 4296: sustentar que a vedação à "entrega de mercadorias/bens do exterior" ou outras parcelas do § 2º subsistem (NÃO confirmado nesta consulta — verificável no inteiro teor).
- Análise de fumus: erros nos créditos compensáveis; dever de fiscalização (parafiscalidade).
- Caução como condição prática da liminar (art. 7º, III).

## Riscos e probabilidade (qualitativa)
- Núcleo da tese (compensação) suportado por julgamento do STF — probabilidade de deferimento de LIMINAR boa com prova documental robusta; o desfecho de mérito depende do direito líquido.
- Cuidado: captura integral do julgado pendente (rodada futura) — citar a ADI com a ressalva honesta até leitura integral.

## Fontes de sustentação
- ADI 4296/DF (doc de jurisprudência vinculado); Lei 12.016 arts. 7º e 23 (docs literais vinculados).`,
    metadados: { tema_central: 'liminar de compensação de créditos tributários em MS', probabilidade: 'boa com prova documental', risco: 'inteiro teor da ADI pendente de leitura; parcelas não confirmadas do § 2º', estado_arte: 'julgamento por maioria confirmado em página oficial STF (snippet)' },
    tags: ['tributario/liminares', 'processual-civil/mandado-de-seguranca'],
    fonte: EJC, urlFonte: '', dataConsulta: D,
    confiabilidade: 'B', vigente: true, status: 'ATIVO',
    dataUltimaVerificacao: D, proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'adin-4296-stf-mandado-seguranca', tipo: 'FUNDAMENTA', descricao: 'Precedente que sustenta a tese.' },
      { destinoSlug: 'l12016-art-7-liminar-caucao', tipo: 'FUNDAMENTA', descricao: 'Texto legal atingido.' },
    ],
  },

  // ============ PEÇA ============
  {
    slug: 'peca-impetracao-mandado-seguranca',
    titulo: 'Peça-modelo — Petição inicial de mandado de segurança (Lei 12.016/2009, arts. 6º e 7º)',
    tipoDocumento: 'PECA', area: 'processual-civil', subarea: 'mandado-de-seguranca',
    assunto: 'Impetração de mandado de segurança', prioridade: 'P1', lote: 'LOTE-015',
    conteudo: `## Modelo operacional — variáveis entre {{ }}
Dados fictícios: NÃO. Estrutura com variáveis; preencher somente com fatos do caso e documentos do dossiê.

### Endereçamento
EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) {{ORGAO_JUDICIARIO — ex.: da __ª Vara da Seção Judiciária de ___ / do Tribunal de Justiça (originário)}}

### Qualificação
**{{NOME_IMPETRANTE}}**, {{NACIONALIDADE}}, {{ESTADO_CIVIL}}, {{PROFISSAO}}, {{CPF_CNPJ}}, endereço {{ENDERECO}}, por seu advogado (procuração anexa — poderes especiais), vem impetrar **MANDADO DE SEGURANÇA** com pedido de **MEDIDA LIMINAR** (Lei 12.016/2009) contra ato da autoridade coatora:

**Autoridade coatora:** {{CARGO_AUTORIDADE_COATORA}} — {{NOME_AUTORIDADE_COATORA}}, vinculada a {{PESSOA_JURIDICA_INTERESSADA}} (art. 6º, caput e § 3º: praticou o ato {{ATO_IMPOGNADO}} ou de quem emana a ordem).

### I. Dos fatos
1. {{Cronologia objetiva com datas exatas: ato impugnado, ciência do impetrante (termo inicial dos 120 dias — art. 23), pedidos administrativos e recusas}}.
2. **Ciência do ato:** {{DATA_CIENCIA + como ocorreu (notificação/publicação/recusa documentada)}} — dentro dos 120 dias.

### II. Do direito líquido e certo
- **Prova documental (art. 6º § 1º):** {{lista de documentos anexos que provam o direito — MS não admite prova testemunhal}}.
- **Violência ou ilegalidade/abuso de poder:** {{narrativa jurídica}}.
- **Ato de autoridade:** o impugnado é ato de autoridade pública no desempenho de atribuições.
- **Inexistência das vedações do art. 5º:** não há recurso administrativo com efeito suspensivo para o objeto ({{VIA_ADMINISTRATIVA}}); não é decisão judicial; não é coisa julgada.
- **Ato impugnado:** {{descrição precisa}}.

### III. Da medida liminar
- **Fumus/ineficácia (art. 7º, III):** {{fundamento relevante + ineficácia do deferimento final se não suspender o ato agora}}.
- {{SE TRIBUTÁRIO/COMPENSAÇÃO: sustentar a ADI 4296 (STF — vedação do art. 7º § 2º inconstitucional; doc da base) e ofertar/analisar caução facultativa}}.
- {{Aviso: se o objeto cair em vedação ainda subsistente (reclassificação/equiparação de servidores, aumento de vantagens — confirmar caso a caso), ajustar o pedido}}.

### IV. Da exibição preliminar de documento (se aplicável)
- Requerer ordem de exibição em 10 dias (art. 6º § 1º) do documento retido por {{ORGAO/AUTORIDADE/TERCEIRO}} — {{identificação do documento}}.

### V. Dos pedidos
a) a notificação da autoridade coatora (art. 7º, I) para prestar informações em 10 dias;
b) ciência ao órgão de representação judicial da pessoa jurídica (art. 7º, II);
c) a CONCESSÃO DA LIMINAR suspendendo o ato (art. 7º, III), {{com ou sem caução — discutir}};
d) ao final, a CONCESSÃO DEFINITIVA da segurança confirmando a liminar;
e) a fixação de prioridade de julgamento (art. 7º § 4º), se liminar deferida;
f) {{pedidos adicionais: ofícios, abonação, cancelamento de lançamento etc.}}.

### VI. Valor da causa
R$ {{VALOR_CAUSA}} ({{critério — art. 6º remete à lei processual}}).

**Nestes termos, pede deferimento.** {{CIDADE}}, {{DATA}}.

### Checklist embutido antes do protocolo
- [ ] 2 vias da inicial + cópias dos documentos reproduzidas (art. 6º caput)
- [ ] Prova da ciência do ato (data) — 120 dias conferidos (art. 23)
- [ ] Coatora correta (art. 6º § 3º) + pessoa jurídica indicada
- [ ] Anexos ordenados como prova do direito líquido (sem testemunhas)
- [ ] Vedações do art. 5º checadas
- [ ] Nenhuma variável "{{}}" restante`,
    metadados: { variaveis: ['ORGAO_JUDICIARIO', 'NOME_IMPETRANTE', 'NACIONALIDADE', 'ESTADO_CIVIL', 'PROFISSAO', 'CPF_CNPJ', 'ENDERECO', 'CARGO_AUTORIDADE_COATORA', 'NOME_AUTORIDADE_COATORA', 'PESSOA_JURIDICA_INTERESSADA', 'ATO_IMPOGNADO', 'DATA_CIENCIA', 'VIA_ADMINISTRATIVA', 'CIDADE', 'DATA', 'VALOR_CAUSA'], dadosFicticios: false },
    tags: ['processual-civil/mandado-de-seguranca', 'geral/pecas'],
    fonte: EJC, urlFonte: '', dataConsulta: D,
    confiabilidade: 'B', vigente: true, status: 'ATIVO',
    dataUltimaVerificacao: D, proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'l12016-art-6-peticao-inicial-exibicao', tipo: 'FUNDAMENTA', descricao: 'Requisitos da inicial.' },
      { destinoSlug: 'checklist-dossie-mandado-seguranca', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Dossiê que alimenta a peça.' },
    ],
  },

  // ============ CHECKLIST ============
  {
    slug: 'checklist-dossie-mandado-seguranca',
    titulo: 'Checklist — Dossiê de mandado de segurança: 13 pontos',
    tipoDocumento: 'CHECKLIST', area: 'processual-civil', subarea: 'mandado-de-seguranca',
    assunto: 'Montagem do writ', prioridade: 'P1', lote: 'LOTE-015',
    conteudo: `## Checklist operacional (13 pontos)
**Cabimento**
- [ ] 1. Ato de AUTORIDADE pública identificado com cargo/nome (art. 6º § 3º)
- [ ] 2. Sem vedação do art. 5º: não há recurso administrativo com efeito suspensivo; não é decisão judicial com recurso suspensivo; não é coisa julgada
- [ ] 3. Prazo: 120 dias da ciência — com PROVA da data da ciência (art. 23)
- [ ] 4. Direito líquido e certo PROVÁVEL POR DOCUMENTOS (MS não admite prova testemunhal)

**Documentos**
- [ ] 5. Documento retido por órgão/terceiro? → incluir pedido de exibição preliminar de 10 dias (art. 6º § 1º)
- [ ] 6. Cópias dos documentos reproduzidas na 2ª via da inicial (art. 6º caput)
- [ ] 7. Procuração com poderes especiais (impetrar, liminar, desistir)

**Liminar**
- [ ] 8. Fumus + ineficácia da medida final (art. 7º, III) formulados
- [ ] 9. Checar vedações remanescentes do art. 7º § 2º (reclassificação/equiparação de servidores; aumento de vantagens) — NÃO assumir a queda integral após ADI 4296 sem confirmação
- [ ] 10. Caução facultativa: avaliar oferta/discussão de valor (art. 7º, III)

**Pós-impetração**
- [ ] 11. Litisconsorte ativo (se houver) ingressa ANTES do despacho da inicial (art. 10 § 2º)
- [ ] 12. Agenda do impetrante: atos e diligências não podem parar mais de 3 DIAS ÚTEIS — risco de caducidade da liminar (art. 8º)
- [ ] 13. Sentença concedida → expectativa de apelação obrigatória (duplo grau, art. 14 § 1º) + execução provisória possível (art. 14 § 3º)`,
    metadados: { total_itens: 13 },
    tags: ['processual-civil/mandado-de-seguranca', 'geral/checklists'],
    fonte: EJC, urlFonte: '', dataConsulta: D,
    confiabilidade: 'B', vigente: true, status: 'ATIVO',
    dataUltimaVerificacao: D, proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'peca-impetracao-mandado-seguranca', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Peça alimentada pelo dossiê.' },
      { destinoSlug: 'l12016-arts-8-12-procedimento', tipo: 'FUNDAMENTA', descricao: 'Prazos de risco (art. 8º).' },
    ],
  },

  // ============ FLUXO ============
  {
    slug: 'fluxo-mandado-seguranca',
    titulo: 'Fluxo — Mandado de segurança: da impetração à execução (Lei 12.016/2009)',
    tipoDocumento: 'FLUXO', area: 'processual-civil', subarea: 'mandado-de-seguranca',
    assunto: 'Mapa procedimental do writ', prioridade: 'P1', lote: 'LOTE-015',
    conteudo: `## Fluxo operacional — evento → prazo → providência → responsável → documento → risco → próxima etapa

### ETAPA 0 — Pré-impetração
- **Evento:** ato de autoridade a ser impugnado.
- **Prazo:** 120 DIAS da ciência (art. 23) — contar imediatamente.
- **Providência:** triagem (vedações art. 5º + cabimento), montagem do dossiê documental, escolha da coatora.
- **Risco:** impetrar contra coatora errada / sem prova documental → indeferimento (art. 10).
- **Próxima etapa:** protocolo.

### ETAPA 1 — Impetração e despacho
- **Providência:** inicial em 2 vias + documentos (art. 6º); pedido de liminar (art. 7º III); exibição preliminar se prova retida (art. 6º § 1º — 10 dias).
- **Litisconsorte ativo:** somente antes do despacho (art. 10 § 2º).
- **Risco:** indeferimento liminar da inicial → apelação (art. 10 § 1º).
- **Próxima etapa:** notificação.

### ETAPA 2 — Liminar
- **Evento:** juiz aprecia o pedido.
- **Providência:** com liminar — caução facultativa pode ser exigida (art. 7º III); sem liminar — avaliar agravo de instrumento (art. 7º § 1º; docs de agravo da base).
- **Risco:** liminar de objeto vedado (reclassificação/equiparação; aumento de vantagens) → rejeição; compensação tributária → sustentar ADI 4296.
- **Próxima etapa:** notificação do coator.

### ETAPA 3 — Notificação e informações
- **Prazo:** coatora presta INFORMAÇÕES em 10 DIAS (art. 7º I); autoridades remetem cópia autenticada em 48 HORAS (art. 9º).
- **Providência:** ciência à Procuradoria (art. 7º II).
- **Risco:** pedidos de suspensão da liminar pelo presidente do tribunal (art. 15 — requisitos: grave lesão à ordem/saúde/segurança/economia públicas) → preparar agravo de 5 DIAS (sem efeito suspensivo).
- **Próxima etapa:** parecer do MP.

### ETAPA 4 — MP e sentença
- **Prazo:** MP 10 DIAS (improrrogável); juiz decide em 30 DIAS (art. 12).
- **Providência:** réplica às informações; juntada de documentos novos (documental).
- **Risco:** caducidade da liminar se o IMPETRANTE parar por mais de 3 DIAS ÚTEIS (art. 8º) — agenda crítica.
- **Próxima etapa:** sentença.

### ETAPA 5 — Sentença e recursos
- **Evento:** concessão ou denegação da segurança.
- **Providência:** concedida → ofício com inteiro teor à coatora (art. 13); APOLAÇÃO obrigatória de ofício pelo duplo grau (art. 14 § 1º); execução PROVISÓRIA possível (art. 14 § 3º); vencimentos limitados às prestações vencidas desde o ajuizamento (art. 14 § 4º). Denegada → apelação (art. 14 caput).
- **Prazo:** apelação 15 dias úteis (CPC — docs da base).
- **Risco:** pedido de suspensão da sentença pelo presidente do tribunal (art. 15 caput).
- **Próxima etapa:** reexame/execução.

### ETAPA 6 — Execução
- **Providência:** execução por ofício (art. 13); baixa da liminar suspensa monitorada; cumprimento específico do ato.
- **Próxima etapa:** encerramento/monitoramento.`,
    metadados: { etapas: 7, base_legal: 'Lei 12.016/2009 arts. 6º-15 e 23 (docs literais na base)' },
    tags: ['processual-civil/mandado-de-seguranca', 'geral/fluxos'],
    fonte: EJC, urlFonte: '', dataConsulta: D,
    confiabilidade: 'B', vigente: true, status: 'ATIVO',
    dataUltimaVerificacao: D, proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'l12016-arts-8-12-procedimento', tipo: 'FUNDAMENTA', descricao: 'Prazos centrais do fluxo.' },
      { destinoSlug: 'l12016-art-15-suspensao-presidente', tipo: 'FUNDAMENTA', descricao: 'Ramal de suspensão.' },
      { destinoSlug: 'fluxo-agravo-instrumento', tipo: 'COMPLEMENTA', descricao: 'Recursal das interlocutórias.' },
    ],
  },

  // ============ TABELA ============
  {
    slug: 'tabela-documentos-mandado-seguranca',
    titulo: 'Tabela — Documentos por fase: mandado de segurança',
    tipoDocumento: 'TABELA_DOCUMENTOS', area: 'processual-civil', subarea: 'mandado-de-seguranca',
    assunto: 'Documentos necessários por fase do writ', prioridade: 'P1', lote: 'LOTE-015',
    conteudo: `## Documentos por fase

| Fase | Documento | Origem | Nota operacional |
|---|---|---|---|
| Pré-impetração | Prova da ciência do ato (notificação, publicação, recusa) | Órgão público/impetrante | Termo inicial dos 120 dias (art. 23) |
| Pré-impetração | Todos os documentos do direito líquido | Impetrante | MS não admite testemunhas |
| Inicial | Procuração com poderes especiais | Impetrante | Liminar + desistência |
| Inicial | 2 vias + cópias reproduzidas | Impetrante | Art. 6º caput |
| Prova retida | Pedido de exibição (10 dias) | Juízo | Art. 6º § 1º |
| Liminar | Caução/fiança/depósito (se exigida) | Impetrante | Art. 7º III — facultado ao juiz |
| Liminar | Comprovantes do fumus (ADI 4296 em tributário) | Impetrante | Tese da base |
| Informações | 2ª via notificada ao coator | Juízo | Art. 7º I |
| Sentença | Ofício com inteiro teor da sentença | Juízo | Art. 13 (AR) |
| Recurso | Apelação | Partes | Art. 14; duplo grau obrigatório se concedida |
| Suspensão | Agravo de 5 dias | Impetrante | Art. 15 caput — sem efeito suspensivo |
| Execução | Certidões de cumprimento do ofício | Impetrante | Monitorar baixa do ato |

## Nota
- A prova é 100% documental; qualquer fato dependente de testemunha → ação ordinária, não writ.`,
    metadados: { linhas: 12 },
    tags: ['processual-civil/mandado-de-seguranca', 'geral/checklists'],
    fonte: EJC, urlFonte: '', dataConsulta: D,
    confiabilidade: 'B', vigente: true, status: 'ATIVO',
    dataUltimaVerificacao: D, proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'checklist-dossie-mandado-seguranca', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Consolidação em checklist.' },
    ],
  },

  // ============ TRIAGEM ============
  {
    slug: 'triagem-mandado-seguranca',
    titulo: 'Triagem — Script de perguntas: mandado de segurança',
    tipoDocumento: 'TRIAGEM', area: 'processual-civil', subarea: 'mandado-de-seguranca',
    assunto: 'Roteiro de entrevista inicial', prioridade: 'P1', lote: 'LOTE-015',
    conteudo: `## Script de triagem (perguntas na ordem — decisão em cada ramo)

1. **O ato impugnado é de autoridade PÚBLICA? Quem praticou (cargo e nome)?**
   - Particular → não há writ.
   - Autoridade → registrar coatora (art. 6º § 3º) e pessoa jurídica.
2. **Quando o cliente tomou CIÊNCIA do ato? Como?**
   - > 120 dias → decadência (art. 23) — avaliar outra via (anulatória, ordinária).
   - ≤ 120 dias → guardar a prova da ciência.
3. **Existe recurso administrativo com efeito suspensivo disponível para o objeto?**
   - Sim, pendente/inexistente → vedação do art. 5º I — esgotar via administrativa.
4. **O ato é decisão judicial?**
   - Sim com recurso suspensivo / coisa julgada → vedação (art. 5º II-III).
5. **A prova do direito é DOCUMENTAL? O cliente tem os documentos?**
   - Documento retido pelo órgão → pedido de exibição (art. 6º § 1º).
   - Prova testemunhal necessária →.writ inviável; ação ordinária.
6. **Qual a urgência: sem liminar o deferimento final perde utilidade?**
   - Sim → formular liminar (art. 7º III) com fundamento relevante.
7. **O objeto é tributário (compensação) ou entrega de bens do exterior?**
   - Compensação → sustentar ADI 4296 (vedação inconstitucional — doc da base).
   - Outros objetos do § 2º → checar parcelas ainda confirmadas com cautela.
8. **O objeto é reclassificação/equiparação de servidor ou aumento de vantagens?**
   - Sim → liminar VEDADA (parcela não confirmada como afetada pela ADI — cautela).
9. **Há litisconsorte ativo potencial?**
   - Ingresso somente ANTES do despacho (art. 10 § 2º).
10. **Cliente consegue movimentar o processo sem paradas > 3 dias úteis?**
    - Não → alertar caducidade da liminar (art. 8º).
11. **É servidor público com pedido de vencimentos?**
    - Prestações vencidas contam só do AJUIZAMENTO (art. 14 § 4º) — alinhar expectativa.
12. **Competência: primeiro grau ou tribunal (originário)?**
    - Tribunal → indeferimento da inicial → agravo (art. 10 § 1º).

## Resultado esperado
Classificar em: MS-VIÁVEL-LIMINAR / MS-VIÁVEL-SEM-LIMINAR / INVIÁVEL-DECADÊNCIA / INVIÁVEL-VEDAÇÃO / OUTRA-VIA (ordinária/administrativa), com lista de documentos faltantes.`,
    metadados: { perguntas: 12 },
    tags: ['processual-civil/mandado-de-seguranca', 'geral/triagem'],
    fonte: EJC, urlFonte: '', dataConsulta: D,
    confiabilidade: 'B', vigente: true, status: 'ATIVO',
    dataUltimaVerificacao: D, proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'regra-se-ms-cabimento-vedacoes', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Mesma lógica em regra SE-ENTÃO.' },
      { destinoSlug: 'checklist-dossie-mandado-seguranca', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Dossiê da saída viável.' },
    ],
  },

  // ============ PRAZOS ============
  {
    slug: 'prazo-ms-informacoes-coator-10-dias',
    titulo: 'Prazo — MS: informações da autoridade coatora em 10 dias (Lei 12.016/2009, art. 7º I)',
    tipoDocumento: 'PRAZO', area: 'processual-civil', subarea: 'mandado-de-seguranca',
    assunto: 'Prazo processual do writ', prioridade: 'P1', lote: 'LOTE-015',
    conteudo: `## Prazo: 10 DIAS (úteis na justiça federal; CPC art. 219 — docs da base)
- **Obrigado:** autoridade coatora.
- **Termo inicial:** da notificação com a 2ª via da inicial e cópias dos documentos.
- **Texto literal (Lei 12.016/2009, art. 7º, I):** "que se notifique o coator do conteúdo da petição inicial, enviando-lhe a segunda via apresentada com as cópias dos documentos, a fim de que, no prazo de 10 (dez) dias, preste as informações".
- **Depois:** parecer do MP em 10 dias (improrrogável) e decisão em 30 dias (art. 12 — doc vinculado).
- **Uso no EJC:** agenda da réplica — monitorar juntada das informações e preparar impugnação imediata.`,
    metadados: { prazo: '10 dias', base: 'Lei 12.016/2009, art. 7º, I', termo_inicial: 'notificação da coatora', sujeito: 'autoridade coatora' },
    tags: ['processual-civil/mandado-de-seguranca', 'geral/prazos'],
    fonte: PLANALTO, urlFonte: URL_MS, dataConsulta: D,
    confiabilidade: 'A', vigente: true, status: 'ATIVO',
    dataUltimaVerificacao: D, proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'l12016-art-7-liminar-caucao', tipo: 'EXTRAI', descricao: 'Documento de origem.' },
      { destinoSlug: 'prazo-ms-mp-parecer-10-dias-decisao-30-dias', tipo: 'SEGUE', descricao: 'Fase seguinte.' },
    ],
  },
  {
    slug: 'prazo-ms-mp-parecer-10-dias-decisao-30-dias',
    titulo: 'Prazo — MS: parecer do MP em 10 dias e decisão do juiz em 30 dias (Lei 12.016/2009, art. 12)',
    tipoDocumento: 'PRAZO', area: 'processual-civil', subarea: 'mandado-de-seguranca',
    assunto: 'Prazos de instrução do writ', prioridade: 'P1', lote: 'LOTE-015',
    conteudo: `## Prazos: MP 10 DIAS (improrrogável) · DECISÃO 30 DIAS
- **Obrigado:** Ministério Público (10 dias) e juiz (30 dias).
- **Termo inicial:** findo o prazo das informações da coatora (art. 7º I).
- **Texto literal (Lei 12.016/2009, art. 12):** "Findo o prazo a que se refere o inciso I do caput do art. 7º desta Lei, o juiz ouvirá o representante do Ministério Público, que opinará, dentro do prazo improrrogável de 10 (dez) dias. Parágrafo único. Com ou sem o parecer do Ministério Público, os autos serão conclusos ao juiz, para a decisão, a qual deverá ser necessariamente proferida em 30 (trinta) dias."
- **Nota:** decisão "necessariamente proferida em 30 dias" — prazo próprio do writ (sem prejuízo das regras gerais de praxe).
- **Uso no EJC:** calendário de cobrança de preclusão do writ.`,
    metadados: { prazo: '10 dias (MP) / 30 dias (decisão)', base: 'Lei 12.016/2009, art. 12', termo_inicial: 'findo o prazo de informações', sujeito: 'MP / juiz' },
    tags: ['processual-civil/mandado-de-seguranca', 'geral/prazos'],
    fonte: PLANALTO, urlFonte: URL_MS, dataConsulta: D,
    confiabilidade: 'A', vigente: true, status: 'ATIVO',
    dataUltimaVerificacao: D, proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'l12016-arts-8-12-procedimento', tipo: 'EXTRAI', descricao: 'Documento de origem.' },
      { destinoSlug: 'fluxo-mandado-seguranca', tipo: 'MAPEIA', descricao: 'Etapa 4 do fluxo.' },
    ],
  },
  {
    slug: 'prazo-caducidade-liminar-ms-3-dias-uteis',
    titulo: 'Prazo — MS: caducidade da liminar se o impetrante parar por mais de 3 dias úteis (Lei 12.016/2009, art. 8º)',
    tipoDocumento: 'PRAZO', area: 'processual-civil', subarea: 'mandado-de-seguranca',
    assunto: 'Prazo crítico do impetrante', prioridade: 'P1', lote: 'LOTE-015',
    conteudo: `## Prazo: MAIS DE 3 DIAS ÚTEIS DE INÉRCIA = caducidade
- **Obrigado:** impetrante (com liminar concedida).
- **Texto literal (Lei 12.016/2009, art. 8º):** "Será decretada a perempção ou caducidade da medida liminar ex officio ou a requerimento do Ministério Público quando, concedida a medida, o impetrante criar obstáculo ao normal andamento do processo ou deixar de promover, por mais de 3 (três) dias úteis, os atos e as diligências que lhe cumprirem."
- **Consequência:** perda da liminar (perempção/caducidade) — de ofício ou por requerimento do MP.
- **Uso no EJC:** alarme operacional — mapear TODOS os atos que caibam ao impetrante (juntadas, emendas, providências) e manter fluxo contínuo (regra SE-ENTÃO vinculada).`,
    metadados: { prazo: '3 dias úteis (teto de inércia)', base: 'Lei 12.016/2009, art. 8º', termo_inicial: 'liminar concedida + ato/diligência pendente do impetrante', sujeito: 'impetrante' },
    tags: ['processual-civil/mandado-de-seguranca', 'geral/prazos'],
    fonte: PLANALTO, urlFonte: URL_MS, dataConsulta: D,
    confiabilidade: 'A', vigente: true, status: 'ATIVO',
    dataUltimaVerificacao: D, proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'l12016-arts-8-12-procedimento', tipo: 'EXTRAI', descricao: 'Documento de origem.' },
      { destinoSlug: 'regra-se-ms-cabimento-vedacoes', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Alarme operacional da regra.' },
    ],
  },
  {
    slug: 'prazo-agravo-suspensao-liminar-ms-5-dias',
    titulo: 'Prazo — MS: agravo contra suspensão de segurança (presidente do tribunal) em 5 dias, sem efeito suspensivo (Lei 12.016/2009, art. 15 caput)',
    tipoDocumento: 'PRAZO', area: 'processual-civil', subarea: 'mandado-de-seguranca',
    assunto: 'Prazo recursal específico do writ', prioridade: 'P1', lote: 'LOTE-015',
    conteudo: `## Prazo: 5 DIAS (agravo sem efeito suspensivo)
- **Obrigado (recurso):** impetrante contra a decisão do presidente do tribunal que suspendeu a execução da liminar/sentença.
- **Termo inicial:** da publicação da decisão de suspensão.
- **Texto literal (Lei 12.016/2009, art. 15 caput):** "Quando, a requerimento de pessoa jurídica de direito público interessada ou do Ministério Público e para evitar grave lesão à ordem, à saúde, à segurança e à economia públicas, o presidente do tribunal ao qual couber o conhecimento do respectivo recurso suspender, em decisão fundamentada, a execução da liminar e da sentença, dessa decisão caberá agravo, sem efeito suspensivo, no prazo de 5 (cinco) dias, que será levado a julgamento na sessão seguinte à sua interposição."
- **Características:** julgamento na SESSÃO SEGUINTE; sem efeito suspensivo; requisitos do pedido de suspensão (pessoa jurídica pública OU MP + grave lesão) — rebater a ausência deles.
- **Uso no EJC:** reação rápida — modelo de agravo com foco nos requisitos do caput.`,
    metadados: { prazo: '5 dias', base: 'Lei 12.016/2009, art. 15 caput', termo_inicial: 'decisão de suspensão', sujeito: 'impetrante' },
    tags: ['processual-civil/mandado-de-seguranca', 'geral/prazos'],
    fonte: PLANALTO, urlFonte: URL_MS, dataConsulta: D,
    confiabilidade: 'A', vigente: true, status: 'ATIVO',
    dataUltimaVerificacao: D, proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'l12016-art-15-suspensao-presidente', tipo: 'EXTRAI', descricao: 'Documento de origem.' },
      { destinoSlug: 'prazo-agravo-instrumento-15-dias', tipo: 'COMPLEMENTA', descricao: 'Agravo geral do CPC (contexto).' },
    ],
  },

  // ============ ARGUMENTAÇÃO ============
  {
    slug: 'argumentacao-ms-bilateral',
    titulo: 'Argumentação — Mandado de segurança: impetrante x coatora (cabimento, liminar, decadência)',
    tipoDocumento: 'ARGUMENTACAO', area: 'processual-civil', subarea: 'mandado-de-seguranca',
    assunto: 'Controvérsias centrais e rebates', prioridade: 'P1', lote: 'LOTE-015',
    conteudo: `## Controvérsia 1 — Cabimento do writ
- **Impetrante:** ato de autoridade + direito líquido e certo provado documentalmente; vedação do art. 5º inexistente.
- **Coatora:** recurso administrativo com efeito suspensivo disponível (art. 5º I); prova insuficiente (não "líquido"); ato não é de autoridade (ato material/discricionariedade pura).
- **Rebate:** a vedação exige efeito SUSPENSIVO ativo — recurso meramente admitido não fecha o writ; liquidez é do DIREITO, não da prova: exibição prévia (art. 6º § 1º) supre documento retido.

## Controvérsia 2 — Decadência de 120 dias
- **Coatora:** impetração tardia; ciência em data anterior (notificação/publicação antiga).
- **Impetrante:** ciência documentada na data alegada; para atos omissos/continuados, a recusa reiterada renova o termo (opera por ato distintivo); renovação possível após denegação sem mérito (art. 6º § 6º).
- **Rebate:** anexar a prova objetiva da ciência (AR, protocolo, publicação) — o juízo sobre termo inicial decide o caso.

## Controvérsia 3 — Liminar
- **Impetrante:** fundamento relevante + ineficácia final (art. 7º III); compensação tributária possível (ADI 4296 — doc da base); caução discutível em valor/adequação.
- **Coatora:** objeto dentro das vedações remanescentes do art. 7º § 2º (reclassificação/equiparação de servidores; aumento de vantagens); perigo de inversão; necessidade de caução robusta.
- **Rebate:** separar PARCELAS do § 2º — só a compensação de créditos/entrega de bens do exterior tem desfecho confirmado; as demais seguem cautelares; ofertar caução condicionada a valor real do risco.

## Controvérsia 4 — Suspensão de segurança (art. 15)
- **Pessoa jurídica/MP:** grave lesão à ordem/saúde/segurança/economia públicas demonstrada.
- **Impetrante:** requisitos genéricos não autorizam suspensão "automática"; decisão deve ser FUNDAMENTADA no caso concreto; agravo de 5 dias com julgamento na sessão seguinte (rapidez — usar).
- **Rebate:** demonstrar equilíbrio — a medida concede direito individual sem comprometer a ordem; contraindicar generalizações.`,
    metadados: { controversias: 4 },
    tags: ['processual-civil/mandado-de-seguranca', 'geral/argumentacao'],
    fonte: EJC, urlFonte: '', dataConsulta: D,
    confiabilidade: 'B', vigente: true, status: 'ATIVO',
    dataUltimaVerificacao: D, proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'adin-4296-stf-mandado-seguranca', tipo: 'FUNDAMENTA', descricao: 'Controvérsia 3 (compensação).' },
      { destinoSlug: 'l12016-art-15-suspensao-presidente', tipo: 'FUNDAMENTA', descricao: 'Controvérsia 4.' },
    ],
  },

  // ============ DOUTRINA ============
  {
    slug: 'doutrina-direito-liquido-certo-ms',
    titulo: 'Doutrina — Direito líquido e certo, prova documental e autoridade coatora (conceitos operacionais do MS)',
    tipoDocumento: 'DOUTRINA', area: 'processual-civil', subarea: 'mandado-de-seguranca',
    assunto: 'Conceitos operacionais', prioridade: 'P1', lote: 'LOTE-015',
    conteudo: `## Conceito — Direito líquido e certo
Comprovável DE PLANO, por documentos (art. 6º Lei 12.016 + sistema do writ): o direito deve estar pronto para ser reconhecido sem dilação probatória. Liquidez = delimitação (valor/objeto); certeza = prova documental do fato constitutivo. **O writ não admite prova testemunhal nem perícia complexa** — se a prova exige dilação, a via é a ação ordinária.

## Conceito — Violência, ilegalidade ou abuso de poder
Paremos do writ: o ato viola a lei, excede a competência ou desvia a finalidade. É o defeito que a sentença sanará; a liminar apenas congela seus efeitos.

## Conceito — Autoridade coatora
"Considera-se autoridade coatora aquela que tenha praticado o ato impugnado ou da qual emane a ordem para a sua prática" (art. 6º § 3º — texto literal na base). Erro recorrente: apontar o CHEFE do órgão em vez de quem praticou/emana. A coatora certa define competência e a 2ª via notificada.

## Conceito — Atos omissos e continuados
MS cabe contra omissão de autoridade (deixar de praticar ato obrigatório por lei). A ciência para os 120 dias opera quando o interessado formaliza o requerimento e a Administração SILENCIA (mora) — cada recusa nova/ato novo reabre o termo. Cautela operacional: documentar protocolos e datas.

## Conceito — Litisconsorte ativo
Ingresso somente ANTES do despacho da inicial (art. 10 § 2º — literal na base): coordenar co-impetrantes na mesma petição.

## Uso no EJC
- Triagem decide MS x ordinária pela PROVA (documental = writ; dilação = ordinária).
- Checklist da inicial (doc vinculado) traduz os conceitos em itens.`,
    metadados: { conceitos: ['direito-liquido-e-certo', 'violencia-ilegalidade-abuso', 'autoridade-coatora', 'atos-omissos', 'litisconsorte-ativo'] },
    tags: ['processual-civil/mandado-de-seguranca', 'geral/doutrina'],
    fonte: EJC, urlFonte: '', dataConsulta: D,
    confiabilidade: 'B', vigente: true, status: 'ATIVO',
    dataUltimaVerificacao: D, proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'l12016-art-6-peticao-inicial-exibicao', tipo: 'FUNDAMENTA', descricao: 'Coatora e exibição (literal).' },
      { destinoSlug: 'triagem-mandado-seguranca', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Roteiro que aplica os conceitos.' },
    ],
  },

  // ============ REGRA SE-ENTÃO ============
  {
    slug: 'regra-se-ms-cabimento-vedacoes',
    titulo: 'Regra — SE impetração de MS ENTÃO checar vedações (art. 5º), decadência (120 dias), prova documental e coatora',
    tipoDocumento: 'REGRA_INTELIGENCIA', area: 'processual-civil', subarea: 'mandado-de-seguranca',
    assunto: 'Regra SE-ENTÃO de diagnóstico', prioridade: 'P1', lote: 'LOTE-015',
    conteudo: `## Regra SE-ENTÃO (inteligência processual EJC)
**SE** o cliente pretende impetrar mandado de segurança
**ENTÃO** executar a sequência:
1. Ato de autoridade pública com coatora identificada (art. 6º § 3º)?
2. Vedações do art. 5º: recurso administrativo SUSPENSIVO pendente? decisão judicial com recurso suspensivo? coisa julgada? — qualquer "sim" = inviável.
3. Decadência: ciência ≤ 120 dias com PROVA da data (art. 23)?
4. Prova 100% documental disponível (ou exibição possível — art. 6º § 1º)? Testemunha necessária = via ordinária.
5. Liminar: fumus + ineficácia (art. 7º III); objeto tributário de compensação → ADI 4296; objeto de reclassificação/equiparação/aumento de vantagens → vedação cautelar (parcela não confirmada como afetada).
6. Agenda do impetrante: sem paradas > 3 dias úteis (art. 8º — caducidade da liminar).
7. Litisconsorte ativo antes do despacho (art. 10 § 2º).
8. Saída: peça de impetração + checklist; se denegada sem mérito → reimpetração dentro do prazo decadencial (art. 6º § 6º).

**SE** a prova exige perícia/testemunho
**ENTÃO** redirecionar para ação ordinária com pedido de tutela (CPC) — NÃO impetrar.

## Limites
- Regra de triagem; o juízo de liquidez/certeza é casuístico.`,
    metadados: { entradas: ['intenção de impetrar MS'], saidas: ['viabilidade', 'liminar-check', 'agenda-caducidade', 'via-alternativa'] },
    tags: ['processual-civil/mandado-de-seguranca', 'geral/inteligencia'],
    fonte: EJC, urlFonte: '', dataConsulta: D,
    confiabilidade: 'B', vigente: true, status: 'ATIVO',
    dataUltimaVerificacao: D, proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'regra-se-mandado-seguranca', tipo: 'COMPLEMENTA', descricao: 'Regra anterior (contexto JEC) — doc LOTE-012.' },
      { destinoSlug: 'triagem-mandado-seguranca', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Roteiro de perguntas correspondente.' },
    ],
  },
];
