'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { QueueData, QueuedTicket } from '../types';
import { TicketItem } from './TicketItem';

interface TicketQueueProps {
  queueData: QueueData | null;
  loading: boolean;
}

export default function TicketQueue({ queueData, loading }: TicketQueueProps) {
  if (loading) {
    return <p className="text-muted-foreground">Loading queue data...</p>;
  }
  return (
    <div className="p-4 border rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-4">
        Ticket Queue ({queueData ? queueData.total : 0})
      </h2>
      <Tabs defaultValue="voice" className="w-full">
        <TabsList>
          <TabsTrigger value="voice">
            Voice Queue ({queueData ? queueData.voice.length : 0})
          </TabsTrigger>
          <TabsTrigger value="text">
            Text Queue ({queueData ? queueData.text.length : 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="voice">
          {!queueData || queueData.voice.length === 0 ? (
            <p className="text-muted-foreground">No voice tickets in queue</p>
          ) : (
            <QueueContent queueData={queueData.voice} />
          )}
        </TabsContent>

        <TabsContent value="text">
          {!queueData || queueData.text.length === 0 ? (
            <p className="text-muted-foreground">No text tickets in queue</p>
          ) : (
            <QueueContent queueData={queueData.text} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface QueueContentProps {
  queueData: QueuedTicket[];
}

const QueueContent = ({ queueData }: QueueContentProps) => {
  return (
    <ul>
      {queueData.map((ticket: QueuedTicket) => (
        <li key={ticket.ticketId}>
          <TicketItem
            ticketId={ticket.ticketId}
            priority={ticket.priority}
            position={ticket.position}
            platform={ticket.platform}
            createdAt={new Date(ticket.createdAt).toLocaleString()}
          />
        </li>
      ))}
    </ul>
  );
};
