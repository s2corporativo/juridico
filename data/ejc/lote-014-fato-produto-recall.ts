// LOTE-014 — Fato do produto/serviço e Recall (P1) — textos LITERAIS verificados em 2026-08-30
// CDC arts. 9º, 10 (§§ 1º-3º), 12 (caput + §§ 1º-3º) e 13 (caput + p.ú.) — extração literal do
// Planalto (https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm).
// Portaria MJSP nº 618/2019 — PDF OFICIAL gov.br/MJ baixado e lido na íntegra (6 p., arts. 1º-16).
// Portaria Conjunta nº 3/2019 (MJSP x MInfra) — HTML OFICIAL dspace.mj.gov.br lido na íntegra
// (arts. 1º-11, DOU 02/07/2019, Seção 1 p. 41; status "não consta revogação expressa").
// Senacon FAQ oficial (gov.br/MJ "Consumo seguro e saúde") — definições e orientações ao consumidor.
//
// ANTI-INVENÇÃO desta rodada:
// - Art. 11 do CDC está VETADO no texto do Planalto — NÃO citado como fonte de obrigação.
// - NÃO citado nenhum REsp/número de acórdão sobre fato do produto/recall nesta consulta (nenhum
//   confirmado em fonte oficial na data) — jurisprudência específica fica para rodada futura.
// - A Senacon FAQ cita "Portarias MJSP nº 618/2019 e Portaria Interministerial nº 3, de 01/07/2019"
//   — ambas obtidas em texto integral nas fontes oficiais MJ (não há contradição: 618/2019 = geral;
//   Conjunta 3/2019 = veículos; 618/2019 revogou a Portaria 487/2012 — confirmado no próprio art. 15).
// - O prazo decadencial do art. 26 e a prescrição do art. 27 já constam da base (LOTE-009) — não duplicados.
import type { InputDocument } from '../../src/lib/ejc/types';

const D = '2026-08-30';
const PLANALTO = 'Presidência da República — Planalto';
const URL_CDC = 'https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm';
const URL_P618 = 'https://www.gov.br/mj/pt-br/assuntos/seus-direitos/consumidor/defesadoconsumidor/Biblioteca/legislacao-upload/portaria_mjsp_n-_618_2019.pdf';
const URL_PC3 = 'http://dspace.mj.gov.br/handle/1/1844';
const URL_SENACON = 'https://www.gov.br/mj/pt-br/acesso-a-informacao/perguntas-frequentes/consumidor/consumo-seguro-e-saude';
const EJC = 'Elaboração EJC — conteúdo estrutural original';

function cdc(
  slug: string, titulo: string, assunto: string, conteudo: string, artigos: string[],
  extra?: Partial<InputDocument>,
): InputDocument {
  return {
    slug, titulo, tipoDocumento: 'LEGISLACAO', area: 'consumidor', subarea: 'fato-do-produto',
    assunto, prioridade: 'P1', lote: 'LOTE-014',
    conteudo,
    metadados: { numero: 'Lei 8.078/1990 (CDC)', data_norma: '1990-09-11', orgao: 'Congresso Nacional', artigos_principais: artigos, vigente: true, confirmacao_texto: 'Extração literal do texto oficial do Planalto em 2026-08-30.' },
    tags: ['consumidor/fato-do-produto', 'consumidor/recall'],
    fonte: PLANALTO,
    urlFonte: URL_CDC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    ...extra,
  };
}

