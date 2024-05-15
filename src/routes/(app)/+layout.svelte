<script lang="ts">
	import '../../app.pcss';
	import { Toaster } from '$lib/components/ui/sonner';
	import HomeNav from './HomeNav.svelte';

	export let data;
</script>

<Toaster theme="dark" />

<HomeNav user={data.user} />

<main class="mx-auto flex h-full w-full max-w-3xl flex-col px-2">
	<slot />
</main>
