// LOTE-006 — Contratos Bancários / CDC (P1) — pesquisa e validação em fontes oficiais em 2026-08-30
// Fontes: Planalto (CDC arts. 42, 42-A, 51, 52 — extração literal), arquivo oficial STJ
// (arquivocidadao.stj.jus.br — Súmulas 380, 381, 472, 479, 539), scon.stj.jus.br (Súmula 297),
// TJDFT (teses literais dos Temas 27, 29, 620, 1061 e Súmula 566 citada em acórdão oficial).
// ANTI-INVENÇÃO: nada citado além do confirmado; data de julgamento não capturada → campo vazio.
import type { InputDocument } from '../../src/lib/ejc/types';

const D = '2026-08-30';
const PLANALTO = 'Presidência da República — Planalto';
const STJ_ARQUIVO = 'STJ — Arquivo Cidadão (arquivocidadao.stj.jus.br)';
const TJDFT = 'TJDFT — Jurisprudência em Temas / Precedentes Qualificados';
const EJC = 'Elaboração EJC — conteúdo estrutural original';

interface FonteInfo {
  url: string;
  norma: string;
  dataNorma?: string;
}

function lei(
  slug: string, titulo: string, area: string, subarea: string, assunto: string,
  conteudo: string, artigos: string[], fonte: FonteInfo,
  extra?: Partial<InputDocument>,
): InputDocument {
  return {
    slug, titulo, tipoDocumento: 'LEGISLACAO', area, subarea,
    assunto, prioridade: 'P1',
    conteudo,
    metadados: { numero: fonte.norma, data_norma: fonte.dataNorma, orgao: 'Congresso Nacional / Presidente', artigos_principais: artigos, vigente: true, confirmacao_texto: 'Extracao literal do texto oficial do Planalto em 2026-08-30.' },
    tags: [`${area}/contratos-bancarios`],
    fonte: PLANALTO,
    urlFonte: fonte.url,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-11-30',
    ...extra,
  };
}

function sumula(
  slug: string, titulo: string, numero: string, texto: string,
  analise: string, fonteInfo: FonteInfo, fonteNome: string,
  extra?: Partial<InputDocument>,
): InputDocument {
  return {
    slug,
    titulo,
    tipoDocumento: 'JURISPRUDENCIA',
    area: 'bancario',
    subarea: 'contratos-bancarios',
    assunto: 'Súmula do STJ — contratos bancários',
    prioridade: 'P1',
    conteudo: `## Súmula ${numero} do STJ
**Texto CONFIRMADO LITERALMENTE em fonte oficial STJ (consulta ${D}):**

> "${texto}"

## Aplicação prática
${analise}

## Rastreabilidade
- Fonte: ${fonteNome}
- URL: ${fonteInfo.url}
- Data da consulta: ${D}
- NOTA ANTI-INVENÇÃO: texto registrado exatamente como consta na fonte; campos de data não capturados na fonte consultada permanecem em branco.`,
    metadados: { numero_sumula: numero, tribunal: 'STJ', texto_sumula: texto, rastreabilidade: 'texto literal em fonte oficial' },
    tags: ['bancario/contratos-bancarios', 'bancario/jurisprudencia', 'stj'],
    fonte: fonteNome,
    urlFonte: fonteInfo.url,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    ...extra,
  };
}

const URL_CDC = 'https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm';
const URL_T27 = 'https://www.tjdft.jus.br/consultas/jurisprudencia/jurisprudencia-em-temas/precedentes-qualificados-na-visao-do-tjdft/direito-civil/contrato-bancario/tema-27-do-stj-revisao-de-juros-remuneratorios-relacao-de-consumo';
const URL_T29 = 'https://www.tjdft.jus.br/consultas/jurisprudencia/jurisprudencia-em-temas/precedentes-qualificados-na-visao-do-tjdft/direito-civil/contrato-bancario/tema-29-do-stj-propositura-da-acao-revisional-nao-afastamento-da-mora';
const URL_T620 = 'https://www.tjdft.jus.br/consultas/jurisprudencia/jurisprudencia-em-temas/precedentes-qualificados-na-visao-do-tjdft/direito-civil/contrato-bancario/tema-620-do-stj-2013-tarifa-de-cadastro-2013-validade-2013-requisitos';
const URL_T1061 = 'https://www.tjdft.jus.br/consultas/jurisprudencia/jurisprudencia-em-temas/precedentes-qualificados-na-visao-do-tjdft/direito-civil/contrato-bancario/tema-1061-do-stj';
const URL_S297 = 'https://scon.stj.jus.br/SCON/sumstj/doc.jsp?livre=%22297%22+INPATH%28NUM%29&b=SUMU&p=false&l=10&i=1&operador=AND';

