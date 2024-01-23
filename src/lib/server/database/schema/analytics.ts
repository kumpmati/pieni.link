import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { links } from './link';

export const linkVisit = pgTable('link_visit', {
	id: uuid('id').primaryKey().defaultRandom(),
	linkId: text('link_id')
		.notNull()
		.references(() => links.id, { onUpdate: 'cascade', onDelete: 'cascade' }),

	host: text('host').notNull().default(''),
	userAgent: text('user_agent').notNull().default(''),
	timestamp: timestamp('timestamp').notNull().defaultNow()
});

export type LinkVisit = typeof linkVisit.$inferSelect;
