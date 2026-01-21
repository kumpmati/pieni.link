<script lang="ts">
	import AnalyticsCard from '$lib/components/AnalyticsCard.svelte';
	import {
		getAllVisitsByDay,
		getMostCommon,
		getExtraStats,
		getTotalVisits
	} from '$lib/queries/analytics.remote';
	import { Button, Card, Dialog } from 'm3-svelte';
	import { daysBetween, formatAmount, formatVisitsPerDay } from '$lib/utils';
	import TrafficSparkline from '$lib/components/charts/TrafficSparkline.svelte';

	type Props = {
		dateRange: [Date, Date];
	};

	let { dateRange }: Props = $props();

	let showDialogs = $state({
		os: false,
		browsers: false
	});

	const mostCommon = $derived(getMostCommon(dateRange));
</script>

<div class="wrapper">
	<svelte:boundary>
		{#snippet pending()}
			<Card variant="elevated" style="width: 100%; height: 221px;">
				<span></span>
			</Card>
		{/snippet}

		{@const isAllTime = dateRange[0].getFullYear() === 1970}
		{@const isTodayOnly = daysBetween(dateRange) === 0}

		{@const visitsByDay = await getAllVisitsByDay(dateRange)}
		{@const totalVisits = await getTotalVisits(dateRange)}

		<AnalyticsCard
			label="Visits"
			extraInfo={!isAllTime && !isTodayOnly
				? `${formatVisitsPerDay(totalVisits, dateRange)} per day`
				: undefined}
		>
			{#snippet value()}
				{formatAmount(totalVisits)}
			{/snippet}

			<TrafficSparkline {dateRange} data={visitsByDay} />
		</AnalyticsCard>

		<div class="grid-2">
			<AnalyticsCard label="Browser" onclick={() => (showDialogs.browsers = true)}>
				{#snippet value()}
					{@const mostCommonBrowser = (await mostCommon).browser.at(0)}

					{mostCommonBrowser?.name || 'Unknown'}
					<span class="subtle">({Math.round(mostCommonBrowser?.percentage ?? 0) || '-'}%)</span>
				{/snippet}
			</AnalyticsCard>

			<AnalyticsCard label="OS" onclick={() => (showDialogs.os = true)}>
				{#snippet value()}
					{@const mostCommonOS = (await mostCommon).os.at(0)}

					{mostCommonOS?.name || 'Unknown'}
					<span class="subtle">({Math.round(mostCommonOS?.percentage ?? 0) || '-'}%)</span>
				{/snippet}
			</AnalyticsCard>
		</div>

		<div class="grid-3">
			<AnalyticsCard label="Unique users*">
				{#snippet value()}
					<span title="This many unique user-agent strings were found">
						{(await getExtraStats(dateRange)).uaCount}
					</span>
				{/snippet}
			</AnalyticsCard>

			<AnalyticsCard label="Sources">
				{#snippet value()}
					{(await getExtraStats(dateRange)).referrerCount}
				{/snippet}
			</AnalyticsCard>

			<AnalyticsCard label="Countries">
				{#snippet value()}
					TODO
				{/snippet}
			</AnalyticsCard>
		</div>
	</svelte:boundary>
</div>

<Dialog bind:open={showDialogs.os} headline="Operating systems">
	<ol>
		{#each (await mostCommon).os as os (os.name)}
			<li>
				<span class="name">{os.name || 'Unknown'}</span> ({Math.round(os.percentage)}%)
			</li>
		{/each}
	</ol>

	{#snippet buttons()}
		<Button variant="tonal">OK</Button>
	{/snippet}
</Dialog>

<Dialog bind:open={showDialogs.browsers} headline="Browsers">
	<ol>
		{#each (await mostCommon).browser as browser (browser.name)}
			<li>
				<span class="name">{browser.name || 'Unknown'}</span> ({Math.round(browser.percentage)}%)
			</li>
		{/each}
	</ol>

	{#snippet buttons()}
		<Button variant="tonal">OK</Button>
	{/snippet}
</Dialog>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.grid-2 {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
		gap: 1rem;
	}

	.grid-3 {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
		gap: 1rem;
	}

	.subtle {
		color: var(--m3c-primary);
		font-weight: 400;
	}

	ol {
		font-size: 1.25rem;

		.name {
			color: var(--m3c-on-surface);
			font-weight: 500;
		}
	}
</style>
