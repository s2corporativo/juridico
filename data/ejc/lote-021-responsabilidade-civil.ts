// LOTE-021 — Responsabilidade civil — CC arts. 927-954 (P1, núcleo transversal)
// Textos LITERAIS extraídos do Planalto em 2026-08-30:
// https://www.planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm
//
// ANTI-INVENÇÃO desta rodada (constatações da consulta):
// - Art. 927 remete no texto oficial "(Vide ADI nº 7055)" e "(Vide ADI nº 6792)" — o EJC registra
//   as remissões COMO CONSTA, sem afirmar os desfechos dessas ADIs (não capturadas nesta consulta).
// - Súmula 227/STJ ("A pessoa jurídica pode sofrer dano moral"): enunciado confirmado verbatim
//   por snippet do arquivo oficial docs_internet/VerbetesSTJ_asc.txt (stj.jus.br) — captura direta
//   bloqueada por 403 → confiabilidade B honesta com nota de re-captura.
// - Jurimetria: SEM DADOS (o EJC não inventa percentuais).
import type { InputDocument } from '../../src/lib/ejc/types';

const D = '2026-08-30';
const PLANALTO = 'Presidência da República — Planalto';
const URL_CC = 'https://www.planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm';
const EJC = 'Elaboração EJC — conteúdo estrutural original';

