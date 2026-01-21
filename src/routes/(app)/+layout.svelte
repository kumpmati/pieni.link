<script lang="ts">
	import { Snackbar } from 'm3-svelte';

	let { children } = $props();
</script>

<Snackbar />

{@render children()}
