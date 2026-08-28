export type RmbhMunicipality = {
  name: string;
  ibgeCode: number;
};

export type LegalBranch = {
  key: string;
  label: string;
  topicRoots: string[];
  jurisdictions: string[];
  status: "available_in_tjmg" | "mapping_required";
  scopeNote: string;
};

/**
 * Municípios da RMBH segundo LC MG nº 89/2006; códigos conferidos na API de localidades do IBGE.
 * O Colar Metropolitano é uma camada territorial distinta e não integra esta lista.
 */
export const RMBH_MUNICIPALITIES: RmbhMunicipality[] = [
  { name: "Baldim", ibgeCode: 3105004 }, { name: "Belo Horizonte", ibgeCode: 3106200 },
  { name: "Betim", ibgeCode: 3106705 }, { name: "Brumadinho", ibgeCode: 3109006 },
  { name: "Caeté", ibgeCode: 3110004 }, { name: "Capim Branco", ibgeCode: 3112505 },
  { name: "Confins", ibgeCode: 3117876 }, { name: "Contagem", ibgeCode: 3118601 },
  { name: "Esmeraldas", ibgeCode: 3124104 }, { name: "Florestal", ibgeCode: 3126000 },
  { name: "Ibirité", ibgeCode: 3129806 }, { name: "Igarapé", ibgeCode: 3130101 },
  { name: "Itaguara", ibgeCode: 3132206 }, { name: "Itatiaiuçu", ibgeCode: 3133709 },
  { name: "Jaboticatubas", ibgeCode: 3134608 }, { name: "Juatuba", ibgeCode: 3136652 },
  { name: "Lagoa Santa", ibgeCode: 3137601 }, { name: "Mário Campos", ibgeCode: 3140159 },
  { name: "Mateus Leme", ibgeCode: 3140704 }, { name: "Matozinhos", ibgeCode: 3141108 },
  { name: "Nova Lima", ibgeCode: 3144805 }, { name: "Nova União", ibgeCode: 3136603 },
  { name: "Pedro Leopoldo", ibgeCode: 3149309 }, { name: "Raposos", ibgeCode: 3153905 },
  { name: "Ribeirão das Neves", ibgeCode: 3154606 }, { name: "Rio Acima", ibgeCode: 3154804 },
  { name: "Rio Manso", ibgeCode: 3155306 }, { name: "Sabará", ibgeCode: 3156700 },
  { name: "Santa Luzia", ibgeCode: 3157807 }, { name: "São Joaquim de Bicas", ibgeCode: 3162922 },
  { name: "São José da Lapa", ibgeCode: 3162955 }, { name: "Sarzedo", ibgeCode: 3165537 },
  { name: "Taquaraçu de Minas", ibgeCode: 3168309 }, { name: "Vespasiano", ibgeCode: 3171204 },
];

/**
 * Raízes da TPU para navegação. Não equivalem, sozinhas, a competência ou fonte disponível.
 */
export const INITIAL_LEGAL_BRANCHES: LegalBranch[] = [
  { key: "civil-consumer", label: "Cível e consumidor", topicRoots: ["899", "1156"], jurisdictions: ["TJMG"], status: "available_in_tjmg", scopeNote: "Requer classe e órgão confirmados em cada recorte." },
  { key: "family-records", label: "Família, sucessões e registros", topicRoots: ["899", "7724"], jurisdictions: ["TJMG"], status: "mapping_required", scopeNote: "Não confundir Justiça comum com Juizado Especial." },
  { key: "public-tax-health", label: "Público, tributário e saúde", topicRoots: ["9985", "14", "12480"], jurisdictions: ["TJMG", "JEFazenda"], status: "mapping_required", scopeNote: "Competência e classe serão declaradas por fonte." },
  { key: "penal-jecrim", label: "Penal e JECRIM", topicRoots: ["287"], jurisdictions: ["TJMG"], status: "mapping_required", scopeNote: "Movimentos, decisões e inteiro teor permanecem camadas distintas." },
  { key: "environmental", label: "Ambiental", topicRoots: ["10110"], jurisdictions: ["TJMG", "Justiça Federal"], status: "mapping_required", scopeNote: "A competência depende do caso e da fonte consultada." },
  { key: "work-social-security", label: "Trabalho e previdenciário", topicRoots: ["864", "195"], jurisdictions: ["TRT", "Justiça Federal"], status: "mapping_required", scopeNote: "Conectores próprios serão exigidos antes de qualquer métrica." },
];

export function isRmbhMunicipality(ibgeCode: number) {
  return RMBH_MUNICIPALITIES.some((municipality) => municipality.ibgeCode === ibgeCode);
}
