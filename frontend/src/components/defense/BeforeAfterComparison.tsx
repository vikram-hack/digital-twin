import React from 'react';
import { WhatIfResponse } from '../../types';
import { Card } from '../ui/Card';
import { ShieldCheck, ArrowRight, TrendingDown, CheckCircle2, XCircle } from 'lucide-react';
import clsx from 'clsx';

interface BeforeAfterComparisonProps {
  whatIfResult: WhatIfResponse;
  controlName?: string;
}

export const BeforeAfterComparison: React.FC<BeforeAfterComparisonProps> = ({ whatIfResult, controlName }) => {
  const { baseline, modified, comparison } = whatIfResult;

  const baselineRisk = baseline.risk_score.score;
  const modifiedRisk = modified.risk_score.score;
  const riskDiff = modifiedRisk - baselineRisk;

  const baselineBlast = baseline.blast_radius.total_assets;
  const modifiedBlast = modified.blast_radius.total_assets;
  const blastDiff = modifiedBlast - baselineBlast;

  const pathsBlocked = comparison.paths_blocked;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-slate-100 text-base">
            Defense Simulation Impact: Before vs After
          </h3>
        </div>
        {controlName && (
          <span className="text-xs px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold font-mono">
            Control: {controlName}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Metric 1: Paths Blocked */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/30 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Attack Paths Blocked</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-0.5">
              +{pathsBlocked}
            </div>
            <div className="text-[10px] text-slate-500">Traversals halted</div>
          </div>
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2: Blast Radius Reduction */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-blue-500/30 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Blast Radius Change</div>
            <div className="text-2xl font-bold font-mono text-blue-400 mt-0.5">
              {blastDiff <= 0 ? `${blastDiff}` : `+${blastDiff}`}
            </div>
            <div className="text-[10px] text-slate-500">{modifiedBlast} affected (was {baselineBlast})</div>
          </div>
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3: Risk Score Change */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-purple-500/30 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Risk Score Change</div>
            <div className={clsx(
              "text-2xl font-bold font-mono mt-0.5",
              riskDiff < 0 ? "text-emerald-400" : "text-amber-400"
            )}>
              {riskDiff <= 0 ? `${riskDiff}` : `+${riskDiff}`} pts
            </div>
            <div className="text-[10px] text-slate-500">{modifiedRisk} score (was {baselineRisk})</div>
          </div>
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Side-by-side path comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Baseline (Before) */}
        <Card className="border-red-500/30 bg-red-950/10">
          <div className="flex items-center justify-between pb-2 border-b border-red-500/20 mb-3">
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider font-mono">
              Baseline (Unmitigated)
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {baseline.attack_path.length} hops • {baselineBlast} assets exposed
            </span>
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            {baseline.attack_path.map((node, i) => (
              <div key={i} className="flex items-center gap-2 p-1.5 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-500 w-4">{i + 1}.</span>
                <span className="text-slate-300 font-medium">{node.asset_name}</span>
                <span className="text-[10px] text-slate-500 uppercase ml-auto">({node.asset_type})</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Modified (After) */}
        <Card className="border-emerald-500/30 bg-emerald-950/10">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20 mb-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
              Modified (With Defense Applied)
            </span>
            <span className="text-xs text-emerald-400 font-mono">
              {modified.attack_path.length} hops • {modifiedBlast} assets exposed
            </span>
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            {modified.attack_path.map((node, i) => (
              <div key={i} className="flex items-center gap-2 p-1.5 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-500 w-4">{i + 1}.</span>
                <span className="text-emerald-300 font-medium">{node.asset_name}</span>
                <span className="text-[10px] text-slate-500 uppercase ml-auto">({node.asset_type})</span>
              </div>
            ))}
            {modified.attack_path.length < baseline.attack_path.length && (
              <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Subsequent propagation blocked by security policy isolation!</span>
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-emerald-400">Simulation Finding: </span>
          {comparison.summary || `Enabling security control reduced reachable enterprise attack paths by ${pathsBlocked}, limiting potential lateral movement.`}
        </div>
      </div>
    </div>
  );
};
