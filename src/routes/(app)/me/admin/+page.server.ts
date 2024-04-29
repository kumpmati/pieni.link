import { createSignupToken, deleteSignupToken } from '$lib/server/database/handlers/signupToken.js';
import { createSignupTokenSchema } from '$lib/server/database/schema/auth.js';
import { logger } from '$lib/server/logger/index.js';
import { error, redirect } from '@sveltejs/kit';

import { z } from 'zod';

export const actions = {
	create_invite: async ({ request, locals }) => {
		const session = await locals.auth.validate();

		if (!session) error(401, 'unauthorized');
		if (session.user.role !== 'admin') error(403, 'forbidden');

		const raw = Object.fromEntries(await request.formData());

		const body = createSignupTokenSchema.safeParse(raw);
		if (!body.success) {
			error(400, body.error.message);
		}

		await createSignupToken(body.data.role);

		logger.info(
			`New ${body.data.role} invite created by ${session.user.id} (${session.user.name})`
		);

		redirect(302, '/me/admin?view=invites');
	},

	delete_invite: async ({ request, locals }) => {
		const session = await locals.auth.validate();
		if (!session) error(401, 'unauthorized');
		if (session.user.role !== 'admin') error(403, 'forbidden');

		const raw = Object.fromEntries(await request.formData());

		const body = z.object({ id: z.string() }).safeParse(raw);
		if (!body.success) {
			error(400, body.error.message);
		}

		await deleteSignupToken(body.data.id);

		logger.info(`Invite ${body.data.id} deleted by ${session.user.id} (${session.user.name})`);
	}
};
