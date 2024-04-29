<script lang="ts">
	import type { ApiKey } from '$lib/server/database/schema/api';
	import * as Table from '$lib/components/ui/table';
	import Button from '$lib/components/ui/button/button.svelte';
	import IconTrash from '~icons/tabler/trash';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { enhance } from '$app/forms';
	import dayjs from 'dayjs';
	import { buttonVariants } from '$lib/components/ui/button';

	export let keys: Omit<ApiKey, 'secret'>[];
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head>ID</Table.Head>
			<Table.Head>Created</Table.Head>
			<Table.Head class="w-14" />
		</Table.Row>
	</Table.Header>

	<Table.Body>
		{#each keys as key (key.id)}
			<Table.Row>
				<Table.Cell>
					<pre>{key.id}</pre>
				</Table.Cell>
				<Table.Cell>{dayjs(key.createdAt).format('MMM DD YYYY HH:mm:ss')}</Table.Cell>
				<Table.Cell>
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
									Any application using this API key will not work anymore.
								</AlertDialog.Description>
							</AlertDialog.Header>

							<form method="post" action="?/delete_api_key" use:enhance class="contents">
								<input type="hidden" name="id" value={key.id} />

								<AlertDialog.Footer>
									<AlertDialog.Cancel type="reset">Cancel</AlertDialog.Cancel>

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
