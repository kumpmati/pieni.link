<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import IconChartHistogram from '~icons/tabler/chart-histogram';
	import IconEdit from '~icons/tabler/edit';
</script>

<div class="flex flex-col gap-2 pb-8">
	<div class="flex flex-row gap-1 pr-4">
		<Button
			variant={$page.url.pathname === `/me/links/${$page.params.id}/edit` ? 'secondary' : 'ghost'}
			href="/me/links/{$page.params.id}/edit"
			class="justify-start gap-2"
		>
			<IconEdit width={16} height={16} /> Edit
		</Button>
		<Button
			variant={$page.url.pathname.startsWith(`/me/links/${$page.params.id}/analytics`)
				? 'secondary'
				: 'ghost'}
			href="/me/links/{$page.params.id}/analytics"
			class="justify-start gap-2"
		>
			<IconChartHistogram width={16} height={16} /> Analytics
		</Button>
	</div>

	<slot />
</div>
