<script lang="ts">
	import type { PageData, SubmitFunction } from './$types';
	import ApiKeysTable from './ApiKeysTable.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import IconCheck from '~icons/tabler/check';
	import IconCopy from '~icons/tabler/copy';
	import IconPlus from '~icons/tabler/plus';
	import * as Dialog from '$lib/components/ui/dialog';
	import { enhance } from '$app/forms';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import type { ApiKey } from '$lib/server/database/schema/api';
	import { toast } from 'svelte-sonner';
	import Header from '$lib/components/Header.svelte';

	export let data: PageData;

	let dialogOpen = false;
	let dialogData: ApiKey | null = null;
	let isCopied = false;

	const handleCreateEnhance: SubmitFunction = () => {
		return async ({ update, result }) => {
			await update({ reset: false });

			if (result.type === 'success') {
				dialogOpen = true;
				dialogData = result.data as ApiKey;
			}
		};
	};

	const copySecret = async () => {
		if (!dialogData) {
			return toast.error('The secret is no longer available');
		}

		try {
			await navigator.clipboard.writeText(dialogData.secret);
			toast.success('Copied to clipboard');

			isCopied = true;
			setTimeout(() => (isCopied = false), 2000);
		} catch (err) {
			toast.error('Copy failed', { description: (err as Error)?.message ?? 'unknown error' });
		}
	};
</script>

<svelte:head>
	<title>API keys</title>
</svelte:head>

<Header title="API keys" description="Give external applications access to your account's data" />

<Dialog.Root
	bind:open={dialogOpen}
	closeOnOutsideClick={false}
	closeOnEscape={false}
	onOpenChange={(isOpen) => {
		if (!isOpen) dialogData = null;
	}}
>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>API key created</Dialog.Title>
			<Dialog.Description>
				Make sure to save the below secret somewhere, as you won't be able to see it after closing
				this dialog.
			</Dialog.Description>
		</Dialog.Header>

		<div class="flex flex-col gap-2">
			<Label for="key">Key ID</Label>
			<Input id="key" type="text" readonly value={dialogData?.id} />

			<Label for="secret">Secret</Label>
			<span class="flex gap-1">
				<Input id="secret" type="text" readonly value={dialogData?.secret} />
				<Button variant="secondary" size="icon" on:click={copySecret}>
					{#if isCopied}
						<IconCheck width={16} height={16} />
					{:else}
						<IconCopy width={16} height={16} />
					{/if}
				</Button>
			</span>
		</div>

		<Dialog.Footer>
			<Button class="ml-auto w-fit" on:click={() => (dialogOpen = false)}>
				I've copied the values
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<form action="?/create_api_key" method="post" use:enhance={handleCreateEnhance}>
	<Button type="submit" class="mt-0 gap-2" variant="default">
		<IconPlus width={16} height={16} /> New API key
	</Button>
</form>

{#if data.apiKeys.length > 0}
	<ApiKeysTable keys={data.apiKeys} />
{/if}
