import { AssignTicketPayload } from '@/features/ticket/types';
import { apiClient } from '../api-client';
import { getCustomError } from '../error-handler';

export const assignTicket = async (
  payload: AssignTicketPayload
): Promise<void> => {
  try {
    await apiClient('/tickets/assign', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch (error) {
    throw getCustomError('Failed to assign ticket', error);
  }
};
