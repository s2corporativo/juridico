/**
 * Portão EJC para extração por IA. Não transforma alegações sem lastro
 * em fatos extraídos e nunca aceita ids inventados pelo provedor.
 * Não consulta banco: a rota já valida o caso do usuário antes da chamada.
 */
export type BrainExtractionState = "fato_extraido" | "alegacao_cliente" | "inferencia_ia";
export interface BrainExtractedItem {
  [key: string]: unknown;
  state: BrainExtractionState;
  evidenceRefIds: string[];
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function filterEvidenceItems(values: unknown[], allowedIds: ReadonlySet<string>): BrainExtractedItem[] {
  return values.flatMap((value) => {
    if (!isObject(value)) return [];
    const raw = value.evidence_ref_ids;
    // Um relato sem referência documental ou narrativa de origem não vira "fato".
    // A mixed list with an invented or foreign-case reference invalidates
    // the whole item; silently dropping the invalid ID would misstate support.
    if (!Array.isArray(raw) || raw.length === 0 ||
        !raw.every((id) => typeof id === "string" && allowedIds.has(id))) return [];
    const refs = Array.from(new Set(raw as string[]));
    if (refs.length === 0) return [];
    const state: BrainExtractionState =
      value.state === "fato_extraido" || value.state === "alegacao_cliente" || value.state === "inferencia_ia"
        ? value.state
        : "inferencia_ia";
    const { evidence_ref_ids: _untrusted, ...fields } = value;
    void _untrusted;
    return [{ ...fields, state, evidenceRefIds: refs }];
  });
}

export function validateBrainExtraction(
  payload: unknown,
  allowedIds: ReadonlySet<string>,
): {
  parties: BrainExtractedItem[];
  timeline: BrainExtractedItem[];
  requests: BrainExtractedItem[];
  values: BrainExtractedItem[];
} {
  if (!isObject(payload) ||
    !Array.isArray(payload.parties) ||
    !Array.isArray(payload.timeline) ||
    !Array.isArray(payload.requests) ||
    !Array.isArray(payload.values)) {
    throw new Error("Extração EJC incompleta: quatro conjuntos de fatos obrigatórios");
  }
  return {
    parties: filterEvidenceItems(payload.parties, allowedIds),
    timeline: filterEvidenceItems(payload.timeline, allowedIds),
    requests: filterEvidenceItems(payload.requests, allowedIds),
    values: filterEvidenceItems(payload.values, allowedIds),
  };
}
