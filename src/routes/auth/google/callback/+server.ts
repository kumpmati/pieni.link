import { AUTH_TYPE_COOKIE, SIGNUP_TOKEN_COOKIE } from '$lib/server/auth';
import { GOOGLE_OAUTH_COOKIE } from '$lib/server/auth/google';
import { auth, googleAuth } from '$lib/server/auth/lucia';
import { consumeSignupToken } from '$lib/server/auth/signupToken';
import { db } from '$lib/server/database/index.js';
import { signupToken } from '$lib/server/database/schema/auth.js';
import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const GET = async ({ locals, url, cookies }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const stateCookie = cookies.get(GOOGLE_OAUTH_COOKIE);
	const typeCookie = cookies.get(AUTH_TYPE_COOKIE);
	cookies.delete(AUTH_TYPE_COOKIE, { path: '/' });
	const signupTokenCookie = cookies.get(SIGNUP_TOKEN_COOKIE);

	if (!code || !state || !stateCookie || state !== stateCookie) {
		error(401);
	}

	const { getExistingUser, createUser, googleUser } = await googleAuth.validateCallback(code);

	const user = await getExistingUser();

	switch (typeCookie) {
		default:
		case 'signin': {
			if (!user) {
				error(404, 'user not found');
			}

			const session = await auth.createSession({ userId: user.userId, attributes: {} });
			locals.auth.setSession(session);
			break;
		}

		case 'signup': {
			if (!signupTokenCookie) {
				error(401, 'no signup token provided');
			}

			if (user) {
				// behave as if signing in
				const session = await auth.createSession({ userId: user.userId, attributes: {} });
				locals.auth.setSession(session);
				break;
			}

			const newUser = await createUser({
				attributes: {
					email: googleUser.email ?? null,
					name: googleUser.name,
					image: googleUser.picture,
					role: await consumeSignupToken(signupTokenCookie)
				}
			});

			// update signup token to contain created user's id
			await db
				.update(signupToken)
				.set({ userId: newUser.id })
				.where(eq(signupToken.id, signupTokenCookie));

			const session = await auth.createSession({ userId: newUser.userId, attributes: {} });
			locals.auth.setSession(session);
			break;
		}
	}

	redirect(302, '/');
};
