# Paridade com o MinutaIA — JuridIA (EJC) + Atlas Forense

**Data:** 2026-10-07 · **Escopo:** refatoração, limpeza e elevação do nível de IA para
paridade funcional com minutaia.com.br (referência de mercado no setor).
**Revisão 2 (mesma data):** fechamento das lacunas editor paginado/timbrado,
geração em lote com molde e streaming — ver §3.2 e §4 revisado.

## 1. O que o MinutaIA faz (modelo de referência)

- **Múltiplos perfis integrados**: combinação de perfis de IA para cada etapa da geração.
- **Processamento completo** do teor do processo em uma única operação.
- **Jurisprudência Inteligente**: pesquisa assistida por IA nos principais tribunais.
- **Aprendizado de Estilo**: reproduz o estilo de redação do advogado.
- **Anonimização local em mão dupla (tarja-1)**: detecção local, marcadores `[NOME_0001]`,
  reversão local; o provider só vê marcadores.
- **Habilidades (skills)**: pacotes de conhecimento auditáveis que orientam cada geração.
- **Editor de documento** com timbrado, histórico e sugestões da IA.
- **Geração em Lote** com aprovação da primeira minuta como molde.
- **Conformidade LGPD e Resolução CNJ 615/2025**.

## 2. Estado do JuridIA antes desta revisão (auditoria)

- Pipeline **single-shot** (1 chamada, `max_tokens 3000`, thinking desligado, sem revisão).
- Skills coladas integralmente no prompt, sem seleção por relevância.
- `brainContext` (Cérebro Jurídico) existia no store mas **nunca chegava** à geração.
- Estilo (`writingStyle`) existia no store mas **nunca chegava** ao prompt.
- Validação deontológica (`ai_governance`) só virava metadado de auditoria — invisível.
- **Bug de posse**: documento salvo sempre no usuário `demo@juridia.com.br`.
- **Contradição LGPD**: o mapa marcador→PII era persistido em `Document.markers`.
- Fallback offline retornava 200 silencioso (cliente não sabia que a IA falhou).
- Rota `legal-sources` com mutação pública; `/api/skills` expunha o texto integral.

## 3. Implementado nesta revisão (commits desta task)

### Pipeline multi-etapas (`src/lib/minuta_pipeline.ts` + `api/generate-minuta`)

| Etapa | Perfil | O que faz |
| --- | --- | --- |
| 0. Preparação | — | auth, pseudonimização reversível local (tarja-1), fatos + `brainContext` (pseudonimizado junto), roteamento de skills, RAG na base curada |
| 1. Roteiro | **Estrategista** | plano estruturado em JSON (teoria do caso, teses, seções, pedidos, riscos) |
| 2. Redação | **Redator sênior** | minuta completa guiada pelo plano, estilo, skills e referências (`max_tokens 6000`) |
| 3. Revisão | **Revisor sênior** | 2ª passada: corrige trechos específicos (match literal seguro) a partir dos achados do validador determinístico |
| 4. Validação | determinística | `validateResponse` → **violations agora visíveis ao advogado** na resposta e na UI |

### Paridade item a item

| MinutaIA | JuridIA agora |
| --- | --- |
| Múltiplos perfis | 3 perfis especializados (estrategista/redator/revisor) com telemetria por etapa |
| Jurisprudência Inteligente | RAG TF-IDF na base curada `LegalSource`; **referências rastreáveis** (diploma, número, URL oficial, score) retornadas e exibidas; regras de vedação de citação inventada |
| Aprendizado de Estilo | `writingStyle` (formal/objetivo/técnico) injetado no prompt de todas as etapas |
| Skills auditáveis | `skill_router` roteia skills aprovadas por relevância dos fatos; manuais têm prioridade; orçamento de contexto (top 6, ~10k chars); proveniência (`escolhida`/`roteada`) registrada |
| Anonimização mão dupla | pseudonimização/reidratação mantidas; **mapa de PII deixa de ser persistido** (vive só em memória da requisição) |
| Conformidade | relatório de conformidade na UI com vedações EOAB/CDC e marca de rascunho; `AgentRun`/`AgentRunStep` registram etapas, tokens e custo por geração |
| Fallback honesto | degradação sinalizada (`pipeline.degraded`), status `draft`, toast de ressalva |

