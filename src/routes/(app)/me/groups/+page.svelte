<script lang="ts">
	import { enhance } from '$app/forms';
	import Header from '$lib/components/Header.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';

	export let data;
</script>

<svelte:head>
	<title>Groups</title>
</svelte:head>

<Header title="Groups" description="Organize multiple links under one group" />

<ul class="grid" style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));">
	{#each data.groups as group (group.id)}
		<a href="/me/groups/{group.id}">
			<Card.Root>
				<Card.Header>
					<Card.Title>{group.name}</Card.Title>
					<Card.Description>{group.description || 'No description'}</Card.Description>
				</Card.Header>
			</Card.Root>
		</a>
	{/each}
</ul>

<form method="post" action="?/create_group" use:enhance class="flex flex-col gap-4">
	<label class="flex w-fit flex-col">
		Name
		<input name="name" required />
	</label>

	<label class="flex w-fit flex-col">
		Description (optional)
		<textarea name="description" />
	</label>

	<Button type="submit" class="w-fit">Create group</Button>
</form>
