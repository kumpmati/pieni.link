<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>{data.group.name}</title>
</svelte:head>

<h1 class="scroll-m-20 font-display text-4xl font-extrabold tracking-tight">
	{data.group.name}
</h1>
<p class="text-lg text-muted-foreground">{data.group.description}</p>

<ul
	class="mt-4 grid w-full gap-4"
	style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); grid-auto-rows: 80px"
>
	{#each data.links as link (link.itemId)}
		<li>
			<Button href="/{link.id}" size="lg" class="h-full w-full gap-2 text-lg" variant="secondary">
				{link.name}
			</Button>
		</li>
	{/each}
</ul>
