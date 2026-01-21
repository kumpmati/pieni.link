<script lang="ts">
	import Main from '$lib/components/layout/Main.svelte';
	import { getAllLinksWithOldUserId, migrateAllOldLinks } from '$lib/queries/migrate.remote';
	import { getCurrentUser } from '$lib/queries/user.remote';
	import { Button, TextField } from 'm3-svelte';

	let userIdValue = $state('');
	let currentUser = await getCurrentUser();

	const links = $derived(await getAllLinksWithOldUserId(userIdValue));
</script>

<svelte:head>
	<title>Migrate old links</title>
</svelte:head>

<Main>
	<Button style="width:fit-content;" href="/" variant="text">Back</Button>
	<h1 style="margin:0;">Migrate old links</h1>

	{#if currentUser}
		<p>Type your v1 user ID below to migrate all your previous links.</p>

		<div style="display:flex;width:100%;margin-bottom:5rem;">
			<form {...migrateAllOldLinks} style="display:flex;flex-direction:column;gap:1rem;width:100%;">
				<TextField
					autocomplete="off"
					maxlength={15}
					label="Old user ID"
					name="oldUserId"
					bind:value={userIdValue}
				/>

				{#if userIdValue !== ''}
					<table style="width:100%;">
						<thead>
							<tr>
								<td>Slug</td>
								<td>URL</td>
							</tr>
						</thead>
						<tbody>
							{#each links as link (link.id)}
								<tr>
									<td>{link.id}</td>
									<td>
										<p
											style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:32ch"
										>
											{link.url}
										</p>
									</td>
								</tr>
							{:else}
								{#if userIdValue !== ''}
									<tr>
										<td colspan="2">
											<p style="text-align:center">No links found</p>
										</td>
									</tr>
								{/if}
							{/each}
						</tbody>
					</table>
				{/if}

				<Button disabled={links.length === 0}>Migrate all links ({links.length})</Button>
			</form>
		</div>
	{:else}
		<p>Sign in before migrating</p>
	{/if}
</Main>
