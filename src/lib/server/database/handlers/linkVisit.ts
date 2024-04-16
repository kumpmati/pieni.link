import { and, desc, eq, gte, sql } from 'drizzle-orm';
import { db } from '..';
import { linkVisit } from '../schema/analytics';
import type { AuthUser } from '../schema/auth';
import { links, type Link } from '../schema/link';
import dayjs from 'dayjs';

/**
 * Returns overall statistics for all of the user's links
 * @param userId
 */
export const getOverallLinkStatistics = async (
	userId: AuthUser['id']
): Promise<OverallLinkStatistics> => {
	const last24hDate = dayjs().subtract(24, 'hours').toDate();

	const [lastDayVisits, alltimeVisits, mostVisited] = await Promise.all([
		db
			.select({ count: sql<number>`cast(count(${linkVisit.id}) as int)` })
			.from(linkVisit)
			.where(gte(linkVisit.timestamp, last24hDate))
			.innerJoin(links, and(eq(linkVisit.linkId, links.id), eq(links.userId, userId))),

		db
			.select({ count: sql<number>`cast(count(${linkVisit.id}) as int)` })
			.from(linkVisit)
			.innerJoin(links, and(eq(linkVisit.linkId, links.id), eq(links.userId, userId))),

		db
			.select({
				linkId: linkVisit.linkId,
				count: sql<number>`cast(count(${linkVisit.linkId}) as int)`
			})
			.from(linkVisit)
			.innerJoin(links, and(eq(linkVisit.linkId, links.id), eq(links.userId, userId)))
			.groupBy(linkVisit.linkId)
			.orderBy(desc(sql`count`))
			.limit(1)
	]);

	return {
		lastDay: lastDayVisits[0].count,
		total: alltimeVisits[0].count,
		mostVisited: mostVisited.at(0) ?? null
	};
};

export type OverallLinkStatistics = {
	lastDay: number;
	total: number;
	mostVisited: { linkId: string; count: number } | null;
};

/**
 * Returns overall statistics for all of the user's links
 * @param userId
 */
export const getLinkStatistics = async (linkId: Link['id']): Promise<PerLinkStatistics> => {
	const last24hDate = dayjs().subtract(24, 'hours').toDate();
	const lastWeekDate = dayjs().subtract(7, 'days').toDate();

	const [lastDayVisits, lastWeekVisits, alltimeVisits] = await Promise.all([
		db
			.select({ count: sql<number>`cast(count(${linkVisit.id}) as int)` })
			.from(linkVisit)
			.where(and(gte(linkVisit.timestamp, last24hDate), eq(linkVisit.linkId, linkId)))
			.innerJoin(links, eq(linkVisit.linkId, links.id)),

		db
			.select({ count: sql<number>`cast(count(${linkVisit.id}) as int)` })
			.from(linkVisit)
			.where(and(gte(linkVisit.timestamp, lastWeekDate), eq(linkVisit.linkId, linkId)))
			.innerJoin(links, eq(linkVisit.linkId, links.id)),

		db
			.select({ count: sql<number>`cast(count(${linkVisit.id}) as int)` })
			.from(linkVisit)
			.where(eq(linkVisit.linkId, linkId))
			.innerJoin(links, eq(linkVisit.linkId, links.id))
	]);

	return {
		lastDay: lastDayVisits[0].count,
		lastWeek: lastWeekVisits[0].count,
		total: alltimeVisits[0].count
	};
};

export type PerLinkStatistics = {
	lastDay: number;
	lastWeek: number;
	total: number;
};

/**
 * Creates a new link visit entry, returning true if the visit was successful
 * @param linkId
 * @param request
 * @returns
 */
export const insertLinkVisitFromRequest = async (linkId: Link['id'], request: Request) => {
	const url = new URL(request.url);

	const referrer =
		url.searchParams.get('ref') ??
		request.headers.get('referrer') ??
		request.headers.get('referer') ??
		request.referrer;

	await db.insert(linkVisit).values({
		linkId,
		referrer,
		userAgent: request.headers.get('user-agent') ?? ''
	});
};
