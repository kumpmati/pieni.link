import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getUserLinksPaginated } from '$lib/server/database/handlers/links';
import { getOverallLinkStatistics } from '$lib/server/database/handlers/analytics';
import { getUserApiKeys } from '$lib/server/database/handlers/api';

export const load = (async ({ locals }) => {
	if (!locals.session) {
		error(401, 'unauthorized');
	}

	return {
		links: await getUserLinksPaginated(locals.session.user.id, 5, 0),
		stats: getOverallLinkStatistics(locals.session.user.id),
		apiKeys: await getUserApiKeys(locals.session.user.id)
	};
}) satisfies PageServerLoad;
