-- CreateTable
CREATE TABLE "AgentRun" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseId" TEXT NOT NULL DEFAULT 'default-case',
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

-- CreateTable
CREATE TABLE "AgentRunStep" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "runId" TEXT NOT NULL,
    "stepNo" INTEGER NOT NULL,
    "kind" TEXT NOT NULL,
    "toolName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "inputHash" TEXT,
    "outputHash" TEXT,
    "output" TEXT NOT NULL DEFAULT '{}',
    "provider" TEXT,
    "model" TEXT,
    "tokensIn" INTEGER NOT NULL DEFAULT 0,
    "tokensOut" INTEGER NOT NULL DEFAULT 0,
    "costBrl" REAL NOT NULL DEFAULT 0,
    "durationMs" INTEGER,
    "requiresHuman" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("runId") REFERENCES "AgentRun" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT,
    "metadata" TEXT NOT NULL,
    "ip" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "BrainAnalysis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseId" TEXT NOT NULL DEFAULT 'default-case',
    "title" TEXT NOT NULL,
    "factsInput" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "ramoJuridico" TEXT,
    "hypothesis" TEXT,
    "tokensUsed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Case" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "number" TEXT,
    "area" TEXT NOT NULL DEFAULT 'civil',
    "responsavel" TEXT,
    "prioridade" TEXT NOT NULL DEFAULT 'media',
    "valor" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ativo',
    "dataDistribuicao" DATETIME,
    "dataEncerramento" DATETIME,
    "resultado" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "processosVinculados" TEXT NOT NULL DEFAULT '[]',
    FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CaseAnalysis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "title" TEXT NOT NULL,
    "factsInput" TEXT NOT NULL,
    "parties" TEXT NOT NULL,
    "timeline" TEXT NOT NULL,
    "requests" TEXT NOT NULL,
    "proofs" TEXT NOT NULL,
    "decisions" TEXT NOT NULL,
    "values" TEXT NOT NULL,
    "risks" TEXT NOT NULL,
    "nextSteps" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "CaseDeadline" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseId" TEXT NOT NULL DEFAULT 'default-case',
    "tipo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "marcoInicial" DATETIME NOT NULL,
    "prazoDias" INTEGER NOT NULL,
    "tipoContagem" TEXT NOT NULL DEFAULT 'uteis',
    "vencimento" DATETIME NOT NULL,
    "observacoes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "CaseHearing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseId" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "tipo" TEXT NOT NULL,
    "local" TEXT,
    "orgao" TEXT,
    "status" TEXT NOT NULL DEFAULT 'agendada',
    "resultado" TEXT,
    "observacoes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("caseId") REFERENCES "Case" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CaseMovement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseId" TEXT NOT NULL,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "numeroProc" TEXT,
    "criadoPor" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("caseId") REFERENCES "Case" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "document" TEXT,
    "notes" TEXT,
    "color" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "templateSlug" TEXT NOT NULL,
    "templateName" TEXT NOT NULL,
    "rawFacts" TEXT NOT NULL,
    "anonymizedFacts" TEXT NOT NULL,
    "markers" TEXT NOT NULL,
    "generatedContent" TEXT NOT NULL,
    "skillSlugs" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "batchId" TEXT,
    "caseId" TEXT,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    FOREIGN KEY ("caseId") REFERENCES "Case" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EvidenceRef" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseId" TEXT NOT NULL DEFAULT 'default-case',
    "documentId" TEXT,
    "pageNumber" INTEGER,
    "sectionLabel" TEXT,
    "charStart" INTEGER,
    "charEnd" INTEGER,
    "quote" TEXT NOT NULL,
    "quoteHash" TEXT NOT NULL,
    "documentHash" TEXT,
    "sourceKind" TEXT NOT NULL,
    "retrievalMethod" TEXT NOT NULL,
    "metadata" TEXT NOT NULL DEFAULT '{}',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedBy" TEXT,
    "verifiedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "GraphEdge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseId" TEXT NOT NULL DEFAULT 'default-case',
    "fromNodeId" TEXT NOT NULL,
    "toNodeId" TEXT NOT NULL,
    "edgeType" TEXT NOT NULL,
    "polarity" TEXT NOT NULL DEFAULT 'neutral',
    "weight" REAL,
    "status" TEXT NOT NULL DEFAULT 'candidate',
    "sourceEvidenceId" TEXT,
    "createdByRunId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "GraphNode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseId" TEXT NOT NULL DEFAULT 'default-case',
    "nodeType" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "payload" TEXT NOT NULL DEFAULT '{}',
    "confidence" REAL,
    "status" TEXT NOT NULL DEFAULT 'candidate',
    "sourceEvidenceId" TEXT,
    "createdByRunId" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "IntelligenceSnapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseId" TEXT NOT NULL DEFAULT 'default-case',
    "version" INTEGER NOT NULL DEFAULT 1,
    "payload" TEXT NOT NULL,
    "isDraft" BOOLEAN NOT NULL DEFAULT true,
    "approvedBy" TEXT,
    "approvedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "JudgeSimulation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseId" TEXT NOT NULL DEFAULT 'default-case',
    "documentId" TEXT,
    "competência" TEXT,
    "legitimidade" TEXT,
    "interesse" TEXT,
    "condicaoAcao" TEXT,
    "valorCausa" TEXT,
    "prescricao" TEXT,
    "preliminares" TEXT,
    "meritoProb" TEXT,
    "risksIdentified" TEXT NOT NULL DEFAULT '[]',
    "recommendation" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "JurisprudenceSearch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "query" TEXT NOT NULL,
    "mode" TEXT NOT NULL DEFAULT 'ai',
    "results" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "LegalAssertion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseId" TEXT NOT NULL DEFAULT 'default-case',
    "text" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "supportStatus" TEXT NOT NULL DEFAULT 'absent',
    "reviewStatus" TEXT NOT NULL DEFAULT 'pending',
    "createdByAi" BOOLEAN NOT NULL DEFAULT false,
    "createdByRunId" TEXT,
    "evidenceIds" TEXT NOT NULL DEFAULT '[]',
    "reviewedBy" TEXT,
    "reviewedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "LegalSource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tipo" TEXT NOT NULL,
    "diploma" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "tribunal" TEXT,
    "textoTrecho" TEXT NOT NULL,
    "vigente" BOOLEAN NOT NULL DEFAULT true,
    "urlOficial" TEXT,
    "hashConteudo" TEXT,
    "dataConsulta" DATETIME,
    "revisadoPor" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MoldeChange" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentId" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "anchor" TEXT NOT NULL,
    "replacement" TEXT,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "appliedAt" DATETIME
);

