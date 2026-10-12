CREATE TABLE `legacy_knowledge_review` (
	`id` int AUTO_INCREMENT NOT NULL,
	`legacyId` varchar(64) NOT NULL,
	`docType` varchar(64) NOT NULL,
	`title` varchar(500) NOT NULL,
	`sourceUrl` varchar(1024),
	`sourceLabel` varchar(255),
	`documentText` text NOT NULL,
	`sourceSha256` varchar(64) NOT NULL,
	`legacyQuality` varchar(8),
	`legacyStatus` varchar(32) NOT NULL,
	`reviewStatus` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`reviewedBy` varchar(191),
	`reviewedAt` timestamp,
	`importedAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `legacy_knowledge_review_id` PRIMARY KEY(`id`),
	CONSTRAINT `legacy_knowledge_review_legacyId_unique` UNIQUE(`legacyId`)
);
--> statement-breakpoint
CREATE INDEX `legacy_knowledge_review_status_idx` ON `legacy_knowledge_review` (`reviewStatus`);--> statement-breakpoint
CREATE INDEX `legacy_knowledge_review_type_idx` ON `legacy_knowledge_review` (`docType`);