function portaria(
  slug: string, titulo: string, numero: string, conteudo: string, artigos: string[],
  url: string, fonte: string, extra?: Partial<InputDocument>,
): InputDocument {
  return {
    slug, titulo, tipoDocumento: 'LEGISLACAO', area: 'consumidor', subarea: 'recall',
    assunto: 'Regulamentação do recall (campanha de chamamento)', prioridade: 'P1', lote: 'LOTE-014',
    conteudo,
    metadados: { numero, orgao: 'Ministério da Justiça e Segurança Pública', artigos_principais: artigos, vigente: true, confirmacao_texto: 'Texto integral lido na fonte oficial em 2026-08-30.' },
    tags: ['consumidor/recall', 'geral/conformidade'],
    fonte,
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
  // ============ LEGISLAÇÃO LITERAL (CDC) ============
  cdc(
    'cdc-art-12-fato-produto-texto-literal',
    'CDC art. 12 — Responsabilidade pelo fato do produto: fabricante/produtor/construtor/importador sem culpa, segurança esperada e defesas exaustivas (texto literal confirmado)',
    'Responsabilidade pelo fato do produto (arts. 12-13)',
    `## Ficha da Norma
- **Norma:** Lei nº 8.078, de 11 de setembro de 1990 (CDC) — Seção II (Da Responsabilidade pelo Fato do Produto e do Serviço), art. 12.
- **Vigência:** vigente (texto do Planalto).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 12. O fabricante, o produtor, o construtor, nacional ou estrangeiro, e o importador respondem, independentemente da existência de culpa, pela reparação dos danos causados aos consumidores por defeitos decorrentes de projeto, fabricação, construção, montagem, fórmulas, manipulação, apresentação ou acondicionamento de seus produtos, bem como por informações insuficientes ou inadequadas sobre sua utilização e riscos.

§ 1º O produto é defeituoso quando não oferece a segurança que dele legitimamente se espera, levando-se em consideração as circunstâncias relevantes, entre as quais:
I - sua apresentação;
II - o uso e os riscos que razoavelmente dele se esperam;
III - a época em que foi colocado em circulação.

§ 2º O produto não é considerado defeituoso pelo fato de outro de melhor qualidade ter sido colocado no mercado.

§ 3º O fabricante, o construtor, o produtor ou importador só não será responsabilizado quando provar:
I - que não colocou o produto no mercado;
II - que, embora haja colocado o produto no mercado, o defeito inexiste;
III - a culpa exclusiva do consumidor ou de terceiro."

## Estrutura da responsabilidade (leitura aplicada)
- **Subjetivos:** fabricante, produtor, construtor e importador (o COMERCIANTE tem regime próprio — art. 13, doc vinculado).
- **Objetividade:** independe de culpa; o consumidor prova o defeito, o dano e o nexo causal.
- **Defesas são taxativas (§ 3º):** não há abertura para "negligência na manutenção" como defesa autônoma — essa hipótese só tem relevo se caracterizar culpa exclusiva do consumidor ou de terceiro.
- **Defeito inclui informação insuficiente/inadequada** sobre uso e riscos (caput, última parte) — base da conversa com a propaganda e o manual.

## Hipóteses de aplicação no EJC
- Delimitar quem responde (fabricante x comerciante) antes de eleger os réus.
- Testar as três defesas exaustivas contra as provas do dossiê.
- Fechar o prazo: prescrição de 5 anos do art. 27 (doc vinculado).`,
    ['12', '12 § 1º', '12 § 2º', '12 § 3º'],
    {
      relacionamentos: [
        { destinoSlug: 'cdc-art-13-comerciante-solidariedade-texto-literal', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Responsabilidade subsidiária/paralela do comerciante.' },
        { destinoSlug: 'cdc-art-27-fato-produto-5-anos', tipo: 'REFINA', descricao: 'Prescrição de 5 anos da reparação por fato do produto/serviço.' },
        { destinoSlug: 'cdc-art-14-fato-servico-texto-literal', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Regime paralelo do fato do serviço.' },
      ],
    },
  ),
  cdc(
    'cdc-art-13-comerciante-solidariedade-texto-literal',
    'CDC art. 13 — Responsabilidade do comerciante: hipóteses e direito de regresso (texto literal confirmado)',
    'Responsabilidade pelo fato do produto (arts. 12-13)',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 13. O comerciante é igualmente responsável, nos termos do artigo anterior, quando:
I - o fabricante, o construtor, o produtor ou o importador não puderem ser identificados;
II - o produto for fornecido sem identificação clara do seu fabricante, produtor, construtor ou importador;
III - não conservar adequadamente os produtos perecíveis.

Parágrafo único. Aquele que efetivar o pagamento ao prejudicado poderá exercer o direito de regresso contra os demais responsáveis, segundo sua participação na causação do evento danoso."

## Leitura aplicada
- O comerciante NÃO responde por defeito de projeto/fabricação quando o fabricante é identificável (regra); sua responsabilidade se ativa nas TRÊS hipóteses literais do caput — incluindo conservação inadequada de perecíveis (nexo próprio).
- **Regresso:** quem paga pode cobrar dos demais "segundo sua participação na causação" — importante para cadeia (fabricante → distribuidor → loja).
- Conecta-se à tese do marketplace (doc vinculado) — fornecedor integrante da cadeia de fornecimento (CDC art. 7º § único + art. 25): a loja/marketplace é atingida pela solidariedade do art. 25 § 1º, ainda que o regime específico do art. 13 demande hipótese própria.

## Hipóteses de aplicação no EJC
- Escolha dos réus: incluir o comerciante quando o fabricante for estrangeiro sem representante aqui, produto "sem marca" (mercado informal) ou perecível mal conservado.
- Estratégia regressiva: quem pagar integralmente cobre a participação de cada elo.`,
    ['13', '13 p.ú.'],
    {
      relacionamentos: [
        { destinoSlug: 'cdc-art-12-fato-produto-texto-literal', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Regime-base do fato do produto.' },
        { destinoSlug: 'tese-marketplace-cadeia-fornecimento', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Solidariedade da cadeia de fornecimento em marketplace.' },
      ],
    },
  ),
  cdc(
    'cdc-arts-9-10-periculosidade-recall-texto-literal',
    'CDC arts. 9º e 10 — Dever de informação de periculosidade e o fundamento legal do recall (texto literal confirmado)',
    'Produtos e serviços perigosos (arts. 8º-11)',
    `## Ficha da Norma
- **Norma:** Lei nº 8.078/1990 (CDC) — Seção I (Da Qualidade de Produtos e Serviços...), arts. 9º e 10.
- **Nota de integridade:** o art. 11 deste capítulo está **VETADO** no texto oficial do Planalto — NÃO é fonte de obrigação.

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 9º O fornecedor de produtos e serviços potencialmente nocivos ou perigosos à saúde ou segurança deverá informar, de maneira ostensiva e adequada, a respeito da sua nocividade ou periculosidade, sem prejuízo da adoção de outras medidas cabíveis em cada caso concreto.

Art. 10. O fornecedor não poderá colocar no mercado de consumo produto ou serviço que sabe ou deveria saber apresentar alto grau de nocividade ou periculosidade à saúde ou segurança.

§ 1º O fornecedor de produtos e serviços que, posteriormente à sua introdução no mercado de consumo, tiver conhecimento da periculosidade que apresentem, deverá comunicar o fato imediatamente às autoridades competentes e aos consumidores, mediante anúncios publicitários.

§ 2º Os anúncios publicitários a que se refere o parágrafo anterior serão veiculados na imprensa, rádio e televisão, às expensas do fornecedor do produto ou serviço.

§ 3º Sempre que tiverem conhecimento de periculosidade de produtos ou serviços à saúde ou segurança dos consumidores, a União, os Estados, o Distrito Federal e os Municípios deverão informá-los a respeito."

## Leitura aplicada — este é o NÚCLEO do recall
- **Art. 10 § 1º = fundamento do chamamento (recall):** conhecimento posterior de periculosidade → dever imediato de comunicar autoridades + consumidores, com anúncios publicitários às expensas do fornecedor.
- **Vedação de introdução (caput):** fornecedor "não poderá colocar no mercado" produto de alto risco que conheça ou deva conhecer — a "deveria saber" pega a negligência na vigilância pós-comercialização.
- **Poderes públicos (§ 3º):** entes federativos com dever próprio de informar consumidores sobre periculosidade conhecida.
- A regulamentação operacional do procedimento está na Portaria MJSP nº 618/2019 (geral) e na Portaria Conjunta nº 3/2019 (veículos) — docs vinculados.

## Hipóteses de aplicação no EJC
- Demonstrar violação de dever de informação (art. 9º) quando a advertência no produto for genérica ou ilegível.
- Cobrar recall sempre que houver risco persistente (orientação oficial Senacon: enquanto persistir o risco, o consumidor pode exigir o reparo/troca — doc vinculado).`,
    ['9', '10', '10 § 1º', '10 § 2º', '10 § 3º'],
    {
      relacionamentos: [
        { destinoSlug: 'portaria-mjsp-618-2019-recall-texto-literal', tipo: 'REGULAMENTA', descricao: 'Procedimento administrativo do recall (produtos e serviços).' },
        { destinoSlug: 'portaria-conjunta-3-2019-recall-veiculos-texto-literal', tipo: 'REGULAMENTA', descricao: 'Recall de veículos — RENAVAM, notificação e CRLV.' },
        { destinoSlug: 'cdc-art-12-fato-produto-texto-literal', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Consequência civil do defeito: reparação de danos.' },
      ],
    },
  ),

  // ============ LEGISLAÇÃO LITERAL (PORTARIAS DO RECALL) ============
  portaria(
    'portaria-mjsp-618-2019-recall-texto-literal',
    'Portaria MJSP nº 618/2019 — Procedimento do recall de produtos e serviços: prazos de 24 horas, 10 e 2 dias úteis, plano de mídia, aviso de risco e relatórios (texto integral confirmado)',
    'Portaria MJSP nº 618, de 1º de julho de 2019',
    `## Ficha da Norma
- **Norma:** Portaria do Ministro de Estado da Justiça e Segurança Pública nº 618, de 1º de julho de 2019.
- **Fonte:** PDF oficial gov.br/MJ (SEI nº 9082199; Processo 08012.000732/2019-91) — lido na íntegra (6 p.).
- **Objeto (caput do art. 1º):** "disciplina o procedimento de comunicação da nocividade ou periculosidade de produtos e serviços após sua colocação no mercado de consumo, previsto nos parágrafos 1º e 2º do art. 10 da Lei nº 8.078, de 11 de setembro de 1990, doravante denominado campanha de chamamento ou recall."
- **Revogações:** art. 15 — revoga a Portaria nº 487, de 15 de março de 2012. Art. 16 — vigência na data da publicação.

## Prazos operacionais CONFIRMADOS LITERALMENTE
- **24 horas** para comunicar à Senacon o INÍCIO DE INVESTIGAÇÃO quando o fornecedor toma conhecimento da "possibilidade de que tenham sido introduzidos" produtos/serviços nocivos ou perigosos (art. 2º, caput).
- **10 dias úteis** como teto da investigação interna, "a menos que o fornecedor demonstre circunstanciadamente que a extensão do prazo é necessária" (art. 2º, § 1º).
- **2 dias úteis** para comunicar o fato à Senacon e ao órgão normativo/regulador competente, "contados da decisão de realizar o chamamento" (art. 3º, caput), preferencialmente por SEI.
- **15 dias úteis** para juntada de informações restantes, se autorizada (art. 3º, §§ 4º-5º).
- **5 dias úteis** para a Senacon se manifestar após recebida a documentação (art. 3º, § 6º).
- **5 anos** de disponibilidade do Aviso de Risco no site da empresa, visível "em até dois clicks" (art. 4º, § 4º).
- **Relatórios quadrimestrais** de atendimento, exigíveis até o último dia útil do mês seguinte ao período (art. 8º, caput e § 1º); relatório final quando atingir 100% ou arquivamento (art. 8º, § 7º).

## Conteúdo obrigatório do comunicado (art. 3º, § 1º, incisos I-XI — síntese literal)
I - identificação completa do fornecedor (razão social, CNPJ/CPF, contatos, procuradores, presença no MERCOSUL); II - descrição pormenorizada do produto/serviço e componente defeituoso (marca, modelo, lote, série, chassi, datas de fabricação, foto); III - descrição do defeito + data e modo de detecção; IV - descrição dos riscos e implicações; V - quantidade de produtos/serviços atingidos (inclusive estoque) e número de consumidores; VI - distribuição geográfica (por estado) e exportações; VII - providências já adotadas e propostas; VIII - acidentes relacionados (local, data, vítimas, danos, processos judiciais, providências); IX - plano de mídia; X - plano de atendimento; XI - modelo do aviso de risco.

## Plano de mídia (art. 4º) — síntese literal
- Mensagens veiculadas em meio escrito, sons e sons+imagens (§ 1º, I-VI: impresso + site, rádio, TV, mídia digital, streaming de áudio e vídeo).
- **Obrigatória combinação de pelo menos uma estrutura escrita, uma de sons e uma de sons e imagens** (§ 3º).
- Justificativa da escolha dos meios por eficácia de alcance (§ 2º).

## Aviso de risco (art. 6º) — síntese literal
- Informação IMEDIATA aos consumidores + aviso com: identificação do produto e componente defeituoso (inciso I), data de início do atendimento (II), defeito/risco compreensível por qualquer consumidor (III), medidas preventivas/corretivas do consumidor (IV) e do fornecedor (V), contatos e locais de atendimento (VI), **informação de que o chamamento não representa qualquer custo ao consumidor (VII)**, demais informações de segurança (VIII).

## Regras de fechamento
- Certificado de atendimento ao consumidor (art. 7º — meio físico ou eletrônico).
- **Prorrogação/ampliação obrigatória do chamamento às expensas do fornecedor se resultados insatisfatórios (art. 9º).**
- **A reparação/substituição gratuita subsiste mesmo com dispensa de relatórios (art. 10).**
- Não cumprimento → sanções do CDC e do Decreto 2.181/1997 (art. 14).

## Uso no EJC
- Auditoria de compliance de recall (checklist vinculado); ajuizamento quando a campanha for omissa ou insuficiente; pedido de ordem para que o fornecedor promova chamamento ampliado (art. 9º).`,
    ['1', '2', '3 § 1º', '4 § 3º', '6 § 1º', '8 § 1º', '9', '10', '14'],
    URL_P618,
    'Ministério da Justiça e Segurança Pública (gov.br)',
    {
      relacionamentos: [
        { destinoSlug: 'cdc-arts-9-10-periculosidade-recall-texto-literal', tipo: 'REGULAMENTA', descricao: 'Regulamenta o art. 10 §§ 1º-2º do CDC (expresso no caput do art. 1º).' },
        { destinoSlug: 'checklist-conformidade-recall-fornecedor', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Checklist de compliance operacionalizando os prazos da portaria.' },
        { destinoSlug: 'portaria-conjunta-3-2019-recall-veiculos-texto-literal', tipo: 'COMPLEMENTA', descricao: 'Regime especial para veículos (RENAVAM/CRLV).' },
      ],
    },
  ),
  portaria(
    'portaria-conjunta-3-2019-recall-veiculos-texto-literal',
    'Portaria Conjunta nº 3/2019 — Recall de veículos: RENAVAM, notificação individual, CRLV anotado e CAT (texto integral confirmado)',
    'Portaria Conjunta nº 3, de 1 de julho de 2019 (MJSP + MInfra)',
    `## Ficha da Norma
- **Norma:** Portaria Conjunta nº 3, de 1 de julho de 2019 — Ministros de Estado da Infraestrutura e da Justiça e Segurança Pública.
- **Fonte:** Biblioteca Digital MJ (dspace.mj.gov.br/handle/1/1844) — HTML oficial lido na íntegra; DOU 02/07/2019, Seção 1, p. 41; status do registro: "não consta revogação expressa".
- **Objeto:** "Disciplina o procedimento de chamamento dos consumidores - recall, para substituição ou reparo de veículos que forem considerados nocivos ou perigosos após a sua introdução no mercado de consumo" (nos termos do art. 10 do CDC).
- **Vigência:** art. 11 — "noventa dias após a data de sua publicação".

## Textos-chave CONFIRMADOS LITERALMENTE
- **Art. 2º (comunicação ao DENATRAN):** fornecedor que tiver conhecimento de periculosidade/nocividade do veículo "deverá comunicar imediatamente o fato, por meio eletrônico, ao Departamento Nacional de Trânsito, de acordo com o manual para registro de recall no Sistema 'Registro Nacional de Veículos Automotores' - RENAVAM, sem prejuízo das demais comunicações previstas em lei ou regulamento vigente."
  - § 1º: fornecedor = fabricantes, montadoras, importadoras, encarroçadoras ou transformadoras de veículos automotores, elétricos, reboques e semirreboques.
- **Art. 3º (notificação individual):** serviço de notificação com envio da comunicação individual de início de recall ao ATUAL PROPRIETÁRIO, acompanhada do **Aviso de Risco**; § 2º comunicação com sinais distintivos do DENATRAN e da Senacon, preferencialmente eletrônica; § 3º sem adesão à solução tecnológica, remessa postal **às expensas dos fornecedores**; § 5º a comunicação individual **não afasta a obrigação das comunicações gerais a toda a sociedade (art. 10 § 2º CDC)**; § 6º guardar comprovantes de comunicação enquanto a totalidade de veículos não atender à campanha.
- **Art. 4º (certificado):** fornecedores devem emitir e entregar ao consumidor o certificado de atendimento, com identificação do recall, local, data, horário, duração, medida adotada e garantia dos serviços; § 2º possibilidade de impressão no site a qualquer tempo.
- **Art. 5º:** informações do universo atualizado de veículos atendidos **no máximo a cada quinze dias**; § 1º processo informado à Senacon, em especial se houver acidente de consumo em decorrência do defeito.
- **Art. 6º (CRLV):** "As informações referentes às campanhas de recall não atendidas no prazo de um ano, a contar da data de sua comunicação, deverão constar no Certificado de Registro e Licenciamento de Veículo (CRLV)." § 2º — após o atendimento informado ao RENAVAM, o CRLV sai sem a anotação no próximo licenciamento.
- **Art. 7º:** informações de recall nas bases do DENATRAN são de inteira responsabilidade dos fornecedores (art. 43 CDC).
- **Art. 8º-9º:** análise do veículo/componente em caso de denúncia (despesas do fornecedor); suspensão do CAT se não apresentadas amostras/informações; sanções do CDC e do Decreto 2.181/1997.
- **Art. 10:** revoga a Portaria Conjunta nº 69, de 15 de dezembro de 2010.

## Uso no EJC
- Demandas veiculares: verificar RENAVAM/CRLV (anotação de recall não atendido é prova objetiva de violação); pedido de entrega do certificado de atendimento; notificação postal à conta do fornecedor.`,
    ['2', '3 § 5º', '4', '6', '9'],
    URL_PC3,
    'Biblioteca Digital do Ministério da Justiça (dspace.mj.gov.br)',
    {
      relacionamentos: [
        { destinoSlug: 'cdc-arts-9-10-periculosidade-recall-texto-literal', tipo: 'REGULAMENTA', descricao: 'Regulamenta o recall veicular no art. 10 CDC (expresso no art. 1º).' },
        { destinoSlug: 'portaria-mjsp-618-2019-recall-texto-literal', tipo: 'COMPLEMENTA', descricao: 'Regime geral do recall (Aviso de Risco, plano de mídia).' },
        { destinoSlug: 'checklist-dossie-fato-produto', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Dossiê com documentos veiculares (CRLV/RENAVAM).' },
      ],
    },
  ),

  // ============ TESES ============
  {
    slug: 'tese-fato-produto-responsabilidade-objetiva-defesas',
    titulo: 'Tese — Responsabilidade objetiva pelo fato do produto: defeito + dano + nexo; defesas taxativas do art. 12 § 3º',
    tipoDocumento: 'TESE', area: 'consumidor', subarea: 'fato-do-produto',
    assunto: 'Responsabilidade civil do fornecedor por defeito do produto', prioridade: 'P1', lote: 'LOTE-014',
    conteudo: `## Tese
**O fabricante/produtor/construtor/importador responde independentemente de culpa pelos danos causados por defeitos do produto (projeto, fabricação, construção, montagem, fórmulas, manipulação, apresentação, acondicionamento ou informação insuficiente/inadequada — CDC art. 12). Prova do consumidor: defeito, dano e nexo causal. A exoneração só ocorre com a prova taxativa de uma das três hipóteses do art. 12 § 3º — e o ônus é do fornecedor.**

## Requisitos de aplicação
1. Produto colocado no mercado pelo fornecedor demandado (ou cadeia — art. 13/comerciante nas hipóteses literais).
2. Defeito: produto que "não oferece a segurança que dele legitimamente se espera" (art. 12 § 1º — apresentação, uso e riscos razoáveis, época de circulação).
3. Dano e nexo: acidente de consumo ou lesão decorrente do defeito.

## Argumentos a favor (consumidor)
- Objetividade expressa no texto legal ("independentemente da existência de culpa").
- Defesas taxativas: quem responde objetivamente não pode criar excludentes extralegais; "uso imprudente" só exonera se for culpA EXCLUSIVA do consumidor/terceiro.
- Defeito de INFORMAÇÃO também gera responsabilidade (caput, parte final) — manual/advertência insuficientes integram o defeito.
- Prescrição de 5 anos (art. 27) a partir do conhecimento do dano e de sua autoria — prazos amplos para lesões latentes.

## Argumentos contra (fornecedor)
- Excludentes legais: não colocou o produto no mercado; inexistência do defeito; culpa exclusiva de consumidor/terceiro (art. 12 § 3º, I-III).
- "Segurança legitimamente esperada" na época da circulação (art. 12 § 1º III) — produto de época não é defeituoso por comparação com tecnologia posterior (art. 12 § 2º: "não é considerado defeituoso pelo fato de outro de melhor qualidade ter sido colocado no mercado").
- Legitimação: atacar a escolha do réu (comerciante x fabricante — art. 13) quando cabível.

## Riscos e probabilidade (qualitativa)
- Com laudo técnico + provas de aquisição + documentos do recall (se houver), a tese tem alta probabilidade; sem prova do defeito, o risco é rejeição por ausência de nexo.

## Fontes de sustentação
- CDC art. 12 (texto literal — doc vinculado); CDC art. 13; art. 27 (prescrição 5 anos).`,
    metadados: { tema_central: 'responsabilidade objetiva por fato do produto', probabilidade: 'alta com prova técnica', risco: 'sem prova do defeito/nexo: rejeição', estado_arte: 'fundamento exclusivamente legal nesta consulta (sem precedente específico confirmado)' },
    tags: ['consumidor/fato-do-produto', 'geral/provas'],
    fonte: EJC, urlFonte: '', dataConsulta: D,
    confiabilidade: 'B', vigente: true, status: 'ATIVO',
    dataUltimaVerificacao: D, proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'cdc-art-12-fato-produto-texto-literal', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Fundamento literal da tese.' },
      { destinoSlug: 'peca-reclamacao-fato-produto', tipo: 'INSTRUMENTALIZA', descricao: 'Peça-modelo que operacionaliza a tese.' },
      { destinoSlug: 'doutrina-defeito-tipos-fabricacao-projeto-informacao', tipo: 'FUNDAMENTA', descricao: 'Tipologia doutrinária do defeito.' },
    ],
  },
  {
    slug: 'tese-cumulacao-lgpd-cdc-dados-produto',
    titulo: 'Tese — Cumulação LGPD x CDC: violação de dados no produto/serviço aciona responsabilidade civil (LGPD art. 42), sanção administrativa (LGPD art. 52) e fato do produto/serviço (CDC arts. 12/14)',
    tipoDocumento: 'TESE', area: 'digital', subarea: 'dados-sensiveis',
    assunto: 'Vazamento de dados em produto ou serviço digital — regimes cumuláveis', prioridade: 'P1', lote: 'LOTE-014',
    conteudo: `## Tese
**Uma mesma operação que expõe dados pessoais dos titulares (vazamento em app, dispositivo IoT, plataforma) pode gerar, em paralelo: (1) responsabilidade civil LGPD art. 42 (independe de culpa, inversão do ônus); (2) processo administrativo ANPD com sanções (LGPD art. 52); (3) responsabilidade pelo fato do produto/serviço CDC arts. 12/14, quando o software/serviço for o produto defeituoso — sem necessidade de eleger um regime em detrimento do outro.**

## Por que a cumulação é admitida pela arquitetura legal
- **LGPD art. 52 caput (texto na base — LOTE-008):** sanções administrativas aplicadas "sem prejuízo" das sanções civis — a esfera civil NÃO se exaure na administrativa.
- **CDC art. 7º (caput e § único):** o CDC é o piso mínimo e se combina com outros regimes quando mais benéficos.
- **Software/serviço como produto:** um app ou plataforma é "serviço" (art. 14) — a exposição indevida de dados é "defeito" (não oferece a segurança legitimamente esperada), e a falha de segurança configura tratamento irregular (LGPD arts. 44/46 — docs vinculados).
- **Ambas as leis objetivam a reparação:** dano material (fraude, gastos), moral (exposição, risco persistente) e coletivo.

## Requisitos de aplicação
1. Tratamento de dados pessoais concreto (base legal deficiente ou falha de segurança).
2. Produto/serviço digital como fonte do risco (defeito de segurança sob CDC).
3. Dano ou risco relevante; documentação do incidente (comunicação ANPD 3 dias úteis — docs vinculados).

## Argumentos a favor (titular/consumidor)
- Diferentes funções: sanção administrativa (coação estatal), reparação civil (restabelecimento da vítima) — não há bis in idem em reparar e punir.
- Inversão do ônus em ambos os regimes (LGPD art. 42 § 1º; CDC art. 6º VIII).
- A existência de campanha de incidente notificada à ANPD é prova objetiva do risco.

## Argumentos contra (fornecedor)
- Exclusividade do regime digital: alegar que a LGPD absorve a matéria (rebater: art. 7º CDC — cumulatividade).
- Inexistência de dano concreto em vazamentos sem fraude (rebater: dano moral/exposição + risco persistente documentado).

## Riscos
- Prova do nexo entre o vazamento e o dano alegado; escolha do réu (controlador x operador).

## Fontes de sustentação
- LGPD arts. 42, 44/46 e 52 (docs literais na base); CDC arts. 12/14 (docs literais na base). Elaboração EJC de síntese estrutural (confiabilidade B — jurisprudência específica de cumulação a validar em rodada futura).`,
    metadados: { tema_central: 'cumulação de regimes LGPD/CDC', probabilidade: 'média-alta', risco: 'nexo causal com dano concreto', estado_arte: 'síntese estrutural dos textos legais na base — sem precedente específico confirmado nesta consulta' },
    tags: ['digital/lgpd', 'consumidor/fato-do-produto'],
    fonte: EJC, urlFonte: '', dataConsulta: D,
    confiabilidade: 'B', vigente: true, status: 'ATIVO',
    dataUltimaVerificacao: D, proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'lgpd-art-42-responsabilidade-civil-texto-literal', tipo: 'FUNDAMENTA', descricao: 'Responsabilidade civil LGPD (literal).' },
      { destinoSlug: 'lgpd-art-52-sancoes-texto-literal', tipo: 'FUNDAMENTA', descricao: 'Sanções administrativas sem prejuízo das civis (literal).' },
      { destinoSlug: 'cdc-art-14-fato-servico-texto-literal', tipo: 'FUNDAMENTA', descricao: 'Fato do serviço (literal).' },
      { destinoSlug: 'tese-fato-produto-responsabilidade-objetiva-defesas', tipo: 'COMPLEMENTA', descricao: 'Regime do fato do produto (bem tangível).' },
    ],
  },

  // ============ PEÇAS ============
  {
    slug: 'peca-reclamacao-fato-produto',
    titulo: 'Peça-modelo — Reclamação por fato do produto (acidente de consumo, CDC arts. 6º VIII, 12, 13 e 27)',
    tipoDocumento: 'PECA', area: 'consumidor', subarea: 'fato-do-produto',
    assunto: 'Reclamação de reparação de danos por acidente de consumo', prioridade: 'P1', lote: 'LOTE-014',
    conteudo: `## Modelo operacional — variáveis entre {{ }}
Dados fictícios: NÃO. Estrutura com variáveis; preencher somente com fatos do caso e documentos do dossiê.

### Endereçamento e qualificação
EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA {{VARA_CIVEL|VARA_EMPRESARIAL}} DA COMARCA DE {{CIDADE}} — {{UF}}

**{{NOME_AUTOR}}**, {{NACIONALIDADE_AUTOR}}, {{ESTADO_CIVIL_AUTOR}}, {{PROFISSAO_AUTOR}}, inscrito(a) no CPF sob o nº {{CPF_AUTOR}}, residente e domiciliado(a) em {{ENDERECO_AUTOR}}, por seu(sua) advogado(a) (procuração anexa), vem propor **AÇÃO DE REPARAÇÃO DE DANOS POR FATO DO PRODUTO** (CDC arts. 6º VIII, 12 e 13) em face de **{{NOME_FABRICANTE}}** ({{CNPJ_FABRICANTE}}) e **{{NOME_COMERCIANTE}}** ({{CNPJ_COMERCIANTE}}), com sede em {{ENDERECO_REUS}}, pelos fatos e fundamentos a seguir.

### Dos fatos (preencher com o caso)
1. Em {{DATA_COMPRA}}, o(a) autor(a) adquiriu o produto {{PRODUTO_MARCA_MODELO}} (nota fiscal nº {{NUM_NOTA}}, anexa).
2. Em {{DATA_ACIDENTE}}, o produto {{DESCRICAO_FALHA}} — {{NARRATIVA_ACIDENTE}}.
3. Os danos materiais somam {{VALOR_MATERIAIS}} (orçamentos/documentos anexos) e o dano moral é descrito em {{DESCRICAO_DANO_MORAL}}.

### Do direito
- **Defeito (art. 12 § 1º):** o produto não oferecia a segurança legitimamente esperada, considerando sua apresentação, o uso e riscos razoáveis e a época de circulação — {{RACIOCINIO_DEFETO}}.
- **Responsabilidade objetiva (art. 12 caput):** fabricante/importador respondem independentemente de culpa; não se aplica excludente alguma: o produto foi colocado no mercado pelo réu (art. 12 § 3º, I — confira), o defeito existe (II — confira) e não houve culpa exclusiva do consumidor/terceiro (III — confira: {{USO_ADEQUADO}}).
- **Comerciante (art. 13):** {{HIPOTESE_COMERCIANTE — p.ex.: fabricante estrangeiro sem representante identificável / produto sem identificação clara / perecível mal conservado — caso nenhuma hipótese: justificar solidariedade do art. 25 ou excluir o polo}}.
- **Recall (se aplicável):** o produto foi objeto de campanha de chamamento ({{PORTARIA/CAMPANHA}}), provando a ciência do defeito pelo fornecedor — ou: apesar do risco documentado, NÃO houve recall, violando o art. 10 § 1º CDC e a Portaria MJSP 618/2019 (doc EJC vinculado).
- **Tutela de evidência (CPC art. 311):** {{PEDIDO_EVIDENCIA — p.ex.: guarda do produto indisponível, laudo prévio}}.
- **Prescrição (art. 27 CDC):** ação ajuizada dentro dos 5 anos do conhecimento do dano e sua autoria ({{DATA_CONHECIMENTO}}).

### Dos pedidos
a) a citação dos réus para responder;
b) a condenação solidária em danos materiais de {{VALOR_MATERIAIS}};
c) a condenação em danos morais que o juízo arbitrar ({{CRITERIO_MORAL}});
d) a exibição do produto em juízo / perícia técnica (CPC arts. 464 e ss.), designando-se expert — pedido de exibição do produto conservado pelo(a) autor(a);
e) a juntada dos comprovantes de recall/RENAVAM (veicular), aplicando-se a responsabilidade do art. 7º da Portaria Conjunta 3/2019;
f) a inversão do ônus da prova (CDC art. 6º VIII — verossimilhança: {{VEROSSIMILHANCA}});
g) gratuidade de justiça (se cabível) e prioridades legais ({{PRIORIDADE}}).

