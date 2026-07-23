# Product Brief Template

Frozen template for every case study's `docs/product-brief.md`. Don't redesign this per project — the whole point of freezing it is to stop re-deriving structure each time. If a section genuinely doesn't fit a given project, say so explicitly in that section rather than silently dropping it.

Every section that states a researched claim (market size, regulatory status, competitor behavior, etc.) should cite back to where the full sourcing and confidence level live. **Use GitHub-flavored markdown footnotes for this (`claim.[^1]` with `[^1]: grounding-research.md §Section` defined in a `## Sources` section at the bottom) — not inline parentheticals like "(full sourcing: grounding-research.md §X)" in the middle of a sentence.** Inline citations break reading flow in exactly the way this template is trying to avoid (see "1-2 pages, scannable" above); footnotes keep the prose readable while still making every claim traceable. Reuse the same footnote number wherever the same section is cited again, rather than minting a new one each time. The brief is a compressed, scannable summary; `grounding-research.md` is the permanent, full-depth backing material it's compressed from, and nothing here should read as more certain than what that document actually supports.

---

```markdown
# [Product] — Product Brief

## One-line pitch
A single sentence. (Amazon PR/FAQ discipline: if you can't say it in one sentence, you don't know what you're building yet.)

## Problem
What's broken today, for whom. Cite grounding-research.md for sourced claims. (Cagan Q1 + standard brief "Problem")

## Who it's for
Named segments — a working sketch, even before the full personas doc exists. (Cagan Q2)

## Why now
What makes this the right moment — regulatory/market timing, cited. (Cagan Q6)

## Market size & opportunity
TAM/SAM/SOM or equivalent, sourced from grounding-research.md, with confidence level carried over (don't state a Fact-tier number where the source labeled it an Assumption). (Cagan Q3)

## Competitive landscape & differentiation
What exists today, why this approach, why us. (Cagan Q4 + Q5)

## Solution
2-3 sentences, max. Detail lives in the roadmap/prototype once they exist, not here. (Best-practice brief convention)

## Hypothesis
One belief sentence — "We believe that [X] will be used by/produce [Y outcome]" — plus a small number of named, falsifiable user behaviors it predicts. Don't cite Market size or Problem back into this section: that's been tried, and it produces a citation-dense rehash of numbers already established elsewhere, not an actual hypothesis. Each named behavior should instead map to a concrete metric in Success metrics & validation methodology below — that pairing is what makes this section connect to the rest of the brief. (Modern hypothesis-driven brief format)

## Go-to-market
Even a fictional sketch matters — how does this actually reach the people who need it. (Cagan Q7)

## Success metrics & validation methodology
The section that makes the brief testable later, not just descriptive now:
- Leading indicators vs. lagging indicators, explicitly separated.
- A concrete go/no-go test — adapt a real methodology (e.g. a Sean-Ellis-style "would be very disappointed" signal) to synthetic personas/interviews honestly, stating plainly that it's a synthetic proxy, not real user data.
- Every item in the riskiest-assumption log (from `scope.md`) gets an explicit "here's the signal that would prove this wrong."
(Cagan Q8 + the reason this template exists)

## Critical success factors
What has to hold true for this to work — technical, partnership, regulatory. (Cagan Q9)

## Not yet covered (separate artifacts, sequenced next)
Restated from `scope.md`'s "out of scope for this pass," so the brief is self-contained and doesn't require cross-referencing to be understood. **This is about sequencing, not permanent exclusion.** `scope.md` uses "out of scope" to mean "not part of this round of work" (a roadmap, prototype, and other docs are separate artifacts built later, in order), not "the project will never do this." Don't title this section "Out of scope" alone or frame it like Square's "Non-Goals" — that reads as a permanent cut, which is the wrong signal here and will confuse anyone reading the brief cold. Name what's a separate artifact vs. simply not started yet, and say plainly that neither is excluded from the project.

## Open questions
Tagged, tied back to the riskiest-assumption log.

## Recommendation
A stated GO / PIVOT / KILL call, even for a portfolio piece — this is what makes it read as product judgment rather than an uncritically presented idea. (Cagan Q10)

## Further reading
Links to `scope.md` and `grounding-research.md` for the full research this brief compresses.

## Sources
Footnote definitions go here, one per cited grounding-research.md section — e.g. `[^1]: grounding-research.md §Market size`. GitHub renders these as clickable footnotes. Don't put citations inline in the prose above.
```

---

## Provenance

- **Problem / Who / Why now / Market size / Competitive landscape / Go-to-market / Success metrics / Critical success factors / Recommendation** — structured around Marty Cagan's (SVPG) 10-question Opportunity Assessment, chosen because it's purpose-built for evaluating whether a *new* opportunity is worth pursuing — unlike a standard feature-PRD template, which mostly assumes an existing product, team, and backlog.
- **One-line pitch** — Amazon's "Working Backwards" PR/FAQ discipline: state the customer-facing outcome in one sentence before anything else.
- **Solution / Not yet covered** — informed by Square's PRD template (Kevin Yien) and its explicit "Non-Goals" section, and Asana's project-brief problem-statement framing, via Lenny's Newsletter, "My favorite product management templates" (issue 37). Deliberately not named "Non-Goals" or "Out of scope" here: `scope.md`'s actual content is sequencing (separate artifacts, built later) rather than Square's original permanent-exclusion framing, and the first SunnySideUp brief showed that the borrowed name reads as a decision to cut things that are actually still planned.
- **Hypothesis** — modern hypothesis-driven brief format ("we believe X will produce Y") rather than a flat "we will build X" statement. An earlier version of this template's guidance called for citing Market size/Problem research directly in this section; that produced a citation-dense rehash on SunnySideUp's first brief and was reverted (see `research-auditor`'s SKILL.md for the matching fix on the audit side) in favor of named, falsifiable behaviors mapped to Success Metrics.
- **Success metrics & validation methodology** — the section built specifically to answer "how would you actually test this later," per Sean Ellis's product-market-fit survey methodology (the 40%-"very disappointed" test, refined from Dropbox/Eventbrite/LogMeIn data) adapted honestly for a portfolio context with no real users.
- Everything above evaluated against, and one item (`opportunity-solution-tree`) deliberately excluded because its core mechanics — a pre-existing tracked metric, opportunities sourced from a real customer base, continuous weekly prioritization among many known signals — don't fit 0-to-1 work with no existing product or user base. See conversation history / commit log for the reasoning if this ever needs revisiting.
