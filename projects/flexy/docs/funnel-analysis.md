# Flexy - Funnel Analysis & Experiment Design

Full sourcing for every figure and claim below is in `funnel-experiment-grounding-research.md`. This document is the compressed, reader-facing summary; that one carries the full citations and confidence levels.

## The funnel

Flexy's enrollment funnel was already defined in `product-brief.md`'s PMF section and reused as-is in `utility-dashboard-kpi-framework.md`: **invited by ComEd → app download → EV connected → smart charging activated**. This document doesn't redefine that funnel. It estimates conversion at each stage and lays out how to actually test and improve it once a pilot exists.

No real-world precedent publishes a funnel structurally identical to this one. ComEd's own EV EMS pilot (twelve residential participants, December 2025 executive summary) discloses only a final enrolled count, not an invited count or a stage-by-stage breakdown. Optiwatt discloses lifetime totals (31,224+ enrolled devices across 44 programs) but no per-program conversion rate. Uplight, a demand-response software vendor, publishes one unaudited figure (a 65% enrollment rate, denominator unstated) and nothing else. Every number below is estimated from adjacent research and Flexy's own persona evidence, not a direct comparable, and is labeled accordingly.

## Stage-by-stage estimate

| Stage | Estimated conversion | Confidence | Why |
|---|---|---|---|
| Invited → App download | 15-30% | Low (Assumption) | No utility-EV-program precedent discloses this number. Bounded by general owned-channel/trusted-institution reasoning on the low end and Uplight's unaudited 65% marketing claim treated as a soft ceiling rather than an expectation. |
| App download → EV connected | Likely Flexy's best-converting stage | Medium (Inference) | All four personas reacted positively to the concept of EV automation itself in interviews. The friction here looks like a UX clarity problem (does the user know their car is connected-capable, is the flow's privacy framing clear, are instructions simple) rather than distrust of the product itself. |
| EV connected → Smart charging activated | Likely Flexy's worst-converting stage | Medium (Inference, but converging with direct persona evidence) | Handing over charging control is Flexy's highest-commitment action, structurally closer to a marketplace's first transaction than a SaaS product's typical low-friction activation step. Products in the highest-commitment activation category convert lowest across a 500+ product benchmark survey. Three of four relevant personas independently named this exact handoff as their trust-breaking point. |

## Success thresholds for the pilot

The table above estimates what conversion is likely. It doesn't say what conversion would count as the pilot succeeding, a different question this document didn't previously answer.

| Stage | Minimum viable threshold | Basis |
|---|---|---|
| Invited → App download | ≥15% | Assumption. Set at the low end of the estimated 15-30% range above. Below it, the invite channel itself isn't landing, independent of anything the product does downstream. |
| App download → EV connected | No material drop-off relative to the download rate | Assumption. This stage has no numeric estimate above (see "Why"), so the bar is relative rather than an invented percentage: a noticeably worse conversion than app download's own rate is the UX-clarity friction the estimate already names, not a separate baseline to hit. |
| EV connected → Smart charging activated | A majority of connected users activate within the pilot window | Assumption, deliberately conservative. This is Flexy's highest-commitment, highest-risk step and one of `product-brief.md`'s three PMF signals. A minority-activation outcome would mean the trust-breaking point three of four personas named in `synthetic-interviews.md` is a real, unmitigated blocker, not a design assumption still to be tested. |

All three are Assumptions: nothing about Flexy has run yet to test them. They mark the point below which the pilot itself needs rethinking, and should be confirmed with ComEd directly before a real pilot starts rather than treated as fixed internal targets.

## Guardrail metrics

Conversion measures whether someone moves through the funnel. It doesn't measure whether the product is quietly failing people who already converted, which matters more here than in a typical SaaS funnel: Flexy asks someone to hand over control of a physical asset they need working on a schedule. Three guardrail metrics for the pilot, alongside conversion, not instead of it:

- **Disconnect / revoke rate.** Share of users who disable vehicle access or delete the app within 14 days of activating smart charging. A pilot's conversion numbers mean nothing if the households counted as "activated" are quietly opting back out within two weeks.
- **Manual override frequency.** How often a user manually overrides a scheduled charging session. Occasional overrides are expected (life happens); a persistently high override rate for a given user is a leading indicator of eroding trust in the schedule, likely visible before that user disconnects outright.
- **Missed-readiness rate.** How often a vehicle wasn't charged to the user's stated target by their stated deadline. This is the literal failure mode of the trust-breaking point `synthetic-interviews.md` already names (three of four personas cited "car won't be ready" as their dealbreaker), and it's the direct opposite of Marcus's own bar for staying enrolled ("if it just works for a few weeks and my bill actually goes down, that's enough for me" - Q5).

