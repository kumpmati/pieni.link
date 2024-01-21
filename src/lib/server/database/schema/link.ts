import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { user } from './auth';

export const links = pgTable('links', {
	id: text('id').primaryKey(),
	url: text('url').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	lastUsed: timestamp('last_used'),
	userId: varchar('user_id', { length: 15 })
		.notNull()
		.references(() => user.id)
});

export type Link = typeof links.$inferSelect;

export const linkInsertSchema = createInsertSchema(links, {
	id: z.string().default(() => nanoid(8)),
	url: z.string().url()
});

export const linkUpdateSchema = createSelectSchema(links).partial();
