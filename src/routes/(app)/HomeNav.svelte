<script lang="ts">
	import TablerLogin from '~icons/tabler/login';
	import Logo from '$lib/components/Logo.svelte';
	import { Button } from '$lib/components/ui/button';
	import type { Session } from 'lucia';
	import * as Avatar from '$lib/components/ui/avatar';

	export let session: Session | null;
</script>

<nav class="absolute flex w-full flex-row items-center justify-between p-2">
	<a href="/" class="font-display flex flex-row items-center gap-2 text-lg font-bold">
		<Logo size={32} /> Pieni
	</a>

	<div class="flex gap-2">
		{#if session}
			<a href="/me" title="Go to dashboard">
				<Avatar.Root class="h-8 w-8">
					<Avatar.Image src={session.user.image} alt={session.user.name} />
					<Avatar.Fallback>{session.user.name}</Avatar.Fallback>
				</Avatar.Root>
			</a>
		{:else}
			<Button href="/auth/signin" variant="ghost" class="gap-2">
				<TablerLogin />
				Sign In
			</Button>
		{/if}
	</div>
</nav>
