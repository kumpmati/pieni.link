import { deleteLink, getAllLinks } from '$lib/server/database/handlers/links';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { logger } from '$lib/server/logger';

export const load = (async () => {
	return {
		links: await getAllLinks()
	};
}) satisfies PageServerLoad;

export const actions = {
	delete_link: async ({ locals, request }) => {
		const session = await locals.auth.validate();

		if (!session) error(401, 'unauthorized');
		if (session.user.role !== 'admin') error(403, 'forbidden');

		const id = (await request.formData()).get('id')?.toString() ?? null;

		if (!id) {
			error(400, 'missing id');
		}

		await deleteLink(id);

		logger.info(`Link ${id} deleted by user ${session.user.id} (${session.user.name})`);
	}
};
