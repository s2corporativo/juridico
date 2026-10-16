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
});
