# Direções de design — Painel JEC BH & Betim

## Três abordagens avaliadas

### 1. Atlas Forense
**Very Brief Intro:** Um ambiente editorial de inteligência jurídica, com fundo de papel mineral, tipografia de relatório técnico e dados em camadas. Comunica rigor, rastreabilidade e leitura pausada.
**Probability:** 0.07

### 2. Sala de Controle Municipal
**Very Brief Intro:** Um painel de operação inspirado em mapas de comando, com contraste alto, sinais cromáticos e leitura rápida por município. Privilegia decisão comparativa e filtros vivos.
**Probability:** 0.04

### 3. Caderno de Jurimetria
**Very Brief Intro:** Uma linguagem de caderno de pesquisa, com marcações, fichas de evidência e visualizações que parecem parte de um dossiê técnico. Cria intimidade sem perder precisão.
**Probability:** 0.08

## Abordagem escolhida — Atlas Forense

**Design Movement:** Editorial jurídico contemporâneo com influência de relatórios de pesquisa e cartografia analítica.

**Core Principles:** Dados devem parecer evidência, não decoração; a hierarquia visual deve separar censo, amostra e inferência; filtros devem ser visíveis e explicáveis; densidade informacional deve conviver com áreas generosas de respiro.

**Color Philosophy:** Fundo em marfim mineral para reduzir fadiga; verde-petróleo para Belo Horizonte, cobre queimado para Betim e vermelho-terra apenas para alertas metodológicos. As cores identificam o território sem sugerir desempenho ou mérito.

**Layout Paradigm:** Uma coluna lateral de contexto fixo encontra uma superfície central escalonada; os gráficos ocupam cartões assimétricos e os indicadores se organizam como placas de dossiê, não como widgets genéricos.

**Signature Elements:** Linha vertical de “trilha de evidência”; etiquetas de fonte como `DataJud / amostra`; cartões com cantos cortados sutis; régua temporal parcial de 2026.

**Interaction Philosophy:** Todo filtro recalcula o painel e atualiza a evidência metodológica. Tooltips esclarecem o que cada métrica pode ou não afirmar.

**Animation:** Entrada em cascata curta para indicadores e painéis; transições de 180–240 ms apenas em opacidade e transformação; respeito a `prefers-reduced-motion`.

**Typography System:** Fraunces para títulos e Source Sans 3 para dados e controles. Títulos usam peso semibold e serifas expressivas; valores usam algarismos tabulares em caixa baixa visualmente estável.

**Brand Essence:** Inteligência jurimétrica rastreável para comparar a litigiosidade do JEC em Belo Horizonte e Betim. Personalidade: criteriosa, serena, investigativa.

**Brand Voice:** Manchetes objetivas e verificáveis; microcopy que delimita a prova. Exemplos: “O volume muda; o denominador permanece explícito.” e “Movimento observado não é taxa de êxito.”

**Wordmark & Logo:** Um monograma geométrico formado por duas colunas de processo e uma linha de evidência, sugerindo BH e Betim sem usar texto.

**Signature Brand Color:** Verde-petróleo `#154B4A`.

## Style Decisions

- Utilizar a abordagem Atlas Forense integralmente.
- Exibir sempre a ressalva de que 2026 é parcial e que tempo é calculado até o último movimento disponível, não duração definitiva do processo.
- Não usar fundos roxos, gradientes genéricos, Inter nem cartões excessivamente arredondados.
- Tratar cada gráfico como ficha de evidência: canto cortado, etiqueta técnica, filete de fonte e marca de dossiê.
- Repetir a trilha de evidência entre censo, amostra, unidades e tempo, usando uma linha editorial lateral no desktop.
- Representar 2026 parcial com uma régua de oito meses observados e quatro meses futuros em vermelho-terra discreto.
