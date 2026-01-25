<script lang="ts">
	import LucideArrowLeft from '~icons/lucide/arrow-left';
	import LucideTrash from '~icons/lucide/trash';
	import { PUBLIC_BASEURL } from '$env/static/public';
	import { removeOwnLink, updateLinkURL } from '$lib/queries/link.remote';
	import { Button, snackbar, TextFieldOutlined } from 'm3-svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import type { PageProps } from './$types';
	import Main from '$lib/components/layout/Main.svelte';

	let { data, params }: PageProps = $props();

	// svelte-ignore state_referenced_locally
	let url = $state(data.link.url);
	let loading = $state(false);

	const handleDelete = async () => {
		if (!confirm('Are you sure?')) return;

		await removeOwnLink(params.id);
		await goto('/');
		snackbar('Link deleted', undefined, true);
	};

	const handleEdit = async (e: Event) => {
		e.preventDefault();

		try {
			loading = true;

			await updateLinkURL({ id: params.id, url });
			await invalidateAll();

			snackbar('Link updated', undefined, true);
		} finally {
			loading = false;
		}
	};
</script>

<svelte:head>
	<title>Edit link - {params.id}</title>
</svelte:head>

<Main>
	<heading>
		<Button href="/" variant="text" iconType="full">
			<LucideArrowLeft />
		</Button>
		<h1>
			<span class="subtle">{new URL(PUBLIC_BASEURL).host}/</span>{params.id}
		</h1>

		<!-- <Button variant="text" iconType="full" style="margin-left: auto;">
			<LucideEdit />
		</Button> -->
	</heading>

	<form onsubmit={handleEdit}>
		<TextFieldOutlined
			label="Redirects to"
			bind:value={url}
			type="url"
			required
			disabled={loading}
		/>
	</form>

	<Button iconType="left" style="width: fit-content;" onclick={handleDelete}>
		<LucideTrash />
		Delete link
	</Button>
</Main>

<style>
	heading {
		position: relative;
		display: flex;
		align-items: center;
		gap: 0.25rem;

		h1 {
			font-size: 1.5rem;
		}
	}

	form {
		display: contents;
	}

	.subtle {
		color: var(--m3c-on-surface-variant);
	}
</style>
