<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import type { PageData } from './$types';
	import dayjs from 'dayjs';
	import PerLinkStatisticsOverview from './PerLinkStatisticsOverview.svelte';

	dayjs.extend(relativeTime);

	export let data: PageData;
</script>

<div class="flex w-full flex-col gap-2">
	{#await data.stats}
		<PerLinkStatisticsOverview stats={null} />
	{:then stats}
		<PerLinkStatisticsOverview {stats} />
	{/await}

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
						<Table.Head>Referrer</Table.Head>
						<Table.Head>User-Agent</Table.Head>
					</Table.Header>

					<Table.Body>
						{#each visits as visit (visit.id)}
							<Table.Row>
								<Table.Cell class="whitespace-nowrap" title={visit.timestamp.toISOString()}>
									{dayjs().to(visit.timestamp)}
								</Table.Cell>
								<Table.Cell>{visit.referrer}</Table.Cell>
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
