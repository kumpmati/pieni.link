<script lang="ts">
	import { Card } from 'm3-svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		label?: string;
		extraInfo?: string;
		value: Snippet;
		children?: Snippet;
		onclick?: () => void;
	};

	let { label, extraInfo, value, children, onclick }: Props = $props();
</script>

<Card variant="elevated" style="display: flex; flex-direction: column;" {onclick}>
	<div class="heading">
		<div class="main">
			{#if label}
				<p class="label">{label}</p>
			{/if}
			<p class="value">
				{@render value()}
			</p>
		</div>

		{#if extraInfo}
			<p class="extra-info">{extraInfo}</p>
		{/if}
	</div>

	{@render children?.()}
</Card>

<style>
	.heading {
		display: flex;
		align-items: start;
		justify-content: space-between;
	}

	.main {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.extra-info {
		font-size: 1rem;
		color: var(--m3c-on-surface-variant);
	}

	p {
		margin: 0;
	}

	.label {
		font-size: 0.75rem;
		color: var(--m3c-on-surface-variant);
	}

	.value {
		font-size: 1.5rem;
		font-weight: 500;
	}
</style>
