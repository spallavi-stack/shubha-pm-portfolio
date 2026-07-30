# Flexy — Design System

Flexy's own system, distinct from the shared portfolio CSS (`assets/css/design-system.css`) and from the two mismatched, undocumented palettes that previously existed across `index.html` and `prototype.html`. This is the frozen source of truth going forward; both pages should be brought onto it (tracked separately — this document defines the system, applying it to the live pages is its own pass).

Seed palette below came from a separate design session; everything past the base five colors (typography, semantic/data colors, layout, motion, shape, accessibility, and the two renamed/resolved tokens) was filled in here, since a palette alone isn't a design system.

## 1. Brand tokens

| Token | Value | Use |
|---|---|---|
| `--accent` | `#6D28D9` | Primary brand color — violet. CTAs, links, active states, brand mark. |
| `--accent-dark` | `#54219E` | Hover/emphasis state of the accent. |
| `--navy` | `#1E1A2E` | Dark graphite. Hero/footer backgrounds, dark UI chrome. |
| `--amber` | `#B45309` | Secondary accent only — roadmap "Next" tag, sparing highlight. Not a second brand color; doesn't appear in nav, buttons, or CTAs. |

Renamed from the seed handoff: `--teal` → `--accent` (the color is violet, not teal — the seed repeated the exact naming mismatch already flagged in `sunnysideup/docs/design-system.md`, where the shared system's own `--teal` token is actually amber). `--gold` → `--amber` (the value is a muted burnt-orange, not gold). Token names should describe the color or its role, not a metaphor that doesn't match the hex value.

## 2. Neutrals

| Token | Value | Use |
|---|---|---|
| `--ink` | `#1C1A22` | Body text on light backgrounds. |
| `--ink-soft` | `#565061` | Secondary text on light backgrounds. |
| `--paper` | `#FFFFFF` | Page background. |
| `--paper-soft` | `#F6F4F9` | Alt-section background, tiles — violet-tinted neutral, not pure grey. |
| `--border` | `#E4E0EC` | 1px hairlines, card borders — violet-tinted. |
| `--on-dark` | `#F3F0FA` | Body text on `--navy` or any dark surface. Warm-white with the same violet tint as `--paper-soft`, not pure white, so text on dark and light surfaces reads as one family. *(Missing from the seed handoff — dark backgrounds had no paired text color.)* |
| `--on-dark-soft` | `#B3ABC9` | Secondary text on dark surfaces (captions, metadata, muted labels over `--navy`). |

## 3. Typography

Not specified in the seed handoff. Decision: keep **Fraunces Variable** (display) + **Inter Variable** (body) — both already self-hosted in `assets/fonts/` for the whole portfolio, so this costs nothing extra to load, and it keeps one typographic through-line across the portfolio even as each project's color system diverges. Reconsider only if a future pass wants Flexy to read as visually distinct from the portfolio hub at the type level, not just the color level.

- **Display** (`--font-display`): `'Fraunces Variable', ui-serif, Georgia, serif` — headlines, section titles. Italic weight for emphasis words, matching the portfolio-wide convention already in `index.html`'s hero.
- **Body** (`--font-body`): `'Inter Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif` — everything else.
- **Data/numeric**: body face with `font-variant-numeric: tabular-nums` wherever prices, kWh figures, or dollar amounts line up in a column or update live (the price graph's headline numbers, the smart-charging cost readout, any future dashboard KPI tile). Flexy is a numbers-dense product; unaligned digits read as sloppy in exactly the screens meant to build trust.

**Type scale** (desktop, fluid via `clamp()` where noted):
| Role | Size | Weight | Notes |
|---|---|---|---|
| Hero title | `clamp(32px, 4.8vw, 50px)` | 600, display | Italic for the emphasized word, matching existing hero pattern. |
| Section title | `clamp(26px, 3.4vw, 38px)` | 600, display | |
| Card/subsection title | 20px | 600, display | |
| Body | 16px | 400, body | Line-height 1.6. |
| Lede/intro paragraph | 16px | 400, body | `--ink-soft`, max-width ~680px. |
| Caption/label | 13px | 500–600, body | Uppercase + letter-spacing 0.08–0.12em for kickers/eyebrows only, not general labels. |
| Data/numeric readout | 22–28px | 600, body, tabular-nums | Headline price/savings figures. |

## 4. Semantic and data colors

The seed handoff had none of these, and Flexy's core screens (the price graph, TOU comparison, smart-charging status, and the upcoming utility dashboard) can't be built without them.

**Price-tier bands** (live price graph):
| Token | Value | Use |
|---|---|---|
| `--price-cheap` | `#1E9E5A` | Cheap price band. |
| `--price-moderate` | `#C48A1E` | Moderate price band. |
| `--price-expensive` | `#D6473C` | Expensive price band. |

Kept close to universal green/amber/red rather than derived from the violet brand accent on purpose — this is a glanceable status signal on a price meter, not a branding moment, and using the brand accent here would make "expensive" and "brand" compete for the same visual weight.

**TOU-comparison overlay** (a second, visually distinct family so a "see this on Time-of-Use" toggle never gets confused with the live-price bands underneath it):
| Token | Value | Use |
|---|---|---|
| `--tou-cheap` | `#2F6FCC` | TOU cheap band. |
| `--tou-moderate` | `#6D5AC7` | TOU moderate band — deliberately close to `--accent` since it's the bridge between the blue TOU family and the brand hue. |
| `--tou-expensive` | `#2E2A6B` | TOU expensive band — deep indigo. |

**Savings/delta:**
| Token | Value | Use |
|---|---|---|
| `--positive` | `#1E9E5A` | Savings, cost decrease — same green as `--price-cheap`, one "good" signal across the product. |
| `--negative` | `#D6473C` | Cost increase — same red as `--price-expensive`, one "bad" signal across the product. |

**Roadmap horizon tags** (matches the shared portfolio's existing `--now`/`--next`/`--later` pattern, restated here so Flexy's system is self-contained):
| Token | Value |
|---|---|
| `--now` | `#1E9E5A` |
| `--next` | `--amber` (`#B45309`) |
| `--later` | `#8A93A6` |

**Dashboard chart palette** (categorical, for the utility-facing dashboard's multi-series charts — needed before that build starts, not invented ad hoc per chart):
`--accent` (primary series) → `--tou-cheap` blue (secondary series) → `--amber` (tertiary series) → `--negative` red (alert/anomaly series only, never a neutral data series) → `--ink-soft` (baseline/forecast/reference lines, always desaturated relative to real series).

## 5. ComEd-brand tie-in

| Token | Value | Use |
|---|---|---|
| `--comed-blue` | `#0059A4` | ComEd's own brand blue — scoped strictly to moments that are literally about ComEd as a specific partner (the account-connection flow, ComEd logo/wordmark references, the utility-partnership offer's ComEd-specific screens). Never used as a general UI accent. |

The seed handoff dropped this silently. Decision: keep it, scoped explicitly, rather than drop it. Flexy's product positioning is "utility-agnostic, ComEd is the first pilot" — the brand system's primary accent (violet) has to stay ComEd-independent so it doesn't read as ComEd-branded, but the product still needs to render ComEd's actual brand color in the specific screens where a user is looking at their real ComEd account. Both things are true at once; this token resolves them without contradiction.

## 6. Layout, shape, motion

Not in the seed handoff. Kept structurally consistent with the shared portfolio system's proportions so Flexy doesn't feel like a foreign object next to the hub, while using its own color values throughout.

- **Max-width**: `--wrap: 1120px` (marketing/case-study pages), narrower `760px` column for rendered docs, matching the portfolio-wide docs template.
- **Radius**: `--radius-sm: 8px` (inputs, small tiles), `--radius-md: 16px` (cards), `--radius-pill: 999px` (buttons, tags).
- **Shadow**: `--shadow-card: 0 16px 32px rgba(30, 26, 46, 0.10)` (navy-tinted, not a generic black shadow — ties elevation to the brand neutral).
- **Motion**: `--ease-out: cubic-bezier(.16,1,.3,1)`, `--dur-fast: .35s`, `--dur: .6s`, `--dur-slow: 1.1s` — same curve/timing values as the shared system, so motion feels consistent across the portfolio even where color doesn't match. Respect `prefers-reduced-motion` (already portfolio convention).

## 7. Accessibility

Contrast checked, not just assumed:
- `--accent` (`#6D28D9`) on `--paper` (`#FFFFFF`): ≈7:1 — passes WCAG AA and AAA for normal text.
- `--amber` (`#B45309`) on `--paper`: ≈5:1 — passes AA for normal text (used sparingly regardless, per §1).
- `--on-dark` (`#F3F0FA`) on `--navy` (`#1E1A2E`): high contrast by construction (light text on dark graphite), not separately recomputed here.

**Standard for anything added later**: minimum 4.5:1 for body text, 3:1 for large text (24px+/19px+bold) or UI elements (borders, icons conveying meaning). Check before adding a new text/background pairing, not after.

## 8. Dark mode

Not implemented — matches the shared portfolio system, which also has no dark-mode tokens today. Treated as a deliberate non-goal for this pass, not an oversight; revisit only if the portfolio-wide system adds it first, so Flexy doesn't end up as the one page with different theme behavior than the hub.

## Status

v1. Seed palette (5 tokens) came from a separate design session; typography, semantic/data colors, ComEd-brand scoping, layout/shape/motion tokens, and accessibility verification were completed here, since the handoff was color-only. Two tokens renamed for accuracy (`--teal`→`--accent`, `--gold`→`--amber`). Not yet applied to `index.html` or `prototype.html` — those still run on their prior, separate palettes. Applying this system to the live pages is a distinct next step.
