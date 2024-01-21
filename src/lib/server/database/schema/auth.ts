import { pgTable, bigint, varchar, text, uuid, timestamp } from 'drizzle-orm/pg-core';

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

export const session = pgTable('user_session', {
	id: varchar('id', { length: 128 }).primaryKey(),
	userId: varchar('user_id', { length: 15 })
		.notNull()
		.references(() => user.id),
	activeExpires: bigint('active_expires', { mode: 'number' }).notNull(),
	idleExpires: bigint('idle_expires', { mode: 'number' }).notNull()
});

export const key = pgTable('user_key', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 15 })
		.notNull()
		.references(() => user.id),
	hashedPassword: varchar('hashed_password', { length: 255 })
});

export const signupToken = pgTable('signup_token', {
	id: uuid('id').primaryKey().defaultRandom(),
	role: text('role', { enum: ['admin', 'member'] })
		.notNull()
		.default('member'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	usedAt: timestamp('used_at'),
	userId: varchar('user_id', { length: 15 }).references(() => user.id)
});

export type SignupToken = typeof signupToken.$inferSelect;