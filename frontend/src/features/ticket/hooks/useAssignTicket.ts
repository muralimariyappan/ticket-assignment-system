import { useState } from 'react';
import { assignTicket as assignTicketApi } from '@/lib/api/tickets';

export function useAssignTicket() {
  const [isLoading, setLoading] = useState(false);

  const assignTicket = async ({
    id,
    restrictions,
    platform,
  }: {
    id: string;
    restrictions: string[];
    platform: string;
  }) => {
    try {
      setLoading(true);
      await assignTicketApi({ id, restrictions, platform });
    } finally {
      setLoading(false);
    }
  };

  return { assignTicket, isLoading };
}
