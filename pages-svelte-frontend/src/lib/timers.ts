import _ from 'lodash';
import type { Estimate, LineStop } from './server/db/lineStops';

type Timer = { minutes: number; seconds: number; pace: string };
export type Timers = { [key: string]: Timer };

export const timerKey = (stop: string, lineIdx: number, estimateIdx: number) =>
	stop + '|' + lineIdx + '|' + estimateIdx;

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

export const decreaseTimers = (timers: Timers) => {
	Object.values(timers).forEach((t) => {
		t.seconds--;
		if (t.seconds < 0) {
			t.minutes--;
			if (t.minutes < 0) {
				t.minutes = 0;
				t.seconds = 0;
			} else {
				t.seconds = 59;
			}
		}
	});

	return timers;
};

export const getDayType = () => {
	const dayOfWeek = new Date().getDay();
	if (dayOfWeek === 0) return 'sunday';
	if (dayOfWeek === 6) return 'saturday';
	return 'weekday';
};
