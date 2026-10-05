# Higienização e simplificação do sistema — pente fino (out/2026)

Auditoria completa do repositório (`pente fino`) seguida de higienização: remoção de código morto,
dependências não utilizadas e artefatos órfãos, com regressão integral após cada corte.

## Método

1. **Baseline**: `tsc --noEmit` limpo + `vitest run` 145/145 (42 arquivos) antes de qualquer mudança.
2. **Grafo de imports**: varredura de todos os `import`/`require`/`@import`/`<script src>` do projeto
   (client, server, shared, configs) e fechamento de alcançabilidade a partir dos entry points reais
   (`client/index.html` → `main.tsx`, `server/_core/index.ts`, testes Vitest, `drizzle/schema.ts` e scripts).
3. **Cruzamento com dependências**: `package.json` × especificadores importados em código vivo.
4. **Verificação manual de cada candidato** (falsos positivos excluídos: imports side-effect de CSS,
   toolchain referenciada só por configs, logs de comentário JSDoc).
5. **Regressão completa** após os cortes: `tsc --noEmit`, `vitest run`, `vite build` e smoke test
   no navegador com inspeção de console em 8 páginas.

## O que foi removido (71 arquivos, ~13.800 linhas)

### Client
- **51 de 53 componentes `client/src/components/ui/`** (biblioteca shadcn/ui): apenas `sonner.tsx`
  e `tooltip.tsx` são alcançáveis (via `App.tsx`); todo o restante só era importado por outros
  arquivos mortos. A biblioteca pode ser regenerada sob demanda pelo shadcn CLI
  (`components.json` permanece no repositório).
- **Componentes de template Manus**: `AIChatBox.tsx`, `DashboardLayout.tsx`,
  `DashboardLayoutSkeleton.tsx`, `ManusDialog.tsx`, `Map.tsx`.
- **Páginas demo/órfãs**: `ComponentShowcase.tsx` (galeria de componentes do template) e
  `NotFound.tsx` (não roteada — o fallback de rota do `App.tsx` é a Home).
- **Hooks não usados**: `useComposition.ts`, `useMobile.tsx`, `usePersistFn.ts`.

### Server
- `server/index.ts` — bootstrap duplicado (versão estática do template, sem tRPC; o real é
  `server/_core/index.ts`, usado pelos scripts `dev`/`build`).
- `server/storage.ts` — helper S3/Forge do template Manus; o proxy em uso é `server/_core/storageProxy.ts`.
- `server/_core/dataApi.ts`, `heartbeat.ts`, `imageGeneration.ts`, `map.ts`, `voiceTranscription.ts` —
  módulos de plataforma nunca referenciados.
- `server/_core/types/cookie.d.ts` — shim de tipos redundante (o pacote `cookie` já embarca tipos).

### Shared / Drizzle
- `shared/types.ts` — barrel de tipos sem nenhum importador.
- `drizzle/relations.ts` — arquivo gerado não referenciado (o `drizzle.config.ts` usa só `schema.ts`).

### Dependências (46 removidas do `package.json`)
- **Radix UI**: 25 pacotes (`accordion`, `alert-dialog`, `aspect-ratio`, `avatar`, `checkbox`,
  `collapsible`, `context-menu`, `dialog`, `dropdown-menu`, `hover-card`, `label`, `menubar`,
  `navigation-menu`, `popover`, `progress`, `radio-group`, `scroll-area`, `select`, `separator`,
  `slider`, `slot`, `switch`, `tabs`, `toggle`, `toggle-group`) — mantido apenas `react-tooltip`.
- **Bibliotecas só em código morto**: `react-hook-form`, `@hookform/resolvers`,
  `class-variance-authority`, `cmdk`, `date-fns`, `embla-carousel-react`, `input-otp`,
  `react-day-picker`, `react-resizable-panels`, `streamdown`, `vaul`.
- **Templates/plataforma**: `framer-motion` (zero imports), `@aws-sdk/client-s3`,
  `@aws-sdk/s3-request-presigner` (só em `storage.ts` removido).
- **Toolchain sem uso**: `add` (instalação acidental), `autoprefixer` + `postcss` (Tailwind v4 via
  plugin Vite, sem `postcss.config`), `tailwindcss-animate` (o CSS usa `tw-animate-css`),
  `@tailwindcss/typography` (nenhuma referência), `@types/google.maps` (só em `Map.tsx`),
  `pnpm` (redundante com o campo `packageManager`/corepack).

## O que foi verificado e MANTIDO (não é morto)

- `recharts` (Home/AdvancedEvidencePanel), `jspdf` + `html-to-image` (ThesisEvidenceMap),
  `axios` + `jose` (server/_core/sdk.ts), `nanoid` (vite.ts), `next-themes` (ui/sonner),
  `cookie` (oauth), `clsx` + `tailwind-merge` (lib/utils → ui/tooltip).
- `patches/wouter@3.7.1.patch` — **ativo**: configurado em `pnpm-workspace.yaml` (`patchedDependencies`).
- `template.json`, `todo.md`, `ideas.md`, `QA.md` — metadados da plataforma e registros históricos do projeto.
- Scripts operacionais (`scripts/collect-*.mjs`, `import-*.mjs`, seeds, `configure-djen-oab.ts`) —
  reprodutibilidade dos datasets `data/*.json` e bootstrap do ambiente.
- `console.log` dos agendadores `[DJEN]`/`[JURIS]` — observabilidade operacional intencional.

## Achados de ambiente (corrigidos no mesmo passe)

1. **Árvore de trabalho ruidosa**: 324 arquivos apareciam como modificados por mudança de modo
   (100644→100755, efeito da restauração do ambiente). Normalizado com `git config core.fileMode false`.
2. **Datadir MySQL em estado antigo**: o snapshot restaurado tinha 22 tabelas (era Compêndio),
   **sem as 7 tabelas `office_*` e sem a coluna `priority`** (migração `0009` não aplicada) — o que
   derrubava a query de `sources.list` em `/fontes`. Corrigido com `pnpm db:push` (29 tabelas) e
   re-semeadura (`seed-p0-sources` 7 fontes P0, `seed-office-demo`, `configure-djen-oab`).

## Regressão executada após a higienização

| Verificação | Resultado |
|---|---|
| `tsc --noEmit` | limpo |
| `vitest run` | **145/145** (42 arquivos) |
| `vite build` | sucesso (7,2 s) |
| Navegador (/, /compendio, /fontes, /escritorio/clientes, /escritorio/comunicacoes, /escritorio/jurisprudencia, /controle, /rmbh, /nacional) | renderizam; único erro de console é o **403 do catálogo STJ** — degradação graciosa documentada (anti-bot do sandbox) |
| Fluxo "Calcular pelo teor" | extrai prazo do teor, pré-preenche e calcula com memória auditável (DJe 05/10/2026 → publicação 06/10 → início 07/10 → 15 úteis) |

## Efeito

- Repositório: −71 arquivos, **−13.797 linhas**, −46 dependências; lockfile podado.
- Build: menos superfície de análise para o TypeScript/bundler; `node_modules` menor.
- Manutenção: o código restante é 100% alcançável a partir dos entry points — qualquer arquivo
  aberto no repositório tem função real no sistema.
