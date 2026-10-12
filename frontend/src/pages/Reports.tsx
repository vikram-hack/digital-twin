import React, { useState, useEffect } from 'react';
import { useSimulationStore } from '../store/simulationStore';
import { getSimulations, getSimulation } from '../api/simulation';
import { generateReport } from '../api/reports';
import { Card } from '../components/ui/Card';
import { 
  FileText, 
  Printer, 
  Download, 
  Flame, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  Server,
  Layers,
  ArrowRight
} from 'lucide-react';
import clsx from 'clsx';
import { SimulationRecord, SimulationResult } from '../types';

export default function Reports() {
  const { currentSimulation, aiAnalysis, whatIfResult } = useSimulationStore();
  const [history, setHistory] = useState<SimulationRecord[]>([]);
  const [selectedSim, setSelectedSim] = useState<SimulationResult | null>(currentSimulation);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSimulations()
      .then(setHistory)
      .catch(console.error);
  }, []);

  const handleSelectSim = async (simId: string) => {
    setLoading(true);
    try {
      const data = await getSimulation(simId);
      setSelectedSim(data);
    } catch (e) {
      console.error('Failed to load simulation record:', e);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const simToDisplay = selectedSim || currentSimulation;

  return (
    <div className="space-y-6">
      {/* Header (Hidden in Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800 print:hidden">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            Security Simulation Executive Reports
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Exportable defensive simulation dossiers with full attack path attribution, blast radius analysis, and AI recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <select
              onChange={(e) => handleSelectSim(e.target.value)}
              value={simToDisplay?.id || ''}
              className="py-1.5 px-3 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500"
            >
              {history.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.scenario_name} ({new Date(h.created_at).toLocaleDateString()})
                </option>
              ))}
            </select>
          )}

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-blue-600/30"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Main Report Document Container */}
      {simToDisplay ? (
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl max-w-4xl mx-auto space-y-6 print:border-none print:shadow-none print:p-0 print:bg-white print:text-black">
          {/* Simulation Environment Watermark */}
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-center text-xs font-mono font-bold text-amber-400 uppercase tracking-widest print:text-black print:border-black">
            SIMULATION ENVIRONMENT — NO REAL INFRASTRUCTURE AFFECTED
          </div>

          {/* Title Header */}
          <div className="flex items-start justify-between pb-6 border-b border-slate-800 print:border-black">
            <div>
              <div className="text-xs font-mono uppercase text-blue-400 font-bold tracking-wider mb-1 print:text-black">
                CyberTwin AI Executive Simulation Dossier
              </div>
              <h1 className="text-2xl font-black text-white print:text-black">
                {simToDisplay.scenario_name}
              </h1>
              <div className="text-xs text-slate-400 font-mono mt-1 print:text-slate-600">
                Initial Foothold: <span className="text-slate-200 font-semibold">{simToDisplay.initial_asset_id}</span> • 
                Simulation ID: <span className="text-slate-400">{simToDisplay.id}</span>
              </div>
            </div>

            <div className="text-right font-mono text-xs">
              <div className="text-slate-400 print:text-slate-600">Generated:</div>
              <div className="text-slate-200 font-bold print:text-black">
                {new Date(simToDisplay.timestamp || Date.now()).toLocaleString()}
              </div>
            </div>
          </div>

          {/* KPI Summary Grid */}
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 print:border-black print:bg-slate-50">
              <div className="text-[10px] uppercase font-mono text-slate-500 print:text-slate-600">Simulated Risk</div>
              <div className="text-xl font-bold font-mono text-red-400 print:text-black mt-1">
                {simToDisplay.risk_score.score} / 100
              </div>
              <div className="text-[10px] text-red-400 font-bold">{simToDisplay.risk_score.level}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 print:border-black print:bg-slate-50">
              <div className="text-[10px] uppercase font-mono text-slate-500 print:text-slate-600">Blast Radius</div>
              <div className="text-xl font-bold font-mono text-white print:text-black mt-1">
                {simToDisplay.blast_radius.total_assets}
              </div>
              <div className="text-[10px] text-slate-400">Total Nodes Exposed</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 print:border-black print:bg-slate-50">
              <div className="text-[10px] uppercase font-mono text-slate-500 print:text-slate-600">Critical Systems</div>
              <div className="text-xl font-bold font-mono text-orange-400 print:text-black mt-1">
                {simToDisplay.blast_radius.critical_assets}
              </div>
              <div className="text-[10px] text-slate-400">Tier-1 Targets</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 print:border-black print:bg-slate-50">
              <div className="text-[10px] uppercase font-mono text-slate-500 print:text-slate-600">Attack Path Hops</div>
              <div className="text-xl font-bold font-mono text-purple-400 print:text-black mt-1">
                {simToDisplay.attack_path.length}
              </div>
              <div className="text-[10px] text-slate-400">Sequential Pivot Steps</div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold print:text-black">
              1. Executive Threat Summary
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800 print:bg-slate-50 print:border-black print:text-black">
              {aiAnalysis?.summary || 
                `Simulation from foothold '${simToDisplay.initial_asset_id}' identified an attack propagation path compromising ${simToDisplay.blast_radius.total_assets} enterprise assets including ${simToDisplay.blast_radius.databases} databases and ${simToDisplay.blast_radius.servers} server hosts. The simulated risk index is evaluated at ${simToDisplay.risk_score.score} (${simToDisplay.risk_score.level}).`}
            </p>
          </div>

          {/* Sequential Attack Path */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold print:text-black">
              2. Evaluated Primary Attack Chain
            </h3>
            <div className="space-y-1.5 font-mono text-xs">
              {simToDisplay.attack_path.map((node, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between print:bg-slate-50 print:border-black">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-500 w-5">#{i + 1}</span>
                    <span className="text-slate-200 font-bold print:text-black">{node.asset_name}</span>
                    <span className="text-slate-400 text-[10px] uppercase">({node.asset_type})</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="text-slate-400">
                      Via: <span className="text-cyan-400 print:text-black font-semibold">{node.reached_via || 'INITIAL ACCESS'}</span>
                    </span>
                    <span className="text-purple-400 print:text-black font-semibold">
                      Priv L{node.privilege_level}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MITRE ATT&CK Mapping */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold print:text-black">
              3. Mapped MITRE ATT&CK Techniques
            </h3>
            <div className="flex flex-wrap gap-2">
              {simToDisplay.mitre_techniques_mapped?.map((techId) => (
                <span key={techId} className="px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-xs font-bold print:border-black print:text-black">
                  {techId}
                </span>
              ))}
            </div>
          </div>

          {/* Defensive Recommendations */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold print:text-black">
              4. Key Defensive Recommendations
            </h3>
            <div className="space-y-1.5 text-xs text-slate-300">
              {(aiAnalysis?.recommendations || [
                'Deploy Network Segmentation to isolate internal application servers from administrative databases.',
                'Enforce Multi-Factor Authentication (MFA) on all internal portals and administrative interfaces.',
                'Apply Least Privilege access policies to limit application accounts to read-only database roles.',
                'Implement Zero Trust micro-segmentation across database and backup infrastructure tiers.'
              ]).map((rec, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 flex items-start gap-2 print:bg-slate-50 print:border-black">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 print:text-black" />
                  <span className="print:text-black">{typeof rec === 'string' ? rec : (rec as any).title || (rec as any).description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Card className="p-12 text-center border-slate-800">
          <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="font-bold text-slate-200 text-sm">No Simulation Selected</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Run an attack simulation first or choose an existing simulation run from the history dropdown above.
          </p>
        </Card>
      )}
    </div>
  );
}