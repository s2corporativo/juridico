export type EvidenceQualityInput = {
  sourceStatus: "official_confirmed" | "official_without_number" | "attachment_reviewed" | "secondary_pending" | "movement_observed" | "search_thematic";
  sourceUrl?: string | null;
  sourceHash?: string | null;
  cnjNumber?: string | null;
  decisionDate?: Date | string | null;
  tribunal?: string | null;
  court?: string | null;
  judgingBody?: string | null;
  validationNote?: string | null;
  topicCount: number;
  thesisCount: number;
  batchStatus?: "planned" | "reviewed" | "imported" | "partial" | "rejected" | null;
};

export type EvidenceQuality = {
  score: number;
  level: "robusta" | "suficiente" | "incompleta";
  earned: string[];
  missing: string[];
  disclaimer: string;
};

const hasText = (value: unknown) => typeof value === "string" && value.trim().length > 0;

export function calculateEvidenceQuality(input: EvidenceQualityInput): EvidenceQuality {
  const earned: string[] = [];
  const missing: string[] = [];
  let score = 0;
  const add = (condition: boolean, points: number, label: string) => {
    if (condition) {
      score += points;
      earned.push(label);
    } else missing.push(label);
  };

  add(input.sourceStatus === "official_confirmed", 25, "fonte oficial confirmada");
  add(hasText(input.sourceUrl) && /^https:\/\//i.test(input.sourceUrl!.trim()), 15, "URL pública segura");
  add(hasText(input.sourceHash) && /^[a-f0-9]{64}$/i.test(input.sourceHash!.trim()), 10, "hash de integridade");
  add(hasText(input.cnjNumber), 10, "número processual registrado");
  add(Boolean(input.decisionDate), 10, "data da decisão registrada");
  add(hasText(input.tribunal) && (hasText(input.court) || hasText(input.judgingBody)), 10, "órgão julgador identificado");
  add(hasText(input.validationNote), 5, "nota de validação");
  add(input.topicCount > 0, 5, "classificação taxonômica");
  add(input.thesisCount > 0, 5, "tese relacionada");
  add(input.batchStatus === "imported" || input.batchStatus === "reviewed", 5, "lote auditado");

  const level = score >= 85 ? "robusta" : score >= 65 ? "suficiente" : "incompleta";
  return {
    score,
    level,
    earned,
    missing,
    disclaimer: "O score mede completude documental e rastreabilidade; não mede força jurídica, probabilidade de êxito, vigência ou adequação ao caso concreto.",
  };
}

export function calculateAverageEvidenceScore(items: ReadonlyArray<Pick<EvidenceQuality, "score">>) {
  if (!items.length) return 0;
  return Math.round(items.reduce((sum, item) => sum + item.score, 0) / items.length);
}

export type EvidenceCoverageItem = {
  sourceLabel: string;
  sourceStatus: string;
  tribunal: string;
  firstDecisionDate?: Date | string | null;
  lastDecisionDate?: Date | string | null;
  records: number;
  officialUrlCount: number;
};

export function summarizeEvidenceCoverage(items: EvidenceCoverageItem[]) {
  const totalRecords = items.reduce((sum, item) => sum + item.records, 0);
  const officialUrlRecords = items.reduce((sum, item) => sum + item.officialUrlCount, 0);
  return {
    totalRecords,
    officialUrlRecords,
    officialUrlRate: totalRecords ? Math.round((officialUrlRecords / totalRecords) * 100) : 0,
    sourceCount: new Set(items.map(item => item.sourceLabel)).size,
    tribunalCount: new Set(items.map(item => item.tribunal)).size,
  };
}
