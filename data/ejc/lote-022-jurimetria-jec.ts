// LOTE-022 — Jurimetria JEC (Juizado Especial Cível) — Belo Horizonte e Betim
// Fonte: API Pública DataJud/CNJ (índice TJMG) — consolidação fornecida pelo cliente (Atlas Forense)
// Arquivo original: anexo do cliente "Demandas no Juizado Especial.zip" → jecDashboardData.ts
//   ("dados consolidados de fonte pública e sem dados pessoais", hashBaseProcessos incluso)
// Recorte: 01/01/2025 a 26/08/2026 · Classe: 436 — Procedimento do Juizado Especial Cível
//
// REGRAS DESTA INGESTÃO (governança EJC):
// - ESTATÍSTICAS REAIS E AGREGADAS — TODOS os números são LITERAIS do arquivo-fonte.
//   Zero inferências jurídicas, zero súmulas, zero julgados individuais.
// - PROIBIDO usar processRows e timelineEvents do arquivo-fonte (contêm números de processos
//   individuais) — nenhuma linha desta ingestão deriva dessas chaves.
// - Alertas/definições metodológicos copiados LITERALMENTE do meta do arquivo.
// - Somente chaves agregadas: meta, summary, unitStats, causeStats, durationDistribution,
//   timeline, timelineCensus.
import type { InputDocument } from '../../src/lib/ejc/types';

const D = '2026-08-26';
const FONTE = 'API Pública DataJud/CNJ (índice TJMG) — consolidação fornecida pelo cliente (Atlas Forense)';
const URL_FONTE = 'https://datajud-wiki.cnj.jus.br/';
const TAG_JEC = 'processual-civil/juizados-especiais';
const HASH_BASE = '6b2e4af8e8fe7a135e56a91bed12447bee4f9afee76c902ea70e9cc1afa4deff';

// Textos LITERAIS do meta do arquivo-fonte (copiar sem reescrever)
const LIT_DEFINICAO_TEMPO = 'Dias corridos entre a data de ajuizamento e a data do último movimento público disponível no registro DataJud.';
const LIT_ALERTA_TEMPO = 'Tempo observado não é duração definitiva nem tempo até sentença. Processos sem último movimento válido são excluídos da média.';
const LIT_ALERTA_2026 = '2026 é parcial até 26/08/2026.';
const LIT_ALERTA_TIMELINE = 'A série mensal apresenta censo territorial de distribuições e baixas definitivas do coorte de processos ajuizados entre 01/01/2025 e 26/08/2026. Os filtros de assunto e órgão não recalculam o censo mensal.';
const LIT_DEFINICAO_BAIXA_CENSO = 'Baixa definitiva: processos do coorte de ajuizamento 2025-2026 com movimento público “Baixa Definitiva” no mês, contados uma vez por mês.';

const base = {
  fonte: FONTE,
  urlFonte: URL_FONTE,
  dataConsulta: D,
  dataUltimaVerificacao: D,
  confiabilidade: 'B',
  status: 'ATIVO',
  dadosFicticios: false,
  vigente: true,
  prioridade: 'P2',
  lote: 'LOTE-022',
  area: 'processual-civil',
  subarea: 'juizados-especiais',
} as const;

