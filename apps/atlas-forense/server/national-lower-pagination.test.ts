import { describe, expect, it } from "vitest";
import { buildNationalLowerPageQuery, pageState } from "./national-lower-pagination";

describe("national lower pagination plan", () => {
  it("requests only process number and movement fields with an exact lower filter", () => {
    const query = buildNationalLowerPageQuery(null);
    expect(query._source).toEqual(["numeroProcesso", "movimentos.nome", "movimentos.dataHora"]);
    expect(query.query.bool.filter).toContainEqual({ term: { "movimentos.nome.keyword": "Baixa Definitiva" } });
    expect(query).not.toHaveProperty("_source.partes");
  });

  it("stops deterministically on an empty page or invalid cursor", () => {
    expect(pageState([])).toEqual({ done: true, nextCursor: null });
    expect(pageState([{ sort: ["0001", "id-1"] }])).toEqual({ done: false, nextCursor: ["0001", "id-1"] });
    expect(pageState([{ sort: [1, "id-1"] }])).toEqual({ done: true, nextCursor: null, reason: "invalid_sort_cursor" });
  });
});
