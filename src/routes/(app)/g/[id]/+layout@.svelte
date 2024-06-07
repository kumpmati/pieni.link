<script>
	import { Toaster } from '$lib/components/ui/sonner';
</script>

<Toaster theme="dark" />

<main class="mx-auto my-16 flex h-full w-full max-w-3xl flex-col px-2">
	<slot />
</main>
