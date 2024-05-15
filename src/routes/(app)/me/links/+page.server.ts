import { deleteLink, getAllUserLinks } from '$lib/server/database/handlers/links';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { logger } from '$lib/server/logger';

export const load = (async ({ locals }) => {
	if (!locals.user) {
		error(401, 'unauthorized');
	}

	return {
		links: await getAllUserLinks(locals.user.id)
	};
}) satisfies PageServerLoad;

export const actions = {
	delete_link: async ({ locals, request }) => {
		if (!locals.user) {
			error(401, 'unauthorized');
		}

		const id = (await request.formData()).get('id')?.toString() ?? null;

		if (!id) {
			error(400, 'missing id');
		}

		await deleteLink(id);

		logger.info(`Link ${id} deleted by user ${locals.user.id} (${locals.user.name})`);
	}
};
