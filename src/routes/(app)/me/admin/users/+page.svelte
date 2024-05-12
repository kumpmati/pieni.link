<script lang="ts">
	import UsersView from './UsersView.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Admin - Manage users</title>
</svelte:head>

<UsersView users={data.users} session={data.session} />
