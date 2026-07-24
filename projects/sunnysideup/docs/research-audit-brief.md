# Research Audit — product-brief.md

## Flagged claims

1. **~~Confidence creep on the plug-in solar regulatory timeline~~ RESOLVED via direct verification.** The brief's Problem and Why Now sections originally stated "plug-in/balcony solar only became legally viable... in force 15 April 2026" as flat fact, citing `grounding-research.md`, when that document's own text kept the claim at Inference/Assumption tier. Rather than just soften the wording, went and verified the specific dates directly (NICEIC — the actual UK electrical certification body — plus multiple independent trade sources). The dates held up: BS 7671 Amendment 4 (15 April 2026) is well-corroborated. But verification surfaced a better, more precise story than either the original brief or the original grounding research had: the Amendment legalizes *electrician-installed* plug-in solar, while true DIY self-install is still pending an unpublished BSI product standard — a materially more useful distinction for the product than the flattened "it's legal now" framing either version stated. `grounding-research.md` and `product-brief.md` both updated to reflect this.

2. **Same root cause, now resolved alongside #1.** The "Critical success factors" line has been reworded to reflect the electrician-vs-self-install distinction rather than a vague "finalize as expected."

## What checked out

Everything else compresses `grounding-research.md` faithfully and keeps its confidence calibration: the Which? survey and CMA/Ofgem claims, the competitor lead-gen-model claim (correctly scoped to "found in research," not overreaching to "no independent platform exists anywhere"), the leasehold consent claim, the deliberate absence of a plug-in TAM/SAM/SOM number, and the funding-mechanism claim (correctly flagged as unproven). The Success Metrics section's Sean Ellis adaptation is new content, not a research citation, so it isn't at risk of this failure mode.

## Overall read

One real finding, now resolved: this was precisely the failure mode `research-auditor` exists to catch — a claim getting *more* confident as it moved from grounding research into the polished brief, because the drafting pass had more context available (the raw agent transcripts) than what actually survived into the cited document. The fix wasn't just to soften the language; going back and verifying the specific dates directly turned up a materially better answer than either document originally had. Everything else in the brief held up well against its sourcing on first pass. `product-brief.md` is now considered final pending user sign-off.

---

## Round 2 — brief completion pass (Hypothesis, Go-to-market, and tail sections drafted/completed)

### Flagged claims (sourcing — needs user judgment)

1. **~~DNO go-to-market rationale~~ RESOLVED (revised).** The DNO distribution bullet stated "reduce bad grid-connection paperwork caused by rogue installers" as settled fact; nothing in `grounding-research.md`'s G98/G99 section supports this as a documented DNO pain point. First fix softened it to a stated "unverified assumption"; user correctly pushed back that this was dead-weight hedging, since nobody was ever going to go verify a DNO's internal pain points for a portfolio piece, so an unresolved Assumption tag here is padding, not signal, unlike a grounding-research.md Assumption that might actually get checked later. Final fix: cut the unverifiable rationale entirely, keep the channel choice itself.
2. **~~Reddit-community advice gap~~ RESOLVED (revised).** The renter-channel bullet claimed plug-in advice is "currently missing" from `r/UKPersonalFinance` and `r/HousingUK` as fact; never checked. Same correction as #1: cut the unverifiable rationale, kept the channel.

### Consistency and padding (editorial — fixed directly)

1. Two em-dashes in newly-added prose (violates the portfolio's no-em-dash style rule) — replaced with commas/colons.
2. Business model bullet stated funding as if secured ("core operations are funded through...") when Critical Success Factors correctly treats it as an unvalidated hypothesis — reworded to "the plan is for..." plus an explicit cross-reference, so the two sections don't contradict each other on confidence level.
3. A new Critical Success Factors bullet (institutional distribution partners) originally implied a completed search had found no precedent ("no comparable precedent was found in research") when no such research was ever attempted — reworded to state plainly that this hasn't been researched yet, rather than implying a null result.

### Structural note (not a defect, flagged for the skill discussion in progress)

The Hypothesis section, per the user's own rewrite, no longer cites Market size/Problem research directly — it states one belief sentence plus four falsifiable behaviors that map 1:1 to the Success Metrics section instead. Read literally, `research-auditor`'s current step 4 ("a Hypothesis that doesn't cite anything from the Market size or Problem sections... is probably not grounded enough") would flag this as disconnected. It isn't: the connection just moved to a different section (Success Metrics) via a different mechanism (behavior-to-metric pairing) than the one the skill instructions currently describe. Worth updating `research-auditor`'s SKILL.md to recognize this pairing as a valid form of connection, rather than relying on a future audit pass to re-litigate it per document.

### Overall read (round 2)

Everything carried over from round 1 (Problem through Solution, unchanged) still holds. Both new sourcing findings were self-introduced while completing the tail sections just now, not carried over from the user's rewrite, and were caught by running this audit before presenting the draft rather than after. `product-brief.md` is complete pending your review of the Recommendation call and the one-line pitch you're planning to add.