// ---------- DOC 1 — VISÃO GERAL ----------
const doc1: InputDocument = {
  ...base,
  slug: 'jurimetria-jec-visao-geral-bh-betim-2025-2026',
  titulo: 'Jurimetria JEC — Visão geral Belo Horizonte e Betim (classe 436, recorte 01/01/2025 a 26/08/2026)',
  tipoDocumento: 'JURIMETRIA',
  assunto: 'Jurimetria do Juizado Especial Cível — painel consolidado',
  subassunto: 'Censo e tempo observado por município e ano (Belo Horizonte e Betim)',
  tags: [TAG_JEC],
  conteudo: `# JURIMETRIA JEC — VISÃO GERAL — BELO HORIZONTE E BETIM

[DADO ESTATÍSTICO REAL] Fonte declarada do arquivo: "API Pública DataJud/CNJ — índice TJMG", consolidação fornecida pelo cliente (Atlas Forense), descrita pelo próprio arquivo como "dados consolidados de fonte pública e sem dados pessoais". Todos os números abaixo são literais do arquivo.

## Identificação do painel (meta do arquivo, literal)
| Campo | Valor |
|---|---|
| titulo | Painel Jurimetria JEC — Belo Horizonte e Betim |
| recorte | 01/01/2025 a 26/08/2026 |
| coletaDataJud | 25/08/2026 |
| consolidacao | 26/08/2026 |
| classe | 436 — Procedimento do Juizado Especial Cível |
| fonte | API Pública DataJud/CNJ — índice TJMG |

## Censo de processos e tempo observado (summary do arquivo — 4 linhas)
Amostra: 200 processos por recorte (município × ano). Tempo em dias corridos.

| Município | Ano | Censo de processos | Amostra | Cobertura da amostra | Com último movimento | Tempo médio (dias) | Tempo mediano (dias) |
|---|---|---|---|---|---|---|---|
| Belo Horizonte | 2025 | 50426 | 200 | 0.4% | 200 | 144.9 | 160.0 |
| Belo Horizonte | 2026 | 29357 | 200 | 0.68% | 200 | 2.7 | 2.0 |
| Betim | 2025 | 4376 | 200 | 4.57% | 200 | 169.9 | 174.5 |
| Betim | 2026 | 2776 | 200 | 7.2% | 200 | 8.8 | 9.0 |

## Alertas metodológicos do arquivo original (LITERAIS — não reescrever)
- **definicaoTempo:** "${LIT_DEFINICAO_TEMPO}"
- **alertaTempo:** "${LIT_ALERTA_TEMPO}"
- **alerta2026:** "${LIT_ALERTA_2026}"
- **alertaTimeline:** "${LIT_ALERTA_TIMELINE}"
- **definicaoBaixaCenso:** "${LIT_DEFINICAO_BAIXA_CENSO}"

## Como ler este painel no EJC (sem inferir)
- Os tempos médio/mediano são o "tempo observado" definido acima — o arquivo alerta que NÃO é duração definitiva nem tempo até sentença.
- Os valores de 2026 refletem recorte parcial (até 26/08/2026), conforme alerta2026 — comparar 2025 × 2026 diretamente violaria o próprio alerta do arquivo; o EJC apresenta, não conclui.
- Números de processos individuais NÃO constam desta ficha: o EJC ingere exclusivamente as chaves agregadas do arquivo (meta, summary, unitStats, causeStats, durationDistribution, timeline, timelineCensus).`,
  metadados: {
    origem_arquivo: 'upload/Demandas no Juizado Especial.zip → jecDashboardData.ts (Atlas Forense)',
    recorte: '01/01/2025 a 26/08/2026',
    classe: '436 — Procedimento do Juizado Especial Cível',
    municipio: ['Belo Horizonte', 'Betim'],
    hashBaseProcessos: HASH_BASE,
    chaves_usadas: ['meta', 'summary'],
    chaves_proibidas: ['processRows', 'timelineEvents'],
    status_dados: 'estatísticas agregadas reais — números literais do arquivo',
    tipo_dado: 'DADO ESTATISTICO REAL',
  },
  relacionamentos: [
    { destinoSlug: 'jurimetria-jec-metodologia-fontes-limitacoes', tipo: 'COMPLEMENTA', descricao: 'Metodologia, alertas e limitações do mesmo painel.' },
    { destinoSlug: 'jurimetria-jec-unidades-judiciarias', tipo: 'COMPLEMENTA', descricao: 'Detalhamento por unidade jurisdicional.' },
    { destinoSlug: 'jurimetria-metodologia-ejc', tipo: 'COMPLEMENTA', descricao: 'Metodologia geral do banco de Jurimetria do EJC (dados reais, nunca inventados).' },
    { destinoSlug: 'lei-9099-art-3-competencia-40sm-exclusoes', tipo: 'CONEXO_TEMATICO', descricao: 'Competência do Juizado Especial Cível (Lei 9.099), classe 436 no TJMG.' },
  ],
} satisfies InputDocument;

