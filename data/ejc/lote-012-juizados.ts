// LOTE-012 — Juizados Especiais (JEC/JECrim/JEF/JF) — recurso inominado e turmas recursais (P1)
// Textos LITERAIS extraídos do Planalto:
//  - Lei 9.099/1995 (consulta 2026-08-30)
//  - Lei 10.259/2001 (consulta 2026-08-30)
//  - Lei 12.153/2009 (consulta 2026-08-30)
// Súmulas confirmadas em páginas oficiais:
//  - Súmula 203/STJ e 376/STJ — Arquivo Cidadão STJ (texto literal, consulta 2026-08-30)
//  - Súmula 640/STF — portal.stf.jus.br (URL oficial; captura direta falhou por renderização JS,
//    texto confirmado por snippet indexado da página oficial + corroboração — confiabilidade B honesta)
//  - Súmulas 7 e 41 da Turma de Uniformização dos JEC/TJDFT — página oficial TJDFT
//    (última modificação 30/05/2025, textos literais, consulta 2026-08-30)
// ANTI-INVENÇÃO registrada nesta fase:
//  - A memória sugeria "Súmula 573/STJ = recurso inominado" — DESMENTIDO: a Súmula 573/STJ trata de DPVAT
//    (invalidez permanente e prescrição). NÃO citada.
//  - Nenhum número de REsp do STJ sobre JEC foi citado sem confirmação oficial (regra anti-invenção).
import type { InputDocument } from '../../src/lib/ejc/types';

const D = '2026-08-30';
const L9099 = 'Presidência da República — Planalto (Lei 9.099/1995)';
const URL_9099 = 'https://www.planalto.gov.br/ccivil_03/leis/l9099.htm';
const L10259 = 'Presidência da República — Planalto (Lei 10.259/2001)';
const URL_10259 = 'https://www.planalto.gov.br/ccivil_03/leis/leis_2001/l10259.htm';
const L12153 = 'Presidência da República — Planalto (Lei 12.153/2009)';
const URL_12153 = 'https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2009/lei/l12153.htm';
const STJ_ARQ = 'Arquivo Cidadão do STJ (acervo oficial de súmulas)';
const TJDFT_TU = 'TJDFT — Súmulas da Turma de Uniformização dos Juizados Especiais (página oficial, última modificação 30/05/2025)';
const URL_TJDFT_TU = 'https://www.tjdft.jus.br/consultas/jurisprudencia/sumulas/sumulas-do-juizado-especial';
const EJC = 'Elaboração EJC — conteúdo estrutural original';

