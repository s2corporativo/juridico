export const PUBLIC_JURISPRUDENCE_FIELDS = [
  "externalId", "cnjNumber", "tribunal", "justice", "city", "comarca", "court", "judgingBody",
  "decisionType", "decisionDate", "publicationDate", "legalArea", "theme", "outcomeOrigin",
  "outcomeAppeal", "dispositionType", "moralDamageValue", "reasoningSummary", "validationNote", "sourceStatus",
] as const;

export function isSafePublicMetadata(record: Record<string, unknown>) {
  const forbidden = ["party", "cpf", "address", "telefone", "email", "documento"];
  return Object.keys(record).every(key => !forbidden.some(term => key.toLowerCase().includes(term)));
}
