import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { applyAtlasPublicSourceScope } from "./public-sources";

describe("Atlas public-only boundary", () => {
  it("does not expose office management procedures", () => {
    const routes = Object.keys(appRouter._def.procedures);
    expect(routes.some(route => route.startsWith("office."))).toBe(false);
    expect(routes).toContain("compendium.search");
    expect(routes).toContain("sources.list");
  });

  it("does not publish legacy connector claims from existing catalog rows", () => {
    const legacy = {
      sourceKey: "cnj-djen-comunica",
      integrationStatus: "integrated",
      usageNote: "Conector do Escritório em /escritorio/comunicacoes",
      privacyNote: "Caixa do Escritório",
    };
    const source = applyAtlasPublicSourceScope(legacy);
    expect(source.integrationStatus).toBe("not_integrated");
    expect(source.usageNote).not.toContain("/escritorio/");
    expect(source.privacyNote).not.toContain("Escritório");
    for (const sourceKey of ["lexml", "stj-dados-abertos", "tjmg-jurisprudencia", "imprensa-oficial-mg"]) {
      const publicSource = applyAtlasPublicSourceScope({ ...legacy, sourceKey });
      expect(publicSource.usageNote).not.toContain("/escritorio/");
      expect(publicSource.usageNote).not.toContain("Escritório");
    }
  });
});
