ALTER TABLE "links" RENAME COLUMN "user_id" TO "old_user_id";--> statement-breakpoint
ALTER TABLE "links" DROP CONSTRAINT "links_user_id_auth_user_old_id_fk";
--> statement-breakpoint
DROP INDEX "links_user_id_index";--> statement-breakpoint
ALTER TABLE "links" ADD CONSTRAINT "links_old_user_id_auth_user_old_id_fk" FOREIGN KEY ("old_user_id") REFERENCES "public"."auth_user_old"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "links_user_id_index" ON "links" USING btree ("old_user_id");