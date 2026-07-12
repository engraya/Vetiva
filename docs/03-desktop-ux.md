# 03 — Desktop UX Proposal & UX Analysis (Phases D + UX/A11y)

> **Superseded in part by the approved web flow** (`web.html`), which is the implementation's
> source of truth: white portal shell, auth image-slider card, five-section dashboard
> (Home / Wallet / Offers / Products / Portfolio), and a single-column 720px subscribe
> one-pager with a sticky footbar. See doc 04 for the final IA. The accessibility guidance
> below still applies unchanged.

## 1. Why each screen exists

| Screen                 | Job to be done                                                                           | Key friction removed                                                |
| ---------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Landing                | Convert visitor → registrant; set account-type context early                             | Corporate users learn upfront their path differs                    |
| BVN → Confirm → Secure | Regulatory KYC with minimum typing                                                       | BVN pre-fills identity; only email + password are typed             |
| Pre-live               | Capture demand before the window opens                                                   | Waitlist + countdown converts impatience into a notification lead   |
| Live                   | Single source of truth for the offer + user's position                                   | Countdown urgency; position visible without navigation              |
| Subscribe one-pager    | Complete an irreversible financial commitment confidently                                | No wizard amnesia — everything reviewable on one page before submit |
| Top-up                 | Repeat purchase with zero re-entry                                                       | CSCS/bank reused; only quantity + payment                           |
| Success                | Confirm + set expectations (allotment timeline) + drive next action (share/top-up/minor) | Timeline answers "what now?" pre-emptively                          |
| Profile                | Keep contact channels verified for allotment comms                                       | Inline OTP, no separate settings maze                               |

## 2. Desktop transformation decisions

The desktop app must feel **originally designed for desktop** — not a stretched phone. Decisions per area:

| Mobile pattern                         | Desktop decision                                                                                                                                                                                                     | Rationale                                                                                                              |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Full-screen stacked auth screens       | **Split-screen auth layout**: dark-olive brand panel (value prop, offer teaser, live chip) left; 440px form column right. Registration = **3-step wizard with visible step indicator** (Identity → Confirm → Secure) | Desktop real estate supports reassurance content beside forms; visible progress reduces abandonment                    |
| No persistent nav (header avatar only) | **Sidebar navigation** (264px: Dashboard, Subscribe, Profile + Support placeholder) + slim top header (offer chip, avatar menu)                                                                                      | Bottom tabs don't exist on desktop; sidebar is the fintech-dashboard convention (Stripe/Linear)                        |
| Single-column landing cards            | **Dashboard grid**: offer hero (8 cols) + right rail (4 cols) of **stat cards** (Total shares, Total invested, Accounts) and quick actions                                                                           | Scanning beats scrolling on desktop                                                                                    |
| Subscriptions card list                | **Table** ≥ md (Holder / CSCS / Shares / Invested / Payments / action), cards below                                                                                                                                  | Tabular data belongs in tables; sortable-ready                                                                         |
| One-pager with sticky bottom bar       | **Two-column subscribe**: form sections left (7 cols, numbered); **sticky order-summary panel** right (5 cols) holding live math, fee, total, irreversibility ack + submit                                           | Order summary always in view = the desktop-commerce pattern (checkout); sticky footer wastes vertical space on desktop |
| Bottom sheet (waitlist)                | **Centered modal dialog** with focus trap                                                                                                                                                                            | Sheets are a thumb-reach pattern; dialogs are the desktop equivalent                                                   |
| Bottom-center toast                    | **Top-right toasts** (sonner)                                                                                                                                                                                        | Desktop eye-line convention                                                                                            |
| Horizontal offerings rail              | **3-up card grid**                                                                                                                                                                                                   | No horizontal scrolling on desktop                                                                                     |
| Presenter rail                         | **Floating "Demo scenarios" panel** (bottom-right, Ctrl+.)                                                                                                                                                           | Scenario switching is core to the demo's purpose; kept but restyled + DEMO-badged                                      |

Desktop-only enhancements (brand-preserving): hover elevations on cards/rows, keyboard-first OTP entry, focus-visible rings everywhere, dismissible phone-verify banner, error/404/500/maintenance pages, skeleton loaders for query states.

## 3. Accessibility (WCAG 2.1 AA)

- **Contrast** (verified): ink on cream 15.9:1 ✓ · muted `#6E7261` on cream 4.7:1 ✓ · button text `#F7F8EF` on olive-deep gradient end 4.9:1 ✓ (gradient start is large-text/decorative; label sits over mid-deep zone) · good-deep on good-soft 6.2:1 ✓ · amber-deep on amber-soft 7.4:1 ✓ · bad on bad-soft 4.6:1 ✓. Chips (11px bold uppercase) use deep variants for text.
- **Keyboard**: full tab order; segmented controls = `role="radiogroup"` with arrow keys; OTP boxes auto-advance/backspace + paste-distribution; dialogs trap focus and restore on close; skip-to-content link in shell.
- **Screen readers**: countdown wrapped in `aria-live="off"` with an `aria-label` summary (avoid per-second announcements); toasts `role="status"`; form fields with `<label htmlFor>`, errors linked via `aria-describedby` + `aria-invalid`; payment radio-cards = native radio inputs visually hidden; irreversibility box `role="alert"` on reveal.
- **Semantics**: `<main>/<nav>/<aside>/<header>`, landmark labels, `<table>` with `<th scope>`, buttons vs links used correctly.
- **Reduced motion**: all Framer variants gated by `useReducedMotion`; CSS pulse/spin slowed or removed under the media query.

## 4. UX improvements (identity-preserving)

1. Register wizard keeps state across steps + browser back (URL-driven step).
2. Password strength hint shows the rule proactively instead of only disabling submit.
3. Order summary shows the fee delta per payment method before selection (already in cards) **and** re-states the chosen method at submit.
4. Table rows deep-link to top-up with holder context.
5. Success page offers "Back to dashboard" as the primary escape (mobile buried "Done" as a link).
6. Empty dashboard state gets an explicit "You haven't subscribed yet" panel with CTA (mobile just omitted the position card).
