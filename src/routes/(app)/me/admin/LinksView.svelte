<script lang="ts">
	import type { Link } from '$lib/server/database/schema/link';
	import type { Session } from 'lucia';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';

	dayjs.extend(relativeTime);

	export let links: Link[];
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Links ({links.length})</Card.Title>
		<Card.Description>View and manage all links</Card.Description>
	</Card.Header>

	<Card.Content>
		<Table.Root>
			<Table.Header>
				<Table.Head>Shortened link</Table.Head>
				<Table.Head>Original link</Table.Head>
				<Table.Head>Last visited</Table.Head>
				<Table.Head>Created At</Table.Head>
				<Table.Head>User</Table.Head>
			</Table.Header>

			<Table.Body>
				{#each links as link (link.id)}
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
