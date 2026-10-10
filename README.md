# Jurídico Monorepo — Atlas Forense + JuridIA (EJC)

Unified monorepo that brings together the **data layer** (Atlas Forense) and the
**cognitive layer** (JuridIA — the "Cérebro Jurídico" / EJC) into a single
repository with shared TypeScript contracts.

```
juridico-monorepo/
├── apps/
│   ├── atlas-forense/   # data layer  (Vite + Express + tRPC + Drizzle + MySQL + pnpm)
│   └── juridia/         # cognitive layer (Next.js 16 + Prisma + SQLite + bun + z-ai-web-dev-sdk)
├── packages/
│   └── shared/          # @juridico/shared — pure TypeScript contracts (no runtime deps)
├── package.json         # monorepo root (workspaces)
└── README.md
```

## Apps

### `apps/atlas-forense/` — Atlas Forense (data layer)

Stack: **Vite + Express + tRPC + Drizzle + MySQL** (pnpm workspace).

Holds the public forensic data infrastructure:
- `client/` — Vite + React frontend (Compendium, Fontes, Nacional, Controle)
- `server/` — Express + tRPC backend, Drizzle ORM against MySQL
- `shared/` — neutral integration contracts (incl. `ejc-integration.ts` — now `active`)
- `data/`, `docs/`, `drizzle/`, `scripts/` — data, docs, migrations, tooling

Run:
```bash
cd apps/atlas-forense
pnpm install
pnpm dev
```

### `apps/juridia/` — JuridIA / Cérebro Jurídico (cognitive layer)

Stack: **Next.js 16 (App Router) + Prisma + SQLite + bun + z-ai-web-dev-sdk**.

Holds the cognitive engine and the OIDC identity provider:
- `src/app/api/` — 49+ API routes (brain, generate-minuta, lexvalida, citations, ...)
- `src/lib/` — 26 libs (legal_brain, rag_lite, citation_gate, evidence, ...)
- `src/components/app/` — 20 app components
- `prisma/` — Prisma schema (SQLite)
- `src/app/api/auth/oidc/` — OIDC IdP (discovery + token + jwks + verify)

Run:
```bash
cd apps/juridia
bun install
bun run dev   # serves on http://localhost:3000
```

## Shared package — `@juridico/shared`

Pure TypeScript contracts (types + manifests, **no runtime dependencies**) shared by
both apps so that an integration between Atlas and JuridIA is type-safe end-to-end.

| File | Purpose |
|------|---------|
| `ejc-integration.ts` | EJC integration manifest + OIDC auth bridge contract (`integrationMode: "active"`) |
| `prazos-module.ts` | `PrazoInput/Result`, `PrescricaoInput/Result` — shared by both apps' LexValida port |
| `citation-types.ts` | `CitationRef`, `VerifiedCitation`, `CitationGateResult`, `CITATION_PATTERNS` regex |
| `evidence-types.ts` | `EpistemicState`, `EvidenceItem`, `EvidenceRef`, `LegalAssertion` |
| `index.ts` | Barrel that re-exports every module |

Consume from either app:
```ts
import { ejcIntegrationManifest, CITATION_PATTERNS } from "@juridico/shared";
```

## Integration bridges

### 1. OIDC bridge — JuridIA is the Identity Provider (IdP)

`apps/juridia/src/app/api/auth/oidc/` exposes an OIDC-compatible IdP:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/oidc/.well-known/openid-configuration` | GET | OIDC discovery document |
| `/api/auth/oidc/token` | POST | Issues an HS256 JWT (`sub`, `role`, `persona`, `exp`) |
| `/api/auth/oidc/jwks` | GET | Returns the symmetric key descriptor (`kty: oct`, `alg: HS256`) |
| `/api/auth/oidc/verify` | POST | Validates a JWT and returns its claims (used by Atlas) |

Atlas Forense validates every issued JWT by calling JuridIA's `/api/auth/oidc/verify`.
The shared secret is `JURIDIA_JWT_SECRET` (env var on JuridIA; mirrored on Atlas).

### 2. REST API bridge — Atlas calls JuridIA's cognitive APIs

`apps/atlas-forense/server/juridia-bridge.ts` exposes typed helpers that call
JuridIA's REST endpoints with an `X-API-Token` auth header:

| Helper | Calls |
|--------|-------|
| `callCerebro(facts, persona)` | `POST {JURIDIA_API_URL}/api/brain` |
| `generateMinuta(template, facts, skills)` | `POST {JURIDIA_API_URL}/api/generate-minuta` |
| `getBiblioteca()` | `GET {JURIDIA_API_URL}/api/skills` + `/api/legal-sources` |
| `checkSalvaguardas(text)` | `POST {JURIDIA_API_URL}/api/salvaguardas` |

`JURIDIA_API_URL` defaults to `http://localhost:3000`.

### 3. Compendium → RAG sync — Atlas publishes, JuridIA consumes

Atlas exposes a service-to-service API for the Cérebro Jurídico (details in
`docs/integracao-cerebro-atlas.md`), authenticated by the shared bearer token
`ATLAS_BRAIN_API_TOKEN` (fail-closed: absent or shorter than 32 chars = 503):
- `GET  /api/internal/brain/compendium/search` — public Compêndio metadata (only citable source statuses)
- `GET  /api/internal/brain/jurimetry` — descriptive jurimetry with coverage and limits (no success rate, no magistrate ranking)
- `POST /api/internal/brain/theses` — approved theses from JuridIA enter the editorial queue as `pending_review`

JuridIA consumes it through `apps/juridia/src/lib/atlas_client.ts` (`/api/brain`
step 4) and returns theses through the authenticated `POST /api/atlas/theses`.

## Integration status

`packages/shared/ejc-integration.ts` ships with:
- `ejcIntegrationManifest.integrationMode === "active"` (was `"pending_approval"`)
- `ejcAuthBridge.mode === "enabled"` (was `"disabled"`)
- `ejcAuthBridge.provider === "juridia-oidc"` (EJC is now the IdP)

Confidentiality is preserved by contract — integration is by **routes and public
metadata only**. Any link to a specific case requires legal basis, authorization
and human review.

## Running both apps together

```bash
# from monorepo root
pnpm install   # installs concurrently (and hoists shared deps)
pnpm dev       # runs Atlas (Vite, :5173) + JuridIA (Next, :3000) concurrently
```

Or run each app in its own terminal:
```bash
pnpm dev:atlas
pnpm dev:juridia
```
