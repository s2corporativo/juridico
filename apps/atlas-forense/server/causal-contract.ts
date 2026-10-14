import { z } from "zod";
import { detectPersonalData } from "@shared/brain-api";
import { causalClaimRoles, causalClaimTypes, causalDocumentTypes, causalOutcomeTypes } from "../drizzle/causal-schema";

const sha256 = z.string().regex(/^[a-f0-9]{64}$/, "hash SHA-256 inválido");
const officialUrl = z.string().url().refine(value => value.startsWith("https://"), "a fonte deve usar HTTPS");
const safeText = (max: number) => z.string().trim().max(max).refine(value => detectPersonalData(value).length === 0, "texto contém dado pessoal ou marcador de anonimização");

export const causalRunInput = z.object({
  runKey: z.string().trim().min(3).max(191),
  sourceKey: z.string().trim().min(3).max(191),
  tribunalAlias: z.string().trim().min(2).max(64),
  scope: z.string().trim().min(2).max(128),
  periodStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  periodEnd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  methodologyVersion: z.string().trim().min(1).max(64),
  coverageNote: z.string().trim().min(10).max(2_000),
});

export const causalCaseInput = z.object({
  runId: z.number().int().positive(),
  caseKey: z.string().trim().min(3).max(191),
  publicProcessKey: z.string().trim().max(191).optional(),
  tribunal: z.string().trim().min(2).max(64),
  justice: z.string().trim().min(2).max(64),
  municipality: z.string().trim().max(128).optional(),
  classCode: z.string().trim().max(64).optional(),
  classLabel: z.string().trim().max(255).optional(),
  filingDate: z.coerce.date().optional(),
  sourceHashSha256: sha256,
  privacyNote: safeText(500).min(10),
});

export const causalDocumentInput = z.object({
  caseId: z.number().int().positive(),
  documentType: z.enum(causalDocumentTypes),
  sourceUrl: officialUrl.optional(),
  sourceLabel: safeText(255).min(2),
  contentHashSha256: sha256,
  pageCount: z.number().int().positive().max(100_000).optional(),
});

export const causalEvidenceInput = z.object({
  caseId: z.number().int().positive(),
  documentId: z.number().int().positive().optional(),
  sourceUrl: officialUrl,
  sourceLabel: safeText(255).min(2),
  sourceHashSha256: sha256,
  pageNumber: z.number().int().positive().optional(),
  paragraphRef: z.string().trim().max(128).optional(),
  excerpt: safeText(4_000).optional(),
  evidenceType: z.enum(["official_document", "official_api", "official_movement", "manual_review"]),
});

export const causalAnnotationInput = z.object({
  caseId: z.number().int().positive(),
  evidenceRefId: z.number().int().positive(),
  role: z.enum(causalClaimRoles),
  claimType: z.enum(causalClaimTypes),
  label: safeText(255).min(2),
  normalizedLabel: safeText(191).min(2),
  sourceKind: z.enum(["cnj_subject", "movement", "document", "manual_review"]),
  confidence: z.number().min(0).max(1),
});

export const causalOutcomeInput = z.object({
  caseId: z.number().int().positive(),
  annotationId: z.number().int().positive(),
  evidenceRefId: z.number().int().positive(),
  phase: z.enum(["origin", "appeal", "execution"]),
  outcome: z.enum(causalOutcomeTypes),
  amountCents: z.number().int().nonnegative().max(2_147_483_647).nullable().optional(),
});

export function validateReviewedState(input: { reviewStatus: string; reviewedBy?: string | null; reviewedAt?: Date | null }) {
  if (input.reviewStatus === "pending") return { ok: true as const };
  if (!input.reviewedBy || !input.reviewedAt) {
    return { ok: false as const, error: "revisão não pode ser concluída sem revisor e data" };
  }
  return { ok: true as const };
}

export function normalizeCausalLabel(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/\s+/g, " ");
}
