# 01 — Product Specification (Phases A & B)

Reverse-engineered from the mobile prototype at `https://nonsou.github.io/vetiva-ipo-demo/` ("Flow Demo v3", single-file HTML prototype). This document is the canonical product spec the desktop application implements.

## 1. Product overview

**Vetiva IPO** lets retail investors subscribe to Nigerian IPOs — flagship offer: **Dangote Petroleum Refinery & Petrochemicals (DPRP)** at **₦245.50/share**, minimum investment **₦100,000**, open **10 Jul 2026 09:00 WAT → 31 Jul 2026 17:00 WAT**. All figures are placeholders and tagged `[DEMO]` in the UI.

Core value propositions:

1. **Frictionless onboarding** — BVN-first identity: user enters BVN, we pull name/DOB/phone, they confirm, verify email OTP, set a password. Three inputs to an account.
2. **One-page subscription** — the entire purchase (who-for → quantity → CSCS → dividends → payment) lives on one page with a sticky amount + submit.
3. **Family investing** — subscribe for minors via the child's NIN; guardian model with automatic account conversion at 18.
4. **Inline CSCS creation** — users without a Vetiva CSCS account get one created inline (no interstitial), request processes asynchronously.

## 2. Actors & account types

| Actor               | Notes                                                                                                                                                     |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Individual investor | Primary persona (demo: Adaeze Okafor). BVN-verified.                                                                                                      |
| Minor (dependent)   | Verified via NIN; user is recorded as guardian; dividends → guardian bank; converts to sole control at 18.                                                |
| Corporate           | Selector exists on entry; onboarding uses CAC/RC instead of BVN — **flow marked "TO BE SPECIFIED"**, proceeds as Individual with an informational notice. |

## 3. Screen inventory

### 3.1 Entry / Landing (`entry`)

- Vetiva wordmark, hero illustration (olive gradient circle, 📈), headline **"Invest in Nigeria's biggest IPOs"**, sub-lead referencing the DPRP offer.
- **"I'm subscribing as"** segmented control: 🙋 Individual / 🏢 Corporate. Corporate selection reveals warning band: _"Corporate onboarding uses CAC/RC verification instead of BVN"_ + DEMO tag.
- CTAs: **Create new account** (primary) / **I already have an account** (ghost).

### 3.2 Registration — BVN (`bvn`)

- Title "Verify your identity", lead "Enter your BVN to get started."
- Single numeric input, maxlength 11, digits only (input sanitized live).
- Inline error "BVN must be 11 digits" shown once user has typed and count < 11; input gets error border.
- Hint: "Used only to verify your identity — never shared."
- Demo affordance: "Use demo BVN" link fills `22212345678`.
- **Continue** disabled until exactly 11 digits.

### 3.3 Registration — Confirm identity (`isYou`)

- Title "Is this you?", lead "We pulled these details from your BVN."
- Avatar (initials) + card of read-only rows: Full name, Date of birth, Phone number.
- Hint: BVN data can't be edited here; phone verifiable later from profile.
- **Email address** input, prefilled from BVN, editable ("this creates your account").
- Escape hatch: "Not you? Re-enter BVN" → back to BVN screen.
- CTA: **Send verification code**.

### 3.4 Registration — Verify & secure (`verify`)

- 6 single-character OTP boxes (numeric, auto-advance on input, backspace moves back). Demo autofill link (code `482917`).
- Hint about phone verification later.
- **Create a password** + **Re-enter password**, each with Show/Hide toggle. Rule: alphanumeric, ≥ 8 chars (`(?=.*[A-Za-z])(?=.*\d).{8,}`). Mismatch error under confirm field.
- **Finish setup** disabled until OTP complete + password valid + match. Success → registered, toast "Account created — welcome, {firstName}!", land on live or pre-live.

### 3.5 Login (`login`)

- Email + password (Show/Hide), "Enable biometric unlock" checkbox tagged NICE-TO-HAVE.
- **Log in** → toast "Logged in", land on live/pre-live.

