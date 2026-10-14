import { describe, expect, it } from "vitest";
import {
  contextualSubjects,
  summarizeDamageContexts,
  factGeneratorSubjects,
  familyOfSubject,
  summarizeFactGenerators,
  FACT_GENERATOR_FAMILIES,
  FACT_GENERATOR_SOURCE,
  FACT_GENERATOR_STATUS,
  CLAIM_SUBJECTS,
} from "../client/src/lib/jec-damage-context";

describe("JEC moral/material evidence context", () => {
  it("never invents a fact generator when only indemnification or procedural tags exist", () => {
    const rows = [{ assuntos: ["Indenização por dano moral", "Obrigação de fazer / não fazer"] }];
    const [moral] = summarizeDamageContexts(rows);
    expect(moral.total).toBe(1);
    expect(moral.semAssuntoContextual).toBe(1);
    expect(moral.assuntosCorrelatos).toEqual([]);
  });
  it("associates complementary subjects to both damages without calling them causes", () => {
    const rows = [
      { assuntos: ["Indenização por dano moral", "Indenização por dano material", "Cancelamento de voo"] },
      { assuntos: ["Indenização por dano moral", "Cancelamento de voo", "Cancelamento de voo"] },
    ];
    const [moral, material] = summarizeDamageContexts(rows);
    expect(moral.total).toBe(2);
    expect(material.total).toBe(1);
    expect(moral.assuntosCorrelatos).toEqual([{ assunto: "Cancelamento de voo", processos: 2 }]);
    expect(material.assuntosCorrelatos).toEqual([{ assunto: "Cancelamento de voo", processos: 1 }]);
    expect(contextualSubjects(["Tutela de Urgência", "Indenização por dano material"])).toEqual([]);
  });
  it("handles no records without implying success rates or adjudicated damages", () => {
    expect(summarizeDamageContexts([]).every((row) => row.total === 0 && row.semAssuntoContextual === 0)).toBe(true);
  });
});

describe("fact generator candidates (Atlas Causal, fonte cnj_subject)", () => {
  it("exposes the governance contract", () => {
    expect(FACT_GENERATOR_SOURCE).toBe("cnj_subject");
    expect(FACT_GENERATOR_STATUS).toBe("pending_review");
    expect(CLAIM_SUBJECTS).toContain("Obrigação de fazer / não fazer");
  });

  it("maps real sample subjects into fact generator families", () => {
    expect(familyOfSubject("Cancelamento de voo")).toBe(FACT_GENERATOR_FAMILIES.transporte);
    expect(familyOfSubject("Negativação indevida")).toBe(FACT_GENERATOR_FAMILIES.credito);
    expect(familyOfSubject("Cláusulas Abusivas")).toBe(FACT_GENERATOR_FAMILIES.contratos);
    expect(familyOfSubject("Acidente de Trânsito")).toBe(FACT_GENERATOR_FAMILIES.transito);
    expect(familyOfSubject("Proteção de Dados Pessoais")).toBe(FACT_GENERATOR_FAMILIES.personalidade);
    // variações ortográficas da amostra caem na mesma família
    expect(familyOfSubject("Repetição do Indébito")).toBe(FACT_GENERATOR_FAMILIES.credito);
    expect(familyOfSubject("Repetição de indébito")).toBe(FACT_GENERATOR_FAMILIES.credito);
  });

  it("never treats claim subjects, procedural or justice topics as fact generator signals", () => {
    expect(factGeneratorSubjects(["Indenização por dano moral", "Obrigação de fazer / não fazer", "Indenização por dano material"], "Indenização por dano moral")).toEqual([]);
    expect(factGeneratorSubjects(["Tutela de Urgência", "Assistência Judiciária Gratuita", "Litigância de Má Fé"], "Indenização por dano material")).toEqual([]);
  });

  it("groups correlated subjects into candidate families with counts and percentages", () => {
    const rows = [
      { assuntos: ["Indenização por dano moral", "Indenização por dano material", "Cancelamento de voo"] },
      { assuntos: ["Indenização por dano moral", "Cancelamento de voo"] },
      { assuntos: ["Indenização por dano moral", "Atraso de voo"] },
      { assuntos: ["Indenização por dano moral"] },
    ];
    const [moral] = summarizeFactGenerators(rows);
    expect(moral.total).toBe(4);
    expect(moral.pctDaAmostra).toBe(100);
    expect(moral.semIndicio).toBe(1);
    const transporte = moral.familias.find((family) => family.familia === FACT_GENERATOR_FAMILIES.transporte);
    expect(transporte?.processos).toBe(3);
    expect(transporte?.pctDosRegistros).toBe(75);
    expect(transporte?.assuntos).toEqual([
      { assunto: "Cancelamento de voo", processos: 2 },
      { assunto: "Atraso de voo", processos: 1 },
    ]);
    expect(moral.coPedidos).toEqual([{ pedido: "Indenização por dano material", processos: 1 }]);
  });

  it("routes co-claims to coPedidos instead of families for obrigação de fazer", () => {
    const rows = [
      { assuntos: ["Obrigação de fazer / não fazer", "Indenização por dano moral", "Cancelamento de voo"] },
      { assuntos: ["Obrigação de fazer / não fazer", "Indenização por dano material"] },
    ];
    const [, , obrigacao] = summarizeFactGenerators(rows);
    expect(obrigacao.total).toBe(2);
    expect(obrigacao.familias.map((family) => family.familia)).toEqual([FACT_GENERATOR_FAMILIES.transporte]);
    expect(obrigacao.coPedidos).toEqual([
      { pedido: "Indenização por dano material", processos: 1 },
      { pedido: "Indenização por dano moral", processos: 1 },
    ]);
  });

  it("falls back to the honest 'outros' family instead of inventing a category", () => {
    expect(familyOfSubject("Assunto Desconhecido Inventado")).toBeNull();
    const rows = [{ assuntos: ["Indenização por dano moral", "Assunto Desconhecido Inventado"] }];
    const [moral] = summarizeFactGenerators(rows);
    expect(moral.semIndicio).toBe(0);
    expect(moral.familias).toHaveLength(1);
    expect(moral.familias[0].familia).toBe(FACT_GENERATOR_FAMILIES.outros);
  });

  it("handles no records without implying percentages or causes", () => {
    const empty = summarizeFactGenerators([]);
    expect(empty).toHaveLength(3);
    expect(empty.every((row) => row.total === 0 && row.semIndicio === 0 && row.pctDaAmostra === null && row.familias.length === 0)).toBe(true);
  });
});
