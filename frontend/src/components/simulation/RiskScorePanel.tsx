import React from 'react';
import { RiskScore } from '../../types';
import { Card } from '../ui/Card';
import { ShieldAlert, Info } from 'lucide-react';
import clsx from 'clsx';

interface RiskScorePanelProps {
  riskScore?: RiskScore | any;
}

export const RiskScorePanel: React.FC<RiskScorePanelProps> = ({ riskScore }) => {
  const score = riskScore?.score ?? 0;
  const level = riskScore?.level || (score >= 76 ? 'CRITICAL' : score >= 51 ? 'HIGH' : score >= 26 ? 'MEDIUM' : 'LOW');

  const getScoreColor = () => {
    switch (String(level).toUpperCase()) {
      case 'CRITICAL':
        return { text: 'text-red-500', bg: 'bg-red-500', border: 'border-red-500/30', badge: 'bg-red-500/20 text-red-400 border-red-500/30' };
      case 'HIGH':
        return { text: 'text-orange-500', bg: 'bg-orange-500', border: 'border-orange-500/30', badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30' };
      case 'MEDIUM':
        return { text: 'text-amber-400', bg: 'bg-amber-400', border: 'border-amber-400/30', badge: 'bg-amber-400/20 text-amber-400 border-amber-400/30' };
      default:
        return { text: 'text-emerald-400', bg: 'bg-emerald-400', border: 'border-emerald-400/30', badge: 'bg-emerald-400/20 text-emerald-400 border-emerald-400/30' };
    }
  };

  const colors = getScoreColor();

  return (
    <Card className={clsx("border", colors.border)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className={clsx("w-5 h-5", colors.text)} />
          <h3 className="font-bold text-slate-100 text-base">Simulated Risk Score</h3>
        </div>
        <span className={clsx("text-xs font-bold font-mono px-2.5 py-0.5 rounded border uppercase", colors.badge)}>
          {level} RISK
        </span>
      </div>

      <div className="flex items-center gap-6 mb-4">
        <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900 border border-slate-800 min-w-[95px]">
          <div className={clsx("text-4xl font-extrabold font-mono", colors.text)}>
            {score}
          </div>
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">/ 100</div>
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Simulation Threat Index</span>
            <span className="font-mono font-semibold">{score}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div 
              className={clsx("h-full transition-all duration-700 rounded-full", colors.bg)}
              style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0-25 Low</span>
            <span>26-50 Med</span>
            <span>51-75 High</span>
            <span>76-100 Crit</span>
          </div>
        </div>
      </div>

      <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-300">Simulated Model Formula:</span> Based on graph reachability, node privilege jumps, asset criticality, and active security control mitigation factor. This represents virtual path exposure, not real-world breach probability.
        </div>
      </div>
    </Card>
  );
};
