<script lang="ts">
	import { IconChevronLeft } from '@tabler/icons-svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import type { PageData } from './$types';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	dayjs.extend(relativeTime);

	export let data: PageData;
</script>

<svelte:head>
	<title>Admin panel</title>
</svelte:head>

<div class="flex flex-col gap-2">
	<Button href="/me" variant="ghost" class="flex w-fit  gap-1 pl-2">
		<IconChevronLeft size={16} /> Profile
	</Button>

	<Card.Root>
		<Card.Header>
			<Card.Title>Users ({data.users.length})</Card.Title>
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
					{#each data.users as user (user.id)}
						<Table.Row>
							<Table.Cell>
								<img src={user.image} alt={user.name} class="h-8 w-8 rounded-full" />
							</Table.Cell>
							<Table.Cell
								>{user.name}
								{#if user.id === data.session?.user.id}
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

	<Card.Root>
		<Card.Header>
			<Card.Title>Links ({data.links.length})</Card.Title>
			<Card.Description>View and manage all links</Card.Description>
		</Card.Header>

		<Card.Content>
			<Table.Root>
				<Table.Header>
					<Table.Head>Shortened link</Table.Head>
					<Table.Head>Original link</Table.Head>
					<Table.Head>Last used</Table.Head>
					<Table.Head>Created At</Table.Head>
					<Table.Head>User</Table.Head>
				</Table.Header>

				<Table.Body>
					{#each data.links as link (link.id)}
						<Table.Row>
							<Table.Cell>{link.id}</Table.Cell>
							<Table.Cell>{link.url}</Table.Cell>
							<Table.Cell>{link.lastUsed ? dayjs().to(link.lastUsed) : '-'}</Table.Cell>
							<Table.Cell>{link.createdAt.toISOString()}</Table.Cell>
							<Table.Cell>{link.userId}</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</Card.Content>
	</Card.Root>
</div>
