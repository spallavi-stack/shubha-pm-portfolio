# Refractor: Discovery Scope

Rewritten 20 August 2026. An earlier version of this file described a paid two-tier product built around ISO 14067 compliance readiness. Research commissioned by that version contradicted its own problem statement, and the concept changed in response. `context-handoff.md` holds the superseded model and the reasoning that produced it.

## What Refractor is now

A brand tells Refractor what it is putting on shelf and what that product is packaged in. Refractor recommends packaging material substitutions that cut carbon without changing unit cost, tooling or timeline, then connects the brand to suppliers who can make the substitution.

The formula is out of scope. Small brands are not charged.

## Project basics

- **Problem area.** Packaging is where a small cosmetics brand's carbon sits and where its regulatory costs land, and it is the part nobody helps them with. Existing carbon tools sell to companies with an ERP to integrate and a sustainability hire to run it. Packaging converters give design advice and recommend their own catalogue. Between those two there is a brand of eight people who would change their jar if someone told them which change was free.
- **Target user.** The founder or operator of an indie cosmetics brand, acting as the EU Responsible Person, buying packaging in batches from a small number of suppliers, with no compliance function and no sustainability budget.
- **Status.** Pre-brief. Grounding research covers the regulatory terrain, the eco-modulation finding, a first competitive read and the emission factor sources. Personas have not started.
- **Known constraints.** EU cosmetics regulation, national packaging law and material science all sit outside personal domain experience, so nothing in this area is pre-trusted. The product's core output is a calculation, so its runtime inputs are a first-class research target.

## Geographic scope: five countries

France, Italy, Germany, Spain and Poland. Together they hold 5,157 of Europe's 8,988 cosmetics manufacturing SMEs, which is 57% of the addressable base.

France leads on every dimension that matters here. It has 1,917 cosmetics SMEs, more than twice the next country, and it is the best-instrumented market for this product: ADEME publishes an open emission factor API, Citeo publishes eco-modulated packaging tariffs, and the Triman mark gives packaging changes a visible national consequence.

Three of the five require a national packaging mark and two do not, which is enough spread to show the fragmentation without documenting 27 variants of it.

The UK is excluded despite ranking second by company count. It runs a full parallel regulatory stack after Brexit, with its own Responsible Person, its own notification portal and its own packaging EPR. One extra market for a duplicate of every requirement is a poor trade this early.

## Decisions carried in

1. **No charge to small brands.** Monetization is deliberately open. Public or institutional funding is the stated candidate direction. Nothing is being sold through the supplier connection.
2. **No affiliate fees, commissions or paid placement.** This forecloses the obvious revenue line on the supplier screen and is a chosen tradeoff.
3. **Formula excluded.** Packaging only. This removes the hardest data to obtain and the swaps nobody can act on.
4. **Deltas, not footprints.** The product compares two materials. It does not produce an absolute product carbon footprint, which would need transport, manufacturing energy, allocation decisions and a defensible position on every gap.
5. **Design system first.** The token layer is specified before research because it is largely problem-agnostic and is itself a portfolio deliverable.

## In scope for this pass

- **Problem statement.** What a small brand is actually up against on packaging across the five countries, specific enough that the reader can see why generic sustainability advice fails.
- **Grounding research, regulatory.** Done. National packaging registers, fee schedules, labelling marks and language requirements across the five, plus PPWR's Declaration of Conformity and its 2030 recycled content threshold.
- **Grounding research, eco-modulation.** Quantify the fee saving a realistic indie volume would see in each of the five markets. This decides whether the commercial argument holds.
- **Grounding research, competitive.** Verify directly what the named carbon platforms and PPWR tooling do, and whether any recommends specific swaps to small brands. The current read is the weakest claim in the research.
- **Calculation inputs.** Done. DEFRA bundled as the core factor table, ADEME called live for glass and aluminium, with the production and end-of-life boundary trap documented.
- **The constraint model.** Six gates a swap must clear to reach the screen: tooling, formula contact, artwork, minimum order quantity, lead time, landed cost. Needs verification against real supplier catalogues.
- **Supplier data.** Whether a brand's incumbent supplier commonly offers a recycled-content version of the same component. The conversion argument rests entirely on this.
- **Personas.** Grounded in the research above, written after it lands.
- **Design system spec.** Two-tier token inheritance written up, carrying one correction: the semantic status colours currently sit under a vertical override and belong in the core layer.
- **Limitations.** DEFRA's three-year lag and UK basis, the comparison-not-footprint boundary, and the fact that Refractor cannot observe whether a recommended swap ever happened.

## Riskiest assumptions

1. A brand's incumbent packaging supplier offers recycled-content versions of the components it already sells them. Without this, every recommendation becomes a supplier switch.
2. The eco-modulated EPR saving is large enough at indie volumes to motivate action. A brand shipping three thousand units may see a number too small to care about.
3. Brands reorder packaging often enough for Refractor to be relevant more than once. The reorder point is the only moment a swap is close to free.
4. A founder will act on a recommendation that arrives without a compliance deadline attached.
5. Recycled-content substitutions clear production validation on existing tooling reliably enough to recommend them.

## Out of scope for this pass

- **No roadmap, user stories, synthetic interviews or technical feasibility doc yet.** These follow the brief and personas.
- **No prototype.** Building the mirror before the constraint model is verified risks demonstrating swaps nobody can make.
- **No expansion beyond cosmetics.** Beverage, coffee, apparel and food stay a documented expansion thesis.
- **No countries beyond the five.** The remaining 22 are a documented scaling question.
- **No supplier database build.** Curated for the demo. Populating it properly is a build concern.
- **No use-phase or end-of-life modelling.**
- **No paid LCA or market-intelligence databases.** Public regulation, standards, published emission factors and vendor material only.
