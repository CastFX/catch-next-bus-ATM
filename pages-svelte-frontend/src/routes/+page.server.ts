import { error } from '@sveltejs/kit';
import { getDB } from '../lib/server/db';
import { listActive, type LineStop } from '../lib/server/db/lineStops';
import _ from 'lodash';
import { listTimetables, type Time, type Timetable } from '$lib/server/db/timetables';

export type TimetableDay = 'weekday' | 'saturday' | 'sunday';
export type TimetableData = { [key in TimetableDay]: _.Dictionary<Time[]> };

export async function load({ platform }) {
	if (!platform) {
		throw error(503, 'Error with platform');
	}

	const db = getDB(platform);
	const activeLineStops = await listActive(db);
	const lineStops = _.groupBy(sortLines(activeLineStops), 'lineDescription');
	const activeTimetables = await listTimetables(db);
	const timetables = timetablesByLineStopId(activeTimetables);

	return { lineStops, timetables };
}

const sortLines = (lines: LineStop[]) =>
	_.orderBy(lines, (line) =>
		line.waitMessage === null ? Infinity : line.lineDescription + line.journeyPattern
	);

const timetablesByLineStopId = (timetables: Timetable[]) =>
	timetables.reduce((acc, timetable) => {
		acc[timetable.lineStopId] = formatTimetable(timetable);
		return acc;
	}, {} as { [key: number]: TimetableData });

const formatTimetable = (timetable: Timetable) => {
	const { mondaySchedule, saturdaySchedule, sundaySchedule } = timetable;
	const weekday = _.groupBy(mondaySchedule ?? [], 'hour');
	const saturday = _.groupBy(saturdaySchedule ?? [], 'hour');
	const sunday = _.groupBy(sundaySchedule ?? [], 'hour');

	return { weekday, saturday, sunday };
};
