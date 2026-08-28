import { describe, expect, it } from "vitest";
import { buildMetropolitanCoverageRows } from "@shared/metropolitan-coverage";

describe("cobertura metropolitana", () => {
  it("preserva município sem órgão como lacuna e não o infere por aproximação", () => {
    const rows = buildMetropolitanCoverageRows([
      { name: "Betim", ibgeCode: 3106705 },
      { name: "Igarapé", ibgeCode: 3130101 },
    ], [{ municipalityName: "Betim", municipalityIbgeCode: "3106705", judgingBodyCode: "40011", judgingBodyLabel: "Órgão Betim", amount: 12 }]);
    expect(rows).toMatchObject([
      { name: "Betim", state: "mapped", bodyCount: 1, facetAmount: 12 },
      { name: "Igarapé", state: "not_mapped", bodyCount: 0, facetAmount: 0 },
    ]);
  });
});
