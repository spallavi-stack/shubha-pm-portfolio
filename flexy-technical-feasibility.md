# Flexy — Technical Feasibility & Architecture

What each core feature actually needs to be built for real, which real APIs and data sources exist to support it, and where the genuine feasibility risk sits.

## Price & Cost view

**Data source:** ComEd's Hourly Pricing program publishes a real, public API. Two endpoints matter for this feature: `type=5minutefeed` (documented, supports custom date ranges via `datestart`/`dateend`) for granular pricing, and `type=day&date=YYYYMMDD` (functional but undocumented) for a full day's prices in one call. Both are free and require no API key.

**Feasibility:** High. This is the one piece of Flexy's data stack that's genuinely a solved problem today, ComEd already publishes exactly the data this feature needs, at no cost, with no partnership required.

**Real constraint worth naming:** the price feed is one shared series for the entire ComEd territory rather than a per-customer feed. That's actually a scaling advantage (fetch once, serve to every user) but it also means the "See this on Time-of-Use" toggle can't show a household's real TOU bill, since ComEd's TOU rate isn't live yet; it can only replay the household's real historical usage against ComEd's proposed TOU rate structure from the 2026 filing.

## Real-time consumption view

**Data source:** this is genuinely harder. ComEd customers can access their own interval usage data two ways: Green Button "Download My Data," a self-service manual export (CSV/XML, ESPI/Atom format) available directly on ComEd's own site with no partnership required, or Green Button Connect, a formal OAuth-based data-sharing mechanism that requires a partnership agreement with the utility.

**Feasibility:** Medium. Download My Data proves the data exists and is real, but it's a manual export that requires a customer to re-download a file rather than something Flexy can pull live. Green Button Connect is the real path to a live feed, but it requires a business relationship with ComEd beyond a simple API key. This is the reason Flexy's positioning leads with the utility-partnership (B2B2C) model rather than assuming direct API access on day one.

## Smart EV charging

**Data source:** Smartcar, a real third-party API that exposes battery state of charge, charging status, and remote start/stop across many EV brands (GM, Ford, Tesla, Hyundai/Kia, and others) through one integration, rather than building a separate integration per automaker.

**Feasibility:** Medium-high. Smartcar is a real, commercially available product other companies (including Optiwatt, per its own public integration docs) already build on. The genuine constraint: Smartcar's remote charging control depends on what each automaker's own API exposes, and coverage and reliability vary by brand. A cross-brand promise is realistic; a promise that works identically across every brand is not.

**Real constraint worth naming:** the achievable-at-setup check (does the target charge level fit in the time available) is pure math once state of charge and charging speed are known, genuinely low technical risk. The harder problem is state of charge reliability itself: some vehicles report it with a delay, or don't report it at all while off and unplugged from a network connection.

## Solar / heat pump savings calculator (roadmap: Next)

**Data source:** Illinois Shines / Adjustable Block Program publishes SREC pricing; Illinois EPA publishes HEAR rebate rollout status by county. Neither is a live API in the way ComEd's pricing feed is; both are published program data that changes periodically and would need to be tracked and updated rather than fetched fresh per request.

**Feasibility:** Medium. The math (payback period, annual savings) is straightforward once inputs are current. The real ongoing cost is upkeep, someone has to keep SREC pricing and HEAR county rollout status current, since both are exactly the kind of number that goes stale silently if untracked.

## Cross-cutting risk: staleness and failure handling

Every external data source above can fail or go stale in a way that's invisible unless it's designed for explicitly: ComEd's feed can have an outage, Smartcar's state-of-charge report can lag, program data (SREC, HEAR) can be out of date. Flexy's UI needs to distinguish live data from fallback data visibly across all three cases; the price feed is currently the only one with that pattern built into the prototype. See the Real Data Integration Guide for how that's implemented for pricing specifically.

## What's proven versus assumed, honestly

| Claim | Status |
|---|---|
| ComEd's price data is real and fetchable without a partnership | Proven — fetched directly against the live API during prototype build |
| Smartcar can expose state of charge across multiple EV brands | Proven — Smartcar is a real, public product; not yet tested against a live Flexy integration |
| Flexy can receive and parse real smart meter (interval usage) data | Not yet proven — Green Button "Download My Data" is a real, real self-service export, but no parser or ingestion path has been built and tested against it yet |
| Flexy is hardware-agnostic for EV charging | Partially proven — true in the sense that Smartcar itself is multi-brand; not yet tested against more than one real brand's account |

## Status

Drafted to give an honest, source-backed feasibility read on each MVP feature, distinguishing what's a solved problem (ComEd pricing) from what's a real but partnership-gated path (usage data) from what's genuinely untested (multi-brand EV coverage, smart meter parsing).
