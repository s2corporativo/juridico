#!/usr/bin/env bash
# Local VPS verification gate for Atlas + JuridIA. No GitHub Actions, no deploy.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd -P)"
ACTIVE="$(readlink -f /opt/atlas-juridico/current 2>/dev/null || true)"
if [[ -n "$ACTIVE" && ("$ROOT" == "$ACTIVE" || "$ROOT" == "$ACTIVE"/*) ]]; then
  echo "Refusing to build within active Atlas release" >&2
  exit 2
fi
if [[ -n "$(git -C "$ROOT" status --porcelain)" ]]; then
  echo "Working tree must be clean before verification" >&2
  exit 2
fi
STAGE_URL="${JURIDIA_STAGE_DATABASE_URL:-file:/opt/atlas-juridico/staging/juridia-fts-homologation.db}"
if [[ "$STAGE_URL" != file:/opt/atlas-juridico/staging/* ]]; then
  echo "Refusing non-staging JuridIA database URL" >&2
  exit 2
fi
STAGE_PATH="${STAGE_URL#file:}"
if [[ ! -f "$STAGE_PATH" ]]; then
  echo "Missing isolated staging SQLite copy" >&2
  exit 2
fi
printf 'VALIDATING_COMMIT=%s\n' "$(git -C "$ROOT" rev-parse --short HEAD)"
(
  cd "$ROOT/apps/atlas-forense"
  pnpm install --frozen-lockfile
  pnpm check
  pnpm test
  pnpm build
)
(
  cd "$ROOT/apps/juridia"
  bun install --frozen-lockfile --backend=copyfile
  DATABASE_URL="$STAGE_URL" bunx prisma generate
  bunx tsc --noEmit
  bun test tests/knowledge-local-index.test.ts tests/atlas-snapshot-sync.test.ts tests/local-embeddings.test.ts tests/knowledge-hybrid-search.test.ts
  DATABASE_URL="$STAGE_URL" bunx next build
)
echo VPS_VALIDATION_GATES_PASSED
