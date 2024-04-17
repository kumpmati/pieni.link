<script lang="ts">
	import ApexCharts from 'apexcharts';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { numVisitsByDay } from './util';
	import PerLinkStatisticsOverview from '../PerLinkStatisticsOverview.svelte';

	export let data: PageData;

	let chartElement: HTMLDivElement;

	onMount(() => {
		data.visits.then((d) => {
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
				series: [{ name: 'Visits', data: numVisitsByDay(d) }],
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

<div bind:this={chartElement} />
