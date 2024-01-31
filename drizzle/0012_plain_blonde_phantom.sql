ALTER TABLE "links" RENAME COLUMN "valid_end" TO "valid_until";--> statement-breakpoint
DROP INDEX IF EXISTS "links_valid_start_index";--> statement-breakpoint
DROP INDEX IF EXISTS "links_valid_end_index";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "links_valid_until_index" ON "links" ("valid_until");--> statement-breakpoint
ALTER TABLE "links" DROP COLUMN IF EXISTS "valid_start";