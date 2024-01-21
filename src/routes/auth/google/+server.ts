import { GOOGLE_OAUTH_COOKIE } from '$lib/server/auth/google';
import { googleAuth } from '$lib/server/auth/lucia';
import { redirect } from '@sveltejs/kit';

/**
 * When a user navigates to this URL, they are redirected to Google authentication.
 */
export const GET = async ({ cookies }) => {
	const [authURL, state] = await googleAuth.getAuthorizationUrl();

	cookies.set(GOOGLE_OAUTH_COOKIE, state, {
		path: '/',
		httpOnly: true, // only readable on the server
		maxAge: 60 * 60
	});

	redirect(302, authURL);
};
