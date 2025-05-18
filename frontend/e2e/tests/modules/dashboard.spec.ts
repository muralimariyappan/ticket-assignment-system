import { test, expect } from '@playwright/test';
import { assignTicket, resetSystem } from '../common';

test.describe.serial('Dashboard Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should display correct headings', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /system status/i })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /ticket queue/i })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /agent workload/i })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /active agents/i })
    ).toBeVisible();
  });

  test('should have inital emtpy states', async ({ page }) => {
    await expect(page.getByText('Ticket Queue (0)')).toBeVisible();
    await expect(page.getByText('0 Active Calls')).toBeVisible();
    await expect(page.getByText('0 Active Messages')).toBeVisible();
    await expect(page.getByText('0 Completed Tasks')).toBeVisible();
    await expect(page.getByText('No agents available')).toBeVisible();
  });

  test('should allow assigning a ticket', async ({ page }) => {
    await assignTicket('call', page);

    await expect(page.getByText('Ticket Queue (1)')).toBeVisible();
  });

  test('should reset the system', async ({ page }) => {
    await resetSystem(page);

    await expect(page.getByText('Ticket Queue (0)')).toBeVisible();
    await expect(page.getByText('0 Active Calls')).toBeVisible();
    await expect(page.getByText('0 Active Messages')).toBeVisible();
    await expect(page.getByText('0 Completed Tasks')).toBeVisible();
    await expect(page.getByText('No agents available')).toBeVisible();
  });
});