// ---------- DOC 2 — UNIDADES JUDICIÁRIAS ----------
const doc2: InputDocument = {
  ...base,
  slug: 'jurimetria-jec-unidades-judiciarias',
  titulo: 'Jurimetria JEC — Unidades judiciárias: amostra e tempo observado (top 12 por tamanho de amostra)',
  tipoDocumento: 'JURIMETRIA',
  assunto: 'Unidades judiciárias do JEC — tempo observado por unidade',
  subassunto: 'unitStats — top 12 registros por processosAmostra (de 26 registros do arquivo)',
  tags: [TAG_JEC],
  conteudo: `# JURIMETRIA JEC — UNIDADES JUDICIÁRIAS (TOP 12 POR AMOSTRA)

[DADO ESTATÍSTICO REAL] Tabela derivada da chave **unitStats** do arquivo Atlas Forense (26 registros no total: 13 de Belo Horizonte 2025, 11 de Belo Horizonte 2026 e 2 de Betim — Unidade Jurisdicional Única em 2025 e 2026). Abaixo, os **12 maiores registros ordenados por processosAmostra** (ordenação numérica apresentacional — todos os valores são literais do arquivo).

## Tabela — unidade, município, ano, amostra e tempo observado (dias)
| Unidade (nome literal) | Município | Ano | Código do órgão | Amostra | Com último movimento | Tempo médio (dias) | Tempo mediano (dias) |
|---|---|---|---|---|---|---|---|
| Unidade Jurisdicional Única | Betim | 2025 | 40011 | 200 | 200 | 169.9 | 174.5 |
| Unidade Jurisdicional Única | Betim | 2026 | 40011 | 200 | 200 | 8.8 | 9.0 |
| 1ª Unidade Jurisdicional Cível da Comarca de Belo Horizonte | Belo Horizonte | 2026 | 17283 | 27 | 27 | 3.1 | 3 |
| 4ª Unidade Jurisdicional Cível | Belo Horizonte | 2025 | 17293 | 26 | 26 | 152.0 | 164.5 |
| 9ª Unidade Jurisdicional Cível | Belo Horizonte | 2026 | 17298 | 26 | 26 | 2.3 | 2.0 |
| 4ª Unidade Jurisdicional Cível | Belo Horizonte | 2026 | 17293 | 25 | 25 | 2.6 | 3 |
| 5ª Unidade Jurisdicional Cível da Comarca de Belo Horizonte | Belo Horizonte | 2026 | 17294 | 25 | 25 | 2.6 | 2 |
| 9ª Unidade Jurisdicional Cível | Belo Horizonte | 2025 | 17298 | 24 | 24 | 144.9 | 153.5 |
| 3ª Unidade Jurisdicional Cível | Belo Horizonte | 2025 | 17292 | 22 | 22 | 130.2 | 137.0 |
| 5ª Unidade Jurisdicional Cível | Belo Horizonte | 2025 | 17294 | 22 | 22 | 154.5 | 164.5 |
| 10ª Unidade Jurisdicional Cível | Belo Horizonte | 2026 | 17284 | 20 | 20 | 2.8 | 3.0 |
| 2ª Unidade Jurisdicional Cível | Belo Horizonte | 2025 | 17289 | 19 | 19 | 132.6 | 137 |

## Registros fora do top 12 (constam no arquivo, não exibidos acima)
- Belo Horizonte 2025: 1ª (18 processos, médio 156.7), 6ª (17, médio 156.9), 7ª (16, médio 150.1), 10ª (14, médio 137.3), 11ª (10, médio 134.7), 8ª (9, médio 139.7), Núcleo de Justiça 4.0 - Juizados Especiais (2, médio 138.0), 30ª Vara Cível da Comarca de Belo Horizonte (1, médio 85.0).
- Belo Horizonte 2026: 2ª (17, médio 3.2), 3ª (15, médio 3.6), 6ª (15, médio 3.6), 8ª (15, médio 0.9), 7ª (9, médio 1.8), 11ª (6, médio 2.3).

## Alertas do arquivo (LITERAIS)
- **definicaoTempo:** "${LIT_DEFINICAO_TEMPO}"
- **alertaTempo:** "${LIT_ALERTA_TEMPO}"
- **alerta2026:** "${LIT_ALERTA_2026}"

## Como ler (sem inferir)
- As diferenças de tempo entre 2025 e 2026 NÃO devem ser lidas como melhora/piora de unidade: em 2026 o recorte é parcial e o "tempo observado" mede dias desde o ajuizamento até o último movimento público — processos recentes têm, por construção do indicador, tempos observados pequenos (o próprio arquivo alerta que não é duração definitiva).
- A amostra por unidade em Belo Horizonte é fração do total de 200 por ano; Betim concentra as 200 na Unidade Jurisdicional Única (código 40011).`,
  metadados: {
    origem_arquivo: 'upload/Demandas no Juizado Especial.zip → jecDashboardData.ts (Atlas Forense)',
    chave_fonte: 'unitStats',
    registros_totais: 26,
    criterio_top12: 'ordenado por processosAmostra (ordenação numérica; valores literais)',
    recorte: '01/01/2025 a 26/08/2026',
    classe: '436 — Procedimento do Juizado Especial Cível',
    hashBaseProcessos: HASH_BASE,
    chaves_usadas: ['meta', 'unitStats'],
    chaves_proibidas: ['processRows', 'timelineEvents'],
    tipo_dado: 'DADO ESTATISTICO REAL',
  },
  relacionamentos: [
    { destinoSlug: 'jurimetria-jec-visao-geral-bh-betim-2025-2026', tipo: 'COMPLEMENTA', descricao: 'Visão geral do mesmo painel (censo e tempo por município/ano).' },
    { destinoSlug: 'jurimetria-jec-metodologia-fontes-limitacoes', tipo: 'COMPLEMENTA', descricao: 'Metodologia e limitações do indicador de tempo.' },
    { destinoSlug: 'lei-9099-arts-4-8-foro-partes-assistencia', tipo: 'CONEXO_TEMATICO', descricao: 'Organização do JEC (turmas) — contexto das unidades jurisdicionais.' },
  ],
} satisfies InputDocument;

