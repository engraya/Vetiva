import { expect, test } from '@playwright/test';
import { seedApp } from './helpers';

test('subscribed user tops up an existing position', async ({ page }) => {
  await seedApp(page, { subscribed: true });
  await page.goto('/offers');

  // Position visible above the offer card
  await expect(page.getByText('Your DPRP position')).toBeVisible();
  await expect(page.getByText('Your subscriptions')).toBeVisible();

  // Top up from the subscriptions list
  await page.getByRole('link', { name: 'Top up' }).first().click();
  await expect(page).toHaveURL(/\/top-up\//);
  await expect(page.getByText(/nothing else to re-enter/)).toBeVisible();

  await page.getByRole('checkbox', { name: /I understand and agree/ }).check();
  await page.getByRole('button', { name: 'Pay top-up' }).click();

  await expect(page.getByRole('heading', { name: 'Top-up successful!' })).toBeVisible({
    timeout: 15_000,
  });

  // The payment shows up as a wallet transaction (client-side navigation
  // keeps the seeded DB intact — a full reload would re-run the init seed)
  await page
    .getByRole('navigation', { name: 'Main' })
    .first()
    .getByRole('link', { name: 'Wallet' })
    .click();
  await expect(page.getByText('Recent Transactions')).toBeVisible();
  await expect(page.getByText('DPRP IPO top-up').first()).toBeVisible();
});