### Valor da causa
R$ {{VALOR_CAUSA}}.

**Nestes termos, pede deferimento.** {{CIDADE}}, {{DATA}}.

### Checklist embutido antes do protocolo
- [ ] Produto conservado (não alterado) + fotos originais
- [ ] Nota fiscal/comprovante de aquisição
- [ ] Laudo técnico ou perícia prévia (se possível)
- [ ] Consulta a recall (Senacon/RENAVAM) com captura de tela e data
- [ ] Justificar a inclusão de cada réu (fabricante x comerciante)
- [ ] Preencher TODAS as variáveis — nenhuma "{{}}" pode sobrar`,
    metadados: { variaveis: ['VARA_CIVEL', 'CIDADE', 'UF', 'NOME_AUTOR', 'CPF_AUTOR', 'ENDERECO_AUTOR', 'NOME_FABRICANTE', 'CNPJ_FABRICANTE', 'NOME_COMERCIANTE', 'CNPJ_COMERCIANTE', 'ENDERECO_REUS', 'DATA_COMPRA', 'PRODUTO_MARCA_MODELO', 'NUM_NOTA', 'DATA_ACIDENTE', 'DESCRICAO_FALHA', 'NARRATIVA_ACIDENTE', 'VALOR_MATERIAIS', 'DESCRICAO_DANO_MORAL', 'RACIOCINIO_DEFETO', 'USO_ADEQUADO', 'HIPOTESE_COMERCIANTE', 'DATA_CONHECIMENTO', 'PEDIDO_EVIDENCIA', 'CRITERIO_MORAL', 'VEROSSIMILHANCA', 'PRIORIDADE', 'VALOR_CAUSA', 'DATA'], dadosFicticios: false },
    tags: ['consumidor/fato-do-produto', 'geral/pecas'],
    fonte: EJC, urlFonte: '', dataConsulta: D,
    confiabilidade: 'B', vigente: true, status: 'ATIVO',
    dataUltimaVerificacao: D, proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'cdc-art-12-fato-produto-texto-literal', tipo: 'FUNDAMENTA', descricao: 'Base legal da peça.' },
      { destinoSlug: 'checklist-dossie-fato-produto', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Dossiê que alimenta as variáveis.' },
      { destinoSlug: 'peca-reclamacao-vicio-produto', tipo: 'COMPLEMENTA', descricao: 'Peça do regime de vício (art. 18) — distinta do fato.' },
    ],
  },
  {
    slug: 'peca-notificacao-extrajudicial-recall',
    titulo: 'Peça-modelo — Notificação extrajudicial de risco/recall omitido (CDC arts. 9º, 10 § 1º e Portaria MJSP 618/2019)',
    tipoDocumento: 'PECA', area: 'consumidor', subarea: 'recall',
    assunto: 'Notificação de risco não comunicado e requerimento de chamamento', prioridade: 'P1', lote: 'LOTE-014',
    conteudo: `## Modelo operacional — variáveis entre {{ }}
