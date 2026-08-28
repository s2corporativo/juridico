type CitationReferenceInput = {
  theme: string | null | undefined;
  tribunal: string;
  cnjNumber: string | null | undefined;
  externalId: string;
  decisionDate: Date | string | null | undefined;
  sourceUrl: string | null | undefined;
};

function formatReferenceDate(value: Date | string | null | undefined) {
  if (!value) return "data não informada";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "data não informada";
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(parsed);
}

/** Referência de fonte pública; não é declaração de vigência nem aconselhamento jurídico. */
export function buildPublicCitationReference(input: CitationReferenceInput) {
  const identification = input.cnjNumber ?? input.externalId;
  const theme = input.theme ? `Tema: ${input.theme}\n\n` : "";
  const source = input.sourceUrl ? `\nFonte registrada: ${input.sourceUrl}` : "";
  return `${theme}${input.tribunal}, ${identification}, decisão em ${formatReferenceDate(input.decisionDate)}.${source}\n\nConferir a fonte oficial, o inteiro teor e a adequação ao caso concreto antes de utilizar.`;
}
