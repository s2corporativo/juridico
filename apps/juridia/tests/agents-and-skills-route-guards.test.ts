import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
const read = (file: string) => readFileSync(new URL(file, import.meta.url), "utf8");
describe("Agent and skills integration guards", () => {
  test("planning requires authorization, case ownership and refuses execute requests", () => {
    const route = read("../src/app/api/agents/route.ts");
    expect(route).toContain("await requireAuth(req)");
    expect(route).toContain("ownsCase(auth.user.uid, caseId)");
    expect(route).toContain("values.execute === true");
  });
  test("manual legal skills no longer bypass version approval", () => {
    const pipeline = read("../src/lib/minuta_run.ts");
    expect(pipeline).toContain("isEligibleSkillVersion(version)");
    expect(pipeline).toContain("ownsCase(authUser.uid, body.caseId)");
    expect(pipeline).not.toContain("db.skill.findMany({ where: { slug:");
  });
  test("normal catalog only exposes reviewed versions and admin audit remains scoped", () => {
    const route = read("../src/app/api/skills/route.ts");
    expect(route).toContain("isEligibleSkillVersion(skill)");
    expect(route).toContain('auth.user.role !== "admin"');
    expect(route).toContain("inspectApprovedSkill(skill)");
  });
});
