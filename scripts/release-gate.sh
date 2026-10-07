#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ATLAS="$ROOT/apps/atlas-forense"
JURIDIA="$ROOT/apps/juridia"
BUN_VERSION="${BUN_VERSION:-1.3.4}"

log() { printf '\n==> %s\n' "$*"; }

bun_exec() {
  if command -v bun >/dev/null 2>&1; then
    bun "$@"
  else
    npx -y "bun@${BUN_VERSION}" "$@"
  fi
}

log "Atlas Jurídico · Release Gate"
printf 'Commit: %s\n' "$(git -C "$ROOT" rev-parse --short=12 HEAD)"
printf 'Node:   %s\n' "$(node -v)"
printf 'pnpm:   %s\n' "$(pnpm -v)"
printf 'Bun:    %s\n' "$(bun_exec --version)"

log "Atlas Data · dependências"
(cd "$ATLAS" && pnpm install --frozen-lockfile)

log "Atlas Data · TypeScript"
(cd "$ATLAS" && pnpm check)

log "Atlas Data · testes"
(cd "$ATLAS" && pnpm test -- --run)

log "Atlas Data · build"
(cd "$ATLAS" && pnpm build)

log "JuridIA · dependências"
(cd "$JURIDIA" && bun_exec install --frozen-lockfile)

log "JuridIA · Prisma"
(cd "$JURIDIA" && bun_exec run db:generate)

log "JuridIA · TypeScript"
(cd "$JURIDIA" && bun_exec x tsc --noEmit)

log "JuridIA · testes críticos"
(cd "$JURIDIA" && bun_exec test   tests/gates.test.ts   tests/auth-oidc.test.ts   tests/minuta-pipeline.test.ts   tests/paginate.test.ts   tests/legal-brain-core.test.ts   tests/embedding-retrieval.test.ts   tests/office-skill-catalog.test.ts   tests/document-security.test.ts   tests/molde.test.ts   tests/atlas-knowledge-bridge.test.ts)

log "JuridIA · build de produção"
(
  cd "$JURIDIA"
  DATABASE_URL="${DATABASE_URL_GATE:-file:./release-gate.db}"   NODE_ENV=production   JURIDIA_SESSION_SECRET="${JURIDIA_SESSION_SECRET_GATE:-release-gate-session-secret-0123456789}"   JWT_SECRET="${JWT_SECRET_GATE:-release-gate-jwt-secret-0123456789}"   ATLAS_OIDC_CLIENT_SECRET="${ATLAS_OIDC_CLIENT_SECRET_GATE:-release-gate-oidc-secret-0123456789}"   JURIDIA_OIDC_ISSUER="${JURIDIA_OIDC_ISSUER_GATE:-https://example.invalid}"   ATLAS_OIDC_CLIENT_ID="${ATLAS_OIDC_CLIENT_ID_GATE:-atlas-juridico}"   ATLAS_OIDC_REDIRECT_URIS="${ATLAS_OIDC_REDIRECT_URIS_GATE:-https://atlas.example.invalid/api/sso/callback}"   bun_exec run build
)

rm -f "$JURIDIA/release-gate.db" "$JURIDIA/release-gate.db-journal" 2>/dev/null || true

log "RELEASE GATE APROVADO"
