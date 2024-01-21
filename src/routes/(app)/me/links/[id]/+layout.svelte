<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { IconChartHistogram, IconChevronLeft, IconEdit } from '@tabler/icons-svelte';
</script>

<div class="relative flex w-full flex-row gap-2">
	<div class="absolute hidden -translate-x-full flex-col gap-1 pr-4 xl:flex">
		<Button href="/me" variant="ghost" class="justify-start gap-2">
			<IconChevronLeft size={16} /> Back to profile
		</Button>

		<Separator class="mb-2" />

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
