<script lang="ts">
	import { page } from '$app/stores';
	import IconLogin from '~icons/tabler/login';
	import IconUser from '~icons/tabler/user';
	import Logo from './Logo.svelte';
	import { Button } from './ui/button';
	import type { Session } from 'lucia';

	export let session: Session | null;
</script>

<nav class="absolute flex w-full flex-row items-center justify-between p-2">
	<a href="/" class="flex flex-row items-center gap-2 text-lg">
		<Logo size={32} /> Pieni
	</a>

	<div class="flex gap-2">
		{#if session}
			<Button href="/me" size="icon" variant={$page.url.pathname === '/me' ? 'default' : 'ghost'}>
				<IconUser />
			</Button>
		{:else}
			<Button href="/auth/signin" size="icon" variant="ghost">
				<IconLogin />
			</Button>
		{/if}
	</div>
</nav>
