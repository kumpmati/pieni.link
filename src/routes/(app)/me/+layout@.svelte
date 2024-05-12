<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner';
	import type { UserCounts } from '$lib/server/database/handlers/dashboard';
	import { onMount } from 'svelte';
	import MeLayout from './MeLayout.svelte';

	export let data;

	let loadedCounts: UserCounts | null = null;

	onMount(() => {
		data.counts.then((val) => (loadedCounts = val));
	});
</script>

<Toaster theme="dark" />

<MeLayout session={data.session} counts={loadedCounts}>
	<slot />
</MeLayout>
