import { isSafePublicMetadata } from "./compendium.utils";

export type IngestionCandidate = {
  externalId: string;
  cnjNumber?: string;
  tribunal: string;
  justice: string;
  decisionType: string;
  sourceUrl?: string;
  sourceStatus: "official_confirmed" | "official_without_number" | "attachment_reviewed" | "secondary_pending" | "movement_observed" | "search_thematic";
  metadata?: Record<string, unknown>;
};

export type IngestionPreview = {
  batchKey: string;
  accepted: number;
  rejected: number;
  items: Array<{ externalId: string; accepted: boolean; reasons: string[] }>;
};

function isHttpsUrl(value: string | undefined) {
  if (!value) return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export function previewControlledIngestion(batchKey: string, candidates: IngestionCandidate[]): IngestionPreview {
  const externalIds = new Set<string>();
  const cnjNumbers = new Set<string>();
  const items = candidates.map(candidate => {
    const reasons: string[] = [];
    const externalId = candidate.externalId.trim();
    const cnjNumber = candidate.cnjNumber?.trim();

    if (!externalId) reasons.push("Identificador externo obrigatório.");
    if (externalIds.has(externalId)) reasons.push("Identificador externo duplicado no lote.");
    externalIds.add(externalId);

    if (cnjNumber) {
      if (cnjNumbers.has(cnjNumber)) reasons.push("Número CNJ duplicado no lote.");
      cnjNumbers.add(cnjNumber);
      if (cnjNumber.replace(/\D/g, "").length !== 20) reasons.push("Número CNJ deve conter 20 dígitos quando informado.");
    }

    if (!candidate.tribunal.trim() || !candidate.justice.trim() || !candidate.decisionType.trim()) {
      reasons.push("Tribunal, ramo de justiça e tipo de decisão são obrigatórios.");
    }
    if (candidate.metadata && !isSafePublicMetadata(candidate.metadata)) {
      reasons.push("Metadados contêm campo incompatível com a camada pública.");
    }
    if (candidate.sourceStatus === "official_confirmed" && !isHttpsUrl(candidate.sourceUrl)) {
      reasons.push("Fonte oficial confirmada exige URL HTTPS da origem.");
    }
    if (candidate.sourceUrl && !isHttpsUrl(candidate.sourceUrl)) {
      reasons.push("URL da fonte deve usar HTTPS.");
    }

    return { externalId, accepted: reasons.length === 0, reasons };
  });

  const accepted = items.filter(item => item.accepted).length;
  return { batchKey: batchKey.trim(), accepted, rejected: items.length - accepted, items };
}
