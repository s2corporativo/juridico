// LOTE-023 — Tributário com foco MG (base federal verificável) — LC 87/1996 (Lei Kandir),
// LC 24/1975 (convênios/CONFAZ) e CTN arts. 113-131 (obrigação tributária, sujeição passiva,
// solidariedade, responsabilidade).
// Textos LITERAIS extraídos do Planalto em 2026-08-30:
//   LC 87: https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp87.htm
//   LC 24: https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp24.htm
//   CTN:   https://www.planalto.gov.br/ccivil_03/leis/l5172compilado.htm
//          (URL clássica .../decreto-lei/del5172.htm retornou 404 nesta consulta; o arquivo
//          compilado "l5172compilado.htm" no mesmo domínio planalto.gov.br foi capturado)
//
// ANTI-INVENÇÃO desta rodada (constatações da consulta):
// - PORTAIS MG BLOQUEADOS para captura (almg.gov.br, mg.gov.br, iof.mg.gov.br, sefaz.mg.gov.br,
//   tjmg.jus.br): NENHUM texto estadual (lei do ICMS/MG, IPVA MG, ITCD MG, taxas) é citado como
//   verbatim nesta rodada. Pontos dependentes de lei estadual recebem marcadores
//   [VERIFICAR LEI ESTADUAL MG] e o doc ponte-mg-legislacao-tributaria-estadual (REVISAO_HUMANA,
//   confiabilidade C) lista as URLs oficiais para verificação futura.
// - O texto compilado do Planalto registra redações em dois blocos (original + "(Redação dada
//   pela ...)"): cita-se a redação VIGENTE identificada pela nota de alteração, indicando a
//   alteração como consta. Tipografia/quebras de linha do portal foram unidas na transcrição,
//   sem alterar palavras (ex.: "subseqüentes", "interêsse", "têrmos" mantidos como constam).
// - LC 87 arts. 3º, 6º-7º e 19 NÃO capturados nesta consulta (necessários p.ex. para a base
//   normativa da responsabilidade por substituição) — mencionados apenas como pendência.
// - LC 214/2025 remete no texto da LC 24 ("(Vide Lei Complementar nº 214, de 2025)") — registrada
//   como consta, sem afirmar conteúdo (não capturada).
// - Jurimetria: SEM DADOS (o EJC não inventa percentuais).
import type { InputDocument } from '../../src/lib/ejc/types';

const D = '2026-08-30';
const PLANALTO = 'Presidência da República — Planalto';
const URL_LC87 = 'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp87.htm';
const URL_LC24 = 'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp24.htm';
const URL_CTN = 'https://www.planalto.gov.br/ccivil_03/leis/l5172compilado.htm';
const EJC = 'Elaboração EJC — conteúdo estrutural original';

const MG_NOTA = 'NADA estadual é citado como verbatim nesta rodada: portais MG (almg.gov.br, mg.gov.br, iof.mg.gov.br, sefaz.mg.gov.br, tjmg.jus.br) BLOQUEADOS para captura em 2026-08-30.';

