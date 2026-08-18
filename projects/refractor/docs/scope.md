# Refractor — Discovery Scope

Written after two spec stress-test rounds and a follow-up discussion, so it starts from a product concept that already has locked decisions rather than a blank page. Those decisions are recorded in `context-handoff.md` and restated here only where they change what research has to establish. Research validates them; it does not reopen them.

## Project basics

- **Problem area:** Indie consumer-product brands face two converging pressures. EU Directive 2024/825 tightens what an environmental claim has to be backed by, and retail buyers increasingly ask for carbon documentation as part of onboarding. A small brand has neither an in-house LCA function nor the budget for a consultancy engagement. Refractor ingests the documents such a brand already holds (BOM, packaging specs, SDS, supplier invoices), produces a compliance-readiness position against ISO 14067, and decomposes the product into three nodes with ranked material swaps.
- **Target user:** The owner or operator of an indie skincare/cosmetics brand who is the Responsible Person placing the product on the EU market. Two plausible buying triggers sit behind that one job title, and separating them is research question 5 below: a compliance buyer facing a retailer deadline, and an optimization buyer choosing to reduce impact. The first is a grudge purchase on a clock, the second is discretionary.
- **Status:** New project, pre-research. Concept spec exists and has been stress-tested twice; no research has been run.
- **Known constraints:**
  - EU cosmetics regulation, carbon accounting standards, and packaging material science all sit outside personal domain experience. Grounding research goes deep on all three and nothing in this area is pre-trusted.
  - The product's core value is a calculation (per-node CO2e plus a ranked swap recommendation across four axes), so the runtime inputs behind it are a first-class research target rather than something to specify later. See "Calculation inputs" below.
  - Cosmetics only for the case study. The other three verticals stay a documented expansion thesis.

## Locked decisions carried in

Restated compactly. Full reasoning is in `context-handoff.md` §2.

1. **Tier 1 is the Mirror, Tier 2 is the Passport.** Tier 1 is automated, near-zero marginal cost, and deliberately not submittable. Tier 2 is a €200 to €300 human-attested document. Tier 1's quality is a direct margin lever on Tier 2, since better parsing means fewer expert minutes.
2. **Design system first.** The token layer is specified before research, because it is largely problem-agnostic and is itself a portfolio deliverable.
3. **Cradle-to-gate plus primary distribution logistics.** Consumer use phase excluded and named as excluded.
4. **Zero affiliate kickbacks or sponsored vendor placement.** This forecloses the obvious marketplace revenue line and is stated in the brief as a chosen tradeoff.
5. **Glassmorphism confined to structural chrome.** Every data surface is 100% opaque.

Monetization is therefore a design decision that research pressure-tests, rather than an open question research discovers. The one genuinely open commercial variable is Tier 2's price ceiling, which depends on substitutability (research question 4).

## In scope for this pass

