import { api } from './client';
import type { TopologyResponse } from '../types';

export const getTopology = async (): Promise<TopologyResponse> => {
  const { data } = await api.get('/topology');
  return data;
};
