import { describe, expect, it } from "vitest";
import { buildCivilConsumerMetricsQuery, summarizeCivilConsumerResponse, validateCivilConsumerRows } from "../scripts/rmbh-civil-consumer-metrics-runtime.mjs";

describe("métricas Cível/Consumidor DataJud", () => {
  it("monta consulta sem hits, sem source e com filtros explícitos", () => {
    const query = buildCivilConsumerMetricsQuery({ bodyCodes: ["17283"], civilCodes: ["899", "12935"], consumerCodes: ["1156", "1185"] });
    expect(query).toMatchObject({ size: 0, track_total_hits: true, _source: false });
    expect(query.query.bool.filter).toEqual(expect.arrayContaining([
      { match: { grau: "JE" } },
      { terms: { "classe.codigo": [436] } },
      { terms: { "orgaoJulgador.codigo": [17283] } },
      { range: { dataAjuizamento: { gte: "20250101000000", lte: "20260827235959" } } },
    ]));
    expect(query.aggs.by_category.aggs.by_body.aggs.by_month.date_histogram.format).toBe("yyyy-MM");
    expect(JSON.stringify(query)).not.toMatch(/"hits"\s*:|"_source"\s*:\s*true|processo|cpf|parte/i);
  });

  it("resume apenas buckets agregados em células únicas", () => {
    const summary = summarizeCivilConsumerResponse({
      hits: { total: { value: 9, relation: "eq" } },
      aggregations: { by_category: { buckets: {
        civil: { by_body: { buckets: [{ key: "17283", by_month: { buckets: [{ key_as_string: "2025-01", doc_count: 4 }] } }] } },
        consumer: { by_body: { buckets: [{ key: "17283", by_month: { buckets: [{ key_as_string: "2025-01", doc_count: 5 }] } }] } },
      } } },
    });
    expect(summary).toMatchObject({ matchedDocuments: 9, totalRelation: "eq" });
    expect(summary.rows).toEqual(expect.arrayContaining([
      expect.objectContaining({ judgingBodyCode: "17283", month: "2025-01", categoryCode: "899", amount: 4 }),
      expect.objectContaining({ judgingBodyCode: "17283", month: "2025-01", categoryCode: "1156", amount: 5 }),
    ]));
  });

  it("rejeita célula fora do escopo de órgãos ou categoria", () => {
    expect(() => validateCivilConsumerRows([{ judgingBodyCode: "999", month: "2025-01", categoryCode: "899", amount: 1 }], [{ judgingBodyCode: "17283" }])).toThrow();
    expect(() => validateCivilConsumerRows([{ judgingBodyCode: "17283", month: "2025-01", categoryCode: "999", amount: 1 }], [{ judgingBodyCode: "17283" }])).toThrow();
  });
});
