import { expect, test } from '@playwright/test';
import { seedApp } from './helpers';

test('new user registers and subscribes for themselves', async ({ page }) => {
  await seedApp(page, { authenticated: false });
  await page.goto('/');

  // Entry ("Get started")
  await expect(page.getByRole('heading', { name: 'Get started' })).toBeVisible();
  await page.getByRole('link', { name: 'Create new account' }).click();

  // Step 1 — BVN
  await expect(page.getByRole('heading', { name: 'Verify your identity' })).toBeVisible();
  await page.getByRole('button', { name: /Use demo BVN/ }).click();
  await page.getByRole('button', { name: 'Continue' }).click();

  // Step 2 — confirm identity
  await expect(page.getByRole('heading', { name: 'Is this you?' })).toBeVisible();
  await expect(page.getByText('Adaeze Okafor')).toBeVisible();
  await page.getByRole('button', { name: 'Send verification code' }).click();

  // Step 3 — verify + password
  await expect(page.getByRole('heading', { name: 'Verify your email' })).toBeVisible();
  await page.getByRole('button', { name: /Autofill code/ }).click();
  await page.getByLabel('Create a password').fill('Demo1234');
  await page.getByLabel('Re-enter password').fill('Demo1234');
  await page.getByRole('button', { name: 'Finish setup' }).click();

  // Registration lands on the Offers page
  await expect(page).toHaveURL(/\/offers/);
  await expect(page.getByText('Explore. Invest. Own.')).toBeVisible();
  await expect(page.getByText('Dangote Petroleum Refinery & Petrochemicals')).toBeVisible();

  // Subscribe
  await page.getByRole('link', { name: 'Subscribe now' }).click();
  await expect(page).toHaveURL(/\/subscribe/);

  // CSCS via demo number
  await page.getByRole('button', { name: /Use demo number/ }).click();
  await expect(page.getByText(/account verified/i)).toBeVisible();

  // Dividend bank account
  await page.getByLabel('Bank', { exact: true }).selectOption({ label: 'GTBank' });
  await page.getByLabel('Account number', { exact: true }).fill('0123456789');
  await expect(page.getByText('ADAEZE OKAFOR').first()).toBeVisible();

  // Acknowledge + submit
  await page.getByRole('checkbox', { name: /I understand and agree/ }).check();
  const submit = page.getByRole('button', { name: 'Submit subscription' });
  await expect(submit).toBeEnabled();
  await submit.click();

  // Success
  await expect(page.getByRole('heading', { name: 'Subscription submitted!' })).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByText('What happens next')).toBeVisible();
});
