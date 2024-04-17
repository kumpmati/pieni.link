<script lang="ts">
	import { page } from '$app/stores';

	export let items: { text: string; href: string }[];
</script>

<ul
	class="inline-flex h-9 w-fit items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground"
>
	{#each items as item (item.href)}
		<a
			data-state={$page.url.pathname === item.href ? 'active' : ''}
			href={item.href}
			class="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
		>
			{item.text}
		</a>
	{/each}
</ul>
