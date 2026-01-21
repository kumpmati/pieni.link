import { getRequestEvent } from '$app/server';
import { auth } from '$lib/server/auth';

/**
 * Can be used server-side to retrieve the session and user for the current request
 */
export const authenticate = async () => {
	const event = getRequestEvent();
	const result = await auth.api.getSession({ headers: event.request.headers });

	return {
		session: result?.session ?? null,
		user: result?.user ?? null
	};
};
