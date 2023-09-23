import _ from 'lodash';
import type { Estimate, LineStop } from './server/db/lineStops';

type Timer = { minutes: number; seconds: number; pace: string };
export type Timers = { [key: string]: Timer };

export const timerKey = (stop: string, lineIdx: number, estimateIdx: number) =>
	stop + ';' + lineIdx + ';' + estimateIdx;

export const leaveWhen = (estimates: Estimate[]) =>
	_.chain(estimates).filter('doable').orderBy('leaveHomeInMinutes').first().value();

export const initTimers = (lineStops: _.Dictionary<LineStop[]>) =>
	Object.entries(lineStops).reduce((acc, [stop, lines]) => {
		lines.forEach((line, i) => {
			line.estimates?.forEach((estimates, j) => {
				const estimate = leaveWhen(estimates);
				if (!estimate) return;
				const { leaveHomeInMinutes: minutes, type: pace } = estimate;
				acc[timerKey(stop, i, j)] = { minutes, seconds: 0, pace };
			});
		});
		return acc;
	}, {} as { [key: string]: Timer });

export const decreaseTimers = (timers: Timers, lineStops: _.Dictionary<LineStop[]>) => {
	Object.entries(timers).forEach(([key, t]) => {
		t.seconds--;
		if (t.seconds < 0) {
			t.minutes--;
			if (t.minutes < 0) {
				const {pace, minutes, seconds} = speedUpPace(t, key, lineStops);
				t.minutes = minutes;
				t.seconds = seconds;
				t.pace = pace;
			} else {
				t.seconds = 59;
			}
		}
	});

	return timers;
};

const speedUpPace = (timer: Timer, key: string, lineStops: _.Dictionary<LineStop[]>): Timer => {
	const paces = ["slow", "walk", "fast", "bike"];
	const nextPace = paces[paces.indexOf(timer.pace) + 1];
	if (!nextPace) return {...timer, minutes: 0, seconds: 0};

	//find previous timer for current pace and next pace
	const [stop, lineIdx, estimateIdx] = key.split(";");
	const estimates = lineStops[stop]?.[parseInt(lineIdx)]?.estimates?.[parseInt(estimateIdx)];

	const currentEstimate = _.find(estimates ?? [], ['type', timer.pace]);
	const nextEstimate = _.find(estimates ?? [], ['type', nextPace]);
	if (!currentEstimate || !nextEstimate) return {...timer, minutes: 0, seconds: 0};

	const minutes = nextEstimate.leaveHomeInMinutes - currentEstimate.leaveHomeInMinutes;

	return {pace: nextPace, minutes, seconds: 0}
}

export const getDayType = () => {
	const dayOfWeek = new Date().getDay();
	if (dayOfWeek === 0) return 'sunday';
	if (dayOfWeek === 6) return 'saturday';
	return 'weekday';
};
