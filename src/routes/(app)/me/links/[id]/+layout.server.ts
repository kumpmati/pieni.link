import { getLinkStatistics } from '$lib/server/database/handlers/analytics';
import { getUserLink } from '$lib/server/database/handlers/links.js';
import { error } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
	if (!locals.user) {
		error(401, 'unauthorized');
	}

	return {
		link: await getUserLink(params.id, locals.user.id),
		stats: getLinkStatistics(params.id)
	};
};
