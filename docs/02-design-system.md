# 02 — Design System (Phase C)

Extracted from the prototype's CSS custom properties and formalized for desktop. Implemented as Tailwind CSS v4 `@theme` tokens in `src/styles/index.css`.

## 1. Typography

- **Family**: `Instrument Sans` (variable, 400–700 + 800 via wght axis) — self-hosted from `src/assets/fonts/` (vendored woff2, OFL license; `@font-face` in `src/styles/index.css`). Fallback stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`.
- **Numerals**: `font-variant-numeric: tabular-nums` for all money, countdowns, and share quantities (`.tabular` utility).

| Token         | Size / line-height               | Weight  | Tracking           | Usage                       |
| ------------- | -------------------------------- | ------- | ------------------ | --------------------------- |
| `display`     | 40/44 (desktop) · 28/32 (mobile) | 700     | −0.025em           | Auth hero, landing headline |
| `h1`          | 28/34                            | 700     | −0.025em           | Page titles                 |
| `h2`          | 22/28                            | 700     | −0.02em            | Card titles, offer name     |
| `h3`          | 17/24                            | 700     | −0.01em            | Section headers             |
| `body`        | 15/23                            | 400     | −0.005em           | Default                     |
| `body-strong` | 15/23                            | 600–700 | −0.005em           | Row labels, values          |
| `small`       | 13/19                            | 400–600 | 0                  | Hints, secondary rows       |
| `tiny`        | 12/16                            | 500–700 | 0                  | Fee labels, timeline meta   |
| `overline`    | 11/14                            | 700     | +0.08em, uppercase | Chips, stat labels          |
| `stat`        | 30/36                            | 800     | −0.02em, tabular   | Stat card values, totals    |

## 2. Color

| Token                           | Hex                               | Role                                      |
| ------------------------------- | --------------------------------- | ----------------------------------------- |
| `cream`                         | `#FAF8F1`                         | App background (light surfaces)           |
| `card`                          | `#FFFFFF`                         | Card / input surface                      |
| `olive`                         | `#78814B`                         | Primary brand                             |
| `olive-deep`                    | `#5F673A`                         | Primary hover/active, links, emphasis     |
| `olive-bright`                  | `#828C54`                         | Gradient start                            |
| `olive-soft`                    | `#EEF0E3`                         | Soft fills (segments, math line, avatars) |
| `olive-pale`                    | `#E4E7D6`                         | Disabled button bg                        |
| `olive-pale-text`               | `#9CA283`                         | Disabled button text                      |
| `ink`                           | `#181A10`                         | Primary text                              |
| `muted`                         | `#6E7261`                         | Secondary text (4.7:1 on cream ✓)         |
| `line`                          | `#E8E5D8`                         | Borders, dividers                         |
| `good` / `good-soft`            | `#1E9E52` / `#E7F5EC`             | Success text/fill                         |
| `good-deep`                     | `#12683A`                         | Success band text (AA on good-soft)       |
| `bad` / `bad-soft` / `bad-line` | `#C43D3D` / `#FBEBEB` / `#EFC9C9` | Errors, danger box                        |
| `bad-deep`                      | `#8A4040`                         | Danger body text                          |
| `amber` / `amber-soft`          | `#B7791F` / `#FCF3E3`             | Warnings, "opens soon"                    |
| `amber-deep`                    | `#7A5310`                         | Warning band text                         |
| `stage`                         | `#23251B`                         | Dark brand surface (auth panel, sidebar)  |
| `stage-soft`                    | `#3A3D2A`                         | Dark surface glow / borders               |
| `stage-ink`                     | `#E9E7D9`                         | Text on dark surfaces                     |
| `stage-muted`                   | `#A6A88F`                         | Secondary text on dark                    |

**Gradients**

- Primary button / position card: `linear-gradient(155deg, #828C54, #78814B 45%, #5F673A)`.
- Dark stage: `radial-gradient(1200px 800px at 70% -10%, #3A3D2A 0%, #23251B 55%)`.
- Success halo: `radial-gradient(circle at 35% 30%, #33B56C, #1E9E52)`.

