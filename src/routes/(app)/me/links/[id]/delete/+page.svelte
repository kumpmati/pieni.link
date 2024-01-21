<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/button/button.svelte';
	import { IconTrash } from '@tabler/icons-svelte';
</script>

<h1>Are you sure?</h1>

<form method="post">
	<Button href="/me/links/{$page.params.id}" variant="default">Cancel</Button>

	<Button variant="destructive" type="submit">
		<IconTrash size={16} />
		Permanently delete link
	</Button>
</form>
