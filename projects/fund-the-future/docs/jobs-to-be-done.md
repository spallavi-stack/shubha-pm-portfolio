# Fund the Future: Jobs to Be Done

*Derived from [`personas.md`](personas.md) and the research in [`grounding-research.md`](grounding-research.md). Drafted August 2026. The people are synthetic. The market facts each job rests on are real and cited in the research document.*

Nine jobs across the two sides of the product and the visitor who is not a user. Each is written as a situation, a motivation and an outcome, so the job stays separable from the feature that currently serves it.

## The jobs

### The organisation

| # | Job statement | Persona |
|---|---|---|
| 1 | When I need money for a season of work, I want to put what we do and what it costs in front of people who have never heard of us, so the work happens this year rather than waiting on a grant cycle. | Elena |
| 2 | When I ask for money for work that prevents a disaster rather than repairing one, I want to state it in terms a stranger can weigh, so I can compete with the photographs that arrive after the storm. | Ruben |
| 3 | When I find a platform that says it funds groups like mine, I want to learn within a minute whether it will take me, so I can start the paperwork or stop wasting my week. | Marisol |
| 4 | When money is raised for us, I want it to reach an account we can actually use, so having no bank account stops being the reason we cannot be funded. | Elena |
| 5 | When the next season comes round, I want to raise again without repeating the bureaucracy, so asking becomes something we do rather than a project we survive. | Elena, Ruben |

### The donor

| # | Job statement | Persona |
|---|---|---|
| 6 | When I decide where this year's climate giving goes, I want to see what an independent party confirmed about an organisation separately from what the organisation says about itself, so I can fund small work without taking it on faith. | Anders |
| 7 | When I find work worth supporting, I want to commit monthly in the same action rather than in a second decision later, so my giving continues without me having to remember it. | Priya |
| 8 | When climate news leaves me feeling useless, I want to find a specific bounded piece of work I can fund tonight, so the concern turns into something that happened rather than something I felt. | Tomas |

### The visitor

| # | Job statement | Persona |
|---|---|---|
| 9 | When a link reaches me from outside my network, I want the organisation's registry identity and its accountable person available immediately, so I can decide whether to spend real diligence time on it. | Grace |

## Job 1 in full: the forces on the organisation

Job 1 is the product's centre. Everything else either enables it or follows from it. The four forces are set out because three of them work against the product and only one works for it.

**Push, away from the current situation.** Official development assistance fell 23.1% in real terms in 2025 to $174.3bn, the largest annual decline on record. The institutional money this organisation depends on is being withdrawn while the need grows. Grant applications it can write are being rejected more often, and the foundation that funded Ruben in 2024 had no surplus in 2025.

**Pull, toward the new solution.** A page that publishes in an afternoon and can be shared to anyone, with no fee taken from what is raised, and with the organisation's own registry record shown rather than a dossier demanded. Adaptation philanthropy more than doubled from $404m in 2021 to $870m in 2024 with a 55% rise in the number of funders, so the category is expanding rather than static.

**Anxiety about the new solution.** Three specific fears, and each one is a design problem rather than a marketing problem.

1. *"Publishing our missing filings in public will be used against us."* The organisation is being asked to display its own non-compliance to strangers. The floor-and-cap model answers this by pricing the gap rather than editorialising about it, and by stating it in the platform's words rather than leaving the organisation to explain itself.
2. *"We will do the work and raise nothing."* Well founded. GlobalGiving's Philippines and Climate Action filters together return exactly 25 live projects, most raising under $10,000, one at $38 against a $72,126 goal, and all of them from organisations that already cleared a vetting gate.
3. *"There is no one to complain to if something goes wrong."* Also well founded. The platform holds no funds, so there are no refunds, no reversals and no holding of money pending investigation.

**Habit, holding the organisation in place.** A Facebook page and a personal wallet number posted in the comments already works, at small scale, with no verification and no forms. It costs nothing and it has never failed outright. This is the real competitor for job 1, ahead of every platform in the competitive table.

**What the forces imply.** Push is strong and getting stronger, pull is real, and both anxiety and habit are unusually well grounded in evidence. A product in this position wins on reducing anxiety rather than on increasing pull, which is why verification display and the costed budget are the centre of the design and why a bigger promise would be the wrong response.

## The job map for job 1

Nine steps, from the moment the organisation decides to raise money to the moment it reports back. The product's speed claim has to be made against the right step, and the map is here to keep that honest.

| Step | What the organisation does | Where it happens | Elapsed |
|---|---|---|---|
| 1 | Decide to raise money publicly | Off-platform | Unmeasured |
| 2 | Discover the platform and check eligibility | Landing and eligibility check | Minutes |
| 3 | Submit the organisation for vetting | Registration | Under an hour |
| 4 | Wait while the register is checked and payment KYC runs in parallel | Verification wait, one status screen | About five business days |
| 5 | Receive the green light and the raise cap | Approval | Immediate on completion |
| 6 | Choose the theme matching the work | Builder, step 1 | Minutes |
| 7 | Build the campaign: photo, ask, impact numbers, costed budget, the named person, the reporting commitment | Builder, steps 2 to 6 | An afternoon |
| 8 | Publish and share | Campaign page and share | Immediate |
| 9 | Report back to donors on what was promised | Post-campaign, out of MVP scope | Committed at step 7 |

