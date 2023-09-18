import type { RequestHandler } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET({ request, platform }) {
  if (!platform) {
		throw error(503, 'Error with platform');
	}
  const result = await platform.env.DB.prepare(
    "SELECT * FROM users LIMIT 5"
  ).run();
  return new Response(JSON.stringify(result));
}