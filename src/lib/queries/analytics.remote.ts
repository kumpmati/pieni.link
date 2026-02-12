import { UAParser } from 'ua-parser-js';
import { command, query } from '$app/server';
import { db } from '$lib/server/database';
import { and, between, count, countDistinct, desc, eq, sql } from 'drizzle-orm';
import { mustAuthenticate } from './helpers';
import { linkVisit } from '$lib/server/database/schema/analytics';
import { links } from '$lib/server/database/schema/link';
import z from 'zod';
import {
	getAllUserVisitsGroupedByDay,
	getLinkVisitsGroupedByDay
} from '$lib/server/database/handlers/analytics';

const dateRangeSchema = z.tuple([z.date(), z.date()]);
const linkWithDateRangeSchema = z.object({ dateRange: dateRangeSchema, linkId: z.string() });

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
		.map(([name, count]) => ({ name, count, percentage: (count / allVisits.length) * 100 }));
});

export const getLinkMostCommonDevices = query(
	linkWithDateRangeSchema,
	async ({ linkId, dateRange }) => {
		await mustAuthenticate();

		const [from, to] = dateRange;

		// TODO: persist key user agent (os, browser, country) info in database to simplify query logic
		const allVisits = await db
			.select({ ua: linkVisit.userAgent })
			.from(linkVisit)
			// TODO: make sure user owns the link
			.where(and(eq(linkVisit.linkId, linkId), between(linkVisit.timestamp, from, to)));
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
			.map(([name, count]) => ({ name, count, percentage: (count / allVisits.length) * 100 }));
	}
);

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

export const getLinkMostCommonBrowsers = query(
	linkWithDateRangeSchema,
	async ({ linkId, dateRange }) => {
		await mustAuthenticate();

		const [from, to] = dateRange;

		// TODO: persist key user agent (os, browser, country) info in database to simplify query logic
		const allVisits = await db
			.select({ ua: linkVisit.userAgent })
			.from(linkVisit)
			// TODO: make sure user owns the link
			.where(and(eq(linkVisit.linkId, linkId), between(linkVisit.timestamp, from, to)));

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
	}
);

export type VisitsByDay = {
	day: string;
	count: number;
}[];

export const getAllVisitsByDay = query(dateRangeSchema, async (dateRange): Promise<VisitsByDay> => {
	const user = await mustAuthenticate();

	return await getAllUserVisitsGroupedByDay(user.id, dateRange);
});

export const getLinkVisitsByDay = query(
	linkWithDateRangeSchema,
	async ({ dateRange, linkId }): Promise<VisitsByDay> => {
		await mustAuthenticate();

		// TODO: make sure user owns the link
		return getLinkVisitsGroupedByDay(linkId, dateRange);
	}
);

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

export const getLinkUniqueUsers = query(
	linkWithDateRangeSchema,
	async ({ linkId, dateRange }): Promise<number> => {
		await mustAuthenticate();

		const [from, to] = dateRange;

		// TODO: make sure user owns the link

		// TODO: user agent is not indexed, see if indexing it helps
		const [result] = await db
			.select({ count: countDistinct(linkVisit.userAgent) })
			.from(linkVisit)
			.where(and(eq(linkVisit.linkId, linkId), between(linkVisit.timestamp, from, to)));

		return result.count;
	}
);

export type UniqueReferrers = { referrer: string; count: number }[];

export const getTotalUniqueReferrers = query(
	dateRangeSchema,
	async ([from, to]): Promise<UniqueReferrers> => {
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

export const getLinkUniqueReferrers = query(
	linkWithDateRangeSchema,
	async ({ linkId, dateRange }): Promise<UniqueReferrers> => {
		await mustAuthenticate();

		const [from, to] = dateRange;

		const referrerCount = count(linkVisit.referrer).as('count');

		// TODO: make sure user owns link
		return await db
			.select({ count: referrerCount, referrer: linkVisit.referrer })
			.from(linkVisit)
			.where(and(eq(linkVisit.linkId, linkId), between(linkVisit.timestamp, from, to)))
			.groupBy(linkVisit.referrer)
			.orderBy(desc(referrerCount));
	}
);

export const getAllLinkVisits = command(z.string(), async (linkId) => {
	await mustAuthenticate();
	return await db
		.select({
			userAgent: linkVisit.userAgent,
			timestamp: linkVisit.timestamp,
			referrer: linkVisit.referrer
		})
		.from(linkVisit)
		.where(eq(linkVisit.linkId, linkId));
});
