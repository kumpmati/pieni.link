<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	export let title: string;
	export let description: string = '';

	let className: string = '';

	export { className as class };
</script>

<header
	class={twMerge(
		'mb-4 mt-0 flex w-full flex-col items-start justify-between gap-4 md:mt-8 md:flex-row md:items-center',
		className
	)}
>
	<div class="flex flex-col gap-1">
		<h1 class="font-display text-4xl font-black">
			{title}
		</h1>

		{#if description}
			<h2 class="text-sm text-slate-500">{description}</h2>
		{/if}
	</div>

	<slot />
</header>
