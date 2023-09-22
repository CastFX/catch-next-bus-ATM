<script lang="ts">
	import _ from 'lodash';
	import type { PageData } from './$types';
	import type { Estimate, LineStop } from '$lib/server/db/lineStops';
	import { getDayType, initTimers, startTimers, timerKey, type Timers } from '$lib/timers';
	import type { TimetableData, TimetableDay } from './+page.server';

	export let data: PageData;

	let timeToReachOpen = false;
	let timetable: TimetableData | undefined;
	const timetableTabs: TimetableDay[] = ['weekday', 'saturday', 'sunday'];
	let activeTimetableTab: TimetableDay = getDayType();
	let timers: Timers = initTimers(data.lineStops);
	startTimers(timers);

	const toTime = (date: string | Date) => {
		if (typeof date === 'string') date = date.replace('Z', '');
		const [hours, minutes] = new Date(date).toLocaleTimeString().split(':');
		return hours + ':' + minutes;
	};

	const notReachable = (estimates: Estimate[]) => _.every(estimates, ['doable', false]);

	const prepareTimetable = (lineStop: LineStop) => {
		timetable = data.timetables[lineStop.id];
	};

	$: sortTimetableTimes = (tab: TimetableDay) => {
		const timetableTimes = _.orderBy(
			Object.entries(timetable?.[tab] ?? {}),
			([hour]) => parseInt(hour) || Infinity
		);
		const half = Math.floor(timetableTimes.length / 2);
		return [timetableTimes.slice(0, half), timetableTimes.slice(half)];
	};
</script>

<div class="flex flex-wrap flex-row justify-center space-x-2">
	{#each Object.entries(data.lineStops) as [stop, lines]}
		<div class="card card-compact card-bordered w-80 bg-base-100 shadow-xl mb-2">
			<div class="card-body">
				<h2 class="text-base font-bold tracking-tighter card-title justify-center">
					{stop}
				</h2>
				<div class="flex flex-col justify-between h-full">
					<div class="card-actions justify-center">
						{#each lines as line, l}
							<div class="justify-center w-full">
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<h3 class="text-lg mb-2 divider" on:click={() => prepareTimetable(line)}>
									{line.direction ? '↑' : '↓'}{line.lineId}: <b>{line.waitMessage ?? '---'}</b>
								</h3>
								<table class="table table-sm w-full">
									<tbody>
										{#each line.estimates ?? [] as estimates, e}
											<tr class="!leading-3" class:opacity-20={notReachable(estimates)}>
												<th>{toTime(estimates[0].arrivesAt)}</th>
												<td>Leave in</td>
												<td>
													<span class="countdown">
														<span style="--value:{timers[timerKey(stop, l, e)]?.minutes};" />:
														<span style="--value:{timers[timerKey(stop, l, e)]?.seconds};" />
													</span>
												</td>
												<td>{timers[timerKey(stop, l, e)]?.pace ?? 'never'}</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						{/each}
					</div>
					<div
						class="!cursor-pointer collapse {timeToReachOpen ? 'collapse-open' : 'collapse-close'}"
					>
						<input type="checkbox" on:change={(_) => (timeToReachOpen = !timeToReachOpen)} />
						<div class="divider collapse-title my-0 py-0 px-0 text-lg justify-center">
							Time to reach
						</div>
						<div class="card-actions justify-between collapse-content">
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

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
	id="timetable_modal"
	class="modal modal-bottom sm:modal-middle"
	class:modal-open={timetable}
	on:click|self={() => (timetable = undefined)}
>
	<div class="modal-box px-1">
		<div class="tabs justify-center mb-2">
			{#each timetableTabs as tab}
				<button
					on:click={() => (activeTimetableTab = tab)}
					class="tab tab-bordered uppercase"
					class:tab-active={activeTimetableTab === tab}
				>
					{tab}
				</button>
			{/each}
		</div>
		<div class="justify-center">
			{#each timetableTabs as tab}
				<div
					class="!flex-row card justify-center sm:px-12"
					class:hidden={activeTimetableTab !== tab}
				>
					{#each sortTimetableTimes(tab) as chunk}
						<table class="table table-auto table-xs justify-center">
							<thead>
								<tr>
									<th class="text-center">Hour</th>
									<td class="text-right">Minutes</td>
								</tr>
							</thead>
							<tbody>
								{#each chunk as [hour, timetableTimes]}
									<tr class="!leading-3">
										<th class="text-center">{hour}</th>
										<td class="text-right">{timetableTimes.map((t) => t.minute).join(', ')}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</dialog>
