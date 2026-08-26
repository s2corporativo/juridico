export const COMPENDIUM_MODULES = [
  {
    id: "atlas",
    ordinal: "01",
    title: "Atlas Forense",
    description: "Camada jurimétrica para censo, recortes territoriais, séries mensais e exportações metodológicas.",
    evidence: "Censo agregado e dados públicos estruturados",
    route: "/",
    state: "operacional",
  },
  {
    id: "research",
    ordinal: "02",
    title: "Pesquisa jurisprudencial",
    description: "Julgados identificados por tema, tribunal, cidade, número e situação de fonte.",
    evidence: "Metadados públicos + URL de origem",
    route: "/compendio#jurisprudencia",
    state: "operacional",
  },
  {
    id: "theses",
    ordinal: "03",
    title: "Teses e taxonomia",
    description: "Organização por área, instituto e tema, com prova necessária e fatores adversos declarados.",
    evidence: "Síntese jurídica condicionada",
    route: "/compendio#teses",
    state: "operacional",
  },
  {
    id: "custody",
    ordinal: "04",
    title: "Auditoria e custódia",
    description: "Lotes, hash, fonte, versão, exclusões e eventos que permitem reconstituir cada registro.",
    evidence: "Proveniência e trilha de auditoria",
    route: "/compendio#auditoria",
    state: "operacional",
  },
] as const;

export const GOVERNANCE_LANES = [
  {
    id: "consultation",
    title: "Consulta e análise",
    status: "operacional",
    access: "Pesquisa pública controlada",
    rule: "Exibe somente metadados compatíveis com a camada pública, com fonte e ressalva metodológica.",
  },
  {
    id: "review",
    title: "Curadoria e revisão",
    status: "processo definido",
    access: "Revisão humana obrigatória",
    rule: "Classifica fonte, confere documento oficial, define a taxonomia e decide se o material é elegível.",
  },
  {
    id: "administration",
    title: "Administração do acervo",
    status: "em estruturação",
    access: "Papel técnico admin",
    rule: "Controlará ingestão, deduplicação, rejeição de dados pessoais, publicação e eventos de auditoria.",
  },
] as const;

export const EVIDENCE_FLOW = [
  "Descoberta e inventário",
  "Validação de fonte oficial",
  "Triagem de privacidade",
  "Taxonomia e vínculo de tese",
  "Revisão humana",
  "Publicação rastreável",
] as const;

export const GOVERNANCE_GUARDRAILS = [
  "Não armazenar nomes de partes, CPF, endereço, telefone, e-mail ou documentos pessoais na camada pública.",
  "Não converter amostra, movimento processual ou recorte temático em taxa de êxito ou regra geral.",
  "Manter URL oficial, status da fonte, lote, versão e nota de validação em todo registro publicado.",
  "Exigir leitura individual do inteiro teor e revisão humana antes de uso profissional ou protocolo.",
] as const;
