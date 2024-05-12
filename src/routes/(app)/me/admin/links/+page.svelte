<script lang="ts">
	import { getPageTitleStore } from '../../store';
	import type { PageData } from './$types';
	import LinksView from './LinksView.svelte';

	export let data: PageData;

	getPageTitleStore().set('All links');
</script>

<svelte:head>
	<title>Admin - Manage links</title>
</svelte:head>

<LinksView links={data.links} />
