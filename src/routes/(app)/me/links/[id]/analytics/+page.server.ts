import { linkVisit } from '$lib/server/database/schema/analytics';
import { eq, sql } from 'drizzle-orm';
import { db } from '$lib/server/database';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	return {
		visitsByDay: db
			.select({
				day: sql<string>`date_trunc('day', ${linkVisit.timestamp})`,
				count: sql<number>`cast(count(*) as int)`
			})
			.from(linkVisit)
			.where(eq(linkVisit.linkId, params.id))
			.orderBy(sql`1`)
			.groupBy(sql`1`)
	};
}) satisfies PageServerLoad;
