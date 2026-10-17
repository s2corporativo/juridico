#!/usr/bin/env bash
# Gate sem credenciais/alteração de servidor. Exige host público válido.
set -Eeuo pipefail
ROOT="${1:-https://atlas.depaulateixeira.adv.br}"
ROOT="${ROOT%/}"
case "$ROOT" in
  https://atlas.depaulateixeira.adv.br|https://atlas.13.140.167.153.sslip.io) ;;
  *) echo "BLOQUEADO_HOST: apenas hosts Atlas permitidos" >&2; exit 19;;
esac
command -v curl >/dev/null
command -v python3 >/dev/null
BASE="${ROOT}/juridia"
login="$(curl --silent --show-error --proto '=https' --tlsv1.2 --max-time 12 \
  -o /dev/null -w '%{http_code}' "$BASE/login")"
if test "$login" != 200;then
 echo "BLOQUEADO_LOGIN: status $login";exit 20
fi
me="$(curl --silent --show-error --proto '=https' --tlsv1.2 --max-time 12 \
  -o /dev/null -w '%{http_code}' "$BASE/api/auth/me")"
if test "$me" != 401;then
 echo "BLOQUEADO_PRIVACIDADE: /juridia/api/auth/me retornou $me";exit 21
fi
for path in /juridia/api/cases /juridia/api/documents /juridia/api/skills;do
 status="$(curl --silent --show-error --proto '=https' --tlsv1.2 --max-time 12 \
  -o /dev/null -w '%{http_code}' "$ROOT$path")"
 if test "$status" != 401;then
  echo "BLOQUEADO_PRIVACIDADE: $path retornou $status";exit 22
 fi
done
rootApi="$(curl --silent --show-error --proto '=https' --tlsv1.2 --max-time 12 \
  -o /dev/null -w '%{http_code}' "$ROOT/api/ejc-sso/start")"
if test "$rootApi" != 503 && test "$rootApi" != 302 && test "$rootApi" != 200; then
 echo "BLOQUEADO_ATLAS: /api/ejc-sso/start retornou $rootApi";exit 23
fi
echo "ATLAS_JURIDIA_PREFIX_GATE_OK"
