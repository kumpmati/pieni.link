import { db } from '$lib/server/database/index.js';
import { links } from '$lib/server/database/schema/link.js';
import { error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

export const load = async ({ params, parent }) => {
	const { session } = await parent();

	if (!session) {
		error(401, 'unauthorized');
	}

	const rows = await db
		.select()
		.from(links)
		.where(and(eq(links.id, params.id), eq(links.userId, session.user.id)));

	if (rows.length === 0) {
		error(404, 'link not found');
	}

	return {
		link: rows[0]
	};
};
