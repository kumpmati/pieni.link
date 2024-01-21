<script lang="ts">
	import '../../app.pcss';
	import { Toaster } from '$lib/components/ui/sonner';
	import Nav from '$lib/components/Nav.svelte';

	export let data;
</script>

<Toaster theme="dark" />

<Nav session={data.session} />

<main class="mx-auto flex h-full w-full max-w-3xl flex-col px-2">
	<slot />
</main>
