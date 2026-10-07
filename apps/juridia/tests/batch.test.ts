import { describe, expect, test } from "bun:test";
import { MAX_BATCH_CASES, parseBatchCases } from "@/lib/batch";
import type { TemplateDTO } from "@/lib/types";

const template = {
  slug: "teste",
  name: "Teste",
  category: "civil",
  description: "",
  icon: "FileText",
  fields: [
    { key: "autor", label: "Autor", type: "text", required: true },
    { key: "fatos", label: "Fatos", type: "textarea", required: true },
  ],
} as TemplateDTO;

describe("batch parser", () => {
  test("separa casos e mapeia rótulos/chaves", () => {
    const result = parseBatchCases(
      "titulo: Caso A\nAutor: João\nFatos: Um fato\n---\ntitle: Caso B\nautor: Maria\nFatos: Outro fato",
      template,
    );
    expect(result.cases).toHaveLength(2);
    expect(result.cases[0].fields.autor).toBe("João");
    expect(result.cases[1].title).toBe("Caso B");
    expect(result.errors).toHaveLength(0);
  });

  test("registra campo desconhecido sem perder o caso", () => {
    const result = parseBatchCases("Autor: João\nCampo inexistente: x", template);
    expect(result.cases).toHaveLength(1);
    expect(result.errors).toHaveLength(1);
  });

  test("limite operacional suporta lote profissional", () => {
    expect(MAX_BATCH_CASES).toBe(50);
  });
});
