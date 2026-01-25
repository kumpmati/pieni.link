<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		style?: string;
		children?: Snippet;
	};

	let { style, children }: Props = $props();
</script>

<div {style}>
	{@render children?.()}
</div>

<style>
	div {
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 0.5rem;
		width: 100%;
		height: 100%;

		animation: blink 1.5s ease infinite;
	}

	@keyframes blink {
		0%,
		100% {
			background: color-mix(in srgb, var(--m3c-primary) 12%, transparent 88%);
		}
		50% {
			background: color-mix(in srgb, var(--m3c-primary) 25%, transparent 75%);
		}
	}
</style>
