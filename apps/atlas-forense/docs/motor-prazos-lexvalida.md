# Motor de prazos LexValida — portabilidade e validação

Atlas Forense · Painel JEC BH e Betim · Tasks 3–4 reconstruídas e validadas em 04/10/2026

## Proveniência

Motores determinísticos do **LexValida** (FastAPI + PostgreSQL, enviado pelo usuário)
portados para TypeScript compartilhado entre servidor e navegador:

| LexValida (Python) | Atlas Forense (TypeScript) |
|---|---|
| `app/core/prazos.py` | `shared/prazos-module.ts` |
| `app/core/prescricao.py` | `shared/prescricao-module.ts` |
| `app/servicos/intimacoes.py` (RX_PRAZO) | `shared/prazos-module.ts` (`extrairPrazoDoTeor`) |
| `app/core/texto.py` (normalizar) | `shared/prazos-module.ts` (`normalizarTexto`) |

## Base normativa implementada

- **CPC, art. 219** — prazos processuais em dias úteis.
- **CPC, art. 220** — suspensão de 20/12 a 20/01, inclusive.
- **CPC, art. 224, caput e §§ 2º–3º** — exclui o dia do começo; publicação no DJe no
  1º dia útil seguinte à disponibilização; contagem a partir do 1º dia útil seguinte.
- **Lei 11.419/2006, art. 5º, §§ 1º–3º** — intimação por portal: consulta tempestiva
  prevalece; sem consulta, 10 dias corridos do envio; consulta em dia não útil
  considera-se no 1º útil seguinte.
- **CPC, arts. 180, 183, 186 e 229** — prazo em dobro (MP, Fazenda, Defensoria,
  litisconsortes); § 2º do art. 229 afasta a dobra em autos eletrônicos.
- **CPP, art. 798, caput e § 3º** — contagem contínua; vencimento em dia sem expediente
  prorroga para o 1º dia útil seguinte.
- **CC, arts. 132 § 3º, 202, 205, 206** — prescrição (29/02 → 01/03; interrupção única).
- **CPC, art. 921; Lei 6.830/1980, art. 40; STF Súmula 150; STJ Súmula 314** —
  prescrição intercorrente (ritos CPC e LEF).
- Calendário: Páscoa (Meeus/Jones/Butcher), feriados nacionais (Lei 662/1949;
  Lei 6.802/1980 — 12/10; Lei 14.759/2023 — 20/11), dias forenses usuais opcionais,
  feriados locais informáveis.

## Extração de prazo do teor

`extrairPrazoDoTeor` aceita os três padrões oficiais do LexValida
("prazo de N dias", "em/no prazo de N dias", "N dias para") com unidade opcional
(úteis/corridos). **Sem prazo declarado → nulo: o sistema não presume o prazo do ato.**

### Extensão Atlas — prazos por extenso (Task 4)

O RX_PRAZO original casa apenas dígitos (`\d{1,3}`): um teor com "no prazo de **dez**
dias" não era extraído e o cálculo caía no fallback. A extensão
`expandirNumerosExtenso` converte por extenso em dígitos **somente para extração**:

- tabela 1–500 (unidades, teens, dezenas, cem, centenas, femininas);
- compostos ("vinte e cinco" → 25) processados **antes** dos simples;
- dígitos explícitos mantêm prioridade ("30 dias … quinze dias" → 30);
- faixa 1–365 preservada ("quinhentos dias" rejeitado);
- falso positivo bloqueado ("uma audiência" não vira prazo);
- texto original jamais alterado ou exibido.

## Validação executada em 04/10/2026

- 25 testes dedicados em `server/prazos-module.test.ts` (casos portados do
  `tests/test_nucleo.py` com mesmos valores esperados + casos novos de extenso,
  portal, dobra e intercorrente) e 19 em `server/office-connector.test.ts` (CNJ mod 97,
  LGPD, SRU, CKAN, dedupe, registro manual). Suíte total **145/145**.
- Casos de ponta conferidos manualmente:
  - disponibilização 28/09/2026 + 15 úteis DJe → **21/10/2026** (exclui 12/10);
  - disponibilização 29/09/2026 + 10 úteis DJe ("no prazo de dez dias") → **15/10/2026**;
  - disponibilização 30/09/2026 + 10 úteis DJe → **16/10/2026**;
  - ciência 29/09/2026 + 15 úteis → **21/10/2026**; ciência 26/09 + 15 úteis → **19/10/2026**;
  - reparação civil 04/05/2022 em 01/10/2026 → **PRESCRITA** (termo final 04/05/2025);
  - portal: consulta em sábado com feriado 07/09 → intimação 08/09/2026 (art. 5º § 2º).
- UI: botão "Calcular pelo teor" na comunicação do despacho pré-preencheu 29/09/2026,
  10 dias (extração por extenso) e exibiu memória auditável com a exclusão do 12/10
  (evidência `download/sincronizar-agora-djen.png`).

## Limites herdados e não portados

- Feriados locais e portarias de suspensão do tribunal devem ser informados
  (art. 216 do CPC) — o motor não os conhece por si só.
- Não portado neste ambiente (exige PostgreSQL/pgvector, internet e provedor LLM):
  forense de PDF (anti prompt-injection), protocolo de citações, RAG/embeddings,
  camada de IA do LexValida.
