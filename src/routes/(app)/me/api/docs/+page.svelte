<script lang="ts">
	import Header from '$lib/components/Header.svelte';

	const getLinksResponse = [
		{
			id: 'abcdef',
			url: 'https://example.com',
			createdAt: '2024-04-17T10:48:50.416Z',
			lastUsed: '2024-04-17T20:36:34.581Z',
			validUntil: null,
			userId: 'abcdefghijklmno'
		},
		{
			id: '123456',
			url: 'https://github.com/kumpmati/pieni.link',
			createdAt: '2024-04-17T10:47:22.727Z',
			lastUsed: '2024-04-17T10:48:18.302Z',
			validUntil: null,
			userId: 'abcdefghijklmno'
		}
	];

	const getLinkByIdResponse = {
		id: 'abcdef',
		url: 'https://example.com',
		createdAt: '2024-04-17T10:48:50.416Z',
		lastUsed: '2024-04-17T20:36:34.581Z',
		validUntil: null,
		userId: 'abcdefghijklmno'
	};

	const updateLinkBody = {
		url: 'https://google.com'
	};
</script>

<svelte:head>
	<title>API Docs</title>
</svelte:head>

<Header title="API Documentation" description="A guide to using the API in your own applications" />

<article class="flex max-w-3xl flex-col gap-4">
	<h2 class="font-display text-2xl font-black">Authentication</h2>
	<p class="text-slate-400">
		All calls to the API must include an API key in the request's <code>Authorization</code> header.
		<br />
		API Keys are scoped to the user that created them, and so currently cannot access data from other
		users.
	</p>

	<h2 class="font-display text-2xl font-black">Links</h2>
	<p class="text-slate-400">All endpoints that can be used to manage links</p>

	<h3 class="font-display text-xl font-black">GET /api/links</h3>
	<p class="text-slate-400">Returns all the links that the user has in an array</p>

	<p>Response body</p>
	<code class="text-sm">
		<pre>{JSON.stringify(getLinksResponse, null, 2)}</pre>
	</code>

	<h3 class="font-display text-xl font-black">GET /api/links/:linkId</h3>
	<p class="text-slate-400">Returns the data for a single link.</p>

	<p>Response body</p>
	<code class="text-sm">
		<pre>{JSON.stringify(getLinkByIdResponse, null, 2)}</pre>
	</code>

	<h3 class="font-display text-xl font-black">PATCH /api/links/:linkId</h3>
	<p class="text-slate-400">
		Updates a single link's info. Only updates the fields that you send, others are left untouched.
		The ID can also be modified, but note that any requests after the update must use the updated ID
		in the URL.
	</p>

	<p>Request body</p>
	<code class="text-sm">
		<pre>{JSON.stringify(updateLinkBody, null, 2)}</pre>
	</code>

	<h3 class="font-display text-xl font-black">DELETE /api/links/:linkId</h3>
	<p class="text-slate-400">Deletes a single link and all analytics related to that link.</p>
</article>
