CREATE TABLE IF NOT EXISTS "group" (
	"id" varchar(15) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"user_id" varchar(15) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "link_to_group" (
	"group_id" varchar(15) NOT NULL,
	"link_id" text NOT NULL,
	CONSTRAINT "link_to_group_group_id_link_id_pk" PRIMARY KEY("group_id","link_id")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "group_id_idx" ON "group" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "group_created_at_idx" ON "group" ("created_at");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "group" ADD CONSTRAINT "group_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "link_to_group" ADD CONSTRAINT "link_to_group_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "link_to_group" ADD CONSTRAINT "link_to_group_link_id_links_id_fk" FOREIGN KEY ("link_id") REFERENCES "links"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
