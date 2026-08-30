// LOTE-011 — Agravo de instrumento (CPC arts. 1.015-1.019) (P1)
// Textos LITERAIS extraídos do Planalto (CPC — Lei 13.105/2015, consulta 2026-08-30).
// Teses dos Temas 988 e 1022 do STJ confirmadas LITERALMENTE em página oficial do TJDFT "Precedentes Qualificados"
// (última modificação 04/05/2026) + Acórdão TJDFT 2045271 com trecho de ementa literal.
// ANTI-INVENÇÃO registrada nesta fase:
//  - A memória sugeria "§ 1º e § 2º do art. 1.015 CPC (Lei 14.195/2021)" — VERIFICADO no Planalto: a Lei 14.195/2021
//    altera o art. 1.015 do CÓDIGO CIVIL (defesa da posse), NÃO do CPC. O art. 1.015 CPC vigente = caput + incisos I-XIII
//    + parágrafo único (red. Lei 13.256/2016), SEM §§.
//  - O julgamento de "taxatividade mitigada" é do STJ (Corte Especial, Tema 988) — não do STF.
//  - Nenhum número de REsp do Tema 988 foi citado (não confirmado em fonte oficial na consulta).
import type { InputDocument } from '../../src/lib/ejc/types';

const D = '2026-08-30';
const PLANALTO = 'Presidência da República — Planalto (CPC, Lei 13.105/2015)';
const URL_CPC = 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105.htm';
const TJDFT_URL = 'https://www.tjdft.jus.br/consultas/jurisprudencia/jurisprudencia-em-temas/novo-codigo-de-processo-civil/decisoes-agravaveis-2013-questao-do-rol-taxativo';
const TJDFT_FONTE = 'TJDFT — Precedentes Qualificados (página oficial, pesquisa atualizada em 4/5/2026)';
const EJC = 'Elaboração EJC — conteúdo estrutural original';

