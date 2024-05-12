<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import type { OverallLinkStatistics } from '$lib/server/database/handlers/analytics';
	import IconStar from '~icons/tabler/star';
	import IconActivity from '~icons/tabler/activity';

	export let stats: OverallLinkStatistics | null;
</script>

<div
	class="grid justify-center gap-2"
	style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))"
>
	<Card.Root>
		<Card.Content class="mt-5 flex flex-col text-sm text-muted-foreground">
			<span class="flex items-center justify-between">
				Visits (last 24h) <IconActivity width={18} height={18} />
			</span>

			<span class="text-4xl font-extrabold text-primary">
				{#if stats}
					{stats.lastDay}
				{:else}
					<Skeleton class="mt-2 h-8 w-1/2" />
				{/if}
			</span>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Content class="mt-5 flex flex-col text-sm text-muted-foreground">
			<span class="flex items-center justify-between">
				Visits (all time) <IconActivity width={18} height={18} />
			</span>
			<span class="text-4xl font-extrabold text-primary">
				{#if stats}
					{stats.total}
				{:else}
					<Skeleton class="mt-2 h-8 w-1/2" />
				{/if}
			</span>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Content class="mt-5 flex flex-col overflow-hidden text-sm text-muted-foreground">
			<span class="flex items-center justify-between">
				Most visited ({stats?.mostVisited?.count ?? '-'}) <IconStar width={18} height={18} />
			</span>

			<a
				href={stats ? `/me/links/${stats?.mostVisited?.linkId}/analytics` : ''}
				class="overflow-ellipsis whitespace-nowrap text-3xl font-extrabold text-primary hover:underline"
			>
				{#if stats}
					{stats.mostVisited?.linkId ?? '-'}
				{:else}
					<Skeleton class="mt-2 h-8 w-1/2" />
				{/if}
			</a>
		</Card.Content>
	</Card.Root>
</div>
