<script lang="ts">
	import '../app.pcss';
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{$page.error?.message ?? 'unknown error'}</title>
</svelte:head>

<main class="mx-auto flex h-full w-full max-w-3xl flex-col items-center justify-center px-2">
	<h1 class="font-display scroll-m-20 text-4xl font-extrabold tracking-tight">
		<small class="text-muted-foreground">{$page.status}</small>
		{$page.error?.message ?? 'unknown error'}
	</h1>

	<a href="/" class="mt-4">Home</a>
</main>
