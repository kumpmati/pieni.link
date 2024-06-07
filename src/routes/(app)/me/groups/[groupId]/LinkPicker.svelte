<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Table from '$lib/components/ui/table';
	import type { Link } from '$lib/server/database/schema/link';

	export let links: Link[];
	export let selected: Link['id'] | null = null;
</script>

{#if links.length > 0}
	<Table.Root>
		<Table.Header>
			<Table.Head />
			<Table.Head>ID</Table.Head>
			<Table.Head>Original URL</Table.Head>
		</Table.Header>

		<Table.Body>
			{#each links as link (link.id)}
				{@const checked = selected === link.id}
				<Table.Row>
					<Table.Cell>
						<Checkbox {checked} on:click={() => (selected = checked ? null : link.id)} />
					</Table.Cell>
					<Table.Cell>{link.id}</Table.Cell>
					<Table.Cell>{link.url}</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
{:else}
	<p class="my-4 rounded-md text-muted-foreground">No links to select</p>
{/if}
