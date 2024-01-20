CREATE TABLE IF NOT EXISTS "links" (
	"id" text PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_used" timestamp
);
