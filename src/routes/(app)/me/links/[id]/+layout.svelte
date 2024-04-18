<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import IconChartHistogram from '~icons/tabler/chart-histogram';
	import IconChevronLeft from '~icons/tabler/chevron-left';
	import IconEdit from '~icons/tabler/edit';
</script>

<div class="relative mt-14 flex w-full flex-col gap-2 pb-8 lg:flex-row">
	<div class="flex flex-row gap-1 pr-4 lg:absolute lg:-translate-x-full lg:flex-col xl:flex">
		<Button href="/me" variant="ghost" class="justify-start gap-2 pl-2 lg:pl-4">
			<IconChevronLeft width={16} height={16} /> Profile
		</Button>

		<Separator class="hidden lg:flex" />

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