export default [
  {
    slug: 'cpc-art-1015-cabimento-agravo-texto-atual',
    titulo: 'CPC art. 1.015 — Agravo de instrumento: rol de cabimento (incisos I-XIII) e decisões na liquidação/cumprimento/execução/inventário (texto literal confirmado)',
    tipoDocumento: 'LEGISLACAO',
    area: 'processual-civil',
    subarea: 'recursos',
    assunto: 'Cabimento do agravo de instrumento',
    prioridade: 'P1',
    lote: 'LOTE-011',
    conteudo: `## Texto CONFIRMADO LITERALMENTE no Planalto (consulta 2026-08-30) — texto vigente

"Art. 1.015. Cabe agravo de instrumento contra as decisões interlocutórias que versarem sobre:
I - tutelas provisórias;
II - mérito do processo;
III - rejeição da alegação de convenção de arbitragem;
IV - incidente de desconsideração da personalidade jurídica;
V - rejeição do pedido de gratuidade da justiça ou acolhimento do pedido de sua revogação;
VI - exibição ou posse de documento ou coisa;
VII - exclusão de litisconsorte;
VIII - rejeição do pedido de limitação do litisconsórcio;
IX - admissão ou inadmissão de intervenção de terceiros;
X - concessão, modificação ou revogação do efeito suspensivo aos embargos à execução;
XI - redistribuição do ônus da prova nos termos do art. 373, § 1º;
XII - (VETADO);
XIII - outros casos expressamente referidos em lei.
Parágrafo único. Também caberá agravo de instrumento contra decisões interlocutórias proferidas na fase de liquidação de sentença ou de cumprimento de sentença, no processo de execução e no processo de inventário."

## ALERTA ANTI-INVENÇÃO (registrado)
- O texto vigente do art. 1.015 CPC **não tem §§** — a memória de "§§ 1º e 2º incluídos pela Lei 14.195/2021" refere-se ao **Código Civil** art. 1.015 (verificado no Planalto: a Lei 14.195/2021 altera a defesa da posse no CC, não o CPC).
- Tema 988 do STJ (taxatividade mitigada — doc vinculado) delimita quando decisões FORA do rol são agraváveis.

## Hipóteses de aplicação no EJC
- Teste rápido de agravabilidade: localizar o inciso aplicável ou enquadrar no parágrafo único (fases de liquidação/cumprimento/execução/inventário);
- Inciso XIII: remissão a leis especiais (ex.: recuperação judicial/falência — Tema 1022, doc vinculado).`,
    metadados: { numero: 'Lei 13.105/2015 (CPC)', data_norma: '2015-03-16', orgao: 'Congresso Nacional', artigos_principais: ['1.015'], vigente: true, confirmacao_texto: 'Extração literal do texto oficial do Planalto em 2026-08-30' },
    tags: ['processual-civil/recursos', 'geral/prazos'],
    fonte: PLANALTO,
    urlFonte: URL_CPC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'tema-988-stj-taxatividade-mitigada-rol-1015', tipo: 'INTERPRETA_DISPOSITIVO', descricao: 'Delimitação da agravabilidade fora do rol.' },
      { destinoSlug: 'tema-1022-stj-agravo-recuperacao-falencia', tipo: 'PRECEDENTE_APLICAVEL', descricao: 'Aplicação do inciso XIII + parágrafo único à RJ/falência.' },
      { destinoSlug: 'checklist-admissibilidade-agravo-instrumento', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Teste de cabimento operacional.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'cpc-arts-1016-1017-requisitos-instrucao-agravo',
    titulo: 'CPC arts. 1.016 e 1.017 — Requisitos da petição e instrução do agravo de instrumento (textos literais confirmados)',
    tipoDocumento: 'LEGISLACAO',
    area: 'processual-civil',
    subarea: 'recursos',
    assunto: 'Forma e preparo do agravo',
    prioridade: 'P1',
    lote: 'LOTE-011',
    conteudo: `## Textos CONFIRMADOS LITERALMENTE no Planalto (consulta 2026-08-30)

### Art. 1.016 — requisitos
"Art. 1.016. O agravo de instrumento será dirigido diretamente ao tribunal competente, por meio de petição com os seguintes requisitos:
I - os nomes das partes;
II - a exposição do fato e do direito;
III - as razões do pedido de reforma ou de invalidação da decisão e o próprio pedido;
IV - o nome e o endereço completo dos advogados constantes do processo."

### Art. 1.017 — instrução
"Art. 1.017. A petição de agravo de instrumento será instruída:
I - obrigatoriamente, com cópias da petição inicial, da contestação, da petição que ensejou a decisão agravada, da própria decisão agravada, da certidão da respectiva intimação ou outro documento oficial que comprove a tempestividade e das procurações outorgadas aos advogados do agravante e do agravado;
II - com declaração de inexistência de qualquer dos documentos referidos no inciso I, feita pelo advogado do agravante, sob pena de sua responsabilidade pessoal;
III - facultativamente, com outras peças que o agravante reputar úteis.
§ 1º Acompanhará a petição o comprovante do pagamento das respectivas custas e do porte de retorno, quando devidos, conforme tabela publicada pelos tribunais.
§ 2º No prazo do recurso, o agravo será interposto por: I - protocolo realizado diretamente no tribunal competente para julgá-lo; II - protocolo realizado na própria comarca, seção ou subseção judiciárias; III - postagem, sob registro, com aviso de recebimento; IV - transmissão de dados tipo fac-símile, nos termos da lei; V - outra forma prevista em lei.
§ 3º Na falta da cópia de qualquer peça ou no caso de algum outro vício que comprometa a admissibilidade do agravo de instrumento, deve o relator aplicar o disposto no art. 932, parágrafo único.
§ 4º Se o recurso for interposto por sistema de transmissão de dados tipo fac-símile ou similar, as peças devem ser juntadas no momento de protocolo da petição original.
§ 5º Sendo eletrônicos os autos do processo, dispensam-se as peças referidas nos incisos I e II do caput, facultando-se ao agravante anexar outros documentos que entender úteis para a compreensão da controvérsia."

## Interpretação aplicada
- Em autos eletrônicos (§ 5º), dispensam-se as cópias obrigatórias — a irregularidade clássica de não-juntada da decisão agravada perde força nesse contexto; em autos físicos/fase híbrida, o § 3º leva à inadmissibilidade (art. 932, parágrafo único).
- Local de interposição (§ 2º): tribunal OU comarca — o prazo é o mesmo (15 dias úteis, art. 1.003 § 5º — doc CPC recursos LOTE-007).`,
    metadados: { numero: 'Lei 13.105/2015 (CPC)', artigos_principais: ['1.016', '1.017'], vigente: true, confirmacao_texto: 'Extração literal do Planalto em 2026-08-30' },
    tags: ['processual-civil/recursos'],
    fonte: PLANALTO,
    urlFonte: URL_CPC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'cpc-art-1015-cabimento-agravo-texto-atual', tipo: 'REFERENCIA_LEGISLACAO', descricao: 'Cabimento → forma.' },
      { destinoSlug: 'tabela-pecas-agravo-instrumento', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Peças aplicadas em cada hipótese.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'cpc-arts-1018-1019-juntada-origem-relator',
    titulo: 'CPC arts. 1.018 e 1.019 — Juntada na origem, juízo de retratação e poderes do relator (efeito suspensivo e tutela recursal) (textos literais confirmados)',
    tipoDocumento: 'LEGISLACAO',
    area: 'processual-civil',
    subarea: 'recursos',
    assunto: 'Tramitação e poderes do relator',
    prioridade: 'P1',
    lote: 'LOTE-011',
    conteudo: `## Textos CONFIRMADOS LITERALMENTE no Planalto (consulta 2026-08-30)

### Art. 1.018
"Art. 1.018. O agravante poderá requerer a juntada, aos autos do processo, de cópia da petição do agravo de instrumento, do comprovante de sua interposição e da relação dos documentos que instruíram o recurso.
§ 1º Se o juiz comunicar que reformou inteiramente a decisão, o relator considerará prejudicado o agravo de instrumento.
§ 2º Não sendo eletrônicos os autos, o agravante tomará a providência prevista no caput, no prazo de 3 (três) dias a contar da interposição do agravo de instrumento.
§ 3º O descumprimento da exigência de que trata o § 2º, desde que arguido e provado pelo agravado, importa inadmissibilidade do agravo de instrumento."

### Art. 1.019
"Art. 1.019. Recebido o agravo de instrumento no tribunal e distribuído imediatamente, se não for o caso de aplicação do art. 932, incisos III e IV, o relator, no prazo de 5 (cinco) dias:
I - poderá atribuir efeito suspensivo ao recurso ou deferir, em antecipação de tutela, total ou parcialmente, a pretensão recursal, comunicando ao juiz sua decisão;
II - ordenará a intimação do agravado pessoalmente, por carta com aviso de recebimento, quando não tiver procurador constituído, ou pelo Diário da Justiça ou por carta com aviso de recebimento dirigida ao seu advogado, para que responda no prazo de 15 (quinze) dias, facultando-lhe juntar a documentação que entender necessária ao julgamento do recurso;
III - determinará a intimação do Ministério Público, preferencialmente por meio eletrônico, quando for o caso de sua intervenção, para que se manifeste no prazo de 15 (quinze) dias."

## Interpretação aplicada
- Em autos eletrônicos a juntada na origem é FACULTATIVA (caput "poderá"); em autos físicos é obrigatória em 3 dias (§ 2º) sob pena de inadmissibilidade provada pelo agravado (§ 3º).
- Relator: 5 dias para efeito suspensivo/antecipação da tutela recursal (inciso I) — via rápida para restaurar a situação antes do julgamento do mérito recursal.`,
    metadados: { numero: 'Lei 13.105/2015 (CPC)', artigos_principais: ['1.018', '1.019'], vigente: true, confirmacao_texto: 'Extração literal do Planalto em 2026-08-30' },
    tags: ['processual-civil/recursos', 'processual-civil/tutela-urgencia'],
    fonte: PLANALTO,
    urlFonte: URL_CPC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'prazo-juntada-copia-origem-3-dias', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Prazo operacional do § 2º.' },
      { destinoSlug: 'fluxo-agravo-instrumento', tipo: 'ETAPA_PROCESSO', descricao: 'Etapas finais do fluxo.' },
    ],
  } satisfies InputDocument,

  {
    slug: 'tema-988-stj-taxatividade-mitigada-rol-1015',
    titulo: 'Tema 988/STJ — Rol do art. 1.015 CPC é de taxatividade mitigada: agravo cabível quando houver urgência de inutilidade no juízo de apelação (tese literal confirmada)',
    tipoDocumento: 'JURISPRUDENCIA',
    area: 'processual-civil',
    subarea: 'recursos',
    assunto: 'Taxatividade mitigada do art. 1.015',
    prioridade: 'P1',
    lote: 'LOTE-011',
    conteudo: `## Tese firmada (texto LITERAL confirmado em página oficial do TJDFT — "Precedentes Qualificados", pesquisa atualizada em 4/5/2026, consulta 2026-08-30)

"Tema 988 do STJ - 'O rol do art. 1.015 do CPC é de taxatividade mitigada, por isso admite a interposição de agravo de instrumento quando verificada a urgência decorrente da inutilidade do julgamento da questão no recurso de apelação.'"

## Ementa de aplicação do TJDFT (trecho LITERAL — Acórdão 2045271)
"3. O art. 1.015 do CPC disciplina as hipóteses de cabimento do agravo de instrumento, não permitindo, em regra, interpretação extensiva. Conforme a tese jurídica firmada no Superior Tribunal de Justiça no Tema nº 988 dos recursos repetitivos, a taxatividade do rol previsto no diploma processual somente deve ser mitigada quando verificada a urgência decorrente da inutilidade do julgamento da questão no recurso de apelação, o que não se vislumbre na espécie."

## Interpretação aplicada (requisitos da exceção)
1. Decisão interlocutória FORA do rol do art. 1.015;
2. URGÊNCIA concreta: risco de INUTILIDADE do exame na apelação futura (fato consumado, perda da finalidade);
3. Ônus do agravante de demonstrar os dois elementos.

## ALERTA ANTI-INVENÇÃO
- O Tema 988 é do **STJ (Corte Especial)** — não do STF. Nenhum número de REsp foi citado porque não foi confirmado em fonte oficial na consulta de 2026-08-30.`,
    metadados: { tribunal: 'STJ', classe: 'Tema repetitivo', numero_tema: '988', orgao: 'Corte Especial', tese_literal: true, confirmacao_fonte: 'Tese reproduzida literalmente na página oficial TJDFT Precedentes Qualificados (modif. 04/05/2026)' },
    tags: ['processual-civil/recursos'],
    fonte: TJDFT_FONTE,
    urlFonte: TJDFT_URL,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'cpc-art-1015-cabimento-agravo-texto-atual', tipo: 'INTERPRETA_DISPOSITIVO', descricao: 'Interpretação do rol.' },
      { destinoSlug: 'tese-agravabilidade-fora-do-rol-urgencia', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Tese operacional derivada.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'tema-1022-stj-agravo-recuperacao-falencia',
    titulo: 'Tema 1022/STJ — Agravo de instrumento cabível contra TODAS as interlocutórias em recuperação judicial e falência (tese literal confirmada)',
    tipoDocumento: 'JURISPRUDENCIA',
    area: 'processual-civil',
    subarea: 'recursos',
    assunto: 'Recursos na RJ e falência',
    prioridade: 'P1',
    lote: 'LOTE-011',
    conteudo: `## Tese firmada (texto LITERAL confirmado em página oficial do TJDFT — consulta 2026-08-30)

"Tema 1022 do STJ - 'É cabível agravo de instrumento contra todas as decisões interlocutórias proferidas nos processos de recuperação judicial e nos processos de falência, por força do art. 1.015, parágrafo único, CPC.'"

## Interpretação aplicada
- Extensão ampla do cabimento nos regimes da Lei 11.101/2005: interlocutórias em RJ/falência são agraváveis independentemente de constarem dos incisos do caput;
- Combina com o parágrafo único do art. 1.015 (fases especiais) e com o inciso XIII ("outros casos expressamente referidos em lei").

## Hipóteses de aplicação no EJC
- Defesa do administrador judicial/credor/recuperando: recurso imediato contra decisões que afetem o plano, a assembleia, o fiscal da RJ ou o leilão na falência.`,
    metadados: { tribunal: 'STJ', classe: 'Tema repetitivo', numero_tema: '1022', tese_literal: true, confirmacao_fonte: 'Tese reproduzida literalmente na página oficial TJDFT Precedentes Qualificados (modif. 04/05/2026)' },
    tags: ['processual-civil/recursos'],
    fonte: TJDFT_FONTE,
    urlFonte: TJDFT_URL,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'cpc-art-1015-cabimento-agravo-texto-atual', tipo: 'INTERPRETA_DISPOSITIVO', descricao: 'Aplicação do inciso XIII e do parágrafo único.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'tjdft-acordao-2045271-aplicacao-tema-988',
    titulo: 'Acórdão TJDFT 2045271 (5ª Turma Cível, 18/09/2025, DJe 17/10/2025) — recusa de interpretação extensiva do rol do art. 1.015 fora da urgência',
    tipoDocumento: 'JURISPRUDENCIA',
    area: 'processual-civil',
    subarea: 'recursos',
    assunto: 'Aplicação do Tema 988',
    prioridade: 'P2',
    lote: 'LOTE-011',
    conteudo: `## Dados do julgado (confirmação oficial — página TJDFT Precedentes Qualificados, consulta 2026-08-30)
- **Acórdão:** 2045271 | **Processo:** 0723273-24.2025.8.07.0000 | **Relator(a):** Fábio Eduardo Marques | **Órgão:** 5ª Turma Cível | **Julgamento:** 18/09/2025 | **Publicação:** DJe 17/10/2025

## Trecho LITERAL da ementa reproduzido na página oficial
"3. O art. 1.015 do CPC disciplina as hipóteses de cabimento do agravo de instrumento, não permitindo, em regra, interpretação extensiva. Conforme a tese jurídica firmada no Superior Tribunal de Justiça no Tema nº 988 dos recursos repetitivos, a taxatividade do rol previsto no diploma processual somente deve ser mitigada quando verificada a urgência decorrente da inutilidade do julgamento da questão no recurso de apelação, o que não se vislumbre na espécie."

## Uso prático
- Precedente estadual recente (2025) aplicando rigorosamente os requisitos do Tema 988;
- Modelo de raciocínio para ajuizamento (prova de urgência) e para sustentar a inadmissibilidade quando a parte contrária agrava sem urgência.`,
    metadados: { tribunal: 'TJDFT', classe: 'Agravo de instrumento', numero_processo: '0723273-24.2025.8.07.0000', numero_acordao: '2045271', orgao_julgador: '5ª Turma Cível', relator: 'Fábio Eduardo Marques', data_julgamento: '2025-09-18', data_publicacao: '2025-10-17', trecho_literal_ementa: true, confirmacao_fonte: 'Página oficial TJDFT Precedentes Qualificados (modif. 04/05/2026)' },
    tags: ['processual-civil/recursos'],
    fonte: TJDFT_FONTE,
    urlFonte: TJDFT_URL,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'tema-988-stj-taxatividade-mitigada-rol-1015', tipo: 'APLICA_TESE', descricao: 'Aplicação concreta da tese do Tema 988.' },
    ],
  } satisfies InputDocument,

  {
    slug: 'prazo-agravo-instrumento-15-dias',
    titulo: 'PRAZO — Agravo de instrumento: 15 dias úteis da intimação (CPC art. 1.003 § 5º; forma e preparo arts. 1.016-1.017)',
    tipoDocumento: 'PRAZO',
    area: 'processual-civil',
    subarea: 'recursos',
    assunto: 'Prazo do agravo de instrumento',
    prioridade: 'P1',
    lote: 'LOTE-011',
    conteudo: `# PRAZO — Agravo de instrumento

## Regra
- **Prazo: 15 dias úteis** da intimação da decisão agravada (CPC art. 1.003, § 5º — em regra os recursos têm 15 dias, salvo lei em contrário; contagem em dias úteis — art. 219).
- **Contrarrazões: 15 dias úteis** (CPC art. 1.019, II — prazo de resposta previsto pelo relator).

## Termo inicial
- Intimação da decisão interlocutória (juntada do comprovante/certidão nos autos eletrônicos).

## Providências e documentos
| Dia | Providência | Documento |
|---|---|---|
| D+0 | Teste de cabimento (rol 1.015 ou Tema 988 — urgência) | checklist |
| D+1..13 | Montagem: petição (1.016) + peças obrigatórias (1.017, I) OU dispensa em autos eletrônicos (§ 5º) | cópias/declaração |
| até D+15 | Protocolo no tribunal OU na comarca/postagem (1.017 § 2º) + custas/porte (§ 1º) | comprovantes |
| após | Autos físicos: juntada na origem em 3 dias (1.018 § 2º) | petição simples |

## Risco
- Falta de peça/vício de admissibilidade → art. 932, parágrafo único (1.017 § 3º);
- Autos físicos sem juntada na origem provada pelo agravado → inadmissibilidade (1.018 § 3º).

## Próxima etapa
- Relator em 5 dias: efeito suspensivo/antecipação da tutela recursal (1.019, I).`,
    metadados: { fundamento: 'CPC arts. 1.003 § 5º, 1.017-1.019', tipo_prazo: 'processual (dias úteis)', destino: 'tribunal' },
    tags: ['processual-civil/recursos', 'geral/prazos'],
    fonte: 'Presidência da República — Planalto (CPC)',
    urlFonte: URL_CPC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'cpc-arts-1016-1017-requisitos-instrucao-agravo', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Forma e preparo.' },
      { destinoSlug: 'prazo-juntada-copia-origem-3-dias', tipo: 'SEQUENCIA_PROCESSUAL', descricao: 'Providência subsequente.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'prazo-juntada-copia-origem-3-dias',
    titulo: 'PRAZO — Juntada da cópia do agravo na origem: 3 dias (autos físicos) — CPC art. 1.018 §§ 2º-3º',
    tipoDocumento: 'PRAZO',
    area: 'processual-civil',
    subarea: 'recursos',
    assunto: 'Providência de comunicar a interposição',
    prioridade: 'P1',
    lote: 'LOTE-011',
    conteudo: `# PRAZO — Juntada na origem do agravo de instrumento

## Regra
- Autos FÍSICOS: o agravante deve juntar aos autos originais cópia da petição do agravo, comprovante de interposição e relação de documentos, **no prazo de 3 (três) dias** contados da interposição (CPC art. 1.018, § 2º).
- Descumprimento **arguido e provado pelo agravado** → inadmissibilidade do agravo (art. 1.018, § 3º).
- Autos ELETRÔNICOS: a juntada é facultativa (art. 1.018, caput — "poderá requerer"); as peças obrigatórias do art. 1.017, I, são dispensadas (art. 1.017, § 5º).

## Termo inicial
- Data da interposição do agravo no tribunal (ou postagem/protocolo na comarca — art. 1.017 § 2º).

## Providência
- Protocolar comunicação na origem em até 3 dias quando os autos forem físicos.

## Risco
- Perda do recurso por inadmissibilidade — ativa o dever de monitoramento interno do escritório.`,
    metadados: { fundamento: 'CPC art. 1.018 §§ 2º-3º e art. 1.017 § 5º', tipo_prazo: 'processual (dias úteis — art. 219)' },
    tags: ['processual-civil/recursos', 'geral/prazos'],
    fonte: 'Presidência da República — Planalto (CPC)',
    urlFonte: URL_CPC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'cpc-arts-1018-1019-juntada-origem-relator', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Texto literal do art. 1.018.' },
    ],
  } satisfies InputDocument,

  {
    slug: 'tese-agravabilidade-fora-do-rol-urgencia',
    titulo: 'TESE — Agravo fora do rol do art. 1.015 exige urgência com inutilidade do juízo de apelação (Tema 988/STJ)',
    tipoDocumento: 'TESE',
    area: 'processual-civil',
    subarea: 'recursos',
    assunto: 'Estratégia de recurso imediato',
    prioridade: 'P1',
    lote: 'LOTE-011',
    conteudo: `# TESE — Agravabilidade fora do rol (taxatividade mitigada)

## Enunciado operacional
- Decisão interlocutória fora do rol do art. 1.015 CPC é agravável APENAS se demonstradas, cumulativamente: (i) **urgência** e (ii) **inutilidade do exame na futura apelação** (fato consumado ou perda da finalidade processual) — Tema 988/STJ (tese literal confirmada na base).
- Sem esses elementos: a matéria é prejudicial/polemical → reserva para a apelação (preclusão diferida).

## Requisitos lógicos do recurso
1. Enquadramento negativo no rol (análise inciso a inciso);
2. Demonstração concreta do perigo de inutilidade (e.g., tutela de prova perecível, condição que se esgota antes da sentença);
3. Requerimento subsidiário: efeito suspensivo ou antecipação da tutela recursal (art. 1.019, I).

## Contra-tese (risco)
- Interpretação extensiva sem urgência = recurso não conhecido (aplicação rigorosa — Acórdão TJDFT 2045271, doc vinculado).

## Uso no EJC
- Triage automática: SE decisão fora do rol E sem urgência → recomendar apelação futura + ata notarial de fatos urgentes, quando cabível.`,
    metadados: { probabilidade: 'alta para recusa sem urgência', tipo_tese: 'admissibilidade recursal', areas_uso: ['agravo', 'planejamento recursal'] },
    tags: ['processual-civil/recursos'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'A',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'tema-988-stj-taxatividade-mitigada-rol-1015', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Tese repetitiva fonte.' },
      { destinoSlug: 'argumentacao-agravo-fora-do-rol-bilateral', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Argumentos aplicados.' },
    ],
  } satisfies InputDocument,

  {
    slug: 'checklist-admissibilidade-agravo-instrumento',
    titulo: 'CHECKLIST — Admissibilidade do agravo de instrumento: 12 pontos',
    tipoDocumento: 'CHECKLIST',
    area: 'processual-civil',
    subarea: 'recursos',
    assunto: 'Conferências antes do protocolo',
    prioridade: 'P1',
    lote: 'LOTE-011',
    conteudo: `# CHECKLIST — Agravo de instrumento

## Cabimento
1. [ ] Decisão é interlocutória (não sentença/despacho)?
2. [ ] Enquadra-se em inciso do art. 1.015 OU parágrafo único (liquidação/cumprimento/execução/inventário) OU Tema 988 (urgência + inutilidade)?
3. [ ] Se RJ/falência: Tema 1022 (todas as interlocutórias agraváveis)?

## Forma (art. 1.016)
4. [ ] Nomes das partes; exposição fato/direito; razões + pedido específico; endereço completo dos advogados.

## Peças (art. 1.017)
5. [ ] Autos eletrônicos? (dispensa dos incisos I-II — § 5º)
6. [ ] Autos físicos? (cópias obrigatórias: inicial, contestação, petição da decisão, decisão, certidão de intimação, procurações OU declaração de inexistência — incisos I-II)
7. [ ] Custas e porte pagos (§ 1º)?

## Prazo e protocolo
8. [ ] 15 dias úteis da intimação (art. 1.003 § 5º)?
9. [ ] Protocolo no tribunal/comarca/postagem (art. 1.017 § 2º)?
10. [ ] Autos físicos: agenda de juntada na origem em 3 dias (art. 1.018 § 2º)?

## Estratégia
11. [ ] Pedido de efeito suspensivo/tutela recursal ao relator (art. 1.019, I) fundamentado?
12. [ ] Requisitos do Tema 988 provados documentalmente (se decisão fora do rol)?`,
    metadados: { dadosFicticios: false, quantidade_itens: 12 },
    tags: ['processual-civil/recursos'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'cpc-art-1015-cabimento-agravo-texto-atual', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Itens 1-3.' },
      { destinoSlug: 'cpc-arts-1016-1017-requisitos-instrucao-agravo', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Itens 4-7.' },
    ],
  } satisfies InputDocument,

  {
    slug: 'fluxo-agravo-instrumento',
    titulo: 'FLUXO — Agravo de instrumento: da decisão agravada ao julgamento',
    tipoDocumento: 'FLUXO',
    area: 'processual-civil',
    subarea: 'recursos',
    assunto: 'Mapa evento → prazo → providência → risco → próxima etapa',
    prioridade: 'P1',
    lote: 'LOTE-011',
    conteudo: `# FLUXO — Agravo de instrumento (CPC arts. 1.015-1.019)

## E1 — Decisão interlocutória publicada
- **Prazo gerado:** 15 dias úteis (art. 1.003 § 5º).
- **Providência:** teste de cabimento (rol 1.015 / parágrafo único / Tema 988).
- **Risco:** recurso fora do rol sem urgência → não conhecimento.

## E2 — Protocolo no tribunal (ou comarca/postagem)
- **Documento:** petição com requisitos do art. 1.016 + peças (art. 1.017; dispensa parcial em autos eletrônicos § 5º) + custas/porte (§ 1º).
- **Risco:** falta de peça → art. 932, parágrafo único (1.017 § 3º).

## E3 — Juntada na origem (autos físicos)
- **Prazo:** 3 dias (art. 1.018 § 2º).
- **Risco:** descumprimento provado pelo agravado → inadmissibilidade (§ 3º).

## E4 — Distribuição e atuação do relator
- **Prazo:** 5 dias para decidir (art. 1.019, caput).
- **Providência:** requerer efeito suspensivo OU antecipação da tutela recursal (inciso I); juízo de retratação do juiz pode tornar o agravo prejudicado (art. 1.018 § 1º).

## E5 — Contrarrazões
- **Prazo:** 15 dias do agravado (art. 1.019, II), com documentação facultativa.

## E6 — Julgamento
- **Providência:** sustentação oral quando cabível; verificação de decisões monocráticas e agravo interno (art. 1.021 — doc LOTE-007).
- **Próxima etapa:** decisão no agravo → retomada do processo (ou recursos subsequentes).`,
    metadados: { dadosFicticios: false, eventos: 6 },
    tags: ['processual-civil/recursos', 'geral/prazos'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'prazo-agravo-instrumento-15-dias', tipo: 'ETAPA_PROCESSO', descricao: 'E1-E2.' },
      { destinoSlug: 'prazo-juntada-copia-origem-3-dias', tipo: 'ETAPA_PROCESSO', descricao: 'E3.' },
      { destinoSlug: 'cpc-art-1021-agravo-interno', tipo: 'SEQUENCIA_PROCESSUAL', descricao: 'E6 — recurso contra decisão monocrática (LOTE-007).' },
    ],
  } satisfies InputDocument,
  {
    slug: 'tabela-pecas-agravo-instrumento',
    titulo: 'TABELA — Peças do agravo de instrumento: obrigatórias x facultativas x dispensadas',
    tipoDocumento: 'TABELA_DOCUMENTOS',
    area: 'processual-civil',
    subarea: 'recursos',
    assunto: 'Instrução documental do recurso',
    prioridade: 'P1',
    lote: 'LOTE-011',
    conteudo: `# TABELA — Peças do agravo de instrumento (CPC art. 1.017)

| Peça | Autos físicos | Autos eletrônicos |
|---|---|---|
| Petição inicial (cópia) | obrigatória (I) | dispensada (§ 5º) |
| Contestação (cópia) | obrigatória (I) | dispensada (§ 5º) |
| Petição que ensejou a decisão | obrigatória (I) | dispensada (§ 5º) |
| Decisão agravada | obrigatória (I) | dispensada (§ 5º) |
| Certidão de intimação / prova de tempestividade | obrigatória (I) | dispensada (§ 5º) |
| Procurações do agravante e agravado | obrigatórias (I) | dispensadas (§ 5º) |
| Declaração de inexistência de peça | substitui peça faltante (II) | dispensada (§ 5º) |
| Custas + porte de retorno | obrigatórios quando devidos (§ 1º) | idem |
| Outras peças úteis (laudo, atas, print de sistema) | facultativas (III) | facultativas |
| Comprovante do agravo + relação de documentos na ORIGEM | 3 dias (art. 1.018 § 2º) | facultativo (caput) |

## Dica operacional
- Mesmo em autos eletrônicos, anexar a decisão agravada e a certidão de intimação facilita o juízo de admissibilidade e o pedido de efeito suspensivo.`,
    metadados: { dadosFicticios: false, coberturas: ['preparo', 'instrução', 'origem'] },
    tags: ['processual-civil/recursos'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'cpc-arts-1016-1017-requisitos-instrucao-agravo', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Base literal da tabela.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'triagem-agravo-instrumento',
    titulo: 'TRIAGEM — Roteiro para decisão rápida de interposição de agravo de instrumento',
    tipoDocumento: 'TRIAGEM',
    area: 'processual-civil',
    subarea: 'recursos',
    assunto: 'Perguntas de classificação de caso',
    prioridade: 'P1',
    lote: 'LOTE-011',
    conteudo: `# TRIAGEM — Agravo de instrumento

## Bloco A — Identificação da decisão
1. Qual o conteúdo da decisão (tutela, ônus da prova, gratuidade, desconsideração, outras)?
2. Há inciso do art. 1.015 correspondente? Qual?
3. O processo está em liquidação/cumprimento/execução/inventário? (parágrafo único)
4. É processo de RJ ou falência? (Tema 1022)

## Bloco B — Urgência (se fora do rol — Tema 988)
5. O que acontece até a apelação que torna inútil o julgamento posterior?
6. Há prova documental da urgência (prazos, decaimentos, fatos consumados)?
7. Cabe requerimento de efeito suspensivo/antecipação de tutela recursal?

## Bloco C — Forma e tempo
8. Quando foi a intimação? (15 dias úteis — art. 1.003 § 5º)
9. Autos físicos ou eletrônicos? (peças do art. 1.017 e juntada de 3 dias — art. 1.018 § 2º)
10. Custas e porte pagos?

## Saída da triagem
- CABÍVEL (inciso/parágrafo único/Tema 1022) OU CABÍVEL COM URGÊNCIA (Tema 988) OU NÃO CABÍVEL (reservar para apelação + mitigar dano).`,
    metadados: { dadosFicticios: false, blocos: 3, perguntas: 10 },
    tags: ['processual-civil/recursos'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'tese-agravabilidade-fora-do-rol-urgencia', tipo: 'APLICACAO_OPERACIONAL', descricao: 'Bloco B segue a tese.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'argumentacao-agravo-fora-do-rol-bilateral',
    titulo: 'ARGUMENTAÇÃO — Agravo fora do rol: agravante (urgência) x agravado (taxatividade)',
    tipoDocumento: 'ARGUMENTACAO',
    area: 'processual-civil',
    subarea: 'recursos',
    assunto: 'Controvérsia do Tema 988 na prática',
    prioridade: 'P1',
    lote: 'LOTE-011',
    conteudo: `# ARGUMENTAÇÃO BILATERAL — Agravabilidade fora do rol do art. 1.015

## Questão: decisão fora do rol é agravável?
- **AGRAVANTE:** taxatividade MITIGADA (Tema 988 — tese literal na base): a urgência decorrente da inutilidade do julgamento na apelação abre o recurso; negar acesso imediato violaria a tutela eficaz (art. 5º, XXXV, CF — lide consumada antes da sentença).
- **AGRAVADO:** o rol é regra; interpretação extensiva é exceção estrita — sem prova concreta de inutilidade, o recurso não é conhecido (Acórdão TJDFT 2045271, 5ª TC, 2025 — trecho literal na base). Preclusão diferida preserva o duplo grau no momento próprio.
- **PONTO MÉDIO:** mesmo quando não conhecido o agravo, o relator pode examinar pedido de tutela de urgência na fase de apelação (antecipação da tutela recursal) — art. 1.019, I, aplicável ao recurso cabível.

## Questão: peças ausentes
- **AGRAVANTE:** autos eletrônicos dispensam cópias (art. 1.017 § 5º).
- **AGRAVADO:** quando houver fase híbrida/autos físicos, a ausência de decisão/certidão compromete a admissibilidade (art. 1.017 § 3º) e a falta de juntada na origem provada gera inadmissibilidade (art. 1.018 § 3º).`,
    metadados: { dadosFicticios: false, controvérsias: 2, base: 'CPC arts. 1.015-1.019 + Tema 988 + Acórdão TJDFT 2045271' },
    tags: ['processual-civil/recursos'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'tema-988-stj-taxatividade-mitigada-rol-1015', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Tese central.' },
      { destinoSlug: 'tjdft-acordao-2045271-aplicacao-tema-988', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Aplicação estadual.' },
    ],
  } satisfies InputDocument,
  {
    slug: 'doutrina-taxatividade-mitigada',
    titulo: 'DOUTRINA — Taxatividade mitigada, preclusão diferida e tutela recursal no agravo de instrumento',
    tipoDocumento: 'DOUTRINA',
    area: 'processual-civil',
    subarea: 'recursos',
    assunto: 'Conceitos-chave do regime do agravo',
    prioridade: 'P2',
    lote: 'LOTE-011',
    conteudo: `# DOUTRINA EJC — Conceitos do agravo de instrumento

## 1. Taxatividade mitigada
O rol do art. 1.015 é regra de cabimento; admite exceção por urgência com inutilidade do exame na apelação (Tema 988/STJ). Não é rol aberto: a exceção exige prova concreta.

## 2. Preclusão diferida (regra da apelação)
Matérias não agraváveis não se perdem: são conhecidas na apelação como questões prejudiciais — EXCETO se a decisão fora do rol causar dano imediato irreparável (daí a exceção do Tema 988).

## 3. Tutela recursal (art. 1.019, I)
O relator pode dar efeito suspensivo ao agravo OU antecipar a pretensão recursal — permite restaurar, de imediato, o equilíbrio afetado pela decisão agravada, sem esperar o colegiado.

## 4. Autos eletrônicos x físicos
- Eletrônicos: dispensa de peças (art. 1.017 § 5º) e juntada na origem facultativa (art. 1.018 caput);
- Físicos: peças obrigatórias sob pena de inadmissibilidade (art. 1.017 §§ 1º-3º) e juntada em 3 dias (art. 1.018 §§ 2º-3º).

## 5. Juízo de retratação (art. 1.018 § 1º)
Se o juiz reformar integralmente a decisão antes do julgamento, o relator declara prejuízo — economia processual a monitorar para evitar recurso prejudicado.

## 6. Temas repetitivos conexos
Tema 988 (taxatividade mitigada) e Tema 1022 (RJ/falência — todas as interlocutórias agraváveis) delimitam, com o art. 1.015, o mapa completo do cabimento.`,
    metadados: { dadosFicticios: false, conceitos: 6 },
    tags: ['processual-civil/recursos'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'tema-988-stj-taxatividade-mitigada-rol-1015', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Conceito 1.' },
      { destinoSlug: 'cpc-arts-1018-1019-juntada-origem-relator', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Conceitos 3-5.' },
    ],
  } satisfies InputDocument,

  {
    slug: 'regra-se-decisao-fora-rol-sem-urgencia',
    titulo: 'REGRA — SE decisão fora do rol E sem urgência ENTÃO não interpor agravo (reservar para apelação)',
    tipoDocumento: 'REGRA_INTELIGENCIA',
    area: 'processual-civil',
    subarea: 'recursos',
    assunto: 'Motor de decisão de recurso imediato',
    prioridade: 'P1',
    lote: 'LOTE-011',
    conteudo: `# REGRAS SE-ENTÃO — Agravo de instrumento

## REGRA 1 — Cabimento direto
SE decisão_interlocutoria E (consta_rol_1015 OU fase_liquidação_cumprimento_execucao_inventario OU processo_RJ_falencia)
ENTÃO AGRAVO_CABIVEL (art. 1.015 + Temas 988/1022)

## REGRA 2 — Exceção do Tema 988
SE decisão FORA_DO_ROL E (urgência_provada E inutilidade_julgamento_apelacao)
ENTÃO AGRAVO_CABIVEL_EXCECAO
SENÃO NAO_INTERPOR — reservar_matéria_para_apelacao (preclusão diferida)

## REGRA 3 — Peças
SE autos_eletronicos
ENTÃO dispensa_peças_1017_I_II (art. 1.017 § 5º) E juntada_origem_facultativa (art. 1.018 caput)
SENÃO montar_dossiê_completo E agenda_juntada_origem_3_dias (art. 1.018 § 2º)

## REGRA 4 — Efeito imediato
SE risco_de_dano_antes_do_julgamento
ENTÃO requerer AO_RELATOR efeito_suspensivo OU antecipacao_tutela_recursal (art. 1.019, I) nos_primeiros_5_dias

## REGRA 5 — Retratação
SE juiz_reformar_integralmente_apos_interposicao
ENTÃO agravo_prejudicado (art. 1.018 § 1º) — atualizar dashboard de prazos do cliente`,
    metadados: { dadosFicticios: false, regras: 5, fundamento: 'CPC arts. 1.015-1.019 + Temas 988/1022' },
    tags: ['processual-civil/recursos'],
    fonte: EJC,
    dataConsulta: D,
    confiabilidade: 'B',
    vigente: true,
    status: 'ATIVO',
    dadosFicticios: false,
    dataUltimaVerificacao: D,
    proximaVerificacaoRecomendada: '2026-10-30',
    relacionamentos: [
      { destinoSlug: 'cpc-art-1015-cabimento-agravo-texto-atual', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Regras 1-2.' },
      { destinoSlug: 'cpc-arts-1018-1019-juntada-origem-relator', tipo: 'FUNDAMENTO_LEGAL', descricao: 'Regras 4-5.' },
    ],
  } satisfies InputDocument,
];
