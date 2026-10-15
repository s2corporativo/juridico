import { normalizeCausalLabel } from "./causal-contract";

/**
 * Extrator determinístico de candidatos causais a partir do inteiro teor.
 *
 * Regras do piloto (docs/ATLAS_CAUSAL.md):
 * - A extração é preliminar e gera apenas CANDIDATOS com status pending.
 * - Nada aqui comprova nexo causal, fato ocorrido ou procedência.
 * - A "causa comprovada" só existe após revisão humana com evidência aprovada.
 *
 * Versão do detector: alterar sempre que as listas de termos ou regras mudarem,
 * para rastreabilidade das anotações produzidas.
 */
export const CAUSAL_DETECTOR_VERSION = "2026-10-15.2";

/** Taxonomia de famílias de fato gerador — mesma do cliente (jec-damage-context.ts). */
export const CAUSAL_FAMILIES = {
  transporte: "Transporte aéreo, terrestre e turismo",
  credito: "Crédito, cobrança e negativação",
  contratos: "Contratos e práticas abusivas",
  inadimplemento: "Inadimplemento e responsabilidade civil",
  servicos: "Serviços essenciais, saúde e atendimento",
  transito: "Acidente de trânsito",
  personalidade: "Personalidade, imagem e dados",
  outros: "Outros assuntos específicos",
} as const;

export type CausalFamilyKey = keyof typeof CAUSAL_FAMILIES;

export type CausalClaimType = "dano_moral" | "dano_material" | "obrigacao_fazer" | "obrigacao_nao_fazer";

export const CAUSAL_CLAIM_LABELS: Record<CausalClaimType, string> = {
  dano_moral: "Dano moral",
  dano_material: "Dano material",
  obrigacao_fazer: "Obrigação de fazer",
  obrigacao_nao_fazer: "Obrigação de não fazer",
};

type FamilyPattern = { family: CausalFamilyKey; canonical: string; terms: string[] };

/**
 * Termos normalizados (sem acento, minúsculos) com rótulo canônico por grupo.
 * A correspondência usa fronteira de palavra e preserva o offset no texto original.
 */
const FAMILY_PATTERNS: FamilyPattern[] = [
  {
    family: "transporte",
    canonical: "Cancelamento ou atraso de voo",
    terms: ["cancelamento de voo", "voo cancelado", "cancelou o voo", "atraso de voo", "voo atrasado", "atraso do voo", "atraso no voo", "overbooking", "embarque negado", "viagem nao realizada", "prejuizo com passagem aerea"],
  },
  {
    family: "transporte",
    canonical: "Extravio de bagagem",
    terms: ["extravio de bagagem", "bagagem extraviada", "bagagem avariada", "perda de bagagem"],
  },
  {
    family: "transporte",
    canonical: "Transporte aéreo e turismo",
    terms: ["transporte aereo", "passagem aerea", "pacote turistico", "agencia de turismo"],
  },
  {
    family: "credito",
    canonical: "Negativação indevida",
    terms: ["negativacao indevida", "inscricao indevida", "inclusao indevida no cadastro", "nome incluido no spc", "nome incluido no serasa", "apontamento indevido"],
  },
  {
    family: "credito",
    canonical: "Cobrança indevida e débito não contratado",
    terms: ["cobranca indevida", "debito nao contratado", "debito inexistente", "emprestimo nao contratado", "compra nao reconhecida", "fraude em cartao", "desconto nao autorizado", "repeticao do indebito", "repeticao de indebito"],
  },
  {
    family: "credito",
    canonical: "Contrato bancário e tarifas",
    terms: ["emprestimo consignado", "cartao de credito", "contrato bancario", "juros abusivos", "tarifas indevidas", "tarifas abusivas", "consorcio", "portabilidade nao efetivada"],
  },
  {
    family: "contratos",
    canonical: "Cláusula contratual abusiva",
    terms: ["clausula abusiva", "pratica abusiva", "clausula leonina", "contrato de adesao", "revisao contratual", "rescisao contratual", "declaracao de inexistencia de debito", "cobranca antecipada"],
  },
  {
    family: "contratos",
    canonical: "Descumprimento de oferta ou contrato de consumo",
    terms: ["descumprimento de oferta", "oferta nao cumprida", "publicidade enganosa", "venda casada"],
  },
  {
    family: "inadimplemento",
    canonical: "Vício do produto ou serviço",
    terms: ["vicio do produto", "vicio do servico", "produto com defeito", "aparelho em garantia", "bem em garantia", "defeito de fabricacao"],
  },
  {
    family: "inadimplemento",
    canonical: "Inadimplemento e responsabilidade civil",
    terms: ["nao entrega do produto", "atraso na entrega", "obra nao entregue", "descumprimento contratual", "inadimplemento", "responsabilidade civil", "atraso na obra"],
  },
  {
    family: "servicos",
    canonical: "Plano de saúde e negativa de cobertura",
    terms: ["plano de saude", "negativa de cobertura", "negativa de autorizacao", "operadora de saude", "recusa de cobertura", "autorizacao de procedimento negada"],
  },
  {
    family: "servicos",
    canonical: "Falha na prestação de serviço essencial",
    terms: ["falha na prestacao do servico", "falta de energia", "interrupcao no fornecimento", "energia eletrica", "concessionaria", "servico de telecomunicacoes", "internet instavel", "erro medico", "negativa de atendimento"],
  },
  {
    family: "transito",
    canonical: "Acidente de trânsito",
    terms: ["acidente de transito", "colisao", "abalroamento", "atropelamento", "capotamento", "sinistro de transito", "danos ao veiculo"],
  },
  {
    family: "personalidade",
    canonical: "Dano à imagem, honra ou dados pessoais",
    terms: ["danos a imagem", "direitos de personalidade", "honra objetiva", "difamacao", "calunia", "injuria", "exposicao indevida", "vazamento de dados", "uso indevido da imagem", "uso indevido de nome"],
  },
];

