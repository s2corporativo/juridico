import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { causalAnnotations, causalCases, causalEvidenceRefs, causalOutcomes, causalRuns } from "../drizzle/causal-schema";
import { getCausalDb } from "./causal-db";

export const CAUSAL_DASHBOARD_CLAIM_TYPES = ["dano_moral", "dano_material"] as const;
export type CausalDashboardClaimType = (typeof CAUSAL_DASHBOARD_CLAIM_TYPES)[number];
export const CAUSAL_DASHBOARD_REVIEW_STATUSES = ["pending", "approved", "rejected", "returned"] as const;
export type CausalDashboardReviewStatus = (typeof CAUSAL_DASHBOARD_REVIEW_STATUSES)[number];

type AnnotationRow = {
  claimType: string;
  role: string;
  label: string;
  normalizedLabel: string;
  reviewStatus: string;
  caseCount: number | string;
  mentionCount: number | string;
};

type OutcomeRow = {
  claimType: string;
  outcome: string;
  reviewStatus: string;
  caseCount: number | string;
  amountCents: number | string | null;
};

type ReviewRow = { reviewStatus: string; count: number | string };
type MunicipalityRow = { municipality: string | null; count: number | string };

export type CausalDashboardData = ReturnType<typeof summarizeCausalDashboard>;

function asNumber(value: number | string | null | undefined): number {
  return Number(value ?? 0);
}

function displayClaimType(value: string): string {
  return value === "dano_moral" ? "Dano moral" : "Dano material";
}

function displayOutcome(value: string): string {
  return value.replaceAll("_", " ").replace(/^./, char => char.toUpperCase());
}

export function summarizeCausalDashboard(input: {
  latestRun: { runKey: string; sourceKey: string; scope: string; periodStart: string; periodEnd: string; methodologyVersion: string; status: string; updatedAt: Date | string } | null;
  caseCount: number | string;
  evidenceCount: number | string;
  annotationRows: AnnotationRow[];
  outcomeRows: OutcomeRow[];
  reviewRows: ReviewRow[];
  municipalityRows: MunicipalityRow[];
  filter: { claimType: CausalDashboardClaimType | "all"; reviewStatus: CausalDashboardReviewStatus | "all" };
}) {
  const allowedClaims = input.filter.claimType === "all" ? new Set<string>(CAUSAL_DASHBOARD_CLAIM_TYPES) : new Set([input.filter.claimType]);
  const annotations = input.annotationRows
    .filter(row => allowedClaims.has(row.claimType))
    .filter(row => input.filter.reviewStatus === "all" || row.reviewStatus === input.filter.reviewStatus)
    .map(row => ({
      claimType: row.claimType as CausalDashboardClaimType,
      claimLabel: displayClaimType(row.claimType),
      role: row.role,
      label: row.label,
      normalizedLabel: row.normalizedLabel,
      reviewStatus: row.reviewStatus,
      cases: asNumber(row.caseCount),
      mentions: asNumber(row.mentionCount),
    }))
    .sort((left, right) => right.cases - left.cases || right.mentions - left.mentions || left.label.localeCompare(right.label, "pt-BR"));

  const outcomes = input.outcomeRows
    .filter(row => allowedClaims.has(row.claimType))
    .filter(row => input.filter.reviewStatus === "all" || row.reviewStatus === input.filter.reviewStatus)
    .map(row => ({
      claimType: row.claimType as CausalDashboardClaimType,
      claimLabel: displayClaimType(row.claimType),
      outcome: row.outcome,
      outcomeLabel: displayOutcome(row.outcome),
      reviewStatus: row.reviewStatus,
      cases: asNumber(row.caseCount),
      amountCents: asNumber(row.amountCents),
    }))
    .sort((left, right) => right.cases - left.cases || left.outcome.localeCompare(right.outcome));

  const factGenerators = annotations.filter(row => row.role === "fato_gerador");
  const requests = annotations.filter(row => row.role === "pedido");
  const casesByMunicipality = input.municipalityRows
    .map(row => ({ municipality: row.municipality || "Não informado", cases: asNumber(row.count) }))
    .sort((left, right) => right.cases - left.cases || left.municipality.localeCompare(right.municipality, "pt-BR"));

  return {
    enabled: true,
    filter: input.filter,
    summary: {
      cases: asNumber(input.caseCount),
      evidence: asNumber(input.evidenceCount),
      factGenerators: factGenerators.length,
      reviewedAnnotations: input.reviewRows.filter(row => row.reviewStatus === "approved").reduce((total, row) => total + asNumber(row.count), 0),
      pendingAnnotations: input.reviewRows.filter(row => row.reviewStatus === "pending").reduce((total, row) => total + asNumber(row.count), 0),
    },
    factGenerators,
    requests,
    outcomes,
    casesByMunicipality,
    review: input.reviewRows.map(row => ({ status: row.reviewStatus, label: displayOutcome(row.reviewStatus), count: asNumber(row.count) })),
    latestRun: input.latestRun ? {
      runKey: input.latestRun.runKey,
      sourceKey: input.latestRun.sourceKey,
      scope: input.latestRun.scope,
      periodStart: input.latestRun.periodStart,
      periodEnd: input.latestRun.periodEnd,
      methodologyVersion: input.latestRun.methodologyVersion,
      status: input.latestRun.status,
      updatedAt: new Date(input.latestRun.updatedAt).toISOString(),
    } : null,
    limitations: [
      "Os fatos geradores são candidatos causais e só equivalem a conclusão após revisão humana e conferência da fonte.",
      "A distribuição é descritiva; não representa taxa, probabilidade ou previsão de êxito.",
      "O DataJud fornece metadados e movimentos; o assunto processual não prova sozinho o fato ocorrido nem o resultado do pedido.",
    ],
  };
}

