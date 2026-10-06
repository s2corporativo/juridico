import { describe, expect, it } from "vitest";
import { normalizeStjPackage } from "./public-sources";

describe("public legal sources", () => {
  it("normalizes only catalog metadata, preserving the resource links outside the public jurisprudence layer", () => {
    const entry = normalizeStjPackage({
      id: "dataset-1",
      name: "espelhos-de-acordaos",
      title: "Espelhos de acórdãos",
      notes: "<p>Metadados públicos do catálogo.</p>",
      license_title: "Creative Commons Atribuição",
      resources: [{ format: "json" }, { format: "CSV" }, { format: "JSON" }],
    });

    expect(entry).toMatchObject({ id: "dataset-1", resourceCount: 3, formats: ["JSON", "CSV"], license: "Creative Commons Atribuição" });
    expect(entry.summary).toBe("Metadados públicos do catálogo.");
    expect(entry.catalogUrl).toContain("espelhos-de-acordaos");
  });
});
