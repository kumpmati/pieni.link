CREATE TABLE IF NOT EXISTS "api_key" (
	"id" varchar(15),
	"secret" text,
	"user_id" varchar(15) NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "api_key_id_secret_pk" PRIMARY KEY("id","secret")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "api_key_user_id_idx" ON "api_key" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "api_key_created_at_idx" ON "api_key" ("timestamp");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "api_key" ADD CONSTRAINT "api_key_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
