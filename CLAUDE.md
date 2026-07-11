# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Vetiva IPO — a desktop web demo for subscribing to Nigerian IPOs (Dangote Petroleum Refinery). There is **no real backend**: MSW is the product's API and is always enabled (see `src/main.tsx`). All figures/fees/dates are placeholders marked `DEMO` in the UI. Full product docs live in `docs/` (01-product-spec … 07-roadmap); `docs/06-api-contracts.md` is the contract the MSW handlers implement.

## Commands

Use **pnpm** (via `corepack pnpm` if plain `pnpm` is unavailable) — npm install fails on this machine.

- `pnpm dev` — dev server at http://localhost:5173
- `pnpm build` — `tsc -b && vite build`
- `pnpm typecheck` / `pnpm lint` / `pnpm format`
- `pnpm test` — Vitest unit tests (jsdom, globals on, setup in `src/test/setup.ts`)
  - Single file: `pnpm vitest run src/lib/shares.test.ts`
  - Single test: `pnpm vitest run -t "test name"`
- `pnpm test:e2e` — Playwright (chromium, 1440×900). Auto-starts `pnpm dev --port 5199`; specs in `e2e/`
  - Single spec: `pnpm playwright test e2e/top-up.spec.ts`
- `node scripts/screenshots.mjs <outDir>` — full-page screenshots of key screens (dev server on :5199)

Husky + lint-staged run eslint/prettier on commit.

## Architecture

Feature-first layout: `src/features/{auth,offer,subscription,profile,demo}` each with `api.ts`, optional stores, and `components/`. Shared UI primitives (shadcn-style Radix wrappers) in `src/components/ui`; composite widgets (OTP input, segmented control, quantity stepper, stat card…) in `src/components/common`. Path alias `@/` → `src/`.

### Mock backend (MSW)

- `src/mocks/handlers.ts` implements the REST contracts from doc 06, with realistic latency (including a deliberate 1.7 s payment-processing delay).
- `src/mocks/db.ts` is a seedable in-memory store persisted to localStorage (`vetiva-demo-db`). `seedScenario()` jumps between demo states (`new-user` / `prelive` / `live-fresh` / `subscribed`); the Demo panel (bottom-right, `Ctrl+.`) drives it. `DEMO_OTP = '482917'`.
- Changing API behavior means editing handlers/db, not any server.

### State management (deliberate split)

- Server data → TanStack Query (`src/lib/query-client.ts`, feature `api.ts` files call Axios via `src/lib/axios.ts`).
- Session → persisted Zustand store `src/features/auth/store.ts` (`vetiva-auth`); registration wizard → `src/features/auth/register-store.ts`.
- Subscribe-flow selections → URL + local state; the just-completed order → in-memory Zustand store (`src/features/subscription/store.ts`) that guards the success page (refresh loses it by design).

### Routing

`src/app/router.tsx` — all pages are lazy-loaded. `AuthLayout` wraps `/auth/*`; `DashboardLayout` is the auth guard (redirects to `/auth/login` when not authenticated) and renders sidebar, header, page transitions, and the demo panel.

### Domain math

Business rules are pure, tested functions — change them there, not in components:

- `src/lib/shares.ts` — quantity stepping (nearest 100 below 10 000 shares, nearest 1 000 above) and min shares derived from ₦100 000 ÷ price.
- `src/lib/fees.ts` — per-payment-method fee rules including USD FX.
- `src/lib/money.ts` — formatting.

### Styling

Tailwind CSS v4 (no `tailwind.config` — tokens/theme are CSS-defined in `src/styles/index.css`, per `docs/02-design-system.md`). Framer Motion for transitions; all animation must respect `prefers-reduced-motion`. Accessibility is a maintained invariant: focus-visible rings, radiogroup segmented controls, dialog focus traps, `aria-describedby` error wiring, skip link.
