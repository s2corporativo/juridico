CREATE TABLE `office_attendances` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`matterId` int,
	`occurredAt` timestamp NOT NULL DEFAULT (now()),
	`channel` varchar(64) NOT NULL DEFAULT 'presencial',
	`summary` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `office_attendances_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `office_clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`document` varchar(32),
	`email` varchar(191),
	`phone` varchar(32),
	`note` text,
	`isDemoData` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `office_clients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `office_communications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cnjNumber` varchar(32),
	`kind` varchar(32) NOT NULL DEFAULT 'outro',
	`title` varchar(255) NOT NULL,
	`status` enum('nova','lida','arquivada') NOT NULL DEFAULT 'nova',
	`channel` varchar(64) NOT NULL DEFAULT 'manual',
	`sourceKey` varchar(191),
	`sourceExternalId` varchar(191),
	`receivedAt` timestamp NOT NULL DEFAULT (now()),
	`deadlineAt` timestamp,
	`deadlineDays` int,
	`matterId` int,
	`isDemoData` int NOT NULL DEFAULT 0,
	`content` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `office_communications_id` PRIMARY KEY(`id`),
	CONSTRAINT `office_communications_sourceExternalId_unique` UNIQUE(`sourceExternalId`)
);
--> statement-breakpoint
CREATE TABLE `office_djen_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`enabled` int NOT NULL DEFAULT 1,
	`lawyerName` varchar(120),
	`oabNumber` varchar(16),
	`oabUf` varchar(2),
	`tribunal` varchar(64) NOT NULL DEFAULT 'TJMG',
	`autoSyncEnabled` int NOT NULL DEFAULT 1,
	`intervalMinutes` int NOT NULL DEFAULT 180,
	`windowDays` int NOT NULL DEFAULT 10,
	`defaultDeadlineDays` int NOT NULL DEFAULT 15,
	`lastSyncAt` timestamp,
	`lastSyncStatus` enum('never','success','partial','failed','not_configured') NOT NULL DEFAULT 'never',
	`lastSyncMessage` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `office_djen_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `office_jurisprudencia` (
	`id` int AUTO_INCREMENT NOT NULL,
	`externalId` varchar(191) NOT NULL,
	`provider` varchar(64) NOT NULL,
	`tribunal` varchar(64) NOT NULL,
	`orgao` varchar(128),
	`cnjNumber` varchar(32),
	`ementa` text NOT NULL,
	`url` varchar(1024),
	`decisionDate` varchar(10),
	`status` enum('nova','destacada','aplicada','descartada') NOT NULL DEFAULT 'nova',
	`matterId` int,
	`isDemoData` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `office_jurisprudencia_id` PRIMARY KEY(`id`),
	CONSTRAINT `office_jurisprudencia_externalId_unique` UNIQUE(`externalId`)
);
--> statement-breakpoint
CREATE TABLE `office_jurisprudencia_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`enabled` int NOT NULL DEFAULT 1,
	`query` varchar(160) NOT NULL DEFAULT 'consumidor boa fe',
	`lexmlEndpoint` varchar(512) NOT NULL DEFAULT 'http://lexml.gov.br/busca/sru',
	`maxItems` int NOT NULL DEFAULT 5,
	`autoSyncEnabled` int NOT NULL DEFAULT 1,
	`intervalMinutes` int NOT NULL DEFAULT 240,
	`lastSyncAt` timestamp,
	`lastSyncState` varchar(500),
	`lastSyncStatus` enum('never','success','partial','failed') NOT NULL DEFAULT 'never',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `office_jurisprudencia_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `office_matters` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`cnjNumber` varchar(32),
	`area` varchar(128),
	`status` enum('ativo','suspenso','arquivado','encerrado') NOT NULL DEFAULT 'ativo',
	`note` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `office_matters_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `public_data_sources` ADD `priority` enum('p0_obrigatoria','p1_desejavel','p2_eventual') DEFAULT 'p2_eventual' NOT NULL;--> statement-breakpoint
CREATE INDEX `office_attendances_client_idx` ON `office_attendances` (`clientId`);--> statement-breakpoint
CREATE INDEX `office_clients_name_idx` ON `office_clients` (`name`);--> statement-breakpoint
CREATE INDEX `office_communications_status_idx` ON `office_communications` (`status`);--> statement-breakpoint
CREATE INDEX `office_communications_cnj_idx` ON `office_communications` (`cnjNumber`);--> statement-breakpoint
CREATE INDEX `office_communications_received_idx` ON `office_communications` (`receivedAt`);--> statement-breakpoint
CREATE INDEX `office_juris_status_idx` ON `office_jurisprudencia` (`status`);--> statement-breakpoint
CREATE INDEX `office_juris_tribunal_idx` ON `office_jurisprudencia` (`tribunal`);--> statement-breakpoint
CREATE INDEX `office_matters_client_idx` ON `office_matters` (`clientId`);--> statement-breakpoint
CREATE INDEX `office_matters_cnj_idx` ON `office_matters` (`cnjNumber`);