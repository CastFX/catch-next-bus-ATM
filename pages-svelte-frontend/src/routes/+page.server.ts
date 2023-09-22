import { error } from '@sveltejs/kit';
import { getDB } from '../lib/server/db';
import { listActive, type LineStop } from '../lib/server/db/lineStops';
import _ from 'lodash';

export async function load({ platform }) {
	if (!platform) {
		throw error(503, 'Error with platform');
	}

	const db = getDB(platform);
	const lineStops = await listActive(db);

	return {
		lineStops: _.groupBy(sortLines(lineStops), 'lineDescription')
	};
}


const sortLines = (lines: LineStop[]) => _.orderBy(
	lines,
	line => line.waitMessage === null
		? Infinity
		: line.lineDescription + line.journeyPattern
	)
