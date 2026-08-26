CREATE TABLE `audit_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entityType` varchar(64) NOT NULL,
	`entityKey` varchar(191) NOT NULL,
	`action` varchar(128) NOT NULL,
	`sourceStatus` varchar(64),
	`actorLabel` varchar(128) NOT NULL,
	`note` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `evidence_sources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`label` varchar(255) NOT NULL,
	`sourceType` enum('official_document','official_url','attachment','secondary','manual') NOT NULL,
	`sourceUrl` varchar(1024),
	`hashSha256` varchar(64),
	`publicStatus` enum('official_confirmed','official_without_number','attachment_reviewed','secondary_pending','not_for_use') NOT NULL,
	`note` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `evidence_sources_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ingestion_batches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`batchKey` varchar(191) NOT NULL,
	`sourceLabel` varchar(255) NOT NULL,
	`sourceHash` varchar(64),
	`status` enum('planned','reviewed','imported','partial','rejected') NOT NULL,
	`itemsDiscovered` int NOT NULL DEFAULT 0,
	`itemsImported` int NOT NULL DEFAULT 0,
	`itemsExcluded` int NOT NULL DEFAULT 0,
	`method` text NOT NULL,
	`note` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ingestion_batches_id` PRIMARY KEY(`id`),
	CONSTRAINT `ingestion_batches_batchKey_unique` UNIQUE(`batchKey`)
);
--> statement-breakpoint
CREATE TABLE `jurisprudence_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`externalId` varchar(191) NOT NULL,
	`batchId` int NOT NULL,
	`sourceId` int NOT NULL,
	`cnjNumber` varchar(80),
	`tribunal` varchar(64) NOT NULL,
	`justice` varchar(64) NOT NULL,
	`city` varchar(128),
	`comarca` varchar(128),
	`court` varchar(255),
	`judgingBody` varchar(255),
	`decisionType` varchar(64) NOT NULL,
	`decisionDate` timestamp,
	`publicationDate` timestamp,
	`legalArea` varchar(255),
	`theme` varchar(500),
	`outcomeOrigin` varchar(255),
	`outcomeAppeal` varchar(255),
	`dispositionType` varchar(255),
	`moralDamageValue` varchar(64),
	`reasoningSummary` text,
	`validationNote` text,
	`sourceStatus` enum('official_confirmed','official_without_number','attachment_reviewed','secondary_pending','movement_observed','search_thematic') NOT NULL,
	`recordVersion` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `jurisprudence_records_id` PRIMARY KEY(`id`),
	CONSTRAINT `jurisprudence_records_externalId_unique` UNIQUE(`externalId`)
);
--> statement-breakpoint
CREATE TABLE `jurisprudence_topics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jurisprudenceId` int NOT NULL,
	`topicId` int NOT NULL,
	`relevance` enum('primary','secondary') NOT NULL DEFAULT 'primary',
	CONSTRAINT `jurisprudence_topics_id` PRIMARY KEY(`id`),
	CONSTRAINT `jurisprudence_topics_unique` UNIQUE(`jurisprudenceId`,`topicId`)
);
--> statement-breakpoint
CREATE TABLE `legal_theses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`topicId` int NOT NULL,
	`title` varchar(500) NOT NULL,
	`position` enum('favoravel','contraria','condicionada','em_debate') NOT NULL,
	`description` text NOT NULL,
	`legalBasis` text,
	`proofNotes` text,
	`adverseFacts` text,
	`sourceStatus` enum('official_confirmed','attachment_reviewed','editorial_review','secondary_pending') NOT NULL DEFAULT 'editorial_review',
	`lastReviewedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `legal_theses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `legal_topics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`parentId` int,
	`kind` enum('area','subarea','instituto','tema','subtema','questao') NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(191) NOT NULL,
	`pathKey` varchar(767) NOT NULL,
	`summary` text,
	`synonyms` text,
	`cnjCodes` text,
	`sourceStatus` enum('official_confirmed','attachment_reviewed','editorial_review','secondary_pending') NOT NULL DEFAULT 'editorial_review',
	`version` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `legal_topics_id` PRIMARY KEY(`id`),
	CONSTRAINT `legal_topics_pathKey_unique` UNIQUE(`pathKey`),
	CONSTRAINT `legal_topics_parent_slug_unique` UNIQUE(`parentId`,`slug`)
);
--> statement-breakpoint
CREATE TABLE `thesis_authorities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`thesisId` int NOT NULL,
	`jurisprudenceId` int NOT NULL,
	`stance` enum('supports','opposes','context') NOT NULL,
	`note` text,
	CONSTRAINT `thesis_authorities_id` PRIMARY KEY(`id`),
	CONSTRAINT `thesis_authorities_unique` UNIQUE(`thesisId`,`jurisprudenceId`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE INDEX `audit_events_entity_idx` ON `audit_events` (`entityType`,`entityKey`);--> statement-breakpoint
CREATE INDEX `evidence_sources_status_idx` ON `evidence_sources` (`publicStatus`);--> statement-breakpoint
CREATE INDEX `ingestion_batches_status_idx` ON `ingestion_batches` (`status`);--> statement-breakpoint
CREATE INDEX `jurisprudence_tribunal_idx` ON `jurisprudence_records` (`tribunal`);--> statement-breakpoint
CREATE INDEX `jurisprudence_city_idx` ON `jurisprudence_records` (`city`);--> statement-breakpoint
CREATE INDEX `jurisprudence_theme_idx` ON `jurisprudence_records` (`theme`);--> statement-breakpoint
CREATE INDEX `jurisprudence_status_idx` ON `jurisprudence_records` (`sourceStatus`);--> statement-breakpoint
CREATE INDEX `jurisprudence_topics_topic_idx` ON `jurisprudence_topics` (`topicId`);--> statement-breakpoint
CREATE INDEX `legal_theses_topic_idx` ON `legal_theses` (`topicId`);--> statement-breakpoint
CREATE INDEX `legal_theses_position_idx` ON `legal_theses` (`position`);--> statement-breakpoint
CREATE INDEX `legal_topics_kind_idx` ON `legal_topics` (`kind`);--> statement-breakpoint
CREATE INDEX `thesis_authorities_thesis_idx` ON `thesis_authorities` (`thesisId`);