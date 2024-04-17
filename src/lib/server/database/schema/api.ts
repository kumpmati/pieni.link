import { pgTable, varchar, text, primaryKey, timestamp, index } from 'drizzle-orm/pg-core';
import { user } from './auth';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const apiKey = pgTable(
	'api_key',
	{
		id: varchar('id', { length: 15 }),
		secret: text('secret'),
		userId: varchar('user_id', { length: 15 })
			.notNull()
			.references(() => user.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
		created_at: timestamp('timestamp', { withTimezone: true }).notNull().defaultNow()
	},
	(self) => ({
		pk: primaryKey({ columns: [self.id, self.secret] }),
		userIdIdx: index('api_key_user_id_idx').on(self.userId),
		createdAtIdx: index('api_key_created_at_idx').on(self.created_at).desc()
	})
);

export type ApiKey = typeof apiKey.$inferSelect;

export const apiKeyInsertSchema = createInsertSchema(apiKey, {
	id: z.string().length(15),
	secret: z.string().min(1)
});
