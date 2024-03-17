ALTER TABLE "links" ADD COLUMN "valid_start" timestamp;--> statement-breakpoint
ALTER TABLE "links" ADD COLUMN "valid_end" timestamp;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "links_valid_start_index" ON "links" ("valid_start");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "links_valid_end_index" ON "links" ("valid_end");