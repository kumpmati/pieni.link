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

	const start = performance.now();

	// we can pass `event` because we used the SvelteKit middleware
	event.locals.auth = auth.handleRequest(event);

	const response = await resolve(event);
	const end = performance.now();

	// ignore /me/admin/logs so that refreshing it doesn't bloat the logs
	if (!event.url.pathname.startsWith('/me/admin/logs')) {
		logger.debug(
			`${event.request.method} ${event.url.pathname}${event.url.search}: took ${Math.round(end - start)} ms`
		);
	}

	return response;
};

export const handleError: HandleServerError = async ({ message, event }) => {
	logger.error(`${event.request.method} ${event.url.pathname}: ${message}`);

	return {
		message,
		errorId: nanoid()
	};
};