// ---------- DOC 3 — ASSUNTOS FREQUENTES ----------
const doc3: InputDocument = {
  ...base,
  slug: 'jurimetria-jec-assuntos-frequentes',
  titulo: 'Jurimetria JEC — Assuntos/causas mais frequentes na amostra (top 20 agregado, 2025–2026)',
  tipoDocumento: 'JURIMETRIA',
  assunto: 'Assuntos/causas mais frequentes na amostra JEC',
  subassunto: 'causeStats — top 20 por frequência agregada (4 grupos município × ano)',
  tags: [TAG_JEC],
  conteudo: `# JURIMETRIA JEC — ASSUNTOS/CAUSAS MAIS FREQUENTES (TOP 20)

[DADO ESTATÍSTICO REAL] Dados da chave **causeStats** do arquivo Atlas Forense. Estrutura real da chave: registros por **município × ano × causa** (campos: municipio, ano, causa, processosAmostra) — 223 registros, 103 nomes de causa distintos. Para a visão de "top assuntos", o EJC **agregou** as contagens pelos 4 grupos (Belo Horizonte 2025, Belo Horizonte 2026, Betim 2025, Betim 2026). Todos os números são literais do arquivo; a única operação aplicada foi a **soma** das contagens por causa.

## Tabela — top 20 causas por frequência agregada (contagens na amostra de 200 por grupo)
| # | Causa (nome literal) | BH 2025 | BH 2026 | Betim 2025 | Betim 2026 | Total agregado |
|---|---|---|---|---|---|---|
| 1 | Indenização por dano moral | 93 | 104 | 102 | 43 | 342 |
| 2 | Indenização por dano material | 66 | 62 | 38 | 19 | 185 |
| 3 | Obrigação de fazer / não fazer | 3 | 20 | 59 | 69 | 151 |
| 4 | Cláusulas Abusivas | 8 | 9 | 11 | 11 | 39 |
| 5 | Atraso de voo | 21 | 7 | 6 | 4 | 38 |
| 6 | Cancelamento de voo | 21 | 9 | 5 | 3 | 38 |
| 7 | Acidente de Trânsito | 9 | 12 | 8 | 6 | 35 |
| 8 | Rescisão contratual e devolução | 3 | 19 | 6 | 5 | 33 |
| 9 | Negativação indevida | 6 | 5 | 11 | 9 | 31 |
| 10 | Bancários | 7 | 4 | 7 | 6 | 24 |
| 11 | Transporte Aéreo | 9 | 6 | 2 | 1 | 18 |
| 12 | Dever de Informação | 6 | 7 | 4 | 1 | 18 |
| 13 | Irregularidade no atendimento | 6 | 5 | 4 | 3 | 18 |
| 14 | Inadimplemento | 4 | 6 | 2 | 6 | 18 |
| 15 | Práticas Abusivas | 7 | 2 | 5 | 2 | 16 |
| 16 | Empréstimo consignado | 4 | 0 | 6 | 5 | 15 |
| 17 | Repetição do Indébito | 2 | 2 | 3 | 6 | 13 |
| 18 | Extravio de bagagem | 5 | 3 | 1 | 2 | 11 |
| 19 | Compromisso | 0 | 2 | 0 | 9 | 11 |
| 20 | Tutela de Urgência | 3 | 4 | 1 | 1 | 9 |

## Observação aritmética sobre as contagens (constatação dos números, sem inferência)
Em cada grupo (município × ano), a soma das contagens por causa excede o tamanho da amostra de 200 processos: BH 2025 soma 352, BH 2026 soma 348, Betim 2025 soma 334 e Betim 2026 soma 261. Portanto, **as contagens por causa não são mutuamente exclusivas dentro da amostra** — um mesmo processo pode estar contado em mais de uma causa. As colunas por grupo são literais do arquivo; a coluna "Total agregado" é a soma das quatro.

## Alertas do arquivo (LITERAIS)
- **alerta2026:** "${LIT_ALERTA_2026}"
- **alertaTimeline:** "${LIT_ALERTA_TIMELINE}"

## Como ler (sem inferir)
- O ranking descreve **a amostra** (200 processos por recorte), não o censo dos 86.935 processos do recorte completo (50426 + 29357 + 4376 + 2776, literais do summary).
- Os nomes das causas são os rótulos literais do arquivo (derivados do cadastro DataJud/TJMG); o EJC não os reclassifica, agrupa semântica ou corrige.`,
  metadados: {
    origem_arquivo: 'upload/Demandas no Juizado Especial.zip → jecDashboardData.ts (Atlas Forense)',
    chave_fonte: 'causeStats',
    estrutura_chave: 'municipio × ano × causa × processosAmostra (223 registros; 103 causas distintas)',
    agregacao: 'soma das contagens por causa nos 4 grupos (município × ano); top 20 por total agregado',
    soma_contagens_por_grupo: { 'BH 2025': 352, 'BH 2026': 348, 'Betim 2025': 334, 'Betim 2026': 261 },
    amostra_por_grupo: 200,
    recorte: '01/01/2025 a 26/08/2026',
    classe: '436 — Procedimento do Juizado Especial Cível',
    hashBaseProcessos: HASH_BASE,
    chaves_usadas: ['meta', 'causeStats'],
    chaves_proibidas: ['processRows', 'timelineEvents'],
    tipo_dado: 'DADO ESTATISTICO REAL',
  },
  relacionamentos: [
    { destinoSlug: 'jurimetria-jec-visao-geral-bh-betim-2025-2026', tipo: 'COMPLEMENTA', descricao: 'Censo e tempo observado do mesmo painel.' },
    { destinoSlug: 'jurimetria-jec-metodologia-fontes-limitacoes', tipo: 'COMPLEMENTA', descricao: 'Metodologia de amostragem e limitações.' },
    { destinoSlug: 'jurimetria-consumidor-vicio-plataformas', tipo: 'CONEXO_TEMATICO', descricao: 'Jurimetria do banco Consumidor — temas dominantes na amostra (dano moral/material, plataformas).' },
    { destinoSlug: 'triagem-jec-competencia-partes', tipo: 'CONEXO_TEMATICO', descricao: 'Triagem de JEC — assuntos típicos observados na amostra.' },
  ],
} satisfies InputDocument;

