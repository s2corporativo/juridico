// legal_calculator.ts — Cálculos jurídicos determinísticos (diferencial sobre MinutaIA)
//
// Lacuna do MinutaIA: cálculos ficam a cargo de ferramentas externas.
// Este módulo faz cálculos determinísticos auditáveis: prazos, correção,
// juros, prescrição — sem delegar aritmética ao LLM.
//
// Base normativa:
// - Prazos: art. 219 e 224 do CPC, Lei 11.419/06
// - Correção: INPC/IPCA (fonte BCB/IBGE)
// - Juros: art. 406 do CC (1% ao mês), Súmula 482 STJ (0,5%)
// - Prescrição: art. 205 CC (10 anos), art. 206 CC (5 anos), art. 23 CBC
// - Verbas trabalhistas: CLT art. 477, Súmula 381 TST

// ── Cálculo de Prazos Processuais ─────────────────────────────────────────

export interface DeadlineResult {
  vencimento: Date;
  tipoContagem: "uteis" | "corridos";
  diasUteis: number;
  diasCorridos: number;
  observacoes: string[];
}

/**
 * Calcula prazo processual.
 * NOTA: não considera feriados locais (requer calendário do tribunal).
 * O sistema alerta: "Verifique feriados locais e suspensões do tribunal".
 */
export function calculateDeadline(
  marcoInicial: Date,
  prazoDias: number,
  tipoContagem: "uteis" | "corridos" = "uteis"
): DeadlineResult {
  const observacoes: string[] = [];
  const vencimento = new Date(marcoInicial);

  if (tipoContagem === "corridos") {
    // Dias corridos: soma direta (ex: prazo de 15 dias corridos)
    vencimento.setDate(vencimento.getDate() + prazoDias);
    observacoes.push("Contagem em dias corridos (verificar se o rito exige úteis)");
  } else {
    // Dias úteis: pula sábados e domingos
    let added = 0;
    while (added < prazoDias) {
      vencimento.setDate(vencimento.getDate() + 1);
      const day = vencimento.getDay();
      if (day !== 0 && day !== 6) { // não é domingo (0) nem sábado (6)
        added++;
      }
    }
    observacoes.push("Contagem em dias úteis (exclui sábados e domingos)");
  }

  // Prorrogação: se vence em dia sem expediente, vai para o próximo dia útil
  const vencDay = vencimento.getDay();
  if (vencDay === 0 || vencDay === 6) {
    while (vencimento.getDay() === 0 || vencimento.getDay() === 6) {
      vencimento.setDate(vencimento.getDate() + 1);
    }
    observacoes.push("Vencimento caiu em fim de semana — prorrogado para o próximo dia útil");
  }

  observacoes.push("⚠ Verifique feriados locais, feriados forenses e suspensões do tribunal");
  observacoes.push("⚠ A IA nunca confirma prazo — confira manualmente com o calendário oficial");

  const diasCorridos = Math.round((vencimento.getTime() - marcoInicial.getTime()) / (1000 * 60 * 60 * 24));

  return {
    vencimento,
    tipoContagem,
    diasUteis: prazoDias,
    diasCorridos,
    observacoes,
  };
}

// ── Cálculo de Correção Monetária ─────────────────────────────────────────

export interface CorrectionResult {
  valorCorrigido: number;
  fatorCorrecao: number;
  memoriaCalculo: string;
  indiceUsado: string;
  observacoes: string[];
}

/**
 * Calcula correção monetária usando índice informado.
 * Para uso real, buscar índices do IBGE/SIDRA via /api/fontes/ibge.
 */
export function calculateCorrection(
  valorOriginal: number,
  fatorAcumulado: number, // fator de correção acumulado (ex: 1.5 = 50% de correção)
  indice: string = "IPCA"
): CorrectionResult {
  const valorCorrigido = valorOriginal * fatorAcumulado;
  const observacoes: string[] = [];

  observacoes.push(`Índice usado: ${indice}`);
  observacoes.push(`Fator acumulado: ${fatorAcumulado.toFixed(4)}`);
  observacoes.push(`Valor original: R$ ${valorOriginal.toFixed(2)}`);
  observacoes.push(`Valor corrigido: R$ ${valorCorrigido.toFixed(2)}`);
  observacoes.push("⚠ Confirme o índice e período via /api/fontes/ibge");

  return {
    valorCorrigido,
    fatorCorrecao: fatorAcumulado,
    memoriaCalculo: `${valorOriginal.toFixed(2)} × ${fatorAcumulado.toFixed(4)} = ${valorCorrigido.toFixed(2)}`,
    indiceUsado: indice,
    observacoes,
  };
}

