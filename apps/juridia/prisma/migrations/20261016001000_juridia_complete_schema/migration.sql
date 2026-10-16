-- CreateTable
CREATE TABLE "CaseFile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseId" TEXT NOT NULL DEFAULT 'default-case',
    "userId" TEXT,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sha256" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "pageCount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'uploaded',
    "extractedText" TEXT NOT NULL DEFAULT '',
    "error" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CaseFilePage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fileId" TEXT NOT NULL,
    "pageNo" INTEGER NOT NULL,
    "text" TEXT NOT NULL DEFAULT '',
    "sha256" TEXT NOT NULL,
    "evidence" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CaseFilePage_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "CaseFile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DocumentVersion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentId" TEXT NOT NULL,
    "userId" TEXT,
    "version" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'human',
    "changeNote" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "DocumentComment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentId" TEXT NOT NULL,
    "userId" TEXT,
    "anchor" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DocumentSuggestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentId" TEXT NOT NULL,
    "userId" TEXT,
    "operation" TEXT NOT NULL,
    "anchor" TEXT NOT NULL,
    "replacement" TEXT NOT NULL,
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decidedAt" DATETIME
);

-- CreateTable
CREATE TABLE "StyleProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "examples" TEXT NOT NULL DEFAULT '[]',
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DocumentSkillUsage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentId" TEXT NOT NULL,
    "skillSlug" TEXT NOT NULL,
    "skillVersion" INTEGER NOT NULL,
    "contentHash" TEXT NOT NULL,
    "contentSnapshot" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "BatchJob" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "templateSlug" TEXT NOT NULL,
    "moldDocumentId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "total" INTEGER NOT NULL DEFAULT 0,
    "completed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BatchItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "batchId" TEXT NOT NULL,
    "itemNo" INTEGER NOT NULL,
    "title" TEXT,
    "fields" TEXT NOT NULL DEFAULT '{}',
    "status" TEXT NOT NULL DEFAULT 'queued',
    "documentId" TEXT,
    "error" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BatchItem_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "BatchJob" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "CaseFile_caseId_idx" ON "CaseFile"("caseId");

-- CreateIndex
CREATE INDEX "CaseFile_userId_idx" ON "CaseFile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CaseFile_userId_sha256_key" ON "CaseFile"("userId", "sha256");

-- CreateIndex
CREATE INDEX "CaseFilePage_fileId_idx" ON "CaseFilePage"("fileId");

-- CreateIndex
CREATE UNIQUE INDEX "CaseFilePage_fileId_pageNo_key" ON "CaseFilePage"("fileId", "pageNo");

-- CreateIndex
CREATE INDEX "DocumentVersion_documentId_createdAt_idx" ON "DocumentVersion"("documentId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentVersion_documentId_version_key" ON "DocumentVersion"("documentId", "version");

-- CreateIndex
CREATE INDEX "DocumentComment_documentId_status_idx" ON "DocumentComment"("documentId", "status");

-- CreateIndex
CREATE INDEX "DocumentSuggestion_documentId_status_idx" ON "DocumentSuggestion"("documentId", "status");

-- CreateIndex
CREATE INDEX "StyleProfile_userId_approved_idx" ON "StyleProfile"("userId", "approved");

-- CreateIndex
CREATE INDEX "DocumentSkillUsage_documentId_idx" ON "DocumentSkillUsage"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentSkillUsage_documentId_skillSlug_skillVersion_key" ON "DocumentSkillUsage"("documentId", "skillSlug", "skillVersion");

-- CreateIndex
CREATE INDEX "BatchJob_userId_status_idx" ON "BatchJob"("userId", "status");

-- CreateIndex
CREATE INDEX "BatchItem_batchId_status_idx" ON "BatchItem"("batchId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "BatchItem_batchId_itemNo_key" ON "BatchItem"("batchId", "itemNo");

