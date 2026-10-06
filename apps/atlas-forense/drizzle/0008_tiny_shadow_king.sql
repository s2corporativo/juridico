CREATE TABLE `editorial_update_runs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`runKey` varchar(191) NOT NULL,
	`status` enum('running','completed','partial','failed') NOT NULL,
	`sourceCount` int NOT NULL DEFAULT 0,
	`discoveredCount` int NOT NULL DEFAULT 0,
	`queuedCount` int NOT NULL DEFAULT 0,
	`failedCount` int NOT NULL DEFAULT 0,
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`finishedAt` timestamp,
	`errorSummary` varchar(500),
	CONSTRAINT `editorial_update_runs_id` PRIMARY KEY(`id`),
	CONSTRAINT `editorial_update_runs_runKey_unique` UNIQUE(`runKey`)
);
--> statement-breakpoint
CREATE TABLE `editorial_update_schedules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`cronExpression` varchar(32) NOT NULL,
	`scheduleCronTaskUid` varchar(65),
	`enabled` int NOT NULL DEFAULT 1,
	`lastRunAt` timestamp,
	`lastStatus` enum('never','completed','partial','failed') NOT NULL DEFAULT 'never',
	`lastErrorCode` varchar(128),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `editorial_update_schedules_id` PRIMARY KEY(`id`),
	CONSTRAINT `editorial_update_schedules_name_unique` UNIQUE(`name`),
	CONSTRAINT `editorial_update_schedules_scheduleCronTaskUid_unique` UNIQUE(`scheduleCronTaskUid`)
);
--> statement-breakpoint
CREATE TABLE `editorial_updates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`runId` int NOT NULL,
	`sourceKey` varchar(191) NOT NULL,
	`externalKey` varchar(191) NOT NULL,
	`kind` enum('jurisprudence','legislation','official_update') NOT NULL,
	`title` varchar(500) NOT NULL,
	`summary` varchar(1000),
	`canonicalUrl` varchar(1024) NOT NULL,
	`publishedAt` timestamp,
	`contentHash` varchar(64) NOT NULL,
	`status` enum('pending_review','approved','rejected','superseded') NOT NULL DEFAULT 'pending_review',
	`reviewedByUserId` int,
	`reviewedAt` timestamp,
	`reviewNote` varchar(1000),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `editorial_updates_id` PRIMARY KEY(`id`),
	CONSTRAINT `editorial_updates_source_external_unique` UNIQUE(`sourceKey`,`externalKey`)
);
--> statement-breakpoint
CREATE INDEX `editorial_update_runs_status_idx` ON `editorial_update_runs` (`status`);--> statement-breakpoint
CREATE INDEX `editorial_schedule_task_uid_idx` ON `editorial_update_schedules` (`scheduleCronTaskUid`);--> statement-breakpoint
CREATE INDEX `editorial_updates_status_idx` ON `editorial_updates` (`status`);--> statement-breakpoint
CREATE INDEX `editorial_updates_kind_idx` ON `editorial_updates` (`kind`);--> statement-breakpoint
CREATE INDEX `editorial_updates_published_idx` ON `editorial_updates` (`publishedAt`);