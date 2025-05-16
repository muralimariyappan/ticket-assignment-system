import { useEffect, useState } from 'react';
import { getDashboardData } from '@/lib/api/dashboard';
import { DashboardData } from '../types';

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardData()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { dashboardData: data, isDashboardLoading: loading };
}
