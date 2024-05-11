<script>
	import TablerDashboard from '~icons/tabler/dashboard';
	import TablerList from '~icons/tabler/list';
	import TablerKey from '~icons/tabler/key';
	import TablerChevronLeft from '~icons/tabler/chevron-left';
	import TablerUserCog from '~icons/tabler/user-cog';
	import TablerUser from '~icons/tabler/user';
	import TablerReportSearch from '~icons/tabler/report-search';
	import TablerLogout from '~icons/tabler/logout';
	import IconMail from '~icons/tabler/mail';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Toaster } from '$lib/components/ui/sonner';
	import NavLink from './NavLink.svelte';
	import { Button } from '$lib/components/ui/button';

	export let data;
</script>

<Toaster theme="dark" />

<aside class="fixed top-0 flex h-full w-64 flex-col gap-4 overflow-y-auto p-2">
	<Button href="/" variant="link" size="sm" class="w-fit justify-start gap-2">
		<TablerChevronLeft />
		Home
	</Button>

	<h3 class="text-md ml-2 mt-0 flex items-center gap-3 font-semibold text-primary">
		<Avatar.Root class="h-9 w-9">
			<Avatar.Image src={data.session?.user.image} alt={data.session?.user.name} />
			<Avatar.Fallback>{data.session?.user.name}</Avatar.Fallback>
		</Avatar.Root>

		<span class="flex flex-col">
			{data.session?.user.name}
			<small class="text-slate-500">
				{data.session?.user.role}
			</small>
		</span>
	</h3>

	<nav>
		<ul class="flex w-full flex-col gap-1 overflow-y-auto">
			<h3 class="mx-4 mb-1 mt-4 text-xs font-semibold text-slate-500">General</h3>

			<li>
				<NavLink href="/me">
					<TablerDashboard width={16} height={16} />
					Overview
				</NavLink>
			</li>
			<li>
				<NavLink href="/me/links">
					<TablerList width={16} height={16} />
					My links
				</NavLink>
			</li>
			<li>
				<NavLink href="/me/account">
					<TablerUserCog width={16} height={16} />
					Account settings
				</NavLink>
			</li>

			<h3 class="mx-4 mb-1 mt-4 text-xs font-semibold text-slate-500">Advanced</h3>

			<li>
				<NavLink href="/me/api">
					<TablerKey width={16} height={16} />
					API keys
				</NavLink>
			</li>

			{#if data.session?.user.role === 'admin'}
				<h3 class="mx-4 mb-1 mt-4 text-xs font-semibold text-slate-500">Admin</h3>

				<li>
					<NavLink href="/me/admin/users">
						<TablerUser width={16} height={16} />
						All users
					</NavLink>
				</li>
				<li>
					<NavLink href="/me/admin/invites">
						<IconMail width={16} height={16} />
						User invites
					</NavLink>
				</li>
				<li>
					<NavLink href="/me/admin/links">
						<TablerList width={16} height={16} />
						All links
					</NavLink>
				</li>

				<h3 class="mx-4 mb-1 mt-4 text-xs font-semibold text-slate-500">Debug</h3>

				<li>
					<NavLink href="/me/admin/logs">
						<TablerReportSearch width={16} height={16} />
						Logs
					</NavLink>
				</li>
			{/if}
		</ul>
	</nav>

	<Button
		variant="destructive"
		data-sveltekit-preload-data="off"
		class="mt-auto w-full items-center gap-2"
		href="/auth/signout"
	>
		<TablerLogout width={16} height={16} />
		Sign out
	</Button>
</aside>

<!-- <Separator orientation="vertical" /> -->

<main class="flex w-full flex-col gap-2 p-4 pl-64">
	<slot />
</main>
