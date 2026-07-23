---
name: grounding-research
description: Produces sourced market, regulatory, and competitive research for a new product case study, where every single claim is explicitly tagged Fact (cited to a real source), Inference (reasoned from stated facts, with the reasoning shown), or Assumption (unverified, flagged as such) — no unlabeled claims allowed. Use this whenever researching market size, regulatory landscape, competitors, or industry data for a case study, especially in an industry outside the user's own experience, or when asked to research or ground a product brief, or when the user says AI-generated research feels untrustworthy, made-up, or "not something I'd trust out of the box." Should run after discovery-scope has defined what research is actually needed — check for projects/<slug>/docs/scope.md first.
---

# Grounding Research

## Why this exists

The default failure mode of AI-generated market research is a document full of specific-sounding numbers and claims with no way to tell which ones are real. That's not a formatting problem — it's a trust problem. A reader (including the user themselves, months later) can't tell "ComEd's Real-Time Pricing program cut peak demand 6.5–9.7% each summer" apart from a plausible-sounding number that was never actually verified. When the topic is outside the user's own domain expertise, they have no way to catch it either.

The fix isn't "try harder to be accurate" — it's making the epistemic status of every claim visible, so a false claim is at least a *visibly unlabeled or unsourced* one, catchable by a human or by `research-auditor`.

## The three labels

Every substantive claim in the output gets exactly one of these, inline:

- **Fact** — verifiable, cited to a real, checkable source (a URL, a named report, a named dataset). If you can't find a real source, it isn't a Fact, no matter how plausible it sounds.
- **Inference** — not directly stated anywhere, but reasoned from one or more Facts. Show the reasoning, not just the conclusion, so the user can judge whether the inference holds.
- **Assumption** — not verifiable from available sources, stated because the case study needs *some* position on it. Flag it clearly as an assumption, not dressed up as anything more certain.

If a claim doesn't cleanly fit one of these — for example, a plausible-sounding statistic you can't actually verify — don't state it as fact and don't quietly drop the label. Either find a real source, mark it as an Assumption, or leave it out.

## Process

1. **Check for a scope document first.** Look for `projects/<slug>/docs/scope.md`. If it exists, research exactly the topics it named — don't expand beyond it. If it doesn't exist, either run `discovery-scope` first or, if the user just wants research on a specific named topic right now, ask them to confirm the boundaries before starting.

2. **Research using real sources.** Use web search/fetch to find actual data — regulatory filings, market reports, named competitors' public information, government/industry statistics. Prefer primary sources (the regulator's own filing, the company's own pricing page) over secondary summaries where possible.

2a. **When researching competitors or the closest positioning analog, always ask what it doesn't do, not just whether it exists.** "Every comparison platform found is referral-funded" is a good finding; stopping there misses the sharper one. If there's a non-referral-funded analog (a nonprofit, a government-adjacent body, an established independent brand), dig into what its own tools/services actually cover and where they fall short of the case study's product — a stated limitation on the analog's own calculator or a place where it defers back to the exact party the case study is trying to route around is usually worth more to the differentiation argument than "no one else is independent." This was missed on the first SunnySideUp pass (Energy Saving Trust's own calculator defers the final number back to the installer) and had to be requested after the fact — treat it as a standing step, not a follow-up.

2b. **Market sizing should never stop at historical adoption.** "X installations to date" describes the past, not the opportunity. Before writing the market-size section, look for: a comparable market with a head start (another country or region with a multi-year track record of the same product category, useful as a demand proxy when the target market has none of its own), the addressable population size (who specifically is un-served, sized from real demographic/housing/industry data, not guessed), and a forward-looking target or forecast (a government roadmap, industry association projection) rather than only a backward-looking growth rate. Not every project will have all three available, but check for all three before concluding the market-size section is done.

3. **Write with the label inline on every claim**, not batched at the end where it's easy to lose track of which label applies to which sentence:

   > **[Fact]** ComEd runs an hourly Real-Time Pricing program today and is finalizing a Time-of-Use rate for 2026, after a pilot that cut peak demand 6.5–9.7% each summer. (Source: [ComEd filing, 2026])
   >
   > **[Inference]** Because RTP customers already see hour-by-hour price swings without any tooling to act on them, the gap this product addresses likely applies at least as strongly once TOU rolls out more broadly — TOU has fewer price points but still requires timing awareness most households don't currently have.
   >
   > **[Assumption]** Household appliance automation adoption in this segment is assumed to be low today, based on general market commentary rather than a specific cited survey — flag for validation if this becomes load-bearing for a roadmap decision.

4. **Don't pad.** Research exactly what the scope document (or the user's specific ask) called for. If something interesting comes up that's out of scope, mention it as a one-line aside rather than expanding the document to cover it — that's how "extra items nobody needed" creeps back in.

5. **Save it** to `projects/<slug>/docs/grounding-research.md`, so later docs (product brief, personas) can cite back to it instead of re-deriving or re-guessing the same facts.

## Output format

```markdown
# <Project> — Grounding Research

## <Topic, e.g. Market & Regulatory Landscape>
**[Fact]** ... (Source: ...)
**[Inference]** ...
**[Assumption]** ...

## <Topic, e.g. Competitive Landscape>
...

## Open questions / lowest-confidence areas
- Anything where even the Assumption feels shaky enough that the user should specifically sanity-check it before relying on it downstream.
```

## A note on judgment

Sourcing everything perfectly isn't always possible — some genuinely useful context (general industry sentiment, informal patterns) doesn't have a clean citation. That's fine; that's what Inference and Assumption are for. The goal isn't zero uncertainty, it's *visible* uncertainty, so the user's trust in the document matches its actual reliability instead of being uniformly (and wrongly) high.

---
*Adapted from the Market Intelligence skill suite in [deanpeters/Product-Manager-Skills](https://github.com/deanpeters/Product-Manager-Skills) (CC BY-NC-SA 4.0).*
