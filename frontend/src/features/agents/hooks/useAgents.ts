import { useEffect, useState } from 'react';
import {
  getAgents,
  addAgent as apiAddAgent,
  editAgent as apiEditAgent,
  deleteAgent as apiDeleteAgent,
} from '@/lib/api/agents';
import { Agent, NewAgentPayload, UpdateAgentPayload } from '../types';

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all agents
  const loadAgents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAgents();
      setAgents(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch agents.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAgents();
  }, []);

  // Add agent
  const addAgent = async (newAgent: NewAgentPayload) => {
    setLoading(true);
    setError(null);
    try {
      const created = await apiAddAgent(newAgent);
      setAgents((prev) => [...prev, created]);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to add agent.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Edit agent
  const editAgent = async (id: string, updates: UpdateAgentPayload) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await apiEditAgent(id, updates);
      setAgents((prev) =>
        prev.map((agent) => (agent.id === id ? updated : agent))
      );
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message ?? 'Failed to update agent.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete agent
  const deleteAgent = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await apiDeleteAgent(id);
      setAgents((prev) => prev.filter((agent) => agent.id !== id));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message ?? 'Failed to delete agent.');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    agents,
    loading,
    error,
    loadAgents,
    addAgent,
    editAgent,
    deleteAgent,
  };
}
