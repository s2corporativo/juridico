// LOTE-024 — Consumidor + JEC Fazenda Pública MG — Lei 12.153/2009 completa (Planalto) + complementos CDC
// Textos LITERAIS extraídos do Planalto em 2026-08-30 (downloads verbatim):
//   - Lei 12.153/2009: https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2009/lei/l12153.htm
//   - CDC (Lei 8.078/1990): https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm
//
// ANTI-INVENÇÃO desta rodada (constatações da consulta):
// - O texto oficial da Lei 12.153 traz "(VETADO)" nos §§ 3º do art. 2º e 4º do art. 19 — registrados COMO CONSTA.
// - A 12.153 NÃO cria prazo diferenciado para a Fazenda (art. 7º) e NÃO admite reexame necessário (art. 11).
// - "arts. 5º-6º sentença/recursos" da premissa da rodada NÃO se confirma: arts. 5º-6º tratam de PARTES e
//   citações/intimações; o regime recursal real está nos arts. 4º (recurso só contra sentença), 11, 17-19 e 21.
// - "arts. 9º-10 pagamento/precatório" NÃO se confirma: arts. 9º-10 tratam de documentação e assistente
//   técnico; o pagamento real está nos arts. 12-13 (fichas separadas, com o art. 13 COMPLETO §§ 1º-7º).
// - CDC art. 14 (§§ 1º-5º) JÁ EXISTE na base (cdc-art-14-fato-servico-texto-literal, lote-014) — NÃO duplicado.
//   CDC art. 20 JÁ EXISTE (cdc-art-20-vicio-servico-texto-literal) — só o art. 21 foi ingerido.
// - Portais MG (almg.gov.br, mg.gov.br, tjmg.jus.br, iof.mg) INACESSÍVEIS nesta consulta (bloqueio de ambiente)
//   → legislação/procedimento estadual MG entra como documento-PONTE (REVISAO_HUMANA, confiabilidade C),
//     SEM números de lei estadual apresentados como verificados.
import type { InputDocument } from '../../src/lib/ejc/types';

const D = '2026-08-30';
const PLANALTO = 'Presidência da República — Planalto';
const URL_12153 = 'https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2009/lei/l12153.htm';
const URL_CDC = 'https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm';
const EJC = 'Elaboração EJC — conteúdo estrutural original';

