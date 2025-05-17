'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { AssignTicket } from '@/features/ticket/AssignTicket';

const Sidebar = () => {
  const path = usePathname();
  const section = path === '/' ? 'dashboard' : path.substring(1);

  const navItems = [
    { name: 'Dashboard', href: '/', key: 'dashboard' },
    { name: 'Agents', href: '/agents', key: 'agents' },
  ];

  return (
    <aside className="w-[200px] flex flex-col border-r bg-muted">
      <Card className="h-full rounded-none shadow-none flex flex-col">
        <ScrollArea className="flex-1">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  'block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                  section === item.key && 'bg-accent font-semibold'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </ScrollArea>

        <div className="p-4 border-t">
          <AssignTicket />
        </div>
      </Card>
    </aside>
  );
};

export default Sidebar;
