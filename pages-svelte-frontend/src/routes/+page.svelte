<script lang="ts">
	import _ from 'lodash';
	import type { PageData } from './$types';
	import type { Estimate, LineStop } from '$lib/server/db/lineStops';
	import { invalidateAll } from '$app/navigation';

	export let data: PageData;

	let timeToReachOpen = false;

	const timerKey = (stop: string, lineIdx: number, estimateIdx: number) => stop + "|" + lineIdx + "|" + estimateIdx

	const leaveWhen = (estimates: Estimate[]) => _.chain(estimates)
			.filter('doable')
			.orderBy('leaveHomeInMinutes')
			.first()
			.value()


	type Timer = { minutes: number, seconds: number, pace: string }

	const initTimers = () =>
		Object.entries(data.lineStops).reduce(
		(acc, [stop, lines]) => {
			lines.forEach((line, i) => {
				line.estimates?.forEach((estimates, j) => {
					const estimate = leaveWhen(estimates);
					if (!estimate) return;
					const { leaveHomeInMinutes: minutes, type: pace } = estimate
					acc[timerKey(stop,i,j)] = {minutes, seconds: 0, pace};
				})
			});
			return acc;
		}
	,{} as { [key: string]: Timer });

	let timers: { [key: string]: Timer } = initTimers();

	setInterval(() => {
		Object.values(timers).forEach((t) => {
			t.seconds--;
			if (t.seconds < 0) {
				t.minutes--;
				if (t.minutes < 0) {
					t.minutes = 0;
					t.seconds = 0;
				}
				else {
					t.seconds = 59;
				}
			}
		})
		timers = timers;

	}, 1000)

	setInterval(() => {
		invalidateAll().then(() => timers = initTimers())
	}, 60000)

	const toTime = (date: string|Date) => {
		if (typeof date === 'string') date = date.replace("Z", "");
		const [hours, minutes] = new Date(date).toLocaleTimeString().split(":");
		return hours + ":" + minutes;
	}

	const notReachable = (estimates: Estimate[]) => _.every(estimates, ['doable', false])
</script>

<div class="flex flex-wrap flex-row justify-center space-x-2">
	{#each Object.entries(data.lineStops) as [stop, lines]}
		<div class="card card-compact	card-bordered w-80 bg-base-100 shadow-xl mb-2">
			<div class="card-body">
				<h2 class="text-base font-bold tracking-tighter card-title justify-center">
					{stop}
				</h2>
				<div class="flex flex-col justify-between h-full">
					<div class="card-actions justify-center">
						{#each lines as line, l}
						<div class="justify-center w-full">
							<h3 class="text-lg mb-2 divider">
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
												<span style="--value:{timers[timerKey(stop, l, e)]?.minutes};"/>:
												<span style="--value:{timers[timerKey(stop, l, e)]?.seconds};"/>
											</span>
										</td>
										<td>{timers[timerKey(stop, l, e)]?.pace ?? "never"}</td>
									</tr>
								{/each}
								</tbody>
							</table>

						</div>
						{/each}
					</div>
					<div class="!cursor-pointer collapse {timeToReachOpen ? 'collapse-open' : 'collapse-close'}">
						<input type="checkbox" on:change={(_) => timeToReachOpen = !timeToReachOpen}/>
						<div class="divider collapse-title my-0 py-0 px-0 text-lg justify-center">Time to reach</div>
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
