import type { OfferStatus, Subscription, User } from '@/types/domain';

/**
 * Seedable in-memory database backing the MSW handlers.
 * Persisted to localStorage so reloads keep demo state; the demo panel
 * reseeds it via `seedScenario`.
 */

export type DemoScenario = 'new-user' | 'prelive' | 'live-fresh' | 'subscribed';

export interface DemoDb {
  user: User;
  offerStatus: OfferStatus;
  waitlisted: boolean;
  subscriptions: Subscription[];
}

const STORAGE_KEY = 'vetiva-demo-db';

/** [DEMO] identity pulled by BVN lookup in the prototype */
export const DEMO_USER: User = {
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

export const DEMO_KIDS = [
  { name: 'Chidi Okafor', dob: '2017-03-14' },
  { name: 'Amara Okafor', dob: '2019-06-02' },
  { name: 'Emeka Okafor', dob: '2021-11-23' },
] as const;

export const DEMO_OTP = '482917';

function defaultDb(): DemoDb {
  return {
    user: { ...DEMO_USER },
    offerStatus: 'live',
    waitlisted: false,
    subscriptions: [],
  };
}

function load(): DemoDb {
  if (typeof localStorage === 'undefined') return defaultDb();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultDb();
    return { ...defaultDb(), ...(JSON.parse(raw) as DemoDb) };
  } catch {
    return defaultDb();
  }
}

export const db: DemoDb = load();

export function saveDb(): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

export function genCscs(): string {
  return '5' + String(Math.floor(1e9 + Math.random() * 9e9));
}

export function nextDemoKid(): { name: string; dob: string } {
  const minorCount = db.subscriptions.filter((s) => s.holderType === 'minor').length;
  const kid = DEMO_KIDS[minorCount % DEMO_KIDS.length] ?? DEMO_KIDS[0];
  return { name: kid.name, dob: kid.dob };
}

export function seedScenario(scenario: DemoScenario): void {
  const fresh = defaultDb();
  Object.assign(db, fresh);

  switch (scenario) {
    case 'new-user':
      db.user.phoneVerified = false;
      break;
    case 'prelive':
      db.offerStatus = 'upcoming';
      break;
    case 'live-fresh':
      break;
    case 'subscribed':
      db.subscriptions = [
        {
          id: 'sub-self',
          holderType: 'self',
          holderName: DEMO_USER.name,
          cscs: '56854667865',
          shares: 1000,
          amountPaid: 1000 * 245.5,
          payments: 2,
        },
        {
          id: 'sub-minor-1',
          holderType: 'minor',
          holderName: DEMO_KIDS[0].name,
          minor: { name: DEMO_KIDS[0].name, dob: DEMO_KIDS[0].dob, nin: '98765432101' },
          cscs: genCscs(),
          shares: 500,
          amountPaid: 500 * 245.5,
          payments: 1,
        },
      ];
      break;
  }
  saveDb();
}
