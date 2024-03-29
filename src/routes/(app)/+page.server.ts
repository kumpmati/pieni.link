import { RESERVED_LINK_IDS } from '$lib/server/constants.js';
import { insertLink } from '$lib/server/database/handlers/links.js';
import { linkInsertSchema } from '$lib/server/database/schema/link.js';
import { error, redirect } from '@sveltejs/kit';

export const actions = {
	create: async ({ request, locals }) => {
		const session = await locals.auth.validate();

		if (!session) {
			redirect(302, '/auth/signin');
		}

		const raw = Object.fromEntries(await request.formData());

		const body = linkInsertSchema.safeParse({ ...raw, userId: session.user.id });
		if (!body.success) {
			error(400, body.error.message);
		}

		if (RESERVED_LINK_IDS.includes(body.data.id)) {
			error(400, 'cannot use a reserved url as an ID');
		}

		return await insertLink(body.data);
	}
};
