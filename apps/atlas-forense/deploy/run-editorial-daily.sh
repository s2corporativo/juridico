#!/usr/bin/env bash
# Trigger an authenticated daily editorial job without exposing secrets in command-line arguments.
set -euo pipefail
TOKEN="${EDITORIAL_SCHEDULE_SECRET:-}"
if [[ ! "$TOKEN" =~ ^[a-zA-Z0-9_-]{32,256}$ ]]; then
  echo "EDITORIAL_SCHEDULE_SECRET ausente ou inseguro" >&2
  exit 2
fi
URL="${EDITORIAL_SCHEDULE_URL:-http://127.0.0.1:3010/api/scheduled/editorial-daily}"
if [[ "$URL" != "http://127.0.0.1:3010/api/scheduled/editorial-daily" ]]; then
  echo "Endpoint editorial deve ser loopback e porta prevista" >&2
  exit 2
fi
# -K - reads sensitive HTTP header via stdin, not the process argument list.
status="$(printf 'url = "%s"\nrequest = "POST"\nheader = "x-editorial-secret: %s"\n' "$URL" "$TOKEN" |
  curl --silent --show-error --fail --max-time 210 --config - --output /dev/null --write-out '%{http_code}')"
test "$status" = 200
echo "EDITORIAL_JOB_HTTP_200"
