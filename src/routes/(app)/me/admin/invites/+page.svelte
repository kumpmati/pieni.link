<script lang="ts">
	import Header from '../../Header.svelte';
	import type { PageData } from './$types';
	import InvitesView from './InvitesView.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>Admin - User invites</title>
</svelte:head>

<Header title="User invites" description="Manage user invites" />

<InvitesView invites={data.invites} />