### Correções de segurança/erros

1. **Posse do documento**: salvo no `authUser.uid` autenticado (antes: demo fixo); cota passa a debitar do usuário real.
2. **`legal-sources`**: `GET` autenticado; `POST/PATCH/DELETE` só admin (base curada afeta o Citation Gate).
3. **`/api/skills`**: exige sessão (conteúdo proprietário).
4. **`next.config.ts`**: `ignoreBuildErrors` removido (build falha com erro de tipo), `reactStrictMode` ativado.
5. **Navegação legada**: já resolvida na Task 13 (`resolveAppTab`).

### Atlas Forense (mesma revisão)

- **Governação de auth**: todos os 21 procedimentos `office.*` (CRM, comunicações, DJEN, jurisprudência do escritório) agora exigem sessão (`protectedProcedure`); `compendium.aiSummary`/`aiCompareRelated` também (custo de IA).
- **Design system consertado**: `:root` duplicado unificado; tokens semânticos (`--primary`, `--border`, `--muted-foreground`, `--destructive`, …) definidos e mapeados ao Tailwind v4 via `@theme inline` — ~160 usos que não renderizavam (incluindo a Fila Editorial, que era praticamente sem estilo) voltam a funcionar.
- **Navegação unificada**: novo `SiteNav` (Análise / Escritório / Sistema) nas 3 shells principais; atalho **"Minutas · JuridIA"** aparece automaticamente quando a ponte SSO está `enabled` (fail-closed, lê `integration.ejcStatus`).
- **Código morto removido**: `server/juridia-bridge.ts` (ponte REST nunca ativada — substituída pelo SSO), `server/compendium-api.ts` (rotas nunca registradas), `national-lower-pagination` (sem consumidor), `template.json` (scaffold), `todo.md`/`ideas.md` (histórico).

### JuridIA — limpeza (−63 MB / −1.100 arquivos)

- Removidos: `skills/` vendored (61 MB, 71 skills de plataforma sem uso pelo app), `examples/`, `mini-services/`, `download/`, `keepalive.out`, `worklog.md` histórico (158 KB), `tailwind.config.ts` (vestígio v3), stub `api/route.ts`, `agent_tools`/`agent_loop`/`compendium-sync`, 7 componentes órfãos (landing/app), 26 componentes `ui/` não usados, hook `use-mobile`.
- `package.json`: 68 → 24 dependências (todas verificadas por contagem de importadores).
- Testes: nova suíte `tests/minuta-pipeline.test.ts` (10 testes das funções puras do pipeline).

### 3.2 Revisão 2 — fechamento das três lacunas operáveis (mesma task)

#### Streaming na redação (`/api/generate-minuta/stream`)

- O pipeline inteiro foi extraído para `src/lib/minuta_run.ts` (`runMinutaPipeline`) —
  a rota JSON clássica e a rota SSE executam **a mesma implementação** (mesma auth,
  anonimização, telemetria, cota e auditoria); a diferença é apenas o transporte.
- A rota nova emite Server-Sent Events: `stage` (prepare/outline/draft/review/finalize),
  `draft` (delta incremental de tokens da REDAÇÃO via `stream: true` no provider) e
  `done` (payload completo idêntico ao da rota clássica).
- O gerador (`generator.tsx`) consome o stream e exibe a redação AO VIVO com
  auto-scroll e progresso real por etapa; se a rota de streaming não existir
  (deploy antigo), cai automaticamente para a rota clássica.
- E2E (`scripts/e2e-stream-batch.mjs`): 1.443 deltas (~5.100 chars), primeiro
  token visível em ~5,4 s (antes: 30 s sem nenhum feedback); negativa sem sessão → 401.

#### Geração em lote com aprovação de molde

