import { UAParser } from 'ua-parser-js';
import { query } from '$app/server';
import { db } from '$lib/server/database';
import { and, between, count, countDistinct, desc, eq, sql } from 'drizzle-orm';
import { mustAuthenticate } from './helpers';
import { linkVisit } from '$lib/server/database/schema/analytics';
import { links } from '$lib/server/database/schema/link';
import z from 'zod';
import { getAllUserVisitsGroupedByDay } from '$lib/server/database/handlers/analytics';

const dateRangeSchema = z.tuple([z.date(), z.date()]);

export const getTotalVisits = query(dateRangeSchema, async (dateRange) => {
	const user = await mustAuthenticate();

	const [from, to] = dateRange;

	const [totalVisits] = await db
		.select({ count: sql<number>`cast(count(*) as int)` })
		.from(linkVisit)
		.innerJoin(links, eq(linkVisit.linkId, links.id))
		.where(and(eq(links.userId, user.id), between(linkVisit.timestamp, from, to)));

	return totalVisits.count;
});

export const getMostCommonDevices = query(dateRangeSchema, async ([from, to]) => {
	const user = await mustAuthenticate();

	// TODO: persist key user agent (os, browser, country) info in database to simplify query logic
	const allVisits = await db
		.select({ ua: linkVisit.userAgent })
		.from(linkVisit)
		.innerJoin(links, eq(linkVisit.linkId, links.id))
		.where(and(eq(links.userId, user.id), between(linkVisit.timestamp, from, to)));

	const osCounts: Record<string, number> = {};

	for (const { ua } of allVisits) {
		const parser = new UAParser(ua);

		const device = parser.getDevice();
		const os = device.toString() === 'undefined' ? '' : device.toString();
		osCounts[os] ??= 0;
		osCounts[os] += 1;
	}

	return Object.entries(osCounts)
		.toSorted((a, b) => b[1] - a[1])
		.map(([name, count]) => ({
			name,
			count,
			percentage: (count / allVisits.length) * 100
		}));
});

export const getMostCommonBrowsers = query(dateRangeSchema, async ([from, to]) => {
	const user = await mustAuthenticate();

	// TODO: persist key user agent (os, browser, country) info in database to simplify query logic
	const allVisits = await db
		.select({ ua: linkVisit.userAgent })
		.from(linkVisit)
		.innerJoin(links, eq(linkVisit.linkId, links.id))
		.where(and(eq(links.userId, user.id), between(linkVisit.timestamp, from, to)));

	const browserCounts: Record<string, number> = {};

	for (const { ua } of allVisits) {
		const parser = new UAParser(ua);

		const browser = parser.getBrowser().name ?? '';
		browserCounts[browser] ??= 0;
		browserCounts[browser] += 1;
	}

	return Object.entries(browserCounts)
		.toSorted((a, b) => b[1] - a[1])
		.map(([name, count]) => ({
			name,
			count,
			percentage: (count / allVisits.length) * 100
		}));
});

export type VisitsByDay = {
	day: string;
	count: number;
}[];

export const getAllVisitsByDay = query(dateRangeSchema, async (dateRange): Promise<VisitsByDay> => {
	const user = await mustAuthenticate();

	return await getAllUserVisitsGroupedByDay(user.id, dateRange);
});

export const getTotalUniqueUsers = query(dateRangeSchema, async ([from, to]): Promise<number> => {
	const user = await mustAuthenticate();

	// TODO: user agent is not indexed, see if indexing it helps
	const [result] = await db
		.select({ count: countDistinct(linkVisit.userAgent) })
		.from(linkVisit)
		.innerJoin(links, eq(linkVisit.linkId, links.id))
		.where(and(eq(links.userId, user.id), between(linkVisit.timestamp, from, to)));

	return result.count;
});

export type TotalUniqueReferrers = { referrer: string; count: number }[];

export const getTotalUniqueReferrers = query(
	dateRangeSchema,
	async ([from, to]): Promise<TotalUniqueReferrers> => {
		const user = await mustAuthenticate();

		const referrerCount = count(linkVisit.referrer).as('count');

		return await db
			.select({ count: referrerCount, referrer: linkVisit.referrer })
			.from(linkVisit)
			.innerJoin(links, eq(linkVisit.linkId, links.id))
			.where(and(eq(links.userId, user.id), between(linkVisit.timestamp, from, to)))
			.groupBy(linkVisit.referrer)
			.orderBy(desc(referrerCount));
	}
);
