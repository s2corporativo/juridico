export const CIVIL_CONSUMER_ROOT_SUBJECTS = [899, 1156];
export const JEC_PROCEDURE_CLASS = 436;

export function buildCivilConsumerPreflightQuery() {
  return {
    size: 0,
    track_total_hits: true,
    query: {
      bool: {
        must: [
          { match: { grau: "JE" } },
          { terms: { "classe.codigo": [JEC_PROCEDURE_CLASS] } },
          { terms: { "assuntos.codigo": CIVIL_CONSUMER_ROOT_SUBJECTS } },
          { range: { dataAjuizamento: { gte: "20250101000000", lte: "20260826235959" } } },
        ],
      },
    },
    aggs: {
      rootSubjects: { terms: { field: "assuntos.codigo", size: 10, include: "899|1156" } },
      classes: { terms: { field: "classe.codigo", size: 10 } },
      judgingBodies: { terms: { field: "orgaoJulgador.codigo", size: 500 } },
    },
  };
}

export function summarizeCivilConsumerPreflight(payload) {
  const total = Number(payload?.hits?.total?.value ?? 0);
  const rootSubjects = (payload?.aggregations?.rootSubjects?.buckets ?? [])
    .map((bucket) => ({ code: String(bucket?.key ?? ""), count: Number(bucket?.doc_count ?? 0) }))
    .filter((bucket) => CIVIL_CONSUMER_ROOT_SUBJECTS.includes(Number(bucket.code)) && Number.isSafeInteger(bucket.count) && bucket.count >= 0);
  const classes = (payload?.aggregations?.classes?.buckets ?? [])
    .map((bucket) => ({ code: String(bucket?.key ?? ""), count: Number(bucket?.doc_count ?? 0) }))
    .filter((bucket) => bucket.code === String(JEC_PROCEDURE_CLASS) && Number.isSafeInteger(bucket.count) && bucket.count >= 0);
  const distinctJudgingBodies = (payload?.aggregations?.judgingBodies?.buckets ?? [])
    .map((bucket) => String(bucket?.key ?? ""))
    .filter((code) => /^\d+$/.test(code)).length;
  return {
    observedProcessCount: Number.isSafeInteger(total) && total >= 0 ? total : 0,
    indexedRootSubjects: rootSubjects,
    indexedJecClass: classes,
    distinctJudgingBodies,
    usable: rootSubjects.length > 0 && classes.length > 0,
  };
}
