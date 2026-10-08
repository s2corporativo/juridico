import { describe, expect, test } from "bun:test";
import { buildOfficeSkillCatalog } from "@/lib/office_skill_catalog";

describe("office skill catalog", () => {
  test("tem exatamente 2000 skills únicas", () => {
    const skills = buildOfficeSkillCatalog();
    expect(skills).toHaveLength(2000);
    expect(new Set(skills.map((s) => s.slug)).size).toBe(2000);
  });

  test("todas exigem fontes e proíbem invenção/promessa", () => {
    for (const skill of buildOfficeSkillCatalog()) {
      expect(skill.requiredSources.length).toBeGreaterThan(0);
      expect(skill.allowedTools).toContain("legal_search");
      expect(skill.forbiddenClaims).toContain("promessa de resultado");
      expect(skill.content).toContain("Citation Gate");
    }
  });
});
