import { auth } from '$lib/server/auth/lucia';
import { type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// we can pass `event` because we used the SvelteKit middleware
	event.locals.auth = auth.handleRequest(event);

	// const session = await event.locals.auth.validate();

	// if (!session && !event.url.pathname.startsWith('/auth')) {
	// 	redirect(302, '/auth/signin');
	// }

	return await resolve(event);
};
