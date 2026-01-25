<script lang="ts">
	import type { RemoteQuery } from '@sveltejs/kit';
	import AnalyticsCard from '../AnalyticsCard.svelte';
	import TrafficSparkline from '../charts/TrafficSparkline.svelte';
	import { daysBetween, formatAmount, formatVisitsPerDay } from '$lib/utils';

	type Props = {
		dateRange: [Date, Date];
		query: RemoteQuery<{ day: string; count: number }[]>;
	};

	let { dateRange, query }: Props = $props();

	const sumVisits = (d: { day: string; count: number }[]): number => {
		return d.reduce((acc, curr) => acc + curr.count, 0);
	};

	const isAllTime = $derived(dateRange[0].getFullYear() === 1970);
	const isTodayOnly = $derived(daysBetween(dateRange) === 0);
	const totalVisits = $derived(sumVisits(await query));
</script>

<AnalyticsCard
	label="Visits"
	extraInfo={!isAllTime && !isTodayOnly
		? `${formatVisitsPerDay(totalVisits, dateRange)} per day`
		: undefined}
>
	{#snippet value()}
		{formatAmount(totalVisits)}
	{/snippet}

	<TrafficSparkline {dateRange} data={await query} />
</AnalyticsCard>
