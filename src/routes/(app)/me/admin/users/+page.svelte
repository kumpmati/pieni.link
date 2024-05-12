<script lang="ts">
	import UsersView from './UsersView.svelte';
	import type { PageData } from './$types';
	import Header from '../../Header.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>Admin - Manage users</title>
</svelte:head>

<Header title="All users" description="Manage all users in the system" />

<UsersView users={data.users} session={data.session} />
