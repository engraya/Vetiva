# Vetiva IPO — Desktop Web Platform

A production-grade desktop web application for subscribing to Nigerian IPOs, built from the
mobile prototype at [nonsou.github.io/vetiva-ipo-demo](https://nonsou.github.io/vetiva-ipo-demo/).
The flagship offer is the **Dangote Petroleum Refinery & Petrochemicals (DPRP)** IPO — all
figures, fees, dates and rates are placeholders and are marked `DEMO` in the UI.

The UI matches the **approved web flow** at
[nonsou.github.io/vetiva-ipo-demo/web.html](https://nonsou.github.io/vetiva-ipo-demo/web.html)
(the design source of truth): a white client-portal shell with an image-slider auth card, a
five-section dashboard (Home / Wallet / Offers / Products / Portfolio), and the single-column
subscription one-pager with a sticky amount footbar — all in Vetiva's olive design language.
See [`docs/`](docs/) for the full product documentation:

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

- "Get started" → _Create new account_ → **Use demo BVN** → _Continue_ → _Send verification
  code_ → **Autofill code** → any alphanumeric password (e.g. `Demo1234`) → _Finish setup_
  (lands on **Offers**).
- On the subscribe page use **Use demo number** for CSCS and any bank + 10-digit account number.
- The **☰ Presenter** pill (bottom-right, or `Ctrl+.`) opens the demo panel — journeys, state
  jumps (pre-live / live / subscribed) and reset, matching the approved flow's presenter rail.

## Scripts

| Command                                        | Purpose                                                                 |
| ---------------------------------------------- | ----------------------------------------------------------------------- |
| `pnpm dev` / `pnpm build` / `pnpm preview`     | Develop, build, preview production bundle                               |
| `pnpm test`                                    | Vitest unit tests (share rounding, fee math, formatting)                |
| `pnpm test:e2e`                                | Playwright end-to-end journeys (register→subscribe, top-up, waitlist)   |
| `pnpm lint` / `pnpm format` / `pnpm typecheck` | Quality gates (also run via Husky + lint-staged)                        |
| `node scripts/screenshots.mjs <outDir>`        | Capture full-page screenshots of every key screen (dev server on :5199) |

## Docker

The app ships as a fully self-contained image — MSW is the backend, so nginx serving the
static build is the whole deployment.

```bash
docker build -t vetiva-ipo-web .
docker run --rm -p 8080:80 vetiva-ipo-web   # http://localhost:8080
# or
docker compose up --build
```

CI (GitHub Actions, [.github/workflows/ci.yml](.github/workflows/ci.yml)) runs on every push
to `main` and every PR: lint, format check, typecheck, unit tests, production build, Playwright
e2e, and a Docker image build with an nginx smoke test. The image is build-verified only — it
is not pushed to a registry.

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