const CLAIM_PATTERNS: Array<{ claimType: CausalClaimType; terms: string[] }> = [
  { claimType: "dano_moral", terms: ["dano moral", "danos morais", "dano moral coletivo"] },
  { claimType: "dano_material", terms: ["dano material", "danos materiais", "prejuizo material", "dano emergente", "lucros cessantes"] },
  { claimType: "obrigacao_fazer", terms: ["obrigacao de fazer", "obrigacao de fazer ou nao fazer"] },
  { claimType: "obrigacao_nao_fazer", terms: ["obrigacao de nao fazer", "obrigacao de abstencao"] },
];

/** Texto de busca com o MESMO comprimento do original: acentos removidos 1:1, minúsculo. */
function searchableText(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function escapeTerm(term: string): string {
  return term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
}

function termRegex(term: string): RegExp {
  return new RegExp(`(?<![a-z0-9])${escapeTerm(term)}(?![a-z0-9])`, "g");
}

const EXCERPT_BEFORE = 160;
const EXCERPT_AFTER = 240;
export const MAX_EXCERPT_CHARS = 600;

/**
 * Marcadores do cabeçalho de metadados (boilerplate PJe/CNJ): um termo casado
 * nessas janelas é METADADO do processo (classe/assunto), não narrativa causal
 * do inteiro teor — deve ser descartado (falso positivo observado no piloto
 * PJe real: "ASSUNTO: [Inadimplemento]" no topo do documento).
 */
const HEADER_MARKERS = [
  "processo nº:",
  "processo n°:",
  "processo no:",
  "processo numero",
  "numeracao unica",
  "classe judicial",
  "classe: ",
  "assunto: ",
  "valor da causa",
];

function isHeaderWindow(searchableWindow: string): boolean {
  return HEADER_MARKERS.some(marker => searchableWindow.includes(marker));
}

export type CausalTextCandidate = {
  role: "fato_gerador" | "pedido";
  claimType: CausalClaimType;
  familyKey: CausalFamilyKey | null;
  label: string;
  normalizedLabel: string;
  confidence: number;
  excerpt: string;
  offsetStart: number;
  offsetEnd: number;
  matchedTerms: string[];
};

export type CausalExtractionResult = {
  candidates: CausalTextCandidate[];
  occurrencesScanned: number;
  candidatesDropped: number;
};

const MAX_FACT_GENERATOR_CANDIDATES = 8;
const MAX_PEDIDO_CANDIDATES = 4;
export const BASE_CONFIDENCE = 0.6;
export const CONFIDENCE_WITH_CLAIM_SIGNAL = 0.7;
export const CONFIDENCE_MULTI_TERM = 0.75;
export const MAX_CONFIDENCE = 0.85;

function excerptAround(text: string, start: number, end: number): string {
  const from = Math.max(0, start - EXCERPT_BEFORE);
  const to = Math.min(text.length, end + EXCERPT_AFTER);
  const slice = text.slice(from, to).replace(/\s+/g, " ").trim();
  return slice.length > MAX_EXCERPT_CHARS ? slice.slice(0, MAX_EXCERPT_CHARS) : slice;
}

/**
 * Extrai candidatos de fato gerador e pedidos do inteiro teor.
 * Função pura, sem acesso a banco — para uso no serviço e nos testes.
 */
export function extractCausalCandidates(text: string): CausalExtractionResult {
  const haystack = searchableText(text);
  type Hit = { pattern: FamilyPattern; start: number; end: number; term: string };
  const hits: Hit[] = [];
  let occurrencesScanned = 0;

  for (const pattern of FAMILY_PATTERNS) {
    for (const term of pattern.terms) {
      const regex = termRegex(term);
      let match: RegExpExecArray | null;
      while ((match = regex.exec(haystack)) !== null) {
        hits.push({ pattern, start: match.index, end: match.index + match[0].length, term });
        occurrencesScanned += 1;
        if (regex.lastIndex === match.index) regex.lastIndex += 1; // guard contra zero-length
      }
    }
  }

  // Sinais de pedido em todo o texto (para contexto de confiança e anotações de pedido).
  const claimSignals: Array<{ claimType: CausalClaimType; start: number; end: number; term: string }> = [];
  for (const claim of CLAIM_PATTERNS) {
    for (const term of claim.terms) {
      const regex = termRegex(term);
      let match: RegExpExecArray | null;
      while ((match = regex.exec(haystack)) !== null) {
        claimSignals.push({ claimType: claim.claimType, start: match.index, end: match.index + match[0].length, term });
      }
    }
  }

  // Confiança por janela: sinais de pedido dentro da janela do fato gerador elevam a confiança.
  const factCandidates: CausalTextCandidate[] = [];
  const dedup = new Map<string, CausalTextCandidate>();
  let candidatesDropped = 0;
  for (const hit of hits) {
    const windowStart = Math.max(0, hit.start - EXCERPT_BEFORE);
    const windowEnd = Math.min(haystack.length, hit.end + EXCERPT_AFTER);
    // Guard de cabeçalho: janela com marcador de metadados não é narrativa causal.
    if (isHeaderWindow(haystack.slice(windowStart, windowEnd))) {
      candidatesDropped += 1;
      continue;
    }
    const claimsInWindow = claimSignals.filter(signal => signal.start < windowEnd && signal.end > windowStart);
    const matchedTerms = new Set<string>([hit.term]);
    const label = hit.pattern.canonical;
    const key = `${hit.pattern.family}::${label}`;
    const existing = dedup.get(key);
    const confidence = claimsInWindow.length > 0
      ? CONFIDENCE_WITH_CLAIM_SIGNAL
      : BASE_CONFIDENCE;
    if (existing) {
      existing.matchedTerms.push(hit.term);
      if (existing.matchedTerms.length >= 2) existing.confidence = Math.min(MAX_CONFIDENCE, CONFIDENCE_MULTI_TERM);
      continue;
    }
    dedup.set(key, {
      role: "fato_gerador",
      claimType: claimsInWindow[0]?.claimType ?? "dano_moral",
      familyKey: hit.pattern.family,
      label,
      normalizedLabel: normalizeCausalLabel(label),
      confidence,
      excerpt: excerptAround(text, hit.start, hit.end),
      offsetStart: hit.start,
      offsetEnd: hit.end,
      matchedTerms: [hit.term],
    });
  }
  factCandidates.push(...Array.from(dedup.values()));
  factCandidates.sort((left, right) => right.confidence - left.confidence || left.offsetStart - right.offsetStart);
  const factGeneratorCandidates = factCandidates.slice(0, MAX_FACT_GENERATOR_CANDIDATES);

  // Pedidos: uma anotação por tipo de pedido detectado (rótulo estável, sem duplicar).
  const pedidoCandidates: CausalTextCandidate[] = [];
  const claimsSeen = new Map<CausalClaimType, { start: number; end: number; term: string }>();
  for (const signal of claimSignals) {
    if (!claimsSeen.has(signal.claimType)) claimsSeen.set(signal.claimType, signal);
  }
  for (const [claimType, signal] of Array.from(claimsSeen.entries())) {
    pedidoCandidates.push({
      role: "pedido",
      claimType,
      familyKey: null,
      label: `Pedido de ${CAUSAL_CLAIM_LABELS[claimType]}`,
      normalizedLabel: normalizeCausalLabel(`pedido de ${CAUSAL_CLAIM_LABELS[claimType]}`),
      confidence: BASE_CONFIDENCE,
      excerpt: excerptAround(text, signal.start, signal.end),
      offsetStart: signal.start,
      offsetEnd: signal.end,
      matchedTerms: [signal.term],
    });
  }

  const candidates = [...factGeneratorCandidates, ...pedidoCandidates.slice(0, MAX_PEDIDO_CANDIDATES)];
  const droppedByHeader = candidatesDropped;
  const droppedByLimit = Math.max(0, factCandidates.length - factGeneratorCandidates.length);
  return {
    candidates,
    occurrencesScanned,
    // Descartes por limite de caps + descartes por janela de cabeçalho de metadados.
    candidatesDropped: droppedByLimit + droppedByHeader,
  };
}

/** Rótulo da família com fallback seguro para agregação de causas comprovadas. */
export function causalFamilyLabel(familyKey: string | null | undefined): string {
  if (familyKey && familyKey in CAUSAL_FAMILIES) return CAUSAL_FAMILIES[familyKey as CausalFamilyKey];
  return CAUSAL_FAMILIES.outros;
}
