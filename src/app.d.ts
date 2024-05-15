// See https://kit.svelte.dev/docs/types#app
import type { AuthUser } from '$lib/server/auth/lucia';
import type { ApiKey } from '$lib/server/database/schema/api';
import type { AuthRequest, Session } from 'lucia';
import 'unplugin-icons/types/svelte';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			auth: AuthRequest;
			session: Session | null;
			user: AuthUser | null;

			/**
			 * Only used inside /api routes!!
			 */
			apiKey: ApiKey;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	namespace Lucia {
		type Auth = import('$lib/server/auth/lucia').Auth;
		type DatabaseUserAttributes = {
			name: string;
			email: string | null;
			image: string | null;
			role: 'admin' | 'member';
		};
		type DatabaseSessionAttributes = {
			// TODO: add fields
		};
	}
}

export {};
