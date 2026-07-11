# Vetiva IPO — Desktop Web Platform

A production-grade desktop web application for subscribing to Nigerian IPOs, built from the
mobile prototype at [nonsou.github.io/vetiva-ipo-demo](https://nonsou.github.io/vetiva-ipo-demo/).
The flagship offer is the **Dangote Petroleum Refinery & Petrochemicals (DPRP)** IPO — all
figures, fees, dates and rates are placeholders and are marked `DEMO` in the UI.

The mobile experience was reverse-engineered screen by screen and **redesigned for desktop**
(split-screen auth, sidebar navigation, dashboard stat cards, a two-column subscription page with
a sticky order summary) while preserving Vetiva's cream/olive design language, motion vocabulary
and business rules. See [`docs/`](docs/) for the full product documentation:

| Doc                                                                | Contents                                                    |
| ------------------------------------------------------------------ | ----------------------------------------------------------- |
| [01-product-spec](docs/01-product-spec.md)                         | Every screen, flow, state and interaction of the source app |
| [02-design-system](docs/02-design-system.md)                       | Tokens: type, color, spacing, radii, elevation, motion      |
| [03-desktop-ux](docs/03-desktop-ux.md)                             | Desktop transformation rationale + accessibility notes      |
| [04-information-architecture](docs/04-information-architecture.md) | Routes, layouts, guards                                     |
| [05-architecture](docs/05-architecture.md)                         | Stack, folders, components, state-management matrix         |
| [06-api-contracts](docs/06-api-contracts.md)                       | REST contracts implemented by the MSW mock API              |
| [07-roadmap](docs/07-roadmap.md)                                   | Build order                                                 |

## Stack

React 19 · Vite · TypeScript (strict) · Tailwind CSS v4 · Radix primitives (shadcn-style) ·
React Router v7 · TanStack Query v5 · Zustand · React Hook Form + Zod · Axios · **MSW** (the
demo's backend) · Framer Motion · Lucide · CVA/clsx/tailwind-merge · ESLint + Prettier + Husky ·
Vitest · Playwright.

## Getting started

```bash
pnpm install
pnpm dev          # http://localhost:5173 — MSW serves the API, no backend needed
```

**Demo tips**

- Landing → _Create new account_ → **Use demo BVN** → _Continue_ → _Send verification code_ →
  **Autofill code** → any alphanumeric password (e.g. `Demo1234`) → _Finish setup_.
- On the subscribe page use **Use demo number** for CSCS and any bank + 10-digit account number.
- The **Demo scenarios** panel (bottom-right, or `Ctrl+.`) jumps between pre-live / live /
  subscribed states and resets the demo — the desktop version of the prototype's presenter rail.

## Scripts

| Command                                        | Purpose                                                                 |
| ---------------------------------------------- | ----------------------------------------------------------------------- |
| `pnpm dev` / `pnpm build` / `pnpm preview`     | Develop, build, preview production bundle                               |
| `pnpm test`                                    | Vitest unit tests (share rounding, fee math, formatting)                |
| `pnpm test:e2e`                                | Playwright end-to-end journeys (register→subscribe, top-up, waitlist)   |
| `pnpm lint` / `pnpm format` / `pnpm typecheck` | Quality gates (also run via Husky + lint-staged)                        |
| `node scripts/screenshots.mjs <outDir>`        | Capture full-page screenshots of every key screen (dev server on :5199) |

## Architecture notes

- **Feature-first layout** under `src/features/*` (auth, offer, subscription, profile, demo),
  with shared primitives in `src/components/ui` and `src/components/common`.
- **Domain math is pure and tested**: `src/lib/shares.ts` (quantity steps: nearest 100 below
  10 000 shares, nearest 1 000 above; min shares derived from ₦100 000 ÷ price) and
  `src/lib/fees.ts` (per-method fee rules incl. USD FX).
- **MSW is the product's backend**: handlers in `src/mocks/handlers.ts` implement the contracts
  in doc 06 against a localStorage-persisted seedable store (`src/mocks/db.ts`), with realistic
  latency — including the 1.7 s payment-processing beat from the prototype.
- **State**: server data in React Query; session + demo scenario in persisted Zustand stores;
  wizard/subscribe flow state in URL + local state; the just-completed order in a memory store
  guarding the success page.
- **Accessibility**: focus-visible rings everywhere, radiogroup segmented controls, OTP inputs
  with paste distribution, dialog focus traps, `aria-describedby` error wiring, skip link, and
  `prefers-reduced-motion` support across all animations.