-- CreateTable
CREATE TABLE "NewsItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "NormVersion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "diploma" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "versionLabel" TEXT NOT NULL,
    "textoTrecho" TEXT NOT NULL,
    "vigenteDesde" DATETIME,
    "vigenteAte" DATETIME,
    "revogadaPor" TEXT,
    "urlOficial" TEXT,
    "verificadoPor" TEXT,
    "verificadoEm" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "OidcAuthCode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "sub" TEXT NOT NULL,
    "redirectUri" TEXT NOT NULL,
    "scope" TEXT NOT NULL DEFAULT 'openid profile email role persona',
    "nonce" TEXT,
    "codeChallenge" TEXT,
    "codeChallengeMethod" TEXT,
    "expiresAt" DATETIME NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "OidcKey" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kid" TEXT NOT NULL,
    "publicKeyPem" TEXT NOT NULL,
    "privateKeyPem" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PrecedentStatus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "legalSourceId" TEXT,
    "sourceLabel" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'vigente',
    "supersededBy" TEXT,
    "supersededAt" DATETIME,
    "supersededReason" TEXT,
    "modulacao" TEXT,
    "verificadoPor" TEXT,
    "verificadoEm" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ProofMatrix" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseId" TEXT NOT NULL DEFAULT 'default-case',
    "factId" TEXT,
    "factText" TEXT NOT NULL,
    "hasProof" BOOLEAN NOT NULL DEFAULT false,
    "proofType" TEXT,
    "proofDescription" TEXT,
    "burdenOfProof" TEXT NOT NULL,
    "burdenReason" TEXT,
    "riskLevel" TEXT NOT NULL DEFAULT 'medio',
    "riskDescription" TEXT,
    "evidenceRefId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SkillVersion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "area" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "triggers" TEXT NOT NULL DEFAULT '{}',
    "requiredSources" TEXT NOT NULL DEFAULT '[]',
    "requiredEvidence" TEXT NOT NULL DEFAULT '[]',
    "rules" TEXT NOT NULL DEFAULT '[]',
    "exceptions" TEXT NOT NULL DEFAULT '[]',
    "forbiddenClaims" TEXT NOT NULL DEFAULT '[]',
    "allowedTools" TEXT NOT NULL DEFAULT '[]',
    "outputSchema" TEXT NOT NULL DEFAULT '{}',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "contentHash" TEXT NOT NULL,
    "approvedBy" TEXT,
    "approvedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "fields" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'FileText',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "UsageLedger" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "type" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "balance" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "metadata" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "oabNumero" TEXT,
    "oabEstado" TEXT,
    "plan" TEXT NOT NULL DEFAULT 'free',
    "minutasUsed" INTEGER NOT NULL DEFAULT 0,
    "minutasLimit" INTEGER NOT NULL DEFAULT 3,
    "passwordHash" TEXT,
    "role" TEXT NOT NULL DEFAULT 'advogado',
    "lastSignedIn" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AgentRun_caseId_agentSlug_inputHash_contractVersion_key" ON "AgentRun"("caseId" ASC, "agentSlug" ASC, "inputHash" ASC, "contractVersion" ASC);

