// LOTE-009 — Defesa do Consumidor: vício, fato, arrependimento e plataformas digitais (P1)
// CDC arts. 6º, 14, 18, 20, 26 e 49 + Decreto 7.962/2013 — TEXTOS LITERAIS do Planalto (consulta 2026-08-30).
// Jurisprudência: TJDFT "Precedentes Qualificados" (página oficial, atualizada 2025-01-15, pesquisa 28/4/2025)
// — Acórdão 1965134 (0719604-85.2024.8.07.0003, 1ª TR, 07/02/2025, DJe 18/02/2025) e Acórdão 2033075
// (8ª Turma Cível, 21/08/2025). Notícia STJ 27/05/2025 (título/URL oficiais; texto integral sob anti-bot — nota honesta).
// ANTI-INVENÇÃO: nenhum REsp/número de súmula citado sem confirmação oficial nesta consulta.
import type { InputDocument } from '../../src/lib/ejc/types';

const D = '2026-08-30';
const PLANALTO = 'Presidência da República — Planalto';
const URL_CDC = 'https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm';
const EJC = 'Elaboração EJC — conteúdo estrutural original';

function leiCdc(
  slug: string, titulo: string, subarea: string, assunto: string, conteudo: string, artigos: string[],
  extra?: Partial<InputDocument>,
): InputDocument {
  return {
    slug, titulo, tipoDocumento: 'LEGISLACAO', area: 'consumidor', subarea,
    assunto, prioridade: 'P1', lote: 'LOTE-009',
    conteudo,
    metadados: { numero: 'Lei 8.078/1990 (CDC)', data_norma: '1990-09-11', orgao: 'Congresso Nacional', artigos_principais: artigos, vigente: true, confirmacao_texto: 'Extração literal do texto oficial compilado do Planalto em 2026-08-30.' },
    tags: ['consumidor/vicios', 'consumidor/fato-produto-servico'],
    fonte: PLANALTO,
    urlFonte: URL_CDC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    ...extra,
  };
}