export async function getCausalDashboard(input: {
  claimType?: CausalDashboardClaimType;
  reviewStatus?: CausalDashboardReviewStatus;
} = {}) {
  const db = getCausalDb();
  const filter = {
    claimType: input.claimType ?? "all" as const,
    reviewStatus: input.reviewStatus ?? "all" as const,
  };
  const annotationConditions = [inArray(causalAnnotations.claimType, CAUSAL_DASHBOARD_CLAIM_TYPES), inArray(causalAnnotations.role, ["fato_gerador", "pedido"] as const)];
  if (filter.claimType !== "all") annotationConditions.push(eq(causalAnnotations.claimType, filter.claimType));
  if (filter.reviewStatus !== "all") annotationConditions.push(eq(causalAnnotations.reviewStatus, filter.reviewStatus));
  const outcomeConditions = [inArray(causalAnnotations.claimType, CAUSAL_DASHBOARD_CLAIM_TYPES)];
  if (filter.claimType !== "all") outcomeConditions.push(eq(causalAnnotations.claimType, filter.claimType));
  if (filter.reviewStatus !== "all") outcomeConditions.push(eq(causalOutcomes.reviewStatus, filter.reviewStatus));

  const [latestRun, caseCount, evidenceCount, annotationRows, outcomeRows, reviewRows, municipalityRows] = await Promise.all([
    db.select({ runKey: causalRuns.runKey, sourceKey: causalRuns.sourceKey, scope: causalRuns.scope, periodStart: causalRuns.periodStart, periodEnd: causalRuns.periodEnd, methodologyVersion: causalRuns.methodologyVersion, status: causalRuns.status, updatedAt: causalRuns.updatedAt }).from(causalRuns).orderBy(desc(causalRuns.updatedAt)).limit(1),
    db.select({ count: sql<number>`count(*)` }).from(causalCases),
    db.select({ count: sql<number>`count(*)` }).from(causalEvidenceRefs),
    db.select({ claimType: causalAnnotations.claimType, role: causalAnnotations.role, label: causalAnnotations.label, normalizedLabel: causalAnnotations.normalizedLabel, reviewStatus: causalAnnotations.reviewStatus, caseCount: sql<number>`count(distinct ${causalAnnotations.caseId})`, mentionCount: sql<number>`count(*)` }).from(causalAnnotations).where(and(...annotationConditions)).groupBy(causalAnnotations.claimType, causalAnnotations.role, causalAnnotations.label, causalAnnotations.normalizedLabel, causalAnnotations.reviewStatus),
    db.select({ claimType: causalAnnotations.claimType, outcome: causalOutcomes.outcome, reviewStatus: causalOutcomes.reviewStatus, caseCount: sql<number>`count(distinct ${causalOutcomes.caseId})`, amountCents: sql<number>`coalesce(sum(${causalOutcomes.amountCents}), 0)` }).from(causalOutcomes).innerJoin(causalAnnotations, eq(causalOutcomes.annotationId, causalAnnotations.id)).where(and(...outcomeConditions)).groupBy(causalAnnotations.claimType, causalOutcomes.outcome, causalOutcomes.reviewStatus),
    db.select({ reviewStatus: causalAnnotations.reviewStatus, count: sql<number>`count(*)` }).from(causalAnnotations).where(inArray(causalAnnotations.claimType, CAUSAL_DASHBOARD_CLAIM_TYPES)).groupBy(causalAnnotations.reviewStatus),
    db.select({ municipality: causalCases.municipality, count: sql<number>`count(*)` }).from(causalCases).groupBy(causalCases.municipality).orderBy(desc(sql`count(*)`)).limit(12),
  ]);

  return summarizeCausalDashboard({
    latestRun: latestRun[0] ?? null,
    caseCount: caseCount[0]?.count ?? 0,
    evidenceCount: evidenceCount[0]?.count ?? 0,
    annotationRows,
    outcomeRows,
    reviewRows,
    municipalityRows,
    filter,
  });
}
