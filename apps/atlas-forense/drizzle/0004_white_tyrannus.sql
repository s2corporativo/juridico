CREATE TABLE `evidence_review_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jurisprudenceId` int NOT NULL,
	`status` enum('pending','approved','rejected','returned') NOT NULL DEFAULT 'pending',
	`priority` enum('routine','elevated','urgent') NOT NULL DEFAULT 'routine',
	`requestedReason` text NOT NULL,
	`assignedToUserId` int,
	`decisionNote` text,
	`reviewedByUserId` int,
	`reviewedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `evidence_review_items_id` PRIMARY KEY(`id`),
	CONSTRAINT `evidence_review_items_jurisprudenceId_unique` UNIQUE(`jurisprudenceId`)
);
--> statement-breakpoint
CREATE INDEX `evidence_review_status_idx` ON `evidence_review_items` (`status`);--> statement-breakpoint
CREATE INDEX `evidence_review_priority_idx` ON `evidence_review_items` (`priority`);