import { api } from './client';

export const generateReport = async (simulationId: string): Promise<any> => {
  const { data } = await api.post('/reports/generate', { simulation_id: simulationId });
  return data;
};
