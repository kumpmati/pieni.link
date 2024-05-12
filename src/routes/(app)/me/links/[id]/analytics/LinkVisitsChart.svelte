<script lang="ts">
	import { onMount } from 'svelte';
	import dayjs from 'dayjs';
	import type { LinkVisitsPerDay } from '$lib/server/database/handlers/analytics';

	export let data: LinkVisitsPerDay;

	let chartElement: HTMLDivElement;

	onMount(async () => {
		const ApexCharts = await import('apexcharts');

		const chart = new ApexCharts.default(chartElement, {
			chart: {
				type: 'line',
				foreColor: '#ccc',
				toolbar: { show: false }
			},
			tooltip: { theme: 'dark' },
			grid: {
				borderColor: '#222',
				xaxis: { lines: { show: false } }
			},
			series: [
				{
					name: 'Visits',
					data: data.map((item) => ({
						x: dayjs(item.day).format('MMM DD'),
						y: item.count
					}))
				}
			],
			stroke: { curve: 'smooth' },
			xaxis: { tickAmount: 10 }
		});

		chart.render();
	});
</script>

{#if data.length > 0}
	<div bind:this={chartElement} />
{:else}
	<div class="grid h-96 w-full place-content-center rounded-lg bg-gray-900">
		<p>No data available</p>
	</div>
{/if}
