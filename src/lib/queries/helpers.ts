import { getRequestEvent } from '$app/server';
import { auth } from '$lib/server/auth';
import { error } from '@sveltejs/kit';

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

/**
 * Returns user object if signed in, throws a '401 unauthorized' error if not.
 */
export const mustAuthenticate = async () => {
	const { user } = await authenticate();
	if (!user) error(401, 'unauthorized'); // TODO: ability to redirect to sign-in?

	return user;
};
