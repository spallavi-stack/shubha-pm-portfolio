# Fund the Future: User Stories and Use Cases

*Drafted August 2026. Scoped to phase 1 of [`roadmap.md`](roadmap.md), which is what [`prototype.html`](../prototype.html) demonstrates. Personas are in [`personas.md`](personas.md) and the jobs behind these stories are in [`jobs-to-be-done.md`](jobs-to-be-done.md).*

Acceptance criteria are written to be checkable rather than aspirational. Where a criterion cannot be checked without a real user, it says so.

---

## Epic 1: An organisation finds out whether it can be here

**Why this epic is first.** The gate is the only fraud control the product has, because the platform never holds funds and therefore has no remedy after a donation is sent. Everything else depends on this working.

### 1.1 Check eligibility before investing any effort

> As the leader of a small organisation, I want to know within a minute whether this platform will accept us, so I can start the paperwork or stop wasting my week.

**Acceptance criteria**
- The registration form asks for one document reference: an SEC registration number.
- No screen before the result asks for financial statements, board documentation, or a list of prior funders.
- A number that returns no record, or a record with a status other than Registered, produces a decision on the first submission rather than after a queue.

### 1.2 Be told what would change the answer

> As the leader of an unregistered group, I want to be told what registration would cost and how long it takes, so a refusal leaves me with something to act on.

**Acceptance criteria**
- The rejection screen names the specific missing item rather than a category.
- It carries the current SEC filing fee range, the typical elapsed time, the minimum number of incorporators, and where the process happens.
- It offers a route back into the flow with a different number.
- It states why the rule exists, in terms of the platform holding no money, rather than as policy.

### 1.3 Be checked without being asked for a dossier

> As an organisation with no audited accounts, I want the platform to read what the register already holds, so I am never asked for a document I do not have.

**Acceptance criteria**
- Registration status, incorporation date, registered address, latest General Information Sheet and latest audited financial statements are all read from the register rather than entered by the organisation.
- PCNC accreditation and its expiry are read from PCNC's public register where held, and shown as absent where not.
- The organisation supplies only: the registration number, the kind of work it does, the accountable person's name and role, and a contact.

### 1.4 Wait once, not per campaign

> As an organisation, I want the bureaucratic checks to happen once, so every campaign after the first costs me an afternoon.

**Acceptance criteria**
- Vetting is attached to the organisation and never to a campaign.
- The wait is a single status screen showing which checks are done, running and queued.
- No draft state exists during the wait.
- The green light is valid for twelve months or until SEC status changes, whichever is first, and both conditions are stated at approval.

### 1.5 Understand the ceiling in money

> As an organisation behind on its filings, I want to know what that costs me in pesos, so I can decide whether the audit is worth paying for.

**Acceptance criteria**
- Approval states the raise ceiling as an amount, alongside the full ceiling.
- Where the ceiling is reduced, the screen names the specific filings responsible.
- The screen states that filing them raises the ceiling at the next check.
- Reduced ceiling never blocks publication for an organisation whose status is Registered.

---

## Epic 2: An organisation builds a campaign

### 2.1 Be given a structure rather than a blank page

> As an organisation with no communications staff, I want a page structure that already knows what my work is measured in, so I am not asked to invent a metric.

**Acceptance criteria**
- The theme is selected from the kind of work given at registration, and is changeable in the builder.
- Each theme arrives with its counting units pre-filled as labels, its budget lines pre-suggested, and its own accent and imagery treatment.
- The preparedness and capacity theme supplies units for work that produces no natural countable output.
- The organisation supplies a photograph, a logo and words. It does not choose layout, type or colour.

### 2.2 See the page as it is built

> As an organisation, I want to see what the donor will see while I write it, so I am not publishing blind.

**Acceptance criteria**
- A live preview updates as fields are typed, without losing keyboard focus.
- The preview shows the target as the lower of the budget total and the raise ceiling, and shows both numbers when they differ.

### 2.3 Be told why a named person is required

> As an organisation, I want to understand why you insist on naming an individual, so it reads as a reason rather than a demand.

**Acceptance criteria**
- The requirement is explained at the point the builder asks, not in help text elsewhere.
- The explanation gives the reason, that donors give more to a named person and that donors who research look for someone accountable.
- A campaign cannot publish without a named person.

### 2.4 Publish before the money can arrive

> As an organisation, I want a shareable page immediately, because my payment provider's checks take another week.

