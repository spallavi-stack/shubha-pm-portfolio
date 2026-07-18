# Flexy — AI Collaboration Review

**What this is:** what "AI drafted, I directed" actually meant on this project, shown through three real cases from the work itself, rather than asserted as a general claim.

**What this isn't:** an eval in the ML sense. There's no repeatable test set or scoring script here, just a documented review of decisions with evidence attached.

## Case 1: the Time-of-Use pricing model was wrong, and I caught it

**Drafted:** An early version of the Price & Cost screen modeled ComEd's proposed Time-of-Use rate as a multiplier applied to the whole real-time price curve.

**Caught by:** A direct question during review: "I was under the assumption that TOU applies to the price curve, and not that it has its own price curve. Was I incorrect?"

**Verified:** Researched ComEd's actual filed TOU rate proposal. The real structure is a flat delivery-charge premium during a defined peak window (10.7¢/kWh peak vs. 5.9¢/kWh standard, a 4.8¢/kWh delta from 1–7pm), stacked on top of the real-time supply price rather than a multiplier scaling the entire curve.

**Changed:** Rebuilt the chart and calculation logic from a multiplicative model to an additive, stacked model, with the TOU premium drawn as a visually distinct stacked segment on top of the base price bars.

**Verify it yourself:** ComEd's 2026 TOU rate filing is public record with the Illinois Commerce Commission.

## Case 2: a date-format concern that turned out to be a non-issue, verified rather than dismissed

**Drafted:** ComEd's API returns dates using JavaScript's `Date.UTC(year, month, day, ...)` format.

**Caught by:** A review question flagging what looked like a June/July mislabeling in a captured response.

**Verified:** Re-fetched the exact URL live and confirmed, via JavaScript's own documented convention, that months in `Date.UTC()` are zero-indexed (0 = January), so a month value of `6` correctly represents July. Also confirmed the parser only ever extracts the hour field from each entry, so the date component was never actually used in a way the ambiguity could affect.

**Changed:** No code change was needed. The verification itself, re-fetching and checking against source, was the outcome, and it's documented here because "I checked and it's actually fine" is still a real, evidence-backed answer, and a legitimate outcome of a review, rather than a shortcut past the question.

**Verify it yourself:** Fetch `hourlypricing.comed.com/api?type=day&date=YYYYMMDD` for any date and inspect the returned `Date.UTC()` array.

## Case 3: Week/Month/Year tabs showed the same chart with disconnected numbers

**Drafted:** An early version of the Price & Cost screen's Week, Month, and Year tabs displayed the same chart shape as Today, with separate hardcoded summary numbers that didn't derive from that chart.

**Caught by:** A direct catch during review that the tabs weren't internally consistent, the visual and the numbers weren't telling the same story.

**Verified:** First attempt used a mathematical smoothing model, dampening a single real day's shape toward its mean, which I flagged myself as still limited (the average price stayed mathematically identical across ranges, since smoothing preserves the mean by construction). A follow-up question, "why can we not use a broader set of data," led to researching ComEd's `type=5minutefeed` endpoint, which supports real custom date ranges. That made it possible to fetch and aggregate genuinely real multi-day ComEd data instead of smoothing a single day.

**Changed:** Replaced the smoothing approach entirely with real, baked-in Week/Month/Year price arrays, a real 5-day average for the week view and real multi-month samples for month and year, each independently fetched and aggregated from ComEd's live API rather than derived from Today's chart.

**Verify it yourself:** Fetch `hourlypricing.comed.com/api?type=5minutefeed&datestart=...&dateend=...` for the same date ranges used in the prototype and compare.

## What this doesn't cover

This review documents three specific, citable corrections from this project. It's a targeted sample rather than a general audit of every AI-assisted decision made across it. It also doesn't cover writing-quality edits (tone, repeated phrasing patterns); those were real and frequent, but they're a different kind of correction than a factual or technical error, and are addressed separately.

## Status

Three cases, each with what was drafted, what caught it, how it was verified, what changed, and a way to check the underlying claim independently.
