import { describe, expect, test } from "bun:test";
import { buildDeterministicMoldeFallback } from "@/lib/molde";

describe("Modo Molde — fallback determinístico", () => {
  const base = [
    "EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO",
    "",
    "DOS FATOS",
    "Houve descarte de resíduos no solo.",
    "",
    "DOS PEDIDOS",
    "Requer a reparação integral do dano.",
  ].join("\n");

  test("usa âncora que existe literalmente no documento", () => {
    const change = buildDeterministicMoldeFallback(
      base,
      "Acrescente referência à necessidade de tutela de urgência.",
    );
    expect(base.includes(change.anchor)).toBe(true);
    expect(change.operation).toBe("add");
  });

  test("não inventa fundamento jurídico específico", () => {
    const change = buildDeterministicMoldeFallback(
      base,
      "Acrescente tutela de urgência.",
    );
    expect(change.replacement).not.toMatch(/art\.?\s*300|CPC|STJ|STF/i);
    expect(change.replacement).toContain("Pendente de revisão humana");
  });
});
