<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import type { PageData } from './$types';
	import Button from '$lib/components/ui/button/button.svelte';
	import { IconFileExport } from '@tabler/icons-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { stringify } from 'csv-stringify/browser/esm';
	import { toast } from 'svelte-sonner';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { download } from '../util';
	import { page } from '$app/stores';

	dayjs.extend(relativeTime);

	export let data: PageData;

	const downloadAsCsv = async () => {
		stringify(await data.visits, { header: true }, (err, out) => {
			if (err) {
				toast.error('CSV export failed', { description: err?.message ?? 'unknown error' });
				return;
			}

			download(`${$page.params.id}-${new Date().toISOString()}.csv`, 'text/csv', out);
		});
	};

	const downloadAsJson = async () => {
		const out = JSON.stringify(await data.visits);

		download(`${$page.params.id}-${new Date().toISOString()}.json`, 'application/json', out);
	};
</script>

<Card.Root class="w-full">
	<Card.Header class="relative">
		<Card.Title>Raw data</Card.Title>
		<Card.Description class="flex justify-between">
			Detailed logs of all visits to the link
		</Card.Description>

		<span class="absolute right-4 top-2">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button builders={[builder]} variant="outline" size="sm" class="gap-2">
						<IconFileExport size={16} /> Export
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Item on:click={downloadAsCsv}>CSV</DropdownMenu.Item>
					<DropdownMenu.Item on:click={downloadAsJson}>JSON</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</span>
	</Card.Header>

	<Card.Content>
		<Table.Root>
			<Table.Header>
				<Table.Head>Time</Table.Head>
				<Table.Head>Referrer</Table.Head>
				<Table.Head>User-Agent</Table.Head>
			</Table.Header>

			<Table.Body>
				{#await data.visits}
					<Table.Row>
						<Table.Cell width={100}>
							<Skeleton class="mb-2 h-10 w-full" />
						</Table.Cell>
						<Table.Cell width={100}>
							<Skeleton class="mb-2 h-10 w-full" />
						</Table.Cell>
						<Table.Cell>
							<Skeleton class="mb-2 h-10 w-full" />
						</Table.Cell>
					</Table.Row>
				{:then visits}
					{#each visits as visit (visit.id)}
						<Table.Row>
							<Table.Cell class="whitespace-nowrap" title={visit.timestamp.toISOString()}>
								{dayjs().to(visit.timestamp)}
							</Table.Cell>
							<Table.Cell>{visit.referrer}</Table.Cell>
							<Table.Cell>{visit.userAgent}</Table.Cell>
						</Table.Row>
					{:else}
						<p>No visits yet.</p>
					{/each}
				{/await}
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>
