import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { 
  User, 
  Monitor, 
  Server, 
  Database, 
  Layers, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle,
  Flame
} from 'lucide-react';
import clsx from 'clsx';

export interface AssetNodeData {
  id: string;
  name: string;
  type: string;
  criticality: number;
  privilege_level: number;
  ip_address?: string;
  department?: string;
  status?: 'normal' | 'compromised' | 'at-risk' | 'in-path' | 'protected';
  step_number?: number;
}

const getAssetIcon = (type?: string, status?: string) => {
  if (status === 'compromised') return <Flame className="w-5 h-5 text-red-500 animate-pulse" />;
  if (status === 'at-risk' || status === 'in-path') return <AlertTriangle className="w-5 h-5 text-amber-400" />;
  
  switch ((type || '').toLowerCase()) {
    case 'user':
      return <User className="w-5 h-5 text-blue-400" />;
    case 'workstation':
      return <Monitor className="w-5 h-5 text-cyan-400" />;
    case 'server':
      return <Server className="w-5 h-5 text-purple-400" />;
    case 'database':
      return <Database className="w-5 h-5 text-amber-500" />;
    case 'application':
      return <Layers className="w-5 h-5 text-emerald-400" />;
    case 'security_system':
      return <ShieldCheck className="w-5 h-5 text-indigo-400" />;
    default:
      return <Server className="w-5 h-5 text-slate-400" />;
  }
};

const getStatusBadge = (status?: string, stepNumber?: number) => {
  if (status === 'compromised') {
    return <span className="bg-red-500/20 text-red-400 border border-red-500/40 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider animate-pulse">Compromised</span>;
  }
  if (status === 'in-path') {
    return <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] px-1.5 py-0.5 rounded font-bold">Step {stepNumber ?? ''}</span>;
  }
  if (status === 'at-risk') {
    return <span className="bg-orange-500/20 text-orange-400 border border-orange-500/40 text-[10px] px-1.5 py-0.5 rounded font-semibold">At Risk</span>;
  }
  if (status === 'protected') {
    return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] px-1.5 py-0.5 rounded font-semibold">Protected</span>;
  }
  return null;
};

export const AssetNode = memo(({ data }: { data: AssetNodeData }) => {
  const isCompromised = data.status === 'compromised';
  const isInPath = data.status === 'in-path';
  const isAtRisk = data.status === 'at-risk';
  const isProtected = data.status === 'protected';

  return (
    <div
      className={clsx(
        "rounded-xl p-3 min-w-[210px] shadow-lg transition-all duration-300 relative border",
        isCompromised && "bg-red-950/40 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)] ring-2 ring-red-500/50",
        isInPath && "bg-amber-950/30 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]",
        isAtRisk && "bg-orange-950/20 border-orange-500/60 shadow-[0_0_10px_rgba(249,115,22,0.2)]",
        isProtected && "bg-emerald-950/20 border-emerald-500/60",
        !isCompromised && !isInPath && !isAtRisk && !isProtected && "bg-slate-900/90 border-slate-700/80 hover:border-blue-500/60"
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-slate-400 !w-2.5 !h-2.5" />
      <Handle type="target" position={Position.Left} className="!bg-slate-400 !w-2.5 !h-2.5" />
      
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700">
            {getAssetIcon(data.type, data.status)}
          </div>
          <div>
            <div className="font-semibold text-xs text-slate-100 truncate max-w-[120px]" title={data.name}>
              {data.name}
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
              {data.type}
            </div>
          </div>
        </div>
        {getStatusBadge(data.status, data.step_number)}
      </div>

      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1 font-mono text-[10px]">
          {data.ip_address || data.department || 'INTERNAL'}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-slate-500 font-mono">Priv</span>
          <span className={clsx(
            "px-1 rounded text-[10px] font-bold font-mono",
            data.privilege_level >= 4 ? "bg-red-500/20 text-red-400" :
            data.privilege_level >= 2 ? "bg-amber-500/20 text-amber-400" : "bg-blue-500/20 text-blue-400"
          )}>
            L{data.privilege_level}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-[10px] text-slate-500 font-mono">Crit</span>
          <span className={clsx(
            "text-[10px] font-bold",
            data.criticality >= 4 ? "text-red-400" : data.criticality >= 3 ? "text-amber-400" : "text-slate-400"
          )}>
            {data.criticality}/5
          </span>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-slate-400 !w-2.5 !h-2.5" />
      <Handle type="source" position={Position.Right} className="!bg-slate-400 !w-2.5 !h-2.5" />
    </div>
  );
});

AssetNode.displayName = 'AssetNode';
