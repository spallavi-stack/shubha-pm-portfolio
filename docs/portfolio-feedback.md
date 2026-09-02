# Portfolio feedback log

A running record of feedback on the portfolio site itself (positioning, structure, what a visitor experiences), kept separate from the case studies' own research docs.

**How to use this file.** Every round of feedback gets its own section, dated, with the source noted. Each item records what was said, what it implies for the site, and a status. Items stay in the log after they're actioned so the reasoning behind a change is still findable later. Items that were heard once and not yet acted on stay open rather than being deleted, and a second or third mention of the same thing is added to the existing item rather than logged fresh, so weight of evidence is visible.

Status values: **Open** (logged, no decision yet), **Decided** (approach agreed, not built), **Done** (shipped), **Parked** (deliberately deferred, waiting for corroboration), **Declined** (heard, considered, deliberately not acted on).

**This log is feedback received, not a backlog.** Every item here is someone's opinion, recorded so it can be weighed. Shubha decides which ones get acted on, and her own judgement about the portfolio is a legitimate reason to decline any of them. Declining is a real resolution and gets recorded with its reasoning, the same as any other decision. Item 10 is the worked example. Do not treat an open item as an instruction to implement it.

---

## Round 1, August 2026

**Source:** two conversations with reviewers of the live site. Feedback is recorded as given.

### 1. The portfolio speaks to the audience least able to hire

**Status:** Open, partly addressed. **Read Round 2 (items 8 to 11) alongside this one**, which develops it substantially and settles the two decisions it was waiting on. Climate leads (item 10), the audience is English-speaking plus a warm German network (item 9), and the segment framing stays broad (item 11). See the progress note dated 2 September 2026 at the end of this file for what has now been built and what is still outstanding.

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

