ALTER TABLE "api_key" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_key" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_session" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "signup_token" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "log" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "api_key" CASCADE;--> statement-breakpoint
DROP TABLE "user_key" CASCADE;--> statement-breakpoint
DROP TABLE "user_session" CASCADE;--> statement-breakpoint
DROP TABLE "signup_token" CASCADE;--> statement-breakpoint
DROP TABLE "log" CASCADE;--> statement-breakpoint
ALTER TABLE "auth_user" RENAME TO "auth_user_old";--> statement-breakpoint
ALTER TABLE "auth_user_old" DROP CONSTRAINT "auth_user_email_unique";--> statement-breakpoint
ALTER TABLE "links" DROP CONSTRAINT "links_user_id_auth_user_id_fk";
--> statement-breakpoint
ALTER TABLE "links" ADD CONSTRAINT "links_user_id_auth_user_old_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_user_old"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "auth_user_old" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "auth_user_old" DROP COLUMN "image";--> statement-breakpoint
ALTER TABLE "auth_user_old" DROP COLUMN "role";