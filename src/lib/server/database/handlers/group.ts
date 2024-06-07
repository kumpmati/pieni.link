import { and, asc, eq, getTableColumns, sql } from 'drizzle-orm';
import type { AuthUser } from '../schema/auth';
import {
	groups,
	linksToGroups,
	type Group,
	type GroupInsert,
	type GroupUpdate,
	type LinksToGroups,
	type LinksToGroupsInsert,
	type LinksToGroupsUpdate
} from '../schema/group';
import { db } from '..';
import { error } from '@sveltejs/kit';
import { links } from '../schema/link';

export const insertGroup = async (data: GroupInsert) => {
	await db.insert(groups).values(data);
};

export const editGroup = async (groupId: Group['id'], data: GroupUpdate) => {
	await db.update(groups).set(data).where(eq(groups.id, groupId));
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

export const getGroupById = async (groupId: Group['id']) => {
	const result = await db.select().from(groups).where(eq(groups.id, groupId));

	if (result.length === 0) {
		error(404, 'group not found');
	}

	return result[0];
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

export const insertLinkIntoGroup = async (data: LinksToGroupsInsert) => {
	await db.insert(linksToGroups).values(data);
};

export const updateLinkInGroup = async (id: LinksToGroups['itemId'], data: LinksToGroupsUpdate) => {
	await db.update(linksToGroups).set(data).where(eq(linksToGroups.itemId, id));
};

export const deleteLinkFromGroup = async (id: LinksToGroups['itemId']) => {
	await db.delete(linksToGroups).where(eq(linksToGroups.itemId, id));
};

export const getLinksInGroup = async (groupId: Group['id']) => {
	return await db
		.select({ ...getTableColumns(linksToGroups), ...getTableColumns(links) })
		.from(linksToGroups)
		.where(eq(linksToGroups.groupId, groupId))
		.innerJoin(links, eq(links.id, linksToGroups.linkId))
		.orderBy(asc(linksToGroups.createdAt));
};
