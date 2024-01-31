<script lang="ts">
	import * as Popover from './ui/popover';
	import Button from './ui/button/button.svelte';
	import { IconCalendar } from '@tabler/icons-svelte';
	import Calendar from './ui/calendar/calendar.svelte';
	import { getLocalTimeZone, today, fromDate } from '@internationalized/date';
	import Input from './ui/input/input.svelte';
	import * as Select from './ui/select';
	import type { Selected } from 'bits-ui';

	export let value: Date | null;
	export let placeholder: string | undefined = undefined;

	let mode: Selected<string> | undefined = { value: 'relative', label: 'In' };
	let resolution: Selected<string> | undefined = { value: 'min', label: 'Minutes' };
	let relativeTime: string = '30';
</script>

<Select.Root bind:selected={mode}>
	<Select.Trigger class="w-20">
		<Select.Value placeholder="" />
	</Select.Trigger>
	<Select.Content>
		<Select.Item value="relative">In</Select.Item>
		<Select.Item value="absolute">On</Select.Item>
	</Select.Content>
</Select.Root>

{#if mode?.value === 'absolute'}
	<Popover.Root openFocus>
		<Popover.Trigger asChild let:builder>
			<Button builders={[builder]} variant="outline" class="gap-2">
				<IconCalendar size={16} />
				{value?.toLocaleDateString() ?? placeholder ?? 'Pick a date'}
			</Button>
		</Popover.Trigger>

		<Popover.Content>
			<Calendar
				minValue={today(getLocalTimeZone())}
				value={value ? fromDate(value, getLocalTimeZone()) : undefined}
				onValueChange={(val) => (value = val?.toDate(getLocalTimeZone()) ?? null)}
				initialFocus
			/>
		</Popover.Content>
	</Popover.Root>
{:else if mode?.value === 'relative'}
	<Input type="number" bind:value={relativeTime} min={1} step={1} class="max-w-28" />

	<Select.Root bind:selected={resolution}>
		<Select.Trigger class="w-fit">
			<Select.Value />
		</Select.Trigger>

		<Select.Content>
			<Select.Item value="min">Minutes</Select.Item>
			<Select.Item value="hour">Hours</Select.Item>
			<Select.Item value="day">Days</Select.Item>
		</Select.Content>
	</Select.Root>
{/if}
