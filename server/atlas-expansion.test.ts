import { describe, expect, it } from "vitest";
import { INITIAL_LEGAL_BRANCHES, RMBH_MUNICIPALITIES, isRmbhMunicipality } from "@shared/atlas-expansion";

describe("modelo de expansão Atlas", () => {
  it("mantém os 34 municípios legais, incluindo o núcleo metropolitano solicitado", () => {
    expect(RMBH_MUNICIPALITIES).toHaveLength(34);
    expect(RMBH_MUNICIPALITIES).toEqual(expect.arrayContaining([
      expect.objectContaining({ name: "Belo Horizonte", ibgeCode: 3106200 }),
      expect.objectContaining({ name: "Betim", ibgeCode: 3106705 }),
      expect.objectContaining({ name: "Contagem", ibgeCode: 3118601 }),
      expect.objectContaining({ name: "Igarapé", ibgeCode: 3130101 }),
    ]));
    expect(isRmbhMunicipality(3106200)).toBe(true);
    expect(isRmbhMunicipality(9999999)).toBe(false);
  });

  it("declara competência e condição de fonte para todos os ramos", () => {
    expect(INITIAL_LEGAL_BRANCHES).toHaveLength(6);
    for (const branch of INITIAL_LEGAL_BRANCHES) {
      expect(branch.topicRoots.length).toBeGreaterThan(0);
      expect(branch.jurisdictions.length).toBeGreaterThan(0);
      expect(branch.scopeNote).toMatch(/./);
    }
    expect(INITIAL_LEGAL_BRANCHES.find((branch) => branch.key === "work-social-security")?.status).toBe("mapping_required");
  });
});
