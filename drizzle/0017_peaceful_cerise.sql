CREATE TABLE IF NOT EXISTS "log" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"level" integer NOT NULL,
	"message" text NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "log_level_idx" ON "log" ("level");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "log_timestamp_idx" ON "log" ("timestamp");