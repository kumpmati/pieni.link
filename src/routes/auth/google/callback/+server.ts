import { GOOGLE_OAUTH_COOKIE } from '$lib/server/auth/google';
import { auth, googleAuth } from '$lib/server/auth/lucia';
import { error, redirect } from '@sveltejs/kit';

export const GET = async ({ locals, url, cookies }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const stateCookie = cookies.get(GOOGLE_OAUTH_COOKIE);

	if (!code || !state || !stateCookie || state !== stateCookie) {
		error(401);
	}

	const { getExistingUser } = await googleAuth.validateCallback(code);

	const user = await getExistingUser();
	if (!user) {
		error(404, 'user not found');
	}

	// TODO: register

	const session = await auth.createSession({ userId: user.userId, attributes: {} });
	locals.auth.setSession(session);

	redirect(302, '/');
};
