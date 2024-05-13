<script lang="ts">
	import TablerDashboard from '~icons/tabler/dashboard';
	import TablerList from '~icons/tabler/list';
	import TablerKey from '~icons/tabler/key';
	import TablerChevronLeft from '~icons/tabler/chevron-left';
	import TablerUserCog from '~icons/tabler/user-cog';
	import TablerUsers from '~icons/tabler/users';
	import TablerReportSearch from '~icons/tabler/report-search';
	import TablerLogout from '~icons/tabler/logout';
	import TablerActivityHeartbeat from '~icons/tabler/activity-heartbeat';
	import TablerMail from '~icons/tabler/mail';
	import TablerFileText from '~icons/tabler/file-text';
	import * as Avatar from '$lib/components/ui/avatar';
	import NavLink from './NavLink.svelte';
	import { Button } from '$lib/components/ui/button';
	import type { Session } from 'lucia';
	import { cn } from '$lib/utils';
	import type { UserCounts } from '$lib/server/database/handlers/dashboard';

	let className: string = '';
	export let session: Session | null;
	export let counts: UserCounts | null;

	export { className as class };
</script>

<aside class={cn('flex h-full flex-col gap-4 p-2', className)}>
	<Button href="/" variant="link" size="sm" class="w-fit justify-start gap-2">
		<TablerChevronLeft />
		Home
	</Button>

	<h3 class="text-md ml-2 mt-0 flex items-center gap-3 font-bold text-primary">
		<Avatar.Root class="h-9 w-9">
			<Avatar.Image src={session?.user.image} alt={session?.user.name} />
			<Avatar.Fallback>{session?.user.name}</Avatar.Fallback>
		</Avatar.Root>

		<span class="flex flex-col font-display">
			{session?.user.name}
			<small class="font-sans text-sm font-normal text-slate-500">
				{session?.user.role}
			</small>
		</span>
	</h3>

	<nav class="overflow-y-auto">
		<ul class="flex w-full flex-col gap-1">
			<h3 class="mx-4 mb-1 mt-4 text-xs font-semibold text-slate-500">General</h3>

			<li>
				<NavLink href="/me">
					<TablerDashboard width={16} height={16} />
					Overview
				</NavLink>
			</li>
			<li>
				<NavLink href="/me/links" count={counts?.numLinks}>
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
				<NavLink href="/me/api" count={counts?.numApiKeys}>
					<TablerKey width={16} height={16} />
					API keys
				</NavLink>
			</li>

			<li>
				<NavLink href="/me/api/docs">
					<TablerFileText width={16} height={16} />
					API Documentation
				</NavLink>
			</li>

			{#if session?.user.role === 'admin'}
				<h3 class="mx-4 mb-1 mt-4 text-xs font-semibold text-slate-500">Admin</h3>

				<li>
					<NavLink href="/me/admin/users" count={counts?.numAllUsers}>
						<TablerUsers width={16} height={16} />
						All users
					</NavLink>
				</li>
				<li>
					<NavLink href="/me/admin/invites" count={counts?.numInvites}>
						<TablerMail width={16} height={16} />
						Invites
					</NavLink>
				</li>
				<li>
					<NavLink href="/me/admin/links" count={counts?.numAllLinks}>
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

				<li>
					<NavLink href="/me/admin/health">
						<TablerActivityHeartbeat width={16} height={16} />
						Health
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
