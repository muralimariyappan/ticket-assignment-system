import {
  mapAgents,
  mapAgent,
  mapNewAgentPayload,
  mapUpdateAgentPayload,
  AgentResponse,
} from '../mappers/agentsMapper';
import {
  Agent,
  NewAgentPayload,
  UpdateAgentPayload,
} from '@/features/agents/types';
import { apiClient } from '../api-client';
import { getCustomError } from '../error-handler';

export async function getAgents(): Promise<Agent[]> {
  try {
    const data: AgentResponse[] = await apiClient('/agents');
    return mapAgents(data);
  } catch (error) {
    throw getCustomError('Failed to fetch agents', error);
  }
}
export async function addAgent(agent: NewAgentPayload): Promise<Agent> {
  try {
    const data: AgentResponse = await apiClient('/agents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mapNewAgentPayload(agent)),
    });
    return mapAgent(data);
  } catch (error) {
    throw getCustomError('Failed to add agent', error);
  }
}

export async function editAgent(
  id: string,
  updatePayload: UpdateAgentPayload
): Promise<Agent> {
  try {
    const data: AgentResponse = await apiClient(`/agents/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mapUpdateAgentPayload(updatePayload)),
    });
    return mapAgent(data);
  } catch (error) {
    throw getCustomError('Failed to edit agent', error);
  }
}

export async function deleteAgent(id: string): Promise<void> {
  try {
    await apiClient(`/agents/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    throw getCustomError('Failed to delete agent', error);
  }
}
