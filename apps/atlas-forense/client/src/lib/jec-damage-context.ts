/**
 * Apenas coocorrência de ASSUNTOS CNJ na amostra pública dos JECs.
 * NÃO identifica fato gerador, procedência, nexo causal nem valor da condenação.
 */
export const DAMAGE_SUBJECTS = [
  "Indenização por dano moral",
  "Indenização por dano material",
] as const;

const PROCEDURAL_OR_GENERIC = new Set([
  "Obrigação de fazer / não fazer",
  "Tutela de Urgência",
  "Liminar",
  "Antecipação de Tutela",
]);

type TaggedProcess = { assuntos: string[] };
export type DamageContext = {
  damage: string;
  total: number;
  semAssuntoContextual: number;
  assuntosCorrelatos: { assunto: string; processos: number }[];
};

/** Registra assuntos adjacentes, jamais afirma que causaram o dano. */
export function contextualSubjects(assuntos: string[]): string[] {
  return Array.from(new Set(assuntos.filter((subject) =>
    !DAMAGE_SUBJECTS.includes(subject as (typeof DAMAGE_SUBJECTS)[number]) &&
    !PROCEDURAL_OR_GENERIC.has(subject) &&
    subject.trim().length > 0,
  )));
}

export function summarizeDamageContexts(rows: TaggedProcess[]): DamageContext[] {
  return DAMAGE_SUBJECTS.map((damage) => {
    const selected = rows.filter((row) => row.assuntos.includes(damage));
    const contextCounts = new Map<string, number>();
    let semAssuntoContextual = 0;
    for (const row of selected) {
      const contexts = contextualSubjects(row.assuntos);
      if (contexts.length === 0) semAssuntoContextual++;
      for (const subject of contexts) contextCounts.set(subject, (contextCounts.get(subject) || 0) + 1);
    }
    return {
      damage,
      total: selected.length,
      semAssuntoContextual,
      assuntosCorrelatos: Array.from(contextCounts.entries())
        .map(([assunto, processos]) => ({ assunto, processos }))
        .sort((a, b) => b.processos - a.processos || a.assunto.localeCompare(b.assunto, "pt-BR")),
    };
  });
}

/**
 * Camada de FATO GERADOR CANDIDATO (Atlas Causal, fonte `cnj_subject`, status `pending_review`).
 *
 * Agrupa assuntos CNJ correlatos em famílias de fato gerador — ex.: cancelamento de voo é
 * candidato a fato gerador de dano moral. NÃO identifica nexo causal, não afirma que o fato
 * ocorreu e não substitui o exame do inteiro teor (contrato do módulo Atlas Causal).
 */
export const CLAIM_SUBJECTS = [...DAMAGE_SUBJECTS, "Obrigação de fazer / não fazer"] as const;
export type ClaimSubject = (typeof CLAIM_SUBJECTS)[number];

export const FACT_GENERATOR_SOURCE = "cnj_subject";
export const FACT_GENERATOR_STATUS = "pending_review";
export const FACT_GENERATOR_NOTICE =
  "Família de fato gerador CANDIDATA, inferida da coocorrência de assuntos CNJ no mesmo processo. Não comprova nexo causal, fato ocorrido ou procedência. Confirmação exige inteiro teor e revisão humana (módulo Atlas Causal).";

export const FACT_GENERATOR_FAMILIES = {
  transporte: "Transporte aéreo, terrestre e turismo",
  credito: "Crédito, cobrança e negativação",
  contratos: "Contratos e práticas abusivas",
  inadimplemento: "Inadimplemento e responsabilidade civil",
  servicos: "Serviços essenciais, saúde e atendimento",
  transito: "Acidente de trânsito",
  personalidade: "Personalidade, imagem e dados",
  outros: "Outros assuntos específicos",
} as const;
export type FactGeneratorFamily = (typeof FACT_GENERATOR_FAMILIES)[keyof typeof FACT_GENERATOR_FAMILIES];

const normalizeSubject = (value: string) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase().replace(/\s+/g, " ");

