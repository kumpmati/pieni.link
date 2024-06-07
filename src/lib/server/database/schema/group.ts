import { pgTable, varchar, text, timestamp, index, uuid } from 'drizzle-orm/pg-core';
import { user } from './auth';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { links } from './link';
import { relations } from 'drizzle-orm';

export const groups = pgTable(
	'group',
	{
		id: varchar('id', { length: 15 }).primaryKey(),
		name: text('name').notNull(),
		description: text('description').notNull(),
		userId: varchar('user_id', { length: 15 })
			.notNull()
			.references(() => user.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
	},
	(self) => ({
		groupIdIdx: index('group_id_idx').on(self.userId),
		createdAtIdx: index('group_created_at_idx').on(self.createdAt).desc()
	})
);

export type Group = typeof groups.$inferSelect;

export const groupSchema = createSelectSchema(groups);

export type GroupInsert = typeof groups.$inferInsert;
export const groupInsertSchema = createInsertSchema(groups, {
	id: z.string().length(15),
	name: z.string().min(2)
});

export const groupUpdateSchema = groupInsertSchema.partial();
export type GroupUpdate = z.infer<typeof groupUpdateSchema>;

export const linksToGroups = pgTable('link_to_group', {
	itemId: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull().default('Link'),
	groupId: varchar('group_id', { length: 15 })
		.notNull()
		.references(() => groups.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
	linkId: text('link_id')
		.notNull()
		.references(() => links.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

export type LinksToGroups = typeof linksToGroups.$inferSelect;

export const linksToGroupsInsertSchema = createInsertSchema(linksToGroups);
export type LinksToGroupsInsert = z.infer<typeof linksToGroupsInsertSchema>;

export const linksToGroupsUpdateSchema = linksToGroupsInsertSchema.omit({ itemId: true }).partial();
export type LinksToGroupsUpdate = z.infer<typeof linksToGroupsUpdateSchema>;

// creates a link-to-group relation
export const linksToGroupsRelations = relations(linksToGroups, ({ one }) => ({
	group: one(groups, {
		fields: [linksToGroups.groupId],
		references: [groups.id]
	}),
	link: one(links, {
		fields: [linksToGroups.linkId],
		references: [links.id]
	})
}));

// links a many-to-many link between links and groups
export const linkRelations = relations(links, ({ many }) => ({
	linksToGroups: many(linksToGroups)
}));

// links a many-to-many link between groups and links
export const groupRelations = relations(groups, ({ many }) => ({
	linksToGroups: many(linksToGroups)
}));
