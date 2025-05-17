import { Agent } from '../types';
import AgentWorkloadItem from './AgentWorkloadItem';

interface AgentWorkloadProps {
  agents: Agent[];
  loading?: boolean;
  error?: string | null;
}

function AgentWorkload({ agents, loading, error }: AgentWorkloadProps) {
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="p-4 border rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Agent Workload</h2>
      {error && <div className="text-red-500 text-sm">{error}</div>}

      {agents.length === 0 && (
        <p className="text-muted-foreground">No agents available</p>
      )}
      <div className="max-h-[444px] overflow-y-auto">
        {agents.map((agent) => (
          <AgentWorkloadItem key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
}

export default AgentWorkload;
