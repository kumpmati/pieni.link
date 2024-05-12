<script lang="ts">
	import { getPageTitleStore } from '../../store';
	import type { PageData } from './$types';
	import InvitesView from './InvitesView.svelte';

	export let data: PageData;

	getPageTitleStore().set('User invites');
</script>

<svelte:head>
	<title>Admin - User invites</title>
</svelte:head>

<InvitesView invites={data.invites} />
