<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import IconBrandGoogleFilled from '~icons/tabler/brand-google-filled';
</script>

<svelte:head>
	<title>Sign Up to pieni.link</title>
</svelte:head>

<Card.Root class="w-full max-w-sm">
	<Card.Header>
		<Card.Title class="mb-2 scroll-m-20 text-4xl font-extrabold tracking-tight">Sign Up</Card.Title>
		<Card.Description>
			You've been invited to join! Click below to create an account.
		</Card.Description>
	</Card.Header>

	<Card.Content class="w-full flex-col">
		<Button href="/auth/google?type=signup" class="mt-4 w-full gap-2">
			<IconBrandGoogleFilled width={16} height={16} />
			Continue with Google
		</Button>
	</Card.Content>
</Card.Root>
