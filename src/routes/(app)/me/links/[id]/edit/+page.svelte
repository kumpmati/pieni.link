<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { IconDeviceFloppy, IconLoader, IconTrash, IconEdit } from '@tabler/icons-svelte';
	import type { PageData } from './$types';
	import Input from '$lib/components/ui/input/input.svelte';
	import { enhance } from '$app/forms';
	import Label from '$lib/components/ui/label/label.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';
	import * as Card from '$lib/components/ui/card';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import DatePicker from '$lib/components/DatePicker.svelte';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import * as Dialog from '$lib/components/ui/dialog';

	dayjs.extend(relativeTime);

	export let data: PageData;

	let loading: string | null = null;
	let validUntil: Date | null = data.link.validUntil;
	let tempForm: HTMLFormElement;

	const handleSubmit: SubmitFunction = (e) => {
		loading = e.formElement.dataset.id as string;

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

			loading = null;
		};
	};
</script>

<svelte:head>
	<title>Edit link</title>
</svelte:head>

<div class="flex w-full flex-col gap-2">
	<Card.Root>
		<Card.Header>
			<Card.Title>Basic details</Card.Title>
			<Card.Description>Update the link's most common attributes</Card.Description>
		</Card.Header>

		<Card.Content>
			<form
				data-id="basic"
				method="post"
				use:enhance={handleSubmit}
				action="?/update"
				class="flex flex-col gap-4"
			>
				<Label>
					ID
					<Input required name="id" value={data.link.id} class="mt-1" />
				</Label>

				<Label>
					URL
					<Input required name="url" value={data.link.url} type="url" class="mt-1" />
				</Label>

				<Button type="submit" class="w-fit gap-1" disabled={loading === 'basic'}>
					{#if loading === 'basic'}
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
			<Card.Title>Temporary</Card.Title>
			<Card.Description>When enabled, the link will expire after a set time.</Card.Description>
		</Card.Header>

		<form
			data-id="temporary"
			id="temporary"
			method="post"
			action="?/update"
			use:enhance={handleSubmit}
			bind:this={tempForm}
		>
			<input type="hidden" name="validUntil" value={validUntil} />
		</form>

		<Card.Content class="flex flex-col gap-2">
			<Dialog.Root>
				<Dialog.Trigger class="{buttonVariants({ variant: 'outline' })} w-fit gap-2">
					<IconEdit size={16} />

					{#if data.link.validUntil}
						Expires {dayjs(data.link.validUntil).fromNow()}
					{:else}
						Doesn't expire
					{/if}
				</Dialog.Trigger>

				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>Set expiry time</Dialog.Title>
						<Dialog.Description>Determine when the link will expire</Dialog.Description>
					</Dialog.Header>

					<DatePicker value={data.link.validUntil} on:change={(e) => (validUntil = e.detail)} />

					<Dialog.Footer class="mt-2">
						<Button type="submit" form="temporary" class="gap-2" disabled={loading === 'temporary'}>
							{#if loading === 'temporary'}
								<IconLoader size={16} class="animate-spin" /> Saving changes
							{:else}
								<IconDeviceFloppy size={16} />
								Save changes
							{/if}
						</Button>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Root>
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
