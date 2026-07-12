import { expect, test } from '@playwright/test';
import { seedApp } from './helpers';

test('pre-live user joins the waiting list from the Offers page', async ({ page }) => {
  await seedApp(page, { offerStatus: 'upcoming' });
  await page.goto('/offers');

  await expect(page.getByText('Opens soon').first()).toBeVisible();
  await page.getByRole('button', { name: 'Join the waiting list' }).click();

  const dialog = page.getByRole('dialog', { name: 'Join the waiting list' });
  await expect(dialog).toBeVisible();
  await dialog.getByText('WhatsApp').click();
  await dialog.getByRole('button', { name: 'Notify me' }).click();

  await expect(page.getByText(/You're on the (list|waiting list)/).first()).toBeVisible();
});

test('app shell exposes the five approved sections', async ({ page }) => {
  await seedApp(page, { subscribed: true });
  await page.goto('/dashboard');

  // Home widgets
  await expect(page.getByText('Get your money working')).toBeVisible();
  await expect(page.getByText('Total balance', { exact: false })).toBeVisible();

  const nav = page.getByRole('navigation', { name: 'Main' }).first();
  await nav.getByRole('link', { name: 'Portfolio' }).click();
  await expect(page.getByText('Portfolio distribution')).toBeVisible();
  await expect(page.getByText('Primary Offers (IPO)')).toBeVisible();

  await nav.getByRole('link', { name: 'Products' }).click();
  await expect(page.getByRole('button', { name: /Mutual Fund/ })).toBeVisible();

  await nav.getByRole('link', { name: 'Wallet' }).click();
  await expect(page.getByText('DPRP IPO subscription').first()).toBeVisible();
});
