import { and, asc, between, eq, sql } from 'drizzle-orm';
import { linkVisit } from '../schema/analytics';
import { db } from '..';
import { links } from '../schema/link';

export const getAllUserVisitsGroupedByDay = async (userId: string, dateRange: [Date, Date]) => {
	const [from, to] = dateRange;

	const data = await db
		.select({
			day: sql<string>`date_trunc('day', ${linkVisit.timestamp})`,
			count: sql<number>`cast(count(*) as int)`
		})
		.from(linkVisit)
		.innerJoin(links, eq(linkVisit.linkId, links.id))
		.where(and(eq(links.userId, userId), between(linkVisit.timestamp, from, to)))
		.orderBy(asc(sql`1`))
		.groupBy(sql`1`);

	return data;
};

export const getLinkVisitsPerReferrer = async (linkId: string) => {
	return await db
		.select({
			count: sql<number>`cast(count(${linkVisit.id}) as int)`,
			referrer: linkVisit.referrer
		})
		.from(linkVisit)
		.where(eq(linkVisit.linkId, linkId))
		.groupBy(linkVisit.referrer);
};
