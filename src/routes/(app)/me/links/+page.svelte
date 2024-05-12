<script lang="ts">
	import LinksTable from './LinksTable.svelte';
	import type { PageData } from './$types';
	import Header from '$lib/components/Header.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>My links</title>
</svelte:head>

<Header title="My links" description="View and manage all your shortened links" />

<LinksTable links={data.links} />
