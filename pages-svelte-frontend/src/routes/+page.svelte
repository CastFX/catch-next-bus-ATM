<script lang="ts">
	import _ from 'lodash';
	import type { PageData } from './$types';
	import type { Estimate, LineStop } from '$lib/server/db/lineStops';

	export let data: PageData;

	export const sortLines = (lines: LineStop[]) => _.orderBy(
		lines,
		line => line.waitMessage?.includes("arrivo")
			? 0
			: line.waitMessage?.includes("min")
				? parseInt(line.waitMessage)
				: Infinity
		)

	export const toTime = (date: string|Date) => {
		const [hours, minutes] = new Date(date).toLocaleTimeString().split(":");
		return hours + ":" + minutes;
	}

	export const reachable = (estimates: Estimate[]) => _.some(estimates, 'doable')
	export const leaveWhen = (estimates: Estimate[]) => {
		const estimate = _.chain(estimates)
			.filter('doable')
			.orderBy('leaveHomeInMinutes', 'desc')
			.first()
			.value()

		if (!estimate) return "---";

		const {leaveHomeInMinutes, type} = estimate;

		return `Leave in ${leaveHomeInMinutes} min (${type})`
	}
</script>

<div class="flex flex-wrap flex-row justify-center">
	{#each Object.entries(data.lineStops) as [stop, lines]}
		<div class="card w-96 bg-base-100 shadow-xl ml-2 mb-2">
			<div class="card-body">
				<h2 class="text-lg card-title justify-center">
					{stop}
				</h2>
				<div class="flex flex-col justify-between h-full">
					<div class="card-actions justify-center">
						{#each sortLines(lines) as line}
						<div class="justify-center w-full">
							<h3 class="text-lg mb-2 divider">
								{line.direction ? '↑' : '↓'}{line.lineId}: <b>{line.waitMessage ?? '---'}</b>
							</h3>
							{#each line.estimates ?? [] as estimates}
								<div class="flex justify-end w-full">
									<p class="flex ml-8" class:line-through={!reachable(estimates) && 'line-through'}>
										{toTime(estimates[0].arrivesAt)}</p>
									<p class="flex justify-end mr-8">{leaveWhen(estimates)}</p>
								</div>
							{/each}
						</div>
						{/each}
					</div>
					<div>
						<p class="divider mb-2 mt-6">Time to reach</p>
						<div class="card-actions justify-center">
							{#each lines[0].minutesFromHome as velocity}
								<p>{velocity.type}: {velocity.minutes} minutes</p>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
	{/each}
</div>