// ---------- DOC 4 — DISTRIBUIÇÃO DE DURAÇÃO ----------
const doc4: InputDocument = {
  ...base,
  slug: 'jurimetria-jec-distribuicao-duracao',
  titulo: 'Jurimetria JEC — Distribuição do tempo observado por faixa de duração (amostra, 2025–2026)',
  tipoDocumento: 'JURIMETRIA',
  assunto: 'Distribuição de duração observada (faixas de dias)',
  subassunto: 'durationDistribution — todas as 9 linhas do arquivo',
  tags: [TAG_JEC],
  conteudo: `# JURIMETRIA JEC — DISTRIBUIÇÃO DO TEMPO OBSERVADO POR FAIXA

[DADO ESTATÍSTICO REAL] Tabela completa da chave **durationDistribution** do arquivo Atlas Forense — **todas as 9 linhas** da chave, sem corte. Faixas e contagens são literais; a ordenação por faixa é apenas apresentacional.

## Tabela completa (amostra de 200 processos por grupo)
| Município | Ano | Faixa (literal) | Processos |
|---|---|---|---|
| Belo Horizonte | 2025 | 0–30 dias | 2 |
| Belo Horizonte | 2025 | 31–90 dias | 24 |
| Belo Horizonte | 2025 | 91–180 dias | 131 |
| Belo Horizonte | 2025 | 181–365 dias | 43 |
| Belo Horizonte | 2026 | 0–30 dias | 200 |
| Betim | 2025 | 31–90 dias | 1 |
| Betim | 2025 | 91–180 dias | 112 |
| Betim | 2025 | 181–365 dias | 87 |
| Betim | 2026 | 0–30 dias | 200 |

## Somas por grupo (aritmética de conferência)
- Belo Horizonte 2025: 2 + 24 + 131 + 43 = 200 (completa a amostra).
- Belo Horizonte 2026: 200 (uma única faixa no arquivo).
- Betim 2025: 1 + 112 + 87 = 200 (completa a amostra).
- Betim 2026: 200 (uma única faixa no arquivo).

## Definição e alerta do arquivo (LITERAIS — governam a leitura desta tabela)
- **definicaoTempo:** "${LIT_DEFINICAO_TEMPO}"
- **alertaTempo:** "${LIT_ALERTA_TEMPO}"
- **alerta2026:** "${LIT_ALERTA_2026}"

## Como ler (sem inferir)
- "Duração" aqui = tempo observado entre ajuizamento e último movimento público disponível, conforme definição literal — o arquivo alerta que NÃO é duração definitiva nem tempo até sentença.
- Em 2026 (recorte parcial), os 200 processos de cada município estão na faixa 0–30 dias — consequência aritmética de medir processos recentes a partir do ajuizamento; comparar as faixas de 2025 com as de 2026 sem considerar o alerta2026 seria leitura equivocada. O EJC apresenta os dados com os alertas anexados.`,
  metadados: {
    origem_arquivo: 'upload/Demandas no Juizado Especial.zip → jecDashboardData.ts (Atlas Forense)',
    chave_fonte: 'durationDistribution',
    registros_totais: 9,
    recorte: '01/01/2025 a 26/08/2026',
    classe: '436 — Procedimento do Juizado Especial Cível',
    hashBaseProcessos: HASH_BASE,
    chaves_usadas: ['meta', 'durationDistribution'],
    chaves_proibidas: ['processRows', 'timelineEvents'],
    tipo_dado: 'DADO ESTATISTICO REAL',
  },
  relacionamentos: [
    { destinoSlug: 'jurimetria-jec-visao-geral-bh-betim-2025-2026', tipo: 'COMPLEMENTA', descricao: 'Tempos médio/mediano do mesmo painel.' },
    { destinoSlug: 'jurimetria-jec-metodologia-fontes-limitacoes', tipo: 'COMPLEMENTA', descricao: 'Definição de tempo observado e limitações.' },
    { destinoSlug: 'fluxo-jec-pedido-a-execucao', tipo: 'CONEXO_TEMATICO', descricao: 'Etapas do procedimento do JEC — contexto das faixas de dias observadas.' },
  ],
} satisfies InputDocument;

