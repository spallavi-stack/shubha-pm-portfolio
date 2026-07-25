# SunnySideUp — Design System (internal reference)

Not a portfolio-facing document. Written to capture what actually exists today across SunnySideUp's own pages, since no such reference existed anywhere in the repo before this. Kept as markdown only, the same convention `scope.md` and `grounding-research.md` already use for internal-only material.

SunnySideUp isn't one design system. It's two: the portfolio-facing pages (the case-study page and its rendered docs), and the product prototype itself. They were built independently and don't currently share a palette.

## 1. Case-study page and rendered docs

Used by `projects/sunnysideup/index.html` and everything under `projects/sunnysideup/docs/*.html` (via `scripts/build_docs.py`'s `sunnysideup` entry). Shares its CSS variable names and structure with Flexy's equivalent pages, reskinned with its own hex values.

**Palette**

| Token | Value | Use |
|---|---|---|
| `--teal` | `#D4890B` | Primary accent (amber, not actually teal-colored despite the variable name inherited from the shared template) |
| `--teal-dark` | `#A8690A` | Hover/emphasis state of the accent |
| `--navy` | `#3A2A0E` | Hero gradient anchor, dark text |
| `--gold` | `#F5B942` | Secondary accent |
| `--peach` | `#FFE9B8` | Tint/highlight |
| `--ink` | `#2B2118` | Body text |
| `--ink-soft` | `#6B5A45` | Secondary text |
| `--paper` | `#FFFFFF` | Page background |
| `--paper-soft` | `#FFF8EC` | Alternating section background |
| `--border` | `#F0E4D0` | Hairlines, card borders |
| `--now` / `--next` / `--later` | `#A8690A` / `#D4890B` / `#B8A483` | Roadmap horizon tags |

**Typography:** system font stack only (`-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`), no custom webfonts. Heading rhythm: 42px hero title, 26px section title, 20px `h2` with a 2px teal underline (docs template), 16px `h3`, 15px body.

**Layout:** shared structural components with Flexy's case-study page: sticky nav, gradient hero, collapsible `details.section-collapse` sections, `.tldr-card` grid, `.persona-grid`, `.roadmap-cols` (Now/Next/Later), embedded prototype frame, `.limitation-grid`, `.doc-links` grid. The docs template (`build_docs.py`) is a narrower, simpler 760px-column skin using the same color dict, not a copy of the case-study page's own CSS.

## 2. The product prototype

Used by `projects/sunnysideup/prototype.html` only. This is the only design system in the whole repo with an actual documented token scale, commented in the file itself as "the frozen SunnySideUp design system."

**Palette**

| Token | Value | Use |
|---|---|---|
| `--color-cream` | `#FFF8E9` | Page surface |
| `--color-cream-alt` | `#FFFDF6` | Card surface |
| `--color-ink` | `#1C1B18` | Text, borders |
| `--color-sun-yellow` | `#F5B942` | Primary accent |
| `--color-sun-yellow-dark` | `#D4890B` | Accent emphasis |
| `--color-sun-yellow-tint` | `#FFE9B8` | Accent tint |
| `--color-sky-blue` | `#4F9DDE` | Secondary accent |
| `--color-coral` | `#FF6B54` | Tertiary accent |
| `--color-good` / `--color-mid` / `--color-poor` | `#3FAE5C` / `#F5B942` / `#E5473A` | Green/amber/red viability result states, each with a `-dark` and `-tint` variant |

**Typography:** a genuine three-face system, unlike anything else in the repo. `Space Grotesk` (display/headings), `Inter` (body), `Space Mono` (data/monospace, used for postcode input and stat values). Type scale: `--text-xs` 12px through `--text-5xl` 48px, six steps.

**Spacing and shape:** a documented 5-step spacing scale (`--space-1` 4px through `--space-16` 64px), a 5-step radius scale (`--radius-sm` 8px through `--radius-pill` 999px), and a neo-brutalist surface language: 2 to 4px solid ink borders (`--border-thin/thick/heavy`) plus hard, un-blurred offset shadows (`--shadow-sm` `3px 3px 0`, up to `--shadow-lg` `8px 8px 0`), rather than the soft drop shadows used everywhere else in the portfolio.

## The inconsistency worth knowing about

The case-study page and docs (amber `#D4890B` / brown `#3A2A0E`) and the actual prototype (cream `#FFF8E9` / sun-yellow `#F5B942` / sky-blue `#4F9DDE` / coral `#FF6B54`) were built independently and don't share a palette. They're close in one place (both use `#D4890B` and `#F5B942` as accents) but the case-study page's palette doesn't actually reflect the product's real sky-blue and coral accents, or its neo-brutalist border/shadow language, or its three-typeface system.

Nothing forces these to match. Worth a deliberate decision if this ever gets revisited: either pull the case-study page's palette and type choices directly from the prototype's frozen tokens so the portfolio page reads as the same product it's demonstrating, or keep them intentionally separate (portfolio chrome vs. product skin) and say so explicitly somewhere, rather than leaving the resemblance accidental.

## Status

First-pass reference, written by auditing the actual CSS in `index.html`, `docs/*.html` (via `build_docs.py`), and `prototype.html` directly rather than from memory or an existing spec, since none existed. Not linked from any public-facing page.