All three are Assumption-tagged: they describe what should be tracked, not a measured rate, since no pilot has run. They belong in the same instrumentation build as the events below, not as a later addition once trust problems have already surfaced.

## Experiment design

Flexy's realistic first deployment is a single-utility pilot, comparable in scale to ComEd's own EV EMS pilot (twelve participants) or, optimistically, a low-hundreds cohort. That's several orders of magnitude below what canonical A/B testing needs. Ronny Kohavi's rule of thumb: detecting a realistic 5-10% lift, the range worth targeting rather than 1%, needs roughly tens of thousands up to 200,000 users for a typical conversion metric. A pilot cohort doesn't get there at any funnel stage, so this isn't a design that reaches for a standard split test by default.

### What to actually run, by stage

**Invited → download.** The stage with the most raw volume (every invited household, whether or not anything downstream converts) and the simplest possible outcome (opened the invite, tapped through, or didn't). This is the one stage where a lightweight test is realistic even at pilot scale, since detecting an obvious difference in a simple binary outcome needs far less volume than detecting a subtle lift elsewhere in the funnel.
- Test 2-3 invite message variants (savings-framed vs. convenience-framed vs. ComEd-endorsement-framed) through whatever channel ComEd actually uses to distribute the invite.
- Hypothesis: since Marcus and Bob both said in interviews they'd only use this if ComEd offered or bundled it, an invite that visibly comes from ComEd rather than reading like a generic third-party app pitch should outperform a generic one.
- Given pilot-scale volume, treat this as a directional read (which variant shows a clear lead), not a statistically rigorous lift measurement, and hold the comparison open long enough to actually see a signal rather than calling it after a few days.

**Download → EV connected.** Second-most volume, still likely low-risk. Worth a lightweight instrumented walkthrough before any formal test: watch a handful of real (or, pre-pilot, recruited proxy) users attempt the connect-vehicle flow, the audit method Isaac Silverman describes, rather than defaulting straight to a split test neither the volume nor the risk level justifies.
- Hypothesis: clarifying upfront which vehicles and brands Flexy's Smartcar-based approach actually supports, and stating the privacy scope of what's being shared, reduces the two most commonly named drop-off reasons for this kind of flow (uncertainty about compatibility, data-privacy concern).
- Fix and re-observe qualitatively before investing in a quantitative test here; the volume this stage will actually see in a single-utility pilot likely won't support one anyway.

**EV connected → smart charging activated.** The highest-risk, lowest-volume, highest-stakes stage, and the wrong place to force a quantitative test at pilot scale. Brian Tolkin's alternative toolkit applies directly here: talk to more customers rather than trying to manufacture statistical significance out of a few dozen conversions.
- Structured follow-up conversations with everyone who downloaded and connected a vehicle but didn't turn on smart charging: what specifically stopped them, and does it match the "car won't be ready" fear the synthetic interviews predicted, or something else.
- If a specific UI moment is suspected (e.g. the point where a user is asked to trust a ready-by deadline for the first time), a long-term holdout, a small group who see a modified version of that one screen, watched qualitatively rather than measured for statistical significance, is more honest than an underpowered formal test.
- The strongest lever here is proof that the readiness guarantee holds over real usage across a few real cycles, a product outcome no funnel-copy variant can substitute for. Marcus's own interview answer (Q5) states the bar directly: "if it just works for a few weeks and my bill actually goes down, that's enough for me." The experiment design at this stage is mostly about instrumenting and listening well while that proof accumulates, not testing variants against each other.

### General method, applied across stages

Reused from the audit approach Isaac Silverman (former Head of Uber Rider Growth) describes: research the audience, walk the flow yourself as each persona would, watch a non-technical user attempt it, and look at stage-by-stage data by segment once real data exists, before jumping to hypotheses. Prioritize whatever surfaces by expected impact over cost, and start with the lightest-weight test that could plausibly confirm or kill a hypothesis, saving bigger structural changes for ideas that survive that first cheap look.

For any stage where a formal test does make sense despite low volume, run the power analysis first and say plainly what runtime and confidence level the actual traffic supports rather than assuming a short test will produce a real answer. A deliberately reduced confidence threshold, accepting 80% instead of the standard 95%, is a legitimate, openly-stated trade-off at pilot scale.

### Segmentation (deferred)

A pilot at ComEd's own scale (twelve participants, low hundreds optimistically) can't support splitting the funnel by vehicle OEM, tariff type, or OS without each slice dropping to a handful of data points, too small to reason about at all. Once real volume exists across multiple utilities or a much larger single pilot, segmenting by these dimensions is a reasonable next step. Building it out now would invent structure this document has no data to justify.

## Event taxonomy & telemetry requirements

The experiment design above assumes stage-by-stage instrumentation exists. It doesn't specify what to actually build. A minimum event set, one both the funnel and the guardrail metrics above depend on:

| Event | Captures |
|---|---|
| `invite_sent` / `invite_opened` | Stage 1 volume and the invite-variant test's own denominator, tagged by variant/channel. |
| `app_download_completed` | Stage 1 → 2 boundary. |
| `vehicle_connection_started` / `vehicle_connection_completed` | Splits the Smartcar auth flow itself from the surrounding app experience, the only way to tell whether a stage 2 drop-off happens inside the connection flow or before a user even attempts it. |
| `smart_charging_activated` | Stage 3 completion, and the headline PMF signal from `product-brief.md`. |
| `smart_charging_overridden` | Feeds the manual override guardrail metric above; needs a reason code where the UI can capture one (e.g. "need car sooner"), not just a count. |
| `vehicle_access_revoked` / `app_uninstalled` | Feeds the disconnect/revoke guardrail metric above. |
| `charge_target_missed` | Feeds the missed-readiness guardrail metric above; needs the stated deadline and actual charge level at that deadline, not just a binary flag. |

This is a starting event list for whichever pilot actually gets built, not a finished spec. A real engineering pass would still need to define exact payload fields per event, which this document doesn't attempt.

Which platform actually implements this event list (a product-analytics tool, a qualitative-feedback tool for the follow-up conversations in the experiment design above) is a deferred decision, not designed here. It depends on cost, ComEd's own data-residency and security requirements, and whatever stack Flexy would actually run on, none of which this case study has a real answer for. `funnel-experiment-scope.md` rules out vendor recommendations for the same reason: naming a specific tool without those real constraints would be an invented answer, not a grounded one.

## Go / no-go framework

Ties the thresholds and guardrails above to an actual decision, rather than leaving "what happens if a number comes in low" unanswered:

- **All three stage thresholds met, guardrails clean.** Clear case for pilot extension, `product-brief.md`'s strongest PMF signal.
- **Stage 1 or 2 misses its threshold, stage 3 and guardrails are fine.** Likely a channel or onboarding-UX problem, not a trust problem. Iterate on the invite/onboarding experiment designs above before concluding anything about the product itself.
- **Stage 3 misses its threshold, or a guardrail metric is elevated (rising overrides, disconnects, or missed-readiness events).** A trust problem, not a funnel-copy problem. No experiment variant substitutes for fixing readiness reliability itself; this is the scenario `synthetic-interviews.md`'s trust-breaking point predicted, and it should pause any push to widen the pilot rather than be treated as a stage to optimize copy against.
- **Everything converts, but disconnect/override/missed-readiness rates climb over the pilot's life.** The funnel looks healthy while the product is quietly failing retained users. Treat this as equally serious as a stage-conversion miss, since it's invisible to the funnel view alone.

This framework assumes real pilot data exists to evaluate it against. Until then, it states this document's decision rules, not a report on an actual pilot.

## Status

Draft v2. Grounded in Lenny Rachitsky's newsletter and podcast archive (a 500+ product activation-rate benchmark survey, Ronny Kohavi's and Brian Tolkin's experimentation guidance, Isaac Silverman's funnel-audit method) plus direct sourcing from Uplight's and Smartcar's own published materials and Flexy's existing synthetic-interview evidence. Full citations in `funnel-experiment-grounding-research.md`. The Stage 1 conversion range is this document's lowest-confidence number and the first one worth replacing with real data once any ComEd pilot distribution happens. v2 adds success thresholds, guardrail metrics, an event taxonomy, and a go/no-go framework, all still Assumption-tagged pending real pilot data; sub-segment funnels were considered and deliberately deferred (see "Segmentation (deferred)" above) rather than built out at pilot scale.
