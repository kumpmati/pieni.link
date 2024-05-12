<script>
	import { Toaster } from '$lib/components/ui/sonner';
	import MeLayout from './MeLayout.svelte';

	export let data;
</script>

<Toaster theme="dark" />

<MeLayout session={data.session}>
	<slot />
</MeLayout>
