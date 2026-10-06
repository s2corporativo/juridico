CREATE TABLE `metropolitan_coverage_runs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`runKey` varchar(191) NOT NULL,
	`sourceKey` varchar(191) NOT NULL,
	`tribunalAlias` varchar(64) NOT NULL,
	`status` enum('planned','running','partial','completed','failed','rejected') NOT NULL,
	`scope` varchar(128) NOT NULL,
	`periodStart` varchar(7) NOT NULL,
	`periodEnd` varchar(7) NOT NULL,
	`expectedMunicipalities` int NOT NULL,
	`mappedMunicipalities` int NOT NULL DEFAULT 0,
	`methodologyVersion` varchar(64) NOT NULL,
	`queryFingerprint` varchar(64),
	`coverageNote` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `metropolitan_coverage_runs_id` PRIMARY KEY(`id`),
	CONSTRAINT `metropolitan_coverage_runs_runKey_unique` UNIQUE(`runKey`)
);
--> statement-breakpoint
CREATE TABLE `metropolitan_judging_body_facets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`runId` int NOT NULL,
	`tribunalAlias` varchar(64) NOT NULL,
	`municipalityName` varchar(128) NOT NULL,
	`municipalityIbgeCode` varchar(16) NOT NULL,
	`judgingBodyCode` varchar(64) NOT NULL,
	`judgingBodyLabel` varchar(500) NOT NULL,
	`amount` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `metropolitan_judging_body_facets_id` PRIMARY KEY(`id`),
	CONSTRAINT `metropolitan_body_facet_unique` UNIQUE(`runId`,`tribunalAlias`,`municipalityIbgeCode`,`judgingBodyCode`)
);
--> statement-breakpoint
CREATE INDEX `metropolitan_coverage_runs_status_idx` ON `metropolitan_coverage_runs` (`status`);--> statement-breakpoint
CREATE INDEX `metropolitan_body_facet_municipality_idx` ON `metropolitan_judging_body_facets` (`municipalityIbgeCode`);--> statement-breakpoint
CREATE INDEX `metropolitan_body_facet_alias_idx` ON `metropolitan_judging_body_facets` (`tribunalAlias`);