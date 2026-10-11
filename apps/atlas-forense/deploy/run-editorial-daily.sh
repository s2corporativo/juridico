#!/usr/bin/env bash
# Atlas daily legal updates: authenticated local trigger, fail closed on partial data.
# Never print the token, a raw response body or private data.
set -euo pipefail

TOKEN="${EDITORIAL_SCHEDULE_SECRET:-}"
if [[ ! "$TOKEN" =~ ^[a-zA-Z0-9_-]{32,256}$ ]]; then
  echo "EDITORIAL_TRIGGER_SECRET_NOT_CONFIGURED" >&2
  exit 2
fi
URL="${EDITORIAL_SCHEDULE_URL:-http://127.0.0.1:3010/api/scheduled/editorial-daily}"
if [[ "$URL" != "http://127.0.0.1:3010/api/scheduled/editorial-daily" ]]; then
  echo "EDITORIAL_TRIGGER_INVALID_LOOPBACK_URL" >&2
  exit 2
fi

# Curl options and secret header are passed by stdin rather than argv.
response="$(printf 'url = "%s"\nrequest = "POST"\nheader = "x-editorial-secret: %s"\n' "$URL" "$TOKEN" |
  curl --silent --show-error --max-time 210 --config - --write-out '\n%{http_code}')"
status="${response##*$'\n'}"
body="${response%$'\n'*}"
if [[ "$status" != "200" ]]; then
  echo "EDITORIAL_TRIGGER_HTTP_NOT_OK" >&2
  exit 3
fi

# HTTP 200 does not imply both collectors succeeded. Service should be red for partial.
printf '%s' "$body" | /usr/bin/node -e '
let raw="";
process.stdin.setEncoding("utf8");
process.stdin.on("data",part => { raw+=part; if(raw.length>10000)process.exit(3); });
process.stdin.on("end",()=>{
  let result;
  try {result=JSON.parse(raw)}catch{console.error("EDITORIAL_INVALID_RESPONSE");process.exit(3)}
  if(result?.ok!==true){console.error("EDITORIAL_TRIGGER_FAILED");process.exit(3)}
  if(result.status==="completed"){
    console.log("EDITORIAL_DAILY_COMPLETED");
    process.exit(0);
  }
  if(result.status==="already_claimed"){
    console.log("EDITORIAL_DAILY_ALREADY_CLAIMED");
    process.exit(0);
  }
  console.error("EDITORIAL_DAILY_PARTIAL_OR_FAILED");
  process.exit(3);
});
'
