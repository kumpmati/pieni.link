<script lang="ts">
	import LucideArrowRight from '~icons/lucide/arrow-right';
	import LucideExternalLink from '~icons/lucide/external-link';
	import { getAllOwnLinks } from '$lib/queries/link.remote';
	import { Button } from 'm3-svelte';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	dayjs.extend(relativeTime);

	type Props = {
		showAll?: boolean;
	};

	let { showAll }: Props = $props();
</script>

<table>
	<thead>
		<tr>
			<td width="120">Slug</td>
			<td>URL</td>
			<td width="140" class="desktop-only">Last visit</td>
			<td width="32"></td>
		</tr>
	</thead>

	<tbody>
		<svelte:boundary>
			{#snippet pending()}
				{#each { length: 3 }}
					<tr class="row">
						<td>...</td>
						<td>...</td>
						<td class="desktop-only">...</td>
						<td>
							<div class="button-placeholder"></div>
						</td>
					</tr>
				{/each}
			{/snippet}

			{#each await getAllOwnLinks(showAll ? 1_000 : 5) as link}
				<tr class="row">
					<td>
						<a href="/l/{link.id}">{link.id}</a>
					</td>
					<td>
						<a class="external-link" href={link.url} target="_blank" rel="noopener noreferrer">
							{new URL(link.url).host}

							<span class="icon">
								<LucideExternalLink width={16} height={16} />
							</span>
						</a>
					</td>
					<td class="desktop-only">
						<p class="subtle" title={link.lastUsed?.toLocaleString() ?? '-'}>
							{link.lastUsed ? dayjs(link.lastUsed).fromNow() : '-'}
						</p>
					</td>
					<td>
						<Button variant="text" iconType="full" href="/l/{link.id}">
							<LucideArrowRight width={18} height={18} />
						</Button>
					</td>
				</tr>
			{:else}
				<tr>
					<td colspan="4">
						<span class="subtle" style="text-align:center;display:block;margin:1rem 0;"
							>No links yet.</span
						>
					</td>
				</tr>
			{/each}
		</svelte:boundary>
	</tbody>
</table>

<style>
	a,
	p {
		margin: 0;
	}

	thead {
		font-weight: 500;
		color: var(--m3c-secondary);
	}

	thead td {
		padding-bottom: 0.5rem;
	}

	table {
		border-collapse: collapse;
	}

	.row:hover {
		background-color: var(--m3c-surface-container);
	}

	.subtle {
		font-size: 14px;
		color: var(--m3c-on-surface-variant);
	}

	.button-placeholder {
		height: 40px;
	}

	.desktop-only {
		@media screen and (max-width: 600px) {
			display: none;
		}
	}

	.external-link {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		color: var(--m3c-on-surface-variant);
		font-size: 14px;

		&:hover {
			color: var(--m3c-primary);
			text-decoration: underline;

			.icon {
				display: flex;
			}
		}

		&:not(:hover) {
			.icon {
				display: none;
			}
		}
	}
</style>
