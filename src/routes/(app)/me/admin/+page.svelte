<script lang="ts">
	import { IconChevronLeft, IconLink, IconMail, IconUsers } from '@tabler/icons-svelte';
	import Button from '$lib/components/ui/button/button.svelte';

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

	dayjs.extend(relativeTime);

	export let data: PageData;
</script>

<svelte:head>
	<title>Admin panel</title>
</svelte:head>

<div class="mt-14 flex flex-col gap-2">
	<Tabs.Root
		value={$page.url.searchParams.get('view') ?? ''}
		onValueChange={(val) => {
			if (!browser) return;
			$page.url.searchParams.set('view', val ?? '');
			goto(`?${$page.url.searchParams.toString()}`, { replaceState: true, keepFocus: true });
		}}
	>
		<Tabs.List>
			<Button href="/me" variant="ghost" class="flex w-fit  gap-1 pl-2">
				<IconChevronLeft size={16} />
			</Button>

			<Tabs.Trigger value="links" class="gap-1">
				<IconLink size={14} /> Links
			</Tabs.Trigger>
			<Tabs.Trigger value="users" class="gap-1">
				<IconUsers size={14} />
				Users
			</Tabs.Trigger>
			<Tabs.Trigger value="invites" class="gap-1">
				<IconMail size={14} />
				Invites
			</Tabs.Trigger>
		</Tabs.List>

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
