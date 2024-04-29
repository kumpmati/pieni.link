import { bigserial, index, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const log = pgTable(
	'log',
	{
		id: bigserial('id', { mode: 'number' }).primaryKey(),
		level: integer('level').notNull(),
		message: text('message').notNull(),
		timestamp: timestamp('timestamp', { withTimezone: true }).notNull().defaultNow()
	},
	(self) => ({
		level_idx: index('log_level_idx').on(self.level),
		timestamp_idx: index('log_timestamp_idx').on(self.timestamp).desc()
	})
);
