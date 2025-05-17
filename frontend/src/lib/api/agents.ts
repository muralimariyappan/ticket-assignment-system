import {
  mapAgents,
  mapAgent,
  mapNewAgentPayload,
  mapUpdateAgentPayload,
} from '../mappers/agentsMapper';
import { BASE_URL } from '@/constants/api-endpoints';
import {
  Agent,
  NewAgentPayload,
  UpdateAgentPayload,
} from '@/features/agents/types';

export async function getAgents(): Promise<Agent[]> {
  const res = await fetch(`${BASE_URL}/agents`);
  if (!res.ok) {
    throw new Error('Failed to fetch agents');
  }
  const data = await res.json();
  return mapAgents(data);
}

export async function addAgent(agent: NewAgentPayload): Promise<Agent> {
  const res = await fetch(`${BASE_URL}/agents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(mapNewAgentPayload(agent)),
  });
  if (!res.ok) {
    throw new Error('Failed to add agent');
  }
  const data = await res.json();
  return mapAgent(data);
}

export async function editAgent(
  id: string,
  updatePayload: UpdateAgentPayload
): Promise<Agent> {
  const res = await fetch(`${BASE_URL}/agents/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(mapUpdateAgentPayload(updatePayload)),
  });
  if (!res.ok) {
    throw new Error('Failed to edit agent');
  }
  const data = await res.json();
  return mapAgent(data);
}

export async function deleteAgent(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/agents/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to delete agent');
  }
}
