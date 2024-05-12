<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import type { PageData } from './$types';
	import LinksView from './LinksView.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>Admin - Manage links</title>
</svelte:head>

<Header title="All links" description="Manage all links within the system" />

<LinksView links={data.links} />