const RAW_FAMILY_MAP: Record<string, FactGeneratorFamily> = {
  // Transporte aéreo, terrestre e turismo
  "Cancelamento de voo": FACT_GENERATOR_FAMILIES.transporte,
  "Atraso de voo": FACT_GENERATOR_FAMILIES.transporte,
  "Transporte Aéreo": FACT_GENERATOR_FAMILIES.transporte,
  "Extravio de bagagem": FACT_GENERATOR_FAMILIES.transporte,
  "Overbooking": FACT_GENERATOR_FAMILIES.transporte,
  "Turismo": FACT_GENERATOR_FAMILIES.transporte,
  "Acidente Aéreo": FACT_GENERATOR_FAMILIES.transporte,
  "Transporte Terrestre": FACT_GENERATOR_FAMILIES.transporte,
  "Transporte de Pessoas": FACT_GENERATOR_FAMILIES.transporte,
  "Transporte de Coisas": FACT_GENERATOR_FAMILIES.transporte,
  // Crédito, cobrança e negativação
  "Negativação indevida": FACT_GENERATOR_FAMILIES.credito,
  "Bancários": FACT_GENERATOR_FAMILIES.credito,
  "Contratos Bancários": FACT_GENERATOR_FAMILIES.credito,
  "Empréstimo consignado": FACT_GENERATOR_FAMILIES.credito,
  "Cartão de Crédito": FACT_GENERATOR_FAMILIES.credito,
  "Repetição do Indébito": FACT_GENERATOR_FAMILIES.credito,
  "Repetição de indébito": FACT_GENERATOR_FAMILIES.credito,
  "Consórcio": FACT_GENERATOR_FAMILIES.credito,
  "Crédito Direto ao Consumidor - CDC": FACT_GENERATOR_FAMILIES.credito,
  "Financiamento de Produto": FACT_GENERATOR_FAMILIES.credito,
  "Revisão de Juros Remuneratórios, Capitalização/Anatocismo": FACT_GENERATOR_FAMILIES.credito,
  "Títulos de Crédito": FACT_GENERATOR_FAMILIES.credito,
  "Espécies de Títulos de Crédito": FACT_GENERATOR_FAMILIES.credito,
  "Nota Promissória": FACT_GENERATOR_FAMILIES.credito,
  "Duplicata": FACT_GENERATOR_FAMILIES.credito,
  "Cédula de Crédito Comercial": FACT_GENERATOR_FAMILIES.credito,
  "Protesto Indevido de Título": FACT_GENERATOR_FAMILIES.credito,
  "Execução de Título Extrajudicial": FACT_GENERATOR_FAMILIES.credito,
  "Desconto em folha de pagamento": FACT_GENERATOR_FAMILIES.credito,
  "Mútuo": FACT_GENERATOR_FAMILIES.credito,
  "Cobrança": FACT_GENERATOR_FAMILIES.credito,
  // Contratos e práticas abusivas
  "Cláusulas Abusivas": FACT_GENERATOR_FAMILIES.contratos,
  "Práticas Abusivas": FACT_GENERATOR_FAMILIES.contratos,
  "Vendas casadas": FACT_GENERATOR_FAMILIES.contratos,
  "Rescisão contratual e devolução": FACT_GENERATOR_FAMILIES.contratos,
  "Rescisão / Resolução": FACT_GENERATOR_FAMILIES.contratos,
  "Dever de Informação": FACT_GENERATOR_FAMILIES.contratos,
  "Oferta e Publicidade": FACT_GENERATOR_FAMILIES.contratos,
  "Interpretação / Revisão de Contrato": FACT_GENERATOR_FAMILIES.contratos,
  "Espécies de Contratos": FACT_GENERATOR_FAMILIES.contratos,
  "Ato / Negócio Jurídico": FACT_GENERATOR_FAMILIES.contratos,
  "Compromisso": FACT_GENERATOR_FAMILIES.contratos,
  "Defeito, nulidade ou anulação": FACT_GENERATOR_FAMILIES.contratos,
  "Abatimento proporcional do preço": FACT_GENERATOR_FAMILIES.contratos,
  "Reajuste contratual": FACT_GENERATOR_FAMILIES.contratos,
  "Mensalidades": FACT_GENERATOR_FAMILIES.contratos,
  "Compra e Venda": FACT_GENERATOR_FAMILIES.contratos,
  "Promessa de Compra e Venda": FACT_GENERATOR_FAMILIES.contratos,
  "Locação de Imóvel": FACT_GENERATOR_FAMILIES.contratos,
  "Locação de Móvel": FACT_GENERATOR_FAMILIES.contratos,
  "Despejo para Uso Próprio": FACT_GENERATOR_FAMILIES.contratos,
  "Despesas Condominiais": FACT_GENERATOR_FAMILIES.contratos,
  "Cobrança de Aluguéis - Sem despejo": FACT_GENERATOR_FAMILIES.contratos,
  "Atraso na Entrega do Imóvel": FACT_GENERATOR_FAMILIES.contratos,
  "Estabelecimentos de Ensino": FACT_GENERATOR_FAMILIES.contratos,
  "Cessão de Direitos": FACT_GENERATOR_FAMILIES.contratos,
  "Corretagem": FACT_GENERATOR_FAMILIES.contratos,
  "Transmissão": FACT_GENERATOR_FAMILIES.contratos,
  // Inadimplemento e responsabilidade civil
  "Inadimplemento": FACT_GENERATOR_FAMILIES.inadimplemento,
  "Mora": FACT_GENERATOR_FAMILIES.inadimplemento,
  "Perdas e Danos": FACT_GENERATOR_FAMILIES.inadimplemento,
  "Indenização do Prejuízo": FACT_GENERATOR_FAMILIES.inadimplemento,
  "Correção Monetária": FACT_GENERATOR_FAMILIES.inadimplemento,
  "Pagamento": FACT_GENERATOR_FAMILIES.inadimplemento,
  "Adimplemento e Extinção": FACT_GENERATOR_FAMILIES.inadimplemento,
  "Enriquecimento sem Causa": FACT_GENERATOR_FAMILIES.inadimplemento,
  "Responsabilidade Civil": FACT_GENERATOR_FAMILIES.inadimplemento,
  "Evicção ou Vicio Redibitório": FACT_GENERATOR_FAMILIES.inadimplemento,
  "Perda da Propriedade": FACT_GENERATOR_FAMILIES.inadimplemento,
  "Direito de Vizinhança": FACT_GENERATOR_FAMILIES.inadimplemento,
  "Ação Anulatória": FACT_GENERATOR_FAMILIES.inadimplemento,
  // Serviços essenciais, saúde e atendimento
  "Irregularidade no atendimento": FACT_GENERATOR_FAMILIES.servicos,
  "Telefonia": FACT_GENERATOR_FAMILIES.servicos,
  "Assinatura Básica Mensal": FACT_GENERATOR_FAMILIES.servicos,
  "Fornecimento de Energia Elétrica": FACT_GENERATOR_FAMILIES.servicos,
  "Fornecimento de Água": FACT_GENERATOR_FAMILIES.servicos,
  "Fornecimento de medicamentos": FACT_GENERATOR_FAMILIES.servicos,
  "Tratamento médico-hospitalar": FACT_GENERATOR_FAMILIES.servicos,
  "Serviços Hospitalares": FACT_GENERATOR_FAMILIES.servicos,
  "Planos de saúde": FACT_GENERATOR_FAMILIES.servicos,
  "Prestação de Serviços": FACT_GENERATOR_FAMILIES.servicos,
  "Serviços Profissionais": FACT_GENERATOR_FAMILIES.servicos,
  "Seguro": FACT_GENERATOR_FAMILIES.servicos,
  // Acidente de trânsito
  "Acidente de Trânsito": FACT_GENERATOR_FAMILIES.transito,
  // Personalidade, imagem e dados
  "Direito de Imagem": FACT_GENERATOR_FAMILIES.personalidade,
  "Proteção de Dados Pessoais": FACT_GENERATOR_FAMILIES.personalidade,
  "Privacidade": FACT_GENERATOR_FAMILIES.personalidade,
  "Direitos da Personalidade": FACT_GENERATOR_FAMILIES.personalidade,
  "Direito Autoral": FACT_GENERATOR_FAMILIES.personalidade,
};

