<script lang="ts">
	import * as Table from '$lib/components/ui/table';

	export let data;
</script>

<svelte:head>My links</svelte:head>

<Table.Root>
	<Table.Caption>Your links</Table.Caption>
	<Table.Header>
		<Table.Row>
			<Table.Head>Link</Table.Head>
			<Table.Head>Shortened link</Table.Head>
			<Table.Head>Last used</Table.Head>
			<Table.Head>Created at</Table.Head>
		</Table.Row>
	</Table.Header>

	<Table.Body>
		{#each data.links as link (link.id)}
			<Table.Row>
				<Table.Cell>{link.url}</Table.Cell>
				<Table.Cell>https://pätkä.link/{link.id}</Table.Cell>
				<Table.Cell>{link.lastUsed ? new Date(link.lastUsed).toLocaleString() : '-'}</Table.Cell>
				<Table.Cell>{new Date(link.createdAt).toLocaleString()}</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
