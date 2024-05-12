import type { AuthUser } from '../schema/auth';
import { getUserNumApiKeys } from './api';
import { getNumAllLinks, getNumLinksByUser } from './links';
import { getNumSignupTokens } from './signupToken';
import { getNumUsers } from './user';

export type UserCounts = {
	numLinks: number;
	numApiKeys: number;
	numAllUsers: number | null;
	numInvites: number | null;
	numAllLinks: number | null;
};

export const getUserCounts = async (user: AuthUser): Promise<UserCounts> => {
	const [numLinks, numApiKeys, numAllUsers, numInvites, numAllLinks] = await Promise.all([
		getNumLinksByUser(user.id),
		getUserNumApiKeys(user.id),
		user.role === 'admin' ? getNumUsers() : null,
		user.role === 'admin' ? getNumSignupTokens() : null,
		user.role === 'admin' ? getNumAllLinks() : null
	]);

	return {
		numLinks,
		numApiKeys,
		numAllUsers,
		numInvites,
		numAllLinks
	};
};
