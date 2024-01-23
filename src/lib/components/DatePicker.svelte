<script lang="ts">
	import * as Popover from './ui/popover';
	import Button from './ui/button/button.svelte';
	import { IconCalendar } from '@tabler/icons-svelte';
	import Calendar from './ui/calendar/calendar.svelte';
	import { getLocalTimeZone, today, fromDate } from '@internationalized/date';

	export let value: Date | null;
	export let placeholder: string | undefined = undefined;
</script>

<Popover.Root openFocus>
	<Popover.Trigger asChild let:builder>
		<Button builders={[builder]} variant="outline">
			<IconCalendar size={16} />
			{value?.toLocaleDateString() ?? placeholder ?? 'Select a date'}
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