-- CreateIndex
CREATE INDEX "AgentRun_status_idx" ON "AgentRun"("status" ASC);

-- CreateIndex
CREATE INDEX "AgentRun_caseId_idx" ON "AgentRun"("caseId" ASC);

-- CreateIndex
CREATE INDEX "AgentRunStep_status_idx" ON "AgentRunStep"("status" ASC);

-- CreateIndex
CREATE INDEX "AgentRunStep_runId_idx" ON "AgentRunStep"("runId" ASC);

-- CreateIndex
CREATE INDEX "AuditEvent_createdAt_idx" ON "AuditEvent"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "AuditEvent_action_idx" ON "AuditEvent"("action" ASC);

-- CreateIndex
CREATE INDEX "AuditEvent_userId_idx" ON "AuditEvent"("userId" ASC);

-- CreateIndex
CREATE INDEX "BrainAnalysis_createdAt_idx" ON "BrainAnalysis"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "BrainAnalysis_caseId_idx" ON "BrainAnalysis"("caseId" ASC);

-- CreateIndex
CREATE INDEX "Case_prioridade_idx" ON "Case"("prioridade" ASC);

-- CreateIndex
CREATE INDEX "Case_area_idx" ON "Case"("area" ASC);

-- CreateIndex
CREATE INDEX "Case_status_idx" ON "Case"("status" ASC);

-- CreateIndex
CREATE INDEX "Case_clientId_idx" ON "Case"("clientId" ASC);

-- CreateIndex
CREATE INDEX "CaseDeadline_vencimento_idx" ON "CaseDeadline"("vencimento" ASC);

-- CreateIndex
CREATE INDEX "CaseDeadline_caseId_idx" ON "CaseDeadline"("caseId" ASC);

-- CreateIndex
CREATE INDEX "CaseHearing_data_idx" ON "CaseHearing"("data" ASC);

-- CreateIndex
CREATE INDEX "CaseHearing_caseId_idx" ON "CaseHearing"("caseId" ASC);

-- CreateIndex
CREATE INDEX "CaseMovement_data_idx" ON "CaseMovement"("data" ASC);

-- CreateIndex
CREATE INDEX "CaseMovement_caseId_idx" ON "CaseMovement"("caseId" ASC);

-- CreateIndex
CREATE INDEX "Document_caseId_idx" ON "Document"("caseId" ASC);

-- CreateIndex
CREATE INDEX "Document_batchId_idx" ON "Document"("batchId" ASC);

-- CreateIndex
CREATE INDEX "Document_userId_idx" ON "Document"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "EvidenceRef_caseId_documentId_pageNumber_quoteHash_key" ON "EvidenceRef"("caseId" ASC, "documentId" ASC, "pageNumber" ASC, "quoteHash" ASC);

