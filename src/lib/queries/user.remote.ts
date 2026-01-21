import { query } from '$app/server';
import { authenticate } from './helpers';

export const getCurrentUser = query(async () => {
	const { user } = await authenticate();
	return user;
});
