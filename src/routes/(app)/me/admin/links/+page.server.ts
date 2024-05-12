import { getAllLinks } from '$lib/server/database/handlers/links';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {
		links: await getAllLinks()
	};
}) satisfies PageServerLoad;