Dados fictícios: NÃO. Notificação extrajudicial ao fornecedor antes de medidas administrativas/judiciais.

### Destinatário e remetente
AO(A) {{DEPARTAMENTO_JURIDICO_RELACAO_CONSUMIDOR}} DA {{NOME_FORNECEDOR}} ({{CNPJ_FORNECEDOR}})
Ref.: produto/serviço {{PRODUTO_MODELO_LOTE}} — risco de {{RISCO_IDENTIFICADO}}

**{{NOME_REMETENTE}}** ({{CPF_CNPJ_REMETENTE}}), {{QUALIFICACAO_REMETENTE — consumidor/advogado de coletivo}}, notifica formalmente:

### I. Dos fatos
1. Em {{DATA_AQUISICAO}} foi adquirido o produto/serviço {{PRODUTO_DESCRICAO}} ({{COMPROVANTE}}).
2. Em {{DATA_PERCEPCAO}}, identificou-se o risco: {{DESCRICAO_TECNICA_DO_RISCO}} — {{FONTE_DO_RISCO: laudo/notícia/relato/campanha estrangeira}}.
3. {{SE_APLICAVEL: a mesma falha já motivou recall em outros países / reclamações em plataformas oficiais}}.

### II. Da obrigação legal
- **CDC art. 10 § 1º:** "tiver conhecimento da periculosidade que apresentem, deverá comunicar o fato imediatamente às autoridades competentes e aos consumidores, mediante anúncios publicitários".
- **CDC art. 9º:** informação ostensiva e adequada da nocividade/periculosidade.
- **Portaria MJSP nº 618/2019:** art. 2º (comunicação à Senacon em 24 horas do conhecimento da possibilidade de nocividade; investigação em até 10 dias úteis); art. 3º (chamamento comunicado em 2 dias úteis à Senacon e órgão regulador); art. 6º (aviso de risco imediato, com as informações dos incisos I-VIII, sem custo ao consumidor); art. 9º (prorrogação/ampliação se resultados insatisfatórios).
- **Veicular (se for o caso):** Portaria Conjunta nº 3/2019 — comunicação ao DENATRAN/RENAVAM, notificação individual ao proprietário com Aviso de Risco, anotação no CRLV após 1 ano sem atendimento.

### III. Requerimentos
a) resposta escrita em {{PRAZO_NOTIFICACAO — sugestão: 10 dias}}, informando se há campanha de chamamento em curso para este lote;
b) em caso negativo: início IMEDIATO da investigação (Portaria 618/2019, art. 2º) e comunicação à Senacon;
c) fornecimento do **certificado de atendimento** (Portaria 618/2019, art. 7º) quando o reparo for realizado;
d) custeio integral do atendimento — o chamamento "não representa qualquer custo ao consumidor" (art. 6º § 1º, VII);
e) informações sobre acidentes relacionados e providências adotadas (art. 3º § 1º, VIII).

### IV. Consequências do silêncio
Decorrido o prazo sem resposta satisfatória: (i) representação à Senacon/DPDC e ao órgão regulador setorial; (ii) ação civil com pedido de condenação por danos (fato do produto — CDC arts. 12/14) e, se veicular, uso da anotação CRLV como prova; (iii) pleito de ordem judicial para chamamento ampliado (art. 9º da Portaria 618/2019).

{{CIDADE}}, {{DATA}}. {{ASSINATURA}}.

### Checklist embutido
- [ ] Anexar comprovante de envio (AR/e-mail com confirmação)
- [ ] Anexar evidências do risco (laudo, fotos, notícias, recall estrangeiro)
- [ ] Guardar cópia integral para o dossiê`,
    metadados: { variaveis: ['DEPARTAMENTO_JURIDICO_RELACAO_CONSUMIDOR', 'NOME_FORNECEDOR', 'CNPJ_FORNECEDOR', 'PRODUTO_MODELO_LOTE', 'RISCO_IDENTIFICADO', 'NOME_REMETENTE', 'CPF_CNPJ_REMETENTE', 'QUALIFICACAO_REMETENTE', 'DATA_AQUISICAO', 'PRODUTO_DESCRICAO', 'COMPROVANTE', 'DATA_PERCEPCAO', 'DESCRICAO_TECNICA_DO_RISCO', 'FONTE_DO_RISCO', 'PRAZO_NOTIFICACAO', 'CIDADE', 'DATA', 'ASSINATURA'], dadosFicticios: false },
    tags: ['consumidor/recall', 'geral/extrajudicial'],
    fonte: EJC, urlFonte: '', dataConsulta: D,
    confiabilidade: 'B', vigente: true, status: 'ATIVO',
    dataUltimaVerificacao: D, proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'portaria-mjsp-618-2019-recall-texto-literal', tipo: 'FUNDAMENTA', descricao: 'Prazos e obrigações citados na notificação.' },
      { destinoSlug: 'cdc-arts-9-10-periculosidade-recall-texto-literal', tipo: 'FUNDAMENTA', descricao: 'Base legal CDC do chamamento.' },
      { destinoSlug: 'fluxo-recall-fornecedor', tipo: 'MAPEIA', descricao: 'Etapas administrativas do chamamento.' },
    ],
  },

  // ============ CHECKLISTS ============
  {
    slug: 'checklist-dossie-fato-produto',
    titulo: 'Checklist — Dossiê de fato do produto (acidente de consumo): 14 pontos',
    tipoDocumento: 'CHECKLIST', area: 'consumidor', subarea: 'fato-do-produto',
    assunto: 'Montagem de dossiê para reparação por fato do produto', prioridade: 'P1', lote: 'LOTE-014',
    conteudo: `## Checklist operacional (14 pontos)
