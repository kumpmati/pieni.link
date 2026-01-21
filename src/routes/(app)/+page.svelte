<script lang="ts">
	import LucideChartArea from '~icons/lucide/chart-area';
	import LucideLink from '~icons/lucide/link';
	import LucideChevronDown from '~icons/lucide/chevron-down';
	import { Button, Card } from 'm3-svelte';
	import { getCurrentUser } from '$lib/queries/user.remote';
	import AnalyticsSignInPrompt from '$lib/components/AnalyticsSignInPrompt.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import UserButton from '$lib/components/UserButton.svelte';
	import OverallAnalytics from './OverallAnalytics.svelte';
	import LinkShortenerForm from './LinkShortenerForm.svelte';
	import OwnLinksTable from './OwnLinksTable.svelte';
	import TimeframeTags from '$lib/components/TimeframeTags.svelte';
	import { timeframeToDateRange } from '$lib/utils';
	import Collapsible from '$lib/components/Collapsible.svelte';
	import Main from '$lib/components/layout/Main.svelte';
	import { TIMEFRAMES, type Timeframes } from '$lib/constants';

	const user = await getCurrentUser();

	let timeframe = $state<Timeframes>(TIMEFRAMES[1].value);
	const dateRange = $derived(timeframeToDateRange(timeframe));

	let showAnalytics = $state(true);
	let showLinks = $state(true);
	let showAllLinks = $state(false);
</script>

<svelte:head>
	<title>Pieni - A modern, simple URL shortener</title>
	<meta name="description" content="A modern, simple URL shortener." />
	<meta name="keywords" content="URL, shortener, private, link, tiny" />
	<meta name="author" content="github.com/kumpmati" />
</svelte:head>

<Main>
	<div class="heading">
		<Logo />
		<UserButton />
	</div>

	<LinkShortenerForm />

	<div>
		{#if !user}
			<AnalyticsSignInPrompt />
		{:else}
			<Collapsible bind:open={showAnalytics}>
				{#snippet title()}
					<LucideChartArea /> Overall Analytics
				{/snippet}

				<TimeframeTags bind:value={timeframe} style="margin-bottom: 1rem;" />

				<OverallAnalytics {dateRange} />
			</Collapsible>

			<Collapsible bind:open={showLinks}>
				{#snippet title()}
					<LucideLink /> My links
				{/snippet}

				<Card variant="elevated">
					<OwnLinksTable showAll={showAllLinks} />

					{#if !showAllLinks}
						<Button
							variant="outlined"
							style="width: fit-content; margin: 0 auto; margin-top: 1rem;"
							onclick={() => (showAllLinks = true)}
						>
							<LucideChevronDown />
							Show all
						</Button>
					{/if}
				</Card>
			</Collapsible>
		{/if}
	</div>
</Main>

<style>
	.heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
</style>
