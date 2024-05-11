<script lang="ts">
	import type { PageData } from './$types';
	import LinksView from './LinksView.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>Manage links</title>
</svelte:head>

<LinksView links={data.links} />
