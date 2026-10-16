import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { inspectApprovedSkill, isEligibleSkillVersion, parseSkillKeywords, selectLatestApprovedSkills, summarizeApprovalAccountLinks } from "../src/lib/skill-governance";

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

describe("single canonical release per legal skill", () => {
  const approved = (slug: string, number: number, approver = "advogado-123") => ({
    ...version(approver), slug, version: number,
  });

  test("a tampered latest approved release blocks the slug instead of downgrading", () => {
    const older = approved("prescricao-intercorrente", 1);
    const tampered = { ...approved("prescricao-intercorrente", 2), contentHash: "tampered" };
    expect(selectLatestApprovedSkills([older, tampered])).toEqual([]);
    expect(selectLatestApprovedSkills([tampered, older])).toEqual([]);
  });

  test("a newer draft does not revoke a valid published release", () => {
    const published = approved("recurso-especial", 3);
    const draft = { ...approved("recurso-especial", 4), status: "draft" };
    expect(selectLatestApprovedSkills([draft, published])).toEqual([published]);
  });

  test("review, auto-approvals and mismatches are not valid releases", () => {
    const auto = approved("consumidor", 1, "migration");
    const valid = approved("tributario", 1);
    const other = approved("ambiental", 1);
    const newer = { ...approved("ambiental", 2), approvedBy: "curador-juridico" };
    const selected = selectLatestApprovedSkills([auto, valid, other, newer]);
    expect(selected.map((skill) => skill.slug)).toEqual(["tributario"]);
  });

  test("the original list remains unchanged and yields one release per slug", () => {
    const a = approved("penal", 2);
    const older = approved("penal", 1);
    const list = [older, a];
    const selected = selectLatestApprovedSkills(list);
    expect(selected).toEqual([a]);
    expect(list).toEqual([older, a]);
  });
});

describe("reviewer account linkage (observational only)", () => {
  test("an approval label without a registered user account stays unverified", () => {
    const result = summarizeApprovalAccountLinks([version("editor-juridico")], []);
    expect(result).toEqual({ linkedToAccount: 0, noAccountLink: 1 });
  });

  test("matches account identifiers and email without revealing reviewer identities", () => {
    const accounts = [{ id: "revisor-legal-1", email: "revisor@example.test" }];
    const skills = [version("revisor-legal-1"), version("REVISOR@example.test"), version("external-label")];
    expect(summarizeApprovalAccountLinks(skills, accounts)).toEqual({
      linkedToAccount: 2,
      noAccountLink: 1,
    });
  });

  test("does not treat a missing approver as an authenticated reviewer", () => {
    const skills = [{ ...version("reviewer"), approvedBy: null }, version("reviewer")];
    expect(summarizeApprovalAccountLinks(skills, [])).toEqual({
      linkedToAccount: 0,
      noAccountLink: 2,
    });
  });
});
