import {
	getLinkVisitsPerDay,
	getLinkVisitsPerReferrer
} from '$lib/server/database/handlers/analytics';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	return {
		visitsPerDay: getLinkVisitsPerDay(params.id),
		visitsPerReferrer: getLinkVisitsPerReferrer(params.id)
	};
}) satisfies PageServerLoad;
