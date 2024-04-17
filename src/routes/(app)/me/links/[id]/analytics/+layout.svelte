<script lang="ts">
	import { page } from '$app/stores';
	import LinkTabs from '$lib/components/LinkTabs.svelte';
</script>

<div class="flex w-full flex-col gap-2">
	<LinkTabs
		items={[
			{ text: 'Overview', href: `/me/links/${$page.params.id}/analytics` },
			{ text: 'Raw data', href: `/me/links/${$page.params.id}/analytics/raw` }
		]}
	/>

	<slot />
</div>
