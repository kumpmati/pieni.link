<script lang="ts">
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	import * as Table from '$lib/components/ui/table';
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import Crumbs from '$lib/components/Crumbs.svelte';
	import * as Select from '$lib/components/ui/select';
	import type { Level } from 'pino';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/button/button.svelte';
	import { enhance } from '$app/forms';
	import IconTrash from '~icons/tabler/trash';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { buttonVariants } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import IconRefresh from '~icons/tabler/refresh';

	dayjs.extend(relativeTime);

	export let data: PageData;

	$: level = parseInt($page.url.searchParams.get('level') || '40');

	const levelToString: Record<number, Level> = {
		10: 'trace',
		20: 'debug',
		30: 'info',
		40: 'warn',
		50: 'error',
		60: 'fatal'
	};

	const levelColor: Record<number, string> = {
		10: 'text-blue-200',
		20: 'text-slate-200',
		30: 'text-blue-400',
		40: 'text-orange-400',
		50: 'text-red-400',
		60: 'text-red-500'
	};
</script>

<svelte:head>
	<title>Logs ({level ? levelToString[level] : 'warn'})</title>
</svelte:head>

<Crumbs
	links={[
		{ href: '/', label: 'Home' },
		{ href: '/me', label: 'My account' },
		{ href: '/me/admin', label: 'Admin panel' },
		{ href: '/me/admin/logs', label: 'Logs' }
	]}
/>

<Card.Root class="mt-4">
	<Card.Header class="flex-row justify-between">
		<div class="flex flex-col gap-1">
			<Card.Title>Logs</Card.Title>
			<Card.Description>Last 30 days of application logs</Card.Description>
		</div>

		<div class="flex w-fit flex-row items-start gap-2">
			<Button
				on:click={() => goto($page.url, { invalidateAll: true, replaceState: true })}
				variant="outline"
				size="icon"
				class="min-w-9"
			>
				<IconRefresh width={16} height={16} />
			</Button>

			<Select.Root selected={{ label: levelToString[level], value: level.toString() }}>
				<Select.Trigger class="w-[7rem]">
					<Select.Value placeholder="Log level" />
				</Select.Trigger>

				<Select.Content>
					{#each Object.entries(levelToString) as [val, name] (val)}
						<a href="/me/admin/logs?level={val}" data-sveltekit-replacestate>
							<Select.Item value={val} label={name} class="gap-2">
								{name}
							</Select.Item>
						</a>
					{/each}
				</Select.Content>
			</Select.Root>

			<AlertDialog.Root>
				<AlertDialog.Trigger>
					<Button variant="destructive" class="gap-2" size="icon">
						<IconTrash width={14} height={14} />
					</Button>
				</AlertDialog.Trigger>

				<AlertDialog.Content>
					<AlertDialog.Header>
						<AlertDialog.Title>Are you sure?</AlertDialog.Title>
						<AlertDialog.Description>
							This will delete all application logs permanently.
						</AlertDialog.Description>
					</AlertDialog.Header>

					<form method="post" action="?/delete_all_logs" class="contents" use:enhance>
						<AlertDialog.Footer>
							<AlertDialog.Cancel type="reset">Cancel</AlertDialog.Cancel>

							<AlertDialog.Action
								type="submit"
								class="gap-2 {buttonVariants({ variant: 'destructive' })}"
							>
								<IconTrash width={16} height={16} /> Delete all logs
							</AlertDialog.Action>
						</AlertDialog.Footer>
					</form>
				</AlertDialog.Content>
			</AlertDialog.Root>
		</div>
	</Card.Header>

	<Card.Content>
		<Table.Root>
			<Table.Header>
				<Table.Head class="w-[2rem] text-right">Level</Table.Head>
				<Table.Head class="w-full">Message</Table.Head>
				<Table.Head class="min-w-[11.25rem] max-w-[11.25rem]">Time</Table.Head>
			</Table.Header>

			<Table.Body>
				{#await data.logs}
					<Table.Row>
						<Table.Cell><Skeleton class="h-8 w-full" /></Table.Cell>
						<Table.Cell><Skeleton class="h-8 w-full" /></Table.Cell>
						<Table.Cell><Skeleton class="h-8 w-full" /></Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell><Skeleton class="h-8 w-full" /></Table.Cell>
						<Table.Cell><Skeleton class="h-8 w-full" /></Table.Cell>
						<Table.Cell><Skeleton class="h-8 w-full" /></Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell><Skeleton class="h-8 w-full" /></Table.Cell>
						<Table.Cell><Skeleton class="h-8 w-full" /></Table.Cell>
						<Table.Cell><Skeleton class="h-8 w-full" /></Table.Cell>
					</Table.Row>
				{:then logs}
					{#each logs as row (row.id)}
						<Table.Row class="font-mono">
							<Table.Cell class={levelColor[row.level]}>
								{levelToString[row.level] ?? '-'}
							</Table.Cell>

							<Table.Cell>{row.message}</Table.Cell>

							<Table.Cell class="text-slate-600" title={row.timestamp.toString()}>
								{dayjs(row.timestamp).format('YYYY-MM-DD HH:mm:ss')}
							</Table.Cell>
						</Table.Row>
					{:else}
						<Table.Row>
							<Table.Cell />
							<Table.Cell class="text-slate-600 font-mono">
								No logs. (showing {level ? levelToString[level] : 'warn'} or above)
							</Table.Cell>
							<Table.Cell />
						</Table.Row>
					{/each}
				{/await}
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>
