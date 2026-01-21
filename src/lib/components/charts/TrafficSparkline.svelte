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
				min: dayjs(dateRange[0]).startOf('day').toDate().getTime(),
				max: dayjs(dateRange[1]).startOf('day').toDate().getTime()
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
						min: dayjs(dateRange[0]).startOf('day').toDate().getTime(),
						max: dayjs(dateRange[1]).startOf('day').toDate().getTime()
					}
				} satisfies ApexOptions);
				chart.updateSeries([{ data: data.map((d) => ({ x: d.day, y: d.count })) }]);
			}
		});
	});
</script>

<div bind:this={el}></div>

<style global>
	:root {
		--base: var(--m3c-primary);
		--sparkline-gradient: color-mix(in srgb, var(--base) 0%, transparent);
	}
</style>
