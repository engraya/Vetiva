import { HttpResponse, delay, http } from 'msw';
import { db, genCscs, nextDemoKid, saveDb } from './db';
import { BANKS } from '@/constants/banks';
import { OTHER_OFFERINGS } from '@/constants/offerings';
import { PAYMENT_METHODS } from '@/constants/payments';
import {
  ALLOTMENT_EXPECTED_AT,
  CLOSES_AT,
  MIN_AMOUNT,
  MIN_SHARES,
  OFFER_ID,
  OFFER_NAME,
  OFFER_TICKER,
  OPENS_AT,
  PRICE_PER_SHARE,
} from '@/constants/offer';
import { calcTotals } from '@/lib/fees';
import type {
  AuthResponse,
  BankResolveRequest,
  BvnLookupRequest,
  CreateSubscriptionRequest,
  CscsCreateRequest,
  CscsVerifyRequest,
  LoginRequest,
  NinVerifyRequest,
  OtpSendRequest,
  OtpVerifyRequest,
  RegisterRequest,
  TopUpRequest,
  UpdatePhoneRequest,
  VerifyPhoneRequest,
  WaitlistRequest,
} from '@/types/api';
import type { Offer, Order, Subscription } from '@/types/domain';
import { formatDate, maskTail } from '@/lib/utils';

const API = '/api/v1';
const TOKEN = 'demo-token-vetiva';

function apiError(status: number, code: string, message: string) {
  return HttpResponse.json({ code, message }, { status });
}

/**
 * The prototype's fixed [DEMO] dates drift into the past over time, which
 * would freeze the countdowns at zero. Keep the demo alive by projecting
 * an elapsed date forward while preserving the original wall-clock time.
 */
function keepInFuture(iso: string, minDaysAhead: number): string {
  const date = new Date(iso);
  if (date.getTime() > Date.now()) return iso;
  const projected = new Date();
  projected.setDate(projected.getDate() + minDaysAhead);
  projected.setHours(date.getHours(), date.getMinutes(), 0, 0);
  return projected.toISOString();
}

function currentOffer(): Offer {
  const opensAt = db.offerStatus === 'upcoming' ? keepInFuture(OPENS_AT, 3) : OPENS_AT;
  return {
    id: OFFER_ID,
    name: OFFER_NAME,
    ticker: OFFER_TICKER,
    status: db.offerStatus,
    pricePerShare: PRICE_PER_SHARE,
    minAmount: MIN_AMOUNT,
    minShares: MIN_SHARES,
    opensAt,
    closesAt: keepInFuture(CLOSES_AT, 20),
    allotmentExpectedAt: ALLOTMENT_EXPECTED_AT,
    prospectusUrl: '/demo/prospectus.pdf',
  };
}

function recordTxn(kind: 'subscription' | 'topup', sub: Subscription, total: number): void {
  const holderSuffix = sub.holderType === 'minor' ? ` — ${sub.holderName}` : '';
  db.txns.unshift({
    id: `txn-${Date.now()}`,
    label: `${OFFER_TICKER} IPO ${kind === 'topup' ? 'top-up' : 'subscription'}${holderSuffix}`,
    amount: total,
    when: `${formatDate(new Date().toISOString())} [DEMO]`,
  });
}

function buildOrder(
  kind: Order['kind'],
  sub: Subscription,
  shares: number,
  paymentMethodId: string,
): Order {
  const method = PAYMENT_METHODS.find((m) => m.id === paymentMethodId);
  const totals = calcTotals(method ?? PAYMENT_METHODS[0]!, shares, PRICE_PER_SHARE);
  return {
    id: `ord-${Date.now()}`,
    kind,
    subscriptionId: sub.id,
    holderType: sub.holderType,
    holderName: sub.holderName,
    minorName: sub.minor?.name,
    shares,
    amount: totals.amount,
    fee: totals.fee,
    total: totals.total,
    paymentMethodId,
    cscs: sub.cscs,
    positionShares: sub.shares,
    positionPaid: sub.amountPaid,
    positionPayments: sub.payments,
  };
}

