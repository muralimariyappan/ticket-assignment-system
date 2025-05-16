import { mapAgents } from '../mappers/agentsMapper';
import { BASE_URL } from '@/constants/api-endpoints';
import { Agent } from '@/features/agents/types';

export async function getAgents(): Promise<Agent[]> {
  const res = await fetch(`${BASE_URL}/agents`);
  if (!res.ok) {
    throw new Error('Failed to fetch agents');
  }
  const data = await res.json();
  return mapAgents(data);
}
