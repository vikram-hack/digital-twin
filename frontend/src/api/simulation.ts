import { api } from './client';
import type { SimulationResult, SimulationRecord } from '../types';

export interface SimulationRequest {
  initial_asset_id: string;
  scenario_name?: string;
  active_control_ids?: string[];
}

export const runSimulation = async (req: SimulationRequest): Promise<SimulationResult> => {
  const { data } = await api.post('/simulate', req);
  return data;
};

export const getSimulations = async (): Promise<SimulationRecord[]> => {
  const { data } = await api.get('/simulations');
  return data;
};

export const getSimulation = async (id: string): Promise<SimulationResult> => {
  const { data } = await api.get(`/simulations/${id}`);
  return data;
};
