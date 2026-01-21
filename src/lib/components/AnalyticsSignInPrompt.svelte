<script lang="ts">
	import LucideChartArea from '~icons/lucide/chart-area';
	import { authClient } from '$lib/auth-client';
	import { Button, Card } from 'm3-svelte';
	import googleSvg from '$lib/assets/google.svg';
</script>

<Card variant="elevated" style="display:flex; align-items:center; gap: 1rem; padding: 1rem;">
	<LucideChartArea style="width: 1.5rem; height: 1.5rem; color: var(--m3c-primary);" />

	<p>Sign In to view analytics</p>

	<Button variant="outlined" onclick={() => authClient.signIn.social({ provider: 'google' })}>
		<img src={googleSvg} alt="" />
		Google
	</Button>
</Card>

<style>
	p {
		margin: 0;
		font-weight: 500;
		color: var(--m3c-primary);
	}

	img {
		width: 20px;
		height: 20px;
	}
</style>
