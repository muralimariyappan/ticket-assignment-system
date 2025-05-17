import {
  mapDashboardResponse,
  RawDashboardResponse,
} from '../mappers/dashboardMapper';
import { DashboardData } from '@/features/dashboard/types';
import { apiClient } from '../api-client';
import { getCustomError } from '../error-handler';

export const getDashboardData = async (): Promise<DashboardData> => {
  try {
    const data: RawDashboardResponse = await apiClient('/debug');
    return mapDashboardResponse(data);
  } catch (error) {
    throw getCustomError('Failed to fetch dashboard data', error);
  }
};

export const resetSystem = async () => {
  try {
    const data = await apiClient('/reset', { method: 'POST' });
    return data;
  } catch (error) {
    throw getCustomError('Failed to reset system', error);
  }
};
