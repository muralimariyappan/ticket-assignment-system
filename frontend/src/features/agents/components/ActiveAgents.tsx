'use client';

import { Agent } from '../types';
import AgentItem from './AgentItem';
import { User } from 'lucide-react';

type ActiveAgentsProps = {
  agents: Agent[];
  loading: boolean;
};

const ActiveAgents: React.FC<ActiveAgentsProps> = ({ agents, loading }) => {
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="p-4 border rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <User className="w-6 h-6" />
        <span>Active Agents</span>
      </h2>
      {agents.map(
        (agent) =>
          agent.assignedTasks.length > 0 && (
            <AgentItem agent={agent} key={agent.id} />
          )
      )}
    </div>
  );
};

export default ActiveAgents;
