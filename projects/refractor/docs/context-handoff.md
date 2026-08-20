# Refractor: context handoff

> **Superseded, 20 August 2026.** This file records the concept as it stood after two spec stress-test rounds, and the reasoning that produced it. The product has since changed: it is now free to small brands, packaging only, scoped to five countries, and built around swap recommendations. The paid Tier 1 / Tier 2 model, the ISO 14067 positioning and the three-node formula scope below are all superseded. Current scope is in `scope.md`, current research in `grounding-research.md`. Kept as the record of how the concept moved.


Internal working note. Captures the state of the Refractor concept after two spec stress-test rounds and a follow-up discussion, so the next session can pick up without re-deriving anything. Not portfolio-facing.

Date: August 2026. Status: pre-research. `discovery-scope` has not been run yet.

---

## 1. What Refractor is

An AI-powered "Product Mirror" and material optimization engine for physical consumer products. Tagline: *Deconstruct your product. Refactor your impact.*

Ingests a product's BOM, packaging specs, SDS documents, and supplier invoices, then delivers two things:

1. Compliance readiness output (ISO 14067-aligned, positioned against EU Directive 2024/825 and retail buyer onboarding).
2. An interactive exploded "Product Mirror" that decomposes the product into three nodes and recommends the Top 3 material swaps, evaluated across four axes.

Launch anchor: indie skincare and cosmetics. Expansion horizon: craft beverage, specialty coffee, sustainable apparel, artisanal food.

---

## 2. Decisions locked (treat as given, not open questions)

### Design system first
The token layer is deliberately specified in depth before research. This is a stated standard for this project, since the design system is itself a portfolio deliverable. Rationale that makes it low-risk: the token layer (grid, type scale ratio, contrast floors, solid-surface rules) is largely problem-agnostic, so research rarely overturns it. Page architecture and evaluation axes stay looser, since those encode assumptions about user behavior.

