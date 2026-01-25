<script lang="ts">
	import AnalyticsCard from '../AnalyticsCard.svelte';
	import { Button, Dialog } from 'm3-svelte';

	type Props = {
		data: { name: string; percentage: number }[];
	};

	let { data }: Props = $props();

	let open = $state(false);

	const first = $derived(data.at(0));
</script>

<AnalyticsCard label="Device" onclick={() => (open = true)}>
	{#snippet value()}
		{first?.name || 'Unknown'}
		<span class="subtle">
			({Math.round(first?.percentage ?? 0) || '-'}%)
		</span>
	{/snippet}
</AnalyticsCard>

<Dialog bind:open headline="Devices">
	<ol>
		{#each data as device (device.name)}
			<li>
				<span class="name">{device.name || 'Unknown'}</span> ({Math.round(device.percentage)}%)
			</li>
		{:else}
			<p>No visits yet.</p>
		{/each}
	</ol>

	{#snippet buttons()}
		<Button variant="tonal">OK</Button>
	{/snippet}
</Dialog>

<style>
	.subtle {
		color: var(--m3c-primary);
		font-weight: 400;
	}

	ol {
		font-size: 1.25rem;

		.name {
			color: var(--m3c-on-surface);
			font-weight: 500;
		}
	}
</style>
