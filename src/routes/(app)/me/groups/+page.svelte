<script lang="ts">
	import { enhance } from '$app/forms';
	import Header from '$lib/components/Header.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	export let data;
</script>

<Header title="Groups" description="Organize multiple links under one group" />

<pre>{JSON.stringify(data.groups, null, 2)}</pre>

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
