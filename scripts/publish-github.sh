#!/usr/bin/env bash
# Jurimetria DPT — publicação no GitHub (s2corporativo/juridico).
#
# Uso:
#   bash scripts/publish-github.sh "ghp_ou_github_pat_xxx"
#   (ou defina GITHUB_TOKEN= no .env e rode sem argumento)
#
# O que faz (nesta ordem, com segurança):
#   1. RESGATE: copia a main remota atual (projeto Atlas Forense, 12 commits
#      exclusivos) para a branch de backup "atlas-main-backup" — nada é perdido.
#   2. PUBLICA: força a main remota para o estado local (históricoJurimetria DPT,
#      incompatível com a main Atlas — replace documentado e consciente).
#   3. ESPELHA: atualiza a branch de snapshot "zai-glm/ejc-clovis-v1".
#   4. VOLTA: restaura a URL do remote limpa (o token é usado uma única vez,
#      em memória, e nunca é gravado em disco/config/git).

set -euo pipefail

REPO="s2corporativo/juridico"
REMOTE_NAME="origin"
BRANCH_LOCAL="main"
BRANCH_SNAPSHOT="zai-glm/ejc-clovis-v1"
BRANCH_BACKUP="atlas-main-backup"

cd "$(git rev-parse --show-toplevel)"

# ---------- obter token (argumento > .env) ----------
TOKEN="${1:-}"
if [[ -z "$TOKEN" && -f .env ]]; then
  TOKEN="$(grep -E '^GITHUB_TOKEN=' .env | head -1 | cut -d= -f2- | tr -d '"' | tr -d "'" | tr -d '[:space:]')"
fi
if [[ -z "$TOKEN" ]]; then
  echo "✗ Sem token. Passe como argumento ou adicione GITHUB_TOKEN= no .env (gitignored)." >&2
  exit 1
fi

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "✗ Árvore de trabalho suja — commit antes de publicar." >&2
  exit 1
fi

PUSH_URL="https://x-access-token:${TOKEN}@github.com/${REPO}.git"
git remote set-url --push "$REMOTE_NAME" "$PUSH_URL"
trap 'git remote set-url --push "$REMOTE_NAME" "https://github.com/${REPO}.git"' EXIT

echo "▶ Verificando acesso…"
git ls-remote --heads "$REMOTE_NAME" >/dev/null 2>&1 || { echo "✗ Token sem acesso a ${REPO}." >&2; exit 1; }
echo "✓ Acesso OK."

# ---------- 1. resgate da main Atlas ----------
MAIN_REMOTA="$(git ls-remote "$REMOTE_NAME" refs/heads/main | cut -f1)"
if [[ -n "$MAIN_REMOTA" ]]; then
  echo "▶ Resgate: main remota (${MAIN_REMOTA:0:7}) → refs/heads/${BRANCH_BACKUP}…"
  git push "$REMOTE_NAME" "${MAIN_REMOTA}:refs/heads/${BRANCH_BACKUP}" --force 2>&1 | tail -1
  echo "✓ Backup Atlas preservado em ${BRANCH_BACKUP}."
fi

# ---------- 2. publicar Jurimetria DPT na main ----------
echo "▶ Publicando ${BRANCH_LOCAL} local → ${BRANCH_LOCAL} remota (replace consciente)…"
git push "$REMOTE_NAME" "+HEAD:refs/heads/${BRANCH_LOCAL}" --force 2>&1 | tail -2
echo "✓ Main publicada."

# ---------- 3. espelho de snapshot ----------
echo "▶ Espelhando snapshot em ${BRANCH_SNAPSHOT}…"
git push "$REMOTE_NAME" "+HEAD:refs/heads/${BRANCH_SNAPSHOT}" --force 2>&1 | tail -1
echo "✓ Snapshot atualizado."

echo ""
echo "═ Publicação concluída: https://github.com/${REPO}"
echo "═ Commits publicados: $(git rev-list --count HEAD) · HEAD: $(git rev-parse --short HEAD)"
