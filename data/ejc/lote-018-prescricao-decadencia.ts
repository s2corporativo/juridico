// LOTE-018 — Prescrição e decadência civis — CC arts. 189-210 (P1, base transversal)
// Textos LITERAIS extraídos do Planalto em 2026-08-30:
// https://www.planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm
//
// ANTI-INVENÇÃO desta rodada (constatações do texto oficial):
// - Art. 194 CC: (Revogado pela Lei nº 11.280, de 2006) — NÃO vigente.
// - Art. 206 § 1º II: (Revogado pela Lei nº 15.040, de 2024) — NÃO vigente.
// - Art. 206-A: prescrição intercorrente (Redação dada pela Lei nº 14.382, de 2022),
//   remissiva ao art. 921 CPC — dispositivo NOVO e vigente.
// - Súmula 150/STF confirmada por enunciado verbatim em fontes institucionais
//   (portal STF bloqueado por 403 na consulta → confiabilidade B honesta).
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
    slug, titulo, tipoDocumento: 'LEGISLACAO', area: 'civil', subarea: 'decadencia-prescricao',
    assunto, prioridade: 'P1', lote: 'LOTE-018',
    conteudo,
    metadados: { numero: 'Lei 10.406/2002 (Código Civil)', data_norma: '2002-01-11', orgao: 'Congresso Nacional', artigos_principais: artigos, vigente: true, confirmacao_texto: 'Extração literal do texto oficial do Planalto em 2026-08-30 (marcadores de revogação registrados como constam).' },
    tags: ['civil/decadencia-prescricao', 'geral/prazos'],
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
    'cc-arts-189-190-196-pretensao',
    'CC arts. 189, 190 e 196 — Nasce a pretensão; a exceção prescreve no mesmo prazo; sucessor (texto literal confirmado)',
    'Prescrição — fundamentos',
    `## Ficha da Norma
- **Norma:** Lei 10.406/2002 (Código Civil) — Livro III, Título I "Da Prescrição".

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 189. Violado o direito, nasce para o titular a pretensão, a qual se extingue, pela prescrição, nos prazos a que aludem os arts. 205 e 206.

Art. 190. A exceção prescreve no mesmo prazo em que a pretensão.

Art. 196. A prescrição iniciada contra uma pessoa continua a correr contra o seu sucessor."

## Leitura aplicada
- **Termo inicial geral (art. 189):** a VIOLAÇÃO do direito (a pretensão nasce) — prescrição é EXTINÇÃO da pretensão pelos prazos dos arts. 205/206.
- **Exceção (art. 190):** quem é demandado e opõe exceção também opera com prazos prescricionais simétricos.
- **Continuidade contra o sucessor (art. 196)** — protege a contraparte contra "reinício" por transmissão do devedor.

## Hipóteses de aplicação no EJC
- Diagnóstico: identificar o ato de violação para fixar o termo inicial antes de olhar o prazo (art. 206).`,
    ['189', '190', '196'],
    {
      relacionamentos: [
        { destinoSlug: 'cc-art-205-prescricao-geral-dez-anos', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Prazos: art. 205 (geral).' },
        { destinoSlug: 'cc-art-206-prazos-especiais', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Prazos: art. 206 (especiais).' },
      ],
    },
  ),
  leiCc(
    'cc-arts-191-195-193-renuncia-alegacao',
    'CC arts. 191-195 — Renúncia da prescrição, imodificabilidade, alegação em qualquer grau; relativamente incapazes e PJ contra assistentes (texto literal confirmado)',
    'Prescrição — regras gerais',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 191. A renúncia da prescrição pode ser expressa ou tácita, e só valerá, sendo feita, sem prejuízo de terceiro, depois que a prescrição se consumar; tácita é a renúncia quando se presume de fatos do interessado, incompatíveis com a prescrição.

Art. 192. Os prazos de prescrição não podem ser alterados por acordo das partes.

Art. 193. A prescrição pode ser alegada em qualquer grau de jurisdição, pela parte a quem aproveita.

Art. 194.
(Revogado pela Lei nº 11.280, de 2006)

Art. 195. Os relativamente incapazes e as pessoas jurídicas têm ação contra os seus assistentes ou representantes legais, que derem causa à prescrição, ou não a alegarem oportunamente."

## Leitura aplicada
- **Renúncia (art. 191):** só DEPOIS de consumada a prescrição e sem prejuízo de terceiro; tácita por fatos incompatíveis.
- **Prazos imodificáveis (art. 192):** acordo entre partes não estende nem reduz.
- **Qualquer grau (art. 193):** a prescrição pode ser alegada também em instância recursal (regra processual complementar do CPC).
- **Art. 194 REVOGADO** (Lei 11.280/2006): atualmente o juiz pode conhecer de ofício da PRESCRIÇÃO por determinação processual (CPC art. 487 § 1º e art. 921 § 5º) — o EJC NÃO cita o art. 194 como norma civil vigente.
- **Art. 195:** ação dos relativamente incapazes e PJ contra assistentes/representantes que derem causa à prescrição.`,
    ['191', '192', '193', '195', '194 (revogado)'],
  ),
  leiCc(
    'cc-arts-197-203-impedem-suspendem',
    'CC arts. 197-203 — Causas que impedem ou suspendem a prescrição (texto literal confirmado)',
    'Prescrição — impedimento e suspensão',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 197. Não corre a prescrição:
I - entre os cônjuges, na constância da sociedade conjugal;
II - entre ascendentes e descendentes, durante o poder familiar;
III - entre tutelados ou curatelados e seus tutores ou curadores, durante a tutela ou curatela.

Art. 198. Também não corre a prescrição:
I - contra os incapazes de que trata o art. 3º;
II - contra os ausentes do País em serviço público da União, dos Estados ou dos Municípios;
III - contra os que se acharem servindo nas Forças Armadas, em tempo de guerra.

Art. 199. Não corre igualmente a prescrição:
I - pendendo condição suspensiva;
II - não estando vencido o prazo;
III - pendendo ação de evicção.

Art. 200. Quando a ação se originar de fato que deva ser apurado no juízo criminal, não correrá a prescrição antes da respectiva sentença definitiva.

Art. 201. Suspensa a prescrição em favor de um dos credores solidários, só aproveitam os outros se a obrigação for indivisível.

Art. 203. A prescrição pode ser interrompida por qualquer interessado."

## Leitura aplicada
- **NÃO corre (impede/suspende):** relações familiares/tutela (197); contra incapazes do art. 3º, ausentes no serviço público, Forças Armadas em guerra (198); condição suspensiva, prazo não vencido, evicção pendente (199); fato dependente de esfera criminal até sentença definitiva (200).
- **Solidariedade (201):** suspensão em favor de um credor solidário só aproveita os outros se indivisível a obrigação.
- **Art. 203:** qualquer interessado pode interromper (remissão à interrupção — art. 202, doc vinculado).

## Hipóteses de aplicação no EJC
- Termo inicial: computar as causas de não-fluência ANTES de declarar prescrito um prazo.`,
    ['197', '198', '199', '200', '201', '203'],
    {
      relacionamentos: [
        { destinoSlug: 'cc-art-202-interrompem-prescricao', tipo: 'REFINA', descricao: 'Interrupção (efeito diverso da suspensão).' },
      ],
    },
  ),
  leiCc(
    'cc-art-202-interrompem-prescricao',
    'CC art. 202 — Interrupção da prescrição: 6 hipóteses, uma única vez, recomeço do prazo (texto literal confirmado)',
    'Prescrição — interrupção',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 202. A interrupção da prescrição, que somente poderá ocorrer uma vez, dar-se-á:
I - por despacho do juiz, mesmo incompetente, que ordenar a citação, se o interessado a promover no prazo e na forma da lei processual;
II - por protesto, nas condições do inciso antecedente;
III - por protesto cambial;
IV - pela apresentação do título de crédito em juízo de inventário ou em concurso de credores;
V - por qualquer ato judicial que constitua em mora o devedor;
VI - por qualquer ato inequívoco, ainda que extrajudicial, que importe reconhecimento do direito pelo devedor.

Parágrafo único. A prescrição interrompida recomeça a correr da data do ato que a interrompeu, ou do último ato do processo para a interromper."

## Leitura aplicada
- **Uma única vez** — segunda interrupção é juridicamente ineficaz (texto: "somente poderá ocorrer uma vez").
- **6 hipóteses:** despacho de citação (mesmo juiz incompetente!), protesto, protesto cambial, título em inventário/concurso, ato judicial que constitua em mora, ato inequívoco do devedor que reconheça o direito (mesmo extrajudicial).
- **Recomeço (p.ú.):** da data do ato interruptivo ou do último ato do processo — o prazo INTEIRA volta a correr (diferente de "completar" o que faltava).
- **Solidariedade (art. 204):** interrupção por um credor solidário aproveita aos outros; contra devedor solidário envolve os demais; contra o principal prejudica o fiador (§ 3º) — texto literal no doc do sistema.

## Hipóteses de aplicação no EJC
- Negociação: proposta de parcelamento assinada pelo devedor pode ser ato inequívoco (inciso VI) — documentar tudo.
- Controle: verificar se já houve interrupção anterior antes de contar com nova.`,
    ['202', '202 p.ú.', '204', '204 § 3º'],
  ),
  leiCc(
    'cc-art-205-prescricao-geral-dez-anos',
    'CC art. 205 — Prescrição residual de 10 anos (texto literal confirmado)',
    'Prazo geral',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 205. A prescrição ocorre em dez anos, quando a lei não lhe haja fixado prazo menor."

## Leitura aplicada
- **Prazo residual:** aplica-se somente QUANDO a lei não fixar prazo menor — examinar sempre primeiro o art. 206 (e leis especiais).
- Contagem civil (dias corridos — CC art. 132; EJC avisa: prazo de prescrição NÃO é prazo processual em dias úteis).

## Hipóteses de aplicação no EJC
- Pretensões sem prazo especial (ex.: pretensão ressarcitória genérica fora de leis especiais — aferir caso a caso).`,
    ['205'],
    {
      relacionamentos: [
        { destinoSlug: 'cc-art-206-prazos-especiais', tipo: 'REFINA', descricao: 'Prazos especiais prevalecem (menores).' },
      ],
    },
  ),
  leiCc(
    'cc-art-206-prazos-especiais',
    'CC art. 206 — Prazos especiais de prescrição: 1, 2, 3, 4 e 5 anos (com revogação do inciso II do § 1º — Lei 15.040/2024) (texto literal confirmado)',
    'Prazos especiais',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30) — resumo estruturado com incisos principais
"Art. 206. Prescreve:

§ 1º Em um ano:
I - a pretensão dos hospedeiros ou fornecedores de víveres destinados a consumo no próprio estabelecimento, para o pagamento da hospedagem ou dos alimentos;
II - (Revogado pela Lei nº 15.040, de 2024) Vigência
III - a pretensão dos tabeliães, auxiliares da justiça, serventuários judiciais, árbitros e peritos, pela percepção de emolumentos, custas e honorários;
IV - a pretensão contra os peritos, pela avaliação dos bens que entraram para a formação do capital de sociedade anônima, contado da publicação da ata da assembléia que aprovar o laudo;
V - a pretensão dos credores não pagos contra os sócios ou acionistas e os liquidantes, contado o prazo da publicação da ata de encerramento da liquidação da sociedade.

§ 2º Em dois anos, a pretensão para haver prestações alimentares, a partir da data em que se vencerem.

§ 3º Em três anos:
I - a pretensão relativa a aluguéis de prédios urbanos ou rústicos;
II - a pretensão para receber prestações vencidas de rendas temporárias ou vitalícias;
III - a pretensão para haver juros, dividendos ou quaisquer prestações acessórias, pagáveis, em períodos não maiores de um ano, com capitalização ou sem ela;
IV - a pretensão de ressarcimento de enriquecimento sem causa;
V - a pretensão de reparação civil;
VI - a pretensão de restituição dos lucros ou dividendos recebidos de má-fé, correndo o prazo da data em que foi deliberada a distribuição;
VII - a pretensão contra as pessoas em seguida indicadas por violação da lei ou do estatuto, contado o prazo: (a fundadores / b administradores / c liquidantes — com termos próprios);
VIII - a pretensão para haver o pagamento de título de crédito, a contar do vencimento, ressalvadas as disposições de lei especial;
IX - a pretensão do beneficiário contra o segurador, e a do terceiro prejudicado, no caso de seguro de responsabilidade civil obrigatório.

§ 4º Em quatro anos, a pretensão relativa à tutela, a contar da data da aprovação das contas.

§ 5º Em cinco anos:
I - a pretensão de cobrança de dívidas líquidas constantes de instrumento público ou particular;
II - a pretensão dos profissionais liberais em geral, procuradores judiciais, curadores e professores pelos seus honorários, contado o prazo da conclusão dos serviços, da cessação dos respectivos contratos ou mandato;
III - a pretensão do vencedor para haver do vencido o que despendeu em juízo."

## Leitura aplicada — mapa rápido
- **1 ano:** hospedagem/víveres no estabelecimento (I); emolumentos/custas de tabeliães/peritos (III); sócios/liquidantes (V).
- **2 anos:** prestações alimentares vencidas (§ 2º).
- **3 anos:** aluguéis (I); rendas vencidas (II); juros/dividendos/prestações acessórias (III); enriquecimento sem causa (IV); **reparação civil (V)**; lucros de má-fé (VI); violação de lei/estatuto (VII); título de crédito (VIII); seguro RC obrigatório (IX).
- **4 anos:** tutela (§ 4º).
- **5 anos:** dívidas líquidas em instrumento público/particular (I); honorários de profissionais liberais etc. (II); despesas judiciais do vencedor (III).
- **HONESTIDADE:** o inciso II do § 1º (pretensão de médicos/engenheiros/arquitetos etc. de honorários) está REVOGADO pela Lei 15.040/2024 no texto oficial — NÃO citar como vigente; honorários desses profissionais seguem no § 5º II ("profissionais liberais em geral").
- **Interseção CDC:** relações de consumo regem-se pelo CDC (prescrição de reparação = 3 anos, art. 27; decadência de vícios = arts. 26/27) — docs CDC da base vinculados.`,
    ['206 § 1º', '206 § 2º', '206 § 3º V', '206 § 3º VIII', '206 § 4º', '206 § 5º', '206 § 1º II (revogado)'],
    {
      relacionamentos: [
        { destinoSlug: 'cdc-art-27-fato-produto-5-anos', tipo: 'CONTEXTO', descricao: 'Prescrição especial do consumidor (3 anos — reparação; art. 27 CDC).' },
        { destinoSlug: 'tabela-prazos-prescricao-civil', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Tabela operacional de prazos.' },
      ],
    },
  ),
  leiCc(
    'cc-art-206-a-prescricao-intercorrente',
    'CC art. 206-A — Prescrição intercorrente segue o prazo da pretensão e remete ao art. 921 CPC (texto literal confirmado, redação Lei 14.382/2022)',
    'Prescrição intercorrente',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 206-A. A prescrição intercorrente observará o mesmo prazo de prescrição da pretensão, observadas as causas de impedimento, de suspensão e de interrupção da prescrição previstas neste Código e observado o disposto no art. 921 da Lei nº 13.105, de 16 de março de 2015 (Código de Processo Civil).

(Redação dada pela Lei nº 14.382, de 2022)"

## Leitura aplicada
- **Prazo da intercorrente = prazo da pretensão** (simetria com a Súmula 150/STF — doc de jurisprudência vinculado), respeitadas causas de impedimento/suspensão/interrupção do CC.
- **Remete ao art. 921 CPC** — regime processual da intercorrente na execução (suspensão/desaparecimento de bens, retomada).
- **Contexto transversal:** no Execução Fiscal já opera o art. 40 da LEF (docs da base: lef-art-40 e Tema 390/STF) — esta norma civil geral dialoga com aquele regime especial.

## Hipóteses de aplicação no EJC
- Execuções paradas: comparar o prazo prescricional da pretensão (arts. 205/206) com o andamento da execução.`,
    ['206-A'],
    {
      relacionamentos: [
        { destinoSlug: 'sumula-150-stf-prescricao-execucao', tipo: 'CONVERGE_COM', descricao: 'Simetria enunciado-jurisprudencial.' },
        { destinoSlug: 'tema-390-stf-re-636562-constitucionalidade-art-40-lef', tipo: 'CONTEXTO', descricao: 'Intercorrente na Execução Fiscal.' },
      ],
    },
  ),
  leiCc(
    'cc-arts-207-210-decadencia',
    'CC arts. 207-210 — Decadência: não aplicam causas suspensivas, renúncia nula em decadência legal, conhecimento de ofício (texto literal confirmado)',
    'Decadência — regime próprio',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 207. Salvo disposição legal em contrário, não se aplicam à decadência as normas que impedem, suspendem ou interrompem a prescrição.

Art. 208. Aplica-se à decadência o disposto nos arts. 195 e 198, inciso I.

Art. 209. É nula a renúncia à decadência fixada em lei.

Art. 210. Deve o juiz, de ofício, conhecer da decadência, quando estabelecida por lei."

## Leitura aplicada
- **Regras de prescrição NÃO se aplicam à decadência** (207, salvo disposição legal em contrário) — decadência NÃO se interrompe/suspende pelas causas do CC.
- **Exceções à não-aplicação (208):** art. 195 (ação contra assistentes/representantes) e art. 198 I (incapazes) aplicam-se também à decadência.
- **Renúncia à decadência LEGAL é NULA (209)** — contraste com a renúncia possível da prescrição consumada (art. 191).
- **Oficiosidade (210):** decadência LEGAL é conhecida de ofício pelo juiz (prescrição: regra hoje processual — CPC arts. 487 § 1º e 921 § 5º, e o art. 194 CC está revogado).
- **Decadência convencional:** o CC trata em art. 211 — fora do intervalo lido nesta rodada; citar apenas 207-210 literal.

## Hipóteses de aplicação no EJC
- Prazos de CDC (art. 26 — decadência de vícios) e de outras leis especiais: regime de decadência legal (ofício, não interrupção).`,
    ['207', '208', '209', '210'],
    {
      relacionamentos: [
        { destinoSlug: 'cc-art-202-interrompem-prescricao', tipo: 'CONTRASTE', descricao: 'Interrupção é própria da prescrição (art. 207).' },
      ],
    },
  ),
  {
    slug: 'tabela-prazos-prescricao-civil',
    titulo: 'Tabela operacional — Prazos de prescrição civil (CC arts. 205-206) com termos iniciais',
    tipoDocumento: 'PRAZO',
    area: 'civil',
    subarea: 'decadencia-prescricao',
    assunto: 'Referência rápida',
    prioridade: 'P1',
    lote: 'LOTE-018',
    conteudo: `# TABELA DE PRESCRIÇÃO CIVIL (CC arts. 205-206 — textos literais, Planalto 2026-08-30)
| Pretensão | Prazo | Fundamento | Termo inicial |
|---|---|---|---|
| Geral (sem prazo especial) | 10 anos | CC art. 205 | violação do direito (art. 189) |
| Hospedagem/víveres no estabelecimento | 1 ano | CC art. 206 § 1º I | violação |
| Emolumentos/custas (tabeliães, peritos etc.) | 1 ano | CC art. 206 § 1º III | violação |
| Prestações alimentares vencidas | 2 anos | CC art. 206 § 2º | vencimento de cada prestação |
| Aluguéis de prédios | 3 anos | CC art. 206 § 3º I | violação |
| Juros/dividendos/prestações acessórias (≤1 ano) | 3 anos | CC art. 206 § 3º III | violação |
| Enriquecimento sem causa | 3 anos | CC art. 206 § 3º IV | violação |
| **Reparação civil (não-consumidor)** | **3 anos** | **CC art. 206 § 3º V** | **violação (art. 189 — dano)** |
| Título de crédito | 3 anos | CC art. 206 § 3º VIII (salvo lei especial) | vencimento |
| Seguro de RC obrigatório (beneficiário/terceiro) | 3 anos | CC art. 206 § 3º IX | violação |
| Tutela | 4 anos | CC art. 206 § 4º | aprovação das contas |
| Dívidas líquidas (instrumento público/particular) | 5 anos | CC art. 206 § 5º I | violação |
| Honorários de profissionais liberais, procuradores, curadores, professores | 5 anos | CC art. 206 § 5º II | conclusão/cessação do contrato ou mandato |
| Despesas judiciais do vencedor | 5 anos | CC art. 206 § 5º III | violação |

## Avisos EJC (obrigatórios)
1. **Consumo:** relações de consumo seguem o CDC — reparação: 3 anos (art. 27); decadência de vícios: arts. 26/27 (docs vinculados).
2. **Revogação honesta:** o inciso II do § 1º do art. 206 está REVOGADO (Lei 15.040/2024) — não citar.
3. **Interrupção:** art. 202 — uma única vez; recomeça por inteiro (p.ú.).
4. **Toda prescrição deve ser validada à luz do caso concreto** (termo inicial real, causas suspensivas dos arts. 197-200, leis especiais).`,
    metadados: { tipo: 'material', contagem: 'dias corridos (contagem civil)', fundamento_literal: 'CC arts. 205-206' },
    tags: ['civil/decadencia-prescricao', 'geral/prazos'],
    fonte: PLANALTO,
    urlFonte: URL_CC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'sumula-150-stf-prescricao-execucao',
    titulo: 'Súmula 150/STF — Prescreve a execução no mesmo prazo de prescrição da ação',
    tipoDocumento: 'JURISPRUDENCIA',
    area: 'civil',
    subarea: 'decadencia-prescricao',
    assunto: 'Prescrição da execução',
    prioridade: 'P1',
    lote: 'LOTE-018',
    metadados: { tribunal: 'STF', tipo_precedente: 'súmula', situacao: 'prescrição da execução' },
    conteudo: `## Enunciado
"Prescreve a execução no mesmo prazo de prescrição da ação."

## Dados do precedente
- **Tribunal:** Supremo Tribunal Federal (Súmula 150 — Sessão Plenária de 13/12/1963, conforme fontes institucionais consultadas).
- **Fontes consultadas (2026-08-30):** bancos de súmulas institucionais e jurisprudência de tribunais que citam o enunciado verbatim (coad, ibet, cognijus, TJDFT); portal STF e STJ BLOQUEADOS por 403/Cloudflare na data.
- **Confiabilidade B (honesto):** enunciado unânime e clássico confirmado por múltiplas fontes institucionais; pendência: recapturar a página oficial do STF quando acessível antes de citar em documento definitivo.

## Diálogo com o texto legal vigente
- **CC art. 206-A (Lei 14.382/2022):** a prescrição intercorrente "observará o mesmo prazo de prescrição da pretensão" — convergência expressa do legislador com o teor da súmula.
- **CC art. 189:** pretensão nasce da violação; art. 205/206 fixam os prazos.

## Aplicação prática
- Execução parada: comparar o prazo da pretensão (arts. 205-206) com o tempo de paralisação, respeitadas as causas de impedimento/suspensão/interrupção.`,
    tags: ['civil/decadencia-prescricao'],
    fonte: 'Bancos institucionais de súmulas (coad.com.br; ibet.com.br; cognijus.com; TJDFT — citação verbatim)',
    urlFonte: 'https://www.coad.com.br/busca/detalhe_16/459/Sumulas_e_enunciados',
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-09-30 (recapturar portal.stf.jus.br)',
    relacionamentos: [
      { destinoSlug: 'cc-art-206-a-prescricao-intercorrente', tipo: 'CONVERGE_COM', descricao: 'Simetria legal expressa.' },
    ],
  },
  {
    slug: 'checklist-verificacao-prescricao',
    titulo: 'Checklist — Análise de prescrição/decadência de uma pretensão (CC arts. 189-210 + CDC)',
    tipoDocumento: 'CHECKLIST',
    area: 'civil',
    subarea: 'decadencia-prescricao',
    assunto: 'Método de 10 passos',
    prioridade: 'P1',
    lote: 'LOTE-018',
    conteudo: `# CHECKLIST DE PRESCRIÇÃO/DECADÊNCIA (textos literais, consulta 2026-08-30)
1. **Qual o direito violado?** Fixar o fato/ato violador → termo inicial da pretensão (CC art. 189).
2. **É relação de consumo?** Sim → CDC art. 27 (3 anos, reparação) e arts. 26 (decadência de vícios) — docs CDC da base.
3. **Há prazo especial?** Art. 206 (1/2/3/4/5 anos) OU lei especial (ex.: título de crédito, art. 206 § 3º VIII "ressalvadas as disposições de lei especial").
4. **Sem prazo especial?** → 10 anos (CC art. 205).
5. **Há causas de NÃO-fluência?** Arts. 197-200 (cônjuges/poder familiar/tutela; incapazes do art. 3º; ausentes em serviço público; guerra; condição suspensiva; prazo não vencido; evicção; fato criminal até sentença definitiva).
6. **Houve interrupção?** Art. 202 (6 hipóteses) — atenção: UMA ÚNICA vez; recomeço integral (p.ú.); solidariedade (art. 204).
7. **Termo inicial especial?** Prestações alimentares: vencimento (§ 2º do 206); honorários: conclusão/cessação (§ 5º II); tutela: aprovação das contas (§ 4º).
8. **É decadência (legal)?** Não se aplicam suspensão/interrupção (art. 207); renúncia NULA (209); juiz conhece de ofício (210); aplicam-se só os arts. 195 e 198 I (208).
9. **Intercorrente na execução?** CC art. 206-A + art. 921 CPC (+ LEF art. 40 na execução fiscal — docs da base).
10. **Documentar:** data de violação, atos interruptivos com prova (ata, protesto, protocolo), cálculo com termo inicial e final, fonte e data da consulta (Planalto).`,
    tags: ['civil/decadencia-prescricao', 'geral/metodologia'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'regra-se-prescricao-decadencia-diagnostico', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Versão SE-ENTÃO.' },
    ],
  },
  {
    slug: 'regra-se-prescricao-decadencia-diagnostico',
    titulo: 'Regra SE-ENTÃO — Diagnóstico de prescrição/decadência (CC 189-210 + CDC)',
    tipoDocumento: 'REGRA_INTELIGENCIA',
    area: 'civil',
    subarea: 'decadencia-prescricao',
    assunto: 'Inteligência',
    prioridade: 'P1',
    lote: 'LOTE-018',
    conteudo: `# REGRA DE INTELIGÊNCIA — EJC (fundada em textos literais, consulta 2026-08-30)

SE fator_atrativo = violação de direito ENTÃO pretensão (CC art. 189);
SE área = consumo ENTÃO usar CDC (reparação 3 anos — art. 27; decadência de vícios arts. 26/27) NÃO o art. 206 § 3º V genérico;
SE pretensão ∈ {aluguéis; juros/dividendos; enriquecimento sem causa; reparação civil; título de crédito; seguro RC obrigatório} ENTÃO 3 anos (CC art. 206 § 3º);
SE pretensão = prestações alimentares vencidas ENTÃO 2 anos (art. 206 § 2º);
SE pretensão = dívidas líquidas/honorários liberais/despesas judiciais ENTÃO 5 anos (§ 5º);
SE nenhuma especial ENTÃO 10 anos (art. 205);
SE houver causa dos arts. 197-200 ENTÃO prazo NÃO corre enquanto persistir;
SE houver hipótese do art. 202 E for a primeira interrupção ENTÃO prazo RECOMEÇA por inteiro da data do ato/último ato do processo;
SE for decadência LEGAL ENTÃO não aplicar suspensão/interrupção (art. 207), renúncia nula (209), conhecer de ofício (210);
SE execução parada ENTÃO CC art. 206-A (prazo da pretensão) + art. 921 CPC (+ LEF art. 40 se execução fiscal).
AVISO: nunca declarar prescrição/decadência sem verificar termo inicial REAL e leis especiais aplicáveis ao caso.`,
    tags: ['civil/decadencia-prescricao'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'doutrina-prescricao-vs-decadencia',
    titulo: 'Doutrina EJC — Prescrição × decadência: distinção e regimes (CC arts. 189-210)',
    tipoDocumento: 'DOUTRINA',
    area: 'civil',
    subarea: 'decadencia-prescricao',
    assunto: 'Conceito e critérios',
    prioridade: 'P1',
    lote: 'LOTE-018',
    conteudo: `# CONCEITOS (elaboração própria EJC — sem cópia extensa de obras protegidas)
- **Prescrição:** extinção da PRETENSÃO pelo decurso do prazo (CC art. 189) — afeta direitos a prestações que podem ser exigidas (pretensões).
- **Decadência:** extinção do PRÓPRIO DIREITO pela inércia no prazo para exercê-lo (faculdade/estado potestativo — ex.: anular, redimir, devolver).

## Critérios de distinção (práticos)
1. Verbo: "responder/prestar/cobrar" (prescrição) × "anular/rejeitar/retirar" (decadência).
2. Prazo conta a partir de violação (prescrição) × a partir do surgimento do direito de exercer (decadência).
3. Regime: prescrição admite interrupção (art. 202) e causas suspensivas (197-200); decadência LEGAL não (art. 207) e renúncia é nula (209).
4. Oficiosidade: decadência legal de ofício (210); prescrição — hoje via regras processuais (CPC arts. 487 § 1º e 921 § 5º; o art. 194 CC foi revogado pela Lei 11.280/2006).

## Finalidade
- Segurança jurídica e paz social: prazos certos para o titular agir e para o devedor confiar.

## Aplicação prática
- Contratos da base (cobrança 5 anos — instrumento particular líquido; reparação civil 3 anos) × CDC (26/27) × legislação especial.
- Nunca confundir prazo processual (dias úteis) com prazo MATERIAL de prescrição (dias corridos).`,
    tags: ['civil/decadencia-prescricao'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'triagem-prescricao-caso-concreto',
    titulo: 'Triagem — Diagnóstico de prazo extintivo em 8 perguntas',
    tipoDocumento: 'TRIAGEM',
    area: 'civil',
    subarea: 'decadencia-prescricao',
    assunto: 'Entrevista rápida',
    prioridade: 'P1',
    lote: 'LOTE-018',
    conteudo: `# ROTEIRO DE TRIAGEM — PRESCRIÇÃO/DECADÊNCIA
1. **O que aconteceu e QUANDO?** (data da violação — art. 189)
2. **É relação de consumo?** (CDC arts. 26/27 — decadência/prescrição especiais)
3. **Qual a natureza da pretensão?** (cobrança de dívida líquida? reparação? aluguel? honorários? alimentos? título de crédito?)
4. **Já houve alguma ação, protesto ou reconhecimento do devedor?** (art. 202 I, II, V, VI — interrupção, UMA única vez)
5. **Há incapazes, casamento/poder familiar/tutela envolvidos?** (arts. 197-198)
6. **O fato depende de apuração criminal?** (art. 200 — não corre até sentença definitiva)
7. **A execução está parada há quanto tempo?** (CC art. 206-A + art. 921 CPC; LEF art. 40 se fiscal)
8. **O prazo buscado é para ANULAR/DEVOLVER (decadência) ou EXIGIR (prescrição)?**
→ Saída: prazo provável + fundamento (CC 205/206 ou lei especial) + data limite calculada + documentos para provar interrupção/suspensão + aviso de validação no caso concreto.`,
    tags: ['civil/decadencia-prescricao', 'geral/triagem'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'argumentacao-prescricao-decadencia',
    titulo: 'Argumentação bilateral — Prescrição: oposicionista × teses do autor',
    tipoDocumento: 'ARGUMENTACAO',
    area: 'civil',
    subarea: 'decadencia-prescricao',
    assunto: 'Controvérsias recorrentes',
    prioridade: 'P1',
    lote: 'LOTE-018',
    conteudo: `# CONTROVÉRSIA 1 — Termo inicial da reparação civil (3 anos)
- **Oponente:** prazo conta da data do dano/ato ilícito (art. 189: "violado o direito").
- **Autor:** se o dano não era imediatamente perceptível ou é continuado, a violação só se consuma depois — argumentar violação efetiva, não o evento bruto. (EJC registra o debate; nenhuma tese jurisdicional específica citada nesta consulta — nenhuma confirmada em fonte oficial.)
- **Provas:** data de ciência, laudos, histórico.

# CONTROVÉRSIA 2 — Interrupção por "ato inequívoco" (art. 202 VI)
- **Autor:** proposta de parcelamento/planilha assinada pelo devedor = reconhecimento do direito.
- **Oponente:** ato ambíguo não interrompe; quem alega tem de provar inequívoca data e conteúdo.

# CONTROVÉRSIA 3 — Segunda interrupção
- **Texto:** interrupção "somente poderá ocorrer uma vez" (art. 202 caput) — segunda ineficaz; **raro em juízo**: partes ignoram o limite.

# CONTROVÉRSIA 4 — Decadência convencional × legal
- **Legal:** renúncia NULA (art. 209); de ofício (210); sem suspensão/interrupção (207).
- **Convencional:** negocial — regime próprio; não confundir nos pedidos.`,
    tags: ['civil/decadencia-prescricao'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
  {
    slug: 'jurimetria-vazia-prescricao-civil',
    titulo: 'Jurimetria — Prescrição/decadência civil (estrutura vazia — sem dados reais)',
    tipoDocumento: 'JURIMETRIA',
    area: 'civil',
    subarea: 'decadencia-prescricao',
    assunto: 'Estrutura para dados futuros',
    prioridade: 'P3',
    lote: 'LOTE-018',
    conteudo: `# JURIMETRIA — PRESCRIÇÃO/DECADÊNCIA CIVIL
**Status: SEM DADOS.** Nenhuma estatística real nesta consulta (2026-08-30) — o EJC NÃO inventa percentuais (item 18 da missão).

## Campos preparados
- tribunal/classe/período/amostra/metodologia/fonte;
- indicadores futuros: taxa de acolhimento da alegação de prescrição; frequência de interrupção reconhecida; duração média de execução até intercorrente.

## Separação obrigatória: DADO ESTATÍSTICO REAL (com fonte) × ANÁLISE QUALITATIVA.`,
    tags: ['civil/decadencia-prescricao', 'geral/metodologia'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  },
];
