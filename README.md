# Catch Next Bus ATM

## What it does?
Retrieves real-time bus schedules to determine the optimal departure time from your home and how fast should you run to catch the next bus.

## Deployment
A Cloudflare Worker with a cronjob that fetches periodically timetables and live data from ATM (Milan Public Transports) API, which are then manipulated and stored on Cloudflare D1.

## Future
A frontend application will be needed to fetch the estimates from Cloudflare D1 and render them in a nicer way
Currently, all relevant bus stops and walking/running estimates are hardcoded, maybe in the future they could be customized.
