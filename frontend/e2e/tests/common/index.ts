import { Page } from '@playwright/test';

export const assignTicket = async (
  platform: string,
  page: Page,
  restriction: string[] = []
) => {
  const assignButton = page
    .getByRole('button', { name: /assign ticket/i })
    .first();
  await assignButton.click();

  if (restriction.length > 0) {
    const restrictionSelect = page.getByRole('combobox').first();
    await restrictionSelect.click();
    for (const lang of restriction) {
      await page.getByRole('option', { name: lang }).click();
    }
    await restrictionSelect.click();
  }

  const assigneeSelect = page.getByRole('combobox').last();
  await assigneeSelect.click();
  await page.getByRole('option', { name: platform }).click();

  const confirmButton = page.getByRole('button', { name: /assign/i }).last();
  await confirmButton.click();
};

export const resetSystem = async (page: Page) => {
  await page.goto('http://localhost:3000');
  const resetButton = page.getByRole('button', { name: /reset system/i });
  await resetButton.click();

  const confirmButton = page.getByRole('button', { name: /reset/i });
  await confirmButton.click();
};