**Aquisição e identificação**
- [ ] 1. Nota fiscal/comprovante de compra (produto, data, vendedor)
- [ ] 2. Identificação completa do produto: marca, modelo, lote, série, chassi (veicular), data de fabricação
- [ ] 3. Manual/embalagem/advertências originais (provar defeito de INFORMAÇÃO — art. 12 caput, parte final)

**Preservação da prova**
- [ ] 4. Produto conservado SEM alteração/reparo (ou registro documentado do reparo emergencial)
- [ ] 5. Fotos/vídeos datados do estado original e do acidente
- [ ] 6. Laudo técnico particular ou requisição de perícia judicial (CPC art. 464 e ss.)

**Nexo e danos**
- [ ] 7. Narrativa objetiva do acidente (data, local, modo) alinhada ao laudo
- [ ] 8. Danos materiais documentados (orçamentos, notas de reparo, receitas médicas)
- [ ] 9. Dano moral descrito concretamente (afetação pessoal específica)

**Recall e regulamentação**
- [ ] 10. Consulta a campanhas de recall (Senacon/DPDC; veicular: RENAVAM/CRLV) com captura + data — anotação de recall NÃO atendido no CRLV é prova objetiva
- [ ] 11. Certificado de atendimento (Portaria 618/2019 art. 7º / Portaria Conjunta 3/2019 art. 4º), se houve chamamento

**Estratégia processual**
- [ ] 12. Justificar cada réu: fabricante/importador (art. 12) x comerciante (art. 13 hipóteses) x cadeia (art. 25/marketplace)
- [ ] 13. Conferir prescrição de 5 anos (art. 27) a partir do conhecimento do dano e da autoria
- [ ] 14. Pedidos de exibição do produto/perícia e inversão do ônus (art. 6º VIII) formulados`,
    metadados: { total_itens: 14, uso: 'montar dossiê antes do ajuizamento' },
    tags: ['consumidor/fato-do-produto', 'geral/provas'],
    fonte: EJC, urlFonte: '', dataConsulta: D,
    confiabilidade: 'B', vigente: true, status: 'ATIVO',
    dataUltimaVerificacao: D, proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'peca-reclamacao-fato-produto', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Peça alimentada pelo dossiê.' },
      { destinoSlug: 'cdc-art-27-fato-produto-5-anos', tipo: 'REFINA', descricao: 'Prazo prescricional verificado no item 13.' },
    ],
  },
  {
    slug: 'checklist-conformidade-recall-fornecedor',
    titulo: 'Checklist — Conformidade de recall para fornecedores (Portaria MJSP 618/2019): 16 pontos',
    tipoDocumento: 'CHECKLIST', area: 'consumidor', subarea: 'recall',
    assunto: 'Compliance do procedimento de chamamento (produtos e serviços)', prioridade: 'P1', lote: 'LOTE-014',
    conteudo: `## Checklist operacional (16 pontos) — baseado no texto literal da Portaria MJSP nº 618/2019
**Fase 1 — Detecção e investigação**
- [ ] 1. Fluxo interno de captação de risco (reclamações, SAC, testes, monitoramento de recalls estrangeiros) ativo
- [ ] 2. Comunicação à SENACON em **24 horas** do conhecimento da possibilidade de nocividade (art. 2º caput)
- [ ] 3. Investigação concluída em até **10 dias úteis**, com justificativa circunstanciada de dilação, se houver (art. 2º § 1º)
- [ ] 4. Ao fim da investigação: comunicado OU motivação de não-cabimento do chamamento (art. 2º § 2º)

**Fase 2 — Comunicação do chamamento**
- [ ] 5. Comunicação da decisão de recall em **2 dias úteis** à Senacon + órgão regulador (art. 3º caput), preferencialmente por SEI
- [ ] 6. Comunicado com os 11 grupos de informação (art. 3º § 1º, I-XI — fornecedor, produto, defeito, riscos, quantidades, geografia, providências, acidentes, mídia, atendimento, aviso)
- [ ] 7. Informações restantes juntadas em até 15 dias úteis, se autorizadas (art. 3º § 5º); resposta da Senacon em 5 dias úteis (§ 6º)

**Fase 3 — Mídia e aviso de risco**
- [ ] 8. Plano de mídia com data início/fim, meios, horários, frequência, custos e justificativa (art. 4º)
- [ ] 9. Combinação obrigatória: ≥1 veículo escrito, ≥1 de sons, ≥1 de sons e imagens (art. 4º § 3º)
- [ ] 10. Aviso de risco no site visível em **até 2 clicks** e disponível por **5 anos** (art. 4º § 4º)
- [ ] 11. Aviso de risco com os 8 itens do art. 6º § 1º — inclusive "o chamamento não representa qualquer custo ao consumidor" (inciso VII)

**Fase 4 — Atendimento e relatórios**
- [ ] 12. Plano de atendimento: canais (preferencialmente consumidor.gov.br), locais, horários, duração média, início, contingência (art. 5º)
- [ ] 13. Certificado de atendimento entregue (meio físico/eletrônico) (art. 7º)
- [ ] 14. Relatórios quadrimestrais até o último dia útil do mês seguinte + relatório final (100% ou arquivamento) (art. 8º)
- [ ] 15. Previsão de prorrogação/ampliação às expensas do fornecedor se resultados insatisfatórios (art. 9º)
- [ ] 16. Veicular: registro RENAVAM, notificação individual com Aviso de Risco, relatório quinzenal de atendidos e CRLV (Portaria Conjunta 3/2019 — docs vinculados)

## Nota
- A reparação/substituição gratuita SUBSISTE mesmo com dispensa de relatórios pela Senacon (art. 10).`,
    metadados: { total_itens: 16, base_legal: 'Portaria MJSP 618/2019 (texto integral na base)' },
    tags: ['consumidor/recall', 'geral/conformidade'],
    fonte: EJC, urlFonte: '', dataConsulta: D,
    confiabilidade: 'B', vigente: true, status: 'ATIVO',
    dataUltimaVerificacao: D, proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'portaria-mjsp-618-2019-recall-texto-literal', tipo: 'FUNDAMENTA', descricao: 'Cada item remete ao artigo da portaria.' },
      { destinoSlug: 'fluxo-recall-fornecedor', tipo: 'MAPEIA', descricao: 'Fluxo visual das mesmas etapas.' },
    ],
  },

  // ============ FLUXOS ============
  {
    slug: 'fluxo-recall-fornecedor',
    titulo: 'Fluxo — Procedimento de recall do fornecedor (Portaria MJSP 618/2019 + Portaria Conjunta 3/2019)',
    tipoDocumento: 'FLUXO', area: 'consumidor', subarea: 'recall',
    assunto: 'Etapas do chamamento de consumidores', prioridade: 'P1', lote: 'LOTE-014',
    conteudo: `## Fluxo operacional — evento → prazo → providência → responsável → documento → risco → próxima etapa

### ETAPA 1 — Detecção do risco
- **Evento:** reclamação, teste interno, acidente, recall estrangeiro da mesma falha.
- **Prazo:** comunicação à Senacon do início de investigação em **24 HORAS** (Port. 618/2019 art. 2º caput).
- **Providência:** protocolar comunicação (SEI) descrevendo a possibilidade de nocividade.
- **Responsável:** compliance jurídico do fornecedor.
- **Documento:** protocolo SEI da comunicação inicial.
- **Risco de falha:** omisso → sanções CDC/Decreto 2.181/1997 (art. 14) + agravamento civil.
- **Próxima etapa:** investigação interna.

### ETAPA 2 — Investigação (até 10 DIAS ÚTEIS)
- **Evento:** análise técnica do lote/componente.
- **Prazo:** máx. 10 dias úteis; dilação só com demonstração circunstanciada (art. 2º § 1º).
- **Providência:** conclusão com parecer técnico.
- **Documento:** parecer + testes.
- **Risco:** prazo estourado sem justificativa → violação administrativa.
- **Próxima etapa:** decisão de chamamento.

### ETAPA 3 — Decisão e comunicação (2 DIAS ÚTEIS)
- **Evento:** decisão de realizar recall.
- **Prazo:** 2 dias úteis da decisão para comunicar Senacon + órgão regulador (art. 3º caput) com os 11 grupos de informação (§ 1º).
- **Providência:** montar comunicado (identificação, produto/lote, defeito, riscos, quantidades, geografia, acidentes, planos).
- **Documento:** comunicado com anexos (plano de mídia, plano de atendimento, modelo de aviso).
- **Risco:** comunicado incompleto → notificação da Senacon pedindo complementações.
- **Próxima etapa:** veiculação.

### ETAPA 4 — Veiculação (mídia + aviso de risco)
- **Evento:** início da campanha.
- **Providência:** plano de mídia com ≥1 meio escrito + ≥1 sons + ≥1 sons/imagens (art. 4º § 3º); aviso de risco no site em ≤2 clicks, disponível 5 anos (art. 4º § 4º); anúncios às expensas do fornecedor (CDC art. 10 § 2º).
- **Veicular:** registro no RENAVAM; notificação individual ao proprietário com Aviso de Risco; postal às expensas do fornecedor (Port. Conj. 3/2019 arts. 2º-3º).
- **Risco:** mídia insuficiente → Senacon determina prorrogação/ampliação (art. 9º).
- **Próxima etapa:** atendimento.

### ETAPA 5 — Atendimento
- **Evento:** consumidores comparecendo.
- **Providência:** reparo/substituição SEM CUSTO (aviso — art. 6º § 1º VII); certificado de atendimento (art. 618/2019 art. 7º; veicular: art. 4º Conjunta com garantia dos serviços); informação ao RENAVAM em 15 dias do serviço (veicular).
- **Documento:** certificado; registros de atendimento.
- **Risco:** recusa de atendimento → "reparação ou substituição gratuita subsiste mesmo com dispensa de relatórios" (art. 10).
- **Próxima etapa:** relatórios.

