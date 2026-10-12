import { api } from './client';
import type { AIAnalysisResponse } from '../types';

export const analyzeSimulation = async (simulationId: string): Promise<AIAnalysisResponse> => {
  const { data } = await api.post('/ai/analyze', { simulation_id: simulationId });
  return data;
};

export const generateScenario = async (assetId: string): Promise<{ scenario: string; description: string }> => {
  const { data } = await api.post('/ai/generate-scenario', { asset_id: assetId });
  return data;
};
