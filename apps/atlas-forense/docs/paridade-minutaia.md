# Paridade com o MinutaIA — JuridIA (EJC) + Atlas Forense

**Data:** 2026-10-07 · **Escopo:** refatoração, limpeza e elevação do nível de IA para
paridade funcional com minutaia.com.br (referência de mercado no setor).

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

## 4. Lacunas remanescentes (roadmap honesto)

| MinutaIA | Estado no JuridIA |
| --- | --- |
| Editor com páginas/timbrado/histórico | editor Markdown rico existente; timbrado/paginado na tela ainda não |
| Geração em Lote com aprovação de molde | `batchId` já persistido; UI de lote com "aprove o molde" ainda não |
| Extensão de navegador (PJe/eproc/e-SAJ) | não aplicável ao escopo atual |
| Pesquisa por embeddings (BM25 + vetorial) | RAG TF-IDF suficiente para bases de escritório (~5k docs) |
| Stream de tokens na UI | etapas assíncronas com progresso, sem streaming por token |
| Multi-instituição / planos | cota por usuário existe; cobrança fora do escopo |

## 5. Operação

- **Envs novas**: nenhuma além das já documentadas (`docs/ejc-sso-ativacao.md` §4 e
  `deploy/atlas.env.example`).
- **Atalho JuridIA**: com `EJC_SSO_ENABLED=true` + issuer HTTPS, o SiteNav do Atlas
  exibe "Minutas · JuridIA" apontando para o issuer configurado.
- **Breaking change do Atlas**: `office.*` exige sessão — usuários anônimos deixam de ver
  dados do escritório (comportamento correto para dado confidencial).
