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

import { updateStopCodes } from "./config/stops";
import { listActive } from "./db/lineStops";
import { listTimetables } from "./db/timetables";
import { updateEstimates } from "./estimates";
import updateTimetables from "./timetables";
import { drizzle } from 'drizzle-orm/d1';


type Env = {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // atm_stops: KVNamespace; //rate-limited in free tier
  // atm_timetables: KVNamespace;
  DB: D1Database;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
}

const handler: ExportedHandler<Env, unknown, unknown> = {
  async scheduled(
    event: ScheduledController,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<void> {
    const db = drizzle(env.DB);
    switch (event.cron) {
      case "* 6-23 * * *":
        ctx.waitUntil(updateEstimates(db));
        break;

      case "1 0 * * *":
        ctx.waitUntil(updateStopCodes(db));
        ctx.waitUntil(updateTimetables(db));
    }
  },

  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const db = drizzle(env.DB);

    const url = new URL(request.url);
    let json = "";
    switch (url.pathname) {
      case "/":
      case "/estimates":
        const lineStops = await listActive(db)
        json = JSON.stringify(lineStops, null, 2);
        break;
      case "/estimates/fetch":
        ctx.waitUntil(updateEstimates(db));
        json = JSON.stringify({success: true});
        break;
      case "/timetables":
        const timetables = await listTimetables(db);
        json = JSON.stringify(timetables, null, 2);
        break;
      case "/timetables/fetch":
        ctx.waitUntil(updateTimetables(db));
        json = JSON.stringify({success: true});
        break;
      case "/stopCodes/fetch":
        ctx.waitUntil(updateStopCodes(db));
        const lines = await listActive(db)
        json = JSON.stringify(lines, null, 2);
        break;
    }

    return new Response(json, {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    });
  },
};

export default handler;
