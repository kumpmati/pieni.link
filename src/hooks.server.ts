import { auth } from '$lib/server/auth/lucia';
import { getApiKeyBySecret } from '$lib/server/database/handlers/api';
import { logger } from '$lib/server/logger';
import { error, type Handle, type HandleServerError } from '@sveltejs/kit';
import { nanoid } from 'nanoid';

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/api')) {
		const token = event.request.headers.get('authorization');
		if (!token) {
			error(401, 'unauthorized');
		}

		const apiKey = await getApiKeyBySecret(token);
		if (!apiKey) {
			error(401, 'unauthorized');
		}

		event.locals.apiKey = apiKey;

		return await resolve(event);
	}

	// we can pass `event` because we used the SvelteKit middleware
	event.locals.auth = auth.handleRequest(event);

	return await resolve(event);
};

export const handleError: HandleServerError = async ({ message, event }) => {
	logger.error(`${event.request.method} ${event.url.pathname}: ${message}`);

	return {
		message,
		errorId: nanoid()
	};
};
