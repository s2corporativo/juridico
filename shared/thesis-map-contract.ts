export const THESIS_MAP_RELATED_LIMIT = 24;
export const THESIS_MAP_EXPORT_FORMATS = ["png", "pdf"] as const;

const FORBIDDEN_PUBLIC_FIELDS = ["cnjNumber", "reasoningSummary", "validationNote", "moralDamageValue", "parties", "cpf", "email", "phone", "address"] as const;

export function isSafeThesisMapDocument(value: Record<string, unknown>) {
  return !FORBIDDEN_PUBLIC_FIELDS.some(field => field in value);
}
