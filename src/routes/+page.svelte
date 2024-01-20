<script lang="ts">
	import { enhance } from '$app/forms';
	import { PUBLIC_BASEURL } from '$env/static/public';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import type { Link } from '$lib/server/database/schema/link';
	import { flyAndScale } from '$lib/utils';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { IconSend2, IconRotate, IconLoader } from '@tabler/icons-svelte';
	import { tick } from 'svelte';
	import { toast } from 'svelte-sonner';

	let form: HTMLFormElement;

	let loading = false;
	let shortenedLink: Link | null = null;
	let error: any = null;

	const reset = () => {
		loading = false;
		shortenedLink = null;
		error = null;
	};

	const copyCurrentLink = async () => {
		if (!shortenedLink) return;
		const link = `${PUBLIC_BASEURL}/${shortenedLink.id}`;
		await navigator.clipboard.writeText(link);
		toast('Link copied!', { description: `Copied '${link}' to clipboard.`, dismissable: true });
	};

	const handleOnPaste = async () => {
		await tick();
		form.requestSubmit();
	};

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		shortenedLink = null;
		error = null;

		return async ({ result }) => {
			switch (result.type) {
				case 'success':
					shortenedLink = result.data as Link;
					await copyCurrentLink();
					break;

				case 'error':
					error = result.error;
					break;
			}
			loading = false;
		};
	};
</script>

<svelte:head>
	<title>pieni.link</title>
</svelte:head>

<form
	bind:this={form}
	use:enhance={handleSubmit}
	method="post"
	action="?/create"
	class="flex w-full max-w-md gap-2"
>
	{#if !shortenedLink}
		<Input
			name="url"
			type="url"
			required
			placeholder="Enter a long link here"
			on:paste={handleOnPaste}
			disabled={loading}
		/>

		<Button
			type="submit"
			variant={loading ? 'ghost' : 'outline'}
			size="icon"
			title="Shorten link"
			disabled={loading}
		>
			{#if loading}
				<IconLoader size={16} class="animate-spin" />
			{:else}
				<IconSend2 size={16} />
			{/if}
		</Button>
	{:else}
		<Input
			name="url"
			type="url"
			readonly
			on:focus={(e) => e.currentTarget.select()}
			value="{PUBLIC_BASEURL}/{shortenedLink.id}"
		/>

		<Button type="reset" on:click={reset} size="icon" variant="ghost" title="Shorten another link">
			<IconRotate size={16} />
		</Button>
	{/if}
</form>

{#if error}
	<p class="text-destructive" transition:flyAndScale>
		{error?.message ?? 'unknown error'}
	</p>
{/if}
