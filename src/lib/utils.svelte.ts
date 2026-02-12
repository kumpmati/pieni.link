/**
 * Wraps an async function so that its loading state can be tracked.
 * @param func function to wrap
 * @returns
 */
export const wrap = <T, Arg>(func: (a: Arg) => T) => {
	let loading = $state(false);

	const run = async (arg: Arg) => {
		try {
			loading = true;
			return await func(arg);
		} finally {
			loading = false;
		}
	};

	return {
		get loading() {
			return loading;
		},
		run
	};
};
