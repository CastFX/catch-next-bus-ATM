/**
 * Welcome to Cloudflare Workers! This is your first scheduled worker.
 *
 * - Run `wrangler dev --local` in your terminal to start a development server
 * - Run `curl "http://localhost:8787/cdn-cgi/mf/scheduled"` to trigger the scheduled event
 * - Go back to the console to see what your worker has logged
 * - Update the Cron trigger in wrangler.toml (see https://developers.cloudflare.com/workers/wrangler/configuration/#triggers)
 * - Run `wrangler publish --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/runtime-apis/scheduled-event/
 */

import { updateEstimates } from "./estimates";
import updateTimetables from "./timetables";

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	atm_stops: KVNamespace;
	atm_timetables: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
}

export default {
	async scheduled(
		controller: ScheduledController,
		env: Env,
		ctx: ExecutionContext
	): Promise<void> {
		switch (controller.cron) {
			case "* * * * *":
				ctx.waitUntil(updateEstimates(env.atm_stops, env.atm_timetables));
				break;

			case "1 0 * * *":
				ctx.waitUntil(updateTimetables(env.atm_timetables));
		}
	},
};
