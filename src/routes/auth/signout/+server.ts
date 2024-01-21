import { auth } from '$lib/server/auth/lucia';
import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) {
		error(401);
	}

	await auth.invalidateSession(session.sessionId);
	locals.auth.setSession(null);

	redirect(302, '/');
};
