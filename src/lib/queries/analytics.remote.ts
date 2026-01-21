import { UAParser } from 'ua-parser-js';
import { query } from '$app/server';
import { db } from '$lib/server/database';
import { and, between, eq, sql } from 'drizzle-orm';
import { authenticate } from './helpers';
import { error } from '@sveltejs/kit';
import { linkVisit } from '$lib/server/database/schema/analytics';
import { links } from '$lib/server/database/schema/link';
import z from 'zod';

const dateRangeSchema = z.array(z.date()).length(2);

export const getTotalVisits = query(dateRangeSchema, async (dateRange) => {
	const { user } = await authenticate();
	if (!user) error(401, 'unauthorized');

	const [from, to] = dateRange;

	const [totalVisits] = await db
		.select({ count: sql<number>`cast(count(*) as int)` })
		.from(linkVisit)
		.innerJoin(links, eq(linkVisit.linkId, links.id))
		.where(and(eq(links.userId, user.id), between(linkVisit.timestamp, from, to)));

	return totalVisits.count;
});

export const getMostCommon = query(dateRangeSchema, async (dateRange) => {
	const { user } = await authenticate();
	if (!user) error(401, 'unauthorized');

	const [from, to] = dateRange;

	const allVisits = await db
		.select({ ua: linkVisit.userAgent })
		.from(linkVisit)
		.innerJoin(links, eq(linkVisit.linkId, links.id))
		.where(and(eq(links.userId, user.id), between(linkVisit.timestamp, from, to)));

	const osCounts: Record<string, number> = {};
	const browserCounts: Record<string, number> = {};

	for (const { ua } of allVisits) {
		const parser = new UAParser(ua);

		const os = parser.getOS().name ?? '-';
		osCounts[os] ??= 0;
		osCounts[os] += 1;

		const browser = parser.getBrowser().name ?? '-';
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
