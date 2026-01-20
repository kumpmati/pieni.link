<script>
	import { goto } from '$app/navigation';
	import IconBrandGoogleFilled from '~icons/tabler/brand-google-filled';
	import IconExternalLink from '~icons/tabler/external-link';
</script>

<svelte:head>
	<title>Sign In to pieni.link</title>
</svelte:head>

<a href="/auth/google?type=signin" class="mt-4 w-full gap-2">
	<IconBrandGoogleFilled width={16} height={16} />
	Continue with Google
</a>

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
	<IconExternalLink width={12} height={12} />
</a>
