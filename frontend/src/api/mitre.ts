import { api } from './client';
import type { MitreTechnique } from '../types';

export const getMitreTechniques = async (): Promise<MitreTechnique[]> => {
  const { data } = await api.get('/mitre');
  return data;
};