**The step that carries the speed claim is 7, not 4.** Page creation is instant. Payout is not, because Xendit KYC review takes 5 to 10 business days and dLocal enforces a hard 30-day KYC window. Any claim about speed has to be stated against page creation and never against money arriving, and the campaign page has to work and be shareable during the gap, which makes it a product requirement rather than a caveat.

**Step 4 is where the two-flow model earns itself.** The vetting week is spent inside a wait the organisation already faces for payment KYC, so it costs nothing in elapsed time. Steps 3 to 5 happen once per organisation. Steps 6 to 8 happen once per campaign, which is what makes job 5 achievable and what matches the cost structure, since verification costs roughly the same per organisation regardless of what any campaign raises.

**Step 9 is committed in the MVP and not delivered by it.** The organisation states at step 7 what it will report and when. The product does not yet carry the reporting back. That gap is named in the roadmap rather than hidden, because new-donor retention of 24% to 28% means a campaign raises money roughly once, and what turns a one-off donor into Priya is step 9.

## Job 6 in full: the forces on the donor

Job 6 is the donor-side centre, because Anders is the donor the whole verification design exists for.

**Push.** He gives to two large environmental organisations and cannot tell what his money did in either.

**Pull.** A named person, a bounded project, a line-by-line budget, and a registry record he can verify himself in a second tab. Two independent bodies of evidence point at this same page: the identifiable-victim effect favours a named person and a specific project, and the transparency evidence favours a named accountable person and a costed budget. Climate donors are separately the highest-due-diligence segment in the IRS donor database, so the page is built to be checked for a donor who checks.

**Anxiety.** No tax relief in any market examined, no refund if anything goes wrong, and an organisation he has never heard of in a country he has never visited. The deductibility position is structural rather than fixable: US IRC section 170(c)(2) allows a deduction only for gifts to US-organised entities and the conduit rule requires an intermediary that genuinely holds the funds, which is exactly the custody the product gave up.

**Habit.** Two existing direct debits that require no decision at all.

**What the forces imply.** The product cannot reduce his anxiety by promising, because it holds no money and can guarantee nothing. It can only reduce it by showing. That is the whole argument for evidence over a badge, and it is why the strongest demand signal in the research is the one the product is built on: asked what would encourage them to give more, donors worldwide put "be transparent around how the charity is run" first at 47%, ahead of "clearly explain how they are making change" at 40% and well ahead of making donation easier at 23%.

## Outcome statements

What each side is trying to minimise or maximise, written so it could be measured. These are the candidate instrumentation for the concept test in the product brief.

**Organisation**

1. Minimise the time from deciding to raise money to having a shareable page.
2. Minimise the number of documents the organisation must produce that it does not already possess. The target is zero.
3. Minimise the share of raised funds lost before arrival. Total leakage before any platform charge is 8% to 12%, and the platform's own charge to the organisation is nothing.
4. Maximise the proportion of campaigns that reach a fundable state without human help.
5. Minimise the effort of the second campaign relative to the first.

**Donor**

6. Minimise the time to determine whether an organisation is real.
7. Maximise the proportion of a page's claims that are attributable to a source other than the organisation.
8. Minimise the number of decisions required to give monthly rather than once.
9. Minimise the time from feeling concern to having funded something specific.

## Jobs the product deliberately does not serve

Named so the boundary is a decision rather than an oversight.

- **The institutional funder's sourcing job.** Grace's job 9 is real and the product builds nothing for it. No funder discovery surface, no directory, no grantmaker matching. Her job is served incidentally by a page built for a donor.
- **The unregistered group's job.** Marisol's job 3 gets an answer and the answer is no. The platform holds no money and therefore has no remedy after the fact, which leaves the gate as its only fraud control. This is the honest limit of the purpose statement rather than a phase of the roadmap.
- **The donor's tax-relief job.** Unavailable in every market examined and structurally tied to the custody decision. Stated on the page rather than worked around.
- **The organisation's reporting-back job.** Job 5 depends on it and the MVP commits to it without delivering it. Roadmap item, named as a gap.

## What is not established

Every job on the donor side is constructed from stated preference and from benchmarks drawn overwhelmingly from US organisations with established digital programmes. Job 8 in particular assumes that a donor arriving without a link will fund adaptation specifically, as distinct from disaster relief, and that is the deepest untested assumption in the project. The evidence pointing the other way is in the personas and the brief rather than in a footnote: disaster philanthropy concentrates on the visible emergency, and a study of 1.23 million IRS Form 990 filings from 2010 to 2021 found internationally-focused nonprofits losing donations as local climate risk rises, at 1.26% per standard deviation, measured on US intermediaries rather than on donors. These jobs are the input to the concept test rather than its result.
