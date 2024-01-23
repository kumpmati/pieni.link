import { and, desc, eq } from 'drizzle-orm';
import { db } from '..';
import type { AuthUser } from '../schema/auth';
import { links, type Link, type LinkUpdate, type LinkInsert } from '../schema/link';
import { error } from '@sveltejs/kit';

export const consumeLink = async (linkId: Link['id']) => {
	const rows = await db
		.update(links)
		.set({ lastUsed: new Date() })
		.where(eq(links.id, linkId))
		.returning();

	if (rows.length === 0) {
		error(404, 'not found');
	}

	return rows[0];
};

export const getAllLinks = async () => {
	return await db.select().from(links).orderBy(desc(links.createdAt));
};

/**
 * Returns all the user's links with the newest link first
 * @param userId
 */
export const getAllUserLinks = async (userId: AuthUser['id']): Promise<Link[]> => {
	return db.select().from(links).where(eq(links.userId, userId)).orderBy(desc(links.createdAt));
};

/**
 * Returns a single link that the user must own
 * @param linkId
 * @param userId
 */
export const getUserLink = async (linkId: Link['id'], userId: AuthUser['id']): Promise<Link> => {
	const rows = await db
		.select()
		.from(links)
		.where(and(eq(links.id, linkId), eq(links.userId, userId)));

	if (rows.length === 0) {
		error(404, 'link not found');
	}

	return rows[0];
};

export const updateLink = async (linkId: Link['id'], data: LinkUpdate): Promise<Link> => {
	const rows = await db.update(links).set(data).where(eq(links.id, linkId)).returning();

	if (rows.length === 0) {
		error(500, 'failed to update');
	}

	return rows[0];
};

export const deleteLink = async (linkId: Link['id']) => {
	await db.delete(links).where(eq(links.id, linkId));
};

export const insertLink = async (data: LinkInsert) => {
	const result = await db.insert(links).values(data).returning();

	if (result.length === 0) {
		error(500, 'failed to create link');
	}

	return result[0];
};
