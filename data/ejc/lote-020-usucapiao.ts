// LOTE-020 — Usucapião (CC arts. 1.228-1.244) + via extrajudicial (Lei 6.015, art. 216-A)
// + citação de confinantes e editais (CPC arts. 235 § 3º e 259 I) + ações possessórias (CPC arts. 561-567)
// Textos LITERAIS extraídos do Planalto em 2026-08-30:
// https://www.planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm (CC)
// https://www.planalto.gov.br/ccivil_03/leis/l6015compilada.htm (Lei de Registros Públicos)
// https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105.htm (CPC)
//
// ANTI-INVENÇÃO desta rodada (constatações do texto oficial):
// - No CPC/2015 NÃO existe procedimento especial de ação de usucapião (diferente do CPC/73):
//   a via judicial segue o procedimento comum + regras de citação/edital (arts. 235 § 3º e 259 I).
// - Art. 216-A da Lei 6.015: § 2º com redação VIGENTE da Lei 13.465/2017 (silêncio = CONCORDÂNCIA);
//   a redação ORIGINAL (Lei 13.105/2015) dizia silêncio = DISCORDÂNCIA — divergência histórica registrada.
// - Súmula 523/STF ("no processo de usucapião... dominus e confinantes") NÃO confirmada verbatim
//   em fonte oficial nesta consulta — NÃO incluída (regra anti-invenção).
// - Art. 1.240-A: incluído pela Lei 12.424/2011; § 2º VETADO (como consta no texto oficial).
import type { InputDocument } from '../../src/lib/ejc/types';

const D = '2026-08-30';
const PLANALTO = 'Presidência da República — Planalto';
const URL_CC = 'https://www.planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm';
const URL_L6015 = 'https://www.planalto.gov.br/ccivil_03/leis/l6015compilada.htm';
const URL_CPC = 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105.htm';
const EJC = 'Elaboração EJC — conteúdo estrutural original';

