import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { inspectApprovedSkill, isEligibleSkillVersion, parseSkillKeywords } from "../src/lib/skill-governance";

const content = "Orientação processual válida como instrução auxiliar, não como fonte.";
const version = (approvedBy: string) => ({
  slug: "cpc-peticao", version: 3, status: "approved", content,
  contentHash: createHash("sha256").update(content).digest("hex"),
  approvedBy, approvedAt: new Date(),
});
describe("Skill admission and provenance", () => {
  test("only approved hash-consistent content with individual approver is executable", () => {
    expect(isEligibleSkillVersion(version("usuario-revisor-real"))).toBe(true);
    expect(isEligibleSkillVersion({ ...version("usuario-revisor-real"), status: "draft" })).toBe(false);
    expect(inspectApprovedSkill({ ...version("usuario-revisor-real"), contentHash: "invalid" })).toContain("hash_mismatch");
    expect(isEligibleSkillVersion({ ...version("usuario-revisor-real"), approvedAt: null })).toBe(false);
  });
  test("automatic approvals inherited from fake/demo seeds do not become authority", () => {
    for (const name of ["migration", "curador-juridico", "importacao-lexvalida", "seed"]) {
      expect(inspectApprovedSkill(version(name))).toContain("automated_or_unverified_approval");
    }
  });
  test("router rejects malformed triggers and caps keyword lists", () => {
    expect(parseSkillKeywords("not-json")).toEqual([]);
    expect(parseSkillKeywords('{"keywords":"fraude"}')).toEqual([]);
    expect(parseSkillKeywords('{"keywords":["fraude",10,"x","documento"]}')).toEqual(["fraude","documento"]);
    expect(parseSkillKeywords(JSON.stringify({keywords:Array(100).fill("consumidor")}))).toHaveLength(64);
  });
});
