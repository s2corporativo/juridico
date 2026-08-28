import { describe, expect, it } from "vitest";
import { buildCivilConsumerPreflightQuery, summarizeCivilConsumerPreflight } from "../scripts/rmbh-civil-consumer-preflight-runtime.mjs";

describe("pré-teste agregado Cível/Consumidor RMBH", () => {
  it("solicita apenas agregações TJMG JEC sem documentos individuais", () => {
    const query = buildCivilConsumerPreflightQuery();
    expect(query.size).toBe(0);
    expect(JSON.stringify(query)).not.toContain("top_hits");
    expect(JSON.stringify(query)).not.toContain("numeroProcesso");
    expect(query.query.bool.must).toContainEqual({ terms: { "assuntos.codigo": [899, 1156] } });
    expect(query.query.bool.must).toContainEqual({ terms: { "classe.codigo": [436] } });
  });

  it("resume apenas buckets permitidos e nunca o conteúdo da resposta", () => {
    const summary = summarizeCivilConsumerPreflight({
      hits: { total: { value: 12 } },
      aggregations: {
        rootSubjects: { buckets: [{ key: 1156, doc_count: 9 }, { key: 9999, doc_count: 3 }] },
        classes: { buckets: [{ key: 436, doc_count: 12 }] },
        judgingBodies: { buckets: [{ key: 40011, doc_count: 7 }, { key: 8161, doc_count: 5 }] },
      },
    });
    expect(summary).toEqual({
      observedProcessCount: 12,
      indexedRootSubjects: [{ code: "1156", count: 9 }],
      indexedJecClass: [{ code: "436", count: 12 }],
      distinctJudgingBodies: 2,
      usable: true,
    });
  });
});
