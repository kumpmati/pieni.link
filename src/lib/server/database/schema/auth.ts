import { pgTable, bigint, varchar, text, uuid, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

/**
 * @see https://lucia-auth.com/guidebook/drizzle-orm/#postgresql
 */

export const user = pgTable('auth_user', {
	id: varchar('id', { length: 15 }).primaryKey(),
	name: text('name').notNull(),
	email: text('email').unique(),
	image: text('image'),
	role: text('role', { enum: ['admin', 'member'] })
		.notNull()
		.default('member')
});

export type AuthUser = typeof user.$inferSelect;

export const session = pgTable('user_session', {
	id: varchar('id', { length: 128 }).primaryKey(),
	userId: varchar('user_id', { length: 15 })
		.notNull()
		.references(() => user.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
	activeExpires: bigint('active_expires', { mode: 'number' }).notNull(),
	idleExpires: bigint('idle_expires', { mode: 'number' }).notNull()
});

export const key = pgTable('user_key', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 15 })
		.notNull()
		.references(() => user.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
	hashedPassword: varchar('hashed_password', { length: 255 })
});

export const signupToken = pgTable('signup_token', {
	id: uuid('id').primaryKey().defaultRandom(),
	role: text('role', { enum: ['admin', 'member'] })
		.notNull()
		.default('member'),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	usedAt: timestamp('used_at', { withTimezone: true }),
	userId: varchar('user_id', { length: 15 }).references(() => user.id, {
		onUpdate: 'cascade',
		onDelete: 'cascade'
	})
});

export type SignupToken = typeof signupToken.$inferSelect;

export const signupTokenInsertSchema = createInsertSchema(signupToken);

export const createSignupTokenSchema = z.object({
	role: z.enum(['admin', 'member'])
});
