# Atlas Causal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: execute task-by-task with verification after each unit.

**Goal:** Criar uma camada isolada para mapear casos públicos individuais, documentos, fatos geradores, pedidos, resultados e evidências que originam as métricas de danos e obrigações.

**Architecture:** O Atlas Causal usará um schema Drizzle e uma conexão MySQL próprios, ativados somente por `ATLAS_CAUSAL_DATABASE_URL`. O banco e as tabelas não serão compartilhados com `DATABASE_URL` do Atlas Métrico. A primeira entrega será um vertical slice administrativo: contratos validados, persistência, migração e procedimentos tRPC para criar execuções, casos, documentos, anotações e resultados.

**Tech Stack:** TypeScript, Drizzle ORM/MySQL, tRPC, Zod, Vitest.

**Spec:** `docs/VARREDURA_MATURIDADE_ATLAS_JURIMETRIA.md`

## Global Constraints

- Manter o banco do Atlas Causal isolado do banco do Atlas Métrico.
- Não persistir nomes de partes, CPF, e-mail ou texto integral como requisito do primeiro slice.
- Toda classificação causal deve possuir origem, confiança e estado de revisão.
- Todo resultado publicado deverá apontar para ao menos uma evidência rastreável.
- Usar dados sintéticos nos testes.
- Não declarar taxa de êxito nem inferir resultado de mérito a partir de baixa processual.

## Review Focus

- Ausência de `ATLAS_CAUSAL_DATABASE_URL` deve desligar o módulo sem usar `DATABASE_URL` como fallback.
- Evidência sem fonte oficial ou hash não deve ser aprovada.
- Anotação causal não pode ser marcada como revisada sem `reviewedBy` e `reviewedAt`.
- Resultado monetário deve aceitar centavos não negativos e rejeitar formato inválido.
- Nenhum contrato causal deve aceitar dados pessoais identificáveis.

---

### Task 1: Schema e migração isolados

**Files:**
- Create: `apps/atlas-forense/drizzle/causal-schema.ts`
- Create: `apps/atlas-forense/drizzle-causal.config.ts`
- Create: `apps/atlas-forense/drizzle-causal/0000_causal_foundation.sql`
- Modify: `apps/atlas-forense/package.json`

**Produces:** tabelas e script `db:causal:generate`/`db:causal:migrate` usando somente `ATLAS_CAUSAL_DATABASE_URL`.

### Task 2: Contratos e validação causal

**Files:**
- Create: `apps/atlas-forense/server/causal-contract.ts`
- Test: `apps/atlas-forense/server/causal-contract.test.ts`

**Produces:** taxonomia controlada e validação de evidência, anotação e resultado.

### Task 3: Persistência e API administrativa

**Files:**
- Create: `apps/atlas-forense/server/causal-db.ts`
- Create: `apps/atlas-forense/server/causal-service.ts`
- Modify: `apps/atlas-forense/server/routers.ts`

**Produces:** procedimentos `causal.createRun`, `causal.createCase`, `causal.addDocument`, `causal.annotate`, `causal.getCase`.

### Task 4: Verificação

- Executar `pnpm check` e `pnpm test` em `apps/atlas-forense`.
- Executar `git diff --check`.
- Confirmar que nenhum arquivo novo referencia `DATABASE_URL` como conexão causal.
- Registrar limitações: ainda não há coletor individual DataJud nem UI causal.
