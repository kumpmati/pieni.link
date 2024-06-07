<script lang="ts">
	import type { PageData } from './$types';
	import Header from '$lib/components/Header.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { enhance } from '$app/forms';
	import * as Dialog from '$lib/components/ui/dialog';
	import { buttonVariants } from '$lib/components/ui/button';
	import TablerEdit from '~icons/tabler/edit';
	import { twMerge } from 'tailwind-merge';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import TablerPlus from '~icons/tabler/plus';
	import type { Link } from '$lib/server/database/schema/link';
	import GroupLinkForm from './GroupLinkForm.svelte';
	import * as Card from '$lib/components/ui/card';

	dayjs.extend(relativeTime);

	export let data: PageData;

	let showEditDetails = false;
</script>

<svelte:head>
	<title>Groups / {data.group.name}</title>
</svelte:head>

<Header title="Groups / {data.group.name}" description={data.group.description}>
	<div class="flex gap-2">
		<Dialog.Root bind:open={showEditDetails}>
			<Dialog.Trigger class={twMerge(buttonVariants({ variant: 'outline' }), 'gap-2')}>
				<TablerEdit /> Edit
			</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Group details</Dialog.Title>
					<Dialog.Description>These are shown above all the links</Dialog.Description>
				</Dialog.Header>

				<form
					method="post"
					action="?/edit_group"
					use:enhance={() =>
						async ({ update }) => {
							await update({ reset: false });
							showEditDetails = false;
						}}
					class="contents"
				>
					<div class="flex flex-col gap-4">
						<Label class="flex flex-col">
							Title
							<Input name="name" required value={data.group.name} />
						</Label>

						<Label class="flex flex-col">
							Description (optional)
							<Textarea name="description" value={data.group.description} />
						</Label>
					</div>

					<Dialog.Footer>
						<Button type="submit" class="w-fit">Save changes</Button>
					</Dialog.Footer>
				</form>
			</Dialog.Content>
		</Dialog.Root>

		<Button href="/g/{data.group.id}" target="_blank" rel="noreferrer">View</Button>
	</div>
</Header>

<ul
	class="mt-4 grid w-full gap-4"
	style="grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));"
>
	{#each data.linksInGroup as item (item.itemId)}
		<li>
			<Card.Root class="relative h-full">
				<Card.Header>
					<Card.Title>{item.name}</Card.Title>
					<Card.Description class="overflow-hidden overflow-ellipsis whitespace-nowrap">
						{item.linkId} ({new URL(item.url).hostname})
					</Card.Description>
				</Card.Header>

				<GroupLinkForm
					links={data.allLinks}
					action="?/edit_group_link"
					deleteAction="?/delete_group_link"
					selected={item.id}
					initialData={item}
				>
					<Dialog.Trigger
						class={twMerge(
							buttonVariants({ variant: 'ghost', size: 'icon' }),
							'absolute right-3 top-3'
						)}
					>
						<TablerEdit />
					</Dialog.Trigger>
				</GroupLinkForm>
			</Card.Root>
		</li>
	{/each}

	<li>
		<GroupLinkForm links={data.allLinks} action="?/add_group_link">
			<Dialog.Trigger
				class={twMerge(buttonVariants({ variant: 'outline' }), 'h-full w-full gap-2')}
			>
				Add link
				<TablerPlus />
			</Dialog.Trigger>
		</GroupLinkForm>
	</li>
</ul>
