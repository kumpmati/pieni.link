import { db } from '$lib/server/database/index.js';
import { createSignupTokenSchema, signupToken } from '$lib/server/database/schema/auth.js';
import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const actions = {
	create_invite: async ({ request, locals }) => {
		const session = await locals.auth.validate();
		if (!session) {
			error(401, 'unauthorized');
		}

		if (session.user.role !== 'admin') {
			error(403, 'forbidden');
		}

		const raw = Object.fromEntries(await request.formData());

		const body = createSignupTokenSchema.safeParse(raw);
		if (!body.success) {
			error(400, body.error.message);
		}

		const rows = await db.insert(signupToken).values({ role: body.data.role }).returning();
		if (rows.length === 0) {
			error(500, 'failed to create signup token');
		}

		redirect(302, '/me/admin?view=invites');
	},

	delete_invite: async ({ request, locals }) => {
		const session = await locals.auth.validate();
		if (!session) {
			error(401, 'unauthorized');
		}

		if (session.user.role !== 'admin') {
			error(403, 'forbidden');
		}

		const raw = Object.fromEntries(await request.formData());

		const body = z.object({ id: z.string() }).safeParse(raw);
		if (!body.success) {
			error(400, body.error.message);
		}

		const response = await db.delete(signupToken).where(eq(signupToken.id, body.data.id));
		if (response.rowCount === 0) {
			error(500, 'failed to delete signup token');
		}
	}
};
