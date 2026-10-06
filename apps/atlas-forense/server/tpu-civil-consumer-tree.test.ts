import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  buildTpuCivilConsumerDataset,
  extractTpuSourceVersion,
  parseTpuPublicTreeChildren,
  readTpuPublicHtml,
} from "../scripts/refresh-tpu-civil-consumer-tree.mjs";

const publicChildrenResponse = `+:var res = '<table id=\\'arvorePublicaId10431\\' summary=\\'arvorePublicaFilhoDo899\\'><img id=\\'arvorePublicaMaisMenosDo10431\\' src=\\'imagens/mais.gif\\'><td id=\\'arvorePublicaDescricao10431\\'>Responsabilidade Civil</td></table><table id=\\'arvorePublicaId6220\\' summary=\\'arvorePublicaFilhoDo899\\'><img id=\\'arvorePublicaMaisMenosDo6220\\' src=\\'imagens/folha.gif\\'><td id=\\'arvorePublicaDescricao6220\\'>Responsabilidade do Fornecedor</td></table>';`;

describe("árvore TPU Cível/Consumidor", () => {
  it("mantém o artefato oficial com ancestrais íntegros e somente as duas raízes autorizadas", async () => {
    const dataset = JSON.parse(await readFile(resolve(process.cwd(), "data/tpu-civil-consumer-tree.json"), "utf8"));
    const codes = new Set<number>();
    for (const node of dataset.nodes) {
      expect([899, 1156]).toContain(node.rootCode);
      expect(node.label).not.toContain("�");
      if (node.parentCode !== null) expect(codes.has(node.parentCode)).toBe(true);
      codes.add(node.code);
    }
    expect(dataset.source).toMatchObject({ authority: "Conselho Nacional de Justiça", version: "26/05/2026" });
    expect(dataset.validation).toMatchObject({ nodeCount: 405, descendantCount: 403, containsOnlyAuthorizedRoots: true });
    expect(dataset.roots).toEqual([
      expect.objectContaining({ code: 899, descendantCount: 338 }),
      expect.objectContaining({ code: 1156, descendantCount: 65 }),
    ]);
  });

  it("decodifica o HTML público no charset ISO-8859-1 informado pelo CNJ", async () => {
    const response = new Response(new Uint8Array([70, 97, 109, 237, 108, 105, 97]));
    expect(await readTpuPublicHtml(response)).toBe("Família");
  });

  it("preserva a versão da TPU mesmo quando a página pública usa codificação legada", () => {
    expect(extractTpuSourceVersion("Consulta p\u00fablica — Vers\u00ef\u00bf\u00bdo 26/05/2026")).toBe("26/05/2026");
  });

  it("extrai somente código, rótulo e ancestralidade da expansão pública", () => {
    expect(parseTpuPublicTreeChildren(publicChildrenResponse, 899)).toEqual([
      { code: 10431, parentCode: 899, label: "Responsabilidade Civil", expandable: true },
      { code: 6220, parentCode: 899, label: "Responsabilidade do Fornecedor", expandable: false },
    ]);
  });

  it("rejeita uma resposta que declare ancestralidade distinta do nó solicitado", () => {
    expect(() => parseTpuPublicTreeChildren(publicChildrenResponse, 1156)).toThrow("Estrutura pública de assuntos inconsistente");
  });

  it("produz dataset versionado limitado às raízes autorizadas", () => {
    const dataset = buildTpuCivilConsumerDataset([
      { code: 899, label: "DIREITO CIVIL", parentCode: null, rootCode: 899, depth: 0 },
      { code: 10431, label: "Responsabilidade Civil", parentCode: 899, rootCode: 899, depth: 1, expandable: true },
      { code: 1156, label: "DIREITO DO CONSUMIDOR", parentCode: null, rootCode: 1156, depth: 0 },
      { code: 6220, label: "Responsabilidade do Fornecedor", parentCode: 1156, rootCode: 1156, depth: 1, expandable: false },
    ], { retrievedAt: "2026-08-28T15:00:00.000Z", sourceVersion: "26/05/2026" });
    expect(dataset).toMatchObject({
      schemaVersion: 1,
      scope: "tpu_official_descendants_civil_899_consumer_1156",
      roots: [{ code: 899, descendantCount: 1 }, { code: 1156, descendantCount: 1 }],
      validation: { nodeCount: 4, descendantCount: 2, containsOnlyAuthorizedRoots: true },
    });
    expect(JSON.stringify(dataset)).not.toMatch(/numeroProcesso|partes|cpf|respostaBruta|authorization/i);
  });
});
