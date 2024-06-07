import { getGroupById, getLinksInGroup } from '$lib/server/database/handlers/group';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	return {
		group: await getGroupById(params.id),
		links: await getLinksInGroup(params.id)
	};
}) satisfies PageServerLoad;
