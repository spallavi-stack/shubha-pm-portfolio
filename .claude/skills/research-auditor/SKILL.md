---
name: research-auditor
description: Audits an already-drafted case-study document (product brief, grounding research, personas, roadmap, or similar) for unsupported claims — flags every factual or statistical statement that isn't tagged Fact/Inference/Assumption and sourced where applicable, without silently rewriting the document. Use this before committing or publishing any case-study document, whenever the user asks to fact-check, audit, review, sanity-check, or "double check" a piece of research, or wants more confidence in a draft before it goes into the portfolio. This is a review pass, not a drafting step — run it on a document that already exists, after grounding-research or any manual drafting.
---

# Research Auditor

## Why this exists

`grounding-research` produces labeled, sourced claims when it's the one doing the writing. But documents get hand-edited, merged, drafted by a different pass, or written before this labeling discipline existed at all (most of this portfolio's existing docs predate it). A document can also *look* well-sourced while actually having citations that don't say what the text claims, or labels that got out of sync with edits. This skill is the check that catches that — a second pass with the specific, narrow job of asking "does every claim here actually earn the confidence it's stated with?"

The point isn't to rewrite the document. Fixing a claim requires either finding a real source or a judgment call about how much uncertainty to accept — both are the user's call, not something to paper over automatically.

## Process

1. **Read the target document in full.** Identify every claim that states something as fact — numbers, statistics, named events, competitor behavior, regulatory status, user behavior claims, anything presented as true rather than as opinion or framing.

2. **For each claim, check:**
   - Is it labeled (Fact / Inference / Assumption), or stated as if it's simply true with no label at all?
   - If labeled Fact: is there a real, checkable source attached? Does the source plausibly say what the text claims it says? (Spot-check a sample by actually fetching cited URLs where feasible — don't just trust that a citation exists.)
   - If labeled Inference: is the reasoning shown, or is it just a Fact-flavored claim wearing an Inference label?
   - If labeled Assumption: is it actually flagged clearly to the reader, or buried in confident-sounding prose?
   - If unlabeled: this is the main thing to catch. Documents written before this labeling discipline (or by a different process) will have plenty of unlabeled claims — that's expected, not a sign something went wrong upstream.

3. **Don't relitigate subjective or framing content.** This audits factual claims, not product opinions, positioning choices, or reasonable editorial judgment calls ("Flexy positions readiness above savings by default" is a design decision, not a factual claim needing a source).

4. **Report findings as a list, not a rewritten document.** For each flagged claim: quote or point to it, say what's wrong (unlabeled / unsourced / source doesn't support the claim / label doesn't match the actual certainty level), and suggest the fix (find a source / relabel as Assumption / cut it) without applying it unilaterally.

5. **Give an overall read**, not just a list: is this document mostly solid with a few gaps, or does it have a systemic problem (e.g. written entirely before labeling existed, or leaning on assumptions dressed up as facts throughout)? That framing matters as much as the itemized list for the user deciding whether to fix a few lines or ask for the doc to be substantially reworked.

6. **Don't block on this alone.** Surface findings; let the user decide whether the document is fit to commit as-is, needs specific fixes, or needs to go back through `grounding-research` for the flagged sections.

## Output format

```markdown
# Research Audit — <document>

## Flagged claims
1. "<claim as it appears in the doc>" — [unlabeled / unsourced / label mismatch / source doesn't support claim]. Suggested fix: ...
2. ...

## Overall read
[1-3 sentences: is this doc mostly solid, or systemically under-sourced? Any pattern worth naming?]
```

## A note on judgment

Not every unlabeled claim is equally serious. "Illinois is a real US state" doesn't need a citation. The claims that matter are the ones a reader would actually use to judge whether the product opportunity is real — market size, regulatory status, competitor capabilities, user behavior data. Use judgment about what's worth flagging rather than treating every sentence as suspect; a report that flags everything is as useless as one that flags nothing.

---
*The Fact/Inference/Assumption audit discipline is adapted from the confidence-and-methodology-before-any-number principle in [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills)' `research-ops-orchestrator` — specifically that discipline, not its full multi-lane (clinical/finance/market/product) routing system, which targets enterprise research operations well beyond the scope of a solo portfolio workflow.*
