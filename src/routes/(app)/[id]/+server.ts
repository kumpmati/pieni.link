import { db } from '$lib/server/database/index.js';
import { links } from '$lib/server/database/schema/link.js';
import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const GET = async ({ params }) => {
	const rows = await db
		.update(links)
		.set({ lastUsed: new Date() })
		.where(eq(links.id, params.id))
		.returning();

	if (rows.length === 0) {
		error(404, 'not found');
	}

	redirect(302, rows[0].url);
};
