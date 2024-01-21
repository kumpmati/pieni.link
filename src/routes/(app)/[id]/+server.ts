import { db } from '$lib/server/database/index.js';
import { linkVisit } from '$lib/server/database/schema/analytics.js';
import { links } from '$lib/server/database/schema/link.js';
import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const GET = async ({ params, request }) => {
	const rows = await db
		.update(links)
		.set({ lastUsed: new Date() })
		.where(eq(links.id, params.id))
		.returning();

	if (rows.length === 0) {
		error(404, 'not found');
	}

	await db.insert(linkVisit).values({
		linkId: params.id,
		host: request.headers.get('host') ?? '',
		userAgent: request.headers.get('user-agent') ?? ''
	});

	redirect(302, rows[0].url);
};
