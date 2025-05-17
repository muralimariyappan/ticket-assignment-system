import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type TicketItemProps = {
  ticketId: string;
  priority: number;
  position: number;
  platform: string;
  createdAt: string;
};

export const TicketItem = ({
  ticketId,
  priority,
  position,
  platform,
  createdAt,
}: TicketItemProps) => {
  return (
    <Card className="w-full shadow-sm border-muted rounded-xl p-4 mb-2">
      <CardContent className="p-0">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Ticket ID</p>
            <p className="font-medium">{ticketId}</p>
          </div>

          <Badge variant="outline" className="text-xs">
            {platform.toUpperCase()}
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <div>
            <span className="block font-medium text-foreground">Priority</span>
            {priority}
          </div>
          <div>
            <span className="block font-medium text-foreground">Position</span>
            {position}
          </div>
          <div className="col-span-2">
            <span className="block font-medium text-foreground">
              Created At
            </span>
            {createdAt}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
