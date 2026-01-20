<script lang="ts">
	import { getOwnLinks } from '$lib/queries/link.remote';
	import { TextFieldOutlined } from 'm3-svelte';
</script>

<svelte:head>
	<title>Pieni - A modern, simple URL shortener</title>
	<meta name="description" content="A modern, simple URL shortener." />
	<meta name="keywords" content="URL, shortener, private, link, tiny" />
	<meta name="author" content="github.com/kumpmati" />
</svelte:head>

<h1>pieni.link</h1>

<TextFieldOutlined type="url" label="Short link" />

<ul>
	{#each await getOwnLinks() as link (link.id)}
		<li>{link.id} {link.url}</li>
	{:else}
		<li>No links</li>
	{/each}
</ul>
