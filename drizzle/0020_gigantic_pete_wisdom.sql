ALTER TABLE "link_to_group" DROP CONSTRAINT "link_to_group_group_id_link_id_pk";--> statement-breakpoint
ALTER TABLE "link_to_group" ADD COLUMN "id" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "link_to_group" ADD CONSTRAINT "linksToGroupUnique" UNIQUE("group_id","link_id");