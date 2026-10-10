#!/usr/bin/env bash
# verify-brain-integration.sh: validação pós-deploy da integração Cérebro Jurídico <-> Atlas.
# Somente leitura. NUNCA imprime valores de segredos. Ver docs/integracao-cerebro-atlas.md.
#
# Uso (na VPS, como root):  ./verify-brain-integration.sh
set -uo pipefail

ATLAS_ENV="${ATLAS_ENV:-/etc/atlas-ejc/atlas.env}"
JURIDIA_ENV="${JURIDIA_ENV:-/etc/juridia/juridia.env}"
ATLAS_URL="${ATLAS_URL:-http://127.0.0.1:3010}"
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
c="$(code "$JURIDIA_URL/healthz")"; [ "$c" = "200" ] && ok "JuridIA /healthz 200" || fail "JuridIA /healthz ($c)"

# 3. Guarda da API interna (sem token = 401; com token = 200)
c="$(code "$ATLAS_URL/api/internal/brain/jurimetry")"
[ "$c" = "401" ] && ok "API interna sem token: 401" || fail "API interna sem token deveria ser 401 (veio $c)"
if [ "${#A_TOKEN}" -ge 32 ]; then
  c="$(code -H "Authorization: Bearer $A_TOKEN" "$ATLAS_URL/api/internal/brain/compendium/search?q=consumidor")"
  [ "$c" = "200" ] && ok "Compêndio com token: 200" || fail "Compêndio com token ($c)"
  c="$(code -H "Authorization: Bearer $A_TOKEN" "$ATLAS_URL/api/internal/brain/jurimetry")"
  [ "$c" = "200" ] && ok "Jurimetria com token: 200" || fail "Jurimetria com token ($c)"
fi

# 4. Rotas do JuridIA protegidas
c="$(code -X POST -H 'Content-Type: application/json' -d '{}' "$JURIDIA_URL/api/atlas/theses")"
{ [ "$c" = "401" ] || [ "$c" = "403" ]; } && ok "POST /api/atlas/theses sem sessão: $c" || fail "POST /api/atlas/theses sem sessão deveria ser 401/403 (veio $c)"

echo
[ "$FAILS" = "0" ] && echo "INTEGRAÇÃO ÍNTEGRA" || echo "INTEGRAÇÃO COM $FAILS FALHA(S)"
exit "$FAILS"
