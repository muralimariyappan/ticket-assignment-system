export interface QueuedTicket {
  priority: number;
  position: number;
  ticketId: string;
  platform: string;
  restrictions: string[];
  isVoice: boolean;
  createdAt: number;
}

export interface QueueData {
  voice: QueuedTicket[];
  text: QueuedTicket[];
  total: number;
}
