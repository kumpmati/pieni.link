<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import type { PerLinkStatistics } from '$lib/server/database/handlers/linkVisit';

	export let stats: PerLinkStatistics | null;
</script>

<div
	class="grid justify-center gap-2"
	style="grid-template-columns: repeat(auto-fit, minmax(150px, 1fr))"
>
	<Card.Root>
		<Card.Content class="mt-5 flex flex-col text-sm text-muted-foreground">
			<span class="flex items-center justify-between"> Visits (last 24h) </span>
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
			<span class="flex items-center justify-between"> Visits (last 7 days) </span>
			<span class="text-4xl font-extrabold text-primary">
				{#if stats}
					{stats.lastWeek}
				{:else}
					<Skeleton class="mt-2 h-8 w-1/2" />
				{/if}
			</span>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Content class="mt-5 flex flex-col text-sm text-muted-foreground">
			<span class="flex items-center justify-between"> Visits (all time) </span>
			<span class="text-4xl font-extrabold text-primary">
				{#if stats}
					{stats.total}
				{:else}
					<Skeleton class="mt-2 h-8 w-1/2" />
				{/if}
			</span>
		</Card.Content>
	</Card.Root>
</div>