export default [
  leiCdc(
    'cdc-art-6-direitos-basicos-texto-literal',
    'CDC art. 6º — Direitos básicos do consumidor, incluindo inversão do ônus da prova e crédito responsável (texto literal confirmado)',
    'vicios',
    'Direitos básicos e políticas públicas',
    `## Ficha da Norma
- **Norma:** Lei nº 8.078, de 11 de setembro de 1990 (CDC) — art. 6º.
- **Vigência:** vigente (texto compilado do Planalto reflete alterações da Lei 12.741/2012 e da Lei 14.181/2021).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30) — incisos centrais
"Art. 6º São direitos básicos do consumidor:
I - a proteção da vida, saúde e segurança contra os riscos provocados por práticas no fornecimento de produtos e serviços considerados perigosos ou nocivos;
III - a informação adequada e clara sobre os diferentes produtos e serviços, com especificação correta de quantidade, características, composição, qualidade, tributos incidentes e preço, bem como sobre os riscos que apresentem; (Redação dada pela Lei nº 12.741, de 2012)
IV - a proteção contra a publicidade enganosa e abusiva, métodos comerciais coercitivos ou desleais, bem como contra práticas e cláusulas abusivas ou impostas no fornecimento de produtos e serviços;
V - a modificação das cláusulas contratuais que estabeleçam prestações desproporcionais ou sua revisão em razão de fatos supervenientes que as tornem excessivamente onerosas;
VI - a efetiva prevenção e reparação de danos patrimoniais e morais, individuais, coletivos e difusos;
VII - o acesso aos órgãos judiciários e administrativos com vistas à prevenção ou reparação de danos...;
VIII - a facilitação da defesa de seus direitos, inclusive com a inversão do ônus da prova, a seu favor, no processo civil, quando, a critério do juiz, for verossímil a alegação ou quando for ele hipossuficiente, segundo as regras ordinárias de experiências;
XI - a garantia de práticas de crédito responsável, de educação financeira e de prevenção e tratamento de situações de superendividamento, preservado o mínimo existencial, nos termos da regulamentação, por meio da revisão e da repactuação da dívida, entre outras medidas; (Incluído pela Lei nº 14.181, de 2021)"

## Interpretação aplicada
- Inciso VIII: duplo critério alternativo para inversão do ônus — verossimilhança OU hipossuficiência, sempre "a critério do juiz". Nas demandas técnicas (defeitos, falhas de plataforma), pedir inversão LOGO na inicialmente exposição do caso, com indicadores de dificuldade probatória.
- Incisos V e XI: fundamento das teses revisionais e do tratamento do superendividado (mínimo existencial) — conexão com LOTE-006.
- Inciso IV: base das demandas por oferta/publicidade (conexão com arts. 30, 48 e 55 do CDC — não duplicados aqui).

## Hipóteses de aplicação no EJC
- Estrutura de qualquer petição consumerista: mapear quais direitos básicos foram violados e pedir a inversão.
- Triagem: identificar cedo demandas de superendividamento (repactuação).`,
    ['6'],
    {
      relacionamentos: [
        { destinoSlug: 'cdc-art-18-vicio-produto-texto-literal', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Vício do produto: aplicação concreta dos direitos básicos.' },
        { destinoSlug: 'lgpd-art-42-responsabilidade-civil-texto-literal', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Inversão do ônus também na LGPD (art. 42 § 2º).' },
        { destinoSlug: 'sumula-479-stj-fortuito-interno-fraudes', tipo: 'PRECEDENTE_APLICAVEL', descricao: 'Facilitação da defesa nas fraudes bancárias.' },
      ],
    },
  ),
  leiCdc(
    'cdc-art-14-fato-servico-texto-literal',
    'CDC art. 14 — Responsabilidade por defeito do serviço e hipóteses de exclusão (texto literal confirmado)',
    'fato-produto-servico',
    'Acidente de consumo por defeito do serviço',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 14. O fornecedor de serviços responde, independentemente da existência de culpa, pela reparação dos danos causados aos consumidores por defeitos relativos à prestação dos serviços, bem como por informações insuficientes ou inadequadas sobre sua fruição e riscos.
§ 1° O serviço é defeituoso quando não fornece a segurança que o consumidor dele pode esperar, levando-se em consideração as circunstâncias relevantes, entre as quais:
I - o modo de seu fornecimento;
II - o resultado e os riscos que razoavelmente dele se esperam;
III - a época em que foi fornecido.
§ 2º O serviço não é considerado defeituoso pela adoção de novas técnicas.
§ 3° O fornecedor de serviços só não será responsabilizado quando provar:
I - que, tendo prestado o serviço, o defeito inexiste;
II - a culpa exclusiva do consumidor ou de terceiro.
§ 4° A responsabilidade pessoal dos profissionais liberais será apurada mediante a verificação de culpa."

## Interpretação aplicada
- Responsabilidade **objetiva** (independe de culpa): só duas excludentes prováveis pelo fornecedor (§ 3º) — inexistência do defeito ou culpa exclusiva de consumidor/terceiro.
- "Defeito" = desvio do padrão de segurança legitimamente esperado (§ 1º) — não é o mesmo que vício (arts. 18-20; ver doutrina vinculada).
- Profissionais liberais: exceção com apuração subjetiva (§ 4º).
- Prazo prescricional do fato do serviço: 5 anos (art. 27 — já registrado no LOTE-001 com texto literal).

## Hipóteses de aplicação no EJC
- Plataformas digitais, bancos, telecom, transportes: defeito do serviço por falha de segurança (fraude, golpe no app, vazamento).
- Montar a "expectativa de segurança" concreta: como o serviço é fornecido, riscos esperados, época.`,
    ['14', '27'],
    {
      relacionamentos: [
        { destinoSlug: 'cdc-art-18-vicio-produto-texto-literal', tipo: 'DISTINCAO_CONCEITUAL', descricao: 'Diferença vício (18) x defeito (14).' },
        { destinoSlug: 'doutrina-vicio-vs-fato-consumidor', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Doutrina que detalha a distinção.' },
        { destinoSlug: 'cdc-art-27-fato-produto-5-anos', tipo: 'BASE_PRAZO', descricao: 'Prescrição de 5 anos do acidente de consumo (LOTE-001).' },
      ],
    },
  ),
  leiCdc(
    'cdc-art-18-vicio-produto-texto-literal',
    'CDC art. 18 — Vício do produto: 30 dias, três alternativas do consumidor e solidariedade (texto literal confirmado)',
    'vicios',
    'Vício de qualidade do produto',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30) — trechos essenciais
"Art. 18. Os fornecedores de produtos de consumo duráveis ou não duráveis respondem solidariamente pelos vícios de qualidade ou quantidade que os tornem impróprios ou inadequados ao consumo a que se destinam ou lhes diminuam o valor, assim como por aqueles decorrentes da disparidade, com a indicações constantes do recipiente, da embalagem, rotulagem ou mensagem publicitária, respeitadas as variações decorrentes de sua natureza, podendo o consumidor exigir a substituição das partes viciadas.
§ 1° Não sendo o vício sanado no prazo máximo de trinta dias, pode o consumidor exigir, alternativamente e à sua escolha:
I - a substituição do produto por outro da mesma espécie, em perfeitas condições de uso;
II - a restituição imediata da quantia paga, monetariamente atualizada, sem prejuízo de eventuais perdas e danos;
III - o abatimento proporcional do preço.
§ 2° Poderão as partes convencionar a redução ou ampliação do prazo previsto no parágrafo anterior, não podendo ser inferior a sete nem superior a cento e oitanta dias. Nos contratos de adesão, a cláusula de prazo deverá ser convencionada em separado, por meio de manifestação expressa do consumidor.
§ 3° O consumidor poderá fazer uso imediato das alternativas do § 1° deste artigo sempre que, em razão da extensão do vício, a substituição das partes viciadas puder comprometer a qualidade ou características do produto, diminuir-lhe o valor ou se tratar de produto essencial.
§ 6° São impróprios ao uso e consumo: I - os produtos cujos prazos de validade estejam vencidos; II - os produtos deteriorados, alterados, adulterados, avariados, falsificados, corrompidos, fraudados, nocivos à vida ou à saúde, perigosos ou, ainda, aqueles em desacordo com as normas regulamentares de fabricação, distribuição ou apresentação; III - os produtos que, por qualquer motivo, se revelem inadequados ao fim a que se destinam."

## Pontos conexos confirmados no mesmo texto oficial
- **Art. 19 (vício de quantidade):** fornecedores respondem solidariamente quando o conteúdo líquido for inferior às indicações; alternativas: abatimento proporcional ou complementação do peso/medida.
- **Art. 25:** vedada cláusula que impossibilite, exonere ou atenue a obrigação de indenizar; solidariedade entre responsáveis; § 2º — componente incorporado: fabricante/construtor/importador e quem incorporou são solidários.

## Interpretação aplicada
- Regra operacional: o consumidor reclama, o fornecedor tem o prazo de **30 dias** (ou o convencionado entre 7 e 180, com cláusula em separado nos contratos de adesão) para SANAR; não sanou → consumidor ESCOLHE UMA das três alternativas do § 1º (substituição / restituição atualizada / abatimento proporcional).
- Vício em produto essencial ou extensão que compromete a qualidade → uso IMEDIATO das alternativas (§ 3º).
- Decadência para reclamar do vício: art. 26 (30 dias não duráveis / 90 duráveis — doc vinculado).

## Hipóteses de aplicação no EJC
- Reclamações de celular, eletrodoméstico, veículo, e-commerce com produto avariado;
- Escolha estratégica da alternativa do § 1º conforme o caso (produto essencial → restituição imediata).`,
    ['18', '19', '25'],
    {
      relacionamentos: [
        { destinoSlug: 'cdc-art-26-decadencia-vicios-texto-literal', tipo: 'BASE_PRAZO', descricao: 'Decadência para reclamar do vício.' },
        { destinoSlug: 'prazo-vicio-produto-sanar-30-dias', tipo: 'BASE_PRAZO', descricao: 'Prazo operacional de sanamento.' },
        { destinoSlug: 'tjdft-marketplace-responsabilidade-intermediador', tipo: 'PRECEDENTE_APLICAVEL', descricao: 'Solidariedade da plataforma na cadeia de fornecimento.' },
        { destinoSlug: 'stj-noticia-vicio-reparo-30-dias-ressarcimento', tipo: 'PRECEDENTE_APLICAVEL', descricao: 'Prazo de reparo não afeta ressarcimento integral (notícia oficial STJ 2025).' },
      ],
    },
  ),
  leiCdc(
    'cdc-art-20-vicio-servico-texto-literal',
    'CDC art. 20 — Vício do serviço: reexecução, restituição ou abatimento (texto literal confirmado)',
    'vicios',
    'Vício de qualidade do serviço',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 20. O fornecedor de serviços responde pelos vícios de qualidade que os tornem impróprios ao consumo ou lhes diminuam o valor, assim como por aqueles decorrentes da disparidade com as indicações constantes da oferta ou mensagem publicitária, podendo o consumidor exigir, alternativamente e à sua escolha:
I - a reexecução dos serviços, sem custo adicional e quando cabível;
II - a restituição imediata da quantia paga, monetariamente atualizada, sem prejuízo de eventuais perdas e danos;
III - o abatimento proporcional do preço.
§ 1° A reexecução dos serviços poderá ser confiada a terceiros devidamente capacitados, por conta e risco do fornecedor.
§ 2° São impróprios os serviços que se mostrem inadequados para os fins que razoavelmente deles se esperam, bem como aqueles que não atendam as normas regulamentares de prestabilidade."

## Interpretação aplicada
- Diferente do vício do produto (art. 18), o vício do SERVIÇO NÃO tem prazo de sanamento prévio fixado em lei: o consumidor pode escolher desde logo entre as 3 alternativas (a reexecução é opcional, não pressuposto).
- Disparidade com a OFERTA ou publicidade também é vício (caput) — ponte com dever de informação do art. 6º III e Decreto 7.962/2013 (comércio eletrônico).
- Aplicação típica: planos/assinaturas, obras, consertos, serviços digitais entregues fora do prometido.

## Hipóteses de aplicação no EJC
- Demandas por serviço mal executado ou divergente da oferta online;
- Combinação com ressarcimento em dobro (art. 42 parágrafo único — LOTE-006) quando há pagamento indevido.`,
    ['20'],
    {
      relacionamentos: [
        { destinoSlug: 'cdc-art-18-vicio-produto-texto-literal', tipo: 'DISTINCAO_CONCEITUAL', descricao: 'Comparar regimes de vício produto x serviço.' },
        { destinoSlug: 'cdc-art-49-arrependimento-texto-literal', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'No e-commerce, desistência (art. 49) é outro regime, sem discutir vício.' },
      ],
    },
  ),
  leiCdc(
    'cdc-art-26-decadencia-vicios-texto-literal',
    'CDC art. 26 — Decadência para reclamar de vícios: 30/90 dias e hipóteses que obstam a decadência (texto literal confirmado)',
    'vicios',
    'Decadência do direito de reclamar',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 26. O direito de reclamar pelos vícios aparentes ou de fácil constatação caduca em:
I - trinta dias, tratando-se de fornecimento de serviço e de produtos não duráveis;
II - noventa dias, tratando-se de fornecimento de serviço e de produtos duráveis.
§ 1° Inicia-se a contagem do prazo decadencial a partir da entrega efetiva do produto ou do término da execução dos serviços.
§ 2° Obstam a decadência:
I - a reclamação comprovadamente formulada pelo consumidor perante o fornecedor de produtos e serviços até a resposta negativa correspondente, que deve ser transmitida de forma inequívoca;
III - a instauração de inquérito civil, até seu encerramento.
§ 3° Tratando-se de vício oculto, o prazo decadencial inicia-se no momento em que ficar evidenciado o defeito."

## Interpretação aplicada
- Termo inicial: ENTREGA efetiva do produto ou TÉRMINO do serviço (não a compra).
- A reclamação COMPROVADA ao fornecedor **obsta a decadência até a resposta negativa** (§ 2º I) — guardar protocolos mudou o jogo processual.
- Vício oculto: prazo conta da evidenciação do defeito (§ 3º).
- Distinção essencial: decadência (art. 26) rege o direito de RECLAMAR DO VÍCIO; prescrição (art. 27) rege a pretensão indenizatória do FATO (5 anos — doc LOTE-001).

## Hipóteses de aplicação no EJC
- Análise liminar de viabilidade em toda reclamação de vício (checar 30/90 dias + prova da reclamação);
- Montagem de dossiê: comprovante de entrega + protocolos de reclamação para travar decadência.`,
    ['26'],
    {
      relacionamentos: [
        { destinoSlug: 'cdc-art-18-vicio-produto-texto-literal', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Regime do vício a que a decadência se aplica.' },
        { destinoSlug: 'regra-se-vicio-consumidor-prazos', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Regra SE-ENTÃO de verificação de prazos.' },
      ],
    },
  ),
  leiCdc(
    'cdc-art-49-arrependimento-texto-literal',
    'CDC art. 49 — Direito de arrependimento em 7 dias fora do estabelecimento comercial (texto literal confirmado)',
    'servicos-digitais',
    'Desistência e prazo de reflexão',
    `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 49. O consumidor pode desistir do contrato, no prazo de 7 dias a contar de sua assinatura ou do ato de recebimento do produto ou serviço, sempre que a contratação de fornecimento de produtos e serviços ocorrer fora do estabelecimento comercial, especialmente por telefone ou a domicílio.
Parágrafo único. Se o consumidor exercitar o direito de arrependimento previsto neste artigo, os valores eventualmente pagos, a qualquer título, durante o prazo de reflexão, serão devolvidos, de imediato, monetariamente atualizados."

## Interpretação aplicada
- Requisito central: contratação FORA do estabelecimento comercial — nas contratações on-line, a jurisprudência e a regulamentação (Decreto 7.962/2013, doc vinculado) aplicam o direito de arrependimento como regra.
- Prazo: 7 dias da ASSINATURA ou do RECEBIMENTO do produto/serviço (o que permitir melhor exercício da reflexão).
- Consequência: devolução de imediato e monetariamente atualizada de QUALQUER valor pago (parágrafo único) — o estorno não é favor, é dever legal.
- Custo de devolução: o art. 50 (não transcrito integralmente aqui) trata de obrigações do fornecedor na desistência; no e-commerce, o Decreto 7.962 art. 5º detalha mecanismos (mesma ferramenta de contratação, rescisão de acessórios, estorno via instituição/cartão).

## Hipóteses de aplicação no EJC
- Compras on-line/telefone/fora da loja: notificar arrependimento em 7 dias e exigir estorno imediato;
- Defesa: diferenciar arrependimento (sem justificar motivo) de vício/defeito (fundamentados nos arts. 18-20).`,
    ['49', '50'],
    {
      relacionamentos: [
        { destinoSlug: 'decreto-7962-2013-comercio-eletronico-texto-literal', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Mecânica do arrependimento no e-commerce (estorno).' },
        { destinoSlug: 'fluxo-arrependimento-e-commerce', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Fluxo operacional do arrependimento.' },
        { destinoSlug: 'cdc-art-51-clausulas-abusivas-nulidade', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Cláusula que impeça o arrependimento é nula (art. 51 XII — LOTE-006).' },
      ],
    },
  ),
  leiCdc(
    'decreto-7962-2013-comercio-eletronico-texto-literal',
    'Decreto 7.962/2013 — Regulamentação do comércio eletrônico: informações, atendimento e arrependimento (textos literais confirmados)',
    'servicos-digitais',
    'Contratação eletrônica de consumidores',
    `## Ficha da Norma
- **Norma:** Decreto nº 7.962, de 15 de março de 2013 — regulamenta o CDC para o comércio eletrônico.
- **Vigência:** vigente.

## Textos CONFIRMADOS LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 1º Este Decreto regulamenta a Lei nº 8.078, de 11 de setembro de 1990, para dispor sobre a contratação no comércio eletrônico, abrangendo os seguintes aspectos: I - informações claras a respeito do produto, serviço e do fornecedor; II - atendimento facilitado ao consumidor; e III - respeito ao direito de arrependimento."

"Art. 2º Os sítios eletrônicos ou demais meios eletrônicos utilizados para oferta ou conclusão de contrato de consumo devem disponibilizar, em local de destaque e de fácil visualização, as seguintes informações: I - nome empresarial e número de inscrição... no CNPJ...; II - endereço físico e eletrônico, e demais informações necessárias para sua localização e contato; III - características essenciais do produto ou do serviço, incluídos os riscos à saúde e à segurança dos consumidores; IV - discriminação, no preço, de quaisquer despesas adicionais ou acessórias, tais como as de entrega ou seguros; V - condições integrais da oferta, incluídas modalidades de pagamento, disponibilidade, forma e prazo da execução do serviço ou da entrega ou disponibilização do produto; e VI - informações claras e ostensivas a respeito de quaisquer restrições à fruição da oferta."

"Art. 4º Para garantir o atendimento facilitado ao consumidor no comércio eletrônico, o fornecedor deverá: I - apresentar sumário do contrato antes da contratação... enfatizadas as cláusulas que limitem direitos; II - fornecer ferramentas eficazes ao consumidor para identificação e correção imediata de erros ocorridos nas etapas anteriores à finalização da contratação; III - confirmar imediatamente o recebimento da aceitação da oferta; IV - disponibilizar o contrato ao consumidor em meio que permita sua conservação e reprodução...; V - manter serviço adequado e eficaz de atendimento em meio eletrônico, que possibilite ao consumidor a resolução de demandas referentes a informação, dúvida, reclamação, suspensão ou cancelamento do contrato; ... VII - utilizar mecanismos de segurança eficazes para pagamento e para tratamento de dados do consumidor.
Parágrafo único. A manifestação do fornecedor às demandas previstas no inciso V do caput será encaminhada em até cinco dias ao consumidor."

"Art. 5º O fornecedor deve informar, de forma clara e ostensiva, os meios adequados e eficazes para o exercício do direito de arrependimento pelo consumidor.
§ 1º O consumidor poderá exercer seu direito de arrependimento pela mesma ferramenta utilizada para a contratação, sem prejuízo de outros meios disponibilizados.
§ 2º O exercício do direito de arrependimento implica a rescisão dos contratos acessórios, sem qualquer ônus para o consumidor.
§ 3º O exercício do direito de arrependimento será comunicado imediatamente pelo fornecedor à instituição financeira ou à administradora do cartão de crédito ou similar, para que: I - a transação não seja lançada na fatura do consumidor; ou II - seja efetivado o estorno do valor, caso o lançamento na fatura já tenha sido realizado.
§ 4º O fornecedor deve enviar ao consumidor confirmação imediata do recebimento da manifestação de arrependimento."

"Art. 7º A inobservância das condutas descritas neste Decreto ensejará aplicação das sanções previstas no art. 56 da Lei nº 8.078, de 1990."

## Interpretação aplicada
- Triologia do e-commerce regulado: **informação** (art. 2º), **atendimento** (art. 4º, com resposta em até 5 dias) e **arrependimento** (art. 5º, estorno via operadora do cartão).
- Segurança de pagamento e de dados é DEVER regulamentar do e-commerce (art. 4º VII) — ponte direta com LGPD art. 46.

## Hipóteses de aplicação no EJC
- Checklist de conformidade do lojista on-line (doc vinculado);
- Reclamações por falta de informação/no-show de resposta (5 dias) ou estorno negado.`,
    ['1', '2', '4', '5', '7'],
    {
      relacionamentos: [
        { destinoSlug: 'cdc-art-49-arrependimento-texto-literal', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Base legal do arrependimento detalhada pelo Decreto.' },
        { destinoSlug: 'checklist-conformidade-comercio-eletronico', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Checklist de conformidade baseado neste Decreto.' },
      ],
    },
  ),
  {
    slug: 'tjdft-marketplace-responsabilidade-intermediador',
    titulo: 'TJDFT — Marketplace integra a cadeia de fornecimento e responde solidariamente (Precedentes Qualificados; Acórdão 1965134, 1ª TR, 2025)',
    tipoDocumento: 'JURISPRUDENCIA',
    area: 'consumidor',
    subarea: 'servicos-digitais',
    assunto: 'Responsabilidade de plataformas digitais de intermediação',
    prioridade: 'P1',
    lote: 'LOTE-009',
    conteudo: `## Jurisprudência confirmada em página oficial do tribunal (TJDFT — "Precedentes Qualificados", tema "Responsabilidade do intermediador na venda feita pela internet"; página indica pesquisa atualizada em 28/4/2025, última modificação 15/01/2026)

### Tese registrada na página oficial
"A empresa que intermedia compras ou serviços pela internet e aufere vantagem econômica direta ou indireta, integrando a cadeia de fornecimento, responde objetivamente pelos danos causados ao consumidor."

### Trecho literal da ementa do acórdão representativo
"6. A recorrida/ré Mercado Livre, plataforma de comércio eletrônico, atua como intermediária na compra e venda de mercadorias. Neste contexto, ainda que a recorrida tenha estornado o valor referente ao primeiro pagamento feito pelo autor, a nova/falsa negociação ocorreu dentro do ambiente da plataforma ré, o que faz com que o consumidor tenha confiança na negociação realizada com o vendedor. Assim, a recorrida faz parte da cadeia de prestação de serviços, atraindo para si a responsabilidade solidária em face do risco do negócio, na forma do art. 7º. e 25 do CDC, sem prejuízo do direito de regresso. [...] 8. [...] verifica-se que aparece como beneficiário a instituição MercadoPago, o que conferiu verossimilhança para que o autor realizasse o pagamento."
- **Acórdão 1965134**, processo **0719604-85.2024.8.07.0003**, Relator(a): FLÁVIO FERNANDO ALMEIDA DA FONSECA, Primeira Turma Recursal, julgamento 07/02/2025, DJe 18/02/2025.

### Acórdãos representativos listados na mesma página oficial (todos TJDFT)
- Acórdão 2068984 — 0715930-71.2025.8.07.0001 — Rel. Leonor Aguena — 5ª Turma Cível — julg. 27/11/2025, DJe 04/12/2025
- Acórdão 2054948 — 0725530-53.2024.8.07.0001 — Rel. Carlos Pires Soares Neto — 1ª Turma Cível — julg. 08/10/2025, DJe 30/10/2025
- Acórdão 2018307 — 0701914-85.2025.8.07.0010 — Rel. Edi Maria Coutinho Bizzi — 3ª TR — julg. 07/07/2025, DJe 17/07/2025
- Acórdão 2005643 — 0789373-44.2024.8.07.0016 — Rel. Marília de Ávila e Silva Sampaio — 2ª TR — julg. 02/06/2025, DJe 11/06/2025
- Acórdão 2000064 — 0720668-79.2024.8.07.0020 — Rel. Giselle Rocha Raposo — 2ª TR — julg. 19/05/2025, DJe 28/05/2025

### Ponto de atenção — anúncios "estilo classificados" (OLX)
A mesma página oficial registra entendimento DIFERENCIADO para plataformas de anúncios equiparáveis a classificados (golpe do anúncio falso): reconhecimento de **culpa concorrente** de vendedor e comprador negligentes — "Precedentes" — **Acórdão 2033075**, 0721825-47.2024.8.07.0001, Rel. Diaulas Costa Ribeiro, 8ª Turma Cível, julg. 21/08/2025, DJe 26/08/2025. E a página reproduz trecho de jurisprudência do STJ no sentido de que "ao publicar anúncios por meio de site especializado no serviço de classificados o provedor de conteúdo atua como mero divulgador de ofertas elaboradas por terceiros, não assumindo, por isso, a condição de fornecedor dos produtos...".

## Regras anti-invenção aplicadas
- TODOS os números de acórdão/processo acima foram copiados literalmente da página oficial do TJDFT nesta consulta.
- NÃO citar precedentes de outros tribunais sobre marketplace que não estejam confirmados em fonte oficial (p.ex., decisões STJ específicas com REsp não verificadas aqui).`,
    metadados: { tribunal: 'TJDFT', numero_processo: '0719604-85.2024.8.07.0003', acordao: '1965134', data_julgamento: '2025-02-07', data_publicacao: '2025-02-18', orgao_fracionario: 'Primeira Turma Recursal', tema: 'responsabilidade de marketplace/intermediador' },
    tags: ['consumidor/servicos-digitais', 'consumidor/fato-produto-servico'],
    fonte: 'TJDFT — Jurisprudência em Temas / Precedentes Qualificados (página oficial)',
    urlFonte: 'https://www.tjdft.jus.br/consultas/jurisprudencia/jurisprudencia-em-temas/cdc-na-visao-do-tjdft-1/o-consumidor-na-internet/responsabilidade-do-intermediador-na-venda-feita-pela-internet',
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-09-30',
    relacionamentos: [
      { destinoSlug: 'cdc-art-18-vicio-produto-texto-literal', tipo: 'APLICACAO_LEGAL', descricao: 'Solidariedade dos fornecedores aplicada à plataforma.' },
      { destinoSlug: 'tese-marketplace-cadeia-fornecimento', tipo: 'TESE_RELACIONADA', descricao: 'Tese estruturada a partir deste precedente.' },
      { destinoSlug: 'cdc-art-14-fato-servico-texto-literal', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Falha do serviço da plataforma como acidente de consumo.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'stj-noticia-vicio-reparo-30-dias-ressarcimento',
    titulo: 'STJ — Prazo de 30 dias para reparo de produto defeituoso não afeta direito ao ressarcimento integral de danos materiais (notícia oficial 27/05/2025)',
    tipoDocumento: 'JURISPRUDENCIA',
    area: 'consumidor',
    subarea: 'vicios',
    assunto: 'Vício do produto — reparo e ressarcimento',
    prioridade: 'P1',
    lote: 'LOTE-009',
    conteudo: `## Registro HONESTO (confiança B — verificação parcial)

- **Fonte:** notícia oficial no portal STJ (seção Comunicação/Notícias), datada de 27/05/2025.
- **Título oficial confirmado nesta consulta:** "Prazo de 30 dias para reparo de produto defeituoso não afeta direito ao ressarcimento integral de danos materiais".
- **Situação da verificação:** a página do STJ está sob proteção anti-bot (Cloudflare) nesta consulta (2026-08-30) — o TEXTO INTEGRAL da notícia e o NÚMERO DO PROCESSO não puderam ser extraídos. Conforme a regra do EJC, o registro fica com confiabilidade B e NÃO cita número de REsp ou relator.

## O que pode ser afirmado com segurança
1. A notícia oficial existe no domínio stj.jus.br (URL abaixo) com o título acima — o ENUNCIADO (prazo de 30 dias do art. 18 § 1º CDC não afeta o direito ao ressarcimento integral de danos materiais) é coerente com o texto literal do art. 18 § 1º, II do CDC (restituição "sem prejuízo de eventuais perdas e danos").
2. Para uso formal em peça, LOCALIZAR o processo na fonte oficial (scon.stj.jus.br ou portal de notícias STJ) e então atualizar este registro com número/relator + confiabilidade A.

## Regra anti-invenção
- NÃO inventar/estimar número de REsp, relator ou data de julgamento desta decisão até confirmação na fonte oficial.`,
    metadados: { tribunal: 'STJ', data_documento: '2025-05-27', status_verificacao: 'título/URL confirmados; texto integral pendente por anti-bot', pendencia: 'número do processo e relator a confirmar em scon.stj.jus.br' },
    tags: ['consumidor/vicios'],
    fonte: 'STJ — Notícias oficiais (portal)',
    urlFonte: 'https://www.stj.jus.br/sites/portalp/Paginas/Comunicacao/Noticias/2025/27052025-Prazo-de-30-dias-para-reparo-de-produto-defeituoso-nao-afeta-direito-ao-ressarcimento-integral-de-danos-materiais.aspx',
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-09-30',
    relacionamentos: [
      { destinoSlug: 'cdc-art-18-vicio-produto-texto-literal', tipo: 'APLICACAO_LEGAL', descricao: 'Enunciado coerente com o art. 18 § 1º, II (restituição + perdas e danos).' },
    ],
  } satisfies InputDocument,
  {
    slug: 'tese-marketplace-cadeia-fornecimento',
    titulo: 'Tese — Marketplace que aufere vantagem da intermediação integra a cadeia de fornecimento e responde solidariamente (CDC arts. 7º, 14, 18 e 25)',
    tipoDocumento: 'TESE',
    area: 'consumidor',
    subarea: 'servicos-digitais',
    assunto: 'Responsabilidade solidária de plataformas digitais',
    prioridade: 'P1',
    lote: 'LOTE-009',
    conteudo: `## TESE
**A plataforma de intermediação (marketplace) que aufere vantagem econômica direta ou indireta da transação integra a cadeia de fornecimento e responde solidariamente, com responsabilidade objetiva, pelos danos causados ao consumidor na negociação realizada em seu ambiente (CDC arts. 7º, parágrafo único; 14; 18; 25 § 1º), não se eximindo pelo simples fato de o vendedor imediato ser terceiro.**

## Fundamentos
1. **Vantagem econômica + confiança:** a página oficial do TJDFT (Precedentes Qualificados) consagra: "A empresa que intermedia compras ou serviços pela internet e aufere vantagem econômica direta ou indireta, integrando a cadeia de fornecimento, responde objetivamente pelos danos causados ao consumidor."
2. **Ambiente controlado pela plataforma:** quando a fraude/falha ocorre dentro do fluxo da plataforma (pagamento via meio indicado por ela, p.ex. Mercado Pago como beneficiário), a confiança legítima do consumidor foi criada pela própria estrutura (Acórdão 1965134, trecho literal no doc de jurisprudência vinculado).
3. **Solidariedade legal:** CDC art. 7º, parágrafo único (ofensa por mais de um autor → solidariedade) e art. 25 § 1º (mais de um responsável pelo dano → solidariedade).

## Requisitos para adotar a tese
- [ ] Plataforma auferiu vantagem (comissão, tarifa, anúncio, meio de pagamento próprio);
- [ ] Consumidor entrou no ambiente/fluxo da plataforma (URL, app, checkout, meio de pagamento indicado);
- [ ] Dano decorrente da negociação intermediada (produto não entregue, falso anúncio, golpe na plataforma).

## Limites honestos (quando a tese enfraquece)
- Plataformas de ANÚNCIOS estilo classificados (OLX-like) têm entendimento diferenciado: mero divulgador pode não ser fornecedor; e há precedentes de **culpa concorrente** do vendedor/comprador negligentes no golpe do anúncio falso (TJDFT Acórdão 2033075 — doc vinculado). A qualificação da plataforma (marketplace completo vs. classificado) é a 1ª batalha do caso.

## Riscos e probabilidade qualitativa
- Forte quando há pagamento no ambiente da plataforma e vantagem direta (comissão/intermediação de pagamento);
- Média/fraca em classificados puros sem intermediação de pagamento — avaliar culpa de vigiância (CDC art. 14 § 3º não isenta automaticamente).

## Probabilidade: ALTA em marketplaces com pagamento integrado; MÉDIA em classificados (análise de caso).`,
    metadados: { probabilidade: 'alta (marketplace com pagamento integrado) / média (classificados)', fundamentos: ['CDC 7º parágrafo único', 'CDC 14', 'CDC 25 § 1º', 'TJDFT Precedentes Qualificados'] },
    tags: ['consumidor/servicos-digitais'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-09-30',
    relacionamentos: [
      { destinoSlug: 'tjdft-marketplace-responsabilidade-intermediador', tipo: 'PRECEDENTE_SUSTENTADOR', descricao: 'Precedente oficial TJDFT com ementa literal.' },
      { destinoSlug: 'cdc-art-14-fato-servico-texto-literal', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Defeito do serviço da plataforma.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'tese-arrependimento-e-commerce-estorno-imediato',
    titulo: 'Tese — Arrependimento no e-commerce em 7 dias: estorno imediato e mecânica do Decreto 7.962/2013 (CDC art. 49)',
    tipoDocumento: 'TESE',
    area: 'consumidor',
    subarea: 'servicos-digitais',
    assunto: 'Desistência contratual on-line',
    prioridade: 'P1',
    lote: 'LOTE-009',
    conteudo: `## TESE
**Na contratação fora do estabelecimento comercial — incluindo compras on-line — o consumidor pode desistir no prazo de 7 dias a contar da assinatura ou do recebimento, sem necessidade de justificar, com devolução de imediato dos valores pagos, monetariamente atualizados (CDC art. 49); o fornecedor deve oferecer meio eficaz de arrependimento, inclusive pela mesma ferramenta de contratação, comunicar imediatamente a operadora do cartão para não lançar/estornar a transação e confirmar imediatamente o recebimento da manifestação (Decreto 7.962/2013, art. 5º).**

## Fundamentos literais
- CDC art. 49 (texto literal — doc vinculado): 7 dias + devolução "de imediato, monetariamente atualizados";
- Decreto 7.962/2013 art. 5º §§ 1º-4º (texto literal — doc vinculado): mesma ferramenta de contratação, rescisão dos contratos acessórios sem ônus, comunicação imediata à instituição/cartão (não lança ou estorna), confirmação imediata.

## Requisitos
- [ ] Contratação fora do estabelecimento (on-line, telefone, domicílio);
- [ ] Manifestação dentro de 7 dias da assinatura/recebimento;
- [ ] Prova da manifestação (mesma ferramenta, e-mail, protocolo) — peça de notificação vinculada.

## Contra-argumentos previsíveis
- "Produto usado" → o direito de arrependimento NÃO depende de defeito; a devolução em condições adequadas para novo uso costuma ser exigida (analisar caso);
- "Frete não devolve" → o parágrafo único do art. 49 fala em "valores eventualmente pagos, a qualquer título" — argumentar abrangência;
- "Prazo passado" → contar da assinatura OU do recebimento (escolher o termo que sustenta o pedido; em serviços contínuos, avaliar início da fruição).

## Probabilidade: ALTA quando a manifestação está dentro do prazo e com prova.`,
    metadados: { probabilidade: 'alta', fundamentos: ['CDC art. 49', 'Decreto 7.962/2013 art. 5º'] },
    tags: ['consumidor/servicos-digitais'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'cdc-art-49-arrependimento-texto-literal', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Texto literal do art. 49.' },
      { destinoSlug: 'decreto-7962-2013-comercio-eletronico-texto-literal', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Mecânica regulamentar do estorno.' },
      { destinoSlug: 'peca-notificacao-arrependimento-consumidor', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Peça de manifestação do arrependimento.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'tese-vicio-produto-alternativas-30-dias',
    titulo: 'Tese — Vício do produto: falha o reparo em 30 dias, o consumidor ESCOLHE (substituição, restituição atualizada ou abatimento) — CDC art. 18 § 1º',
    tipoDocumento: 'TESE',
    area: 'consumidor',
    subarea: 'vicios',
    assunto: 'Alternativas legais do consumidor no vício do produto',
    prioridade: 'P1',
    lote: 'LOTE-009',
    conteudo: `## TESE
**Constatar-se vício do produto e não ser sanado no prazo máximo de 30 dias (ou o convencionado entre 7 e 180, com cláusula em separado nos contratos de adesão), o consumidor exige, ALTERNATIVAMENTE e À SUA ESCOLHA: substituição por outro da mesma espécie, restituição imediata da quantia paga monetariamente atualizada sem prejuízo de perdas e danos, ou abatimento proporcional do preço (CDC art. 18 § 1º); a escolha pertence ao consumidor, não ao fornecedor; em produto essencial ou vício de grande extensão, as alternativas são imediatas (§ 3º).**

## Fundamento literal
- CDC art. 18 (texto integral no doc vinculado), especialmente §§ 1º, 2º e 3º; solidariedade dos fornecedores (caput) e vedação de excludentes contratuais (art. 25).

## Requisitos
- [ ] Vício de qualidade/quantidade ou disparidade com anúncio/rotulagem (art. 18 caput / art. 19);
- [ ] Prazo de sanamento esgotado (30 dias — ou convencional 7-180 válido);
- [ ] Reclamação comprovada ao fornecedor (também trava a decadência do art. 26 § 2º I);
- [ ] Escolha expressa da alternativa na notificação/pedido.

## Estratégia de escolha da alternativa
- Produto essencial ou dano em curso → restituição imediata + perdas e danos;
- Precisa do produto → substituição (com prazo para entrega);
- Produto parcialmente aproveitável → abatimento proporcional.

## Contra-argumentos previsíveis
- "Precisa de laudo técnico" → ônus facilitado pela inversão (art. 6º VIII); vício aparente dispensa perícia; decadência de 30/90 dias conta da entrega;
- "Só vale conserto" → a escolha é do consumidor; o reparo é apenas o primeiro estágio do regime;
- "Danos materiais não cabem" → art. 18 § 1º II manda restituir "sem prejuízo de eventuais perdas e danos".

## Notícia oficial STJ 2025
O enunciado da notícia STJ 27/05/2025 (doc vinculado) reforça: o prazo de 30 dias de reparo NÃO afeta o direito ao ressarcimento integral de danos materiais.

## Probabilidade: ALTA com prova de reclamação e do prazo esgotado.`,
    metadados: { probabilidade: 'alta', fundamentos: ['CDC art. 18 §§ 1º-3º', 'CDC art. 26 § 2º I', 'CDC art. 6º VIII'] },
    tags: ['consumidor/vicios'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'cdc-art-18-vicio-produto-texto-literal', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Texto literal do regime do vício.' },
      { destinoSlug: 'cdc-art-26-decadencia-vicios-texto-literal', tipo: 'BASE_PRAZO', descricao: 'Decadência aplicável.' },
      { destinoSlug: 'stj-noticia-vicio-reparo-30-dias-ressarcimento', tipo: 'PRECEDENTE_SUSTENTADOR', descricao: 'Enunciado oficial STJ 2025.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'peca-reclamacao-vicio-produto',
    titulo: 'Peça-modelo — Reclamação por vício do produto (CDC arts. 6º VIII, 18 e 26)',
    tipoDocumento: 'PECA',
    area: 'consumidor',
    subarea: 'vicios',
    assunto: 'Ação de ressarcimento/substituição por vício',
    prioridade: 'P1',
    lote: 'LOTE-009',
    conteudo: `# EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA ___ VARA CÍVEL / DO JUIZADO ESPECIAL CÍVEL DA COMARCA DE {{JUIZO}}

**Autos nº:** {{PROCESSO}} (se já distribuído)

**{{CLIENTE}}**, {{NACIONALIDADE}}, {{ESTADO_CIVIL}}, CPF {{CPF}}, RG {{RG}}, residente em {{ENDERECO}}, por seu advogado (procuração anexa), vem propor
**RECLAMAÇÃO** com fundamento nos arts. 6º, 18 e 26 do CDC contra **{{FORNECEDOR}}** (CNPJ {{CNPJ}}), endereço {{ENDERECO_FORNECEDOR}}, pelos fatos e fundamentos a seguir.

## 1. DOS FATOS
{{FATOS}} — o(a) Reclamante adquiriu o produto {{PRODUTO}} em {{DATA_COMPRA}}, por {{VALOR}}, comprovante anexo. Em {{DATA_VICIO}} constatou o vício: {{DESCRICAO_VICIO}}. Reclamou perante o fornecedor em {{DATA_RECLAMACAO}} (protocolo {{PROTOCOLO}}), sem sanção no prazo legal de 30 dias.

## 2. DO DIREITO
### 2.1. Vício do produto e alternativas do consumidor (art. 18)
Os fornecedores respondem solidariamente pelos vícios que tornem o produto impróprio ou lhe diminuam o valor (art. 18, caput). Não sanado o vício em 30 dias, o consumidor exige, alternativamente e à sua escolha: substituição; restituição imediata monetariamente atualizada, sem prejuízo de perdas e danos; ou abatimento proporcional (art. 18 § 1º). O(a) Reclamante **optou** por {{ALTERNATIVA_ESCOLHIDA}}.

### 2.2. Decadência obstada (art. 26)
O direito de reclamar (30/90 dias da entrega) está preservado: a reclamação comprovadamente formulada obstou a decadência até a resposta negativa (art. 26 § 2º I) — protocolos anexos.

### 2.3. Inversão do ônus da prova (art. 6º VIII)
Verossímil a alegação (provas anexas) e hipossuficiente o consumidor na prova técnica da origem do vício, requer-se a inversão do ônus da prova.

### 2.4. Cláusulas nulas (art. 25 e art. 51)
Eventual cláusula que exima ou atenue a obrigação de indenizar é nula (art. 25); a reparação de danos não pode ser limitada (art. 51 V — se aplicável ao caso).

## 3. DOS PEDIDOS
a) a inversão do ônus da prova (art. 6º VIII);
b) a condenação da(s) ré(s) em: {{PEDIDOS}} (substituição do produto / restituição de {{VALOR}} monetariamente atualizada + perdas e danos de {{VALOR_DANOS}} / abatimento proporcional de {{PERCENTUAL}}%);
c) a reparação por danos morais, se cabível no caso, que o(a) Reclamante arbitra em {{VALOR_MORAL}} (justificar: {{MOTIVACAO_MORAL}});
d) a aplicação da solidariedade entre fornecedores (art. 7º, parágrafo único e art. 25 § 1º), incluindo {{SEGUNDO_FORNECEDOR}} se aplicável;
e) a multa do art. 4º da Lei 9.099/95 ou do art. 60 do CDC, conforme o rito;
f) a produção de prova técnica, se necessária, sob o ônus invertido;
g) os ônus sucumbenciais.

Requer a notificação da(s) ré(s). Dá-se à causa o valor de {{VALOR_CAUSA}}.

Termos em que pede deferimento.
{{LOCAL}}, {{DATA}}
{{ADVOGADO}} — OAB {{OAB}}

---
### Checklist de revisão (antes do protocolo)
- [ ] Prova da compra (nota/pedido) e da entrega (data — início da decadência);
- [ ] Protocolos da reclamação prévia (obsta decadência — art. 26 § 2º I);
- [ ] Prova do prazo de 30 dias esgotado sem sanamento;
- [ ] Alternativa do § 1º escolhida expressamente;
- [ ] Rito adequado (JEC até 40 salários mínimos sem advogado na 1ª instância — avaliar).`,
    metadados: { tipo_modelo: 'petição inicial consumerista', variaveis: ['{{JUIZO}}', '{{PROCESSO}}', '{{CLIENTE}}', '{{NACIONALIDADE}}', '{{ESTADO_CIVIL}}', '{{CPF}}', '{{RG}}', '{{ENDERECO}}', '{{FORNECEDOR}}', '{{CNPJ}}', '{{ENDERECO_FORNECEDOR}}', '{{FATOS}}', '{{PRODUTO}}', '{{DATA_COMPRA}}', '{{VALOR}}', '{{DATA_VICIO}}', '{{DESCRICAO_VICIO}}', '{{DATA_RECLAMACAO}}', '{{PROTOCOLO}}', '{{ALTERNATIVA_ESCOLHIDA}}', '{{PEDIDOS}}', '{{VALOR_DANOS}}', '{{PERCENTUAL}}', '{{VALOR_MORAL}}', '{{MOTIVACAO_MORAL}}', '{{SEGUNDO_FORNECEDOR}}', '{{VALOR_CAUSA}}', '{{LOCAL}}', '{{DATA}}', '{{ADVOGADO}}', '{{OAB}}'], dadosFicticios: false },
    tags: ['consumidor/vicios'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'cdc-art-18-vicio-produto-texto-literal', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Regime do vício aplicado na peça.' },
      { destinoSlug: 'cdc-art-26-decadencia-vicios-texto-literal', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Decadência tratada na peça.' },
      { destinoSlug: 'tabela-documentos-reclamacao-consumidor', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Documentos a juntar com a peça.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'peca-notificacao-arrependimento-consumidor',
    titulo: 'Peça-modelo — Notificação de arrependimento (CDC art. 49 + Decreto 7.962/2013 art. 5º)',
    tipoDocumento: 'PECA',
    area: 'consumidor',
    subarea: 'servicos-digitais',
    assunto: 'Desistência e exigência de estorno',
    prioridade: 'P1',
    lote: 'LOTE-009',
    conteudo: `# NOTIFICAÇÃO DE ARREPENDIMENTO — CDC ART. 49 / DECRETO 7.962/2013, ART. 5º

**Para:** {{FORNECEDOR}} (CNPJ {{CNPJ}}) — canal de atendimento {{CANAL}}
**Por:** {{CONSUMIDOR}}, CPF {{CPF}}, e-mail {{EMAIL}}, telefone {{TELEFONE}}

## Assunto: exercício do direito de arrependimento — pedido nº {{PEDIDO}} / transação {{CODIGO_TRANSACAO}}, de {{DATA_COMPRA}}

Prezados,

Na qualidade de consumidor, manifesto formalmente meu **direito de arrependimento** quanto à contratação realizada em {{DATA_COMPRA}} — produto/serviço: {{PRODUTO}}, valor pago: {{VALOR}} —, exercício que se dá no prazo legal de 7 (sete) dias a contar de {{TERMO_INICIAL: assinatura do contrato / recebimento do produto}}, nos termos do art. 49 da Lei nº 8.078/1990 (CDC).

**Requerimentos imediatos (Decreto 7.962/2013, art. 5º):**
1. **Confirmação imediata** do recebimento desta manifestação (art. 5º § 4º);
2. **Comunicação imediata** à instituição financeira/administradora do cartão para que a transação **não seja lançada** na fatura ou seja **estornada**, caso já lançada (art. 5º § 3º, I e II);
3. **Rescisão dos contratos acessórios** vinculados à compra, sem qualquer ônus para mim (art. 5º § 2º);
4. Devolução de **imediato**, monetariamente atualizada, de todos os valores pagos, a qualquer título (CDC art. 49, parágrafo único) — inclusive frete, se pago;
5. Instruções para devolução do produto, se aplicável, sem custo para o consumidor.

**Fatores de atenção:**
- O direito de arrependimento **independe de defeito ou motivo**;
- Exerço o direito pela mesma ferramenta utilizada na contratação (art. 5º § 1º), facultadas outras vias;
- O descumprimento enseja sanções do art. 56 do CDC (art. 7º do Decreto) e medidas perante Procon/Juizado.

Aguarda-se confirmação e estorno em {{PRAZO_EXIGIDO}}.
{{LOCAL}}, {{DATA}}
{{CONSUMIDOR}}

---
### Checklist de envio
- [ ] Guardar print/protocolo da manifestação (prova do prazo de 7 dias);
- [ ] Anexar comprovante da compra e do pagamento;
- [ ] Se não houver estorno: reclamação na plataforma/Procon + peça judicial (v. fluxo vinculado).`,
    metadados: { tipo_modelo: 'notificação extrajudicial', variaveis: ['{{FORNECEDOR}}', '{{CNPJ}}', '{{CANAL}}', '{{CONSUMIDOR}}', '{{CPF}}', '{{EMAIL}}', '{{TELEFONE}}', '{{PEDIDO}}', '{{CODIGO_TRANSACAO}}', '{{DATA_COMPRA}}', '{{PRODUTO}}', '{{VALOR}}', '{{TERMO_INICIAL: assinatura do contrato / recebimento do produto}}', '{{PRAZO_EXIGIDO}}', '{{LOCAL}}', '{{DATA}}'], dadosFicticios: false },
    tags: ['consumidor/servicos-digitais'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'cdc-art-49-arrependimento-texto-literal', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Base legal da notificação.' },
      { destinoSlug: 'fluxo-arrependimento-e-commerce', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Fluxo em que esta peça é a etapa 1.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'checklist-atendimento-reclamacao-consumidor',
    titulo: 'Checklist — Atendimento de reclamação de consumidor: 16 pontos para montar o caso',
    tipoDocumento: 'CHECKLIST',
    area: 'consumidor',
    subarea: 'vicios',
    assunto: 'Organização de dossiê consumerista',
    prioridade: 'P1',
    lote: 'LOTE-009',
    conteudo: `# CHECKLIST — RECLAMAÇÃO DE CONSUMIDOR (VÍCIO / FATO / ARREPENDIMENTO)

## A. Identificação do regime (marcar 1)
- [ ] **VÍCIO** — produto/serviço impróprio, com defeito de qualidade/quantidade ou divergente da oferta (arts. 18-20);
- [ ] **FATO** — acidente de consumo: dano causado por defeito de segurança (arts. 12-14) → prazo de 5 anos (art. 27);
- [ ] **ARREPENDIMENTO** — desistência em 7 dias na contratação fora do estabelecimento (art. 49).

## B. Prazos (art. 26 e 27)
- [ ] Data de entrega do produto / término do serviço registrada;
- [ ] 30 dias (não durável) ou 90 dias (durável) — venceu? → vício oculto? (conta da evidenciação — art. 26 § 3º);
- [ ] Reclamação prévia comprovada (obsta decadência — art. 26 § 2º I) — protocolos reunidos?

## C. Prova
- [ ] Comprovante de compra e pagamento;
- [ ] Fotos/vídeos do vício; laudo, se houver;
- [ ] Conversas (chat/e-mail/WhatsApp) com o fornecedor;
- [ ] Protocolos de SAC/Plataforma/Procon;
- [ ] Print da oferta/publicidade (disparidade — art. 20/18 caput);
- [ ] Necessidade de perícia? (inversão do ônus — art. 6º VIII).

## D. Partes e solidariedade
- [ ] Fornecedor imediato (loja/marketplace/vendedor);
- [ ] Fabricante/fabricante da peça (art. 25 § 2º);
- [ ] Plataforma digital com pagamento integrado (cadeia de fornecimento — tese do LOTE-009);
- [ ] Seguro/garantia estendida (contrato acessório).

## E. Pedidos e valores
- [ ] Alternativa escolhida (substituição/restituição/abatimento — art. 18 § 1º);
- [ ] Perdas e danos apurados com documentos;
- [ ] Danos morais: fato concreto da ofensa (não presumir sem análise);
- [ ] Repetição em dobro (art. 42 p.u.), se pagamento indevido;
- [ ] Valor da causa e rito (JEC/Procon/cível).

## F. Estratégia pré-judicial
- [ ] Notificação extrajudicial enviada (prazo de resposta — Decreto 7.962: 5 dias no e-commerce);
- [ ] Procon/reclamação na plataforma (efeito probatório e tentativa de acordo);
- [ ] Avaliar ação coletiva associativa (se múltiplas vítimas).`,
    metadados: { itens: 16, uso: 'montagem de dossiê' },
    tags: ['consumidor/vicios', 'consumidor/servicos-digitais'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'cdc-art-26-decadencia-vicios-texto-literal', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Prazos verificados no bloco B.' },
      { destinoSlug: 'peca-reclamacao-vicio-produto', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Peça que usa o dossiê montado.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'checklist-conformidade-comercio-eletronico',
    titulo: 'Checklist — Conformidade de e-commerce (Decreto 7.962/2013): 14 itens obrigatórios',
    tipoDocumento: 'CHECKLIST',
    area: 'consumidor',
    subarea: 'servicos-digitais',
    assunto: 'Auditoria de loja virtual',
    prioridade: 'P1',
    lote: 'LOTE-009',
    conteudo: `# CHECKLIST — CONFORMIDADE E-COMMERCE (Decreto 7.962/2013)

## Informação obrigatória (art. 2º)
- [ ] Nome empresarial + CNPJ em destaque no site;
- [ ] Endereço físico e eletrônico de contato;
- [ ] Características essenciais do produto/serviço (e riscos, quando houver);
- [ ] Preço com discriminação de despesas adicionais (frete, seguro);
- [ ] Condições integrais da oferta: pagamento, disponibilidade, prazo de entrega/execução;
- [ ] Restrições à oferta claras e ostensivas.

## Atendimento (art. 4º)
- [ ] Sumário do contrato antes da contratação, destacando cláusulas que limitam direitos;
- [ ] Ferramenta de correção imediata de erros antes de finalizar a compra;
- [ ] Confirmação imediata do recebimento da aceitação;
- [ ] Contrato disponibilizado em meio conservável/reproduzível (e-mail/PDF);
- [ ] Canal eletrônico eficaz para dúvidas, reclamações, suspensão e CANCELAMENTO — resposta em até 5 dias;
- [ ] Mecanismos de segurança eficazes para pagamento e tratamento de dados (ponte LGPD art. 46).

## Arrependimento (art. 5º)
- [ ] Meios adequados e eficazes informados de forma clara;
- [ ] Arrependimento possível pela MESMA ferramenta de contratação, com confirmação imediata e comunicação à operadora de cartão (não lançar/estornar).

## Sanção
- Descumprimento → sanções do art. 56 do CDC (art. 7º do Decreto), além de responsabilidade civil nos casos concretos.`,
    metadados: { itens: 14, norma_base: 'Decreto 7.962/2013' },
    tags: ['consumidor/servicos-digitais'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'decreto-7962-2013-comercio-eletronico-texto-literal', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Norma-base do checklist.' },
      { destinoSlug: 'checklist-compliance-lgpd-pratico', tipo: 'COMPLEMENTO', descricao: 'Item de segurança de dados conecta com o checklist LGPD.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'fluxo-reclamacao-vicio-produto',
    titulo: 'Fluxo — Reclamação por vício do produto: do SAC à execução (CDC arts. 18 e 26)',
    tipoDocumento: 'FLUXO',
    area: 'consumidor',
    subarea: 'vicios',
    assunto: 'Gestão da reclamação de vício',
    prioridade: 'P1',
    lote: 'LOTE-009',
    conteudo: `# FLUXO — VÍCIO DO PRODUTO (evento → prazo → providência → risco → próxima etapa)

## E1. Constatado o vício
- **Providência:** documentar imediatamente (fotos/vídeo + data); guardar embalagem/nota.
- **Risco:** perda de prova do vício aparente.
- **Próxima etapa:** E2.

## E2. Reclamação ao fornecedor (prova!)
- **Prazo:** dentro de 30 dias (não duráveis) ou 90 dias (duráveis) da entrega (art. 26) — vício oculto: da evidenciação (§ 3º).
- **Providência:** reclamar POR MEIO COMPROVÁVEL (SAC com protocolo, chat com print, notificação) — a reclamação OBSTA a decadência até a resposta negativa (art. 26 § 2º I).
- **Risco:** reclamar sem prova = decadência futura insustentável.
- **Próxima etapa:** E3.

## E3. Janela de sanamento
- **Prazo:** fornecedor tem até 30 dias para sanar (art. 18 § 1º — ou o convencional 7-180, se houver cláusula válida em separado).
- **Providência:** acompanhar o reparo; registrar datas.
- **Próxima etapa:** sanou → encerrar e vigiar (vício recorrente = novo pedido); NÃO sanou → E4.

## E4. Escolha da alternativa (SEMPRE do consumidor)
- **Providência:** notificar a escolha: substituição / restituição imediata atualizada + perdas e danos / abatimento proporcional (art. 18 § 1º); produto essencial → imediato (§ 3º).
- **Risco:** ficar em "deixa com a loja" permite escolha unilateral do fornecedor.
- **Próxima etapa:** cumprida → encerrar; recusa → E5.

## E5. Via administrativa (paralela ou alternativa)
- **Providência:** Procon / plataforma (compra on-line) / portal consumidor.gov — resposta do e-commerce deve vir em até 5 dias (Decreto 7.962 art. 4º p.u.).
- **Efeito probatório:** acúmulo de tentativas reforça má-fé e sustenta danos morais quando cabíveis.
- **Próxima etapa:** sem acordo → E6.

## E6. Ação judicial
- **Rito:** JEC (até 40 SM; sem advogado até 20 SM na 1ª instância) ou vara cível.
- **Providência:** petição-modelo (peça vinculada) + inversão do ônus (art. 6º VIII) + solidariedade (arts. 7º p.u., 18 caput, 25).
- **Atenção à decadência:** instruir com as provas do E2 (a reclamação obstou a decadência).
- **Próxima etapa:** sentença → cumprimento; condenação com multa recursal (art. 60 CDC / art. 4º Lei 9.099), se o rito permitir.`,
    metadados: { etapas: 6, formato: 'evento → prazo → providência → risco → próxima etapa' },
    tags: ['consumidor/vicios', 'geral/prazos'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'cdc-art-18-vicio-produto-texto-literal', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Regime aplicado no fluxo.' },
      { destinoSlug: 'peca-reclamacao-vicio-produto', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Peça da etapa E6.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'fluxo-arrependimento-e-commerce',
    titulo: 'Fluxo — Arrependimento no e-commerce: 7 dias → estorno imediato (CDC art. 49 + Decreto 7.962)',
    tipoDocumento: 'FLUXO',
    area: 'consumidor',
    subarea: 'servicos-digitais',
    assunto: 'Desistência e estorno on-line',
    prioridade: 'P1',
    lote: 'LOTE-009',
    conteudo: `# FLUXO — ARREPENDIMENTO NO E-COMMERCE

## E1. Decisão de desistir
- **Prazo:** 7 dias da assinatura OU do recebimento (art. 49 caput).
- **Providência:** SEM MOTIVO necessário — mas confirmar termo inicial (preferir o recebimento quando mais favorável e comprovado).
- **Risco:** deixar passar os 7 dias.
- **Próxima etapa:** E2.

## E2. Manifestação com prova
- **Providência:** usar a MESMA ferramenta da contratação quando disponível (Decreto 7.962 art. 5º § 1º); senão e-mail/SAC com protocolo (peça-modelo vinculada).
- **Requisitos do fornecedor a exigir:** confirmação imediata (§ 4º) + comunicação à operadora do cartão para não lançar/estornar (§ 3º) + rescisão dos contratos acessórios sem ônus (§ 2º).
- **Próxima etapa:** E3.

## E3. Devolução do produto (se físico)
- **Providência:** seguir instruções do fornecedor SEM custo para o consumidor; embalar adequadamente; guardar código de postagem.
- **Risco:** fornecedor recusar recebimento → registrar (fotos, protocolo).
- **Próxima etapa:** E4.

## E4. Estorno imediato e atualizado
- **Prazo legal:** "de imediato, monetariamente atualizados" (art. 49 p.u.) — exigir registro do pedido de estorno junto à operadora.
- **Risco:** lançamento na fatura seguinte sem estorno → nova cobrança indevida (art. 42 p.u. — repetição em dobro, LOTE-006).
- **Próxima etapa:** estornado → encerrar; não estornado → E5.

## E5. Escalada
- **Providência:** 1) reclamação na plataforma/Procon/consumidor.gov; 2) peça judicial (JEC) pedindo estorno + dobro (art. 42 p.u.) + eventuais danos, se houver; anexar toda a prova da manifestação em tempo hábil (7 dias).
- **Fundamento de defesa antecipado:** a recusa do fornecedor NÃO reverte o exercício tempestivo do direito.`,
    metadados: { etapas: 5 },
    tags: ['consumidor/servicos-digitais', 'geral/prazos'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'peca-notificacao-arrependimento-consumidor', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Peça da etapa E2.' },
      { destinoSlug: 'decreto-7962-2013-comercio-eletronico-texto-literal', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Deveres regulamentares aplicados.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'tabela-documentos-reclamacao-consumidor',
    titulo: 'Tabela — Documentos por tipo de demanda consumerista',
    tipoDocumento: 'TABELA_DOCUMENTOS',
    area: 'consumidor',
    subarea: 'vicios',
    assunto: 'Documentos necessários para demandas de consumo',
    prioridade: 'P1',
    lote: 'LOTE-009',
    conteudo: `# TABELA — DOCUMENTOS POR DEMANDA CONSUMERISTA

## Comum a todas
| Documento | Finalidade | Obrigatório? |
|---|---|---|
| Documento de identidade + CPF | parte | Sim |
| Comprovante de residência | rito/JEC | Sim |
| Procuração + OAB | representação (quando houver advogado) | Se representado |

## Vício do produto/serviço (arts. 18-20)
| Documento | Finalidade |
|---|---|
| Nota fiscal/pedido e comprovante de pagamento | prova da compra e valor |
| Comprovante de entrega (rastreio/assinatura) | termo inicial da decadência (art. 26 § 1º) |
| Fotos/vídeos do vício | prova do vício aparente |
| Protocolos de reclamação (SAC/chat/notificação) | OBSTA decadência (art. 26 § 2º I) e prova do esgotamento de 30 dias (art. 18 § 1º) |
| Ordem de serviço do reparo | prova da tentativa de sanamento |
| Print da oferta/anúncio | disparidade com a entrega (art. 18 caput / 20) |
| Laudo técnico (se houver) | vício complexo/oculto |

## Fato do produto/serviço (arts. 12-14)
| Documento | Finalidade |
|---|---|
| Boletim de ocorrência (se houver golpe/acidente) | prova do fato |
| Laudos médicos/orçamentos | extensão do dano |
| Comprovantes de despesas | danos materiais |
| Histórico de atendimento da empresa | conhecimento prévio do risco |

## Arrependimento (art. 49)
| Documento | Finalidade |
|---|---|
| Comprovante da compra/pagamento | valores a restituir |
| Manifestação de arrependimento com data (print/protocolo) | prova do prazo de 7 dias |
| Código de devolução/postagem | devolução sem ônus |

## Plataformas digitais (marketplace)
| Documento | Finalidade |
|---|---|
| Print do anúncio, do pedido e do pagamento (beneficiário) | cadeia de fornecimento e confiança na plataforma |
| Reclamação na plataforma + resposta | esgotamento da via própria |
| Conexões/datas do golpe (quando fraude) | nexo com o ambiente da plataforma |

## Observação EJC
- Todos os campos acima são referências de organização de dossiê; nenhum documento substitui a análise concreta do caso.`,
    metadados: { demandas: 4, uso: 'montagem de dossiê' },
    tags: ['consumidor/vicios', 'consumidor/servicos-digitais'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'peca-reclamacao-vicio-produto', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Documentos da peça-modelo.' },
      { destinoSlug: 'checklist-atendimento-reclamacao-consumidor', tipo: 'COMPLEMENTO', descricao: 'Checklist de organização prévia.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'triagem-consumidor-vicio-fato',
    titulo: 'Triagem — Script de perguntas para demandas consumeristas (vício, fato, arrependimento, plataforma)',
    tipoDocumento: 'TRIAGEM',
    area: 'consumidor',
    subarea: 'vicios',
    assunto: 'Classificação inicial de casos de consumo',
    prioridade: 'P1',
    lote: 'LOTE-009',
    conteudo: `# TRIAGEM — CONSUMIDOR (perguntas objetivas)

## Bloco A — Enquadramento
1. O que ocorreu? [produto com defeito | serviço mal feito | produto não entregue | golpe/fraude na compra | cobrança indevida | quero devolver (arrependimento) | acidente com dano]
2. Onde comprou? [loja física | site próprio | marketplace (qual?) | telefone/fora do estabelecimento]
3. Data da compra e data de recebimento/término do serviço?

## Bloco B — Regime e prazo
4. A compra foi fora do estabelecimento? Há menos de 7 dias do recebimento/assinatura? → trilha ARREPENDIMENTO (art. 49).
5. Produto não durável ou durável? Passou de 30/90 dias da entrega? → checar vício oculto (art. 26 § 3º) ou migrar para FATO (art. 27 — 5 anos).
6. Já reclamou ao fornecedor? Quando? Como (protocolo)? Qual a resposta?

## Bloco C — Prova e valor
7. Tem nota/pedido? Fotos/vídeo? Conversas?
8. Qual o valor pago? Houve despesas extra (frete, conserto)?
9. Houve dano além do produto (prejuízo financeiro, saúde)? Documentado?

## Bloco D — Plataforma (se e-commerce/marketplace)
10. Pagamento foi dentro da plataforma (app/cartão da plataforma)? Qual beneficiário?
11. Já reclamou na plataforma? Resposta?
12. É marketplace completo (pagamento integrado) ou anúncio tipo classificado (contato direto)?

## Regras de classificação (SE-ENTÃO)
- SE arrependimento ≤ 7 dias com prova ENTÃO peça de notificação (art. 49 + Decreto 7.962) — probabilidade alta;
- SE vício com reclamação prévia comprovada e 30 dias esgotados sem sanar ENTÃO escolha da alternativa do art. 18 § 1º + peça inicial;
- SE golpe dentro do fluxo da plataforma com pagamento integrado ENTÃO solidariedade da plataforma (tese marketplace) + eventual Súmula 479 STJ (fortuito interno, se instituição financeira envolvida — LOTE-006);
- SE dano por defeito (segurança) ENTÃO fato do serviço (art. 14) + prescrição de 5 anos (art. 27);
- SE cobrança indevida ENTÃO repetição em dobro (art. 42 p.u. — LOTE-006);
- SE classificados puros sem pagamento integrado ENTÃO analisar culpa concorrente antes de prometer resultado (precedente OLX — doc vinculado).`,
    metadados: { blocos: 4, uso: 'triagem de novos casos' },
    tags: ['consumidor/vicios', 'geral/triagem'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'regra-se-vicio-consumidor-prazos', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Regras SE-ENTÃO correlatas.' },
      { destinoSlug: 'sumula-479-stj-fortuito-interno-fraudes', tipo: 'PRECEDENTE_APLICAVEL', descricao: 'Fraude bancária (LOTE-006) conectada à triagem.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'argumentacao-vicio-produto-dois-lados',
    titulo: 'Argumentação — Vício do produto: consumidor x fornecedor (e papel do marketplace)',
    tipoDocumento: 'ARGUMENTACAO',
    area: 'consumidor',
    subarea: 'vicios',
    assunto: 'Análise bilateral do litígio de vício',
    prioridade: 'P1',
    lote: 'LOTE-009',
    conteudo: `# ARGUMENTAÇÃO BILATERAL — VÍCIO DO PRODUTO

## Lado do consumidor
- Regime objetivo: respondem solidariamente TODOS os fornecedores da cadeia (art. 18 caput; art. 7º p.u.);
- Falhou o prazo de 30 dias sem sanar → a escolha é MINHA (art. 18 § 1º) — não posso ser empurrado para "conserto eterno";
- Reclamação comprovada trava a decadência (art. 26 § 2º I) — protocolos anexos;
- Restituição inclui atualização monetária e não exclui perdas e danos (art. 18 § 1º II);
- Inversão do ônus (art. 6º VIII): a prova da origem do vício é técnica e onerosa para o consumidor;
- Cláusula que exime/limita reparação é nula (art. 25; art. 51 V).

## Defesa do fornecedor
- Ausência de vício: produto em condições normais de uso; desgaste/mau uso do consumidor (art. 14 § 3º II — culpa exclusiva, por analogia ao caso);
- Prazo convencional válido (art. 18 § 2º: 7-180 dias) e cláusula em separado no contrato de adesão;
- Decadência consumada (sem reclamação comprovada dentro do 30/90 — art. 26);
- Oferta feita e cumprida: eventual disparidade não caracterizada;
- Danos não demonstrados (ausência de orçamento/laudo; danos morais não presumidos).

## Lado do marketplace (terceiro réu típico)
- Tese do consumidor: vantagem econômica + ambiente controlado = cadeia de fornecimento → solidariedade (TJDFT, precedente vinculado);
- Defesa típica: mero intermediador técnico, não escolhe nem entrega o produto; vendedor é empresário independente (termos de uso); em anúncios de classificados, mero divulgador (trecho STJ na página TJDFT);
- Peso probatório: quem controla o pagamento e o fluxo do pedido; existência de programa de proteção ao comprador; beneficiário do pagamento.

## Guia de peso das evidências
- Protocolo de reclamação com data > conversa informal sem data;
- Comprovante de entrega > simples declaração de compra;
- Print do anúncio salvo na época > testemunho sobre a oferta;
- Nos golpes de marketplace: print do fluxo de pagamento (beneficiário) é decisivo.`,
    metadados: { controversias: 3 },
    tags: ['consumidor/vicios', 'consumidor/servicos-digitais'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'cdc-art-18-vicio-produto-texto-literal', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Regime bilateralizado.' },
      { destinoSlug: 'tjdft-marketplace-responsabilidade-intermediador', tipo: 'PRECEDENTE_SUSTENTADOR', descricao: 'Posição do terceiro réu (plataforma).' },
    ],
  } satisfies InputDocument,
  {
    slug: 'doutrina-vicio-vs-fato-consumidor',
    titulo: 'Doutrina — Vício x defeito (fato do produto/serviço): regimes, prazos e estratégia',
    tipoDocumento: 'DOUTRINA',
    area: 'consumidor',
    subarea: 'vicios',
    assunto: 'Distinção técnica essencial',
    prioridade: 'P1',
    lote: 'LOTE-009',
    conteudo: `# DOUTRINA E CONCEITOS (elaboração própria EJC, ancorada nos textos literais vinculados)

## Vício (arts. 18-20 CDC)
- O produto/serviço é **inadequado ou imperfeito**: não funciona, não serve ao fim, tem quantidade menor, diverge da oferta.
- Interesses tutelados: o bom funcionamento da troca (qualidade = aquilo que se espera do produto/serviço).
- Remedios: substituição, restituição, abatimento (produto); reexecução, restituição, abatimento (serviço).
- Prazos: decadência 30/90 dias da entrega/término (art. 26) — obstada por reclamação comprovada.

## Defeito / fato do produto ou serviço (arts. 12-14 CDC)
- Além da inadequação, o produto/serviço **gera dano** (à segurança, saúde, patrimônio) por desvio do padrão de segurança legitimamente esperado (art. 14 § 1º).
- Interesses tutelados: segurança extrassistência — o "acidente de consumo".
- Remédio: indenização (danos materiais, morais, coletivos).
- Prazo: prescrição de 5 anos (art. 27).
- Responsabilidade objetiva; excludentes legais apenas (culpa exclusiva do consumidor/terceiro; no produto, também culpa não imputável — art. 12 § 3º).

## Por que a distinção decide o caso
1. **Prazo errado = perda de direito:** tratar fato como vício pode afogar o pedido na decadência de 30/90 dias quando caberia os 5 anos do art. 27;
2. **Pedido errado = improcedência:** pedir "troca do produto" em caso de acidente de consumo (ou indenização em caso de mero vício) desalinha causa e pedido;
3. **Prova errada:** vício aparente dispensa perícia; defeito costuma exigir demonstração técnica (inversão de ônus cobre parte — art. 6º VIII).

## Arrependimento (art. 49) — terceiro regime
- NÃO se discute defeito nem dano: é **faculdade de desistir** (7 dias) na contratação fora do estabelecimento, por reflexão;
- Combinável: consumidor pode arrepender-se; se o produto já apresentava vício, os regimes se somam na prática (devolução + eventual perdas e danos).

## Regra prática de enquadramento (perguntas-chave)
- "O produto/service ME DEVE algo?" (funcionou mal → vício);
- "O produto/service ME FEZ algo?" (causou dano → fato/defeito);
- "Eu é que não quero mais?" (arrependimento).`,
    metadados: { conceitos: 4, elaboracao: 'própria EJC' },
    tags: ['consumidor/vicios', 'consumidor/fato-produto-servico'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'cdc-art-18-vicio-produto-texto-literal', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Regime do vício.' },
      { destinoSlug: 'cdc-art-14-fato-servico-texto-literal', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Regime do fato.' },
      { destinoSlug: 'cdc-art-27-fato-produto-5-anos', tipo: 'BASE_PRAZO', descricao: 'Prescrição de 5 anos do fato (LOTE-001).' },
    ],
  } satisfies InputDocument,
  {
    slug: 'regra-se-vicio-consumidor-prazos',
    titulo: 'Regra de inteligência — SE vício do consumidor ENTÃO verificar decadência 30/90, reclamação prévia e alternativa do art. 18 § 1º',
    tipoDocumento: 'REGRA_INTELIGENCIA',
    area: 'consumidor',
    subarea: 'vicios',
    assunto: 'Automação de enquadramento consumerista',
    prioridade: 'P1',
    lote: 'LOTE-009',
    conteudo: `# REGRAS SE-ENTÃO — CONSUMIDOR

## REGRA 1 — Vício aparente: janela decadencial
- **SE** reclamação de vício (produto/serviço)
- **E** vício aparente ou de fácil constatação
- **ENTÃO** verificar: 30 dias (não durável) OU 90 dias (durável) da ENTREGA/TÉRMINO (art. 26 caput e § 1º)
- **E SE** reclamação comprovada ao fornecedor ENTÃO decadência obstada até resposta negativa (art. 26 § 2º I)
- **E SE** vício oculto ENTÃO prazo conta da evidenciação (art. 26 § 3º).

## REGRA 2 — Vício do produto: escolha após 30 dias
- **SE** vício não sanado em 30 dias (ou convencional 7-180 válido)
- **ENTÃO** consumidor escolhe: substituição | restituição atualizada + perdas e danos | abatimento proporcional (art. 18 § 1º)
- **E SE** produto essencial/vício extenso ENTÃO alternativas imediatas (art. 18 § 3º).

## REGRA 3 — Arrependimento: 7 dias
- **SE** contratação fora do estabelecimento (on-line/telefone)
- **E** manifestação ≤ 7 dias da assinatura/recebimento
- **ENTÃO** desistência sem motivo + estorno imediato atualizado (art. 49 p.u.) + mecânica do Decreto 7.962 art. 5º (mesma ferramenta, comunicação ao cartão, confirmação).

## REGRA 4 — Plataforma digital
- **SE** compra em marketplace com pagamento integrado e vantagem da plataforma
- **E** dano no fluxo da negociação
- **ENTÃO** demandar plataforma E vendedor (solidariedade — CDC 7º p.u. + 25 § 1º; precedente TJDFT vinculado)
- **E SE** plataforma estilo classificado (OLX-like) ENTÃO moderar expectativa — análise de culpa concorrente (precedente vinculado).

## REGRA 5 — Fato do serviço: prescrição de 5 anos
- **SE** dano causado por defeito de segurança do serviço
- **ENTÃO** art. 14 + prescrição de 5 anos (art. 27) — NÃO aplicar decadência de 30/90 (que rege vício).

## REGRA 6 — Pagamento indevido
- **SE** consumidor pagou por erro/cobrança sem justificativa
- **ENTÃO** repetição em dobro (art. 42 p.u. — doc LOTE-006) cumulável com o regime principal.`,
    metadados: { regras: 6, motor: 'SE-ENTÃO interpretável' },
    tags: ['consumidor/vicios', 'consumidor/servicos-digitais'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'cdc-art-26-decadencia-vicios-texto-literal', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Prazos da REGRA 1.' },
      { destinoSlug: 'cdc-art-49-arrependimento-texto-literal', tipo: 'FUNDAMENTO_LEGAL', descricao: 'REGRA 3.' },
      { destinoSlug: 'cdc-arts-42-42-a-cobranca-debitos-indebito-dobro', tipo: 'FUNDAMENTO_LEGAL', descricao: 'REGRA 6 (LOTE-006).' },
    ],
  } satisfies InputDocument,
  {
    slug: 'jurimetria-consumidor-vicio-plataformas',
    titulo: 'Jurimetria — Estrutura de acompanhamento de demandas consumeristas (dados a preencher com números REAIS)',
    tipoDocumento: 'JURIMETRIA',
    area: 'consumidor',
    subarea: 'vicios',
    assunto: 'Métricas de resultados em litígios de consumo',
    prioridade: 'P2',
    lote: 'LOTE-009',
    conteudo: `# JURIMETRIA — CONSUMIDOR (ESTRUTURA; NUNCA INVENTAR DADOS)

## Regra do banco 15
- Preencher exclusivamente com números reais: processos próprios do escritório e dados públicos oficiais (CNJ Justiça em Números, tribunais). Zero dados = zero no relatório.

## Variáveis por caso (dados do escritório)
| Campo | Tipo | Observação |
|---|---|---|
| regime | enum | vicio / fato / arrependimento / cobranca |
| canal_compra | enum | loja_fisica / site_proprio / marketplace / telefone |
| plataforma | texto | se marketplace: qual |
| valor_causa | decimal | |
| procedencia | enum | total / parcial / improcedente |
| duracao_meses | inteiro | ajuizamento → baixa |
| inversao_onus | booleano | deferida? |
| solidariedade_plataforma | booleano | reconhecida? |
| dano_moral_valor | decimal | se deferido |

## Métricas derivadas (quando houver base real)
- Taxa de procedência por regime (vício vs fato vs arrependimento);
- Tempo médio por rito (JEC x vara cível) e por plataforma ré;
- Frequência de deferimento da inversão do ônus;
- Impacto da reclamação prévia documentada no resultado.

## Fontes para preenchimento futuro
- CNJ — Justiça em Números (dados oficiais de litigiosidade);
- Portais oficiais dos tribunais (estatísticas por classe processual);
- Casos próprios (planilha do escritório, com dados anonimizados para LGPD).`,
    metadados: { status_dados: 'esquema vazio — aguardando dados reais', regra: 'nunca inventar números' },
    tags: ['consumidor/vicios'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'doutrina-vicio-vs-fato-consumidor', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Classificação dos regimes na jurimetria.' },
    ],
  } satisfies InputDocument,
];
