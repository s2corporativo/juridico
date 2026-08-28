import { describe, expect, it } from "vitest";
import { buildRmbhJudgingBodyQuery, municipalityFromJudgingBody, summarizeRmbhFacetRows, toRmbhJudgingBodyRow } from "../scripts/rmbh-tjmg-facets-runtime.mjs";

const municipalities = [
  { name: "Betim", ibgeCode: 3106705 },
  { name: "Igarapé", ibgeCode: 3130101 },
];

describe("facetas territoriais RMBH do TJMG", () => {
  it("consulta somente agregações JEC e campos de órgão", () => {
    const query = buildRmbhJudgingBodyQuery({ pageSize: 250 });
    expect(query.size).toBe(0);
    expect(query.aggs.facets.aggs.sample.top_hits._source.includes).toEqual(["orgaoJulgador"]);
    expect(query.query.bool.must).toEqual(expect.arrayContaining([{ match: { grau: "JE" } }, { terms: { "classe.codigo": [436] } }]));
  });

  it("vincula somente referência exata de comarca e rejeita homônimos", () => {
    expect(municipalityFromJudgingBody("Unidade Jurisdicional Única da Comarca de Betim", municipalities)?.ibgeCode).toBe(3106705);
    expect(municipalityFromJudgingBody("Vara Única de Igarapé-Miri", municipalities)).toBeNull();
  });

  it("produz somente célula agregada válida", () => {
    const row = toRmbhJudgingBodyRow({ key: { code: 40011 }, doc_count: 7148, sample: { hits: { hits: [{ _source: { orgaoJulgador: { nome: "Unidade Jurisdicional Única da Comarca de Betim" } } }] } } }, municipalities);
    expect(row).toEqual(expect.objectContaining({ municipality: "Betim", municipalityIbgeCode: 3106705, judgingBodyCode: "40011", amount: 7148 }));
    expect(summarizeRmbhFacetRows([row]).municipalitiesWithBodies).toBe(1);
  });
});
