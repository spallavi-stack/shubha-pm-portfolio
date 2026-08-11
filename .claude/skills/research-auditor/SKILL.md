---
name: research-auditor
description: Audits an already-drafted case-study document (product brief, grounding research, personas, roadmap, or similar) for unsupported claims, disconnected sections, and padding — flags every factual/statistical statement that isn't tagged Fact/Inference/Assumption and sourced where applicable, every major section that doesn't actually connect to the research or the rest of the document, and every sentence whose only job is hedging or restating something already established elsewhere, all without silently rewriting the document. Use this before committing or publishing any case-study document, whenever the user asks to fact-check, audit, review, sanity-check, tighten, or "double check" a piece of research, or wants more confidence in a draft before it goes into the portfolio. This is a review pass, not a drafting step — run it on a document that already exists, after grounding-research or any manual drafting, and run it on your own draft before presenting it to the user, not only when asked.
---

# Research Auditor

## Why this exists

`grounding-research` produces labeled, sourced claims when it's the one doing the writing. But documents get hand-edited, merged, drafted by a different pass, or written before this labeling discipline existed at all (most of this portfolio's existing docs predate it). A document can also *look* well-sourced while actually having citations that don't say what the text claims, or labels that got out of sync with edits. This skill is the check that catches that — a second pass with the specific, narrow job of asking "does every claim here actually earn the confidence it's stated with?"

It also catches other failure modes beyond fact-sourcing: major sections that don't actually connect to the rest of the document, and sentences whose only function is explaining what the brief wasn't including (a TAM/SAM/SOM disclaimer, a "note on what this is" that just repeated portfolio-wide boilerplate) rather than adding information. Both are checked for below.

One instance of this is worth naming as a caution, not just a success story: an earlier version of this skill flagged SunnySideUp's first Hypothesis for not citing the market-size research already established elsewhere in the document. That produced a *worse* Hypothesis on the next pass — a citation-heavy paragraph re-arguing numbers from two sections earlier, which the user then rewrote back out because it read as a rehash, not a hypothesis. The corrected lesson (see step 4) is that Hypothesis connects to the rest of the brief through Success Metrics, not through citing Market size or Problem directly — a good Hypothesis states a belief plus a handful of falsifiable, named behaviors, and those behaviors should each show up as a metric later. Don't reintroduce the citation requirement this replaced.

A second caution, same brief: when filling in Go-to-market content, this skill's own drafting pass invented plausible-sounding justifications for two channel choices (a claim that DNOs face "bad grid-connection paperwork caused by rogue installers," a claim that two named subreddits were "currently missing" plug-in advice) — neither grounded in `grounding-research.md`. The first fix softened both to explicitly-flagged "unverified assumptions." The user correctly rejected that: an Assumption tag only earns its keep when the claim could plausibly get checked in a future research pass, the way `grounding-research.md`'s Assumption-tagged claims sometimes get resolved later (see its leasehold-consent finding). A GTM tactic's throwaway rationale is never getting verified for a portfolio piece — tagging it "unverified" instead of cutting it is hedging dressed up as rigor, not real rigor. See step 6 for the resulting rule.

A third caution, Flexy (August 2026): the same underlying fact, the US electricity bill increase, was stated as two different numbers in two different places: "26% in five years" on the case study page (`index.html`, no citation) and "roughly 40% since 2021" in `product-brief.md` (footnoted to a Fortune article). Neither this skill nor `grounding-research` had caught the mismatch; the user did, by asking why one figure was preferred over the other. Verifying primary EIA data on request showed the case-study page's number was closer to what EIA itself reports (~27% over a similar window), while the product brief's 40% traced only to a single magazine article whose sourcing didn't fully hold up on inspection — but the user's decision was to treat the Fortune-cited 40% as the portfolio's single source of truth for this fact regardless, and require every instance of it across the repo to match. The lesson isn't which number won; it's that the same fact must never carry two different values in two different files, and which value wins is always the user's call, not something to resolve unilaterally by picking the newer file, the more-recently-touched file, or the more "official-looking" source. See step 2a and step 6.

The point isn't to rewrite the document. Fixing a claim requires either finding a real source or a judgment call about how much uncertainty to accept — both are the user's call, not something to paper over automatically. Consistency and padding issues are different: those can usually just be fixed directly rather than flagged and left, since they're not judgment calls about truth, they're just clearer writing. Use judgment about which category a finding falls into.

## Process

1. **Read the target document in full.** Identify every claim that states something as fact — numbers, statistics, named events, competitor behavior, regulatory status, user behavior claims, anything presented as true rather than as opinion or framing.