### ETAPA 6 — Relatórios e fechamento
- **Evento:** períodos de apuração.
- **Prazo:** relatórios quadrimestrais até o último dia útil do mês seguinte (art. 8º § 1º); veicular: universo atualizado a cada 15 dias (Conjunta art. 5º).
- **Providência:** relatório final com percentuais e justificativa dos não atendidos (art. 8º caput, II).
- **Veicular:** recall não atendido por 1 ano → anotação no CRLV (Conjunta art. 6º).
- **Risco:** resultados insatisfatórios → ampliação obrigatória (art. 9º); acidentes decorrentes → informações do art. 3º § 1º VIII (art. 13).
- **Próxima etapa:** arquivamento/monitoramento contínuo (aviso permanece 5 anos no site).`,
    metadados: { etapas: 6, base_legal: 'Portaria MJSP 618/2019; Portaria Conjunta 3/2019 (docs literais na base)' },
    tags: ['consumidor/recall', 'geral/fluxos'],
    fonte: EJC, urlFonte: '', dataConsulta: D,
    confiabilidade: 'B', vigente: true, status: 'ATIVO',
    dataUltimaVerificacao: D, proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'portaria-mjsp-618-2019-recall-texto-literal', tipo: 'FUNDAMENTA', descricao: 'Prazos das etapas 1-6.' },
      { destinoSlug: 'portaria-conjunta-3-2019-recall-veiculos-texto-literal', tipo: 'FUNDAMENTA', descricao: 'Ramos veiculares.' },
      { destinoSlug: 'checklist-conformidade-recall-fornecedor', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Verificação item a item do fluxo.' },
    ],
  },
  {
    slug: 'fluxo-dano-fato-produto-consumidor',
    titulo: 'Fluxo — Do acidente de consumo à reparação (fato do produto, lado do consumidor)',
    tipoDocumento: 'FLUXO', area: 'consumidor', subarea: 'fato-do-produto',
    assunto: 'Roteiro do consumidor após acidente/lesão por produto', prioridade: 'P1', lote: 'LOTE-014',
    conteudo: `## Fluxo operacional — evento → prazo → providência → responsável → documento → risco → próxima etapa

### ETAPA 1 — Acidente e preservação
- **Evento:** produto falha causando dano material/corporal.
- **Prazo:** imediato.
- **Providência:** NÃO alterar o produto; fotografar/videar tudo com data; guardar embalagem/manual; registrar boletim de ocorrência se houve lesão/incêndio.
- **Responsável:** consumidor/assistente.
- **Documento:** fotos, B.O., comprovantes.
- **Risco:** produto consertado por conta própria destrói a prova do defeito.
- **Próxima etapa:** documentação do dano.

### ETAPA 2 — Documentação
- **Providência:** nota fiscal; orçamentos; laudo técnico; gastos médicos (se corporal); consulta de recall (Senacon/RENAVAM).
- **Prazo:** o quanto antes (perícia independente, se necessário).
- **Risco:** dano sem prova objetiva → impugnação do nexo.
- **Próxima etapa:** cobrança amigável.

### ETAPA 3 — Cobrança amigável (SAC + notificação)
- **Providência:** reclamação ao fornecedor + notificação extrajudicial (peça-modelo vinculada) se houver risco/recurso omitido; plataforma consumidor.gov.br após SAC (7 dias úteis).
- **Prazo:** prazos de resposta dos canais; sem prejuízo do prazo prescricional (5 anos — art. 27 CDC).
- **Documento:** protocolos, notificação com AR.
- **Risco:** fornecedor negar a defeito → preparar perícia.
- **Próxima etapa:** decisão judicial/administrativa.

### ETAPA 4 — Via administrativa (Procon/DPDC) ou judicial
- **Providência:** escolher via; no judicial, ação de reparação com inversão do ônus (art. 6º VIII), exibição do produto, perícia; réus: fabricante/importador (art. 12) + comerciante nas hipóteses do art. 13 + cadeia (art. 25).
- **Prazo:** prescrição 5 anos (art. 27); decadência NÃO se aplica a fato (é regime do vício — art. 26).
- **Documento:** peça-modelo (vinculada) + dossiê (checklist vinculada).
- **Risco:** réu errado (comerciante sem hipótese do art. 13) → extinção parcial; mitigar justificando cadeia/solidariedade.
- **Próxima etapa:** instrução.

### ETAPA 5 — Instrução e resultado
- **Providência:** perícia no produto conservado; testemunhas do acidente; laudos médicos (se lesão).
- **Risco:** laudo inconclusivo → reforço com histórico de recalls do modelo (prova de ciência do fornecedor).
- **Próxima etapa:** execução/quantificação.

### ETAPA 6 — Quantificação e execução
- **Providência:** danos materiais (restabelecimento integral) + morais + eventual lucros cessantes; recall omitido pode reforçar o dano moral (risco prolongado).
- **Próxima etapa:** cumprimento de sentença.`,
    metadados: { etapas: 6, base_legal: 'CDC arts. 12-13, 27 (docs literais na base)' },
    tags: ['consumidor/fato-do-produto', 'geral/fluxos'],
    fonte: EJC, urlFonte: '', dataConsulta: D,
    confiabilidade: 'B', vigente: true, status: 'ATIVO',
    dataUltimaVerificacao: D, proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'peca-reclamacao-fato-produto', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Peça da etapa 4.' },
      { destinoSlug: 'fluxo-reclamacao-vicio-produto', tipo: 'COMPLEMENTA', descricao: 'Fluxo do regime de vício (art. 18) — não confundir.' },
      { destinoSlug: 'doutrina-vicio-vs-fato-consumidor', tipo: 'FUNDAMENTA', descricao: 'Distinção dos regimes.' },
    ],
  },

  // ============ TABELA DE DOCUMENTOS ============
  {
    slug: 'tabela-documentos-fato-produto-recall',
    titulo: 'Tabela — Documentos por fase: fato do produto e recall',
    tipoDocumento: 'TABELA_DOCUMENTOS', area: 'consumidor', subarea: 'fato-do-produto',
    assunto: 'Documentos necessários por situação', prioridade: 'P1', lote: 'LOTE-014',
    conteudo: `## Documentos por fase

| Fase | Documento | Origem | Nota operacional |
|---|---|---|---|
| Aquisição | Nota fiscal/cupom/fatura | Consumidor | Vincula o produto ao vendedor e à data |
| Identificação | Manual, etiqueta de lote/série/chassi | Consumidor | Prova defeito de informação (art. 12 caput) |
| Preservação | Fotos/vídeos datados do produto e acidente | Consumidor | Antes de qualquer reparo |
| Técnico | Laudo particular / engenharia forense | Terceiro | Defeito + nexo; perícia judicial supre |
| Veicular | CRLV com anotação de recall (RENAVAM) | DENATRAN | Prova objetiva de chamamento não atendido >1 ano (Port. Conj. 3/2019 art. 6º) |
| Recall | Aviso de risco no site (captura datada) | Fornecedor | Disponível 5 anos; ≤2 clicks (Port. 618 art. 4º § 4º) |
| Recall | Certificado de atendimento | Fornecedor | Port. 618 art. 7º; veicular com garantia (Conjunta art. 4º) |
| Recall | Comunicado na Senacon (SEI) | Senacon/fornecedor | Prova da ciência administrativa (art. 3º) |
| Dano material | Orçamentos/notas de reparo | Consumidor | Quantificar restabelecimento |
| Dano corporal | Laudos médicos/B.O. | Saúde/autoridade | Dano moral e estético |
| Extrajudicial | Notificação com AR/retorno | Consumidor | Ciência do fornecedor |
| Judicial | Procuração + documentos pessoais | Consumidor | Representação |
| Judicial | Consulta de recall com data (print) | Senacon/DPDC | Inversão do ônus e verossimilhança |

## Nota
- Fato do produto NÃO sujeita ao prazo decadencial do art. 26 (que governa o vício); aplica-se a prescrição de 5 anos do art. 27.`,
    metadados: { linhas: 13, bancos_relacionados: ['TABELA_DOCUMENTOS'] },
    tags: ['consumidor/fato-do-produto', 'consumidor/recall'],
    fonte: EJC, urlFonte: '', dataConsulta: D,
    confiabilidade: 'B', vigente: true, status: 'ATIVO',
    dataUltimaVerificacao: D, proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'checklist-dossie-fato-produto', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Checklist consolida esta tabela.' },
      { destinoSlug: 'tabela-documentos-reclamacao-consumidor', tipo: 'COMPLEMENTA', descricao: 'Tabela do regime de vício.' },
    ],
  },

  // ============ TRIAGEM ============
  {
    slug: 'triagem-fato-produto-recall',
    titulo: 'Triagem — Script de perguntas: fato do produto e recall',
    tipoDocumento: 'TRIAGEM', area: 'consumidor', subarea: 'fato-do-produto',
    assunto: 'Roteiro de entrevista inicial', prioridade: 'P1', lote: 'LOTE-014',
    conteudo: `## Script de triagem (perguntas na ordem — decisão em cada ramo)

1. **O produto causou dano (acidente), ou apenas funcionou mal?**
   - Dano/acidente → fato do produto (arts. 12-13, 27 — este roteiro).
   - Só funcionou mal → vício (art. 18/20, decadência 30/90 — roteiro vinculado da triagem consumerista).
2. **O produto ainda está em posse do cliente? Foi consertado ou alterado?**
   - Consertado → documentar quem consertou e por quê (risco de prova).
   - Intacto → instruir preservação imediata.
3. **Qual a marca, modelo, lote/série/chassi e data de fabricação?**
   - Sem identificação → art. 13, II (comerciante responde por produto sem identificação clara).
4. **Há nota fiscal? Quando e onde comprou?**
   - Sem nota → alternativas: cartão, rastreamento, garantia; risco de prova do vínculo.
5. **O uso foi conforme o manual/uso esperado? Terceiros manusearam?**
   - Uso incompatível → alertar sobre a excludente de culpa exclusiva (art. 12 § 3º III).
6. **O modelo já teve recall (Senacon/RENAVAM)? O cliente foi avisado? Atendeu?**
   - Recall não atendido (veicular) → verificar CRLV anotado (prova objetiva); atendimento negado → violação do art. 10 da Portaria 618/2019.
7. **Houve lesão corporal? Quais gastos médicos?**
   - Lesão → laudos, B.O., dano moral + estético; prazo 5 anos (art. 27).
8. **Quando descobriu que o dano decorria do produto (data e autoria)?**
   - Marca o termo inicial da prescrição (art. 27).
9. **Quem fabricou/importou? É identificável no país?**
   - Não identificável → art. 13, I-II (comerciante responde).
10. **É produto perecível? Como foi conservado no vendedor?**
    - Conservação inadequada → art. 13, III.
11. **Houve outros casos parecidos (coletivo)? Acidentes noticiados?**
    - Sim → avaliar coletivo/ACPC e reforço probatório.
12. **Valor do dano material e documentos de quantificação?**
    - Define alçada (JEC 40 SM / foro comum) e pedido.

## Resultado esperado
Classificar em: FATO-PRODUTO-ACIDENTE / FATO-PRODUTO-INFORMACAO / RECALL-OMITIDO / VICIO (encaminhar ao roteiro de vício) e listar documentos faltantes do dossiê.`,
    metadados: { perguntas: 12, decisoes: ['fato-produto-acidente', 'fato-produto-informacao', 'recall-omitido', 'vicio'] },
    tags: ['consumidor/fato-do-produto', 'geral/triagem'],
    fonte: EJC, urlFonte: '', dataConsulta: D,
    confiabilidade: 'B', vigente: true, status: 'ATIVO',
    dataUltimaVerificacao: D, proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'triagem-consumidor-vicio-fato', tipo: 'COMPLEMENTA', descricao: 'Roteiro geral consumerista (vício x fato).' },
      { destinoSlug: 'checklist-dossie-fato-produto', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Saída da triagem alimenta o checklist.' },
    ],
  },

  // ============ PRAZOS ============
  {
    slug: 'prazo-recall-comunicacao-senacon-2-dias-uteis',
    titulo: 'Prazo — Recall: comunicar decisão de chamamento à Senacon em 2 dias úteis (Portaria MJSP 618/2019, art. 3º)',
    tipoDocumento: 'PRAZO', area: 'consumidor', subarea: 'recall',
    assunto: 'Prazo regulatório do fornecedor', prioridade: 'P1', lote: 'LOTE-014',
    conteudo: `## Prazo: 2 DIAS ÚTEIS
