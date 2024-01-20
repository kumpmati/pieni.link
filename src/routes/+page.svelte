<script>
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
</script>

<svelte:head>
	<title>pätkä.link</title>
</svelte:head>

<form use:enhance method="post" action="?/create" class="flex max-w-sm gap-2">
	<Input name="url" type="url" />
	<Button type="submit">Shorten</Button>
</form>
