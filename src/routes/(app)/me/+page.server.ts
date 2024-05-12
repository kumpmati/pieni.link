import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getUserLinksPaginated } from '$lib/server/database/handlers/links';
import { getOverallLinkStatistics } from '$lib/server/database/handlers/analytics';
import { getUserApiKeys } from '$lib/server/database/handlers/api';

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