- **Obrigado:** fornecedor que decidiu realizar campanha de chamamento (recall) de produto/serviço.
- **Termo inicial:** da decisão de realizar o chamamento.
- **Texto literal (Portaria MJSP nº 618/2019, art. 3º, PDF oficial gov.br lido na íntegra):** "O fornecedor que, posteriormente à introdução do produto ou serviço no mercado de consumo, tiver conhecimento da sua nocividade ou periculosidade, deverá comunicar o fato, no prazo de dois dias úteis, contados da decisão de realizar o chamamento, à Secretaria Nacional do Consumidor e ao órgão normativo ou regulador competente."
- **Destinatários:** Senacon + órgão normativo/regulador do setor; preferencialmente por SEI.
- **Antes disso:** 24 horas para comunicar o INÍCIO DE INVESTIGação (art. 2º) e teto de 10 dias úteis para investigar (art. 2º § 1º) — docs de prazo vinculados.
- **Consequência do descumprimento:** sanções do CDC e do Decreto 2.181/1997 (art. 14).`,
    metadados: { prazo: '2 dias úteis', base: 'Portaria MJSP 618/2019, art. 3º caput', termo_inicial: 'decisão de realizar o chamamento', sujeito: 'fornecedor' },
    tags: ['consumidor/recall', 'geral/prazos'],
    fonte: 'Ministério da Justiça e Segurança Pública (gov.br)', urlFonte: URL_P618, dataConsulta: D,
    confiabilidade: 'A', vigente: true, status: 'ATIVO',
    dataUltimaVerificacao: D, proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'portaria-mjsp-618-2019-recall-texto-literal', tipo: 'EXTRAI', descricao: 'Documento de origem.' },
      { destinoSlug: 'prazo-recall-investigacao-10-dias-uteis', tipo: 'ANTES_DE', descricao: 'Investigação precede o chamamento.' },
    ],
  },
  {
    slug: 'prazo-recall-investigacao-10-dias-uteis',
    titulo: 'Prazo — Recall: investigação interna em até 10 dias úteis (Portaria MJSP 618/2019, art. 2º § 1º)',
    tipoDocumento: 'PRAZO', area: 'consumidor', subarea: 'recall',
    assunto: 'Prazo regulatório do fornecedor', prioridade: 'P1', lote: 'LOTE-014',
    conteudo: `## Prazo: 10 DIAS ÚTEIS (teto)
- **Obrigado:** fornecedor que tomou conhecimento da possibilidade de produtos/serviços nocivos ou perigosos introduzidos no mercado.
- **Termo inicial:** da comunicação à Senacon (que ocorre em 24 horas — art. 2º caput).
- **Texto literal (Portaria MJSP nº 618/2019, art. 2º §§ 1º-2º):** "A investigação do fornecedor de produtos e serviços, para determinar a comunicação de que trata o art. 3º desta Portaria não deve ultrapassar o prazo de dez dias úteis, a menos que o fornecedor demonstre circunstanciadamente que a extensão do prazo é necessária para a conclusão dos trabalhos. § 2º Concluída a investigação... deverá apresentar o comunicado que trata o art. 3º ou os motivos pelos quais não será necessário iniciar campanha de chamamento."
- **Saída obrigatória:** comunicado de recall OU motivação de não-cabimento.
- **Uso no EJC:** medir morosidade do fornecedor em investigar risco noticiado (fortalece dolo/negligência e o risco de "deveria saber" do art. 10 CDC caput).`,
    metadados: { prazo: '10 dias úteis', base: 'Portaria MJSP 618/2019, art. 2º § 1º', termo_inicial: 'após comunicação de início de investigação (24h)', sujeito: 'fornecedor' },
    tags: ['consumidor/recall', 'geral/prazos'],
    fonte: 'Ministério da Justiça e Segurança Pública (gov.br)', urlFonte: URL_P618, dataConsulta: D,
    confiabilidade: 'A', vigente: true, status: 'ATIVO',
    dataUltimaVerificacao: D, proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'prazo-recall-comunicacao-senacon-2-dias-uteis', tipo: 'SEGUE', descricao: 'Etapa seguinte do fluxo regulatório.' },
      { destinoSlug: 'portaria-mjsp-618-2019-recall-texto-literal', tipo: 'EXTRAI', descricao: 'Documento de origem.' },
    ],
  },

  // ============ ARGUMENTAÇÃO ============
  {
    slug: 'argumentacao-fato-produto-bilateral',
    titulo: 'Argumentação — Fato do produto: consumidor x fornecedor (defesas e rebates)',
    tipoDocumento: 'ARGUMENTACAO', area: 'consumidor', subarea: 'fato-do-produto',
    assunto: 'Controvérsias centrais e rebates', prioridade: 'P1', lote: 'LOTE-014',
    conteudo: `## Controvérsia 1 — O produto era defeituoso?
- **Consumidor:** "não oferece a segurança que dele legitimamente se espera" (art. 12 § 1º), considerando apresentação, uso esperado e época de circulação; laudo + histórico de reclamações/recalls do modelo provam o padrão de falha.
- **Fornecedor:** o produto era seguro para a época; outro de melhor qualidade posterior não o torna defeituoso (art. 12 § 2º — texto literal na base); a falha decorreu de uso fora do esperado.
- **Rebate:** uso fora do esperado só exonera como CULPA EXCLUSIVA (art. 12 § 3º III — ônus do fornecedor); apresentação/advertências insuficientes já são defeito (art. 12 caput).

## Controvérsia 2 — Quem é o réu correto?
- **Consumidor:** fabricante/importador respondem sempre (art. 12); comerciante nas 3 hipóteses do art. 13; cadeia/solidariedade do art. 25 (marketplace — doc vinculado).
- **Fornecedor:** negativa de legitimidade do comerciante (fora do art. 13) ou do fabricante estrangeiro sem representação.
- **Rebate:** art. 13, I (fabricante não identificável) e II (produto sem identificação clara) alcançam o vendedor; pagamento por quem for atingido abre regresso (art. 13 p.ú.).

## Controvérsia 3 — Nexo causal
- **Consumidor:** cronologia + laudo + exclusão de outras causas (manutenção, uso) — inversão do ônus (art. 6º VIII) facilita quando verossímil.
- **Fornecedor:** causa exógena (terceiro, desgaste, mau uso).
- **Rebate:** as excludentes são taxativas (art. 12 § 3º) e exigem PROVA do fornecedor; "desgaste normal" não é excludente legal autônoma.

## Controvérsia 4 — Recall e agravamento
- **Consumidor:** ciência do defeito (recall próprio, estrangeiro, relatórios à Senacon) + omissão/demora (24h/10 dias úteis/2 dias úteis — Port. 618/2019) agravam o dano moral e evidenciam o defeito; veicular: CRLV anotado (1 ano sem atendimento) é prova objetiva.
- **Fornecedor:** campanha existente e diligente descaracteriza omissão; atendimento oferecido afasta a má-fé.
- **Rebate:** ampliação obrigatória da campanha se resultados insatisfatórios (art. 9º) e subsistência da reparação gratuita (art. 10) — campanha "papel" não afasta o dever real.`,
    metadados: { controversias: 4, uso: 'preparação de contestação e réplica' },
    tags: ['consumidor/fato-do-produto', 'geral/argumentacao'],
    fonte: EJC, urlFonte: '', dataConsulta: D,
    confiabilidade: 'B', vigente: true, status: 'ATIVO',
    dataUltimaVerificacao: D, proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'tese-fato-produto-responsabilidade-objetiva-defesas', tipo: 'FUNDAMENTA', descricao: 'Tese central do regime.' },
      { destinoSlug: 'portaria-mjsp-618-2019-recall-texto-literal', tipo: 'FUNDAMENTA', descricao: 'Prazos citados na controvérsia 4.' },
    ],
  },

  // ============ DOUTRINA ============
  {
    slug: 'doutrina-defeito-tipos-fabricacao-projeto-informacao',
    titulo: 'Doutrina — Tipos de defeito: fabricação/construção, projeto/concepção e informação (bases do art. 12 CDC)',
    tipoDocumento: 'DOUTRINA', area: 'consumidor', subarea: 'fato-do-produto',
    assunto: 'Conceitos operacionais', prioridade: 'P1', lote: 'LOTE-014',
    conteudo: `## Conceito — Defeito de fabricação (construção)
Falha na execução/produção: o produto sai do padrão projetado (peça mal montada, lote contaminado, solda defeituosa). Prova típica: exame do exemplar (a diferença em relação à especificação). No art. 12 caput: "fabricação, construção, montagem".

## Conceito — Defeito de projeto (concepção)
O produto funciona como projetado, mas o próprio projeto é inseguro diante dos usos razoáveis. Aparece nos recalls estruturais (componente redimensionado). No art. 12 caput: "projeto" e "fórmulas". Defesa típica do fornecedor: estado da técnica na época (art. 12 § 1º, III) — rebate: o art. 12 § 2º impede tratar como não defeituoso "pelo fato de outro de melhor qualidade ter sido colocado no mercado" (a noção é de segurança legitimamente esperada, não de excelência).

## Conceito — Defeito de informação
Ausência/insuficiência de advertências sobre riscos e modo de uso. No art. 12 caput, parte final: "informações insuficientes ou inadequadas sobre sua utilização e riscos". Conecta-se ao art. 9º (informação ostensiva para produtos potencialmente nocivos — texto literal na base) e é a base doutrinária do recall (informar E recolher).

## Conceito — Segurança legitimamente esperada (critério)
Padrão objetivo do consumidor médio considerando: apresentação (promessa implícita), uso e riscos razoavelmente esperados, época de circulação (art. 12 § 1º, I-III). Não se exige produto infalível — exige-se o que a confiança legítima autoriza.

## Conceito — Acidente de consumo x vício
Vício = produto/serviço abaixo do padrão de qualidade/adequação (art. 18-20; respostas de reparo/substituição/redução). Fato = dano colateral à segurança (arts. 12-14). A doutrina fala em "acidente de consumo" para o evento danoso decorrente de defeito. Distinção operacional: reclamação por funcionamento = vício; reclamação por dano = fato (docs doutrinais de vício vinculados).

