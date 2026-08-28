export const CIVIL_CONSUMER_ROOT_SUBJECTS = [899, 1156];
export const JEC_PROCEDURE_CLASS = 436;

export function buildCivilConsumerBaseDiagnosticQuery() {
  return {
    size: 0,
    track_total_hits: true,
    _source: false,
    query: {
      bool: {
        must: [
          { match: { grau: "JE" } },
          { terms: { "classe.codigo": [JEC_PROCEDURE_CLASS] } },
          { range: { dataAjuizamento: { gte: "20250101000000", lte: "20260826235959" } } },
        ],
      },
    },
  };
}

export function buildCivilConsumerSubjectAggregationDiagnosticQuery() {
  return {
    ...buildCivilConsumerBaseDiagnosticQuery(),
    aggs: {
      subjectCodes: { terms: { field: "assuntos.codigo", size: 100 } },
    },
  };
}

export function buildCivilConsumerSubjectFilterDiagnosticQuery() {
  const query = buildCivilConsumerBaseDiagnosticQuery();
  return {
    ...query,
    query: {
      bool: {
        must: [...query.query.bool.must, { terms: { "assuntos.codigo": CIVIL_CONSUMER_ROOT_SUBJECTS } }],
      },
    },
  };
}

export function buildCivilConsumerDescendantFilterDiagnosticQuery(subjectCodes) {
  const normalizedCodes = [...new Set(subjectCodes)].sort((left, right) => left - right);
  if (normalizedCodes.length === 0 || normalizedCodes.length > 1_024 || !normalizedCodes.every(Number.isInteger)) {
    throw new Error("Filtro de descendentes TPU inválido para diagnóstico agregado.");
  }
  const query = buildCivilConsumerBaseDiagnosticQuery();
  return {
    ...query,
    query: {
      bool: {
        must: [...query.query.bool.must, { terms: { "assuntos.codigo": normalizedCodes } }],
      },
    },
  };
}

export function summarizeCivilConsumerBaseDiagnostic(payload) {
  const total = Number(payload?.hits?.total?.value ?? 0);
  const relation = payload?.hits?.total?.relation;
  return {
    observedProcessCount: Number.isSafeInteger(total) && total >= 0 ? total : 0,
    totalRelation: relation === "eq" || relation === "gte" ? relation : "unknown",
  };
}

export function summarizeCivilConsumerSubjectAggregationDiagnostic(payload) {
  const base = summarizeCivilConsumerBaseDiagnostic(payload);
  const indexedTargetRoots = (payload?.aggregations?.subjectCodes?.buckets ?? [])
    .map((bucket) => ({ code: String(bucket?.key ?? ""), count: Number(bucket?.doc_count ?? 0) }))
    .filter((bucket) => CIVIL_CONSUMER_ROOT_SUBJECTS.includes(Number(bucket.code)) && Number.isSafeInteger(bucket.count) && bucket.count >= 0);
  return { ...base, indexedTargetRoots, targetRootsFound: indexedTargetRoots.length > 0 };
}

export function summarizeCivilConsumerSubjectFilterDiagnostic(payload) {
  return summarizeCivilConsumerBaseDiagnostic(payload);
}

export function summarizeCivilConsumerDescendantFilterDiagnostic(payload) {
  return summarizeCivilConsumerBaseDiagnostic(payload);
}

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
      rootSubjects: { terms: { field: "assuntos.codigo", size: 10 } },
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
    subjectRootLimitation: rootSubjects.length > 0 ? null : "Nenhuma raiz TPU exata retornou no recorte; a consulta não permite inferir descendentes sem mapeamento oficial adicional.",
  };
}
