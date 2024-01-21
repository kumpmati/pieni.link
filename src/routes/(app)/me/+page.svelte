<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import {
		IconChartHistogram,
		IconDotsVertical,
		IconEdit,
		IconLogout,
		IconTrash
	} from '@tabler/icons-svelte';
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { PUBLIC_BASEURL } from '$env/static/public';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { enhance } from '$app/forms';

	dayjs.extend(relativeTime);

	export let data: PageData;
</script>

<div class="mt-10 flex flex-col gap-2">
	<div class="flex items-center justify-between">
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight">Profile</h1>

		<Button
			variant="destructive"
			data-sveltekit-preload-data="off"
			class="w-fit"
			href="/auth/signout"
		>
			<IconLogout size={16} class="mr-2" />
			Sign out
		</Button>
	</div>

	<Card.Root>
		<Card.Header>
			<Card.Title>{data.session?.user.name}</Card.Title>
		</Card.Header>
		<Card.Content class="flex flex-row">
			<img class="rounded-full" src={data.session?.user.image} alt={data.session?.user.name} />
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>My Links ({data.links.length})</Card.Title>
		</Card.Header>

		<Card.Content>
			{#if data.links.length > 0}
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head>Shortened link</Table.Head>
							<Table.Head>Original link</Table.Head>
							<Table.Head>Created</Table.Head>
							<Table.Head>Last used</Table.Head>
							<Table.Head />
						</Table.Row>
					</Table.Header>

					<Table.Body>
						{#each data.links as link (link.id)}
							{@const url = new URL(`${PUBLIC_BASEURL}/${link.id}`)}
							<Table.Row>
								<Table.Cell>
									<a href={url.toString()} target="_blank" referrerpolicy="no-referrer">
										{url.host}{url.pathname}
									</a>
								</Table.Cell>
								<Table.Cell>
									<a href={link.url} target="_blank" referrerpolicy="no-referrer">
										{link.url}
									</a>
								</Table.Cell>
								<Table.Cell>
									{link.createdAt.toLocaleString()}
								</Table.Cell>
								<Table.Cell>
									{link.lastUsed ? dayjs().to(link.lastUsed) : '-'}
								</Table.Cell>
								<Table.Cell class="text-right">
									<AlertDialog.Root>
										<DropdownMenu.Root>
											<DropdownMenu.Trigger asChild let:builder>
												<Button builders={[builder]} variant="ghost" size="icon">
													<IconDotsVertical size={16} />
												</Button>
											</DropdownMenu.Trigger>
											<DropdownMenu.Content>
												<DropdownMenu.Item href="/me/links/{link.id}/edit" class="gap-2">
													<IconEdit size={16} stroke={1.5} />
													Edit
												</DropdownMenu.Item>

												<DropdownMenu.Item href="/me/links/{link.id}" class="gap-2">
													<IconChartHistogram size={16} stroke={1.5} />
													Analytics
												</DropdownMenu.Item>

												<AlertDialog.Trigger class="contents">
													<DropdownMenu.Item class="gap-2 text-destructive">
														<IconTrash size={16} stroke={1.5} />
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

											<AlertDialog.Footer>
												<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>

												<form use:enhance class="contents" method="post" action="?/delete">
													<input type="hidden" name="id" value={link.id} />

													<AlertDialog.Action type="submit">
														<IconTrash size={16} /> Delete
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
		</Card.Content>
	</Card.Root>
</div>
