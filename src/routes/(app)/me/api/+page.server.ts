import {
	createUserApiKey,
	deleteUserApiKey,
	getUserApiKeys
} from '$lib/server/database/handlers/api';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { apiKeySchema } from '$lib/server/database/schema/api';
import { logger } from '$lib/server/logger';

export const load = (async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) {
		error(401, 'unauthorized');
	}

	return {
		apiKeys: await getUserApiKeys(session.user.id)
	};
}) satisfies PageServerLoad;

export const actions = {
	create_api_key: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) {
			error(401, 'unauthorized');
		}

		const key = await createUserApiKey(session.user.id);

		logger.info(`API key ${key.id} created by ${session.user.id} (${session.user.name})`);

		return key;
	},

	delete_api_key: async ({ locals, request }) => {
		const session = await locals.auth.validate();
		if (!session) {
			error(401, 'unauthorized');
		}

		const raw = Object.fromEntries(await request.formData());

		const result = apiKeySchema.pick({ id: true }).safeParse(raw);
		if (!result.success) {
			error(400, 'no valid api key id specified');
		}

		await deleteUserApiKey(result.data.id, session.user.id);

		logger.info(
			`API key ${result.data.id} was deleted by ${session.user.id} (${session.user.name})`
		);
	}
};
