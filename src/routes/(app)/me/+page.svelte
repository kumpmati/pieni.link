<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import IconChevronRight from '~icons/tabler/chevron-right';
	import type { PageData } from './$types';
	import LinksTable from './links/LinksTable.svelte';
	import * as Card from '$lib/components/ui/card';
	import OverallStatisticsOverview from './OverallStatisticsOverview.svelte';
	import Header from '$lib/components/Header.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>Me</title>
</svelte:head>

<Header title="Overview" description="A summary of the most important things" />

{#await data.stats}
	<OverallStatisticsOverview stats={null} />
{:then stats}
	<OverallStatisticsOverview {stats} />
{/await}

<Card.Root>
	<Card.Header class="relative">
		<Card.Title>Last 5 links</Card.Title>

		<Button href="/me/links" variant="outline" size="sm" class="absolute right-4 top-3 gap-2">
			See all <IconChevronRight width={16} height={16} />
		</Button>
	</Card.Header>

	<Card.Content>
		<LinksTable links={data.links} />
	</Card.Content>
</Card.Root>