const FAMILY_BY_SUBJECT = new Map<string, FactGeneratorFamily>(
  Object.entries(RAW_FAMILY_MAP).map(([subject, family]) => [normalizeSubject(subject), family]),
);

/** Assuntos processuais/de parte que nunca sinalizam fato gerador. */
const NON_GENERATOR_SUBJECTS = new Set([
  ...Array.from(PROCEDURAL_OR_GENERIC).map((subject) => normalizeSubject(subject)),
  normalizeSubject("Assistência Judiciária Gratuita"),
  normalizeSubject("Litigância de Má Fé"),
  normalizeSubject("Ato Atentatório à Dignidade da Justiça"),
  normalizeSubject("Peticionamento Eletrônico"),
  normalizeSubject("Efeito Suspensivo / Impugnação / Embargos à Execução"),
  normalizeSubject("Antecipação de Tutela / Tutela Específica"),
  normalizeSubject("Hipoteca"),
  normalizeSubject("Ato Atentatório à Dignidade da Justiça"),
]);

export function familyOfSubject(subject: string): FactGeneratorFamily | null {
  return FAMILY_BY_SUBJECT.get(normalizeSubject(subject)) ?? null;
}

export type ClaimFactGeneratorSummary = {
  claim: string;
  total: number;
  pctDaAmostra: number | null;
  semIndicio: number;
  familias: { familia: string; processos: number; pctDosRegistros: number; assuntos: { assunto: string; processos: number }[] }[];
  coPedidos: { pedido: string; processos: number }[];
};

