# 06 — API Contracts (Phase I)

Production REST design, implemented 1:1 by MSW in `src/mocks/handlers/`. Base URL `/api/v1`. All responses use the envelope below; types live in `src/types/api.ts`.

```ts
type ApiError = { code: string; message: string; details?: Record<string, string> };
// 2xx → resource body directly; 4xx/5xx → ApiError
```

Auth: mock bearer token via `Authorization` header (axios interceptor). 401 → session cleared → redirect to login.

## Endpoints

| Method & path                    | Request                                                                                | Response                                                                                                         | Notes                                          |
| -------------------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `POST /auth/bvn-lookup`          | `{ bvn }`                                                                              | `{ name, dob, phone, email }`                                                                                    | 422 `INVALID_BVN`                              |
| `POST /auth/otp/send`            | `{ channel: 'email'\|'sms', destination }`                                             | `{ sent: true, expiresIn }`                                                                                      |                                                |
| `POST /auth/otp/verify`          | `{ destination, code }`                                                                | `{ verified: true }`                                                                                             | 400 `OTP_INVALID`                              |
| `POST /auth/register`            | `{ bvn, email, password, accountType }`                                                | `{ token, user }`                                                                                                |                                                |
| `POST /auth/login`               | `{ email, password }`                                                                  | `{ token, user }`                                                                                                | 401 `BAD_CREDENTIALS`                          |
| `GET /me`                        | —                                                                                      | `User`                                                                                                           |                                                |
| `PATCH /me/phone`                | `{ phone }`                                                                            | `{ otpSent: true }`                                                                                              | then `POST /me/phone/verify { code }` → `User` |
| `GET /offers/current`            | —                                                                                      | `Offer` (status `upcoming\|live\|closed`, pricePerShare, minAmount, minShares, opensAt, closesAt, prospectusUrl) |                                                |
| `GET /offers?status=open`        | paging `?page&limit`                                                                   | `Paginated<OfferingSummary>`                                                                                     | other offerings                                |
| `POST /waitlist`                 | `{ offerId, channel }`                                                                 | `{ joined: true }`                                                                                               |                                                |
| `POST /cscs/verify`              | `{ number, holder: 'self'\|'minor', nin? }`                                            | `{ valid, holderName }`                                                                                          | 404 `CSCS_NOT_FOUND`                           |
| `POST /cscs/create`              | `{ holder, nin? }`                                                                     | **202** `{ requestId, status: 'processing' }`                                                                    | async creation                                 |
| `POST /nin/verify`               | `{ nin }`                                                                              | `{ name, dob, ninMasked }`                                                                                       | 422 `INVALID_NIN`                              |
| `GET /banks`                     | —                                                                                      | `Bank[]`                                                                                                         |                                                |
| `POST /banks/resolve`            | `{ bankCode, accountNumber }`                                                          | `{ accountName }`                                                                                                | 404 `ACCOUNT_NOT_FOUND`                        |
| `GET /payments/methods`          | —                                                                                      | `PaymentMethod[]` (id, label, icon, feeRule, currency)                                                           | fee schedule is server data                    |
| `GET /subscriptions`             | —                                                                                      | `Subscription[]` (id, holderType, holderName, cscs, shares, amountPaid, payments)                                |                                                |
| `POST /subscriptions`            | `{ offerId, holder, shares, cscs, dividendAccount, paymentMethodId, invitationCode? }` | `Order` (id, totals, feeBreakdown, timeline)                                                                     | 409 `ALREADY_SUBSCRIBED` for self              |
| `POST /subscriptions/:id/top-up` | `{ shares, paymentMethodId }`                                                          | `Order`                                                                                                          |                                                |

## Client behaviour policy

- **Loading**: skeletons for queries, pending buttons for mutations; subscription submit → processing state until order resolves (mock latency ~1.7 s).
- **Retry**: queries retry 2× (except 4xx); mutations never auto-retry (financial).
- **Optimistic updates**: none for money movements (by design); phone-verify and waitlist update caches on success via `invalidateQueries`.
- **Pagination/filter/sort**: `?page&limit&sort&q` convention (offerings endpoint demonstrates it; subscriptions list is small and unpaginated).
- **Fees**: `feeRule` is data — `{ type: 'flat', value }` · `{ type: 'percent', pct }` · `{ type: 'percentPlusFixed', pct, fixed }` · `{ type: 'percentFx', pct, fxRate }` — evaluated client-side by `lib/fees.ts` for live totals, re-validated server-side on submit.
