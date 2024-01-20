<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { IconLink } from '@tabler/icons-svelte';

	import '../app.pcss';
	import { page } from '$app/stores';
</script>

<nav class="absolute left-0 top-0 mx-auto flex w-full flex-row items-center justify-between p-2">
	<a href="/">pieni.link</a>

	<Button
		href="/links"
		size="icon"
		variant={$page.url.pathname === '/links' ? 'default' : 'ghost'}
		title="My links"
	>
		<IconLink size={16} />
	</Button>
</nav>

<main class="mx-auto flex h-full w-full max-w-3xl flex-col items-center justify-center px-2">
	<slot />
</main>
