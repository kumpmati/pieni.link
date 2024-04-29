import { db } from '$lib/server/database';
import { log } from '$lib/server/database/schema/log';
import { and, desc, gte, lt } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import dayjs from 'dayjs';
import { error } from '@sveltejs/kit';
import { logger } from '$lib/server/logger';

export const load = (async ({ url }) => {
	const lastMonth = dayjs().subtract(30, 'days').toDate();

	const level = parseInt(url.searchParams.get('level') || '40'); // default to 'warn'

	// delete old logs automatically
	await db.delete(log).where(lt(log.timestamp, lastMonth));

	return {
		logs: db
			.select()
			.from(log)
			.where(and(gte(log.timestamp, lastMonth), gte(log.level, level)))
			.orderBy(desc(log.timestamp))
	};
}) satisfies PageServerLoad;

export const actions = {
	delete_all_logs: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) {
			error(401, 'unauthorized');
		}

		await db.delete(log);

		logger.warn(`Logs cleared by ${session.user.id} (${session.user.name})`);
	}
};
