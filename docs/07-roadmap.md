# 07 — Development Roadmap (Phase J)

Build order — each milestone leaves the app releasable.

1. **Scaffold** — Vite + React 19 + TS strict; Tailwind v4 theme tokens; fonts; ESLint/Prettier/Husky/lint-staged; aliases; folder skeleton.
2. **Domain core** — `constants/` (offer, payments, banks, offerings), `lib/shares.ts`, `lib/money.ts`, `lib/fees.ts` + Vitest suites (rounding boundaries, min-share derivation, fee math incl. FX).
3. **Mock API** — `mocks/db.ts` (seedable scenarios), MSW handlers for every contract in doc 06, axios instance + query client.
4. **Primitives** — `components/ui` + `components/common` (visual parity with design system doc 02).
5. **Shell** — layouts, sidebar/header, router + guards, error pages (404/500/maintenance), page transitions.
6. **Auth** — landing, login, 3-step register wizard.
7. **Dashboard** — pre-live (countdown, waitlist dialog, offerings grid) & live (hero, stats, subscriptions table, nudge banner, empty state).
8. **Subscribe** — two-column one-pager (all six sections + sticky order summary), gating parity, processing → success.
9. **Top-up** — reduced flow reusing subscribe sections.
10. **Profile** — identity card + phone OTP verification.
11. **Demo panel** — scenario switching (new user / pre-live / live fresh / subscribed / reset) reseeding the mock DB.
12. **Polish** — micro-interactions, skeletons, reduced motion, keyboard/focus audit, responsive 320→1920.
13. **E2E** — Playwright: full registration → subscribe → success; top-up; minor; waitlist. CI-ready scripts.
14. **Docs & release** — README, `npm run build` clean, lint + typecheck gates in Husky.
