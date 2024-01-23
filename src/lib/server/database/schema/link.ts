import { index, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { user } from './auth';

export const links = pgTable(
	'links',
	{
		id: text('id').primaryKey(),
		url: text('url').notNull(),
		createdAt: timestamp('created_at').notNull().defaultNow(),
		lastUsed: timestamp('last_used'),
		userId: varchar('user_id', { length: 15 })
			.notNull()
			.references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' })
	},
	(self) => ({
		createdAtIdx: index('links_created_at_index').on(self.createdAt).desc(),
		lastUsedIdx: index('links_last_used_index').on(self.lastUsed).desc(),
		userIdIdx: index('links_user_id_index').on(self.userId)
	})
);

export type Link = typeof links.$inferSelect;

export const linkInsertSchema = createInsertSchema(links, {
	id: z
		.string()
		.min(1)
		.regex(/^[\w-]+$/g)
		.default(() => nanoid(8)),
	url: z.string().url()
});

export type LinkInsert = z.infer<typeof linkInsertSchema>;

export const linkUpdateSchema = createSelectSchema(links).partial();

export type LinkUpdate = z.infer<typeof linkUpdateSchema>;
