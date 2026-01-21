<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();
</script>

<main>
	{@render children()}
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin: 0 auto;
		margin-top: 128px;
		width: calc(100% - 2rem);
		max-width: 600px;

		@media screen and (max-width: 700px) {
			margin-top: 1rem;
		}
	}
</style>
