import { command, query } from '$app/server';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '../server/database';
import { links } from '../server/database/schema/link';
import { mustAuthenticate } from './helpers';
import z from 'zod';
import { nanoid } from 'nanoid';

export const createLink = command(z.string().url(), async (url) => {
	const user = await mustAuthenticate();

	const id = nanoid(6);

	const [row] = await db
		.insert(links)
		.values({
			id,
			url,
			userId: user.id,
			oldUserId: null
		})
		.returning();

	return row;
});

export const getAllOwnLinks = query(z.number().int().min(1), async (limit) => {
	const user = await mustAuthenticate();

	return db
		.select()
		.from(links)
		.where(eq(links.userId, user.id))
		.orderBy(desc(links.createdAt))
		.limit(limit);
});

export const getLinkById = query(z.string(), async (id) => {
	await mustAuthenticate();

	const [row] = await db.select().from(links).where(eq(links.id, id));
	return row ?? null;
});

export const updateLinkURL = command(
	z.object({ id: z.string(), url: z.string().url() }),
	async ({ id, url }) => {
		const user = await mustAuthenticate();

		const [row] = await db
			.update(links)
			.set({ url })
			.where(and(eq(links.id, id), eq(links.userId, user.id)))
			.returning();

		return row;
	}
);

export const removeOwnLink = command(z.string(), async (id) => {
	const user = await mustAuthenticate();

	await db.delete(links).where(and(eq(links.id, id), eq(links.userId, user.id)));
});