2. **For each claim, check:**
   - Is it labeled (Fact / Inference / Assumption), or stated as if it's simply true with no label at all?
   - If labeled Fact: is there a real, checkable source attached? Does the source plausibly say what the text claims it says? (Spot-check a sample by actually fetching cited URLs where feasible — don't just trust that a citation exists.)
   - If labeled Inference: is the reasoning shown, or is it just a Fact-flavored claim wearing an Inference label?
   - If labeled Assumption: is it actually flagged clearly to the reader, or buried in confident-sounding prose?
   - If unlabeled: this is the main thing to catch. Documents written before this labeling discipline (or by a different process) will have plenty of unlabeled claims — that's expected, not a sign something went wrong upstream.

2a. **Check every numeric or factual claim against the rest of the project, and against the rest of the portfolio, for a conflicting value on the same fact.** Search other docs in `projects/<slug>/docs/`, the project's `index.html`/`prototype.html`, and portfolio-level files like `docs/video-scripts.md` for the same underlying fact (same metric, same subject) stated with a different number, date, or claim. This is a distinct failure mode from unsourced claims: both instances can be individually well-formed and even both cited, and still be wrong together because they disagree. Never resolve a conflict like this yourself, not even by preferring the newer file, the more-recently-edited file, or the source that looks more authoritative — surface it to the user with both values, both locations, and both sources (or lack of one), and ask which is canonical. Once the user picks one, update every instance across the project (and portfolio, if it appears in more than one project's material) to match, so the same fact never carries two different numbers in two different places again.

3. **Don't relitigate subjective or framing content.** This audits factual claims, not product opinions, positioning choices, or reasonable editorial judgment calls ("Flexy positions readiness above savings by default" is a design decision, not a factual claim needing a source).

4. **Check that each major section actually connects to the rest of the document, not just to itself.** A Recommendation that doesn't follow from the Critical Success Factors, a Competitive landscape section that doesn't feed the Differentiation argument — these read as complete sentences but don't actually do the job of a brief, which is to make one connected argument. If a section could be swapped into an entirely different case study's brief without anyone noticing, it's probably not grounded enough.

   **Hypothesis is a deliberate exception to "connect via citation."** Don't flag a Hypothesis for failing to cite Market size or Problem — that's been tried, and it produces a worse document (a citation-dense rehash of numbers already stated elsewhere, not an actual hypothesis). Hypothesis should instead read as one belief statement plus a small number of named, falsifiable behaviors. Check its connection to the rest of the brief by whether each of those behaviors has a corresponding, named metric in Success Metrics & validation methodology, not by citation count.

5. **Flag sentences that only explain an absence or restate something said elsewhere, rather than adding information.** Watch for: a sentence whose whole job is "this document doesn't state X" (a TAM/SAM/SOM disclaimer, for instance) once the surrounding content already makes the point on its own; boilerplate that's already stated at the portfolio level (a "this is a fictional case study" note repeated in every single doc when it's already on the hub page); hedge words that don't change the reader's confidence in anything ("genuinely," "clearly," "obviously" used as filler rather than to distinguish a real confidence level). These aren't factual problems, they're padding, and they're worth cutting on sight rather than leaving for the user to notice one at a time.

5a. **If the document has a Solution section describing a calculation, score, match, or algorithmic "check," verify its runtime inputs are actually named somewhere** — either in Solution itself or in Open Questions. A promised output ("a viability score in seconds") with no stated data model behind it is a connection gap of the same kind step 4 checks for, just aimed at the product mechanism instead of the argument. Flag it as a finding if it's missing; don't assume someone will notice on their own.

6. **Report findings as a list, not a rewritten document**, for factual/sourcing issues specifically: quote or point to the claim, say what's wrong (unlabeled / unsourced / source doesn't support the claim / label doesn't match the actual certainty level), and suggest the fix (find a source / relabel as Assumption / cut it) without applying it unilaterally, since that's a judgment call about truth that belongs to the user. Consistency and padding findings (steps 4 and 5) can be fixed directly rather than just flagged, since they're editorial, not evidentiary. **Cross-document numeric conflicts (step 2a) are their own category**: always flag and ask, never fix directly and never leave unflagged — even though picking a number sounds like a small edit, which number is true is a factual judgment call, not an editorial one, so it follows the same rule as sourcing issues, not the same rule as padding.

   **When the fix is "find a source / relabel as Assumption / cut it," default toward cut for tactical or strategic content (go-to-market rationale, a critical-success-factor's "why"), and reserve relabel-as-Assumption for content that could plausibly get verified in a future research pass.** A market or regulatory claim tagged Assumption might get resolved the way `grounding-research.md`'s leasehold-consent question did. A GTM tactic's invented rationale ("this reduces installer-caused paperwork," "this community lacks advice") is never getting checked for a portfolio piece — tagging it "unverified" instead of cutting it just moves the padding into a more rigorous-looking wrapper. Still surface it as a finding either way; don't cut it unilaterally without the user's sign-off, but say which way you'd lean and why.

7. **Give an overall read**, not just a list: is this document mostly solid with a few gaps, or does it have a systemic problem (e.g. written entirely before labeling existed, or leaning on assumptions dressed up as facts throughout)? That framing matters as much as the itemized list for the user deciding whether to fix a few lines or ask for the doc to be substantially reworked.

8. **Don't block on this alone.** Surface unresolved findings; let the user decide whether the document is fit to commit as-is, needs specific fixes, or needs to go back through `grounding-research` for the flagged sections.

## Output format

```markdown
# Research Audit — <document>

## Flagged claims (sourcing — needs user judgment)
1. "<claim as it appears in the doc>" — [unlabeled / unsourced / label mismatch / source doesn't support claim]. Suggested fix: ...
2. ...

## Cross-document conflicts (needs user judgment — do not resolve unilaterally)
1. "<fact>" stated as <value A> in <file/location>, and as <value B> in <file/location>. [Both cited / one cited / neither cited — say which]. Asking which is canonical before touching either.
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
