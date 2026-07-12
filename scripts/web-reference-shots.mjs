/**
 * Screenshots the APPROVED web flow (web.html) in matching states, for
 * side-by-side comparison with the React app. Usage:
 *   node scripts/web-reference-shots.mjs <webHtmlPathOrUrl> <outDir>
 */
import { chromium } from '@playwright/test';
import path from 'node:path';

const SRC = process.argv[2];
const OUT = process.argv[3];
const target = SRC.startsWith('http') ? SRC : 'file:///' + path.resolve(SRC).replace(/\\/g, '/');

const browser = await chromium.launch();

async function shot(name, setup) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await ctx.newPage();
  await page.goto(target, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(400);
  await page.evaluate(setup);
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  await ctx.close();
  console.log('done:', name);
}

await shot('01-entry', `demo.newUser()`);
await shot('02-login', `demo.oldUser()`);
await shot('03-register-bvn', `demo.newUser(); go('bvn')`);
await shot('04-home', `demo.subscribed(); go('dashHome')`);
await shot('05-offers-live-fresh', `demo.liveFresh()`);
await shot('06-offers-prelive', `demo.prelive()`);
await shot('07-offers-subscribed', `demo.subscribed()`);
await shot('08-offers-history', `demo.subscribed(); go('dashOffers',{tab:'history'})`);
await shot('09-subscribe', `demo.liveFresh(); go('subscribe',{mode:'self'})`);
await shot('10-subscribe-minor', `demo.minor()`);
await shot('11-topup', `demo.subscribed(); go('topup',{for:'self'})`);
await shot('12-wallet', `demo.subscribed(); go('dashWallet')`);
await shot('13-portfolio', `demo.subscribed(); go('dashPortfolio')`);
await shot('14-products', `demo.liveFresh(); go('dashInvest')`);
await shot('15-profile', `demo.liveFresh(); go('profile')`);

await browser.close();
