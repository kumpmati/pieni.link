import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './database';
import * as authSchema from './database/schema/auth-schema';
import {
	BETTER_AUTH_SECRET,
	BETTER_AUTH_URL,
	GOOGLE_OAUTH_ID,
	GOOGLE_OAUTH_SECRET
} from '$env/static/private';

export const auth = betterAuth({
	database: drizzleAdapter(db, { provider: 'pg', schema: authSchema }),

	baseURL: BETTER_AUTH_URL,
	secret: BETTER_AUTH_SECRET,

	socialProviders: {
		google: {
			clientId: GOOGLE_OAUTH_ID,
			clientSecret: GOOGLE_OAUTH_SECRET
		}
	}
});
