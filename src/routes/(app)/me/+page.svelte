<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import {
		IconChartHistogram,
		IconDotsVertical,
		IconEdit,
		IconExternalLink,
		IconLogout,
		IconSettings,
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

<svelte:head>
	<title>Me</title>
</svelte:head>

<div class="mt-10 flex flex-col gap-2">
	<div class="flex items-center justify-between">
		<div class="mb-4 mt-5 flex flex-row items-center gap-4">
			<img
				class="h-10 w-10 rounded-full"
				src={data.session?.user.image}
				alt={data.session?.user.name}
			/>

			<span>
				<h1>{data.session?.user.name}</h1>
				<small class="text-muted-foreground">{data.session?.user.role}</small>
			</span>
		</div>

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

	{#if data.session?.user.role === 'admin'}
		<Button href="/me/admin" class="w-fit gap-2" variant="outline">
			<IconSettings size={16} />
			Admin Panel
		</Button>
	{/if}

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
							<Table.Head>Last Used</Table.Head>
							<Table.Head>Created</Table.Head>
							<Table.Head />
						</Table.Row>
					</Table.Header>

					<Table.Body>
						{#each data.links as link (link.id)}
							{@const url = new URL(`${PUBLIC_BASEURL}/${link.id}`)}
							<Table.Row>
								<Table.Cell>
									<div class="flex items-center gap-1">
										<a href="/me/links/{link.id}" class="hover:underline">
											{link.id}
										</a>

										<a href={url.toString()} target="_blank" referrerpolicy="no-referrer">
											<IconExternalLink size={12} />
										</a>
									</div>
								</Table.Cell>
								<Table.Cell>
									<a
										href={link.url}
										target="_blank"
										referrerpolicy="no-referrer"
										class="hover:underline"
									>
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