function lei12153(
  slug: string, titulo: string, assunto: string, conteudo: string, artigos: string[],
  extra?: Partial<InputDocument>,
): InputDocument {
  return {
    slug, titulo, tipoDocumento: 'LEGISLACAO', area: 'processual-civil', subarea: 'juizados-especiais',
    assunto, prioridade: 'P1', lote: 'LOTE-024',
    conteudo,
    metadados: { numero: 'Lei 12.153/2009', data_norma: '2009-12-22', orgao: 'Congresso Nacional', artigos_principais: artigos, vigente: true, confirmacao_texto: 'Extração literal do texto oficial do Planalto em 2026-08-30 (download verbatim).' },
    tags: ['processual-civil/juizados-especiais', 'consumidor/fazenda-publica'],
    fonte: PLANALTO,
    urlFonte: URL_12153,
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
  lei12153(
    'lei12153-art1-2-competencia',
    'Lei 12.153/2009 arts. 1º-2º — JEC da Fazenda Pública: criação pelo sistema estadual/DF e competência até 60 SM com exclusões do § 1º (texto literal confirmado, inclui § 3º VETADO)',
    'JEC Fazenda Pública — competência',
    `## Ficha da Norma
- **Norma:** Lei 12.153/2009 (Juizados Especiais da Fazenda Pública — Estados, DF, Territórios e Municípios).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 1º Os Juizados Especiais da Fazenda Pública, órgãos da justiça comum e integrantes do Sistema dos Juizados Especiais, serão criados pela União, no Distrito Federal e nos Territórios, e pelos Estados, para conciliação, processo, julgamento e execução, nas causas de sua competência.
Parágrafo único. O sistema dos Juizados Especiais dos Estados e do Distrito Federal é formado pelos Juizados Especiais Cíveis, Juizados Especiais Criminais e Juizados Especiais da Fazenda Pública.
Art. 2º É de competência dos Juizados Especiais da Fazenda Pública processar, conciliar e julgar causas cíveis de interesse dos Estados, do Distrito Federal, dos Territórios e dos Municípios, até o valor de 60 (sessenta) salários mínimos.
§ 1º Não se incluem na competência do Juizado Especial da Fazenda Pública:
I – as ações de mandado de segurança, de desapropriação, de divisão e demarcação, populares, por improbidade administrativa, execuções fiscais e as demandas sobre direitos ou interesses difusos e coletivos;
II – as causas sobre bens imóveis dos Estados, Distrito Federal, Territórios e Municípios, autarquias e fundações públicas a eles vinculadas;
III – as causas que tenham como objeto a impugnação da pena de demissão imposta a servidores públicos civis ou sanções disciplinares aplicadas a militares.
§ 2º Quando a pretensão versar sobre obrigações vincendas, para fins de competência do Juizado Especial, a soma de 12 (doze) parcelas vincendas e de eventuais parcelas vencidas não poderá exceder o valor referido no caput deste artigo.
§ 3º (VETADO)
§ 4º No foro onde estiver instalado Juizado Especial da Fazenda Pública, a sua competência é absoluta."

## NOTA HONESTA
- O § 3º do art. 2º consta VETADO no texto oficial — registrado como consta.
- Complementa a ficha lei-12153-jec-fazenda-publica-competencia (LOTE-012): esta reproduz os arts. 1º-2º COMPLETOS, incluindo o parágrafo único do art. 1º (composição do sistema) e o § 3º VETADO, ausentes na ficha anterior.
- A 12.153 não fixa "sem advogado" em texto próprio: a dispensa vem da aplicação subsidiária da Lei 9.099 (art. 27 da 12.153 — art. 9º da 9.099: até 20 SM a dispensa, com critérios do art. 9º § 2º).

## Leitura aplicada
- Competência ativa e passiva: causa CÍVEL de interesse de Estado/DF/Território/Município (réu), até 60 SM.
- Exclusões do § 1º I: MS, desapropriação, divisão/demarcação, popular, improbidade, EXECUÇÃO FISCAL, difusos/coletivos.
- Vincendas (§ 2º): conta 12 parcelas vincendas + vencidas ≤ 60 SM — regra de TRAVA de alçada para contratos de plano com Fazenda.
- § 4º: onde houver JEC FP instalado, competência ABSOLUTA (não se modifica por vontade das partes).`,
    ['1', '2'],
    {
      relacionamentos: [
        { destinoSlug: 'lei-12153-jec-fazenda-publica-competencia', tipo: 'COMPLEMENTA', descricao: 'Ficha-síntese do LOTE-012; esta reproduz arts. 1º-2º completos com § 3º VETADO.' },
        { destinoSlug: 'lei-9099-art-3-competencia-40sm-exclusoes', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Aplicação subsidiária da Lei 9.099 (alçada e assistência). Referência para a dispensa de advogado até 20 SM.' },
        { destinoSlug: 'lei-10259-jec-federal-competencia-60sm', tipo: 'CONEXO_TEMATICO', descricao: 'Espelho federal (JEF) com alçada idêntica de 60 SM.' },
      ],
    },
  ),
  lei12153(
    'lei12153-art3-4-processo',
    'Lei 12.153/2009 arts. 3º-4º — Cautelares e antecipação de ofício e irrecorribilidade das decisões antes da sentença (texto literal confirmado)',
    'JEC Fazenda Pública — processo',
    `## Ficha da Norma
- **Norma:** Lei 12.153/2009.

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 3º O juiz poderá, de ofício ou a requerimento das partes, deferir quaisquer providências cautelares e antecipatórias no curso do processo, para evitar dano de difícil ou de incerta reparação.
Art. 4º Exceto nos casos do art. 3º, somente será admitido recurso contra a sentença."

## Leitura aplicada
- Art. 3º: ampla tutela de urgência (cautelar E antecipatória) no JEC FP, inclusive DE OFÍCIO — fundamento padrão de pedidos liminares do consumidor contra a Fazenda (ex.: reabastecimento, reengenho de laudos, urgência de saúde).
- Art. 4º: EXCEÇÃO expressa do art. 3º — decisões que deferem/negam providências cautelares e antecipatórias SÃO recorríveis (agravo, na aplicação subsidiária); TODAS as demais decisões interlocutórias são IRRECORRÍVEIS — só a sentença (e depois a TR via recurso inominado da 9.099/10.259) enfrenta recurso.
- Combinação prática: negativa de tutela → agravo (exceção do art. 4º); decisão sobre provas/admissão → só com a apelação/recurso da sentença (preclusão consumida).`,
    ['3', '4'],
  ),
  lei12153(
    'lei12153-art5-7-partes-citacoes',
    'Lei 12.153/2009 arts. 5º-7º — Partes (PF e ME/EPP como autores; entes e vínculos como réus), citações/intimações pelo CPC e paridade de prazos com citação 30 dias antes da conciliação (texto literal confirmado)',
    'JEC Fazenda Pública — partes e atos',
    `## Ficha da Norma
- **Norma:** Lei 12.153/2009. NOTA HONESTA: a premissa "arts. 5º-6º = sentença/recursos" NÃO se confirma no texto oficial — arts. 5º-6º tratam de PARTES e ATOS; o regime recursal real está nos arts. 4º e 11 (ficha própria) e 17-19 (já na base, LOTE-012).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 5º Podem ser partes no Juizado Especial da Fazenda Pública:
I – como autores, as pessoas físicas e as microempresas e empresas de pequeno porte, assim definidas na Lei Complementar nº 123, de 14 de dezembro de 2006;
II – como réus, os Estados, o Distrito Federal, os Territórios e os Municípios, bem como autarquias, fundações e empresas públicas a eles vinculadas.
Art. 6º Quanto às citações e intimações, aplicam-se as disposições contidas na Lei nº 5.869, de 11 de janeiro de 1973 – Código de Processo Civil.
Art. 7º Não haverá prazo diferenciado para a prática de qualquer ato processual pelas pessoas jurídicas de direito público, inclusive a interposição de recursos, devendo a citação para a audiência de conciliação ser efetuada com antecedência mínima de 30 (trinta) dias."

## Leitura aplicada
- Legitimidade ativa FECHADA: só PF + ME/EPP (LC 123/2006) — pessoa jurídica comum NÃO pode usar o JEC FP.
- Legitimidade passiva: entes federados + autarquias, fundações e EMPRESAS PÚBLICAS a eles vinculadas (sociedade de economia mista NÃO nomeada no rol — admissibilidade a examinar caso a caso).
- Art. 6º: citação/intimação remetem ao CPC/1973 — vigente por ponte com o art. 27 (subsidiariedade; CPC/2015 art. 1.052), citação do ente por mandado.
- Art. 7º: PARIDADE — a Fazenda NÃO tem prazo em dobro nesta Lei; citação para a conciliação com antecedência mínima de 30 dias (termo inicial da agenda do processo).`,
    ['5', '6', '7'],
  ),
  lei12153(
    'lei12153-art9-13-cumprimento-pagamento',
    'Lei 12.153/2009 arts. 9º-13 — Documentação pela ré, laudo do assistente 5 dias antes, cumprimento por ofício e pagamento: 60 dias sem precatório, sequestro, pequeno valor 40/30 SM, vedação de fracionamento, renúncia ao excedente e saque (texto literal confirmado)',
    'JEC Fazenda Pública — cumprimento e execução',
    `## Ficha da Norma
- **Norma:** Lei 12.153/2009. NOTA HONESTA: a premissa "arts. 9º-10 = pagamento/precatório" NÃO se confirma — arts. 9º-10 tratam de DOCUMENTAÇÃO e ASSISTENTE TÉCNICO; o pagamento real está nos arts. 12-13 (o art. 13 COMPLETO §§ 1º-7º complementa a ficha parcial do LOTE-012).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 9º A entidade ré deverá fornecer ao Juizado a documentação de que disponha para o esclarecimento da causa, apresentando-a até a instalação da audiência de conciliação.
Art. 10. Para efetuar o exame técnico necessário à conciliação ou ao julgamento da causa, o juiz nomeará pessoa habilitada, que apresentará o laudo até 5 (cinco) dias antes da audiência.
Art. 12. O cumprimento do acordo ou da sentença, com trânsito em julgado, que imponham obrigação de fazer, não fazer ou entrega de coisa certa, será efetuado mediante ofício do juiz à autoridade citada para a causa, com cópia da sentença ou do acordo.
Art. 13. Tratando-se de obrigação de pagar quantia certa, após o trânsito em julgado da decisão, o pagamento será efetuado:
I – no prazo máximo de 60 (sessenta) dias, contado da entrega da requisição do juiz à autoridade citada para a causa, independentemente de precatório, na hipótese do § 3º do art. 100 da Constituição Federal; ou
II – mediante precatório, caso o montante da condenação exceda o valor definido como obrigação de pequeno valor.
§ 1º Desatendida a requisição judicial, o juiz, imediatamente, determinará o sequestro do numerário suficiente ao cumprimento da decisão, dispensada a audiência da Fazenda Pública.
§ 2º As obrigações definidas como de pequeno valor a serem pagas independentemente de precatório terão como limite o que for estabelecido na lei do respectivo ente da Federação.
§ 3º Até que se dê a publicação das leis de que trata o § 2º, os valores serão:
I – 40 (quarenta) salários mínimos, quanto aos Estados e ao Distrito Federal;
II – 30 (trinta) salários mínimos, quanto aos Municípios.
§ 4º São vedados o fracionamento, a repartição ou a quebra do valor da execução, de modo que o pagamento se faça, em parte, na forma estabelecida no inciso I do caput e, em parte, mediante expedição de precatório, bem como a expedição de precatório complementar ou suplementar do valor pago.
§ 5º Se o valor da execução ultrapassar o estabelecido para pagamento independentemente do precatório, o pagamento far-se-á, sempre, por meio do precatório, sendo facultada à parte exequente a renúncia ao crédito do valor excedente, para que possa optar pelo pagamento do saldo sem o precatório.
§ 6º O saque do valor depositado poderá ser feito pela parte autora, pessoalmente, em qualquer agência do banco depositário, independentemente de alvará.
§ 7º O saque por meio de procurador somente poderá ser feito na agência destinatária do depósito, mediante procuração específica, com firma reconhecida, da qual constem o valor originalmente depositado e sua procedência."

## Leitura aplicada
- Documentação (art. 9º): DEVER da ré de juntar docs até a instalação da conciliação — base para pedido de exibição e para astreintes na tutela.
- Assistente técnico (art. 10): laudo 5 dias antes — carimbo de agenda da instrução.
- Fazer/não fazer (art. 12): execução direta por OFÍCIO à autoridade citada — sem nova fase executiva.
- Pagar (art. 13): 60 dias da requisição SEM precatório (dentro do pequeno valor) → § 1º sequestro imediato se desatendida; acima do pequeno valor → precatório; § 4º sem fracionamento; § 5º RENÚNCIA facultativa ao excedente para fugir do precatório (janela de estratégia econômica do credor); § 6º-7º saque sem alvará / por procurador com procuração específica.`,
    ['9', '10', '12', '13'],
    {
      relacionamentos: [
        { destinoSlug: 'lei-12153-jec-fazenda-publica-competencia', tipo: 'COMPLEMENTA', descricao: 'Completa o art. 13 §§ 1º, 2º, 5º-7º ausentes da ficha do LOTE-012.' },
        { destinoSlug: 'fluxo-jec-fazenda', tipo: 'BASE_PRATICA', descricao: 'Etapa de cumprimento do fluxo.' },
      ],
    },
  ),
  lei12153(
    'lei12153-art11-14-16-organizacao-conciliadores',
    'Lei 12.153/2009 arts. 11, 14-16 — Sem reexame necessário, instalação pelos TJs, conciliadores e juízes leigos e condução da audiência (texto literal confirmado)',
    'JEC Fazenda Pública — organização e audiência',
    `## Ficha da Norma
- **Norma:** Lei 12.153/2009. NOTA HONESTA: arts. 17-19 (Turmas Recursais e uniformização) JÁ estão literais na base (lei-12153-turmas-uniformizacao-fazenda, LOTE-012) — não reproduzidos aqui.

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 11. Nas causas de que trata esta Lei, não haverá reexame necessário.
Art. 14. Os Juizados Especiais da Fazenda Pública serão instalados pelos Tribunais de Justiça dos Estados e do Distrito Federal.
Parágrafo único. Poderão ser instalados Juizados Especiais Adjuntos, cabendo ao Tribunal designar a Vara onde funcionará.
Art. 15. Serão designados, na forma da legislação dos Estados e do Distrito Federal, conciliadores e juízes leigos dos Juizados Especiais da Fazenda Pública, observadas as atribuições previstas nos arts. 22, 37 e 40 da Lei nº 9.099, de 26 de setembro de 1995.
§ 1º Os conciliadores e juízes leigos são auxiliares da Justiça, recrutados, os primeiros, preferentemente, entre os bacharéis em Direito, e os segundos, entre advogados com mais de 2 (dois) anos de experiência.
§ 2º Os juízes leigos ficarão impedidos de exercer a advocacia perante todos os Juizados Especiais da Fazenda Pública instalados em território nacional, enquanto no desempenho de suas funções.
Art. 16. Cabe ao conciliador, sob a supervisão do juiz, conduzir a audiência de conciliação.
§ 1º Poderá o conciliador, para fins de encaminhamento da composição amigável, ouvir as partes e testemunhas sobre os contornos fáticos da controvérsia.
§ 2º Não obtida a conciliação, caberá ao juiz presidir a instrução do processo, podendo dispensar novos depoimentos, se entender suficientes para o julgamento da causa os esclarecimentos já constantes dos autos, e não houver impugnação das partes."

## Leitura aplicada
- Art. 11: SEM reexame necessário (duplo grau obrigatório) — sentença de menor valor transita sem remessa obrigatória.
- Art. 14: instalação pelos TJs; adjuntos funcionam em Vara designada (verificar no ente MG se/onde instalado — consulta judicial real).
- Art. 15-16: atuação do conciliador com poder de ouvir partes/testemunhas; a INSTRUÇÃO é do juiz — sustentação da estratégia de "conciliar ou instruir com o que já há nos autos".`,
    ['11', '14', '15', '16'],
  ),
  lei12153(
    'lei12153-art20-27-normas-subsidiariedade',
    'Lei 12.153/2009 arts. 20-27 — Normas regulamentadoras do RE, instalação em 2 anos, limitação de competência por 5 anos, demandas anteriores, suporte administrativo, aplicação do art. 16 ao JEF e subsidiariedade (texto literal confirmado)',
    'JEC Fazenda Pública — disposições finais',
    `## Ficha da Norma
- **Norma:** Lei 12.153/2009.

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30) — condensado
"Art. 20. Os Tribunais de Justiça, o Superior Tribunal de Justiça e o Supremo Tribunal Federal, no âmbito de suas competências, expedirão normas regulamentando os procedimentos a serem adotados para o processamento e o julgamento do pedido de uniformização e do recurso extraordinário.
Art. 21. O recurso extraordinário, para os efeitos desta Lei, será processado e julgado segundo o estabelecido no art. 19, além da observância das normas do Regimento.
Art. 22. Os Juizados Especiais da Fazenda Pública serão instalados no prazo de até 2 (dois) anos da vigência desta Lei, podendo haver o aproveitamento total ou parcial das estruturas das atuais Varas da Fazenda Pública.
Art. 23. Os Tribunais de Justiça poderão limitar, por até 5 (cinco) anos, a partir da entrada em vigor desta Lei, a competência dos Juizados Especiais da Fazenda Pública, atendendo à necessidade da organização dos serviços judiciários e administrativos.
Art. 24. Não serão remetidas aos Juizados Especiais da Fazenda Pública as demandas ajuizadas até a data de sua instalação, assim como as ajuizadas fora do Juizado Especial por força do disposto no art. 23.
Art. 25. Competirá aos Tribunais de Justiça prestar o suporte administrativo necessário ao funcionamento dos Juizados Especiais.
Art. 26. O disposto no art. 16 aplica-se aos Juizados Especiais Federais instituídos pela Lei nº 10.259, de 12 de julho de 2001.
Art. 27. Aplica-se subsidiariamente o disposto nas Leis nos 5.869, de 11 de janeiro de 1973 – Código de Processo Civil, 9.099, de 26 de setembro de 1995, e 10.259, de 12 de julho de 2001."

## Leitura aplicada
- Art. 23 × art. 2º: se o TJ limitou a competência no período, a causa pode correr em vara comum — checar resolução do TJMG antes de distribuir (consulta judicial real pendente; portais TJMG bloqueados nesta consulta).
- Art. 24: demandas ajuizadas ANTES da instalação (ou fora por força do art. 23) permanecem onde estão — sem atração.
- Art. 27: TRÍPLICE subsidiariedade (CPC/73 [hoje CPC/2015], 9.099 e 10.259) — porta de entrada de toda a mecânica de juizados (prazos em dias úteis, recurso inominado, execução) no JEC FP.`,
    ['20', '21', '22', '23', '24', '25', '26', '27'],
    {
      relacionamentos: [
        { destinoSlug: 'lei-10259-jec-federal-competencia-60sm', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Subsidiariedade da Lei 10.259/2001 no JEC FP (art. 27).' },
        { destinoSlug: 'lei-9099-arts-41-43-recurso-inominado', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Recurso inominado aplica-se subsidiariamente (art. 27).' },
      ],
    },
  ),
  {
    slug: 'cdc-art21-componentes-originais',
    titulo: 'CDC art. 21 — Serviço de reparação: obrigação implícita de componentes de reposição originais adequados e novos (texto literal confirmado)',
    tipoDocumento: 'LEGISLACAO',
    area: 'consumidor',
    subarea: 'vicios',
    assunto: 'Vício do serviço — reparação e peças',
    prioridade: 'P1',
    lote: 'LOTE-024',
    conteudo: `## Ficha da Norma
- **Norma:** Lei 8.078/1990 (CDC) — Seção III (Responsabilidade por Vício do Produto e do Serviço).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 21. No fornecimento de serviços que tenham por objetivo a reparação de qualquer produto considerar-se-á implícita a obrigação do fornecedor de empregar componentes de reposição originais adequados e novos, ou que mantenham as especificações técnicas do fabricante, salvo, quanto a estes últimos, autorização em contrário do consumidor."

## NOTA HONESTA
O CDC art. 20 (vício do serviço: reexecução, restituição ou abatimento) JÁ está literal na base (cdc-art-20-vicio-servico-texto-literal) — este documento completa a dupla com o art. 21, SEM duplicar o anterior.

## Leitura aplicada
- Cláusula implícita em TODO contrato de reparação: peças ORIGINAIS, adequadas e NOVAS (ou que mantenham especificações do fabricante).
- Única porta de saída do fornecedor: AUTORIZAÇÃO EXPRESSA do consumidor para peças que não sejam originais (carga da prova do consentimento é do fornecedor).
- Fronteira com o art. 20: vício do serviço → alternativas do art. 20 (reexecução/restição/abatimento); peça usada/paralela sem autorização → art. 21 + art. 70 (crime: peça de reposição usada sem autorização) na via penal do CDC.`,
    metadados: { numero: 'Lei 8.078/1990 (CDC)', data_norma: '1990-09-11', orgao: 'Congresso Nacional', artigos_principais: ['21'], vigente: true, confirmacao_texto: 'Extração literal do texto oficial do Planalto em 2026-08-30 (download verbatim).' },
    tags: ['consumidor/vicios'],
    fonte: PLANALTO,
    urlFonte: URL_CDC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'cdc-art-20-vicio-servico-texto-literal', tipo: 'COMPLEMENTA', descricao: 'Mesma Seção III: art. 21 completa o art. 20 já na base.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'ponte-mg-procon-defesa-consumidor',
    titulo: 'PONTE MG — Estrutura PROCON MG/BH e legislação estadual de defesa do consumidor (mapa de verificação — REVISÃO HUMANA, zero números de lei estadual)',
    tipoDocumento: 'DOUTRINA',
    area: 'consumidor',
    subarea: 'fazenda-publica',
    assunto: 'Defesa do consumidor em MG — documento-ponte',
    prioridade: 'P2',
    lote: 'LOTE-024',
    conteudo: `# PONTE DE VERIFICAÇÃO — MINAS GERAIS (consumidor)
**Status: REVISAO_HUMANA | Confiabilidade C.** Os portais estaduais (almg.gov.br, mg.gov.br, iof.mg, tjmg.jus.br) ficaram INACESSÍVEIS nesta consulta (2026-08-30) — bloqueio de ambiente. Este documento registra o que precisa ser VERIFICADO; NÃO cita números de lei estadual como verificados (regra anti-invenção).

## O que já é verificável por fonte federal (confiabilidade A)
- Competência/citação contra Estados e Municípios no JEC FP: Lei 12.153/2009 (fichas deste lote).
- Direitos básicos, práticas e crimes do CDC: Lei 8.078/1990 (base EJC).

## Itens a verificar em rodada futura (fonte estadual)
1. Estrutura de atendimento do PROCON estadual (órgão estadual de defesa do consumidor de MG): competência, sede, procedimento de reclamação administrativa.
2. PROCON BH (órgão municipal): fluxo de reclamação e conciliação pré-processual.
3. Lei estadual de proteção/defesa do consumidor de MG (existência, número, vigência) — citar APENAS após captura verbatim no portal oficial.
4. Juizado Especial da Fazenda Pública em MG: instalado? onde (art. 14 da 12.153)? há limitação de competência pelo TJMG (art. 23)?
5. Regulamento estadual de sanções administrativas de consumo aplicáveis pelo órgão fiscalizador.

## URLs oficiais candidatas para a rodada futura (NÃO verificadas nesta consulta)
- https://www.almg.gov.br (busca legislativa estadual)
- https://www.mg.gov.br (portal do Estado de MG — órgãos de defesa do consumidor)
- https://prefeitura.pbh.gov.br/procon-bh (PROCON BH)
- https://www.tjmg.jus.br (instalação/limitação do JEC FP — arts. 14 e 23 da Lei 12.153)

## Regra de uso no EJC
Este documento NÃO fundamenta afirmação jurídica definitiva sobre direito estadual mineiro. Para consulta operacional: usar as regras FEDERAIS (A) e marcar o dado estadual como "a verificar".`,
    tags: ['consumidor/fazenda-publica', 'geral/metodologia'],
    fonte: 'Portais oficiais MG — PENDENTES de captura (almg.gov.br / mg.gov.br / tjmg.jus.br bloqueados na consulta 2026-08-30)',
    urlFonte: 'https://www.mg.gov.br',
    dataConsulta: D,
    confiabilidade: 'C',
    vigente: true,
    status: 'REVISAO_HUMANA',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-09-30',
    relacionamentos: [
      { destinoSlug: 'lei12153-art1-2-competencia', tipo: 'CONEXO_TEMATICO', descricao: 'Ponte estadual para a rota federal do JEC FP.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'tese-jec-fazenda-vs-execucao-fiscal',
    titulo: 'Tese — Rota de cobrança contra a Fazenda: JEC FP (Lei 12.153) × execução fiscal × tutela antecipatória — onde cabe o crédito do consumidor/fornecedor',
    tipoDocumento: 'TESE',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'JEC Fazenda Pública × execução fiscal',
    prioridade: 'P1',
    lote: 'LOTE-024',
    conteudo: `## Tese (rota de juízo)
Créditos de PF/ME/EPP contra Estado/DF/Município (e autarquias/fundações/empresas públicas vinculadas) até 60 SM correm no JUÍZO ESPECIAL da Fazenda Pública (Lei 12.153, arts. 1º-2º); a EXECUÇÃO FISCAL está expressamente FORA do JEC FP (art. 2º § 1º I) e segue rito próprio (LEF); a tutela de urgência cabe DE OFÍCIO (art. 3º) e as interlocutórias são irrecorríveis, salvo a cautelar/antecipatória (art. 4º).

## Requisitos da rota JEC FP
1. Réu = ente do rol do art. 5º II (Estado, DF, Território, Município, autarquia, fundação, empresa pública vinculada).
2. Autor = PF ou ME/EPP (LC 123/2006) — art. 5º I.
3. Valor ≤ 60 SM (caput) OU vincendas: 12 parcelas + vencidas ≤ 60 SM (§ 2º).
4. Causa NÃO excluída do § 1º (não-MS, não-execução fiscal, não-imóvel público do rol II, não-sanção disciplinar III).
5. Se JEC FP instalado no foro: competência ABSOLUTA (§ 4º); se não instalado/limitado (art. 23): juízo comum.

## Fundamentos literais
- Art. 2º caput + § 1º I + § 4º; art. 5º I-II; art. 3º; art. 4º (ver fichas deste lote, texto literal).
- Execução fora do JEC: art. 2º § 1º I ("execuções fiscais" excluídas).

## Contra-argumentos (defesa da Fazenda) e respostas
1. "Pretensão é tributária → execução fiscal comum." RESPOSTA: o art. 2º § 1º I EXCLUI execução fiscal DO JEC (o JEC não a atrai); crédito do contribuinte (restituição) é causa cível comum → cabe no JEC FP se ≤ 60 SM.
2. "Parcelas vincendas estouram a alçada." RESPOSTA: critério legal de 12 parcelas + vencidas (art. 2º § 2º) — diagnóstico antes de distribuir.
3. "Valor acima do pequeno valor impossibilita execução." RESPOSTA: art. 13 § 5º — renúncia facultativa ao excedente evita precatório.
4. "Reexame necessário." RESPOSTA: art. 11 — não há reexame no JEC FP.

## Riscos
- Distribuir em vara comum onde há JEC FP instalado → incompetência absoluta (art. 2º § 4º).
- ME/EPP com pedido acima da alçada → extinção parcial; renúncia ao excedente na inicial.

## Probabilidade qualitativa
- Admissibilidade no JEC FP com os 5 requisitos: ALTA (texto legal expresso).
- Antecipação de ofício em saúde/fornecimento: MÉDIA-ALTA (art. 3º amplo; depende do risco concreto).`,
    tags: ['processual-civil/juizados-especiais', 'consumidor/fazenda-publica'],
    fonte: EJC,
    urlFonte: URL_12153,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'lei12153-art1-2-competencia', tipo: 'BASE_PRATICA', descricao: 'Requisitos da rota.' },
      { destinoSlug: 'lei12153-art9-13-cumprimento-pagamento', tipo: 'BASE_PRATICA', descricao: 'Estratégia do § 5º (renúncia ao excedente).' },
      { destinoSlug: 'regra-se-entao-rota-juizo', tipo: 'REGRA_INTELIGENCIA', descricao: 'Implementação SE-ENTÃO da rota.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'peca-inicial-jec-fazenda-publica',
    titulo: 'Peça-modelo — Petição inicial JEC Fazenda Pública (Lei 12.153) com 23 variáveis e checklist embutido',
    tipoDocumento: 'PECA',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'Petição inicial — JEC FP',
    prioridade: 'P1',
    lote: 'LOTE-024',
    conteudo: `# PETIÇÃO INICIAL — JUIZO ESPECIAL DA FAZENDA PÚBLICA (Lei 12.153/2009)
**Modelo com variáveis {{ }} — preencher ANTES de protocolar. NÃO é minuta definitiva sem revisão humana.**

EXCELENTÍSSIMO(A) SENHOR(A) JUIZ(A) DE DIREITO DO {{nome_juizado}} — JUIZADO ESPECIAL DA FAZENDA PÚBLICA DE {{comarca}}

{{nome_autor}}, {{nacionalidade_autor}}, {{estado_civil_autor}}, {{profissao_autor}}, {{rg_autor}}, CPF/CNPJ {{cpf_cnpj_autor}}, residente/domiciliado em {{endereco_autor}}, e-mail {{email_autor}}, telefone {{telefone_autor}}, por seu advogado (instr. {{advogado_nome}}, OAB {{oab_advogado}}, endereço {{endereco_advogado}}), vem propor:

**AÇÃO DE {{natureza_pedido}}** em face de {{ente_reu}} (CNPJ {{cnpj_reu}}), por seu representante legal {{representante_reu}}, endereço {{endereco_reu}}, pelos fatos e fundamentos a seguir.

## 1. COMPETÊNCIA (Lei 12.153, arts. 2º e 5º)
Causa cível de interesse de {{ente_reu}}, valor {{valor_causa_reais}} ({{valor_causa_sm}} salários mínimos), dentro da alçada de 60 SM (art. 2º, caput). Autor qualificado no art. 5º, I. A pretensão NÃO se encaixa nas exclusões do art. 2º § 1º (I-III). {{se_vincendas}} As 12 parcelas vincendas somadas às vencidas não excedem 60 SM (art. 2º § 2º).

## 2. DOS FATOS
{{fato_constitutivo}} — ocorrido em {{data_fato}}, comprovado por {{documento_prova_1}} e {{documento_prova_2}}.

## 3. DO DIREITO
{{fundamento_juridico}} (fundamentar com texto literal dos dispositivos — ver fichas LOTE-024).

## 4. DA TUTELA (art. 3º)
Requer providência cautelar/antecipatória de {{conteudo_tutela}} porque {{fundamento_tutela}} — dano de difícil ou incerta reparação (art. 3º, literal).

## 5. DOS PEDIDOS
a) {{pedido_principal}}; b) {{pedido_subsidario}}; c) juntada de {{lista_documentos}}; d) citação da ré para a audiência de conciliação (art. 7º — antecedência mínima de 30 dias), com intimação do representante judicial (art. 8º); e) condenação em {{pedidos_condenacao}}.

Dá-se à causa o valor de {{valor_causa_reais}}.

{{local_data}} — {{advogado_nome}}

## CHECKLIST EMBUTIDO (marcar antes de protocolar)
- [ ] Valor ≤ 60 SM (ou regra das 12 vincendas) — art. 2º
- [ ] Causa fora das exclusões do art. 2º § 1º I-III
- [ ] Autor é PF ou ME/EPP — art. 5º I
- [ ] Réu é ente/autarquia/fundação/empresa pública VINCULADA — art. 5º II
- [ ] JEC FP instalado nesta comarca? (§ 4º — competência absoluta) / limitação do art. 23 conferida no TJ
- [ ] Pedido de tutela com fundamento do art. 3º (dano difícil/incerta reparação)
- [ ] Sem pedido de decisão interlocutória recorrível indevida (art. 4º)
- [ ] Documentos anexos numerados`,
    tags: ['processual-civil/juizados-especiais', 'consumidor/fazenda-publica'],
    fonte: EJC,
    urlFonte: URL_12153,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'checklist-admissibilidade-jec-fazenda', tipo: 'BASE_PRATICA', descricao: 'Checklist completo da admissibilidade.' },
      { destinoSlug: 'fluxo-jec-fazenda', tipo: 'BASE_PRATICA', descricao: 'Etapa 2 do fluxo (protocolo/citação).' },
    ],
  } satisfies InputDocument,
  {
    slug: 'checklist-admissibilidade-jec-fazenda',
    titulo: 'Checklist — Admissibilidade no JEC da Fazenda Pública (15 pontos: alçada 60 SM, exclusões do art. 2º § 1º, representação e execução)',
    tipoDocumento: 'CHECKLIST',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'Admissibilidade — JEC FP',
    prioridade: 'P1',
    lote: 'LOTE-024',
    conteudo: `# CHECKLIST DE ADMISSIBILIDADE — JEC FAZENDA PÚBLICA (Lei 12.153/2009)
1. **Réu** é Estado/DF/Território/Município, autarquia, fundação ou empresa pública A ELES VINCULADA (art. 5º II)? — sociedade de economia mista exige análise caso a caso.
2. **Autor** é PF ou ME/EPP (LC 123/2006) (art. 5º I)? PJ comum → foro comum.
3. **Valor** ≤ 60 SM (art. 2º caput)? Juros/correção contam no diagnóstico.
4. **Vincendas**: 12 parcelas + vencidas ≤ 60 SM (art. 2º § 2º)?
5. **Exclusão I**: não é MS, desapropriação, divisão/demarcação, popular, improbidade, execução fiscal, difusos/coletivos (art. 2º § 1º I)?
6. **Exclusão II**: não recai sobre BEM IMÓVEL público do rol (art. 2º § 1º II)?
7. **Exclusão III**: não impugna pena de demissão/sanção disciplinar militar (art. 2º § 1º III)?
8. **JEC FP instalado no foro** (art. 14)? Se sim → competência ABSOLUTA (art. 2º § 4º). Se não/limitado (art. 23) → vara comum.
9. **Representação judicial da ré** presente pode conciliar/transigir/desistir conforme a lei do ente (art. 8º) — verificar norma do ente antes da proposta.
10. **Tutela** pedida com base no art. 3º (cautelar/antecipatória, de ofício ou requerida)?
11. **Lembrete de irrecorribilidade**: decisão não-cautelar não é recorrível antes da sentença (art. 4º) — não gastar agravo indevido.
12. **Documentação da ré**: pedir tudo que a entidade dispõe (art. 9º) até a instalação da conciliação.
13. **Perícia/exame técnico**: nomeação pelo juiz com laudo 5 dias antes (art. 10) — preparar quesitos na conciliação.
14. **Execução mapeada**: fazer/não fazer → ofício (art. 12); pagar ≤ pequeno valor → 60 dias da requisição + sequestro (art. 13 caput I e § 1º); acima → precatório OU renúncia ao excedente (art. 13 § 5º).
15. **Recurso**: só contra sentença (art. 4º); recurso inominado da 9.099/10.259 pela subsidiariedade (art. 27); sem reexame necessário (art. 11).`,
    tags: ['processual-civil/juizados-especiais'],
    fonte: EJC,
    urlFonte: URL_12153,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'peca-inicial-jec-fazenda-publica', tipo: 'BASE_PRATICA', descricao: 'Peça correspondente.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'fluxo-jec-fazenda',
    titulo: 'Fluxo — JEC Fazenda Pública em 6 etapas: triagem → protocolo/citação 30 dias → conciliação → instrução → sentença/recursos → cumprimento (60 dias/precatório)',
    tipoDocumento: 'FLUXO',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'Fluxo completo — JEC FP',
    prioridade: 'P1',
    lote: 'LOTE-024',
    conteudo: `# FLUXO DO JEC FAZENDA PÚBLICA (Lei 12.153/2009 + subsidiárias 9.099/10.259/CPC)

## Etapa 1 — Triagem e juízo
Checar: réu do art. 5º II; autor do art. 5º I; alçada 60 SM (caput; 12 vincendas § 2º); exclusões § 1º I-III; JEC instalado (§ 4º absoluta) ou limitação do art. 23.
→ RISCO: incompetência absoluta se errar o foro.

## Etapa 2 — Protocolo e citação (30 dias)
Inicial com pedidos de tutela (art. 3º); citação do ente para audiência de conciliação com antecedência MÍNIMA de 30 dias (art. 7º); ré NÃO tem prazo diferenciado (art. 7º).
→ PRAZO: citação ≥ 30 dias antes da conciliação.

## Etapa 3 — Audiência de conciliação
Conduzida pelo CONCILIADOR sob supervisão do juiz (art. 16); conciliador ouve partes/testemunhas (§ 1º); representante da ré presente pode conciliar/transigir/desistir conforme lei do ente (art. 8º); ré entrega documentação até a instalação (art. 9º).
→ SAÍDAS: acordo (homologado) OU prosseguimento.

## Etapa 4 — Instrução
Preside o JUIZ (art. 16 § 2º); exame técnico nomeado pelo juiz com LAUDO até 5 dias antes da audiência (art. 10); depoimentos dispensáveis se autos suficientes e sem impugnação (art. 16 § 2º).
→ Interlocutórias IRRECORRÍVEIS, exceto cautelar/antecipatória (art. 4º).

## Etapa 5 — Sentença e recursos
Sentença SEM reexame necessário (art. 11); recurso só contra sentença (art. 4º) — inominado da 9.099/10.259 (art. 27) → Turma Recursal (art. 17) → uniformização (arts. 18-19) → RE (arts. 20-21).

## Etapa 6 — Cumprimento
FAZER/NÃO FAZER/ENTREGA: ofício do juiz à autoridade citada, com cópia (art. 12). PAGAR: dentro do pequeno valor → requisição, 60 dias, SEM precatório; desatendida → SEQUESTRO imediato (art. 13 caput I + § 1º); acima do pequeno valor → precatório (art. 13 II; § 4º sem fracionamento) OU renúncia ao excedente para pagar sem precatório (§ 5º); saque pessoal sem alvará em qualquer agência (§ 6º) / por procurador com procuração específica (§ 7º).
→ RISCO: pequeno valor depende da LEI DO ENTE (§ 2º) — verificar antes de calcular a rota.`,
    tags: ['processual-civil/juizados-especiais'],
    fonte: EJC,
    urlFonte: URL_12153,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'lei12153-art9-13-cumprimento-pagamento', tipo: 'BASE_PRATICA', descricao: 'Etapa 6 detalhada.' },
      { destinoSlug: 'fluxo-jec-pedido-a-execucao', tipo: 'CONEXO_TEMATICO', descricao: 'Fluxo do JEC comum (LOTE-012).' },
    ],
  } satisfies InputDocument,
  {
    slug: 'prazo-jecf-citacao-conciliacao-30-dias',
    titulo: 'Prazo — JEC Fazenda Pública: citação para a audiência de conciliação com antecedência mínima de 30 dias (art. 7º da Lei 12.153)',
    tipoDocumento: 'PRAZO',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'Citação — audiência de conciliação',
    prioridade: 'P1',
    lote: 'LOTE-024',
    conteudo: `## Prazo LITERAL
**30 (trinta) dias** — antecedência mínima da citação da Fazenda em relação à audiência de conciliação.

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 7º Não haverá prazo diferenciado para a prática de qualquer ato processual pelas pessoas jurídicas de direito público, inclusive a interposição de recursos, devendo a citação para a audiência de conciliação ser efetuada com antecedência mínima de 30 (trinta) dias."

## Termo inicial e operação
- Termo: efetivação da citação → audiência não pode ser marcada para antes de 30 dias.
- Trava adicional: a MESMA norma afasta prazo em dobro da PJ pública no JEC FP (prazo único para as partes).`,
    metadados: { numero: 'Lei 12.153/2009', artigos_principais: ['7'], vigente: true, confirmacao_texto: 'Extração literal do Planalto em 2026-08-30' },
    tags: ['processual-civil/juizados-especiais', 'geral/prazos'],
    fonte: PLANALTO,
    urlFonte: URL_12153,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'fluxo-jec-fazenda', tipo: 'BASE_PRATICA', descricao: 'Etapa 2 do fluxo.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'prazo-jecf-laudo-assistente-5-dias',
    titulo: 'Prazo — JEC Fazenda Pública: laudo do assistente técnico até 5 dias antes da audiência (art. 10 da Lei 12.153)',
    tipoDocumento: 'PRAZO',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'Exame técnico — laudo',
    prioridade: 'P2',
    lote: 'LOTE-024',
    conteudo: `## Prazo LITERAL
**5 (cinco) dias** — o laudo do assistente nomeado para exame técnico deve ser apresentado até 5 dias antes da audiência (de conciliação ou de julgamento).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 10. Para efetuar o exame técnico necessário à conciliação ou ao julgamento da causa, o juiz nomeará pessoa habilitada, que apresentará o laudo até 5 (cinco) dias antes da audiência."

## Termo inicial e operação
- Termo: até 5 dias antes da audiência designada para conciliação ou julgamento.
- Uso: acompanhar a data de juntada do laudo nos autos e requerer vista antes da audiência.`,
    metadados: { numero: 'Lei 12.153/2009', artigos_principais: ['10'], vigente: true, confirmacao_texto: 'Extração literal do Planalto em 2026-08-30' },
    tags: ['processual-civil/juizados-especiais', 'geral/prazos'],
    fonte: PLANALTO,
    urlFonte: URL_12153,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'fluxo-jec-fazenda', tipo: 'BASE_PRATICA', descricao: 'Etapa 4 do fluxo.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'prazo-jecf-pagamento-60-dias',
    titulo: 'Prazo — JEC Fazenda Pública: pagamento de quantia certa em 60 dias da requisição, sem precatório, sob pena de sequestro (art. 13 da Lei 12.153)',
    tipoDocumento: 'PRAZO',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'Pagamento — requisição',
    prioridade: 'P1',
    lote: 'LOTE-024',
    conteudo: `## Prazo LITERAL
**60 (sessenta) dias** — prazo máximo de pagamento contado da ENTREGA DA REQUISIÇÃO do juiz à autoridade citada, independentemente de precatório (obrigação de pequeno valor).

## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)
"Art. 13. Tratando-se de obrigação de pagar quantia certa, após o trânsito em julgado da decisão, o pagamento será efetuado:
I – no prazo máximo de 60 (sessenta) dias, contado da entrega da requisição do juiz à autoridade citada para a causa, independentemente de precatório, na hipótese do § 3º do art. 100 da Constituição Federal; ou
II – mediante precatório, caso o montante da condenação exceda o valor definido como obrigação de pequeno valor.
§ 1º Desatendida a requisição judicial, o juiz, imediatamente, determinará o sequestro do numerário suficiente ao cumprimento da decisão, dispensada a audiência da Fazenda Pública."

## Termo inicial e operação
- Termo: ENTREGA da requisição à autoridade citada (não é a intimação da parte).
- Sanção do vencimento: SEQUESTRO imediato do numerário, dispensada audiência da Fazenda (§ 1º).
- Teto do "pequeno valor": lei do ente (§ 2º); enquanto não publicada, 40 SM (Estado/DF) e 30 SM (Municípios) (§ 3º).`,
    metadados: { numero: 'Lei 12.153/2009', artigos_principais: ['13'], vigente: true, confirmacao_texto: 'Extração literal do Planalto em 2026-08-30' },
    tags: ['processual-civil/juizados-especiais', 'geral/prazos'],
    fonte: PLANALTO,
    urlFonte: URL_12153,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'prazo-jecf-citacao-conciliacao-30-dias', tipo: 'CONEXO_TEMATICO', descricao: 'Outros prazos do mesmo lote.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'triagem-consumidor-fazenda',
    titulo: 'Triagem — Consumidor × Fazenda Pública: roteiro de 10 perguntas para rotear JEC FP × vara comum × juízo fiscal',
    tipoDocumento: 'TRIAGEM',
    area: 'consumidor',
    subarea: 'fazenda-publica',
    assunto: 'Triagem de entrada',
    prioridade: 'P1',
    lote: 'LOTE-024',
    conteudo: `# TRIAGEM — CONSUMIDOR/CREDORE × FAZENDA PÚBLICA
1. Quem é o RÉU? (Município/Estado/DF, autarquia, fundação, empresa pública vinculada — art. 5º II? soc. economia mista → analisar).
2. Quem é o AUTOR? (PF? ME/EPP? PJ comum → NÃO cabe JEC FP).
3. Qual o VALOR total do pedido em salários mínimos? ≤ 60? Vincendas: 12 parcelas + vencidas ≤ 60?
4. A causa é MS, desapropriação, divisão/demarcação, popular, improbidade, EXECUÇÃO FISCAL ou direito difuso/coletivo? (art. 2º § 1º I → fora).
5. O pedido recai sobre BEM IMÓVEL público (art. 2º § 1º II → fora)?
6. Impugna sanção disciplinar/demissão (art. 2º § 1º III → fora)?
7. Há JEC FP instalado na comarca? Há limitação do art. 23 pelo TJ? (competência absoluta § 4º).
8. Há urgência (art. 3º) — dano de difícil/incerta reparação? Que providência cautelar/antecipatória?
9. O pedido é pagar quantia? Qual a estimativa vs. teto de pequeno valor do ente (art. 13 §§ 2º-3º) — rota 60 dias × precatório × renúncia ao excedente (§ 5º)?
10. O fornecedor privado envolvido tem vínculo com o ente? (resolução de litisconsórcio e competência — subsidiária CPC/9.099/10.259, art. 27).`,
    tags: ['consumidor/fazenda-publica'],
    fonte: EJC,
    urlFonte: URL_12153,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'tese-jec-fazenda-vs-execucao-fiscal', tipo: 'BASE_PRATICA', descricao: 'Rota detalhada.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'argumentacao-bilateral-jec-fazenda',
    titulo: 'Argumentação — JEC Fazenda Pública sob os dois lados (4 controvérsias: alçada vincendas, competência absoluta, pequeno valor/precatório, tutela de ofício)',
    tipoDocumento: 'ARGUMENTACAO',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'Argumentos e contra-argumentos',
    prioridade: 'P1',
    lote: 'LOTE-024',
    conteudo: `# CONTROVÉRSIA 1 — Alçada com obrigações vincendas
- **Autor:** "12 parcelas vincendas + vencidas ≤ 60 SM — meu pedido cabe" (art. 2º § 2º, literal).
- **Réu:** "Juros e correção estouram a alçada na data da distribuição." RESPOSTA: o critério legal é o do § 2º; calculadora + planilha anexa.
# CONTROVÉRSIA 2 — Competência absoluta × vara comum
- **Autor:** "JEC FP instalado no foro → competência absoluta (art. 2º § 4º); distribuição fora é incompetente."
- **Réu:** "Há limitação de competência pelo TJ (art. 23) → vara comum é competente." RESPOSTA: art. 23 exige ato do TJ dentro do período de 5 anos da entrada em vigor; comprovar a resolução (verificar no TJ — portal bloqueado nesta consulta).
# CONTROVÉRSIA 3 — Pequeno valor × precatório
- **Autor:** "Requisição em 60 dias sem precatório (art. 13 I) e, se descumprida, sequestro (§ 1º)."
- **Réu:** "Valor excede o pequeno valor do ente → precatório obrigatório." RESPOSTA: art. 13 § 4º veda fracionamento; § 5º — ou precatório TOTAL ou renúncia do excedente; escolha é do EXEQUENTE.
# CONTROVÉRSIA 4 — Tutela antecipatória de ofício
- **Autor:** "Art. 3º permite deferir de OFÍCIO qualquer providência cautelar/antecipatória — risco de dano difícil/incerta reparação."
- **Réu:** "Concessão ex officio violaria isonomia/contraditório." RESPOSTA: texto expresso do art. 3º; contraditório posterior pela viabilidade de revogação; recorribilidade garantida pelo art. 4º (exceção).

## Trava anti-invenção
Fundamentar cada argumento com o texto literal das fichas do LOTE-024; sem percentuais de "taxa de acolhimento" (jurimetria vazia).`,
    tags: ['processual-civil/juizados-especiais', 'consumidor/fazenda-publica'],
    fonte: EJC,
    urlFonte: URL_12153,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'tese-jec-fazenda-vs-execucao-fiscal', tipo: 'BASE_PRATICA', descricao: 'Tese-mãe.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'doutrina-jec-fazenda',
    titulo: 'Doutrina — JEC da Fazenda Pública: lógica do foro especial, paridade de prazos e execução por requisição (conceitos EJC)',
    tipoDocumento: 'DOUTRINA',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'Conceitos fundamentais',
    prioridade: 'P2',
    lote: 'LOTE-024',
    conteudo: `## JEC FP como espécie do sistema
A Lei 12.153 integra o JEC FP ao SISTEMA dos Juizados Especiais (art. 1º § único: cíveis + criminais + Fazenda) — mesmo espírito de oralidade/celeridade, com réu determinado (entes públicos).

## Competência absoluta local
Onde instalado, o JEC FP atrai TODA causa cível do art. 2º (§ 4º) — evita "fórum shopping" e uniformiza o julgamento contra o ente.

## Paridade processual (art. 7º)
Diferente de outras leis que dão prazo dobrado à Fazenda, o art. 7º FIXA PARIDADE — contrapeso é a citação antecipada (30 dias) e a execução rápida por requisição.

## Execução sui generis (arts. 12-13)
- Fazer/não fazer → OFÍCIO à autoridade citada (sem fase executiva autônoma).
- Pagar → requisição 60 dias (pequeno valor) com SEQUESTRO imediato em caso de descumprimento; acima → precatório sem fracionamento; o credor escolhe renunciar o excedente para receber rápido (§ 5º) — racional econômico: tempo × valor.

## Subsidiariedade tripla (art. 27)
CPC (hoje 2015 pela ponte do art. 1.052), 9.099 e 10.259 preenchem lacunas: prazos em dias úteis, recurso inominado, execução no próprio juizado, uniformização.

## Limites honestos
Nenhuma doutrina externa foi consultada nesta rodada (portais institucionais bloqueados) — estes conceitos derivam do TEXTO LEGAL literal; citações doutrinais ficam para re-captura.`,
    tags: ['processual-civil/juizados-especiais'],
    fonte: EJC,
    urlFonte: URL_12153,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'fluxo-jec-fazenda', tipo: 'BASE_PRATICA', descricao: 'Fluxo correspondente.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'regra-se-entao-rota-juizo',
    titulo: 'Regra SE-ENTÃO — Rota de juízo em demandas contra Fazenda (JEC FP × comum × fiscal) e rota de execução',
    tipoDocumento: 'REGRA_INTELIGENCIA',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'Inteligência de roteamento',
    prioridade: 'P1',
    lote: 'LOTE-024',
    conteudo: `## Regras de roteamento (Lei 12.153, literal)
**SE** réu ∈ {Estado, DF, Território, Município, autarquia, fundação, empresa pública vinculada} **E** autor ∈ {PF, ME/EPP} **E** valor ≤ 60 SM (ou 12 vincendas + vencidas ≤ 60) **E** causa fora do art. 2º § 1º I-III **ENTÃO** JEC FAZENDA PÚBLICA (competência absoluta onde instalado — § 4º).

**SE** a causa é mandado de segurança, desapropriação, divisão/demarcação, popular, improbidade, EXECUÇÃO FISCAL ou difuso/coletivo **ENTÃO** NÃO é JEC FP — rotear vara comum/juízo próprio (art. 2º § 1º I).

**SE** a causa versa sobre imóvel público do rol do art. 2º § 1º II **ENTÃO** fora do JEC FP.

**SE** o TJ limitou a competência por até 5 anos (art. 23) **ENTÃO** vara comum é competente para demandas ajuizadas no período (art. 24 complementa: as ajuizadas antes da instalação NÃO são remetidas).

**SE** houver risco de dano de difícil/incerta reparação **ENTÃO** requerer providência cautelar/antecipatória (art. 3º) — e lembrar que essa decisão É recorrível (art. 4º), as demais interlocutórias NÃO.

**SE** condenação de pagar quantia ≤ pequeno valor do ente **ENTÃO** requisição 60 dias sem precatório (art. 13 I) com sequestro automático em descumprimento (§ 1º).
**SE** condenação > pequeno valor **ENTÃO** precatório integral (§§ 4º-5º) OU renúncia ao excedente para pagamento imediato do saldo (§ 5º) — perguntar ao cliente a preferência tempo × valor.

## Trava anti-invenção
Não rotear por analogia inventada: cada rota citada tem texto legal literal correspondente nas fichas do LOTE-024.`,
    tags: ['processual-civil/juizados-especiais', 'geral/metodologia'],
    fonte: EJC,
    urlFonte: URL_12153,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    relacionamentos: [
      { destinoSlug: 'triagem-consumidor-fazenda', tipo: 'BASE_PRATICA', descricao: 'Triagem que alimenta a regra.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'jurimetria-jec-fazenda-vazia',
    titulo: 'Jurimetria — JEC Fazenda Pública (estrutura vazia — sem dados reais)',
    tipoDocumento: 'JURIMETRIA',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'Estrutura para dados futuros',
    prioridade: 'P3',
    lote: 'LOTE-024',
    conteudo: `# JURIMETRIA — JEC FAZENDA PÚBLICA
**Status: SEM DADOS.** Nenhuma estatística real nesta consulta (2026-08-30) — o EJC NÃO inventa percentuais.

## Campos preparados
- tribunal/classe/período/amostra/metodologia/fonte;
- indicadores futuros: tempo médio citação→conciliação; taxa de conciliação com representante do ente; distribuição de condenações dentro/fora do pequeno valor; incidência de sequestro (art. 13 § 1º); tempo médio da requisição→saque.

## Separação obrigatória: DADO ESTATÍSTICO REAL (com fonte) × ANÁLISE QUALITATIVA.`,
    tags: ['processual-civil/juizados-especiais', 'geral/metodologia'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
  } satisfies InputDocument,
];
