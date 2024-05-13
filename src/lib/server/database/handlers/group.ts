import { and, eq, getTableColumns, sql } from 'drizzle-orm';
import type { AuthUser } from '../schema/auth';
import { groups, linksToGroups, type Group, type GroupInsert } from '../schema/group';
import { db } from '..';
import { error } from '@sveltejs/kit';
import { links, type Link } from '../schema/link';

export const insertGroup = async (data: GroupInsert) => {
	await db.insert(groups).values(data);
};

export const getNumGroupsByUser = async (userId: AuthUser['id']) => {
	const data = await db
		.select({
			count: sql<number>`cast(count(*) as int)`
		})
		.from(groups)
		.where(eq(groups.userId, userId));

	return data[0]?.count ?? 0;
};

export const getGroupsByUser = async (userId: AuthUser['id']) => {
	return await db.select().from(groups).where(eq(groups.userId, userId));
};

export const getUserGroupById = async (userId: AuthUser['id'], groupId: Group['id']) => {
	const result = await db
		.select()
		.from(groups)
		.where(and(eq(groups.userId, userId), eq(groups.id, groupId)));

	if (result.length === 0) {
		error(404, 'group not found');
	}

	return result[0];
};

export const insertLinkIntoGroup = async (groupId: Group['id'], linkId: Link['id']) => {
	await db.insert(linksToGroups).values({ groupId, linkId });
};