Two-tier token inheritance:
- **Core (immutable):** 16-column fluid grid, 1.25 major-third type scale, WCAG AA 4.5:1 minimum, solid data-surface standard (#FFFFFF / #0F172A).
- **Vertical overrides:** surface texture, display/data typefaces, accent palette per vertical (Cosmetics glassmorphism, Beverage Swiss minimalist, Apparel neo-brutalism, Food wabi-sabi).

**Open fix from stress test:** Emerald (#10B981 win) and Amber (#F59E0B hotspot) are semantic status colors currently nested under the Cosmetics override token. They should move to Core and split into two token classes: Semantic/Status (invariant across verticals) and Brand Accent (vertical-specific). Beverage's override currently has no win/warning equivalent, so status meaning would not carry across verticals as written.

### Glassmorphism boundary rule
Glass, translucency, and 12px backdrop blur are confined to top-level structural chrome (nav, hero header, outer wrapper frames). All data tables, carbon readouts, monospaced text, and status tags sit on 100% opaque cards. This was the resolution to the CAD-density vs. glassmorphism contrast conflict, and it is technically sound because opaque surfaces remove the background-dependent contrast problem entirely.

### Tier 1 = the Mirror. Tier 2 = the Passport.
This naming is deliberate. Neither tier is described as a degraded version of the other.

**Tier 1 (free or near-free, ~zero marginal cost, fully automated):**
- Page 1: document parsing into universal schema, confidence-scored extraction, manual-entry prompts for redacted/low-confidence fields, saved reusable structured product record.
- Page 2: exploded three-node view, per-node CO2e with uncertainty bands, hotspot ranking, Top 3 swaps per hotspot across four axes, switching-cost indicator per swap.
- Page 3: Verification Readiness Report (completeness score, itemized gaps, what a verifier will require), internal-use footprint summary marked not-for-submission, Tier 2 quote generated against actual gaps found.
- Supplier bridge sits in Tier 1 (costs nothing given the no-kickback stance, makes swaps actionable, deepens workflow before the upgrade prompt).

**Tier 2 (€200 to €300, human in the loop):**
- The submittable ISO 14067-aligned Passport document.
- Expert review and attestation (~15 minutes of expert time).
- Anything formatted to be forwarded to a retail buyer.

**Critical design constraint:** Tier 1 output must not look submittable. If the free tier emits something resembling a certificate, brands will forward it to buyers anyway and the anti-greenwashing position collapses. The tiers are structurally different formats (working dashboard vs. submittable document), rather than the same document with a stamp added.

**Unit economics insight:** Tier 1's third job, beyond user value and conversion, is compressing Tier 2's expert minutes. Better parsing and a better gap report means shorter human review means better Tier 2 margin. Tier 1 quality is a direct margin lever. Tier 2 is services margin rather than software margin, and the case study should state that rather than presenting one blended model.

### Swap friction gradient (maps onto the three-node schema)
Swap friction increases as you move inward:
- **Node 3 (outer packaging, freight):** near-zero regulatory friction, no safety documentation touched.
- **Node 2 (primary container):** touches the formula, so it plausibly triggers compatibility and stability testing plus a PIF update.
- **Node 1 (formula):** full CPSR reassessment.

Consequence: lead the hero demo on Node 3 and Node 2 swaps, and add a switching-cost line to the ROI axis. "This swap saves €0.04/unit and requires no new safety documentation" is more useful to an indie founder than a raw CO2e delta. Needs verification, and it shapes the hero interaction, so research it early.

### Scope boundary
Cradle-to-gate plus primary distribution logistics. Consumer use-phase explicitly excluded. This matters most for apparel, where use-phase (washing, drying) is a large share of lifecycle footprint, so the exclusion must be named rather than implied.

### Portfolio scope
Anchor the case study on cosmetics only. The token inheritance diagram already demonstrates scalable systems thinking without building four verticals. The other three become a documented expansion thesis with named seams.

### Trust architecture
Zero affiliate kickbacks or sponsored vendor bias. This deliberately forecloses the obvious marketplace revenue line on Page 3. Defensible given the anti-greenwashing positioning, and it should be stated in the brief as a chosen tradeoff rather than left as an unaddressed tension.

---

## 3. Positions corrected during discussion

**Data possession: earlier concern was over-weighted.** The worry was that contract manufacturers hold formulations as trade secret, leaving the indie founder unable to supply Node 1. Correction: if the brand owner is the Responsible Person placing the product on the EU market, they are legally required to hold a Product Information File with full quantitative composition plus a Cosmetic Product Safety Report. The data has to exist and has to be theirs to access. Needs verification against Regulation 1223/2009, but the concern does not stand as originally framed.

The question it becomes: **what shape is that data in?** PIF/CPSR content typically lives in PDFs prepared by a safety assessor, and many small brands use an RP-as-a-service firm holding the file on their behalf. Intake may be parsing a toxicologist's safety report rather than a tidy BOM spreadsheet.

**The likelier real gap is packaging data, not formula data.** Component weights, resin types, recycled content percentages, and closure materials tend to be scattered across supplier emails or absent entirely, and that is exactly what Nodes 2 and 3 need. Research packaging data availability separately from formulation data.

**Swap ambition: minimum viable swap is the right bar.** Not everything needs to be swappable. Demonstrating the mechanism on two or three components proves the concept without fabricating anything. The retest-cost issue is better used as product structure (the friction gradient above) than as an objection.

---

## 4. Resolved across the two stress-test rounds

Round 1 flagged, round 2 fixed:
- Compliance claim honestly downgraded from "Day 1 stamped compliance" to draft/pre-audit.
- SDS scoped to hazard classification only, no longer implied to supply composition.
- Mass-balance check validates against invoice-supplied batch weight.
- Unquantified INCI lists and sub-85%-confidence extractions get a "Manual Quantity Required" flag instead of silently passing.
- CO2e presented as uncertainty ranges rather than point estimates.
- MOQ tiers added to the ROI axis.
- Lead-time and qualification risk added as a fourth axis.
- Durability grounded in ASTM D5276, WVTR/OTR, UV ratings rather than qualitative "premium hand-feel."
- Node 2 relabeled per vertical (Apparel: Construction, Trims & Hardware).
- Cradle-to-gate scope boundary stated explicitly.

---

## 5. Still open

**Spec-level gaps not yet addressed:**
- Semantic color tokens sit at the wrong tier (see Design system above).
- No source named for WVTR/OTR/drop-test data. Emission-factor databases (ecoinvent, DEFRA, Agribalyse) cover carbon, not material physical properties. Likely honest MVP answer: user-supplied spec sheet, same escalation path as Page 1.
- Cross-document conflict handling is undefined. If the BOM and the packaging spec disagree on a component weight, the pipeline extracts each independently with no stated resolution.
- The 85% confidence threshold is asserted rather than derived. Fine as a stated design lever, worth acknowledging as uncalibrated.
- "Triple-bottom-line" language survives in places where the spec now lists four axes. Global find-and-replace needed.
- The exploded-CAD metaphor may not work for apparel, where fiber to construction to packaging is a processing sequence rather than three separable objects. A layered or sectioned view may be needed for that vertical. Design question, not a schema problem.

**Research questions for `discovery-scope` and `grounding-research`:**
1. Packaging data availability for indie brands (formula availability is close to settled by the RP obligation, subject to verification).
2. The swap friction gradient, since it determines which node the hero demo leads on.
3. Differentiation against the existing carbon-accounting field (Makersite, Greenly, Carbonfact, Sphera, plus an industry consortium working on shared cosmetics scoring methodology). Per `grounding-research`'s own rule, the question is what the closest analog *does not* do. Plausible wedge: most measure and report, Refractor recommends and prices alternatives. Verify rather than assume.
4. Tier 2 pricing validation. Two parts: the consultant-cost baseline (hypothesis: €2,000 to €4,000 for equivalent work), and **substitutability**, which is the sharper question. Does a retail buyer accept a 15-minute expert attestation where they would accept a consultant's output? If certain retailers require accredited third-party verification against a named standard, Tier 2 is preparation for that rather than a replacement, which changes the pricing ceiling.
5. Whether compliance and optimization are one product or two. Compliance is a deadline-driven grudge purchase, optimization is discretionary. Different buying triggers, possibly different buyers.
6. Verification of EU Directive 2024/825 scope and timing, Regulation 1223/2009 PIF/CPSR obligations, and whether packaging changes trigger compatibility/stability retesting.

Monetization is a stated design decision that research validates, rather than an open question research discovers.

---

## 6. Next step

Run `discovery-scope` for `projects/refractor/`, writing the Tier 1 / Tier 2 model and design-system-first sequencing in as decisions, and the six items above as research questions. Then `grounding-research`, then `research-auditor` on the draft before presenting it.
