import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { links } from './link';

export const linkVisit = pgTable(
	'link_visit',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		linkId: text('link_id')
			.notNull()
			.references(() => links.id, { onUpdate: 'cascade', onDelete: 'cascade' }),

		host: text('host').notNull().default(''),
		userAgent: text('user_agent').notNull().default(''),
		timestamp: timestamp('timestamp').notNull().defaultNow()
	},
	(self) => ({
		linkIdIdx: index('link_visit_link_id_index').on(self.linkId),
		timestampIdx: index('link_visit_timestamp_index').on(self.timestamp)
	})
);

export type LinkVisit = typeof linkVisit.$inferSelect;
