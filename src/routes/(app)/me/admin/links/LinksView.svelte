<script lang="ts">
	import type { Link } from '$lib/server/database/schema/link';
	import * as Table from '$lib/components/ui/table';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import IconTrash from '~icons/tabler/trash';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { enhance } from '$app/forms';
	import { Button, buttonVariants } from '$lib/components/ui/button';

	dayjs.extend(relativeTime);

	export let links: Link[];
</script>

<Table.Root>
	<Table.Header>
		<Table.Head>Shortened link</Table.Head>
		<Table.Head>Original link</Table.Head>
		<Table.Head>Last visited</Table.Head>
		<Table.Head>Created At</Table.Head>
		<Table.Head>User</Table.Head>
		<Table.Head class="w-16" />
	</Table.Header>

	<Table.Body>
		{#each links as link (link.id)}
			<Table.Row>
				<Table.Cell>{link.id}</Table.Cell>
				<Table.Cell>{link.url}</Table.Cell>
				<Table.Cell>{link.lastUsed ? dayjs().to(link.lastUsed) : '-'}</Table.Cell>
				<Table.Cell>{link.createdAt.toISOString()}</Table.Cell>
				<Table.Cell>{link.userId}</Table.Cell>
				<Table.Cell class="text-right">
					<AlertDialog.Root>
						<AlertDialog.Trigger>
							<Button variant="ghost" size="icon">
								<IconTrash width={16} height={16} />
							</Button>
						</AlertDialog.Trigger>

						<AlertDialog.Content>
							<AlertDialog.Header>
								<AlertDialog.Title>Are you sure?</AlertDialog.Title>
								<AlertDialog.Description>
									You are about to permanently delete {link.id}. This cannot be undone.
								</AlertDialog.Description>
							</AlertDialog.Header>

							<form use:enhance class="contents" method="post" action="?/delete_link">
								<input type="hidden" name="id" value={link.id} />

								<AlertDialog.Footer>
									<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>

									<AlertDialog.Action
										type="submit"
										class="gap-2 {buttonVariants({ variant: 'destructive' })}"
									>
										<IconTrash width={16} height={16} /> Delete
									</AlertDialog.Action>
								</AlertDialog.Footer>
							</form>
						</AlertDialog.Content>
					</AlertDialog.Root>
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
