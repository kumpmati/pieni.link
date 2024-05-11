<script lang="ts">
	import Crumbs from '$lib/components/Crumbs.svelte';
	import * as Card from '$lib/components/ui/card';
	import LinksTable from './LinksTable.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>All links</Card.Title>
		<Card.Description>Manage all your shortened links</Card.Description>
	</Card.Header>

	<Card.Content>
		<LinksTable links={data.links} />
	</Card.Content>
</Card.Root>
