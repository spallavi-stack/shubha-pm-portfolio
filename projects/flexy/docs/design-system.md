# Flexy — Design System

Documents the system actually implemented in `index.html` and `prototype.html` as of the "graphite + violet, utilitarian bento tiles" rework (PR #29). Supersedes an earlier draft of this file that was written from a color-only seed handoff before the real applied changes were visible — that draft invented several decisions (a kept Fraunces display face, 16px card radius, navy-tinted shadows, different price-tier hex values) that turned out not to match what was actually built. This version is corrected against the live files.

Distinct from the shared portfolio CSS (`assets/css/design-system.css`), which the hub and SunnySideUp's case-study page still use. Flexy deliberately doesn't.

## 1. Why this palette

From the rework commit's own rationale, worth keeping here rather than re-deriving: Flexy previously ran three conflicting palettes at once (green on the case-study page, orange in the prototype, orange again in generated docs), plus a mix of a serif display face, plain system fonts, and rounded/shadow-heavy cards. The violet/graphite system replaces all three with one, chosen specifically to read as clearly distinct from **both** ComEd's own brand blue and the cheap/moderate/expensive status colors used inside the prototype — so a user moving from "this is ComEd's screen" to "this is Flexy's screen" to "this is a price status" never confuses the three.

## 2. Brand tokens

| Token | Value | Use |
|---|---|---|
| `--teal` (aliased to `--accent`) | `#6D28D9` | Primary brand color — violet, despite the token name. Buttons, links, active states, brand mark. |
| `--teal-dark` (aliased to `--accent-dark`) | `#54219E` | Hover/emphasis state. |
| `--navy` | `#1E1A2E` | Dark graphite. Hero background, dark UI chrome. |
| `--gold` | `#B45309` | Secondary accent — muted amber, not literal gold. Roadmap "Next" tag, sparing highlight only. |
| `--peach` | `#C9BEE0` | Declared, currently unused in either file — a leftover from the palette-selection process, not wired into any component. Worth removing or deciding a use for for it in a future pass, rather than leaving a dead token. |

The token names (`--teal` for violet, `--gold` for amber) don't match their actual colors. This is a known, accepted quirk carried from the shared portfolio system, which has the identical mismatch (its own `--teal` token is amber). Not fixed here, to stay consistent with how the rest of the portfolio already handles it, but worth knowing if it ever causes real confusion during a future edit.

## 3. Neutrals

| Token | Value | Use |
|---|---|---|
| `--ink` | `#1C1A22` | Body text on light backgrounds. |
| `--ink-soft` | `#565061` | Secondary text on light backgrounds. |
| `--paper` | `#FFFFFF` | Page background, card fill. |
| `--paper-soft` | `#F6F4F9` | Alt-section background — violet-tinted, not pure grey. |
| `--border` | `#E4E0EC` | 1px hairlines, card borders — violet-tinted, load-bearing (see §6, borders replaced shadows as the primary card-separation device). |

**Text on `--navy`**: currently hardcoded as plain white (`#fff`) directly in the hero, not tokenized. Works fine as-is; a `--on-dark` token would be a small cleanup if this system gets touched again, not a defect worth stopping for now.

## 4. Typography

**Inter Variable throughout — no display serif.** `--font-display` is aliased directly to `--font-body` (both `'Inter Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`, sourced from the shared `assets/css/design-system.css`). This is a deliberate departure from the earlier system (which used Fraunces italic for headlines) and from what SunnySideUp/the hub still do — Flexy now reads as one consistent sans-serif voice, headline to body, no serif contrast.

**A dedicated monospace face for numeric readouts:**
```
--font-mono: ui-monospace, 'SF Mono', 'Cascadia Mono', 'JetBrains Mono', Menlo, Consolas, monospace;
```
Applied to prices, kWh figures, stat-tile numbers, and charge percentages (e.g. `.tldr-card .num`, `.tam-card .tam-num`, `.theme .n`) for what the rework commit calls an "instrument-panel feel" — numbers read as data, not as headline typography. This is a stronger, more specific choice than a generic tabular-nums rule on the body face would have been, and it's the one that actually shipped.

## 5. Shape and elevation — border-forward, not shadow-heavy

- **Radius**: mostly `8–10px` ("bento tiles" — sharper than the previous system's 12–16px shadow-heavy cards), `999px` for pills/tags/chips.
- **Cards**: `1px solid var(--border)` is the primary separation device. Shadow is minimal and only appears on hover (`0 8px 20px rgba(0,0,0,0.06)`, plain black-based, not brand-tinted) — a deliberate flattening compared to the earlier, more shadow-dependent look.
- Buttons: `8px` radius, sharper than the pill-shaped buttons used elsewhere in the portfolio.

## 6. Semantic and data colors (prototype-specific, unchanged by the rework)

Kept exactly as they were before the palette rework — the commit's own rationale (§1) is that the brand violet needs to read as distinct *from* these, not replace them:

**Price tiers:**
| Token | Value |
|---|---|
| `--cheap` | `#34C759` |
| `--moderate` | `#F5A623` |
| `--expensive` | `#FF6B6B` |

**TOU-comparison overlay:**
| Token | Value |
|---|---|
| `--tou-cheap` | `#5B8DEF` |
| `--tou-moderate` | `#8B6FF0` |
| `--tou-expensive` | `#33267A` |

**Neutral/utility:**
| Token | Value | Use |
|---|---|---|
| `--gray` | `#8A94A6` | Prototype secondary/muted elements. |
| `--line` | `#E3E1EC` | Prototype hairlines (equivalent role to `--border` on the case-study page, separate token since the two files aren't fully unified). |

**Roadmap horizon tags** (case-study page):
| Token | Value |
|---|---|
| `--now` | `#2F6B4F` |
| `--next` | `#B45309` (same value as `--gold`) |
| `--later` | `#8A93A6` |

## 7. ComEd-brand tie-in

| Token | Value | Use |
|---|---|---|
| `--comed-blue` | `#0059A4` | ComEd's real brand blue. |
| `--comed-navy` | `#180D67` | ComEd-specific dark accent (prototype only). |

Both are preserved and explicitly commented in `prototype.html` as intentional: "Flexy's own system: graphite + violet, deliberately far from ComEd's blue... so the hand-off from utility screens to Flexy screens reads as a clear brand change." Scoped to ComEd-specific moments (account-connection flow, ComEd branding references), never used as a general UI accent.

## 8. What isn't covered yet

- **A dashboard chart palette.** Neither file needed one before now — the upcoming utility-facing operator dashboard will be the first surface with multi-series charts. Recommendation, not yet implemented: build it from tokens that already exist rather than inventing new hues — `--teal` (primary series), `--tou-cheap` blue (secondary series), `--gold` (tertiary), `--expensive` red (alert/anomaly only, never a neutral series), `--gray`/`--ink-soft` (baseline/forecast lines).
- **Accessibility contrast wasn't re-verified against the final shipped values** in this pass — worth a check before the dashboard build, particularly `--gold` (`#B45309`) on `--paper`, since it's used at small caption sizes in places.
- **`--peach` remains dead code** (§2) — low priority, but worth a decision next time this file is touched.

## Status

v2 — corrected against the actually-implemented rework (`index.html`/`prototype.html`, PR #29, "graphite + violet, utilitarian bento tiles"), after v1 was found to have been written from a color-only seed handoff and invented several decisions that didn't match what was actually built. Docs (`docs/*.html`, `build_docs.py`) were explicitly left untouched by that rework and still run on the prior look — a known, named gap, not an oversight of this document.
