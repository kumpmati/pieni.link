<script lang="ts">
	import { enhance } from '$app/forms';
	import { PUBLIC_BASEURL } from '$env/static/public';
	import IconX from '~icons/tabler/x';
	import IconCopy from '~icons/tabler/copy';
	import type { Link } from '$lib/server/database/schema/link';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { tick } from 'svelte';
	import { toast } from 'svelte-sonner';
	import * as Card from '$lib/components/ui/card';
	import Button from '$lib/components/ui/button/button.svelte';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';

	let form: HTMLFormElement;

	let inputElement: HTMLInputElement;
	let loading = false;
	let shortenedLink: Link | null = null;
	let links: Link[] = [];

	const copyLink = async (link: Link) => {
		const url = `${PUBLIC_BASEURL}/${link.id}`;

		await navigator.clipboard.writeText(url);

		toast.success('Link copied!', {
			description: `Copied '${url}' to clipboard.`,
			dismissable: true
		});
	};

	const handleOnPaste = async () => {
		await tick();
		form.requestSubmit();
	};

	const handleSubmit: SubmitFunction = ({ formElement }) => {
		loading = true;
		shortenedLink = null;

		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					shortenedLink = result.data as Link;
					links = [shortenedLink, ...links];
					await copyLink(shortenedLink);
					break;

				case 'error':
					toast.error('Failed to shorten link', {
						description: (result.error as Error)?.message ?? 'unknown error',
						dismissable: true
					});

					break;

				case 'redirect':
					await update({ reset: false });
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
		<!-- svelte-ignore a11y-autofocus -->
		<input
			autofocus
			bind:this={inputElement}
			name="url"
			type="url"
			required
			placeholder="Paste a link here to shorten it"
			on:paste={handleOnPaste}
			disabled={loading}
			class="text-md flex w-full rounded-md border border-input bg-slate-800 px-5 py-4 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 sm:px-5 sm:py-4 sm:text-lg"
			value={shortenedLink ? `${PUBLIC_BASEURL}/${shortenedLink.id}` : ''}
		/>
	</form>

	{#if links.length > 0}
		<ul class="mt-2 flex w-full flex-col gap-2" in:fly={{ duration: 200, y: -5 }}>
			{#each links as link, i (link.id)}
				<li animate:flip={{ duration: 200 }}>
					<Card.Root class="relative flex w-full px-4 py-3">
						<Card.Header class="p-0">
							<Card.Title class="inline-flex gap-1 text-sm">
								{`${PUBLIC_BASEURL}/${link.id}`}

								<Button variant="ghost" size="icon" class="h-6 w-6" on:click={() => copyLink(link)}>
									<IconCopy width={12} height={12} />
								</Button>
							</Card.Title>
							<Card.Description class="text-xs">
								{link.url}
							</Card.Description>
						</Card.Header>

						<Button
							variant="ghost"
							size="icon"
							class="absolute right-2 top-2 ml-auto"
							on:click={() => {
								links.splice(i, 1);
								links = links;
							}}
						>
							<IconX width={16} height={16} />
						</Button>
					</Card.Root>
				</li>
			{/each}
		</ul>
	{/if}
</div>
