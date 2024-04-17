<script lang="ts">
	import { onMount } from 'svelte';
	import type { LinkVisitsPerReferrer } from '$lib/server/database/handlers/analytics';

	export let data: LinkVisitsPerReferrer;

	let chartElement: HTMLDivElement;

	onMount(async () => {
		const ApexCharts = await import('apexcharts');

		const chart = new ApexCharts.default(chartElement, {
			chart: {
				type: 'donut',
				foreColor: '#ccc',
				toolbar: { show: false }
			},
			tooltip: { theme: 'dark' },
			series: data.map((d) => d.count),
			labels: data.map((d) => d.referrer)
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
