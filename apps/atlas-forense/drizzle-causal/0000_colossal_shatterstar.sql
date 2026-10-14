CREATE TABLE `causal_annotations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`caseId` int NOT NULL,
	`evidenceRefId` int NOT NULL,
	`role` enum('pedido','fato_gerador','fundamento','consequencia') NOT NULL,
	`claimType` enum('dano_moral','dano_material','obrigacao_fazer','obrigacao_nao_fazer','repeticao_indebito','rescisao_contratual','restituicao','declaracao_inexistencia_debito','outro') NOT NULL,
	`label` varchar(255) NOT NULL,
	`normalizedLabel` varchar(191) NOT NULL,
	`sourceKind` enum('cnj_subject','movement','document','manual_review') NOT NULL,
	`confidence` decimal(5,4) NOT NULL,
	`reviewStatus` enum('pending','approved','rejected','returned') NOT NULL DEFAULT 'pending',
	`reviewedBy` varchar(191),
	`reviewedAt` timestamp,
	`reviewNote` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `causal_annotations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `causal_cases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`runId` int NOT NULL,
	`caseKey` varchar(191) NOT NULL,
	`publicProcessKey` varchar(191),
	`tribunal` varchar(64) NOT NULL,
	`justice` varchar(64) NOT NULL,
	`municipality` varchar(128),
	`classCode` varchar(64),
	`classLabel` varchar(255),
	`filingDate` timestamp,
	`coverageStatus` enum('metadata_only','documents_available','reviewed','excluded') NOT NULL DEFAULT 'metadata_only',
	`sourceHashSha256` varchar(64) NOT NULL,
	`privacyNote` varchar(500) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `causal_cases_id` PRIMARY KEY(`id`),
	CONSTRAINT `causal_cases_caseKey_unique` UNIQUE(`caseKey`)
);
--> statement-breakpoint
CREATE TABLE `causal_documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`caseId` int NOT NULL,
	`documentType` enum('sentenca','acordao','decisao_interlocutoria','acordo_homologado','movimento','outro') NOT NULL,
	`sourceUrl` varchar(1024),
	`sourceLabel` varchar(255) NOT NULL,
	`contentHashSha256` varchar(64) NOT NULL,
	`pageCount` int,
	`available` int NOT NULL DEFAULT 1,
	`reviewStatus` enum('pending','approved','rejected','returned') NOT NULL DEFAULT 'pending',
	`reviewedBy` varchar(191),
	`reviewedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `causal_documents_id` PRIMARY KEY(`id`),
	CONSTRAINT `causal_documents_case_hash_unique` UNIQUE(`caseId`,`contentHashSha256`)
);
--> statement-breakpoint
CREATE TABLE `causal_evidence_refs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`caseId` int NOT NULL,
	`documentId` int,
	`sourceUrl` varchar(1024) NOT NULL,
	`sourceLabel` varchar(255) NOT NULL,
	`sourceHashSha256` varchar(64) NOT NULL,
	`pageNumber` int,
	`paragraphRef` varchar(128),
	`excerpt` text,
	`evidenceType` enum('official_document','official_api','official_movement','manual_review') NOT NULL,
	`reviewStatus` enum('pending','approved','rejected','returned') NOT NULL DEFAULT 'pending',
	`reviewedBy` varchar(191),
	`reviewedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `causal_evidence_refs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `causal_outcomes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`caseId` int NOT NULL,
	`annotationId` int NOT NULL,
	`evidenceRefId` int NOT NULL,
	`phase` enum('origin','appeal','execution') NOT NULL,
	`outcome` enum('procedente','improcedente','parcialmente_procedente','extinto_sem_merito','acordo_homologado','prejudicado','nao_localizado','incerto') NOT NULL,
	`amountCents` int,
	`currency` varchar(3) NOT NULL DEFAULT 'BRL',
	`reviewStatus` enum('pending','approved','rejected','returned') NOT NULL DEFAULT 'pending',
	`reviewedBy` varchar(191),
	`reviewedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `causal_outcomes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `causal_runs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`runKey` varchar(191) NOT NULL,
	`sourceKey` varchar(191) NOT NULL,
	`tribunalAlias` varchar(64) NOT NULL,
	`scope` varchar(128) NOT NULL,
	`periodStart` varchar(10) NOT NULL,
	`periodEnd` varchar(10) NOT NULL,
	`methodologyVersion` varchar(64) NOT NULL,
	`status` enum('planned','running','partial','completed','failed','rejected') NOT NULL DEFAULT 'planned',
	`coverageNote` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `causal_runs_id` PRIMARY KEY(`id`),
	CONSTRAINT `causal_runs_runKey_unique` UNIQUE(`runKey`)
);
--> statement-breakpoint
CREATE INDEX `causal_annotations_case_idx` ON `causal_annotations` (`caseId`);--> statement-breakpoint
CREATE INDEX `causal_annotations_claim_idx` ON `causal_annotations` (`claimType`);--> statement-breakpoint
CREATE INDEX `causal_annotations_status_idx` ON `causal_annotations` (`reviewStatus`);--> statement-breakpoint
CREATE INDEX `causal_cases_run_idx` ON `causal_cases` (`runId`);--> statement-breakpoint
CREATE INDEX `causal_cases_tribunal_idx` ON `causal_cases` (`tribunal`);--> statement-breakpoint
CREATE INDEX `causal_cases_coverage_idx` ON `causal_cases` (`coverageStatus`);--> statement-breakpoint
CREATE INDEX `causal_documents_case_idx` ON `causal_documents` (`caseId`);--> statement-breakpoint
CREATE INDEX `causal_documents_review_idx` ON `causal_documents` (`reviewStatus`);--> statement-breakpoint
CREATE INDEX `causal_evidence_case_idx` ON `causal_evidence_refs` (`caseId`);--> statement-breakpoint
CREATE INDEX `causal_evidence_status_idx` ON `causal_evidence_refs` (`reviewStatus`);--> statement-breakpoint
CREATE INDEX `causal_outcomes_case_idx` ON `causal_outcomes` (`caseId`);--> statement-breakpoint
CREATE INDEX `causal_outcomes_annotation_idx` ON `causal_outcomes` (`annotationId`);--> statement-breakpoint
CREATE INDEX `causal_outcomes_status_idx` ON `causal_outcomes` (`reviewStatus`);--> statement-breakpoint
CREATE INDEX `causal_runs_status_idx` ON `causal_runs` (`status`);