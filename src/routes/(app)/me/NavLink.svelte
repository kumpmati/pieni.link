<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { page } from '$app/stores';

	export let href: string;

	$: isActive = $page.url.pathname === href;
</script>

<Button
	{href}
	variant={isActive ? 'secondary' : 'ghost'}
	class="w-full justify-start gap-2 {isActive ? 'font-bold' : 'font-normal'}"
>
	<slot />
</Button>
