import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = join(import.meta.dir, "..");
const API = join(ROOT, "src", "app", "api");
const SRC = join(ROOT, "src");

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) out.push(...walk(path));
    else out.push(path);
  }
  return out;
}

function category(route: string): string {
  if (route.startsWith("/api/auth/")) return "identity";
  if (
    route.startsWith("/api/generate-minuta") ||
    ["/api/brain", "/api/molde", "/api/evidence/ingest", "/api/citations/verify", "/api/documents", "/api/templates", "/api/suggest"].includes(route)
  ) return "core";
  if (
    route.startsWith("/api/skills") ||
    ["/api/legal-sources", "/api/datajud", "/api/fontes/ibge", "/api/fontes/querido-diario", "/api/news"].includes(route)
  ) return "knowledge";
  if (
    ["/api/clients", "/api/cases", "/api/cases/movements", "/api/audiencias", "/api/prazos", "/api/intimacoes", "/api/financeiro", "/api/advogados", "/api/alertas", "/api/produtividade", "/api/proximos"].includes(route)
  ) return "office";
  return "internal";
}

const sourceFiles = walk(SRC).filter((p) => /.(ts|tsx)$/.test(p));
const routes = walk(API)
  .filter((p) => p.endsWith("route.ts"))
  .sort()
  .map((path) => {
    const route = "/" + relative(join(ROOT, "src", "app"), path).replaceAll("\\", "/").replace(//route.ts$/, "");
    const source = readFileSync(path, "utf8");
    const methods = [...source.matchAll(/export async function (GET|POST|PUT|PATCH|DELETE)/g)].map((m) => m[1]);
    const refs = sourceFiles
      .filter((candidate) => candidate !== path && readFileSync(candidate, "utf8").includes(route))
      .map((candidate) => relative(ROOT, candidate).replaceAll("\\", "/"));
    return { route, category: category(route), methods, refs };
  });

const retired = ["/api/skill-router", "/api/intelligence/ingest-pages", "/api/caso-mapa"];
const regressions = retired.filter((route) => routes.some((x) => x.route === route));
const counts = Object.fromEntries(
  ["core", "knowledge", "office", "identity", "internal"].map((key) => [
    key,
    routes.filter((x) => x.category === key).length,
  ]),
);

const payload = { total: routes.length, counts, retiredRoutesPresent: regressions, routes };
console.log(JSON.stringify(payload, null, 2));

if (process.argv.includes("--check")) {
  if (regressions.length) {
    console.error("Rotas aposentadas reapareceram:", regressions.join(", "));
    process.exit(1);
  }
  if (routes.length > 56) {
    console.error(`A superfície de API cresceu de 56 para ${routes.length} rotas; revise antes do merge.`);
    process.exit(1);
  }
}
