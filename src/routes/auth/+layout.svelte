<script lang="ts">
	import '../layout.css';

	let { children } = $props();
</script>

<main class="mx-auto flex h-full w-full max-w-3xl flex-col items-center justify-center px-2">
	{@render children()}
</main>
