# Atlas Causal Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Criar um dashboard administrativo resumido que mostre a distribuição de fatos geradores ligados a dano moral e material, com resultados, revisão, cobertura e atualização das fontes.

**Architecture:** O dashboard consulta exclusivamente `ATLAS_CAUSAL_DATABASE_URL` por uma procedure tRPC administrativa. A agregação será feita no servidor sobre anotações e resultados sanitizados, sem expor partes, número CNJ bruto ou documentos integrais. A interface seguirá o shell visual do Atlas, com filtros de tipo causal e revisão, gráficos Recharts e limites metodológicos explícitos.

**Tech Stack:** TypeScript, tRPC, Drizzle/MySQL, React, Wouter, Recharts, Tailwind/CSS Atlas.

**Spec:** Solicitação do usuário de 14/10/2026: distribuição das causas e fatos geradores de danos morais e materiais.

## Global Constraints

- Banco do Atlas Causal isolado; nunca usar `DATABASE_URL` como fallback.
- Apenas dados agregados e sanitizados no dashboard.
- Fato gerador preliminar deve permanecer marcado como pendente quando não houver revisão humana.
- Jurimetria descritiva; não apresentar taxa ou probabilidade de êxito.
- Fontes e atualização devem ser visíveis; atualização diária é indicada como status de fonte, não inventada.

## Review Focus

- Banco causal desligado: a tela deve mostrar estado indisponível sem quebrar o Atlas Métrico.
- Zero anotações: gráficos e tabelas devem exibir estado vazio compreensível.
- Mistura de pedidos e fatos geradores: o dashboard deve separar `role=fato_gerador` de `role=pedido`.
- Resultados não revisados: devem aparecer como pendentes, nunca como procedência confirmada.
- Dados pessoais ou CNJ bruto: não podem sair pela procedure agregada.

### Task 1: Contrato e agregação causal

**Files:**
- Create: `apps/atlas-forense/server/causal-dashboard.ts`
- Modify: `apps/atlas-forense/server/routers.ts`
- Test: `apps/atlas-forense/server/causal-dashboard.test.ts`

- [ ] Criar tipos e normalizador de dashboard.
- [ ] Implementar agregações isoladas de fatos geradores, pedidos, resultados, revisão, municípios e última execução.
- [ ] Expor `causal.dashboard` como procedure administrativa, com filtros opcionais `claimType` e `reviewStatus`.
- [ ] Testar separação de roles, conversão numérica, vazios e limites de privacidade.

### Task 2: Página administrativa

**Files:**
- Create: `apps/atlas-forense/client/src/pages/CausalDashboardPage.tsx`
- Modify: `apps/atlas-forense/client/src/App.tsx`
- Modify: `apps/atlas-forense/client/src/components/SiteNav.tsx`
- Modify: `apps/atlas-forense/client/src/index.css`

- [ ] Criar página protegida para administrador com cartões de resumo, barras de fatos geradores, distribuição por pedido e resultados.
- [ ] Adicionar filtros de tipo causal e estado de revisão.
- [ ] Exibir timestamp da última coleta, fonte, escopo, cobertura e avisos metodológicos.
- [ ] Adicionar rota `/causal` e entrada de navegação.
- [ ] Garantir responsividade e estados loading/erro/vazio.

### Task 3: Verificação

- [ ] Rodar testes unitários do contrato causal e dashboard.
- [ ] Rodar `pnpm check`, `pnpm test` e `pnpm build` do Atlas.
- [ ] Rodar `git diff --check` e auditar referências a `DATABASE_URL` fora do isolamento causal.
