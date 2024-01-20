<script lang="ts">
	import '../app.pcss';
	import { Toaster } from '$lib/components/ui/sonner';
</script>

<Toaster theme="dark" />

<nav class="absolute left-0 top-0 mx-auto flex w-full flex-row items-center justify-between p-2">
	<a href="/">pieni.link</a>
</nav>

<main class="mx-auto flex h-full w-full max-w-3xl flex-col items-center justify-center px-2">
	<slot />
</main>
