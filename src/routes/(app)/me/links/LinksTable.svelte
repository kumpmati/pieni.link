<script lang="ts">
	import IconChartHistogram from '~icons/tabler/chart-histogram';
	import IconDotsVertical from '~icons/tabler/dots-vertical';
	import IconEdit from '~icons/tabler/edit';
	import IconExternalLink from '~icons/tabler/external-link';
	import IconTrash from '~icons/tabler/trash';
	import * as Table from '$lib/components/ui/table';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { PUBLIC_BASEURL } from '$env/static/public';
	import type { Link } from '$lib/server/database/schema/link';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';

	dayjs.extend(relativeTime);

	export let links: Link[];
</script>

{#if links.length > 0}
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Shortened link</Table.Head>
				<Table.Head>Original link</Table.Head>
				<Table.Head>Last visited</Table.Head>
				<Table.Head>Created</Table.Head>
				<Table.Head />
			</Table.Row>
		</Table.Header>

		<Table.Body>
			{#each links as link (link.id)}
				{@const url = new URL(`${PUBLIC_BASEURL}/${link.id}`)}
				<Table.Row>
					<Table.Cell>
						<div class="flex items-center gap-1">
							<a href="/me/links/{link.id}/edit" class="hover:underline">
								{link.id}
							</a>

							<a href={url.toString()} target="_blank" referrerpolicy="no-referrer">
								<IconExternalLink width={12} height={12} />
							</a>
						</div>
					</Table.Cell>
					<Table.Cell>
						<a href={link.url} target="_blank" referrerpolicy="no-referrer" class="hover:underline">
							{link.url}
						</a>
					</Table.Cell>
					<Table.Cell>
						{link.lastUsed ? dayjs().to(link.lastUsed) : '-'}
					</Table.Cell>
					<Table.Cell>
						{link.createdAt.toLocaleString()}
					</Table.Cell>
					<Table.Cell class="text-right">
						<AlertDialog.Root>
							<DropdownMenu.Root>
								<DropdownMenu.Trigger asChild let:builder>
									<Button builders={[builder]} variant="ghost" size="icon">
										<IconDotsVertical width={16} height={16} />
									</Button>
								</DropdownMenu.Trigger>
								<DropdownMenu.Content>
									<DropdownMenu.Item href="/me/links/{link.id}/edit" class="gap-2">
										<IconEdit width={16} height={16} stroke-width={1.5} />
										Edit
									</DropdownMenu.Item>

									<DropdownMenu.Item href="/me/links/{link.id}/analytics" class="gap-2">
										<IconChartHistogram width={16} height={16} stroke-width={1.5} />
										Analytics
									</DropdownMenu.Item>

									<AlertDialog.Trigger class="contents">
										<DropdownMenu.Item class="gap-2 text-destructive">
											<IconTrash width={16} height={16} stroke-width={1.5} />
											Delete
										</DropdownMenu.Item>
									</AlertDialog.Trigger>
								</DropdownMenu.Content>
							</DropdownMenu.Root>

							<AlertDialog.Content>
								<AlertDialog.Header>
									<AlertDialog.Title>Are you sure?</AlertDialog.Title>
									<AlertDialog.Description>
										You are about to permanently delete {link.id}. This cannot be undone.
									</AlertDialog.Description>
								</AlertDialog.Header>

								<AlertDialog.Footer class="gap-2">
									<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>

									<form use:enhance class="contents" method="post" action="/me/links?/delete_link">
										<input type="hidden" name="id" value={link.id} />

										<AlertDialog.Action type="button" asChild>
											<Button variant="destructive" type="submit" class="gap-1">
												<IconTrash width={16} height={16} /> Delete
											</Button>
										</AlertDialog.Action>
									</form>
								</AlertDialog.Footer>
							</AlertDialog.Content>
						</AlertDialog.Root>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
{:else}
	<p class="text-muted-foreground">
		You haven't shortened any links yet.
		<a href="/" class="text-foreground hover:underline"> Shorten link </a>
	</p>
{/if}
