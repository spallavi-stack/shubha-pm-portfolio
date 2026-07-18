# Flexy — Real Data Integration Guide

Written for a future engineering team: how the prototype's ComEd price data works today, why it works, and what changes to serve real customers at scale.

## Why the prototype can fetch real prices at all

The prototype's Price & Cost screen calls ComEd's actual public Hourly Pricing API and displays the actual returned prices. This works because of a distinction worth stating plainly: CORS (Cross-Origin Resource Sharing) is a restriction browsers enforce on requests made from a web page's own JavaScript. It has no effect on a server calling an API directly, or on the fetch used to build this documentation. A production backend calling ComEd's API is never subject to it.

The prototype itself runs client-side in a browser preview, which is exactly the situation CORS restricts. To make the live fetch work anyway in this preview context, it routes through a public CORS proxy (`api.allorigins.win`). That proxy is real but not reliable, it returned empty responses during testing more than once, which is why the prototype always falls back to a captured real snapshot (ComEd data from July 16, 2026) rather than showing an error or a blank chart. A real backend removes the need for a proxy entirely.

## The endpoints actually used

ComEd's Hourly Pricing program (hourlypricing.comed.com) publishes a free, public API with no key required:

- `type=day&date=YYYYMMDD` — full day of hourly prices for one date. Functional but undocumented. Returns a JavaScript array-literal format (`[Date.UTC(year,month,day,hour,0,0), price]`), which the prototype parses with a regex rather than `eval()`, since evaluating a remote response as code is a real security risk regardless of how trusted the source seems.
- `type=5minutefeed&datestart=...&dateend=...` — documented, supports custom date ranges, used to build the Week/Month/Year averages baked into the prototype.
- `type=currenthouraverage` — the single current hour's average price.

One real gotcha worth flagging: `Date.UTC()` uses zero-indexed months (0 = January), so a response date-stamped month `6` is actually July. The parser only ever extracts the hour field, so this ambiguity doesn't actually affect what the prototype displays, but it's worth knowing if someone builds a date-display feature off this data later.

## The scaling insight: fetch once, serve everyone

ComEd's Real-Time Pricing feed is one shared, system-wide price series rather than a per-customer feed. Every ComEd residential customer on the real-time rate sees the same hourly price. That means a production backend needs to poll ComEd's API once (on a schedule, e.g. hourly) and serve that same cached data to every Flexy user, rather than each user's app hitting ComEd's API independently. This is different from usage data (Green Button, per-customer) and vehicle telemetry (Smartcar, per-customer, OAuth-based), both of which genuinely need a per-user data path.

## A production architecture sketch

```
ComEd Hourly Pricing API
        │  (polled hourly, server-side, no CORS concern)
        ▼
  Ingestion job  ──▶  comed_price_ticks (raw, append-only)
        │
        ▼
  Aggregation job ──▶ comed_hourly_avg (one row per hour, per day)
        │
        ▼
   API layer  ──▶  served to every Flexy client from cache
```

Suggested schema sketch:

```
comed_price_ticks
  id, captured_at, price_cents_kwh, source_url

comed_hourly_avg
  date, hour, price_cents_kwh, is_estimated (true if backfilled from a gap)
```

## Reliability handling

ComEd's feed itself can go down, and the broader PJM wholesale feed it tracks has had real, publicly visible outage banners during this project's research. A production ingestion job needs to: retry with backoff, alert if no successful fetch has landed in over an hour, and serve the most recent successfully cached data with a visible "not current" indicator rather than presenting stale data as live, the same pattern the prototype already uses for its badge/fallback logic, just moved server-side.

## Migration checklist, prototype to production

1. Stand up a scheduled ingestion job hitting ComEd's API directly (no proxy needed server-side).
2. Store raw ticks and an hourly aggregate table.
3. Build a thin API layer serving cached data to clients, replacing the prototype's direct-to-ComEd browser fetch.
4. Add alerting for ingestion gaps.
5. Replace the prototype's single captured fallback snapshot with "most recent successfully cached hour" as the fallback.
6. For usage data (the real-time consumption view) and vehicle data (smart EV charging), build genuinely per-customer OAuth flows, Green Button Connect and Smartcar respectively, since those aren't shared feeds and can't use this same fetch-once pattern.

## Status

Reflects how the prototype's Price & Cost screen is actually wired today: live fetch attempted first, real captured ComEd data (Jul 16, 2026) as fallback, with a visible badge distinguishing the two, and real (not smoothed) multi-day ComEd averages behind the Week/Month/Year tabs.
