import { api } from './client';
import type { SecurityControl } from '../types';

export const getSecurityControls = async (): Promise<SecurityControl[]> => {
  const { data } = await api.get('/security-controls');
  return Array.isArray(data) ? data : (data?.items ?? []);
};

export const toggleControl = async (id: string): Promise<SecurityControl> => {
  const { data } = await api.post(`/security-controls/${id}/toggle`);
  return data;
};
