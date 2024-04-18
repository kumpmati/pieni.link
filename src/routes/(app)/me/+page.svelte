<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { IconKey, IconLogout, IconServerCog, IconTrash } from '@tabler/icons-svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import type { PageData } from './$types';
	import LinksTable from './LinksTable.svelte';
	import * as Card from '$lib/components/ui/card';
	import OverallStatisticsOverview from './OverallStatisticsOverview.svelte';
	import Crumbs from '$lib/components/Crumbs.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>Me</title>
</svelte:head>

<Crumbs
	links={[
		{ label: 'Home', href: '/' },
		{ label: 'My account', href: '/me' }
	]}
/>

<Card.Root>
	<Card.Content class="pb-1">
		<div class="flex items-center justify-between">
			<div class="my-4 flex flex-row items-center gap-4">
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

		<div class="mb-4 flex gap-2">
			<Button href="/me/api" class="w-fit gap-2" variant="secondary">
				<IconKey size={16} /> API Keys
			</Button>

			{#if data.session?.user.role === 'admin'}
				<Button href="/me/admin" class="w-fit gap-2" variant="secondary">
					<IconServerCog size={16} />
					Admin Panel
				</Button>
			{/if}
		</div>
	</Card.Content>
</Card.Root>

{#await data.stats}
	<OverallStatisticsOverview stats={null} />
{:then stats}
	<OverallStatisticsOverview {stats} />
{/await}

<Card.Root>
	<Card.Header>
		<Card.Title>My Links</Card.Title>
	</Card.Header>

	<Card.Content>
		<LinksTable links={data.links} />
	</Card.Content>
</Card.Root>

<Card.Root>
	<Card.Header>
		<Card.Title>Danger zone</Card.Title>
		<Card.Description>Be careful now!</Card.Description>
	</Card.Header>

	<Card.Content>
		<AlertDialog.Root>
			<AlertDialog.Trigger>
				<Button variant="destructive" class="gap-2">
					<IconTrash size={16} /> Delete account
				</Button>
			</AlertDialog.Trigger>

			<AlertDialog.Content>
				<AlertDialog.Header>
					<AlertDialog.Title>Are you sure?</AlertDialog.Title>
					<AlertDialog.Description>
						If you delete your account, all of the links associated with it will also be deleted
						permanently.
					</AlertDialog.Description>
				</AlertDialog.Header>

				<AlertDialog.Footer>
					<form method="post" action="?/delete_account" class="flex gap-2">
						<AlertDialog.Cancel type="reset">Keep account</AlertDialog.Cancel>
						<Button type="submit" variant="destructive" class="gap-2">
							<IconTrash size={16} /> Delete account
						</Button>
					</form>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>
	</Card.Content>
</Card.Root>
