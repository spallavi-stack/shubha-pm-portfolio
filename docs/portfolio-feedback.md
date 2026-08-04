# Portfolio feedback log

A running record of feedback on the portfolio site itself (positioning, structure, what a visitor experiences), kept separate from the case studies' own research docs.

**How to use this file.** Every round of feedback gets its own section, dated, with the source noted. Each item records what was said, what it implies for the site, and a status. Items stay in the log after they're actioned so the reasoning behind a change is still findable later. Items that were heard once and not yet acted on stay open rather than being deleted, and a second or third mention of the same thing is added to the existing item rather than logged fresh, so weight of evidence is visible.

Status values: **Open** (logged, no decision yet), **Decided** (approach agreed, not built), **Done** (shipped), **Parked** (deliberately deferred, waiting for corroboration).

---

## Round 1 — August 2026

**Source:** two conversations with reviewers of the live site. Feedback is recorded as given.

### 1. The portfolio speaks to the audience least able to hire

**Status:** Open. Highest priority of this round.

**What was said.** The site reads as though it is aimed at founders of small, ideation-stage companies who need someone to take them from idea to prototype. That audience has a real problem: they typically don't have much money, and many are themselves mid-fundraise, so hiring an experienced product manager is not a near-term move for them. Optimising the portfolio for that group points it at the segment least able to act on it.

There are other buyers who could hire this work and are not addressed anywhere on the site:

- Larger companies that want to run experiments.
- Companies considering or executing a pivot.
- Companies wanting to test a specific feature before committing to building it.

**The second half of the same problem.** The site never states who it is for. There is no line anywhere naming the audience, the engagement type, or the kind of problem Shubha is available to work on. The closest thing is one clause in the homepage hero ("If you're working on a climate solution and need product support, I'd love to connect"), which names a sector but not a buyer, a company stage, or a type of engagement. A reader has to infer the intended client from the shape of the case studies, and what they infer today is "early-stage founder who needs a prototype."

**What this implies.** Two distinct pieces of work, and they are worth keeping distinct:

1. **State the audience explicitly.** Currently missing entirely. This is additive and doesn't require reworking any existing case study.
2. **Make the existing work legible to the broader audience.** The 0-to-1 case studies do demonstrate skills an experimenting or pivoting company would buy: opportunity assessment, research grounding, prioritisation calls, a testable prototype. That reading is available in the material but the framing doesn't offer it. Reframing what each case study demonstrates is likely cheaper than producing new case studies aimed at different buyers.

**Open question for Shubha.** Is the answer one broadened positioning that covers all of these buyers, or explicit separate paths (a reader picks "I'm a founder" / "I'm running an experiment inside a company")? Flexy's page already uses an audience toggle for its own two user types, so the pattern exists in the codebase if the second route is chosen.

### 2. The PM Lab playground doesn't belong on the home page

**Status:** Parked, by Shubha's decision. Revisit if a third reviewer raises it.

**What was said.** The hands-on PM toolkit section on the home page shouldn't be there. It may deserve its own space elsewhere.

**Current state.** The playground is a full section (`#pm-lab`) on the home page, below the case studies and the process section.

**Decision.** Not a priority right now. Left in place pending more feedback pointing the same way.

### 3. Case studies bury the prototype under a wall of text

**Status:** Open. High priority, and the largest structural change of this round.

**What was said.** A visitor entering a case study is met with text. By the time they reach the prototype, realistically they have lost interest.

**Current state.** Both case studies run: short summary, then problem and positioning, then research, then roadmap, and only then the prototype, followed by limitations and the document list. On Flexy the prototype is the fifth section on the page. A reader has to get through market sizing, competitive landscape, personas, interview synthesis, and ICE prioritisation before there is anything to click.

**What was asked for.** Move the prototype up so a visitor sees it, or at minimum sees that a playable prototype exists, before reading anything substantial.

### 4. Add a short marketing-style video to each case study

**Status:** Open. High priority, paired with item 3.

**What was said.** Each case study should open with a video, roughly two minutes, in a marketing style: an introduction to the product and a showcase of the work behind it.

**What the video is for, in Shubha's words.** The goal is not to sell Flexy and not to sell SunnySideUp. The goal is to show that this is a product built from nothing, that a real volume of work went into it, that a prototype exists and can be played with, and that the whole thing is grounded in real research and real data. A first-time visitor should get all of that from two minutes of video without reading anything.

**What this implies.** The video is the top-of-page hook and the prototype sits immediately with or after it. Items 3, 4 and 5 are one restructure, not three separate ones: video, prototype, then depth.

### 5. The detailed work moves below

**Status:** Open. Same change as items 3 and 4.

**What was said.** All the real work behind the case study should sit below the video and prototype.

**What this implies.** The current section order inverts on each case study page. Research, market sizing, roadmap, and the documents list stay on the page in full, and move underneath. Nothing gets cut, it changes position.

### 6. Put the source documents behind a password

**Status:** Open. Medium priority.

**What was said.** The PDFs and the actual working documents are the heart of the work and are easy to take. Shubha's read is that nobody is realistically setting out to steal it, but it represents a lot of work, and the portfolio shouldn't hand a fully-formed idea to someone with slightly more confidence about acting on it. Password-protecting the documents is one option.

**Current state.** Every supporting document is a plain HTML page under `projects/<name>/docs/`, linked openly from the case study page and directly reachable by URL.

**What this implies, and what needs deciding.** There is a genuine tension between this and items 3 to 5. The restructure above is meant to prove that serious work sits behind the prototype, and the documents are the proof. Gating them removes the proof from the default visitor path. Worth deciding deliberately:

- What is gated, and what stays public as evidence of depth.
- What a gated reader sees instead: a request-access route, a visible list of what exists behind the gate, or an excerpt.
- Whether this is a shared password given out on request, or per-visitor access.
- The site is a static GitHub Pages build with no server, so any password on it is client-side and does not survive someone reading the page source. Fine as a "don't casually copy this" signal, not fine as actual protection. If real protection is the goal, the documents need to move off the static site.

---

## Themes across this round

Two of the three reviewers' concerns are about the same underlying thing: **a visitor cannot quickly tell who this is for or what they'd be buying.** Item 1 is that problem at the site level (no stated audience, and the implied one is the wrong one). Items 3 to 5 are that problem at the case study level (the value is real but buried behind reading). Item 6 pushes in the opposite direction to items 3 to 5, and is the one place where the round's feedback conflicts with itself.
