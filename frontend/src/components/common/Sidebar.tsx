'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const path = usePathname();
  const section = path === '/' ? 'dashboard' : path.substring(1);

  return (
    <aside style={{ width: '200px', background: '#ddd', padding: '1rem' }}>
      <nav>
        <ul>
          <li style={section === 'dashboard' ? { fontWeight: 'bold' } : {}}>
            <Link href="/">Dashboard</Link>
          </li>
          <li style={section === 'agents' ? { fontWeight: 'bold' } : {}}>
            <Link href="/agents">Agents</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
