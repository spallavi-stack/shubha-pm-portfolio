# Shubha's PM Portfolio

A growing collection of fictional, deeply-researched 0-to-1 product case studies (Flexy, SunnySideUp, and more to come), built to demonstrate PM process: research, personas, roadmapping, prototyping, and honest documentation of what's proven versus assumed. Static HTML site, served via GitHub Pages at https://spallavi-stack.github.io/shubha-pm-portfolio/.

This repo used to be split across multiple repos (one per case study, e.g. `spallavi-stack/flexy`). It has been consolidated into this single repo so every case study lives together under `projects/`.

## Read only what the task needs

This file loads at the start of every session, so it is kept short on purpose. The heavy material lives in `docs/` and is read on demand. Find the task, read what it names, and stop.

| If the task is | Read |
|---|---|
| Working on a specific case study | `docs/project-status.md`, that project's entry only |
| Starting research on a new project, or reworking existing research | `docs/research-process.md`, then run `discovery-scope` |
| Writing or auditing a product brief | `templates/product-brief-template.md`, plus `docs/research-process.md` |
| Changing `index.html`, `contact.html`, or a case study page | `docs/portfolio-feedback.md` first, without fail |
| A fetch, PDF extraction, or source lookup that failed | `docs/environment-notes.md` |
| Rendering docs to HTML | `scripts/build_docs.py` and the build script note below |
| Video scripts | `docs/video-scripts.md` |

Everything below this line applies to every task and is deliberately kept brief.

## Target structure for every project

Each case study gets its own folder under `projects/<name>/`. The convention (migration still in progress, see `docs/project-status.md`):

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

Markdown docs are rendered to styled HTML via a shared, parameterized script (not yet built, currently `projects/flexy/build_docs.py` is a Flexy-only copy, see `docs/project-status.md`). The target is one script — likely `scripts/build_docs.py` at the repo root — that takes a project slug and renders that project's `docs/*.md` into `docs/*.html` using that project's theme colors/title. Avoids copy-pasting the same markdown→HTML rendering logic into every new project folder.

## Product brief template

Frozen at `templates/product-brief-template.md` — every project's `docs/product-brief.md` should follow this structure. Don't redesign it per project; that defeats the point of freezing it. Structured around Cagan's Opportunity Assessment (built for evaluating a *new* opportunity, not spec'ing a feature on an existing product) plus Amazon's PR/FAQ one-line-pitch discipline and a dedicated "Success metrics & validation methodology" section — the part most AI-drafted briefs skip, and the reason this template exists. Full provenance/reasoning for every section, including why `opportunity-solution-tree` was deliberately left out (built for continuous discovery on an existing product with real usage data, not 0-to-1), is in the template file itself.

## Writing style — every potentially public-facing document

Applies to product briefs, case studies, personas, and anything else meant to be read by someone outside this repo (not internal working docs like `grounding-research.md`, though there's no harm in following it there too):

- **No em-dashes.** Use a period, comma, or restructure the sentence instead.
- **No "it's not X, it's Y" contrastive framing**, or its variants: "X, not Y," "not just X, but Y," and similar. This pattern was everywhere in the original SunnySideUp docs (written before this rule existed); don't propagate it into new writing.
- **No sentences that are grammatically polished but say very little.** Write with actual substance. A plainer sentence that states something specific beats a smoother one that doesn't.
- **Don't lead with what's missing.** Instead of "no single authoritative figure sizes it," open with the positive framing: "while no single figure captures X, [here's what we do have]." State absence briefly if it matters, then move straight to the substance, rather than dwelling on it.
- **Don't cross-reference another portfolio project by name** (e.g. "sequenced next per Flexy's build-up order") unless it's specifically relevant and the user has asked for the comparison. Each case study's docs should stand alone. This leaked into SunnySideUp's first brief and had to be caught and removed.

This rule was set explicitly because the docs written so far violate it constantly. Check new writing against it deliberately rather than assuming default style is fine.

## Rules that always apply

### Conflicting statistics

When two different numbers turn up for the same fact, surface both with their sources and ask which is canonical. Never resolve it silently by picking the newer file, the better-cited one, or any other heuristic. Once decided, update every instance across the project, and across the portfolio if the fact appears in more than one project, so only one number is ever live. Full backstory and the skill-level fixes: `docs/research-process.md`.

### `grounding-research.md` is permanent

It stays `.md`-only, never rendered to HTML and never linked publicly. Once a product brief exists, do not delete, shrink, or fold the research away. The brief cites back to it. Full reasoning: `docs/research-process.md`.

### Git and pull requests

**Always ask before merging a pull request, every time — even after the user has approved a merge earlier in the same session.** Opening a PR and pushing commits to a feature branch don't need per-action confirmation, but merging into `main` does, no exceptions.

### Privacy boundary

This repository is public and served via GitHub Pages. The private job-search repo (`spallavi-stack/Hustle`) holds career, health and financial material. Nothing from there is ever copied into this repo, quoted in a commit message here, or linked from the public site.

## Other notes

- **Feedback on the portfolio site itself** (positioning, structure, what a visitor experiences, as distinct from any one case study's research) is logged in `docs/portfolio-feedback.md` at the repo root. **Read it before making changes to `index.html` or either case study's `index.html`** — it carries the open feedback items and the decisions already made about them, including a case-study restructure that is agreed but not yet built. Add new feedback there as a dated round rather than starting a new file, and append repeat mentions to the existing item so weight of evidence stays visible.
- `docs/video-scripts.md` holds drafted 90-second scripts for the case study intro videos (Flexy homeowner, Flexy utility, SunnySideUp). The videos are deferred to a later stage; the scripts are committed so the work isn't repeated.
- `spallavi-stack/flexy` (the old standalone Flexy repo) has been superseded by `projects/flexy/` here and is being deprecated/deleted. Do not treat it as a source of truth going forward.
- Every case study runs on an invented company/product. Market research is real and cited; personas, interviews, and user data are synthetic — keep that distinction clear in any new project's docs.
