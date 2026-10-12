import React from 'react';
import { BlastRadius } from '../../types';
import { Card } from '../ui/Card';
import { AlertOctagon, Server, Database, Layers, User, ShieldAlert, Monitor } from 'lucide-react';

interface BlastRadiusPanelProps {
  blastRadius?: BlastRadius | any;
}

export const BlastRadiusPanel: React.FC<BlastRadiusPanelProps> = ({ blastRadius }) => {
  if (!blastRadius) {
    return (
      <Card className="border-red-500/20 bg-slate-900/90 p-4">
        <p className="text-xs text-slate-400">Blast radius data not available.</p>
      </Card>
    );
  }

  const byType = blastRadius.by_type || {};
  const total = blastRadius.total_assets ?? 0;
  const critical = blastRadius.critical_assets ?? 0;
  const databases = blastRadius.databases ?? byType.database ?? 0;
  const servers = blastRadius.servers ?? byType.server ?? 0;
  const users = blastRadius.users ?? byType.user ?? 0;
  const applications = blastRadius.applications ?? byType.application ?? 0;
  const workstations = blastRadius.workstations ?? byType.workstation ?? 0;

  return (
    <Card className="border-red-500/20 bg-gradient-to-b from-slate-900/90 to-slate-950/90">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-red-400" />
          <h3 className="font-bold text-slate-100 text-base">Potential Blast Radius</h3>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
          Impact Zone
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
          <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" /> Total Affected
          </div>
          <div className="text-2xl font-bold font-mono text-red-400">
            {total}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Simulated nodes reachable</div>
        </div>

        <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
          <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1.5">
            <AlertOctagon className="w-3.5 h-3.5 text-orange-400" /> Critical Assets
          </div>
          <div className="text-2xl font-bold font-mono text-orange-400">
            {critical}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Tier-1 high impact</div>
        </div>

        <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
          <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-amber-400" /> Databases
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">
            {databases}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Data stores exposed</div>
        </div>

        <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
          <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-purple-400" /> Servers
          </div>
          <div className="text-2xl font-bold font-mono text-purple-400">
            {servers}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Hosts compromised</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 text-center">
        <div className="text-xs">
          <span className="text-slate-400 flex items-center justify-center gap-1">
            <User className="w-3 h-3 text-blue-400" /> Users:
          </span>
          <span className="font-mono font-bold text-slate-200 ml-1">{users}</span>
        </div>
        <div className="text-xs">
          <span className="text-slate-400 flex items-center justify-center gap-1">
            <Layers className="w-3 h-3 text-emerald-400" /> Apps:
          </span>
          <span className="font-mono font-bold text-slate-200 ml-1">{applications}</span>
        </div>
        <div className="text-xs">
          <span className="text-slate-400 flex items-center justify-center gap-1">
            <Monitor className="w-3 h-3 text-cyan-400" /> Workstations:
          </span>
          <span className="font-mono font-bold text-slate-200 ml-1">{workstations}</span>
        </div>
      </div>
    </Card>
  );
};
