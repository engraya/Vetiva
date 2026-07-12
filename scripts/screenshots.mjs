import { chromium } from '@playwright/test';

const OUT = process.argv[2];
const BASE = 'http://localhost:5199';

const DEMO_USER = {
  id: 'u-adaeze',
  name: 'Adaeze Okafor',
  firstName: 'Adaeze',
  email: 'adaeze.okafor@gmail.com',
  phone: '08031234567',
  dob: '1990-09-12',
  bankName: 'Access Bank',
  bankAccount: '5635665556',
  accountType: 'individual',
  emailVerified: true,
  phoneVerified: false,
};

function seed(offerStatus, subscribed, authenticated) {
  const db = {
    user: DEMO_USER,
    offerStatus,
    waitlisted: false,
    subscriptions: subscribed
      ? [
          {
            id: 'sub-self',
            holderType: 'self',
            holderName: DEMO_USER.name,
            cscs: '56854667865',
            shares: 1000,
            amountPaid: 245500,
            payments: 2,
          },
          {
            id: 'sub-minor-1',
            holderType: 'minor',
            holderName: 'Chidi Okafor',
            minor: { name: 'Chidi Okafor', dob: '2017-03-14', nin: '98765432101' },
            cscs: '51234567890',
            shares: 500,
            amountPaid: 122750,
            payments: 1,
          },
        ]
      : [],
    txns: subscribed
      ? [
          { id: 'txn-3', label: 'DPRP IPO top-up', amount: 122750, when: '9 Jul 2026 [DEMO]' },
          {
            id: 'txn-2',
            label: 'DPRP IPO subscription — Chidi Okafor',
            amount: 122750,
            when: '8 Jul 2026 [DEMO]',
          },
          {
            id: 'txn-1',
            label: 'DPRP IPO subscription',
            amount: 122750,
            when: '8 Jul 2026 [DEMO]',
          },
        ]
      : [],
  };
  const auth = authenticated
    ? { state: { token: 'demo-token-vetiva', user: DEMO_USER, isAuthenticated: true }, version: 0 }
    : { state: { token: null, user: null, isAuthenticated: false }, version: 0 };
  return { db: JSON.stringify(db), auth: JSON.stringify(auth) };
}

const browser = await chromium.launch();

async function shot(
  name,
  path,
  {
    offerStatus = 'live',
    subscribed = false,
    authenticated = true,
    width = 1440,
    height = 1000,
    fullPage = true,
  } = {},
) {
  const ctx = await browser.newContext({ viewport: { width, height } });
  const page = await ctx.newPage();
  const { db, auth } = seed(offerStatus, subscribed, authenticated);
  await page.addInitScript(
    ([d, a]) => {
      localStorage.setItem('vetiva-demo-db', d);
      localStorage.setItem('vetiva-auth', a);
    },
    [db, auth],
  );
  await page.goto(BASE + path, { waitUntil: 'domcontentloaded' });
  // Fixed settle time — remote [DEMO] slider imagery keeps networkidle busy
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage });
  await ctx.close();
  console.log('done:', name);
}

await shot('01-entry', '/', { authenticated: false });
await shot('02-login', '/auth/login', { authenticated: false });
await shot('03-register-bvn', '/auth/register', { authenticated: false });
await shot('04-home', '/dashboard', { subscribed: true });
await shot('05-offers-live-fresh', '/offers');
await shot('06-offers-prelive', '/offers', { offerStatus: 'upcoming' });
await shot('07-offers-subscribed', '/offers', { subscribed: true });
await shot('08-offers-history', '/offers?tab=history', { subscribed: true });
await shot('09-subscribe', '/subscribe');
await shot('10-subscribe-minor', '/subscribe?for=minor');
await shot('11-topup', '/top-up/sub-self', { subscribed: true });
await shot('12-wallet', '/wallet', { subscribed: true });
await shot('13-portfolio', '/portfolio', { subscribed: true });
await shot('14-products', '/products');
await shot('15-profile', '/profile');
await shot('16-home-mobile', '/dashboard', { subscribed: true, width: 390, height: 844 });

await browser.close();
