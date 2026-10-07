#!/usr/bin/env bash
# render-env.sh — DEFINIÇÃO E EXECUÇÃO dos segredos definitivos de produção
# (Atlas Forense + JuridIA) na VPS. Ver docs/segredos-producao-vps.md.
#
# Uso (na VPS, como root):
#   ./render-env.sh --check                # audita: o que falta / está fraco (NUNCA imprime valores)
#   ./render-env.sh --render               # gera os que faltam e grava nos arquivos de env (0640)
#   ./render-env.sh --render --force VAR   # regenera uma variável específica (ex.: rotação)
#
# Garantias:
#   - Valores gerados usam openssl rand -hex 32 (fallback: /dev/urandom).
#   - Segredos existentes e fortes NUNCA são sobrescritos (exceto --force).
#   - Nenhum valor é impresso no terminal ou em log — só nomes e status.
#   - Backup do arquivo anterior é feito antes de reescrever (0600).
set -euo pipefail

ATLAS_ENV="${ATLAS_ENV:-/etc/atlas-juridico/atlas.env}"
ATLAS_GROUP="${ATLAS_GROUP:-atlas}"
JURIDIA_ENV="${JURIDIA_ENV:-/etc/juridia/juridia.env}"
JURIDIA_GROUP="${JURIDIA_GROUP:-juridia}"

# Domínio público do Atlas e issuer OIDC do JuridIA — AJUSTE PARA OS VALORES REAIS.
ATLAS_PUBLIC_URL="${ATLAS_PUBLIC_URL:-https://atlas.depaulateixeira.adv.br}"
JURIDIA_ISSUER="${JURIDIA_ISSUER:-https://sso.juridia.depaulateixeira.adv.br/api/auth/oidc}"

MODE=""; FORCE_VAR=""
for arg in "$@"; do
  case "$arg" in
    --check) MODE="check" ;;
    --render) MODE="render" ;;
    --force) shift; FORCE_VAR="${1:-}"; ;;
  esac
done
[ -z "$MODE" ] && { echo "uso: $0 --check | --render [--force NOME_VAR]"; exit 2; }

gen_hex() { # $1 = bytes (32 bytes => 64 chars hex)
  if command -v openssl >/dev/null 2>&1; then openssl rand -hex "$1" 2>/dev/null; else
    head -c "$1" /dev/urandom | od -An -tx1 | tr -d ' \n'; echo; fi
}

is_strong() { # >=32 chars
  [ -n "${1:-}" ] && [ "${#1}" -ge 32 ]
}

# ── Definição do inventário: arquivo|VAR|tipo|valor-literal-ou-vazio ─────────
# tipos: gen (segredo gerado) | lit (literal) | ext (fornecido por operador/provider)
# Para 'ext', --check reporta ausente/ok e --render NÃO inventa valor.
entries=(
  "A|NODE_ENV|lit|production"
  "A|PORT|lit|3010"
  "A|DATABASE_URL|ext|mysql://atlas_app:SENHA@127.0.0.1:3306/atlas_juridico"
  "A|JWT_SECRET|gen|"
  "A|NOTIFICATION_SERVICE_PORT|lit|3003"
  "A|NOTIFICATION_INTERNAL_SECRET|gen|"
  "A|ATLAS_ALLOWED_ORIGINS|lit|$ATLAS_PUBLIC_URL"
  "A|DATAJUD_API_KEY|ext|"
  "A|ATLAS_SSO_ENABLED|lit|true"
  "A|JURIDIA_APP_URL|lit|${JURIDIA_ISSUER%/api/auth/oidc}"
  "A|JURIDIA_OIDC_ISSUER|lit|$JURIDIA_ISSUER"
  "A|ATLAS_OIDC_CLIENT_ID|lit|atlas-juridico"
  "A|ATLAS_OIDC_CLIENT_SECRET|gen|"
  "J|NODE_ENV|lit|production"
  "J|PORT|lit|3005"
  "J|DATABASE_URL|ext|file:/opt/juridia/data/juridia.db"
  "J|JURIDIA_SESSION_SECRET|gen|"
  "J|JURIDIA_OIDC_ISSUER|lit|$JURIDIA_ISSUER"
  "J|ATLAS_OIDC_CLIENT_ID|lit|atlas-juridico"
  "J|ATLAS_OIDC_CLIENT_SECRET|gen|"
  "J|ATLAS_OIDC_REDIRECT_URIS|lit|$ATLAS_PUBLIC_URL/api/sso/callback"
)

get_var() { # $1=arquivo $2=VAR -> imprime valor ou vazio
  [ -f "$1" ] || return 0
  awk -F= -v k="$2" '$0 !~ /^[[:space:]]*#/ && $1 ~ "^[[:space:]]*"k"[[:space:]]*$" {sub(/^[^=]*=/,""); print; exit}' "$1"
}

