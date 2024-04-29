<script lang="ts">
	import IconLink from '~icons/tabler/link';
	import IconMail from '~icons/tabler/mail';
	import IconUsers from '~icons/tabler/users';
	import IconLogs from '~icons/tabler/logs';
	import type { PageData } from './$types';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import * as Tabs from '$lib/components/ui/tabs';
	import UsersView from './UsersView.svelte';
	import LinksView from './LinksView.svelte';
	import InvitesView from './InvitesView.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import Crumbs from '$lib/components/Crumbs.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	dayjs.extend(relativeTime);

	export let data: PageData;

	const changeTab = (val: string | undefined) => {
		if (!browser) return;

		$page.url.searchParams.set('view', val ?? '');
		goto(`?${$page.url.searchParams.toString()}`, { replaceState: true, keepFocus: true });
	};
</script>

<svelte:head>
	<title>Admin panel</title>
</svelte:head>

<Crumbs
	links={[
		{ label: 'Home', href: '/' },
		{ label: 'My account', href: '/me' },
		{ label: 'Admin panel', href: '/me/admin' }
	]}
/>

<div class="flex flex-col gap-2">
	<Tabs.Root value={$page.url.searchParams.get('view') ?? ''} onValueChange={changeTab}>
		<Tabs.List>
			<Tabs.Trigger value="links" class="gap-2">
				<IconLink width={14} height={14} /> Links
			</Tabs.Trigger>
			<Tabs.Trigger value="users" class="gap-2">
				<IconUsers width={14} height={14} />
				Users
			</Tabs.Trigger>
			<Tabs.Trigger value="invites" class="gap-2">
				<IconMail width={14} height={14} />
				Invites
			</Tabs.Trigger>
		</Tabs.List>

		<Button variant="ghost" href="/me/admin/logs" class="gap-2">
			<IconLogs width={14} height={14} />
			Logs
		</Button>

		<Tabs.Content value="links">
			<LinksView links={data.links} />
		</Tabs.Content>

		<Tabs.Content value="users">
			<UsersView users={data.users} session={data.session} />
		</Tabs.Content>

		<Tabs.Content value="invites">
			<InvitesView invites={data.invites} />
		</Tabs.Content>
	</Tabs.Root>
</div>
