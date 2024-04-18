<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { IconLogout } from '@tabler/icons-svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<div class="mt-12 flex flex-col gap-2">
	<slot />
</div>
