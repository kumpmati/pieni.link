<script>
	import { Button } from '$lib/components/ui/button';

	import * as Card from '$lib/components/ui/card';
	import { IconBrandGoogleFilled } from '@tabler/icons-svelte';
</script>

<Card.Root class="w-full max-w-sm">
	<Card.Header>
		<Card.Title class="scroll-m-20 text-4xl font-extrabold tracking-tight">Setup</Card.Title>
		<Card.Description>Sign in to create an admin account.</Card.Description>
	</Card.Header>

	<Card.Content class="w-full flex-col">
		<Button href="/auth/google?type=signup" class="mt-4 w-full gap-2">
			<IconBrandGoogleFilled size={16} />
			Continue with Google
		</Button>
	</Card.Content>
</Card.Root>
