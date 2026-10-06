CREATE TABLE `public_data_sources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sourceKey` varchar(191) NOT NULL,
	`label` varchar(255) NOT NULL,
	`maintainer` varchar(255) NOT NULL,
	`sourceType` enum('api','catalog','webservice','manual') NOT NULL,
	`baseUrl` varchar(1024) NOT NULL,
	`documentationUrl` varchar(1024) NOT NULL,
	`authentication` enum('none','api_key','manual') NOT NULL,
	`integrationStatus` enum('integrated','ready','credential_required','manual_only','not_integrated') NOT NULL,
	`coverage` text NOT NULL,
	`contentScope` text NOT NULL,
	`usageNote` text NOT NULL,
	`citationText` varchar(500) NOT NULL,
	`privacyNote` text NOT NULL,
	`lastVerifiedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `public_data_sources_id` PRIMARY KEY(`id`),
	CONSTRAINT `public_data_sources_sourceKey_unique` UNIQUE(`sourceKey`)
);
--> statement-breakpoint
CREATE INDEX `public_data_sources_status_idx` ON `public_data_sources` (`integrationStatus`);