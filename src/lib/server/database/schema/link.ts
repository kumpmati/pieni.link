import { index, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { user } from './auth';

export const links = pgTable(
	'links',
	{
		id: text('id').primaryKey(),
		url: text('url').notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
		lastUsed: timestamp('last_used', { withTimezone: true }),

		validUntil: timestamp('valid_until', { withTimezone: true }),

		userId: varchar('user_id', { length: 15 })
			.notNull()
			.references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' })
	},
	(self) => ({
		createdAtIdx: index('links_created_at_index').on(self.createdAt).desc(),
		lastUsedIdx: index('links_last_used_index').on(self.lastUsed).desc(),

		validUntilIdx: index('links_valid_until_index').on(self.validUntil),

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
	url: z.string().url(),
	validUntil: z
		.string()
		.transform((val) => (val !== '' ? new Date(val) : null))
		.nullable()
});

export type LinkInsert = z.infer<typeof linkInsertSchema>;

export const linkUpdateSchema = linkInsertSchema.partial();

export type LinkUpdate = z.infer<typeof linkUpdateSchema>;
