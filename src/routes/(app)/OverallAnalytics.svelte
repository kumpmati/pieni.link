<script lang="ts">
	import AnalyticsCard from '$lib/components/AnalyticsCard.svelte';
	import { getAllVisitsByDay, getMostCommon, getTotalVisits } from '$lib/queries/analytics.remote';
	import { Card } from 'm3-svelte';
	import { daysBetween, formatAmount, formatVisitsPerDay } from '$lib/utils';
	import TrafficSparkline from '$lib/components/charts/TrafficSparkline.svelte';

	type Props = {
		dateRange: [Date, Date];
	};

	let { dateRange }: Props = $props();

	const mostCommon = $derived(getMostCommon(dateRange));
</script>

<div class="wrapper">
	<svelte:boundary>
		{#snippet pending()}
			<Card variant="elevated" style="width: 100%; height: 221px;">
				<span></span>
			</Card>
		{/snippet}

		{@const visitsByDay = await getAllVisitsByDay(dateRange)}
		{@const totalVisits = await getTotalVisits(dateRange)}
		{@const isAllTime = dateRange[0].getFullYear() === 1970}
		{@const isTodayOnly = daysBetween(dateRange) === 0}

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

		<div class="row">
			<AnalyticsCard label="OS">
				{#snippet value()}
					{@const mostCommonOS = (await mostCommon).os.at(0)}

					{mostCommonOS?.name || 'Unknown'}
					<span class="subtle">({Math.round(mostCommonOS?.percentage ?? 0) || '-'}%)</span>
				{/snippet}
			</AnalyticsCard>
			<AnalyticsCard label="Browser">
				{#snippet value()}
					{@const mostCommonBrowser = (await mostCommon).browser.at(0)}

					{mostCommonBrowser?.name || 'Unknown'}
					<span class="subtle">({Math.round(mostCommonBrowser?.percentage ?? 0) || '-'}%)</span>
				{/snippet}
			</AnalyticsCard>
		</div>
	</svelte:boundary>
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
		gap: 1rem;
	}

	.subtle {
		color: var(--m3c-primary);
		font-weight: 400;
	}
</style>
