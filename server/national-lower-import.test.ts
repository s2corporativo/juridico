import { describe, expect, it } from "vitest";

const importer = await import("../scripts/import-national-jec-lower-pilot.mjs");

const manifest = {
  mode: "pilot",
  state: "completed",
  expectedTribunals: 1,
  respondedTribunals: 1,
  queryFingerprint: "a".repeat(64),
  scope: { judgingBodyCodes: ["40011", "8161"] },
};

describe("territorial lower import", () => {
  it("accepts only aggregate TJMG rows for the two approved bodies", () => {
    const result = importer.parseTerritorialLowerPilot({
      manifestText: JSON.stringify(manifest),
      metricsText: JSON.stringify([
        { alias: "tjmg", uf: "MG", month: "2026-06", amount: 38, judgingBodyCode: "40011" },
        { alias: "tjmg", uf: "MG", month: "2026-06", amount: 20, judgingBodyCode: "8161" },
      ]),
    });
    expect(result.metrics).toHaveLength(2);
  });

  it("rejects unapproved bodies and artifacts with individual-data markers", () => {
    expect(() => importer.parseTerritorialLowerPilot({
      manifestText: JSON.stringify(manifest),
      metricsText: JSON.stringify([{ alias: "tjmg", uf: "MG", month: "2026-06", amount: 38, judgingBodyCode: "99999" }]),
    })).toThrow("recorte territorial");
    expect(() => importer.parseTerritorialLowerPilot({
      manifestText: JSON.stringify({ ...manifest, rawRecord: { numeroProcesso: "identificador-proibido" } }),
      metricsText: JSON.stringify([{ alias: "tjmg", uf: "MG", month: "2026-06", amount: 38, judgingBodyCode: "40011" }]),
    })).toThrow("dado individual");
  });

  it("permits a privacy-policy description without treating it as persisted individual data", () => {
    expect(() => importer.parseTerritorialLowerPilot({
      manifestText: JSON.stringify({ ...manifest, dataPolicy: "numeroProcesso é transitório e não persistido" }),
      metricsText: JSON.stringify([{ alias: "tjmg", uf: "MG", month: "2026-06", amount: 38, judgingBodyCode: "40011" }]),
    })).not.toThrow();
  });
});