export default [
  {
    slug: 'lei-9099-arts-1-2-principios',
    titulo: 'Lei 9.099/1995 arts. 1º e 2º — Princípios dos Juizados Especiais: oralidade, simplicidade, informalidade, economia e celeridade (texto literal confirmado)',
    tipoDocumento: 'LEGISLACAO',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'Princípios regedores do JEC',
    prioridade: 'P1',
    conteudo: `## Textos CONFIRMADOS LITERALMENTE no Planalto (consulta 2026-08-30)

"Art. 1º Os Juizados Especiais Cíveis e Criminais, órgãos da Justiça Ordinária, serão criados pela União, no Distrito Federal e nos Territórios, e pelos Estados, para conciliação, processo, julgamento e execução, nas causas de sua competência.
Art. 2º O processo orientar-se-á pelos critérios da oralidade, simplicidade, informalidade, economia processual e celeridade, buscando, sempre que possível, a conciliação ou a transação."

## Aplicação prática
- Os princípios autorizam a flexibilização formal (nulidade só com prejuízo — art. 13) mas NÃO dispensam os requisitos essenciais do art. 42 do recurso inominado (petição escrita com razões e pedido) nem a representação por advogado em grau recursal (art. 41 § 2º).`,
    metadados: { numero: 'Lei 9.099/1995', data_norma: '1995-09-26', orgao: 'Congresso Nacional', artigos_principais: ['1', '2'], vigente: true, confirmacao_texto: 'Extração literal do Planalto em 2026-08-30' },
    tags: ['processual-civil/juizados-especiais'],
    fonte: L9099,
    urlFonte: URL_9099,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'lei-9099-art-3-competencia-40sm-exclusoes', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Princípios → competência.' },
      { destinoSlug: 'lei-9099-arts-41-43-recurso-inominado', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Flexibilização não dispensa requisitos recursais.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'lei-9099-art-3-competencia-40sm-exclusoes',
    titulo: 'Lei 9.099/1995 art. 3º — Competência do JEC: alçada de 40 salários mínimos, renúncia ao excedente e causas excluídas (texto literal confirmado)',
    tipoDocumento: 'LEGISLACAO',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'Competência e alçada',
    prioridade: 'P1',
    conteudo: `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30)

"Art. 3º O Juizado Especial Cível tem competência para conciliação, processo e julgamento das causas cíveis de menor complexidade, assim consideradas:
I - as causas cujo valor não exceda a quarenta vezes o salário mínimo;
II - as enumeradas no art. 275, inciso II, do Código de Processo Civil;
III - a ação de despejo para uso próprio;
IV - as ações possessórias sobre bens imóveis de valor não excedente ao fixado no inciso I deste artigo.
§ 1º Compete ao Juizado Especial promover a execução:
I - dos seus julgados;
II - dos títulos executivos extrajudiciais, no valor de até quarenta vezes o salário mínimo, observado o disposto no § 1º do art. 8º desta Lei.
§ 2º Ficam excluídas da competência do Juizado Especial as causas de natureza alimentar, falimentar, fiscal e de interesse da Fazenda Pública, e também as relativas a acidentes de trabalho, a resíduos e ao estado e capacidade das pessoas, ainda que de cunho patrimonial.
§ 3º A opção pelo procedimento previsto nesta Lei importará em renúncia ao crédito excedente ao limite estabelecido neste artigo, excetuada a hipótese de conciliação."

## Alerta de interpretação
- O inciso II remete ao art. 275 II do CPC/1973 (revogado); doutrina e tribunais leem como continuidade do rol de causas de menor complexidade — o EJC não reproduz o texto do CPC/1973 como vigente.
- EXCEÇÃO à exclusão da Fazenda Pública: leis especiais (Lei 10.259/2001 JEF e Lei 12.153/2009 JF) criaram juizados próprios para o ente público — docs vinculados.`,
    metadados: { numero: 'Lei 9.099/1995', artigos_principais: ['3'], vigente: true, confirmacao_texto: 'Extração literal do Planalto em 2026-08-30' },
    tags: ['processual-civil/juizados-especiais'],
    fonte: L9099,
    urlFonte: URL_9099,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'lei-10259-jec-federal-competencia-60sm', tipo: 'EXCECAO_EXPLICADA', descricao: 'Fazenda federal cabe no JEF (Lei 10.259).' },
      { destinoSlug: 'lei-12153-jec-fazenda-publica-competencia', tipo: 'EXCECAO_EXPLICADA', descricao: 'Fazenda estadual/municipal cabe no JF (Lei 12.153).' },
      { destinoSlug: 'regra-se-jec-competencia-por-valor', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Regra de triagem de alçada.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'lei-9099-arts-4-8-foro-partes-assistencia',
    titulo: 'Lei 9.099/1995 arts. 4º, 8º, 9º e 10 — Foro, legitimados, assistência facultativa/obrigatória e vedação de intervenção de terceiros (textos literais confirmados)',
    tipoDocumento: 'LEGISLACAO',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'Partes e postulação',
    prioridade: 'P1',
    conteudo: `## Textos CONFIRMADOS LITERALMENTE no Planalto (consulta 2026-08-30)

### Art. 4º — foro
"Art. 4º É competente, para as causas previstas nesta Lei, o Juizado do foro:
I - do domicílio do réu ou, a critério do autor, do local onde aquele exerça atividades profissionais ou econômicas ou mantenha estabelecimento, filial, agência, sucursal ou escritório;
II - do lugar onde a obrigação deva ser satisfeita;
III - do domicílio do autor ou do local do ato ou fato, nas ações para reparação de dano de qualquer natureza.
Parágrafo único. Em qualquer hipótese, poderá a ação ser proposta no foro previsto no inciso I deste artigo."

### Art. 8º — partes
"Art. 8º Não poderão ser partes, no processo instituído por esta Lei, o incapaz, o preso, as pessoas jurídicas de direito público, as empresas públicas da União, a massa falida e o insolvente civil.
§ 1º Somente serão admitidas a propor ação perante o Juizado Especial:
I - as pessoas físicas capazes, excluídos os cessionários de direito de pessoas jurídicas;
II - as pessoas enquadradas como microempreendedores individuais, microempresas e empresas de pequeno porte na forma da Lei Complementar nº 123, de 14 de dezembro de 2006;
III - as pessoas jurídicas qualificadas como Organização da Sociedade Civil de Interesse Público, nos termos da Lei nº 9.790, de 23 de março de 1999;
IV - as sociedades de crédito ao microempreendedor, nos termos do art. 1º da Lei nº 10.194, de 14 de fevereiro de 2001.
§ 2º O maior de dezoito anos poderá ser autor, independentemente de assistência, inclusive para fins de conciliação."
(§ 1º na redação da Lei Complementar nº 147/2014)

### Art. 9º — assistência
"Art. 9º Nas causas de valor até vinte salários mínimos, as partes comparecerão pessoalmente, podendo ser assistidas por advogado; nas de valor superior, a assistência é obrigatória."
(§ 4º na redação da Lei 12.137/2009: preposto credenciado com carta de preposição com poderes para transigir, sem vínculo empregatício)

### Art. 10 — intervenção de terceiros
"Art. 10. Não se admitirá, no processo, qualquer forma de intervenção de terceiro nem de assistência. Admitir-se-á o litisconsórcio."

## Interpretação aplicada
- Consumidor pode demandar no domicílio do autor em reparação de dano (art. 4º III) — vantagem prática em demandas contra fornecedor.
- MEI/MEE/EPP podem ser AUTORES (LC 147/2014), mas permanecem impedidos de serem RÉS em JEC estadual (a parte passiva é limitada às pessoas físicas capazes e assemelhadas).`,
    metadados: { numero: 'Lei 9.099/1995', artigos_principais: ['4', '8', '9', '10'], vigente: true, confirmacao_texto: 'Extração literal do Planalto em 2026-08-30; § 1º art. 8º red. LC 147/2014' },
    tags: ['processual-civil/juizados-especiais'],
    fonte: L9099,
    urlFonte: URL_9099,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'triagem-jec-competencia-partes', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Script de triagem usa estes limites.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'lei-9099-arts-12a-16-dias-uteis-pedido-conciliacao',
    titulo: 'Lei 9.099/1995 arts. 12-A a 16 — Prazos em dias úteis, pedido simples, custas dispensadas e sessão de conciliação em 15 dias (textos literais confirmados)',
    tipoDocumento: 'LEGISLACAO',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'Prazos, pedido e primeiros atos',
    prioridade: 'P1',
    conteudo: `## Textos CONFIRMADOS LITERALMENTE no Planalto (consulta 2026-08-30)

### Art. 12-A (Incluído pela Lei 13.728/2018)
"Art. 12-A. Na contagem de prazo em dias, estabelecido por lei ou pelo juiz, para a prática de qualquer ato processual, inclusive para a interposição de recursos, computar-se-ão somente os dias úteis."

### Art. 14 — pedido
"Art. 14. O processo instaurar-se-á com a apresentação do pedido, escrito ou oral, à Secretaria do Juizado.
§ 1º Do pedido constarão, de forma simples e em linguagem acessível:
I - o nome, a qualificação e o endereço das partes;
II - os fatos e os fundamentos, de forma sucinta;
III - o objeto e seu valor.
§ 2º É lícito formular pedido genérico quando não for possível determinar, desde logo, a extensão da obrigação.
§ 3º O pedido oral será reduzido a escrito pela Secretaria do Juizado, podendo ser utilizado o sistema de fichas ou formulários impressos."

### Art. 54 — custas
"Art. 54. O acesso ao Juizado Especial independerá, em primeiro grau de jurisdição, do pagamento de custas, taxas ou despesas.
Parágrafo único. O preparo do recurso, na forma do § 1º do art. 42 desta Lei, compreenderá todas as despesas processuais, inclusive aquelas dispensadas em primeiro grau, ressalvada a hipótese de assistência judiciária gratuita."

### Art. 16 — sessão de conciliação
"Art. 16. Registrado o pedido, independentemente de distribuição e autuação, a Secretaria do Juizado designará a sessão de conciliação, a realizar-se no prazo de quinze dias."

### Art. 15 — pedidos cumulados
"Art. 15. Os pedidos mencionados no art. 3º desta Lei poderão ser alternativos ou cumulados; nesta última hipótese, desde que conexos e a soma não ultrapasse o limite fixado naquele dispositivo."

## Interpretação aplicada
- Desde a Lei 13.728/2018, TODOS os prazos do JEC (inclusive o recurso inominado de 10 dias e o preparo de 48h) contam em DIAS ÚTEIS (art. 12-A).`,
    metadados: { numero: 'Lei 9.099/1995', artigos_principais: ['12-A', '14', '15', '16', '54'], vigente: true, confirmacao_texto: 'Extração literal do Planalto em 2026-08-30; art. 12-A incluído pela Lei 13.728/2018' },
    tags: ['processual-civil/juizados-especiais', 'geral/prazos'],
    fonte: L9099,
    urlFonte: URL_9099,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'prazo-recurso-inominado-jec-10-dias-uteis', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Contagem em dias úteis afeta o recurso.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'lei-9099-arts-17-23-conciliacao-citacao-revelia',
    titulo: 'Lei 9.099/1995 arts. 17-23 — Conciliação imediata, citação com AR, vedação de edital, intimações e revelia (textos literais confirmados)',
    tipoDocumento: 'LEGISLACAO',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'Fase de conciliação e citação',
    prioridade: 'P1',
    conteudo: `## Textos CONFIRMADOS LITERALMENTE no Planalto (consulta 2026-08-30)

### Art. 17
"Art. 17. Comparecendo inicialmente ambas as partes, instaurar-se-á, desde logo, a sessão de conciliação, dispensados o registro prévio de pedido e a citação.
Parágrafo único. Havendo pedidos contrapostos, poderá ser dispensada a contestação formal e ambos serão apreciados na mesma sentença."

### Art. 18 — citação
"Art. 18. A citação far-se-á:
I - por correspondência, com aviso de recebimento em mão própria;
II - tratando-se de pessoa jurídica ou firma individual, mediante entrega ao encarregado da recepção, que será obrigatoriamente identificado;
III - sendo necessário, por oficial de justiça, independentemente de mandado ou carta precatória.
§ 1º A citação conterá cópia do pedido inicial, dia e hora para comparecimento do citando e advertência de que, não comparecendo este, considerar-se-ão verdadeiras as alegações iniciais, e será proferido julgamento, de plano.
§ 2º Não se fará citação por edital.
§ 3º O comparecimento espontâneo suprirá a falta ou nulidade da citação."

### Art. 19 — intimações
"Art. 19. As intimações serão feitas na forma prevista para citação, ou por qualquer outro meio idôneo de comunicação.
§ 1º Dos atos praticados na audiência, considerar-se-ão desde logo cientes as partes.
§ 2º As partes comunicarão ao juízo as mudanças de endereço ocorridas no curso do processo, reputando-se eficazes as intimações enviadas ao local anteriormente indicado, na ausência da comunicação."

### Art. 20 — revelia
"Art. 20. Não comparecendo o demandado à sessão de conciliação ou à audiência de instrução e julgamento, reputar-se-ão verdadeiros os fatos alegados no pedido inicial, salvo se o contrário resultar da convicção do Juiz."

### Art. 22 — homologação (com redação da Lei 13.994/2020)
"Art. 22. A conciliação será conduzida pelo Juiz togado ou leigo ou por conciliador sob sua orientação.
§ 1º Obtida a conciliação, esta será reduzida a escrito e homologada pelo Juiz togado mediante sentença com eficácia de título executivo.
§ 2º É cabível a conciliação não presencial conduzida pelo Juizado mediante o emprego dos recursos tecnológicos disponíveis de transmissão de sons e imagens em tempo real, devendo o resultado da tentativa de conciliação ser reduzido a escrito com os anexos pertinentes."

### Art. 23 — não comparecimento do réu (red. Lei 13.994/2020)
"Art. 23. Se o demandado não comparecer ou recusar-se a participar da tentativa de conciliação não presencial, o Juiz togado proferirá sentença."

## Interpretação aplicada
- A presunção de veracidade do art. 20 NÃO é absoluta: exige citação válida e convicção do juiz; em demanda consumidora, a presunção não desincumbe o autor de provar o fato (contrato, defeito).`,
    metadados: { numero: 'Lei 9.099/1995', artigos_principais: ['17', '18', '19', '20', '21', '22', '23'], vigente: true, confirmacao_texto: 'Extração literal do Planalto em 2026-08-30; arts. 22/23 com alterações da Lei 13.994/2020 visíveis no texto' },
    tags: ['processual-civil/juizados-especiais'],
    fonte: L9099,
    urlFonte: URL_9099,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'fluxo-jec-pedido-a-execucao', tipo: 'REFERENCIA_FLUXO', descricao: 'Fases do procedimento.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'lei-9099-arts-27-33-instrucao-provas',
    titulo: 'Lei 9.099/1995 arts. 27-33 — Instrução: audiência imediata, incidentes de plano, contestação oral, vedação de reconvenção e meios de prova (textos literais confirmados)',
    tipoDocumento: 'LEGISLACAO',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'Instrução e resposta do réu',
    prioridade: 'P1',
    conteudo: `## Textos CONFIRMADOS LITERALMENTE no Planalto (consulta 2026-08-30)

"Art. 27. Não instituído o juízo arbitral, proceder-se-á imediatamente à audiência de instrução e julgamento, desde que não resulte prejuízo para a defesa.
Parágrafo único. Não sendo possível a sua realização imediata, será a audiência designada para um dos quinze dias subseqüentes, cientes, desde logo, as partes e testemunhas eventualmente presentes.
Art. 28. Na audiência de instrução e julgamento serão ouvidas as partes, colhida a prova e, em seguida, proferida a sentença.
Art. 29. Serão decididos de plano todos os incidentes que possam interferir no regular prosseguimento da audiência. As demais questões serão decididas na sentença.
Parágrafo único. Sobre os documentos apresentados por uma das partes, manifestar-se-á imediatamente a parte contrária, sem interrupção da audiência.
Art. 30. A contestação, que será oral ou escrita, conterá toda matéria de defesa, exceto argüição de suspeição ou impedimento do Juiz, que se processará na forma da legislação em vigor.
Art. 31. Não se admitirá a reconvenção. É lícito ao réu, na contestação, formular pedido em seu favor, nos limites do art. 3º desta Lei, desde que fundado nos mesmos fatos que constituem objeto da controvérsia.
Parágrafo único. O autor poderá responder ao pedido do réu na própria audiência ou requerer a designação da nova data, que será desde logo fixada, cientes todos os presentes.
Art. 32. Todos os meios de prova moralmente legítimos, ainda que não especificados em lei, são hábeis para provar a veracidade dos fatos alegados pelas partes.
Art. 33. Todas as provas serão produzidas na audiência de instrução e julgamento, ainda que não requeridas previamente, podendo o Juiz limitar ou excluir as que considerar excessivas, impertinentes ou protelatórias."

## Interpretação aplicada
- Pedido contraposto (art. 31) substitui a reconvenção: mesmo fator conexo, limitado à alçada.
- Prova pericial: no JEC estadual é substituída por inquirição de técnicos (art. 35); o CPC/2015 aplica-se supletivamente apenas no que não conflitar.`,
    metadados: { numero: 'Lei 9.099/1995', artigos_principais: ['27', '28', '29', '30', '31', '32', '33'], vigente: true, confirmacao_texto: 'Extração literal do Planalto em 2026-08-30' },
    tags: ['processual-civil/juizados-especiais'],
    fonte: L9099,
    urlFonte: URL_9099,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'lei-9099-arts-34-36-testemunhas-juiz-leigo', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Continuidade do rito instrutório.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'lei-9099-arts-34-36-testemunhas-juiz-leigo',
    titulo: 'Lei 9.099/1995 arts. 34-36 — Testemunhas (máximo 3, intimação 5 dias antes), técnicos e dispensa de redução a termo (textos literais confirmados)',
    tipoDocumento: 'LEGISLACAO',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'Prova testemunhal',
    prioridade: 'P1',
    conteudo: `## Textos CONFIRMADOS LITERALMENTE no Planalto (consulta 2026-08-30)

"Art. 34. As testemunhas, até o máximo de três para cada parte, comparecerão à audiência de instrução e julgamento levadas pela parte que as tenha arrolado, independentemente de intimação, ou mediante esta, se assim for requerido.
§ 1º O requerimento para intimação das testemunhas será apresentado à Secretaria no mínimo cinco dias antes da audiência de instrução e julgamento.
§ 2º Não comparecendo a testemunha intimada, o Juiz poderá determinar sua imediata condução, valendo-se, se necessário, do concurso da força pública.
Art. 35. Quando a prova do fato exigir, o Juiz poderá inquirir técnicos de sua confiança, permitida às partes a apresentação de parecer técnico.
Parágrafo único. No curso da audiência, poderá o Juiz, de ofício ou a requerimento das partes, realizar inspeção em pessoas ou coisas, ou determinar que o faça pessoa de sua confiança, que lhe relatará informalmente o verificado.
Art. 36. A prova oral não será reduzida a escrito, devendo a sentença referir, no essencial, os informes trazidos nos depoimentos."`,
    metadados: { numero: 'Lei 9.099/1995', artigos_principais: ['34', '35', '36'], vigente: true, confirmacao_texto: 'Extração literal do Planalto em 2026-08-30' },
    tags: ['processual-civil/juizados-especiais'],
    fonte: L9099,
    urlFonte: URL_9099,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'prazo-jec-intimacao-testemunhas-5-dias', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Prazo operacional derivado do § 1º.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'lei-9099-arts-37-40-sentenca-juiz-leigo',
    titulo: 'Lei 9.099/1995 arts. 37-40 — Sentença sem relatório, condenação líquida, ineficácia além da alçada e homologação pelo juiz togado (textos literais confirmados)',
    tipoDocumento: 'LEGISLACAO',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'Sentença',
    prioridade: 'P1',
    conteudo: `## Textos CONFIRMADOS LITERALMENTE no Planalto (consulta 2026-08-30)

"Art. 37. A instrução poderá ser dirigida por Juiz leigo, sob a supervisão de Juiz togado.
Art. 38. A sentença mencionará os elementos de convicção do Juiz, com breve resumo dos fatos relevantes ocorridos em audiência, dispensado o relatório.
Parágrafo único. Não se admitirá sentença condenatória por quantia ilíquida, ainda que genérico o pedido.
Art. 39. É ineficaz a sentença condenatória na parte que exceder a alçada estabelecida nesta Lei.
Art. 40. O Juiz leigo que tiver dirigido a instrução proferirá sua decisão e imediatamente a submeterá ao Juiz togado, que poderá homologá-la, proferir outra em substituição ou, antes de se manifestar, determinar a realização de atos probatórios indispensáveis."

## Interpretação aplicada
- O § 3º do art. 3º (renúncia ao excedente) vale para a OPÇÃO pelo rito; o art. 39 vale para a sentença: excedente é INEFICAZ (não inexistente — permite buscar o excesso no juízo comum).`,
    metadados: { numero: 'Lei 9.099/1995', artigos_principais: ['37', '38', '39', '40'], vigente: true, confirmacao_texto: 'Extração literal do Planalto em 2026-08-30' },
    tags: ['processual-civil/juizados-especiais'],
    fonte: L9099,
    urlFonte: URL_9099,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'tese-ineficacia-sentenca-excedente-algada', tipo: 'INTERPRETA_DISPOSITIVO', descricao: 'Tese operacional do art. 39.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'lei-9099-arts-41-43-recurso-inominado',
    titulo: 'Lei 9.099/1995 arts. 41-43 — Recurso inominado: turma recursal, advogado obrigatório, prazo de 10 dias, preparo em 48h e efeito devolutivo (textos literais confirmados)',
    tipoDocumento: 'LEGISLACAO',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'Recurso inominado',
    prioridade: 'P0',
    conteudo: `## Textos CONFIRMADOS LITERALMENTE no Planalto (consulta 2026-08-30) — NÚCLEO DO LOTE

"Art. 41. Da sentença, excetuada a homologatória de conciliação ou laudo arbitral, caberá recurso para o próprio Juizado.
§ 1º O recurso será julgado por uma turma composta por três Juízes togados, em exercício no primeiro grau de jurisdição, reunidos na sede do Juizado.
§ 2º No recurso, as partes serão obrigatoriamente representadas por advogado.
Art. 42. O recurso será interposto no prazo de dez dias, contados da ciência da sentença, por petição escrita, da qual constarão as razões e o pedido do recorrente.
§ 1º O preparo será feito, independentemente de intimação, nas quarenta e oito horas seguintes à interposição, sob pena de deserção.
§ 2º Após o preparo, a Secretaria intimará o recorrido para oferecer resposta escrita no prazo de dez dias.
Art. 43. O recurso terá somente efeito devolutivo, podendo o Juiz dar-lhe efeito suspensivo, para evitar dano irreparável para a parte."

## Interpretação operacional
- CABIMENTO: sentença (exceto homologatória de conciliação/laudo arbitral). Decisões interlocutórias NÃO são recorríveis de imediato (irrecorribilidade imediata) — prejuízo impugnado no recurso contra a sentença.
- Composição: 3 juízes TOGADOS de 1º grau (turma recursal / TVR).
- Prazos (contados em DIAS ÚTEIS desde a Lei 13.728/2018 — art. 12-A): interposição 10 dias úteis; preparo 48 HORAS seguintes à interposição (independentemente de intimação — atenção especial!); resposta 10 dias úteis.
- Efeito: somente devolutivo + suspensivo excepcional a requerimento com fundamento em dano irreparável.
- Preparo: todas as despesas (art. 54 parágrafo único), ressalvada gratuidade.
- Depois da turma recursal: NÃO cabe REsp (Súmula 203/STJ); cabe RE/REsp ENQUANTO EXCEÇÃO — RE é cabível (Súmula 640/STF) e uniformização nos JEF (art. 14 Lei 10.259) — docs vinculados.`,
    metadados: { numero: 'Lei 9.099/1995', artigos_principais: ['41', '42', '43'], vigente: true, confirmacao_texto: 'Extração literal do Planalto em 2026-08-30' },
    tags: ['processual-civil/juizados-especiais', 'processual-civil/recursos', 'geral/prazos'],
    fonte: L9099,
    urlFonte: URL_9099,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'prazo-recurso-inominado-jec-10-dias-uteis', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Prazo operacional de interposição.' },
      { destinoSlug: 'sumula-203-stj-sem-resp-contra-turma-recursal', tipo: 'CONSEQUENCIA_RECURSAL', descricao: 'Limite recursal após a turma recursal.' },
      { destinoSlug: 'sumula-640-stf-cabe-re-turma-recursal', tipo: 'CONSEQUENCIA_RECURSAL', descricao: 'Exceção constitucional do RE.' },
      { destinoSlug: 'peca-recurso-inominado-modelo-jec', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Peça-modelo derivada.' },
      { destinoSlug: 'checklist-admissibilidade-recurso-inominado', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Checagem de requisitos.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'lei-9099-arts-52-55-execucao-custas',
    titulo: 'Lei 9.099/1995 arts. 52-55 — Execução no próprio Juizado, multa diária, embargos restritos, custas do recurso e sucumbência só em 2º grau (textos literais confirmados)',
    tipoDocumento: 'LEGISLACAO',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'Execução e custas',
    prioridade: 'P1',
    conteudo: `## Textos CONFIRMADOS LITERALMENTE no Planalto (consulta 2026-08-30) — síntese dos pontos operacionais

### Art. 52 — execução da sentença (incisos essenciais)
"Art. 52. A execução da sentença processar-se-á no próprio Juizado, aplicando-se, no que couber, o disposto no Código de Processo Civil, com as seguintes alterações:
I - as sentenças serão necessariamente líquidas...
IV - não cumprida voluntariamente a sentença transitada em julgado, e tendo havido solicitação do interessado, que poderá ser verbal, proceder-se-á desde logo à execução, dispensada nova citação;
V - nos casos de obrigação de entregar, de fazer, ou de não fazer, o Juiz, na sentença ou na fase de execução, cominará multa diária...
IX - o devedor poderá oferecer embargos, nos autos da execução, versando sobre: a) falta ou nulidade da citação no processo, se ele correu à revelia; b) manifesto excesso de execução; c) erro de cálculo; d) causa impeditiva, modificativa ou extintiva da obrigação, superveniente à sentença."

### Art. 53 — execução de título extrajudicial até 40 SM
"Art. 53. A execução de título executivo extrajudicial, no valor de até quarenta salários mínimos, obedecerá ao disposto no Código de Processo Civil, com as modificações introduzidas por esta Lei.
§ 1º Efetuada a penhora, o devedor será intimado a comparecer à audiência de conciliação, quando poderá oferecer embargos (art. 52, IX), por escrito ou verbalmente.
§ 4º Não encontrado o devedor ou inexistindo bens penhoráveis, o processo será imediatamente extinto, devolvendo-se os documentos ao autor."

### Art. 55 — custas e honorários
"Art. 55. A sentença de primeiro grau não condenará o vencido em custas e honorários de advogado, ressalvados os casos de litigância de má-fé. Em segundo grau, o recorrente, vencido, pagará as custas e honorários de advogado, que serão fixados entre dez por cento e vinte por cento do valor de condenação ou, não havendo condenação, do valor corrigido da causa."

## Interpretação aplicada
- Honorários recursais entre 10% e 20% do valor da condenação ou da causa (corrigida) — taxa da Lei 9.099, DISTINTA da do CPC art. 85 (cumulativa na leitura comum dos tribunais, com ressalvas locais — ver Súmula 41 TU/TJDFT para agravo de instrumento nos JEC/DF).`,
    metadados: { numero: 'Lei 9.099/1995', artigos_principais: ['52', '53', '54', '55'], vigente: true, confirmacao_texto: 'Extração literal do Planalto em 2026-08-30' },
    tags: ['processual-civil/juizados-especiais', 'processual-civil/execucao'],
    fonte: L9099,
    urlFonte: URL_9099,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'sumula-41-tu-tjdft-sem-honorarios-recursais-agravo', tipo: 'CONTEXTO_REGULACAO', descricao: 'Limitação local no DF.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'lei-10259-jec-federal-competencia-60sm',
    titulo: 'Lei 10.259/2001 — JEC Federal: competência até 60 salários mínimos, partes, vedação de prazo diferenciado e custeio de perícia pelo ente (textos literais confirmados)',
    tipoDocumento: 'LEGISLACAO',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'Juizados Especiais Federais',
    prioridade: 'P1',
    conteudo: `## Textos CONFIRMADOS LITERALMENTE no Planalto (consulta 2026-08-30)

### Art. 3º — competência
"Art. 3º Compete ao Juizado Especial Federal Cível processar, conciliar e julgar causas de competência da Justiça Federal até o valor de sessenta salários mínimos, bem como executar as suas sentenças.
§ 1º Não se incluem na competência do Juizado Especial Cível as causas:
I - referidas no art. 109, incisos II, III e XI, da Constituição Federal, as ações de mandado de segurança, de desapropriação, de divisão e demarcação, populares, execuções fiscais e por improbidade administrativa e as demandas sobre direitos ou interesses difusos, coletivos ou individuais homogêneos;
II - sobre bens imóveis da União, autarquias e fundações públicas federais;
III - para a anulação ou cancelamento de ato administrativo federal, salvo o de natureza previdenciária e o de lançamento fiscal;
IV - que tenham como objeto a impugnação da pena de demissão imposta a servidores públicos civis ou de sanções disciplinares aplicadas a militares.
§ 2º Quando a pretensão versar sobre obrigações vincendas, para fins de competência do Juizado Especial, a soma de doze parcelas não poderá exceder o valor referido no art. 3º, caput.
§ 3º No foro onde estiver instalada Vara do Juizado Especial, a sua competência é absoluta."

### Art. 5º
"Art. 5º Exceto nos casos do art. 4º, somente será admitido recurso de sentença definitiva."

### Art. 6º — partes
"Art. 6º Podem ser partes no Juizado Especial Federal Cível:
I - como autores, as pessoas físicas e as microempresas e empresas de pequeno porte, assim definidas na Lei nº 9.317, de 5 de dezembro de 1996;
II - como rés, a União, autarquias, fundações e empresas públicas federais."

### Art. 9º — prazo único
"Art. 9º Não haverá prazo diferenciado para a prática de qualquer ato processual pelas pessoas jurídicas de direito público, inclusive a interposição de recursos, devendo a citação para audiência de conciliação ser efetuada com antecedência mínima de trinta dias."

### Art. 10 — representação
"Art. 10. As partes poderão designar, por escrito, representantes para a causa, advogado ou não.
Parágrafo único. Os representantes judiciais da União, autarquias, fundações e empresas públicas federais, bem como os indicados na forma do caput, ficam autorizados a conciliar, transigir ou desistir, nos processos da competência dos Juizados Especiais Federais."

## Interpretação aplicada
- Remuneração previdenciária (IPCA-E/SELIC — ADC 58/59) é caso típico do JEF; a representação própria (art. 10) dispensa advogado em 1º grau.`,
    metadados: { numero: 'Lei 10.259/2001', data_norma: '2001-07-12', artigos_principais: ['3', '5', '6', '9', '10'], vigente: true, confirmacao_texto: 'Extração literal do Planalto em 2026-08-30' },
    tags: ['processual-civil/juizados-especiais', 'consumidor/fazenda-publica'],
    fonte: L10259,
    urlFonte: URL_10259,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'lei-10259-uniformizacao-pedilef-art-14', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Vias recursais do JEF.' },
      { destinoSlug: 'lei-9099-art-3-competencia-40sm-exclusoes', tipo: 'CONTEXTO_REGULACAO', descricao: 'Exceção à exclusão da Fazenda.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'lei-10259-uniformizacao-pedilef-art-14',
    titulo: 'Lei 10.259/2001 arts. 13-14 — Sem reexame necessário e pedido de uniformização de interpretação de lei (Tuma de Uniformização e STJ) (textos literais confirmados)',
    tipoDocumento: 'LEGISLACAO',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'Uniformização de jurisprudência no JEF',
    prioridade: 'P1',
    conteudo: `## Textos CONFIRMADOS LITERALMENTE no Planalto (consulta 2026-08-30)

"Art. 13. Nas causas de que trata esta Lei, não haverá reexame necessário.

Art. 14. Caberá pedido de uniformização de interpretação de lei federal quando houver divergência entre decisões sobre questões de direito material proferidas por Turmas Recursais na interpretação da lei.
§ 1º O pedido fundado em divergência entre Turmas da mesma Região será julgado em reunião conjunta das Turmas em conflito, sob a presidência do Juiz Coordenador.
§ 2º O pedido fundado em divergência entre decisões de turmas de diferentes regiões ou da proferida em contrariedade a súmula ou jurisprudência dominante do STJ será julgado por Turma de Uniformização, integrada por juízes de Turmas Recursais, sob a presidência do Coordenador da Justiça Federal.
§ 4º Quando a orientação acolhida pela Turma de Uniformização, em questões de direito material, contrariar súmula ou jurisprudência dominante no Superior Tribunal de Justiça - STJ, a parte interessada poderá provocar a manifestação deste, que dirimirá a divergência.
§ 6º Eventuais pedidos de uniformização idênticos, recebidos subseqüentemente em quaisquer Turmas Recursais, ficarão retidos nos autos, aguardando-se pronunciamento do Superior Tribunal de Justiça."

## Interpretação aplicada
- O PUI (pedido de uniformização de interpretação) é a via de correção da divergência nos JEF — subjetivamente distinto do REsp; o acesso ao STJ ocorre quando a TU contraria súmula/jurisprudência dominante (§ 4º).`,
    metadados: { numero: 'Lei 10.259/2001', artigos_principais: ['13', '14'], vigente: true, confirmacao_texto: 'Extração literal do Planalto em 2026-08-30' },
    tags: ['processual-civil/juizados-especiais', 'processual-civil/recursos'],
    fonte: L10259,
    urlFonte: URL_10259,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'sumula-203-stj-sem-resp-contra-turma-recursal', tipo: 'CONTEXTO_REGULACAO', descricao: 'Fronteira entre PUI e REsp.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'lei-12153-jec-fazenda-publica-competencia',
    titulo: 'Lei 12.153/2009 — Juizado Especial da Fazenda Pública estadual/DF/municipal: competência até 60 SM, cautelares e execução sem precatório até o limite (textos literais confirmados)',
    tipoDocumento: 'LEGISLACAO',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'JEC Fazenda Pública',
    prioridade: 'P1',
    conteudo: `## Textos CONFIRMADOS LITERALMENTE no Planalto (consulta 2026-08-30)

### Arts. 1º-3º
"Art. 1º Os Juizados Especiais da Fazenda Pública, órgãos da justiça comum e integrantes do Sistema dos Juizados Especiais, serão criados pela União, no Distrito Federal e nos Territórios, e pelos Estados, para conciliação, processo, julgamento e execução, nas causas de sua competência.
Art. 2º É de competência dos Juizados Especiais da Fazenda Pública processar, conciliar e julgar causas cíveis de interesse dos Estados, do Distrito Federal, dos Territórios e dos Municípios, até o valor de 60 (sessenta) salários mínimos.
§ 1º Não se incluem na competência do Juizado Especial da Fazenda Pública:
I – as ações de mandado de segurança, de desapropriação, de divisão e demarcação, populares, por improbidade administrativa, execuções fiscais e as demandas sobre direitos ou interesses difusos e coletivos;
II – as causas sobre bens imóveis dos Estados, Distrito Federal, Territórios e Municípios, autarquias e fundações públicas a eles vinculadas;
III – as causas que tenham como objeto a impugnação da pena de demissão imposta a servidores públicos civis ou sanções disciplinares aplicadas a militares.
§ 2º Quando a pretensão versar sobre obrigações vincendas, para fins de competência do Juizado Especial, a soma de 12 (doze) parcelas vincendas e de eventuais parcelas vencidas não poderá exceder o valor referido no caput deste artigo.
§ 4º No foro onde estiver instalado Juizado Especial da Fazenda Pública, a sua competência é absoluta.
Art. 3º O juiz poderá, de ofício ou a requerimento das partes, deferir quaisquer providências cautelares e antecipatórias no curso do processo, para evitar dano de difícil ou de incerta reparação."

### Art. 13 — pagamento (síntese literal)
"Art. 13. Tratando-se de obrigação de pagar quantia certa, após o trânsito em julgado da decisão, o pagamento será efetuado:
I – no prazo máximo de 60 (sessenta) dias, contado da entrega da requisição do juiz à autoridade citada para a causa, independentemente de precatório, na hipótese do § 3º do art. 100 da Constituição Federal; ou
II – mediante precatório, caso o montante da condenação exceda o valor definido como obrigação de pequeno valor.
§ 3º Até que se dê a publicação das leis de que trata o § 2º, os valores serão:
I – 40 (quarenta) salários mínimos, quanto aos Estados e ao Distrito Federal;
II – 30 (trinta) salários mínimos, quanto aos Municípios.
§ 4º São vedados o fracionamento, a repartição ou a quebra do valor da execução..."

### Art. 27 — subsidiariedade
"Art. 27. Aplica-se subsidiariamente o disposto nas Leis n os 5.869, de 11 de janeiro de 1973 – Código de Processo Civil, 9.099, de 26 de setembro de 1995, e 10.259, de 12 de julho de 2001."

## Interpretação aplicada
- O JF/Fazenda exige pequeno valor: causas ACIMA do teto de pequeno valor mas DENTRO dos 60 SM são do foro comum (regra do art. 2º caput × art. 13 §§ 3º-5º — pagamento integral por precatório se acima do teto).`,
    metadados: { numero: 'Lei 12.153/2009', data_norma: '2009-12-22', artigos_principais: ['1', '2', '3', '13', '27'], vigente: true, confirmacao_texto: 'Extração literal do Planalto em 2026-08-30' },
    tags: ['processual-civil/juizados-especiais', 'consumidor/fazenda-publica'],
    fonte: L12153,
    urlFonte: URL_12153,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'lei-12153-turmas-uniformizacao-fazenda', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Uniformização e composição das TRs.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'lei-12153-turmas-uniformizacao-fazenda',
    titulo: 'Lei 12.153/2009 arts. 17-19 — Composição das Turmas Recursais (mandato 2 anos, sem recondução) e pedido de uniformização (textos literais confirmados)',
    tipoDocumento: 'LEGISLACAO',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'Turmas recursais da Fazenda',
    prioridade: 'P1',
    conteudo: `## Textos CONFIRMADOS LITERALMENTE no Planalto (consulta 2026-08-30)

"Art. 17. As Turmas Recursais do Sistema dos Juizados Especiais são compostas por juízes em exercício no primeiro grau de jurisdição, na forma da legislação dos Estados e do Distrito Federal, com mandato de 2 (dois) anos, e integradas, preferencialmente, por juízes do Sistema dos Juizados Especiais.
§ 1º A designação dos juízes das Turmas Recursais obedecerá aos critérios de antiguidade e merecimento.
§ 2º Não será permitida a recondução, salvo quando não houver outro juiz na sede da Turma Recursal.
Art. 18. Caberá pedido de uniformização de interpretação de lei quando houver divergência entre decisões proferidas por Turmas Recursais sobre questões de direito material.
§ 1º O pedido fundado em divergência entre Turmas do mesmo Estado será julgado em reunião conjunta das Turmas em conflito, sob a presidência de desembargador indicado pelo Tribunal de Justiça.
§ 3º Quando as Turmas de diferentes Estados derem a lei federal interpretações divergentes, ou quando a decisão proferida estiver em contrariedade com súmula do Superior Tribunal de Justiça, o pedido será por este julgado.
Art. 19. Quando a orientação acolhida pelas Turmas de Uniformização de que trata o § 1º do art. 18 contrariar súmula do Superior Tribunal de Justiça, a parte interessada poderá provocar a manifestação deste, que dirimirá a divergência."`,
    metadados: { numero: 'Lei 12.153/2009', artigos_principais: ['17', '18', '19'], vigente: true, confirmacao_texto: 'Extração literal do Planalto em 2026-08-30' },
    tags: ['processual-civil/juizados-especiais', 'processual-civil/recursos'],
    fonte: L12153,
    urlFonte: URL_12153,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'lei-10259-uniformizacao-pedilef-art-14', tipo: 'ANALOGIA', descricao: 'Modelo análogo de uniformização.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'lei-9099-jecrim-arts-60-61-72-76',
    titulo: 'Lei 9.099/1995 (JECrim) arts. 60, 61, 72, 74 e 76 — Infrações de menor potencial ofensivo, composição civil e transação penal (textos literais confirmados)',
    tipoDocumento: 'LEGISLACAO',
    area: 'penal',
    subarea: 'jecrim-menor-ofensividade',
    assunto: 'Juizado Especial Criminal',
    prioridade: 'P1',
    conteudo: `## Textos CONFIRMADOS LITERALMENTE no Planalto (consulta 2026-08-30)

### Arts. 60-61 — competência
"Art. 60. O Juizado Especial Criminal, provido por juízes togados ou togados e leigos, tem competência para a conciliação, o julgamento e a execução das infrações penais de menor potencial ofensivo, respeitadas as regras de conexão e continência.
Parágrafo único. Na reunião de processos, perante o juízo comum ou o tribunal do júri, decorrentes da aplicação das regras de conexão e continência, observar-se-ão os institutos da transação penal e da composição dos danos civis.
Art. 61. Consideram-se infrações penais de menor potencial ofensivo, para os efeitos desta Lei, as contravenções penais e os crimes a que a lei comine pena máxima não superior a 2 (dois) anos, cumulada ou não com multa."

### Art. 72 — audiência preliminar
"Art. 72. Na audiência preliminar, presente o representante do Ministério Público, o autor do fato e a vítima e, se possível, o responsável civil, acompanhados por seus advogados, o Juiz esclarecerá sobre a possibilidade da composição dos danos e da aceitação da proposta de aplicação imediata de pena não privativa de liberdade."

### Art. 74 — composição civil
"Art. 74. A composição dos danos civis será reduzida a escrito e, homologada pelo Juiz mediante sentença irrecorrível, terá eficácia de título a ser executado no juízo civil competente.
Parágrafo único. Tratando-se de ação penal de iniciativa privada ou de ação penal pública condicionada à representação, o acordo homologado acarreta a renúncia ao direito de queixa ou representação."

### Art. 76 — transação penal (síntese literal)
"Art. 76. Havendo representação ou tratando-se de crime de ação penal pública incondicionada, não sendo caso de arquivamento, o Ministério Público poderá propor a aplicação imediata de pena restritiva de direitos ou multas, a ser especificada na proposta.
§ 1º Nas hipóteses de ser a pena de multa a única aplicável, o Juiz poderá reduzi-la até a metade.
§ 2º Não se admitirá a proposta se ficar comprovado:
I - ter sido o autor da infração condenado, pela prática de crime, à pena privativa de liberdade, por sentença definitiva;
II - ter sido o agente beneficiado anteriormente, no prazo de cinco anos, pela aplicação de pena restritiva ou multa, nos termos deste artigo;
III - não indicarem os antecedentes, a conduta social e a personalidade do agente, bem como os motivos e as circunstâncias, ser necessária e suficiente a adoção da medida.
§ 4º Acolhendo a proposta do Ministério Público aceita pelo autor da infração, o Juiz aplicará a pena restritiva de direitos ou multa, que não importará em reincidência, sendo registrada apenas para impedir novamente o mesmo benefício no prazo de cinco anos.
§ 6º A imposição da sanção de que trata o § 4º deste artigo não constará de certidão de antecedentes criminais, salvo para os fins previstos no mesmo dispositivo, e não terá efeitos civis, cabendo aos interessados propor ação cabível no juízo cível."

## Nota de regime
- No JECrim FEDERAL, a Lei 10.259/2001 eleva o teto a "crimes com pena máxima não superior a dois anos ou multa" e disciplina turma recursal própria — regime complementar à Lei 9.099.`,
    metadados: { numero: 'Lei 9.099/1995', artigos_principais: ['60', '61', '72', '74', '76'], vigente: true, confirmacao_texto: 'Extração literal do Planalto em 2026-08-30; art. 61 na redação da Lei 11.313/2006' },
    tags: ['penal/jecrim-menor-ofensividade'],
    fonte: L9099,
    urlFonte: URL_9099,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'lei-9099-art-3-competencia-40sm-exclusoes', tipo: 'CONTEXTO_REGULACAO', descricao: 'Mesma lei — braço criminal.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'sumula-203-stj-sem-resp-contra-turma-recursal',
    titulo: 'Súmula 203/STJ — Não cabe recurso especial contra decisão proferida por órgão de segundo grau dos Juizados Especiais (texto literal confirmado)',
    tipoDocumento: 'JURISPRUDENCIA',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'Recorribilidade após turma recursal',
    prioridade: 'P1',
    conteudo: `## Enunciado CONFIRMADO LITERALMENTE no Arquivo Cidadão do STJ (consulta 2026-08-30)

"NÃO CABE RECURSO ESPECIAL CONTRA DECISÃO PROFERIDA POR ÓRGÃO DE SEGUNDO GRAU DOS JUIZADOS ESPECIAIS."

## Metadados oficiais (extraídos da página do Arquivo Cidadão STJ)
- Corte Especial, sessão extraordinária de 23/05/2002, julgando o AgRg no Ag 400.076-BA (número confirmado na página oficial).
- Redação ANTERIOR (decisão 04/02/1998, DJ 12/02/1998, p. 35): "NÃO CABE RECURSO ESPECIAL CONTRA DECISÃO PROFERIDA, NOS LIMITES DE SUA COMPETÊNCIA, POR ÓRGÃO DE SEGUNDO GRAU DOS JUIZADOS ESPECIAIS."
- Fonte: DJ 03/06/2002, p. 269.

## Consequência operacional
- Após o julgamento pela turma recursal, a via ordinária se esgota; caminhos remanescentes: RE ao STF (Súmula 640/STF — doc vinculado) e, nos JEF, pedido de uniformização (art. 14 Lei 10.259) que pode chegar ao STJ quando contrariar súmula/jurisprudência dominante.`,
    metadados: { numero: 'Súmula 203/STJ', tribunal: 'STJ — Corte Especial', julgado: '23/05/2002', fonte_dje: 'DJ 03/06/2002, p. 269', vigente: true, confirmacao_texto: 'Texto literal do Arquivo Cidadão STJ em 2026-08-30' },
    tags: ['processual-civil/juizados-especiais', 'processual-civil/recursos'],
    fonte: STJ_ARQ,
    urlFonte: 'https://arquivocidadao.stj.jus.br/index.php/sumula-203',
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'lei-9099-arts-41-43-recurso-inominado', tipo: 'INTERPRETA_DISPOSITIVO', descricao: 'Fecha o circuito recursal do JEC.' },
      { destinoSlug: 'sumula-640-stf-cabe-re-turma-recursal', tipo: 'PRECEDENTE_APLICAVEL', descricao: 'Exceção constitucional.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'sumula-376-stj-ms-contra-ato-turma-recursal',
    titulo: 'Súmula 376/STJ — Compete à turma recursal processar e julgar o mandado de segurança contra ato de juizado especial (texto literal confirmado)',
    tipoDocumento: 'JURISPRUDENCIA',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'Competência da turma recursal em MS',
    prioridade: 'P1',
    conteudo: `## Enunciado CONFIRMADO LITERALMENTE no Arquivo Cidadão do STJ (consulta 2026-08-30)

"Compete a turma recursal processar e julgar o mandado de segurança contra ato de juizado especial."

## Metadados oficiais (extraídos da página do Arquivo Cidadão STJ)
- Súmula 376, Corte Especial, julgada em 18/03/2009; fontes: DJE 30/03/2009; RSSTJ vol. 34 p. 11; RSTJ vol. 213 p. 554.
- Precedentes citados na página: CC 39.950/BA, CC 38.020/RJ, RMS 20.214/RJ, REsp 302.143/MG, RMS 20.233/RJ, CC 41.190/MG, RMS 17.254/BA, REsp 690.553/RS, RMS 18.949/GO, CC 40.199/MG, AgRg no RMS 17.283/RS (números conforme listagem oficial).

## Aplicação
- Atos do juizado de 1º grau (ex.: despacho que impede tramitação) são atacados via MS perante a TURMA RECURSAL — não no tribunal estadual.`,
    metadados: { numero: 'Súmula 376/STJ', tribunal: 'STJ — Corte Especial', julgado: '18/03/2009', fonte_dje: 'DJE 30/03/2009', vigente: true, confirmacao_texto: 'Texto literal do Arquivo Cidadão STJ em 2026-08-30' },
    tags: ['processual-civil/juizados-especiais', 'administrativo/mandado-seguranca'],
    fonte: STJ_ARQ,
    urlFonte: 'https://arquivocidadao.stj.jus.br/index.php/sumula-376-2',
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'sumula-25-tu-tjdft-ms-turma-recursal-competencia', tipo: 'PRECEDENTE_APLICAVEL', descricao: 'Detalhamento local no DF.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'sumula-640-stf-cabe-re-turma-recursal',
    titulo: 'Súmula 640/STF — É cabível recurso extraordinário contra decisão proferida por turma recursal de juizado especial cível e criminal, salvo ofensa direta à Constituição (confirmação parcial por página oficial)',
    tipoDocumento: 'JURISPRUDENCIA',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'RE contra decisão de turma recursal',
    prioridade: 'P1',
    conteudo: `## Enunciado (página oficial portal.stf.jus.br — consulta 2026-08-30)

"É cabível recurso extraordinário contra decisão proferida por juiz de primeiro grau nas causas de alçada, ou por turma recursal de juizado especial cível e criminal, salvo na hipótese de ofensa direta à Constituição."

## HONESTIDADE REGISTRADA (regra anti-invenção)
- A página oficial do portal STF existe e é indexada com este texto (o snippet do buscador sobre a URL oficial portal.stf.jus.br exibiu o enunciado), PORÉM a captura direta do conteúdo falhou por renderização dinâmica (JS) na consulta de 2026-08-30.
- O texto foi corroborado em múltiplas fontes secundárias coerentes. Por segurança, confiabilidade = B e recomenda-se re-verificação direta no portal STF antes de citar em peça.
- Exceção operacional: RE sobre fato OU direito INFRACONSTITUCIONAL é "ofensa indireta" — INADMISSÍVEL; o RE exige violação à Constituição (Ofensa direta) + pré-questionamento.`,
    metadados: { numero: 'Súmula 640/STF', tribunal: 'STF', vigente: true, pendencia: 'Captura direta do portal STF falhou (JS); confirmado via snippet da página oficial + corroboração', confirmacao_texto: 'Consulta 2026-08-30' },
    tags: ['processual-civil/juizados-especiais', 'processual-civil/recursos'],
    fonte: 'Supremo Tribunal Federal — portal oficial (Súmula 640)',
    urlFonte: 'https://portal.stf.jus.br/jurisprudencia/sumariosumulas.asp?base=30&sumula=2787',
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-09-30',
    relacionamentos: [
      { destinoSlug: 'sumula-203-stj-sem-resp-contra-turma-recursal', tipo: 'CONTEXTO_REGULACAO', descricao: 'RE excepcional x REsp proibido.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'sumula-7-tu-tjdft-agravo-recurso-inominado',
    titulo: 'Súmula 7/TU-JEC TJDFT — Cabe agravo de instrumento contra decisão que nega seguimento a recurso inominado e contra atos em execução não impugnáveis por outro recurso (texto literal confirmado)',
    tipoDocumento: 'JURISPRUDENCIA',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'Irrecorribilidade imediata — exceções locais',
    prioridade: 'P1',
    conteudo: `## Enunciado CONFIRMADO LITERALMENTE na página oficial do TJDFT (Turma de Uniformização dos Juizados Especiais, página modificada em 30/05/2025 — consulta 2026-08-30)

"Cabe agravo de instrumento contra decisão que nega seguimento a recurso inominado, contra atos praticados nas execuções e no cumprimento de sentença, não impugnáveis por outro recurso, desde que fundado na alegação da ocorrência de erro de procedimento ou contra ato apto a causar dano irreparável ou de difícil reparação."

## Metadados oficiais
- PUJ 2018.00.2.000587-3, Turma de Uniformização, publicado no DJe 4/9/2018, pág. 826 (número confirmado na página oficial).

## Aplicação operacional
- Regra base: interlocutórias NÃO são recorríveis de imediato (art. 41 Lei 9.099). Exceções locais (DF): (a) negativa de seguimento ao recurso inominado; (b) atos executivos sem outro recurso cabível; fundamento limitado a erro de procedimento ou dano irreparável/difícil reparação.`,
    metadados: { numero: 'Súmula 7/TU-JEC TJDFT', tribunal: 'TJDFT — Turma de Uniformização dos Juizados Especiais', julgado_fonte: 'PUJ 2018.00.2.000587-3, DJe 4/9/2018, p. 826', vigente: true, confirmacao_texto: 'Texto literal da página oficial TJDFT em 2026-08-30' },
    tags: ['processual-civil/juizados-especiais', 'processual-civil/recursos'],
    fonte: TJDFT_TU,
    urlFonte: URL_TJDFT_TU,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'lei-9099-arts-41-43-recurso-inominado', tipo: 'INTERPRETA_DISPOSITIVO', descricao: 'Exceções ao silêncio do art. 41.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'sumula-41-tu-tjdft-sem-honorarios-recursais-agravo',
    titulo: 'Súmula 41/TU-JEC TJDFT — Nos juizados especiais do DF não é cabível a fixação de honorários advocatícios recursais em agravo de instrumento (texto literal confirmado)',
    tipoDocumento: 'JURISPRUDENCIA',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'Honorários recursais no JEC/DF',
    prioridade: 'P1',
    conteudo: `## Enunciado CONFIRMADO LITERALMENTE na página oficial do TJDFT (Turma de Uniformização dos Juizados Especiais, página modificada em 30/05/2025 — consulta 2026-08-30)

"No âmbito dos juizados especiais do DF não é cabível a fixação de honorários advocatícios recursais em agravo de instrumento."

## Metadados oficiais
- PA 0701531-74.2023.8.07.9000, julgado em 07/06/2024, Relator Juiz Antonio Fernandes da Luz (dados confirmados na página oficial).

## Aplicação
- Interage com o art. 55 Lei 9.099 (honorários 10-20% em 2º grau) — no DF, o agravo de instrumento na fase executiva não gera honorários recursais; validação da aplicação a outras vias locais deve ser feita caso a caso.`,
    metadados: { numero: 'Súmula 41/TU-JEC TJDFT', tribunal: 'TJDFT — Turma de Uniformização dos Juizados Especiais', julgado_fonte: 'PA 0701531-74.2023.8.07.9000, julg. 07/06/2024', vigente: true, confirmacao_texto: 'Texto literal da página oficial TJDFT em 2026-08-30' },
    tags: ['processual-civil/juizados-especiais', 'trabalhista/gratuidade-custas'],
    fonte: TJDFT_TU,
    urlFonte: URL_TJDFT_TU,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'lei-9099-arts-52-55-execucao-custas', tipo: 'INTERPRETA_DISPOSITIVO', descricao: 'Delimita o art. 55 no DF.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'sumula-25-tu-tjdft-ms-turma-recursal-competencia',
    titulo: 'Súmula 25/TU-JEC TJDFT — Mandado de segurança contra ato de juiz de Turma Recursal é julgado pela própria Turma da qual o coator integra (texto literal confirmado)',
    tipoDocumento: 'JURISPRUDENCIA',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'MS contra ato de juiz de turma recursal (DF)',
    prioridade: 'P1',
    conteudo: `## Enunciado CONFIRMADO LITERALMENTE na página oficial do TJDFT (Turma de Uniformização dos Juizados Especiais, página modificada em 30/05/2025 — consulta 2026-08-30)

"A competência para o processamento e julgamento de Mandado de Segurança impetrado contra ato de juiz de Turma Recursal dos Juizados Especiais é da própria Turma da qual é integrante, restando a autoridade indicada como coatora impedida de participar do julgamento."

## Metadados oficiais
- Acórdão 1330268, Turma de Uniformização (dados confirmados na página oficial).

## Aplicação
- Corolário local da Súmula 376/STJ: a própria turma recursal julga o MS contra ato de seu integrante, com impedimento do coator.`,
    metadados: { numero: 'Súmula 25/TU-JEC TJDFT', tribunal: 'TJDFT — Turma de Uniformização dos Juizados Especiais', julgado_fonte: 'Acórdão 1330268', vigente: true, confirmacao_texto: 'Texto literal da página oficial TJDFT em 2026-08-30' },
    tags: ['processual-civil/juizados-especiais', 'administrativo/mandado-seguranca'],
    fonte: TJDFT_TU,
    urlFonte: URL_TJDFT_TU,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'sumula-376-stj-ms-contra-ato-turma-recursal', tipo: 'INTERPRETA_DISPOSITIVO', descricao: 'Implementação local da Súmula 376.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'tese-recurso-inominado-estrategia-10-dias',
    titulo: 'Tese — Recurso inominado: estratégia de interposição em 10 dias úteis com preparo imediato e impugnação a toda a parte dispositiva',
    tipoDocumento: 'TESE',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'Estratégia recursal',
    prioridade: 'P1',
    conteudo: `## Tese operacional (elaboração EJC — conteúdo estrutural próprio)

**Enunciado de trabalho:** o recurso inominado deve ser interposto em 10 DIAS ÚTEIS da ciência da sentença, com razões e pedido escritos completos, e o preparo deve ser providenciado IMEDIATAMENTE após a interposição (janela de 48 HORAS — independentemente de intimação — sob pena de deserção, salvo gratuidade).

**Elementos essenciais (todos literais da Lei 9.099):**
1. Cabimento: sentença (exceto homologatórias — art. 41 caput);
2. Prazo: 10 dias úteis (art. 42 + art. 12-A);
3. Forma: petição escrita com razões e pedido (art. 42 caput);
4. Preparo: 48 horas seguintes à interposição (art. 42 § 1º + art. 54 parágrafo único);
5. Advogado obrigatório (art. 41 § 2º);
6. Resposta do recorrido: 10 dias (art. 42 § 2º);
7. Efeito: devolutivo; suspensivo excepcional (art. 43).

**Riscos e contra-riscos:**
- Descumprir a janela de preparo de 48h = DESERÇÃO típica do rito;
- Interlocutórias não agraváveis de imediato: impugnar como prequestionamento no recurso contra a sentença;
- Honorários recursais de 10-20% (art. 55) são risco presumível do recorrente vencido (ressalvas locais).`,
    metadados: { fonte_do_fundamento: 'Lei 9.099/1995 arts. 41-43, 54, 55 e 12-A (textos literais no lote)', probabilidade_qualitativa: 'Alta quando observados todos os requisitos; média quando a questão é nova na turma', vigente: true },
    tags: ['processual-civil/juizados-especiais', 'processual-civil/recursos'],
    fonte: EJC,
    urlFonte: null,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'peca-recurso-inominado-modelo-jec', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Peça derivada da tese.' },
      { destinoSlug: 'prazo-recurso-inominado-jec-10-dias-uteis', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Prazo central.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'tese-ineficacia-sentenca-excedente-algada',
    titulo: 'Tese — Ineficácia (não nulidade) da parte da sentença que excede a alçada do JEC: parte excedente permanece úteis',
    tipoDocumento: 'TESE',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'Alçada e parte excedente',
    prioridade: 'P2',
    conteudo: `## Tese operacional (elaboração EJC — conteúdo estrutural próprio)

**Enunciado de trabalho:** a sentença do JEC condenatória em valor que excede a alçada é INEFICAZ apenas na parte excedente (art. 39, Lei 9.099) — distinto da renúncia do art. 3º § 3º, que só se aplica quando o AUTOR OPTA pelo rito conhecendo a obrigação maior (excetuada a conciliação).

**Estrutura argumentativa:**
1. Art. 39: "é ineficaz a sentença condenatória na parte que exceder a alçada" — texto literal;
2. Ineficácia ≠ nulidade: a parte excedente não é "nula", permanece válida como fato para eventual pretensão residual no juízo comum (sem duplicidade de causa de pedir sobre o mesmo crédito, respeitando litispendência);
3. Art. 3º § 3º: renúncia APENAS na opção consciente pelo procedimento;
4. Distinção aplicada em demandas onde o réu (ex.: réu em pedido contraposto ou execução) não escolheu o rito.

**Risco:** turmas recursais divergem sobre a amplitude da "renúncia" quando o autor ajuíza ciente do valor superior — mapear a orientação local antes de peticionar.`,
    metadados: { fonte_do_fundamento: 'Lei 9.099/1995 arts. 3º § 3º e 39 (textos literais no lote)', probabilidade_qualitativa: 'Média — depende da orientação local sobre renúncia', vigente: true },
    tags: ['processual-civil/juizados-especiais'],
    fonte: EJC,
    urlFonte: null,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'lei-9099-arts-37-40-sentenca-juiz-leigo', tipo: 'INTERPRETA_DISPOSITIVO', descricao: 'Base literal do art. 39.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'peca-recurso-inominado-modelo-jec',
    titulo: 'Peça-modelo — Recurso inominado (JEC) com variáveis e checklist de admissibilidade embutido',
    tipoDocumento: 'PECA',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'Recurso inominado',
    prioridade: 'P1',
    conteudo: `# RECURSO INOMINADO (modelo EJC — usar variáveis, NUNCA fatos reais inventados)

AO(A) TURMA RECURSAL DOS JUIZADOS ESPECIAIS CÍVEIS DO(A) {{TRIBUNAL_LOCAL}}

Autos do processo nº {{NUMERO_PROCESSO}}

{{NOME_RECORRENTE}}, já qualificado(a) nos autos, por seu advogado que esta subscreve ({{OAB}}, {{ADVOGADO}}), inconformado(a) com a r. sentença proferida em {{DATA_SENTENCA}}, vem, respeitosamente, com fundamento nos arts. 41 a 43 da Lei nº 9.099/1995, interpor

## RECURSO INOMINADO

pelas razões de fato e de direito adiante expostas, requerendo o recebimento, processamento e conhecimento do presente recurso.

## I — TEMPESTIVIDADE E PREPARO
- Ciência da sentença: {{DATA_CIENCIA}} (certidão/DJe {{REF}});
- Interposição dentro do prazo de 10 dias úteis (art. 42, c/c art. 12-A, Lei 9.099);
- Preparo: {{PAGO_NO_PRAZO | RESERVADO | GRATUIDADE_DECORRIDA}} — art. 42 § 1º e art. 54 ({{GUIA}}).

## II — SÍNTESE DA DECISÃO AGRAVADA
{{RESUMO_FIDELIGNO_DA_SENTENCA — sem adicionar fatos que não estejam nos autos}}

## III — RAZÕES DE REFORMA
### III.1 — Do mérito
{{FUNDAMENTOS — citar apenas dispositivos literais e provas dos autos}}
### III.2 — Das questões não apreciadas
{{PREQUESTIONAMENTO de interlocutórias não recorríveis de imediato (irrecorribilidade imediata do rito)}}
### III.3 — (Opcional) Do efeito suspensivo
Requer-se efeito suspensivo (art. 43) em razão de {{DANO_IRREPARAVEL ou DIFICIL_REPARACAO}}, conforme {{PROVA}}.

## IV — PEDIDO
a) O recebimento e o processamento do recurso, com resposta do recorrido no prazo legal (art. 42 § 2º);
b) {{SE CABÍVEL}} a concessão do efeito suspensivo;
c) A reforma integral (ou parcial) da r. sentença, para {{PEDIDO_ESPECIFICO}};
d) A condenação do(a) recorrido(a) nos encargos recursais (art. 55).

Nestes termos, pede deferimento.
{{LOCAL}}, {{DATA}}.
{{ADVOGADO}} — {{OAB}}

---
**CHECKLIST EJC embutido:** [ ] 10 dias úteis da ciência; [ ] razões E pedido escritos; [ ] advogado (art. 41 § 2º); [ ] preparo em 48h ou gratuidade; [ ] impugnação a TODA a parte dispositiva; [ ] prequestionamento de interlocutórias; [ ] sem inventar fato/testemunha/prova; [ ] sentença NÃO é homologatória de conciliação/laudo (art. 41 caput).`,
    metadados: { base_literal: 'Lei 9.099/1995 arts. 41-43, 54-55; contagem em dias úteis (art. 12-A)', dadosFicticios: false, instrucao: 'Preencher variáveis apenas com dados reais do processo', vigente: true },
    tags: ['processual-civil/juizados-especiais', 'processual-civil/recursos'],
    fonte: EJC,
    urlFonte: null,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'lei-9099-arts-41-43-recurso-inominado', tipo: 'FUNDAMENTA_EM', descricao: 'Base legal literal da peça.' },
      { destinoSlug: 'checklist-admissibilidade-recurso-inominado', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Verificação prévia.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'checklist-admissibilidade-recurso-inominado',
    titulo: 'Checklist — Admissibilidade do recurso inominado (JEC): 10 pontos de conferência antes da protocolização',
    tipoDocumento: 'CHECKLIST',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'Recurso inominado',
    prioridade: 'P1',
    conteudo: `# CHECKLIST EJC — Recurso inominado (Lei 9.099, arts. 41-43 + 12-A)

## Cabimento
- [ ] 1. A decisão recursável é SENTENÇA (art. 41 caput) e NÃO é homologatória de conciliação ou de laudo arbitral;
- [ ] 2. Interlocutórias não agraváveis de imediato foram impugnadas como prequestionamento no recurso (irrecorribilidade imediata do rito; exceções locais — ex.: Súmula 7 TU/TJDFT).

## Tempestividade e forma
- [ ] 3. Contagem em DIAS ÚTEIS (art. 12-A): 10 dias úteis da ciência da sentença;
- [ ] 4. Petição ESCRITA com razões e pedido (art. 42 caput);
- [ ] 5. Assinatura por advogado (art. 41 § 2º — obrigatório em grau recursal).

## Preparo
- [ ] 6. Preparo no prazo de 48 HORAS seguintes à interposição (art. 42 § 1º — independentemente de intimação) OU gratuidade deferida (art. 54 parágrafo único);
- [ ] 7. Guias/recibos anexados ou declaração de hipossuficiência formal.

## Conteúdo estratégico
- [ ] 8. Impugnação a TODA a parte dispositiva impugnável (evitar preclusão parcial);
- [ ] 9. Demonstração de interesse (in cenário do recurso: vencido parcialmente — art. 996 CPC supletivo quando aplicável);
- [ ] 10. Efeito suspensivo pedido COM prova de dano irreparável/difícil reparação (art. 43), se necessário.

## Pós-interposição
- [ ] Acompanhar resposta do recorrido (10 dias — art. 42 § 2º);
- [ ] Verificar honorários recursais de 10-20% (art. 55) como risco do vencido em 2º grau.`,
    metadados: { base_literal: 'Lei 9.099/1995 arts. 41-43, 54-55 e 12-A', vigente: true },
    tags: ['processual-civil/juizados-especiais', 'processual-civil/recursos'],
    fonte: EJC,
    urlFonte: null,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'peca-recurso-inominado-modelo-jec', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Uso conjunto com a peça.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'fluxo-jec-pedido-a-execucao',
    titulo: 'Fluxo — JEC do pedido à execução: conciliação → instrução → sentença → recurso inominado → execução (com prazos e riscos)',
    tipoDocumento: 'FLUXO',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'Procedimento integral',
    prioridade: 'P1',
    conteudo: `# FLUXO EJC — JEC (Lei 9.099/1995, textos literais no lote)

## ETAPA 1 — Pedido
- **Evento:** apresentação do pedido, escrito ou oral (art. 14).
- **Providência:** conferir alçada (40 SM — art. 3º), legitimados (art. 8º) e foro (art. 4º).
- **Documento:** pedido com nome/qualificação/endereço, fatos sucintos, objeto e valor.

## ETAPA 2 — Citação/conciliação (15 dias)
- **Evento:** designação da sessão de conciliação em 15 dias (art. 16); citação com AR (art. 18 — NÃO há citação por edital).
- **Prazo:** 15 dias (art. 16).
- **Risco:** revelia com presunção de veracidade (art. 20) — não absoluta.

## ETAPA 3 — Instrução e julgamento
- **Evento:** AIJ imediata ou em até 15 dias (art. 27); contestação oral/escrita (art. 30); pedido contraposto em vez de reconvenção (art. 31); até 3 testemunhas por parte, arroladas com intimação requerida 5 dias antes (art. 34); provas produzidas na audiência (art. 33).
- **Providência:** levar testemunhas OU requerer intimação com antecedência mínima de 5 dias.

## ETAPA 4 — Sentença
- **Evento:** sentença sem relatório e NECESSARIAMENTE LÍQUIDA (art. 38); sem custas/honorários em 1º grau (art. 55); ineficácia do excedente (art. 39).
- **Risco:** sentença ilíquida é vedada.

## ETAPA 5 — Recurso inominado (turma recursal)
- **Evento:** recurso em 10 dias úteis da ciência (art. 42 + 12-A); preparo em 48h; resposta em 10 dias; julgamento por 3 juízes togados (art. 41 § 1º); advogado obrigatório (art. 41 § 2º); efeito devolutivo (art. 43).
- **Prazo:** 10 dias úteis; preparo 48 horas; resposta 10 dias.
- **Documento:** peça EJC modelo + checklist de admissibilidade.
- **Risco:** deserção por preparo tardio; honorários recursais 10-20% (art. 55).

## ETAPA 6 — Vias finais
- **Evento:** após a turma recursal, NÃO cabe REsp (Súmula 203/STJ); cabe RE (Súmula 640/STF, com ofensa direta à CF); nos JEF, uniformização (art. 14 Lei 10.259).

## ETAPA 7 — Execução
- **Evento:** execução no próprio Juizado, dispensada nova citação (art. 52 IV); multa diária para obrigação de fazer/não fazer (art. 52 V); embargos do devedor restritos (art. 52 IX).
- **Risco:** embargos apenas nas 4 hipóteses legais.`,
    metadados: { base_literal: 'Lei 9.099/1995 + Súmulas 203/STJ e 640/STF (docs do lote)', vigente: true },
    tags: ['processual-civil/juizados-especiais'],
    fonte: EJC,
    urlFonte: null,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'lei-9099-arts-41-43-recurso-inominado', tipo: 'FUNDAMENTA_EM', descricao: 'Núcleo da etapa 5.' },
      { destinoSlug: 'prazo-recurso-inominado-jec-10-dias-uteis', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Prazo central do fluxo.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'prazo-recurso-inominado-jec-10-dias-uteis',
    titulo: 'Prazo — Recurso inominado do JEC: 10 dias úteis da ciência da sentença (art. 42 c/c art. 12-A)',
    tipoDocumento: 'PRAZO',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'Prazo recursal central',
    prioridade: 'P0',
    conteudo: `## Prazo: 10 DIAS ÚTEIS

- **Fundamento literal:** art. 42 Lei 9.099 ("O recurso será interposto no prazo de dez dias, contados da ciência da sentença") + art. 12-A ("Na contagem de prazo em dias... computar-se-ão somente os dias úteis", incluído pela Lei 13.728/2018).
- **Termo inicial:** CIÊNCIA da sentença (intimação na audiência, AR ou publicação eletrônica conforme o caso).
- **Atenção:** resposta do recorrido também é 10 dias (art. 42 § 2º); preparo é medida em HORAS (48h seguintes à interposição — art. 42 § 1º).
- **Cálculo:** usar a calculadora de prazos do EJC (dias úteis, sem feriados forenses locais).`,
    metadados: { quantidade: '10 dias úteis', termo_inicial: 'ciência da sentença', base_literal: 'Lei 9.099/1995 arts. 42 e 12-A', vigente: true },
    tags: ['processual-civil/juizados-especiais', 'geral/prazos'],
    fonte: L9099,
    urlFonte: URL_9099,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'lei-9099-arts-41-43-recurso-inominado', tipo: 'FUNDAMENTA_EM', descricao: 'Texto literal do prazo.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'prazo-jec-preparo-recurso-48-horas',
    titulo: 'Prazo — Preparo do recurso inominado: 48 horas seguintes à interposição, independentemente de intimação (art. 42 § 1º)',
    tipoDocumento: 'PRAZO',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'Preparo recursal',
    prioridade: 'P0',
    conteudo: `## Prazo: 48 HORAS

- **Fundamento literal:** art. 42 § 1º Lei 9.099 ("O preparo será feito, independentemente de intimação, nas quarenta e oito horas seguintes à interposição, sob pena de deserção").
- **Termo inicial:** INTERPOSIÇÃO do recurso (não a intimação).
- **Conteúdo do preparo:** TODAS as despesas, inclusive as dispensadas em 1º grau (art. 54 parágrafo único), ressalvada a assistência judiciária gratuita.
- **Risco típico:** deserção por perda da janela de 48h — operar com cobrança interna no mesmo dia da interposição.`,
    metadados: { quantidade: '48 horas', termo_inicial: 'interposição do recurso', base_literal: 'Lei 9.099/1995 arts. 42 § 1º e 54 parágrafo único', vigente: true },
    tags: ['processual-civil/juizados-especiais', 'geral/prazos'],
    fonte: L9099,
    urlFonte: URL_9099,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'prazo-recurso-inominado-jec-10-dias-uteis', tipo: 'CONEXO_TEMATICO', descricao: 'Cadeia interposição → preparo.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'prazo-jec-intimacao-testemunhas-5-dias',
    titulo: 'Prazo — Requerimento de intimação de testemunhas no JEC: mínimo 5 dias antes da audiência (art. 34 § 1º)',
    tipoDocumento: 'PRAZO',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'Prova testemunhal',
    prioridade: 'P1',
    conteudo: `## Prazo: 5 DIAS (antes da audiência)

- **Fundamento literal:** art. 34 § 1º Lei 9.099 ("O requerimento para intimação das testemunhas será apresentado à Secretaria no mínimo cinco dias antes da audiência de instrução e julgamento").
- **Alternativa:** levar as testemunhas por conta própria, independentemente de intimação (art. 34 caput).
- **Máximo:** 3 testemunhas por parte (art. 34 caput).`,
    metadados: { quantidade: '5 dias corridos antes da audiência', termo_inicial: 'antevisão da data da audiência', base_literal: 'Lei 9.099/1995 art. 34 § 1º', vigente: true },
    tags: ['processual-civil/juizados-especiais', 'geral/prazos'],
    fonte: L9099,
    urlFonte: URL_9099,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'lei-9099-arts-34-36-testemunhas-juiz-leigo', tipo: 'FUNDAMENTA_EM', descricao: 'Texto literal.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'triagem-jec-competencia-partes',
    titulo: 'Triagem — Script de perguntas para aferir cabimento no JEC (alçada, partes, exclusões e juízo competente)',
    tipoDocumento: 'TRIAGEM',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'Triagem inicial',
    prioridade: 'P1',
    conteudo: `# TRIAGEM EJC — O caso cabe no Juizado Especial?

## Bloco 1 — Valor da causa
1. Qual o valor total do pedido (inclusive vincendas)? (art. 3º I — limite 40 SM; Lei 10.259: 60 SM)
2. Há 12 ou mais parcelas vincendas? (soma de 12 parcelas não pode exceder o teto — art. 3º § 2º Lei 10.259 / art. 2º § 2º Lei 12.153)

## Bloco 2 — Partes
3. O autor é pessoa física capaz, MEI/MEE/EPP (LC 123), OSCIP ou sociedade de crédito ao microempreendedor? (art. 8º § 1º)
4. O réu é pessoa física ou firma individual? (art. 8º caput) — Se réu é PJ comum: POSSÍVEL como rés? (não — PJ comum pode ser ré sim, mas não autor; conferir)
5. O réu é ente público? Se federal → JEF (Lei 10.259); estadual/DF/municipal → JEC-Fazenda (Lei 12.153); se NÃO há juizado da Fazenda instalado → foro comum.

## Bloco 3 — Matéria excluída
6. A causa é alimentar, falimentar, fiscal, de acidente de trabalho, resíduos, estado/capacidade ou interesse da Fazenda? (art. 3º § 2º — se SIM, JEC estadual é incabível)

## Bloco 4 — Procedimento
7. Há necessidade de perícia técnica complexa? (JEC usa inquirição de técnicos — art. 35; prova complexa sugere rito comum)
8. Litigância em massa com pretensão coletiva homogênea? (excluída do JEC/JEF/JF — interesses difusos/coletivos)

## Saída esperada
- **JEC estadual:** valor ≤ 40 SM + partes OK + matéria não excluída.
- **JEF:** competência da Justiça Federal + valor ≤ 60 SM + partes OK.
- **JEC-Fazenda:** ente estadual/municipal + valor ≤ 60 SM + matéria não excluída do art. 2º § 1º.
- **Foro comum:** qualquer resposta negativa acima.`,
    metadados: { base_literal: 'Leis 9.099/1995, 10.259/2001 e 12.153/2009 (textos literais no lote)', vigente: true },
    tags: ['processual-civil/juizados-especiais', 'geral/triagem'],
    fonte: EJC,
    urlFonte: null,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'lei-9099-art-3-competencia-40sm-exclusoes', tipo: 'FUNDAMENTA_EM', descricao: 'Critérios literais.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'tabela-documentos-jec',
    titulo: 'Tabela — Documentos por fase do JEC: pedido, conciliação, instrução, recurso inominado e execução',
    tipoDocumento: 'TABELA_DOCUMENTOS',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'Documentos necessários',
    prioridade: 'P1',
    conteudo: `# TABELA EJC — Documentos por fase do JEC

| Fase | Documentos essenciais | Observação literal |
|---|---|---|
| Pedido | identificação das partes; fatos e fundamentos sucintos; objeto e valor (art. 14 § 1º) | pedido genérico permitido quando não é possível determinar a extensão (art. 14 § 2º) |
| Conciliação | procuração (ou comparecimento pessoal — art. 9º); proposta de acordo | conciliação homologada = título executivo (art. 22 § 1º) |
| Instrução | documentos do autor/réu; arrolamento de até 3 testemunhas (art. 34); parecer técnico facultativo (art. 35) | provas produzidas na audiência (art. 33) |
| Recurso inominado | sentença + certidão de intimação (comprovante de tempestividade); guias de preparo (art. 54 p.ú.); procuração (art. 41 § 2º) | razões e pedido por escrito (art. 42) |
| Execução | sentença transitada em julgado; cálculo líquido (art. 38 p.ú.); requerimento verbal ou escrito (art. 52 IV) | embargos do devedor apenas nas hipóteses do art. 52 IX |

## Regras de uso
- Documentos colhidos antes do pedido evitam conversão do rito; a prova documental Nova NÃO requerida previamente pode ser juntada na audiência (art. 33), sujeita à limitação judicial.`,
    metadados: { base_literal: 'Lei 9.099/1995 arts. 14, 22, 33-35, 38, 41-42, 52-54', vigente: true },
    tags: ['processual-civil/juizados-especiais'],
    fonte: EJC,
    urlFonte: null,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'fluxo-jec-pedido-a-execucao', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Uso fase a fase.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'argumentacao-revelia-jec-bilateral',
    titulo: 'Argumentação — Revelia no JEC: presunção de veracidade x limites (bilateral)',
    tipoDocumento: 'ARGUMENTACAO',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'Controvérsia da revelia',
    prioridade: 'P1',
    conteudo: `# ARGUMENTAÇÃO EJC — Revelia no JEC (art. 20 Lei 9.099)

## Lado A — "Revelia confirma tudo"
1. Texto literal: "reputar-se-ão verdadeiros os fatos alegados no pedido inicial" (art. 20);
2. Citação contém advertência expressa (art. 18 § 1º) — o réu citado sabia da consequência;
3. Economia processual (art. 2º): inércia voluntária não pode premiar o inerte.

## Lado B — "Presunção não é absoluto"
1. A própria norma admite exceção "salvo se o contrário resultar da convicção do Juiz" (art. 20);
2. Citação inválida/sem AR em mão própria nulifica a presunção (art. 18 caput e § 3º — comparecimento espontâneo supre);
3. Em demandas consumidoras, fatos dependentes de prova técnica (defeito, nexo) não se presumem pela simples ausência do réu — a doutrina exige prova mínima do fato constitutivo.

## Síntese operacional
- Para o autor: documentar a citação válida e sustentar a presunção;
- Para o réu: alegar imediatamente citação defeituosa ou, na ausência, provar contrário documental que suspenda a convicção do juiz;
- Não confiar no efeito automático: fundamentar sempre a prova do fato constitutivo.`,
    metadados: { base_literal: 'Lei 9.099/1995 arts. 18 e 20', vigente: true },
    tags: ['processual-civil/juizados-especiais', 'processual-civil/contestacao'],
    fonte: EJC,
    urlFonte: null,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'lei-9099-arts-17-23-conciliacao-citacao-revelia', tipo: 'FUNDAMENTA_EM', descricao: 'Textos literais arts. 18 e 20.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'doutrina-principios-irrecorribilidade-jec',
    titulo: 'Doutrina — Princípios do JEC e a irrecorribilidade imediata das interlocutórias (conceitos operacionais)',
    tipoDocumento: 'DOUTRINA',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'Conceitos de regime',
    prioridade: 'P1',
    conteudo: `# DOUTRINA EJC — Conceitos operacionais do rito dos Juizados (elaboração própria com base literal)

## 1. Oralidade e concentração
Princípio da imediação: o juiz decide com o que vê e ouve na audiência (arts. 28, 33, 36). A prova oral não é reduzida a termo — a sentença reporta "no essencial" (art. 36).

## 2. Irrecorribilidade imediata
O art. 41 só admite recurso contra SENTENÇA. Interlocutórias (ex.: indeferimento de produção antecipada de prova) são impugnadas no recurso inominado como prequestionamento. Exceções LEGAIS e SÚMULAS locais (ex.: Súmula 7 TU/TJDFT — negativa de seguimento e atos executivos).

## 3. Turma recursal (TVR)
Órgão de 2º grau do sistema: 3 juízes togados de 1º grau (art. 41 § 1º; Lei 12.153 art. 17 — mandato de 2 anos, sem recondução normal). NÃO é "tribunal" para fins de REsp (Súmula 203/STJ).

## 4. Alçada e renúncia
40 SM (estadual) / 60 SM (JEF e Fazenda). Opção consciente = renúncia ao excedente (art. 3º § 3º); sentença que excede = INEFICÁCIA apenas na parte excedente (art. 39).

## 5. Dias úteis
Desde a Lei 13.728/2018 (art. 12-A), TODOS os prazos em dias do sistema contam em dias úteis — inclusive os 10 dias do recurso e os 15 dias da conciliação designada.`,
    metadados: { base_literal: 'Lei 9.099/1995 arts. 2º, 12-A, 28-41; Lei 12.153 art. 17; Súmula 203/STJ', vigente: true },
    tags: ['processual-civil/juizados-especiais'],
    fonte: EJC,
    urlFonte: null,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'doutrina-principios-recursais-cpc', tipo: 'CONEXO_TEMATICO', descricao: 'Recursos no CPC x rito especial.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'doutrina-turma-recursal-uniformizacao',
    titulo: 'Doutrina — Turma recursal, uniformização de jurisprudência e as vias aos tribunais superiores (conceitos operacionais)',
    tipoDocumento: 'DOUTRINA',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'Recursabilidade após a TVR',
    prioridade: 'P1',
    conteudo: `# DOUTRINA EJC — Depois da turma recursal (elaboração própria com base literal)

## JEC estadual (Lei 9.099)
- Decisão da turma recursal NÃO admite REsp (Súmula 203/STJ, texto literal no lote).
- RE ao STF é POSSÍVEL (Súmula 640/STF) — exige violação DIRETA à Constituição; questões de direito infraconstitucional (ex.: interpretação do CDC) não chegam ao STF ("ofensa reflexa").

## JEF (Lei 10.259)
- Art. 14: pedido de UNIFORMIZAÇÃO DE INTERPRETAÇÃO (PUI):
  - divergência entre TRs da mesma região → reunião conjunta;
  - divergência entre regiões ou contrariedade a súmula/jurisprudência dominante do STJ → Turma de Uniformização;
  - orientação da TU contrária ao STJ → provocação ao STJ (§ 4º); pedidos idênticos ficam retidos (§ 6º).

## JEC-Fazenda (Lei 12.153)
- arts. 18-19: modelo análogo; contrariedade a súmula do STJ → pedido julgado pelo próprio STJ (art. 18 § 3º; art. 19).

## Mapeamento rápido
| Situação | Via |
|---|---|
| Sentença do JEC | recurso inominado (10 dias úteis) |
| Acórdão da TR com violação direta à CF | RE (Súmula 640/STF) |
| Acórdão da TR do JEC com violação do CDC | sem via ordinária — PUI inexistente no estadual |
| Acórdão da TR do JEF com divergência | PUI (art. 14) → TU → STJ (se contrário a súmula) |`,
    metadados: { base_literal: 'Súmula 203/STJ; Súmula 640/STF; Lei 10.259 art. 14; Lei 12.153 arts. 18-19 (todos literais no lote)', vigente: true },
    tags: ['processual-civil/juizados-especiais', 'processual-civil/recursos'],
    fonte: EJC,
    urlFonte: null,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'sumula-203-stj-sem-resp-contra-turma-recursal', tipo: 'FUNDAMENTA_EM', descricao: 'Base da vedação.' },
      { destinoSlug: 'lei-10259-uniformizacao-pedilef-art-14', tipo: 'FUNDAMENTA_EM', descricao: 'PUI literal.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'regra-se-jec-competencia-por-valor',
    titulo: 'Regra SE-ENTÃO — Direcionamento de foro por valor e natureza da parte (JEC/JEF/JF/foro comum)',
    tipoDocumento: 'REGRA_INTELIGENCIA',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'Roteiro automático de competência',
    prioridade: 'P1',
    conteudo: `# REGRAS SE-ENTÃO — Competência dos juizados (elaboração EJC)

## SE réu é União/autarquia/fundação/empresa pública federal ENTÃO
- SE valor ≤ 60 SM E matéria não excluída (art. 3º § 1º Lei 10.259) ENTÃO JEC Federal.
- SENÃO ENTÃO foro comum federal.

## SE réu é Estado/DF/Município/autarquia estadual-municipal ENTÃO
- SE instalado JEC-Fazenda no foro E valor ≤ 60 SM E matéria não excluída (art. 2º § 1º Lei 12.153) ENTÃO JEC-Fazenda.
- SENÃO ENTÃO foro comum (não se aplica Lei 9.099 — art. 3º § 2º).

## SE réu é pessoa física ou PJ comum ENTÃO
- SE valor ≤ 40 SM E matéria não excluída (art. 3º § 2º) ENTÃO JEC estadual (alçada; renúncia ao excedente na opção — § 3º).
- SENÃO ENTÃO foro comum.

## SE autor é PJ ENTÃO
- SE MEI/MEE/EPP (LC 123), OSCIP ou sociedade de crédito ao microempreendedor ENTÃO AUTOR admissível (art. 8º § 1º).
- SENÃO ENTÃO JEC incabível como autor.

## SE demanda é de interesse difuso/coletivo ENTÃO
- ENTÃO JEC/JEF/JF incabíveis (exclusões legais) — foro comum/Ministério Público.`,
    metadados: { base_literal: 'Leis 9.099/1995 art. 3º, 10.259/2001 art. 3º, 12.153/2009 art. 2º (literais no lote)', interpretabilidade: 'Regras SE-ENTÃO rastreáveis aos dispositivos', vigente: true },
    tags: ['processual-civil/juizados-especiais'],
    fonte: EJC,
    urlFonte: null,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'lei-9099-art-3-competencia-40sm-exclusoes', tipo: 'FUNDAMENTA_EM', descricao: 'Fonte literal das regras.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'regra-se-recurso-inominado-admissibilidade',
    titulo: 'Regra SE-ENTÃO — Admissibilidade do recurso inominado (tempestividade → forma → preparo → representação)',
    tipoDocumento: 'REGRA_INTELIGENCIA',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'Checagem automática recursal',
    prioridade: 'P1',
    conteudo: `# REGRAS SE-ENTÃO — Recurso inominado (elaboração EJC)

## SE decisão é interlocutória E não há previsão de exceção local ENTÃO
- ENTÃO irrecorrível de imediato — impugnar no recurso contra a sentença (art. 41; Súmula 7 TU/TJDFT como exceção).

## SE sentença é homologatória de conciliação OU de laudo arbitral ENTÃO
- ENTÃO recurso inominado INCABÍVEL (art. 41 caput — texto literal).

## SE ciência da sentença + 10 dias úteis já decorreram ENTÃO
- ENTÃO intempestivo — notificar responsável e documentar ciência (art. 42 + art. 12-A).

## SE interposto e NÃO pago o preparo em 48 horas seguintes ENTÃO
- ENTÃO alerta de DESERÇÃO (art. 42 § 1º) — providenciar guia imediatamente; verificar gratuidade deferida.

## SE recorrente sem advogado constituído ENTÃO
- ENTÃO recurso não processado (art. 41 § 2º — representação obrigatória em grau recursal).

## SE há interesse de reformar apenas parte da sentença ENTÃO
- ENTÃO delimitar pedido e impugnar a parte dispositiva correspondente (evitar preclusão parcial).`,
    metadados: { base_literal: 'Lei 9.099/1995 arts. 41-43 e 12-A; Súmula 7 TU/TJDFT (literais no lote)', vigente: true },
    tags: ['processual-civil/juizados-especiais', 'processual-civil/recursos'],
    fonte: EJC,
    urlFonte: null,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'checklist-admissibilidade-recurso-inominado', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Versão humana da checagem.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'jurimetria-jec-recursos-esquema',
    titulo: 'Jurimetria — Estrutura de coleta para recursos inominados (taxa de admissibilidade, reversão e honorários) — esquema vazio, NUNCA números inventados',
    tipoDocumento: 'JURIMETRIA',
    area: 'processual-civil',
    subarea: 'juizados-especiais',
    assunto: 'Coleta de métricas recursais',
    prioridade: 'P2',
    conteudo: `# JURIMETRIA EJC — Recursos inominados (ESQUEMA PARA PREENCHER COM DADOS REAIS)

## ⚠️ Regra da casa (item 24 da missão): números JAMAIS inventados. Preencher apenas com decisões reais coletadas com URL e data.

## Campos por caso
- processo nº (anonimizado);
- turma recursal/tribunal;
- matéria (consumidor, banco, locação...);
- valor da causa;
- resultado em 1º grau (procedente/parcial/improcedente);
- recurso interposto (sim/não) + data;
- admissibilidade (conhecido/não conhecido — motivo: tempestividade, preparo, forma);
- resultado do recurso (provido/desprovido/parcialmente provido);
- honorários recursais fixados (%) — art. 55;
- efeito suspensivo concedido (sim/não);
- URL da decisão e data de consulta.

## Indicadores a calcular (quando houver amostra)
1. taxa de admissibilidade por motivo de deserção (preparo 48h);
2. taxa de provimento por matéria;
3. distribuição de honorários recursais;
4. tempo médio de julgamento.`,
    metadados: { esquema_vazio: true, dadosFicticios: true, instrucao: 'Preencher somente com dados reais verificados', status: 'DEMONSTRACAO' },
    tags: ['processual-civil/juizados-especiais'],
    fonte: EJC,
    urlFonte: null,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'DEMONSTRACAO',
    dadosFicticios: true,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: null,
    relacionamentos: [],
  } satisfies InputDocument,
];

export const FONTES_LOTE12 = [
  'https://www.planalto.gov.br/ccivil_03/leis/l9099.htm (Lei 9.099/1995 — textos literais arts. 1º-3º, 8º-10, 12-A, 14-16, 17-23, 27-40, 41-43, 52-55, 60-61, 72-76 — consulta 2026-08-30)',
  'https://www.planalto.gov.br/ccivil_03/leis/leis_2001/l10259.htm (Lei 10.259/2001 — textos literais arts. 3º, 5º, 6º, 9º, 10, 13, 14 — consulta 2026-08-30)',
  'https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2009/lei/l12153.htm (Lei 12.153/2009 — textos literais arts. 1º-3º, 13, 17-19, 27 — consulta 2026-08-30)',
  'https://arquivocidadao.stj.jus.br/index.php/sumula-203 (Súmula 203/STJ — enunciado LITERAL, Corte Especial 23/05/2002, DJ 03/06/2002 — consulta 2026-08-30)',
  'https://arquivocidadao.stj.jus.br/index.php/sumula-376-2 (Súmula 376/STJ — enunciado LITERAL, Corte Especial 18/03/2009, DJE 30/03/2009 — consulta 2026-08-30)',
  'https://portal.stf.jus.br/jurisprudencia/sumariosumulas.asp?base=30&sumula=2787 (Súmula 640/STF — página oficial; captura direta falhou por JS, texto confirmado por snippet da página oficial + corroboração — registro B honesto)',
  'https://www.tjdft.jus.br/consultas/jurisprudencia/sumulas/sumulas-do-juizado-especial (TJDFT — Súmulas 7, 25 e 41 da Turma de Uniformização dos Juizados Especiais, textos LITERAIS, página modificada em 30/05/2025 — consulta 2026-08-30)',
];
