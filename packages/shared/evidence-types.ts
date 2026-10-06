// Evidence Ledger — shared between Atlas (evidence-quality) and JuridIA (EvidenceRef).
// The same epistemic-state taxonomy and evidence reference shape is used by both apps,
// so that an assertion produced by JuridIA's Cérebro can be audited inside Atlas.

export type EpistemicState =
  | "fato_extraido"
  | "alegacao_cliente"
  | "inferencia_ia"
  | "fato_controvertido"
  | "direito_positivo"
  | "jurisprudencia"
  | "hipotese";

export interface EvidenceItem {
  claim: string;
  state: EpistemicState;
  source?: string;
  confidence: number;
  note?: string;
}

export interface EvidenceRef {
  id: string;
  caseId: string;
  documentId?: string;
  pageNumber?: number;
  quote: string;
  quoteHash: string; // SHA-256
  documentHash?: string;
  sourceKind: "text" | "ocr" | "manual" | "llm_extracted";
  retrievalMethod: "deterministic" | "llm" | "manual";
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface LegalAssertion {
  id: string;
  caseId: string;
  text: string;
  kind: "fact" | "inference" | "gap" | "risk" | "rule" | "precedent" | "conclusion";
  supportStatus: "supported" | "partial" | "absent" | "conflicting";
  reviewStatus: "pending" | "confirmed" | "corrected" | "rejected";
  createdByAi: boolean;
  evidenceIds: string[];
}