// ── Simulação de juros com taxa informada ──────────────────────────────

export interface InterestResult {
  valorJuros: number;
  valorTotal: number;
  taxaMensal: number;
  meses: number;
  memoriaCalculo: string;
  base: string;
  observacoes: string[];
}

/**
 * Mathematical simulation ONLY, not automatic application of CC art. 406,
 * CLT or historic STJ precedent. Since Lei 14.905/2024 the legal interest
 * methodology is month-dependent (CMN/BCB) and cannot be hardcoded at 1%.
 * Reference: https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/l14905.htm
 */
export function calculateInterest(
  valorPrincipal: number,
  meses: number,
  taxaMensal: number,
  base: "informada_pelo_usuario" = "informada_pelo_usuario",
): InterestResult {
  if (base !== "informada_pelo_usuario" ||
      !Number.isFinite(valorPrincipal) || valorPrincipal <= 0 || valorPrincipal > 1_000_000_000 ||
      !Number.isFinite(meses) || meses <= 0 || meses > 600 ||
      !Number.isFinite(taxaMensal) || taxaMensal < 0 || taxaMensal > 1) {
    throw new Error("INTEREST_PARAMETERS_REQUIRE_EXPLICIT_RATE");
  }
  const valorJuros = valorPrincipal * taxaMensal * meses;
  return {
    valorJuros,
    valorTotal: valorPrincipal + valorJuros,
    taxaMensal,
    meses,
    memoriaCalculo: `${valorPrincipal.toFixed(2)} × ${taxaMensal} × ${meses} meses = ${valorJuros.toFixed(2)} (juros simples)`,
    base: "Taxa mensal fornecida pelo usuário — simulação matemática",
    observacoes: [
      "Não é cálculo automático de taxa legal ou de crédito trabalhista.",
      "Conferir o índice, o período e os marcos legais aplicáveis.",
      "CC art. 406 após Lei 14.905/2024: consultar a Taxa Legal divulgada pelo Banco Central; não presumir 1% ao mês.",
    ],
  };
}

// ── Triagem de prescrição — nunca uma declaração automática ──────────

export interface PrescriptionResult {
  prescrito: null;
  prazoPrescricional: null;
  baseNormativa: string;
  diasRestantes: null;
  observacoes: string[];
}

/**
 * A start date and a branch label are never sufficient to determine
 * prescription/decadence. The prior implementation wrongly invented 12 years
 * as an "average" criminal limit and incorrectly marked cases PRESCRITO.
 *
 * Requires legal classification, act/claim, accrual dates, interruptions,
 * suspensions, applicable transition rules, employment termination, etc.
 * Return an explicit non-conclusion until reviewed by a lawyer.
 */
export function checkPrescription(
  dataFato: Date,
  dataAjuizamento: Date,
  area: string = "civil",
): PrescriptionResult {
  if (Number.isNaN(dataFato.getTime()) || Number.isNaN(dataAjuizamento.getTime())) {
    throw new Error("INVALID_PRESCRIPTION_DATES");
  }
  return {
    prescrito: null,
    prazoPrescricional: null,
    baseNormativa: "Enquadramento e prazo prescricional exigem análise jurídica individual.",
    diasRestantes: null,
    observacoes: [
      `Área informada: ${area.slice(0, 60)}. Não é classificação jurídica validada.`,
      `Data indicada para o fato: ${dataFato.toLocaleDateString("pt-BR")}.`,
      `Data indicada para o ajuizamento: ${dataAjuizamento.toLocaleDateString("pt-BR")}.`,
      "A triagem não identifica automaticamente o termo inicial, a natureza da pretensão, interrupção, suspensão, decadência ou regras de transição.",
      "Não há conclusão de prescrição nem cálculo confiável de dias restantes com estes dados.",
      "Advogado deve verificar os fatos, a legislação e a jurisprudência vigente antes de registrar um prazo.",
    ],
  };
}
