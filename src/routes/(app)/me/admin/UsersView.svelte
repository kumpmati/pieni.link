<script lang="ts">
	import type { AuthUser } from '$lib/server/database/schema/auth';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import type { Session } from 'lucia';

	export let session: Session | null;
	export let users: AuthUser[];
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Users ({users.length})</Card.Title>
		<Card.Description>View and manage all users</Card.Description>
	</Card.Header>

	<Card.Content>
		<Table.Root>
			<Table.Header>
				<Table.Head class="w-16">Image</Table.Head>
				<Table.Head>Name</Table.Head>
				<Table.Head>Email</Table.Head>
				<Table.Head>Role</Table.Head>
				<Table.Head>ID</Table.Head>
			</Table.Header>

			<Table.Body>
				{#each users as user (user.id)}
					<Table.Row>
						<Table.Cell>
							<img src={user.image} alt={user.name} class="h-8 w-8 rounded-full" />
						</Table.Cell>
						<Table.Cell
							>{user.name}
							{#if user.id === session?.user.id}
								(You)
							{/if}
						</Table.Cell>
						<Table.Cell>{user.email ?? '-'}</Table.Cell>
						<Table.Cell>{user.role}</Table.Cell>
						<Table.Cell>{user.id}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>
