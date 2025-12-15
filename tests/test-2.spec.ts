import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await expect(page.locator('div').filter({ hasText: /^:D$/ }).first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Score:' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Toss Coin' })).toBeVisible();
  await expect(page.locator('#flip-button')).toContainText('Toss Coin');
});
