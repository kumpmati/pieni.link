<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { page } from '$app/stores';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let href: string;

	const showMenu = getContext<Writable<boolean>>('menu');

	$: isActive = $page.url.pathname === href;
</script>

<Button
	{href}
	variant={isActive ? 'secondary' : 'ghost'}
	class="w-full justify-start gap-2 {isActive ? 'font-bold' : 'font-normal'}"
	on:click={() => ($showMenu = false)}
>
	<slot />
</Button>
