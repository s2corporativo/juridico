export type CitationDossierInput = {
  externalId: string;
  cnjNumber?: string | null;
  tribunal: string;
  justice: string;
  city?: string | null;
  decisionType: string;
  decisionDate?: Date | string | null;
  sourceStatus: string;
  sourceLabel: string;
  sourceUrl?: string | null;
  batchKey: string;
  batchHash?: string | null;
  validationNote?: string | null;
  topics: Array<{ title: string; pathKey: string }>;
  theses: Array<{ title: string; position: string }>;
};

function line(label: string, value: string | null | undefined) {
  return value ? `- **${label}:** ${value}` : undefined;
}

export function buildCitationDossierMarkdown(input: CitationDossierInput) {
  const lines = [
    `# Dossiê de citação — ${input.cnjNumber ?? input.externalId}`,
    "",
    "## Identificação pública",
    line("Identificador", input.externalId),
    line("Número CNJ", input.cnjNumber),
    line("Tribunal", input.tribunal),
    line("Ramo de justiça", input.justice),
    line("Comarca/cidade", input.city),
    line("Tipo de decisão", input.decisionType),
    line("Data da decisão", input.decisionDate ? new Date(input.decisionDate).toLocaleDateString("pt-BR") : undefined),
    "",
    "## Proveniência",
    line("Fonte", input.sourceLabel),
    line("URL oficial", input.sourceUrl),
    line("Situação da fonte", input.sourceStatus),
    line("Lote", input.batchKey),
    line("Hash do lote", input.batchHash),
    "",
    "## Classificação",
    ...input.topics.map(topic => `- ${topic.pathKey}: ${topic.title}`),
    "",
    "## Teses relacionadas",
    ...input.theses.map(thesis => `- **${thesis.position}:** ${thesis.title}`),
    "",
    "## Nota de validação",
    input.validationNote ?? "Sem nota adicional de validação.",
    "",
    "> Este dossiê reúne metadados públicos, proveniência e classificação do Compêndio. Não substitui a leitura do inteiro teor, a conferência da fonte oficial ou a revisão humana antes de uso profissional.",
  ];
  return lines.filter((value): value is string => value !== undefined).join("\n");
}
