import React, { useState, useEffect, useMemo } from 'react';
import { getMitreTechniques } from '../api/mitre';
import { MitreTechnique } from '../types';
import { Card } from '../components/ui/Card';
import { useSimulationStore } from '../store/simulationStore';
import { 
  Box, 
  Search, 
  Filter, 
  ShieldAlert, 
  Info, 
  Layers, 
  Flame, 
  ExternalLink 
} from 'lucide-react';
import clsx from 'clsx';

export default function MitreAttack() {
  const { currentSimulation } = useSimulationStore();
  const [techniques, setTechniques] = useState<MitreTechnique[]>([]);
  const [selectedTactic, setSelectedTactic] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState<MitreTechnique | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMitreTechniques()
      .then((data) => {
        setTechniques(data);
        if (data.length > 0) setSelectedTech(data[0]);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load MITRE techniques:', err);
        setLoading(false);
      });
  }, []);

  const activeTechniques = useMemo(() => {
    return new Set(currentSimulation?.mitre_techniques_mapped || []);
  }, [currentSimulation]);

  const tactics = useMemo(() => {
    const list = Array.from(new Set(techniques.map((t) => t.tactic)));
    return ['ALL', ...list];
  }, [techniques]);

  const filteredTechniques = useMemo(() => {
    return techniques.filter((t) => {
      const matchTactic = selectedTactic === 'ALL' || t.tactic.toLowerCase() === selectedTactic.toLowerCase();
      const matchSearch = !searchTerm || 
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.technique_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchTactic && matchSearch;
    });
  }, [techniques, selectedTactic, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Box className="w-5 h-5 text-purple-400" />
            MITRE ATT&CK Matrix & Technique Mapping
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Simulated adversary tactics and techniques associated with enterprise digital twin propagation vectors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search T-IDs, techniques..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 w-52 font-mono"
            />
          </div>

          {/* Tactic Filter */}
          <select
            value={selectedTactic}
            onChange={(e) => setSelectedTactic(e.target.value)}
            className="py-1.5 px-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono focus:outline-none focus:border-purple-500"
          >
            {tactics.map((tac) => (
              <option key={tac} value={tac}>
                {tac === 'ALL' ? 'All Tactics' : tac}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Technique Cards Grid */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredTechniques.map((tech) => {
              const isSimulatedActive = activeTechniques.has(tech.technique_id);
              const isSelected = selectedTech?.id === tech.id;

              return (
                <div
                  key={tech.id}
                  onClick={() => setSelectedTech(tech)}
                  className={clsx(
                    "p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between text-xs space-y-2",
                    isSelected
                      ? "bg-slate-800 border-purple-500 shadow-md ring-1 ring-purple-500/50"
                      : "bg-slate-900/80 border-slate-800 hover:border-slate-700",
                    isSimulatedActive && "border-red-500/60 bg-red-950/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className={clsx(
                        "font-mono font-bold text-[11px] px-1.5 py-0.5 rounded border",
                        isSimulatedActive
                          ? "bg-red-500/20 text-red-300 border-red-500/40"
                          : "bg-purple-500/10 text-purple-300 border-purple-500/20"
                      )}>
                        {tech.technique_id}
                      </span>
                      {isSimulatedActive && (
                        <span className="text-[9px] font-bold font-mono px-1 py-0.2 rounded bg-red-500 text-white animate-pulse">
                          TRIGGERED
                        </span>
                      )}
                    </div>
                    <div className="font-semibold text-slate-100 line-clamp-1">{tech.name}</div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono flex items-center justify-between">
                    <span className="truncate max-w-[120px]">{tech.tactic}</span>
                    <span className="text-purple-400 font-semibold">Inspect</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Technique Inspector */}
        <div className="lg:col-span-4">
          {selectedTech ? (
            <Card className="sticky top-20 border-purple-500/30 bg-slate-900/90 p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Box className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-slate-200">Technique Dossier</span>
                </div>
                <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  {selectedTech.technique_id}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{selectedTech.name}</h3>
                <div className="text-xs text-slate-400 font-mono mt-1">
                  Tactic: <span className="text-slate-200 font-semibold">{selectedTech.tactic}</span>
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase font-mono text-slate-500 mb-1 font-semibold">Description</div>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  {selectedTech.description}
                </p>
              </div>

              {selectedTech.detection && (
                <div>
                  <div className="text-[10px] uppercase font-mono text-slate-500 mb-1 font-semibold">Detection & Mitigation Advice</div>
                  <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                    {selectedTech.detection}
                  </p>
                </div>
              )}

              <div className="p-3 rounded-lg bg-purple-950/20 border border-purple-500/20 text-xs text-purple-200">
                <span className="font-semibold text-purple-400">Simulation Mapping: </span>
                When graph hops cross permissions (e.g. Workstation to Portal, or Database read), this technique is dynamically mapped to the step in the simulation report.
              </div>
            </Card>
          ) : (
            <Card className="p-8 text-center text-slate-500 text-xs">
              Select a MITRE technique to view tactical profile and detection instructions.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}