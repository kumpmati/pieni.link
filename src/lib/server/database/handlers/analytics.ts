import { and, asc, desc, eq, gte, sql } from 'drizzle-orm';
import { linkVisit } from '../schema/analytics';
import { db } from '..';
import dayjs from 'dayjs';
import { links, type Link } from '../schema/link';
import type { OldAuthUser } from '../schema/auth_old';

export const getLinkVisits = async (linkId: string) => {
	return await db
		.select()
		.from(linkVisit)
		.where(eq(linkVisit.linkId, linkId))
		.orderBy(desc(linkVisit.timestamp));
};

export type LinkVisitsPerDay = {
	day: string;
	count: number;
}[];

export const getLinkVisitsPerDay = async (linkId: string): Promise<LinkVisitsPerDay> => {
	const data = await db
		.select({
			day: sql<string>`date_trunc('day', ${linkVisit.timestamp})`,
			count: sql<number>`cast(count(*) as int)`
		})
		.from(linkVisit)
		.where(eq(linkVisit.linkId, linkId))
		.orderBy(asc(sql`1`))
		.groupBy(sql`1`);

	if (data.length === 0) {
		return [];
	}

	let current = dayjs(data.at(0)!.day);
	const last = dayjs(data.at(-1)!.day);

	while (dayjs(current).isBefore(last)) {
		const hasVisits = data.find((d) => Math.abs(current.diff(d.day)) < 1);

		if (!hasVisits) {
			// same format as the truncated date coming from database
			data.push({ day: current.format('YYYY-MM-DD 00:00:00+00'), count: 0 });
		}

		current = current.add(1, 'day');
	}

	return data.sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());
};

export type LinkVisitsPerReferrer = {
	referrer: string;
	count: number;
}[];

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

/**
 * Returns overall statistics for all of the user's links
 * @param oldUserId
 */
export const getOverallLinkStatistics = async (
	oldUserId: OldAuthUser['id']
): Promise<OverallLinkStatistics> => {
	const last24hDate = dayjs().subtract(24, 'hours').toDate();

	const [lastDayVisits, alltimeVisits, mostVisited] = await Promise.all([
		db
			.select({ count: sql<number>`cast(count(${linkVisit.id}) as int)` })
			.from(linkVisit)
			.where(gte(linkVisit.timestamp, last24hDate))
			.innerJoin(links, and(eq(linkVisit.linkId, links.id), eq(links.oldUserId, oldUserId))),

		db
			.select({ count: sql<number>`cast(count(${linkVisit.id}) as int)` })
			.from(linkVisit)
			.innerJoin(links, and(eq(linkVisit.linkId, links.id), eq(links.oldUserId, oldUserId))),

		db
			.select({
				linkId: linkVisit.linkId,
				count: sql<number>`cast(count(${linkVisit.linkId}) as int)`
			})
			.from(linkVisit)
			.innerJoin(links, and(eq(linkVisit.linkId, links.id), eq(links.oldUserId, oldUserId)))
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
