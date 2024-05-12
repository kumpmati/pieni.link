<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import IconChartHistogram from '~icons/tabler/chart-histogram';
	import IconEdit from '~icons/tabler/edit';
	import Header from '../../Header.svelte';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';

	dayjs.extend(relativeTime);

	export let data;
</script>

<Header title={data.link.id} description="Created {dayjs().to(data.link.createdAt)}">
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
	</div></Header
>

<div class="flex flex-col gap-2 pb-8">
	<slot />
</div>
