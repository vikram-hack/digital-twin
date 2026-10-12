import { api } from './client';
import type { Scenario } from '../types';

export const getScenarios = async (): Promise<Scenario[]> => {
  const { data } = await api.get('/scenarios');
  return data;
};
