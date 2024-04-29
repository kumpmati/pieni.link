import { goto } from '$app/navigation';

export const setUrlParams = (current: URL, params: Record<string, string>) => {
	const merged = new URLSearchParams(current.searchParams.toString());

	for (const key in params) {
		merged.set(key, params[key]);
	}

	return goto(`?${merged.toString()}`);
};
