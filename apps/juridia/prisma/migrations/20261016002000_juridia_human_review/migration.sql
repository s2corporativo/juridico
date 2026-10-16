-- AlterTable
ALTER TABLE "SkillVersion" ADD COLUMN "authorUserId" TEXT;
ALTER TABLE "SkillVersion" ADD COLUMN "manifestHash" TEXT;
ALTER TABLE "SkillVersion" ADD COLUMN "reviewerUserId" TEXT;

-- CreateTable
CREATE TABLE "SkillReviewEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "skillVersionId" TEXT NOT NULL,
    "reviewerUserId" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "manifestHash" TEXT,
    "reason" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "SkillReviewEvent_skillVersionId_createdAt_idx" ON "SkillReviewEvent"("skillVersionId", "createdAt");

-- CreateIndex
CREATE INDEX "SkillReviewEvent_reviewerUserId_createdAt_idx" ON "SkillReviewEvent"("reviewerUserId", "createdAt");


-- Approved and retired releases preserve their exact historical legal manifest.
CREATE TRIGGER "JuridIAApprovedSkillImmutable"
BEFORE UPDATE ON "SkillVersion"
WHEN OLD."status" IN ('approved','retired') AND (
  (OLD."status" = 'approved' AND NEW."status" NOT IN ('approved','retired')) OR
  (OLD."status" = 'retired' AND NEW."status" != 'retired') OR
  NEW."slug" IS NOT OLD."slug" OR
  NEW."version" IS NOT OLD."version" OR
  NEW."area" IS NOT OLD."area" OR
  NEW."description" IS NOT OLD."description" OR
  NEW."content" IS NOT OLD."content" OR
  NEW."triggers" IS NOT OLD."triggers" OR
  NEW."requiredSources" IS NOT OLD."requiredSources" OR
  NEW."requiredEvidence" IS NOT OLD."requiredEvidence" OR
  NEW."rules" IS NOT OLD."rules" OR
  NEW."exceptions" IS NOT OLD."exceptions" OR
  NEW."forbiddenClaims" IS NOT OLD."forbiddenClaims" OR
  NEW."allowedTools" IS NOT OLD."allowedTools" OR
  NEW."outputSchema" IS NOT OLD."outputSchema" OR
  NEW."contentHash" IS NOT OLD."contentHash" OR
  NEW."manifestHash" IS NOT OLD."manifestHash" OR
  NEW."authorUserId" IS NOT OLD."authorUserId" OR
  NEW."reviewerUserId" IS NOT OLD."reviewerUserId" OR
  NEW."approvedBy" IS NOT OLD."approvedBy" OR
  NEW."approvedAt" IS NOT OLD."approvedAt"
) BEGIN SELECT RAISE(ABORT, 'approved_skill_immutable'); END;

CREATE TRIGGER "JuridIAApprovedSkillNoDelete"
BEFORE DELETE ON "SkillVersion"
WHEN OLD."status" IN ('approved','retired')
BEGIN SELECT RAISE(ABORT, 'approved_skill_cannot_delete'); END;

CREATE TRIGGER "JuridIAReviewEventImmutable"
BEFORE UPDATE ON "SkillReviewEvent"
BEGIN SELECT RAISE(ABORT, 'review_event_immutable'); END;

CREATE TRIGGER "JuridIAReviewEventNoDelete"
BEFORE DELETE ON "SkillReviewEvent"
BEGIN SELECT RAISE(ABORT, 'review_event_cannot_delete'); END;
