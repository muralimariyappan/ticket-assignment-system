import { test, expect } from '@playwright/test';

test.describe('Dashboard Page', () => {
  test.beforeEach(async ({ page }) => {
    // Replace with your actual dashboard route
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
    // Adjust selectors and flow as per your UI
    const assignButton = page
      .getByRole('button', { name: /assign ticket/i })
      .first();
    await assignButton.click();

    const assigneeSelect = page.getByRole('combobox').last();
    await assigneeSelect.click();
    await page.getByRole('option', { name: 'call' }).click();

    const confirmButton = page.locator('text=Assign').last();
    await confirmButton.click();

    await expect(page.getByText('Ticket Queue (1)')).toBeVisible();
  });

  test('should reset the system', async ({ page }) => {
    const resetButton = page.getByRole('button', { name: /reset system/i });
    await resetButton.click();

    const confirmButton = page.getByRole('button', { name: /reset/i });
    await confirmButton.click();

    await expect(page.getByText('Ticket Queue (0)')).toBeVisible();
    await expect(page.getByText('0 Active Calls')).toBeVisible();
    await expect(page.getByText('0 Active Messages')).toBeVisible();
    await expect(page.getByText('0 Completed Tasks')).toBeVisible();
    await expect(page.getByText('No agents available')).toBeVisible();
  });
});
