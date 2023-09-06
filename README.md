# atm-stops-calculator-api

A Cloudflare Worker that runs periodically and fetches timetables and live data from Milan Public Transports API.
It uses the live estimates for bus to estimate the best time to leave the house, and how fast should you run (or cycle) to catch the next bus.

Currently, all relevant bus stops and walking/running estimates are hardcoded, maybe in the future they could be customized.

All the timetables and computed estimates are stored on Cloudflare KV.

A frontend application will be needed to fetch the estimates from this API and render them in a nicer way