**Acceptance criteria**
- Publication does not depend on payout KYC being complete.
- The publish confirmation states that page creation is instant and money arriving is not, with the five to ten business day range named.
- Any speed claim in product copy is stated against page creation.

---

## Epic 3: A donor decides

### 3.1 Separate what was checked from what was said

> As a donor who researches before giving, I want to see which claims someone other than the organisation confirmed, so I can fund small work without taking it on faith.

**Acceptance criteria**
- Facts read from a public register use one consistent visual and typographic treatment across every theme and every page.
- Statements made by the organisation use a different one, also consistent.
- No page mixes the two treatments within a single element.
- Every checked row names its source and the date it was read.
- No badge, seal, tier or rating appears anywhere.

### 3.2 See the gap rather than a summary of it

> As a donor, I want missing filings shown plainly, so I can judge what kind of organisation this is.

**Acceptance criteria**
- Missing filings are listed individually with the date of the last one on file.
- The page states, in the platform's own voice, that filing is a condition of registration and that this organisation is behind on it.
- The page states the reduced ceiling and why it was set.
- The donor is never asked to decide whether the gap is acceptable. The ceiling is the platform's answer.

### 3.3 Judge the money rather than the mission

> As a donor, I want a line-by-line budget, because I can weigh a list of costs and cannot weigh a claim about impact.

**Acceptance criteria**
- Every budget line carries a description and an amount, with a visible total.
- Salary and stipend lines are shown rather than aggregated into overhead.
- The page states that budget lines are the organisation's own statements and are not checked.

### 3.4 Give once or monthly in the same decision

> As a donor, I want the monthly option present at the moment I decide, because I will not make a second decision later.

**Acceptance criteria**
- One-off and monthly appear at the same decision point, with the same prominence, on the page and in the donation sheet.
- The donation action is the same colour on every theme.
- Amounts are shown in pesos with an approximate conversion, and the sheet states that the card is charged in the donor's own currency.

### 3.5 Know what is not being promised

> As a donor, I want the limits stated before I pay rather than discovered afterwards.

**Acceptance criteria**
- Before the donation completes, the page states that the platform never holds the money, that there is therefore no refund path, and that no tax relief is available in any market checked.
- The reporting commitment is shown before payment, with what will be reported and when.
- The confirmation repeats the reporting commitment.

### 3.6 See the tip rather than absorb it

> As a donor, I want to see what the platform takes, so I can decide about it.

**Acceptance criteria**
- The tip is adjustable, including to zero, and the resulting amount is shown in money as it changes.
- The sheet states that the organisation pays nothing and that the tip is the whole business model.
- No amount is deducted from the organisation's total under any setting.

---

## Epic 4: A donor arrives without a link

**Why this epic exists.** It follows the decision to keep the Matchmaker, which reverses the original product-surface decision. The constraint that came with it is criterion 4.1.

### 4.1 Filter without being ranked

> As a donor with no organisation in mind, I want to narrow the list on facts I chose, and I do not want to be told which one is best.

**Acceptance criteria**
- Filters are kind of work and amount still needed. Both are facts about the campaign.
- Ordering is by amount still needed, which is a consequence of the donor's own filter rather than a platform judgment.
- No campaign is featured, promoted, boosted or recommended.
- Only campaigns from organisations past the gate appear.
- The screen states that nothing is ranked or recommended by the platform.

---

## Use cases the prototype demonstrates end to end

| Case | Path | What it proves |
|---|---|---|
| Registered organisation behind on filings publishes under a reduced ceiling | Register with CN201612345, wait, approve, build, publish | The floor-and-cap model, which is the resolution of the project's hardest open question |
| Fully compliant organisation reaches the full ceiling | Register with CN202154321 | That accreditation and current filings are visible in money |
| Revoked registration is refused | Register with CN200987654 | That the gate holds against an organisation that once qualified |
| Unregistered group is refused with a route back | Register with an unknown number | That rejection is a designed path rather than a dead end |
| Work with no natural countable output gets units from its theme | Build on the preparedness theme | The theme library's central claim |
| Donor arrives with no link and funds a campaign | Discover, filter, campaign, give | The Matchmaker, and the reversal that let it in |

## Deliberately out of scope for phase 1

Each of these is a roadmap item rather than an omission, and each is named on the page or in the product where a user would otherwise expect it.

- Reporting back to donors. Committed at build time, not delivered.
- What happens to a live recurring donation when a green light lapses.
- Any market other than the Philippines. The country selector shows three others greyed out.
- Any surface built for an institutional funder.
- Refunds, in any circumstance, because the platform holds no funds.
