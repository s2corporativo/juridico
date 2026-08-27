import { describe, expect, it } from "vitest";
import { buildCompendiumHomeStats } from "@shared/compendium-home";

describe("compendium home statistics", () => {
  it("presents registered and requested comarcas without inventing Igarapé records", () => {
    const stats = buildCompendiumHomeStats({
      topics: [{ id: 1 }],
      theses: [{ id: 1 }],
      metrics: { decisionCount: 6, officialSourceCount: 6, sourceCount: 6, authorityCount: 4 },
      cityCoverage: [{ city: "Betim", decisionCount: 2 }],
    });

    expect(stats).toMatchObject({ themes: 1, theses: 1, authorities: 4, decisions: 6 });
    expect(stats.comarcas).toEqual([
      { label: "Betim/MG", catalogued: true, decisionCount: 2 },
      { label: "Igarapé/MG", catalogued: false, decisionCount: 0 },
    ]);
  });
});
