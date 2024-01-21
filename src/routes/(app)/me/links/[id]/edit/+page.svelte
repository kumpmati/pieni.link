<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { IconChevronLeft, IconDeviceFloppy, IconLoader } from '@tabler/icons-svelte';
	import type { PageData } from './$types';
	import Input from '$lib/components/ui/input/input.svelte';
	import { enhance } from '$app/forms';
	import Label from '$lib/components/ui/label/label.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';

	export let data: PageData;

	let loading = false;

	const handleSubmit: SubmitFunction = () => {
		loading = true;

		return async ({ update, result }) => {
			switch (result.type) {
				case 'redirect':
					toast('Link updated!');
					break;

				case 'success':
					toast('Link updated!');
					break;

				case 'error':
					toast(result.error?.message ?? result.error);
					break;

				default:
					console.log(result);
					break;
			}

			await update();
			loading = false;
		};
	};
</script>

<div class="flex flex-col gap-2">
	<Button href="/me" variant="link" class="w-fit gap-1 pl-2">
		<IconChevronLeft size={16} /> Back to profile
	</Button>

	<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight">Edit link</h1>

	<form method="post" use:enhance={handleSubmit} class="flex flex-col gap-2">
		<Label>
			ID
			<Input required name="id" value={data.link.id} />
		</Label>

		<Label>
			URL
			<Input required name="url" value={data.link.url} type="url" />
		</Label>

		<Button type="submit" class="ml-auto w-fit" disabled={loading}>
			{#if loading}
				<IconLoader size={16} class="animate-spin" /> Saving changes
			{:else}
				<IconDeviceFloppy size={16} /> Save changes
			{/if}
		</Button>
	</form>
</div>
