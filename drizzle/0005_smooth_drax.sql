CREATE TABLE IF NOT EXISTS "link_visit" (
	"id" uuid PRIMARY KEY NOT NULL,
	"link_id" text NOT NULL,
	"host" text DEFAULT '' NOT NULL,
	"user_agent" text DEFAULT '' NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "link_visit" ADD CONSTRAINT "link_visit_link_id_links_id_fk" FOREIGN KEY ("link_id") REFERENCES "links"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
