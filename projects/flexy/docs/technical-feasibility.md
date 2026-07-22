# Flexy - Technical Feasibility & Architecture

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

**Tested:** registered a real Smartcar application, connected a simulated Tesla through the actual Connect consent flow, and pulled real API responses (application access token, connection list, vehicle detail) back from Smartcar's live v3 API Authentication endpoints. One real implementation detail worth flagging for a future team: this app is provisioned on Smartcar's newer v3 model, application-level access token via OAuth2 Client Credentials, plus a per-user `sc-user-id` header, not the older per-vehicle authorization-code exchange most third-party guides (including Optiwatt's) still document. The two aren't interchangeable; picking the wrong one costs real debugging time, as it did here.

**Sequence, high level:**

```
Register app on Smartcar  ->  User completes Connect consent  ->  App requests
     dashboard, get                  (simulated Tesla,               access token
     client ID/secret                grants charge permissions)      (client credentials)
                                                                            |
                                                                            v
                                              Real battery + charge data  <-  App calls
                                              returned                        Connections/Vehicle
                                                                               API with token +
                                                                               user ID
```

**"Hardware-agnostic" is two claims:**
- **EV-brand agnostic:** one Smartcar integration, works across every brand it supports. In the US alone, Smartcar's live compatibility data (pulled directly from its public API) currently lists 34 confirmed makes: Acura, Alfa Romeo, Audi, BMW, Buick, Cadillac, Chevrolet, Chrysler, Dodge, Fiat, Ford, GMC, Honda, Hyundai, Infiniti, Jaguar, Jeep, Kia, Land Rover, Lexus, Lincoln, MINI, Mazda, Mercedes-Benz, Nissan, Polestar, Porsche, RAM, Rivian, Subaru, Tesla, Toyota, Volkswagen, and Volvo.
- **Charging-equipment agnostic:** works on any charger, dumb or smart, because the SAE J1772/CCS standard puts the start/stop decision inside the vehicle's own battery management system, not the charger. The charger just offers power within a rated limit.

**Boundary:** covers start/stop and target-charge-level control only. Circuit-level load balancing and charger-side demand-response (e.g. OpenADR) need charger-level integration Flexy doesn't have.

**Real constraint worth naming:** the achievable-at-setup check (does the target charge level fit in the time available) is pure math once state of charge and charging speed are known, genuinely low technical risk. The harder problem is state of charge reliability itself: some vehicles report it with a delay, or don't report it at all while off and unplugged from a network connection.

## Cross-cutting risk: staleness and failure handling

Every external data source above can fail or go stale in a way that's invisible unless it's designed for explicitly: ComEd's feed can have an outage, Smartcar's state-of-charge report can lag. Flexy's UI needs to distinguish live data from fallback data visibly across both cases; the price feed is currently the only one with that pattern built into the prototype. See the Price Integration Guide for how that's implemented for pricing specifically.

## What's proven versus assumed, honestly

| Claim | Status |
|---|---|
| ComEd's price data is real and fetchable without a partnership | Proven - fetched directly against the live API during prototype build |
| Flexy can receive and parse real smart meter (interval usage) data | Not yet proven - Green Button "Download My Data" is a real, real self-service export, but no parser or ingestion path has been built and tested against it yet |
| Flexy is EV-brand agnostic | Proven - real Smartcar app, real Connect flow, real access token and vehicle data pulled from Smartcar's live API (Tesla tested; other brands rely on Smartcar's own multi-brand support, not independently re-tested per brand) |
| Flexy is charging-equipment agnostic | Proven by standard - SAE J1772/CCS puts start/stop inside the vehicle, not the charger, so this doesn't depend on Flexy's own build |

## Status

Drafted to give an honest, source-backed feasibility read on each MVP feature, distinguishing what's a solved problem (ComEd pricing) from what's a real but partnership-gated path (usage data) from what's genuinely untested (multi-brand EV coverage, smart meter parsing).
