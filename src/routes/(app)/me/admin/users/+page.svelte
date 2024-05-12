<script lang="ts">
	import UsersView from './UsersView.svelte';
	import type { PageData } from './$types';
	import { getPageTitleStore } from '../../store';

	export let data: PageData;

	getPageTitleStore().set('All users');
</script>

<svelte:head>
	<title>Admin - Manage users</title>
</svelte:head>

<UsersView users={data.users} session={data.session} />
