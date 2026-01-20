import { query } from '$app/server';
import { desc, eq } from 'drizzle-orm';
import { db } from '../server/database';
import { links } from '../server/database/schema/link';
import { error } from '@sveltejs/kit';

const getUser = () => {
	return null as any; // TODO: get user
};

export const getOwnLinks = query(async () => {
	const user = getUser();
	if (!user) error(401, 'Unauthorized');

	return db.select().from(links).where(eq(links.oldUserId, user.id)).orderBy(desc(links.createdAt));
});
