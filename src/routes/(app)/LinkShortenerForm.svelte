<script lang="ts">
	import IconClose from '@ktibow/iconset-material-symbols/close';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { createLink, getAllOwnLinks } from '$lib/queries/link.remote';
	import type { Link } from '$lib/server/database/schema/link';
	import { getFullURL } from '$lib/utils';
	import { snackbar, TextFieldOutlined } from 'm3-svelte';

	type Props = {
		onComplete?: (link: Link) => void;
		onClear?: () => void;
	};

	let { onComplete, onClear }: Props = $props();

	let loading = $state(false);
	let value = $state('');
	let shortLink = $state<Link | null>(null);

	const handleClear = () => {
		shortLink = null;
		value = '';

		onClear?.();
	};

	const handlePaste = (e: ClipboardEvent) => {
		const pastedText = e.clipboardData?.getData('text');
		if (!pastedText) return;

		value = pastedText;
		handleSubmit();
	};

	const handleSubmit = async (e?: Event) => {
		console.log('submit');
		e?.preventDefault();

		try {
			loading = true;

			shortLink = await createLink(value).updates(getAllOwnLinks(5));

			if (!shortLink) {
				snackbar('Failed to create link'); // TODO: show error to user
				return;
			}

			onComplete?.(shortLink);

			// replace text field content with short link
			value = getFullURL(shortLink);

			// copy link to clipboard
			await navigator.clipboard.writeText(value);

			// show notification where user can edit
			const editUrl = resolve('/(app)/l/[id]', { id: shortLink.id });
			snackbar('Copied short link to clipboard', { Edit: () => goto(editUrl) }, true, 5 * 1000);
		} finally {
			loading = false;
		}
	};
</script>

<form style="display: contents;" onsubmit={handleSubmit}>
	<TextFieldOutlined
		required
		autocomplete="off"
		type="url"
		bind:value
		disabled={loading}
		readonly={!!shortLink}
		label={shortLink ? 'Short link' : 'Paste a link to shorten it'}
		trailing={shortLink ? { icon: IconClose, onclick: handleClear } : undefined}
		onpaste={handlePaste}
	/>
</form>
