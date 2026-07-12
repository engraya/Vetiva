import type { Page } from '@playwright/test';

/** Demo user snapshot matching src/mocks/db.ts */
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

interface SeedOptions {
  offerStatus?: 'upcoming' | 'live';
  subscribed?: boolean;
  authenticated?: boolean;
}

/** Seeds the mock DB + auth session in localStorage before the app boots. */
export async function seedApp(
  page: Page,
  { offerStatus = 'live', subscribed = false, authenticated = true }: SeedOptions = {},
): Promise<void> {
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
        ]
      : [],
    txns: subscribed
      ? [
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

  await page.addInitScript(
    ([dbJson, authJson]) => {
      localStorage.setItem('vetiva-demo-db', dbJson as string);
      localStorage.setItem('vetiva-auth', authJson as string);
    },
    [JSON.stringify(db), JSON.stringify(auth)],
  );
}
