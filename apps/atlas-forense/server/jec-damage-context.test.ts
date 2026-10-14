import { describe, expect, it } from "vitest";
import { contextualSubjects, summarizeDamageContexts } from "../client/src/lib/jec-damage-context";

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
