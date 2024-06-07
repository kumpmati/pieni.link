<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import LinkPicker from './LinkPicker.svelte';
	import type { Link } from '$lib/server/database/schema/link';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import TablerPlus from '~icons/tabler/plus';
	import TablerTrash from '~icons/tabler/trash';
	import TablerDeviceFloppy from '~icons/tabler/device-floppy';
	import { enhance } from '$app/forms';
	import type { LinksToGroups } from '$lib/server/database/schema/group';

	export let action: string;
	export let deleteAction: string = '';
	export let initialData: LinksToGroups | null = null;
	export let links: Link[];
	export let selected: Link['id'] | null = null;
	export let open: boolean = false;

	let loading = false;
</script>

<Dialog.Root bind:open>
	<slot />

	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{initialData ? 'Edit item' : 'Add item'}</Dialog.Title>
			<Dialog.Description>
				{initialData ? '' : 'Select a link and give it a display name'}
			</Dialog.Description>
		</Dialog.Header>

		<form
			class="contents"
			method="post"
			use:enhance={() => {
				loading = true;

				return async ({ update }) => {
					await update({ reset: false });
					open = false;
					loading = false;
				};
			}}
			{action}
		>
			{#if initialData}
				<input type="hidden" name="itemId" value={initialData.itemId} />
			{/if}

			<input type="hidden" name="linkId" value={selected} />

			<LinkPicker bind:selected {links} />

			<Label class="flex flex-col">
				Display name

				<Input
					name="name"
					required
					placeholder="My bio, Personal website, etc..."
					value={initialData?.name}
				/>
			</Label>

			<Dialog.Footer>
				{#if initialData}
					<form
						method="post"
						use:enhance={() => {
							loading = true;

							return async ({ update }) => {
								await update({ reset: false });
								open = false;
								loading = false;
							};
						}}
						action={deleteAction}
					>
						<input type="hidden" name="id" value={initialData.itemId} />

						<Button type="submit" class="gap-2" variant="destructive" disabled={loading}>
							Remove <TablerTrash />
						</Button>
					</form>
				{/if}

				<Button type="submit" class="gap-2" disabled={!selected || loading}>
					{#if initialData}
						Save changes
						<TablerDeviceFloppy />
					{:else}
						Add item
						<TablerPlus />
					{/if}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
