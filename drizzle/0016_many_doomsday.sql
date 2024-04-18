ALTER TABLE "api_key" RENAME COLUMN "timestamp" TO "created_at";--> statement-breakpoint
DROP INDEX IF EXISTS "api_key_created_at_idx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "api_key_created_at_idx" ON "api_key" ("created_at");