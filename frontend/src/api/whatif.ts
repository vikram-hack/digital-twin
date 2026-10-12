import { api } from './client';
import type { WhatIfResponse } from '../types';

export interface WhatIfRequest {
  initial_asset_id: string;
  toggled_controls: Record<string, boolean>;
}

export const runWhatIf = async (req: WhatIfRequest): Promise<WhatIfResponse> => {
  const { data } = await api.post('/what-if', req);
  return data;
};
