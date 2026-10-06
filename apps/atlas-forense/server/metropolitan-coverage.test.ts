import { describe, expect, it } from "vitest";
import { buildMetropolitanCoverageRows, classifyJudgingBodyLabel } from "@shared/metropolitan-coverage";

describe("cobertura metropolitana", () => {
  it("preserva município sem órgão como lacuna e não o infere por aproximação", () => {
    const rows = buildMetropolitanCoverageRows([
      { name: "Betim", ibgeCode: 3106705 },
      { name: "Igarapé", ibgeCode: 3130101 },
    ], [{ municipalityName: "Betim", municipalityIbgeCode: "3106705", judgingBodyCode: "40011", judgingBodyLabel: "Órgão Betim", amount: 12 }]);
    expect(rows).toMatchObject([
      { name: "Betim", state: "mapped", bodyCount: 1, jecNamedBodyCount: 0, otherNamedBodyCount: 1, facetAmount: 12 },
      { name: "Igarapé", state: "not_mapped", bodyCount: 0, facetAmount: 0 },
    ]);
  });

  it("não presume competência JEC a partir do nome da comarca", () => {
    expect(classifyJudgingBodyLabel("2ª Vara Cível da Comarca de Betim")).toBe("other_named");
    expect(classifyJudgingBodyLabel("Juizado Especial Cível da Comarca de Igarapé")).toBe("jec_named");
  });
});
