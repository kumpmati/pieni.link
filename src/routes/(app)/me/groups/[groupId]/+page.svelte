<script lang="ts">
	import type { PageData } from './$types';
	import Header from '$lib/components/Header.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	export let data: PageData;
</script>

<Header title={data.group.name} description={data.group.description} />

<pre>{JSON.stringify(data.group, null, 2)}</pre>

<form method="post" action="?/add_link">
	<input type="text" name="linkId" required />

	<Button type="submit">Add link</Button>
</form>
