import { describe, expect, test } from "bun:test";
import { CURATION_STARTER_PACK } from "../src/lib/curation-starter-pack";
import { assessSkillMaturity } from "../src/lib/skill-maturation";

describe("curated draft starter pack", () => {
  test("40 distinct skills in multiple legal areas, no direct approval data", () => {
    expect(CURATION_STARTER_PACK).toHaveLength(40);
    expect(new Set(CURATION_STARTER_PACK.map((x) => x.slug)).size).toBe(40);
    expect(new Set(CURATION_STARTER_PACK.map((x) => x.area)).size).toBeGreaterThanOrEqual(10);
    for (const item of CURATION_STARTER_PACK) {
      expect(item.slug.startsWith("nucleo-")).toBe(true);
      expect(item.keywords.length).toBeGreaterThanOrEqual(2);
      expect(item.focus.length).toBeGreaterThan(30);
      expect(Object.hasOwn(item, "approvedBy")).toBe(false);
      expect(Object.hasOwn(item, "approvedAt")).toBe(false);
    }
  });
  test("maturity scanner does not treat missing official sources as an approval", () => {
    const row = CURATION_STARTER_PACK[0];
    const check = assessSkillMaturity({
      id:row.slug, slug:row.slug, version:1, area:row.area,
      description:row.title, content:row.focus,
      triggers:JSON.stringify({keywords:row.keywords}),
      requiredSources:"[]", forbiddenClaims:JSON.stringify(["promessa de resultado"]),
    });
    expect(check.signals).toContain("fontes_ausentes");
    expect(check.level).not.toBe("ready_for_human_validation");
  });
  test("generic imported methodology remains prioritized for human review", () => {
    const row = CURATION_STARTER_PACK[0];
    const c = assessSkillMaturity({
      id: row.slug, slug: row.slug, version: 1, area: row.area,
      description: row.title,
      content: [
        "PROTOCOLO DE ANÁLISE SUPERVISIONADA — NÃO PUBLICADO.",
        row.focus,
        "Investigar provas, hipóteses, jurisprudência atual, exceções e riscos sem presumir conclusão.",
      ].join("\n"),
      triggers: JSON.stringify({ keywords: row.keywords }),
      requiredSources: "[]",
      forbiddenClaims: JSON.stringify(["Promessa de resultado"]),
    });
    expect(c.signals).toContain("roteiro_generico_sem_densidade_juridica");
    expect(c.signals).toContain("fontes_ausentes");
    expect(c.level).toBe("needs_review");
    expect(c.maturity).toBeLessThan(55);
  });

});
