import { db } from "@/lib/db";
import { createEvidence, type EvidenceRefRecord } from "@/lib/evidence";
import { mapCaseDeterministic, type CaseMapperOutput } from "@/lib/legal_brain";
import { pseudonymize, type PseudonymizeResult } from "@/lib/pseudonymizer";

export type BrainEvidence = Pick<EvidenceRefRecord, "id" | "caseId" | "documentId" | "pageNumber" | "quoteHash" | "sourceKind" | "retrievalMethod" | "verified" | "createdAt"> & {
  quote: string;
};

export interface BrainEjcContext {
  rawText: string;
  safeText: string;
  pseudonymization: PseudonymizeResult;
  deterministic: CaseMapperOutput;
  evidence: BrainEvidence[];
}

/**
 * Prepara o contexto do Cérebro a partir dos autos do caso.
 * O texto original permanece no backend; somente safeText/evidence pseudonimizados
 * devem ser enviados a modelos, RAG, Atlas ou busca web.
 */
export async function prepareBrainEjcContext(userId: string, caseId: string, typedFacts: string): Promise<BrainEjcContext> {
  const files = await db.caseFile.findMany({
    where: { userId, caseId, status: "ready" },
    orderBy: { createdAt: "asc" },
    include: { pages: { orderBy: { pageNo: "asc" } } },
  });
  const rawText = [typedFacts.trim(), ...files.map((file) => file.extractedText.trim()).filter(Boolean)]
    .filter(Boolean)
    .join("\n\n");
  if (rawText.length < 30) throw new Error("Descreva os fatos ou processe autos com pelo menos 30 caracteres");

  const pseudonymization = pseudonymize(rawText);
  const mapped = await mapCaseDeterministic(caseId, rawText);
  const pageEvidence: EvidenceRefRecord[] = [];
  for (const file of files) {
    for (const page of file.pages) {
      if (!page.text.trim()) continue;
      pageEvidence.push(await createEvidence({
        caseId,
        documentId: file.id,
        pageNumber: page.pageNo,
        quote: page.text.slice(0, 500),
        sourceKind: page.evidence.includes("ocr") ? "ocr" : "text",
        retrievalMethod: "deterministic",
        documentHash: file.sha256,
        metadata: { caseFileId: file.id, pageHash: page.sha256 },
      }));
    }
  }
  const allEvidence = [...mapped.evidence, ...pageEvidence];
  return {
    rawText,
    safeText: pseudonymization.text,
    pseudonymization,
    deterministic: mapped.output,
    evidence: allEvidence.map((item) => ({
      id: item.id,
      caseId: item.caseId,
      documentId: item.documentId,
      pageNumber: item.pageNumber,
      quote: pseudonymize(item.quote).text,
      quoteHash: item.quoteHash,
      sourceKind: item.sourceKind,
      retrievalMethod: item.retrievalMethod,
      verified: item.verified,
      createdAt: item.createdAt,
    })),
  };
}

export function safeEvidencePrompt(evidence: BrainEvidence[]): string {
  return JSON.stringify(evidence.map(({ id, documentId, pageNumber, quote, sourceKind, retrievalMethod }) => ({
    id,
    documentId,
    pageNumber,
    quote,
    sourceKind,
    retrievalMethod,
  })));
}