### 3.6 Pre-live landing (`prelive`)

- Header: wordmark + avatar button (→ profile).
- Offer card (subtle gradient): chip **OPENS SOON** (amber), offer name + ticker, "Offer opens: 10 Jul 2026, 9:00 AM", live **countdown** (days/hrs/min/sec, tabular numerals).
- Waitlist: **Join the waiting list** button → bottom sheet with Email/WhatsApp segmented choice + **Notify me**; after joining, card shows green ok-band "You're on the waiting list…".
- "Download the offer prospectus →" link (toasts a demo message).
- **Other offerings** horizontal rail: Vetiva Money Market Fund (18.2% p.a.), Vetiva Griffin 30 ETF (+24.6% YTD), Dollar Fund (6.1% p.a.) — all DEMO-tagged.

### 3.7 Live landing (`live`)

- Header as above.
- If subscribed: **position card** (olive gradient, radial sheen): "Your DPRP position", total shares, "₦X across N account(s)"; **subscriptions list** (avatar initials, holder name, shares · paid · payments count, **Top up** pill button per row).
- Offer card: chip **LIVE** (green, pulsing dot), name/ticker, rows: Price per share ₦245.50, Minimum 500 shares (₦122,750.00), Offer closes 31 Jul 2026 5:00 PM, closing **countdown**, prospectus link.
- CTA: **Subscribe now** (or **Subscribe for a child** if self already subscribed) + **📤 Share this IPO** when subscribed.
- If phone unverified: nudge card "Verify your phone number… Verify →" (→ profile).

### 3.8 Profile (`profile`)

- Identity card: Full name, DOB, Email + green ✓ VERIFIED chip.
- **Phone number** section with UNVERIFIED (amber) / ✓ VERIFIED (green) chip. Editable 11-digit input.
- "Send verification code" → inline 6-box SMS OTP + autofill + **Verify phone number**. Success → toast "Phone number verified ✓", section re-renders verified. Re-verification supported ("Update & re-verify number").

### 3.9 Subscribe one-pager (`subscribe`)

Sections top-to-bottom (single page, sticky footer):

1. **Offer strip** — name, ticker · ₦245.50/share · closes 31 Jul, LIVE chip.
2. **👤 Who is this subscription for?** — segmented Myself / A minor.
   - _Myself_: green ok-band with user's name. If already self-subscribed: warning band + "Top up instead →" link (self can only subscribe once).
   - _A minor_: **Child's NIN** input (11 digits) → on 11 digits, child resolves (name, DOB, masked NIN) with ok-band + note "When {child} turns 18, the account converts to their sole control." Demo NIN affordance.
3. **🧮 Number of shares** — stepper (−/+ round buttons, numeric input) + quick picks 500 / 1,000 / 5,000 / 10,000 (selected pick shows ✓) + hint stating minimum and current rounding step + **math line**: `{shares} shares × ₦245.50 = ₦amount`.
4. **🏛️ CSCS** — question adapts to self/minor. 11-digit input → inline verification ok-band (holder name, "account verified"); wrong length shows error line. Alternative **"I don't know / I don't have one"** option row → input disabled, inline spinner "Requesting your CSCS account…", ~1.4 s later ok-band "CSCS creation request received and is processing…" + undo link "I actually have one — enter it instead."
5. **🏦 Bank account** (dividends) — _self_: bank select (Access, GTBank, Zenith, UBA, First Bank) → 10-digit account number → resolved holder-name ok-band. _Minor_: read-only guardian bank card with GUARDIAN chip (auto-valid).
6. **🎟️ Invitation code (Optional)** — free text (e.g. `DPRP-AOK24`). Hidden for minors.
7. **💳 How would you like to pay?** — radio cards, each: icon, name, fee label, **computed total** (fee added on top):
   - Bank transfer — no fee — **CHEAPEST** badge (default)
   - Flutterwave · Card (NGN) — 1.4%
   - Paystack · Card (NGN) — 1.5% + ₦100
   - Flutterwave · Card (USD) — 3.8% + FX; shows `$total ≈ ₦total @ ₦1,470/$` and an FX warning band when selected.
