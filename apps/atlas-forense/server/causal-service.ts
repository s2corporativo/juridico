import { desc, eq } from "drizzle-orm";
import { causalAnnotations, causalCases, causalDocuments, causalEvidenceRefs, causalOutcomes, causalRuns } from "../drizzle/causal-schema";
import { getCausalDb } from "./causal-db";
import { causalAnnotationInput, causalCaseInput, causalDocumentInput, causalEvidenceInput, causalOutcomeInput, causalRunInput } from "./causal-contract";

export function createCausalRun(raw: unknown) {
  const input = causalRunInput.parse(raw);
  return getCausalDb().insert(causalRuns).values(input);
}

export function createCausalCase(raw: unknown) {
  const input = causalCaseInput.parse(raw);
  return getCausalDb().insert(causalCases).values(input);
}

export function createCausalDocument(raw: unknown) {
  const input = causalDocumentInput.parse(raw);
  return getCausalDb().insert(causalDocuments).values(input);
}

export function createCausalEvidence(raw: unknown) {
  const input = causalEvidenceInput.parse(raw);
  return getCausalDb().insert(causalEvidenceRefs).values(input);
}

export function createCausalAnnotation(raw: unknown) {
  const input = causalAnnotationInput.parse(raw);
  return getCausalDb().insert(causalAnnotations).values({ ...input, confidence: input.confidence.toFixed(4) });
}

export function createCausalOutcome(raw: unknown) {
  const input = causalOutcomeInput.parse(raw);
  return getCausalDb().insert(causalOutcomes).values(input);
}

export async function getCausalCase(caseId: number) {
  const db = getCausalDb();
  const [caseRecord] = await db.select().from(causalCases).where(eq(causalCases.id, caseId)).limit(1);
  if (!caseRecord) return null;
  const [documents, evidence, annotations, outcomes] = await Promise.all([
    db.select().from(causalDocuments).where(eq(causalDocuments.caseId, caseId)).orderBy(desc(causalDocuments.createdAt)),
    db.select().from(causalEvidenceRefs).where(eq(causalEvidenceRefs.caseId, caseId)).orderBy(desc(causalEvidenceRefs.createdAt)),
    db.select().from(causalAnnotations).where(eq(causalAnnotations.caseId, caseId)).orderBy(desc(causalAnnotations.createdAt)),
    db.select().from(causalOutcomes).where(eq(causalOutcomes.caseId, caseId)).orderBy(desc(causalOutcomes.createdAt)),
  ]);
  return { case: caseRecord, documents, evidence, annotations, outcomes };
}
