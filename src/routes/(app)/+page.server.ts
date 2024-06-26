import { RESERVED_LINK_IDS } from '$lib/server/constants.js';
import { insertLink } from '$lib/server/database/handlers/links.js';
import { linkInsertSchema } from '$lib/server/database/schema/link.js';
import { logger } from '$lib/server/logger/index.js';
import { error, redirect } from '@sveltejs/kit';
import { fromZodError } from 'zod-validation-error';

export const actions = {
	create: async ({ request, locals }) => {
		if (!locals.user) {
			redirect(302, '/auth/signin');
		}

		const raw = Object.fromEntries(await request.formData());

		const body = linkInsertSchema.safeParse({ ...raw, userId: locals.user.id });
		if (!body.success) {
			error(400, fromZodError(body.error).message);
		}

		if (RESERVED_LINK_IDS.includes(body.data.id)) {
			error(400, 'cannot use a reserved url as an ID');
		}

		const link = await insertLink(body.data);

		logger.info(`New link: ${link.id} -> ${link.url} by user ${link.userId} (${locals.user.name})`);

		return link;
	}
};
