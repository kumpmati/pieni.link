<script lang="ts">
	import { page } from '$app/stores';
</script>

<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight">
	<small class="text-muted-foreground">{$page.status}</small>
	{$page.error?.message}
</h1>

<a href="/" class="mt-4">Back home</a>
