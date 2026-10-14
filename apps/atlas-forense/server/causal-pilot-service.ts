import { createHash } from "node:crypto";
import { and, asc, eq, inArray, sql } from "drizzle-orm";
import { detectPersonalData } from "@shared/brain-api";
import {
  causalAnnotations,
  causalCases,
  causalDocumentTexts,
  causalDocuments,
  causalEvidenceRefs,
  type CausalCase,
} from "../drizzle/causal-schema";
import { getCausalDb } from "./causal-db";
import {
  causalInteiroTeorInput,
  causalReviewDecisionInput,
  normalizeCausalLabel,
} from "./causal-contract";
import {
  CAUSAL_CLAIM_LABELS,
  CAUSAL_DETECTOR_VERSION,
  causalFamilyLabel,
  extractCausalCandidates,
  type CausalClaimType,
} from "./causal-extraction";

function sha256(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

const COVERAGE_STATUSES = ["metadata_only", "documents_available", "reviewed", "excluded"] as const;
export type CausalCoverageStatus = (typeof COVERAGE_STATUSES)[number];

const REVIEW_DECISIONS = ["approved", "rejected", "returned"] as const;
export type CausalReviewDecision = (typeof REVIEW_DECISIONS)[number];

/** Política pura: quando uma anotação pode receber decisão de revisão. */
export function canDecideAnnotation(
  currentReviewStatus: string,
  decision: CausalReviewDecision,
  note?: string | null,
): { ok: true } | { ok: false; error: string } {
  if (currentReviewStatus !== "pending" && currentReviewStatus !== "returned") {
    return { ok: false, error: "somente anotação pendente ou devolvida pode receber decisão" };
  }
  if (decision !== "approved" && (!note || note.trim().length === 0)) {
    return { ok: false, error: "rejeição ou devolução exige nota de revisão fundamentada" };
  }
  return { ok: true };
}

/** Política pura: transição de cobertura do caso após a decisão. */
export function nextCoverageStatus(current: string, decision: CausalReviewDecision): CausalCoverageStatus {
  if (decision === "approved" && current !== "excluded" && current !== "reviewed") return "reviewed";
  return (COVERAGE_STATUSES as readonly string[]).includes(current) ? (current as CausalCoverageStatus) : "metadata_only";
}

export type IngestInteiroTeorResult = {
  documentId: number;
  caseId: number;
  charCount: number;
  contentHashSha256: string;
  privacyScanStatus: "clean";
  extractionMethod: string;
  overwrote: boolean;
};

export async function ingestInteiroTeor(raw: unknown): Promise<IngestInteiroTeorResult> {
  const input = causalInteiroTeorInput.parse(raw);
  const db = getCausalDb();

  const [caseRow] = await db.select().from(causalCases).where(eq(causalCases.id, input.caseId)).limit(1);
  if (!caseRow) throw new Error("caso causal não encontrado");
  const [document] = await db.select().from(causalDocuments).where(eq(causalDocuments.id, input.documentId)).limit(1);
  if (!document) throw new Error("documento causal não encontrado");
  if (document.caseId !== input.caseId) throw new Error("documento não pertence ao caso informado");

  // Proveniência: documento sem URL oficial recebe a URL informada na ingestão.
  if (!document.sourceUrl) {
    await db.update(causalDocuments).set({ sourceUrl: input.sourceUrl }).where(eq(causalDocuments.id, document.id));
    document.sourceUrl = input.sourceUrl;
  }

  // Gate de privacidade fail-closed: inteiro teor com dado pessoal NÃO é persistido.
  const privacyHits = detectPersonalData(input.plainText);
  if (privacyHits.length > 0) {
    throw new Error(`inteiro teor recusado pelo gate de privacidade (marcadores: ${privacyHits.join(", ")})`);
  }

  // Texto que já fundamentou causa comprovada é imutável — versão nova exige documento novo.
  const [approvedTiedToDocument] = await db
    .select({ id: causalAnnotations.id })
    .from(causalAnnotations)
    .innerJoin(causalEvidenceRefs, eq(causalAnnotations.evidenceRefId, causalEvidenceRefs.id))
    .where(and(eq(causalEvidenceRefs.documentId, input.documentId), eq(causalAnnotations.reviewStatus, "approved")))
    .limit(1);
  if (approvedTiedToDocument) {
    throw new Error("inteiro teor já fundamentou anotação aprovada; registre um novo documento para nova versão do texto");
  }

  const contentHashSha256 = sha256(input.plainText);
  const [existingText] = await db
    .select()
    .from(causalDocumentTexts)
    .where(eq(causalDocumentTexts.documentId, input.documentId))
    .limit(1);

  let overwrote = false;
  if (existingText) {
    overwrote = true;
    await db
      .update(causalDocumentTexts)
      .set({
        plainText: input.plainText,
        charCount: input.plainText.length,
        contentHashSha256,
        extractionMethod: input.extractionMethod,
        privacyScanStatus: "clean",
        detectorVersion: CAUSAL_DETECTOR_VERSION,
      })
      .where(eq(causalDocumentTexts.id, existingText.id));
  } else {
    await db.insert(causalDocumentTexts).values({
      documentId: input.documentId,
      caseId: input.caseId,
      plainText: input.plainText,
      charCount: input.plainText.length,
      contentHashSha256,
      extractionMethod: input.extractionMethod,
      privacyScanStatus: "clean",
      detectorVersion: CAUSAL_DETECTOR_VERSION,
    });
  }

  // Primeira ingestão promove a cobertura do caso de metadata_only para documents_available.
  if (caseRow.coverageStatus === "metadata_only") {
    await db.update(causalCases).set({ coverageStatus: "documents_available" }).where(eq(causalCases.id, input.caseId));
  }

  return {
    documentId: input.documentId,
    caseId: input.caseId,
    charCount: input.plainText.length,
    contentHashSha256,
    privacyScanStatus: "clean",
    extractionMethod: input.extractionMethod,
    overwrote,
  };
}

export type ExtractCandidatesResult = {
  documentId: number;
  caseId: number;
  created: number;
  skipped: number;
  flaggedDropped: number;
  detectorVersion: string;
};

export async function extractCandidatesFromDocument(raw: { documentId: number }): Promise<ExtractCandidatesResult> {
  const documentId = raw.documentId;
  const db = getCausalDb();

  const [document] = await db.select().from(causalDocuments).where(eq(causalDocuments.id, documentId)).limit(1);
  if (!document) throw new Error("documento causal não encontrado");
  const [documentText] = await db
    .select()
    .from(causalDocumentTexts)
    .where(eq(causalDocumentTexts.documentId, documentId))
    .limit(1);
  if (!documentText) throw new Error("inteiro teor não ingestado para este documento (use causal.ingestInteiroTeor)");
  if (documentText.privacyScanStatus === "flagged") throw new Error("texto marcado como flagged não pode gerar candidatos");
  const provenanceUrl = document.sourceUrl;
  if (!provenanceUrl) {
    throw new Error("documento sem URL oficial de proveniência; reingeste o inteiro teor com sourceUrl");
  }

  const extraction = extractCausalCandidates(documentText.plainText);

  let created = 0;
  let skipped = 0;
  let flaggedDropped = 0;

  for (const candidate of extraction.candidates) {
    // Defesa em profundidade: nem trecho com dado pessoal vira evidência.
    if (detectPersonalData(candidate.excerpt).length > 0) {
      flaggedDropped += 1;
      continue;
    }
    const [existingAnnotation] = await db
      .select({ id: causalAnnotations.id })
      .from(causalAnnotations)
      .where(
        and(
          eq(causalAnnotations.caseId, document.caseId),
          eq(causalAnnotations.role, candidate.role),
          eq(causalAnnotations.claimType, candidate.claimType),
          eq(causalAnnotations.normalizedLabel, candidate.normalizedLabel),
          eq(causalAnnotations.sourceKind, "document"),
        ),
      )
      .limit(1);
    if (existingAnnotation) {
      skipped += 1;
      continue;
    }

    const evidenceInput = {
      caseId: document.caseId,
      documentId: document.id,
      sourceUrl: provenanceUrl,
      sourceLabel: document.sourceLabel,
      sourceHashSha256: documentText.contentHashSha256,
      paragraphRef: `offset:${candidate.offsetStart}-${candidate.offsetEnd}`.slice(0, 128),
      excerpt: candidate.excerpt,
      evidenceType: "official_document" as const,
    };

    const [evidence] = await db
      .insert(causalEvidenceRefs)
      .values(evidenceInput)
      .$returningId();
    const evidenceRefId = evidence.id;

    await db.insert(causalAnnotations).values({
      caseId: document.caseId,
      evidenceRefId,
      familyKey: candidate.familyKey,
      role: candidate.role,
      claimType: candidate.claimType,
      label: candidate.label,
      normalizedLabel: candidate.normalizedLabel,
      sourceKind: "document",
      confidence: candidate.confidence.toFixed(4),
      reviewStatus: "pending",
    });
    created += 1;
  }

  return {
    documentId,
    caseId: document.caseId,
    created,
    skipped,
    flaggedDropped,
    detectorVersion: CAUSAL_DETECTOR_VERSION,
  };
}

export async function reviewAnnotation(raw: unknown) {
  const input = causalReviewDecisionInput.parse(raw);
  const db = getCausalDb();

  const [annotation] = await db.select().from(causalAnnotations).where(eq(causalAnnotations.id, input.annotationId)).limit(1);
  if (!annotation) throw new Error("anotação não encontrada");

  const policy = canDecideAnnotation(annotation.reviewStatus, input.decision, input.note);
  if (!policy.ok) throw new Error(policy.error);

  const [evidence] = await db.select().from(causalEvidenceRefs).where(eq(causalEvidenceRefs.id, annotation.evidenceRefId)).limit(1);
  if (!evidence) throw new Error("evidência da anotação não encontrada");
  if (evidence.excerpt && detectPersonalData(evidence.excerpt).length > 0) {
    throw new Error("evidência contém marcador de dado pessoal; remova a evidência antes de aprovar");
  }

  const reviewedAt = new Date();
  await db
    .update(causalAnnotations)
    .set({
      reviewStatus: input.decision,
      reviewedBy: input.reviewer,
      reviewedAt,
      reviewNote: input.note ?? null,
    })
    .where(eq(causalAnnotations.id, annotation.id));
  const annotationId = annotation.id;

  if (input.decision === "approved") {
    await db
      .update(causalEvidenceRefs)
      .set({ reviewStatus: "approved", reviewedBy: input.reviewer, reviewedAt })
      .where(eq(causalEvidenceRefs.id, evidence.id));
  }

  const [caseRow] = await db.select().from(causalCases).where(eq(causalCases.id, annotation.caseId)).limit(1);
  let coverageStatus: CausalCoverageStatus | null = null;
  if (caseRow) {
    coverageStatus = nextCoverageStatus(caseRow.coverageStatus, input.decision);
    if (coverageStatus !== caseRow.coverageStatus) {
      await db.update(causalCases).set({ coverageStatus }).where(eq(causalCases.id, caseRow.id));
    }
  }

  return {
    annotationId,
    decision: input.decision,
    reviewedBy: input.reviewer,
    reviewedAt: reviewedAt.toISOString(),
    caseId: annotation.caseId,
    coverageStatus,
  };
}

export type ReviewQueueItem = {
  annotationId: number;
  caseId: number;
  caseKey: string;
  tribunal: string;
  role: string;
  claimType: string;
  claimLabel: string;
  familyKey: string | null;
  familyLabel: string;
  label: string;
  confidence: string;
  sourceKind: string;
  reviewStatus: string;
  excerpt: string | null;
  evidenceId: number;
  createdAt: Date;
};

export async function getReviewQueue(input: { limit?: number } = {}): Promise<ReviewQueueItem[]> {
  const limit = Math.min(Math.max(input.limit ?? 50, 1), 200);
  const db = getCausalDb();
  const rows = await db
    .select({
      annotationId: causalAnnotations.id,
      caseId: causalAnnotations.caseId,
      caseKey: causalCases.caseKey,
      tribunal: causalCases.tribunal,
      role: causalAnnotations.role,
      claimType: causalAnnotations.claimType,
      familyKey: causalAnnotations.familyKey,
      label: causalAnnotations.label,
      confidence: causalAnnotations.confidence,
      sourceKind: causalAnnotations.sourceKind,
      reviewStatus: causalAnnotations.reviewStatus,
      createdAt: causalAnnotations.createdAt,
      evidenceId: causalEvidenceRefs.id,
      excerpt: causalEvidenceRefs.excerpt,
    })
    .from(causalAnnotations)
    .innerJoin(causalCases, eq(causalAnnotations.caseId, causalCases.id))
    .innerJoin(causalEvidenceRefs, eq(causalAnnotations.evidenceRefId, causalEvidenceRefs.id))
    .where(inArray(causalAnnotations.reviewStatus, ["pending", "returned"]))
    .orderBy(asc(causalAnnotations.createdAt))
    .limit(limit);

  return rows.map(row => ({
    ...row,
    claimLabel: CAUSAL_CLAIM_LABELS[row.claimType as CausalClaimType] ?? row.claimType,
    familyLabel: causalFamilyLabel(row.familyKey),
  }));
}

export type ProvenCauseRow = {
  familyKey: string | null;
  claimType: string;
  caseCount: number | string;
  mentionCount: number | string;
};

export type ProvenPedidoRow = { claimType: string; caseCount: number | string };

export type ProvenCausesSummary = ReturnType<typeof summarizeProvenCauses>;

/** Agregação pura de causas comprovadas (testável sem banco). */
export function summarizeProvenCauses(
  factRows: ProvenCauseRow[],
  pedidoRows: ProvenPedidoRow[],
  pendingCount: number | string,
  reviewedCases: number | string,
) {
  const causasComprovadas = factRows
    .map(row => ({
      familyKey: row.familyKey ?? "outros",
      familyLabel: causalFamilyLabel(row.familyKey),
      claimType: row.claimType,
      claimLabel: CAUSAL_CLAIM_LABELS[row.claimType as CausalClaimType] ?? row.claimType,
      casos: Number(row.caseCount ?? 0),
      mencoes: Number(row.mentionCount ?? 0),
    }))
    .sort((left, right) => right.casos - left.casos || right.mencoes - left.mencoes || left.familyLabel.localeCompare(right.familyLabel, "pt-BR"));

  const pedidosComprovados = pedidoRows
    .map(row => ({
      claimType: row.claimType,
      claimLabel: CAUSAL_CLAIM_LABELS[row.claimType as CausalClaimType] ?? row.claimType,
      casos: Number(row.caseCount ?? 0),
    }))
    .sort((left, right) => right.casos - left.casos);

  return {
    enabled: true,
    resumo: {
      causasComprovadas: causasComprovadas.length,
      casosComCausaAprovada: reviewedCases === 0 ? 0 : Number(reviewedCases),
      filaDeRevisao: Number(pendingCount ?? 0),
    },
    causasComprovadas,
    pedidosComprovados,
    notice:
      "Causas comprovadas = candidatos de fato gerador extraídos do inteiro teor e APROVADOS por revisão humana com evidência. Menções não são mutuamente exclusivas: um caso pode ter mais de uma causa e um processo pode cumular pedidos.",
    limitations: [
      "A extração determinística é preliminar; a aprovação exige revisão profissional humana com evidência do inteiro teor.",
      "A distribuição é descritiva; não representa taxa, probabilidade ou previsão de êxito.",
      "Candidatos com fonte cnj_subject ou movement permanecem preliminares até ingestão e revisão do inteiro teor.",
    ],
  };
}

export async function getProvenCauses() {
  const db = getCausalDb();
  const [factRows, pedidoRows, pendingRows, reviewedCaseRows] = await Promise.all([
    db
      .select({
        familyKey: causalAnnotations.familyKey,
        claimType: causalAnnotations.claimType,
        caseCount: sql<number>`count(distinct ${causalAnnotations.caseId})`,
        mentionCount: sql<number>`count(*)`,
      })
      .from(causalAnnotations)
      .where(and(eq(causalAnnotations.role, "fato_gerador"), eq(causalAnnotations.reviewStatus, "approved")))
      .groupBy(causalAnnotations.familyKey, causalAnnotations.claimType),
    db
      .select({
        claimType: causalAnnotations.claimType,
        caseCount: sql<number>`count(distinct ${causalAnnotations.caseId})`,
      })
      .from(causalAnnotations)
      .where(and(eq(causalAnnotations.role, "pedido"), eq(causalAnnotations.reviewStatus, "approved")))
      .groupBy(causalAnnotations.claimType),
    db
      .select({ count: sql<number>`count(*)` })
      .from(causalAnnotations)
      .where(inArray(causalAnnotations.reviewStatus, ["pending", "returned"])),
    db
      .select({ count: sql<number>`count(distinct ${causalAnnotations.caseId})` })
      .from(causalAnnotations)
      .where(and(eq(causalAnnotations.role, "fato_gerador"), eq(causalAnnotations.reviewStatus, "approved"))),
  ]);

  return summarizeProvenCauses(factRows, pedidoRows, pendingRows[0]?.count ?? 0, reviewedCaseRows[0]?.count ?? 0);
}

export async function getCausalDocumentText(documentId: number) {
  const db = getCausalDb();
  const [row] = await db.select().from(causalDocumentTexts).where(eq(causalDocumentTexts.documentId, documentId)).limit(1);
  return row ?? null;
}

/** Normalização reexportada para os testes do piloto. */
export const normalizePilotLabel = normalizeCausalLabel;
export type PilotCase = CausalCase;
