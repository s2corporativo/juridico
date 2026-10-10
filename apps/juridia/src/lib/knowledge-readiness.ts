/** Read-only release indicators. A green build does not mean approved legal content. */
export interface KnowledgeMetrics {
  sourcesTotal: number;
  sourcesReviewed: number;
  sourcesCurrent: number;
  sourcesWithBadUrl: number;
  sourcesUnreviewed: number;
  skillsTotal: number;
  skillsHumanApproved: number;
  skillsSystemApproved: number;
  documentsWithoutOrigin: number;
  templatesTotal: number;
  privateArchiveConfigured: boolean;
  privateArchiveEncrypted: boolean;
  goldCaseHumanReviewCount: number;
}
export interface ReadinessReport {
  readyForAutonomousLegalDrafting: false;
  releaseBlocked: true;
  blockers: string[];
  indicators: KnowledgeMetrics;
  manualReviewRequired: true;
}

export function evaluateKnowledgeReadiness(m: KnowledgeMetrics): ReadinessReport {
  const blockers: string[] = [];
  if (m.sourcesTotal === 0) blockers.push("LEGAL_CORPUS_MISSING");
  if (m.sourcesUnreviewed > 0 || m.sourcesReviewed < m.sourcesTotal) blockers.push("SOURCES_REQUIRE_INDIVIDUAL_HUMAN_REVIEW");
  if (m.sourcesCurrent < m.sourcesTotal) blockers.push("SOURCES_CURRENTNESS_NOT_PROVEN");
  if (m.sourcesWithBadUrl > 0) blockers.push("INVALID_LEGAL_SOURCE_URLS");
  if (m.skillsSystemApproved > 0) blockers.push("LEGACY_AUTOMATIC_SKILLS_NOT_HUMAN_REVIEWED");
  if (m.skillsHumanApproved === 0) blockers.push("NO_HUMAN_APPROVED_LEGAL_SKILLS");
  if (m.documentsWithoutOrigin > 0) blockers.push("KNOWLEDGE_DOCUMENT_PROVENANCE_GAPS");
  if (m.templatesTotal === 0) blockers.push("DOCUMENT_TEMPLATES_NOT_INITIALIZED");
  if (!m.privateArchiveConfigured || !m.privateArchiveEncrypted) blockers.push("ENCRYPTED_ORIGINALS_NOT_CONFIGURED");
  if (m.goldCaseHumanReviewCount < 60) blockers.push("LAWYER_GOLD_BENCHMARK_NOT_APPROVED");
  // Non-automatic external gates: lawful DJEN availability, Atlas legacy migration,
  // restore/cutover validation and lawyer sign-off on generated documents.
  blockers.push("EXTERNAL_INTEGRATIONS_AND_PRODUCTION_ROLLBACK_PENDING");
  return {
    readyForAutonomousLegalDrafting: false,
    releaseBlocked: true,
    blockers,
    indicators: m,
    manualReviewRequired: true,
  };
}