function leiCc(slug: string, titulo: string, assunto: string, conteudo: string, artigos: string[], extra?: Partial<InputDocument>): InputDocument {
  return {
    slug, titulo, tipoDocumento: 'LEGISLACAO', area: 'civil', subarea: 'propriedade',
    assunto, prioridade: 'P1', lote: 'LOTE-020',
    conteudo,
    metadados: { numero: 'Lei 10.406/2002 (Código Civil)', data_norma: '2002-01-11', orgao: 'Congresso Nacional', artigos_principais: artigos, vigente: true, confirmacao_texto: 'Extração literal do texto oficial do Planalto em 2026-08-30.' },
    tags: ['civil/propriedade', 'civil/usucapiao'],
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
    'cc-art-1228-reivindicacao-funcao-social',
    'CC art. 1.228 — Ação reivindicatória, função social da propriedade e usucapião coletiva extensa (texto literal confirmado)',
    'Propriedade — reivindicação e limites',
    `## Ficha da Norma
- **Norma:** Lei 10.406/2002 (Código Civil) — Livro III, Título III, Capítulo I.

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 1.228. O proprietário tem a faculdade de usar, gozar e dispor da coisa, e o direito de reavê-la do poder de quem quer que injustamente a possua ou detenha.

§ 1º O direito de propriedade deve ser exercido em consonância com as suas finalidades econômicas e sociais e de modo que sejam preservados, de conformidade com o estabelecido em lei especial, a flora, a fauna, as belezas naturais, o equilíbrio ecológico e o patrimônio histórico e artístico, bem como evitada a poluição do ar e das águas.

§ 2º São defesos os atos que não trazem ao proprietário qualquer comodidade, ou utilidade, e sejam animados pela intenção de prejudicar outrem.

§ 3º O proprietário pode ser privado da coisa, nos casos de desapropriação, por necessidade ou utilidade pública ou interesse social, bem como no de requisição, em caso de perigo público iminente.

§ 4º O proprietário também pode ser privado da coisa se o imóvel reivindicado consistir em extensa área, na posse ininterrupta e de boa-fé, por mais de cinco anos, de considerável número de pessoas, e estas nela houverem realizado, em conjunto ou separadamente, obras e serviços considerados pelo juiz de interesse social e econômico relevante.

§ 5º No caso do parágrafo antecedente, o juiz fixará a justa indenização devida ao proprietário; pago o preço, valerá a sentença como título para o registro do imóvel em nome dos possuidores."

## Leitura aplicada
- **Reivindicatória (caput):** direito de REAVER a coisa de quem injustamente a possua ou detenha — petitoria (propriedade) ≠ possessória (posse).
- **§ 4º-5º (usucapião coletiva extensa):** privação do proprietário em face de posse de >5 anos, boa-fé, número considerável de pessoas, com obras/serviços de interesse social e econômico relevante → justa indenização; sentença = título para registro.

## Hipóteses de aplicação no EJC
- Ação reivindicatória do proprietário; resistência do possuidor com hipótese de usucapião (defesa + reconvenção).`,
    ['1228'],
    {
      relacionamentos: [
        { destinoSlug: 'cc-arts-1238-1239-usucapiao-extraordinaria-rural', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Usucapiões sem justo título.' },
        { destinoSlug: 'cc-arts-1241-1242-usucapiao-ordinaria', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Usucapião ordinária (justo título + boa-fé).' },
      ],
    },
  ),
  leiCc(
    'cc-arts-1238-1239-usucapiao-extraordinaria-rural',
    'CC arts. 1.238-1.239 — Usucapião extraordinária (15/10 anos) e especial rural (5 anos, 50 hectares) (texto literal confirmado)',
    'Usucapião — extraordinária e rural',
    `## Ficha da Norma
- **Norma:** Lei 10.406/2002 (Código Civil).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 1.238. Aquele que, por quinze anos, sem interrupção, nem oposição, possuir como seu um imóvel, adquire-lhe a propriedade, independentemente de título e boa-fé; podendo requerer ao juiz que assim o declare por sentença, a qual servirá de título para o registro no Cartório de Registro de Imóveis.

Parágrafo único. O prazo estabelecido neste artigo reduzir-se-á a dez anos se o possuidor houver estabelecido no imóvel a sua moradia habitual, ou nele realizado obras ou serviços de caráter produtivo.

Art. 1.239. Aquele que, não sendo proprietário de imóvel rural ou urbano, possua como sua, por cinco anos ininterruptos, sem oposição, área de terra em zona rural não superior a cinqüenta hectares, tornando-a produtiva por seu trabalho ou de sua família, tendo nela sua moradia, adquirir-lhe-á a propriedade."

## Leitura aplicada
- **Extraordinária (1.238):** 15 anos — NÃO exige justo título nem boa-fé; redução para 10 anos com moradia habitual ou obra/serviço produtivo.
- **Especial rural (1.239):** 5 anos; requisitos CUMULATIVOS: (a) não ser proprietário de imóvel rural OU urbano; (b) área rural ≤ 50 hectares; (c) produtividade por trabalho próprio/família; (d) moradia no imóvel.
- Sentença declaratória = título para registro.

## Hipóteses de aplicação no EJC
- Diagnóstico por prazo: 15/10 (sem título) × 5 (rural) × 5 (urbana — doc próprio) × 2 (conjugal) × 10/5 (ordinária).`,
    ['1238', '1239'],
  ),
  leiCc(
    'cc-art-1240-usucapiao-urbana',
    'CC art. 1.240 — Usucapião especial urbana (5 anos, área ≤ 250 m², moradia, não ser proprietário) (texto literal confirmado)',
    'Usucapião — especial urbana',
    `## Ficha da Norma
- **Norma:** Lei 10.406/2002 (Código Civil).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 1.240. Aquele que possuir, como sua, área urbana de até duzentos e cinqüenta metros quadrados, por cinco anos ininterruptamente e sem oposição, utilizando-a para sua moradia ou de sua família, adquirir-lhe-á o domínio, desde que não seja proprietário de outro imóvel urbano ou rural.

§ 1º O título de domínio e a concessão de uso serão conferidos ao homem ou à mulher, ou a ambos, independentemente do estado civil.

§ 2º O direito previsto no parágrafo antecedente não será reconhecido ao mesmo possuidor mais de uma vez."

## Leitura aplicada
- **Requisitos cumulativos:** (a) área URBANA ≤ 250 m²; (b) 5 anos ininterruptos e sem oposição; (c) moradia própria OU da família; (d) não ser proprietário de outro imóvel urbano ou rural.
- **§ 1º:** título conferido a homem/mulher/ambos, independente do estado civil.
- **§ 2º:** direito de uma única vez (inerência de política habitacional).

## Hipóteses de aplicação no EJC
- Regularização de moradia urbana; conexa com a via extrajudicial (Lei 6.015 art. 216-A).`,
    ['1240'],
    {
      relacionamentos: [
        { destinoSlug: 'lei-6015-art-216a-usucapiao-extrajudicial', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Via administrativa/cartorial do reconhecimento.' },
      ],
    },
  ),
  leiCc(
    'cc-art-1240a-usucapiao-conjugal',
    'CC art. 1.240-A — Usucapião conjugal (2 anos, imóvel urbano ≤ 250 m², ex-cônjuge/ex-companheiro abandonou o lar) (texto literal confirmado)',
    'Usucapião — conjugal',
    `## Ficha da Norma
- **Norma:** Lei 10.406/2002 (Código Civil), art. 1.240-A (Incluído pela Lei nº 12.424, de 2011).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 1.240-A. Aquele que exercer, por 2 (dois) anos ininterruptamente e sem oposição, posse direta, com exclusividade, sobre imóvel urbano de até 250m² (duzentos e cinquenta metros quadrados) cuja propriedade divida com ex-cônjuge ou ex-companheiro que abandonou o lar, utilizando-o para sua moradia ou de sua família, adquirir-lhe-á o domínio integral, desde que não seja proprietário de outro imóvel urbano ou rural.
(Incluído pela Lei nº 12.424, de 2011)
§ 1º O direito previsto no caput não será reconhecido ao mesmo possuidor mais de uma vez.
§ 2º (VETADO). (Incluído pela Lei nº 12.424, de 2011)"

## Leitura aplicada
- **Requisitos cumulativos:** (a) 2 anos ininterruptos e sem oposição; (b) posse DIRETA e EXCLUSIVA; (c) imóvel urbano ≤ 250 m²; (d) propriedade dividida com ex-cônjuge/ex-companheiro que ABANDONOU O LAR; (e) moradia própria/família; (f) não ser proprietário de outro imóvel.
- **§ 1º:** direito de uma única vez.
- **§ 2º VETADO:** consta no texto oficial — o EJC registra como consta (não especula o conteúdo do veto).

## Hipóteses de aplicação no EJC
- Regularização de imóvel partilhado/consortial após abandono do lar — prazo reduzido (2 anos) como proteção habitacional.`,
    ['1240-A'],
  ),
  leiCc(
    'cc-arts-1241-1242-usucapiao-ordinaria',
    'CC arts. 1.241-1.242 — Usucapião ordinária (10 anos com justo título e boa-fé; 5 anos com registro cancelado + moradia/investimento) (texto literal confirmado)',
    'Usucapião — ordinária',
    `## Ficha da Norma
- **Norma:** Lei 10.406/2002 (Código Civil).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 1.241. Poderá o possuidor requerer ao juiz seja declarada adquirida, mediante usucapião, a propriedade imóvel.

Parágrafo único. A declaração obtida na forma deste artigo constituirá título hábil para o registro no Cartório de Registro de Imóveis.

Art. 1.242. Adquire também a propriedade do imóvel aquele que, contínua e incontestadamente, com justo título e boa-fé, o possuir por dez anos.

Parágrafo único. Será de cinco anos o prazo previsto neste artigo se o imóvel houver sido adquirido, onerosamente, com base no registro constante do respectivo cartório, cancelada posteriormente, desde que os possuidores nele tiverem estabelecido a sua moradia, ou realizado investimentos de interesse social e econômico."

## Leitura aplicada
- **Ordinária (1.242):** 10 anos — EXIGE justo título + boa-fé + posse contínua e incontestada.
- **§ único (prazo curto):** 5 anos se o imóvel foi adquirido ONEROSAMENTE com base em registro cartorial depois CANCELADO + moradia OU investimentos de interesse social e econômico (protege o comprador de vício registral — "usucapião registrada").
- **1.241:** ação declaratória; sentença = título hábil para registro.

## Hipóteses de aplicação no EJC
- Comprador com registro cancelado (fraude/indisponibilidade anterior) — prazo de 5 anos.`,
    ['1241', '1242'],
  ),
  leiCc(
    'cc-arts-1243-1244-acessao-e-aplicacao-prescricao',
    'CC arts. 1.243-1.244 — União de posses (acessio possessionis) e aplicação das causas de impedimento/suspensão/interrupção da prescrição à usucapião (texto literal confirmado)',
    'Usucapião — união de posses e regras da prescrição',
    `## Ficha da Norma
- **Norma:** Lei 10.406/2002 (Código Civil).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 1.243. O possuidor pode, para o fim de contar o tempo exigido pelos artigos antecedentes, acrescentar à sua posse a dos seus antecessores (art. 1.207), contanto que todas sejam contínuas, pacíficas e, nos casos do art. 1.242, com justo título e de boa-fé.

Art. 1.244. Estende-se ao possuidor o disposto quanto ao devedor acerca das causas que obstam, suspendem ou interrompem a prescrição, as quais também se aplicam à usucapião."

## Leitura aplicada
- **União de posses (1.243):** acessio possessionis — somar a posse dos antecessores; continuidade + pacificidade; para a ORDINÁRIA, antecessores também precisam de justo título e boa-fé.
- **1.244:** causas que OBSTAM/SUSPENDEM/INTERRUPTAM a prescrição (CC arts. 197-204) aplicam-se à usucapião — ex.: interrupção pela citação judicial; suspensão contra incapazes.

## Hipóteses de aplicação no EJC
- Cálculo do prazo somando antecessores; argumentos do réu com suspensão/interrupção.`,
    ['1243', '1244'],
    {
      relacionamentos: [
        { destinoSlug: 'cc-art-202-interrompem-prescricao', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Causas de interrupção aplicáveis (art. 1.244).' },
        { destinoSlug: 'cc-art-205-prescricao-geral-dez-anos', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Coesão com o sistema prescricional.' },
      ],
    },
  ),
  {
    slug: 'lei-6015-art-216a-usucapiao-extrajudicial',
    titulo: 'Lei 6.015/73, art. 216-A — Reconhecimento extrajudicial de usucapião direto no cartório (texto literal confirmado com nota sobre redações)',
    tipoDocumento: 'LEGISLACAO',
    area: 'civil',
    subarea: 'propriedade',
    assunto: 'Usucapião extrajudicial — requisitos e procedimento',
    prioridade: 'P1',
    lote: 'LOTE-020',
    conteudo: `## Ficha da Norma
- **Norma:** Lei 6.015/1973 (Lei de Registros Públicos), art. 216-A (Incluído pela Lei nº 13.105, de 2015 — CPC; redações parciais da Lei nº 13.465, de 2017, e Lei nº 14.382, de 2022).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30) — trechos essenciais
"Art. 216-A. Sem prejuízo da via jurisdicional, é admitido o pedido de reconhecimento extrajudicial de usucapião, que será processado diretamente perante o cartório de registro de imóveis da comarca em que estiver situado o imóvel usucapiendo, a requerimento do interessado, representado por advogado, instruído com:
I - ata notarial lavrada pelo tabelião, atestando o tempo de posse do requerente e de seus antecessores, conforme o caso e suas circunstâncias, aplicando-se o disposto no art. 384 da Lei nº 13.105, de 16 de março de 2015 (Código de Processo Civil) (Redação dada pela Lei nº 13.465, de 2017);
II - planta e memorial descritivo assinado por profissional legalmente habilitado, com prova de anotação de responsabilidade técnica no respectivo conselho de fiscalização profissional, e pelos titulares de direitos registrados ou averbados na matrícula do imóvel usucapiendo ou na matrícula dos imóveis confinantes (Redação dada pela Lei nº 13.465, de 2017);
III - certidões negativas dos distribuidores da comarca da situação do imóvel e do domicílio do requerente;
IV - justo título ou quaisquer outros documentos que demonstrem a origem, a continuidade, a natureza e o tempo da posse, tais como o pagamento dos impostos e das taxas que incidirem sobre o imóvel.

§ 2º Se a planta não contiver a assinatura de qualquer um dos titulares de direitos registrados ou averbados na matrícula do imóvel usucapiendo ou na matrícula dos imóveis confinantes, o titular será notificado pelo registrador competente, pessoalmente ou pelo correio com aviso de recebimento, para manifestar consentimento expresso em quinze dias, interpretado o silêncio como concordância. (Redação dada pela Lei nº 13.465, de 2017)

§ 3º O oficial de registro de imóveis dará ciência à União, ao Estado, ao Distrito Federal e ao Município [...] para que se manifestem, em 15 (quinze) dias, sobre o pedido.

§ 4º O oficial de registro de imóveis promoverá a publicação de edital em jornal de grande circulação, onde houver, para a ciência de terceiros eventualmente interessados, que poderão se manifestar em 15 (quinze) dias.

§ 6º Transcorrido o prazo de que trata o § 4º deste artigo, sem pendência de diligências [...] e achando-se em ordem a documentação, o oficial de registro de imóveis registrará a aquisição do imóvel com as descrições apresentadas, sendo permitida a abertura de matrícula, se for o caso. (Redação dada pela Lei nº 13.465, de 2017)

§ 8º Ao final das diligências, se a documentação não estiver em ordem, o oficial de registro de imóveis rejeitará o pedido.

§ 9º A rejeição do pedido extrajudicial não impede o ajuizamento de ação de usucapião.

§ 10. Em caso de impugnação justificada do pedido de reconhecimento extrajudicial de usucapião, o oficial de registro de imóveis remeterá os autos ao juízo competente da comarca da situação do imóvel, cabendo ao requerente emendar a petição inicial para adequá-la ao procedimento comum, porém, em caso de impugnação injustificada, esta não será admitida pelo registrador, cabendo ao interessado o manejo da suscitação de dúvida nos moldes do art. 198 desta Lei. (Redação dada pela Lei nº 14.382, de 2022)

§ 15. No caso de ausência ou insuficiência dos documentos de que trata o inciso IV do caput deste artigo, a posse e os demais dados necessários poderão ser comprovados em procedimento de justificação administrativa perante a serventia extrajudicial [...]"

## NOTA HONESTA DE REDAÇÃO (constatada na consulta)
- § 2º VIGENTE (Lei 13.465/2017): silêncio = CONCORDÂNCIA.
- Redação ORIGINAL (Lei 13.105/2015): silêncio = DISCORDÂNCIA. A divergência histórica importa para pedidos protocolados sob o regime antigo.

## Leitura aplicada
- Via administrativa SEM juiz — requisição por advogado; documentos I-IV obrigatórios.
- Notificações com prazo de 15 dias (titulares, entes públicos, edital).
- Rejeição não impede a via judicial (§ 9º); impugnação justificada desloca ao juízo (§ 10).`,
    metadados: { numero: 'Lei 6.015/1973 (Lei de Registros Públicos)', artigos_principais: ['216-A'], vigente: true, confirmacao_texto: 'Extração literal do texto oficial do Planalto em 2026-08-30 (marcadores de redação registrados como constam).' },
    tags: ['civil/propriedade', 'civil/usucapiao', 'processual-civil/registral'],
    fonte: PLANALTO,
    urlFonte: URL_L6015,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
  },
  {
    slug: 'cpc-arts-235-259-usucapiao-citacao-edital',
    titulo: 'CPC arts. 235 § 3º e 259 I — Citação pessoal dos confinantes e edital obrigatório na ação de usucapião (texto literal confirmado)',
    tipoDocumento: 'LEGISLACAO',
    area: 'processual-civil',
    subarea: 'propriedade',
    assunto: 'Procedimento judicial da usucapião — citações e edital',
    prioridade: 'P1',
    lote: 'LOTE-020',
    conteudo: `## Ficha da Norma
- **Norma:** Lei 13.105/2015 (Código de Processo Civil).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 235, § 3º. Na ação de usucapião de imóvel, os confinantes serão citados pessoalmente, exceto quando tiver por objeto unidade autônoma de prédio em condomínio, caso em que tal citação é dispensada.

Art. 259. Serão publicados editais:
I - na ação de usucapião de imóvel; [...]"

## NOTA HONESTA DE SISTEMA
- O CPC/2015 NÃO tem procedimento especial de ação de usucapião (diferente do CPC/73): aplica-se o procedimento COMUM + essas regras de citação/edital + art. 1.241 CC (sentença = título para registro).
- O litígio de POSSE tem capítulo próprio (arts. 561-567 — ações possessórias, doc próprio deste lote).

## Leitura aplicada
- Inicial da usucapião judicial deve designar todos os confinantes para citação PESSOAL (salvo unidade autônoma em condomínio).
- Edital obrigatório na ação de usucapião de imóvel — ciência de interessados incertos/desconhecidos.`,
    metadados: { numero: 'Lei 13.105/2015 (CPC)', artigos_principais: ['235 § 3º', '259 I'], vigente: true, confirmacao_texto: 'Extração literal do texto oficial do Planalto em 2026-08-30.' },
    tags: ['civil/usucapiao', 'processual-civil/citacoes-editais'],
    fonte: PLANALTO,
    urlFonte: URL_CPC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'cpc-arts-561-567-possessorias-texto-literal',
    titulo: 'CPC arts. 561-567 — Ações possessórias: prova, liminar, citação 15 dias e interdito proibitório (texto literal confirmado)',
    tipoDocumento: 'LEGISLACAO',
    area: 'processual-civil',
    subarea: 'propriedade',
    assunto: 'Manutenção, reintegração e interdito proibitório',
    prioridade: 'P1',
    lote: 'LOTE-020',
    conteudo: `## Ficha da Norma
- **Norma:** Lei 13.105/2015 (Código de Processo Civil) — arts. 561-567.

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30) — trechos essenciais
"Art. 561. Incumbe ao autor provar:
I - a sua posse;
II - a turbação ou o esbulho praticado pelo réu;
III - a data da turbação ou do esbulho;
IV - a continuação da posse, embora turbada, na ação de manutenção, ou a perda da posse, na ação de reintegração.

Art. 562. Estando a petição inicial devidamente instruída, o juiz deferirá, sem ouvir o réu, a expedição do mandado liminar de manutenção ou de reintegração, caso contrário, determinará que o autor justifique previamente o alegado, citando-se o réu para comparecer à audiência que for designada.
Parágrafo único. Contra as pessoas jurídicas de direito público não será deferida a manutenção ou a reintegração liminar sem prévia audiência dos respectivos representantes judiciais.

Art. 564. Concedido ou não o mandado liminar de manutenção ou de reintegração, o autor promoverá, nos 5 (cinco) dias subsequentes, a citação do réu para, querendo, contestar a ação no prazo de 15 (quinze) dias.

Art. 565. No litígio coletivo pela posse de imóvel, quando o esbulho ou a turbação afirmado na petição inicial houver ocorrido há mais de ano e dia, o juiz, antes de apreciar o pedido de concessão da medida liminar, deverá designar audiência de mediação, a realizar-se em até 30 (trinta) dias [...]
§ 5º Aplica-se o disposto neste artigo ao litígio sobre propriedade de imóvel.

Art. 567. O possuidor direto ou indireto que tenha justo receio de ser molestado na posse poderá requerer ao juiz que o segure da turbação ou esbulho iminente, mediante mandado proibitório em que se comine ao réu determinada pena pecuniária caso transgrida o preceito."

## Leitura aplicada
- **Carga da prova do autor (561):** posse + turbação/esbulho + DATA + continuação/perda.
- **Liminar (562):** deferida "sem ouvir o réu" se a inicial estiver instruída; contra PJ de direito público exige prévia audiência.
- **Citação (564):** autor promove em 5 dias; contestação em 15 dias.
- **Mediação obrigatória (565):** litígio COLETIVO com esbulho/turbação há > ano e dia — antes da liminar (aplica-se também a litígio sobre PROPRIEDADE — § 5º).
- **Interdito proibitório (567):** ameaça iminente + pena pecuniária (astreintes preventivas).

## Hipóteses de aplicação no EJC
- Ações possessórias como "vítima rápida" antes da via petitoria; interação com usucapião (posse para usucapião tem de ser sem oposição — liminar do réu pode quebrar o prazo).`,
    metadados: { numero: 'Lei 13.105/2015 (CPC)', artigos_principais: ['561', '562', '564', '565', '567'], vigente: true, confirmacao_texto: 'Extração literal do texto oficial do Planalto em 2026-08-30.' },
    tags: ['civil/propriedade', 'processual-civil/possessorias'],
    fonte: PLANALTO,
    urlFonte: URL_CPC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'tese-usucapiao-vias-judicial-extrajudicial',
    titulo: 'Tese — Usucapião: escolha da via (judicial × extrajudicial cartorial) e requisitos por espécie',
    tipoDocumento: 'TESE',
    area: 'civil',
    subarea: 'propriedade',
    assunto: 'Teoria da usucapião — rota processual',
    prioridade: 'P1',
    lote: 'LOTE-020',
    conteudo: `## Tese
A usucapião (modo ORIGINÁRIO de aquisição da propriedade pela posse qualificada durante o prazo legal) pode ser reconhecida: (1) pela VIA JUDICIAL — procedimento comum (o CPC/2015 não tem rito especial), com citação pessoal dos confinantes (CPC art. 235 § 3º) e edital (art. 259 I), sentença = título para registro (CC art. 1.241 p.ú.); (2) pela VIA EXTRAJUDICIAL — pedido direto no cartório (Lei 6.015 art. 216-A) com ata notarial, planta/memorial com ART, certidões negativas e justo título/documentos de posse, notificações de 15 dias e edital — SEM JUIZ.

## Fundamentos literais (Planalto, consulta 2026-08-30)
- CC arts. 1.238 (15/10), 1.239 (rural 5), 1.240 (urbana 5), 1.240-A (conjugal 2), 1.242 (ordinária 10/5), 1.243 (união de posses), 1.244 (causas da prescrição aplicáveis).
- Lei 6.015 art. 216-A: requisitos I-IV, §§ 2º-4º (15 dias), § 6º (registro), § 9º (rejeição não impede ação), § 10 (impugnação justificada → juízo).

## Requisitos de posse (ad usucapionem)
- Posse "como seu" (animus domini), pacífica, contínua, sem oposição; ATOS DE MERA TOLERÂNCIA não induzem posse (CC art. 1.208 — dispositivo da base).
- União de posses de antecessores (art. 1.243); causas da prescrição aplicáveis (art. 1.244).

## Riscos e escolha da via
- Extrajudicial: mais rápida e barata, MAS exige consentimento/notificações; impugnação justificada → desloca ao juízo (§ 10) e exige emenda da inicial.
- Judicial: adequada quando há oposição, terceiros incertos ou justa dúvida registral.
- Não se pode escolher a via extrajudicial quando a planta não alcança concordância dos confinantes e há impugnação justificada.`,
    tags: ['civil/usucapiao', 'civil/propriedade'],
    fonte: EJC,
    urlFonte: URL_CC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'lei-6015-art-216a-usucapiao-extrajudicial', tipo: 'FUNDAMENTA', descricao: 'Via extrajudicial literal.' },
      { destinoSlug: 'cc-arts-1238-1239-usucapiao-extraordinaria-rural', tipo: 'FUNDAMENTA', descricao: 'Prazos da usucapião.' },
    ],
  },
  {
    slug: 'peca-acao-usucapiao-modelo',
    titulo: 'Peça — Ação de usucapião (modelo com variáveis e checklist de confinantes/edital)',
    tipoDocumento: 'PECA',
    area: 'civil',
    subarea: 'propriedade',
    assunto: 'Peça-modelo com {{VARIÁVEIS}}',
    prioridade: 'P1',
    lote: 'LOTE-020',
    conteudo: `# AÇÃO DE USUCAPIÃO — MODELO EJC (PROCEDIMENTO COMUM)

**Anti-invenção:** preencher TODAS as {{VARIÁVEIS}}; conferir espécie (prazo aplicável) ANTES de protocolar; NÃO citar precedentes sem confirmação oficial.

---
EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA {{VARA}} DA COMARCA DE {{COMARCA}}/{{UF}}.

{{NOME_USUCAPIENTE}}, {{NACIONALIDADE}}, {{ESTADO_CIVIL}}, {{PROFISSAO}}, {{RG}}, {{CPF}}, residente em {{ENDERECO}}, por seu advogado (procuração anexa — {{OAB}}), vem propor AÇÃO DE USUCAPIÃO ({{ESPÉCIE: extraordinária 15/10 anos — art. 1.238; ordinária 10/5 — art. 1.242; especial urbana 5 — art. 1.240; especial rural 5 — art. 1.239; conjugal 2 — art. 1.240-A}}) em face de {{NOME_REU_PROPRIETARIO_APARENTE}} e demais interessados incertos e desconhecidos, pelos fatos e fundamentos a seguir.

## I — DO IMÓVEL E DAS PARTES
1. O imóvel objeto é {{DESCRICAO_IMOVEL}} ({{AREA_M2}}), situado em {{ENDERECO_IMOVEL}}, matrícula {{NUM_MATRICULA}} do {{CARTORIO_RGI}} {{SE_EXISTIR}}.
2. Confinantes a serem citados PESSOALMENTE (CPC art. 235 § 3º): {{NOME_CONFINANTE_1}}; {{NOME_CONFINANTE_2}}; {{NOME_CONFINANTE_N}}.

## II — DA POSSE E DO PRAZO
3. O requerente exerce posse "como seu", pacífica, contínua e incontestada desde {{DATA_INICIO_POSSE}} — {{TEMPO_TOTAL}} de posse ({{SE_ACESSIO: somado à posse dos antecessores, art. 1.243 — nomear antecessores e períodos}}).
4. A posse é qualificada para a espécie: {{REQUISITOS_ESPECIFICOS: moradia habitual/obra produtiva (1.238 p.ú.); justo título e boa-fé (1.242); área ≤ 250 m² urbana + não proprietário de outro imóvel (1.240); rural ≤ 50 ha + produtiva + moradia (1.239); exclusiva + ex-cônjuge abandonou o lar (1.240-A)}}.
5. Não houve oposição: {{PROVA_SEM_OPOSICAO}}. ATOS DE MERA TOLERÂNCIA não existiram (CC art. 1.208).

## III — DO DIREITO
- CC art. 1.238/1.239/1.240/1.240-A/1.242: prazo da espécie consumado.
- CC art. 1.241: a declaração judicial constituirá título hábil para o registro.
- CPC art. 259, I: publicação de EDITAL para interessados incertos e desconhecidos.
- CC art. 1.244: causas de impedimento/suspensão/interrupção não incidentes — {{VERIFICAR}}.

## IV — DOS PEDIDOS
a) a citação pessoal dos confinantes e do réu {{E_ENTES_FEDERATIVOS_SE_REQUERIDO}};
b) a publicação de EDITAL (CPC art. 259 I);
c) a DECLARAÇÃO da aquisição da propriedade por usucapião;
d) a expedição de mandado ao {{CARTORIO_RGI}} para registro da sentença (CC art. 1.241 p.ú.);
e) perícia topográfica {{SE_NECESSARIA}};
f) justiça gratuita {{SE_CABIVEL}}.

Dá-se à causa o valor de {{VALOR_DA_CAUSA}}.
{{LOCAL}}, {{DATA}}.
{{NOME_ADVOGADO}} — OAB/{{UF}} {{NUM_OAB}}

## CHECKLIST EJC (antes do protocolo)
- [ ] Espécie correta com prazo consumido (15/10/5/2).
- [ ] Confinantes identificados para citação pessoal (ou unidade autônoma — dispensa).
- [ ] Justo título e boa-fé provados (se ordinária).
- [ ] Planta/memorial com ART do profissional.
- [ ] Sem oposição no período; tolerância descartada (1.208).
- [ ] União de posses documentada (1.243), se usada.`,
    tags: ['civil/usucapiao', 'civil/propriedade'],
    fonte: EJC,
    urlFonte: URL_CC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'checklist-usucapiao-extrajudicial-216a',
    titulo: 'Checklist — Usucapião extrajudicial no cartório (art. 216-A, Lei 6.015): 14 pontos',
    tipoDocumento: 'CHECKLIST',
    area: 'civil',
    subarea: 'propriedade',
    assunto: 'Roteiro operacional da via cartorial',
    prioridade: 'P1',
    lote: 'LOTE-020',
    conteudo: `# CHECKLIST EJC — USUCAPIÃO EXTRAJUDICIAL (Lei 6.015, art. 216-A)

## A — Cabimento
- [ ] 1. Imóvel usucapiendo: prazo da espécie CONSUMIDO (15/10/5/2 anos).
- [ ] 2. Sem conflito de posse atual (impugnação justificada desloca ao juízo — § 10).

## B — Documentos obrigatórios (incisos I-IV)
- [ ] 3. ATA NOTARIAL atestando o tempo de posse do requerente e antecessores (inciso I — red. Lei 13.465/2017).
- [ ] 4. PLANTA E MEMORIAL DESCRIPTIVO assinados por profissional habilitado + ART no conselho (inciso II).
- [ ] 5. Assinatura da planta pelos titulares de direitos do imóvel usucapiendo E dos confinantes (ou notificação — § 2º).
- [ ] 6. CERTIDÕES NEGATIVAS dos distribuidores da comarca do imóvel E do domicílio do requerente (inciso III).
- [ ] 7. Justo título ou documentos de posse: pagamentos de IMPOSTOS/taxas, contas, fotos datadas (inciso IV).

## C — Notificações e prazos (15 dias)
- [ ] 8. Titular não signatário: notificação pessoal/correio AR; SILÊNCIO = CONCORDÂNCIA (redação vigente, Lei 13.465/2017 — nota: redação original de 2015 dizia discordância).
- [ ] 9. Ciência à União/Estado/DF/Município — 15 dias (§ 3º).
- [ ] 10. EDITAL em jornal de grande circulação para terceiros — 15 dias (§ 4º).
- [ ] 11. Condomínio edilício: dispensa dos confinantes, basta síndico (§§ 11-12); notificando incerto: edital 2× × 15 dias (§ 13).

## D — Desfechos
- [ ] 12. Documentação em ordem + 15 dias do edital → REGISTRO da aquisição / abertura de matrícula (§ 6º).
- [ ] 13. Documentação em desordem → REJEIÇÃO (§ 8º) — que NÃO impede a ação judicial (§ 9º).
- [ ] 14. Impugnação justificada → autos ao juízo; emendar a inicial para procedimento comum (§ 10); impugnação injustificada → suscitação de dúvida (art. 198 da mesma Lei).`,
    tags: ['civil/usucapiao', 'processual-civil/registral'],
    fonte: EJC,
    urlFonte: URL_L6015,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'fluxo-usucapiao-extrajudicial-etapas',
    titulo: 'Fluxo — Usucapião extrajudicial: da ata notarial ao registro da aquisição',
    tipoDocumento: 'FLUXO',
    area: 'civil',
    subarea: 'propriedade',
    assunto: 'Mapa evento → prazo → providência → risco',
    prioridade: 'P1',
    lote: 'LOTE-020',
    conteudo: `# FLUXO EJC — USUCAPIÃO EXTRAJUDICIAL (Lei 6.015, art. 216-A)

## Etapa 1 — Pré-análise
- Evento: cliente com posse qualificada e prazo consumido.
- Providência: confirmar espécie/prazo (CC 1.238-1.242-A); levantar matrícula e confinantes.
- Risco: posse com oposição recente → via judicial.

## Etapa 2 — Documentação
- Providência: ata notarial de posse; planta + memorial com ART; certidões negativas (distribuidores do imóvel e do domicílio); impostos/documentos (incisos I-IV); justificação administrativa se documentos insuficientes (§ 15).
- Risco: ausência de ART/impostos → rejeição.

## Etapa 3 — Protocolo no cartório
- Providência: requerimento por advogado no RGI da situação do imóvel; prenotação prorrogada até o desfecho (§ 1º).
- Risco: cartório de registro errado.

## Etapa 4 — Notificações (15 dias cada)
- Titulares não signatários: pessoal/AR — SILÊNCIO = CONCORDÂNCIA (§ 2º, red. Lei 13.465/2017).
- Entes federativos: 15 dias (§ 3º).
- Edital em jornal de grande circulação: 15 dias (§ 4º).
- Risco: impugnação JUSTIFICADA → remessa ao juízo + emenda da inicial (§ 10).

## Etapa 5 — Diligências
- Registrador pode requerer diligências para elucidar dúvidas (§ 5º).

## Etapa 6 — Registro
- Documentação em ordem → registro da aquisição / abertura de matrícula (§ 6º).
- Desordem → rejeição (§ 8º) — NÃO impede ação judicial (§ 9º); suscitação de dúvida como recurso (§ 7º e art. 198).`,
    tags: ['civil/usucapiao', 'processual-civil/registral'],
    fonte: EJC,
    urlFonte: URL_L6015,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'tabela-documentos-usucapiao',
    titulo: 'Tabela — Documentos necessários: usucapião (judicial e extrajudicial)',
    tipoDocumento: 'TABELA_DOCUMENTOS',
    area: 'civil',
    subarea: 'propriedade',
    assunto: 'Dossiê documental por fase',
    prioridade: 'P2',
    lote: 'LOTE-020',
    conteudo: `# TABELA EJC — DOCUMENTOS POR FASE (USUCAPIÃO)

| Fase | Documento | Função |
|---|---|---|
| Pré | Matrícula/averbações atualizadas | Situação registral, titular aparente, ônus |
| Pré | Ata notarial de posse (tabelião) | Tempo de posse — inciso I do 216-A |
| Pré | Planta + memorial descritivo + ART | Delimitação — inciso II |
| Pré | Certidões negativas de distribuição (imóvel e domicílio) | Inciso III |
| Pré | IPTU/contas/recibos datados | "Justo título ou outros documentos" — inciso IV |
| Judicial | Designação dos confinantes | Citação pessoal (CPC 235 § 3º) |
| Judicial | Pedido de edital | Interessados incertos (CPC 259 I) |
| Judicial | Perícia topográfica (se litigioso) | Delimitação técnica |
| Extrajudicial | Notificações/AR e mandado do edital | Prazos de 15 dias (§§ 2º-4º) |
| Desfecho | Sentença/pedido registrado no RGI | Título para registro (CC 1.241 p.ú.; § 6º do 216-A) |

**Aviso:** adaptar ao caso concreto.`,
    tags: ['civil/usucapiao', 'geral/metodologia'],
    fonte: EJC,
    urlFonte: URL_CC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'triagem-usucapiao-perguntas',
    titulo: 'Triagem — Usucapião: roteiro de entrevista e classificação (12 perguntas)',
    tipoDocumento: 'TRIAGEM',
    area: 'civil',
    subarea: 'propriedade',
    assunto: 'Roteiro de classificação do caso',
    prioridade: 'P2',
    lote: 'LOTE-020',
    conteudo: `# TRIAGEM EJC — USUCAPIÃO

1. O imóvel é urbano ou rural? Qual a área (m²/hectares)?
2. Desde quando o cliente (ou antecessores) exerce a posse? Há união de posses (art. 1.243)?
3. A posse é "como seu", pacífica, contínua e SEM OPOSIÇÃO? Houve ações/mesmo e-mail de oposição?
4. A posse decorre de mera permissão/tolerância do proprietário (CC art. 1.208)?
5. O cliente tem justo título (contrato, cessão) e boa-fé? (ordinária — art. 1.242)
6. O imóvel foi comprado com base em registro cancelado depois? + moradia/investimento? (§ único do 1.242)
7. O cliente tem moradia habitual ou obra/produto no imóvel? (§ único do 1.238)
8. O cliente é proprietário de OUTRO imóvel (urbano/rural)? (vedação das especiais — arts. 1.239/1.240/1.240-A)
9. Se conjugal: o ex-cônjuge/companheiro abandonou o lar? posse direta e exclusiva? (1.240-A)
10. Há pagamento de impostos/documentos de posse suficientes para o inciso IV do 216-A?
11. Quem são os confinantes e titulares da matrícula? Assinariam a planta?
12. Objetivo: regularização rápida no cartório (216-A) ou via judicial (com oposição)?

## Classificação SE-ENTÃO
- 15 anos sem título → EXTRAORDINÁRIA (10 se moradia/produção).
- ≤50 ha rural + produtiva + moradia + não proprietário → ESPECIAL RURAL.
- ≤250 m² urbana + moradia + não proprietário → ESPECIAL URBANA.
- 2 anos + ex abandonou o lar + exclusiva → CONJUGAL.
- Justo título + boa-fé 10 anos (5 se registro cancelado) → ORDINÁRIA.`,
    tags: ['civil/usucapiao', 'geral/triagem'],
    fonte: EJC,
    urlFonte: URL_CC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'prazo-usucapiao-extraordinaria-15-anos',
    titulo: 'Prazo — Usucapião extraordinária: 15 anos (10 com moradia/produção) (CC art. 1.238)',
    tipoDocumento: 'PRAZO',
    area: 'civil',
    subarea: 'propriedade',
    assunto: 'Posse sem título e sem oposição de imóvel',
    prioridade: 'P1',
    lote: 'LOTE-020',
    conteudo: `## Situação
Possuidor sem justo título e sem exigência de boa-fé pretende a declaração de propriedade.

## Prazo
**15 anos — reduzido a 10 com moradia habitual ou obra/serviço produtivo (CC, art. 1.238)**

## Fundamento
Art. 1.238: "Aquele que, por quinze anos, sem interrupção, nem oposição, possuir como seu um imóvel, adquire-lhe a propriedade, independentemente de título e boa-fé..." (§ único: redução a 10).

## Termo inicial
Início da posse qualificada (sem interrupção nem oposição); união de posses possível (art. 1.243).

## Forma de contagem
Causas que obstam, suspendem ou interrompem a prescrição aplicam-se (art. 1.244 — CC arts. 197-204).

## Exceções
Espécies com prazos próprios: 5 anos (rural/urbana), 2 anos (conjugal), 10/5 anos (ordinária).

## Observações
Sentença = título para o registro (art. 1.238, in fine; art. 1.241 p.ú.).
**AVISO EJC:** validar à luz do caso concreto.`,
    metadados: { prazo: '15 anos (10 com moradia/produção)', fundamento: 'CC art. 1.238', termoInicial: 'Início da posse qualificada', contagem: 'Regras da prescrição (art. 1.244)' },
    tags: ['civil/usucapiao', 'geral/prazos'],
    fonte: PLANALTO,
    urlFonte: URL_CC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'prazo-usucapiao-urbana-rural-5-anos',
    titulo: 'Prazo — Usucapião especial urbana e rural: 5 anos (CC arts. 1.239 e 1.240)',
    tipoDocumento: 'PRAZO',
    area: 'civil',
    subarea: 'propriedade',
    assunto: 'Regularização de pequenas áreas com moradia/produtividade',
    prioridade: 'P1',
    lote: 'LOTE-020',
    conteudo: `## Situação
Posse de área urbana ≤ 250 m² com moradia, ou rural ≤ 50 hectares produtiva com moradia.

## Prazo
**5 anos ininterruptos e sem oposição (CC, arts. 1.239 e 1.240)**

## Fundamento
Art. 1.239 (rural: ≤50 ha, produtiva por trabalho próprio/família, moradia, não proprietário de imóvel rural ou urbano); art. 1.240 (urbana: ≤250 m², moradia própria/família, não proprietário de outro imóvel urbano ou rural).

## Termo inicial
Início da posse com os requisitos da espécie (ex.: moradia estabelecida).

## Forma de contagem
Causas da prescrição aplicáveis (art. 1.244); união de posses possível (art. 1.243).

## Exceções
Direito das especiais reconhecido ao mesmo possuidor UMA única vez (art. 1.240 § 2º).

## Observações
Título conferido a homem/mulher/ambos independentemente do estado civil (art. 1.240 § 1º).
**AVISO EJC:** validar à luz do caso concreto.`,
    metadados: { prazo: '5 anos', fundamento: 'CC arts. 1.239 e 1.240', termoInicial: 'Início da posse com requisitos da espécie', contagem: 'Regras da prescrição (art. 1.244)' },
    tags: ['civil/usucapiao', 'geral/prazos'],
    fonte: PLANALTO,
    urlFonte: URL_CC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'prazo-usucapiao-conjugal-2-anos',
    titulo: 'Prazo — Usucapião conjugal: 2 anos (CC art. 1.240-A)',
    tipoDocumento: 'PRAZO',
    area: 'civil',
    subarea: 'propriedade',
    assunto: 'Ex-cônjuge/companheiro abandonou o lar — posse direta exclusiva',
    prioridade: 'P1',
    lote: 'LOTE-020',
    conteudo: `## Situação
Ex-cônjuge/ex-companheiro que abandonou o lar; o que permaneceu exerce posse direta, exclusiva e sem oposição sobre imóvel urbano ≤ 250 m² de propriedade comum.

## Prazo
**2 anos ininterruptos e sem oposição (CC, art. 1.240-A — incluído pela Lei 12.424/2011)**

## Fundamento
Art. 1.240-A: posse direta com exclusividade + imóvel urbano ≤250 m² + propriedade dividida com ex que abandonou o lar + moradia própria/família + não ser proprietário de outro imóvel → domínio INTEGRAL.

## Termo inicial
Início da posse exclusiva qualificada (após o abandono do lar).

## Forma de contagem
Causas da prescrição aplicáveis (art. 1.244).

## Exceções
Direito reconhecido uma única vez (§ 1º); § 2º VETADO no texto oficial (registrado como consta).

## Observações
"Abandono do lar" é fato a PROVAR — separação de fato objetiva e subjetiva (partilha dos objetivos de vida).
**AVISO EJC:** validar à luz do caso concreto.`,
    metadados: { prazo: '2 anos', fundamento: 'CC art. 1.240-A', termoInicial: 'Início da posse exclusiva pós-abandono', contagem: 'Regras da prescrição (art. 1.244)' },
    tags: ['civil/usucapiao', 'civil/familia'],
    fonte: PLANALTO,
    urlFonte: URL_CC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'prazo-usucapiao-extrajudicial-notificacoes-15-dias',
    titulo: 'Prazo — Notificações e edital na usucapião extrajudicial: 15 dias (Lei 6.015, art. 216-A §§ 2º-4º)',
    tipoDocumento: 'PRAZO',
    area: 'civil',
    subarea: 'propriedade',
    assunto: 'Manifestações no procedimento cartorial',
    prioridade: 'P1',
    lote: 'LOTE-020',
    conteudo: `## Situação
Pedido extrajudicial de usucapião protocolado no registro de imóveis — manifestações de titulares, entes federativos e terceiros.

## Prazo
**15 dias, cada manifestação (Lei 6.015/73, art. 216-A, §§ 2º, 3º e 4º)**

## Fundamento
§ 2º: titular não signatário da planta — silêncio interpretado como CONCORDÂNCIA (redação vigente, Lei 13.465/2017); § 3º: ciência à União/Estado/DF/Município; § 4º: edital em jornal de grande circulação para terceiros.

## Termo inicial
Notificação (pessoal/correio AR), ciência ao ente, ou publicação do edital, conforme o caso.

## Forma de contagem
Dias corridos (prazo material do procedimento registral).

## Exceções
Notificando incerto: edital 2× × 15 dias (§ 13); condomínio: basta o síndico (§§ 11-12).

## Observações
Rejeição do pedido não impede a ação judicial (§ 9º); impugnação justificada desloca ao juízo (§ 10).
**AVISO EJC:** validar à luz do caso concreto e da regulamentação cartorial local.`,
    metadados: { prazo: '15 dias (cada manifestação)', fundamento: 'Lei 6.015/73, art. 216-A §§ 2º-4º', termoInicial: 'Notificação/ciência/publicação do edital', contagem: 'Dias corridos' },
    tags: ['civil/usucapiao', 'processual-civil/registral'],
    fonte: PLANALTO,
    urlFonte: URL_L6015,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'prazo-possessoria-citacao-15-dias-liminar',
    titulo: 'Prazo — Ação possessória: citação do réu em 5 dias pelo autor e contestação em 15 dias (CPC art. 564)',
    tipoDocumento: 'PRAZO',
    area: 'processual-civil',
    subarea: 'propriedade',
    assunto: 'Procedimento das ações possessórias',
    prioridade: 'P1',
    lote: 'LOTE-020',
    conteudo: `## Situação
Ação de manutenção/reintegração de posse — citação e defesa do réu após liminar.

## Prazo
**Citação promovida pelo autor nos 5 dias seguintes; contestação do réu em 15 dias (CPC, art. 564)**

## Fundamento
Art. 564: "Concedido ou não o mandado liminar de manutenção ou de reintegração, o autor promoverá, nos 5 (cinco) dias subsequentes, a citação do réu para, querendo, contestar a ação no prazo de 15 (quinze) dias."

## Termo inicial
Concessão (ou não) do mandado liminar.

## Forma de contagem
Dias úteis processuais (CPC art. 219).

## Exceções
Justificação prévia: prazo de contestação conta da intimação da decisão que deferir/não deferir a liminar (§ único do 564); litígio coletivo com esbulho/turbação > ano e dia: mediação antes da liminar (art. 565).

## Observações
Prova do autor (art. 561): posse, turbação/esbulho, DATA, continuação/perda.
**AVISO EJC:** validar à luz do caso concreto.`,
    metadados: { prazo: '5 dias (citação) / 15 dias (contestação)', fundamento: 'CPC art. 564', termoInicial: 'Concessão ou não do mandado liminar', contagem: 'Dias úteis (CPC art. 219)' },
    tags: ['processual-civil/possessorias', 'geral/prazos'],
    fonte: PLANALTO,
    urlFonte: URL_CPC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'argumentacao-usucapiao-dois-lados',
    titulo: 'Argumentação — Usucapião: tese do usucapiente × defesa do proprietário (4 controvérsias)',
    tipoDocumento: 'ARGUMENTACAO',
    area: 'civil',
    subarea: 'propriedade',
    assunto: 'Análise bilateral da controvérsia',
    prioridade: 'P2',
    lote: 'LOTE-020',
    conteudo: `# ARGUMENTAÇÃO BILATERAL EJC — USUCAPIÃO

## Controvérsia 1 — A posse é "como seu" e sem oposição?
**Usucapiente:** ata notarial, impostos, fotos datadas, testemunhas — exercício de fato de domínio (CC 1.238).
**Proprietário:** posse derivada de contrato de aluguel/cedência (mora tolerância); oposição concreta (notificações, ações); CC 1.208 — mera permissão/tolerância NÃO induz posse.

## Controvérsia 2 — O prazo está consumado (espécie correta)?
**Usucapiente:** contagem com união de posses (1.243); redução do 1.238 p.ú. (moradia/produção).
**Proprietário:** interrupções/suspensões do art. 1.244 (citação anterior, incapazes); descontinuidade (abandono temporário longo); espécie errada impede redução (ex.: usar 1.238 p.ú. sem moradia PROVADA).

## Controvérsia 3 — Requisitos especiais presentes?
**Usucapiente:** área ≤ limite, moradia/produtividade documentadas, não-proprietariedade (certidões).
**Proprietário:** área real > 250 m²/50 ha (perícia); requerente proprietário de outro imóvel; "moradia" apenas eventual; produtividade ficta.

## Controvérsia 4 — Via extrajudicial cabível?
**Requerente:** documentos I-IV completos; confinantes signatários ou silêncio = concordância (red. vigente); agilidade.
**Impugnante:** impugnação JUSTIFICADA (limite exato, fraude na planta, conflito real) → remessa ao juízo (§ 10); suscitação de dúvida (§ 7º/198) para vícios registrais.`,
    tags: ['civil/usucapiao', 'geral/metodologia'],
    fonte: EJC,
    urlFonte: URL_CC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'doutrina-usucapiao-posse-ad-usucapionem',
    titulo: 'Doutrina — Usucapião: posse ad usucapionem, espécies e modo originário de aquisição (EJC)',
    tipoDocumento: 'DOUTRINA',
    area: 'civil',
    subarea: 'propriedade',
    assunto: 'Conceitos técnicos do instituto',
    prioridade: 'P2',
    lote: 'LOTE-020',
    conteudo: `# DOUTRINA EJC — USUCAPIÃO (CONCEITOS PRÓPRIOS)

## Natureza
Modo ORIGINÁRIO de aquisição da propriedade: o direito nasce do FATO da posse qualificada pelo prazo — não depende da relação jurídica com o proprietário anterior (diferente da transmissão registrada — CC art. 1.245).

## Posse ad usucapionem
Posse qualificada: (1) exercício "como seu" (animus domini); (2) pacífica (sem violência); (3) contínua (sem lapsos relevantes); (4) sem oposição; (5) NÃO derivada de mera tolerância (CC 1.208). A posse de má-fé serve às espécies sem exigência de boa-fé (extraordinária), mas nunca à ordinária.

## Espécies e prazos (CC 1.238-1.242-A)
- Extraordinária: 15/10 — sem título/boa-fé.
- Ordinária: 10 (5 registro cancelado) — justo título + boa-fé.
- Especial urbana: 5 — ≤250 m², moradia, não proprietário.
- Especial rural: 5 — ≤50 ha, produtiva, moradia, não proprietário.
- Conjugal: 2 — exclusiva + ex abandonou o lar.
- Coletiva extensa (§§ 4º-5º do art. 1.228): >5 anos, boa-fé, número considerável de pessoas, obras/serviços de interesse social — indenização ao proprietário e sentença como título.

## Conexões
- Acessio possessionis (1.243): união de posses com antecessores.
- Art. 1.244: regime prescricional aplicado (obsta/suspende/interrompe).
- Via extrajudicial (Lei 6.015 art. 216-A): desjudicialização com guarda de igual eficácia registral.

## Honestidade EJC
Conceituação técnica própria; textos literais do Planalto na consulta de 2026-08-30.`,
    tags: ['civil/usucapiao', 'geral/metodologia'],
    fonte: EJC,
    urlFonte: URL_CC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'regra-se-usucapiao-diagnostico-especie-via',
    titulo: 'Regra SE-ENTÃO — Diagnóstico de espécie e via da usucapião',
    tipoDocumento: 'REGRA_INTELIGENCIA',
    area: 'civil',
    subarea: 'propriedade',
    assunto: 'Inteligência interpretável EJC',
    prioridade: 'P1',
    lote: 'LOTE-020',
    conteudo: `# REGRA SE-ENTÃO EJC — USUCAPIÃO: ESPÉCIE E VIA

**SE** posse de imóvel há 15 anos (sem título, sem boa-fé exigida) **ENTÃO** EXTRAORDINÁRIA (art. 1.238);
**SE** além disso há moradia habitual OU obra/serviço produtivo **ENTÃO** prazo de 10 anos (§ único).

**SE** área RURAL ≤ 50 ha + produtiva pelo trabalho + moradia + não proprietário de imóvel (rural OU urbano) **ENTÃO** ESPECIAL RURAL — 5 anos (art. 1.239).

**SE** área URBANA ≤ 250 m² + moradia própria/família + não proprietário de outro imóvel **ENTÃO** ESPECIAL URBANA — 5 anos (art. 1.240).

**SE** posse direta EXCLUSIVA por 2 anos + imóvel urbano ≤ 250 m² + propriedade dividida com ex-cônjuge/companheiro que abandonou o lar **ENTÃO** CONJUGAL — 2 anos (art. 1.240-A).

**SE** justo título + boa-fé + 10 anos **ENTÃO** ORDINÁRIA (art. 1.242); **SE** além disso aquisição onerosa com base em registro cancelado + moradia/investimento **ENTÃO** 5 anos (§ único).

**SE** há impugnação/oposição atual OU confinantes não assinarão a planta **ENTÃO** VIA JUDICIAL (procedimento comum + citação pessoal dos confinantes — CPC 235 § 3º + edital — CPC 259 I).
**SE** documentação I-IV completa e consentimentos alcançáveis **ENTÃO** VIA EXTRAJUDICIAL (Lei 6.015, art. 216-A) — rejeição não impede a ação (§ 9º).

**SE** a posse decorre de mera permissão/tolerância **ENTÃO** NÃO há usucapião (CC 1.208) — informar com honestidade.`,
    tags: ['civil/usucapiao', 'geral/metodologia'],
    fonte: EJC,
    urlFonte: URL_CC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'jurimetria-vazia-usucapiao',
    titulo: 'Jurimetria — Usucapião (estrutura vazia — sem dados reais)',
    tipoDocumento: 'JURIMETRIA',
    area: 'civil',
    subarea: 'propriedade',
    assunto: 'Estrutura para dados futuros',
    prioridade: 'P3',
    lote: 'LOTE-020',
    conteudo: `# JURIMETRIA — USUCAPIÃO
**Status: SEM DADOS.** Nenhuma estatística real nesta consulta (2026-08-30) — o EJC NÃO inventa percentuais (item 18 da missão).

## Campos preparados
- tribunal/cartório/período/amostra/metodologia/fonte;
- indicadores futuros: taxa de deferimento por espécie; tempo médio da via extrajudicial × judicial; frequência de remessa ao juízo por impugnação justificada (§ 10 do 216-A).

## Separação obrigatória: DADO ESTATÍSTICO REAL (com fonte) × ANÁLISE QUALITATIVA.`,
    tags: ['civil/usucapiao', 'geral/metodologia'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
];
