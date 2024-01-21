<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { IconChartHistogram, IconChevronLeft, IconEdit } from '@tabler/icons-svelte';
</script>

<div class="relative flex w-full flex-col gap-2 lg:flex-row">
	<div class="flex flex-row gap-1 pr-4 lg:absolute lg:-translate-x-full lg:flex-col xl:flex">
		<Button href="/me" variant="ghost" class="justify-start gap-2 pl-2 lg:pl-4">
			<IconChevronLeft size={16} /> Profile
		</Button>

		<Separator class="hidden lg:flex" />

		<Button
			variant={$page.url.pathname === `/me/links/${$page.params.id}/edit` ? 'secondary' : 'ghost'}
			href="/me/links/{$page.params.id}/edit"
			class="justify-start gap-2"
		>
			<IconEdit size={16} /> Edit
		</Button>
		<Button
			variant={$page.url.pathname === `/me/links/${$page.params.id}` ? 'secondary' : 'ghost'}
			href="/me/links/{$page.params.id}"
			class="justify-start gap-2"
		>
			<IconChartHistogram size={16} /> Analytics
		</Button>
	</div>

	<slot />
</div>
