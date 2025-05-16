import { BASE_URL } from '@/constants/api-endpoints';
import { mapDashboardResponse } from '../mappers/dashboardMapper';

export async function getDashboardData() {
  const res = await fetch(`${BASE_URL}/debug`);
  if (!res.ok) throw new Error('Failed to fetch dashboard data');
  const raw = await res.json();
  return mapDashboardResponse(raw);
}

export async function resetSystem() {
  const res = await fetch(`${BASE_URL}/reset`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to reset system');
  return res.json();
}
