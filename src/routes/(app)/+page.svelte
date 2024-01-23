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
		toast.success('Link copied!', {
			description: `Copied '${link}' to clipboard.`,
			dismissable: true
		});
	};

	const handleOnPaste = async () => {
		await tick();
		form.requestSubmit();
	};

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		shortenedLink = null;
		error = null;

		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					shortenedLink = result.data as Link;
					await copyCurrentLink();
					break;

				case 'error':
					error = result.error;
					break;

				case 'redirect':
					await update();
			}
			loading = false;
		};
	};
</script>

<svelte:head>
	<title>Pieni - A modern, simple URL shortener</title>
	<meta name="description" content="A modern, simple URL shortener." />
	<meta name="keywords" content="URL, shortener, private, link, tiny" />
	<meta name="author" content="github.com/kumpmati" />
</svelte:head>

<div class="mx-auto flex h-full w-full max-w-md flex-col items-center justify-center gap-2">
	<form
		bind:this={form}
		use:enhance={handleSubmit}
		method="post"
		action="?/create"
		class="flex w-full items-center gap-0"
	>
		{#if !shortenedLink}
			<Input
				autofocus
				name="url"
				type="url"
				required
				placeholder="Paste a long link here to shorten..."
				on:paste={handleOnPaste}
				disabled={loading}
				class="text-md rounded-r-none p-5"
			/>

			<Button
				type="submit"
				variant={loading ? 'ghost' : 'default'}
				size="icon"
				title="Shorten link"
				disabled={loading}
				class="h-full w-fit rounded-l-none border-l-0 px-2 py-2"
			>
				{#if loading}
					<IconLoader size={24} stroke={1.5} class="animate-spin" />
				{:else}
					<IconSend2 size={24} stroke={1.5} />
				{/if}
			</Button>
		{:else}
			<Input
				name="url"
				type="url"
				readonly
				on:focus={(e) => e.currentTarget.select()}
				value="{PUBLIC_BASEURL}/{shortenedLink.id}"
				class="text-md rounded-r-none p-5"
			/>

			<Button
				type="reset"
				on:click={reset}
				size="icon"
				variant="secondary"
				title="Shorten another link"
				class="h-full w-fit rounded-l-none border-l-0 px-2 py-2"
			>
				<IconRotate size={24} stroke={1.5} />
			</Button>
		{/if}
	</form>

	{#if error}
		<p class="text-destructive" transition:flyAndScale>
			{error?.message ?? 'unknown error'}
		</p>
	{/if}
</div>
