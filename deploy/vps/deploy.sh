#!/usr/bin/env bash
set -Eeuo pipefail

# Atlas Forense — deploy seguro sem GitHub Actions.
# Executar NA VPS, como root ou usuário com sudo, após configurar /etc/atlas-forense/atlas.env.

REPO_URL="${REPO_URL:-https://github.com/s2corporativo/juridico.git}"
APP_ROOT="${APP_ROOT:-/opt/atlas-forense}"
ENV_FILE="${ENV_FILE:-/etc/atlas-forense/atlas.env}"
SERVICE_NAME="${SERVICE_NAME:-atlas-forense}"
BRANCH="${BRANCH:-main}"
HEALTH_URL="${HEALTH_URL:-http://127.0.0.1:3010/healthz}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
RELEASE_DIR="$APP_ROOT/releases/$STAMP"
BACKUP_DIR="$APP_ROOT/backups/$STAMP"
PREVIOUS_TARGET=""

log(){ printf '\n[atlas-deploy] %s\n' "$*"; }
fail(){ printf '\n[atlas-deploy] ERRO: %s\n' "$*" >&2; exit 1; }
rollback_release(){
  if [[ -n "$PREVIOUS_TARGET" && -d "$PREVIOUS_TARGET" ]]; then
    log "Restaurando release anterior: $PREVIOUS_TARGET"
    ln -sfn "$PREVIOUS_TARGET" "$APP_ROOT/current"
    systemctl restart "$SERVICE_NAME" || true
  fi
}

[[ -r "$ENV_FILE" ]] || fail "arquivo de ambiente ausente ou ilegível: $ENV_FILE"
command -v git >/dev/null || fail "git ausente"
command -v node >/dev/null || fail "node ausente"
command -v corepack >/dev/null || fail "corepack ausente"
command -v curl >/dev/null || fail "curl ausente"
command -v sha256sum >/dev/null || fail "sha256sum ausente"
command -v gzip >/dev/null || fail "gzip ausente"
command -v base64 >/dev/null || fail "base64 ausente"

mkdir -p "$APP_ROOT/releases" "$APP_ROOT/backups"
if [[ -L "$APP_ROOT/current" ]]; then PREVIOUS_TARGET="$(readlink -f "$APP_ROOT/current")"; fi

log "Clonando release $BRANCH em $RELEASE_DIR"
git clone --depth 1 --branch "$BRANCH" "$REPO_URL" "$RELEASE_DIR"
cd "$RELEASE_DIR"

log "Carregando ambiente sem imprimir segredos"
set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

JWT_SECRET_VALUE="${JWT_SECRET:-}"
[[ "${NODE_ENV:-}" == "production" ]] || fail "NODE_ENV deve ser production"
[[ "${PORT:-3010}" == "3010" ]] || fail "PORT deve ser 3010 no ambiente oficial"
[[ "${HOST:-127.0.0.1}" == "127.0.0.1" ]] || fail "HOST deve ser 127.0.0.1 atrás do reverse proxy"
[[ -n "${DATABASE_URL:-}" ]] || fail "DATABASE_URL ausente"
[[ ${#JWT_SECRET_VALUE} -ge 64 ]] || fail "JWT_SECRET deve ter no mínimo 64 caracteres"

if [[ ! -f pnpm-lock.yaml ]]; then
  [[ "${ALLOW_LOCK_BOOTSTRAP:-0}" == "1" ]] || fail "pnpm-lock.yaml ausente. Para a primeira recuperação, gere/revise o lockfile antes do deploy ou use ALLOW_LOCK_BOOTSTRAP=1 conscientemente."
  log "Bootstrap excepcional do lockfile"
  corepack pnpm install --lockfile-only
fi

log "Gate completo: install + check + test + build"
node scripts/verify-release.mjs

log "Preflight referencial do banco"
corepack pnpm db:preflight

mkdir -p "$BACKUP_DIR"
log "Criando backup lógico do MySQL antes da migration"
command -v mysqldump >/dev/null || fail "mysqldump ausente"
DB_META="$(node --input-type=module - <<'NODE'
const u=new URL(process.env.DATABASE_URL);
const out={host:u.hostname,port:u.port||'3306',user:decodeURIComponent(u.username),pass:decodeURIComponent(u.password),db:u.pathname.replace(/^\//,'')};
if(!out.host||!out.user||!out.db) throw new Error('DATABASE_URL incompleta para backup.');
process.stdout.write(Buffer.from(JSON.stringify(out)).toString('base64'));
NODE
)"
readarray -t DB_FIELDS < <(DB_META="$DB_META" node --input-type=module - <<'NODE'
const m=JSON.parse(Buffer.from(process.env.DB_META,'base64').toString('utf8'));
for(const k of ['host','port','user','pass','db']) console.log(Buffer.from(m[k]).toString('base64'));
NODE
)
dec(){ printf '%s' "$1" | base64 -d; }
DB_HOST="$(dec "${DB_FIELDS[0]}")"
DB_PORT="$(dec "${DB_FIELDS[1]}")"
DB_USER="$(dec "${DB_FIELDS[2]}")"
DB_PASS="$(dec "${DB_FIELDS[3]}")"
DB_NAME="$(dec "${DB_FIELDS[4]}")"
MYSQL_PWD="$DB_PASS" mysqldump --single-transaction --routines --triggers --events -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" "$DB_NAME" | gzip -9 > "$BACKUP_DIR/database.sql.gz"
sha256sum "$BACKUP_DIR/database.sql.gz" > "$BACKUP_DIR/database.sql.gz.sha256"
[[ -s "$BACKUP_DIR/database.sql.gz" ]] || fail "backup do banco ficou vazio"

log "Aplicando migrations"
corepack pnpm db:migrate

log "Ativando release"
ln -sfn "$RELEASE_DIR" "$APP_ROOT/current"
systemctl restart "$SERVICE_NAME"
sleep 2
systemctl is-active --quiet "$SERVICE_NAME" || { rollback_release; fail "serviço não ficou ativo"; }

log "Healthcheck local"
EXPECTED='{"service":"atlas-forense","status":"ok"}'
ACTUAL="$(curl -fsS --max-time 10 "$HEALTH_URL")" || { rollback_release; fail "healthcheck falhou"; }
[[ "$ACTUAL" == "$EXPECTED" ]] || { rollback_release; fail "healthcheck retornou payload inesperado: $ACTUAL"; }

log "Deploy concluído. Release: $RELEASE_DIR"
log "Backup pré-migration: $BACKUP_DIR/database.sql.gz"
