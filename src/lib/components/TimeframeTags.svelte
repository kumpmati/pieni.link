<script module lang="ts">
	import iconCheck from '@ktibow/iconset-material-symbols/check';

	export const TIMEFRAMES = [
		{ value: 'all-time', label: 'All Time' },
		{ value: '30d', label: '30 days' },
		{ value: '7d', label: '7 days' },
		{ value: 'today', label: 'Today' }
	] as const;

	export type Timeframes = (typeof TIMEFRAMES)[number]['value'];
</script>

<script lang="ts">
	import { Chip } from 'm3-svelte';

	type Props = {
		value: (typeof TIMEFRAMES)[number]['value'];
	};

	let { value = $bindable() }: Props = $props();
</script>

<ul>
	{#each TIMEFRAMES as opt (opt.value)}
		{@const selected = value === opt.value}
		<Chip
			variant="general"
			value={opt.value}
			{selected}
			onclick={() => (value = opt.value)}
			style="min-width: max-content;"
			icon={selected ? iconCheck : undefined}
			label
		>
			{opt.label}
		</Chip>
	{/each}
</ul>

<style>
	ul {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin: 0;
		padding: 0;
		flex-wrap: wrap;
	}
</style>
