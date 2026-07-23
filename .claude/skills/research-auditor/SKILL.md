---
name: research-auditor
description: Audits an already-drafted case-study document (product brief, grounding research, personas, roadmap, or similar) for unsupported claims, disconnected sections, and padding — flags every factual/statistical statement that isn't tagged Fact/Inference/Assumption and sourced where applicable, every major section that doesn't actually connect to the research or the rest of the document, and every sentence whose only job is hedging or restating something already established elsewhere, all without silently rewriting the document. Use this before committing or publishing any case-study document, whenever the user asks to fact-check, audit, review, sanity-check, tighten, or "double check" a piece of research, or wants more confidence in a draft before it goes into the portfolio. This is a review pass, not a drafting step — run it on a document that already exists, after grounding-research or any manual drafting, and run it on your own draft before presenting it to the user, not only when asked.
---

# Research Auditor

## Why this exists

`grounding-research` produces labeled, sourced claims when it's the one doing the writing. But documents get hand-edited, merged, drafted by a different pass, or written before this labeling discipline existed at all (most of this portfolio's existing docs predate it). A document can also *look* well-sourced while actually having citations that don't say what the text claims, or labels that got out of sync with edits. This skill is the check that catches that — a second pass with the specific, narrow job of asking "does every claim here actually earn the confidence it's stated with?"

It also catches two other failure modes that showed up on SunnySideUp's first product brief and had to be fixed by the user asking for them one at a time: a Hypothesis section that asserted demand without citing any of the market-size research already in the same document, and multiple sentences whose only function was explaining what the brief wasn't including (a TAM/SAM/SOM disclaimer, a "note on what this is" that just repeated portfolio-wide boilerplate) rather than adding information. Both are checked for below, not just fact-sourcing.

The point isn't to rewrite the document. Fixing a claim requires either finding a real source or a judgment call about how much uncertainty to accept — both are the user's call, not something to paper over automatically. Consistency and padding issues are different: those can usually just be fixed directly rather than flagged and left, since they're not judgment calls about truth, they're just clearer writing. Use judgment about which category a finding falls into.

## Process

1. **Read the target document in full.** Identify every claim that states something as fact — numbers, statistics, named events, competitor behavior, regulatory status, user behavior claims, anything presented as true rather than as opinion or framing.

2. **For each claim, check:**
   - Is it labeled (Fact / Inference / Assumption), or stated as if it's simply true with no label at all?
   - If labeled Fact: is there a real, checkable source attached? Does the source plausibly say what the text claims it says? (Spot-check a sample by actually fetching cited URLs where feasible — don't just trust that a citation exists.)
   - If labeled Inference: is the reasoning shown, or is it just a Fact-flavored claim wearing an Inference label?
   - If labeled Assumption: is it actually flagged clearly to the reader, or buried in confident-sounding prose?
   - If unlabeled: this is the main thing to catch. Documents written before this labeling discipline (or by a different process) will have plenty of unlabeled claims — that's expected, not a sign something went wrong upstream.

3. **Don't relitigate subjective or framing content.** This audits factual claims, not product opinions, positioning choices, or reasonable editorial judgment calls ("Flexy positions readiness above savings by default" is a design decision, not a factual claim needing a source).

4. **Check that each major section actually connects to the rest of the document, not just to itself.** A Hypothesis that doesn't cite anything from the Market size or Problem sections, a Recommendation that doesn't follow from the Critical Success Factors, a Competitive landscape section that doesn't feed the Differentiation argument — these read as complete sentences but don't actually do the job of a brief, which is to make one connected argument. If a section could be swapped into an entirely different case study's brief without anyone noticing, it's probably not grounded enough. This is exactly what happened with SunnySideUp's original Hypothesis: fluent, plausible, and disconnected from every number already established in the same document.

5. **Flag sentences that only explain an absence or restate something said elsewhere, rather than adding information.** Watch for: a sentence whose whole job is "this document doesn't state X" (a TAM/SAM/SOM disclaimer, for instance) once the surrounding content already makes the point on its own; boilerplate that's already stated at the portfolio level (a "this is a fictional case study" note repeated in every single doc when it's already on the hub page); hedge words that don't change the reader's confidence in anything ("genuinely," "clearly," "obviously" used as filler rather than to distinguish a real confidence level). These aren't factual problems, they're padding, and they're worth cutting on sight rather than leaving for the user to notice one at a time.

6. **Report findings as a list, not a rewritten document**, for factual/sourcing issues specifically: quote or point to the claim, say what's wrong (unlabeled / unsourced / source doesn't support the claim / label doesn't match the actual certainty level), and suggest the fix (find a source / relabel as Assumption / cut it) without applying it unilaterally, since that's a judgment call about truth that belongs to the user. Consistency and padding findings (steps 4 and 5) can be fixed directly rather than just flagged, since they're editorial, not evidentiary.

7. **Give an overall read**, not just a list: is this document mostly solid with a few gaps, or does it have a systemic problem (e.g. written entirely before labeling existed, or leaning on assumptions dressed up as facts throughout)? That framing matters as much as the itemized list for the user deciding whether to fix a few lines or ask for the doc to be substantially reworked.

8. **Don't block on this alone.** Surface unresolved findings; let the user decide whether the document is fit to commit as-is, needs specific fixes, or needs to go back through `grounding-research` for the flagged sections.

## Output format

```markdown
# Research Audit — <document>

## Flagged claims (sourcing — needs user judgment)
1. "<claim as it appears in the doc>" — [unlabeled / unsourced / label mismatch / source doesn't support claim]. Suggested fix: ...
2. ...

## Consistency and padding (editorial — fixed directly)
1. "<section or sentence>" — [disconnected from the rest of the document / pure hedging / repeats existing portfolio boilerplate]. Fixed by: ...
2. ...

## Overall read
[1-3 sentences: is this doc mostly solid, or systemically under-sourced? Any pattern worth naming?]
```

## A note on judgment

Not every unlabeled claim is equally serious. "Illinois is a real US state" doesn't need a citation. The claims that matter are the ones a reader would actually use to judge whether the product opportunity is real — market size, regulatory status, competitor capabilities, user behavior data. Use judgment about what's worth flagging rather than treating every sentence as suspect; a report that flags everything is as useless as one that flags nothing.

---
*The Fact/Inference/Assumption audit discipline is adapted from the confidence-and-methodology-before-any-number principle in [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills)' `research-ops-orchestrator` — specifically that discipline, not its full multi-lane (clinical/finance/market/product) routing system, which targets enterprise research operations well beyond the scope of a solo portfolio workflow.*
