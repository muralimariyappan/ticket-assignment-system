import { useEffect, useState } from 'react';
import { getDashboardData } from '@/lib/api/dashboard';
import { DashboardData } from '../types';

export function useDashboardData() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDashboard = async () => {
    setError(null);
    setIsDashboardLoading(true);
    try {
      const data = await getDashboardData();
      setDashboardData(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to fetch dashboard data');
      }
    } finally {
      setIsDashboardLoading(false);
    }
  };

  useEffect(() => {
    getDashboard();
  }, []);

  return { dashboardData, isDashboardLoading, getDashboard, error };
}
