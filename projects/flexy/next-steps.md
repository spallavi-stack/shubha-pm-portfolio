# Flexy, Next Steps (private working list, kept separate from the case study and hub)

## Prototype gaps

- The four use-case failure flows documented in `user-stories.md` are not wired up in the click-dummy at all, no error states exist in the prototype's code path yet:
  - UC1 (ComEd connection fails): no "fetch failed, showing last-known data" banner.
  - UC2 (charge drops below floor mid-session): no live "session in progress" state to interrupt in the first place.
  - UC3 (stale price data on view-open): no freshness timestamp or "not current" indicator in the Price & Cost view.
  - UC4 (achievable-at-setup check fails): the success banner exists but there's no failure counterpart message.
- The Price & Cost view's real-time consumption line uses the same illustrative shape across Today/Week/Month/Year. Accepted limitation, not a gap to close: real per-household consumption data needs actual smart-meter access (see Green Button item below), which this portfolio prototype deliberately doesn't have.

Custom Settings panel per-vehicle audit and multi-brand Smartcar validation moved to the roadmap's LATER section (2026-08-01), not MVP-blocking, see `roadmap.md`.

## Real-data upkeep

- Done (2026-08-01): Today's price already live-fetched ComEd on page load, but silently fell back to a fixed Jul 16 snapshot whenever the fetch failed, which it did in testing (it routed through a third-party CORS proxy, `api.allorigins.win`, that returned nothing; separately, ComEd's API returns no data for "today" until the day is posted). Fixed: fetch ComEd directly (no proxy needed, ComEd's API allows cross-origin requests), and added a same-day-failed fallback to yesterday's real data before falling back to the static snapshot. Week/Month/Year and the last-resort static fallback are refreshed by a new `scripts/refresh_comed_prices.py`, run monthly via `.github/workflows/refresh-flexy-prices.yml` (also manually triggerable), so the portfolio never shows visibly stale data without a live fetch happening.

## Documentation

- Persona-count consistency spot-check done (2026-08-01): found and fixed a stale "six personas" reference in `user-stories.md`/`.html` left over from before two personas were cut in the v4 freeze; every other doc correctly says four. Re-check whenever personas are touched again.

## PMF / validation

- Done (2026-08-01): funnel analysis and experiment design built via the discovery-scope → grounding-research → research-auditor process, sourced from Lenny Rachitsky's newsletter/podcast archive (activation-rate benchmarks, A/B-testing scale thresholds, low-volume experimentation alternatives) plus Uplight's and Smartcar's own published materials. See `funnel-experiment-scope.md`, `funnel-experiment-grounding-research.md`, and the public-facing `funnel-analysis.md`/`.html`, linked from the case study page's Product Analytics section.
- Done (2026-08-01): `funnel-analysis.md` revised to v2 after an external critique of the v1 draft. Added pilot success thresholds, guardrail metrics (disconnect/revoke rate, manual override frequency, missed-readiness rate), an event taxonomy for engineering, and a go/no-go decision framework, all Assumption-tagged pending real pilot data. The critique's fifth suggestion, sub-segment funnels by vehicle OEM/tariff/OS, was deliberately deferred rather than built out: a pilot at ComEd's own scale (a dozen to low hundreds of participants) can't support that much slicing without each segment dropping below reasoning range, which would have quietly undercut the document's own core point about sample-size honesty.
- Done (2026-08-01): merged `funnel-analysis.md`'s "Stage-by-stage estimate" and "Success thresholds for the pilot" tables into one, after the v2 update above left the same three funnel stages listed twice.

## Status

Living list. Update as items are picked up or new gaps are found. Kept separate from `index.html` and the portfolio hub; this is a working doc rather than a polished portfolio artifact.
