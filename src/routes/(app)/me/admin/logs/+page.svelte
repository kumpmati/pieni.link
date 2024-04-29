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

	dayjs.extend(relativeTime);

	export let data: PageData;

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

<Crumbs
	links={[
		{ href: '/', label: 'Home' },
		{ href: '/me', label: 'My account' },
		{ href: '/me/admin', label: 'Admin panel' },
		{ href: '/me/admin/logs', label: 'Logs' }
	]}
/>

<Card.Root class="mt-4">
	<Card.Header class="relative">
		<Card.Title>Logs</Card.Title>
		<Card.Description>Last 30 days of application logs</Card.Description>

		<div class="absolute right-4 top-3 flex gap-2">
			<Select.Root portal={null}>
				<Select.Trigger class="min-w-[8rem]">
					<Select.Value placeholder="Log level" />
				</Select.Trigger>

				<Select.Content>
					{#each Object.entries(levelToString) as [val, name] (val)}
						<a href="/me/admin/logs?level={val}">
							<Select.Item value={val} label="Level: {name}">{name}</Select.Item>
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
							This will delete all application logs permanently
						</AlertDialog.Description>
					</AlertDialog.Header>

					<AlertDialog.Footer>
						<form method="post" action="?/delete_all_logs" class="flex gap-2" use:enhance>
							<AlertDialog.Cancel type="reset">Cancel</AlertDialog.Cancel>

							<AlertDialog.Action
								type="submit"
								class="gap-2 {buttonVariants({ variant: 'destructive' })}"
							>
								<IconTrash width={16} height={16} /> Delete all logs
							</AlertDialog.Action>
						</form>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog.Root>
		</div>
	</Card.Header>

	<Card.Content>
		<Table.Root>
			<Table.Body>
				{#await data.logs}
					<Table.Row><Skeleton class="h-10 w-full" /></Table.Row>
				{:then logs}
					{#each logs as row (row.id)}
						<Table.Row>
							<Table.Cell class="w-[2rem] text-right font-mono {levelColor[row.level]}">
								{levelToString[row.level] ?? '-'}
							</Table.Cell>
							<Table.Cell class="font-mono ">{row.message}</Table.Cell>

							<Table.Cell
								class="w-[11.25rem] font-mono text-slate-600"
								title={row.timestamp.toString()}
							>
								{dayjs(row.timestamp).format('YYYY-MM-DD HH:mm:ss')}
							</Table.Cell>
						</Table.Row>
					{:else}
						<Table.Row>
							<Table.Cell>No logs.</Table.Cell>
							<Table.Cell />
							<Table.Cell />
						</Table.Row>
					{/each}
				{/await}
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>
