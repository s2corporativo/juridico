# Atlas Design Simplification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Simplificar a navegação e a hierarquia visual do Atlas Forense, preservando as funções existentes e tornando o fluxo principal mais legível.

**Architecture:** Manter o shell atual e consolidar a navegação global no `SiteNav`. A página inicial terá somente três atalhos locais; a navegação global terá rótulos curtos e grupos por intenção. O Atlas Causal receberá pequenos ajustes de densidade e hierarquia, sem alterar contratos de dados ou permissões.

**Tech Stack:** React, Wouter, TypeScript, CSS global do Atlas, Vitest, Vite.

**Spec:** Solicitação do usuário de 14/10/2026: refatorar o design do sistema, simplificar informações e fluxos e publicar no GitHub.

## Global Constraints

- Não remover rotas funcionais nem alterar contratos de API.
- Preservar `adminProcedure` e os limites de privacidade do Atlas Causal.
- Não incluir dependências novas.
- Publicar em branch própria; não fazer merge automático na base.
- Manter a identidade editorial Atlas: Fraunces, Source Sans 3, verde petróleo e cobre.

## Review Focus

- Navegação duplicada na Home: deve resultar em uma navegação global e, no máximo, três atalhos locais.
- Rótulos longos: devem permanecer legíveis em desktop e mobile sem clipping.
- Rota `/causal`: deve preservar autenticação, filtros, agregados e estados vazios.
- Breakpoint mobile: sidebar e ações superiores não podem criar overflow horizontal.
- Acessibilidade: links e selects devem manter nomes visíveis e foco nativo.

### Task 1: Simplificar navegação e Home

**Files:**
- Modify: `apps/atlas-forense/client/src/components/SiteNav.tsx`
- Modify: `apps/atlas-forense/client/src/pages/Home.tsx`
- Modify: `apps/atlas-forense/client/src/index.css`

- [ ] Reduzir grupos e rótulos do menu global sem remover destinos importantes.
- [ ] Converter os atalhos locais da Home para `Visão geral`, `Causas` e `Metodologia`.
- [ ] Ajustar espaçamento e título visual para distinguir navegação global de atalhos locais.

### Task 2: Refinar o fluxo do Atlas Causal

**Files:**
- Modify: `apps/atlas-forense/client/src/pages/CausalDashboardPage.tsx`
- Modify: `apps/atlas-forense/client/src/index.css`

- [ ] Reduzir texto introdutório repetido e tornar o objetivo do painel explícito em uma frase.
- [ ] Priorizar a sequência fato gerador → resultado → cobertura, mantendo as limitações em bloco único.
- [ ] Melhorar densidade dos filtros e ações no mobile.

### Task 3: Verificar e publicar

- [ ] Rodar testes, `pnpm check` e `pnpm build` do Atlas.
- [ ] Validar `/causal` visualmente no estado real e com dados simulados temporários.
- [ ] Rodar `git diff --check`, revisar arquivos e criar commit.
- [ ] Criar branch de publicação, fazer push e abrir Pull Request no GitHub.
