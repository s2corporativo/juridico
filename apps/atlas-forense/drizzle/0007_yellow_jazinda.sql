CREATE TABLE `rmbh_civil_consumer_metrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`runId` int NOT NULL,
	`tribunalAlias` varchar(64) NOT NULL,
	`municipalityName` varchar(128) NOT NULL,
	`municipalityIbgeCode` varchar(16) NOT NULL,
	`judgingBodyCode` varchar(64) NOT NULL,
	`judgingBodyLabel` varchar(500) NOT NULL,
	`month` varchar(7) NOT NULL,
	`categoryCode` varchar(32) NOT NULL,
	`categoryLabel` varchar(255) NOT NULL,
	`amount` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `rmbh_civil_consumer_metrics_id` PRIMARY KEY(`id`),
	CONSTRAINT `rmbh_civil_consumer_metric_unique` UNIQUE(`runId`,`tribunalAlias`,`municipalityIbgeCode`,`judgingBodyCode`,`month`,`categoryCode`)
);
--> statement-breakpoint
CREATE TABLE `rmbh_civil_consumer_runs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`runKey` varchar(191) NOT NULL,
	`sourceKey` varchar(191) NOT NULL,
	`tribunalAlias` varchar(64) NOT NULL,
	`status` enum('planned','running','partial','completed','failed','rejected') NOT NULL,
	`scope` varchar(128) NOT NULL,
	`periodStart` varchar(10) NOT NULL,
	`periodEnd` varchar(10) NOT NULL,
	`subjectTreeVersion` varchar(128) NOT NULL,
	`termsCount` int NOT NULL,
	`queryFingerprint` varchar(64),
	`coverageNote` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `rmbh_civil_consumer_runs_id` PRIMARY KEY(`id`),
	CONSTRAINT `rmbh_civil_consumer_runs_runKey_unique` UNIQUE(`runKey`)
);
--> statement-breakpoint
CREATE INDEX `rmbh_civil_consumer_metrics_month_idx` ON `rmbh_civil_consumer_metrics` (`month`);--> statement-breakpoint
CREATE INDEX `rmbh_civil_consumer_metrics_municipality_idx` ON `rmbh_civil_consumer_metrics` (`municipalityIbgeCode`);--> statement-breakpoint
CREATE INDEX `rmbh_civil_consumer_metrics_category_idx` ON `rmbh_civil_consumer_metrics` (`categoryCode`);--> statement-breakpoint
CREATE INDEX `rmbh_civil_consumer_runs_status_idx` ON `rmbh_civil_consumer_runs` (`status`);