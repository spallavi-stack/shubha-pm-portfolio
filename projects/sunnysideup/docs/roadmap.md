# SunnySideUp — Roadmap (v1)

## Prioritization framework: ICE

Using ICE (Impact, Confidence, Ease) rather than RICE. Reach isn't meaningfully estimable yet since SunnySideUp has no real user base or institutional partner in place, so ICE fits a pre-launch, research-grounded prioritization better. Each scored 1–10; ICE score is the average of the three. Every score is justified against a specific persona JTBD, `grounding-research.md` finding, or `synthetic-interviews.md` theme, not a gut feeling.

**Legend:** Impact = how much this moves the needle on the core problem. Confidence = how sure we are, based on persona/interview evidence or grounding-research sourcing strength, that this is the right feature. Ease = technical/data feasibility given known constraints.

The candidate list below is drawn from three places, not invented fresh: the calculator-inputs list already named in `product-brief.md`'s Open Questions, the three personas' JTBD statements, and the four themes from `synthetic-interviews.md`. Prioritizing without first enumerating candidates from what's already established would just be inventing structure over nothing.

---

## NOW (MVP, build first)

| Feature | Tied to | Impact | Confidence | Ease | ICE |
|---|---|---|---|---|---|
| Rooftop viability calculator (core engine) | Graham's and Denise's JTBDs; Solution's core promise | 9 | 8 | 6 | 7.7 |
| Self-reported data input flow (consumption, tariff, occupancy, roof/socket, financing) | Open Questions' calculator-inputs list; literal prerequisite for the calculator to run at all | 9 | 8 | 6 | 7.7 |
| Plug-in viability + legal-status calculator, with an explicit "still unresolved" flag | Aisha's JTBD; interview theme that honesty about limits, not confident answers, is the actual trust mechanism | 9 | 6 | 6 | 7.0 |
| Assumptions / "show your work" transparency panel | Graham's and Denise's Q5 trust conditions specifically (showing what's driving the calculation); Aisha's related but distinct Q5 want, honesty about the unresolved legal question, is the plug-in calculator's own flag below, not this panel | 8 | 9 | 8 | 8.3 |
| Honest "red" result with substantive reasoning, not just a color | Solution's stated promise; interview theme that red results are trusted and acted on, not dismissed | 8 | 9 | 7 | 8.0 |
| Basic quote-comparison (manual entry of a received quote's price and system size against the baseline calculation) | Denise's JTBD specifically | 8 | 8 | 8 | 8.0 |

### Rooftop and plug-in calculators: what the Confidence gap means

The plug-in calculator's Confidence score (6) is the lowest in Now on purpose, not because Aisha's segment matters less (it's the newly-legal, most differentiated part of the pitch), but because `grounding-research.md` itself flags plug-in cost and generation figures as its weakest-sourced section: "present as clearly-labeled placeholder estimates, not sourced facts." That caveat ships to real users directly, inside the tool's own output, not smoothed over in the roadmap and quietly dropped by launch. The rooftop calculator's underlying figures (system cost, generation, payback range) are also wide, industry-consensus ranges rather than a single authoritative number, but they're corroborated across more independent sources than plug-in's, which is the actual basis for the 8 vs. 6 split.

### Transparency panel and honest red results: what the interviews actually showed

Graham and Denise gave closely related reasons for wanting to see the assumptions behind a number, Graham didn't want a black-box score, Denise wanted to see what's driving a price difference, and that shared want is what this panel is built for. Aisha's own Q5 answer names the same underlying trust mechanism, independence plus honesty about limits, but applied to a different, already-separately-listed capability: the plug-in calculator's explicit "this part's genuinely unclear" flag on the legal question, not a general calculation-assumptions panel. Both features exist because of the same interview-validated trust mechanism, which is why this panel has the highest ICE score in this roadmap alongside the honest-red-result feature below: it's the actual product differentiator the interviews validated, not a nice-to-have polish item.

The honest-red-result feature depends on the same logic. `synthetic-interviews.md` found all three personas would accept an unfavorable result and change their behavior accordingly (Denise pushing back on an installer, Aisha dropping the plug-in idea) specifically *because* of the non-referral positioning, not as an assumed trait independent of it. A generic "not recommended" message doesn't carry that weight; the result needs to state the specific reason (poor payback given the household's numbers, a legal status that isn't in force yet, and so on).

---

## NEXT (build once MVP is validated)

| Feature | Tied to | Impact | Confidence | Ease | ICE |
|---|---|---|---|---|---|
| Shareable result / referral summary | Hypothesis behavior #3 (organic word-of-mouth); the organic-referral-rate leading indicator in Success Metrics; interview theme that sharing is peer-to-peer | 7 | 6 | 7 | 6.7 |
| Quote document upload/parsing (auto-extract price, system size, and included items from an uploaded PDF quote) | Removes manual-entry friction on Denise's flow; catches the specific inflated line items (scaffolding, DNO paperwork, battery bundling) named in `grounding-research.md`'s quote-complexity finding | 8 | 5 | 3 | 5.3 |
| Battery/storage add-on calculator | Rooftop segment's fuller economics, per `grounding-research.md`'s battery arbitrage figures | 6 | 4 | 6 | 5.3 |

Quote-document parsing scores well on Impact, since it would remove real friction from Denise's flow, but it sits in Next rather than Now because it depends on the baseline calculator and manual quote-comparison already working, and because reliable PDF/OCR parsing is a genuine, unproven technical risk that shouldn't gate MVP launch. The battery calculator is deferred for a data reason rather than a demand reason: none of the three personas raised batteries specifically, and `grounding-research.md` names battery arbitrage value as "the least certain figure found" in the whole document, a wide, uncorroborated range not worth building a launch feature on yet.

---

## LATER (roadmap-level vision, not built in this portfolio)

| Item | Rationale |
|---|---|
| Real data integration (smart-meter or bank-linked automatic consumption pull, replacing self-report) | No UK equivalent mechanism has been researched yet. Self-report is the realistic near-term input source; matches Flexy's own precedent of keeping real data integration as a separate future guide rather than an MVP/Next roadmap item. |
| Scotland/Wales-specific guidance | `grounding-research.md` flags Scotland and Wales as having their own "broadly similar but distinct regimes," explicitly not researched in depth — a genuine, named deferral rather than an oversight. |
| Institutional/DNO/local-authority portal integrations | A distribution and partnership motion, already named in `product-brief.md`'s Go-to-market. Not a product capability to sequence on an engineering roadmap. |
| Further legal research on individual tenancy-agreement consent | A research task, not a product feature. Tracked in `product-brief.md`'s Open Questions, not this roadmap. |

---

## Competitive grounding

Energy Saving Trust, the closest real independent analog identified in research, provides generic assumptions and then defers the final personalized number back to the installer being evaluated (`grounding-research.md`'s Competitors section). That's the specific gap the transparency panel and quote-comparison mode are built to close: give the personalized number directly, and show what it's based on, rather than sending the user back to the party being evaluated.

## What this roadmap deliberately does not do

It doesn't rank purely by ICE score. Quote-document parsing and the battery calculator both sit in Next despite reasonable Impact scores because they depend on infrastructure Now builds first (a working baseline calculator, a manual quote-comparison flow) or rest on data too thin to build a launch feature on. This is a dependency-and-evidence-aware roadmap, not a sorted list.

It also deliberately excludes two things that could look like roadmap items but aren't: institutional distribution partnerships (a Go-to-market motion, not an engineering sequence) and further legal research on tenancy consent (a research task tracked in Open Questions, not a product feature to build).

## Status
**Draft v1, audited.** Six Now (MVP) features, three Next, four Later items, each tied to a specific persona JTBD, `grounding-research.md` finding, or `synthetic-interviews.md` theme rather than a gut call. `research-auditor` run: the transparency panel's citation originally overclaimed Aisha's Q5 as supporting the same feature as Graham's and Denise's, when her answer actually supports the separately-listed plug-in "still unresolved" flag; narrowed the citation and the prose rationale to match. Also fixed a minor misquote (punctuation altered inside quotation marks) in the Scotland/Wales Later item.
