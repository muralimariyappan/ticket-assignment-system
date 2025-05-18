import { test, expect } from '@playwright/test';
import { assignTicket, resetSystem } from '../common';

test.describe.serial('Agents Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/agents');
  });

  test('should display correct headings and Add agent button', async ({
    page,
  }) => {
    await expect(page.getByRole('heading', { name: /Agents/i })).toBeVisible();
    await expect(
      page.getByRole('button', { name: /add agent/i })
    ).toBeVisible();
  });

  test('should have inital emtpy states', async ({ page }) => {
    await expect(page.getByText('No agents available')).toBeVisible();
  });

  test('should allow adding an agent', async ({ page }) => {
    const AGENT_NAME = Math.random().toString(36).substring(2, 15);
    const assignButton = page
      .getByRole('button', { name: /add agent/i })
      .first();
    await assignButton.click();

    await page.getByRole('textbox').fill(AGENT_NAME);

    const assigneeSelect = page.getByRole('combobox').last();
    await assigneeSelect.click();
    await page.getByRole('option', { name: 'English' }).click();
    await page.getByRole('option', { name: 'German' }).click();

    const confirmButton = page.getByRole('button', { name: /submit/i }).last();
    await confirmButton.click();

    await expect(page.getByText(AGENT_NAME)).toBeVisible();
  });

  test('should allow closing a task', async ({ page }) => {
    await assignTicket('call', page, ['English']);

    const agentCard = await page.getByTestId('agent-card').first();
    await agentCard.getByRole('button').last().click();

    await page.getByRole('button', { name: /close task/i }).click();
    await page.getByRole('button', { name: /close/i }).last().click();
  });

  test('should reset the system', async ({ page }) => {
    await resetSystem(page);
  });
});
