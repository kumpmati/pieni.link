<script lang="ts">
	import { Button } from 'm3-svelte';
	import type { Snippet } from 'svelte';
	import { fly } from 'svelte/transition';
	import LucideChevronDown from '~icons/lucide/chevron-down';

	type Props = {
		open?: boolean;
		title: Snippet;
		children: Snippet;
	};

	let { open = $bindable(true), title, children }: Props = $props();

	const toggleOpen = () => (open = !open);
</script>

<div class="wrapper">
	<div class="heading">
		<h2>
			{@render title()}
		</h2>

		<Button variant="text" onclick={toggleOpen} iconType="full" style="margin-left: auto;">
			<LucideChevronDown
				style="transition: transform 200ms; transform: rotate({open ? '0deg' : '180deg'})"
			/>
		</Button>
	</div>

	{#if open}
		<div class="content" transition:fly={{ duration: 150, y: -5 }}>
			{@render children?.()}
		</div>
	{/if}
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
	}

	h2 {
		color: var(--m3c-primary);
		font-size: 1rem;
		font-weight: 500;
		margin: 0;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}

	.heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.content {
		margin-top: 1rem;
		margin-bottom: 2rem;
	}
</style>
