import { QueuedTicket, QueueData } from '@/features/dashboard/types';

export interface QueueResponse {
  voice_queue: RawQueuedTicket[];
  text_queue: RawQueuedTicket[];
  total_queued: number;
}

export interface RawQueuedTicket {
  priority: number;
  position: number;
  ticket_id: string;
  platform: string;
  restrictions: string[];
  is_voice: boolean;
  created_at: number;
}

const mapTicket = (ticket: RawQueuedTicket): QueuedTicket => ({
  priority: ticket.priority,
  position: ticket.position,
  ticketId: ticket.ticket_id,
  platform: ticket.platform,
  restrictions: ticket.restrictions,
  isVoice: ticket.is_voice,
  createdAt: ticket.created_at,
});

export const mapQueueData = (data: QueueResponse): QueueData => ({
  voice: data.voice_queue.map(mapTicket),
  text: data.text_queue.map(mapTicket),
  total: data.total_queued,
});
