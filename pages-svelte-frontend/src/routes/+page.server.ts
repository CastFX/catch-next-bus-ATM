import { error } from '@sveltejs/kit';
import { getDB } from '../lib/server/db';
import { listActive } from '../lib/server/db/lineStops';
import type { RequestHandler } from '@sveltejs/kit';
import _ from 'lodash';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function load({ platform }) {
	if (!platform) {
		throw error(503, 'Error with platform');
	}

	const db = await getDB(platform);
	const lineStops = await listActive(db);
	return { lineStops: _.groupBy(lineStops, 'lineDescription') };
}
