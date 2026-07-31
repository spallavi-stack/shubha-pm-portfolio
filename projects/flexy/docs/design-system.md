# Flexy — Design System

Documents the system actually implemented in `index.html`, `prototype.html`, and `utility-dashboard.html`. Two revisions of this file preceded this one — v1 was written from a color-only seed handoff before real applied changes were visible and invented several wrong decisions; v2 correctly documented that handoff's actual violet/graphite implementation (PR #29). This version (v3) documents a full accent recolor off violet, after the palette was found to collide with a real competitor's brand identity — see §1.

Distinct from the shared portfolio CSS (`assets/css/design-system.css`), which the hub and SunnySideUp's case-study page still use. Flexy deliberately doesn't.

## 1. Why petrol teal, not violet

The original rework (PR #29) picked violet specifically to read as distinct from ComEd's brand blue and from the prototype's own price-status colors — a reasonable goal, wrong execution. Two problems surfaced after it shipped:

1. **A large violet field (hero gradient, hub card background) reads as heavy/off**, distinct from violet working fine as a small accent (buttons, links, dots).
2. **Violet collides with Tibber's own brand identity.** Tibber isn't just any competitor — `product-brief.md` names it explicitly as "the Tibber model Flexy is adapting," Flexy's closest direct inspiration. Checked directly against Tibber's published brand palette (tibber.design/colors): Medium Purple `#C86DFF` / Dark Purple `#490F6C` as their own secondary accent scale, paired with Soft Black `#16191D` as a neutral — genuinely close to Flexy's former navy (`#1E1A2E`) plus violet (`#6D28D9`) pairing in structure, if not exact hex. A case study whose own pitch is built on differentiating from Tibber shouldn't visually echo it.

Every other named competitor's brand color was checked before picking the replacement, so the new accent doesn't just avoid Tibber, it avoids the whole field: Octopus Energy (pink/magenta + navy), Emporia (`#0E4EA0` blue + `#F8991D` orange), ComEd (`#0059A4` blue). Also checked against the portfolio itself: SunnySideUp already owns amber (`#D4890B`) as its primary accent, and the shared hub's own default accent is a teal (`#0F9D8F`) — the replacement had to sit far enough from that too, not just from external competitors.

**Petrol/marine teal** (`#125E6B`) was the result: cool, technical, reads as an instrument-panel color rather than a consumer-app color (fits the mono-numerics/graphite direction already shipped), clearly darker and more blue-leaning than both Tibber's pale bright aqua and the hub's own medium teal-green.

## 2. Brand tokens

| Token | Value | Use |
|---|---|---|
| `--teal` (aliased to `--accent`) | `#125E6B` | Primary brand color — petrol teal, despite the token name (see §1 of the earlier v2 note on this same naming quirk, carried forward). UI chrome: buttons, links, active states, brand mark, hero background. High-contrast (~7.4:1 on white) — safe for text use. |
| `--teal-dark` (aliased to `--accent-dark`) | `#0C4750` | Hover/emphasis state. |
| `--teal-chart` | `#0891A0` | **Data-mark variant, chart/graph use only — not for text or UI chrome.** `--teal` on its own reads as desaturated ("gray") when used as a chart series color, confirmed by the dataviz skill's palette validator (fails the chroma-floor check in isolation). This lighter, more saturated variant passes; it does not pass WCAG AA for body text (~3.8:1), so it's scoped strictly to lines, bars, and fills. |
| `--navy` | `#1E1A2E` | Dark graphite. Hero background, dark UI chrome. |
| `--gold` | `#B45309` | Secondary accent — muted amber, not literal gold. Roadmap "Next" tag, sparing highlight, and the dashboard's secondary chart series (see §8). |
| `--peach` | `#BFDEE3` | Declared, still currently unused in either file — updated to a teal tint to match the new family, but remains a dead token from the original palette-selection process. Worth removing or deciding a use for it next time this file is touched. |

## 3. Neutrals

| Token | Value | Use |
|---|---|---|
| `--ink` | `#1C1A22` | Body text on light backgrounds. |
| `--ink-soft` | `#565061` | Secondary text on light backgrounds. |
| `--paper` | `#FFFFFF` | Page background, card fill. |
| `--paper-soft` | `#F6F4F9` | Alt-section background. |
| `--border` | `#E4E0EC` | 1px hairlines, card borders — load-bearing (see §5, borders replaced shadows as the primary card-separation device). |

**Text on `--navy`**: currently hardcoded as plain white (`#fff`) directly in the hero, not tokenized. Works fine as-is; a `--on-dark` token would be a small cleanup if this system gets touched again, not a defect worth stopping for now.

## 4. Typography

Unchanged from v2. **Inter Variable throughout, no display serif** (`--font-display` aliased to `--font-body`), plus a dedicated **monospace face for numeric readouts** (prices, kWh, stat-tile numbers, charge percentages):
```
--font-mono: ui-monospace, 'SF Mono', 'Cascadia Mono', 'JetBrains Mono', Menlo, Consolas, monospace;
```

## 5. Shape and elevation — border-forward, not shadow-heavy

Unchanged from v2: `8–10px` radius ("bento tiles"), `999px` for pills/tags. `1px solid var(--border)` is the primary separation device; shadow is minimal, hover-only, plain black-based.

## 6. Semantic and data colors (prototype-specific, unchanged by either recolor)

Kept exactly as they were before both palette changes — the brand accent needs to read as distinct *from* these, not replace them:

**Price tiers:** `--cheap` `#34C759` · `--moderate` `#F5A623` · `--expensive` `#FF6B6B`

**TOU-comparison overlay:** `--tou-cheap` `#5B8DEF` · `--tou-moderate` `#8B6FF0` · `--tou-expensive` `#33267A`

**Note on `--tou-cheap` and the new teal accent**: validated together with the dataviz skill's palette checker — `--tou-cheap` blue and either teal token fail the "normal-vision floor" check (worst-adjacent ΔE 13.9, below the 15 minimum), meaning even full-color-vision readers would struggle to tell them apart at a glance if used as adjacent categorical series in the *same* chart. This doesn't affect the prototype's own price graph (blue and teal never appear as competing series there today), but it's why the utility dashboard's chart palette (§8) pairs teal with gold instead of blue.

**Neutral/utility:** `--gray` `#8A94A6` · `--line` `#E3E1EC`

**Roadmap horizon tags:** `--now` `#2F6B4F` · `--next` `#B45309` (same as `--gold`) · `--later` `#8A93A6`

## 7. ComEd-brand tie-in

| Token | Value | Use |
|---|---|---|
| `--comed-blue` | `#0059A4` | ComEd's real brand blue. |
| `--comed-navy` | `#180D67` | ComEd-specific dark accent (prototype only). |

Scoped to ComEd-specific moments (account-connection flow, ComEd branding references), never used as a general UI accent.

## 8. Dashboard chart palette (implemented)

`utility-dashboard.html` is the first surface with multi-series charts, so this is no longer a recommendation, it's what's shipped, validated with the dataviz skill's `validate_palette.js` before use:

- **Primary series**: `--teal-chart` (`#0891A0`)
- **Secondary series**: `--gold` (`#B45309`) — not `--tou-cheap` blue, per §6's validator finding
- **Alert/anomaly only**: `--critical` (`#D6473C`), never a neutral data series
- **Baseline/forecast reference lines**: `--gray` / `--ink-soft`

Validated combination (`teal-chart` + `gold`): passes lightness band, chroma floor, CVD separation (ΔE 17.4 deutan / 28.4 tritan), normal-vision floor (ΔE 24.8), and contrast vs. surface — all checks clear.

## 9. Known gaps

- **`--peach` remains dead code** (§2) — low priority.
- **Accessibility contrast on `--gold`** (`#B45309`, ~5:1 on white) is fine for the sizes it's currently used at, but wasn't re-checked against every specific use after this recolor — worth a glance if `--gold`'s role expands.
- **`docs/*.html` (rendered markdown docs) and `build_docs.py`** still run on a prior look — explicitly out of scope for both the original rework and this recolor, a known, named gap rather than an oversight.
- **The portfolio hub's `banner-flexy` card gradient** was found stale during this recolor (still on the *pre-PR#29* green/peach palette — the original violet rework never touched it either) and has been brought onto the new petrol-teal/navy family as part of this pass, so it no longer disagrees with either the case-study page or the (now-fixed) accent.

## Status

v3. Full accent recolor off violet after a real brand-collision finding (Tibber's own purple secondary scale + near-black neutral, checked directly against tibber.design). New accent: petrol teal `#125E6B` (UI) / `#0891A0` (chart-only variant, added specifically because the UI shade fails the dataviz skill's chroma-floor check as a data-series color). Applied across `index.html`, `prototype.html`, `utility-dashboard.html`, and the hub's stale `banner-flexy` card. `--tou-cheap` blue confirmed, via the same validator, too close to teal for adjacent-series chart use — the dashboard's chart palette uses gold as its second series instead.
