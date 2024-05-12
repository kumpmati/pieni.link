<script lang="ts">
	import type { PageData } from './$types';
	import InvitesView from './InvitesView.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>Admin - Manage invites</title>
</svelte:head>

<InvitesView invites={data.invites} />
