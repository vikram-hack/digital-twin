import React from 'react';
import { LateralMovement } from '../../types';
import { Card } from '../ui/Card';
import { Shuffle, ArrowRight, ShieldCheck } from 'lucide-react';

interface LateralMovementPanelProps {
  movements?: (LateralMovement | any)[];
}

export const LateralMovementPanel: React.FC<LateralMovementPanelProps> = ({ movements = [] }) => {
  const list = Array.isArray(movements) ? movements : [];

  return (
    <Card className="border-cyan-500/20 bg-slate-900/80">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Shuffle className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-slate-100 text-sm">Lateral Movement Detected</h3>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          {list.length} Transition{list.length !== 1 ? 's' : ''}
        </span>
      </div>

      {list.length === 0 ? (
        <div className="flex items-center gap-2 text-xs text-slate-400 p-3 rounded-lg bg-slate-950/40 border border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>No lateral transitions across system boundaries detected.</span>
        </div>
      ) : (
        <div className="space-y-2">
          {list.map((mov, i) => {
            const fromLabel = mov.from_asset || mov.source_id || 'Origin';
            const toLabel = mov.to_asset || mov.target_id || 'Target';

            return (
              <div key={i} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium">{fromLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-slate-200 font-bold">{toLabel}</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 uppercase text-[10px]">
                    {mov.from_type || 'host'}
                  </span>
                  <span className="text-cyan-400 font-semibold">{mov.relationship || 'via pivot'}</span>
                  <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold uppercase text-[10px]">
                    {mov.to_type || 'target'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
