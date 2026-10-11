import { test, expect } from "bun:test";
import { resolveAppTab, resolveAppDestination } from "../src/lib/store";

test("five legal AI modules are the only valid visible destinations", () => {
  const current = ["assistente", "pesquisa", "analise", "minutas", "biblioteca"] as const;
  for (const item of current) expect(resolveAppTab(item)).toBe(item);
  expect(new Set(current.map(resolveAppTab)).size).toBe(5);
});

test("legacy editor and generation links remain functional through focused Minutas module", () => {
  expect(resolveAppDestination("editor")).toEqual(["minutas", "editor"]);
  expect(resolveAppDestination("generator")).toEqual(["minutas", "generator"]);
  expect(resolveAppDestination("visuallaw")).toEqual(["minutas", "visuallaw"]);
  expect(resolveAppDestination("documents")).toEqual(["biblioteca", "biblioteca"]);
});

test("legacy ERP shortcuts cannot open finance or office screens", () => {
  for (const item of ["financeiro", "produtividade", "clients", "prazos", "audiencias", "settings", "no-such-tab"]) {
    const [tab, detail] = resolveAppDestination(item);
    expect(tab).toBe("assistente");
    expect(detail).toBe("assistente");
  }
});

test("research and case analysis remain distinct modules", () => {
  expect(resolveAppDestination("jurisprudence")).toEqual(["pesquisa", "pesquisa"]);
  expect(resolveAppDestination("cerebro")).toEqual(["analise", "cerebro"]);
  expect(resolveAppDestination("intelligence")).toEqual(["analise", "intelligence"]);
});
