import { describe, expect, it } from "vitest";
import {
  causalInteiroTeorInput,
  causalReviewDecisionInput,
} from "./causal-contract";
import {
  canDecideAnnotation,
  nextCoverageStatus,
  summarizeProvenCauses,
} from "./causal-pilot-service";

const URL_OK = "https://pje-consulta-publica.tjmg.jus.br/documento/123";

describe("Contratos do piloto inteiro teor", () => {
  it("aceita inteiro teor dentro dos limites e método controlado", () => {
    const base = { caseId: 1, documentId: 2, plainText: "S".repeat(120), extractionMethod: "manual_paste", sourceUrl: URL_OK } as const;
    expect(causalInteiroTeorInput.safeParse(base).success).toBe(true);
    expect(causalInteiroTeorInput.safeParse({ ...base, extractionMethod: "inventado" }).success).toBe(false);
    expect(causalInteiroTeorInput.safeParse({ ...base, plainText: "curto" }).success).toBe(false);
    expect(causalInteiroTeorInput.safeParse({ ...base, plainText: "T".repeat(1_000_001) }).success).toBe(false);
  });

  it("inteiro teor exige URL oficial de proveniência", () => {
    const base = { caseId: 1, documentId: 2, plainText: "S".repeat(120) } as const;
    expect(causalInteiroTeorInput.safeParse(base).success).toBe(false);
    expect(causalInteiroTeorInput.safeParse({ ...base, sourceUrl: "http://inseguro.tjmg.jus.br/doc" }).success).toBe(false);
    expect(causalInteiroTeorInput.safeParse({ ...base, sourceUrl: URL_OK }).success).toBe(true);
  });

  it("exige revisor e decisão controlada na revisão de candidato", () => {
    const base = { annotationId: 5, decision: "approved", reviewer: "adv-1" } as const;
    expect(causalReviewDecisionInput.safeParse(base).success).toBe(true);
    expect(causalReviewDecisionInput.safeParse({ ...base, reviewer: "a" }).success).toBe(false);
    expect(causalReviewDecisionInput.safeParse({ ...base, decision: "aprovado" }).success).toBe(false);
  });
});

describe("Política de revisão candidato → causa comprovada", () => {
  it("só permite decisão sobre anotação pendente ou devolvida", () => {
    expect(canDecideAnnotation("pending", "approved")).toEqual({ ok: true });
    expect(canDecideAnnotation("returned", "approved")).toEqual({ ok: true });
    expect(canDecideAnnotation("approved", "rejected", "reavaliar")).toEqual({ ok: false, error: "somente anotação pendente ou devolvida pode receber decisão" });
  });

  it("rejeição e devolução exigem nota fundamentada", () => {
    expect(canDecideAnnotation("pending", "rejected")).toEqual({ ok: false, error: "rejeição ou devolução exige nota de revisão fundamentada" });
    expect(canDecideAnnotation("pending", "returned", "falta referência de página")).toEqual({ ok: true });
  });

  it("aprovação promove cobertura do caso para reviewed, sem retroceder", () => {
    expect(nextCoverageStatus("metadata_only", "approved")).toBe("reviewed");
    expect(nextCoverageStatus("documents_available", "approved")).toBe("reviewed");
    expect(nextCoverageStatus("reviewed", "approved")).toBe("reviewed");
    expect(nextCoverageStatus("excluded", "approved")).toBe("excluded");
    expect(nextCoverageStatus("metadata_only", "rejected")).toBe("metadata_only");
    expect(nextCoverageStatus("documents_available", "returned")).toBe("documents_available");
  });
});

describe("Agregação de causas comprovadas", () => {
  it("ordena por casos e preserva rótulos de família e pedido", () => {
    const summary = summarizeProvenCauses(
      [
        { familyKey: "transporte", claimType: "dano_moral", caseCount: 12, mentionCount: 15 },
        { familyKey: "credito", claimType: "dano_moral", caseCount: 20, mentionCount: 21 },
        { familyKey: null, claimType: "dano_material", caseCount: 3, mentionCount: 3 },
      ],
      [
        { claimType: "dano_moral", caseCount: 32 },
        { claimType: "obrigacao_fazer", caseCount: 9 },
      ],
      7,
      35,
    );
    expect(summary.causasComprovadas[0].familyLabel).toContain("Crédito");
    expect(summary.causasComprovadas[0].casos).toBe(20);
    expect(summary.causasComprovadas[2].familyLabel).toContain("Outros");
    expect(summary.pedidosComprovados[0].claimLabel).toBe("Dano moral");
    expect(summary.resumo).toEqual({ causasComprovadas: 3, casosComCausaAprovada: 35, filaDeRevisao: 7 });
    expect(summary.notice).toContain("não são mutuamente exclusivas");
  });
});
