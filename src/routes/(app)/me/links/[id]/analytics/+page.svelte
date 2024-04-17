<script lang="ts">
	import ApexCharts from 'apexcharts';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import PerLinkStatisticsOverview from '../PerLinkStatisticsOverview.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';

	export let data: PageData;

	let chartElement: HTMLDivElement;

	onMount(() => {
		data.visitsByDay.then((days) => {
			const chart = new ApexCharts(chartElement, {
				chart: {
					type: 'line',
					foreColor: '#ccc',
					toolbar: { show: false }
				},
				tooltip: { theme: 'dark' },
				grid: {
					borderColor: '#222',
					xaxis: { lines: { show: true } }
				},
				series: [
					{
						name: 'Visits',
						data: days.map((item) => ({
							x: item.day,
							y: item.count
						}))
					}
				],
				stroke: { curve: 'smooth' },
				xaxis: { tickAmount: 10 }
			});

			chart.render();
		});
	});
</script>

{#await data.stats}
	<PerLinkStatisticsOverview stats={null} />
{:then stats}
	<PerLinkStatisticsOverview {stats} />
{/await}

{#await data.visitsByDay}
	<Skeleton class=" h-96 w-full" />
{:then}
	<div bind:this={chartElement} />
{/await}
