import { mustAuthenticate } from '$lib/queries/helpers.js';
import { db } from '$lib/server/database/index.js';
import { links } from '$lib/server/database/schema/link.js';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async ({ params }) => {
	await mustAuthenticate();

	const [row] = await db.select().from(links).where(eq(links.id, params.id));

	if (!row) {
		error(404, 'Link not found');
	}

	return {
		link: row
	};
};
