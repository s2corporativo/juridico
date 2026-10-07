#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if ! command -v graphify >/dev/null 2>&1; then
  echo "Graphify não encontrado. Instale com: uv tool install 'graphifyy[sql]'"
  exit 1
fi

graphify extract . --code-only --force --out .
graphify cluster-only . --no-label
graphify god-nodes --top 30 > graphify-out/GOD_NODES.txt

echo "Mapa atualizado em graphify-out/"
echo "Abra graphify-out/graph.html para navegar pela arquitetura."
