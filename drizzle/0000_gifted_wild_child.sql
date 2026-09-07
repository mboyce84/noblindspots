CREATE TABLE `audit_log` (
	`id` text PRIMARY KEY NOT NULL,
	`org_id` text NOT NULL,
	`actor_id` text NOT NULL,
	`action` text NOT NULL,
	`target` text NOT NULL,
	`detail` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `audit_org_time` ON `audit_log` (`org_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `team_goals` (
	`id` text PRIMARY KEY NOT NULL,
	`org_id` text NOT NULL,
	`user_id` text NOT NULL,
	`month` text NOT NULL,
	`payload` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `goals_org_user_month` ON `team_goals` (`org_id`,`user_id`,`month`);--> statement-breakpoint
CREATE TABLE `ingest_runs` (
	`id` text PRIMARY KEY NOT NULL,
	`org_id` text NOT NULL,
	`payload` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `runs_org_time` ON `ingest_runs` (`org_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `inquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`payload` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `inquiries_email` ON `inquiries` (`email`);--> statement-breakpoint
CREATE TABLE `records` (
	`id` text PRIMARY KEY NOT NULL,
	`org_id` text NOT NULL,
	`kind` text NOT NULL,
	`source` text NOT NULL,
	`source_id` text NOT NULL,
	`occurred_at` text NOT NULL,
	`payload` text NOT NULL,
	`excluded` integer DEFAULT 0 NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `records_natural_key` ON `records` (`org_id`,`kind`,`source`,`source_id`);--> statement-breakpoint
CREATE INDEX `records_org_date` ON `records` (`org_id`,`occurred_at`);--> statement-breakpoint
CREATE TABLE `daily_reports` (
	`id` text PRIMARY KEY NOT NULL,
	`org_id` text NOT NULL,
	`user_id` text NOT NULL,
	`date` text NOT NULL,
	`payload` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `reports_org_user_date` ON `daily_reports` (`org_id`,`user_id`,`date`);--> statement-breakpoint
CREATE TABLE `roster` (
	`id` text NOT NULL,
	`org_id` text NOT NULL,
	`payload` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `roster_org_id` ON `roster` (`org_id`,`id`);--> statement-breakpoint
CREATE TABLE `workspaces` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`mode` text NOT NULL,
	`settings` text DEFAULT '{}' NOT NULL,
	`created_at` text NOT NULL
);
