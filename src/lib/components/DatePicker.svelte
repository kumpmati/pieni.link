<script lang="ts">
	import dayjs, { type UnitTypeShort } from 'dayjs';
	import Input from './ui/input/input.svelte';
	import * as Select from './ui/select';
	import type { Selected } from 'bits-ui';
	import { createEventDispatcher } from 'svelte';

	export let value: Date | null;
	export let disabled: boolean = false;

	let mode: Selected<string> | undefined = { value: '', label: "Don't expire" };
	let resolution: Selected<UnitTypeShort> | undefined = { value: 'm', label: 'Minutes' };
	let relativeTime: string = '30';
	let absoluteTime: string = new Date().toLocaleString();

	const dispatch = createEventDispatcher();

	const calculateTime = (
		mode: Selected<string> | undefined,
		resolution: Selected<UnitTypeShort> | undefined,
		relative: string,
		absolute: string
	): Date | null => {
		switch (mode?.value) {
			default: {
				return null;
			}

			case 'relative': {
				if (!resolution?.value) {
					return null;
				}

				return dayjs().add(parseFloat(relative), resolution.value).toDate();
			}

			case 'absolute': {
				return new Date(absolute);
			}
		}
	};

	$: dispatch('change', calculateTime(mode, resolution, relativeTime, absoluteTime));
</script>

<div class="flex gap-2">
	<Select.Root bind:selected={mode} {disabled}>
		<Select.Trigger class="w-32">
			<Select.Value placeholder="" />
		</Select.Trigger>
		<Select.Content>
			<Select.Item value="">Don't expire</Select.Item>
			<Select.Item value="relative">Expire in</Select.Item>
			<Select.Item value="absolute">Expire on</Select.Item>
		</Select.Content>
	</Select.Root>

	{#if mode?.value === 'absolute'}
		<Input
			type="datetime-local"
			{value}
			on:change={(e) => (absoluteTime = e.currentTarget.value)}
		/>
	{:else if mode?.value === 'relative'}
		<Input {disabled} type="number" bind:value={relativeTime} min={1} step={1} class="max-w-28" />

		<Select.Root bind:selected={resolution} {disabled}>
			<Select.Trigger class="w-32">
				<Select.Value />
			</Select.Trigger>

			<Select.Content>
				<Select.Item value="m">Minutes</Select.Item>
				<Select.Item value="h">Hours</Select.Item>
				<Select.Item value="d">Days</Select.Item>
			</Select.Content>
		</Select.Root>
	{/if}
</div>
