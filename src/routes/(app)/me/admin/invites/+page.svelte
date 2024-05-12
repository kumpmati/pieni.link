<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import type { PageData } from './$types';
	import InvitesView from './InvitesView.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>Invites</title>
</svelte:head>

<Header title="Invites" description="Manage user invites" />

<InvitesView invites={data.invites} />
