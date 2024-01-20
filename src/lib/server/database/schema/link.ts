import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { nanoid } from 'nanoid';
import { z } from 'zod';

export const links = pgTable('links', {
	id: text('id').primaryKey(),
	url: text('url').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	lastUsed: timestamp('last_used')
});

export type Link = typeof links.$inferSelect;

export const linkInsertSchema = createInsertSchema(links, {
	id: z.string().default(nanoid(8)),
	url: z.string().url()
});
