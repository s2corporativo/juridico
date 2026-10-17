#!/usr/bin/env bash
# Gate sem segredos: falha fechada; NÃO instala nem ativa infraestrutura.
set -Eeuo pipefail
HOST='juridia.depaulateixeira.adv.br'
ROOT="https://$HOST"
for executable in curl jq getent; do command -v "$executable" >/dev/null; done

if ! getent ahostsv4 "$HOST" >/dev/null; then
  echo "BLOQUEADO_DNS: $HOST não resolve"; exit 21
fi
# Curl valida nome, certificado e CA; validação TLS é obrigatória.
code="$(curl -sS --proto '=https' --tlsv1.2 --max-time 12 -o /dev/null -w '%{http_code}' "$ROOT/login")"
if [ "$code" != 200 ]; then
  echo "BLOQUEADO_HTTPS: login retornou HTTP $code"; exit 22
fi
for api in /api/auth/me /api/skills /api/documents /api/clients /api/cases; do
  status="$(curl -sS --proto '=https' --tlsv1.2 --max-time 12 -o /dev/null -w '%{http_code}' "$ROOT$api")"
  if [ "$status" != 401 ]; then
    echo "BLOQUEADO_PERMISSAO: $api retornou HTTP $status (esperado 401)"; exit 23
  fi
done

payload="$(curl -sS --fail --proto '=https' --tlsv1.2 --max-time 12 "$ROOT/api/auth/oidc")"
mode="$(printf '%s' "$payload" | jq -r '.mode // ""')"
issuer="$(printf '%s' "$payload" | jq -r '.issuer // ""')"
if [ "$mode" != active ] || [ "$issuer" != "$ROOT/api/auth/oidc" ]; then
  echo 'BLOQUEADO_OIDC: issuer ou registro de cliente inválido'; exit 24
fi
echo 'JURIDIA_PUBLICA_PRONTA: DNS, TLS, RBAC anônimo e OIDC ativos'
