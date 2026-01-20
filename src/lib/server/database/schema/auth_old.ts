import { pgTable, text, varchar } from 'drizzle-orm/pg-core';

export const old_user = pgTable('auth_user_old', {
	id: varchar('id', { length: 15 }).primaryKey(),
	name: text('name').notNull()
});

export type OldAuthUser = typeof old_user.$inferSelect;
