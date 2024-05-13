<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import type { PageData } from './$types';
	import Header from '$lib/components/Header.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import TablerTrash from '~icons/tabler/trash';

	export let data: PageData;
</script>

<svelte:head>
	<title>All users</title>
</svelte:head>

<Header title="All users" description="Manage all users in the system" />

<Table.Root>
	<Table.Header>
		<Table.Head class="w-16">Image</Table.Head>
		<Table.Head>Name</Table.Head>
		<Table.Head>Email</Table.Head>
		<Table.Head>Role</Table.Head>
		<Table.Head>ID</Table.Head>
		<Table.Head class="w-16" />
	</Table.Header>

	<Table.Body>
		{#each data.users as user (user.id)}
			{@const isOwnAccount = user.id === data.session?.user.id}
			<Table.Row>
				<Table.Cell>
					<img src={user.image} alt={user.name} class="h-8 w-8 rounded-full" />
				</Table.Cell>
				<Table.Cell>
					{#if isOwnAccount}
						<span class="font-bold">You</span> ({user.name})
					{:else}
						{user.name}
					{/if}
				</Table.Cell>
				<Table.Cell>{user.email ?? '-'}</Table.Cell>
				<Table.Cell>{user.role}</Table.Cell>
				<Table.Cell>{user.id}</Table.Cell>
				<Table.Cell>
					{#if !isOwnAccount}
						<AlertDialog.Root>
							<AlertDialog.Trigger
								disabled={isOwnAccount}
								title={isOwnAccount
									? 'You can only delete your own account from the account page'
									: ''}
							>
								<Button
									variant={isOwnAccount ? 'ghost' : 'destructive'}
									size="icon"
									disabled={isOwnAccount}
								>
									<TablerTrash width={16} height={16} />
								</Button>
							</AlertDialog.Trigger>

							<AlertDialog.Content>
								<AlertDialog.Header>
									<AlertDialog.Title>Delete account?</AlertDialog.Title>
									<AlertDialog.Description>
										If you delete <span class="font-bold">{user.name}</span>, all of the links
										associated with it will also be deleted permanently.
									</AlertDialog.Description>
								</AlertDialog.Header>

								<form method="post" action="?/delete_account" class="contents">
									<input type="hidden" name="id" value={user.id} />

									<AlertDialog.Footer>
										<AlertDialog.Cancel type="reset">Cancel</AlertDialog.Cancel>

										<AlertDialog.Action
											type="submit"
											class="gap-2 {buttonVariants({ variant: 'destructive' })}"
										>
											<TablerTrash width={16} height={16} /> Delete account
										</AlertDialog.Action>
									</AlertDialog.Footer>
								</form>
							</AlertDialog.Content>
						</AlertDialog.Root>
					{/if}
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
