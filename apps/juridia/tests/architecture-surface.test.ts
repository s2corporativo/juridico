import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const APP_ROOT = process.cwd();
const API_ROOT = join(APP_ROOT, "src/app/api");

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

describe("Superfície arquitetural", () => {
  test("mantém exatamente 50 rotas API após consolidação", () => {
    const routes = walk(API_ROOT).filter((p) => p.endsWith("/route.ts"));
    expect(routes.length).toBe(50);
  });

  test("wrappers LexValida removidos não reaparecem", () => {
    const removed = [
      "julgador-checklist",
      "valor-causa",
      "triagem-documento",
      "vedacao-surpresa",
      "salvaguardas",
      "lexvalida/pipeline",
    ];

    for (const route of removed) {
      expect(existsSync(join(API_ROOT, route, "route.ts"))).toBe(false);
    }
  });

  test("menu principal permanece orientado a seis tarefas do advogado", () => {
    const source = readFileSync(join(APP_ROOT, "src/components/app/index.tsx"), "utf8");
    const tabsBlock = source.match(/const TABS = \[([\s\S]*?)\];/)?.[1] || "";
    const ids = [...tabsBlock.matchAll(/id:\s*"([^"]+)"/g)].map((m) => m[1]);
    const labels = [...tabsBlock.matchAll(/label:\s*"([^"]+)"/g)].map((m) => m[1]);

    expect(ids).toEqual(["dashboard", "cerebro", "generator", "datajud", "biblioteca", "settings"]);
    expect(labels).toEqual(["Início", "Analisar", "Redigir", "Pesquisar", "Biblioteca", "Governança"]);
  });

  test("Editor permanece contextual; Cálculos e Visual Law não ficam na shell", () => {
    const source = readFileSync(join(APP_ROOT, "src/components/app/index.tsx"), "utf8");
    expect(source).toContain('appTab === "editor"');
    expect(source).not.toContain('appTab === "calculadora"');
    expect(source).not.toContain('appTab === "visuallaw"');
  });
});
