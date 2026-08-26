export const PUBLIC_JURISPRUDENCE_FIELDS = [
  "externalId", "cnjNumber", "tribunal", "justice", "city", "comarca", "court", "judgingBody",
  "decisionType", "decisionDate", "publicationDate", "legalArea", "theme", "outcomeOrigin",
  "outcomeAppeal", "dispositionType", "moralDamageValue", "reasoningSummary", "validationNote", "sourceStatus",
] as const;

export function isSafePublicMetadata(record: Record<string, unknown>) {
  const forbidden = ["party", "parte", "cpf", "address", "endereco", "telefone", "phone", "email", "documento", "autor", "reu", "réu"];
  const personalValue = /\b\d{3}[.\s-]?\d{3}[.\s-]?\d{3}[-\s]?\d{2}\b|\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b|(?:\+?55\s?)?(?:\(?\d{2}\)?\s?)?9?\d{4}[-\s]?\d{4}/i;
  const walk = (value: unknown): boolean => {
    if (typeof value === "string") return !personalValue.test(value);
    if (Array.isArray(value)) return value.every(walk);
    if (value && typeof value === "object") return Object.entries(value as Record<string, unknown>).every(([key, nested]) => !forbidden.some(term => key.toLowerCase().includes(term)) && walk(nested));
    return true;
  };
  return Object.entries(record).every(([key, value]) => !forbidden.some(term => key.toLowerCase().includes(term)) && walk(value));
}
