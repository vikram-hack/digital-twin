import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getScenarios } from '../api/scenarios';
import { generateScenario } from '../api/ai';
import { Card } from '../components/ui/Card';
import { useSimulationStore } from '../store/simulationStore';
import { 
  FileText, 
  Play, 
  Sparkles, 
  Bot, 
  Server, 
  AlertTriangle, 
  ShieldAlert, 
  Flame,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import clsx from 'clsx';

export default function Scenarios() {
  const navigate = useNavigate();
  const { setSelectedAssetId } = useSimulationStore();
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [aiScenario, setAiScenario] = useState<any | null>(null);
  const [generatingAi, setGeneratingAi] = useState(false);
  const [selectedTargetAsset, setSelectedTargetAsset] = useState('app-server-01');

  useEffect(() => {
    getScenarios().then(setScenarios).catch(console.error);
  }, []);

  const handleRunScenario = (startAssetId: string) => {
    setSelectedAssetId(startAssetId);
    navigate('/simulation');
  };

  const handleGenerateAiScenario = async () => {
    setGeneratingAi(true);
    try {
      const res = await generateScenario(selectedTargetAsset);
      setAiScenario(res);
    } catch (e) {
      console.error('Failed to generate scenario:', e);
    } finally {
      setGeneratingAi(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            Attack Scenario Library
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Pre-configured attack propagation templates and AI-synthesized threat scenarios.
          </p>
        </div>

        <button
          onClick={() => {
            const el = document.getElementById('ai-generator-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="px-3.5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-purple-600/30"
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Scenario Generator</span>
        </button>
      </div>

      {/* Predefined Scenarios Grid */}
      <div>
        <h3 className="text-sm font-bold text-slate-200 mb-3 font-mono uppercase tracking-wider">
          Enterprise Attack Scenarios (6 Core Templates)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.map((sc, index) => (
            <Card key={sc.id} className="bg-slate-900/90 border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    Template #{index + 1}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                    High Risk
                  </span>
                </div>

                <h4 className="font-bold text-slate-100 text-sm mb-1">{sc.name}</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{sc.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <div className="flex justify-between items-center text-[11px] font-mono text-slate-400">
                  <span>Foothold Asset:</span>
                  <span className="text-blue-400 font-semibold">{sc.start_asset_id}</span>
                </div>

                <button
                  onClick={() => handleRunScenario(sc.start_asset_id)}
                  className="w-full py-2 px-3 rounded-lg bg-red-600/90 hover:bg-red-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-red-600/20 font-mono"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Execute Scenario</span>
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* AI Scenario Generator Section */}
      <div id="ai-generator-section" className="pt-4">
        <Card className="border-purple-500/30 bg-gradient-to-r from-purple-950/20 via-slate-900 to-slate-900 p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-purple-500/20">
            <div>
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-white text-base">
                  AI Attack Scenario Generator
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
                Uses the local simulation intelligence engine to synthesize plausible defensive scenarios based on digital twin graph connectivity and asset criticality.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedTargetAsset}
                onChange={(e) => setSelectedTargetAsset(e.target.value)}
                className="py-2 px-3 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-purple-500"
              >
                <option value="app-server-01">APP-SERVER-01</option>
                <option value="web-server-01">WEB-SERVER-01</option>
                <option value="customer-db">CUSTOMER-DB</option>
                <option value="ad-server-01">AD-SERVER-01</option>
                <option value="dev-pc-01">DEV-PC-01</option>
                <option value="internal-api">INTERNAL-API</option>
              </select>

              <button
                onClick={handleGenerateAiScenario}
                disabled={generatingAi}
                className="py-2 px-4 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-purple-600/30 whitespace-nowrap"
              >
                {generatingAi ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Synthesizing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Scenario</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Scenario Display */}
          {aiScenario && (
            <div className="p-4 rounded-xl bg-slate-950/80 border border-purple-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-purple-400">
                  Synthesized Scenario: {aiScenario.scenario_name}
                </span>
                <button
                  onClick={() => handleRunScenario(selectedTargetAsset)}
                  className="px-3 py-1 rounded bg-red-600 hover:bg-red-500 text-white font-mono text-xs flex items-center gap-1 font-semibold"
                >
                  <Play className="w-3 h-3 fill-white" />
                  <span>Simulate Now</span>
                </button>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed">
                {aiScenario.description}
              </p>

              <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200">
                <span className="font-semibold text-amber-400">Expected Simulated Impact: </span>
                {aiScenario.expected_impact}
              </div>

              {aiScenario.mitigation_suggestions && (
                <div className="space-y-1 pt-1">
                  <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">Recommended Mitigations:</span>
                  <div className="space-y-1">
                    {aiScenario.mitigation_suggestions.map((sug: string, i: number) => (
                      <div key={i} className="text-xs text-slate-300 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{sug}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}