- `GenerateMinutaRequest.moldContent`: quando presente, o prompt do redator recebe a
  **minuta-molde aprovada pelo advogado** como referência de estrutura/nível/tom,
  com regra explícita de NÃO reutilizar marcadores da molde (pertencem a outro caso).
- `normalizeMoldContent` limita a molde a 60k chars (teto de custo por caso do lote).
- `BatchPanel` (`components/app/batch-panel.tsx`): cole N casos (blocos separados por
  `---`, linhas `campo: valor` — aceita rótulo ou chave do template, com normalização
  de acentos), caso 1 gera a molde → revisão/edição inline → aprovar → geração
  sequencial dos restantes com progresso por caso, tokens, ressalvas e status
  degradado por item; todos os documentos ficam vinculados ao mesmo `batchId`.
  Limite honesto: 10 casos por lote.
- **Orquestração no cliente, decisão deliberada**: chamar a rota caso a caso evita
  timeouts de lote grande no servidor e dá progresso real; o servidor continua sendo
  a única fonte de verdade (auth, anonimização, telemetria, persistência por caso).
- E2E: caso 2 guiado pela molde do caso 1 — 200 OK, mesmo `batchId`, e **nenhum dado
  do caso 1 vazou** para o texto do caso 2.

#### Editor paginado com timbrado

- `src/lib/paginate.ts` (função pura + 9 testes): divide o Markdown em blocos e
  estima páginas A4 (12pt, entrelinha 1,75, margens 2,5 cm ≈ 33 linhas/página;
  1ª página com capacidade reduzida para o timbrado; blocos nunca são partidos).
- `PaginatedPreview` (`components/app/paginated-preview.tsx`): páginas A4 na tela
  (794×1123px), timbrado completo na 1ª página (escritório, advogado/OAB, endereço,
  contato) e linha curta de cabeçalho nas seguintes, rodapé "Página X de N".
- O timbrado deriva do **perfil do advogado** (store persistido) e é editável na
  própria aba via `LetterheadDialog` — nada novo é persistido no servidor.
- **Nota honesta**: a paginação na tela é ESTIMATIVA (contagem de linhas por bloco);
  a paginação REAL ao exportar é do navegador via `@page` (Ctrl+P → PDF).

## 4. Lacunas remanescentes (roadmap honesto, revisado)

| MinutaIA | Estado no JuridIA |
| --- | --- |
| Editor com páginas/timbrado | **FECHADO** — aba "Paginado" com timbrado (§3.2); resta histórico de sugestões da IA dentro do editor |
| Geração em Lote com aprovação de molde | **FECHADO** — `BatchPanel` com molde aprovável (§3.2); resta fila no servidor para lotes assíncronos muito grandes |
| Stream de tokens na UI | **FECHADO na redação** (§3.2); roteirista/revisor permanecem discretos (retornam JSON estruturado — não há o que "streamar" sem quebrar a extração de JSON) |
| Extensão de navegador (PJe/eproc/e-SAJ) | não aplicável ao escopo atual |
| Pesquisa por embeddings (BM25 + vetorial) | RAG TF-IDF suficiente para bases de escritório (~5k docs) |
| Multi-instituição / planos | cota por usuário existe; cobrança fora do escopo |

## 5. Operação

- **Envs novas**: nenhuma além das já documentadas (`docs/ejc-sso-ativacao.md` §4 e
  `deploy/atlas.env.example`).
- **Rota de streaming**: mesma autenticação da rota clássica (401 sem sessão); atrás de
  proxy reverso, o header `X-Accel-Buffering: no` já é enviado — se houver nginx na
  frente, garantir `proxy_buffering off;` para a rota `/api/generate-minuta/stream`.
- **Atalho JuridIA**: com `EJC_SSO_ENABLED=true` + issuer HTTPS, o SiteNav do Atlas
  exibe "Minutas · JuridIA" apontando para o issuer configurado.
- **Breaking change do Atlas**: `office.*` exige sessão — usuários anônimos deixam de ver
  dados do escritório (comportamento correto para dado confidencial).
