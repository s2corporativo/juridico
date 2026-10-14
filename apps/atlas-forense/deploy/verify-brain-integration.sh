#!/usr/bin/env bash
# verify-brain-integration.sh: validação pós-deploy da integração Cérebro Jurídico <-> Atlas.
# Somente leitura. NUNCA imprime valores de segredos. Ver docs/integracao-cerebro-atlas.md.
#
# Uso (na VPS, como root):  ./verify-brain-integration.sh
set -uo pipefail

ATLAS_ENV="${ATLAS_ENV:-/etc/atlas-ejc/atlas.env}"
JURIDIA_ENV="${JURIDIA_ENV:-/etc/juridia/juridia.env}"
# Porta 3114: reservada ao Atlas Forense (fail-fast de porta em produção, F0.3).
ATLAS_URL="${ATLAS_URL:-http://127.0.0.1:3114}"
JURIDIA_URL="${JURIDIA_URL:-http://127.0.0.1:3005}"
FAILS=0

ok()   { echo "OK    $*"; }
fail() { echo "FALHA $*"; FAILS=$((FAILS+1)); }

get_var() { [ -f "$1" ] && awk -F= -v k="$2" '$0 !~ /^[[:space:]]*#/ && $1==k {sub(/^[^=]*=/,""); print; exit}' "$1"; }
code() { curl -s -o /dev/null -m 15 -w '%{http_code}' "$@" 2>/dev/null || echo 000; }

A_TOKEN="$(get_var "$ATLAS_ENV" ATLAS_BRAIN_API_TOKEN)"
J_TOKEN="$(get_var "$JURIDIA_ENV" ATLAS_BRAIN_API_TOKEN)"
J_URL="$(get_var "$JURIDIA_ENV" ATLAS_API_URL)"

# 1. Segredos (somente comprimento e igualdade)
[ "${#A_TOKEN}" -ge 32 ] && ok "Atlas: ATLAS_BRAIN_API_TOKEN definido (>= 32 chars)" || fail "Atlas: ATLAS_BRAIN_API_TOKEN ausente ou curto"
[ "${#J_TOKEN}" -ge 32 ] && ok "JuridIA: ATLAS_BRAIN_API_TOKEN definido (>= 32 chars)" || fail "JuridIA: ATLAS_BRAIN_API_TOKEN ausente ou curto"
[ -n "$A_TOKEN" ] && [ "$A_TOKEN" = "$J_TOKEN" ] && ok "tokens idênticos nos dois apps" || fail "tokens divergentes entre Atlas e JuridIA"
[ -n "$J_URL" ] && ok "JuridIA: ATLAS_API_URL definido ($J_URL)" || fail "JuridIA: ATLAS_API_URL ausente"

# 2. Saúde dos serviços
[ "$(code "$ATLAS_URL/healthz")" = "200" ] && ok "Atlas /healthz 200" || fail "Atlas /healthz"
c="$(code "$ATLAS_URL/readyz")"; { [ "$c" = "200" ] || [ "$c" = "503" ]; } && ok "Atlas /readyz ($c)" || fail "Atlas /readyz deveria ser 200/503 (veio $c)"
c="$(code "$JURIDIA_URL/api/healthz")"; [ "$c" = "200" ] && ok "JuridIA /api/healthz 200" || fail "JuridIA /api/healthz ($c)"
c="$(code "$JURIDIA_URL/api/readyz")"; { [ "$c" = "200" ] || [ "$c" = "503" ]; } && ok "JuridIA /api/readyz ($c)" || fail "JuridIA /api/readyz deveria ser 200/503 (veio $c)"

# 3. Guarda da API Brain (prefixo canônico v1 e alias legado; sem token = 401)
c="$(code "$ATLAS_URL/api/v1/brain/jurimetry")"
[ "$c" = "401" ] && ok "API v1/brain sem token: 401" || fail "API v1/brain sem token deveria ser 401 (veio $c)"
c="$(code "$ATLAS_URL/api/internal/brain/jurimetry")"
[ "$c" = "401" ] && ok "Alias legado sem token: 401" || fail "Alias legado sem token deveria ser 401 (veio $c)"
if [ "${#A_TOKEN}" -ge 32 ]; then
  c="$(code -H "Authorization: Bearer $A_TOKEN" "$ATLAS_URL/api/v1/brain/compendium/search?q=consumidor")"
  [ "$c" = "200" ] && ok "Compêndio v1/brain com token: 200" || fail "Compêndio v1/brain com token ($c)"
  c="$(code -H "Authorization: Bearer $A_TOKEN" "$ATLAS_URL/api/v1/brain/jurimetry")"
  [ "$c" = "200" ] && ok "Jurimetria v1/brain com token: 200" || fail "Jurimetria v1/brain com token ($c)"
  headers="$(curl -s -o /dev/null -m 15 -D - -H "Authorization: Bearer $A_TOKEN" "$ATLAS_URL/api/internal/brain/jurimetry" 2>/dev/null)"
  echo "$headers" | grep -qi '^deprecation: true' && ok "Alias legado sinaliza Deprecation" || fail "Alias legado sem header Deprecation"
  echo "$headers" | grep -qi "^sunset: " && ok "Alias legado anuncia Sunset" || fail "Alias legado sem header Sunset"
fi

# 4. Rotas do JuridIA protegidas
c="$(code -X POST -H 'Content-Type: application/json' -d '{}' "$JURIDIA_URL/api/atlas/theses")"
{ [ "$c" = "401" ] || [ "$c" = "403" ]; } && ok "POST /api/atlas/theses sem sessão: $c" || fail "POST /api/atlas/theses sem sessão deveria ser 401/403 (veio $c)"

echo
[ "$FAILS" = "0" ] && echo "INTEGRAÇÃO ÍNTEGRA" || echo "INTEGRAÇÃO COM $FAILS FALHA(S)"
exit "$FAILS"
