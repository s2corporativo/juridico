#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if ! command -v graphify >/dev/null 2>&1; then
  echo "Graphify não encontrado. Instale com: uv tool install 'graphifyy[sql]'"
  exit 1
fi

OUT="$ROOT/graphify-out"
IMPACT="$OUT/impact"
mkdir -p "$IMPACT"

echo "==> Graphify · extração completa"
graphify extract . --code-only --force --out .

echo "==> Graphify · comunidades e visualização"
graphify cluster-only . --no-label

echo "==> Graphify · hubs arquiteturais"
graphify god-nodes --top 30 > "$OUT/GOD_NODES.txt"

echo "==> Graphify · integridade do grafo"
graphify diagnose multigraph --json > "$OUT/MULTIGRAPH_DIAG.json"

echo "==> Graphify · mapas de impacto"
for node in runMinutaPipeline requireAuth aiGatewayChat canAccessCase routeSkills; do
  graphify affected "$node" --depth 3 > "$IMPACT/$node.txt" 2>&1 || true
done

echo "Mapa atualizado em graphify-out/"
echo "Grafo navegável: graphify-out/graph.html"
echo "Relatório: graphify-out/GRAPH_REPORT.md"
echo "Hubs: graphify-out/GOD_NODES.txt"
echo "Impactos: graphify-out/impact/"
