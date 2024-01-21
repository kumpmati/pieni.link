<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="flex w-full flex-col gap-2">
	<Card.Root class="w-full">
		<Card.Content class="mt-5 flex gap-2">
			<small class="text-muted-foreground">
				Total visits
				<h1 class="text-4xl font-bold text-primary">
					{#await data.visits}
						...
					{:then visits}
						{visits.length}
					{/await}
				</h1>
			</small>
		</Card.Content>
	</Card.Root>

	{#await data.visits}
		<p>Loading analytics...</p>
	{:then visits}
		<Card.Root class="w-full">
			<Card.Header>
				<Card.Title>Visitor logs</Card.Title>
				<Card.Description>Detailed logs of all visits to the link</Card.Description>
			</Card.Header>

			<Card.Content>
				<Table.Root>
					<Table.Header>
						<Table.Head>Host</Table.Head>
						<Table.Head>Timestamp</Table.Head>
						<Table.Head>User-Agent</Table.Head>
					</Table.Header>

					<Table.Body>
						{#each visits as visit (visit.id)}
							<Table.Row>
								<Table.Cell>{visit.host}</Table.Cell>
								<Table.Cell class="whitespace-nowrap">
									{visit.timestamp.toISOString()}
								</Table.Cell>
								<Table.Cell>{visit.userAgent}</Table.Cell>
							</Table.Row>
						{:else}
							<p>No visits yet.</p>
						{/each}
					</Table.Body>
				</Table.Root>
			</Card.Content>
		</Card.Root>
	{/await}
</div>
