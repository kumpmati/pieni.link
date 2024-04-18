<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import type { SignupToken } from '$lib/server/database/schema/auth';
	import IconCopy from '~icons/tabler/copy';
	import IconMailPlus from '~icons/tabler/mail-plus';
	import IconTrash from '~icons/tabler/trash';
	import dayjs from 'dayjs';
	import * as Dialog from '$lib/components/ui/dialog';
	import Label from '$lib/components/ui/label/label.svelte';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';

	export let invites: SignupToken[];
</script>

<Card.Root>
	<div class="flex w-full items-center justify-between">
		<Card.Header>
			<Card.Title>Invites</Card.Title>
			<Card.Description>Manage invites</Card.Description>
		</Card.Header>

		<Dialog.Root>
			<Dialog.Trigger>
				<Button class="mr-6 gap-2" size="sm" variant="secondary">
					<IconMailPlus width={16} height={16} />
					New Invite
				</Button>
			</Dialog.Trigger>

			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>New invite</Dialog.Title>
					<Dialog.Description>
						Creates a new invite token that can be used once to sign up.
					</Dialog.Description>
				</Dialog.Header>

				<form method="post" action="?/create_invite" class="flex flex-col gap-2" use:enhance>
					<Label>
						Role

						<select name="role" required>
							<option value="">Choose a role</option>
							<option value="member">Member</option>
							<option value="admin">Administrator</option>
						</select>
					</Label>

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
				<Table.Head>Token</Table.Head>
				<Table.Head>Role</Table.Head>
				<Table.Head>User</Table.Head>
				<Table.Head>Used At</Table.Head>
				<Table.Head>Created At</Table.Head>
				<Table.Head />
			</Table.Header>

			<Table.Body>
				{#each invites as invite (invite.id)}
					<Table.Row>
						<Table.Cell class="whitespace-nowrap">
							<span class="inline-flex items-center gap-1">
								<pre>{invite.id.substring(0, 15)}...</pre>

								<Button
									size="icon"
									class="h-6 w-6 p-0"
									variant="ghost"
									title="Copy to clipboard"
									on:click={async () =>
										navigator.clipboard
											.writeText(invite.id)
											.then(() => toast.success(`Copied invite token to clipboard!`))
											.catch((err) => toast.error(err))}
								>
									<IconCopy width={12} height={12} />
								</Button>
							</span>
						</Table.Cell>
						<Table.Cell>{invite.role}</Table.Cell>
						<Table.Cell>{invite.userId ?? '-'}</Table.Cell>
						<Table.Cell>{invite.usedAt ? dayjs().to(invite.usedAt) : '-'}</Table.Cell>
						<Table.Cell>{dayjs().to(invite.createdAt)}</Table.Cell>
						<Table.Cell>
							<form class="contents" use:enhance method="post" action="?/delete_invite">
								<input type="hidden" name="id" value={invite.id} />
								<Button
									type="submit"
									size="icon"
									variant="ghost"
									disabled={!!invite.usedAt}
									title={invite.usedAt ? 'Cannot delete already used invite' : ''}
								>
									<IconTrash width={16} height={16} />
								</Button>
							</form>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>
