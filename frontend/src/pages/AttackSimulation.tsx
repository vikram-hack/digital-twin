import React, { useState, useEffect } from 'react';
import { useSimulationStore } from '../store/simulationStore';
import { runSimulation } from '../api/simulation';
import { getAssets } from '../api/assets';
import { getSecurityControls } from '../api/securityControls';
import { runWhatIf } from '../api/whatif';
import { analyzeSimulation } from '../api/ai';
import { Card } from '../components/ui/Card';
import { BlastRadiusPanel } from '../components/simulation/BlastRadiusPanel';
import { RiskScorePanel } from '../components/simulation/RiskScorePanel';
import { AttackPathPanel } from '../components/simulation/AttackPathPanel';
import { PrivilegeEscalationPanel } from '../components/simulation/PrivilegeEscalationPanel';
import { LateralMovementPanel } from '../components/simulation/LateralMovementPanel';
import { BeforeAfterComparison } from '../components/defense/BeforeAfterComparison';
import { AIExplanationPanel } from '../components/ai/AIExplanationPanel';
import { 
  Flame, 
  Play, 
  ShieldCheck, 
  Bot, 
  Layers, 
  CheckCircle2, 
  RefreshCw,
  Sparkles,
  ShieldAlert,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import clsx from 'clsx';
import { Asset, SecurityControl } from '../types';

export default function AttackSimulation() {
  const { 
    currentSimulation, 
    setCurrentSimulation, 
    isSimulating, 
    setIsSimulating,
    selectedAssetId,
    setSelectedAssetId,
    aiAnalysis,
    setAiAnalysis,
    isAnalyzingAI,
    setIsAnalyzingAI,
    whatIfResult,
    setWhatIfResult,
    isWhatIfRunning,
    setIsWhatIfRunning
  } = useSimulationStore();

  const [assets, setAssets] = useState<Asset[]>([]);
  const [controls, setControls] = useState<SecurityControl[]>([]);
  const [selectedControlId, setSelectedControlId] = useState<string>('network-segmentation');
  const [activeTab, setActiveTab] = useState<'overview' | 'path' | 'defense' | 'ai'>('overview');

  useEffect(() => {
    getAssets()
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        setAssets(arr);
        if (arr.length > 0 && !selectedAssetId) {
          setSelectedAssetId(arr[0].id);
        }
      })
      .catch(console.error);

    getSecurityControls()
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        setControls(arr);
        if (arr.length > 0 && !selectedControlId) {
          setSelectedControlId(arr[0].id);
        }
      })
      .catch(console.error);
  }, []);

  const handleRunSimulation = async (assetIdToUse?: string) => {
    const targetAssetId = assetIdToUse || selectedAssetId || 'hr-pc-01';
    setIsSimulating(true);
    setWhatIfResult(null); // reset what-if comparison on new baseline run

    try {
      const result = await runSimulation({
        initial_asset_id: targetAssetId,
        scenario_name: `Compromise of ${targetAssetId}`,
      });
      setCurrentSimulation(result);

      // Auto trigger local AI analysis
      setIsAnalyzingAI(true);
      try {
        const aiRes = await analyzeSimulation(result.id);
        setAiAnalysis(aiRes);
      } catch (e) {
        console.error('AI Analysis failed:', e);
      } finally {
        setIsAnalyzingAI(false);
      }
    } catch (err) {
      console.error('Simulation execution failed:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleRunDefenseSimulation = async () => {
    if (!currentSimulation) return;
    setIsWhatIfRunning(true);

    try {
      const res = await runWhatIf({
        initial_asset_id: currentSimulation.initial_asset_id,
        toggled_controls: {
          [selectedControlId]: true,
        },
      });
      setWhatIfResult(res);
      setActiveTab('defense');
    } catch (err) {
      console.error('Defense What-If simulation failed:', err);
    } finally {
      setIsWhatIfRunning(false);
    }
  };

  const handleRegenerateAI = async () => {
    if (!currentSimulation) return;
    setIsAnalyzingAI(true);
    try {
      const res = await analyzeSimulation(currentSimulation.id);
      setAiAnalysis(res);
    } catch (e) {
      console.error('Failed to regenerate AI:', e);
    } finally {
      setIsAnalyzingAI(false);
    }
  };

  const quickScenarios = [
    { id: 'hr-pc-01', label: 'HR Workstation (HR-PC-01)', tag: 'Recommended Demo' },
    { id: 'web-server-01', label: 'Web Server (WEB-SERVER-01)', tag: 'Perimeter Breach' },
    { id: 'app-server-01', label: 'App Server (APP-SERVER-01)', tag: 'Core Tier' },
    { id: 'customer-db', label: 'Customer DB (CUSTOMER-DB)', tag: 'Data Exposure' },
  ];

  return (
    <div className="space-y-6">
      {/* Simulation Header & Selector */}
      <Card className="border-red-500/30 bg-gradient-to-r from-red-950/20 via-slate-900 to-slate-900 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-red-500 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold">
                Attack Propagation Simulator
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white">
              Select an Asset to Simulate Compromise
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Choose any virtual enterprise system or identity. The graph engine evaluates trust vectors, credential access, privilege escalation, and calculates the potential blast radius across the synthetic digital twin.
            </p>

            {/* Quick Scenarios */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-[11px] text-slate-500 font-mono">Quick Targets:</span>
              {quickScenarios.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => {
                    setSelectedAssetId(sc.id);
                    handleRunSimulation(sc.id);
                  }}
                  className={clsx(
                    "text-xs px-2.5 py-1 rounded-lg border font-mono transition-colors flex items-center gap-1.5",
                    selectedAssetId === sc.id
                      ? "bg-red-500/20 text-red-300 border-red-500/40"
                      : "bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600"
                  )}
                >
                  <span>{sc.label}</span>
                  <span className="text-[9px] bg-slate-900 px-1 py-0.2 rounded text-slate-400 border border-slate-700">
                    {sc.tag}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Asset Dropdown + Launch CTA */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="min-w-[240px]">
              <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1">
                Target Compromised Asset
              </label>
              <select
                value={selectedAssetId}
                onChange={(e) => setSelectedAssetId(e.target.value)}
                className="w-full py-2.5 px-3 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 font-mono focus:outline-none focus:border-red-500"
              >
                {Array.isArray(assets) && assets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name} ({asset.type?.toUpperCase() || ''})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => handleRunSimulation()}
              disabled={isSimulating}
              className="mt-auto py-2.5 px-6 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-extrabold text-sm transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>SIMULATING GRAPH...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>SIMULATE ATTACK</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Card>

      {/* Simulation Results Section */}
      {currentSimulation && (
        <div className="space-y-6">
          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={clsx(
                "px-4 py-2 rounded-lg text-xs font-semibold font-mono transition-colors",
                activeTab === 'overview' ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              )}
            >
              Simulation Overview
            </button>
            <button
              onClick={() => setActiveTab('path')}
              className={clsx(
                "px-4 py-2 rounded-lg text-xs font-semibold font-mono transition-colors",
                activeTab === 'path' ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              )}
            >
              Attack Path Timeline ({currentSimulation.attack_path?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('defense')}
              className={clsx(
                "px-4 py-2 rounded-lg text-xs font-semibold font-mono transition-colors flex items-center gap-1.5",
                activeTab === 'defense' ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
              )}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Defense Simulation & What-If
              {whatIfResult && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={clsx(
                "px-4 py-2 rounded-lg text-xs font-semibold font-mono transition-colors flex items-center gap-1.5",
                activeTab === 'ai' ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
              )}
            >
              <Bot className="w-3.5 h-3.5" />
              AI Analyst Explanation
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Row 1: Blast Radius & Risk Score */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <BlastRadiusPanel blastRadius={currentSimulation.blast_radius} />
                <RiskScorePanel riskScore={currentSimulation.risk_score} />
              </div>

              {/* Row 2: Escalations & Lateral Movement */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <PrivilegeEscalationPanel escalations={currentSimulation.privilege_escalations || []} />
                <LateralMovementPanel movements={currentSimulation.lateral_movements || []} />
              </div>

              {/* Primary Attack Path */}
              <AttackPathPanel attackPath={currentSimulation.attack_path} />

              {/* AI Explanation in Overview */}
              <AIExplanationPanel 
                analysis={aiAnalysis} 
                isLoading={isAnalyzingAI} 
                onRefresh={handleRegenerateAI} 
              />
            </div>
          )}

          {/* TAB 2: ATTACK PATH TIMELINE */}
          {activeTab === 'path' && (
            <div className="space-y-4">
              <AttackPathPanel attackPath={currentSimulation.attack_path} />
            </div>
          )}

          {/* TAB 3: DEFENSE SIMULATION & WHAT-IF */}
          {activeTab === 'defense' && (
            <div className="space-y-6">
              {/* Defense Control Selector */}
              <Card className="border-emerald-500/30 bg-slate-900/90 p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <h3 className="font-bold text-slate-100 text-base">
                        Simulate Defensive Security Control
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 max-w-xl">
                      Select a security defense policy to simulate its effect on the current attack graph. The engine re-traverses the topology with policy constraints applied to evaluate prevented attack hops.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={selectedControlId}
                      onChange={(e) => setSelectedControlId(e.target.value)}
                      className="py-2 px-3 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                    >
                      {Array.isArray(controls) && controls.map((ctrl) => (
                        <option key={ctrl.id} value={ctrl.id}>
                          {ctrl.name} ({ctrl.effectiveness}% Effect)
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={handleRunDefenseSimulation}
                      disabled={isWhatIfRunning}
                      className="py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs transition-colors shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 whitespace-nowrap"
                    >
                      {isWhatIfRunning ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>EVALUATING DEFENSE...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>APPLY DEFENSE & RE-SIMULATE</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </Card>

              {/* What-If Comparison */}
              {whatIfResult ? (
                <BeforeAfterComparison 
                  whatIfResult={whatIfResult} 
                  controlName={controls.find(c => c.id === selectedControlId)?.name} 
                />
              ) : (
                <Card className="p-8 text-center border-slate-800 bg-slate-900/40">
                  <SlidersHorizontal className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <h4 className="text-sm font-semibold text-slate-300">Ready to Test Defenses</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    Select a defense control (like Network Segmentation or Zero Trust) and click "APPLY DEFENSE & RE-SIMULATE" to see how the attack path and blast radius shrink!
                  </p>
                </Card>
              )}
            </div>
          )}

          {/* TAB 4: AI REASONING */}
          {activeTab === 'ai' && (
            <div className="space-y-4">
              <AIExplanationPanel 
                analysis={aiAnalysis} 
                isLoading={isAnalyzingAI} 
                onRefresh={handleRegenerateAI} 
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
