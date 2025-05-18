import { test, expect } from '@playwright/test';
import { assignTicket, resetSystem } from '../common';

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
    await expect(page.getByText('No voice tickets in queue')).not.toBeVisible();
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
    await expect(page.getByText('No text tickets in queue')).not.toBeVisible();
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
