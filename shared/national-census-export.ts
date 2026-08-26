export type NationalExportRow = { alias: string; uf: string; month: string; amount: number };

export type NationalExportMetadata = {
  from: string;
  to: string;
  tribunalLabel: string;
  coveragePct: number;
  respondedTribunals: number;
  expectedTribunals: number;
  executionState: string;
};

function escapeCsv(value: string | number) {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function buildNationalCensusCsv(metadata: NationalExportMetadata, rows: NationalExportRow[]) {
  return [
    "# Atlas Forense — Censo Nacional JEC",
    "# Fonte: CNJ/DataJud | Coleta agregada validada em 26/08/2026",
    `# Filtro: ${metadata.from} a ${metadata.to}; Tribunal: ${metadata.tribunalLabel}`,
    `# Cobertura: ${metadata.coveragePct}% (${metadata.respondedTribunals}/${metadata.expectedTribunals} TJs); Estado da execução: ${metadata.executionState}`,
    "# Escopo: distribuições agregadas, classe 436, grau JE; 2026 é parcial; baixas não incluídas.",
    "tribunal_alias,uf,month,metric,amount",
    ...rows.map(row => [row.alias, row.uf, row.month, "distribution", row.amount].map(escapeCsv).join(",")),
  ].join("\n");
}
