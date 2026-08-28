import { describe, expect, it } from "vitest";
import { buildPublicCitationReference } from "@shared/citation-reference";

describe("referência pública copiável", () => {
  it("formata identificação, data, URL e ressalva de conferência", () => {
    const text = buildPublicCitationReference({
      theme: "Responsabilidade civil",
      tribunal: "TJMG",
      cnjNumber: "0000000-00.2026.8.13.0000",
      externalId: "TJMG-PILOTO-001",
      decisionDate: "2026-08-26T00:00:00.000Z",
      sourceUrl: "https://www.tjmg.jus.br/exemplo",
    });
    expect(text).toContain("Tema: Responsabilidade civil");
    expect(text).toContain("TJMG, 0000000-00.2026.8.13.0000, decisão em 26/08/2026.");
    expect(text).toContain("Fonte registrada: https://www.tjmg.jus.br/exemplo");
    expect(text).toContain("Conferir a fonte oficial");
  });
});
