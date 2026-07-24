---
name: discovery-scope
description: Defines what a new 0-to-1 product case study actually needs before any research or drafting starts — produces a short, project-specific checklist of required inputs (problem statement, target user, market context, personas, jobs-to-be-done, competitive landscape, and regulatory/technical grounding where relevant) plus an explicit list of what's deliberately out of scope for this pass. Use this whenever starting research for a new portfolio project (e.g. a new entry under projects/), before writing any product brief, market research, or personas — even if the user hasn't explicitly asked for a "scope" step. Also use when a case study's research feels incomplete, is missing something, or is bloated with sections nobody asked for, or when reworking/restarting research for an existing project like SunnySideUp.
---

# Discovery Scope

## Why this exists

Two failure modes show up constantly in AI-assisted product research: it quietly skips something a real case study needs (incomplete), and it pads the output with sections nobody asked for because generating more text is easy (bloated). Both come from the same root cause — nobody decided, up front and in writing, what "done" looks like for this specific project.

This skill exists to make that decision explicit and reviewable *before* any research or drafting happens, not after. A scope document that the user can read in thirty seconds and edit is worth more than an AI guessing what's needed.

## When to run this

At the start of any new case study, or when reworking an existing one from scratch. If `grounding-research` or a product-brief draft is about to happen and no scope document exists yet for this project, stop and run this first — the other skills depend on it.

## Process

1. **Establish the project basics.** If not already clear from context, ask the user (briefly — this shouldn't feel like an interrogation):
   - What's the product/problem area? (e.g. "solar viability check for UK homeowners")
   - Who's it for, roughly?
   - Is this a brand-new project or a rework of an existing one?
   - Any known constraints already (an industry they know well vs. one they don't, a specific market/geography, a specific regulatory angle)?

2. **Propose a scoped checklist, not a default template.** Don't reach for a fixed list of "the 10 docs every case study has" — that's exactly the padding problem. Instead, reason about *this* project:
   - What does a reader actually need to trust this case study's problem framing? (Usually: problem statement, target user/persona basis, some market or regulatory grounding.)
   - What's genuinely uncertain enough here to warrant research versus what can be reasonably assumed and stated as such?
   - Is this an industry the user knows well, or one they said is "slightly outside their experience"? The latter usually means grounding research matters more and should be scoped as its own step (see `grounding-research`), not folded informally into the product brief.
   - Are there case-study elements that only make sense for *some* projects — e.g. an account-connection/API integration guide only matters if the product involves a real data integration; a regulatory grounding section only matters if the industry is regulated. Include these only if they're actually load-bearing for this project, not because a previous project (like Flexy) had them.
   - Does the product's core value come from a calculation, score, match, or algorithmic "check" (a viability score, a recommendation, a rate comparison)? If so, name a checklist item for it explicitly: grounding research for this project needs to cover not just aggregate market/regulatory figures but the actual runtime inputs the calculation needs and where each would plausibly come from. This is easy to skip silently — SunnySideUp's scope never named it, and the gap wasn't caught until the product brief was otherwise finished.

3. **Write the scope as two explicit lists**, not prose:
   - **In scope for this pass** — each item names the artifact and the one or two things it must actually establish (not just "personas" but "personas — grounded in the regulatory/market research from step X, covering at least the 2-3 user segments with meaningfully different needs").
   - **Out of scope for this pass** — name things explicitly excluded, especially anything a generic AI pass would be tempted to add unprompted (e.g. "no roadmap yet", "no synthetic interviews yet — those come after personas are validated", "no technical feasibility doc — this project has no real integration to assess").

4. **Show it to the user before anything else happens.** This is a checkpoint, not a formality — the whole point is that a human reviews and edits the scope before research time gets spent. Keep it short enough to actually read.

5. **Save it** to `projects/<slug>/docs/scope.md` in the portfolio repo (or wherever the user's working) so it's part of the same reviewable, versioned trail as the rest of the project's docs — not a throwaway planning message that disappears from context.

## Output format

```markdown
# <Project> — Discovery Scope

## Project basics
- Problem area: ...
- Target user: ...
- Known constraints: ...

## In scope for this pass
- [Artifact] — [what it must establish, specifically]
- ...

## Out of scope for this pass
- [Thing explicitly excluded, and why / when it'd come later]
- ...
```

## A note on judgment

Don't treat this as a rubber-stamp step where the checklist is always the same shape. A consumer hardware product needs different grounding than a B2G civic platform. If you're unsure whether something belongs in scope, it's better to ask the user a specific question ("does this project need a regulatory grounding section, given it touches UK solar incentive schemes?") than to either silently include it or silently drop it.

---
*Adapted from the discovery/problem-canvas workflow pattern in [deanpeters/Product-Manager-Skills](https://github.com/deanpeters/Product-Manager-Skills) (CC BY-NC-SA 4.0).*
