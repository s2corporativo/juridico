-- Atlas Jurídico · migração manual idempotente de AgentRun.caseId
-- Motivo: remover legado NOT NULL DEFAULT 'default-case' e alinhar ao schema Prisma (String?).
-- Pré-condição operacional: snapshot do SQLite antes da execução.

PRAGMA foreign_keys=OFF;
BEGIN IMMEDIATE;

CREATE TABLE "AgentRun_new" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "caseId" TEXT,
  "userId" TEXT,
  "agentSlug" TEXT NOT NULL,
  "taskType" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'queued',
  "inputHash" TEXT NOT NULL,
  "idempotencyKey" TEXT,
  "providerSnapshot" TEXT NOT NULL DEFAULT '{}',
  "contractVersion" TEXT,
  "promptVersion" TEXT,
  "budgetBrl" REAL NOT NULL DEFAULT 5.0,
  "costBrl" REAL NOT NULL DEFAULT 0,
  "tokensIn" INTEGER NOT NULL DEFAULT 0,
  "tokensOut" INTEGER NOT NULL DEFAULT 0,
  "tokensBudget" INTEGER NOT NULL DEFAULT 20000,
  "resultSnapshotId" TEXT,
  "errorCode" TEXT,
  "hitlReason" TEXT,
  "hitlData" TEXT NOT NULL DEFAULT '{}',
  "startedAt" DATETIME,
  "finishedAt" DATETIME,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO "AgentRun_new" (
  "id","caseId","userId","agentSlug","taskType","status","inputHash","idempotencyKey",
  "providerSnapshot","contractVersion","promptVersion","budgetBrl","costBrl","tokensIn",
  "tokensOut","tokensBudget","resultSnapshotId","errorCode","hitlReason","hitlData",
  "startedAt","finishedAt","createdAt"
)
SELECT
  "id",NULLIF("caseId",'default-case'),"userId","agentSlug","taskType","status","inputHash","idempotencyKey",
  "providerSnapshot","contractVersion","promptVersion","budgetBrl","costBrl","tokensIn",
  "tokensOut","tokensBudget","resultSnapshotId","errorCode","hitlReason","hitlData",
  "startedAt","finishedAt","createdAt"
FROM "AgentRun";

DROP TABLE "AgentRun";
ALTER TABLE "AgentRun_new" RENAME TO "AgentRun";

CREATE INDEX "AgentRun_caseId_idx" ON "AgentRun"("caseId");
CREATE INDEX "AgentRun_status_idx" ON "AgentRun"("status");
CREATE UNIQUE INDEX "AgentRun_caseId_agentSlug_inputHash_contractVersion_key"
  ON "AgentRun"("caseId","agentSlug","inputHash","contractVersion");

COMMIT;
PRAGMA foreign_keys=ON;
