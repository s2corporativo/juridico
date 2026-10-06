import { describe, expect, it } from "vitest";
import { validateRmbhCoverageImport } from "../scripts/rmbh-coverage-import-runtime.mjs";

const manifest = {
  alias: "tjmg",
  mode: "execute",
  state: "completed",
  scope: { municipalities: 34 },
};

const facets = [{
  municipality: "Betim",
  municipalityIbgeCode: 3106705,
  judgingBodyCode: "40011",
  judgingBodyLabel: "Unidade Jurisdicional Única — 1º JD da Comarca de Betim",
  amount: 7148,
}];

describe("importação de cobertura RMBH", () => {
  it("aceita somente facetas agregadas TJMG com proveniência territorial", () => {
    expect(validateRmbhCoverageImport(manifest, facets)).toEqual({
      expectedMunicipalities: 34,
      mappedMunicipalities: 1,
      totalBodies: 1,
    });
  });

  it("rejeita campos estruturais de processos ou respostas brutas", () => {
    expect(() => validateRmbhCoverageImport(manifest, [{ ...facets[0], numeroProcesso: "0000000-00.0000.0.00.0000" }])).toThrow("campo individual ou resposta bruta");
  });

  it("rejeita linhas sem o código IBGE ou código de órgão", () => {
    expect(() => validateRmbhCoverageImport(manifest, [{ ...facets[0], municipalityIbgeCode: undefined }])).toThrow("linhas agregadas válidas");
  });
});
