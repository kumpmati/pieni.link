<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import Header from '../../Header.svelte';

	export let data;
</script>

<Header title="Health" description="Monitor the system's health" />

<Card.Root>
	<Card.Header>
		<Card.Title>Environment variables</Card.Title>
		<Card.Description>Verify that the application is configured correctly</Card.Description>
	</Card.Header>

	<Card.Content>
		<Table.Root>
			<Table.Header>
				<Table.Head>Variable name</Table.Head>
				<Table.Head>Value</Table.Head>
			</Table.Header>

			<Table.Body>
				{#each Object.entries(data.env) as [key, value] (key)}
					<Table.Row>
						<Table.Cell>{key}</Table.Cell>
						<Table.Cell>{value}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>
