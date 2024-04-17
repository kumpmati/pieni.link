import type { PageServerLoad } from './$types';
import { getLinkVisits } from '$lib/server/database/handlers/analytics';

export const load = (async ({ params }) => {
	return {
		visits: getLinkVisits(params.id)
	};
}) satisfies PageServerLoad;
