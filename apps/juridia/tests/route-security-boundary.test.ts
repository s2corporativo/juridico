import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const APP_API = join(import.meta.dir, "..", "src", "app", "api");
const SRC = join(import.meta.dir, "..", "src");
const SCHEMA = join(import.meta.dir, "..", "prisma", "schema.prisma");

const PUBLIC_ROUTES = new Set([
  "auth/login/route.ts",
  "auth/logout/route.ts",
  "auth/oidc/.well-known/openid-configuration/route.ts",
  "auth/oidc/authorize/route.ts",
  "auth/oidc/jwks/route.ts",
  "auth/oidc/route.ts",
  "auth/oidc/token/route.ts",
  "auth/oidc/verify/route.ts",
  "fontes/ibge/route.ts",
  "fontes/querido-diario/route.ts",
  "news/route.ts",
]);

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) out.push(...walk(path));
    else out.push(path);
  }
  return out;
}

describe("route security boundary", () => {
  test("toda rota privada exige requireAuth", () => {
    const violations: string[] = [];
    for (const path of walk(APP_API).filter((p) => p.endsWith("route.ts"))) {
      const rel = relative(APP_API, path).replaceAll("\\", "/");
      const source = readFileSync(path, "utf8");
      const hasExportedMethod = /export\s+(?:async\s+)?function\s+(GET|POST|PUT|PATCH|DELETE)/.test(source);
      if (!hasExportedMethod || PUBLIC_ROUTES.has(rel)) continue;
      if (!source.includes("requireAuth")) violations.push(rel);
    }
    expect(violations).toEqual([]);
  });

  test("não há default-case, usuário demo ou bypass allowUnsafe no código operacional/schema", () => {
    const violations: string[] = [];
    for (const path of walk(SRC).filter((p) => /\.(ts|tsx)$/.test(p))) {
      const source = readFileSync(path, "utf8");
      if (/default-case|demo@juridia|allowUnsafe/i.test(source)) {
        violations.push(relative(SRC, path).replaceAll("\\", "/"));
      }
    }
    const schema = readFileSync(SCHEMA, "utf8");
    if (/default-case|demo@juridia|allowUnsafe/i.test(schema)) violations.push("prisma/schema.prisma");
    expect(violations).toEqual([]);
  });
});