// ---------- DOC 5 — SÉRIE MENSAL / CENSO ----------
const doc5: InputDocument = {
  ...base,
  slug: 'jurimetria-jec-serie-mensal-censo',
  titulo: 'Jurimetria JEC — Série mensal: distribuições e baixas definitivas (amostra × censo territorial, 2025–2026)',
  tipoDocumento: 'JURIMETRIA',
  assunto: 'Série mensal de distribuições e baixas definitivas',
  subassunto: 'timeline (movimento_observado — amostra) + timelineCensus (oficial_confirmado — censo)',
  tags: [TAG_JEC],
  conteudo: `# JURIMETRIA JEC — SÉRIE MENSAL: DISTRIBUIÇÕES E BAIXAS DEFINITIVAS

[DADO ESTATÍSTICO REAL] Tabela mensal condensada das chaves **timeline** (amostra de 200 processos; fonteStatus literal "movimento_observado") e **timelineCensus** (censo territorial; fonteStatus literal "oficial_confirmado") do arquivo Atlas Forense — 20 meses × 2 municípios em cada chave. Todos os valores são literais.

## Alertas e definição do arquivo (LITERAIS — governam esta tabela)
- **alertaTimeline:** "${LIT_ALERTA_TIMELINE}"
- **definicaoBaixaCenso:** "${LIT_DEFINICAO_BAIXA_CENSO}"
- **alerta2026:** "${LIT_ALERTA_2026}"

## Belo Horizonte — série mensal
| Mês | Distribuições (amostra) | Baixas (amostra) | Distribuições (censo) | Baixas (censo) |
|---|---|---|---|---|
| 2025-01 | 0 | 0 | 3289 | 0 |
| 2025-02 | 0 | 0 | 4034 | 0 |
| 2025-03 | 0 | 0 | 3700 | 0 |
| 2025-04 | 0 | 0 | 4113 | 0 |
| 2025-05 | 0 | 0 | 4500 | 0 |
| 2025-06 | 0 | 0 | 4228 | 0 |
| 2025-07 | 0 | 0 | 4916 | 0 |
| 2025-08 | 0 | 0 | 4202 | 0 |
| 2025-09 | 0 | 0 | 4469 | 4 |
| 2025-10 | 0 | 0 | 5052 | 95 |
| 2025-11 | 0 | 0 | 4268 | 199 |
| 2025-12 | 200 | 0 | 3655 | 274 |
| 2026-01 | 0 | 1 | 4017 | 221 |
| 2026-02 | 0 | 8 | 4590 | 871 |
| 2026-03 | 0 | 9 | 6086 | 1403 |
| 2026-04 | 0 | 6 | 5300 | 1587 |
| 2026-05 | 0 | 4 | 4996 | 2149 |
| 2026-06 | 0 | 15 | 3747 | 1656 |
| 2026-07 | 200 | 2 | 621 | 553 |
| 2026-08 | 0 | 0 | 0 | 0 |

## Betim — série mensal
| Mês | Distribuições (amostra) | Baixas (amostra) | Distribuições (censo) | Baixas (censo) |
|---|---|---|---|---|
| 2025-01 | 0 | 0 | 291 | 0 |
| 2025-02 | 0 | 0 | 305 | 0 |
| 2025-03 | 0 | 0 | 331 | 0 |
| 2025-04 | 0 | 0 | 272 | 0 |
| 2025-05 | 0 | 0 | 398 | 0 |
| 2025-06 | 0 | 0 | 390 | 0 |
| 2025-07 | 0 | 0 | 427 | 0 |
| 2025-08 | 0 | 0 | 385 | 0 |
| 2025-09 | 0 | 0 | 379 | 0 |
| 2025-10 | 0 | 0 | 493 | 0 |
| 2025-11 | 0 | 0 | 377 | 0 |
| 2025-12 | 200 | 0 | 328 | 1 |
| 2026-01 | 0 | 0 | 426 | 1 |
| 2026-02 | 0 | 1 | 350 | 29 |
| 2026-03 | 0 | 0 | 541 | 24 |
| 2026-04 | 0 | 13 | 502 | 55 |
| 2026-05 | 0 | 2 | 498 | 49 |
| 2026-06 | 125 | 2 | 384 | 38 |
| 2026-07 | 75 | 0 | 75 | 21 |
| 2026-08 | 0 | 0 | 0 | 0 |

## Como ler as duas séries (sem inferir)
- **Amostra (timeline):** contagens observadas nos 200 processos amostrados por município/ano; o arquivo marca cada linha com fonteStatus "movimento_observado". Os picos (BH 2025-12 e 2026-07; Betim 2025-12 e 2026-06/07) são os valores literais da chave — o arquivo não explicita a razão da distribuição dos picos entre meses, e o EJC não especula.
- **Censo (timelineCensus):** censo territorial completo do coorte 2025–2026; cada linha marcada com fonteStatus "oficial_confirmado". 2026-08 = 0/0 em ambos os municípios (recorte parcial até 26/08/2026 — alerta2026).
- Os filtros de assunto e órgão NÃO recalculam o censo mensal (alertaTimeline literal) — esta tabela é territorial.`,
  metadados: {
    origem_arquivo: 'upload/Demandas no Juizado Especial.zip → jecDashboardData.ts (Atlas Forense)',
    chave_fonte: ['timeline', 'timelineCensus'],
    fonteStatus_amostra: 'movimento_observado',
    fonteStatus_censo: 'oficial_confirmado',
    meses: 20,
    recorte: '01/01/2025 a 26/08/2026',
    classe: '436 — Procedimento do Juizado Especial Cível',
    hashBaseProcessos: HASH_BASE,
    chaves_usadas: ['meta', 'timeline', 'timelineCensus'],
    chaves_proibidas: ['processRows', 'timelineEvents'],
    tipo_dado: 'DADO ESTATISTICO REAL',
  },
  relacionamentos: [
    { destinoSlug: 'jurimetria-jec-visao-geral-bh-betim-2025-2026', tipo: 'COMPLEMENTA', descricao: 'Censo consolidado por município/ano do mesmo painel.' },
    { destinoSlug: 'jurimetria-jec-metodologia-fontes-limitacoes', tipo: 'COMPLEMENTA', descricao: 'Definição de baixa definitiva e limitações da série.' },
    { destinoSlug: 'jurimetria-jec-distribuicao-duracao', tipo: 'CONEXO_TEMATICO', descricao: 'Faixas de tempo observado na mesma amostra.' },
  ],
} satisfies InputDocument;

