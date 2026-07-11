import { expect, test } from '@playwright/test';
import { seedApp } from './helpers';

test('pre-live user joins the waiting list', async ({ page }) => {
  await seedApp(page, { offerStatus: 'upcoming' });
  await page.goto('/dashboard');

  await expect(page.getByText('Opens soon').first()).toBeVisible();
  await page.getByRole('button', { name: 'Join the waiting list' }).click();

  const dialog = page.getByRole('dialog', { name: 'Join the waiting list' });
  await expect(dialog).toBeVisible();
  await dialog.getByText('WhatsApp').click();
  await dialog.getByRole('button', { name: 'Notify me' }).click();

  await expect(page.getByText(/You're on the (list|waiting list)/).first()).toBeVisible();
});