set_env_file() { # $1=arquivo $2=VAR $3=valor
  local file="$1" var="$2" val="$3"
  if [ -f "$file" ] && grep -q "^[[:space:]]*${var}=" "$file"; then
    awk -v k="$var" -v v="$val" 'BEGIN{FS=OFS="="} $0 ~ "^[[:space:]]*"k"=" {print k, v; f=1; next} {print} END{if(!f) print k, v}' "$file" > "$file.tmp"
    mv "$file.tmp" "$file"
  else
    printf '%s=%s\n' "$var" "$val" >> "$file"
  fi
}

# CLIENT_SECRET e issuer são COMPARTILHADOS (mesmo cliente OIDC nos dois apps)
SHARED_SECRET_VARS="ATLAS_OIDC_CLIENT_SECRET"

STATUS=0
declare -a ACTIONS

for entry in "${entries[@]}"; do
  IFS='|' read -r app var type litval <<< "$entry"
  if [ "$app" = "A" ]; then file="$ATLAS_ENV"; group="$ATLAS_GROUP"; else file="$JURIDIA_ENV"; group="$JURIDIA_GROUP"; fi
  cur="$(get_var "$file" "$var")"

  if [ "$type" = "gen" ]; then
    if is_strong "$cur" && [ "$var" != "$FORCE_VAR" ]; then
      [ "$MODE" = "check" ] && echo "OK       $app $var"
    else
      STATUS=1
      if [ "$MODE" = "render" ]; then
        # segredo compartilhado: se já existe forte no OUTRO arquivo, espelha
        if [[ "$SHARED_SECRET_VARS" == *"$var"* ]]; then
          other="$JURIDIA_ENV"; [ "$app" = "J" ] && other="$ATLAS_ENV"
          ov="$(get_var "$other" "$var")"
          if is_strong "$ov"; then cur_out="$ov"; else cur_out="$(gen_hex 32)"; fi
        else
          cur_out="$(gen_hex 32)"
        fi
        mkdir -p "$(dirname "$file")"
        [ -f "$file" ] && cp -a "$file" "$file.bak.$(date +%s)" && chmod 0600 "$file.bak.$(date +%s)" || true
        set_env_file "$file" "$var" "$cur_out"
        chown root:"$group" "$file" 2>/dev/null || true
        chmod 0640 "$file"
        ACTIONS+=("GERADO   $app $var -> $file")
      else
        echo "AUSENTE/FRACO $app $var"
      fi
    fi
  elif [ "$type" = "lit" ]; then
    if [ "$cur" = "$litval" ]; then
      [ "$MODE" = "check" ] && echo "OK       $app $var"
    else
      STATUS=1
      if [ "$MODE" = "render" ]; then
        mkdir -p "$(dirname "$file")"
        set_env_file "$file" "$var" "$litval"
        chown root:"$group" "$file" 2>/dev/null || true
        chmod 0640 "$file"
        ACTIONS+=("DEFINIDO $app $var -> $file")
      else
        echo "DIVERGE  $app $var (esperado literal, ver docs)"
      fi
    fi
  else # ext
    if [ -n "$cur" ]; then
      [ "$MODE" = "check" ] && echo "OK       $app $var (fornecida)"
    else
      STATUS=1
      [ "$MODE" = "check" ] && echo "AUSENTE  $app $var (fornecer manualmente: operator/provider)"
    fi
  fi
done

# Perigos: variáveis proibidas em produção
[ -f "$JURIDIA_ENV" ] && grep -q "^[[:space:]]*JURIDIA_OIDC_DEV_ALLOW_LOCAL=1" "$JURIDIA_ENV" && {
  echo "PERIGO   J JURIDIA_OIDC_DEV_ALLOW_LOCAL=1 presente em produção — REMOVA"; STATUS=1; } || true

if [ "$MODE" = "render" ]; then
  printf '%s\n' "${ACTIONS[@]:-nenhuma ação necessária}"
  echo
  echo "Próximos passos:"
  echo "  1. Confira DATABASE_URL (senha do MariaDB) e DATAJUD_API_KEY — são fornecidas, não geradas."
  echo "  2. Ajuste JURIDIA_OIDC_ISSUER/ATLAS_OIDC_REDIRECT_URIS se o domínio do JuridIA mudar."
  echo "  3. systemctl restart atlas-juridico  (e o serviço do JuridIA, porta 3005)"
  echo "  4. Valide: curl -fsS http://127.0.0.1:3010/healthz e /healthz do JuridIA"
  echo "  5. Rode: apps/juridia/scripts/contract-check.mjs contra a porta 3005"
else
  echo
  [ "$STATUS" = "0" ] && echo "CHECK: todos os segredos definidos e fortes." || echo "CHECK: há pendências acima."
fi
exit $STATUS
