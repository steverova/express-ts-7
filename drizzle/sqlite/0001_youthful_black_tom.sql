CREATE TABLE `credentials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`provider` text NOT NULL,
	`provider_user_id` text,
	`password_hash` text,
	`created_at` integer DEFAULT '"2026-07-11T22:04:08.589Z"',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uniq_provider_user` ON `credentials` (`provider`,`provider_user_id`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`user_agent` text,
	`ip_address` text,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT '"2026-07-11T22:04:08.603Z"',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_sessions_user_id` ON `sessions` (`user_id`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_login_attempts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`ip_address` text NOT NULL,
	`success` integer NOT NULL,
	`created_at` integer DEFAULT '"2026-07-11T22:04:08.592Z"'
);
--> statement-breakpoint
INSERT INTO `__new_login_attempts`("id", "email", "ip_address", "success", "created_at") SELECT "id", "email", "ip_address", "success", "created_at" FROM `login_attempts`;--> statement-breakpoint
DROP TABLE `login_attempts`;--> statement-breakpoint
ALTER TABLE `__new_login_attempts` RENAME TO `login_attempts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_password_reset_tokens` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`token_hash` text NOT NULL,
	`expires_at` integer NOT NULL,
	`used_at` integer,
	`created_at` integer DEFAULT '"2026-07-11T22:04:08.597Z"',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_password_reset_tokens`("id", "user_id", "token_hash", "expires_at", "used_at", "created_at") SELECT "id", "user_id", "token_hash", "expires_at", "used_at", "created_at" FROM `password_reset_tokens`;--> statement-breakpoint
DROP TABLE `password_reset_tokens`;--> statement-breakpoint
ALTER TABLE `__new_password_reset_tokens` RENAME TO `password_reset_tokens`;--> statement-breakpoint
CREATE TABLE `__new_refresh_tokens` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`token_hash` text NOT NULL,
	`family_id` text NOT NULL,
	`user_agent` text,
	`ip_address` text,
	`revoked_at` integer,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT '"2026-07-11T22:04:08.595Z"',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_refresh_tokens`("id", "user_id", "token_hash", "family_id", "user_agent", "ip_address", "revoked_at", "expires_at", "created_at") SELECT "id", "user_id", "token_hash", "family_id", "user_agent", "ip_address", "revoked_at", "expires_at", "created_at" FROM `refresh_tokens`;--> statement-breakpoint
DROP TABLE `refresh_tokens`;--> statement-breakpoint
ALTER TABLE `__new_refresh_tokens` RENAME TO `refresh_tokens`;--> statement-breakpoint
CREATE INDEX `idx_token_hash` ON `refresh_tokens` (`token_hash`);--> statement-breakpoint
CREATE INDEX `idx_user_id` ON `refresh_tokens` (`user_id`);--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`public_id` text NOT NULL,
	`email` text NOT NULL,
	`email_verified_at` integer,
	`role` text DEFAULT 'user' NOT NULL,
	`status` text DEFAULT 'active',
	`created_at` integer DEFAULT '"2026-07-11T22:04:08.586Z"',
	`updated_at` integer DEFAULT '"2026-07-11T22:04:08.586Z"'
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "public_id", "email", "email_verified_at", "role", "status", "created_at", "updated_at") SELECT "id", "public_id", "email", "email_verified_at", "role", "status", "created_at", "updated_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_public_id_unique` ON `users` (`public_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);