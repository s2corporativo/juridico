import { test, expect } from "bun:test";
import { evaluateKnowledgeReadiness, type KnowledgeMetrics } from "../src/lib/knowledge-readiness";

const staged: KnowledgeMetrics = {
  sourcesTotal: 717,
  sourcesReviewed: 0,
  sourcesCurrent: 0,
  sourcesWithBadUrl: 0,
  sourcesUnreviewed: 717,
  skillsTotal: 2000,
  skillsHumanApproved: 0,
  skillsSystemApproved: 2000,
  documentsWithoutOrigin: 249,
  templatesTotal: 10,
  privateArchiveConfigured: false,
  privateArchiveEncrypted: false,
  goldCaseHumanReviewCount: 0,
};

test("original JuridIA knowledge corpus cannot bypass lawyer review or external release gate", () => {
  const result = evaluateKnowledgeReadiness(staged);
  expect(result.releaseBlocked).toBe(true);
  expect(result.readyForAutonomousLegalDrafting).toBe(false);
  expect(result.blockers).toContain("SOURCES_REQUIRE_INDIVIDUAL_HUMAN_REVIEW");
  expect(result.blockers).toContain("LEGACY_AUTOMATIC_SKILLS_NOT_HUMAN_REVIEWED");
  expect(result.blockers).toContain("LAWYER_GOLD_BENCHMARK_NOT_APPROVED");
});

test("valid filesystem encryption without original archive root is not sufficient", () => {
  const result = evaluateKnowledgeReadiness({
    ...staged,
    sourcesReviewed: 717, sourcesUnreviewed: 0, sourcesCurrent: 717,
    skillsHumanApproved: 2000, skillsSystemApproved: 0,
    documentsWithoutOrigin: 0, privateArchiveEncrypted: true,
    goldCaseHumanReviewCount: 60,
  });
  expect(result.blockers).toContain("ENCRYPTED_ORIGINALS_NOT_CONFIGURED");
  expect(result.releaseBlocked).toBe(true);
});

test("even all automated metrics green cannot override external legal and deployment sign-off", () => {
  const result = evaluateKnowledgeReadiness({
    ...staged, sourcesReviewed: 717, sourcesUnreviewed: 0, sourcesCurrent: 717,
    skillsHumanApproved: 2000, skillsSystemApproved: 0,
    documentsWithoutOrigin: 0, privateArchiveConfigured: true, privateArchiveEncrypted: true,
    goldCaseHumanReviewCount: 60,
  });
  expect(result.blockers).toEqual(["EXTERNAL_INTEGRATIONS_AND_PRODUCTION_ROLLBACK_PENDING"]);
  expect(result.manualReviewRequired).toBe(true);
  expect(result.releaseBlocked).toBe(true);
});
