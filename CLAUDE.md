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
- **SunnySideUp**: not started (research only so far, per the hub page). When it starts, follow the structure above from day one.
- The shared, parameterized build script lives at `scripts/build_docs.py` (repo root). It currently only has a `flexy` entry in its `PROJECTS` dict — add a `sunnysideup` (or other) entry there when that project's docs are ready to render, rather than copying the script into the project folder.

## Other notes

- `spallavi-stack/flexy` (the old standalone Flexy repo) has been superseded by `projects/flexy/` here and is being deprecated/deleted. Do not treat it as a source of truth going forward.
- Every case study runs on an invented company/product. Market research is real and cited; personas, interviews, and user data are synthetic — keep that distinction clear in any new project's docs.
