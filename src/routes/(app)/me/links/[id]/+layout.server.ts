import { getUserLink } from '$lib/server/database/handlers/links.js';
import { error } from '@sveltejs/kit';

export const load = async ({ params, parent }) => {
	const { session } = await parent();

	if (!session) {
		error(401, 'unauthorized');
	}

	return {
		link: await getUserLink(params.id, session.user.id)
	};
};
