import { AUTH_TYPE_COOKIE } from '$lib/server/auth';
import { GOOGLE_OAUTH_COOKIE } from '$lib/server/auth/google';
import { googleAuth } from '$lib/server/auth/lucia';
import { error, redirect } from '@sveltejs/kit';

/**
 * When a user navigates to this URL, they are redirected to Google authentication.
 */
export const GET = async ({ cookies, url }) => {
	const [authURL, state] = await googleAuth.getAuthorizationUrl();

	cookies.set(GOOGLE_OAUTH_COOKIE, state, {
		path: '/',
		httpOnly: true, // only readable on the server
		maxAge: 60 * 60
	});

	const type = url.searchParams.get('type');

	if (type !== 'signup' && type !== 'signin') {
		error(400, 'no type specified');
	}

	cookies.set(AUTH_TYPE_COOKIE, type, {
		path: '/',
		httpOnly: true,
		maxAge: 60 * 60
	});

	redirect(302, authURL);
};
