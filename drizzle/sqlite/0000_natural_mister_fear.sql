CREATE TABLE `login_attempts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`ip_address` text NOT NULL,
	`success` integer NOT NULL,
	`created_at` integer DEFAULT '"2026-07-11T00:16:30.106Z"'
);
--> statement-breakpoint
CREATE TABLE `password_reset_tokens` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token_hash` text NOT NULL,
	`expires_at` integer NOT NULL,
	`used_at` integer,
	`created_at` integer DEFAULT '"2026-07-11T00:16:30.113Z"',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `refresh_tokens` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token_hash` text NOT NULL,
	`family_id` text NOT NULL,
	`user_agent` text,
	`ip_address` text,
	`revoked_at` integer,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT '"2026-07-11T00:16:30.109Z"',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`email_verified_at` integer,
	`role` text DEFAULT 'user' NOT NULL,
	`status` text DEFAULT 'active',
	`created_at` integer DEFAULT '"2026-07-11T00:16:30.103Z"',
	`updated_at` integer DEFAULT '"2026-07-11T00:16:30.103Z"'
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);