8. **Summary card** — `{shares} × price`, payment fee line, **Total** (USD shows both).
9. **⚠️ Danger box** — "Subscription is final and irreversible… cannot be cancelled or reversed" + **"I understand and agree"** checkbox.
10. **Sticky footer** — "Subscription amount" + total + **Submit subscription**.

**Submit enabled only when:** irreversible ✓ ∧ shares ≥ min ∧ CSCS resolved ∧ dividend account valid ∧ (minor ⇒ child verified) ∧ (self ⇒ no existing self-subscription).

### 3.10 Top-up (`topup`)

- Recap card: current position (holder, shares, paid) + "CSCS {number} — nothing else to re-enter."
- Shares (floor **100**, same stepper/quick-picks/math), payment methods, summary, irreversibility ack, sticky footer **Pay top-up**.

### 3.11 Processing (`processing`)

- Spinner + "Confirming your transfer…" (bank transfer) or "Processing payment…" (cards); method + amount; auto-advances ~1.7 s. `[DEMO — completes instantly]`.

### 3.12 Success (`success`)

- Halo ✓ pop animation. Title "Subscription submitted!" / "Top-up successful!".
- Personalized message ("Thank you, Adaeze. Your subscription for N shares… received successfully [for {child}]").
- Amount card: big total (incl. fee note or "no fee"), Shares (+payments summary on top-up), CSCS account, Account holder (minor: "{child} (guardian: you)").
- **What happens next** timeline: ✓ Application created → ✓ Funds received → ✓ CSCS account linked → Allotment (expected 8 Aug 2026; oversubscription note) → Shares credited → Listing day (tradable).
- Actions: 📤 Share this IPO / ＋ Top up this subscription / 🧒 Subscribe for a(nother) child / 🧾 Download receipt / Done.
- Phone-verify tip if unverified.

### 3.13 Overlays & global elements

- **Waitlist bottom sheet** (→ desktop modal): Email/WhatsApp segment, Notify me, Cancel, dismiss on veil click.
- **Toast** — bottom-center dark pill, 2.6 s, `role="status"`.
- **Share** — `navigator.share` w/ clipboard fallback; message: "I just subscribed to the {offer} IPO on Vetiva 🚀 …".
- **Presenter rail** (demo tooling): journeys (new user, returning), state jumps (pre-live, live fresh, minor, subscribed), reset.

## 4. User flows

```
NEW USER    entry → bvn → isYou → verify ─→ live (or prelive)
RETURNING   entry → login ─→ live (or prelive)
PRE-LIVE    prelive → waitlist sheet → joined (ok-band) → [offer goes live] → live
SUBSCRIBE   live → subscribe(self) → processing → success → [share|topup|minor|done]
MINOR       live/success → subscribe(minor: NIN→child) → processing → success
TOP-UP      live(position row)|success → topup → processing → success
PROFILE     any header avatar → profile → phone OTP → verified
```

## 5. States catalogue

| Kind    | Instances                                                                                                         |
| ------- | ----------------------------------------------------------------------------------------------------------------- |
| Empty   | Live landing before any subscription (no position card); CSCS feedback empty                                      |
| Loading | Processing screen; inline CSCS-creation spinner; button-level pending states                                      |
| Success | Ok-bands (identity, CSCS verified/creating, bank resolved, waitlist joined); success page; verified chips; toasts |
| Error   | BVN/NIN length errors; CSCS not found; password mismatch; disabled submits                                        |
| Warning | Corporate notice; already-subscribed redirect; FX rate band; irreversibility danger box; unverified-phone nudge   |

## 6. Copy & tone

Warm, direct, second person ("We pulled these details…", "So you don't miss communications from us"). Nigerian market vocabulary (BVN, NIN, CSCS, NGX, allotment). Financial amounts always ₦ with 2 decimals and tabular numerals. Every fake figure carries a `DEMO` tag.
