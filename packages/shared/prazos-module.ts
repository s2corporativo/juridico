// Shared prazos types — both Atlas and JuridIA use the same LexValida port.
// These contracts guarantee that prazo / prescrição computation is interchangeable
// between the data layer (Atlas Jurídico) and the cognitive layer (JuridIA).

export interface PrazoInput {
  marcoInicial: string; // ISO date
  prazoDias: number;
  tipoContagem: "uteis" | "corridos";
}

export interface PrazoResult {
  vencimento: string; // ISO date
  diasCorridos: number;
  diasUteis: number;
  tipoContagem: "uteis" | "corridos";
  observacoes: string[];
}

export interface PrescricaoInput {
  dataFato: string;
  dataAjuizamento: string;
  area: "civil" | "consumer" | "trabalhista" | "tributario" | "penal";
}

export interface PrescricaoResult {
  prescrito: boolean;
  prazoPrescricional: number; // years
  area: string;
  dataFato: string;
  dataAjuizamento: string;
  observacoes: string[];
}
