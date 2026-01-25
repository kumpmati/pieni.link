<script lang="ts">
	import type { RemoteQuery } from '@sveltejs/kit';
	import AnalyticsCard from '../AnalyticsCard.svelte';
	import { Button, Dialog } from 'm3-svelte';
	import { formatAmount, getHostname } from '$lib/utils';

	type Props = {
		data: { referrer: string; count: number }[];
	};

	let { data }: Props = $props();

	let open = $state(false);
</script>

<AnalyticsCard label="Referrers" onclick={() => (open = true)}>
	{#snippet value()}
		{formatAmount(data.length)}
	{/snippet}
</AnalyticsCard>

<Dialog bind:open headline="Referrers">
	<ol>
		{#each data as item (item.referrer)}
			{@const isUnknown = item.referrer === 'about:client'}
			<li>
				{#if isUnknown}
					<span class="name" title="Referrer was 'about:client' (same as new tab)">Unknown</span>
					({item.count})
				{:else}
					<span class="name" title={item.referrer}>{getHostname(item.referrer)}</span>
					({item.count})
				{/if}
			</li>
		{/each}
	</ol>

	{#snippet buttons()}
		<Button variant="tonal">OK</Button>
	{/snippet}
</Dialog>

<style>
	ol {
		margin: 0;
		font-size: 1.25rem;

		li {
			color: var(--m3c-on-surface-variant);
		}

		.name {
			color: var(--m3c-on-surface);
		}
	}
</style>
