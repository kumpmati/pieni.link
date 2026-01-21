import { command, query } from '$app/server';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '../server/database';
import { links } from '../server/database/schema/link';
import { authenticate } from './helpers';
import z from 'zod';
import { error } from '@sveltejs/kit';
import { nanoid } from 'nanoid';

export const createLink = command(z.string().url(), async (url) => {
	const { user } = await authenticate();
	if (!user) error(401, 'unauthorized'); // TODO: redirect to sign-in?

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
	const { user } = await authenticate();
	if (!user) return [];

	return db
		.select()
		.from(links)
		.where(eq(links.userId, user.id))
		.orderBy(desc(links.createdAt))
		.limit(limit);
});

export const getLinkById = query(z.string(), async (id) => {
	const { user } = await authenticate();
	if (!user) error(401, 'unauthorized');

	const [row] = await db.select().from(links).where(eq(links.id, id));
	return row ?? null;
});

export const removeOwnLink = command(z.string(), async (id) => {
	const { user } = await authenticate();
	if (!user) error(401, 'unauthorized');

	await db.delete(links).where(and(eq(links.id, id), eq(links.userId, user.id)));
});
