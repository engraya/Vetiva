# 04 — Information Architecture (Phase E)

## Route map (React Router v7, `createBrowserRouter`)

```
/                                PublicLayout      Landing (hero, account type, CTAs)          public
/auth                            AuthLayout                                                    public (redirects to /dashboard if authed)
  /auth/login                                      Login
  /auth/register?step=…                            Register wizard (bvn → confirm → verify)
/ (protected)                    DashboardLayout   guard: session required
  /dashboard                                       Pre-live or Live view (by offer status)
  /subscribe?for=self|minor                        Subscription one-pager
  /top-up/:accountId                               Top-up ("self" | minor id)
  /subscription/success                            Success (guard: completed flow in state)
  /profile                                         Profile & phone verification
/maintenance                     Bare              Maintenance page
*                                Bare              404
errorElement                     Bare              500 / route error boundary
```

## Layouts

- **PublicLayout** — dark stage background, centered content, minimal footer.
- **AuthLayout** — split screen: brand panel (hidden < lg) + form column; already-authed users are redirected to `/dashboard`.
- **DashboardLayout** — sidebar (≥ lg fixed, < lg drawer) + header (offer status chip, avatar menu) + `<main>` container (max-w 1200) + demo panel mount + `<Outlet/>` with animated presence.

## Guards & redirects

- `ProtectedRoute`: reads `useAuthStore` (Zustand, persisted). Unauthenticated → `/auth/login` with `state.from`; login/register success → `from ?? /dashboard`.
- `GuestRoute` (auth pages): authenticated → `/dashboard`.
- Success page requires `lastCompletedOrder` in subscription store; otherwise → `/dashboard`.
- `/subscribe` redirects to `/top-up/self` (with notice) when `for=self` and a self-subscription already exists.

## URL state

- Register step: `?step=bvn|confirm|verify` (guarded: can't jump ahead of completed data).
- Subscribe target: `?for=self|minor`.
- Top-up target: path param `accountId`.
