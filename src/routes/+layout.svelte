<script lang="ts">
	import '../app.pcss';
	import { Toaster } from '$lib/components/ui/sonner';
	import { IconQuestionMark } from '@tabler/icons-svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { page } from '$app/stores';
</script>

<Toaster theme="dark" />

<nav class="absolute left-0 top-0 mx-auto flex w-full flex-row items-center justify-between p-3">
	<a href="/">pieni.link</a>

	<div class="flex gap-2">
		<Button
			href="/about"
			class="flex items-center gap-1"
			size="icon"
			variant={$page.url.pathname === '/about' ? 'default' : 'ghost'}
		>
			<IconQuestionMark size={16} />
		</Button>
	</div>
</nav>

<main class="mx-auto flex h-full w-full max-w-3xl flex-col items-center justify-center px-2">
	<slot />
</main>