function leiCc(
  slug: string, titulo: string, assunto: string, conteudo: string, artigos: string[],
  extra?: Partial<InputDocument>,
): InputDocument {
  return {
    slug, titulo, tipoDocumento: 'LEGISLACAO', area: 'civil', subarea: 'responsabilidade-civil',
    assunto, prioridade: 'P1', lote: 'LOTE-021',
    conteudo,
    metadados: { numero: 'Lei 10.406/2002 (Código Civil)', data_norma: '2002-01-11', orgao: 'Congresso Nacional', artigos_principais: artigos, vigente: true, confirmacao_texto: 'Extração literal do texto oficial do Planalto em 2026-08-30.' },
    tags: ['civil/responsabilidade-civil', 'geral/prazos'],
    fonte: PLANALTO,
    urlFonte: URL_CC,
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
  leiCc(
    'cc-art-927-obrigacao-reparar-objetiva',
    'CC art. 927 — Obrigação de reparar o dano; responsabilidade objetiva pelo risco da atividade (texto literal confirmado, com remissões ADI 7055/6792 como constam)',
    'Responsabilidade civil — princípio geral',
    `## Ficha da Norma
- **Norma:** Lei 10.406/2002 (Código Civil) — Título IX "Da Responsabilidade Civil".

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 927. Aquele que, por ato ilícito (arts. 186 e 187), causar dano a outrem, fica obrigado a repará-lo.
(Vide ADI nº 7055)
(Vide ADI nº 6792)
Parágrafo único. Haverá obrigação de reparar o dano, independentemente de culpa, nos casos especificados em lei, ou quando a atividade normalmente desenvolvida pelo autor do dano implicar, por sua natureza, risco para os direitos de outrem."

## NOTA HONESTA
As remissões "(Vide ADI nº 7055)" e "(Vide ADI nº 6792)" constam NO TEXTO OFICIAL — o EJC as registra como constam, SEM afirmar os desfechos dessas ações (não capturados nesta consulta).

## Leitura aplicada
- **Regime geral (caput):** responsabilidade SUBJETIVA — ato ilícito (CC 186: dolo/culpa; 187: abuso de direito) + dano + nexo causal → obrigação de reparar.
- **Exceção objetiva (§ único):** independentemente de culpa quando (a) a LEI especificar (ex.: CC 931/933, CDC 12/14, Lei 6.938 art. 14) OU (b) a atividade normalmente desenvolvida implicar RISCO para direitos de outrem (teoria do risco).

## Hipóteses de aplicação no EJC
- Diagnóstico do regime: subjetivo (provar culpa) × objetivo (risco/lei especial) — regra SE-ENTÃO deste lote.`,
    ['927'],
    {
      relacionamentos: [
        { destinoSlug: 'cdc-art-12-fato-produto-texto-literal', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Regime objetivo especial do consumidor.' },
        { destinoSlug: 'lei-6938-1981-pnma-responsabilidade-objetiva', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Responsabilidade objetiva ambiental.' },
        { destinoSlug: 'cc-art-206-prazos-especiais', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Prescrição da reparação civil (3 anos — § 3º V).' },
      ],
    },
  ),
  leiCc(
    'cc-arts-928-930-incapaz-estado-necessidade',
    'CC arts. 928-930 — Responsabilidade equitativa do incapaz e indenização/resso no estado de necessidade (texto literal confirmado)',
    'Responsabilidade civil — casos especiais',
    `## Ficha da Norma
- **Norma:** Lei 10.406/2002 (Código Civil).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 928. O incapaz responde pelos prejuízos que causar, se as pessoas por ele responsáveis não tiverem obrigação de fazê-lo ou não dispuserem de meios suficientes.
Parágrafo único. A indenização prevista neste artigo, que deverá ser eqüitativa, não terá lugar se privar do necessário o incapaz ou as pessoas que dele dependem.

Art. 929. Se a pessoa lesada, ou o dono da coisa, no caso do inciso II do art. 188, não forem culpados do perigo, assistir-lhes-á direito à indenização do prejuízo que sofreram.

Art. 930. No caso do inciso II do art. 188, se o perigo ocorrer por culpa de terceiro, contra este terá o autor do dano ação regressiva para haver a importância que tiver ressarcido ao lesado.
Parágrafo único. A mesma ação competirá contra aquele em defesa de quem se causou o dano (art. 188, inciso I)."

## Leitura aplicada
- **Incapaz (928):** responsabilidade SUBSIDIÁRIA e EQUITATIVA — só se os responsáveis não pagarem/não tiverem meios; nunca deixa o incapaz sem o necessário.
- **Estado de necessidade (929-930):** quem causou dano em estado de necessidade (CC 188 II) indeniza o inocente; regresso contra o terceiro culpado do perigo ou contra aquele em defesa de quem o dano se causou (188 I).

## Hipóteses de aplicação no EJC
- Casos com menor/incapaz causador de dano; destruição de coisa alheia para remoção de perigo iminente.`,
    ['928', '929', '930'],
  ),
  leiCc(
    'cc-art-931-responsabilidade-produto',
    'CC art. 931 — Empresários e empresas respondem independentemente de culpa pelos danos de produtos postos em circulação (texto literal confirmado)',
    'Responsabilidade civil — fato do produto (regime geral)',
    `## Ficha da Norma
- **Norma:** Lei 10.406/2002 (Código Civil).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 931. Ressalvados outros casos previstos em lei especial, os empresários individuais e as empresas respondem independentemente de culpa pelos danos causados pelos produtos postos em circulação."

## Leitura aplicada
- **Objetividade no regime geral:** produto posto em circulação com dano → reparação sem culpa.
- **"Ressalvados casos em lei especial":** o CDC (arts. 12-14 — na base) disciplina a relação de CONSUMO com mais detalhe (defesas taxativas, solidariedade da cadeia); o art. 931 alcança relações ENTRE EMPRESAS/e fora do CDC.
- Conexão com recall: CDC arts. 9-10 e Portaria MJSP 618/2019 (na base).

## Hipóteses de aplicação no EJC
- Dano por produto em relação entre empresas (B2B) — fundamento geral objetivo do CC 931.`,
    ['931'],
    {
      relacionamentos: [
        { destinoSlug: 'cdc-art-12-fato-produto-texto-literal', tipo: 'COMPLEMENTA', descricao: 'Regime especial de consumo do fato do produto.' },
        { destinoSlug: 'cdc-arts-9-10-periculosidade-recall-texto-literal', tipo: 'COMPLEMENTA', descricao: 'Recall e periculosidade conhecida.' },
      ],
    },
  ),
  leiCc(
    'cc-arts-932-934-fato-terceiros-regresso',
    'CC arts. 932-934 — Responsabilidade por fato de terceiros (rol I-V), objetividade (933) e regresso (934) (texto literal confirmado)',
    'Responsabilidade civil — fato de terceiros',
    `## Ficha da Norma
- **Norma:** Lei 10.406/2002 (Código Civil).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 932. São também responsáveis pela reparação civil:
I - os pais, pelos filhos menores que estiverem sob sua autoridade e em sua companhia;
II - o tutor e o curador, pelos pupilos e curatelados, que se acharem nas mesmas condições;
III - o empregador ou comitente, por seus empregados, serviçais e prepostos, no exercício do trabalho que lhes competir, ou em razão dele;
IV - os donos de hotéis, hospedarias, casas ou estabelecimentos onde se albergue por dinheiro, mesmo para fins de educação, pelos seus hóspedes, moradores e educandos;
V - os que gratuitamente houverem participado nos produtos do crime, até a concorrente quantia.

Art. 933. As pessoas indicadas nos incisos I a V do artigo antecedente, ainda que não haja culpa de sua parte, responderão pelos atos praticados pelos terceiros ali referidos.

Art. 934. Aquele que ressarcir o dano causado por outrem pode reaver o que houver pago daquele por quem pagou, salvo se o causador do dano for descendente seu, absoluta ou relativamente incapaz."

## Leitura aplicada
- **Rol do 932 (I-V):** pais (menores sob autoridade E companhia); tutor/curador; EMPREGADOR/comitente (no exercício do trabalho OU em razão dele — amplitude da conexão); hospedeiros; partícipes gratuitos do lucro do crime (limitado à quantia).
- **933:** objetividade — os responsáveis pagam MESMO SEM culpa própria.
- **934 (regresso):** quem pagou reavé de quem CAUSOU — EXCETO contra descendente incapaz (proteção familiar).

## Hipóteses de aplicação no EJC
- Acidente causado por empregado a serviço → vítima aciona o empregador (933) que regredirá (934).`,
    ['932', '933', '934'],
  ),
  leiCc(
    'cc-arts-935-938-independencia-criminal-casos',
    'CC arts. 935-938 — Independência da responsabilidade civil e criminal; animal; ruína de edifício; coisas lançadas (texto literal confirmado)',
    'Responsabilidade civil — independência e hipóteses objetivas',
    `## Ficha da Norma
- **Norma:** Lei 10.406/2002 (Código Civil).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 935. A responsabilidade civil é independente da criminal, não se podendo questionar mais sobre a existência do fato, ou sobre quem seja o seu autor, quando estas questões se acharem decididas no juízo criminal.

Art. 936. O dono, ou detentor, do animal ressarcirá o dano por este causado, se não provar culpa da vítima ou força maior.

Art. 937. O dono de edifício ou construção responde pelos danos que resultarem de sua ruína, se esta provier de falta de reparos, cuja necessidade fosse manifesta.

Art. 938. Aquele que habitar prédio, ou parte dele, responde pelo dano proveniente das coisas que dele caírem ou forem lançadas em lugar indevido."

## Leitura aplicada
- **935 (independência):** cível e criminal são independentes; sentença criminal sobre FATO E AUTORIA vincula a esfera cível (ex.: absolvição por inexistência do fato impede repetir a discussão; condenação criminal é título executivo — CPC art. 515 VI).
- **936 (animal):** presunção de responsabilidade do dono/detentor — exime-se provando culpa da vítima ou força maior.
- **937 (ruína):** responsabilidade do dono por falta de reparos manifestamente necessários.
- **938 (coisas caídas/lançadas):** responsabilidade do HABITADOR do prédio.

## Hipóteses de aplicação no EJC
- Suspensão da cível pendente decisão criminal (CPC art. 315 — caso concreto); ataques de animais; desabamentos; queda de objetos.`,
    ['935', '936', '937', '938'],
  ),
  leiCc(
    'cc-arts-939-941-cobranca-indevida-penas',
    'CC arts. 939-941 — Penas por cobrança antecipada indevida e por exigir dívida paga/inexata (texto literal confirmado)',
    'Responsabilidade civil — cobrança indevida',
    `## Ficha da Norma
- **Norma:** Lei 10.406/2002 (Código Civil).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 939. O credor que demandar o devedor antes de vencida a dívida, fora dos casos em que a lei o permita, ficará obrigado a esperar o tempo que faltava para o vencimento, a descontar os juros correspondentes, embora estipulados, e a pagar as custas em dobro.

Art. 940. Aquele que demandar por dívida já paga, no todo ou em parte, sem ressalvar as quantias recebidas ou pedir mais do que for devido, ficará obrigado a pagar ao devedor, no primeiro caso, o dobro do que houver cobrado e, no segundo, o equivalente do que dele exigir, salvo se houver prescrição.

Art. 941. As penas previstas nos arts. 939 e 940 não se aplicarão quando o autor desistir da ação antes de contestada a lide, salvo ao réu o direito de haver indenização por algum prejuízo que prove ter sofrido."

## Leitura aplicada
- **939 (antecipação indevida da demanda):** esperar o vencimento + descontar juros + custas em dobro.
- **940 (cobrança de dívida paga/inexata):** DOBRO do cobrado (dívida já paga sem ressalva) ou equivalente do excesso — sanção civil autônoma (conexa com CDC art. 42 p.ú. no consumo — na base).
- **941:** desistência antes da contestação afasta as penas (salvo prejuízo provado do réu).

## Hipóteses de aplicação no EJC
- Defesa em cobrança com pagamento já efetuado; contracusteio com pedido do dobro.`,
    ['939', '940', '941'],
    {
      relacionamentos: [
        { destinoSlug: 'cdc-arts-42-42-a-cobranca-debitos-indebito-dobro', tipo: 'COMPLEMENTA', descricao: 'Pena do dobro no regime do consumidor (CDC art. 42 p.ú.).' },
      ],
    },
  ),
  leiCc(
    'cc-arts-942-943-solidariedade-heranca',
    'CC arts. 942-943 — Solidariedade na reparação (autores, coautores e responsáveis do art. 932) e transmissão com a herança (texto literal confirmado)',
    'Responsabilidade civil — solidariedade e transmissão',
    `## Ficha da Norma
- **Norma:** Lei 10.406/2002 (Código Civil).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 942. Os bens do responsável pela ofensa ou violação do direito de outrem ficam sujeitos à reparação do dano causado; e, se a ofensa tiver mais de um autor, todos responderão solidariamente pela reparação.

Parágrafo único. São solidariamente responsáveis com os autores as pessoas designadas no art. 932.

Art. 943. O direito de exigir reparação e a obrigação de prestá-la transmitem-se com a herança."

## Leitura aplicada
- **942:** mais de um autor → SOLIDARIEDADE; os "responsáveis" do art. 932 (empregador, pais etc.) respondem SOLIDARIAMENTE com os autores (vítima pode cobrar de qualquer um o total).
- **943:** o DIREITO de exigir (crédito) e a OBRIGAÇÃO de reparar passam aos herdeiros.

## Hipóteses de aplicação no EJC
- Liticonsortismo passivo; continuidade da causa após o óbito de qualquer parte.`,
    ['942', '943'],
  ),
  leiCc(
    'cc-art-944-extensao-dano-reducao-equitativa',
    'CC art. 944 — A indenização mede-se pela extensão do dano; redução equitativa na desproporção culpa×dano (texto literal confirmado)',
    'Responsabilidade civil — medida da indenização',
    `## Ficha da Norma
- **Norma:** Lei 10.406/2002 (Código Civil).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 944. A indenização mede-se pela extensão do dano.
Parágrafo único. Se houver excessiva desproporção entre a gravidade da culpa e o dano, poderá o juiz reduzir, eqüitativamente, a indenização."

## Leitura aplicada
- **Princípio (caput):** reparação INTEGRAL — mede-se pela EXTENSÃO DO DANO (patrimonial + moral + estético conforme caso), nem mais nem menos.
- **§ único (correção):** redução equitativa POSSÍVEL (faculdade do juiz, não obrigação) quando houver EXCESSIVA DESPROPORÇÃO entre gravidade da culpa e dano — atinge dano patrimonial; aplicação ao dano MORAL é controvertida (doutrina dividida — registrar como controvérsia, não como regra).

## Hipóteses de aplicação no EJC
- Fixação/impugnação do quantum; defesa do réu com o § único; réplica com o princípio da reparação integral.`,
    ['944'],
  ),
  leiCc(
    'cc-art-945-culpa-da-vitima',
    'CC art. 945 — Culpa concorrente da vítima: indenização proporcional à gravidade das culpas (texto literal confirmado)',
    'Responsabilidade civil — culpa concorrente',
    `## Ficha da Norma
- **Norma:** Lei 10.406/2002 (Código Civil).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 945. Se a vítima tiver concorrido culposamente para o evento danoso, a sua indenização será fixada tendo-se em conta a gravidade de sua culpa em confronto com a do autor do dano."

## Leitura aplicada
- **Culpa concorrente:** redução PROPORCIONAL da indenização conforme a gravidade RELATIVA das culpas (comparação de graus, não percentuais fixos).
- Na responsabilidade OBJETIVA, a culpa da vítima também reduz (complemento do sistema); a culpa EXCLUSIVA da vítima exclui o nexo.

## Hipóteses de aplicação no EJC
- Acidentes de trânsito/vias com conduta dupla; defesa objetiva com porcentagem de contribuição — ATENÇÃO: percentuais são propostas argumentativas do caso concreto (não regras legais).`,
    ['945'],
  ),
  leiCc(
    'cc-arts-946-950-indenizacao-pessoa',
    'CC arts. 946-950 — Apuração de perdas e danos; homicídio (despesas + alimentos); lesão (lucros cessantes); incapacidade (pensão) (texto literal confirmado)',
    'Responsabilidade civil — indenização por morte e lesão',
    `## Ficha da Norma
- **Norma:** Lei 10.406/2002 (Código Civil).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 946. Se a obrigação for indeterminada, e não houver na lei ou no contrato disposição fixando a indenização devida pelo inadimplente, apurar-se-á o valor das perdas e danos na forma que a lei processual determinar.

Art. 947. Se o devedor não puder cumprir a prestação na espécie ajustada, substituir-se-á pelo seu valor, em moeda corrente.

Art. 948. No caso de homicídio, a indenização consiste, sem excluir outras reparações:
I - no pagamento das despesas com o tratamento da vítima, seu funeral e o luto da família;
II - na prestação de alimentos às pessoas a quem o morto os devia, levando-se em conta a duração provável da vida da vítima.

Art. 949. No caso de lesão ou outra ofensa à saúde, o ofensor indenizará o ofendido das despesas do tratamento e dos lucros cessantes até ao fim da convalescença, além de algum outro prejuízo que o ofendido prove haver sofrido.

Art. 950. Se da ofensa resultar defeito pelo qual o ofendido não possa exercer o seu ofício ou profissão, ou se lhe diminua a capacidade de trabalho, a indenização, além das despesas do tratamento e lucros cessantes até ao fim da convalescença, incluirá pensão correspondente à importância do trabalho para que se inabilitou, ou da depreciação que ele sofreu.
Parágrafo único. O prejudicado, se preferir, poderá exigir que a indenização seja arbitrada e paga de uma só vez."

## Leitura aplicada
- **948 (homicídio):** (I) despesas de tratamento + funeral + luto da família; (II) PENSÃO DE ALIMENTOS às pessoas a quem o morto os devia — duração provável da vida da vítima como baliza.
- **949 (lesão):** tratamento + lucros cessantes até o fim da convalescença + outros prejuízos PROVADOS.
- **950 (incapacidade):** pensão correspondente ao trabalho perdido/depreciado; opção do vítima por indenização de UMA SÓ VEZ (§ único).

## Hipóteses de aplicação no EJC
- Cálculo da pensão do art. 948 II/950 (bases de cálculo e período — perícia/liquidância).`,
    ['946', '947', '948', '949', '950'],
  ),
  leiCc(
    'cc-arts-951-954-profissional-liberdade-pessoal',
    'CC arts. 951-954 — Erro profissional (negligência/imprudência/imperícia); usurpação/esbulho; ofensas à honra; liberdade pessoal (texto literal confirmado)',
    'Responsabilidade civil — profissional, honra e liberdade',
    `## Ficha da Norma
- **Norma:** Lei 10.406/2002 (Código Civil).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 951. O disposto nos arts. 948, 949 e 950 aplica-se ainda no caso de indenização devida por aquele que, no exercício de atividade profissional, por negligência, imprudência ou imperícia, causar a morte do paciente, agravar-lhe o mal, causar-lhe lesão, ou inabilitá-lo para o trabalho.

Art. 952. Havendo usurpação ou esbulho do alheio, além da restituição da coisa, a indenização consistirá em pagar o valor das suas deteriorações e o devido a título de lucros cessantes; faltando a coisa, dever-se-á reembolsar o seu equivalente ao prejudicado.
Parágrafo único. Para se restituir o equivalente, quando não exista a própria coisa, estimar-se-á ela pelo seu preço ordinário e pelo de afeição, contanto que este não se avantaje àquele.

Art. 953. A indenização por injúria, difamação ou calúnia consistirá na reparação do dano que delas resulte ao ofendido.
Parágrafo único. Se o ofendido não puder provar prejuízo material, caberá ao juiz fixar, eqüitativamente, o valor da indenização, na conformidade das circunstâncias do caso.

Art. 954. A indenização por ofensa à liberdade pessoal consistirá no pagamento das perdas e danos que sobrevierem ao ofendido, e se este não puder provar prejuízo, tem aplicação o disposto no parágrafo único do artigo antecedente.
Parágrafo único. Consideram-se ofensivos da liberdade pessoal:
I - o cárcere privado;
II - a prisão por queixa ou denúncia falsa e de má-fé;
III - a prisão ilegal."

## Leitura aplicada
- **951 (erro profissional):** regras de morte/lesão (948-950) aplicam-se ao profissional que age com NEGLIGÊNCIA, IMPRUDÊNCIA ou IMPERÍCIA — regime do erro (não confundir com obrigação de resultado — avaliar por atividade).
- **952 (usurpação/esbulho):** restituição + deteriorações + lucros cessantes; coisa perdida → equivalente (preço ordinário; preço de afeição não o supera).
- **953 (honra):** reparação do dano resultante; sem prejuízo material provado → juiz fixa EQUITATIVAMENTE (fundamento do dano moral tarifável? não — equidade, sem teto legal).
- **954 (liberdade pessoal):** cárcere privado; prisão por queixa/denúncia falsa e de má-fé; prisão ilegal — mesma equidade do 953 sem prejuízo provado.

## Hipóteses de aplicação no EJC
- Ação contra profissional (médico, engenheiro, advogado); prisões ilegais → liberdade pessoal.`,
    ['951', '952', '953', '954'],
  ),
  {
    slug: 'sumula-227-stj-pessoa-juridica-dano-moral',
    titulo: 'Súmula 227/STJ — A pessoa jurídica pode sofrer dano moral (registro B honesto — re-captura pendente)',
    tipoDocumento: 'JURISPRUDENCIA',
    area: 'civil',
    subarea: 'responsabilidade-civil',
    assunto: 'Dano moral da pessoa jurídica',
    prioridade: 'P1',
    lote: 'LOTE-021',
    conteudo: `# SÚMULA 227 — SUPERIOR TRIBUNAL DE JUSTIÇA

## Enunciado (confirmado verbatim por snippet do arquivo oficial do STJ em 2026-08-30)
"A pessoa jurídica pode sofrer dano moral."

## Fonte e honestidade EJC
- Enunciado visto em snippet do arquivo OFICIAL do STJ: https://www.stj.jus.br/docs_internet/VerbetesSTJ_asc.txt (busca em 2026-08-30: "Súmula : 227 A pessoa jurídica pode sofrer dano moral .").
- Captura DIRETA do arquivo retornou HTTP 403 (bloqueio) nesta consulta — registro com confiabilidade B e re-captura recomendada para arquivar o arquivo integral.
- Segunda Seção do STJ (julgamento do enunciado conforme portal institucional); data de origem não confirmada nesta consulta — NÃO afirmada.

## Leitura aplicada
- Pessoa jurídica tem honra OBJETIVA (imagem/reputação/crédito) — ofensa comprovada → dano moral indenizável, além do dano patrimonial que eventualmente ocorra.
- Requisitos no caso concreto: prova do ato ilícito + lesão à reputação/imagem + nexo (a súmula não dispensa a prova do dano).
- Conexões: CC art. 953 (reparação por injúria/difamação/calúnia — régua da equidade); CDC art. 42 p.ú. quando em cobrança de consumo.`,
    metadados: { tribunal: 'Superior Tribunal de Justiça (STJ)', numero_sumula: '227', orgao: 'Segunda Seção (conforme portal institucional — não confirmado nesta consulta)', numero_processo: '', data_consulta_confirmacao: '2026-08-30', enunciado: 'A pessoa jurídica pode sofrer dano moral.' },
    tags: ['civil/responsabilidade-civil', 'geral/dano-moral'],
    fonte: 'STJ — arquivo oficial de enunciados (docs_internet/VerbetesSTJ_asc.txt)',
    urlFonte: 'https://www.stj.jus.br/docs_internet/VerbetesSTJ_asc.txt',
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-09-30',
  },
  {
    slug: 'tese-responsabilidade-civil-regime-diagnostico',
    titulo: 'Tese — Responsabilidade civil: diagnóstico do regime (subjetiva × objetiva) e fontes da objetividade',
    tipoDocumento: 'TESE',
    area: 'civil',
    subarea: 'responsabilidade-civil',
    assunto: 'Teoria da responsabilidade — rota de fundamentação',
    prioridade: 'P1',
    lote: 'LOTE-021',
    conteudo: `## Tese
A pretensão indenizatória exige: (1) CONDUTA (ação/omissão); (2) DANO (patrimonial/moral/estético — prova ou equidade quando a lei autoriza); (3) NEXO CAUSAL (exclusão por culpa exclusiva da vítima, fato de terceiro, caso fortuito/força maior salvo fortuito interno). O REGIME depende da fonte: SUBJETIVA (CC 927 caput — provar culpa) OU OBJETIVA — (a) quando a LEI especificar (CC 931/933/936/937; CDC 12/14; Lei 6.938 art. 14); (b) quando a atividade normalmente desenvolvida implicar RISCO (CC 927 § único).

## Fundamentos literais (Planalto, consulta 2026-08-30)
- CC 927 (caput e § único), 928 (incapaz — equidade), 931 (produto), 932-933 (terceiros — objetiva), 935 (independência criminal), 936-938 (animal, ruína, coisas lançadas), 942-943 (solidariedade/herança), 944 (extensão do dano + redução equitativa), 945 (culpa concorrente), 948-950 (morte/lesão/incapacidade), 951-954 (profissional, esbulho, honra, liberdade pessoal).

## Requisitos e riscos
- Objetiva: NÃO precisa provar culpa, MAS continua exigindo dano + nexo.
- 944 § único: redução equitativa é FACULDADE, não regra; aplicação ao dano moral é CONTROVÉRSIA (argumentação bilateral do lote).
- Culpa concorrente (945): redução proporcional — percentuais são propostas do caso, não percentuais legais.
- Independência da esfera criminal (935): decisões criminais sobre fato/autoria vinculam a cível.

## Probabilidade qualitativa
- Depende da prova do dano/nexo e do enquadramento do regime — sem dado estatístico (o EJC não inventa percentuais).`,
    tags: ['civil/responsabilidade-civil'],
    fonte: EJC,
    urlFonte: URL_CC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'cc-art-927-obrigacao-reparar-objetiva', tipo: 'FUNDAMENTA', descricao: 'Princípio geral e objetividade.' },
      { destinoSlug: 'stj-responsabilidade-objetiva-ambiental-risco-integral', tipo: 'COMPLEMENTA', descricao: 'Objetividade ambiental com risco integral.' },
      { destinoSlug: 'sumula-479-stj-fortuito-interno-fraudes', tipo: 'COMPLEMENTA', descricao: 'Limites da excludente de fortuito no bancário.' },
    ],
  },
  {
    slug: 'peca-indenizacao-dano-moral-modelo',
    titulo: 'Peça — Ação de indenização por danos morais e materiais (modelo com variáveis e checklist)',
    tipoDocumento: 'PECA',
    area: 'civil',
    subarea: 'responsabilidade-civil',
    assunto: 'Peça-modelo com {{VARIÁVEIS}}',
    prioridade: 'P1',
    lote: 'LOTE-021',
    conteudo: `# AÇÃO DE INDENIZAÇÃO POR DANOS MORAIS E MATERIAIS — MODELO EJC

**Anti-invenção:** preencher TODAS as {{VARIÁVEIS}} com dados reais; NÃO citar precedentes/valores de outros casos como obrigação — fixação equitativa do caso concreto.

---
EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA {{VARA}} DA COMARCA DE {{COMARCA}}/{{UF}}.

{{NOME_AUTOR}}, {{NACIONALIDADE}}, {{ESTADO_CIVIL}}, {{PROFISSAO}}, {{RG}}, {{CPF}}, residente em {{ENDERECO}}, por seu advogado (procuração anexa — {{OAB}}), vem propor AÇÃO DE INDENIZAÇÃO POR DANOS MORAIS E MATERIAIS em face de {{NOME_REU}}, {{QUALIFICACAO_REU}}, pelos fatos e fundamentos a seguir.

## I — DOS FATOS
1. Em {{DATA_DO_FATO}}, o réu {{DESCRICAO_DA_CONDUTA_ILICITA}} (doc. {{NUM_PROVA}}).
2. Como consequência, o autor sofreu {{DESCRICAO_DO_DANO}} — despesas de {{VALOR_DESPESAS}}, lucros cessantes de {{VALOR_LUCROS_CESSANTES}} {{E_OUTROS_PREJUIZOS}}.

## II — DO DIREITO
- CC art. 186 e 927: ato ilícito + dano + nexo → obrigação de reparar.
- Regime {{SUBJETIVO (culpa provada — docs) / OBJETIVO: fundamento específico (CC 931/933/936/937/927 § único — risco da atividade, ou lei especial aplicável)}}.
- CC art. 944: a indenização mede-se pela extensão do dano {{SE_CABIVEL: contrapor redução equitativa do § único — não há desproporção excessiva}}.
- CC art. 945 {{SE_CABIVEL: sem culpa concorrente — conduta do autor foi regular}}.
- Danos materiais: CC arts. 948/949/950 {{ADEQUAR: despesas, lucros cessantes, pensão}}.
- Danos morais: {{DESCRICAO_DA_LESAO_SUBJETIVA}} — fixação equitativa nas circunstâncias do caso (CC 953 p.ú. como régua de equidade {{SE_APLICAVEL}}).
- Solidariedade: CC art. 942 {{SE_MULTIPLOS_AUTORES}}.

## III — DOS PEDIDOS
a) a citação do réu;
b) a condenação em DANOS MATERIAIS de {{VALOR_TOTAL_MATERIAIS}} ({{DEMONSTRATIVO}});
c) a condenação em DANOS MORAIS que o juiz fixar com justiça, estimado em {{VALOR_ESTIMATIVO}} (art. 291 CPC);
d) juros e correção na forma da lei processual (CPC art. 405 — observando o regime conforme a natureza do dano);
e) gratuidade {{SE_CABIVEL}};
f) provas (testemunhal, documental, pericial).

Dá-se à causa o valor de {{VALOR_DA_CAUSA}}.
{{LOCAL}}, {{DATA}}.
{{NOME_ADVOGADO}} — OAB/{{UF}} {{NUM_OAB}}

## CHECKLIST EJC (antes do protocolo)
- [ ] Prova da conduta (documental/testemunhal).
- [ ] Prova/quantificação do dano material (notas, laudos) OU dano moral com lesão descrita.
- [ ] Nexo causal identificado e excludentes afastadas (culpa exclusiva da vítima? fortuito?).
- [ ] Regime (subjetivo/objetivo) definido com fundamento literal.
- [ ] Valor da causa correspondente aos pedidos.`,
    tags: ['civil/responsabilidade-civil'],
    fonte: EJC,
    urlFonte: URL_CC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'checklist-dossie-responsabilidade-civil',
    titulo: 'Checklist — Dossiê de responsabilidade civil (15 pontos: conduta, dano, nexo, regime)',
    tipoDocumento: 'CHECKLIST',
    area: 'civil',
    subarea: 'responsabilidade-civil',
    assunto: 'Roteiro operacional de fundamentação',
    prioridade: 'P1',
    lote: 'LOTE-021',
    conteudo: `# CHECKLIST EJC — DOSSIÊ DE RESPONSABILIDADE CIVIL

## A — Conduta e regime
- [ ] 1. Conduta identificada (ação/omissão) e autor(es) nomeado(s).
- [ ] 2. Regime: subjetivo (provar culpa — CC 927 caput) OU objetivo (lei especial OU risco da atividade — CC 927 § único; 931; 933; 936; 937).
- [ ] 3. Se abuso de direito: excesso + finalidade + interesse + prejuízo (CC 187).

## B — Dano
- [ ] 4. Dano PATRIMONIAL emergente: notas fiscais, recibos, orçamentos.
- [ ] 5. Lucros cessantes: prova da capacidade produtiva interrompida (CC 949).
- [ ] 6. Dano MORAL: lesão descrita (honra subjetiva/objetiva — PJ: Súmula 227/STJ com prova da lesão à reputação).
- [ ] 7. Dano ESTÉTICO {{SE_APLICAVEL}} — pedido autônomo conforme caso.
- [ ] 8. Morte: despesas + funeral + luto (948 I) e pensão às pessoas a quem o morto devia alimentos (948 II).

## C — Nexo e excludentes
- [ ] 9. Nexo causal demonstrado; excludentes afastadas (culpa exclusiva da vítima; fato de terceiro; força maior).
- [ ] 10. Culpa CONCORRENTE (945): estimar contribuição — percentual é proposta, não regra.
- [ ] 11. Fortuito interno/externo conforme a atividade do réu.

## D — Responsáveis e transmissão
- [ ] 12. Responsáveis por fato de terceiro (932 I-V) + solidariedade (942 p.ú.) — vítima pode cobrar do responsável direto.
- [ ] 13. Herança: direito/obrigação transmitem-se (943); incapaz causador: equidade (928).

## E — Quantum e técnica
- [ ] 14. Extensão do dano como régua (944); contestar redução equitativa SEM desproporção excessiva.
- [ ] 15. Sentença criminal sobre fato/autoria (935): aproveitar como vinculação/título (CPC 515 VI).`,
    tags: ['civil/responsabilidade-civil', 'geral/metodologia'],
    fonte: EJC,
    urlFonte: URL_CC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'fluxo-acao-indenizatoria-etapas',
    titulo: 'Fluxo — Ação indenizatória: da ocorrência do dano à liquidação e execução',
    tipoDocumento: 'FLUXO',
    area: 'civil',
    subarea: 'responsabilidade-civil',
    assunto: 'Mapa evento → prazo → providência → risco',
    prioridade: 'P1',
    lote: 'LOTE-021',
    conteudo: `# FLUXO EJC — AÇÃO INDENIZATÓRIA (RESPONSABILIDADE CIVIL)

## Etapa 1 — Ocorrência e preservação
- Evento: fato danoso.
- Providência: preservar provas (fotos, laudos, câmeras, mensagens), registro de ocorrência, notificação extrajudicial.
- Prazo de atenção: prescrição da reparação civil — 3 ANOS (CC 206 § 3º V — doc de prazos da base).

## Etapa 2 — Diagnóstico do regime
- Providência: aplicar a regra SE-ENTÃO do lote (subjetiva × objetiva; identificar lei especial — CDC/ambiental/bancário).
- Risco: fundamentar objetiva sem lei especial/risco → improcedência parcial.

## Etapa 3 — Negociação prévia (quando aplicável)
- Providência: proposta de acordo com relação de danos; prazo razoável.
- Benefício: liquidação consensual evita litigância; juros/correção discutidos.

## Etapa 4 — Ajuizamento
- Providência: inicial (peça EJC) com pedidos de danos materiais + morais; valor da causa; sustentação de urgência se cabível (CPC 300 — doc da base).
- Risco: pedido de dano moral sem descrição da lesão.

## Etapa 5 — Defesa e instrução
- Contestação típica: excludentes, culpa concorrente (945), redução equitativa (944 § único).
- Provas: testemunhas, perícia (causa médica/tecnicidade), documentos.

## Etapa 6 — Sentença e fixação do quantum
- Régua: extensão do dano (944); equidade nos danos morais sem prejuízo material provado (953 p.ú. como referência).
- Risco: dupla indenização pelo mesmo dano (morais × materiais sobrepostos) — distinguir rubricas.

## Etapa 7 — Apelação/liquidação/execução
- Liquidação por arbitramento ou por artigos conforme a decisão; execução no cumprimento (docs do LOTE-017 na base).`,
    tags: ['civil/responsabilidade-civil', 'geral/prazos'],
    fonte: EJC,
    urlFonte: URL_CC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'tabela-documentos-responsabilidade-civil',
    titulo: 'Tabela — Documentos necessários: ação indenizatória por responsabilidade civil',
    tipoDocumento: 'TABELA_DOCUMENTOS',
    area: 'civil',
    subarea: 'responsabilidade-civil',
    assunto: 'Dossiê documental por fase',
    prioridade: 'P2',
    lote: 'LOTE-021',
    conteudo: `# TABELA EJC — DOCUMENTOS POR FASE (AÇÃO INDENIZATÓRIA)

| Fase | Documento | Função |
|---|---|---|
| Pré | Registro de ocorrência/B.O. | Documentação do fato e autoria |
| Pré | Fotos/vídeos datados, laudos técnicos | Conduta + dano + nexo |
| Pré | Notificação extrajudicial | Tentativa amigável + constituição |
| Pré | Mensagens/e-mails | Nexo e lesão moral |
| Material | Notas fiscais, recibos, orçamentos | Emergente (949) |
| Material | Carteira de trabalho/holerite, laudo médico | Lucros cessantes/pensão (948 II/950) |
| Pessoal | Certidão de óbito + comprovantes de despesas | Homicídio (948) |
| Processual | Procuração, documentos pessoais | Legitimação |
| Processual | Comprovação de representação (menores) | Legitimidade de quem reclama |
| Instrução | Lista de testemunhas | Prova do fato |
| Instrução | Laudo pericial (se técnico) | Nexo/quantum |
| Execução | Demonstrativo do débito | Liquidação |

**Aviso:** adaptar ao caso concreto.`,
    tags: ['civil/responsabilidade-civil', 'geral/metodologia'],
    fonte: EJC,
    urlFonte: URL_CC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'triagem-responsabilidade-civil-perguntas',
    titulo: 'Triagem — Responsabilidade civil: roteiro de entrevista e classificação (12 perguntas)',
    tipoDocumento: 'TRIAGEM',
    area: 'civil',
    subarea: 'responsabilidade-civil',
    assunto: 'Roteiro de classificação do caso',
    prioridade: 'P2',
    lote: 'LOTE-021',
    conteudo: `# TRIAGEM EJC — RESPONSABILIDADE CIVIL

1. O que aconteceu, quando e onde? (fato, data — prazo de 3 anos da reparação)
2. Quem praticou a conduta? Existe relação com a vítima (contrato, consumo, trabalho)?
3. Há prova do fato (testemunhas, câmeras, laudos, B.O.)?
4. Qual o dano: material (quanto), moral (como a lesão se manifesta), estético, à honra?
5. Há despesas documentadas (notas, recibos)?
6. A vítima contribuiu de alguma forma para o evento? (945)
7. Há causas externas (força maior, terceiro)? A conduta foi exclusiva?
8. O réu é empresário/empresa e o dano veio de produto? (931 — objetiva)
9. O causador era empregado a serviço? (932 III — empregador responde)
10. Houve processo criminal? Qual desfecho? (935)
11. A vítima é incapaz/pessoa que dependia do falecido? (928/948 II)
12. Já houve acordo/oferta? Quais valores?

## Classificação SE-ENTÃO
- Produto posto em circulação → 931 (+CDC se consumo).
- Empregado no trabalho → 932 III + 933 (objetiva) + regresso 934.
- Atividade de risco → 927 § único.
- Honra → 953; liberdade pessoal → 954; profissional → 951.`,
    tags: ['civil/responsabilidade-civil', 'geral/triagem'],
    fonte: EJC,
    urlFonte: URL_CC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'argumentacao-responsabilidade-civil-dois-lados',
    titulo: 'Argumentação — Responsabilidade civil: tese da vítima × defesa do réu (4 controvérsias)',
    tipoDocumento: 'ARGUMENTACAO',
    area: 'civil',
    subarea: 'responsabilidade-civil',
    assunto: 'Análise bilateral da controvérsia',
    prioridade: 'P2',
    lote: 'LOTE-021',
    conteudo: `# ARGUMENTAÇÃO BILATERAL EJC — RESPONSABILIDADE CIVIL

## Controvérsia 1 — Há nexo causal?
**Vítima:** cadeia de causalidade documentada (fato → dano), testemunhas, perícia; excludentes não preenchidas.
**Réu:** culpa EXCLUSIVA da vítima (945 como excludente), fato de TERCEIRO independente, caso FORTUITO/força maior; quebra do nexo pela conduta intercorrente.

## Controvérsia 2 — Qual o regime (culpa exigida)?
**Vítima:** objetiva — risco da atividade (927 § único) ou lei especial (931/933/936/937; CDC; ambiental).
**Réu:** regime subjetivo — a atividade não é tipicamente arriscada; sem lei específica; pedir prova da culpa.

## Controvérsia 3 — O quantum respeita a extensão do dano?
**Vítima:** reparação integral (944 caput); lesão moral concreta e grave; pensão calculada na expectativa (948 II/950).
**Réu:** redução equitativa (944 § único — desproporção excessiva); valores desproporcionados à realidade lesiva; acumulação indevida de rubricas (moral × material sobre o mesmo fato).

## Controvérsia 4 — Quem responde e em que proporção?
**Vítima:** solidariedade (942) — cobrar do patrimônio mais solvente; responsáveis do 932 respondem sem culpa própria (933).
**Réu:** limitar ao papel real no evento; regresso (934) contra o causador; culpabilidade reduzida do responsável subsidiário; incapaz: equidade com teto do necessário (928 p.ú.).`,
    tags: ['civil/responsabilidade-civil', 'geral/metodologia'],
    fonte: EJC,
    urlFonte: URL_CC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'doutrina-dano-moral-funcoes-reparacao',
    titulo: 'Doutrina — Dano moral: natureza, funções da indenização e parâmetros de fixação (EJC)',
    tipoDocumento: 'DOUTRINA',
    area: 'civil',
    subarea: 'responsabilidade-civil',
    assunto: 'Conceitos técnicos do instituto',
    prioridade: 'P2',
    lote: 'LOTE-021',
    conteudo: `# DOUTRINA EJC — DANO MORAL (CONCEITOS PRÓPRIOS)

## Natureza
Lesão a interesses NÃO patrimoniais da pessoa (honra subjetiva, paz interior, imagem, autoestima) ou da pessoa jurídica (honra objetiva — Súmula 227/STJ, na base com registro B honesto). Não exige prejuízo econômico comprovado quando a lesão é in re ipsa (nas hipóteses que a tradição reconhece), MAS a tendência exigir prova/dação da lesão concreta — cuidado com generalizações.

## Funções da indenização
- COMPENSATÓRIA: minimizar a lesão sofrida (função principal).
- PUNITIVA/PEDAGÓGICA: desestimular a repetição (sem prejuízo da função compensatória — cuidado com "multas" disfarçadas).
- DISSUASÓRIA: sinalizar custo do ilícito.

## Parâmetros usuais de fixação (sem teto legal no CC)
- Gravidade da lesão e da conduta (dolo/culpa); condição das partes; alcance da ofensa (público × privado); reiteração; capacidade econômica; cumprimento posterior de obrigações.
- CC 953 p.ú.: sem prejuízo material provado, o juiz fixa EQUITATIVAMENTE — a equidade é a régua legal citada.

## Honestidade EJC
- NÃO reproduzir "tabelas" de tribunais como se fossem normas — são parâmetros jurisprudenciais variáveis; NÃO citar acórdãos sem confirmação oficial.
- Textos dos arts. do CC citados literalmente do Planalto (consulta 2026-08-30).`,
    tags: ['civil/responsabilidade-civil', 'geral/dano-moral'],
    fonte: EJC,
    urlFonte: URL_CC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'regra-se-responsabilidade-civil-diagnostico',
    titulo: 'Regra SE-ENTÃO — Diagnóstico do regime e dos responsáveis na responsabilidade civil',
    tipoDocumento: 'REGRA_INTELIGENCIA',
    area: 'civil',
    subarea: 'responsabilidade-civil',
    assunto: 'Inteligência interpretável EJC',
    prioridade: 'P1',
    lote: 'LOTE-021',
    conteudo: `# REGRA SE-ENTÃO EJC — RESPONSABILIDADE CIVIL

**SE** o dano veio de PRODUTO posto em circulação por empresário/empresa **ENTÃO** objetiva — CC 931 (+ CDC arts. 12/14 na relação de consumo).

**SE** o causador foi EMPREGADO/SERVIÇAL/PREPOSTO no exercício do trabalho ou em razão dele **ENTÃO** empregador responde AINDA SEM culpa (CC 932 III + 933) — regresso do 934.

**SE** o dano veio de ANIMAL **ENTÃO** dono/detentor responde salvo culpa da vítima ou força maior (CC 936).

**SE** o dano veio de RUÍNA de edifício por falta de reparos manifestos **ENTÃO** dono do edifício responde (CC 937); **SE** de coisas CAÍDAS/LANÇADAS do prédio **ENTÃO** o HABITADOR responde (CC 938).

**SE** nenhuma hipótese objetiva se encaixa **ENTÃO** regime SUBJETIVO — provar culpa (CC 927 caput + 186/187).

**SE** há mais de um autor ou responsável do 932 **ENTÃO** SOLIDARIEDADE (CC 942) — vítima escolhe quem cobrar.

**SE** a vítima concorreu culposamente **ENTÃO** reduzir proporcionalmente (CC 945) — percentuais propostos no caso.

**SE** há morte **ENTÃO** despesas + funeral + luto (948 I) + pensão (948 II); **SE** incapacidade **ENTÃO** pensão (950) com opção de pagamento único (§ único).

**SE** há decisão criminal sobre fato/autoria **ENTÃO** vinculação na cível (CC 935).

## Trava anti-invenção
Fundamentar sempre com o texto literal do artigo aplicável; sem percentuais "de mercado" apresentados como norma.`,
    tags: ['civil/responsabilidade-civil', 'geral/metodologia'],
    fonte: EJC,
    urlFonte: URL_CC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'jurimetria-vazia-responsabilidade-civil',
    titulo: 'Jurimetria — Responsabilidade civil (estrutura vazia — sem dados reais)',
    tipoDocumento: 'JURIMETRIA',
    area: 'civil',
    subarea: 'responsabilidade-civil',
    assunto: 'Estrutura para dados futuros',
    prioridade: 'P3',
    lote: 'LOTE-021',
    conteudo: `# JURIMETRIA — RESPONSABILIDADE CIVIL
**Status: SEM DADOS.** Nenhuma estatística real nesta consulta (2026-08-30) — o EJC NÃO inventa percentuais (item 18 da missão).

## Campos preparados
- tribunal/classe/período/amostra/metodologia/fonte;
- indicadores futuros: média de acolhimento de culpa concorrente; distribuição de valores fixados por natureza do dano; tempo médio de tramitação; taxa de aplicação do 944 § único.

## Separação obrigatória: DADO ESTATÍSTICO REAL (com fonte) × ANÁLISE QUALITATIVA.`,
    tags: ['civil/responsabilidade-civil', 'geral/metodologia'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
];