export default [
  lei(
    'cdc-arts-42-42-a-cobranca-debitos-indebito-dobro',
    'CDC arts. 42 e 42-A — Cobrança de débitos: vedação a constrangimento e repetição do indébito em dobro (textos literais confirmados)',
    'consumidor',
    'cobranca-e-indebito',
    'Limites à cobrança e consequências da cobrança indevida',
    `## Ficha da Norma
- **Norma:** Lei nº 8.078/1990 (CDC), arts. 42 e 42-A.
- **Vigência:** vigente.

## Textos CONFIRMADOS LITERALMENTE no Planalto (consulta ${D})
"Art. 42. Na cobrança de débitos, o consumidor inadimplente não será exposto a ridículo, nem será submetido a qualquer tipo de constrangimento ou ameaça.
Parágrafo único. O consumidor cobrado em quantia indevida tem direito à repetição do indébito, por valor igual ao dobro do que pagou em excesso, acrescido de correção monetária e juros legais, salvo hipótese de engano justificável."

"Art. 42-A. Em todos os documentos de cobrança de débitos apresentados ao consumidor, deverão constar o nome, o endereço e o número de inscrição no Cadastro de Pessoas Físicas – CPF ou no Cadastro Nacional de Pessoa Jurídica – CNPJ do fornecedor do produto ou serviço correspondente.
(Incluído pela Lei nº 12.039, de 2009)"

## Interpretação aplicada
- Direito ao indébito em dobro: base objetiva — pago em excesso → dobro. Exceção: engano JUSTIFICÁVEL (ônus do fornecedor demonstrar justificabilidade).
- Aplicável à cobrança bancária de encargos inexistentes ou excessivos (juros/tarifas não pactuadas).
- Art. 42-A: documento de cobrança sem identificação do fornecedor é irregularidade autônoma.
- Registros públicos negativos: máx. 5 anos (art. 43 § 1º, doc vinculado sobre cadastros em lote posterior).`,
    ['42', '42-A'],
    { url: URL_CDC, norma: 'Lei 8.078/1990 (CDC)', dataNorma: '1990-09-11' },
    {
      tags: ['consumidor/cobranca', 'consumidor/indebito', 'bancario/contratos-bancarios'],
      relacionamentos: [
        { destinoSlug: 'cdc-art-27-fato-produto-5-anos', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Prazos do CDC no mesmo diploma legal.' },
        { destinoSlug: 'tese-repeticao-indebito-dobro-bancario', tipo: 'FUNDAMENTA_TESE', descricao: 'Base legal da tese de repetição em dobro.' },
      ],
    },
  ),
  lei(
    'cdc-art-51-clausulas-abusivas-nulidade',
    'CDC art. 51 — Cláusulas abusivas: nulidade de pleno direito (rol completo incisos I-XIX e §§ 1º-4º, texto literal confirmado)',
    'consumidor',
    'clausulas-abusivas',
    'Nulidade de cláusulas que colocam o consumidor em desvantagem exagerada',
    `## Ficha da Norma
- **Norma:** Lei nº 8.078/1990 (CDC), art. 51 (com redação da Lei 14.181/2021 nos incisos XVII-XIX).
- **Vigência:** vigente.

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta ${D})
"Art. 51. São nulas de pleno direito, entre outras, as cláusulas contratuais relativas ao fornecimento de produtos e serviços que:
I - impossibilitem, exonerem ou atenuem a responsabilidade do fornecedor por vícios de qualquer natureza dos produtos e serviços ou impliquem renúncia ou disposição de direitos. Nas relações de consumo entre o fornecedor e o consumidor pessoa jurídica, a indenização poderá ser limitada, em situações justificáveis;
II - subtraiam ao consumidor a opção de reembolso da quantia já paga, nos casos previstos neste código;
III - transfiram responsabilidades a terceiros;
IV - estabeleçam obrigações consideradas iníquas, abusivas, que coloquem o consumidor em desvantagem exagerada, ou sejam incompatíveis com a boa-fé ou a eqüidade;
V - (Vetado);
VI - estabeleçam inversão do ônus da prova em prejuízo do consumidor;
VII - determinem a utilização compulsória de arbitragem;
VIII - imponham representante para concluir ou realizar outro negócio jurídico pelo consumidor;
IX - deixem ao fornecedor a opção de concluir ou não o contrato, embora obrigando o consumidor;
X - permitam ao fornecedor, direta ou indiretamente, variação do preço de maneira unilateral;
XI - autorizem o fornecedor a cancelar o contrato unilateralmente, sem que igual direito seja conferido ao consumidor;
XII - obriguem o consumidor a ressarcir os custos de cobrança de sua obrigação, sem que igual direito lhe seja conferido contra o fornecedor;
XIII - autorizem o fornecedor a modificar unilateralmente o conteúdo ou a qualidade do contrato, após sua celebração;
XIV - infrinjam ou possibilitem a violação de normas ambientais;
XV - estejam em desacordo com o sistema de proteção ao consumidor;
XVI - possibilitem a renúncia do direito de indenização por benfeitorias necessárias.
XVII - condicionem ou limitem de qualquer forma o acesso aos órgãos do Poder Judiciário;
(Incluído pela Lei nº 14.181, de 2021)
XVIII - estabeleçam prazos de carência em caso de impontualidade das prestações mensais ou impeçam o restabelecimento integral dos direitos do consumidor e de seus meios de pagamento a partir da purgação da mora ou do acordo com os credores;
(Incluído pela Lei nº 14.181, de 2021)
XIX - (VETADO).
(Incluído pela Lei nº 14.181, de 2021)
§ 1º Presume-se exagerada, entre outros casos, a vantagem que:
I - ofende os princípios fundamentais do sistema jurídico a que pertence;
II - restringe direitos ou obrigações fundamentais inerentes à natureza do contrato, de tal modo a ameaçar seu objeto ou equilíbrio contratual;
III - se mostra excessivamente onerosa para o consumidor, considerando-se a natureza e conteúdo do contrato, o interesse das partes e outras circunstâncias peculiares ao caso.
§ 2° A nulidade de uma cláusula contratual abusiva não invalida o contrato, exceto quando de sua ausência, apesar dos esforços de integração, decorrer ônus excessivo a qualquer das partes.
§ 3° (Vetado).
§ 4° É facultado a qualquer consumidor ou entidade que o represente requerer ao Ministério Público que ajuíze a competente ação para ser declarada a nulidade de cláusula contratual que contrarie o disposto neste código ou de qualquer forma não assegure o justo equilíbrio entre direitos e obrigações das partes."

## Interpretação aplicada em contratos bancários
- VI: cláusula que inverte ônus da prova é nula — mas atenção: Tema 1061/STJ (doc vinculado) atribui ao BANCO o ônus da autenticidade da assinatura impugnada.
- VII: arbitragem compulsória é nula — mas arbitragem combinada deve ser analisada caso a caso conforme jurisprudência do STF (ADI 5.929) — este EJC registra a regra legal literal.
- X/XIII: variação e alteração unilaterais — núcleo das teses de abusividade em CCB.
- XII: custos de cobrança sem igual direito do consumidor — nulos.
- XVIII: prazos de carência pós-purgação da mora — nulos (Lei 14.181/2021, regime do superendividamento).`,
    ['51'],
    { url: URL_CDC, norma: 'Lei 8.078/1990 (CDC) — art. 51, redação com Lei 14.181/2021', dataNorma: '1990-09-11' },
    {
      tags: ['consumidor/clausulas-abusivas', 'bancario/contratos-bancarios', 'consumidor/superendividamento'],
      relacionamentos: [
        { destinoSlug: 'regras-contratuais-clausulas-abusivas-ccb', tipo: 'FUNDAMENTA_REGRA', descricao: 'Regras de detecção de cláusulas abusivas em CCB.' },
        { destinoSlug: 'tese-revisao-juros-remuneratorios-bancario', tipo: 'FUNDAMENTA_TESE', descricao: 'Desvantagem exagerada do art. 51 § 1º no Tema 27/STJ.' },
      ],
    },
  ),
  lei(
    'cdc-art-52-credito-consumidor-informacoes',
    'CDC art. 52 — Crédito ao consumidor: informação prévia e adequada, multa máxima de 2% e liquidação antecipada com redução proporcional (texto literal confirmado)',
    'consumidor',
    'credito-e-financiamento',
    'Deveres de informação na outorga de crédito e liquidação antecipada',
    `## Ficha da Norma
- **Norma:** Lei nº 8.078/1990 (CDC), art. 52.
- **Vigência:** vigente.

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta ${D})
"Art. 52. No fornecimento de produtos ou serviços que envolva outorga de crédito ou concessão de financiamento ao consumidor, o fornecedor deverá, entre outros requisitos, informá-lo prévia e adequadamente sobre:
I - preço do produto ou serviço em moeda corrente nacional;
II - montante dos juros de mora e da taxa efetiva anual de juros;
III - acréscimos legalmente previstos;
IV - número e periodicidade das prestações;
V - soma total a pagar, com e sem financiamento.
§ 1° As multas de mora decorrentes do inadimplemento de obrigações no seu termo não poderão ser superiores a dois por cento do valor da prestação.
(Redação dada pela Lei nº 9.298, de 1º.8.1996)
§ 2º É assegurado ao consumidor a liquidação antecipada do débito, total ou parcialmente, mediante redução proporcional dos juros e demais acréscimos.
§ 3º (Vetado)."

## Interpretação aplicada
- Ausência das informações I-V = falha de informação (art. 6º III) → base para revisão e danos.
- Multa de mora > 2% da prestação → nulidade do excesso (art. 51 XV como fechamento).
- Liquidação antecipada parcial/total com redução PROPORCIONAL de juros e acréscimos — direito subjetivo; bancos devem fornecer o demonstrativo.`,
    ['52'],
    { url: URL_CDC, norma: 'Lei 8.078/1990 (CDC) — art. 52, red. Lei 9.298/1996', dataNorma: '1990-09-11' },
  ),
  sumula(
    'sumula-297-stj-cdc-instituicoes-financeiras',
    'Súmula 297/STJ — O Código de Defesa do Consumidor é aplicável às instituições financeiras (texto literal confirmado em fonte oficial)',
    '297',
    'O Código de Defesa do Consumidor é aplicável às instituições financeiras.',
    `- Fundamento da aplicabilidade integral do CDC (inclusive arts. 42, 51 e 52) às operações bancárias de consumo.
- Dados oficiais confirmados na fonte: Súmula n. 297, Segunda Seção, julgado em 12/5/2004, DJ de 8/9/2004, p. 129.
- Base para todo o regime consumerista dos contratos bancários deste lote.`,
    { url: URL_S297, norma: 'Súmula 297/STJ' },
    'STJ — scon.stj.jus.br (busca oficial de súmulas)',
    {
      relacionamentos: [
        { destinoSlug: 'cdc-art-51-clausulas-abusivas-nulidade', tipo: 'APLICA_ARTIGO', descricao: 'CDC aplicável a instituições financeiras.' },
        { destinoSlug: 'cdc-arts-42-42-a-cobranca-debitos-indebito-dobro', tipo: 'APLICA_ARTIGO', descricao: 'Indébito em dobro alcança bancos.' },
      ],
    },
  ),
  sumula(
    'sumula-381-stj-vedado-oficio-abusividade',
    'Súmula 381/STJ — Nos contratos bancários, é vedado ao julgador conhecer, de ofício, da abusividade das cláusulas (texto literal confirmado no arquivo oficial STJ)',
    '381',
    'Nos contratos bancários, é vedado ao julgador conhecer, de ofício, da abusividade das cláusulas.',
    `- CONSEQUÊNCIA PRÁTICA: a abusividade deve ser ALEGADA E PROVADA PELA PARTE (petição inicial/defesa), sob pena de preclusão.
- Checklist de revisão bancária deve garantir alegação expressa de cada cláusula questionada.
- Dados oficiais: aprovada em 22/04/2009, DJE 05/05/2009 (arquivo oficial STJ). Entre os precedentes citados no arquivo consta o REsp 1.061.530/RS.`,
    { url: 'https://arquivocidadao.stj.jus.br/index.php/sumula-381', norma: 'Súmula 381/STJ' },
    STJ_ARQUIVO,
    {
      relacionamentos: [
        { destinoSlug: 'checklist-revisao-contrato-bancario', tipo: 'ORIENTA_CHECKLIST', descricao: 'Exigência de alegação expressa da abusividade.' },
      ],
    },
  ),
  sumula(
    'sumula-380-stj-propositura-revisao-mora',
    'Súmula 380/STJ — A simples propositura da ação de revisão de contrato não inibe a caracterização da mora do autor (texto literal confirmado no arquivo oficial STJ)',
    '380',
    'A simples propositura da ação de revisão de contrato não inibe a caracterização da mora do autor.',
    `- Ajuizar revisão NÃO suspende nem impede a constituição em mora (interação com art. 394 CC) nem a execução da garantia.
- Alerta estratégico ao cliente: risco de busca e apreensão (fiduciária) ou execução permanece durante a revisão.
- Tese idêntica no Tema 29/STJ (doc vinculado) — TJDFT aplica a súmula + tema inclusive para manter busca e apreensão.`,
    { url: 'https://arquivocidadao.stj.jus.br/index.php/sumula-380', norma: 'Súmula 380/STJ' },
    STJ_ARQUIVO,
    {
      relacionamentos: [
        { destinoSlug: 'tema-29-stj-revisao-nao-afasta-mora', tipo: 'MESMA_TRESE', descricao: 'Tema repetitivo com a mesma tese da súmula.' },
        { destinoSlug: 'dl-911-1969-art-3-busca-apreensao', tipo: 'INTERAGE_COM', descricao: 'Mora subsiste durante revisão → cabível busca e apreensão.' },
      ],
    },
  ),
  sumula(
    'sumula-472-stj-comissao-permanencia-exclusao',
    'Súmula 472/STJ — Comissão de permanência limitada e com efeito exclusivo sobre juros e multa (texto literal confirmado no arquivo oficial STJ)',
    '472',
    'A cobrança de comissão de permanência — cujo valor não pode ultrapassar a soma dos encargos remuneratórios e moratórios previstos no contrato — exclui a exigibilidade dos juros remuneratórios, moratórios e da multa contratual.',
    `- Comissão de permanência: (i) teto = soma dos encargos remuneratórios + moratórios contratuais; (ii) exclusividade — não se acumula com juros nem multa.
- ATENÇÃO TEMPORAL: para períodos anteriores, a Súmula 30/STJ ("A COMISSÃO DE PERMANENCIA E A CORREÇÃO MONETARIA SÃO INACUMULAVEIS") trata da cumulação com correção monetária — ambos os textos literais registrados neste EJC; a subsunção ao período concreto exige análise do contrato e da jurisprudência aplicável ao intervalo.`,
    { url: 'https://arquivocidadao.stj.jus.br/index.php/sumula-472', norma: 'Súmula 472/STJ' },
    STJ_ARQUIVO,
  ),
  sumula(
    'sumula-479-stj-fortuito-interno-fraudes',
    'Súmula 479/STJ — Responsabilidade objetiva do banco por fraudes e delitos de terceiros em operações bancárias (texto literal confirmado no arquivo oficial STJ)',
    '479',
    'As instituições financeiras respondem objetivamente pelos danos gerados por fortuito interno relativo a fraudes e delitos praticados por terceiros no âmbito de operações bancárias.',
    `- Clonagem de cartão, golpes eletrônicos, fraudes em transações (PIX inclusive pela estrutura segura exigida) → fortuito INTERNO.
- Fato de terceiro NÃO exime o banco nessas hipóteses: responsabilidade objetiva (art. 14 CDC + risco do negócio).
- Exceções de excludente exigem prova do banco (culpa exclusiva/concorrente da vítima nos limites do caso).`,
    { url: 'https://arquivocidadao.stj.jus.br/index.php/sumula-479-2', norma: 'Súmula 479/STJ' },
    STJ_ARQUIVO,
    {
      relacionamentos: [
        { destinoSlug: 'regra-se-fraude-bancaria-responsabilidade-objetiva', tipo: 'FUNDAMENTA_REGRA', descricao: 'Regra de inteligência para fraude bancária.' },
      ],
    },
  ),
  sumula(
    'sumula-539-stj-capitalizacao-expressamente-pactuada',
    'Súmula 539/STJ — Capitalização com periodicidade inferior à anual é permitida desde 31/3/2000 quando expressamente pactuada (texto literal confirmado no arquivo oficial STJ)',
    '539',
    'É permitida a capitalização de juros com periodicidade inferior à anual em contratos celebrados com instituições integrantes do Sistema Financeiro Nacional a partir de 31/3/2000 (MP n. 1.963-17/2000, reeditada como MP n. 2.170-36/2001), desde que expressamente pactuada.',
    `- DOIS REQUISITOS CUMULATIVOS para capitalização válida: (1) contrato a partir de 31/3/2000; (2) pactuação EXPRESSA (não basta previsão de taxa efetiva/nominal).
- Ausência de pactuação expressa → nulidade da capitalização → desdobramento das parcelas e repetição do excesso (art. 42 § único CDC).
- Dado oficial do arquivo STJ: dossiê datado 10/06/2015; precedentes incluem AgRg no REsp 1.321.170/RS.`,
    { url: 'https://arquivocidadao.stj.jus.br/index.php/sumula-539', norma: 'Súmula 539/STJ' },
    STJ_ARQUIVO,
    {
      relacionamentos: [
        { destinoSlug: 'tema-24-stj-capitalizacao-resp-1061530', tipo: 'MESMA_Tese', descricao: 'Tema repetitivo 24 — REsp 1.061.530/RS.' },
        { destinoSlug: 'regra-se-capitalizacao-pactuacao-expressa', tipo: 'FUNDAMENTA_REGRA', descricao: 'Regra de inteligência da capitalização.' },
      ],
    },
  ),
  {
    slug: 'tema-24-stj-capitalizacao-resp-1061530',
    titulo: 'Tema Repetitivo 24/STJ (REsp 1.061.530/RS) — Capitalização de juros no Sistema Financeiro Nacional (tese consolidada na Súmula 539)',
    tipoDocumento: 'JURISPRUDENCIA',
    area: 'bancario',
    subarea: 'contratos-bancarios',
    assunto: 'Incidente de resolução de demandas repetitivas — capitalização de juros',
    prioridade: 'P1',
    conteudo: `## Tema Repetitivo 24/STJ — capitalização de juros
- **Leading case:** REsp 1.061.530/RS — número CONFIRMADO em documento oficial do TJSP ("REsp no 1.061.530/RS (Tema Repetitivo no 24) do STJ") e nas referências da Súmula 381/STJ no arquivo oficial do STJ.
- **Tese consolidada:** a tese do Tema 24 está codificada na Súmula 539/STJ (doc vinculado): "É permitida a capitalização de juros com periodicidade inferior à anual em contratos celebrados com instituições integrantes do Sistema Financeiro Nacional a partir de 31/3/2000 (MP n. 1.963-17/2000, reeditada como MP n. 2.170-36/2001), desde que expressamente pactuada."

## Rastreabilidade (consulta ${D})
- TJSP — E-SAJ (acórdão oficial citando o tema e o REsp): https://esaj.tjsp.jus.br/cjsg/getArquivo.do?cdAcordao=19080304&cdForo=0
- STJ — Arquivo Cidadão (Súmula 381 citando REsp 1.061.530/RS como precedente): https://arquivocidadao.stj.jus.br/index.php/sumula-381
- NOTA ANTI-INVENÇÃO: data de julgamento do REsp não capturada nas fontes consultadas → campo deixado em branco; NÃO registrada aqui qualquer data não confirmada.`,
    metadados: { tema_repetitivo: '24', tribunal: 'STJ', leading_case: 'REsp 1.061.530/RS', sumula_correlata: '539' },
    tags: ['bancario/contratos-bancarios', 'bancario/capitalizacao', 'stj-tema-repetitivo'],
    fonte: 'TJSP (E-SAJ oficial) + STJ Arquivo Cidadão',
    urlFonte: 'https://esaj.tjsp.jus.br/cjsg/getArquivo.do?cdAcordao=19080304&cdForo=0',
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'sumula-539-stj-capitalizacao-expressamente-pactuada', tipo: 'CODIFICADO_EM', descricao: 'Tese do tema codificada na Súmula 539.' },
      { destinoSlug: 'tese-revisao-juros-remuneratorios-bancario', tipo: 'MESMO_RESP_LEADING_CASE', descricao: 'Mesmo REsp 1.061.530/RS é leading case do Tema 27 (juros remuneratórios).' },
    ],
  },
  {
    slug: 'tema-27-stj-revisao-juros-remuneratorios',
    titulo: 'Tema Repetitivo 27/STJ (REsp 1.061.530/RS) — Revisão de juros remuneratórios só em situação excepcional com abusividade cabalmente demonstrada',
    tipoDocumento: 'JURISPRUDENCIA',
    area: 'bancario',
    subarea: 'contratos-bancarios',
    assunto: 'Incidente de resolução de demandas repetitivas — juros remuneratórios',
    prioridade: 'P1',
    conteudo: `## Tema 27/STJ — revisão de juros remuneratórios
**Tese (texto literal, TJDFT — Precedentes Qualificados, página atualizada em 18/5/2026, pesquisa realizada em 13/5/2026 — consulta ${D}):**

> "É admitida a revisão das taxas de juros remuneratórios em situações excepcionais, desde que caracterizada a relação de consumo e que a abusividade (capaz de colocar o consumidor em desvantagem exagerada (art. 51, §1º, do CDC) fique cabalmente demonstrada, ante às peculiaridades do julgamento em concreto."

- **Leading case:** REsp 1.061.530/RS (conforme a própria página oficial do TJDFT: "De acordo com o entendimento firmado no REsp 1.061.530/RS (Tema 27/STJ), os juros remuneratórios só podem ser revistos em situações excepcionais, quando demonstrada abusividade capaz de colocar o consumidor em desvantagem exagerada.")

## Aplicação prática
- Ônus do consumidor: PROVA DA ABUSIVIDADE (comparação com média de mercado/BACEN; não basta mera superação da média — "A mera superação da taxa de juros contrat[ada]" isolada não gera revisão, no sentido dos acórdãos destacados pelo TJDFT).
- Jurisprudência posterior do STJ (2ª Seção) passa a admitir revisão quando os juros superam substancialmente a média de mercado com demais elementos de abusividade — a subsunção concreta exige prova pericial/quadro comparativo.

## Rastreabilidade
- Fonte oficial: ${TJDFT}
- URL: ${URL_T27}`,
    metadados: { tema_repetitivo: '27', tribunal: 'STJ', leading_case: 'REsp 1.061.530/RS', tese_literal: true, atualizacao_fonte: '2026-05-18' },
    tags: ['bancario/juros-remuneratorios', 'bancario/revisional', 'stj-tema-repetitivo'],
    fonte: TJDFT,
    urlFonte: URL_T27,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'tese-revisao-juros-remuneratorios-bancario', tipo: 'FUNDAMENTA_TESE', descricao: 'Tese estruturada a partir do Tema 27.' },
      { destinoSlug: 'cdc-art-51-clausulas-abusivas-nulidade', tipo: 'APLICA_ARTIGO', descricao: 'Desvantagem exagerada do art. 51 § 1º CDC.' },
    ],
  },
  {
    slug: 'tema-29-stj-revisao-nao-afasta-mora',
    titulo: 'Tema Repetitivo 29/STJ — A simples propositura da ação de revisão de contrato não inibe a caracterização da mora do autor',
    tipoDocumento: 'JURISPRUDENCIA',
    area: 'bancario',
    subarea: 'contratos-bancarios',
    assunto: 'Incidente de resolução de demandas repetitivas — mora e ação revisional',
    prioridade: 'P1',
    conteudo: `## Tema 29/STJ — revisão não afasta mora
**Tese (texto literal, TJDFT — Precedentes Qualificados — consulta ${D}):**

> "A simples propositura da ação de revisão de contrato não inibe a caracterização da mora do autor."

- Codificação anterior: Súmula 380/STJ (doc vinculado), com o mesmo teor literal.

## Aplicação prática (inclui citação oficial do TJDFT)
Acórdão do TJDFT (oficial): "O ajuizamento de ação revisional não afasta a mora nem suspende a ação de busca e apreensão, conforme o Tema 29/STJ e a Súmula 380/STJ." — Acórdão 2081460, 0746479-67.2025.8.07.0000, Rel. CARLOS PIRES SOARES NETO, 1ª Turma Cível, julgado em 21/01/2026.

- Estratégia: negociar/purgar mora em paralelo; antecipar defesa contra busca e apreensão; informar o cliente do risco de excussão da garantia durante a revisão.`,
    metadados: { tema_repetitivo: '29', tribunal: 'STJ', tese_literal: true, sumula_correlata: '380' },
    tags: ['bancario/revisional', 'bancario/mora', 'stj-tema-repetitivo'],
    fonte: TJDFT,
    urlFonte: URL_T29,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'sumula-380-stj-propositura-revisao-mora', tipo: 'CODIFICADO_EM', descricao: 'Mesma tese na Súmula 380.' },
      { destinoSlug: 'peca-defesa-busca-apreensao-modelo', tipo: 'ORIENTA_PECA', descricao: 'Risco de busca e apreensão durante revisão.' },
    ],
  },
  {
    slug: 'tema-620-stj-tarifa-cadastro-sumula-566',
    titulo: 'Tema Repetitivo 620/STJ + Súmula 566/STJ — Tarifa de cadastro: válida se tipificada em ato normativo padronizador e cobrada só no início do relacionamento',
    tipoDocumento: 'JURISPRUDENCIA',
    area: 'bancario',
    subarea: 'contratos-bancarios',
    assunto: 'Incidente de resolução de demandas repetitivas — tarifas bancárias',
    prioridade: 'P1',
    conteudo: `## Tema 620/STJ — tarifa de cadastro
**Tese (texto literal, TJDFT — Precedentes Qualificados — consulta ${D}):**

> "Permanece válida a tarifa de cadastro expressamente tipificada em ato normativo padronizador da autoridade monetária, a qual somente pode ser cobrada do início do relacionamento entre o consumidor e a instituição financeira."

## Súmula 566/STJ (texto citado LITERALMENTE em acórdão oficial do TJDFT na mesma página)
> "Nos contratos bancários posteriores ao início da vigência da Resolução-CMN n. 3.518/2007, em 30/4/2008, pode ser cobrada a tarifa de cadastro no início do relacionamento entre o consumidor e a instituição financeira."

## Aplicação prática
- Tarifa de cadastro cobrada em CONTRATO JÁ EXISTENTE (renovação/adesão posterior) ou mais de uma vez → repetição do indébito (art. 42 § único CDC).
- Tarifa não tipificada em resolução CMN → ilegal.
- NOTA ANTI-INVENÇÃO: o registro anterior do EJC sobre "Tema 566" foi em outra matéria e permanece sem confirmação — este doc trata de TEMA 620 e SÚMULA 566 (números e textos confirmados na página oficial do TJDFT).`,
    metadados: { tema_repetitivo: '620', sumula_correlata: '566', tribunal: 'STJ', tese_literal: true, resolucao_cmn: '3.518/2007' },
    tags: ['bancario/tarifas', 'bancario/revisional', 'stj-tema-repetitivo'],
    fonte: TJDFT,
    urlFonte: URL_T620,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'cdc-arts-42-42-a-cobranca-debitos-indebito-dobro', tipo: 'APLICA_ARTIGO', descricao: 'Cobrança irregular → indébito em dobro.' },
    ],
  },
  {
    slug: 'tema-1061-stj-onus-autenticidade-assinatura',
    titulo: 'Tema Repetitivo 1061/STJ — Impugnada a assinatura do contrato bancário, o ônus de provar a autenticidade é da instituição financeira',
    tipoDocumento: 'JURISPRUDENCIA',
    area: 'bancario',
    subarea: 'contratos-bancarios',
    assunto: 'Incidente de resolução de demandas repetitivas — ônus da prova',
    prioridade: 'P1',
    conteudo: `## Tema 1061/STJ — autenticidade da assinatura
**Tese (texto literal, TJDFT — Precedentes Qualificados — consulta ${D}):**

> "Na hipótese em que o consumidor/autor impugnar a autenticidade da assinatura constante em contrato bancário juntado ao processo pela instituição financeira, caberá a esta o ônus de provar a autenticidade (CPC, arts. 6º, 369 e 429, II)."

- TJDFT aplica também à assinatura ELETRÔNICA: "cabe à instituição financeira o ônus de comprovar a autenticidade da assinatura eletrônica em contrato bancário quando esta é impugnada pelo consumidor" (Acórdão 2028259, 0751904-43.2023.8.07.0001, Rel. FERNANDO TAVERNARD, 2ª Turma Cível, julgado 30/07/2025, DJe 14/08/2025).

## Aplicação prática
- Na defesa, IMPUGNAR ESPECIFICAMENTE a autenticidade (e não só a validade) → transfere ao banco o custo/perícia grafotécnica.
- Sem impugnação específica → presunção de veracidade do documento.`,
    metadados: { tema_repetitivo: '1061', tribunal: 'STJ', tese_literal: true, base_cpc: 'arts. 6º, 369 e 429, II' },
    tags: ['bancario/revisional', 'processual-civil/onus-prova', 'stj-tema-repetitivo'],
    fonte: TJDFT,
    urlFonte: URL_T1061,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'checklist-revisao-contrato-bancario', tipo: 'ORIENTA_CHECKLIST', descricao: 'Item de impugnação específica da assinatura.' },
    ],
  },
  {
    slug: 'prazo-prescricao-revisional-bancaria-10-anos',
    titulo: 'Prazo prescricional da ação revisional de contrato bancário — prescrição decenal (art. 205 CC) com termo inicial na assinatura do contrato',
    tipoDocumento: 'PRAZO',
    area: 'bancario',
    subarea: 'contratos-bancarios',
    assunto: 'Prescrição da pretensão revisional',
    prioridade: 'P1',
    conteudo: `## Prazo: prescrição da pretensão revisional bancária
- **Prazo:** 10 (dez) anos.
- **Fundamento legal:** art. 205 do Código Civil (prescrição geral — LC 118/2005).
- **Termo inicial:** data da assinatura do contrato (jurisprudência consolidada dos tribunais, alinhada ao STJ).

## Situação (consulta ${D})
- Direção confirmada em fontes oficiais de tribunais (TJDFT/TJPR) e em trecho da Revista Eletrônica do STJ: "A jurisprudência desta Corte é firme em determinar que o termo inicial do prazo prescricional decenal nas ações de revisão de contrato bancário..." (STJ, REJ — trecho confirmado via indexação pública do endereço oficial).
- NOTA HONESTA: a página integral da REJ/STJ e o inteiro teor do precedente específico no scon.stj.jus.br estavam bloqueados por verificação anti-bot na consulta → registro com confiabilidade B. NÃO foi atribuído número de REsp/tema porque não confirmado — pendente confirmação humana para citação formal.

## Atenção
- Declarada abusividade e revisão, o efeito retroage às parcelas não prescritas (alegar e provar impugnação parcelar).
- Contratos de consumo: discute-se art. 27 CDC (5 anos p/fato do serviço) para pedidos indenizatórios — NÃO para pretensão revisional; registrar a distinção da causa de pedir.`,
    metadados: { prazo: '10 anos', termo_inicial: 'assinatura do contrato', fundamento: 'CC art. 205', confiabilidade_nota: 'B — precedente específico pendente de confirmação integral' },
    tags: ['bancario/revisional', 'processual-civil/prescricao'],
    fonte: 'TJDFT/TJPR (acórdãos oficiais) + STJ REJ (trecho indexado)',
    urlFonte: 'https://www.stj.jus.br/websecstj/cgi/revista/REJ.cgi/ITA?seq=2173808&tipo=0&nreg=202102385580&SeqCgrmaSessao=&CodOrgaoJgdr=&dt=20220519&formato=HTML',
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
  },
  {
    slug: 'tese-revisao-juros-remuneratorios-bancario',
    titulo: 'TESE — Revisão de juros remuneratórios em contrato bancário: requisitos, prova e probabilidade (à luz do Tema 27/STJ)',
    tipoDocumento: 'TESE',
    area: 'bancario',
    subarea: 'contratos-bancarios',
    assunto: 'Tese de revisão de juros remuneratórios',
    prioridade: 'P1',
    conteudo: `## Tese estruturada — revisão de juros remuneratórios
**Enunciado:** a relação de consumo bancária permite a revisão excepcional dos juros remuneratórios quando cabalmente demonstrada abusividade capaz de colocar o consumidor em desvantagem exagerada (art. 51, § 1º, CDC), conforme Tema 27/STJ (REsp 1.061.530/RS).

### Requisitos
1. Relação de consumo caracterizada (Súmula 297/STJ aplica o CDC).
2. Alegação expressa da abusividade (Súmula 381/STJ — vedado conhecimento de ofício).
3. Prova robusta: comparação com a média de mercado (BACEN) no período, elementos de desvantagem exagerada, eventual perícia contábil.
4. Descarte de mera taxa levemente acima da média (jurisprudência: "mera superação" não basta).

### Fundamentos
- CDC arts. 4º III, 6º III, 51 § 1º II-III; Tema 27/STJ; Súmulas 297 e 381/STJ.

### Probabilidade qualitativa
- MÉDIA-BAIXA sem prova técnica; MÉDIA-ALTA quando os juros superam substancialmente a média com elementos adicionais (publicidade enganosa, troca por elevação, encadeamento).

### Riscos e contrademandas
- Prescrição decenal (doc de prazo vinculado) limita as parcelas; banco defende livre fixação (Súmula 381 como escudo); julgador pode rever só parcialmente.

### Aplicação
- Revisional com pedido de repetição do excesso (art. 42 § único CDC) + exibição de contratos e demonstrativos (CPC art. 396 e ss.),
- Vinculados: fluxo da revisional, peça-modelo, checklist de revisão.`,
    metadados: { probabilidade: 'media-baixa a media-alta conforme prova', risco: 'alegação preclusiva; prescrição decenal', tema_repetitivo: '27' },
    tags: ['bancario/revisional', 'bancario/juros-remuneratorios'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    dadosFicticios: false,
    relacionamentos: [
      { destinoSlug: 'tema-27-stj-revisao-juros-remuneratorios', tipo: 'DERIVA_DE', descricao: 'Estrutura da tese a partir do tema repetitivo.' },
      { destinoSlug: 'peca-revisional-contrato-bancario-modelo', tipo: 'ORIENTA_PECA', descricao: 'Peça-modelo aplicável.' },
      { destinoSlug: 'prazo-prescricao-revisional-bancaria-10-anos', tipo: 'LIMITADA_POR', descricao: 'Prescrição decenal das parcelas.' },
    ],
  },
  {
    slug: 'tese-repeticao-indebito-dobro-bancario',
    titulo: 'TESE — Repetição do indébito em dobro por cobrança indevida bancária (CDC art. 42, parágrafo único): requisitos e exceção do engano justificável',
    tipoDocumento: 'TESE',
    area: 'bancario',
    subarea: 'contratos-bancarios',
    assunto: 'Tese de repetição do indébito em dobro',
    prioridade: 'P1',
    conteudo: `## Tese estruturada — indébito em dobro
**Enunciado:** o consumidor cobrado em quantia indevida tem direito à repetição do indébito, por valor IGUAL AO DOBRO do que pagou em excesso, acrescido de correção monetária e juros legais, salvo hipótese de engano justificável (CDC art. 42, parágrafo único — texto literal registrado neste EJC).

### Requisitos
1. Pagamento (ou retenção indevida) de quantia em excesso — capitalização sem pactuação expressa, tarifa irregular (fora do rol CMN ou pós-relacionamento), multa > 2%, encargos não informados (art. 52).
2. Demonstração objetiva do excesso (demonstrativos, extratos, planilha de recalculo).
3. Ausência de engano JUSTIFICÁVEL do credor (ônus do banco).

### Fundamentos
- CDC arts. 42 § único e 39 V (exigir quantia indevida = prática abusiva); Súmula 297/STJ.

### Probabilidade qualitativa
- ALTA quando o excesso é documentável e o banco não justifica o engano.

### Riscos
- Discussão sobre dobro: jurisprudência tolera aplicação direta do § único; teses de subsidiariedade/sinalização (STJ) exigem caso concreto — não registrar regra genérica aqui.
- Impugnação do cálculo → perícia contábil (aumentar prazo/custo).

### Aplicação
- Pedido cumulado à revisão; liquidação por recalculo planilhado.`,
    metadados: { probabilidade: 'alta com prova documental', risco: 'engano justificável; perícia' },
    tags: ['bancario/indebito', 'consumidor/cobranca'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    dadosFicticios: false,
    relacionamentos: [
      { destinoSlug: 'cdc-arts-42-42-a-cobranca-debitos-indebito-dobro', tipo: 'DERIVA_DE', descricao: 'Base legal literal do art. 42 § único.' },
      { destinoSlug: 'sumula-539-stj-capitalizacao-expressamente-pactuada', tipo: 'APLICA_COM', descricao: 'Excesso por capitalização não pactuada.' },
    ],
  },
  {
    slug: 'peca-revisional-contrato-bancario-modelo',
    titulo: 'PEÇA-MODELO — Petição inicial de ação revisional de contrato bancário (com cumulação de repetição do indébito) — campos variáveis',
    tipoDocumento: 'PECA',
    area: 'bancario',
    subarea: 'contratos-bancarios',
    assunto: 'Modelo de petição inicial revisional',
    prioridade: 'P1',
    conteudo: `# MODELO — AÇÃO REVISIONAL DE CONTRATO BANCÁRIO C/C REPETIÇÃO DO INDÉBITO
**ADVERTÊNCIA EJC:** modelo estrutural com VARIÁVEIS. NÃO inserir fatos, valores ou precedentes que não constem do processo concreto. Preencher cada {{VARIÁVEL}} com dados reais do cliente e conferir CHECK 1-10 antes do protocolo.

## Endereçamento
EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA {{VARA}} CÍVEL DA COMARCA DE {{COMARCA}} — {{UF}}

## Qualificação
**{{CLIENTE}}**, {{NACIONALIDADE}}, {{ESTADO_CIVIL}}, {{PROFISSAO}}, CPF {{CPF}}, residente em {{ENDERECO}}, por seu advogado (procuração anexa — doc. {{DOC_PROCURACAO}}), vem propor **AÇÃO REVISIONAL DE CONTRATO BANCÁRIO C/C REPETIÇÃO DO INDÉBITO** em face de **{{BANCO}}** (CNPJ {{CNPJ_BANCO}}), pelos fatos e fundamentos a seguir.

## I — DOS FATOS
{{FATOS}} — descrição objetiva: origem do contrato {{TIPO_CONTRATO}} nº {{NUMERO_CONTRATO}}, data {{DATA_CONTRATO}}, valor {{VALOR_CONTRATO}}, parcelas {{PARCELAS}}, garantia {{GARANTIA}}.

## II — DO DIREITO
1. Relação de consumo e aplicabilidade do CDC (art. 3º; Súmula 297/STJ).
2. **Alegação EXPRESSA de abusividade** (Súmula 381/STJ — necessidade de provocação):
   - {{CLÁUSULA_1}} — desvantagem exagerada (CDC art. 51 IV e § 1º): {{FUNDAMENTO_ESPECIFICO_1}};
   - capitalização de juros sem pactuação expressa (Súmula 539/STJ — requisitos não atendidos): {{EVIDENCIA}};
   - tarifas fora da tipificação CMN ou cobradas fora do início do relacionamento (Tema 620/STJ; Súmula 566/STJ): {{TARIFAS}};
   - multa de mora acima de 2% (CDC art. 52 § 1º): {{PERCENTUAL}}.
3. Revisão de juros remuneratórios: abusividade cabalmente demonstrada pela média BACEN {{PERIODO}} (Tema 27/STJ — documentação e planilha anexas docs. {{DOCS_PROVA}}).
4. Repetição do indébito em dobro (CDC art. 42 § único): excesso pago de {{VALOR_EXCESSO}}, sem engano justificável.
5. Impugnação ESPECÍFICA da autenticidade da assinatura (Tema 1061/STJ — ônus do banco), se aplicável: {{IMPUGNACAO_ASSINATURA}}.

## III — DA TUTELA PROVISÓRIA DE URGÊNCIA (se cabível)
{{PEDIDO_TUTELA}} — requisitos do CPC art. 300: probabilidade do direito + perigo de dano {{PERIGO}}.

## IV — DOS PEDIDOS
a) a **revisão** das cláusulas {{CLÁUSULAS}}, recalculando-se as prestações com exclusão de {{EXCLUSOES}};
b) a **repetição em dobro** do indébito de {{VALOR_EXCESSO}} (CDC art. 42 § único) com correção e juros;
c) a **exibição** do contrato, demonstrativos de evolução do débito e planilha de tarifas (CDC art. 6º III; CPC art. 396 e ss.);
d) {{PEDIDOS}}. Dá-se à causa o valor de {{VALOR_CAUSA}}.

## V — Requerimentos finais
Citação (CPC art. 250), gratuidade {{GRATUIDADE}}, prioridade {{PRIORIDADE}}, provas (CPC art. 371 e ss.), audiência de conciliação (CPC art. 319 VII).

**Termos em que pede deferimento.**
{{CIDADE}}, {{DATA}}.
{{ADVOGADO}} — OAB/{{UF}} {{OAB}}

## CHECKLIST DE REVISÃO ANTES DO PROTOCOLO (obrigatório)
- [ ] Cada cláusula impugnada ALEGADA EXPRESSAMENTE (Súmula 381/STJ)
- [ ] Impugnação específica da assinatura incluída (Tema 1061/STJ) quando pertinente
- [ ] Planilha de recalculo + média BACEN anexadas
- [ ] Valor da causa e competência conferidos (Lei 12.122/2009 para instituições financeiras — verificar vara especializada da comarca)
- [ ] Alertar cliente: revisão NÃO afasta mora (Súmula 380/STJ; Tema 29/STJ)`,
    metadados: { variaveis: ['CLIENTE','CPF','CNPJ_BANCO','FATOS','CLÁUSULA_1','VALOR_EXCESSO','DATA','ADVOGADO'], tipo: 'peticao inicial', area_processual: 'cível/bancário' },
    tags: ['bancario/revisional', 'peca-modelo'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'tese-revisao-juros-remuneratorios-bancario', tipo: 'IMPLEMENTA_TERESE', descricao: 'Peça materializa a tese estruturada.' },
      { destinoSlug: 'fluxo-acao-revisional-bancaria', tipo: 'ORIENTADO_POR', descricao: 'Fluxo processual da revisional.' },
    ],
  },
  {
    slug: 'checklist-revisao-contrato-bancario',
    titulo: 'CHECKLIST — Análise e revisão de contrato bancário (CCB e correlatos): itens obrigatórios de verificação',
    tipoDocumento: 'CHECKLIST',
    area: 'bancario',
    subarea: 'contratos-bancarios',
    assunto: 'Checklist de análise contratual bancária',
    prioridade: 'P1',
    conteudo: `# CHECKLIST — Revisão de contrato bancário
**Uso:** análise inicial do contrato (CCB, contrato de empréstimo, financiamento, cartão) antes de estruturar tese/peça.

## 1. Documentos e formalidades
- [ ] Contrato completo com TODOS os anexos e terms (falta de página → exibição);
- [ ] Assinatura/conferência: IMPUGNAR ESPECIFICAMENTE a autenticidade se suspeita (Tema 1061/STJ — ônus do banco);
- [ ] Garantia registrada? (avaliação de perícia/excesso — Lei 9.514 art. 30 § 4º não coberto aqui; conferir doc próprio)

## 2. Encargos financeiros
- [ ] Taxa de juros remuneratórios e comparativo BACEN (período do contrato) — Tema 27/STJ exige PROVA;
- [ ] CAPITALIZAÇÃO: periodicidade inferior à anual está EXPRESSAMENTE pactuada? (Súmula 539/STJ: exigência de pactuação expressa; contratos pré-31/3/2000: regime anterior);
- [ ] Multa de mora ≤ 2% (CDC art. 52 § 1º);
- [ ] Comissão de permanência: existe? Teto e exclusividade (Súmula 472/STJ);
- [ ] Seguros obrigatórios vinculados: custo e proporcionalidade.

## 3. Tarifas
- [ ] Tipificadas em resolução CMN vigente à época da cobrança;
- [ ] Tarifa de cadastro: cobrada SÓ no início do relacionamento (Tema 620/STJ; Súmula 566/STJ);
- [ ] Tarifas por serviço não prestado ou duplicadas.

## 4. Informação e transparência (CDC art. 52)
- [ ] CET, taxa efetiva anual, soma total a pagar INFORMADOS antes da contratação;
- [ ] Documentos de cobrança com identificação do fornecedor (art. 42-A).

## 5. Cláusulas abusivas típicas (CDC art. 51)
- [ ] Variação unilateral de preço (inc. X);
- [ ] Alteração unilateral de conteúdo/qualidade (inc. XIII);
- [ ] Custos de cobrança sem igual direito (inc. XII);
- [ ] Arbitragem compulsória (inc. VII);
- [ ] Prazos de carência pós-purgação (inc. XVIII — Lei 14.181/2021).

## 6. Aspectos processuais e prazos
- [ ] Prescrição decenal das parcelas (doc de prazo vinculado);
- [ ] Alegação EXPRESSA de cada abusividade (Súmula 381/STJ);
- [ ] Mora: ajuizamento NÃO afasta mora — risco de busca e apreensão/execução (Súmula 380/STJ; Tema 29/STJ);
- [ ] Situação de registro no SCR/Serasa (art. 43 CDC — 5 anos).`,
    metadados: { itens: 22, uso: 'triagem e estruturação de revisional bancária' },
    tags: ['bancario/contratos-bancarios', 'checklist'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'regras-contratuais-clausulas-abusivas-ccb', tipo: 'COMPLEMENTA', descricao: 'Regras automatizadas de detecção.' },
      { destinoSlug: 'tema-1061-stj-onus-autenticidade-assinatura', tipo: 'APLICA_TERESE', descricao: 'Impugnação da assinatura.' },
    ],
  },
  {
    slug: 'fluxo-acao-revisional-bancaria',
    titulo: 'FLUXO — Trâmite da ação revisional bancária (com defesa contra contramotion do banco)',
    tipoDocumento: 'FLUXO',
    area: 'bancario',
    subarea: 'contratos-bancarios',
    assunto: 'Fluxo processual da revisional',
    prioridade: 'P1',
    conteudo: `# FLUXO — Ação revisional bancária
Formato: evento → prazo → providência → responsável → documento necessário → risco → próxima etapa

1. **Contratação de honorários e triagem** → — → checklist completo + planilha de recalculo → advogado → contrato, boletos, extratos, comprovantes → risco: tese sem prova → próxima: notificação extrajudicial do banco (opcional) {{DECISAO_CLIENTE}}.
2. **Protocolo da inicial** → — → distribuição (vara bancária, Lei 12.122/2009 conforme comarca) → advogado → peça + procuração + docs → risco: emenda (CPC 321) → próxima: citação.
3. **Citação/defesa do banco** → contestação em 15 dias úteis (CPC art. 335) → banco contesta + normalmente RECONVÉM cobrando o saldo → advogado monitorar → risco: reconvenção → próxima: impugnação.
4. **Réplica e impugnação à contestação/reconvenção** → 15 dias úteis → reforço da alegação expressa (Súmula 381/STJ) e do recalculo → advogado → manifestação + planilha → risco: preclusão → próxima: saneamento.
5. **Saneamento e provas** → prazo do juiz → perícia contábil (comum em revisional) → qüestionário do perito → partes → quesitos + assistente técnico → risco: desfavorável sem quesitos bons → próxima: laudo.
6. **Laudo pericial e manifestações** → 15 dias úteis p/ manifestações → impugnar/aprimorar cálculos → advogado → manifestações → risco: resultado → próxima: sentença.
7. **Sentença** → — → análise integral (mérito + reconvenção) → advogado → relatório técnico ao cliente → risco: mora subsiste (Súmula 380/STJ) → próxima: apelação em 15 dias (doc de prazo vinculado — LOTE-007).
8. **Recursos** → apelação 15 dias → tribunal → risco: reforma parcial → próxima: acordo/execução.
9. **PARALELO — excussão de garantia pelo banco** → se busca e apreensão (fiduciária) → defesa própria (docs vinculados) → risco: leilão do bem → próxima: coordenar estratégias.

**Regra de inteligência embutida:** enquanto pende revisional, MONITORAR parcelas e depósito do que se reconhece devido (função de diminuir mora) — decisão estratégica do cliente.`,
    metadados: { etapa_inicial: 'triagem', etapa_final: 'recursos/execução', interacao: 'Súmula 380/STJ' },
    tags: ['bancario/revisional', 'fluxo-processual'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'peca-revisional-contrato-bancario-modelo', tipo: 'USA_PECA', descricao: 'Peça-modelo do primeiro passo.' },
      { destinoSlug: 'regra-se-busca-apreensao-fiduciaria', tipo: 'INTERAGE_COM', descricao: 'Fluxo paralelo de excussão.' },
      { destinoSlug: 'prazo-apelacao-cpc-15-dias-uteis', tipo: 'REFERENCIA_PRAZO', descricao: 'Etapa recursal.' },
    ],
  },
  {
    slug: 'tabela-documentos-revisional-bancaria',
    titulo: 'TABELA — Documentos necessários para ação revisional de contrato bancário',
    tipoDocumento: 'TABELA_DOCUMENTOS',
    area: 'bancario',
    subarea: 'contratos-bancarios',
    assunto: 'Documentos para revisional bancária',
    prioridade: 'P1',
    conteudo: `# Documentos necessários — Ação revisional bancária

| # | Documento | Quem fornece | Para que serve | Prioridade |
|---|-----------|--------------|----------------|-----------|
| 1 | Contrato bancário completo + anexos | cliente/banco | base da impugnação | essencial |
| 2 | Boletos/comprovantes de pagamento | cliente | mora, valores pagos, indébito | essencial |
| 3 | Extratos da conta vinculada | cliente/banco | fluxo de cobrança | essencial |
| 4 | Demonstrativo de evolução do débito | banco | recalculo (exibir em juízo se negado) | essencial |
| 5 | Procuração + documentos pessoais | cliente | representação | essencial |
| 6 | Média de juros BACEN do período | advogado (série pública) | prova da abusividade (Tema 27/STJ) | essencial |
| 7 | Planilha de recalculo técnico | advogado/perito | quantificar excesso | essencial |
| 8 | Comprovante de residência | cliente | citação/custas | importante |
| 9 | Publicidade do produto (folder/propaganda) | cliente | informação enganosa (CDC 6º III/30) | relevante |
| 10 | Registro da garantia (CCB/fiduciária) | cliente | conexão com execução da garantia | se houver |

**Nota EJC:** documentos 4 e 6 podem requerer exibição/tutela de produção antecipada; sem eles, a prova da abusividade (Tema 27) fica fragilizada.`,
    metadados: { total_itens: 10 },
    tags: ['bancario/revisional', 'documentos'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'peca-revisional-contrato-bancario-modelo', tipo: 'SUPORTA_PECA', descricao: 'Documentos da inicial.' },
    ],
  },
  {
    slug: 'triagem-contrato-bancario-script',
    titulo: 'TRIAGEM — Script de entrevista inicial para casos de contrato bancário',
    tipoDocumento: 'TRIAGEM',
    area: 'bancario',
    subarea: 'contratos-bancarios',
    assunto: 'Roteiro de triagem bancária',
    prioridade: 'P1',
    conteudo: `# TRIAGEM — Contratos bancários (script)
Objetivo: classificar o caso (revisão / indébito / fraude / execução da garantia / cobrança abusiva) e medir viabilidade.

## Bloco A — Identificação
1. Nome completo, CPF, endereço, profissão? {{DADOS}}
2. O(a) cliente é pessoa natural consumidora ou empresária? {{PERFIL}} (pessoa jurídica pode ser consumidora — art. 2º CDC — mas limitação de indenização do art. 51 I pode caber)

## Bloco B — Contrato
3. Que produto? (CCB / empréstimo pessoal / financiamento imobiliário/veicular / cartão / consignado) {{PRODUTO}}
4. Data e valor do contrato? parcelas pagas/restantes? {{DATAS_VALORES}}
5. Tem o contrato COMPLETO (com anexos)? {{DOCS}}
6. A assinatura é dele(a) (física/eletrônica)? Tem dúvida sobre a autenticidade? {{ASSINATURA}} → se dúvida: Tema 1061/STJ.

## Bloco C — Encargos e tarifas
7. Qual a taxa contratada e o CET informado antes da assinatura? {{TAXAS}}
8. Sabe se há capitalização mensal? Está escrita expressamente no contrato? {{CAPITALIZACAO}} → Súmula 539/STJ.
9. Tarifas: quais e quantas vezes cobradas? (cadastro só no início? Tema 620/STJ) {{TARIFAS}}
10. Multa de mora cobrada: quanto? (>2%? CDC art. 52 § 1º) {{MULTA}}

## Bloco D — Situação atual
11. Está inadimplente? Desde quando? Houve negativação? {{MORA}}
12. Existe ação do banco (cobrança/busca e apreensão)? {{ACAO_BANCO}} → alerta Súmula 380/STJ.
13. Recebeu golpe/fraude (clonagem, PIX falso, transferência não reconhecida)? {{FRAUDE}} → Súmula 479/STJ.
14. Já tentou acordo/recalculo com o banco? Há protocolos? {{NEGOCIACAO}}

## Bloco E — Viabilidade
15. Contrato assinado há menos de 10 anos? (prescrição decenal) {{PRESCRICAO}}
16. O(a) cliente aceita risco de manter parcelas em discussão? {{RISCO_CLIENTE}}
17. Valor do excesso estimado compensa o litígio? {{VALOR_ESTIMADO}}

**Classificação automática (regras EJC):**
- fraude + banco negou → responsabilidade objetiva (Súmula 479/STJ).
- capitalização sem pactuação expressa + pós-31/3/2000 → nulidade da capitalização (Súmula 539/STJ) + indébito em dobro.
- tarifa de cadastro repetida → repetição (Tema 620/STJ).
- taxas muito acima da média BACEN + prova → revisão (Tema 27/STJ) com probabilidade média-alta.
- mora + revisão em curso → alerta obrigatório de excussão (Súmula 380/STJ; Tema 29/STJ).`,
    metadados: { perguntas: 17, saida: 'classificação do caso' },
    tags: ['bancario/contratos-bancarios', 'triagem'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'checklist-revisao-contrato-bancario', tipo: 'SEGUE_PARA', descricao: 'Aprofundamento técnico pós-triagem.' },
    ],
  },
  {
    slug: 'argumentacao-revisional-bancaria-bilateral',
    titulo: 'ARGUMENTAÇÃO — Revisional bancária sob os dois lados: consumidor x instituição financeira',
    tipoDocumento: 'ARGUMENTACAO',
    area: 'bancario',
    subarea: 'contratos-bancarios',
    assunto: 'Argumentos e contra-argumentos da revisional',
    prioridade: 'P1',
    conteudo: `# ARGUMENTAÇÃO BILATERAL — Revisional bancária
**LADO A — Consumidor (autor)**
1. CDC aplicável ao banco (Súmula 297/STJ) → controle de cláusulas (art. 51).
2. Capitalização sem pactuação EXPRESSA → nula (Súmula 539/STJ) → recalculo + dobro (art. 42 § único).
3. Juros acima da média com abusividade comprovada → revisão (Tema 27/STJ).
4. Tarifa de cadastro repetida/tardía → repetição (Tema 620/STJ; Súmula 566/STJ).
5. Impugnação da assinatura → ônus do banco (Tema 1061/STJ).
6. Informação insuficiente (art. 52) → falha de informação → revisão/indébito.

**LADO B — Banco (réu)**
1. Súmula 381/STJ: abusividade não conhecida de ofício → carga de alegação/prova é do autor.
2. Tema 27/STJ: revisão excepcional — mera superação da média não basta; livre concorrência/fixação de política de crédito.
3. Súmula 539/STJ: capitalização PACTUADA é válida (contratos pós-31/3/2000).
4. Tema 620/STJ + Súmula 566/STJ: tarifa de cadastro no início é válida se tipificada.
5. Tema 29/STJ + Súmula 380/STJ: revisão não afasta mora → cobrança/execução da garantia prossegue.
6. Prescrição decenal das parcelas mais antigas.
7. Engano justificável (CDC art. 42 § único) afasta o dobro.

**Síntese estratégica EJC**
- O desfecho depende de PROVA (planilha + BACEN + contrato integral) e da antiguidade das parcelas (prescrição).
- Equilíbrio: gerenciamento da mora é o maior risco prático do autor; o maior risco do banco é o conjunto de súmulas objetivas (539 exigência de pactuação; 479 fraudes; 42 § único dobro).`,
    metadados: { lados: 2, argumentos_consumidor: 6, argumentos_banco: 7 },
    tags: ['bancario/revisional', 'argumentacao'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'tese-revisao-juros-remuneratorios-bancario', tipo: 'DESENVOLVE', descricao: 'Lado A estruturado.' },
      { destinoSlug: 'peca-revisional-contrato-bancario-modelo', tipo: 'ALIMENTA_PECA', descricao: 'Fundamentos para a inicial.' },
    ],
  },
  {
    slug: 'doutrina-institutos-bancarios-conceitos',
    titulo: 'DOUTRINA/CONCEITOS — Juros remuneratórios e moratórios, capitalização (anatocismo), comissão de permanência, tarifas e CET',
    tipoDocumento: 'DOUTRINA',
    area: 'bancario',
    subarea: 'contratos-bancarios',
    assunto: 'Conceitos técnicos dos contratos bancários',
    prioridade: 'P1',
    conteudo: `# Conceitos técnicos — contratos bancários (elaboração própria EJC, sintética e neutra)

## 1. Juros remuneratórios
Remuneração do capital emprestado (preço do dinheiro). Diferem dos moratórios (pena civil pela mora — CC art. 404). Controle: excepcional, com prova de abusividade (Tema 27/STJ).

## 2. Capitalização de juros (anatocismo)
Incorporação dos juros vencidos ao capital para incidir nova cobrança. Regra geral: só anual em periodicidade inferior (CC art. 591 § único; Decreto 22.626/1933 art. 4º); EXCEÇÃO no SFN a partir de 31/3/2000 com pactuação EXPRESSA (Súmula 539/STJ). "Pactuação expressa" ≠ mera menção a taxa anual equivalente.

## 3. Comissão de permanência
Encargo da fase de inadimplemento historicamente criado para cobrir custo de manutenção do crédito vencido. Regra atual (Súmula 472/STJ): teto = soma dos encargos contratuais; EXCLUI juros remuneratórios, moratórios e multa no período. Texto antigo (Súmula 30/STJ): inacumulável com correção monetária.

## 4. Tarifas bancárias
Remuneração de serviços efetivamente contratados. Requisitos: tipificação em resolução CMN, serviço efetivamente prestado, transparência. Tarifa de cadastro: só no início do relacionamento (Tema 620/STJ; Súmula 566/STJ).

## 5. CET — Custo Efetivo Total
Síntese de todos os encargos e tarifas do crédito (percentual anual). Dever de informação prévia (CDC arts. 6º III e 52) — ausência/vício → falha de informação.

## 6. Indébito em dobro
Consequência objetiva da cobrança em excesso paga (CDC art. 42 § único), salvo engano justificável. Não confundir com dano moral por inscrição indevida (matéria própria).

## 7. Fortuito interno (Súmula 479/STJ)
Fraudes/delitos de terceiro no âmbito das operações bancárias NÃO exoneram o banco: risco inerente à atividade (responsabilidade objetiva, CDC art. 14).`,
    metadados: { conceitos: 7, natureza: 'elaboração própria sintética' },
    tags: ['bancario/conceitos', 'doutrina'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'sumula-539-stj-capitalizacao-expressamente-pactuada', tipo: 'EXPLICA', descricao: 'Conceito de capitalização.' },
      { destinoSlug: 'sumula-472-stj-comissao-permanencia-exclusao', tipo: 'EXPLICA', descricao: 'Conceito de comissão de permanência.' },
    ],
  },
  {
    slug: 'regra-se-capitalizacao-pactuacao-expressa',
    titulo: 'REGRA DE INTELIGÊNCIA — Capitalização de juros: validade condicionada à pactuação expressa (pós-31/3/2000)',
    tipoDocumento: 'REGRA_INTELIGENCIA',
    area: 'bancario',
    subarea: 'contratos-bancarios',
    assunto: 'Detecção de capitalização irregular',
    prioridade: 'P1',
    conteudo: `## SE-ENTÃO (interpretável pelo EJC)
**SE** contrato bancário celebrado A PARTIR de 31/3/2000
**E** periodicidade de capitalização INFERIOR à anual (mensal, diária, semestral)
**E NÃO** houver pactuação EXPRESSA no instrumento (menção direta à capitalização; mera indicação de taxa anual equivalente NÃO é pactuação expressa)
**ENTÃO**
- classificar capitalização como IRREGULAR;
- recalculo das parcelas desdobrando juros (juros simples);
- quantificar excesso pago → viabilizar repetição em dobro (CDC art. 42 § único);
- probabilidade qualitativa: ALTA (Súmula 539/STJ + Tema 24/STJ).

**SE** capitalização EXPRESSAMENTE pactuada E contrato pós-31/3/2000
**ENTÃO** capitalização VÁLIDA (Súmula 539/STJ) → descartar tese de nulidade; focar outras cláusulas.

**SE** contrato ANTERIOR a 31/3/2000
**ENTÃO** regime anterior: exigir análise específica (MP 1.963-17/2000 e jurisprudência do período) — NÃO aplicar automaticamente esta regra; marcar REVISAO_HUMANA.

**Fontes:** Súmula 539/STJ (texto literal neste EJC); Tema 24/STJ (REsp 1.061.530/RS); CC art. 591 § único (comparação).
**Consulta:** ${D}.`,
    metadados: { tipo: 'SE-ENTÃO', entrada: 'data do contrato + cláusula de capitalização', saida: 'irregular/válida + tese' },
    tags: ['bancario/capitalizacao', 'inteligencia-processual'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'sumula-539-stj-capitalizacao-expressamente-pactuada', tipo: 'DERIVA_DE', descricao: 'Fundamento da regra.' },
      { destinoSlug: 'tese-repeticao-indebito-dobro-bancario', tipo: 'DISPARA_TERESE', descricao: 'Consequência: indébito em dobro.' },
    ],
  },
  {
    slug: 'regra-se-fraude-bancaria-responsabilidade-objetiva',
    titulo: 'REGRA DE INTELIGÊNCIA — Fraude/golpe em operação bancária: responsabilidade objetiva da instituição (Súmula 479/STJ)',
    tipoDocumento: 'REGRA_INTELIGENCIA',
    area: 'bancario',
    subarea: 'contratos-bancarios',
    assunto: 'Detecção de caso de fortuito interno',
    prioridade: 'P1',
    conteudo: `## SE-ENTÃO (interpretável pelo EJC)
**SE** cliente relata fraude/delito de terceiro no âmbito bancário (clonagem de cartão, phishing, PIX não reconhecido, empréstimo não contratado, troca de cartão no saque etc.)
**E** a operação ocorreu por canal/circuito controlado ou influenciado pelo banco (app, caixa, cartão, telefone do banco, site do banco)
**ENTÃO**
- classificar como FORTUITO INTERNO;
- responsabilidade OBJETIVA do banco (Súmula 479/STJ + CDC art. 14);
- pedidos: restituição/compensação do valor + danos materiais comprovados (+ morais conforme caso);
- probabilidade qualitativa: ALTA com prova do vínculo da operação com o canal bancário.

**EXCEÇÕES (cautela)**
- SE a exclusiva culpa do cliente for DEMONSTRADA (ex.: entrega voluntária de senha após contato claramente externo ao banco) → análise caso a caso; jurisprudência divide — marcar REVISAO_HUMANA;
- SE houver demora atribuível só ao cliente na comunicação → reduzir danos posteriores à comunicação.

**Fontes:** Súmula 479/STJ (texto literal neste EJC). **Consulta:** ${D}.`,
    metadados: { tipo: 'SE-ENTÃO', entrada: 'relato de fraude + canal da operação', saida: 'fortuito interno + pedidos' },
    tags: ['bancario/fraude', 'inteligencia-processual'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'sumula-479-stj-fortuito-interno-fraudes', tipo: 'DERIVA_DE', descricao: 'Fundamento da regra.' },
    ],
  },
  {
    slug: 'regras-contratuais-clausulas-abusivas-ccb',
    titulo: 'REGRAS CONTRATUAIS — Detecção de cláusulas de risco em CCB/contratos bancários (CDC art. 51)',
    tipoDocumento: 'REGRAS_CONTRATUAIS',
    area: 'bancario',
    subarea: 'contratos-bancarios',
    assunto: 'Riscos de cláusulas em contratos bancários',
    prioridade: 'P1',
    conteudo: `# Regras de inteligência contratual — CCB bancário
Cada regra: gatilho (padrão de cláusula) → classificação → base legal → ação.

1. **GATILHO:** cláusula permite ao banco alterar taxa/encargo unilateralmente ("podendo o banco alterar...").
   → **RISCO ALTO** — nulidade (CDC art. 51 X e XIII). **AÇÃO:** impugnar expressamente + recalculo.

2. **GATILHO:** cobrança dos "custos de cobrança/procuradoria" sem igual direito do cliente.
   → **RISCO ALTO** — nulidade (art. 51 XII). **AÇÃO:** excluir do recalculo.

3. **GATILHO:** arbitragem compulsória imposta.
   → **RISCO ALTO** — nulidade do inciso VII (registrar: regra legal literal; situações de arbitragem pactuada exigem análise à luz da jurisprudência constitucional — REVISAO_HUMANA).

4. **GATILHO:** multa de mora > 2% da prestação.
   → **RISCO ALTO** — art. 52 § 1º. **AÇÃO:** reduzir a 2%.

5. **GATILHO:** capitalização mensal/diária SEM expressa pactuação.
   → **RISCO ALTO** — Súmula 539/STJ. **AÇÃO:** desdobramento + dobro.

6. **GATILHO:** carência/bloqueio de crédito após purgação da mora ou acordo.
   → **RISCO** — art. 51 XVIII (Lei 14.181/2021). **AÇÃO:** pedido de restabelecimento integral.

7. **GATILHO:** inversão do ônus da prova contratual ("incumbe ao cliente provar...").
   → **RISCO ALTO** — art. 51 VI. **AÇÃO:** nulidade; regras de ônus do CPC/CDC.

8. **GATILHO:** previsão de "taxa anual equivalente" como fundamento de capitalização.
   → **ARMADILHA** — não é pactuação expressa de capitalização (Súmula 539/STJ). **AÇÃO:** manter tese.

**Uso:** marcar cada cláusula localizada no contrato com o nº da regra e montar a lista de impugnações (Súmula 381/STJ exige alegação expressa).`,
    metadados: { regras: 8, objeto: 'CCB bancário' },
    tags: ['bancario/clausulas', 'inteligencia-contratual'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'cdc-art-51-clausulas-abusivas-nulidade', tipo: 'DERIVA_DE', descricao: 'Base legal do art. 51.' },
      { destinoSlug: 'checklist-revisao-contrato-bancario', tipo: 'AUTOMATIZA', descricao: 'Versão automatizada do checklist.' },
    ],
  },
  {
    slug: 'jurimetria-estrutura-revisionais-bancarias',
    titulo: 'JURIMETRIA — Estrutura de coleta para indicadores de ações revisionais bancárias (sem dados inventados)',
    tipoDocumento: 'JURIMETRIA',
    area: 'bancario',
    subarea: 'contratos-bancarios',
    assunto: 'Estrutura de indicadores de revisionais',
    prioridade: 'P2',
    conteudo: `# Jurimetria — estrutura de indicadores (revisionais bancárias)
**REGRA EJC:** esta ficha é um MODELO DE COLETA. Números só entram quando medidos de fonte real ( tribunais, relatórios CNJ, planilha própria do escritório). NUNCA preencher com estimativa apresentada como dado.

## Indicadores propostos
1. Taxa de procedência parcial/total de revisionais por vara/tribunal e período.
2. Percentual médio de redução obtida nos juros quando procedente.
3. Tempo médio de tramitação até sentença (por vara).
4. Frequência de perícia contábil e taxa de confirmação do recalculo do autor.
5. Taxa de reconvenção dos bancos e resultado das reconvenções.
6. Aderência: capitalização impugnada x reconhecida (Súmula 539/STJ).

## Campos de coleta por caso
{ vara, tribunal, protocolo_ano, tipo_produto, valor_contrato, data_contrato, teses_alegadas (539/27/620/1061/42§), resultado, reducao_%, duracao_dias, houve_pericia, houve_reconvencao }

## Fontes válidas
PJe/e-SAJ (acórdãos públicos), relatórios CNJ Justiça em Números, painel de processos do escritório.
**Status:** estrutura pronta; aguardando coleta real.`,
    metadados: { tipo: 'estrutura de coleta', dados_reais: false },
    tags: ['bancario/jurimetria', 'estrutura'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
  },
];
