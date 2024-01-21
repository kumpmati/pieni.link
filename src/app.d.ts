// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			auth: import('lucia').AuthRequest;
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
