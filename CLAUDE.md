# Shubha's PM Portfolio

A growing collection of fictional, deeply-researched 0-to-1 product case studies (Flexy, SunnySideUp, and more to come), built to demonstrate PM process: research, personas, roadmapping, prototyping, and honest documentation of what's proven versus assumed. Static HTML site, served via GitHub Pages at https://spallavi-stack.github.io/shubha-pm-portfolio/.

This repo used to be split across multiple repos (one per case study, e.g. `spallavi-stack/flexy`). It has been consolidated into this single repo so every case study lives together under `projects/`.

## Target structure for every project

Each case study gets its own folder under `projects/<name>/`. The convention (in progress — see "Migration status" below):

```
projects/<name>/
├── index.html       # the case study page — this exact filename, so projects/<name>/ resolves directly
├── prototype.html   # the clickable/coded prototype demo
├── README.md        # what's in this project folder
├── assets/          # images, screenshots — reserved even if empty
└── docs/            # supporting docs, paired source + rendered output
    ├── product-brief.md / .html
    ├── personas.md / .html
    ├── synthetic-interviews.md / .html
    ├── jobs-to-be-done.md / .html
    ├── roadmap.md / .html
    ├── user-stories.md / .html
    ├── technical-feasibility.md / .html
    ├── real-data-integration-guide.md / .html   (or equivalent per project)
    ├── account-connection-guide.md / .html      (or equivalent per project)
    └── ai-collaboration-review.md / .html
```

Rationale: `index.html` + `prototype.html` at a fixed relative path per project means the portfolio hub (`index.html`) and any future tooling can follow one convention instead of per-project custom filenames. Grouping supporting docs into `docs/` keeps the project root scannable (a handful of files) instead of 20+ flat files at the same level. `.md` source and rendered `.html` stay paired together rather than split into separate source/output trees — simplest to maintain for a single-author static site.

## Shared build script

Markdown docs are rendered to styled HTML via a shared, parameterized script (not yet built — currently `projects/flexy/build_docs.py` is a Flexy-only copy, see migration status). The target is one script — likely `scripts/build_docs.py` at the repo root — that takes a project slug and renders that project's `docs/*.md` into `docs/*.html` using that project's theme colors/title. Avoids copy-pasting the same markdown→HTML rendering logic into every new project folder.

## Migration status

- **Flexy**: fully migrated to the `index.html` / `prototype.html` / `docs/` / `assets/` convention above (July 2026).
- **SunnySideUp**: in progress. `scope.md`, `grounding-research.md`, and `research-audit.md` exist under `projects/sunnysideup/docs/`; product brief, personas, and everything else in the "out of scope for this pass" list in `scope.md` haven't started yet.
- The shared, parameterized build script lives at `scripts/build_docs.py` (repo root). It currently only has a `flexy` entry in its `PROJECTS` dict — add a `sunnysideup` (or other) entry there when that project's docs are ready to render, rather than copying the script into the project folder.

## Research process (use for every new project)

Three skills in `.claude/skills/` exist to fix three recurring problems with AI-assisted PM research: incomplete coverage, padding with unrequested content, and claims that can't be trusted without independent verification. Run them in sequence for any new case study:

1. **`discovery-scope`** — before any drafting, produces a project-specific checklist of what's needed and what's explicitly out of scope. Saves to `projects/<slug>/docs/scope.md`.
2. **`grounding-research`** — produces sourced market/regulatory/technical research where every claim is tagged **Fact** (cited), **Inference** (reasoned, shown), or **Assumption** (flagged, unverified). Always checks what the closest competitive analog *doesn't* do, not just whether it exists, and always looks beyond historical adoption for market sizing (comparable-market analogs, addressable-population size, forward-looking targets). Saves to `projects/<slug>/docs/grounding-research.md`.
3. **`research-auditor`** — a review pass on any drafted doc, run on your own draft before presenting it, not only when the user asks. Checks three things: unlabeled or unsourced claims (findings-only, the user decides the fix), sections that don't actually connect to the rest of the document or its research (fixed directly), and padding or hedging sentences that don't add information (fixed directly).

