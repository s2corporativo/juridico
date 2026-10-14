#!/usr/bin/env bash
# Deploy controlado do Atlas Causal SOMENTE na homologação do Atlas Forense.
# Executar exclusivamente com acesso operacional autorizado à VPS e
# permissões de escrita aprovadas nos caminhos de release, systemd e banco.
set -Eeuo pipefail
umask 077

SHA="a492500d6ac5f16484825bce6bf540eb8717decb"
REPO="https://github.com/s2corporativo/juridico.git"
BASE="/opt/atlas-juridico/staging/unified"
ENV_FILE="$BASE/secrets/atlas-stage.env"
SERVICE="atlas-forense-stage"
PORT="3114"
OUT="/var/lib/atlas-juridico/causal-pilot"
DROPIN_DIR="/etc/systemd/system/$SERVICE.service.d"
DROPIN="$DROPIN_DIR/50-causal-release.conf"
BACKUP_DIR="$BASE/rollback-causal"
TMP=""
SWITCHED=no
PREVIOUS_DROPIN=no

cleanup() {
  code=$?
  trap - EXIT
  if [ "$code" -ne 0 ] && [ "$SWITCHED" = yes ]; then
    echo "ERRO após alteração do serviço. Restaurando unidade anterior..." >&2
    if [ "$PREVIOUS_DROPIN" = yes ]; then
      cp -a "$BACKUP_DIR/prior-50-causal-release.conf" "$DROPIN"
    else
      rm -f "$DROPIN"
    fi
    systemctl daemon-reload
    systemctl restart "$SERVICE" || true
  fi
  if [ -n "$TMP" ] && [ -d "$TMP" ]; then rm -rf "$TMP"; fi
  exit "$code"
}
trap cleanup EXIT

[ "$(id -u)" -eq 0 ] || { echo "ERRO: exige root." >&2; exit 1; }
[ -r "$ENV_FILE" ] || { echo "ERRO: ambiente de homologação ausente." >&2; exit 1; }
[ "$(systemctl is-active "$SERVICE")" = active ] || { echo "ERRO: serviço de homologação não ativo." >&2; exit 1; }
curl -fsS --max-time 10 "http://127.0.0.1:$PORT/healthz" >/dev/null || { echo "ERRO: homologação atual sem saúde." >&2; exit 1; }
for cmd in git node pnpm systemctl sudo curl; do command -v "$cmd" >/dev/null || { echo "ERRO: $cmd não instalado." >&2; exit 1; }; done

# Ambiente root-owned e reservado à operação: nunca imprimir os valores.
set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a
[ -n "$ATLAS_CAUSAL_DATABASE_URL" ] || { echo "ERRO: ATLAS_CAUSAL_DATABASE_URL ausente." >&2; exit 1; }
[ -n "$ATLAS_CAUSAL_CASE_KEY_SECRET" ] && [ "$ATLAS_CAUSAL_CASE_KEY_SECRET" != "CHANGE_ME" ] && [ "$ATLAS_CAUSAL_CASE_KEY_SECRET" != "test" ] && [ "$(printf %s "$ATLAS_CAUSAL_CASE_KEY_SECRET" | wc -c)" -ge 32 ] || { echo "ERRO: HMAC permanente não configurado." >&2; exit 1; }
[ "$ATLAS_CAUSAL_PILOT_AUTHORIZATION" = approved ] || { echo "ERRO: piloto não autorizado no ambiente." >&2; exit 1; }

# Repositório e commit verificáveis, sem reset --hard no código ativo.
mkdir -p "$BASE/releases"
[ ! -e "$BASE/releases/$SHA" ] || { echo "ERRO: release já existe; revisão manual." >&2; exit 1; }
TMP="$(mktemp -d "$BASE/releases/.causal-prepare-XXXXXX")"
git clone --quiet --branch atlas-forense "$REPO" "$TMP/repo"
git -C "$TMP/repo" cat-file -e "$SHA^{commit}"
git -C "$TMP/repo" checkout --quiet --detach "$SHA"
[ "$(git -C "$TMP/repo" rev-parse HEAD)" = "$SHA" ]
cd "$TMP/repo"
pnpm install --frozen-lockfile
pnpm --dir apps/atlas-forense check
pnpm --dir apps/atlas-forense test
pnpm --dir apps/atlas-forense build
pnpm --dir apps/atlas-forense exec drizzle-kit check --config drizzle-causal.config.ts