-- CreateIndex
CREATE INDEX "EvidenceRef_quoteHash_idx" ON "EvidenceRef"("quoteHash" ASC);

-- CreateIndex
CREATE INDEX "EvidenceRef_caseId_idx" ON "EvidenceRef"("caseId" ASC);

-- CreateIndex
CREATE INDEX "GraphEdge_toNodeId_idx" ON "GraphEdge"("toNodeId" ASC);

-- CreateIndex
CREATE INDEX "GraphEdge_fromNodeId_idx" ON "GraphEdge"("fromNodeId" ASC);

-- CreateIndex
CREATE INDEX "GraphEdge_caseId_idx" ON "GraphEdge"("caseId" ASC);

-- CreateIndex
CREATE INDEX "GraphNode_status_idx" ON "GraphNode"("status" ASC);

-- CreateIndex
CREATE INDEX "GraphNode_caseId_idx" ON "GraphNode"("caseId" ASC);

-- CreateIndex
CREATE INDEX "IntelligenceSnapshot_caseId_idx" ON "IntelligenceSnapshot"("caseId" ASC);

-- CreateIndex
CREATE INDEX "JudgeSimulation_caseId_idx" ON "JudgeSimulation"("caseId" ASC);

-- CreateIndex
CREATE INDEX "LegalAssertion_reviewStatus_idx" ON "LegalAssertion"("reviewStatus" ASC);

-- CreateIndex
CREATE INDEX "LegalAssertion_caseId_idx" ON "LegalAssertion"("caseId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "LegalSource_tipo_diploma_numero_tribunal_key" ON "LegalSource"("tipo" ASC, "diploma" ASC, "numero" ASC, "tribunal" ASC);

-- CreateIndex
CREATE INDEX "LegalSource_tipo_vigente_idx" ON "LegalSource"("tipo" ASC, "vigente" ASC);

-- CreateIndex
CREATE INDEX "LegalSource_diploma_numero_idx" ON "LegalSource"("diploma" ASC, "numero" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "NewsItem_slug_key" ON "NewsItem"("slug" ASC);

-- CreateIndex
CREATE INDEX "NormVersion_vigenteDesde_vigenteAte_idx" ON "NormVersion"("vigenteDesde" ASC, "vigenteAte" ASC);

-- CreateIndex
CREATE INDEX "NormVersion_diploma_numero_idx" ON "NormVersion"("diploma" ASC, "numero" ASC);

-- CreateIndex
CREATE INDEX "OidcAuthCode_expiresAt_idx" ON "OidcAuthCode"("expiresAt" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "OidcAuthCode_code_key" ON "OidcAuthCode"("code" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "OidcKey_kid_key" ON "OidcKey"("kid" ASC);

-- CreateIndex
CREATE INDEX "PrecedentStatus_status_idx" ON "PrecedentStatus"("status" ASC);

-- CreateIndex
CREATE INDEX "PrecedentStatus_legalSourceId_idx" ON "PrecedentStatus"("legalSourceId" ASC);

-- CreateIndex
CREATE INDEX "ProofMatrix_factId_idx" ON "ProofMatrix"("factId" ASC);

-- CreateIndex
CREATE INDEX "ProofMatrix_caseId_idx" ON "ProofMatrix"("caseId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Skill_slug_key" ON "Skill"("slug" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "SkillVersion_slug_version_key" ON "SkillVersion"("slug" ASC, "version" ASC);

-- CreateIndex
CREATE INDEX "SkillVersion_area_idx" ON "SkillVersion"("area" ASC);

-- CreateIndex
CREATE INDEX "SkillVersion_status_idx" ON "SkillVersion"("status" ASC);

-- CreateIndex
CREATE INDEX "SkillVersion_slug_idx" ON "SkillVersion"("slug" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Template_slug_key" ON "Template"("slug" ASC);

-- CreateIndex
CREATE INDEX "UsageLedger_createdAt_idx" ON "UsageLedger"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "UsageLedger_userId_idx" ON "UsageLedger"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "User_oabEstado_oabNumero_key" ON "User"("oabEstado" ASC, "oabNumero" ASC);

-- CreateIndex
CREATE INDEX "User_oabEstado_oabNumero_idx" ON "User"("oabEstado" ASC, "oabNumero" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email" ASC);

