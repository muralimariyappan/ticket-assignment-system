import { useState, useEffect } from 'react';
import type { Agent } from '../types';
import { getAgents } from '@/lib/api/agents';

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchAgents() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAgents();
        setAgents(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchAgents();
  }, []);

  return { agents, loading, error };
}
