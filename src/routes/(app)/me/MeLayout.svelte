<script lang="ts">
	import type { Session } from 'lucia';
	import NavContents from './NavContents.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import TablerX from '~icons/tabler/x';
	import TablerMenu from '~icons/tabler/menu';
	import Logo from '$lib/components/Logo.svelte';
	import { fly } from 'svelte/transition';
	import { setMenuStore } from './store';

	export let session: Session | null;

	const showMenu = setMenuStore();
</script>

<!-- Mobile: show only on md-breakpoint or smaller -->
<div class="md:hidden">
	<div class="fixed top-0 z-20 flex w-full justify-between bg-slate-900 p-2">
		<a href="/" class="font-display flex flex-row items-center gap-2 text-lg font-bold">
			<Logo size={32} />
			Pieni
		</a>

		<Button on:click={() => ($showMenu = !$showMenu)} size="icon" variant="ghost">
			<span class="transition-transform duration-200 {$showMenu ? 'rotate-90' : 'rotate-0'}">
				{#if $showMenu}
					<TablerX />
				{:else}
					<TablerMenu />
				{/if}
			</span>
		</Button>
	</div>

	{#if $showMenu}
		<span
			transition:fly={{ duration: 150, y: -15 }}
			class="fixed top-0 z-10 h-full w-full bg-slate-900 pt-14"
		>
			<NavContents {session} class="relative w-full" />
		</span>
	{/if}
</div>

<!-- Desktop: show only after md-breakpoint -->
<div class="hidden md:flex">
	<NavContents {session} class="fixed top-0 w-64" />
</div>

<main class="flex w-full flex-col gap-2 p-4 pt-[4.5rem] md:pl-72 md:pt-6">
	<slot />
</main>
