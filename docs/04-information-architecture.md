# 04 — Information Architecture (Phase E)

Aligned to the **approved web flow** (`web.html` — the source of truth).

## Route map (React Router v7, `createBrowserRouter`)

```
/                       AuthLayout       "Get started" entry (account type + CTAs)     public
/auth/login             AuthLayout       Login ("Welcome Back")                        public
/auth/register?step=…   AuthLayout       Wizard (bvn → confirm → verify, back-arrow)   public
/dashboard              DashboardLayout  Home (setup band, IPO band, balances)         protected
/wallet                 DashboardLayout  Wallet balance + recent transactions          protected
/offers?tab&type        DashboardLayout  Offers (banner, tabs, chips, offer card)      protected
/products               DashboardLayout  Products tile grid                            protected
/portfolio              DashboardLayout  Portfolio value, distribution, holdings       protected
/subscribe?for=…        DashboardLayout  One-pager (720px column, sticky footbar)      protected
/top-up/:accountId      DashboardLayout  Top-up one-pager                              protected
/subscription/success   DashboardLayout  Success (guarded by completed order)          protected
/profile                DashboardLayout  Profile & phone verification                  protected
/maintenance, * (404), errorElement (500)
```

## Layouts

- **AuthLayout** — white page; inset rounded **image-slider card** left (hidden < lg), form
  centered in the remaining space (max 470px). Authed users → `/dashboard`.
- **DashboardLayout** — white 232px sidebar (groups **Home**: Home/Wallet/Offers, **Invest**:
  Products/Portfolio; user card at bottom) + "Welcome {NAME}" header with two icon buttons;
  scrollable main with a 1080px content column. Below lg the sidebar becomes a fixed
  **bottom tab bar**.
- **RootLayout** — mounts the floating Presenter panel on every screen.

## Guards, redirects & nav mapping

- Unauthenticated app routes → `/auth/login` with `state.from`.
- Register finish → `/offers`. Login → `/dashboard` when a position exists, else `/offers`.
- Success page requires `lastOrder` in the order store; otherwise → `/dashboard`.
- Sidebar active state: `/subscribe`, `/top-up/*`, `/subscription/*` highlight **Offers**;
  `/profile` highlights **Home** (`activeNavKey` in `src/layouts/sidebar.tsx`).

## URL state

Register step `?step=bvn|confirm|verify` · Offers `?tab=history`, `?type=primary|rights` ·
Subscribe `?for=self|minor` · Top-up target `:accountId`.
