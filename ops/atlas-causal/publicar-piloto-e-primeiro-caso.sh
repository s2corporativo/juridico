#!/usr/bin/env bash
# Atlas Causal — publicar a branch nova no staging (git pull) e rodar o 1º caso
# piloto (ingestão → extração → revisão → causas comprovadas).
#
# Executar NA VPS (console, como root). Pré-requisitos já cobertos pelo pacote
# deploy-fase1: atlas-forense-stage ativo na 3114, segredos em
# $BASE/secrets/atlas-stage.env com ATLAS_CAUSAL_DATABASE_URL,
# ATLAS_CAUSAL_CASE_KEY_SECRET (>=32 chars) e ATLAS_CAUSAL_PILOT_AUTHORIZATION=approved.
#
# Uso:
#   BRANCH=feat/causal-piloto-causas-comprovadas bash ops/atlas-causal/publicar-piloto-e-primeiro-caso.sh
#   # opcional: DRY_RUN=1 para verificar o ambiente sem alterar nada
set -Eeuo pipefail
umask 077

BRANCH="${BRANCH:-feat/causal-piloto-causas-comprovadas}"
REPO="https://github.com/s2corporativo/juridico.git"
BASE="/opt/atlas-juridico/staging/unified"
ENV_FILE="$BASE/secrets/atlas-stage.env"
SERVICE="atlas-forense-stage"
PORT="3114"
DROPIN_DIR="/etc/systemd/system/$SERVICE.service.d"
DROPIN="$DROPIN_DIR/50-causal-release.conf"
BACKUP_DIR="$BASE/rollback-causal"
DRY_RUN="${DRY_RUN:-0}"

log() { printf '\n[piloto-vps] %s\n' "$*"; }
fail() { printf 'ERRO: %s\n' "$*" >&2; exit 1; }

[ "$(id -u)" -eq 0 ] || fail "executar como root no console da VPS"
for cmd in git node pnpm curl systemctl openssl; do command -v "$cmd" >/dev/null || fail "$cmd não instalado"; done
[ -r "$ENV_FILE" ] || fail "ambiente de homologação ausente: $ENV_FILE"
[ "$(systemctl is-active "$SERVICE")" = active ] || fail "serviço $SERVICE não está ativo"
curl -fsS --max-time 10 "http://127.0.0.1:$PORT/healthz" >/dev/null || fail "homologação atual sem saúde em :$PORT"

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a
[ -n "${ATLAS_CAUSAL_DATABASE_URL:-}" ] || fail "ATLAS_CAUSAL_DATABASE_URL ausente no ambiente"
[ -n "${ATLAS_CAUSAL_CASE_KEY_SECRET:-}" ] && [ "${ATLAS_CAUSAL_CASE_KEY_SECRET}" != "CHANGE_ME" ] && [ "$(printf %s "${ATLAS_CAUSAL_CASE_KEY_SECRET}" | wc -c)" -ge 32 ] || fail "HMAC permanente não configurado"
[ "${ATLAS_CAUSAL_PILOT_AUTHORIZATION:-}" = approved ] || fail "piloto não autorizado no ambiente (ATLAS_CAUSAL_PILOT_AUTHORIZATION=approved)"

SHA="$(git ls-remote "$REPO" "refs/heads/$BRANCH" | cut -f1)"
[ -n "$SHA" ] || fail "branch não encontrada no GitHub: $BRANCH"
RELEASE="$BASE/releases/$SHA"
log "branch=$BRANCH sha=$SHA"

if [ "$DRY_RUN" = "1" ]; then
  log "DRY_RUN: ambiente OK, release-alvo $RELEASE"
  exit 0
fi

# 1) Release imutável por SHA (idempotente por commit)
if [ ! -d "$RELEASE" ]; then
  TMP="$(mktemp -d "$BASE/releases/.causal-prepare-XXXXXX")"
  git clone --quiet --branch "$BRANCH" "$REPO" "$TMP/repo"
  git -C "$TMP/repo" checkout --quiet --detach "$SHA"
  [ "$(git -C "$TMP/repo" rev-parse HEAD)" = "$SHA" ] || fail "SHA divergente no clone"
  chmod 0711 "$TMP"
  cd "$TMP/repo"
  pnpm install --frozen-lockfile
  pnpm --dir apps/atlas-forense check
  pnpm --dir apps/atlas-forense test
  pnpm --dir apps/atlas-forense build
  pnpm --dir apps/atlas-forense exec drizzle-kit check --config drizzle-causal.config.ts
  mv "$TMP/repo" "$RELEASE"
  rm -rf "$TMP"
else
  log "release já existe: $RELEASE"
fi

# 2) Migração versionada do banco causal isolado (idempotente)
log "aplicando migração do banco causal isolado…"
cd "$RELEASE/apps/atlas-forense"
ATLAS_CAUSAL_DATABASE_URL="$ATLAS_CAUSAL_DATABASE_URL" pnpm db:causal:migrate

# 3) Cutover do serviço com reversão automática
install -d -m 0750 "$DROPIN_DIR" "$BACKUP_DIR"
[ -f "$DROPIN" ] && cp -a "$DROPIN" "$BACKUP_DIR/prior-50-causal-release.conf"
printf '[Service]\nWorkingDirectory=%s/apps/atlas-forense\n' "$RELEASE" >"$DROPIN"
systemctl daemon-reload
systemctl restart "$SERVICE"
for i in $(seq 1 30); do
  curl -fsS --max-time 5 "http://127.0.0.1:$PORT/healthz" >/dev/null && break
  [ "$i" -lt 30 ] || fail "health check falhou após cutover"
  sleep 2
done
curl -fsS --max-time 5 "http://127.0.0.1:$PORT/readyz" >/dev/null || fail "readyz falhou após cutover"
log "cutover concluído e /readyz saudável"

# 4) 1º caso piloto: ingestão → extração → revisão → causas comprovadas
log "executando o 1º caso piloto (idempotente)…"
sudo -u sentinelx --preserve-env=ATLAS_CAUSAL_DATABASE_URL,ATLAS_CAUSAL_CASE_KEY_SECRET,ATLAS_CAUSAL_PILOT_AUTHORIZATION \
  pnpm --dir "$RELEASE/apps/atlas-forense" exec tsx scripts/piloto-primeiro-caso.ts | tee /var/lib/atlas-juridico/causal-pilot/primeiro-caso-$(date -u +%Y%m%dT%H%M%SZ).log

log "SUCESSO: branch $BRANCH publicada e 1º caso piloto fechado"
log "paineis: http://127.0.0.1:$PORT/causal (banco isolado; não público)"
