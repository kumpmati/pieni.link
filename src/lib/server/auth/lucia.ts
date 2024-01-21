import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { dev } from '$app/environment';
import { pg } from '@lucia-auth/adapter-postgresql';
import { google } from '@lucia-auth/oauth/providers';
import { GOOGLE_OAUTH_ID, GOOGLE_OAUTH_SECRET } from '$env/static/private';
import { pool } from '../database';
import { PUBLIC_BASEURL } from '$env/static/public';

const postgresAdapter = pg(pool, {
	user: 'auth_user',
	key: 'user_key',
	session: 'user_session'
});

export const auth = lucia({
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	adapter: postgresAdapter,
	getUserAttributes: (raw) => ({ ...raw })
});

export type Auth = typeof auth;
export type AuthUser = ReturnType<Auth['getUserAttributes']>;

export const googleAuth = google(auth, {
	clientId: GOOGLE_OAUTH_ID,
	clientSecret: GOOGLE_OAUTH_SECRET,
	redirectUri: PUBLIC_BASEURL + '/auth/google/callback'
});