export const handlers = [
  /* ------------------------------- auth ------------------------------- */
  http.post(`${API}/auth/bvn-lookup`, async ({ request }) => {
    const { bvn } = (await request.json()) as BvnLookupRequest;
    await delay(700);
    if (!/^\d{11}$/.test(bvn)) {
      return apiError(422, 'INVALID_BVN', 'BVN must be 11 digits');
    }
    const u = db.user;
    return HttpResponse.json({
      name: u.name,
      dob: formatDate(u.dob),
      phone: u.phone,
      email: u.email,
    });
  }),

  http.post(`${API}/auth/otp/send`, async ({ request }) => {
    (await request.json()) as OtpSendRequest;
    await delay(500);
    return HttpResponse.json({ sent: true, expiresIn: 300 });
  }),

  http.post(`${API}/auth/otp/verify`, async ({ request }) => {
    const { code } = (await request.json()) as OtpVerifyRequest;
    await delay(400);
    if (!/^\d{6}$/.test(code)) {
      return apiError(400, 'OTP_INVALID', 'The code you entered is not valid');
    }
    return HttpResponse.json({ verified: true });
  }),

  http.post(`${API}/auth/register`, async ({ request }) => {
    const body = (await request.json()) as RegisterRequest;
    await delay(800);
    db.user.email = body.email;
    db.user.accountType = body.accountType;
    saveDb();
    const res: AuthResponse = { token: TOKEN, user: db.user };
    return HttpResponse.json(res);
  }),

  http.post(`${API}/auth/login`, async ({ request }) => {
    const { email, password } = (await request.json()) as LoginRequest;
    await delay(700);
    if (!email || !password) {
      return apiError(401, 'BAD_CREDENTIALS', 'Incorrect email or password');
    }
    const res: AuthResponse = { token: TOKEN, user: db.user };
    return HttpResponse.json(res);
  }),

  /* ------------------------------ profile ----------------------------- */
  http.get(`${API}/me`, async () => {
    await delay(300);
    return HttpResponse.json(db.user);
  }),

  http.patch(`${API}/me/phone`, async ({ request }) => {
    const { phone } = (await request.json()) as UpdatePhoneRequest;
    await delay(500);
    if (!/^\d{11}$/.test(phone)) {
      return apiError(422, 'INVALID_PHONE', 'Phone number must be 11 digits');
    }
    db.user.phone = phone;
    db.user.phoneVerified = false;
    saveDb();
    return HttpResponse.json({ otpSent: true });
  }),

  http.post(`${API}/me/phone/verify`, async ({ request }) => {
    const { code } = (await request.json()) as VerifyPhoneRequest;
    await delay(500);
    if (!/^\d{6}$/.test(code)) {
      return apiError(400, 'OTP_INVALID', 'The code you entered is not valid');
    }
    db.user.phoneVerified = true;
    saveDb();
    return HttpResponse.json(db.user);
  }),

  /* ------------------------------- offers ----------------------------- */
  http.get(`${API}/offers/current`, async () => {
    await delay(350);
    return HttpResponse.json(currentOffer());
  }),

  http.get(`${API}/offers`, async () => {
    await delay(400);
    return HttpResponse.json({
      items: OTHER_OFFERINGS,
      page: 1,
      limit: 10,
      total: OTHER_OFFERINGS.length,
    });
  }),

  http.post(`${API}/waitlist`, async ({ request }) => {
    (await request.json()) as WaitlistRequest;
    await delay(600);
    db.waitlisted = true;
    saveDb();
    return HttpResponse.json({ joined: true });
  }),

  http.get(`${API}/waitlist/status`, async () => {
    await delay(200);
    return HttpResponse.json({ joined: db.waitlisted });
  }),

  /* --------------------------- verifications -------------------------- */
  http.post(`${API}/cscs/verify`, async ({ request }) => {
    const body = (await request.json()) as CscsVerifyRequest;
    await delay(650);
    if (!/^\d{11}$/.test(body.number)) {
      return apiError(
        404,
        'CSCS_NOT_FOUND',
        'We couldn’t find this account — check the number, or choose "I don’t have one".',
      );
    }
    const holderName = body.holder === 'minor' && body.nin ? nextDemoKid().name : db.user.name;
    return HttpResponse.json({ valid: true, holderName });
  }),

  http.post(`${API}/cscs/create`, async ({ request }) => {
    (await request.json()) as CscsCreateRequest;
    await delay(1400);
    return HttpResponse.json(
      { requestId: `cscs-req-${Date.now()}`, status: 'processing', number: genCscs() },
      { status: 202 },
    );
  }),

  http.post(`${API}/nin/verify`, async ({ request }) => {
    const { nin } = (await request.json()) as NinVerifyRequest;
    await delay(700);
    if (!/^\d{11}$/.test(nin)) {
      return apiError(422, 'INVALID_NIN', 'NIN must be 11 digits');
    }
    const kid = nextDemoKid();
    return HttpResponse.json({
      name: kid.name,
      dob: formatDate(kid.dob),
      ninMasked: maskTail(nin),
    });
  }),

  /* ------------------------------- banks ------------------------------ */
  http.get(`${API}/banks`, async () => {
    await delay(250);
    return HttpResponse.json(BANKS);
  }),

  http.post(`${API}/banks/resolve`, async ({ request }) => {
    const { accountNumber } = (await request.json()) as BankResolveRequest;
    await delay(650);
    if (!/^\d{10}$/.test(accountNumber)) {
      return apiError(404, 'ACCOUNT_NOT_FOUND', 'We couldn’t resolve this account number');
    }
    return HttpResponse.json({ accountName: db.user.name.toUpperCase() });
  }),

  /* ------------------------------ payments ---------------------------- */
  http.get(`${API}/payments/methods`, async () => {
    await delay(250);
    return HttpResponse.json(PAYMENT_METHODS);
  }),

  /* ---------------------------- subscriptions ------------------------- */
  http.get(`${API}/subscriptions`, async () => {
    await delay(400);
    return HttpResponse.json(db.subscriptions);
  }),

  http.post(`${API}/subscriptions`, async ({ request }) => {
    const body = (await request.json()) as CreateSubscriptionRequest;
    // Simulates payment confirmation — the prototype's "processing" beat
    await delay(1700);

    if (body.holder === 'self' && db.subscriptions.some((s) => s.holderType === 'self')) {
      return apiError(
        409,
        'ALREADY_SUBSCRIBED',
        'You have already subscribed for yourself. Use top-up to add more shares.',
      );
    }
    if (body.shares < MIN_SHARES) {
      return apiError(422, 'BELOW_MINIMUM', `Minimum subscription is ${MIN_SHARES} shares`);
    }

    const kid = body.holder === 'minor' ? nextDemoKid() : null;
    const sub: Subscription = {
      id: `sub-${Date.now()}`,
      holderType: body.holder,
      holderName: kid ? kid.name : db.user.name,
      minor:
        kid && body.minorNin ? { name: kid.name, dob: kid.dob, nin: body.minorNin } : undefined,
      cscs: body.cscs,
      shares: body.shares,
      amountPaid: body.shares * PRICE_PER_SHARE,
      payments: 1,
    };
    db.subscriptions.push(sub);
    const order = buildOrder('subscription', sub, body.shares, body.paymentMethodId);
    recordTxn('subscription', sub, order.total);
    saveDb();
    return HttpResponse.json(order);
  }),

  http.post(`${API}/subscriptions/:id/top-up`, async ({ request, params }) => {
    const body = (await request.json()) as TopUpRequest;
    await delay(1700);
    const sub = db.subscriptions.find((s) => s.id === params['id']);
    if (!sub) {
      return apiError(404, 'SUBSCRIPTION_NOT_FOUND', 'Subscription not found');
    }
    sub.shares += body.shares;
    sub.amountPaid += body.shares * PRICE_PER_SHARE;
    sub.payments += 1;
    const order = buildOrder('topup', sub, body.shares, body.paymentMethodId);
    recordTxn('topup', sub, order.total);
    saveDb();
    return HttpResponse.json(order);
  }),

  /* ---------------------------- transactions -------------------------- */
  http.get(`${API}/transactions`, async () => {
    await delay(350);
    return HttpResponse.json(db.txns);
  }),
];
