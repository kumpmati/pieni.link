<script lang="ts">
	import type { PageData } from './$types';
	import PerLinkStatisticsOverview from '../PerLinkStatisticsOverview.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import LinkVisitsChart from './LinkVisitsChart.svelte';
	import LinkReferrersChart from './LinkReferrersChart.svelte';

	import * as Card from '$lib/components/ui/card';

	export let data: PageData;
</script>

{#await data.stats}
	<PerLinkStatisticsOverview stats={null} />
{:then stats}
	<PerLinkStatisticsOverview {stats} />
{/await}

<div class="custom-grid">
	<Card.Root>
		<Card.Header>
			<Card.Title>Visits per day</Card.Title>
			<Card.Description>Distribution of visits for each day</Card.Description>
		</Card.Header>

		<Card.Content>
			{#await data.visitsPerDay}
				<Skeleton class=" h-96 w-full" />
			{:then data}
				<LinkVisitsChart {data} />
			{/await}
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>Visits per referrer</Card.Title>
			<Card.Description>Distribution of visits between the unique referrers</Card.Description>
		</Card.Header>

		<Card.Content>
			{#await data.visitsPerReferrer}
				<Skeleton class=" h-96 w-full" />
			{:then data}
				<LinkReferrersChart {data} />
			{/await}
		</Card.Content>
	</Card.Root>
</div>

<style>
	.custom-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
		gap: 0.5rem;
	}
</style>
