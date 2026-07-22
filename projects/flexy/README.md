# Flexy

Smart charge your EV using real dynamic prices.

A fictional, deeply-researched 0-to-1 product case study: a white-label companion app that a utility can hand to its own dynamic/time-of-use rate customers. It shows what electricity costs right now and automatically shifts EV charging into the cheapest hours. Piloted first on ComEd (Illinois).

**[View the live case study →](https://spallavi-stack.github.io/shubha-pm-portfolio/projects/flexy/index.html)**
**[Open the interactive prototype →](https://spallavi-stack.github.io/shubha-pm-portfolio/projects/flexy/prototype.html)**

This is one product in a larger portfolio of case studies - see the [full portfolio](https://spallavi-stack.github.io/shubha-pm-portfolio/index.html).

## What's in this folder

- `index.html` - the full case study page: problem & market, TAM/SAM/SOM, personas, research, ICE-prioritized roadmap, prototype, and limitations.
- `prototype.html` - a full coded phone-frame click-dummy of the MVP flow (onboarding, connecting a ComEd account, connecting an EV, setting charging preferences, live Price & Cost and Smart Charging dashboards).
- `next-steps.md` - living working list of prototype gaps and follow-ups; kept separate from the polished case study.
- `assets/` - images/screenshots (currently empty; the case study and prototype are self-contained inline SVG/CSS).
- `docs/` - supporting documentation, markdown source paired with rendered HTML:
  - `product-brief.md` / `.html` - product brief: one-liner, positioning, MVP scope, competitive analysis.
  - `personas.md` / `.html` - four personas grounded in real ComEd/Illinois program data.
  - `jobs-to-be-done.md` / `.html` - JTBD statements mapped to features.
  - `synthetic-interviews.md` / `.html` - AI-generated, clearly-labeled synthetic user interviews.
  - `roadmap.md` / `.html` - ICE-prioritized Now/Next/Later roadmap.
  - `user-stories.md` / `.html` - user stories & use cases.
  - `technical-feasibility.md` / `.html` - technical feasibility notes.
  - `real-data-integration-guide.md` / `.html` - the Price Integration Guide: what it would take to wire this up to real ComEd/Smartcar data.
  - `account-connection-guide.md` / `.html` - the Account Connection Guide: what a real Green Button Connect My Data (OAuth) integration with ComEd would require, including the API specification.
  - `ai-collaboration-review.md` / `.html` - a review of how AI was used in building this, and where it fell short.

Docs are rendered from markdown via the shared `../../scripts/build_docs.py` (run from the repo root).

## A note on what this is

Flexy is a fictional product built for a product management portfolio. Market research (ComEd's Real-Time Pricing program, the 2026 Time-of-Use filing, and named competitors like Tibber, Octopus, Ohme, Optiwatt, and WeaveGrid) is real and cited. Personas, interviews, and user quotes are synthetic - generated to be internally consistent with that research, not real people or real user data.

See the case study's Limitations section for an honest accounting of what a coded prototype like this does and doesn't prove.
