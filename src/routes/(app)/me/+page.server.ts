import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { getUserLinksPaginated } from '$lib/server/database/handlers/links';
import { getOverallLinkStatistics } from '$lib/server/database/handlers/analytics';
import { deleteUser } from '$lib/server/database/handlers/user';
import { getUserApiKeys } from '$lib/server/database/handlers/api';
import { logger } from '$lib/server/logger';

export const load = (async ({ parent }) => {
	const { session } = await parent();

	if (!session) {
		error(401, 'unauthorized');
	}

	return {
		links: await getUserLinksPaginated(session.user.id, 5, 0),
		stats: getOverallLinkStatistics(session.user.id),
		apiKeys: await getUserApiKeys(session.user.id)
	};
}) satisfies PageServerLoad;

export const actions = {
	delete_account: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) {
			error(401, 'unauthorized');
		}

		await deleteUser(session.user.id);
		locals.auth.invalidate();

		logger.warn(`Account deleted: ${session.user.id} (${session.user.name})`);

		redirect(302, '/');
	}
};