function lei(
  slug: string, titulo: string, subarea: string | null, assunto: string, conteudo: string,
  norma: string, urlFonte: string, artigos: string[], extra?: Partial<InputDocument>,
): InputDocument {
  return {
    slug, titulo, tipoDocumento: 'LEGISLACAO', area: 'tributario', subarea,
    assunto, prioridade: 'P1', lote: 'LOTE-023',
    conteudo,
    metadados: { numero: norma, orgao: 'Congresso Nacional', artigos_principais: artigos, vigente: true, confirmacao_texto: 'Extração literal do texto oficial do Planalto em 2026-08-30.' },
    tags: [subarea ? `tributario/${subarea}` : 'tributario/geral', 'geral/prazos'],
    fonte: PLANALTO,
    urlFonte,
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
  // 1 — LC 87 art. 2º (incidência/fato gerador — piso federal)
  lei(
    'lc87-art2-competencia-icms',
    'LC 87/1996 art. 2º — Incidência do ICMS: operações de mercadorias, transporte interestadual/intermunicipal e comunicação (texto literal do Planalto; nota honesta: lei estadual MG não capturada)',
    'icms-mg',
    'Fato gerador e incidência do ICMS — piso federal',
    `## Ficha da Norma
- **Norma:** Lei Complementar nº 87, de 13.9.1996 (Lei Kandir) — lei de referência do ICMS (art. 155, § 2º, CF).
- **Nota tipográfica:** quebras de linha do portal unidas; o portal registra "Art. 2°" com símbolo de grau — transcrição mantém palavras e pontuação essenciais como constam.

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 2º O imposto incide sobre:
I - operações relativas à circulação de mercadorias, inclusive o fornecimento de alimentação e bebidas em bares, restaurantes e estabelecimentos similares;
II - prestações de serviços de transporte interestadual e intermunicipal, por qualquer via, de pessoas, bens, mercadorias ou valores;
III - prestações onerosas de serviços de comunicação, por qualquer meio, inclusive a geração, a emissão, a recepção, a transmissão, a retransmissão, a repetição e a ampliação de comunicação de qualquer natureza;
IV - fornecimento de mercadorias com prestação de serviços não compreendidos na competência tributária dos Municípios;
V - fornecimento de mercadorias com prestação de serviços sujeitos ao imposto sobre serviços, de competência dos Municípios, quando a lei complementar aplicável expressamente o sujeitar à incidência do imposto estadual.
§ 1º O imposto incide também:
I – sobre a entrada de mercadoria ou bem importados do exterior, por pessoa física ou jurídica, ainda que não seja contribuinte habitual do imposto, qualquer que seja a sua finalidade; (Redação dada pela Lcp 114, de 16.12.2002)
II - sobre o serviço prestado no exterior ou cuja prestação se tenha iniciado no exterior;
III - sobre a entrada, no território do Estado destinatário, de petróleo, inclusive lubrificantes e combustíveis líquidos e gasosos dele derivados, e de energia elétrica, quando não destinados à comercialização ou à industrialização, decorrentes de operações interestaduais, cabendo o imposto ao Estado onde estiver localizado o adquirente.
§ 2º A caracterização do fato gerador independe da natureza jurídica da operação que o constitua."

**Nota de alteração (como consta):** o texto oficial registra o inciso I do § 1º em dois blocos (redação original e redação dada pela Lcp 114, de 16.12.2002) — cita-se a vigente, acima.

## NOTA HONESTA (regra desta rodada)
O art. 2º é o PISO FEDERAL da incidência. A operacionalização (alíquotas, substituição legal do contribuinte, obrigações acessórias, prazos) depende da LEI ESTADUAL do ICMS — ${MG_NOTA} Ver doc ponte-mg-legislacao-tributaria-estadual (REVISAO_HUMANA) com as URLs oficiais de verificação futura.

## Leitura aplicada no EJC
- **Mercadorias (interna e interestadual):** inciso I — a operação INTERNA depende da lei estadual; o PISO comum é este texto.
- **Transporte interestadual/intermunicipal:** inciso II (por qualquer via, inclusive pessoas).
- **Comunicação:** inciso III (só prestações ONEROSAS).
- **Importação:** § 1º I (qualquer que seja a finalidade; não exige contribuinte habitual) e § 1º II (serviço iniciado no exterior).
- **Energia/petróleo para uso e consumo:** § 1º III — imposto ao Estado do ADQUIRENTE.
- **Independência da forma:** § 2º — a rotulagem da operação não elude o fato gerador.
- Momento do fato gerador → art. 12 (doc lc87-art8-11-12-base-calculo); base de cálculo → art. 13 (doc lc87-art13-substituicao-tributaria).`,
    'Lei Complementar 87/1996 (Lei Kandir)',
    URL_LC87,
    ['art. 2º caput e incisos I-V', 'art. 2º § 1º (red. LC 114/2002)', 'art. 2º § 2º'],
  ),

  // 2 — LC 87 arts. 8º, 11 e 12 (base ST, local, momento)
  lei(
    'lc87-art8-11-12-base-calculo',
    'LC 87/1996 arts. 8º, 11 e 12 — Base de cálculo na substituição tributária (MVA, frete), local e momento do fato gerador (texto literal do Planalto)',
    'icms-mg',
    'Base de cálculo da ST, local e momento do fato gerador',
    `## Ficha da Norma
- **Norma:** Lei Complementar nº 87, de 13.9.1996 (Lei Kandir).
- **Notas tipográficas:** quebras de linha unidas; onde o texto oficial registra dois blocos (original + "(Redação dada pela ...)"), cita-se a vigente; marcações "(Produção de efeitos)" e "(Vide ADC 49)" constam do portal e são reproduzidas como constam.

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)

### Art. 8º — base de cálculo para fins de substituição tributária
"Art. 8º A base de cálculo, para fins de substituição tributária, será:
I - em relação às operações ou prestações antecedentes ou concomitantes, o valor da operação ou prestação praticado pelo contribuinte substituído;
II - em relação às operações ou prestações subseqüentes, obtida pelo somatório das parcelas seguintes:
a) o valor da operação ou prestação própria realizada pelo substituto tributário ou pelo substituído intermediário;
b) o montante dos valores de seguro, de frete e de outros encargos cobrados ou transferíveis aos adquirentes ou tomadores de serviço;
c) a margem de valor agregado, inclusive lucro, relativa às operações ou prestações subseqüentes.
§ 1º Na hipótese de responsabilidade tributária em relação às operações ou prestações antecedentes, o imposto devido pelas referidas operações ou prestações será pago pelo responsável, quando:
I – da entrada ou recebimento da mercadoria, do bem ou do serviço; (Redação dada pela Lcp 114, de 16.12.2002)
II - da saída subseqüente por ele promovida, ainda que isenta ou não tributada;
III - ocorrer qualquer saída ou evento que impossibilite a ocorrência do fato determinante do pagamento do imposto.
§ 2º Tratando-se de mercadoria ou serviço cujo preço final a consumidor, único ou máximo, seja fixado por órgão público competente, a base de cálculo do imposto, para fins de substituição tributária, é o referido preço por ele estabelecido.
§ 3º Existindo preço final a consumidor sugerido pelo fabricante ou importador, poderá a lei estabelecer como base de cálculo este preço.
§ 4º A margem a que se refere a alínea c do inciso II do caput será estabelecida com base em preços usualmente praticados no mercado considerado, obtidos por levantamento, ainda que por amostragem ou através de informações e outros elementos fornecidos por entidades representativas dos respectivos setores, adotando-se a média ponderada dos preços coletados, devendo os critérios para sua fixação ser previstos em lei.
§ 5º O imposto a ser pago por substituição tributária, na hipótese do inciso II do caput, corresponderá à diferença entre o valor resultante da aplicação da alíquota prevista para as operações ou prestações internas do Estado de destino sobre a respectiva base de cálculo e o valor do imposto devido pela operação ou prestação própria do substituto.
§ 6º Em substituição ao disposto no inciso II do caput, a base de cálculo em relação às operações ou prestações subseqüentes poderá ser o preço a consumidor final usualmente praticado no mercado considerado, relativamente ao serviço, à mercadoria ou sua similar, em condições de livre concorrência, adotando-se para sua apuração as regras estabelecidas no § 4º deste artigo. (Redação dada pela Lcp 114, de 16.12.2002)"

### Art. 11 — local da operação/prestação (transcrição dos dispositivos-chave)
"Art. 11. O local da operação ou da prestação, para os efeitos da cobrança do imposto e definição do estabelecimento responsável, é:
II - tratando-se de prestação de serviço de transporte:
a) onde tenha início a prestação;
b) onde se encontre o transportador, quando em situação irregular pela falta de documentação fiscal ou quando acompanhada de documentação inidônea, como dispuser a legislação tributária;
c) (revogada); (Redação dada pela Lei Complementar nº 190, de 2022)
V - tratando-se de operações ou prestações interestaduais destinadas a consumidor final, em relação à diferença entre a alíquota interna do Estado de destino e a alíquota interestadual: (Incluído pela Lei Complementar nº 190, de 2022)
a) o do estabelecimento do destinatário, quando o destinatário ou o tomador for contribuinte do imposto;
b) o do estabelecimento do remetente ou onde tiver início a prestação, quando o destinatário ou tomador não for contribuinte do imposto.
§ 3º Para efeito desta Lei Complementar, estabelecimento é o local, privado ou público, edificado ou não, próprio ou de terceiro, onde pessoas físicas ou jurídicas exerçam suas atividades em caráter temporário ou permanente, bem como onde se encontrem armazenadas mercadorias, observado, ainda, o seguinte:
I - na impossibilidade de determinação do estabelecimento, considera-se como tal o local em que tenha sido efetuada a operação ou prestação, encontrada a mercadoria ou constatada a prestação;
II - é autônomo cada estabelecimento do mesmo titular; (Vide ADC 49)
III - considera-se também estabelecimento autônomo o veículo usado no comércio ambulante e na captura de pescado;
IV - respondem pelo crédito tributário todos os estabelecimentos do mesmo titular.
§ 7º Na hipótese da alínea b do inciso V do caput deste artigo, quando o destino final da mercadoria, bem ou serviço ocorrer em Estado diferente daquele em que estiver domiciliado ou estabelecido o adquirente ou o tomador, o imposto correspondente à diferença entre a alíquota interna e a interestadual será devido ao Estado no qual efetivamente ocorrer a entrada física da mercadoria ou bem ou o fim da prestação do serviço. (Incluído pela Lei Complementar nº 190, de 2022)
§ 8º Na hipótese de serviço de transporte interestadual de passageiros cujo tomador não seja contribuinte do imposto: (Incluído pela Lei Complementar nº 190, de 2022)
I - o passageiro será considerado o consumidor final do serviço, e o fato gerador considerar-se-á ocorrido no Estado referido nas alíneas a ou b do inciso II do caput deste artigo, conforme o caso, não se aplicando o disposto no inciso V do caput e no § 7º deste artigo; e
II - o destinatário do serviço considerar-se-á localizado no Estado da ocorrência do fato gerador, e a prestação ficará sujeita à tributação pela sua alíquota interna."
**Nota honesta de recorte:** os incisos I (mercadorias — alíneas a a i), III (comunicação) e IV (serviços iniciados no exterior) do caput do art. 11 existem no texto oficial e NÃO foram transcritos integralmente nesta ficha (foco operacional: transporte, consumidor final e estabelecimento) — o texto integral consta do arquivo oficial; re-captura integral recomendada na atualização. A alínea "b" do § 7º mantém a grafia entre aspas do portal.

### Art. 12 — momento do fato gerador
"Art. 12. Considera-se ocorrido o fato gerador do imposto no momento:
I - da saída de mercadoria de estabelecimento de contribuinte; (Redação dada pela Lei Complementar nº 204, de 2023)
II - do fornecimento de alimentação, bebidas e outras mercadorias por qualquer estabelecimento;
III - da transmissão a terceiro de mercadoria depositada em armazém geral ou em depósito fechado, no Estado do transmitente;
IV - da transmissão de propriedade de mercadoria, ou de título que a represente, quando a mercadoria não tiver transitado pelo estabelecimento transmitente;
V - do início da prestação de serviços de transporte interestadual e intermunicipal, de qualquer natureza;
VI - do ato final do transporte iniciado no exterior;
VII - das prestações onerosas de serviços de comunicação, feita por qualquer meio, inclusive a geração, a emissão, a recepção, a transmissão, a retransmissão, a repetição e a ampliação de comunicação de qualquer natureza;
VIII - do fornecimento de mercadoria com prestação de serviços:
a) não compreendidos na competência tributária dos Municípios;
b) compreendidos na competência tributária dos Municípios e com indicação expressa de incidência do imposto de competência estadual, como definido na lei complementar aplicável;
IX - do desembaraço aduaneiro de mercadorias ou bens importados do exterior; (Redação dada pela Lcp 114, de 16.12.2002)
X - do recebimento, pelo destinatário, de serviço prestado no exterior;
XI - da aquisição em licitação pública de mercadorias ou bens importados do exterior e apreendidos ou abandonados; (Redação dada pela Lcp 114, de 16.12.2002)
XII – da entrada no território do Estado de lubrificantes e combustíveis líquidos e gasosos derivados de petróleo e energia elétrica oriundos de outro Estado, quando não destinados à comercialização ou à industrialização; (Redação dada pela LCP nº 102, de 11.7.2000)
XIII - da utilização, por contribuinte, de serviço cuja prestação se tenha iniciado em outro Estado e não esteja vinculada a operação ou prestação subseqüente;
XIV - do início da prestação de serviço de transporte interestadual, nas prestações não vinculadas a operação ou prestação subsequente, cujo tomador não seja contribuinte do imposto domiciliado ou estabelecido no Estado de destino; (Incluído pela Lei Complementar nº 190, de 2022)
XV - da entrada no território do Estado de bem ou mercadoria oriundos de outro Estado adquiridos por contribuinte do imposto e destinados ao seu uso ou consumo ou à integração ao seu ativo imobilizado; (Incluído pela Lei Complementar nº 190, de 2022)
XVI - da saída, de estabelecimento de contribuinte, de bem ou mercadoria destinados a consumidor final não contribuinte do imposto domiciliado ou estabelecido em outro Estado. (Incluído pela Lei Complementar nº 190, de 2022)
§ 1º Na hipótese do inciso VII, quando o serviço for prestado mediante pagamento em ficha, cartão ou assemelhados, considera-se ocorrido o fato gerador do imposto quando do fornecimento desses instrumentos ao usuário.
§ 2º Na hipótese do inciso IX, após o desembaraço aduaneiro, a entrega, pelo depositário, de mercadoria ou bem importados do exterior deverá ser autorizada pelo órgão responsável pelo seu desembaraço, que somente se fará mediante a exibição do comprovante de pagamento do imposto incidente no ato do despacho aduaneiro, salvo disposição em contrário.
§ 3º Na hipótese de entrega de mercadoria ou bem importados do exterior antes do desembaraço aduaneiro, considera-se ocorrido o fato gerador neste momento, devendo a autoridade responsável, salvo disposição em contrário, exigir a comprovação do pagamento do imposto. (Incluído pela Lcp 114, de 16.12.2002)"

**Notas de alteração (como consta):** no inciso I, o portal registra também a redação original ("da saída de mercadoria de estabelecimento de contribuinte, ainda que para outro estabelecimento do mesmo titular;") com a marcação "(Vide ADC 49)" e a redação dada pela Lei Complementar nº 204, de 2023 (Vigência). Nos incisos XII, os blocos de redação original e da redação dada pela LCP nº 102, de 11.7.2000 são ambos registrados — cita-se a vigente. Nos §§ 4º e 5º do art. 12 (incluídos pela LC 204/2023 — transferência entre estabelecimentos do mesmo titular, créditos por transferência limitados aos percentuais do art. 155, § 2º, IV, CF e opção por equiparação a operação tributada), o portal registra "Vigência" — ver análise no doc tese-st-interstadial-mg.

## Leitura aplicada no EJC
- **MVA (alínea c):** é parcela da base da fase futura; o § 4º EXIGE que "os critérios para sua fixação ser previstos em lei" — base fixada sem esse amparo é ponto de impugnação.
- **Mecânica da ST antecipada (§ 5º):** alíquota INTERNA do destino × base da fase futura, menos o imposto da operação própria do substituto.
- **Alternativa do § 6º:** base = preço a consumidor final usual (regras do § 4º).
- **Frete (art. 13 § 1º II b):** integra a base quando o transporte é pelo próprio remetente ou por sua conta e ordem e cobrado em separado.
- **Consumidor final não contribuinte em outra UF (LC 190/2022):** momento no art. 12 XVI; diferença de alíquotas devida ao remetente (art. 11 V b), com exceção do § 7º (destino final em UF diferente).
- **Transferência entre estabelecimentos (LC 204/2023):** o inciso I vigente NÃO mais excepciona a transferência do caput (contraste com a redação anterior "(Vide ADC 49)" registrada como consta); §§ 4º-5º do art. 12 disciplinam a opção.
- **Autonomia de estabelecimentos:** § 3º II-IV — cada estabelecimento é autônomo, MAS todos respondem pelo crédito tributário (ponto de defesa sobre imputação).`,
    'Lei Complementar 87/1996 (Lei Kandir)',
    URL_LC87,
    ['art. 8º caput, II a-c e §§ 1º-6º', 'art. 11 caput, II, V e §§ 3º, 7º, 8º', 'art. 12 caput I-XVI e §§ 1º-3º'],
  ),

  // 3 — LC 87 art. 13 (base de cálculo: integrações, importação, LC 190/2022, § 4º revogado)
  lei(
    'lc87-art13-substituicao-tributaria',
    'LC 87/1996 art. 13 — Base de cálculo: valor da operação, importação (II/IIPI/despesas), frete e montante do próprio imposto; § 4º REVOGADO (LC 204/2023) — texto literal do Planalto',
    'icms-mg',
    'Base de cálculo do ICMS — integrações e exceções',
    `## Ficha da Norma
- **Norma:** Lei Complementar nº 87, de 13.9.1996 (Lei Kandir). Nota: o art. 13 disciplina a BASE DE CÁLCULO GERAL do ICMS; a base para fins de SUBSTITUIÇÃO TRIBUTÁRIA (MVA) é o art. 8º — doc lc87-art8-11-12-base-calculo. Nota honesta: os arts. 6º-7º da LC 87 (responsabilidade por substituição) NÃO foram capturados nesta consulta.

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 13. A base de cálculo do imposto é:
I - na saída de mercadoria prevista nos incisos I, III e IV do art. 12, o valor da operação;
II - na hipótese do inciso II do art. 12, o valor da operação, compreendendo mercadoria e serviço;
III - na prestação de serviço de transporte interestadual e intermunicipal e de comunicação, o preço do serviço;
IV - no fornecimento de que trata o inciso VIII do art. 12;
a) o valor da operação, na hipótese da alínea a;
b) o preço corrente da mercadoria fornecida ou empregada, na hipótese da alínea b;
V - na hipótese do inciso IX do art. 12, a soma das seguintes parcelas:
a) o valor da mercadoria ou bem constante dos documentos de importação, observado o disposto no art. 14;
b) imposto de importação;
c) imposto sobre produtos industrializados;
d) imposto sobre operações de câmbio;
e) quaisquer outros impostos, taxas, contribuições e despesas aduaneiras; (Redação dada pela Lcp 114, de 16.12.2002)
VI - na hipótese do inciso X do art. 12, o valor da prestação do serviço, acrescido, se for o caso, de todos os encargos relacionados com a sua utilização;
VII - no caso do inciso XI do art. 12, o valor da operação acrescido do valor dos impostos de importação e sobre produtos industrializados e de todas as despesas cobradas ou debitadas ao adquirente;
VIII - na hipótese do inciso XII do art. 12, o valor da operação de que decorrer a entrada;
IX - nas hipóteses dos incisos XIII e XV do caput do art. 12 desta Lei Complementar: (Redação dada pela Lei Complementar nº 190, de 2022)
a) o valor da operação ou prestação no Estado de origem, para o cálculo do imposto devido a esse Estado; (Incluída pela Lei Complementar nº 190, de 2022)
b) o valor da operação ou prestação no Estado de destino, para o cálculo do imposto devido a esse Estado; (Incluída pela Lei Complementar nº 190, de 2022)
X - nas hipóteses dos incisos XIV e XVI do caput do art. 12 desta Lei Complementar, o valor da operação ou o preço do serviço, para o cálculo do imposto devido ao Estado de origem e ao de destino. (Incluído pela Lei Complementar nº 190, de 2022)
§ 1º Integra a base de cálculo do imposto, inclusive nas hipóteses dos incisos V, IX e X do caput deste artigo: (Redação dada pela Lei Complementar nº 190, de 2022)
I - o montante do próprio imposto, constituindo o respectivo destaque mera indicação para fins de controle;
II - o valor correspondente a:
a) seguros, juros e demais importâncias pagas, recebidas ou debitadas, bem como descontos concedidos sob condição;
b) frete, caso o transporte seja efetuado pelo próprio remetente ou por sua conta e ordem e seja cobrado em separado.
III - a partir de 1º de janeiro de 2027, o valor correspondente ao Imposto Seletivo a que se refere o inciso VIII do caput do art. 153 da Constituição Federal. (Incluído pela Lei Complementar nº 227, de 2026)
§ 2º Não integra a base de cálculo do imposto o montante do Imposto sobre Produtos Industrializados, quando a operação, realizada entre contribuintes e relativa a produto destinado à industrialização ou à comercialização, configurar fato gerador de ambos os impostos.
§ 3º No caso da alínea b do inciso IX e do inciso X do caput deste artigo, o imposto a pagar ao Estado de destino será o valor correspondente à diferença entre a alíquota interna do Estado de destino e a interestadual. (Redação dada pela Lei Complementar nº 190, de 2022)
§ 4º Na saída de mercadoria para estabelecimento localizado em outro Estado, pertencente ao mesmo titular, a base de cálculo do imposto é: (Vide ADC 49) (Revogado pela Lei Complementar nº 204, de 2023)
I - o valor correspondente à entrada mais recente da mercadoria; (Revogado pela Lei Complementar nº 204, de 2023)
II - o custo da mercadoria produzida, assim entendida a soma do custo da matéria-prima, material secundário, mão-de-obra e acondicionamento; (Revogado pela Lei Complementar nº 204, de 2023)
III - tratando-se de mercadorias não industrializadas, o seu preço corrente no mercado atacadista do estabelecimento remetente. (Revogado pela Lei Complementar nº 204, de 2023)
§ 5º Nas operações e prestações interestaduais entre estabelecimentos de contribuintes diferentes, caso haja reajuste do valor depois da remessa ou da prestação, a diferença fica sujeita ao imposto no estabelecimento do remetente ou do prestador.
§ 6º Utilizar-se-á, para os efeitos do inciso IX do caput deste artigo: (Incluído pela Lei Complementar nº 190, de 2022)
I - a alíquota prevista para a operação ou prestação interestadual, para estabelecer a base de cálculo da operação ou prestação no Estado de origem; (Incluído pela Lei Complementar nº 190, de 2022)
II - a alíquota prevista para a operação ou prestação interna, para estabelecer a base de cálculo da operação ou prestação no Estado de destino. (Incluído pela Lei Complementar nº 190, de 2022)
§ 7º Utilizar-se-á, para os efeitos do inciso X do caput deste artigo, a alíquota prevista para a operação ou prestação interna no Estado de destino para estabelecer a base de cálculo da operação ou prestação. (Incluído pela Lei Complementar nº 190, de 2022)"

**Notas de alteração (como consta):** o § 1º aparece em três blocos no portal (original; redação Lcp 114/2002; redação LC 190/2022) — cita-se a vigente. O § 3º também tem duas redações (original e LC 190/2022). O § 4º está REVOGADO pela LC 204/2023 no texto oficial — registrado como consta, sem afirmar efeitos temporais além da marcação "(Revogado ...)" e "Vigência" do portal.

## Leitura aplicada no EJC
- **Regra geral:** valor da operação (I) e preço do serviço (III) — sem teto ou piso federal.
- **Importação (V):** soma incluindo II, IIPI, câmbio e "quaisquer outros impostos, taxas, contribuições e despesas aduaneiras" (red. LC 114/2002).
- **IPI (§ 2º):** não integra quando a operação entre contribuintes para industrialização/comercialização configura fato gerador de ambos — verificação dupla (ICMS × IPI) nas defesas.
- **Frete (§ 1º II b):** integra SOMENTE se pelo próprio remetente/por sua conta e ordem E cobrado em separado — frete contratado por conta do destinatário (CIF vs FOB) é ponto de impugnação recorrente.
- **Montante do próprio imposto (§ 1º I):** o ICMS "por dentro" — destaque é mera indicação de controle.
- **LC 227/2026 (§ 1º III):** Imposto Seletivo integra a base a partir de 1º/1/2027 — marco temporal LITERAL a monitorar.
- **Diferença de alíquotas (§ 3º):** mecânica LC 190/2022 para consumidor final.
- **MVA em fase futura (conexão):** na substituição a base da fase futura segue o art. 8º II c e §§ 4º-6º — nunca confundir com o art. 13.`,
    'Lei Complementar 87/1996 (Lei Kandir)',
    URL_LC87,
    ['art. 13 caput I-X', 'art. 13 § 1º (red. LC 190/2022) e § 2º', 'art. 13 §§ 3º-7º', 'art. 13 § 4º (revogado — consta)'],
  ),

  // 4 — LC 87 arts. 20-21 (créditos/não-cumulatividade/estornos)
  lei(
    'lc87-art20-21-creditos',
    'LC 87/1996 arts. 20 e 21 — Créditos (não-cumulatividade), vedações, apropriação 1/48 do ativo permanente (LC 102/2000) e estornos — texto literal do Planalto',
    'icms-mg',
    'Créditos, vedações de creditamento e estornos',
    `## Ficha da Norma
- **Norma:** Lei Complementar nº 87, de 13.9.1996 (Lei Kandir). Nota honesta: o art. 19 (compensação — regra-mãe referida no caput do art. 20 como "o artigo anterior") NÃO foi capturado nesta consulta; a mecânica aqui registrada deriva dos arts. 20-21 e 23-25 LITERAIS.

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)

### Art. 20
"Art. 20. Para a compensação a que se refere o artigo anterior, é assegurado ao sujeito passivo o direito de creditar-se do imposto anteriormente cobrado em operações de que tenha resultado a entrada de mercadoria, real ou simbólica, no estabelecimento, inclusive a destinada ao seu uso ou consumo ou ao ativo permanente, ou o recebimento de serviços de transporte interestadual e intermunicipal ou de comunicação.
§ 1º Não dão direito a crédito as entradas de mercadorias ou utilização de serviços resultantes de operações ou prestações isentas ou não tributadas, ou que se refiram a mercadorias ou serviços alheios à atividade do estabelecimento.
§ 2º Salvo prova em contrário, presumem-se alheios à atividade do estabelecimento os veículos de transporte pessoal.
§ 3º É vedado o crédito relativo a mercadoria entrada no estabelecimento ou a prestação de serviços a ele feita:
I - para integração ou consumo em processo de industrialização ou produção rural, quando a saída do produto resultante não for tributada ou estiver isenta do imposto, exceto se tratar-se de saída para o exterior;
II - para comercialização ou prestação de serviço, quando a saída ou a prestação subseqüente não forem tributadas ou estiverem isentas do imposto, exceto as destinadas ao exterior.
§ 4º Deliberação dos Estados, na forma do art. 28, poderá dispor que não se aplique, no todo ou em parte, a vedação prevista no parágrafo anterior.
§ 5º Para efeito do disposto no caput deste artigo, relativamente aos créditos decorrentes de entrada de mercadorias no estabelecimento destinadas ao ativo permanente, deverá ser observado: (Redação dada pela LCP nº 102, de 11.7.2000)
I – a apropriação será feita à razão de um quarenta e oito avos por mês, devendo a primeira fração ser apropriada no mês em que ocorrer a entrada no estabelecimento; (Inciso Incluído pela LCP nº 102, de 11.7.2000)
II – em cada período de apuração do imposto, não será admitido o creditamento de que trata o inciso I, em relação à proporção das operações de saídas ou prestações isentas ou não tributadas sobre o total das operações de saídas ou prestações efetuadas no mesmo período; (Inciso Incluído pela LCP nº 102, de 11.7.2000)
III – para aplicação do disposto nos incisos I e II deste parágrafo, o montante do crédito a ser apropriado será obtido multiplicando-se o valor total do respectivo crédito pelo fator igual a 1/48 (um quarenta e oito avos) da relação entre o valor das operações de saídas e prestações tributadas e o total das operações de saídas e prestações do período, equiparando-se às tributadas, para fins deste inciso, as saídas e prestações com destino ao exterior ou as saídas de papel destinado à impressão de livros, jornais e periódicos; (Redação dada pela Lei Complementar nº 120, de 2005)
IV – o quociente de um quarenta e oito avos será proporcionalmente aumentado ou diminuído, pro rata die, caso o período de apuração seja superior ou inferior a um mês; (Inciso Incluído pela LCP nº 102, de 11.7.2000)
V – na hipótese de alienação dos bens do ativo permanente, antes de decorrido o prazo de quatro anos contado da data de sua aquisição, não será admitido, a partir da data da alienação, o creditamento de que trata este parágrafo em relação à fração que corresponderia ao restante do quadriênio; (Inciso Incluído pela LCP nº 102, de 11.7.2000)
VI serão objeto de outro lançamento, além do lançamento em conjunto com os demais créditos, para efeito da compensação prevista neste artigo e no art. 19, em livro próprio ou de outra forma que a legislação determinar, para aplicação do disposto nos incisos I a V deste parágrafo; e (Inciso Incluído pela LCP nº 102, de 11.7.2000)
VII – ao final do quadragésimo oitavo mês contado da data da entrada do bem no estabelecimento, o saldo remanescente do crédito será cancelado. (Inciso Incluído pela LCP nº 102, de 11.7.2000)
§ 6º Operações tributadas, posteriores a saídas de que trata o § 3º, dão ao estabelecimento que as praticar direito a creditar-se do imposto cobrado nas operações anteriores às isentas ou não tributadas sempre que a saída isenta ou não tributada seja relativa a:
I - produtos agropecuários;
II - quando autorizado em lei estadual, outras mercadorias.
Art. 20-A. Nas hipóteses dos incisos XIV e XVI do caput do art. 12 desta Lei Complementar, o crédito relativo às operações e prestações anteriores deve ser deduzido apenas do débito correspondente ao imposto devido à unidade federada de origem. (Incluído pela Lei Complementar nº 190, de 2022)"

### Art. 21
"Art. 21. O sujeito passivo deverá efetuar o estorno do imposto de que se tiver creditado sempre que o serviço tomado ou a mercadoria entrada no estabelecimento:
I - for objeto de saída ou prestação de serviço não tributada ou isenta, sendo esta circunstância imprevisível na data da entrada da mercadoria ou da utilização do serviço;
II - for integrada ou consumida em processo de industrialização, quando a saída do produto resultante não for tributada ou estiver isenta do imposto;
III - vier a ser utilizada em fim alheio à atividade do estabelecimento;
IV - vier a perecer, deteriorar-se ou extraviar-se.
§ 2º Não se estornam créditos referentes a mercadorias e serviços que venham a ser objeto de operações ou prestações destinadas ao exterior ou de operações com o papel destinado à impressão de livros, jornais e periódicos. (Redação dada pela Lei Complementar nº 120, de 2005)
§ 3º O não creditamento ou o estorno a que se referem o § 3º do art. 20 e o caput deste artigo, não impedem a utilização dos mesmos créditos em operações posteriores, sujeitas ao imposto, com a mesma mercadoria."

**Notas de alteração (como consta):** o § 1º do art. 21 (estorno do ativo permanente alienado antes de 5 anos — 20% por ano) e os §§ 4º a 8º do art. 21 estão REVOGADOS pela Lcp nº 102, de 11.7.2000 no texto oficial — registrados como consta. O § 5º do art. 20 aparece em dois blocos (original incluído pela LC 102/2000 e redação LC 120/2005 no inciso III) — cita-se a vigente. A grafia "VI" sem travessão no inciso VI do § 5º mantém-se como consta.

## Leitura aplicada no EJC
- **NÃO-CUMULATIVIDADE operacional:** direito ao crédito inclusive para uso/consumo e ATIVO PERMANENTE (caput) — mas com vedação quando a saída futura é isenta/não tributada (§§ 1º e 3º).
- **Crédito GUARDADO (§ 3º do art. 21):** o não creditamento/estorno NÃO impede o uso posterior dos créditos em operação tributada com a mesma mercadoria — argumento central contra supressão de créditos por operação eventualmente isenta.
- **1/48 avos (§ 5º):** apropriação mensal do crédito de ativo permanente em 48 meses, com corte proporcional de saídas isentas (II-III) e CANCELAMENTO do saldo no 48º mês (VII); alienação antes de 4 anos corta o restante (V).
- **Corte da alienação:** atenção à diferença de marcos: § 5º V do art. 20 usa "quatro anos" (LC 102/2000); o § 1º revogado do art. 21 usava "cinco anos" — citar somente o vigente.
- **Exterior (art. 21 § 2º):** não se estornam créditos vinculados a exportação (ou papel de livros/jornais — red. LC 120/2005).
- **Deliberação dos Estados (§ 4º do art. 20):** a vedação do § 3º pode ser afastada por deliberação (art. 28) — verificar se existe deliberação/convênio aplicável (base LC 24 — doc lc24-convenios-icms) e [VERIFICAR LEI ESTADUAL MG].
- **LC 190/2022 (art. 20-A):** crédito de operação anterior deduzido APENAS do débito devido à UF de origem nas hipóteses XIV/XVI do art. 12.`,
    'Lei Complementar 87/1996 (Lei Kandir)',
    URL_LC87,
    ['art. 20 caput e §§ 1º-6º', 'art. 20-A', 'art. 21 caput I-IV, § 2º e § 3º', 'art. 21 §§ 1º/4º-8º (revogados — consta)'],
  ),

  // 5 — LC 87 arts. 23-25 (idoneidade, prazo do crédito, apuração)
  lei(
    'lc87-art23-25-observacoes',
    'LC 87/1996 arts. 23-25 — Idoneidade da documentação, extinção do crédito em 5 anos, apuração por estabelecimento e portais estaduais (art. 24-A) — texto literal do Planalto',
    'icms-mg',
    'Idoneidade documental, apuração e transparência estadual',
    `## Ficha da Norma
- **Norma:** Lei Complementar nº 87, de 13.9.1996 (Lei Kandir).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)

### Art. 23 (com o § único — prazo de 5 anos do crédito)
"Art. 23. O direito de crédito, para efeito de compensação com débito do imposto, reconhecido ao estabelecimento que tenha recebido as mercadorias ou para o qual tenham sido prestados os serviços, está condicionado à idoneidade da documentação e, se for o caso, à escrituração nos prazos e condições estabelecidos na legislação.
Parágrafo único. O direito de utilizar o crédito extingue-se depois de decorridos cinco anos contados da data de emissão do documento."

### Art. 24 (apuração e liquidação)
"Art. 24. A legislação tributária estadual disporá sobre o período de apuração do imposto. As obrigações consideram-se vencidas na data em que termina o período de apuração e são liquidadas por compensação ou mediante pagamento em dinheiro como disposto neste artigo:
I - as obrigações consideram-se liquidadas por compensação até o montante dos créditos escriturados no mesmo período mais o saldo credor de período ou períodos anteriores, se for o caso;
II - se o montante dos débitos do período superar o dos créditos, a diferença será liquidada dentro do prazo fixado pelo Estado;
III - se o montante dos créditos superar os dos débitos, a diferença será transportada para o período seguinte."

### Art. 24-A (transparência estadual — LC 190/2022)
"Art. 24-A. Os Estados e o Distrito Federal divulgarão, em portal próprio, as informações necessárias ao cumprimento das obrigações tributárias, principais e acessórias, nas operações e prestações interestaduais, conforme o tipo. (Incluído pela Lei Complementar nº 190, de 2022)
§ 1º O portal de que trata o caput deste artigo deverá conter, inclusive: (Incluído pela Lei Complementar nº 190, de 2022)
I - a legislação aplicável à operação ou prestação específica, incluídas soluções de consulta e decisões em processo administrativo fiscal de caráter vinculante; (Incluído pela Lei Complementar nº 190, de 2022)
II - as alíquotas interestadual e interna aplicáveis à operação ou prestação; (Incluído pela Lei Complementar nº 190, de 2022)
III - as informações sobre benefícios fiscais ou financeiros e regimes especiais que possam alterar o valor a ser recolhido do imposto; e (Incluído pela Lei Complementar nº 190, de 2022)
IV - as obrigações acessórias a serem cumpridas em razão da operação ou prestação realizada. (Incluído pela Lei Complementar nº 190, de 2022)"

### Art. 25 (apuração por estabelecimento — redação vigente)
"Art. 25. Para efeito de aplicação do disposto no art. 24, os débitos e créditos devem ser apurados em cada estabelecimento, compensando-se os saldos credores e devedores entre os estabelecimentos do mesmo sujeito passivo localizados no Estado. (Redação dada pela LCP nº 102, de 11.7.2000)
§ 1º Saldos credores acumulados a partir da data de publicação desta Lei Complementar por estabelecimentos que realizem operações e prestações de que tratam o inciso II do art. 3º e seu parágrafo único podem ser, na proporção que estas saídas representem do total das saídas realizadas pelo estabelecimento:
I - imputados pelo sujeito passivo a qualquer estabelecimento seu no Estado;
II - havendo saldo remanescente, transferidos pelo sujeito passivo a outros contribuintes do mesmo Estado, mediante a emissão pela autoridade competente de documento que reconheça o crédito.
§ 2º Lei estadual poderá, nos demais casos de saldos credores acumulados a partir da vigência desta Lei Complementar, permitir que:
I - sejam imputados pelo sujeito passivo a qualquer estabelecimento seu no Estado;
II - sejam transferidos, nas condições que definir, a outros contribuintes do mesmo Estado."

**Notas (como consta):** o portal registra também a redação ORIGINAL do art. 25 (apuração em cada estabelecimento do sujeito passivo, com possibilidade de a lei estadual levar em conta o conjunto dos débitos e créditos no Estado) — cita-se a vigente (LC 102/2000). O portal registra ainda "(Vide ADC 49)" em outros dispositivos da lei; o art. 24-A no portal traz as marcações "(Produção de efeitos)".

## Leitura aplicada no EJC
- **PRAZO LITERAL de 5 anos (art. 23 § único):** extinção do DIREITO DE UTILIZAR o crédito contado da EMISSÃO DO DOCUMENTO (não da escrituração) — doc prazo-credito-icms-5-anos. Distinto da decadência/prescrição do lançamento (CTN arts. 173/174 — docs da base, LOTE-004).
- **Idoneidade (caput):** a inidoneidade de documento é a porta de entrada da glosa de crédito — exigir descrição precisa do defeito na autuação.
- **Período de apuração e prazo de pagamento:** definidos pela LEGISLAÇÃO ESTADUAL (art. 24 caput e inciso II) — [VERIFICAR LEI ESTADUAL MG]; o piso federal é: compensação até o montante dos créditos + saldo credor, e transporte de saldo credor para o período seguinte (I e III).
- **Saldos credores (art. 25 §§ 1º-2º):** imputação/transferência dependem de LEI ESTADUAL (salvo a hipótese do § 1º para operações do art. 3º II) — [VERIFICAR LEI ESTADUAL MG].
- **Art. 24-A:** MG deve publicar em portal próprio legislação aplicável, alíquotas, benefícios e obrigações acessórias — ferramenta de VERIFICAÇÃO a favor do contribuinte (não capturado o portal MG nesta consulta — doc ponte).`,
    'Lei Complementar 87/1996 (Lei Kandir)',
    URL_LC87,
    ['art. 23 e parágrafo único', 'art. 24 caput e incisos I-III', 'art. 24-A e § 1º I-IV', 'art. 25 (red. LC 102/2000) e §§ 1º-2º'],
  ),

  // 6 — LC 24/1975 (convênios — base do CONFAZ)
  lei(
    'lc24-convenios-icms',
    'LC 24/1975 arts. 1º-3º — Convênios sobre isenções, reduções de base e incentivos do ICMS: celebração, UNANIMIDADE para concessão, 4/5 para revogação, publicação em 10 dias (texto literal do Planalto)',
    'icms-mg',
    'Convênios entre Estados — base normativa do CONFAZ',
    `## Ficha da Norma
- **Norma:** Lei Complementar nº 24, de 7.1.1975 — disciplina os convênios celebrados pelos Estados e DF (fundamento histórico do CONFAZ).
- **Remissão registrada como consta:** o portal marca os arts. 1º-3º com "(Vide Lei Complementar nº 214, de 2025)" e "Produção de efeitos" — a LC 214/2025 NÃO foi capturada nesta consulta; nada se afirma sobre seus efeitos.

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 1º - As isenções do imposto sobre operações relativas à circulação de mercadorias serão concedidas ou revogadas nos termos de convênios celebrados e ratificados pelos Estados e pelo Distrito Federal, segundo esta Lei.
Parágrafo único - O disposto neste artigo também se aplica:
I - à redução da base de cálculo;
II - à devolução total ou parcial, direta ou indireta, condicionada ou não, do tributo, ao contribuinte, a responsável ou a terceiros;
III - à concessão de créditos presumidos;
IV - à quaisquer outros incentivos ou favores fiscais ou financeiro-fiscais, concedidos com base no Imposto de Circulação de Mercadorias, dos quais resulte redução ou eliminação, direta ou indireta, do respectivo ônus;
V - às prorrogações e às extensões das isenções vigentes nesta data.
Art. 2º - Os convênios a que alude o art. 1º, serão celebrados em reuniões para as quais tenham sido convocados representantes de todos os Estados e do Distrito Federal, sob a presidência de representantes do Governo federal.
§ 1º - As reuniões se realizarão com a presença de representantes da maioria das Unidades da Federação.
§ 2º - A concessão de benefícios dependerá sempre de decisão unânime dos Estados representados; a sua revogação total ou parcial dependerá de aprovação de quatro quintos, pelo menos, dos representantes presentes.
§ 3º - Dentro de 10 (dez) dias, contados da data final da reunião a que se refere este artigo, a resolução nela adotada será publicada no Diário Oficial da União.
Art. 3º - Os convênios podem dispor que a aplicação de qualquer de suas cláusulas seja limitada a uma ou a algumas Unidades da Federação."

## Leitura aplicada no EJC
- **Rol amplo (art. 1º § único):** isenção, redução de base, devolução/ressarcimento, crédito presumido e "quaisquer outros incentivos" que reduzam o ônus — benefício de ICMS sob qualquer rótulo cai aqui.
- **UNANIMIDADE (art. 2º § 2º):** concessão exige decisão UNÂNIME dos Estados representados; revogação (total ou parcial), 4/5 dos presentes. Benefício estadual sem convênio é ponto clássico de inconstitucionalidade (controle pela União/estados) — verificar sempre o CONVÊNIO específico e a adesão.
- **Publicação (§ 3º):** resolução publicada no DOU em 10 dias da data final da reunião — doc prazo-publicacao-resolucao-convenio-10-dias.
- **Vigência limitada (art. 3º):** convênios podem limitar a aplicação a UFs específicas — MG só se beneficia/aplica se incluída.
- **Ponte com LC 87:** vedações de crédito podem ser afastadas por "Deliberação dos Estados" (art. 20 § 4º LC 87) na forma do art. 28 — conferir se a deliberação existe e foi publicada.`,
    'Lei Complementar 24/1975',
    URL_LC24,
    ['art. 1º e parágrafo único I-V', 'art. 2º caput e §§ 1º-3º', 'art. 3º'],
  ),

  // 7 — CTN arts. 113-118 (obrigação tributária e fato gerador)
  lei(
    'ctn-arts113-118-obrigacao-fato-gerador',
    'CTN arts. 113-118 — Obrigação principal e acessória; fato gerador (situação definida em lei); desconsideração; interpretação abstrata (texto literal do Planalto)',
    null,
    'Obrigação tributária — base geral (CTN)',
    `## Ficha da Norma
- **Norma:** Decreto-Lei nº 5.172, de 25.10.1966 — Código Tributário Nacional (arquivo compilado do Planalto). Ortografia da época ("interêsse", "têrmos") mantida como consta.
- **Verificação prévia anti-duplicata:** a base já contém CTN arts. 150 § 4º, 173 I e 174 (decadência/prescrição — LOTE-004, doc ctn-decadencia-prescricao-tributaria); ESTA ficha cobre o CAPÍTULO I (obrigação tributária) — sem sobreposição.

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 113. A obrigação tributária é principal ou acessória.
§ 1º A obrigação principal surge com a ocorrência do fato gerador, tem por objeto o pagamento de tributo ou penalidade pecuniária e extingue-se juntamente com o crédito dela decorrente.
§ 2º A obrigação acessória decorre da legislação tributária e tem por objeto as prestações, positivas ou negativas, nela previstas no interêsse da arrecadação ou da fiscalização dos tributos.
§ 3º A obrigação acessória, pelo simples fato da sua inobservância, converte-se em obrigação principal relativamente à penalidade pecuniária.
Art. 114. Fato gerador da obrigação principal é a situação definida em lei como necessária e suficiente à sua ocorrência.
Art. 115. Fato gerador da obrigação acessória é qualquer situação que, na forma da legislação aplicável, impõe a prática ou a abstenção de ato que não configure obrigação principal.
Art. 116. Salvo disposição de lei em contrário, considera-se ocorrido o fato gerador e existentes os seus efeitos:
I - tratando-se de situação de fato, desde o momento em que o se verifiquem as circunstâncias materiais necessárias a que produza os efeitos que normalmente lhe são próprios;
II - tratando-se de situação jurídica, desde o momento em que esteja definitivamente constituída, nos têrmos de direito aplicável.
Parágrafo único. A autoridade administrativa poderá desconsiderar atos ou negócios jurídicos praticados com a finalidade de dissimular a ocorrência do fato gerador do tributo ou a natureza dos elementos constitutivos da obrigação tributária, observados os procedimentos a serem estabelecidos em lei ordinária. (Incluído pela Lcp nº 104, de 2001)
Art. 117. Para os efeitos do inciso II do artigo anterior e salvo disposição de lei em contrário, os atos ou negócios jurídicos condicionais reputam-se perfeitos e acabados:
I - sendo suspensiva a condição, desde o momento de seu implemento;
II - sendo resolutória a condição, desde o momento da prática do ato ou da celebração do negócio.
Art. 118. A definição legal do fato gerador é interpretada abstraindo-se:
I - da validade jurídica dos atos efetivamente praticados pelos contribuintes, responsáveis, ou terceiros, bem como da natureza do seu objeto ou dos seus efeitos;
II - dos efeitos dos fatos efetivamente ocorridos."

## Leitura aplicada no EJC
- **Dois planos (art. 113):** obrigação PRINCIPAL (pagar tributo/penalidade — nasce com o fato gerador) × ACESSÓRIA (fazer/não fazer no interesse da arrecadação/fiscalização). A inobservância da acessória converte-se em principal APENAS quanto à penalidade pecuniária (§ 3º) — fundamento de multas por infração acessória.
- **Fato gerador = situação definida em LEI (art. 114):** "necessária e suficiente" — enquadramento exige a verificação de TODOS os elementos da hipótese legal; analogia não cria fato gerador.
- **Momento (art. 116):** situação de FATO (verificação das circunstâncias materiais) × situação JURÍDICA (constituição definitiva).
- **Desconsideração (§ único, LC 104/2001):** simulação/dissimulação depende de "procedimentos a serem estabelecidos em lei ordinária" — autuação que desconsidera negócio sem esses procedimentos é ponto de impugnação.
- **Interpretação abstrata (art. 118):** invalidade civil do ato não impede o tributo — cuidado ao combinar "ato nulo" com "sem tributo"; funciona como defesa apenas nos limites da definição legal.`,
    'Decreto-Lei 5.172/1966 (Código Tributário Nacional)',
    URL_CTN,
    ['art. 113 caput e §§ 1º-3º', 'arts. 114-115', 'art. 116 e parágrafo único (LC 104/2001)', 'arts. 117-118'],
  ),

  // 8 — CTN arts. 119-131 (sujeição passiva, solidariedade, responsabilidade)
  lei(
    'ctn-arts119-131-sujeicao-passiva-responsabilidade',
    'CTN arts. 119-131 — Sujeito ativo e passivo (contribuinte × responsável), solidariedade SEM benefício de ordem, capacidade tributária, domicílio e responsabilidade por atribuição legal (texto literal do Planalto)',
    null,
    'Sujeição passiva, solidariedade e responsabilidade tributária (CTN)',
    `## Ficha da Norma
- **Norma:** Decreto-Lei nº 5.172, de 25.10.1966 — Código Tributário Nacional (arquivo compilado do Planalto). Ortografia da época mantida como consta.
- **Notas de alteração (como consta):** art. 131, inciso I com "(Redação dada pelo Decreto Lei nº 28, de 1966)". Os arts. 132-135 (responsabilidade de terceiros — pais/tutores, sócios, administradores, liquidantes) NÃO foram capturados nesta consulta (pendência para re-captura).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 119. Sujeito ativo da obrigação é a pessoa jurídica de direito público, titular da competência para exigir o seu cumprimento.
Art. 120. Salvo disposição de lei em contrário, a pessoa jurídica de direito público, que se constituir pelo desmembramento territorial de outra, sub-roga-se nos direitos desta, cuja legislação tributária aplicará até que entre em vigor a sua própria.
Art. 121. Sujeito passivo da obrigação principal é a pessoa obrigada ao pagamento de tributo ou penalidade pecuniária.
Parágrafo único. O sujeito passivo da obrigação principal diz-se:
I - contribuinte, quando tenha relação pessoal e direta com a situação que constitua o respectivo fato gerador;
II - responsável, quando, sem revestir a condição de contribuinte, sua obrigação decorra de disposição expressa de lei.
Art. 122. Sujeito passivo da obrigação acessória é a pessoa obrigada às prestações que constituam o seu objeto.
Art. 123. Salvo disposições de lei em contrário, as convenções particulares, relativas à responsabilidade pelo pagamento de tributos, não podem ser opostas à Fazenda Pública, para modificar a definição legal do sujeito passivo das obrigações tributárias correspondentes.
Art. 124. São solidàriamente obrigadas:
I - as pessoas que tenham interêsse comum na situação que constitua o fato gerador da obrigação principal;
II - as pessoas expressamente designadas por lei.
Parágrafo único. A solidariedade referida neste artigo não comporta benefício de ordem.
Art. 125. Salvo disposição de lei em contrário, são os seguintes os efeitos da solidariedade:
I - o pagamento efetuado por um dos obrigados aproveita aos demais;
II - a isenção ou remissão de crédito exonera todos os obrigados, salvo se outorgada pessoalmente a um dêles, subsistindo, nesse caso, a solidariedade quanto aos demais pelo saldo;
III - a interrupção da prescrição, em favor ou contra um dos obrigados, favorece ou prejudica aos demais.
Art. 126. A capacidade tributária passiva independe:
I - da capacidade civil das pessoas naturais;
II - de achar-se a pessoa natural sujeita a medidas que importem privação ou limitação do exercício de atividades civis, comerciais ou profissionais, ou da administração direta de seus bens ou negócios;
III - de estar a pessoa jurídica regularmente constituída, bastando que configure uma unidade econômica ou profissional.
Art. 127. Na falta de eleição, pelo contribuinte ou responsável, de domicílio tributário, na forma da legislação aplicável, considera-se como tal:
I - quanto às pessoas naturais, a sua residência habitual, ou, sendo esta incerta ou desconhecida, o centro habitual de sua atividade;
II - quanto às pessoas jurídicas de direito privado ou às firmas individuais, o lugar da sua sede, ou, em relação aos atos ou fatos que derem origem à obrigação, o de cada estabelecimento;
III - quanto às pessoas jurídicas de direito público, qualquer de suas repartições no território da entidade tributante.
§ 1º Quando não couber a aplicação das regras fixadas em qualquer dos incisos dêste artigo, considerar-se-á como domicílio tributário do contribuinte ou responsável o lugar da situação dos bens ou da ocorrência dos atos ou fatos que deram origem à obrigação.
§ 2º A autoridade administrativa pode recusar o domicílio eleito, quando impossibilite ou dificulte a arrecadação ou a fiscalização do tributo, aplicando-se então a regra do parágrafo anterior.
Art. 128. Sem prejuízo do disposto neste capítulo, a lei pode atribuir de modo expresso a responsabilidade pelo crédito tributário a terceira pessoa, vinculada ao fato gerador da respectiva obrigação, excluindo a responsabilidade do contribuinte ou atribuindo-a a êste em caráter supletivo do cumprimento total ou parcial da referida obrigação.
Art. 129. O disposto nesta Seção aplica-se por igual aos créditos tributários definitivamente constituídos ou em curso de constituição à data dos atos nela referidos, e aos constituídos posteriormente aos mesmos atos, desde que relativos a obrigações tributárias surgidas até a referida data.
Art. 130. Os créditos tributários relativos a impostos cujo fato gerador seja a propriedade, o domínio útil ou a posse de bens imóveis, e bem assim os relativos a taxas pela prestação de serviços referentes a tais bens, ou a contribuições de melhoria, sub-rogam-se na pessoa dos respectivos adquirentes, salvo quando conste do título a prova de sua quitação.
Parágrafo único. No caso de arrematação em hasta pública, a sub-rogação ocorre sôbre o respectivo preço.
Art. 131. São pessoalmente responsáveis:
I - o adquirente ou remitente, pelos tributos relativos aos bens adquiridos ou remidos; (Redação dada pelo Decreto Lei nº 28, de 1966)
II - o sucessor a qualquer título e o cônjuge meeiro, pelos tributos devidos pelo de cujus até a data da partilha ou adjudicação, limitada esta responsabilidade ao montante do quinhão do legado ou da meação;
III - o espólio, pelos tributos devidos pelo de cujus até a data da abertura da sucessão."

## Leitura aplicada no EJC
- **Contribuinte × responsável (art. 121 § único):** responsável EXIGE "disposição expressa de lei" — na substituição tributária do ICMS, a designação do responsável é da lei estadual [VERIFICAR LEI ESTADUAL MG] (arts. 6º-7º LC 87 — não capturados nesta consulta).
- **Convenções particulares (art. 123):** "por conta do destinatário"/"CIF com imposto embutido" não mudam o sujeito passivo perante a Fazenda — reversível apenas entre particulares.
- **Solidariedade (art. 124 + 125):** interesse comum OU designação legal; SEM benefício de ordem (cobrar qualquer solidário integralmente); pagamento por um aproveita aos demais; isenção outorgada pessoalmente a um deles não exonera os outros quanto ao saldo (art. 125 II); interrupção da prescrição contra um atinge os demais — pontos-chave em autuações contra sócios/estabelecimentos.
- **Capacidade tributária (art. 126):** filial não registrada/obra/filial de fato PODE ser sujeito passivo ("unidade econômica ou profissional").
- **Domicílio (art. 127 § 2º):** recusa do domicílio eleito exige impossibilidade/dificuldade de arrecadação/fiscalização — base para impugnar intimações em endereço "fixado por presunção".
- **Responsabilidade (art. 128):** atribuição a terceiro exige LEI EXPRESSA e vínculo com o fato gerador — autuação de "responsável" sem previsão expressa é nula quanto à imputação.
- **Sucessores (arts. 129-131):** limitações ao quinhão/meação (131 II) e prova de quitação no título (130) — verificar caso concreto; arts. 132-135 pendentes de captura.`,
    'Decreto-Lei 5.172/1966 (Código Tributário Nacional)',
    URL_CTN,
    ['arts. 119-121', 'arts. 122-123', 'arts. 124-125', 'art. 126', 'art. 127', 'arts. 128-131'],
  ),

  // 9 — Ponte MG (REVISAO_HUMANA, C)
  {
    slug: 'ponte-mg-legislacao-tributaria-estadual',
    titulo: 'Ponte de verificação — Legislação tributária ESTADUAL de Minas Gerais (mapa honesto: o que FALTA capturar e onde verificar)',
    tipoDocumento: 'CHECKLIST',
    area: 'tributario',
    subarea: null,
    assunto: 'Verificação futura no portal ALMG/SEFAZ-MG — nada citado como verificado',
    prioridade: 'P3',
    lote: 'LOTE-023',
    conteudo: `# PONTE EJC — LEGISLAÇÃO TRIBUTÁRIA ESTADUAL DE MG (REVISÃO HUMANA OBRIGATÓRIA)

**Status: REVISAO_HUMANA — confiabilidade C.** Este documento NÃO cita nenhum número de lei/artigo estadual como verificado. Nesta consulta (2026-08-30) os portais MG (almg.gov.br, mg.gov.br, iof.mg.gov.br, sefaz.mg.gov.br, tjmg.jus.br) estiveram BLOQUEADOS para captura automatizada. O EJC registra o MAPA do que deve ser verificado, NUNCA o conteúdo presumido.

## O que a base federal capturada EXIGE que exista na lei estadual (âncoras LITERAIS da LC 87/1996)
1. **Incidência interna (LC 87 art. 2º):** o art. 2º é o piso — a operacionalização interna depende da lei estadual do ICMS de MG [VERIFICAR LEI ESTADUAL MG].
2. **MVA (LC 87 art. 8º § 4º):** "devendo os critérios para sua fixação ser previstos em lei" — verificar onde MG fixa as margens e os CRITÉRIOS do levantamento [VERIFICAR LEI ESTADUAL MG].
3. **Preço sugerido como base (art. 8º § 3º):** "poderá a lei estabelecer" — verificar se MG adotou [VERIFICAR].
4. **Período de apuração e prazo de pagamento (art. 24 caput e II):** "a legislação tributária estadual disporá" e "prazo fixado pelo Estado" [VERIFICAR].
5. **Saldos credores (art. 25 §§ 1º-2º):** imputação/transferência "lei estadual poderá" [VERIFICAR].
6. **Crédito ampliado (art. 20 § 6º II):** "quando autorizado em lei estadual" [VERIFICAR].
7. **Responsável por substituição (CTN art. 121 § único II):** exige disposição EXPRESSA de lei — verificar a designação legal na lei estadual (arts. 6º-7º LC 87 não capturados nesta consulta).
8. **Benefícios fiscais (LC 24 arts. 1º-3º):** qualquer isenção/redução/crédito presumido de ICMS exige CONVÊNIO com decisão UNÂNIME (art. 2º § 2º) e publicação no DOU em 10 dias — verificar convênio específico e adesão de MG.
9. **Transparência (LC 87 art. 24-A, LC 190/2022):** MG DEVE publicar em portal próprio legislação aplicável, alíquotas interestadual/interna, benefícios e obrigações acessórias — o próprio estado é fonte primária.

## O que falta capturar (temas estaduais, SEM números — não verificados nesta rodada)
- Lei estadual do ICMS de MG (texto integral + alterações) — base da tributação interna, alíquotas, substituição tributária, obrigatórios acessórios.
- Lei do IPVA de MG (competência estadual — fatos, prazos, alienação).
- Lei do ITCD de MG (transmissão causa mortis/doação — bases, imunidades/isenções locais).
- Leis de taxas de MG e respectivas tabelas.
- Regulamento/consolidação da administração tributária estadual (processo administrativo fiscal: prazos, instâncias, recursos) — o fluxo-processo-administrativo-fiscal-estadual do LOTE-023 registra SOMENTE a estrutura comum, com prazos marcados [VERIFICAR LEI ESTADUAL MG].
- Jurisprudência estadual consolidada (órgãos julgadores administrativos e TJMG) — nenhuma decisão citada nesta rodada.

## URLs OFICIAIS para verificação futura (acesso humano recomendado)
- Assembleia Legislativa de MG (busca de legislação): https://www.almg.gov.br/consultar/legislacao/ — portal institucional: https://www.almg.gov.br/
- Governo de MG: https://www.mg.gov.br/
- SEFAZ-MG: https://www.sefaz.mg.gov.br/
- Imprensa Oficial MG (publicação das normas): https://www.iof.mg.gov.br/
- TJMG (jurisprudência): https://www.tjmg.jus.br/
- Re-captura dos arts. 3º, 6º-7º e 19 da LC 87/1996 e da LC 214/2025 no Planalto: https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp87.htm

## Regra do EJC
ENQUANTO a captura estadual não acontecer: respostas sobre MG operam com o PISO FEDERAL (LC 87, LC 24, CTN — confiabilidade A) + marcadores [VERIFICAR LEI ESTADUAL MG]. PROIBIDO citar alíquota, prazo, artigo ou lei estadual de MG sem captura verificada.`,
    metadados: { tipo: 'mapa de verificação', portais_bloqueados: ['almg.gov.br', 'mg.gov.br', 'iof.mg.gov.br', 'sefaz.mg.gov.br', 'tjmg.jus.br'], exigencia: 'nenhum número/artigo estadual citado como verificado', vigente: true },
    tags: ['tributario/geral', 'geral/metodologia'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'C',
    vigente: true,
    status: 'REVISAO_HUMANA',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'lc87-art2-competencia-icms', tipo: 'COMPLEMENTA', descricao: 'Âncoras federais que exigem lei estadual.' },
      { destinoSlug: 'lc24-convenios-icms', tipo: 'COMPLEMENTA', descricao: 'Convênios exigidos para benefícios de ICMS.' },
      { destinoSlug: 'fluxo-processo-administrativo-fiscal-estadual', tipo: 'COMPLEMENTA', descricao: 'Prazos estaduais marcados para verificação.' },
    ],
  },

  // 10 — Tese ST × interestadual × interna
  {
    slug: 'tese-st-interstadial-mg',
    titulo: 'Tese — ICMS: diagnóstico de operação interna × interestadual × substituição tributária, fundamentado SÓ na LC 87/1996 e no CTN capturados',
    tipoDocumento: 'TESE',
    area: 'tributario',
    subarea: 'icms-mg',
    assunto: 'Rota de fundamentação com base literal federal',
    prioridade: 'P1',
    lote: 'LOTE-023',
    conteudo: `## Tese
O enquadramento da operação define a tese de defesa/cumprimento: (1) **INTERNA** (mercadoria em MG: saída, alimentação/bebida) → art. 2º I LC 87; (2) **INTERESTADUAL** (transporte: art. 2º II; mercadoria/bem para consumidor final não contribuinte em outra UF: art. 12 XVI + art. 11 V b + art. 13 X + art. 20-A LC 87); (3) **IMPORTAÇÃO** (art. 2º § 1º I/II; momento art. 12 IX; base art. 13 V); (4) **SUBSTITUIÇÃO TRIBUTÁRIA** (base da fase futura = art. 8º II: valor próprio + seguro/frete/encargos + MVA; imposto = diferença, art. 8º § 5º; alternativa: preço a consumidor usual, art. 8º § 6º).

## Fundamentos literais (Planalto, consulta 2026-08-30)
- LC 87 art. 2º (incidência), 2º § 1º (importação), 2º § 2º (independe da natureza jurídica da operação).
- LC 87 art. 8º (base ST antecedentes/subseqüentes; §§ 1º-6º: MVA média ponderada com critérios EM LEI § 4º; diferença § 5º; preço usual § 6º).
- LC 87 arts. 11-12 (local; momento — incl. LC 190/2022 consumidor final e LC 204/2023 transferência entre estabelecimentos).
- LC 87 art. 13 (base geral; frete do remetente § 1º II b; IPI fora nas condições do § 2º; § 4º REVOGADO — consta).
- CTN arts. 113-118 (fato gerador definido em lei "necessária e suficiente"; interpretação abstrata), 121-124 (contribuinte × responsável; solidariedade).

## Requisitos e riscos
- **MVA sem critérios em lei:** o art. 8º § 4º exige critérios previstos EM LEI e média ponderada de preços coletados — MVA fixada sem esse amparo (ou sem demonstração do levantamento) é ponto central de impugnação [VERIFICAR LEI ESTADUAL MG].
- **Responsável sem previsão expressa:** CTN art. 121 § único II — a designação do substituto depende de disposição expressa (lei estadual; arts. 6º-7º LC 87 não capturados nesta consulta) [VERIFICAR].
- **Base a menor/a maior:** conferir as 3 parcelas do art. 8º II (a+b+c) e a alíquota "interna do Estado de destino" do § 5º; se houver preço final fixado por órgão público, a base é o preço (§ 2º).
- **Consumidor final (LC 190/2022):** crédito anterior deduzido APENAS do débito da UF de origem (art. 20-A) — dupla cobrança da diferença é erro típico de autuação.
- **Transferência intra-estadual/interestadual (LC 204/2023):** art. 12 I vigente + §§ 4º-5º (créditos por transferência com percentuais do art. 155 § 2º IV CF) — autuação que trata transferência como evasão sem verificar a opção do contribuinte (§ 5º) é impugnável.

## Probabilidade qualitativa
- Alta para teses puramente federais (base/MVA/momento/local); MÉDIA/dependente quando a tese exige alíquota, prazo ou designação estadual — [VERIFICAR LEI ESTADUAL MG] (portais MG bloqueados nesta consulta — doc ponte-mg-legislacao-tributaria-estadual). Sem estatística (EJC não inventa percentuais).`,
    tags: ['tributario/icms-mg'],
    fonte: EJC,
    urlFonte: URL_LC87,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'lc87-art2-competencia-icms', tipo: 'FUNDAMENTA', descricao: 'Incidência e importação.' },
      { destinoSlug: 'lc87-art8-11-12-base-calculo', tipo: 'FUNDAMENTA', descricao: 'Base ST, local e momento.' },
      { destinoSlug: 'lc87-art13-substituicao-tributaria', tipo: 'FUNDAMENTA', descricao: 'Base geral e frete.' },
      { destinoSlug: 'lc87-art20-21-creditos', tipo: 'COMPLEMENTA', descricao: 'Créditos e art. 20-A.' },
      { destinoSlug: 'ctn-arts119-131-sujeicao-passiva-responsabilidade', tipo: 'FUNDAMENTA', descricao: 'Responsável exige lei expressa.' },
      { destinoSlug: 'argumentacao-bilateral-icms-st', tipo: 'COMPLEMENTA', descricao: 'Controvérsias detalhadas.' },
    ],
  },

  // 11 — Peça de impugnação de auto de infração estadual
  {
    slug: 'peca-impugnacao-auto-infracao-estadual',
    titulo: 'Peça — Impugnação a auto de infração do ICMS (defesa administrativa estadual, variáveis {{ }} e marcadores [VERIFICAR LEI ESTADUAL MG])',
    tipoDocumento: 'PECA',
    area: 'tributario',
    subarea: 'defesa-administrativa-mg',
    assunto: 'Peça-modelo com {{VARIÁVEIS}} — nada estadual afirmado como verificado',
    prioridade: 'P1',
    lote: 'LOTE-023',
    conteudo: `# IMPUGNAÇÃO A AUTO DE INFRAÇÃO — ICMS (MODELO EJC, DEFESA ADMINISTRATIVA ESTADUAL)

**Anti-invenção:** preencher TODAS as {{VARIÁVEIS}} com dados reais do processo. Os pontos dependentes da legislação estadual (prazo, órgão, forma de julgamento, atualização) estão marcados [VERIFICAR LEI ESTADUAL MG] — portais MG bloqueados na consulta de 2026-08-30 (doc ponte-mg-legislacao-tributaria-estadual).

---
{{AUTORIDADE_JULGADORA}} [VERIFICAR LEI ESTADUAL MG — órgão/autoridade de 1ª instância competente]
Processo Administrativo Fiscal nº {{NUM_PROCESSO_ADMIN}}
Auto de Infração nº {{NUM_AUTO_INFRACAO}}, notificado em {{DATA_NOTIFICACAO}}
Autuado(a): {{NOME_AUTUADO}}, {{CNPJ_CPF}}, estabelecimento em {{ENDERECO_ESTABELECIMENTO}}, {{MUNICIPIO}}/MG
Por seu representante legal (procuração anexa — {{OAB}}), vem apresentar IMPUGNAÇÃO aos seguintes termos do lançamento.

## I — TEMPESTIVIDADE
A impugnação é apresentada dentro do prazo de {{PRAZO_DEFESA_LEI_ESTADUAL}} [VERIFICAR LEI ESTADUAL MG — prazo e contagem da defesa administrativa], contado de {{DATA_NOTIFICACAO}}.

## II — SÍNTESE DO LANÇAMENTO
Período de apuração: {{PERIODO_FATO_GERADOR}}. Fisco imputa {{DESCRICAO_DO_ELENCO_LANCADO}} ({{VALOR_TOTAL_AUTUADO}}), com juros/atualização de {{CRITERIO_ATUALIZACAO}} [VERIFICAR LEI ESTADUAL MG — índice e termo inicial].

## III — PRELIMINARES
1. **Competência do órgão autuador:** {{CIRCUNSTANCIA}} (ponte: tese-ai-competencia-orgao-autuador da base).
2. **Nulidade formal:** ausência/falta de clareza de {{ELEMENTOS_FALTANTES}} — o lançamento deve descrever o fato gerador concreto (CTN art. 114: "situação definida em lei como necessária e suficiente").
3. **Prescrição/decadência:** lançamento após 5 anos do fato gerador/da notificação (CTN art. 173 I; art. 174 — docs ctn-decadencia-prescricao-tributaria e prazos da base): datas: fato gerador {{DATA_FATO_GERADOR}}, lançamento/notificação {{DATA_LANCAMENTO}}.

## IV — MÉRITO (selecionar os que couberem)
4. **Não incidência/exclusão do fato gerador:** a operação {{DESCRICAO_OPERACAO}} não se amolda ao art. 2º da LC 87/1996 {{MOTIVO: ex. destinatário/consumidor final com provas; operação desonerada por convênio — anexar CONVÊNIO (LC 24 arts. 1º-3º, decisão unânime) e sua publicação no DOU}}.
5. **Base de cálculo (LC 87 art. 13):** o valor da operação foi {{VALOR_CORRETO}}; o frete foi contratado por conta do DESTINATÁRIO (fora do art. 13 § 1º II b); o IPI não integra (art. 13 § 2º — operação entre contribuintes para industrialização/comercialização).
6. **MVA/base da substituição (LC 87 art. 8º):** a MVA aplicada não observou o § 4º (critérios não previstos em lei / média ponderada não demonstrada) [VERIFICAR LEI ESTADUAL MG — onde os critérios estão fixados]; conferir as 3 parcelas do art. 8º II e a alíquota interna do destino (§ 5º); se fixado preço final por órgão público, a base é o preço (§ 2º).
7. **Momento/local do fato gerador (LC 87 arts. 11-12):** o fato gerador ocorreu em {{UF_MOMENTO}} (art. 12 {{INCISO}}); o local da prestação é {{LOCAL}} (art. 11) — competência imputada a MG não se verifica.
8. **Créditos indevidamente glosados:** os créditos de {{DESCRICAO_DOCUMENTOS}} são idôneos (LC 87 art. 23 caput); não incidem nas vedações (art. 20 §§ 1º e 3º) porque {{MOTIVO}}; a saída posterior é tributada; em caso de estorno, aplicável o art. 21 § 3º (utilização futura com a mesma mercadoria).
9. **Responsabilidade sem previsão expressa (CTN art. 121 § único II):** a imputação ao impugnante como RESPONSÁVEL não tem amparo em disposição expressa [VERIFICAR LEI ESTADUAL MG]; não há solidariedade do art. 124 CTN {{MOTIVO: sem interesse comum/designação legal}}.
10. **Transferências entre estabelecimentos (LC 87 art. 12 I, red. LC 204/2023 + §§ 4º-5º):** {{CIRCUNSTANCIA}} — créditos transferidos nos percentuais do art. 155 § 2º IV CF ou opção do § 5º.

## V — PEDIDOS
a) acolhimento das preliminares (anulação/nulidade do lançamento);
b) no mérito, a EXCLUSÃO das exações de {{VALOR_EXCLUIR}}, com decisão de improcedência do lançamento;
c) cancelamento de multa {{FUNDAMENTO_ESTADUAL}} [VERIFICAR LEI ESTADUAL MG — natureza/graduação da multa e hipóteses de exclusão];
d) juros/monetização conforme índice legal aplicável [VERIFICAR LEI ESTADUAL MG];
e) produção de provas (documental anexa; testemunhal se necessário).

{{LOCAL}}, {{DATA}}.
{{NOME_REPRESENTANTE}} — OAB/{{UF}} {{NUM_OAB}}

## CHECKLIST EJC (antes do protocolo)
- [ ] Prazo estadual de defesa confirmado e provado (AR/protocolo da notificação) [VERIFICAR LEI ESTADUAL MG].
- [ ] Cópias: AI completo, livros/DANFEs dos períodos, convênios alegados com DOU.
- [ ] Demonstrativo da base recalculada (art. 13) e da MVA recolhida a menor/a maior (art. 8º).
- [ ] Créditos glosados com documentos idôneos listados (art. 23).
- [ ] Datas de prescrição/decadência conferidas com os docs da base (CTN 173/174).
- [ ] Nada citado de lei estadual MG sem anexar o texto verbatim capturado.`,
    metadados: { variaveis: ['NUM_AUTO_INFRACAO', 'DATA_NOTIFICACAO', 'PRAZO_DEFESA_LEI_ESTADUAL', 'ORGAO_JULGADOR', 'PERIODO_FATO_GERADOR', 'VALOR_TOTAL_AUTUADO', 'DATA_FATO_GERADOR', 'DATA_LANCAMENTO', 'VALOR_EXCLUIR', 'DESCRICAO_OPERACAO', 'MVA/FUNDAMENTO_ESTADUAL'], marcadores: ['VERIFICAR LEI ESTADUAL MG'] },
    tags: ['tributario/defesa-administrativa-mg', 'tributario/icms-mg'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'checklist-defesa-administrativa-fiscal-mg', tipo: 'COMPLEMENTA', descricao: 'Checklist operacional da defesa.' },
      { destinoSlug: 'fluxo-processo-administrativo-fiscal-estadual', tipo: 'COMPLEMENTA', descricao: 'Posição da impugnação no fluxo.' },
      { destinoSlug: 'peca-defesa-administrativa-ambiental', tipo: 'CONEXO_TEMATICO', descricao: 'Estrutura análoga de defesa administrativa (âmbito ambiental).' },
      { destinoSlug: 'tese-ai-nulidade-formal', tipo: 'CONEXO_TEMATICO', descricao: 'Preliminar de nulidade formal.' },
    ],
  },

  // 12 — Checklist defesa administrativa fiscal MG
  {
    slug: 'checklist-defesa-administrativa-fiscal-mg',
    titulo: 'Checklist — Defesa administrativa fiscal estadual (ICMS/MG): 15 pontos com avisos de verificação da lei estadual',
    tipoDocumento: 'CHECKLIST',
    area: 'tributario',
    subarea: 'defesa-administrativa-mg',
    assunto: 'Verificação passo a passo antes e durante a defesa',
    prioridade: 'P2',
    lote: 'LOTE-023',
    conteudo: `# CHECKLIST EJC — DEFESA ADMINISTRATIVA FISCAL ESTADUAL (ICMS/MG)
**Regra:** itens federais fundamentáveis nos docs LITERAIS da base; itens estaduais marcados [VERIFICAR LEI ESTADUAL MG].

- [ ] **1. Notificação e prazo:** data de ciência comprovada; prazo de impugnação [VERIFICAR LEI ESTADUAL MG] (nada presumir).
- [ ] **2. Competência do órgão autuador:** vínculo do autuante com o fato (ponte: tese-ai-competencia-orgao-autuador).
- [ ] **3. Elementos do lançamento:** descrição concreta do fato gerador (CTN art. 114 — "necessária e suficiente"); exibição dos livros/documentos aproveitados.
- [ ] **4. Decadência/prescrição:** fato gerador + notificação do lançamento dentro de 5 anos (CTN art. 173 I; cobrança em 5 — art. 174; docs da base LOTE-004).
- [ ] **5. Sujeição passiva:** contribuinte (relação pessoal e direta — CTN 121 § único I) × responsável (disposição EXPRESSA de lei — 121 § único II); solidariedade só nos termos dos arts. 124-125 CTN.
- [ ] **6. Incidência (LC 87 art. 2º):** a operação encaixa em I-V ou § 1º? Natureza jurídica da operação é irrelevante (§ 2º) — defesa por requalificação exige prova.
- [ ] **7. Momento e local (LC 87 arts. 11-12):** conferir inciso aplicável (saída, início da prestação, desembaraço, LC 190/2022 XIV-XVI); UF competente.
- [ ] **8. Base de cálculo (LC 87 art. 13):** valor da operação/preço; frete apenas do remetente (§ 1º II b); IPI fora nas condições do § 2º; importação com parcelas do inciso V.
- [ ] **9. Substituição tributária (LC 87 art. 8º):** 3 parcelas (a+b+c); MVA com critérios EM LEI e média ponderada (§ 4º) [VERIFICAR LEI ESTADUAL MG]; § 5º (alíquota interna do destino); § 2º preço fixado; § 6º preço usual.
- [ ] **10. Créditos:** idoneidade e escrituração (art. 23); vedações do art. 20 §§ 1º/3º; crédito GUARDADO (art. 21 § 3º); 5 anos da emissão do documento (art. 23 § único — doc prazo-credito-icms-5-anos); ativo permanente 1/48 (art. 20 § 5º).
- [ ] **11. Benefícios/isenções:** convênio LC 24 com UNANIMIDADE (art. 2º § 2º) + DOU em 10 dias (§ 3º) + limitação por UF (art. 3º); deliberação que afasta vedação de crédito (LC 87 art. 20 § 4º).
- [ ] **12. Convenções particulares (CTN art. 123):** cláusulas "imposto por conta do destinatário" não modificam o sujeito passivo — tanto para atacar quanto para defender.
- [ ] **13. Estabelecimentos (LC 87 art. 11 § 3º):** autonomia (II-III) e responsabilidade comum pelo crédito (IV); transferências LC 204/2023 (art. 12 I + §§ 4º-5º).
- [ ] **14. Multas/juros/atualização:** fundamentação e graduação [VERIFICAR LEI ESTADUAL MG]; natureza da infração (acessória convertida em penalidade — CTN art. 113 § 3º).
- [ ] **15. Documentos e estratégia:** relação de anexos; peça-modelo (peca-impugnacao-auto-infracao-estadual); fluxo e instâncias [VERIFICAR LEI ESTADUAL MG — doc fluxo-processo-administrativo-fiscal-estadual].

**AVISO EJC:** validar à luz do caso concreto e do expediente administrativo estadual; nada estadual citado como verbatim nesta rodada (portais MG bloqueados em 2026-08-30).`,
    metadados: { pontos: 15, tipo: 'checklist operacional', avisos: 'itens estaduais marcados [VERIFICAR LEI ESTADUAL MG]' },
    tags: ['tributario/defesa-administrativa-mg'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'peca-impugnacao-auto-infracao-estadual', tipo: 'COMPLEMENTA', descricao: 'Peça correspondente.' },
      { destinoSlug: 'lc87-art20-21-creditos', tipo: 'FUNDAMENTA', descricao: 'Créditos e estornos.' },
      { destinoSlug: 'ctn-decadencia-prescricao-tributaria', tipo: 'COMPLEMENTA', descricao: 'Decadência/prescrição (LOTE-004).' },
    ],
  },

  // 13 — Fluxo processo administrativo fiscal estadual
  {
    slug: 'fluxo-processo-administrativo-fiscal-estadual',
    titulo: 'Fluxo — Processo administrativo fiscal ESTADUAL (ICMS): da notificação do lançamento à decisão final (estrutura comum; prazos MG dependem da lei estadual — REVISAO_HUMANA)',
    tipoDocumento: 'FLUXO',
    area: 'tributario',
    subarea: 'defesa-administrativa-mg',
    assunto: 'Mapa evento → prazo → providência → risco',
    prioridade: 'P2',
    lote: 'LOTE-023',
    conteudo: `# FLUXO EJC — PROCESSO ADMINISTRATIVO FISCAL ESTADUAL (ICMS)

**AVISO HONESTO (REVISAO_HUMANA):** a estrutura abaixo é a COMUM aos processos administrativos fiscais estaduais, fundamentada nos textos LITERAIS capturados (LC 87, LC 24, CTN). PRAZOS, instâncias e ritos ESPECÍFICOS DE MG dependem da lei/processo administrativo fiscal estadual — portais MG bloqueados nesta consulta (2026-08-30) — [VERIFICAR LEI ESTADUAL MG].

## Etapa 1 — Lançamento e notificação
- Evento: auto de infração/notificação de lançamento (CTN arts. 142-146 — capítulo não capturado nesta consulta; registrar como pendência).
- Providência: datar a CIÊNCIA (AR/portal); conferir elementos do lançamento (CTN art. 114 — fato gerador "necessário e suficiente").
- Risco: perder a ciência documentada = prazo correndo [VERIFICAR LEI ESTADUAL MG].

## Etapa 2 — Diagnóstico técnico (antes do prazo)
- Providência: aplicar a regra SE-ENTÃO do lote (incidência/base/momento/local/ST); conferir prescrição/decadência (CTN 173/174 — docs da base) e créditos (LC 87 arts. 20-21/23).
- Risco: impugnar tudo sem priorizar preliminares (competência, nulidade, decadência).

## Etapa 3 — Impugnação/defesa (1ª instância)
- Providência: peça-modelo do lote com variáveis; juntar convênios (LC 24) com DOU; demonstrativo de recálculo da base/MVA.
- Prazo: [VERIFICAR LEI ESTADUAL MG].
- Efeito: interrompe a prescrição na forma do CTN art. 174 (registrado nos docs da base).

## Etapa 4 — Julgamento de 1ª instância
- Providência: acompanhar a pauta; verificar se a decisão julgou a TOTALIDADE do lançamento (coerência com a impugnação).
- Risco: decisão com omissão/contradição — instrumento de revisão [VERIFICAR LEI ESTADUAL MG].

## Etapa 5 — Recurso/segunda instância
- Providência: recurso administrativo {{PRAZO_RECURSO}} [VERIFICAR LEI ESTADUAL MG]; padronizar teses vencedoras de 1ª instância.
- Risco: efeito suspensivo automático ou não — [VERIFICAR LEI ESTADUAL MG].

## Etapa 6 — Decisão final e constituição definitiva do crédito
- Evento: decisão definitiva (ou decadência do direito de recorrer).
- Providência: conferir data de constituição definitiva (termo para cobrança — CTN art. 174, doc da base); avaliar anulação judicial.
- Risco: inscrição em dívida ativa e execução fiscal (ponte: LOTE-004 — LEF art. 2º § 5º, embargos, prescrição intercorrente).

## Etapa 7 — Judicialização (quando cabível)
- Providência: ação anulatória (crédito constituído) ou impugnação judicial complementar; avaliar depósito/garantia [VERIFICAR LEI ESTADUAL MG].
- Nota: este fluxo NÃO substitui as peças do processo estadual — apenas ordena as providências com base federal literal.`,
    metadados: { etapas: 7, aviso: 'prazos/instâncias MG dependem da lei estadual — REVISAO_HUMANA' },
    tags: ['tributario/defesa-administrativa-mg', 'geral/prazos'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'peca-impugnacao-auto-infracao-estadual', tipo: 'COMPLEMENTA', descricao: 'Peça da Etapa 3.' },
      { destinoSlug: 'ctn-decadencia-prescricao-tributaria', tipo: 'COMPLEMENTA', descricao: 'Termos de decadência/prescrição.' },
      { destinoSlug: 'ponte-mg-legislacao-tributaria-estadual', tipo: 'COMPLEMENTA', descricao: 'Prazos estaduais a verificar.' },
      { destinoSlug: 'tese-defesa-execucao-fiscal-prescricao-cda', tipo: 'CONEXO_TEMATICO', descricao: 'Fase seguinte: execução fiscal (LOTE-004).' },
    ],
  },

  // 14-15 — Prazos literais
  lei(
    'prazo-credito-icms-5-anos',
    'Prazo — Extinção do direito de utilizar crédito de ICMS: 5 anos da emissão do documento (LC 87/1996 art. 23, parágrafo único)',
    'icms-mg',
    'Contribuinte pretende utilizar crédito de ICMS de documento antigo',
    `## Situação
Estabelecimento pretende compensar crédito de ICMS relativo a documentos fiscais antigos.

## Prazo
**5 anos contados da data de EMISSÃO do documento — extinção do direito de utilizar o crédito (LC 87/1996, art. 23, parágrafo único)**

## Fundamento
Art. 23, parágrafo único: "O direito de utilizar o crédito extingue-se depois de decorridos cinco anos contados da data de emissão do documento." (texto literal do Planalto, consulta 2026-08-30)

## Termo inicial
DATA DE EMISSÃO do documento fiscal — NÃO é a escrituração, a apuração nem a ciência do contribuinte (LC 87 art. 23 caput condiciona o direito à idoneidade da documentação e à escrituração nos prazos, mas o § único conta da emissão).

## Forma de contagem
Prazo de 5 anos — contagem conforme regras gerais (dias contínuos; conferir termo inicial pelo documento com data visível).

## Distinções obrigatórias
- NÃO confundir com a decadência do LANÇAMENTO (CTN art. 173 I — 5 anos do fato gerador/da eleição) nem com a prescrição da COBRANÇA (CTN art. 174) — docs da base LOTE-004 (ctn-decadencia-prescricao-tributaria, prazo-decaencia-tributaria-5-anos, prazo-prescricao-tributaria-5-anos).
- Crédito de ativo permanente: apropriação 1/48 por mês e cancelamento do saldo no 48º mês (LC 87 art. 20 § 5º VII — doc lc87-art20-21-creditos).

## Observações
**AVISO EJC:** validar à luz do caso concreto; a escrituração fora dos prazos estaduais é outro ponto independente (art. 23 caput) [VERIFICAR LEI ESTADUAL MG].`,
    'Lei Complementar 87/1996 (Lei Kandir)',
    URL_LC87,
    ['art. 23, parágrafo único'],
    { tipoDocumento: 'PRAZO', metadados: { prazo: '5 anos (extinção do direito ao crédito)', fundamento: 'LC 87/1996 art. 23, parágrafo único', termoInicial: 'Data de emissão do documento fiscal', contagem: '5 anos contínuos' } },
  ),

  lei(
    'prazo-publicacao-resolucao-convenio-10-dias',
    'Prazo — Publicação da resolução de convênio (CONFAZ) no DOU: 10 dias da data final da reunião (LC 24/1975 art. 2º § 3º)',
    'icms-mg',
    'Verificação da validade/publicação de convênio de ICMS (isenção, redução, crédito presumido)',
    `## Situação
Verificação da existência e publicação de resolução de convênio celebrado entre Estados e DF (benefício de ICMS — LC 24 arts. 1º e 3º).

## Prazo
**10 dias contados da DATA FINAL DA REUNIÃO — publicação no Diário Oficial da União (LC 24/1975, art. 2º § 3º)**

## Fundamento
Art. 2º § 3º: "Dentro de 10 (dez) dias, contados da data final da reunião a que se refere este artigo, a resolução nela adotada será publicada no Diário Oficial da União." (texto literal do Planalto, consulta 2026-08-30)

## Termo inicial
Data FINAL da reunião do convênio (não a assinatura individual nem a adesão de cada UF).

## Forma de contagem
Dias corridos (prazo legal em dias — contagem conforme regras gerais).

## Uso prático no EJC
- Benefício de ICMS exige: convênio + UNANIMIDADE (art. 2º § 2º) + publicação no DOU (§ 3º) + aplicabilidade à MG se a cláusula for limitada (art. 3º).
- Em defesas, anexar a resolução PUBLICADA (e não apenas o protocolo do convênio).

## Observações
**AVISO EJC:** o portal registra "(Vide Lei Complementar nº 214, de 2025)" nos arts. 1º-3º — efeitos da LC 214/2025 NÃO capturados nesta consulta (re-captura recomendada).`,
    'Lei Complementar 24/1975',
    URL_LC24,
    ['art. 2º § 3º'],
    { tipoDocumento: 'PRAZO', metadados: { prazo: '10 dias (publicação da resolução no DOU)', fundamento: 'LC 24/1975 art. 2º § 3º', termoInicial: 'Data final da reunião do convênio', contagem: 'Dias corridos' } },
  ),

  // 16 — Triagem
  {
    slug: 'triagem-fiscal-estadual',
    titulo: 'Triagem — Casos tributários estaduais (ICMS/MG): 12 perguntas de classificação e rota',
    tipoDocumento: 'TRIAGEM',
    area: 'tributario',
    subarea: 'defesa-administrativa-mg',
    assunto: 'Roteiro de entrevista e classificação',
    prioridade: 'P2',
    lote: 'LOTE-023',
    conteudo: `# TRIAGEM EJC — TRIBUTÁRIO ESTADUAL (ICMS/MG)
**Regra:** com base federal LITERAL (LC 87, LC 24, CTN); onde depender de lei estadual, marcar [VERIFICAR LEI ESTADUAL MG] — portais MG bloqueados na consulta (2026-08-30).

1. **O que aconteceu?** (autuação/lançamento; glosa de créditos; cobrança de diferença de substituição tributária; indeferimento de benefício; orientação preventiva).
2. **Há notificação formal? Data de ciência?** (define prazo de defesa [VERIFICAR LEI ESTADUAL MG] e prescrição/decadência — CTN 173/174).
3. **Qual a operação imputada?** (mercadoria — LC 87 art. 2º I; transporte — II; comunicação — III; importação — § 1º I/II; transferência entre estabelecimentos — art. 12 I, red. LC 204/2023).
4. **Origem/destino:** interna (MG→MG) ou interestadual/consumidor final em outra UF (LC 190/2022 — art. 12 XVI, 11 V, 13 X, 20-A)?
5. **Há substituição tributária?** (quem é o substituto; MVA aplicada; há prova dos critérios do art. 8º § 4º [VERIFICAR LEI ESTADUAL MG]?).
6. **Base de cálculo usada pelo fisco:** valor da operação? frete incluído? IPI incluído? (LC 87 art. 13 §§ 1º-2º).
7. **Há créditos glosados ou estornos exigidos?** (documentos idôneos? art. 23; crédito guardado art. 21 § 3º; prazo de 5 anos da emissão — art. 23 § único).
8. **O sujeito passivo imputado é contribuinte ou responsável?** (CTN art. 121 § único — responsável exige disposição expressa [VERIFICAR LEI ESTADUAL MG]).
9. **Há benefício/isenção discutido?** (convênio LC 24 com unanimidade e DOU em 10 dias? MG incluída no art. 3º?).
10. **Datas-chave:** fato gerador, lançamento/notificação, constituição definitiva (decadência/prescrição — docs da base).
11. **Fase atual:** administrativa (qual instância [VERIFICAR LEI ESTADUAL MG]) ou judicial (execução fiscal — ponte LOTE-004; CDA; garantia)?
12. **Documentos disponíveis:** AI, livros fiscais, DANFEs/conhecimentos, convênios publicados, procuração. (Faltantes → listar.)`,
    tags: ['tributario/defesa-administrativa-mg', 'geral/metodologia'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'peca-impugnacao-auto-infracao-estadual', tipo: 'COMPLEMENTA', descricao: 'Rota para a peça.' },
      { destinoSlug: 'peca-embargos-execucao-fiscal-modelo', tipo: 'CONEXO_TEMATICO', descricao: 'Rota para a fase judicial: embargos (LOTE-004).' },
    ],
  },

  // 17 — Argumentação bilateral
  {
    slug: 'argumentacao-bilateral-icms-st',
    titulo: 'Argumentação — ICMS/substituição tributária: 4 controvérsias sob os dois lados (base literal federal)',
    tipoDocumento: 'ARGUMENTACAO',
    area: 'tributario',
    subarea: 'icms-mg',
    assunto: 'Controvérsias: fato gerador, MVA, crédito indevido, prescrição do crédito',
    prioridade: 'P2',
    lote: 'LOTE-023',
    conteudo: `# ARGUMENTAÇÃO BILATERAL — ICMS E SUBSTITUIÇÃO TRIBUTÁRIA (base: LC 87/1996, LC 24/1975, CTN — Planalto 2026-08-30)

## Controvérsia 1 — Fato gerador nas transferências entre estabelecimentos do mesmo titular
- **Pelo fisco:** o art. 12 I (red. LC 204/2023) é "da saída de mercadoria de estabelecimento de contribuinte" SEM exceção; a redação anterior ("ainda que para outro estabelecimento do mesmo titular", com "(Vide ADC 49)") foi substituída — e os §§ 4º-5º do art. 12 regulam a transferência com asseguração de créditos/opção por tributação.
- **Pelo contribuinte:** os §§ 4º-5º do art. 12 criam regime específico (créditos transferidos nos percentuais do art. 155 § 2º IV CF ou opção pelo contribuinte) — autuação que tributa transferência SEM reconhecer a opção/asseguração viola a própria LC 87; o CTN art. 118 manda interpretar a definição legal abstraindo-se da validade jurídica dos atos, mas o fato gerador continua sendo a "situação definida em lei".
- **Ponto de decisão:** data da operação × vigência da LC 204/2023 (o portal marca "Vigência") + prova da opção (§ 5º).

## Controvérsia 2 — MVA e base da substituição (art. 8º II c e § 4º)
- **Pelo fisco:** a base soma as 3 parcelas (a+b+c); MVA fixada por autoridade com levantamento amostral é válida quando os CRITÉRIOS estão em lei (§ 4º); alternativa do § 6º (preço a consumidor usual).
- **Pelo contribuinte:** o § 4º EXIGE "critérios para sua fixação ser previstos em lei" e média ponderada dos preços coletados — MVA majorada sem demonstração do levantamento (ou com base em mero ato infralegal sem critérios legais) afronta o art. 8º § 4º; § 2º (preço fixado por órgão público) e § 3º (preço sugerido — só se a LEI adotar) delimitam.
- **Ponto de decisão:** exigir a norma que fixa os critérios [VERIFICAR LEI ESTADUAL MG] e a memória de cálculo; conferir alíquota INTERNA do destino no § 5º.

## Controvérsia 3 — Créditos "indevidos" e estornos (arts. 20-21)
- **Pelo fisco:** vedação do art. 20 §§ 1º/3º (entradas isentas/não tributadas ou alheias à atividade); estorno obrigatório do art. 21 I-IV (inclusive perecimento/extravio IV).
- **Pelo contribuinte:** crédito é regra (art. 20 caput — inclusive uso/consumo e ativo permanente); a vedação exige PROVA da isenção/não tributação da saída FUTURA; o art. 21 § 3º assegura a UTILIZAÇÃO POSTERIOR dos créditos não creditados/estornados em operação tributada com a mesma mercadoria; art. 21 § 2º — não se estornam créditos vinculados a exportação (red. LC 120/2005); ativo permanente segue o regime 1/48 (art. 20 § 5º), não estorno integral.
- **Ponto de decisão:** data da saída isenta × previsibilidade (art. 21 I exige "imprevisível na data da entrada"); idoneidade documental (art. 23).

## Controvérsia 4 — Prescrição/extinção do crédito e da cobrança (art. 23 § único × CTN 173/174)
- **Pelo fisco:** o direito de UTILIZAR o crédito extingue-se em 5 anos da EMISSÃO do documento (art. 23 § único) — glosa de créditos antigos é definitiva.
- **Pelo contribuinte:** o prazo do art. 23 § único atinge a UTILIZAÇÃO (compensação com débito próprio), não cria tributo devido; decadência do LANÇAMENTO é do CTN art. 173 I (5 anos) e a COBRANÇA prescreve em 5 (art. 174 — com interrupções/suspensões registradas nos docs da base LOTE-004); autuações que glosam crédito cuja operação de saída ainda é tributada e dentro do art. 21 § 3º permanecem contestáveis.
- **Ponto de decisão:** separar as três contagens (crédito — LC 87 23 § único; lançamento — CTN 173; cobrança — CTN 174) pelas datas objetivas.

**Limitação honesta:** teses dependentes de lei estadual MG (alíquotas, prazos de defesa, designação do responsável) NÃO foram fundamentadas nesta rodada (portais bloqueados) — [VERIFICAR LEI ESTADUAL MG].`,
    tags: ['tributario/icms-mg'],
    fonte: EJC,
    urlFonte: URL_LC87,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'lc87-art8-11-12-base-calculo', tipo: 'FUNDAMENTA', descricao: 'MVA e mecânica da ST.' },
      { destinoSlug: 'lc87-art20-21-creditos', tipo: 'FUNDAMENTA', descricao: 'Créditos e estornos.' },
      { destinoSlug: 'prazo-credito-icms-5-anos', tipo: 'COMPLEMENTA', descricao: 'Prazo do art. 23 § único.' },
      { destinoSlug: 'ctn-decadencia-prescricao-tributaria', tipo: 'COMPLEMENTA', descricao: 'CTN 173/174 (LOTE-004).' },
    ],
  },

  // 18 — Doutrina (sem autores/obras inventados)
  {
    slug: 'doutrina-icms-nao-cumulatividade',
    titulo: 'Doutrina — Não-cumulatividade do ICMS e substituição tributária: mecânica a partir dos textos capturados (sem autores citados)',
    tipoDocumento: 'DOUTRINA',
    area: 'tributario',
    subarea: 'icms-mg',
    assunto: 'Conceito técnico baseado nos textos literais capturados',
    prioridade: 'P2',
    lote: 'LOTE-023',
    conteudo: `# DOUTRINA EJC — NÃO-CUMULATIVIDADE DO ICMS E SUBSTITUIÇÃO TRIBUTÁRIA
**Método:** este documento NÃO cita autores/obras (nenhuma fonte doutrinária capturada nesta consulta). Deriva a mecânica EXCLUSIVAMENTE dos textos literais capturados no Planalto (2026-08-30).

## 1. Não-cumulatividade como mecanismo de compensação
- O art. 20 da LC 87 (referindo-se à "compensação a que se refere o artigo anterior" — art. 19, NÃO capturado nesta consulta, registrar como pendência) assegura crédito do imposto "anteriormente cobrado" na entrada de mercadoria — real ou simbólica — inclusive para uso/consumo e ATIVO PERMANENTE, e nos serviços de transporte interestadual/intermunicipal e comunicação.
- Efeito econômico: o imposto incide sobre o VALOR AGREGADO de cada etapa (débito da saída menos crédito da entrada) — derivável dos arts. 20 (creditar) e 24 (compensação até o montante dos créditos + saldo credor transportado).
- Limite interno: crédito é vedado quando a saída futura é isenta/não tributada (art. 20 §§ 1º/3º) — mas o § 3º do art. 21 preserva o crédito para uso futuro com a mesma mercadoria ("crédito guardado"), o que impede leituras de CONFISCO da vedação.

## 2. Substituição tributária como antecipação da não-cumulatividade
- O art. 8º II atribui ao substituto a base das operações SUBSEQÜENTES = valor próprio (a) + seguro/frete/encargos (b) + MVA (c); o § 5º define o imposto devido como a DIFERENÇA entre a aplicação da alíquota interna do destino sobre essa base e o imposto da operação própria.
- Leitura técnica: em vez de tributar etapa por etapa, recolhe-se ANTECIPADAMENTE o imposto do ciclo futuro sobre uma base presumida (valor + MVA). A presunção é a parte frágil: o § 4º impõe MVA por média ponderada de preços coletados com critérios EM LEI; o § 6º admite o preço a consumidor usual como base alternativa; o § 2º impõe o preço fixado por órgão público quando houver.
- Antecedentes (art. 8º § 1º): responsabilidade também existe para operações ANTECEDENTES/concomitantes — paga quando da entrada/recebimento, da saída subsequente (mesmo isenta) ou de evento que impossibilite o pagamento.

## 3. Base de cálculo: dentro e fora
- Integra (art. 13 § 1º): o MONTANTE DO PRÓPRIO IMPOSTO ("por dentro" — destaque é mera indicação de controle), seguros/juros/importâncias pagas-recebidas-debitadas e descontos condicionais, e o FRETE quando pelo próprio remetente ou por sua conta e ordem cobrado em separado.
- Não integra: o IPI nas operações entre contribuintes para industrialização/comercialização que configurem fato gerador de ambos (art. 13 § 2º); a partir de 1º/1/2027, o Imposto Seletivo INTEGRA (§ 1º III, LC 227/2026 — inversão do tratamento do IPI, monitorar).

## 4. Apuração como equilíbrio entre estabelecimentos
- O art. 24 define vencimento no fim do período de apuração e liquidação por compensação (créditos do período + saldo credor anterior); o art. 25 (red. LC 102/2000) manda apurar POR ESTABELECIMENTO compensando saldos entre estabelecimentos do mesmo titular no Estado — enquanto o art. 11 § 3º II-IV estabelece autonomia com responsabilidade comum pelo crédito.

## 5. Convênios como caixa de ressonância dos benefícios
- A LC 24 (arts. 1º-3º) canaliza isenções/reduções/créditos presumidos/qualquer incentivo para CONVÊNIOS com decisão UNÂNIME e publicação em 10 dias — economicamente, o benefício unilateral de um Estado desloca a base tributável dos demais; a unanimidade é o freio institucional (ver art. 20 § 4º da LC 87: vedação de crédito pode ser afastada por Deliberação dos Estados).`,
    tags: ['tributario/icms-mg', 'geral/metodologia'],
    fonte: EJC,
    urlFonte: URL_LC87,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'lc87-art20-21-creditos', tipo: 'FUNDAMENTA', descricao: 'Mecânica dos créditos.' },
      { destinoSlug: 'lc87-art8-11-12-base-calculo', tipo: 'FUNDAMENTA', descricao: 'Mecânica da ST.' },
      { destinoSlug: 'lc24-convenios-icms', tipo: 'FUNDAMENTA', descricao: 'Convênios e unanimidade.' },
    ],
  },

  // 19 — Regra SE-ENTÃO
  {
    slug: 'regra-se-entao-icms-mg',
    titulo: 'Regra SE-ENTÃO — ICMS (base federal literal): roteamento de operação para regime, base e pontos de verificação MG',
    tipoDocumento: 'REGRA_INTELIGENCIA',
    area: 'tributario',
    subarea: 'icms-mg',
    assunto: 'Inteligência processual/fiscal interpretável pelo EJC',
    prioridade: 'P2',
    lote: 'LOTE-023',
    conteudo: `# REGRAS SE-ENTÃO — ICMS (LC 87/1996, LC 24/1975, CTN — textos literais do Planalto, consulta 2026-08-30)
**Convenção:** onde a resposta exige lei estadual MG, a regra TERMINA em [VERIFICAR LEI ESTADUAL MG] — o EJC NÃO cita norma estadual não capturada.

1. SE operação INTERNA com mercadoria em MG (saída, fornecimento de alimentação/bebidas) ENTÃO incidência pelo art. 2º I da LC 87 + base = valor da operação (art. 13 I) + momento = saída (art. 12 I, red. LC 204/2023) + alíquota/obrigações [VERIFICAR LEI ESTADUAL MG].

2. SE prestação de TRANSPORTE interestadual/intermunicipal ENTÃO incidência pelo art. 2º II + local = onde tiver início a prestação (art. 11 II a) + momento = início da prestação (art. 12 V) + base = preço do serviço (art. 13 III) + alíquota [VERIFICAR LEI ESTADUAL MG].

3. SE entrada de mercadoria/bem IMPORTADOS do exterior (pessoa física ou jurídica, qualquer finalidade) ENTÃO incidência pelo art. 2º § 1º I (red. LC 114/2002) + momento = desembaraço aduaneiro (art. 12 IX; entrega antes do desembaraço — § 3º) + base = soma do art. 13 V (inclui II, IIPI e despesas aduaneiras; IPI fora se art. 13 § 2º).

4. SE operação interestadual para CONSUMIDOR FINAL não contribuinte em outra UF (LC 190/2022) ENTÃO momento = art. 12 XVI + diferença de alíquotas devida ao remetente (art. 11 V b e art. 13 § 3º) + crédito anterior deduzido APENAS do débito da UF de origem (art. 20-A) + exceção do § 7º do art. 11 (destino final em UF diferente) + alíquotas [VERIFICAR LEI ESTADUAL MG].

5. SE substituto tributário com operações SUBSEQÜENTES ENTÃO base = art. 8º II (a valor próprio + b seguro/frete/encargos + c MVA) + imposto = diferença do § 5º (alíquota interna do destino) + MVA com critérios EM LEI e média ponderada (§ 4º) [VERIFICAR LEI ESTADUAL MG] + alternativas: preço fixado (§ 2º), preço sugerido se a LEI adotar (§ 3º), preço a consumidor usual (§ 6º).

6. SE entrada/recebimento com RESPONSABILIDADE por operações ANTECEDENTES ENTÃO pagamento quando da entrada (art. 8º § 1º I, red. LC 114/2002), da saída subsequente ainda que isenta (II) ou de evento que impossibilite o pagamento (III) + designação do responsável EXIGE lei expressa (CTN art. 121 § único II) [VERIFICAR LEI ESTADUAL MG].

7. SE saída isenta/não tributada APÓS entrada com crédito ENTÃO avaliar estorno (art. 21 I-II) MAS: crédito guardado é reutilizável em operação tributada com a mesma mercadoria (art. 21 § 3º); exterior NÃO se estorna (art. 21 § 2º); vedação pode ser afastada por Deliberação dos Estados (art. 20 § 4º) — procurar convênio (LC 24).

8. SE crédito de ativo permanente ENTÃO apropriação 1/48 por mês com corte proporcional de saídas isentas e cancelamento no 48º mês (art. 20 § 5º I-VII, LC 102/2000 e LC 120/2005) + alienação antes de 4 anos corta o restante (§ 5º V).

9. SE documento fiscal com MAIS de 5 anos da EMISSÃO ENTÃO direito de UTILIZAR o crédito EXTINTO (art. 23 § único — doc prazo-credito-icms-5-anos) — distinguir da decadência do lançamento (CTN 173) e da prescrição da cobrança (CTN 174 — docs da base).

10. SE lançamento/notificação com MAIS de 5 anos do fato gerador (ou da eleição) ENTÃO decadência (CTN art. 173 I — docs da base LOTE-004); SE cobrança judicial após 5 anos da constituição SEM causa suspensiva/interruptiva ENTÃO prescrição (CTN art. 174).

11. SE benefício de ICMS (isenção/redução/crédito presumido/qualquer incentivo) ENTÃO EXIGIR convênio com decisão UNÂNIME (LC 24 art. 2º § 2º), publicação no DOU em 10 dias (§ 3º) e aplicabilidade a MG (art. 3º); resolução não publicada = benefício não demonstrado.

12. SE autuação imputa RESPONSÁVEL ou solidário ENTÃO conferir: disposição expressa de lei (CTN 121 § único II; 128), interesse comum/designação (124) e SEM benefício de ordem (124 § único) + efeitos do art. 125 (pagamento aproveita aos demais; interrupção de prescrição entre eles).

13. SE transferência de mercadoria entre estabelecimentos do MESMO titular ENTÃO art. 12 I (red. LC 204/2023) + § 4º (créditos assegurados por transferência nos percentuais do art. 155 § 2º IV CF) ou § 5º (opção por tributação com alíquotas internas/interestaduais) — verificar data e opção no caso concreto.`,
    tags: ['tributario/icms-mg', 'geral/metodologia'],
    fonte: EJC,
    urlFonte: URL_LC87,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'lc87-art2-competencia-icms', tipo: 'FUNDAMENTA', descricao: 'Incidência.' },
      { destinoSlug: 'lc87-art8-11-12-base-calculo', tipo: 'FUNDAMENTA', descricao: 'Base/local/momento.' },
      { destinoSlug: 'lc87-art20-21-creditos', tipo: 'FUNDAMENTA', descricao: 'Créditos.' },
      { destinoSlug: 'ctn-arts119-131-sujeicao-passiva-responsabilidade', tipo: 'FUNDAMENTA', descricao: 'Responsabilidade.' },
    ],
  },

  // 20 — Jurimetria vazia
  {
    slug: 'jurimetria-vazia-tributario-mg',
    titulo: 'Jurimetria — Tributário estadual MG (estrutura vazia — sem dados reais)',
    tipoDocumento: 'JURIMETRIA',
    area: 'tributario',
    subarea: 'icms-mg',
    assunto: 'Estrutura para dados futuros',
    prioridade: 'P3',
    lote: 'LOTE-023',
    conteudo: `# JURIMETRIA — TRIBUTÁRIO ESTADUAL (ICMS/MG)
**Status: SEM DADOS.** Nenhuma estatística real nesta consulta (2026-08-30) — o EJC NÃO inventa percentuais. Portais MG bloqueados nesta rodada; nenhuma decisão judicial/administrativa de MG foi capturada.

## Campos preparados
- tribunal/órgão julgador/classe/período/amostra/metodologia/fonte;
- indicadores futuros: taxa de provimento de impugnações de AI de ICMS por matéria (base de cálculo × MVA × crédito × prescrição); tempo médio do processo administrativo fiscal estadual por instância; frequência de glosa por inidoneidade documental; concentração por município/segmento (ST).

## Separação obrigatória: DADO ESTATÍSTICO REAL (com fonte) × ANÁLISE QUALITATIVA.
**Ponte:** quando houver dados, populá-los com fonte verificável e alterar o status; até lá, as teses da base operam sem probabilidade numérica.`,
    tags: ['tributario/icms-mg', 'geral/metodologia'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
  },
];
