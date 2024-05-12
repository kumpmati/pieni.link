<script lang="ts">
	import type { Session } from 'lucia';
	import SideNav from './SideNav.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import TablerX from '~icons/tabler/x';
	import TablerMenu from '~icons/tabler/menu';
	import Logo from '$lib/components/Logo.svelte';
	import { fly } from 'svelte/transition';
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';

	export let session: Session | null;

	const showMenu = writable(false);
	setContext('menu', showMenu);
</script>

<!-- show only on md-breakpoint or smaller -->
<div class="md:hidden">
	<div class="fixed top-0 z-20 flex w-full justify-between p-4">
		<a href="/" class="flex items-center gap-2">
			<Logo size={32} />
			Pieni
		</a>

		<Button on:click={() => ($showMenu = !$showMenu)} size="icon" variant="outline">
			{#if $showMenu}
				<TablerX />
			{:else}
				<TablerMenu />
			{/if}
		</Button>
	</div>

	{#if $showMenu}
		<span
			transition:fly={{ duration: 200, y: -20 }}
			class="fixed top-0 z-10 h-full w-full bg-slate-900 pt-14"
		>
			<SideNav {session} class="relative w-full" />
		</span>
	{/if}
</div>

<!-- show only after md-breakpoint -->
<div class="hidden md:block">
	<SideNav {session} />
</div>

<main class="flex w-full flex-col gap-2 p-4 pt-20 md:pl-64 md:pt-4">
	<slot />
</main>
