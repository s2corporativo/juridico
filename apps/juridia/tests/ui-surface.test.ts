import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const appIndex = readFileSync(join(import.meta.dir, "..", "src", "components", "app", "index.tsx"), "utf8");
const store = readFileSync(join(import.meta.dir, "..", "src", "lib", "store.ts"), "utf8");

describe("superfície operacional da UI", () => {
  test("menu principal mantém somente seis tarefas do advogado", () => {
    const labels = [...appIndex.matchAll(/label:\s*"([^"]+)"/g)].map((m) => m[1]);
    expect(labels).toEqual(["Início", "Analisar", "Redigir", "Pesquisar", "Biblioteca", "Governança"]);
  });

  test("motores técnicos antigos não voltam ao AppShell", () => {
    for (const name of ["Assistente", "Inteligencia", "Pipeline", "Homologacao", "GrafoSistema"]) {
      expect(appIndex.includes(name)).toBe(false);
    }
  });

  test("estado de navegação mantém apenas tarefas e telas contextuais", () => {
    const typeBlock = store.match(/export type AppTab =([\s\S]*?);/)?.[1] || "";
    for (const old of ["assistente", "intelligence", "pipeline", "homologacao", "grafo"]) {
      expect(typeBlock.includes(`"${old}"`)).toBe(false);
    }
    for (const current of ["dashboard", "cerebro", "generator", "datajud", "biblioteca", "settings", "editor", "calculadora", "visuallaw"]) {
      expect(typeBlock.includes(`"${current}"`)).toBe(true);
    }
  });
});
