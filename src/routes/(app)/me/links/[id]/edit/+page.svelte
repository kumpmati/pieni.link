<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { IconDeviceFloppy, IconLoader, IconTrash } from '@tabler/icons-svelte';
	import type { PageData } from './$types';
	import Input from '$lib/components/ui/input/input.svelte';
	import { enhance } from '$app/forms';
	import Label from '$lib/components/ui/label/label.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';
	import * as Card from '$lib/components/ui/card';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Switch } from '$lib/components/ui/switch';
	import DatePicker from '$lib/components/DatePicker.svelte';

	export let data: PageData;

	let loading = false;
	let expires = !!data.link.validStart;

	const handleSubmit: SubmitFunction = () => {
		loading = true;

		return async ({ update, result }) => {
			switch (result.type) {
				case 'redirect':
					toast.success('Link updated!');
					await update();
					break;

				case 'success':
					toast.success('Link updated!');
					await update();
					break;

				case 'error':
					if (result.error?.code === '23505') {
						toast.error('Error: ID already in use');
						break;
					}

					toast.error(result.error?.message ?? result?.error?.detail ?? 'unknown error');
					break;

				default:
					console.log(result);
					break;
			}

			loading = false;
		};
	};
</script>

<svelte:head>
	<title>Edit link</title>
</svelte:head>

<div class="flex w-full flex-col gap-2">
	<Card.Root>
		<Card.Header>
			<Card.Title>Edit link</Card.Title>
			<Card.Description>Update the link's information</Card.Description>
		</Card.Header>

		<Card.Content>
			<form method="post" use:enhance={handleSubmit} action="?/update" class="flex flex-col gap-4">
				<Label>
					ID
					<Input required name="id" value={data.link.id} class="mt-1" />
				</Label>

				<Label>
					URL
					<Input required name="url" value={data.link.url} type="url" class="mt-1" />
				</Label>

				<Label>
					Expires after
					<DatePicker value={data.link.validEnd} />
				</Label>

				<Button type="submit" class="w-fit gap-1" disabled={loading}>
					{#if loading}
						<IconLoader size={16} class="animate-spin" /> Saving changes
					{:else}
						<IconDeviceFloppy size={16} /> Save changes
					{/if}
				</Button>
			</form>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>Danger zone</Card.Title>
			<Card.Description>Make sure you know what you're doing!</Card.Description>
		</Card.Header>

		<Card.Content>
			<AlertDialog.Root>
				<AlertDialog.Trigger>
					<Button type="button" variant="destructive" class="gap-1">
						<IconTrash size={16} /> Delete link
					</Button>
				</AlertDialog.Trigger>

				<AlertDialog.Content>
					<AlertDialog.Header>
						<AlertDialog.Title>Are you sure?</AlertDialog.Title>
						<AlertDialog.Description>
							This will permanently delete the link and all associated analytics.
						</AlertDialog.Description>
					</AlertDialog.Header>

					<form method="post" action="?/delete" use:enhance class="flex justify-end gap-2">
						<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>

						<Button variant="destructive" type="submit" class="gap-1">
							<AlertDialog.Action type="button" asChild class="contents">
								<IconTrash size={16} /> Delete
							</AlertDialog.Action>
						</Button>
					</form>
				</AlertDialog.Content>
			</AlertDialog.Root>
		</Card.Content>
	</Card.Root>
</div>