**Status:** Done (August 2026, #135). The prototype now sits directly under the hero on all three views (Flexy homeowner, Flexy utility, SunnySideUp), ahead of the TL;DR, research, and roadmap content described below as the old order.

**What was said.** A visitor entering a case study is met with text. By the time they reach the prototype, realistically they have lost interest.

**Current state.** Both case studies run: short summary, then problem and positioning, then research, then roadmap, and only then the prototype, followed by limitations and the document list. On Flexy the prototype is the fifth section on the page. A reader has to get through market sizing, competitive landscape, personas, interview synthesis, and ICE prioritisation before there is anything to click.

**What was asked for.** Move the prototype up so a visitor sees it, or at minimum sees that a playable prototype exists, before reading anything substantial.

### 4. Add a short marketing-style video to each case study

**Status:** Partially done. Flexy homeowner (#135, #136) and SunnySideUp (August 2026) both have a recorded, captioned intro video embedded above the prototype. Flexy utility's prototype was moved into its new position at the same time as item 3 but has no video yet, since it hasn't been recorded, still open for that view.

**What was said.** Each case study should open with a video, roughly two minutes, in a marketing style: an introduction to the product and a showcase of the work behind it.

**What the video is for, in Shubha's words.** The goal is not to sell Flexy and not to sell SunnySideUp. The goal is to show that this is a product built from nothing, that a real volume of work went into it, that a prototype exists and can be played with, and that the whole thing is grounded in real research and real data. A first-time visitor should get all of that from two minutes of video without reading anything.

**What this implies.** The video is the top-of-page hook and the prototype sits immediately with or after it. Items 3, 4 and 5 are one restructure, not three separate ones: video, prototype, then depth.

### 5. The detailed work moves below

**Status:** Done, same change as item 3.

**What was said.** All the real work behind the case study should sit below the video and prototype.

**What this implies.** The current section order inverts on each case study page. Research, market sizing, roadmap, and the documents list stay on the page in full, and move underneath. Nothing gets cut, it changes position.

### Layout decision for items 3 to 5 (August 2026)

**Decided: stacked. Video full width, prototype full width directly below it, everything else underneath.**

Side by side was considered and dropped. Shubha's constraint was that it shouldn't happen if it looks cramped, and against the prototypes that actually exist it does:

- Flexy's homeowner prototype is a phone at 390x780. Beside a video it has to lose roughly 200px of height to fit above the fold, which shrinks the UI text inside it.
- SunnySideUp's prototype is mobile-first with breakpoints at 640, 768 and 960px. In a half-width column it falls into its mobile layout, so the desktop tool gets shown in a view it wasn't designed to be judged by.
- Flexy's utility dashboard holds a 1180px container and collapses its four-column grids below 1100px. No side-by-side treatment gives it enough room.

Neither wide prototype breaks in a narrow column, since both are responsive. The objection is what they survive as, rather than whether they survive.

Stacking costs one scroll and compromises nothing. It also applies the same pattern to all three prototypes, which stops the utility dashboard from needing its own permanent exception. The video should be sized so the top of the prototype frame crosses the fold, so a visitor can see something playable sits directly below before scrolling. That covers the single advantage side by side had.

Four options drawn to scale against the real prototypes: https://claude.ai/code/artifact/bb9131c2-e851-499a-b4de-850fd2648247

**Still open.** Whether the prototype at the top is live and clickable or a still image that opens the real thing full-screen. Stacking works either way.

### Video production and hosting (August 2026)

**Tool.** Shubha plans to use Supercut, already available through the Lenny's Newsletter bundle. It is a screen-recording and video editing tool, which suits a video whose material is the prototype and the documents.

**Decided: export the MP4 and commit it to the repo.** Shubha raised the right risk. The bundle grants a year, and a video that lives only on a subscription-tied host disappears when the subscription does, taking the top of both case study pages with it. Owning the file makes the tool a production choice that can change freely rather than a dependency.

Self-hosting fits comfortably. Two minutes of 1080p screen recording lands roughly in the 15 to 50MB range because static UI compresses well, against GitHub's 100MB per-file limit. A plain HTML video tag then works with no player branding, no third party, and no cookie banner.

**Unverified.** Supercut's own hosting and retention behaviour, and what happens to anything stored there if access lapses, has not been confirmed against their documentation. It stops mattering if the MP4 is exported and committed, which is why that is the recommendation regardless.

**Two things to check before recording.** Whether the bundle tier exports without a watermark, and whether any licensed asset gets baked into the video. Your own screen recording and your own narration are yours permanently. Stock music, an AI voiceover, or stock footage may be licensed only while subscribed, in which case the MP4 keeps playing but the licence behind part of it has ended. Sticking to your own recording and narration avoids the question.

**Length: 90 seconds, with 2 minutes as a ceiling.** Roughly 225 words of narration. Flexy gets two videos, one per audience toggle state, since one video covering both the homeowner app and the utility dashboard runs long and serves neither well. Scripts, and the actual recorded transcripts for the two videos that now exist, are in `docs/video-scripts.md`.

### 7. The prototype layout question (August 2026, follow-up)

**Status:** Superseded, then done. This item originally called for the two case studies to differ (Flexy even-split, SunnySideUp stacked, see the reasoning and the now-superseded resulting decision below). Shubha's call: make everything the same, stacked, matching how Flexy already looked. Both Flexy (#135, #136) and SunnySideUp (August 2026) now ship stacked, video full width with the prototype full width directly beneath it, one layout pattern across the whole portfolio rather than a per-project exception.

Two further points came up after the layout decision above and change it:

- **An even split is fine when there is room for it.** Both case study pages currently cap at `max-width:920px` (`projects/flexy/index.html:35`, `projects/sunnysideup/index.html:28`), which is 872px of content, or 424px per column in an even split. That is cramped regardless of the visitor's monitor, because the page caps itself. Clearing SunnySideUp's 640px breakpoint per column would need the top section to break out to roughly 1360px, which needs about a 1400px viewport.
- **SunnySideUp should keep its laptop frame.** Reverting it to a phone frame to save width would contradict the page's own copy at `projects/sunnysideup/index.html:418`, which states the prototype is "built as a desktop web tool rather than a mobile app, so it's shown here on a laptop rather than in a phone frame." That is a documented product decision, so the layout should bend around it.

**Resulting decision (superseded, see Status above): let the layout follow each prototype's shape, so the two case studies differ.**

- **Flexy:** even split. Its prototype is a 390px-wide phone, which fits a ~430px column with no changes to the frame at all.
- **SunnySideUp:** stacked. Video full width, laptop frame full width below it, laptop frame untouched.

Both pages should stack below roughly 1400px viewport width so a visitor on a smaller laptop never gets the squeezed version.

One known imperfection this would have caused in an even-split Flexy: the phone frame is 780px tall against a video around 376px tall at that column width, so the two columns would not end flush. Moot now that Flexy stays stacked instead.

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

---

## Round 2, August 2026

**Source:** the same reviewer as Round 1 item 1, over LinkedIn, responding to a drafted list of three candidate target segments. He was explicit that he is describing constraints and is not arguing against doing this.

This round goes directly at Round 1 item 1. Item 1 established that no audience is stated anywhere. This round argues that picking the audience is harder than it looked, and that the audience may be the wrong thing to lead with.

### 8. Each of the three drafted target segments has a named objection

**Status:** Open. Feeds directly into item 1.

The three segments as drafted, with his assessment of each:

**Segment A: funded seed-stage startups needing an interim PM to validate an MVP before a full-time hire.** He doubts this is a real segment. VCs are usually reluctant to fund this specific spend, and he adds a selection argument: founders who cannot work this out themselves are likely to fail regardless. Weakest of the three.

**Segment B: mid-sized companies and SMEs, especially in energy and climate, wanting to prototype a new product line without pulling their main product team off it.** He accepts this one as possible, with two objections. These companies often believe they already understand their target group well enough to not need a PM. And they often expect German.

**Segment C: agencies and venture studios wanting a freelance PM on a project basis for discovery and prototyping.** He rates this the most sensible of the three. Two objections again. They often keep in-house PMs for exactly this kind of work, and German comes up here too.

**What is addressable.** The ranking is usable as-is: C first, B second, A deprioritized. Beyond ranking, two of the objections are answerable by the portfolio itself rather than requiring a different segment:

- Segment B's "we already know our users" objection is a sales objection the case studies can pre-empt, because demonstrating that assumptions get tested and sometimes overturned is the thing the research process already does. The SunnySideUp renter persona whose ceiling is capped by unresolved law is a concrete example of research changing the answer.
- Segment C's "we have in-house PMs" objection points at positioning as overflow or spike capacity for a specific project, which is a different pitch from replacing anyone.

Segment A's objection is structural and no portfolio change fixes it.

### 9. German is a hard constraint and the site says nothing about language or market

**Status: Answered by Shubha, August 2026. Two target channels defined, site copy still to be written.**

German came up against two of the three segments independently. The reviewer flagged that he does not know whether Shubha speaks it.

The site currently states no location, no market, and no working language. A visitor cannot tell which country's market this is aimed at. The case studies point in two different directions on their own, since Flexy is sized to Illinois and ComEd while SunnySideUp is sized to the UK, and neither is Germany.

**Shubha's answer.** She speaks some German, below a working level for running product discovery. DACH is not the primary target. The focus is an English-speaking audience, plus her existing German network of people who have worked with her before.

**What that resolves.** The German objection in item 8 mostly dissolves, because it was an objection to competing for German-language mandates, which is now out of scope. It stays live only if segments B or C get pursued cold in the German market.

**What that defines: two channels that need different things from the site.**

- **Cold, English-speaking.** The portfolio carries the whole argument on its own. This is the channel where item 10's differentiator has to land, because nothing else is doing the persuading.
- **Warm, her existing German network.** These people have worked with her and already trust the work. The site functions as a credibility artifact confirming what she has been building, rather than as a persuasion device. Language is a low barrier here because the relationship predates it.

**This turns the Illinois and UK split into an asset.** Flexy sized to ComEd and SunnySideUp sized to the UK previously read as an inconsistency about which market the portfolio addresses. Under an English-speaking, remote-first target it reads as deliberate international range instead, and no longer needs reconciling.

**The trade-off being accepted, stated plainly.** Ruling out German-language delivery shrinks the reachable pool in her local market, which is the substance of the reviewer's point. The answer is that English-speaking clients are reachable remotely and the warm German network does not require the language. Worth revisiting only if inbound work turns out to be overwhelmingly German-language.

**Still to do on the site.** State the working language and that she works remotely with English-speaking clients. That information is absent today, and a visitor cannot currently tell.

### 10. The differentiator matters more than the segment

**Status: Decided by Shubha, August 2026. Climate leads. The reviewer's core recommendation is declined.**

**The decision.** Climate stays the headline. The site continues to lead with the energy transition and with why Shubha works on it. The method stays as supporting evidence rather than becoming the opening argument.

**The reasoning.** Shubha's judgement, weighed against the reviewer's. Feedback is an input to this decision and not a verdict on it, and her read on what the portfolio is for carries more weight than a single reviewer's read on what the market wants. The climate focus is the reason the portfolio exists, and leading with process would give up a real differentiator to compete on process against everyone else competing on process.

**What survives the decision.** The reviewer's underlying observation still holds and is compatible with climate leading: the method is currently buried, and it is the strongest argument for the segments he rated highest. Surfacing it better is available without demoting climate. The homepage already has a section on the system used per project, and the process itself is documented across this repo. Making that more visible is a separate, smaller piece of work from changing what the site leads with.

**Recorded below for context, since the argument shaped items 8 and 11.**

His strongest point, and the one that reframes item 1. A lot of experienced people have been laid off recently and many of them went freelance, so the market is crowded with strong competition. Segment selection matters less than being able to answer why someone should pick her over the rest of that field.

His answer for 0-to-1 work is **framework and structure.** He argues domain knowledge is secondary, because client companies almost always have their own domain experts, and any good PM can extract that knowledge from internal people and then build and test prototypes.

**This cuts against how the portfolio is currently framed.** The homepage leads with climate, both in the headline and in the hero copy, and both case studies are climate products. If domain knowledge is secondary to the buyer, the current framing leads with the part he considers least differentiating.

**The material to do it differently already exists.** The documented research process (`discovery-scope`, `grounding-research`, `research-auditor`), the frozen product brief template, ICE-scored roadmaps with the reasoning shown, the honest limitations sections, and the Fact/Inference/Assumption tagging are all framework and structure, and all already built. The homepage even has a section on the system used for each new project. The framing puts climate first and the method second.

**Worth holding both sides before deciding.** A climate focus is itself a differentiator in a crowded market, it is the reason the portfolio exists, and abandoning it to compete on process alone gives up something real. The decision is which one leads and which one serves as proof, and that is Shubha's call rather than something this log should settle.

### 11. Early freelancing means taking what comes, which argues against narrowing too hard

**Status:** Open. Tempers item 1.

His practical note: when starting out as a freelancer you take everything and simply try to get clients.

This refines item 1 rather than contradicting it. Item 1's finding was that the site names no audience at all, which is still true and still worth fixing. This says the fix should not be a narrow declaration that excludes work she would happily take. State clearly what she does, how she works, and the kinds of problems she takes on, and let the segment list stay broad enough to catch the work that actually arrives.

---

## Themes across Round 2

Round 1 asked who the portfolio is for. Round 2's answer is that the segment question has no clean answer, and that a sharper one sits behind it: in a market crowded with recently laid-off senior people, what makes this the obvious choice? The reviewer's answer is the method, and the method is already documented across this repo without being the thing the site leads with.

Both decisions that were blocked on Shubha are now made. **Item 9:** English-speaking clients plus her existing German network, with DACH out of scope as a primary market. **Item 10:** climate leads, and the reviewer's recommendation to lead with method is declined.

**Item 1 is therefore unblocked.** The positioning work can now be written against settled ground: climate leads, the audience is English-speaking plus a warm German network, and per item 11 the segment framing stays broad enough to catch work she would take rather than narrowing to one buyer. What remains is writing the copy, since the site still states no audience, no engagement type, and no working language.

The one piece of Round 2 still worth acting on independently is surfacing the method better, which item 10 records as compatible with climate leading.

## Progress, 2 September 2026

Against item 1, the "Who this is for" row on `index.html` was reworked. This is the first piece of the item's copy work to reach the site.

**Two cards merged into one.** "Innovation leads" and "Experiment leads" were saying the same thing in different words, and reading them one after the other made the row look padded. They are now a single card, with the description widened to carry both meanings: "Testing an idea or a feature before you commit engineering time to it."

**One card added, aimed at a buyer the row was missing entirely.** "Impact organisations", described as "Funding or running programmes that need product thinking." The row previously spoke only to startups, agencies and founders, so a programme lead at a foundation, a UN agency or a development bank had nothing to recognise themselves in. That buyer is a real target, and it is the one segment where Shubha's EESL record is the strongest asset she has.

Two wording decisions worth recording, since both went against the first draft. No institution is named in the card, on Shubha's call, so the copy stays broad in the way item 11 asks for and does not read as a list of logos she has worked with. The word "real" was cut from "real product thinking", because it was the only intensifier in the row and it implied the reader's current product thinking was not real, which is a poor thing to say to the exact person the card is trying to reach.

The row now runs five cards: Innovation leads, Teams mid-pivot, Agencies & studios, Early-stage founders, Impact organisations.

**Still outstanding on item 1.** The site names an audience now, but still states no engagement type and no working language, both of which the item calls for. The hero copy above the row is unchanged and still carries the old framing.
