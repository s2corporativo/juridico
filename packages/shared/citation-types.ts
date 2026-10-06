// Citation Gate protocol — shared between Atlas (Compendium) and JuridIA (Citation Gate).
// Format: {{juris:ID}}, {{lei:ID}}, [[autos:DOC:PÁG|"trecho"]]

export interface CitationRef {
  type: "juris" | "lei" | "autos";
  id: string; // for juris/lei: source ID; for autos: document ID
  page?: number; // for autos: page number
  trecho?: string; // for autos: quoted text
}

export interface VerifiedCitation {
  ref: CitationRef;
  exists: boolean;
  source?: {
    label: string; // "STJ, Súmula 385" or "CC, art. 206, §3º, V"
    text: string; // ementa or texto trecho
    url?: string; // official URL
    verified: boolean;
    verifiedBy?: string;
    verifiedAt?: string;
  };
  blocked?: boolean; // true if source doesn't exist (blocks minuta)
  reason?: string; // why blocked
}

export interface CitationGateResult {
  citations: VerifiedCitation[];
  allVerified: boolean;
  blockedCount: number;
  warnings: string[];
}

// Regex patterns for extracting citations from text.
export const CITATION_PATTERNS = {
  juris: /\{\{juris:([^}]+)\}\}/g,
  lei: /\{\{lei:([^}]+)\}\}/g,
  autos: /\[\[autos:([^:]+):(\d+)\|"([^"]+)"\]\]/g,
} as const;
