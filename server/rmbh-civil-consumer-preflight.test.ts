import { describe, expect, it } from "vitest";
import {
  buildCivilConsumerBaseDiagnosticQuery,
  buildCivilConsumerPreflightQuery,
  buildCivilConsumerSubjectAggregationDiagnosticQuery,
  buildCivilConsumerSubjectFilterDiagnosticQuery,
  summarizeCivilConsumerBaseDiagnostic,
  summarizeCivilConsumerPreflight,
  summarizeCivilConsumerSubjectAggregationDiagnostic,
} from "../scripts/rmbh-civil-consumer-preflight-runtime.mjs";

describe("pré-teste agregado Cível/Consumidor RMBH", () => {
  it("isola a consulta-base de diagnóstico sem assunto, agregação, fonte ou hits", () => {
    const query = buildCivilConsumerBaseDiagnosticQuery();
    expect(query).toMatchObject({ size: 0, track_total_hits: true, _source: false });
    expect(JSON.stringify(query)).not.toContain("assuntos");
    expect(JSON.stringify(query)).not.toContain("aggs");
    expect(JSON.stringify(query)).not.toContain("numeroProcesso");
    expect(summarizeCivilConsumerBaseDiagnostic({ hits: { total: { value: 12, relation: "eq" } } })).toEqual({
      observedProcessCount: 12,
      totalRelation: "eq",
    });
  });

  it("agrega assuntos sem aplicar filtro temático e descarta buckets não permitidos no resumo", () => {
    const query = buildCivilConsumerSubjectAggregationDiagnosticQuery();
    expect(query).toMatchObject({ size: 0, _source: false, aggs: { subjectCodes: { terms: { field: "assuntos.codigo" } } } });
    expect(query.query.bool.must).not.toContainEqual({ terms: { "assuntos.codigo": [899, 1156] } });
    expect(summarizeCivilConsumerSubjectAggregationDiagnostic({
      hits: { total: { value: 12, relation: "eq" } },
      aggregations: { subjectCodes: { buckets: [{ key: 899, doc_count: 7 }, { key: 9999, doc_count: 5 }] } },
    })).toEqual({
      observedProcessCount: 12,
      totalRelation: "eq",
      indexedTargetRoots: [{ code: "899", count: 7 }],
      targetRootsFound: true,
    });
  });

  it("testa o filtro TPU sem combinar agregação de assuntos", () => {
    const query = buildCivilConsumerSubjectFilterDiagnosticQuery();
    expect(query).toMatchObject({ size: 0, _source: false });
    expect(query.query.bool.must).toContainEqual({ terms: { "assuntos.codigo": [899, 1156] } });
    expect(query).not.toHaveProperty("aggs");
  });

  it("solicita apenas agregações TJMG JEC sem documentos individuais", () => {
    const query = buildCivilConsumerPreflightQuery();
    expect(query.size).toBe(0);
    expect(JSON.stringify(query)).not.toContain("top_hits");
    expect(JSON.stringify(query)).not.toContain("numeroProcesso");
    expect(JSON.stringify(query)).not.toContain("include");
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
      subjectRootLimitation: null,
    });
  });

  it("declara a limitação sem inferir descendentes quando nenhuma raiz TPU exata está indexada", () => {
    const summary = summarizeCivilConsumerPreflight({
      hits: { total: { value: 0 } },
      aggregations: { rootSubjects: { buckets: [] }, classes: { buckets: [{ key: 436, doc_count: 375798 }] }, judgingBodies: { buckets: [] } },
    });
    expect(summary).toMatchObject({ usable: false, indexedRootSubjects: [], subjectRootLimitation: expect.stringContaining("não permite inferir descendentes") });
  });
});
