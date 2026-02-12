<script lang="ts">
	import LucideChartArea from '~icons/lucide/chart-area';
	import LucideArrowLeft from '~icons/lucide/arrow-left';
	import LucideTrash from '~icons/lucide/trash';
	import LucideDownload from '~icons/lucide/download';
	import { PUBLIC_BASEURL } from '$env/static/public';
	import { removeOwnLink, updateLinkURL } from '$lib/queries/link.remote';
	import { Button, snackbar, TextFieldOutlined } from 'm3-svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import type { PageProps } from './$types';
	import Main from '$lib/components/layout/Main.svelte';
	import AnalyticsGrid from '../../AnalyticsGrid.svelte';
	import type { Timeframes } from '$lib/constants';
	import { downloadAsFile, timeframeToDateRange } from '$lib/utils';
	import {
		getAllLinkVisits,
		getLinkMostCommonBrowsers,
		getLinkMostCommonDevices,
		getLinkUniqueReferrers,
		getLinkUniqueUsers,
		getLinkVisitsByDay
	} from '$lib/queries/analytics.remote';
	import TimeframeTags from '$lib/components/TimeframeTags.svelte';
	import { wrap } from '$lib/utils.svelte';

	let { data, params }: PageProps = $props();

	// svelte-ignore state_referenced_locally
	let url = $state(data.link.url);

	let timeframe = $state<Timeframes>('30d');
	const dateRange = $derived(timeframeToDateRange(timeframe));

	const handleDelete = async () => {
		if (!confirm('Are you sure?')) return;

		await removeOwnLink(params.id);
		await goto('/');
		snackbar('Link deleted', undefined, true);
	};

	const handleEdit = wrap(async (e: Event) => {
		e.preventDefault();

		await updateLinkURL({ id: params.id, url });
		await invalidateAll();

		snackbar('Link updated', undefined, true);
	});

	const downloadAsCSV = wrap(async () => {
		const visits = await getAllLinkVisits(params.id);

		const { stringify } = await import('csv-stringify/browser/esm/sync');
		const csv = stringify(visits, { header: true, cast: { date: (val) => val.toISOString() } });

		downloadAsFile(`${params.id}.csv`, csv);
	});
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

	<form onsubmit={handleEdit.run}>
		<TextFieldOutlined
			label="Redirects to"
			bind:value={url}
			type="url"
			required
			disabled={handleEdit.loading}
		/>
	</form>

	<div class="heading">
		<h2><LucideChartArea /> Link analytics</h2>
	</div>

	<TimeframeTags bind:value={timeframe} />

	<AnalyticsGrid
		{dateRange}
		totalVisitsQuery={getLinkVisitsByDay({ linkId: params.id, dateRange })}
		mostCommonBrowsersQuery={getLinkMostCommonBrowsers({ linkId: params.id, dateRange })}
		mostCommonDevicesQuery={getLinkMostCommonDevices({ linkId: params.id, dateRange })}
		uniqueUsersQuery={getLinkUniqueUsers({ linkId: params.id, dateRange })}
		uniqueReferrersQuery={getLinkUniqueReferrers({ linkId: params.id, dateRange })}
	/>

	<div class="row">
		<Button iconType="left" onclick={downloadAsCSV.run} disabled={downloadAsCSV.loading}>
			<LucideDownload />
			Download as CSV
		</Button>

		<Button iconType="left" style="width: fit-content;" onclick={handleDelete}>
			<LucideTrash />
			Delete link
		</Button>
	</div>
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

	.row {
		display: flex;
		gap: 1rem;
		margin-top: 1rem;
	}

	h2 {
		color: var(--m3c-primary);
		font-size: 1rem;
		font-weight: 500;
		margin: 0;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}

	.heading {
		margin-top: 1rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
</style>
