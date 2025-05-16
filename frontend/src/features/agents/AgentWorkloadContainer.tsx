'use client';

import AgentWorkload from './components/AgentWorkload';
import { useAgents } from './hooks/useAgents';

export default function AgentWorkLoadContainer() {
  const { agents, loading } = useAgents();

  return (
    <div className="space-y-4 p-6">
      <AgentWorkload agents={agents} loading={loading} />
    </div>
  );
}
