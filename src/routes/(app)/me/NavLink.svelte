<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { page } from '$app/stores';
	import { getMenuStore } from './store';

	export let href: string;
	export let count: number | null = null;

	const showMenu = getMenuStore();

	$: isActive = $page.url.pathname === href;
</script>

<Button
	{href}
	variant={isActive ? 'secondary' : 'ghost'}
	class="w-full justify-start gap-2 {isActive ? 'font-bold' : 'font-normal'}"
	on:click={() => ($showMenu = false)}
>
	<slot />

	{#if count !== null && count !== undefined}
		<span class="ml-auto text-slate-500">{count}</span>
	{/if}
</Button>
