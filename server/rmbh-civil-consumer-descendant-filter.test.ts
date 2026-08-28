import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { buildCivilConsumerDescendantFilter } from "../scripts/prepare-rmbh-civil-consumer-descendant-filter.mjs";

const authorizedTree = {
  scope: "tpu_official_descendants_civil_899_consumer_1156",
  source: { authority: "Conselho Nacional de Justiça", publicTreeUrl: "https://www.cnj.jus.br/sgt/consulta_publica_assuntos.php", version: "26/05/2026" },
  retrievedAt: "2026-08-28T16:00:00.000Z",
  roots: [{ code: 899, label: "DIREITO CIVIL", descendantCount: 1 }, { code: 1156, label: "DIREITO DO CONSUMIDOR", descendantCount: 1 }],
  nodes: [
    { code: 899, rootCode: 899 }, { code: 10431, rootCode: 899 },
    { code: 1156, rootCode: 1156 }, { code: 6220, rootCode: 1156 },
  ],
};

describe("filtro de descendentes Cível/Consumidor", () => {
  it("mantém o filtro materializado em estado pendente de DataJud e sem campos processuais", async () => {
    const filter = JSON.parse(await readFile(resolve(process.cwd(), "data/rmbh-civil-consumer-descendant-filter.json"), "utf8"));
    expect(filter).toMatchObject({
      scope: "rmbh_civil_consumer_descendant_filter_preparation",
      treeSource: { authority: "Conselho Nacional de Justiça", version: "26/05/2026" },
      readiness: { termsCount: 405, maxConservativeTerms: 1024, eligibleForSingleTermsClause: true, datajudValidation: "pending" },
    });
    expect(filter.subjectCodes).toHaveLength(405);
    expect(filter.subjectCodes.every(Number.isInteger)).toBe(true);
    expect(JSON.stringify(filter)).not.toMatch(/numeroProcesso|partes|cpf|respostaBruta|hmac/i);
  });

  it("prepara uma única cláusula de termos com códigos oficiais e sem executar DataJud", () => {
    expect(buildCivilConsumerDescendantFilter(authorizedTree)).toMatchObject({
      subjectCodes: [899, 1156, 6220, 10431],
      readiness: { termsCount: 4, maxConservativeTerms: 1024, eligibleForSingleTermsClause: true, datajudValidation: "pending" },
    });
  });

  it("rejeita códigos associados a raiz não autorizada", () => {
    expect(() => buildCivilConsumerDescendantFilter({ ...authorizedTree, nodes: [...authorizedTree.nodes, { code: 1, rootCode: 1 }] })).toThrow("não autorizado");
  });

  it("não materializa dados processuais, identificadores individuais ou respostas brutas", () => {
    const serialized = JSON.stringify(buildCivilConsumerDescendantFilter(authorizedTree));
    expect(serialized).not.toMatch(/numeroProcesso|partes|cpf|respostaBruta|authorization/i);
  });
});
