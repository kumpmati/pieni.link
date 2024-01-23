CREATE INDEX IF NOT EXISTS "link_visit_link_id_index" ON "link_visit" ("link_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "link_visit_timestamp_index" ON "link_visit" ("timestamp");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "links_created_at_index" ON "links" ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "links_last_used_index" ON "links" ("last_used");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "links_user_id_index" ON "links" ("user_id");