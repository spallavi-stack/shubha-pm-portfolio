# Flexy for Utilities — Dashboard KPI Framework & Information Architecture

Expands `utility-partnership-offer.md`'s "Partnership success metrics" (four items, first pass) into the full KPI set the operator dashboard needs, plus the screen-level layout, before any code gets written. Every KPI below states what it answers, where the number would actually come from, and whether that data source exists yet or is a stated assumption — same discipline `technical-feasibility.md` already applies to Flexy's consumer side.

## 1. KPI groups

### A. Enrollment & reach
| KPI | Answers | Data source | Status |
|---|---|---|---|
| Enrolled devices (EVs), count + trend | Is the program growing | Flexy's own enrollment records | Real once any household is enrolled — no new data source needed. |
| Enrollment funnel (invited → app download → EV connected → smart charging activated) | Where households drop off | Flexy's own product analytics | Same funnel already named as a consumer PMF signal in `product-brief.md` — this reuses it, doesn't invent a second one. |
| Geographic distribution (enrollment density by zip/service area) | Where the program is and isn't working | Flexy's own enrollment records + postal code | Matches a feature WeaveGrid's dashboard already shows (§B2 of `utility-offer-grounding-research.md`) — a credible, expected KPI, not a novel one. |

### B. Grid value & capacity
| KPI | Answers | Data source | Status |
|---|---|---|---|
| Aggregated flexible capacity available right now (kW/MW) | How big is the "virtual battery" at this moment | Sum of enrolled EVs' available shiftable load, computed from each vehicle's connection/charging state | Requires live per-vehicle state via Smartcar (proven feasible per `technical-feasibility.md`, not yet aggregated into this specific metric). |
| Peak shaving achieved (kWh shifted out of peak windows, cumulative + per-event) | Is the program doing what it's for | Difference between scheduled/actual charging times and what an unmanaged baseline would have been | Computable once real charging-session data exists; the baseline-comparison method itself needs to be defined before this ships, not assumed. |
| Dispatch reliability (% of enrolled load that actually shifted when a peak/surplus window called for it) | Can ComEd trust this resource | Compare a dispatch event's targeted load reduction to what was actually delivered | The single most important trust metric per the interview finding in `synthetic-interviews.md` (readiness/reliability beats savings) — carried over to the utility side deliberately. |
| Forecast accuracy (predicted vs. actual load shift) | Can ComEd plan around this resource | Compare Flexy's own pre-event forecast to the dispatch-reliability figure above | Depends on dispatch reliability data existing first. |
| Snapback indicator (does a load-shift create a new spike when devices resume together) | Is the "peak shaving" actually net-positive | Compare post-event load curve shape against pre-event baseline | Not a metric Flexy's MVP roadmap currently produces logic for — flagged directly from Optiwatt's own named failure mode (§B1 of `utility-offer-grounding-research.md`), a real gap to design against, not yet solved. |

### C. Consumer savings & experience
| KPI | Answers | Data source | Status |
|---|---|---|---|
| Aggregate consumer savings delivered ($, cumulative) | Is the program worth it for households too | Sum of individual household savings, from Flexy's own price/usage calculations | Same computation the consumer app already needs for its own "here's what we saved you" surface — reused, not duplicated. |
| Average savings per enrolled household | Is the value real per-household, not just in aggregate | Aggregate savings ÷ enrolled households | Derived from the metric above. |
| Retention / opt-out rate | Is the program sticky | Enrollment records over time | Real once a pilot has run long enough to measure it. |

### D. Economic & compliance reporting
| KPI | Answers | Data source | Status |
|---|---|---|---|
| Cost avoided vs. a stated benchmark | Is this worth what ComEd is paying | Enrolled-EV count × the Brattle/ev.energy avoided-cost range, or a ComEd-specific figure if one is ever established | Uses the same C3 model from `utility-offer-grounding-research.md` — explicitly a benchmark-based estimate, not a measured figure, and should be labeled as such on the dashboard itself, not presented as a hard number. |
| CRGA / Beneficial Electrification Plan compliance fields | Does this feed ComEd's own regulatory reporting | Whatever specific fields ComEd's compliance team actually needs | Genuinely unknown without asking ComEd directly — this row is a placeholder for a real conversation, not a designed feature yet. |
| Program cost vs. value delivered | Is the partnership priced fairly, in ComEd's own view | Flexy's fee (per `utility-partnership-offer.md`'s pricing) against Cost avoided above | Depends on both inputs above; same caution applies. |

## 2. Screen-level information architecture

**Overview (landing screen)** — glanceable, no drill-down required to answer "is this working right now":
- Aggregated flexible capacity available (headline number, large)
- Today's dispatch status (idle / active event, with a plain-language reason if active)
- Enrolled devices, count + trend sparkline
- Dispatch reliability, most recent event

**Enrollment & Reach (drill-down)**: funnel chart, geographic map, growth trend over the program's life.

**Grid Events (drill-down)**: event log (each dispatch: when, targeted vs. delivered reduction, snapback indicator if applicable), forecast-accuracy chart over time.

**Consumer Impact (drill-down)**: aggregate and average savings, retention trend — the households-side proof that the program isn't just good for the grid.

**Compliance & Reporting (drill-down)**: exportable view, fields TBD pending direct input from ComEd (see D, row 2).

Chart treatment follows `design-system.md` §8's shipped dashboard palette: `--teal-chart` (primary series), `--gold` (secondary series — not `--tou-cheap` blue, which the dataviz skill's palette validator found too close to teal for adjacent-series use), `--critical` red (alert/anomaly only), `--gray`/`--ink-soft` (baseline/forecast reference lines).

## 3. What's explicitly out of scope for this dashboard build

- The Compliance & Reporting screen's actual field list — not designed until there's a real answer to what ComEd needs, not invented here.
- Any live data connection — this is a coded prototype with illustrative data, the same convention Flexy's consumer-side `prototype.html` already uses (documented honestly in its own Limitations section).
- The snapback-mitigation *logic* itself (how Flexy would actually prevent it) — this framework only adds the KPI that would surface the problem; solving it is a roadmap-level question, not a dashboard-design one.

## Status

Draft v1.1. Expands the four-item first pass in `utility-partnership-offer.md`'s Partnership success metrics into a full KPI set (12 metrics across 4 groups) plus screen-level IA. Each KPI's data source and real/assumed status stated directly, following `technical-feasibility.md`'s convention. The dashboard's coded build (`utility-dashboard.html`) is complete; this document's chart-palette reference (§2) was updated to match the palette actually shipped, after `design-system.md`'s post-launch recolor.
