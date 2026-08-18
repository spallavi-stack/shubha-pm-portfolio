# Refractor — Grounding Research

Internal backing material. Not portfolio-facing, not rendered to HTML, not linked from the site. The product brief will compress this; this file stays as the full sourcing and confidence record.

Every claim is tagged **Fact** (cited to a real source), **Inference** (reasoned from stated facts, reasoning shown), or **Assumption** (unverified, flagged).

## Status of this pass

Partial. Covers one question asked directly: what documentation actually gates a retail listing for an indie cosmetics brand, and whether anything forces a human into the loop for a submittable carbon document. The remaining scope items (data availability, competitive landscape, pricing and substitutability, calculation inputs, swap friction gradient) are not covered yet.

Date: 18 August 2026.

---

## 1. What retailers actually ask for before listing a cosmetic product

**Fact.** A UK cosmetics regulatory consultancy lists six categories of documentation retail buyers request before approving a cosmetic listing ([GCRS, 24 June 2026](https://www.gcrs.co.uk/the-compliance-documentation-retail-buyers-expect-before-approving-cosmetic-listings/)):

1. **Product safety documentation.** Cosmetic Product Safety Reports (CPSR), safety assessments, toxicological evaluations, Product Information Files (PIF), safety declarations.
2. **Responsible Person information.** Confirmation that a legally appointed RP exists where required.
3. **Claims substantiation files.** Evidence for claims including "clinically proven," "dermatologist tested," "natural," "clean beauty," "hypoallergenic," "anti-ageing," and **"sustainable."** Retailers request clinical data, consumer studies, instrumental testing, technical evidence, and claims substantiation reports.
4. **Ingredient and formula documentation.** Full ingredient listings, INCI declarations, restricted substance confirmation, allergen information, supplier declarations, regulatory screening reports.
5. **Testing and stability records.** Stability, compatibility, preservative efficacy, microbiological, and challenge testing.
6. **Packaging and labelling compliance reviews.** Artwork and labelling issues are named as among the most common reasons products fail retailer compliance review.

**Fact.** Carbon footprint, product carbon footprint, ISO 14067, and lifecycle assessment appear nowhere in that list. The only environmental touchpoint is the word "sustainable" appearing as one claim type inside category 3.

**Inference.** A product carbon footprint is not a gate on retail listing for cosmetics today. It is one possible evidence item supporting one possible claim ("sustainable") inside one of six document categories. Reasoning: the source is a regulatory consultancy writing to sell retail-readiness services, so it has a commercial incentive to list every document a brand might need rather than to understate the burden. Carbon documentation being absent from a maximal list is stronger evidence than its being absent from a minimal one.

**Assumption.** Individual large retailers may impose carbon-reporting requirements beyond this general baseline through their own supplier programmes. Not verified. Worth checking directly against named retailer supplier portals, since a single major retailer mandating it would change the picture.

### Why this matters for the concept

**Inference.** Refractor's problem statement has been assuming carbon documentation is what stands between an indie brand and a shelf. The evidence says the gate is safety, claims substantiation, and labelling. A brand blocked from listing is far more likely to be blocked by a missing CPSR or non-compliant artwork than by an absent carbon figure. This does not kill the concept, and it does relocate it: Refractor addresses a discretionary claim-support need rather than a mandatory listing gate.

---

## 2. Does anything actually require a human to sign the carbon document?

The spec assumed Tier 2 needs expert attestation to be submittable. Three separate checks say no legal requirement forces this.

**Fact.** ISO 14067 supports but does not mandate third-party verification. A product carbon footprint can be calculated and reported without verification, with no requirement for site visits, mandatory external checking, or public registration. Where a critical review is performed, it follows ISO/TS 14071; verification of CFP studies is conducted under ISO 14064-3 ([LRQA](https://www.lrqa.com/en-us/iso-140672018-greenhouse-gases-carbon-footprint-of-products/), [SGS](https://www.sgs.com/en/services/iso-14067-verification-greenhouse-gases-carbon-footprint-of-products/), [Below280](https://below280.com/knowledge-base/life-cycle-assessment/iso-standards-life-cycle-assessment/iso-14067/)).

**Fact.** The proposed EU Green Claims Directive, which would have imposed ex-ante third-party verification on environmental claims, was withdrawn by the European Commission on 20 June 2025, days before final trilogue negotiations ([Latham & Watkins](https://www.lw.com/en/insights/european-commission-announces-intention-to-withdraw-eu-green-claims-directive-proposal), [Gorrissen Federspiel](https://gorrissenfederspiel.com/en/the-european-commission-withdraws-the-green-claims-directive-proposal/)).

**Fact.** Directive (EU) 2024/825 (Empowering Consumers for the Green Transition) applies from 27 September 2026, transposition deadline 27 March 2026. Its verification requirements are asymmetric ([EUR-Lex](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202400825)):
- **Future-performance claims** require commitments verified regularly by an independent third-party expert who is free from conflicts of interest, with findings made available to consumers.
- **Present-tense product-level environmental claims** carry no explicit third-party verification mandate. They must be substantiated and non-misleading under general unfair-practices standards.
- **Generic claims** ("eco-friendly") are prohibited unless the trader can demonstrate recognised excellent environmental performance, which in practice means an EU Ecolabel or an EN ISO 14024 scheme, both of which involve third-party certification.
- **Offset-based carbon-neutral claims** are prohibited outright. No verification process rescues them.

**Inference.** A present-tense, product-level statement of measured cradle-to-gate emissions is exactly the category with no verification mandate. So nothing in law stops an automated system from producing a submittable carbon figure, provided the claim is specific, present-tense, and not offset-based. The human in Tier 2 is not a legal requirement.

**Inference.** What the human actually supplies is threefold, and none of it is calculation:
1. **Liability transfer.** A named qualified person putting their name to a figure moves professional risk off the brand. Under Directive 2024/825 the trader carries exposure for a misleading claim, with penalties reaching 4% of annual turnover per the enforcement provisions summarised by [ISS Corporate](https://www.iss-corporate.com/resources/blog/what-the-empowering-consumers-for-the-green-transition-directive-means-for-environmental-claims/) and [ClimatePartner](https://www.climatepartner.com/en/knowledge/glossary/empowering-consumers-directive-empco). A signature is what a brand is buying.
2. **Judgment that resists automation.** Cut-off criteria, allocation method, whether a proxy emission factor is defensible for a specific material, and data-quality assessment are professional opinions rather than arithmetic.
3. **Market credibility.** A buyer's willingness to accept the document, which is a commercial fact rather than a legal one, and is exactly research question 4 (substitutability).

**This reframes the tier split.** The honest statement is that Tier 1 could technically emit a submittable-looking document and Refractor deliberately does not, because an unattested auto-generated figure is precisely the artifact the anti-greenwashing regime is built to catch. That is a stronger position than the current "Tier 1 cannot produce this," which the evidence does not support.

---

## 3. PPWR: a mandatory obligation that lands on Nodes 2 and 3

This was not in the concept and is the strongest regulatory finding in this pass.

**Fact.** Regulation (EU) 2025/40 (Packaging and Packaging Waste Regulation) entered into force 11 February 2025 and became generally applicable on **12 August 2026** ([Circularise](https://www.circularise.com/blogs/ppwr-guide-to-compliance-timelines-and-mass-balance-solutions), [Carbon Trust](https://www.carbontrust.com/news-and-insights/insights/ppwr-unpacked-what-the-eu-packaging-and-packaging-waste-regulation-means-for-business-and-how-to-prepare)).

**Fact.** From 12 August 2026, no packaging may be placed on the EU market without a valid EU Declaration of Conformity. Conformity assessment under Article 38 and Annex VII, supporting technical documentation, and the DoC under Article 39 are mandatory, with no transition or sell-through period for existing stock ([Coolset](https://www.coolset.com/academy/ppwr-declaration-of-conformity), [Tanso](https://www.tanso.de/en/blog/ppwr-declaration-of-conformity-and-technical-documentation-what-companies-must-submit-from-august-12-2026), [cubemos](https://cubemos.com/en/blog/ppwr-konformitaetserklaerung)).

**Fact.** Anyone placing packaged goods on the market under their own brand, and determining the packaging design, is the manufacturer for these purposes under Article 21 and must carry out the conformity assessment, prepare the technical documentation, and sign the DoC, assuming full legal responsibility for the information in it ([Coolset](https://www.coolset.com/academy/ppwr-declaration-of-conformity)). Technical documentation is retained 5 years for single-use packaging and 10 years for reusable.

**Fact.** The technical documentation behind the DoC requires material and resin composition types, recycled content percentages, empty-space measurements and ratios, heavy metal limits documentation, and evidence substantiating reusability claims ([Cosmeservice](https://cosmeservice.com/news/eu-ppwr-cosmetic-packaging-compliance/)).

**Fact.** Later obligations: design-for-recycling compliance and a 35% minimum post-consumer recycled content for plastic packaging from 1 January 2030, with packaging graded below E-level (under 70% recyclable) prohibited; harmonised EU labelling and waste symbols expected 2028 ([Cosmeservice](https://cosmeservice.com/news/eu-ppwr-cosmetic-packaging-compliance/), [Circularise](https://www.circularise.com/blogs/ppwr-guide-to-compliance-timelines-and-mass-balance-solutions)).

**Fact.** Micro-enterprise relief exists and is narrow. A business with fewer than 10 employees and turnover or balance sheet at or below €2 million is relieved of preparing technical documentation and the DoC **only where its packaging supplier is EU-based in the same member state**, in which case the supplier assumes those obligations. There is no relief from Extended Producer Responsibility ([Packaging Hub](https://packaginghub.fr/en/articles/ppwr-micro-enterprises), [Compliance Gate](https://www.compliancegate.com/ppwr-micro-enterprises/), [PPWR Obligations](https://ppwrobligations.com/guide/does-ppwr-apply-to-small-businesses/)).

**Inference.** PPWR demands precisely the dataset the concept already identified as the likely real gap: component weights, resin identification, and recycled content percentages for Nodes 2 and 3. A brand assembling a DoC has to obtain that data whether or not it cares about carbon. This is a mandatory, dated, penalty-backed obligation, where the product carbon footprint is discretionary.

**Inference.** The micro-enterprise carve-out does not neutralise this for the target segment. It requires an EU supplier in the same member state, and indie beauty packaging is commonly sourced from non-EU suppliers. Brands above 10 employees or €2M get no relief at all.

**Assumption.** The proportion of indie cosmetics brands sourcing packaging from non-EU suppliers is unverified. This determines how much of the segment the carve-out removes and should be quantified before PPWR is leaned on as the primary wedge.

**Inference.** The PPWR DoC is a **self-declaration signed by the brand owner**, with no third-party attestation required. This is an instructive precedent for the tier question: EU law here places a serious, penalty-backed obligation on a document the producer signs themselves. It weakens the argument that a carbon document specifically needs an outside expert to be legitimate, and it points at a Tier 2 that sells liability comfort and readiness rather than a legally mandated signature.

---

## 4. Established regulatory ground on the formula side

**Fact.** Regulation (EC) No 1223/2009 Article 11 requires the Responsible Person to keep a Product Information File for ten years after the last batch was placed on the market, containing: a description of the product; the Cosmetic Product Safety Report per Article 10(1); a description of the manufacturing method and a statement of GMP compliance per Article 8; proof of claimed effect where justified by the nature or effect of the product; and data on animal testing ([EUR-Lex, Regulation 1223/2009](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32009R1223)).

**Fact.** Article 10 requires a safety assessment before placing a product on the market. Annex I Part B requires the assessor to hold a university-level qualification in pharmacy, toxicology, medicine or a similar discipline, or a course recognised as equivalent by a member state ([EUR-Lex](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32009R1223)).

**Fact.** The PIF must be kept readily accessible at the Responsible Person's address and made available to competent authorities on request; the applicable GMP standard is EN ISO 22716:2007 ([Ecosistant](https://www.ecosistant.eu/en/the-responsible-person-role-under-the-cosmetics-regulation-1223-2009/), [Registrar Corp](https://www.registrarcorp.com/blog/cosmetics/cosmetic-regulations/eu-regulation-1223-2009-regulation-no-ec-1223-2009/)).

**Inference.** The handoff's correction holds. The RP is legally required to hold full quantitative composition, so formula data must exist and be accessible to the brand owner. Article 11 does not itself specify quantitative composition in those words; that requirement sits within the CPSR under Annex I Part A, which should be read directly before this is stated as settled in the brief.

**Assumption.** What shape the data is in remains unverified. The concept's expectation is a toxicologist's PDF rather than a structured BOM, frequently held by an RP-as-a-service firm. Untested.

---

## 5. What this pass changes

1. **Carbon is not the retail gate.** Six document categories gate a listing and none of them is carbon. Either the problem statement narrows honestly to claims support, or the product widens toward the dossier that actually gates listing.
2. **No law requires the human.** The tier split needs restating as a deliberate anti-greenwashing choice backed by liability transfer and professional judgment, rather than a technical or legal impossibility.
3. **PPWR is a live, mandatory, dated obligation on exactly the packaging data Nodes 2 and 3 need**, and it became applicable six days before this pass was written.
4. **The DoC precedent cuts at the Tier 2 premise.** EU law lets the producer self-sign a penalty-backed packaging conformity declaration. That makes external attestation look like a market-credibility product rather than a compliance necessity.

## 6. Open questions raised by this pass

- Do named large retailers impose carbon reporting through their own supplier programmes, beyond the general baseline?
- What share of indie cosmetics brands source packaging from non-EU suppliers, which determines the reach of the micro-enterprise carve-out?
- Does Annex I Part A of Regulation 1223/2009 require full quantitative composition in the CPSR, in those terms?
- Who currently prepares PPWR technical documentation and DoCs for small brands, and at what price? This is the direct competitive set if PPWR becomes the wedge.
- Does a retail buyer treat a PPWR DoC and a carbon footprint as related asks, or as unconnected items handled by different people?
