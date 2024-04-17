<script lang="ts">
	import type { ApiKey } from '$lib/server/database/schema/api';
	import * as Table from '$lib/components/ui/table';

	export let keys: ApiKey[];
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head>ID</Table.Head>
			<Table.Head>Secret</Table.Head>
			<Table.Head>Created</Table.Head>
			<Table.Head />
		</Table.Row>
	</Table.Header>

	<Table.Body>
		{#each keys as key (key.id)}
			<Table.Row>
				<Table.Cell>{key.id}</Table.Cell>
				<Table.Cell>{key.secret}</Table.Cell>
				<Table.Cell>{key.createdAt.toLocaleString()}</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
