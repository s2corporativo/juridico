const FORBIDDEN_KEYS = ["cpf", "email", "phone", "telefone", "address", "endereco", "processnumber", "numeroprocesso", "rawresponse", "respostabruta", "hmac", "authorization", "api_key"];

function isSafePublicMetadata(value: unknown): boolean {
  if (Array.isArray(value)) return value.every(isSafePublicMetadata);
  if (!value || typeof value !== "object") return true;
  return Object.entries(value).every(([key, entry]) => !FORBIDDEN_KEYS.some(forbidden => key.toLowerCase().replace(/[^a-z0-9]/g, "").includes(forbidden)) && isSafePublicMetadata(entry));
}

export const AI_COMPARE_MAX_ITEMS = 4;
export const AI_COMPARE_MAX_LIST_ITEMS = 6;
export const AI_COMPARE_MAX_ITEM_CHARS = 280;
export const AI_COMPARE_MAX_TOTAL_CHARS = 2_400;

export type PublicRelatedDecisionInput = {
  externalId: string;
  title: string | null;
  tribunal: string;
  city: string | null;
  decisionType: string;
  decisionDate: Date | string | null;
  sourceStatus: string;
  stance: string | null;
};

export function buildPublicComparisonPayload(records: PublicRelatedDecisionInput[]) {
  if (records.length < 2 || records.length > AI_COMPARE_MAX_ITEMS) throw new Error("Seleção inválida para comparação.");
  const payload = records.map((record, index) => ({
    identificadorInterno: `Julgado ${index + 1}`,
    titulo: record.title ?? "Julgado sem título informado",
    tribunal: record.tribunal,
    cidade: record.city ?? "Não informada",
    tipoDeDecisao: record.decisionType,
    dataDaDecisao: record.decisionDate ? new Date(record.decisionDate).toISOString().slice(0, 10) : "Não informada",
    situacaoDaFonte: record.sourceStatus,
    posicaoCatalogada: record.stance ?? "Não informada",
  }));
  if (!isSafePublicMetadata({ records: payload })) throw new Error("Os julgados não atendem ao contrato público de comparação.");
  return payload;
}

export type AiComparison = { similarities: string[]; differences: string[]; caveats: string[] };

export function isSafeAiComparison(value: unknown): value is AiComparison {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  const unsafeText = (text: string) => /\b\d{3}[.\s]?\d{3}[.\s]?\d{3}[-\s]?\d{2}\b|\b\S+@\S+\.\S+\b/i.test(text);
  const validList = (entry: unknown) => Array.isArray(entry)
    && entry.length <= AI_COMPARE_MAX_LIST_ITEMS
    && entry.every(item => typeof item === "string" && item.trim().length >= 8 && item.trim().length <= AI_COMPARE_MAX_ITEM_CHARS && !unsafeText(item) && isSafePublicMetadata({ item }));
  if (!validList(candidate.similarities) || !validList(candidate.differences) || !validList(candidate.caveats)) return false;
  const total = [...candidate.similarities as string[], ...candidate.differences as string[], ...candidate.caveats as string[]].join(" ");
  return total.length <= AI_COMPARE_MAX_TOTAL_CHARS;
}
