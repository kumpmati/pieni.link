<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';

	type Crumb = { label: string; href?: string };

	export let links: Crumb[];
</script>

<Breadcrumb.Root class="mb-2">
	<Breadcrumb.List>
		{#each links as link, i (link.label)}
			<Breadcrumb.Item>
				{#if i === links.length - 1}
					<Breadcrumb.Page>
						{link.label}
					</Breadcrumb.Page>
				{:else}
					<Breadcrumb.Link href={link.href}>
						{link.label}
					</Breadcrumb.Link>
				{/if}
			</Breadcrumb.Item>

			{#if i < links.length - 1}
				<Breadcrumb.Separator />
			{/if}
		{/each}
	</Breadcrumb.List>
</Breadcrumb.Root>
