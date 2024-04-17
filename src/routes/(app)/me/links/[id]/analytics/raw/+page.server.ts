import { linkVisit } from '$lib/server/database/schema/analytics';
import { desc, eq } from 'drizzle-orm';
import { db } from '$lib/server/database';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	return {
		visits: db
			.select()
			.from(linkVisit)
			.where(eq(linkVisit.linkId, params.id))
			.orderBy(desc(linkVisit.timestamp))
	};
}) satisfies PageServerLoad;
