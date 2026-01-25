<script lang="ts">
	import { TIMEFRAMES, type Timeframes } from '$lib/constants';
	import iconCheck from '@ktibow/iconset-material-symbols/check';
	import { Chip } from 'm3-svelte';

	type Props = {
		value: Timeframes;
		disabled?: boolean;
		style?: string;
	};

	let { value = $bindable(), disabled, style }: Props = $props();
</script>

<ul {style} class:disabled>
	{#each TIMEFRAMES as opt (opt.value)}
		{@const selected = $state.eager(value) === opt.value}
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

	.disabled {
		opacity: 0.5;
		user-select: none;
	}
</style>
