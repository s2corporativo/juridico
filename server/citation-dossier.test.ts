import { describe, expect, it } from "vitest";
import { buildCitationDossierMarkdown } from "@shared/citation-dossier";

describe("citation dossier export", () => {
  it("includes provenance and warnings without accepting personal fields", () => {
    const markdown = buildCitationDossierMarkdown({
      externalId: "tjmg-0001", tribunal: "TJMG", justice: "Estadual", decisionType: "Acórdão", sourceStatus: "official_confirmed",
      sourceLabel: "Portal oficial", sourceUrl: "https://example.gov.br", batchKey: "lote-1", topics: [{ title: "Tema", pathKey: "civel/tema" }], theses: [],
    });
    expect(markdown).toContain("## Proveniência");
    expect(markdown).toContain("revisão humana");
    expect(markdown).not.toContain("CPF");
  });
});