- **Problem statement** — establishes what a small brand is actually up against: which claims Directive 2024/825 catches, what a retail buyer asks for at onboarding, and what the alternatives cost today. Must be specific enough that the compliance deadline and the optimization impulse are visibly different problems, since the brief later has to say whether they are one product or two.
- **Grounding research — regulatory** — Regulation 1223/2009's PIF and CPSR obligations and what quantitative composition the Responsible Person is required to hold; Directive 2024/825's scope, substantive requirements, and timing; ISO 14067's actual requirements for a product carbon footprint and what level of verification a third party expects. Also whether a packaging change triggers compatibility or stability retesting and a PIF update, since the whole swap friction gradient rests on that.
- **Grounding research — data availability** — the single most load-bearing input research question, and split in two because the two halves have different answers. Formula-side availability is close to settled by the Responsible Person obligation and needs verification rather than discovery, plus a read on what shape the data is in (a toxicologist's PDF, an RP-as-a-service firm holding the file). Packaging-side availability is the likely real gap: component weights, resin identification, recycled content percentages, and closure materials, which are exactly what Nodes 2 and 3 need.
- **Grounding research — competitive** — Makersite, Greenly, Carbonfact, Sphera, and any industry consortium work on shared cosmetics scoring methodology. Per `grounding-research`'s own rule the question is what the closest analog does **not** do. The working wedge is that the field measures and reports where Refractor recommends and prices alternatives. That is a hypothesis to verify, not a finding.
- **Grounding research — pricing and substitutability** — the consultant-cost baseline (working hypothesis €2,000 to €4,000 for equivalent work) and, more sharply, whether a retail buyer accepts a 15-minute expert attestation where they would accept a consultant's output. If named retailers require accredited third-party verification against a standard, Tier 2 is preparation for that rather than a substitute, which moves the price ceiling.
- **Calculation inputs** — a written inventory of every runtime input the three-node CO2e figure and the four-axis swap ranking need, and where each one plausibly comes from. Emission-factor databases (ecoinvent, DEFRA, Agribalyse) cover carbon and do not cover material physical properties, so the barrier, durability, and drop-test axes need a separately named source or an honest user-supplied escalation path. Also covers the two undefined pipeline behaviours: cross-document conflict resolution when the BOM and the packaging spec disagree on a component weight, and whether the 85% confidence threshold stays an asserted design lever or gets derived.
- **Swap friction gradient verification** — whether swap difficulty really does increase from Node 3 to Node 1, and what specifically each step triggers. This determines which node the hero demo leads on, so it shapes the product surface rather than sitting in the appendix.
- **Personas** — at minimum the compliance-triggered buyer and the optimization-motivated buyer, kept separate until research says whether they are one person under two conditions or two segments. Grounded in the research above rather than drafted alongside it.
- **Design system spec** — the two-tier token inheritance model written up as a document, since design-system-first is a locked decision and the spec currently exists only in conversation. Carries one known correction to apply on the way in: Emerald and Amber are semantic status colors sitting under the Cosmetics vertical override, and they belong in Core, split into a Semantic/Status class that is invariant across verticals and a Brand Accent class that is not.
- **Limitations section** — the scope boundary (cradle-to-gate, use phase excluded, which matters most for the apparel expansion thesis), CO2e presented as uncertainty ranges rather than point estimates, and Tier 1's draft/pre-audit status stated plainly rather than implied.

## Riskiest-assumption log

1. An indie brand can actually retrieve its own PIF and CPSR content in usable form and within a useful timeframe, even where an RP-as-a-service firm holds the file.
2. Packaging data exists somewhere retrievable at all. If component weights and resin types are genuinely absent rather than merely scattered, Nodes 2 and 3 depend on manual entry, which changes what Tier 1 can promise.
3. A retail buyer accepts a 15-minute expert attestation. If accredited third-party verification is required, Tier 2's positioning and price both move.
4. The free tier converts. A brand that gets a working dashboard, a gap list, and supplier contacts at no cost has been given real value with no forcing function beyond the buyer deadline.
5. Compliance and optimization are one product. If the deadline-driven buyer never engages with swap recommendations, half the product is serving a different customer.
6. Recommending swaps without kickbacks stays commercially viable once the marketplace line is foreclosed.

## Out of scope for this pass

- **No roadmap, user stories, synthetic interviews, or technical feasibility doc yet.** These come after the product brief and personas.
- **No prototype.** The exploded Product Mirror is the eventual centrepiece, and building it before the swap friction gradient is verified risks demoing the wrong node.
- **No expansion into beverage, coffee, apparel, or food.** Documented as an expansion thesis with named seams, not researched. The unresolved question of whether an exploded-CAD metaphor survives contact with apparel, where fiber to construction to packaging is a processing sequence rather than three separable objects, is logged and deferred with it.
- **No supplier database or vendor sourcing work.** The supplier bridge is a stated Tier 1 feature; populating it is a build concern.
- **No use-phase or end-of-life modelling**, per the locked scope boundary.
- **No paid proprietary LCA or market-intelligence databases.** Research works from public regulation, standards documentation, published emission-factor databases, and vendor material.
