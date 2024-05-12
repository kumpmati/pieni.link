<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import IconTrash from '~icons/tabler/trash';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import Button from '$lib/components/ui/button/button.svelte';
	import Header from '$lib/components/Header.svelte';
</script>

<svelte:head>
	<title>Account settings</title>
</svelte:head>

<Header title="Account settings" description="Manage your account" />

<Card.Root class="max-w-lg">
	<Card.Header>
		<Card.Title>Danger zone</Card.Title>
		<Card.Description>Be careful now, these actions are irreversible!</Card.Description>
	</Card.Header>

	<Card.Content>
		<AlertDialog.Root>
			<AlertDialog.Trigger>
				<Button variant="destructive" class="gap-2">
					<IconTrash width={16} height={16} /> Delete account
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

				<form method="post" action="?/delete_account" class="contents">
					<AlertDialog.Footer>
						<AlertDialog.Cancel type="reset">Keep account</AlertDialog.Cancel>

						<AlertDialog.Action
							type="submit"
							class="gap-2 {buttonVariants({ variant: 'destructive' })}"
						>
							<IconTrash width={16} height={16} /> Delete account
						</AlertDialog.Action>
					</AlertDialog.Footer>
				</form>
			</AlertDialog.Content>
		</AlertDialog.Root>
	</Card.Content>
</Card.Root>
