<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { getCurrentUser } from '$lib/queries/user.remote';
	import { Button } from 'm3-svelte';

	const user = $derived(await getCurrentUser());
</script>

{#if user}
	{@const firstName = user.name.split(' ')[0]}
	<Button
		variant="outlined"
		size="xs"
		onclick={() => authClient.signOut().then(() => window.location.reload())}
	>
		{firstName}
		<img src={user.image} alt="" />
	</Button>
{/if}

<style>
	img {
		width: 20px;
		height: 20px;
		border-radius: 100%;
		object-fit: cover;
	}
</style>
