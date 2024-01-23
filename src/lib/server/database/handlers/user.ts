import { desc, eq } from 'drizzle-orm';
import { db } from '..';
import { user, type AuthUser } from '../schema/auth';

export const getAllUsers = async () => {
	return await db.select().from(user).orderBy(desc(user.name));
};

export const deleteUser = async (userId: AuthUser['id']) => {
	await db.delete(user).where(eq(user.id, userId));
};
