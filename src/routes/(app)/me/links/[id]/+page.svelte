<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import type { PageData } from './$types';
	import dayjs from 'dayjs';

	dayjs.extend(relativeTime);

	export let data: PageData;
</script>

<div class="flex w-full flex-col gap-2">
	<Card.Root class="w-full">
		<Card.Header>
			<Card.Title>Visits</Card.Title>
		</Card.Header>
		<Card.Content class="visits grid" style="grid-template-columns: repeat(3, 1fr)">
			<small class="text-muted-foreground">
				Last 24 hours
				<h1 class="text-4xl font-extrabold text-primary">
					{#await data.visits}
						...
					{:then visits}
						{visits.map((v) => dayjs().diff(v.timestamp, 'hours') <= 24).length}
					{/await}
				</h1>
			</small>

			<small class="text-muted-foreground">
				Last 7 days
				<h1 class="text-4xl font-extrabold text-primary">
					{#await data.visits}
						...
					{:then visits}
						{visits.map((v) => dayjs().diff(v.timestamp, 'days') <= 7).length}
					{/await}
				</h1>
			</small>

			<small class="text-muted-foreground">
				All time
				<h1 class="text-4xl font-extrabold text-primary">
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
				<Card.Title>Logs</Card.Title>
				<Card.Description>Detailed logs of all visits to the link</Card.Description>
			</Card.Header>

			<Card.Content>
				<Table.Root>
					<Table.Header>
						<Table.Head>Time</Table.Head>
						<Table.Head>Host</Table.Head>
						<Table.Head>User-Agent</Table.Head>
					</Table.Header>

					<Table.Body>
						{#each visits as visit (visit.id)}
							<Table.Row>
								<Table.Cell class="whitespace-nowrap" title={visit.timestamp.toISOString()}>
									{dayjs().to(visit.timestamp)}
								</Table.Cell>
								<Table.Cell>{visit.host}</Table.Cell>
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
