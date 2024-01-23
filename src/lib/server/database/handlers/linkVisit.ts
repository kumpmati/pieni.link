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
export const getAllLinkStatistics = async (userId: AuthUser['id']): Promise<LinkStatistics> => {
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

export type LinkStatistics = {
	lastDay: number;
	total: number;
	mostVisited: { linkId: string; count: number } | null;
};

/**
 * Creates a new link visit entry, returning true if the visit was successful
 * @param linkId
 * @param request
 * @returns
 */
export const insertLinkVisitFromRequest = async (linkId: Link['id'], request: Request) => {
	const result = await db.insert(linkVisit).values({
		linkId,
		referrer:
			request.headers.get('referrer') ?? request.headers.get('referer') ?? request.referrer ?? '',
		userAgent: request.headers.get('user-agent') ?? ''
	});

	return result.rowCount === 1;
};
