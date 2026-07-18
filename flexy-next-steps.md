# Flexy — Next Steps (private working list, kept separate from the case study and hub)

## Prototype gaps

- The four use-case failure flows documented in `flexy-user-stories.md` (ComEd connection failure, vehicle below the safety floor, stale price data, achievable-at-setup check failure) are written as acceptance criteria but not built into the click-dummy. Building at least one as a real interactive flow would make the "verify it yourself" story stronger.
- Custom Settings panel (screen 7) hasn't been audited field-by-field against the roadmap's full list (day-of-week variation, home-only automation, per-vehicle settings for two EVs at once).
- The Price & Cost view's real-time consumption line uses the same illustrative shape across Today/Week/Month/Year. That's an explicitly documented limitation, but it means the load side of the chart isn't as real as the price side.

## Missing half of the product: the utility side

Flexy today is entirely B2C-facing, even though the business model is B2B2C. There's no artifact showing what the utility partner (ComEd) would actually see or manage. Optiwatt, a real direct competitor, builds exactly this: an operator-facing dashboard for utility partners to monitor enrollment, program performance, and aggregate load-shifting impact. Building a "Flexy for Utilities" operator dashboard, even a thin one, would close a real, currently visible gap: right now there's no evidence the utility side of the B2B2C story was thought through at all. Best framed as a third Flexy artifact, alongside the consumer prototype and the documentation set, since it's the other half of the same product rather than a separate case study.

## Claims made but not proven

- **Hardware-agnostic EV charging.** The pitch claims Flexy works across EV brands via Smartcar. This is true of Smartcar as a product, but Flexy's own integration has never been tested against more than one real brand's account. A real multi-brand Smartcar sandbox test (e.g. a GM account and a Ford account both connecting successfully) would turn this from an assumed claim into a demonstrated one.
- **Smart meter data handling.** Flexy's real-time consumption view assumes it can receive and parse interval usage data, but no parser or ingestion path has actually been built or tested. ComEd's real, genuinely self-service "Green Button: Download My Data" export (CSV/XML, ESPI/Atom format) is the concrete next step, download a real file, build a parser against it, and prove the data can actually become the chart it's meant to power.

## Real-data upkeep

- The Week/Month/Year price arrays are baked-in snapshots from specific dates in mid-2026. They'll read as stale if this prototype is still being shown a year from now. Either refresh them periodically or add a visible "as of" date so the staleness is honest rather than invisible.
- SREC pricing (Illinois Shines) and HEAR rebate county rollout status, referenced in the solar/heat-pump calculators on the roadmap, change over time and aren't wired to any real feed yet.

## Documentation

- Jobs to Be Done, User Stories & Use Cases, Technical Feasibility, Real Data Integration Guide, and AI Collaboration Review are all rebuilt as of this pass; worth a full re-read end to end for consistency now that they've been reconstructed once already.
- Persona-count consistency (six personas total) should be spot-checked across all docs whenever personas are touched again.

## PMF / validation

- No funnel analysis or experiment design exists yet for Flexy. This is listed on the original portfolio plan but not started.
- No synthesized "what would make a utility actually pilot this" argument exists yet, worth building once the utility-dashboard artifact above exists to point to.

## Status

Living list. Update as items are picked up or new gaps are found. Kept separate from `flexy-case-study.html` and `index.html`; this is a working doc rather than a polished portfolio artifact.
