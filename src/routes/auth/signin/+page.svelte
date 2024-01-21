<script>
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import { IconBrandGoogleFilled, IconExternalLink } from '@tabler/icons-svelte';
</script>

<svelte:head>
	<title>Sign In to pieni.link</title>
</svelte:head>

<Card.Root class="w-full max-w-sm">
	<Card.Header>
		<Card.Title class="scroll-m-20 text-4xl font-extrabold tracking-tight">Sign In</Card.Title>
		<Card.Description>You need to be signed in to shorten links.</Card.Description>
	</Card.Header>

	<Card.Content class="w-full flex-col">
		<Button href="/auth/google?type=signin" class="mt-4 w-full gap-2">
			<IconBrandGoogleFilled size={16} />
			Continue with Google
		</Button>

		<a
			href="/auth/signup"
			class="mt-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-primary hover:underline"
			on:click={async (e) => {
				e.preventDefault();
				const token = prompt('Paste your invite token here');
				if (!token) return;

				await goto(`/auth/signup?token=${token}`);
			}}
		>
			Got an invite code?
			<IconExternalLink size={12} />
		</a>
	</Card.Content>
</Card.Root>