# O script de bootstrap é SOMENTE para um banco causal recém-criado,
# sem dados existentes, e não substitui procedimentos de backup.
cd "$TMP/repo/apps/atlas-forense"
node --input-type=module <<'NODE'
import mysql from "mysql2/promise";
const causal = new URL(process.env.ATLAS_CAUSAL_DATABASE_URL);
const metric = process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL) : null;
if (causal.protocol !== "mysql:") throw Error("Banco causal deve usar mysql://");
if (causal.pathname !== "/atlas_causal") throw Error("Banco causal deve se chamar atlas_causal");
if (metric && metric.pathname === causal.pathname) throw Error("Risco de reutilização do banco métrico");
const c = await mysql.createConnection(process.env.ATLAS_CAUSAL_DATABASE_URL);
try {
  const [rows] = await c.query("SELECT COUNT(*) AS total FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE()");
  if (Number(rows[0].total) !== 0) throw Error("Banco causal não está vazio: exigir plano de migração com backup");
  console.log("CAUSAL_DATABASE_NEW_EMPTY_SCHEMA_VERIFIED");
} finally { await c.end(); }
NODE

# Coleta real sem banco ANTES da migração e da mudança de serviço.
install -d -m 0700 -o sentinelx -g sentinelx "$OUT"
export ATLAS_CAUSAL_PILOT_OUTPUT_DIR="$OUT"
export ATLAS_CAUSAL_PILOT_PAGE_SIZE=100
export ATLAS_CAUSAL_PILOT_MAX_PAGES=2
sudo -u sentinelx --preserve-env=ATLAS_CAUSAL_CASE_KEY_SECRET,ATLAS_CAUSAL_PILOT_AUTHORIZATION,DATAJUD_API_KEY,ATLAS_CAUSAL_PILOT_OUTPUT_DIR,ATLAS_CAUSAL_PILOT_PAGE_SIZE,ATLAS_CAUSAL_PILOT_MAX_PAGES \
  pnpm collect:causal:rmbh -- --execute

node --input-type=module <<'NODE'
import { readFileSync } from "node:fs";
const rows = JSON.parse(readFileSync(process.env.ATLAS_CAUSAL_PILOT_OUTPUT_DIR + "/rmbh_causal_pilot_sanitized.json", "utf8"));
if (!Array.isArray(rows) || rows.length === 0) throw Error("Piloto vazio: cancelar migração e publicação.");
const allowed = new Set(["caseKey", "sourceHashSha256", "tribunal", "degree", "filingDate", "updatedAt", "classCode", "classLabel", "bodyCode", "bodyLabel", "municipalityIbgeCode", "municipality", "subjects", "movements"]);
for (const row of rows) {
  if (!row.caseKey?.startsWith("tjmg:") || "processNumber" in row || Object.keys(row).some(k => !allowed.has(k))) throw Error("Artefato de coleta não sanitizado.");
}
console.log("CAUSAL_PILOT_SANITIZED_CASES=" + rows.length);
NODE

# Migração versionada existente, nunca gerar DDL novo em produção.
pnpm db:causal:migrate
cd "$TMP/repo"
mv "$TMP/repo" "$BASE/releases/$SHA"
echo "RELEASE_READY=$SHA"

# Atualização do serviço em homologação com reversão automática.
install -d -m 0750 "$DROPIN_DIR" "$BACKUP_DIR"
if [ -f "$DROPIN" ]; then
  cp -a "$DROPIN" "$BACKUP_DIR/prior-50-causal-release.conf"
  PREVIOUS_DROPIN=yes
fi
cat >"$DROPIN" <<UNIT
[Service]
WorkingDirectory=$BASE/releases/$SHA/apps/atlas-forense
UNIT
SWITCHED=yes
systemctl daemon-reload
systemctl restart "$SERVICE"
for i in $(seq 1 30); do
  if curl -fsS --max-time 5 "http://127.0.0.1:$PORT/healthz" >/dev/null; then break; fi
  [ "$i" -lt 30 ] || { echo "ERRO: health check falhou." >&2; exit 1; }
  sleep 2
done
cd "$BASE/releases/$SHA/apps/atlas-forense"
sudo -u sentinelx --preserve-env=ATLAS_CAUSAL_DATABASE_URL,ATLAS_CAUSAL_CASE_KEY_SECRET,ATLAS_CAUSAL_PILOT_AUTHORIZATION,DATAJUD_API_KEY,ATLAS_CAUSAL_PILOT_OUTPUT_DIR,ATLAS_CAUSAL_PILOT_PAGE_SIZE,ATLAS_CAUSAL_PILOT_MAX_PAGES \
  pnpm collect:causal:rmbh -- --execute --persist
sudo -u sentinelx --preserve-env=ATLAS_CAUSAL_PILOT_OUTPUT_DIR pnpm analyze:causal:rmbh
curl -fsS --max-time 5 "http://127.0.0.1:$PORT/healthz" >/dev/null
SWITCHED=no
echo "STAGING_CAUSAL_SUCCESS_SHA=$SHA"
echo "NOT_PUBLIC: homologação interna 127.0.0.1:$PORT"