**Interaction states**: hover = `brightness(1.04)` (primary) or `olive-soft` fill (ghost); active = `scale(0.97)`; focus-visible = 2px olive ring, offset 2; disabled = `olive-pale`/`olive-pale-text`, no shadow.

## 3. Spacing — 8-pt system

Scale (px): `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96`. Tailwind default scale already matches; usage rules:

- Card padding: 16 (mobile) / 24 (desktop). Section gap: 24 / 32. Page gutter: 20 / 32. Form-field vertical rhythm: label 8 above input, hint/error 8 below.

## 4. Radius

| Token            | Value | Usage                                  |
| ---------------- | ----- | -------------------------------------- |
| `--radius-input` | 12px  | Inputs, selects, quick-picks, bands    |
| `--radius-btn`   | 16px  | Buttons, segment container             |
| `--radius-card`  | 18px  | Cards, payment rows                    |
| `--radius-lg`    | 22px  | Sheets/modals, hero cards              |
| `full`           | 999px | Chips, pills, avatars, stepper buttons |

## 5. Elevation

| Level     | Shadow                                                                                        | Usage                   |
| --------- | --------------------------------------------------------------------------------------------- | ----------------------- |
| `e1`      | `0 0 0 1px rgb(24 26 16 / .03), 0 2px 6px rgb(24 26 16 / .05), 0 4px 8px rgb(24 26 16 / .08)` | Hover on rows/cards     |
| `card`    | `0 1px 2px rgb(24 26 16 / .045), 0 10px 26px -8px rgb(24 26 16 / .10)`                        | Cards                   |
| `btn`     | `0 10px 22px -8px rgb(95 103 58 / .55), 0 2px 6px -2px rgb(95 103 58 / .35)`                  | Primary button glow     |
| `pos`     | `0 16px 32px -12px rgb(95 103 58 / .45)`                                                      | Position/gradient cards |
| `overlay` | `0 30px 80px rgb(0 0 0 / .5)`                                                                 | Modals                  |

Opacity steps: disabled 100% (token-based, not opacity), veils `rgb(20 21 12 / .45)`, glass headers `rgb(250 248 241 / .88)` + `backdrop-blur(16px) saturate(1.4)`.

## 6. Motion

| Token         | Value                          | Usage                                |
| ------------- | ------------------------------ | ------------------------------------ |
| `ease-screen` | `cubic-bezier(.2,.7,.3,1)`     | Page/section entrances               |
| `ease-spring` | `cubic-bezier(.34,1.56,.64,1)` | Press scale, halo pop                |
| `dur-fast`    | 120–150 ms                     | Hovers, borders                      |
| `dur-base`    | 200–250 ms                     | Modals, toasts, segments             |
| `dur-page`    | 320 ms                         | Route transitions (fade + 10px rise) |
| `dur-pop`     | 500 ms                         | Success halo                         |

Signature moves: screen-in (opacity 0→1, translateY 10→0); press (scale .97); halo-pop (scale .6→1 spring); LIVE dot pulse (1.8 s ease-out ring); sheet/modal rise. **Every animation respects `prefers-reduced-motion`** (Framer `useReducedMotion` + CSS media query).

## 7. Breakpoints & grid

Tailwind defaults: `sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536`.

- **Container**: max-width 1200px, centered, gutter 24/32.
- **Desktop grid**: 12 columns / 24px gap. Dashboard: 8+4 split. Subscribe: 7+5 (form + sticky summary).
- **Sidebar**: 264px fixed ≥ lg; collapses to slide-over drawer below.
- Supported widths: 320 → ultrawide (content clamps at 1200, stage background extends).

## 8. Tailwind v4 theme mapping

Declared in `src/styles/index.css` under `@theme`: all colors above as `--color-*`, radii as `--radius-*`, shadows as `--shadow-*`, easings as `--ease-screen|spring`, font as `--font-sans`. Components consume tokens only — no raw hex in feature code.
