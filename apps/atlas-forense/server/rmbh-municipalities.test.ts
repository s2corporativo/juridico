import { describe, expect, it } from "vitest";

const modulePath = "../scripts/refresh-rmbh-municipalities.mjs";

describe("recorte legal da RMBH", () => {
  it("mantém 34 municípios com códigos IBGE, incluindo as comarcas prioritárias", async () => {
    const { RMBH_LEGAL_MUNICIPALITIES, buildRmbhDataset } = await import(modulePath);
    const apiRows = RMBH_LEGAL_MUNICIPALITIES.map((nome: string, index: number) => ({
      nome,
      id: 3_100_000 + index,
    }));

    const dataset = buildRmbhDataset(apiRows, "2026-08-28T00:00:00.000Z");

    expect(dataset.municipalities).toHaveLength(34);
    expect(dataset.municipalities.find((item: { name: string }) => item.name === "Belo Horizonte")?.ibgeCode).toBeTypeOf("number");
    expect(dataset.municipalities.find((item: { name: string }) => item.name === "Betim")?.ibgeCode).toBeTypeOf("number");
    expect(dataset.municipalities.find((item: { name: string }) => item.name === "Contagem")?.ibgeCode).toBeTypeOf("number");
    expect(dataset.municipalities.find((item: { name: string }) => item.name === "Igarapé")?.ibgeCode).toBeTypeOf("number");
  });

  it("rejeita uma composição legal sem código IBGE confirmado", async () => {
    const { RMBH_LEGAL_MUNICIPALITIES, buildRmbhDataset } = await import(modulePath);
    const incompleteApiRows = RMBH_LEGAL_MUNICIPALITIES.slice(1).map((nome: string, index: number) => ({
      nome,
      id: 3_100_000 + index,
    }));

    expect(() => buildRmbhDataset(incompleteApiRows)).toThrow("Lista RMBH incompleta: Baldim");
  });
});
