ALTER TABLE "links" ALTER COLUMN "old_user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "links" ADD COLUMN "user_id" text;--> statement-breakpoint
ALTER TABLE "links" ADD CONSTRAINT "links_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "links_new_user_id_index" ON "links" USING btree ("user_id");