import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { deleteLink, getAllUserLinks } from '$lib/server/database/handlers/links';
import { getOverallLinkStatistics } from '$lib/server/database/handlers/analytics';
import { deleteUser } from '$lib/server/database/handlers/user';
import { getUserApiKeys } from '$lib/server/database/handlers/api';

export const load = (async ({ parent }) => {
	const { session } = await parent();

	if (!session) {
		error(401, 'unauthorized');
	}

	return {
		links: await getAllUserLinks(session.user.id),
		stats: getOverallLinkStatistics(session.user.id),
		apiKeys: await getUserApiKeys(session.user.id)
	};
}) satisfies PageServerLoad;

export const actions = {
	delete_link: async ({ locals, request }) => {
		const id = (await request.formData()).get('id')?.toString() ?? null;

		if (!id) {
			error(400, 'missing id');
		}

		if (!(await locals.auth.validate())) {
			error(401, 'unauthorized');
		}

		await deleteLink(id);
	},

	delete_account: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) {
			error(401, 'unauthorized');
		}

		await deleteUser(session.user.id);
		locals.auth.invalidate();

		redirect(302, '/');
	}
};
