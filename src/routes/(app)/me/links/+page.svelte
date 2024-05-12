<script lang="ts">
	import LinksTable from './LinksTable.svelte';
	import type { PageData } from './$types';
	import Header from '../Header.svelte';

	export let data: PageData;
</script>

<Header title="My links" description="View and manage all your shortened links" />

<LinksTable links={data.links} />
