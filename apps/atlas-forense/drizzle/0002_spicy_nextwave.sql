CREATE TABLE `national_census_metrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`runId` int NOT NULL,
	`tribunalAlias` varchar(64) NOT NULL,
	`tribunal` varchar(128) NOT NULL,
	`uf` varchar(2) NOT NULL,
	`month` varchar(7) NOT NULL,
	`metric` enum('distribution','baixa') NOT NULL,
	`classCode` varchar(32) NOT NULL DEFAULT '',
	`subjectCode` varchar(32) NOT NULL DEFAULT '',
	`judgingBodyCode` varchar(64) NOT NULL DEFAULT '',
	`amount` int NOT NULL,
	`sourceObservedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `national_census_metrics_id` PRIMARY KEY(`id`),
	CONSTRAINT `national_census_metric_unique` UNIQUE(`runId`,`tribunalAlias`,`month`,`metric`,`classCode`,`subjectCode`,`judgingBodyCode`)
);
--> statement-breakpoint
CREATE TABLE `national_census_runs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`runKey` varchar(191) NOT NULL,
	`sourceKey` varchar(191) NOT NULL,
	`status` enum('planned','running','partial','completed','failed','rejected') NOT NULL,
	`scope` varchar(128) NOT NULL,
	`periodStart` varchar(7) NOT NULL,
	`periodEnd` varchar(7) NOT NULL,
	`expectedTribunals` int NOT NULL,
	`respondedTribunals` int NOT NULL DEFAULT 0,
	`methodologyVersion` varchar(64) NOT NULL,
	`queryFingerprint` varchar(64),
	`coverageNote` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `national_census_runs_id` PRIMARY KEY(`id`),
	CONSTRAINT `national_census_runs_runKey_unique` UNIQUE(`runKey`)
);
--> statement-breakpoint
CREATE INDEX `national_census_metrics_month_idx` ON `national_census_metrics` (`month`);--> statement-breakpoint
CREATE INDEX `national_census_metrics_tribunal_idx` ON `national_census_metrics` (`tribunalAlias`);--> statement-breakpoint
CREATE INDEX `national_census_runs_status_idx` ON `national_census_runs` (`status`);