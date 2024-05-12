<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import type { SignupToken } from '$lib/server/database/schema/auth';
	import IconCopy from '~icons/tabler/copy';
	import IconMailPlus from '~icons/tabler/mail-plus';
	import IconTrash from '~icons/tabler/trash';
	import dayjs from 'dayjs';
	import * as Dialog from '$lib/components/ui/dialog';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { PUBLIC_BASEURL } from '$env/static/public';
	import relativeTime from 'dayjs/plugin/relativeTime';

	dayjs.extend(relativeTime);

	export let invites: SignupToken[];
</script>

<Card.Root>
	<div class="flex w-full items-center justify-between">
		<Card.Header>
			<Card.Title>Invites</Card.Title>
			<Card.Description>Manage invites</Card.Description>
		</Card.Header>

		<Dialog.Root>
			<Dialog.Trigger class="mr-6 gap-2 {buttonVariants({ variant: 'secondary', size: 'sm' })}">
				<IconMailPlus width={16} height={16} />
				New Invite
			</Dialog.Trigger>

			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>New invite</Dialog.Title>
					<Dialog.Description>
						Creates a new invite token that can be used once to sign up.
					</Dialog.Description>
				</Dialog.Header>

				<form method="post" action="?/create_invite" class="contents">
					<select name="role" required class="rounded-md p-2">
						<option value="">Choose a role</option>
						<option value="member">Member</option>
						<option value="admin">Administrator</option>
					</select>

					<Dialog.Footer>
						<Button type="submit">Create invite</Button>
					</Dialog.Footer>
				</form>
			</Dialog.Content>
		</Dialog.Root>
	</div>

	<Card.Content>
		<Table.Root>
			<Table.Header>
				<Table.Head>Link</Table.Head>
				<Table.Head>Role</Table.Head>
				<Table.Head>Created</Table.Head>
				<Table.Head>Used</Table.Head>
				<Table.Head>Used by</Table.Head>
				<Table.Head />
			</Table.Header>

			<Table.Body>
				{#each invites as invite (invite.id)}
					{@const link = `${PUBLIC_BASEURL}/auth/signup?token=${invite.id}`}

					<Table.Row>
						<Table.Cell class="whitespace-nowrap">
							<span class="inline-flex items-center gap-1" title={link}>
								<pre>{link.slice(0, 15)}...{link.slice(-6)}</pre>

								<Button
									size="icon"
									class="h-6 w-6 p-0"
									variant="ghost"
									title="Copy to clipboard"
									on:click={async () =>
										navigator.clipboard
											.writeText(link)
											.then(() => toast.success(`Copied invite token to clipboard!`))
											.catch((err) => toast.error(err))}
								>
									<IconCopy width={12} height={12} />
								</Button>
							</span>
						</Table.Cell>
						<Table.Cell>{invite.role}</Table.Cell>
						<Table.Cell>{dayjs().to(invite.createdAt)}</Table.Cell>
						<Table.Cell>{invite.usedAt ? dayjs().to(invite.usedAt) : '-'}</Table.Cell>
						<Table.Cell>{invite.userId ?? '-'}</Table.Cell>
						<Table.Cell>
							<AlertDialog.Root>
								<AlertDialog.Trigger
									class="gap-2 {buttonVariants({ variant: 'ghost', size: 'icon' })}"
									disabled={!!invite.usedAt}
								>
									<IconTrash width={16} height={16} />
								</AlertDialog.Trigger>

								<AlertDialog.Content>
									<AlertDialog.Header>
										<AlertDialog.Title>Are you sure?</AlertDialog.Title>
										<AlertDialog.Description>
											Do you want to delete the unused {invite.role} invite link:
											<p>{invite.id}</p>
										</AlertDialog.Description>
									</AlertDialog.Header>

									<form class="contents" use:enhance method="post" action="?/delete_invite">
										<input type="hidden" name="id" value={invite.id} />
										<AlertDialog.Footer>
											<AlertDialog.Cancel type="reset">Cancel</AlertDialog.Cancel>

											<AlertDialog.Action
												type="submit"
												class="gap-2 {buttonVariants({ variant: 'destructive' })}"
												disabled={!!invite.usedAt}
												title={invite.usedAt ? 'Cannot delete already used invite' : ''}
											>
												<IconTrash width={16} height={16} />
												Delete invite
											</AlertDialog.Action>
										</AlertDialog.Footer>
									</form>
								</AlertDialog.Content>
							</AlertDialog.Root>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>
