<script lang="ts">
	import AnalyticsCard from '../AnalyticsCard.svelte';

	type Props = {
		data: number;
	};

	let { data }: Props = $props();
</script>

<AnalyticsCard label="Unique users*">
	{#snippet value()}
		<span title="Based on number of unique User-Agents, which does not map 1:1 to each user">
			{data}
		</span>
	{/snippet}
</AnalyticsCard>
