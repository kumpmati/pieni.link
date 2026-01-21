import { form, query } from '$app/server';
import z from 'zod';
import { mustAuthenticate } from './helpers';
import { db } from '$lib/server/database';
import { links } from '$lib/server/database/schema/link';
import { and, eq, isNull } from 'drizzle-orm';

export const getAllLinksWithOldUserId = query(z.string(), async (userId) => {
	await mustAuthenticate();

	return db.select().from(links).where(eq(links.oldUserId, userId));
});

export const migrateAllOldLinks = form(
	z.object({ oldUserId: z.string() }),
	async ({ oldUserId }) => {
		const user = await mustAuthenticate();

		const result = await db
			.update(links)
			.set({ userId: user.id, oldUserId: null })
			.where(and(isNull(links.userId), eq(links.oldUserId, oldUserId)));

		return { updated: result.rowCount };
	}
);
