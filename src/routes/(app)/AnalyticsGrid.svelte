<script lang="ts">
	import AnalyticsCard from '$lib/components/AnalyticsCard.svelte';
	import { type UniqueReferrers, type VisitsByDay } from '$lib/queries/analytics.remote';
	import TotalVisitsCard from '$lib/components/analytics/TotalVisitsCard.svelte';
	import ReferrerCountCard from '$lib/components/analytics/ReferrerCountCard.svelte';
	import UniqueUserCard from '$lib/components/analytics/UniqueUserCard.svelte';
	import MostCommonDeviceCard from '$lib/components/analytics/MostCommonOSCard.svelte';
	import MostCommonBrowserCard from '$lib/components/analytics/MostCommonBrowserCard.svelte';
	import Skeleton from '$lib/components/layout/Skeleton.svelte';
	import type { RemoteQuery } from '@sveltejs/kit';

	type Props = {
		dateRange: [Date, Date];
		totalVisitsQuery: RemoteQuery<VisitsByDay>;
		mostCommonBrowsersQuery: RemoteQuery<{ name: string; percentage: number }[]>;
		mostCommonDevicesQuery: RemoteQuery<{ name: string; percentage: number }[]>;
		uniqueReferrersQuery: RemoteQuery<UniqueReferrers>;
		uniqueUsersQuery: RemoteQuery<number>;
	};

	let {
		dateRange,
		totalVisitsQuery,
		mostCommonBrowsersQuery,
		mostCommonDevicesQuery,
		uniqueReferrersQuery,
		uniqueUsersQuery
	}: Props = $props();
</script>

<svelte:boundary>
	{#snippet pending()}
		<div class="wrapper">
			<Skeleton style="height: 8rem" />

			<div class="grid-2">
				<Skeleton style="height: 5rem" />
				<Skeleton style="height: 5rem" />
			</div>

			<div class="grid-3">
				<Skeleton style="height: 5rem" />
				<Skeleton style="height: 5rem" />
				<Skeleton style="height: 5rem" />
			</div>
		</div>
	{/snippet}

	<div class="wrapper">
		<TotalVisitsCard {dateRange} query={totalVisitsQuery} />

		<div class="grid-2">
			<MostCommonBrowserCard data={await mostCommonBrowsersQuery} />
			<MostCommonDeviceCard data={await mostCommonDevicesQuery} />
		</div>

		<div class="grid-3">
			<ReferrerCountCard data={await uniqueReferrersQuery} />
			<UniqueUserCard data={await uniqueUsersQuery} />

			<AnalyticsCard label="Countries">
				{#snippet value()}
					TODO
				{/snippet}
			</AnalyticsCard>
		</div>
	</div>
</svelte:boundary>

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
</style>
