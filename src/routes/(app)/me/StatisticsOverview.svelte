<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { LinkStatistics } from '$lib/server/database/handlers/linkVisit';
	import { IconStar, IconActivity } from '@tabler/icons-svelte';

	export let stats: LinkStatistics;
</script>

<div
	class="grid justify-center gap-2"
	style="grid-template-columns: repeat(auto-fit, minmax(150px, 1fr))"
>
	<Card.Root>
		<Card.Content class="mt-5 flex flex-col text-sm text-muted-foreground">
			<span class="flex items-center justify-between">
				Visits (last 24h) <IconActivity size={18} />
			</span>
			<span class="text-4xl font-extrabold text-primary">
				{stats.lastDay}
			</span>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Content class="mt-5 flex flex-col text-sm text-muted-foreground">
			<span class="flex items-center justify-between">
				Visits (all time) <IconActivity size={18} />
			</span>
			<span class="text-4xl font-extrabold text-primary">{stats.total}</span>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Content class="mt-5 flex flex-col overflow-hidden text-sm text-muted-foreground">
			<span class="flex items-center justify-between">
				Most visited ({stats.mostVisited?.count ?? '-'})
				<IconStar size={18} />
			</span>

			<a
				href="/me/links/{stats.mostVisited?.linkId}"
				class="overflow-ellipsis whitespace-nowrap text-3xl font-extrabold text-primary hover:underline"
			>
				{stats.mostVisited?.linkId ?? '-'}
			</a>
		</Card.Content>
	</Card.Root>
</div>