// ---------- DOC 6 — METODOLOGIA, FONTES E LIMITAÇÕES ----------
const doc6: InputDocument = {
  ...base,
  slug: 'jurimetria-jec-metodologia-fontes-limitacoes',
  titulo: 'Jurimetria JEC — Metodologia, fontes e limitações (honestidade metodológica do painel BH/Betim)',
  tipoDocumento: 'JURIMETRIA',
  assunto: 'Metodologia, fontes e limitações da jurimetria JEC',
  subassunto: 'meta completo, amostragem, alertas e regras de consulta DataJud',
  tags: [TAG_JEC, 'geral/metodologia'],
  conteudo: `# JURIMETRIA JEC — METODOLOGIA, FONTES E LIMITAÇÕES

Documento de honestidade metodológica do LOTE-022. Descreve, a partir do próprio arquivo-fonte, o que os números do painel Jurimetria JEC significam, como foram obtidos e o que eles NÃO provam. Nenhum número jurídico foi inferido, interpolado ou extrapolado pelo EJC.

## 1. Origem e meta completo do arquivo (literal)
| Campo | Valor literal |
|---|---|
| titulo | Painel Jurimetria JEC — Belo Horizonte e Betim |
| recorte | 01/01/2025 a 26/08/2026 |
| coletaDataJud | 25/08/2026 |
| consolidacao | 26/08/2026 |
| classe | 436 — Procedimento do Juizado Especial Cível |
| fonte | API Pública DataJud/CNJ — índice TJMG |
| hashBaseProcessos | ${HASH_BASE} |

- O arquivo declara-se "dados consolidados de fonte pública e sem dados pessoais" (declaração do próprio Atlas Forense).
- O hashBaseProcessos identifica a base de processos consolidada sem expor os números de processos — o EJC registra o hash como rastreabilidade e NÃO ingere números de processos individuais.
- Caminho da fonte: anexo do cliente "Demandas no Juizado Especial.zip" → arquivo jecDashboardData.ts (Atlas Forense), extraído para ingestão.
- Sobre a confiabilidade "B": os dados partem da API pública DataJud/CNJ (domínio oficial cnj.jus.br), mas a consolidação usada pelo EJC é um arquivo fornecido pelo cliente, não captura direta do EJC — por isso B (institucional confiável via consolidação), e não A (fonte oficial confirmada diretamente).

## 2. Definições do arquivo (LITERAIS)
- **definicaoTempo:** "${LIT_DEFINICAO_TEMPO}"
- **definicaoBaixaCenso:** "${LIT_DEFINICAO_BAIXA_CENSO}"

## 3. Todos os alertas do arquivo (LITERAIS)
- **alertaTempo:** "${LIT_ALERTA_TEMPO}"
- **alerta2026:** "${LIT_ALERTA_2026}"
- **alertaTimeline:** "${LIT_ALERTA_TIMELINE}"

## 4. Amostragem (200 processos por recorte)
- O painel trabalha com **amostra de 200 processos em cada recorte (município × ano)** — campos processosAmostra = 200 em todas as 4 linhas do summary.
- Cobertura declarada da amostra sobre o censo (campo coberturaAmostraPct, literal): Belo Horizonte 2025 = 0.4%; Belo Horizonte 2026 = 0.68%; Betim 2025 = 4.57%; Betim 2026 = 7.2%.
- Em todos os grupos, comUltimoMovimento = 200 (toda a amostra com último movimento válido).
- Consequência registrada: as estimativas (tempos, causas, faixas) descrevem a AMOSTRA; o censo (50426 + 29357 + 4376 + 2776 processos por grupo, literais do summary) só aparece nas séries de distribuições/baixas (timelineCensus, marcadas "oficial_confirmado"). O EJC não estende resultados da amostra ao censo.

## 5. Limitações explícitas (o que estes dados NÃO são)
- **2026 é parcial** (até 26/08/2026 — alerta2026): qualquer comparação 2025 × 2026 precisa considerar o recorte truncado.
- **Tempo observado ≠ duração definitiva**: por definição literal, é o tempo até o último movimento público disponível — não é tempo até sentença nem duração total do processo; processos sem último movimento válido são excluídos da média (alertaTempo).
- A contagem por causa em causeStats não é mutuamente exclusiva dentro de cada amostra (somas 352/348/334/261 > 200 — constatação aritmética dos dados).
- O EJC não realizou captura própria nesta rodada: herda a consolidação do cliente. Re-captura direta na API DataJud é o caminho recomendado para elevar a confiabilidade a A.

## 6. Consulta processual direta via API DataJud (regra do sistema)
- A consulta processual direta (processo a processo, incluindo movimentos) via API pública DataJud/CNJ **exige chave de API oficial** — no EJC, configurada pela variável de ambiente **DATAJUD_API_KEY**.
- Regra de degradação honesta do EJC: **sem a chave configurada, a consulta direta deve declarar-se indisponível** (mensagem explícita de que a chave oficial não está configurada) — nunca simular resposta, nunca inventar movimentos processuais, nunca exibir dados fabricados no lugar do retorno real.
- Com a chave configurada, o retorno deve ser exibido com fonte ("API Pública DataJud/CNJ"), data da consulta e link de referência (${URL_FONTE}) — mesma rastreabilidade exigida de todo documento do banco.

## 7. Regras do LOTE-022 no EJC
- Ingeridas somente as chaves agregadas: meta, summary, unitStats, causeStats, durationDistribution, timeline, timelineCensus.
- **processRows e timelineEvents NÃO foram ingeridos** (contêm números de processos individuais) — regra absoluta de privacidade e de escopo estatístico do lote.
- Verificação LGPD executada por script sobre TODO o conteúdo final dos 6 documentos (regex de CPF, e-mail e telefone + termos de partes do processo seguidos de dois-pontos, nos três polos), com resultado registrado no worklog: zero CPFs, zero e-mails, zero números de telefone reais e zero menções a partes/profissionais identificadas. A regex de telefone casou apenas com o intervalo de anos citado dentro das definições literais do meta (falso positivo — intervalo de anos, mantido por exigência de literalidade das definições).
- Tipo de documento: JURIMETRIA para todos os 6 (Banco 15 — dados estatísticos reais; nunca inventados).`,
  metadados: {
    origem_arquivo: 'upload/Demandas no Juizado Especial.zip → jecDashboardData.ts (Atlas Forense)',
    chave_fonte: 'meta',
    hashBaseProcessos: HASH_BASE,
    recorte: '01/01/2025 a 26/08/2026',
    classe: '436 — Procedimento do Juizado Especial Cível',
    coletaDataJud: '25/08/2026',
    consolidacao: '26/08/2026',
    amostra_por_recorte: 200,
    coberturaAmostraPct: { 'BH 2025': 0.4, 'BH 2026': 0.68, 'Betim 2025': 4.57, 'Betim 2026': 7.2 },
    chaves_usadas: ['meta', 'summary', 'unitStats', 'causeStats', 'durationDistribution', 'timeline', 'timelineCensus'],
    chaves_proibidas: ['processRows', 'timelineEvents'],
    env_necessaria: 'DATAJUD_API_KEY (consulta processual direta — degradação honesta sem chave)',
    tipo_dado: 'DADO ESTATISTICO REAL + METODOLOGIA',
  },
  relacionamentos: [
    { destinoSlug: 'jurimetria-metodologia-ejc', tipo: 'COMPLEMENTA', descricao: 'Metodologia geral do banco de Jurimetria EJC (separadores DADO REAL × ANÁLISE).' },
    { destinoSlug: 'jurimetria-jec-visao-geral-bh-betim-2025-2026', tipo: 'COMPLEMENTA', descricao: 'Visão geral com summary e alertas.' },
    { destinoSlug: 'lei-10259-jec-federal-competencia-60sm', tipo: 'CONEXO_TEMATICO', descricao: 'JEC Federal — conexo temático (painel cobre JEC estadual TJMG, classe 436).' },
    { destinoSlug: 'lei-9099-arts-41-43-recurso-inominado', tipo: 'CONEXO_TEMATICO', descricao: 'Recurso inominado no JEC — fase recursal não medida pelo tempo observado.' },
  ],
} satisfies InputDocument;

// LOTE-022 completo — 6 documentos
const lote022: InputDocument[] = [doc1, doc2, doc3, doc4, doc5, doc6];
export default lote022;
