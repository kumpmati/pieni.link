CREATE TABLE IF NOT EXISTS "signup_token" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"used_at" timestamp,
	"user_id" varchar(15)
);
--> statement-breakpoint
ALTER TABLE "links" ADD COLUMN "user_id" varchar(15) NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "links" ADD CONSTRAINT "links_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "signup_token" ADD CONSTRAINT "signup_token_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
