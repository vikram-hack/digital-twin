import { create } from 'zustand';
import { SimulationResult, AIAnalysisResponse, WhatIfResponse } from '../types';

interface SimulationStore {
  currentSimulation: SimulationResult | null;
  isSimulating: boolean;
  error: string | null;
  selectedAssetId: string;
  aiAnalysis: AIAnalysisResponse | null;
  isAnalyzingAI: boolean;
  whatIfResult: WhatIfResponse | null;
  isWhatIfRunning: boolean;
  
  setCurrentSimulation: (sim: SimulationResult | null) => void;
  setIsSimulating: (is: boolean) => void;
  setError: (err: string | null) => void;
  setSelectedAssetId: (id: string) => void;
  setAiAnalysis: (analysis: AIAnalysisResponse | null) => void;
  setIsAnalyzingAI: (is: boolean) => void;
  setWhatIfResult: (res: WhatIfResponse | null) => void;
  setIsWhatIfRunning: (is: boolean) => void;
}

export const useSimulationStore = create<SimulationStore>((set) => ({
  currentSimulation: null,
  isSimulating: false,
  error: null,
  selectedAssetId: 'hr-pc-01',
  aiAnalysis: null,
  isAnalyzingAI: false,
  whatIfResult: null,
  isWhatIfRunning: false,

  setCurrentSimulation: (sim) => set({ currentSimulation: sim }),
  setIsSimulating: (is) => set({ isSimulating: is }),
  setError: (err) => set({ error: err }),
  setSelectedAssetId: (id) => set({ selectedAssetId: id }),
  setAiAnalysis: (analysis) => set({ aiAnalysis: analysis }),
  setIsAnalyzingAI: (is) => set({ isAnalyzingAI: is }),
  setWhatIfResult: (res) => set({ whatIfResult: res }),
  setIsWhatIfRunning: (is) => set({ isWhatIfRunning: is }),
}));
