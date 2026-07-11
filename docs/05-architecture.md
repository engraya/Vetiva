# 05 — Project, Component & State Architecture (Phases F, G, H)

## 1. Stack

React 19 · Vite · TypeScript (strict, no `any`) · Tailwind CSS v4 (CSS-first tokens) · shadcn-style primitives on Radix · React Router v7 · TanStack Query v5 · Zustand v5 · React Hook Form + Zod · Axios · MSW v2 · Framer Motion · Lucide · CVA + clsx + tailwind-merge · ESLint (flat) + Prettier + Husky + lint-staged · Vitest + Testing Library · Playwright.

## 2. Folder structure (feature-first)

```
src/
  app/                    App.tsx, providers.tsx, router.tsx
  components/
    ui/                   button, input, select, checkbox, dialog, table, skeleton, badge, sonner…
    common/               OtpInput, CountdownTimer, StatCard, SegmentedControl, StatusBand,
                          DangerBox, DemoTag, MoneyText, Timeline, StepIndicator, EmptyState,
                          QuantityStepper, RadioCard, PageHeader
  features/
    auth/                 api.ts, schemas.ts, store.ts, components/ (LoginForm, RegisterWizard,
                          BvnStep, ConfirmStep, VerifyStep, BrandPanel)
    offer/                api.ts, hooks.ts, components/ (OfferHeroCard, OfferCountdown,
                          OfferingsGrid, WaitlistDialog, ProspectusLink)
    subscription/         api.ts, hooks.ts, store.ts, lib/ (order math), components/
                          (SubscribePage sections, OrderSummaryPanel, PaymentMethodList,
                          CscsSection, DividendSection, WhoForSection, TopUpPage,
                          ProcessingOverlay, SuccessPage, PositionStats, SubscriptionsTable)
    profile/              api.ts, components/ (IdentityCard, PhoneVerification)
    demo/                 store.ts, DemoPanel.tsx (scenario switching)
  layouts/                PublicLayout, AuthLayout, DashboardLayout, Sidebar, AppHeader
  hooks/                  useCountdown, useMediaQuery, useDocumentTitle
  lib/                    axios.ts, query-client.ts, utils.ts (cn), money.ts, shares.ts, fees.ts
  mocks/                  browser.ts, server.ts, handlers/, db.ts (seedable in-memory store)
  pages/errors/           NotFound, RouteError, Maintenance
  constants/              offer.ts, payments.ts, banks.ts, offerings.ts
  types/                  api.ts, domain.ts
  styles/                 index.css (@theme tokens)
```

## 3. Component inventory (production-ready primitives)

Button (variants: primary-gradient, ghost, link, pill; press-scale) · Input (+error/hint wiring) · PasswordInput (show/hide) · OtpInput (n boxes, paste, auto-advance) · Select · Checkbox · SegmentedControl (radiogroup) · RadioCard (payment/option rows) · QuantityStepper (± with step rounding) · Dialog (focus-trapped) · Toast (sonner) · StatusBand (ok/warn/error) · DangerBox · Badge/Chip (live pulse, soon, verified, demo) · Avatar (initials) · Card · StatCard · Table (+ responsive card fallback) · Skeleton · Timeline · StepIndicator · CountdownTimer · EmptyState · MoneyText (tabular ₦/$) · DemoTag · Sidebar · AppHeader · PageTransition.

## 4. State management matrix

| State                                              | Where                                      | Why                                                       |
| -------------------------------------------------- | ------------------------------------------ | --------------------------------------------------------- |
| Offer, subscriptions, profile, banks, fee schedule | **React Query** (MSW-backed)               | Server-owned, cacheable, invalidation on mutations        |
| Session (user, token, phoneVerified)               | **Zustand + persist(localStorage)**        | Survives reload; guards read it synchronously             |
| Demo scenario                                      | **Zustand + persist** + `mocks/db.ts` seed | Drives MSW seed data; panel mutates + invalidates queries |
| Register wizard data                               | Feature Zustand store (memory)             | Cross-step, discarded on completion                       |
| Subscribe/top-up form                              | **React Hook Form** + Zod                  | Validation gating replicates prototype `validate()`       |
| Wizard step, subscribe target, top-up target       | **URL**                                    | Deep-linkable, back-button correct                        |
| Last completed order                               | Subscription store (memory)                | Success-page guard + content                              |

## 5. Conventions

- Path alias `@/* → src/*`. Named exports. Feature code imports UI from `@/components`, never across features except via public `index.ts`.
- Domain math (`shares.ts`, `money.ts`, `fees.ts`) is pure + unit-tested; UI consumes only these.
- No raw hex/px in features — Tailwind tokens only.
- Every async UI has loading (skeleton/spinner), error, and empty representations.