`discovery-scope` and `grounding-research` are adapted from [deanpeters/Product-Manager-Skills](https://github.com/deanpeters/Product-Manager-Skills) (CC BY-NC-SA 4.0). `research-auditor`'s Fact/Inference/Assumption discipline is adapted from the confidence-and-methodology principle in [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills)' `research-ops-orchestrator` (not its full multi-lane enterprise routing system). Full attribution is in each skill's `SKILL.md`.

First real run (SunnySideUp, July 2026) caught a genuine gap: the initial `grounding-research.md` never researched UK leasehold/tenancy consent law even though `scope.md` named it as a defining constraint — `research-auditor` caught it, a follow-up pass fixed it. That loop working as intended is itself evidence the process is worth keeping.

That same first run also needed a lot of manual back-and-forth to reach a good product brief: missing market-sizing angles, a competitive-differentiation insight, a Hypothesis disconnected from the rest of the document, and padding sentences all had to be caught by the user one at a time rather than by the process itself. `grounding-research` and `research-auditor` were both extended (see their `SKILL.md` files) specifically to catch these categories automatically next time, so this shouldn't require the same amount of manual intervention on future briefs.

**`grounding-research.md` is permanent backing material, not scratch.** It stays `.md`-only — never rendered to HTML, never linked from the public site — because it's internal reading material, not a portfolio-facing artifact. The product brief (and any other doc that draws on it) is a compressed, scannable summary of it, not a replacement for it. Once a project's product brief is drafted, don't delete, shrink, or fold `grounding-research.md` away — every claim-bearing section of the brief should cite back to it for full sourcing and confidence level, so the depth stays reachable instead of being silently lost to compression.

**Known environment limitation: direct primary-source fetching may be blocked.** During SunnySideUp's research (July 2026), `WebFetch`/direct HTTPS access to external sites (gov.uk, Ofgem, HMRC, MCS, ENA, Which?, and even a neutral test domain and GitHub Pages) returned 403s from this session's network proxy. Diagnosed via `curl -sS http://127.0.0.1:39545/__agentproxy/status` (see `/root/.ccr/README.md`): the proxy logged `connect_rejected` / "gateway answered 403 to CONNECT (policy denial or upstream failure)" for all of them, including `example.com` — a domain with no reason to be specifically blocked — which means this is a broad session-level network egress policy, not a targeted block on "sensitive" government sites. `WebSearch` (search snippets, not full page reads) still works and is what all the grounding research above actually relies on. This is a real gap versus reading primary sources directly, not a design choice — if you hit the same thing in a future session, don't spend time trying to route around it (the proxy's own docs say not to); check whether the environment's network policy can be set to something broader than whatever "Default" currently resolves to, since `list_environments` showed only one environment on this account, labeled "trusted network access," despite this behavior.

## Product brief template

Frozen at `templates/product-brief-template.md` — every project's `docs/product-brief.md` should follow this structure. Don't redesign it per project; that defeats the point of freezing it. Structured around Cagan's Opportunity Assessment (built for evaluating a *new* opportunity, not spec'ing a feature on an existing product) plus Amazon's PR/FAQ one-line-pitch discipline and a dedicated "Success metrics & validation methodology" section — the part most AI-drafted briefs skip, and the reason this template exists. Full provenance/reasoning for every section, including why `opportunity-solution-tree` was deliberately left out (built for continuous discovery on an existing product with real usage data, not 0-to-1), is in the template file itself.

## Writing style — every potentially public-facing document

Applies to product briefs, case studies, personas, and anything else meant to be read by someone outside this repo (not internal working docs like `grounding-research.md`, though there's no harm in following it there too):

- **No em-dashes.** Use a period, comma, or restructure the sentence instead.
- **No "it's not X, it's Y" contrastive framing**, or its variants: "X, not Y," "not just X, but Y," and similar. This pattern was everywhere in the original SunnySideUp docs (written before this rule existed); don't propagate it into new writing.
- **No sentences that are grammatically polished but say very little.** Write with actual substance. A plainer sentence that states something specific beats a smoother one that doesn't.
- **Don't lead with what's missing.** Instead of "no single authoritative figure sizes it," open with the positive framing: "while no single figure captures X, [here's what we do have]." State absence briefly if it matters, then move straight to the substance, rather than dwelling on it.

This rule was set explicitly because the docs written so far violate it constantly. Check new writing against it deliberately rather than assuming default style is fine.

## Other notes

- `spallavi-stack/flexy` (the old standalone Flexy repo) has been superseded by `projects/flexy/` here and is being deprecated/deleted. Do not treat it as a source of truth going forward.
- Every case study runs on an invented company/product. Market research is real and cited; personas, interviews, and user data are synthetic — keep that distinction clear in any new project's docs.
