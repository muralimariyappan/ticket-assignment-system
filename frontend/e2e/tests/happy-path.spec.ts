import { test, expect } from '@playwright/test';
import { assignTicket, resetSystem } from './common';

test.describe.serial('Happy path', () => {
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

  test.describe.serial('Ticket Queue', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:3000');
    });

    test('should display ticket queue heading and tabs', async ({ page }) => {
      await expect(
        page.getByRole('heading', { name: 'Ticket Queue (0)' })
      ).toBeVisible();
      await expect(page.getByText('Voice Queue (0)')).toBeVisible();
      await expect(page.getByText('Text Queue (0)')).toBeVisible();
    });

    test('should have inital emtpy states', async ({ page }) => {
      await expect(page.getByText('No voice tickets in queue')).toBeVisible();

      page.getByRole('tab', { name: 'Text Queue (0)' }).click();
      await expect(page.getByText('No text tickets in queue')).toBeVisible();
    });

    test('should show ticket in voice queue', async ({ page }) => {
      await assignTicket('call', page);

      await expect(page.getByText('Ticket Queue (1)')).toBeVisible();
      await expect(
        page.getByText('No voice tickets in queue')
      ).not.toBeVisible();
      const ticketCard = await page.getByTestId('ticket-card').first();
      await expect(ticketCard.getByText('Ticket ID')).toBeVisible();
      await expect(ticketCard.getByText('CALL')).toBeVisible();
      await expect(ticketCard.getByText('Priority')).toBeVisible();
      await expect(ticketCard.getByText('Position')).toBeVisible();
      await expect(ticketCard.getByText('Created At')).toBeVisible();
    });

    test('should show ticket in text queue', async ({ page }) => {
      await assignTicket('chat', page);

      await expect(page.getByText('Ticket Queue (2)')).toBeVisible();
      await expect(
        page.getByText('No text tickets in queue')
      ).not.toBeVisible();
      await page.getByRole('tab', { name: 'Text Queue (1)' }).click();
      const ticketCard = await page.getByTestId('ticket-card').first();
      await expect(ticketCard.getByText('Ticket ID')).toBeVisible();
      await expect(ticketCard.getByText('CHAT')).toBeVisible();
      await expect(ticketCard.getByText('Priority')).toBeVisible();
      await expect(ticketCard.getByText('Position')).toBeVisible();
      await expect(ticketCard.getByText('Created At')).toBeVisible();
    });

    test('should reset the system', async ({ page }) => {
      await resetSystem(page);
    });
  });
  test.describe.serial('Agents Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:3000/agents');
    });

    test('should display correct headings and Add agent button', async ({
      page,
    }) => {
      await expect(
        page.getByRole('heading', { name: /Agents/i })
      ).toBeVisible();
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

      const confirmButton = page
        .getByRole('button', { name: /submit/i })
        .last();
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
});
