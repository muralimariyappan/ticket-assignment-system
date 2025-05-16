import { Card, CardContent } from '@/components/ui/card';
import { User, Phone, MessageSquare } from 'lucide-react';
import { getCallsAssignedCount, getChatsAssignedCount } from '../utils';
import { Agent } from '../types';

interface AgentItemProps {
  agent: Agent;
}

function AgentItem({ agent }: AgentItemProps) {
  const callsAssignedCount = getCallsAssignedCount(agent);
  const chatsAssignedCount = getChatsAssignedCount(agent);
  return (
    <Card key={agent.id}>
      <CardContent className="p-4 flex items-center gap-4">
        <div className="bg-muted rounded-full p-2">
          <User className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="font-semibold">{agent.name}</div>
          <div className="text-sm text-muted-foreground">
            {agent.languageSkills.length} languages
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Phone className="w-4 h-4 text-muted-foreground" />
          {callsAssignedCount}
          <MessageSquare className="w-4 h-4 text-muted-foreground ml-4" />
          {chatsAssignedCount}
        </div>
      </CardContent>
    </Card>
  );
}

export default AgentItem;