/** Assuntos adjacentes ao pedido-alvo que sinalizam fato gerador candidato (fonte: assunto CNJ). */
export function factGeneratorSubjects(assuntos: string[], claim: string): string[] {
  return Array.from(new Set(assuntos.filter((subject) => {
    const normalized = normalizeSubject(subject);
    if (normalized === normalizeSubject(claim)) return false;
    if (CLAIM_SUBJECTS.some((other) => normalizeSubject(other) === normalized)) return false;
    if (NON_GENERATOR_SUBJECTS.has(normalized)) return false;
    return subject.trim().length > 0;
  })));
}

/**
 * Resumo de fato gerador CANDIDATO por pedido-alvo (dano moral, dano material e
 * obrigação de fazer/não fazer). Nunca afirma causalidade: famílias são candidatas,
 * fonte `cnj_subject`, status `pending_review`.
 */
export function summarizeFactGenerators(rows: TaggedProcess[]): ClaimFactGeneratorSummary[] {
  const sampleSize = rows.length;
  return CLAIM_SUBJECTS.map((claim) => {
    const selected = rows.filter((row) => row.assuntos.includes(claim));
    const familyCounts = new Map<string, Map<string, number>>();
    let semIndicio = 0;
    for (const row of selected) {
      const signals = factGeneratorSubjects(row.assuntos, claim);
      if (signals.length === 0) semIndicio++;
      for (const subject of signals) {
        const family = familyOfSubject(subject) ?? FACT_GENERATOR_FAMILIES.outros;
        if (!familyCounts.has(family)) familyCounts.set(family, new Map());
        const subjects = familyCounts.get(family)!;
        subjects.set(subject, (subjects.get(subject) || 0) + 1);
      }
    }
    const coCounts = new Map<string, number>();
    for (const row of selected) {
      for (const subject of row.assuntos) {
        if (subject !== claim && (CLAIM_SUBJECTS as readonly string[]).includes(subject)) coCounts.set(subject, (coCounts.get(subject) || 0) + 1);
      }
    }
    return {
      claim,
      total: selected.length,
      pctDaAmostra: sampleSize === 0 ? null : Math.round((selected.length / sampleSize) * 1000) / 10,
      semIndicio,
      familias: Array.from(familyCounts.entries())
        .map(([familia, subjects]) => ({
          familia,
          processos: Array.from(subjects.values()).reduce((sum, n) => sum + n, 0),
          pctDosRegistros: selected.length === 0 ? 0 : Math.round((Array.from(subjects.values()).reduce((sum, n) => sum + n, 0) / selected.length) * 1000) / 10,
          assuntos: Array.from(subjects.entries())
            .map(([assunto, processos]) => ({ assunto, processos }))
            .sort((a, b) => b.processos - a.processos || a.assunto.localeCompare(b.assunto, "pt-BR")),
        }))
        .sort((a, b) => b.processos - a.processos || a.familia.localeCompare(b.familia, "pt-BR")),
      coPedidos: Array.from(coCounts.entries())
        .map(([pedido, processos]) => ({ pedido, processos }))
        .sort((a, b) => b.processos - a.processos || a.pedido.localeCompare(b.pedido, "pt-BR")),
    };
  });
}
