import { expect, test } from '@playwright/test';
import { seedApp } from './helpers';

test('subscribed user tops up an existing position', async ({ page }) => {
  await seedApp(page, { subscribed: true });
  await page.goto('/dashboard');

  // Position visible
  await expect(page.getByText('Your DPRP position')).toBeVisible();
  await expect(page.getByText('Your subscriptions')).toBeVisible();

  // Top up from the table
  await page.getByRole('link', { name: 'Top up' }).first().click();
  await expect(page).toHaveURL(/\/top-up\//);
  await expect(page.getByText(/nothing else to re-enter/)).toBeVisible();

  await page.getByRole('checkbox', { name: /I understand and agree/ }).check();
  await page.getByRole('button', { name: 'Pay top-up' }).click();

  await expect(page.getByRole('heading', { name: 'Top-up successful!' })).toBeVisible({
    timeout: 15_000,
  });
});
