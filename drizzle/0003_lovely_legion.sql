CREATE TABLE `national_census_facets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`runId` int NOT NULL,
	`kind` enum('subject','judging_body') NOT NULL,
	`code` varchar(64) NOT NULL,
	`label` varchar(500) NOT NULL,
	`amount` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `national_census_facets_id` PRIMARY KEY(`id`),
	CONSTRAINT `national_census_facets_unique` UNIQUE(`runId`,`kind`,`code`)
);
--> statement-breakpoint
CREATE INDEX `national_census_facets_kind_idx` ON `national_census_facets` (`kind`);