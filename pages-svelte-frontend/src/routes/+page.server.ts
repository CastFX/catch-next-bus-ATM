import { error } from '@sveltejs/kit';
import { getDB } from '../lib/server/db';
import { listActive } from '../lib/server/db/lineStops';
import type { RequestHandler } from "@sveltejs/kit";

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function load(r) {
	const {platform} = r;
	console.log(JSON.stringify(r));
	if (!platform) {
		throw error(503, 'Error with platform');
	}

  const db = await getDB(platform);
	const lineStops = await listActive(db);

	return {lineStops};
}