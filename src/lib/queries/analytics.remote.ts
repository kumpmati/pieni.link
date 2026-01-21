import { UAParser } from 'ua-parser-js';
import { query } from '$app/server';
import { db } from '$lib/server/database';
import { and, between, countDistinct, eq, sql } from 'drizzle-orm';
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

export const getMostCommon = query(dateRangeSchema, async ([from, to]) => {
	const user = await mustAuthenticate();

	// TODO: persist key user agent (os, browser, country) info in database to simplify query logic
	const allVisits = await db
		.select({ ua: linkVisit.userAgent })
		.from(linkVisit)
		.innerJoin(links, eq(linkVisit.linkId, links.id))
		.where(and(eq(links.userId, user.id), between(linkVisit.timestamp, from, to)));

	const osCounts: Record<string, number> = {};
	const browserCounts: Record<string, number> = {};

	for (const { ua } of allVisits) {
		const parser = new UAParser(ua);

		const os = parser.getOS().name ?? '';
		osCounts[os] ??= 0;
		osCounts[os] += 1;

		const browser = parser.getBrowser().name ?? '';
		browserCounts[browser] ??= 0;
		browserCounts[browser] += 1;
	}

	const os = Object.entries(osCounts)
		.toSorted((a, b) => b[1] - a[1])
		.map(([name, count]) => ({
			name,
			count,
			percentage: (count / allVisits.length) * 100
		}));

	const browser = Object.entries(browserCounts)
		.toSorted((a, b) => b[1] - a[1])
		.map(([name, count]) => ({
			name,
			count,
			percentage: (count / allVisits.length) * 100
		}));

	return {
		os,
		browser,
		total: allVisits.length
	};
});

export const getAllVisitsByDay = query(dateRangeSchema, async (dateRange) => {
	const user = await mustAuthenticate();

	return await getAllUserVisitsGroupedByDay(user.id, dateRange);
});

export const getExtraStats = query(dateRangeSchema, async ([from, to]) => {
	const user = await mustAuthenticate();

	// TODO: user agent is not indexed, see if indexing it helps
	const [result] = await db
		.select({
			uaCount: countDistinct(linkVisit.userAgent),
			referrerCount: countDistinct(linkVisit.referrer)
		})
		.from(linkVisit)
		.innerJoin(links, eq(linkVisit.linkId, links.id))
		.where(and(eq(links.userId, user.id), between(linkVisit.timestamp, from, to)));

	return result;
});
