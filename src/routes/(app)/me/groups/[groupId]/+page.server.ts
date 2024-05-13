import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getUserGroupById, insertLinkIntoGroup } from '$lib/server/database/handlers/group';

export const load = (async ({ locals, params }) => {
	const session = await locals.auth.validate();

	if (!session) error(401, 'unauthorized');

	return {
		group: await getUserGroupById(session.user.id, params.groupId)
	};
}) satisfies PageServerLoad;

export const actions = {
	add_link: async ({ locals, request, params }) => {
		const session = await locals.auth.validate();

		if (!session) error(401, 'unauthorized');

		// TODO: verify that user owns group
		const linkId = (await request.formData()).get('linkId')?.toString();

		if (!linkId) error(400, 'missing link id');

		await insertLinkIntoGroup(params.groupId, linkId);
	}
};
