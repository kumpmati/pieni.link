import { db } from '$lib/server/database';
import { links } from '$lib/server/database/schema/link';
import { and, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load = (async ({ parent, params }) => {
	const { session } = await parent();

	if (!session) {
		error(401, 'unauthorized');
	}

	const [link] = await db
		.select()
		.from(links)
		.where(and(eq(links.userId, session.user.id), eq(links.id, params.id)));

	if (!link) {
		error(404, 'not found');
	}

	return {
		link
	};
}) satisfies PageServerLoad;