## Uso no EJC
Classificar o defeito na petição (fabricação/projeto/informação) orienta a prova: exemplar para fabricação; técnica comparativa para projeto; material gráfico/manual para informação.`,
    metadados: { conceitos: ['defeito-fabricacao', 'defeito-projeto', 'defeito-informacao', 'seguranca-legitimamente-esperada', 'acidente-de-consumo'] },
    tags: ['consumidor/fato-do-produto', 'geral/doutrina'],
    fonte: EJC, urlFonte: '', dataConsulta: D,
    confiabilidade: 'B', vigente: true, status: 'ATIVO',
    dataUltimaVerificacao: D, proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'cdc-art-12-fato-produto-texto-literal', tipo: 'FUNDAMENTA', descricao: 'Base literal do art. 12.' },
      { destinoSlug: 'doutrina-vicio-vs-fato-consumidor', tipo: 'COMPLEMENTA', descricao: 'Distinção vício x fato.' },
    ],
  },
  {
    slug: 'doutrina-recall-conceito-senacon',
    titulo: 'Doutrina — Recall (campanha de chamamento): conceito oficial e semântica operacional',
    tipoDocumento: 'DOUTRINA', area: 'consumidor', subarea: 'recall',
    assunto: 'Conceito e funcionamento do chamamento', prioridade: 'P1', lote: 'LOTE-014',
    conteudo: `## Conceito (fonte oficial — Senacon/gov.br, consulta 2026-08-30)
"Recall é a forma pela qual um fornecedor vem a público informar que seu produto ou serviço apresenta riscos aos consumidores. Ao mesmo tempo, recolhe produtos, esclarece fatos e apresenta soluções."
- Fundamento citado pela própria Senacon: CDC art. 10 § 1º — conhecer o defeito após a colocação no mercado impõe comunicar IMEDIATAMENTE às autoridades e aos consumidores.
- "Previsão normativa do Recall? Código de Defesa do Consumidor e Portarias MJSP nº 618/2019 e Portaria Interministerial nº 3, de 01 de julho de 2019" (texto do FAQ oficial).

## Semântica operacional (o que a Senacon orienta ao consumidor)
- **O que fazer em caso de recall:** verificar se o produto é abrangido pela campanha e, em caso positivo, "entrar em contato com o fornecedor ou dirigir-se ao local indicado no aviso de risco, para que seja realizado o reparo ou a troca da peça defeituosa, sem qualquer ônus".
- **Prazo para atender:** "enquanto persistir o risco que originou o recall, o consumidor poderá exigir o reparo ou a troca da peça defeituosa junto ao fornecedor" — não há validade da campanha para o consumidor; a oferta é enquanto houver risco.
- **Canais de verificação:** base de dados do DPDC; em caso de dúvida, Procon (avaliação de risco à coletividade).
- **Órgãos:** SNAR (Sistema Nacional de Avisos de Recall) e CEPAC como estrutura de monitoramento citadas no FAQ oficial.

## Uso no EJC
- Contrapor a "campanha vencida": risco persistente = dever persistente (oficial).
- Medir efetividade: percentuais de atendimento dos relatórios (Port. 618/2019 art. 8º) sustentam pedido de ampliação (art. 9º).`,
    metadados: { conceitos: ['recall', 'aviso-de-risco', 'snar', 'cepac', 'dpdc'], fonte_oficial: 'Senacon FAQ gov.br (captura 2026-08-30)' },
    tags: ['consumidor/recall', 'geral/doutrina'],
    fonte: 'Ministério da Justiça — Senacon (gov.br)', urlFonte: URL_SENACON, dataConsulta: D,
    confiabilidade: 'A', vigente: true, status: 'ATIVO',
    dataUltimaVerificacao: D, proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'portaria-mjsp-618-2019-recall-texto-literal', tipo: 'REGULAMENTA', descricao: 'Procedimento detalhado.' },
      { destinoSlug: 'cdc-arts-9-10-periculosidade-recall-texto-literal', tipo: 'FUNDAMENTA', descricao: 'Arts. 9º-10 CDC (literal).' },
    ],
  },

  // ============ REGRAS DE INTELIGÊNCIA ============
  {
    slug: 'regra-se-fato-produto-diagnostico',
    titulo: 'Regra — SE acidente de consumo ENTÃO mapear responsáveis, defesas taxativas e prazo de 5 anos',
    tipoDocumento: 'REGRA_INTELIGENCIA', area: 'consumidor', subarea: 'fato-do-produto',
    assunto: 'Regra SE-ENTÃO de diagnóstico', prioridade: 'P1', lote: 'LOTE-014',
    conteudo: `## Regra SE-ENTÃO (inteligência processual EJC)
**SE** o caso envolve dano (material/corporal) causado por produto ou serviço
**ENTÃO** executar a sequência:
1. Classificar o defeito: fabricação / projeto / informação (docs doutrinais vinculados).
2. Listar responsáveis: fabricante, produtor, construtor, importador (art. 12 — sempre); comerciante SE art. 13, I-III; cadeia/solidariedade (art. 25/marketplace).
3. Testar as excludentes taxativas (art. 12 § 3º): não colocou no mercado? defeito inexistente? culpa exclusiva do consumidor/terceiro? — cada resposta exige PROVA do fornecedor.
4. Conferir recall: campanha nacional (Senacon/DPDC), veicular (RENAVAM/CRLV), estrangeira do mesmo defeito — cada achado vira prova de ciência.
5. Prazo: prescrição de 5 anos (art. 27) a partir do conhecimento do dano e da autoria (decadência do art. 26 NÃO se aplica a fato).
6. Provas mínimas: produto preservado + aquisição + laudo/nexo + quantificação.
7. Saída: peça (fato do produto) OU notificação extrajudicial de recall omitido.

**SE** não há dano, apenas funcionamento inadequado
**ENTÃO** redirecionar ao regime de vício (arts. 18-20; decadência 30/90 — art. 26) — NÃO usar este roteiro.

## Limites
- Regra de triagem estrutural; probabilidade final depende do laudo e do réu eleito.`,
    metadados: { entradas: ['dano', 'produto/serviço'], saidas: ['responsáveis', 'defesas', 'prazo-5-anos', 'recall-check'] },
    tags: ['consumidor/fato-do-produto', 'geral/inteligencia'],
    fonte: EJC, urlFonte: '', dataConsulta: D,
    confiabilidade: 'B', vigente: true, status: 'ATIVO',
    dataUltimaVerificacao: D, proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'tese-fato-produto-responsabilidade-objetiva-defesas', tipo: 'FUNDAMENTA', descricao: 'Tese operacionalizada.' },
      { destinoSlug: 'triagem-fato-produto-recall', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Roteiro de perguntas da mesma lógica.' },
    ],
  },
  {
    slug: 'regra-se-recall-nao-atendido-crlv',
    titulo: 'Regra — SE recall veicular não atendido há mais de 1 ano ENTÃO verificar CRLV anotado e exigir atendimento sem custo',
    tipoDocumento: 'REGRA_INTELIGENCIA', area: 'consumidor', subarea: 'recall',
    assunto: 'Regra SE-ENTÃO veicular', prioridade: 'P1', lote: 'LOTE-014',
    conteudo: `## Regra SE-ENTÃO (inteligência EJC)
**SE** existe campanha de recall veicular comunicada (RENAVAM) para o veículo do cliente
**E** o atendimento não ocorreu há mais de 1 ano contado da comunicação
**ENTÃO**:
1. Emitir/obter o CRLV: a informação de recall não atendido DEVE constar na anotação (Portaria Conjunta 3/2019, art. 6º caput — texto literal na base).
2. Exigir o atendimento SEM qualquer custo ("o chamamento não representa qualquer custo ao consumidor" — Port. 618/2019 art. 6º § 1º VII) e o certificado de atendimento (Conjunta art. 4º).
3. Notificar o fornecedor (peça-modelo vinculada) com prazo curto; ausência de resposta → Procon/DPDC + ação.
4. Usar o CRLV anotado como prova objetiva em qualquer demanda de fato do produto relacionada ao mesmo componente.
5. Após atendimento informado ao RENAVAM, o CRLV sai limpo no próximo licenciamento (Conjunta art. 6º § 2º) — conferir se a baixa foi registrada.

**SE** o fornecedor alega "campanha encerrada"
**ENTÃO** rebater com a orientação oficial da Senacon: enquanto persistir o risco, o consumidor pode exigir o reparo/troca (doc doutrinal vinculado) + possibilidade de prorrogação obrigatória (Port. 618 art. 9º).`,
    metadados: { entradas: ['recall-veicular', 'tempo-sem-atendimento'], saidas: ['crlv-check', 'exigir-atendimento', 'prova-objetiva'] },
    tags: ['consumidor/recall', 'geral/inteligencia'],
    fonte: EJC, urlFonte: '', dataConsulta: D,
    confiabilidade: 'B', vigente: true, status: 'ATIVO',
    dataUltimaVerificacao: D, proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'portaria-conjunta-3-2019-recall-veiculos-texto-literal', tipo: 'FUNDAMENTA', descricao: 'Art. 6º CRLV (literal).' },
      { destinoSlug: 'doutrina-recall-conceito-senacon', tipo: 'FUNDAMENTA', descricao: 'Orientação oficial ao consumidor.' },
    ],
  },

  // ============ JURIMETRIA ============
  {
    slug: 'jurimetria-fato-produto-recall',
    titulo: 'Jurimetria — Fato do produto e recall (estrutura de coleta — dados REAIS a preencher)',
    tipoDocumento: 'JURIMETRIA', area: 'consumidor', subarea: 'fato-do-produto',
    assunto: 'Esquema de métricas', prioridade: 'P1', lote: 'LOTE-014',
    conteudo: `## Estrutura de coleta (NENHUM dado inventado — preencher somente com dados reais)
| Métrica | Definição operacional | Fonte planejada | Valor atual |
|---|---|---|---|
| Taxa de comparecimento a recall (%) | atendidos / atingidos — por campanha | relatórios Senacon (Port. 618 art. 8º) | (vazio) |
| Tempo médio de investigação do fornecedor | da comunicação 24h ao comunicado | protocolos SEI | (vazio) |
| Índice de acidentes pós-campanha iniciada | acidentes relatados art. 3º § 1º VIII | comunicados | (vazio) |
| Procedência de ações por fato do produto | por juízo/tribunal e ano | pesquisa específica (RODADA FUTURA) | (vazio) |
| Tempo médio até sentença | ajuizamento → sentença | mesma fonte | (vazio) |

## Aviso metodológico
- Sem dados reais, o EJC NÃO estima percentuais — a estrutura serve para iniciar a coleta.
- Precedente da base: jurimetria de sanções ANPD (doc vinculado) segue o mesmo padrão de honestidade.`,
    metadados: { campos: 5, dados_reais: false },
    tags: ['consumidor/fato-do-produto', 'geral/jurimetria'],
    fonte: EJC, urlFonte: '', dataConsulta: D,
    confiabilidade: 'B', vigente: true, status: 'ATIVO',
    dataUltimaVerificacao: D, proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'portaria-mjsp-618-2019-recall-texto-literal', tipo: 'FUNDAMENTA', descricao: 'Métricas derivadas das obrigações.' },
    ],
  },
];
