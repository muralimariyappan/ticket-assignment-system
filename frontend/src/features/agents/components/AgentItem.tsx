'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  User,
  Phone,
  MessageSquare,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useState } from 'react';
import { getCallsAssignedCount, getChatsAssignedCount } from '../utils';
import { Agent, Task } from '../types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { TaskItem } from './TaskItem';

interface AgentItemProps {
  agent: Agent;
  onEdit?: (agent: Agent) => void;
  onDelete?: (agentId: Agent) => void;
  enableEdit?: boolean;
  enableDelete?: boolean;
  onCloseTask?: (agent: Agent, task: Task) => void;
}

function AgentItem({
  agent,
  onEdit,
  onDelete,
  enableEdit,
  enableDelete,
  onCloseTask,
}: AgentItemProps) {
  const [open, setOpen] = useState(false);

  const callsAssignedCount = getCallsAssignedCount(agent);
  const chatsAssignedCount = getChatsAssignedCount(agent);

  return (
    <Card key={agent.id} className="group relative mb-2">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="bg-muted rounded-full p-2">
            <User className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="font-semibold flex items-center justify-between">
              {agent.name}
            </div>
            <div className="text-sm text-muted-foreground pt-2">
              {agent.languageSkills.length === 0 && 'No languages assigned'}
              {agent.languageSkills.map((lang) => (
                <Badge key={lang} variant="outline" className="mr-1">
                  {lang}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-muted-foreground" />
            {callsAssignedCount}
            <MessageSquare className="w-4 h-4 text-muted-foreground ml-4" />
            {chatsAssignedCount}
            {onCloseTask && (
              <Button
                onClick={() => setOpen(!open)}
                size="icon"
                variant="ghost"
                className="h-6 w-6 ml-2"
              >
                {open ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>

          <div className="absolute top-2 right-2 hidden group-hover:flex gap-2">
            {enableEdit && (
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => onEdit?.(agent)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {enableDelete && (
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-destructive"
                onClick={() => onDelete?.(agent)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleContent className="mt-4 space-y-2">
            {agent.assignedTasks.length === 0 && (
              <div className="text-sm text-muted-foreground">
                No tasks assigned
              </div>
            )}
            {agent.assignedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onClose={() => onCloseTask?.(agent, task)}
              />
            ))}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

export default AgentItem;
