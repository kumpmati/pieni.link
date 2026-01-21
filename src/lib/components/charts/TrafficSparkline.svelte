<script lang="ts">
	import { type ApexOptions } from 'apexcharts';
	import dayjs from 'dayjs';
	import { onMount, untrack } from 'svelte';

	type Props = {
		dateRange: [Date, Date];
		data: { count: number; day: string }[];
	};

	let { dateRange, data }: Props = $props();

	let el: HTMLDivElement;
	let chart: ApexCharts;

	onMount(async () => {
		const ApexCharts = (await import('apexcharts')).default;

		const opts: ApexOptions = {
			series: [{ data: data.map((d) => ({ x: d.day, y: d.count })) }],
			chart: {
				type: 'line',
				width: '100%',
				height: 48,
				sparkline: { enabled: true }
			},

			xaxis: {
				type: 'datetime',
				min: dateRange[0].getTime(),
				max: dateRange[1].getTime()
			},

			stroke: {
				curve: 'straight',
				width: 2,
				colors: ['var(--m3c-primary)']
			},

			tooltip: { enabled: false }
		};

		chart = new ApexCharts(el, opts);
		chart.render();
	});

	$effect(() => {
		// reactive dependencies
		data;
		dateRange;

		untrack(() => {
			if (chart) {
				chart.updateOptions({
					xaxis: {
						min: dateRange[0].getTime(),
						max: dateRange[1].getTime()
					}
				} satisfies ApexOptions);
				chart.updateSeries([{ data: data.map((d) => ({ x: d.day, y: d.count })) }]);
			}
		});
	});
</script>

<div bind:this={el}></div>

<style>
	div {
		height: 48px;
	}
</style>
