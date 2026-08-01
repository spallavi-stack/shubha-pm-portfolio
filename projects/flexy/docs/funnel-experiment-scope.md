# Flexy Funnel Analysis & Experiment Design — Discovery Scope

## Project basics
- Problem area: not a new product area. This scopes a specific new artifact for the existing Flexy case study: an enrollment funnel analysis and an experiment design to improve conversion through it.
- Target user: the same four Flexy personas (Marcus, Priya, Devon, Jenna & Sam) already defined in `personas.md`, moving through the funnel as ComEd-distributed enrollees.
- Existing constraint, not to be re-litigated: the funnel itself is already named and frozen in two places — `product-brief.md`'s PMF section and `utility-dashboard-kpi-framework.md`'s enrollment-funnel KPI. Stages: **invited → app download → EV connected → smart charging activated**. This pass builds on that funnel; it does not redefine it.
- Rework vs. new: new artifact, first pass. Named as an outstanding "portfolio mini-project" in `product-brief.md` since the brief was drafted, not started until now.

## In scope for this pass

- **Stage-by-stage conversion benchmarks.** For each of the four funnel stages, a plausible conversion-rate range grounded in comparable analogs: utility-distributed program enrollment/app-adoption data where findable (e.g. ComEd's own EV EMS pilot, other utility DR/EV program materials), general mobile app onboarding and permission-grant benchmarks as a fallback where utility-specific data doesn't exist, each tagged Fact/Inference/Assumption per the portfolio's sourcing discipline. This is the hardest and most research-dependent part of this pass — utility-specific funnel benchmarks are likely sparse, so the doc needs to be explicit about which stages have a real comparable and which are reasoned estimates.
- **Drop-off risk identification.** Which stage(s) are most likely to lose people, reasoned from the persona/interview trust themes already established in `synthetic-interviews.md` (e.g. the "car not ready" trust-breaker, hesitation to hand over charging control) plus whatever comparable-product drop-off data turns up in grounding research.
- **Experiment design**, keyed to the highest-risk stage(s): specific testable experiments (what's being changed, hypothesis, success metric, methodology). Methodology has to fit a pilot-stage program with one utility client and no existing user base, not a mature product with large-scale A/B infrastructure — think sequential cohort comparisons, message/framing tests in ComEd's own invite channel, qualitative usability checks, not simultaneous split-test infrastructure Flexy doesn't have.
- **Explicit tie-back to `product-brief.md`'s three PMF signals** (pilot extension, downloads, smart charging activations) — this doc operationalizes those signals with a real funnel and real experiments, it doesn't introduce a competing framework.

## Out of scope for this pass

- No new or renamed funnel stages. If research surfaces a real case for a fifth stage (e.g. "retained usage after 30 days"), flag it as an open question rather than silently expanding the funnel that two other docs already depend on.
- No live product analytics or dashboard implementation — Flexy has no real users yet; this is benchmark research and experiment methodology only, matching every other artifact in this portfolio (fictional product, real research).
- No edits to `utility-dashboard-kpi-framework.md` itself — that KPI framework is frozen; this doc feeds it conceptually (better-grounded funnel benchmarks) but doesn't reopen it.
- No new personas, interviews, or roadmap changes — reuses the existing four personas and their established JTBD/trust themes as the qualitative grounding.
- No A/B-testing tool or vendor recommendations (Optimizely, LaunchDarkly, etc.) — methodology, not tooling.

## Status
Scope drafted, ready for review before grounding research begins.
