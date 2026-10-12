import { api } from './client';
import type { Asset } from '../types';

export interface AssetsQuery {
  type?: string;
  criticality?: number;
  department?: string;
  search?: string;
}

export const getAssets = async (query?: AssetsQuery): Promise<Asset[]> => {
  const { data } = await api.get('/assets', { params: query });
  // Backend returns { items: Asset[], total: number }
  return Array.isArray(data) ? data : (data.items ?? []);
};

export const getAsset = async (id: string): Promise<Asset> => {
  const { data } = await api.get(`/assets/${id}`);
  return data;
};
