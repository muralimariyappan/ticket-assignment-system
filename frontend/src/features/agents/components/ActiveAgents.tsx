'use client';

import { Agent } from '../types';
import AgentItem from './AgentItem';
import { User } from 'lucide-react';

type ActiveAgentsProps = {
  agents: Agent[];
  loading: boolean;
};

const ActiveAgents: React.FC<ActiveAgentsProps> = ({ agents, loading }) => {
  const activeAgents = agents.filter((agent) => agent.assignedTasks.length > 0);
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="p-4 border rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <User className="w-6 h-6" />
        <span>Active Agents</span>
      </h2>
      {activeAgents.length === 0 && (
        <p className="text-muted-foreground">No active agents</p>
      )}
      {activeAgents.map((agent) => (
        <AgentItem agent={agent} key={agent.id} />
      ))}
    </div>
  );
};

export default ActiveAgents;
