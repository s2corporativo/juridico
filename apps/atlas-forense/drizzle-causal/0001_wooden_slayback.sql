CREATE TABLE `causal_document_texts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentId` int NOT NULL,
	`caseId` int NOT NULL,
	`plainText` mediumtext NOT NULL,
	`charCount` int NOT NULL,
	`contentHashSha256` varchar(64) NOT NULL,
	`extractionMethod` enum('manual_paste','official_api','ocr') NOT NULL DEFAULT 'manual_paste',
	`privacyScanStatus` enum('clean','flagged') NOT NULL DEFAULT 'clean',
	`detectorVersion` varchar(32) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `causal_document_texts_id` PRIMARY KEY(`id`),
	CONSTRAINT `causal_document_texts_document_unique` UNIQUE(`documentId`)
);
--> statement-breakpoint
ALTER TABLE `causal_annotations` ADD `familyKey` varchar(32);--> statement-breakpoint
CREATE INDEX `causal_document_texts_case_idx` ON `causal_document_texts` (`caseId`);