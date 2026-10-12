import React from 'react';
import { PrivilegeEscalation } from '../../types';
import { Card } from '../ui/Card';
import { TrendingUp, ArrowRight, ShieldCheck } from 'lucide-react';

interface PrivilegeEscalationPanelProps {
  escalations?: (PrivilegeEscalation | any)[];
}

export const PrivilegeEscalationPanel: React.FC<PrivilegeEscalationPanelProps> = ({ escalations = [] }) => {
  const list = Array.isArray(escalations) ? escalations : [];

  return (
    <Card className="border-purple-500/20 bg-slate-900/80">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          <h3 className="font-bold text-slate-100 text-sm">Privilege Escalation Detected</h3>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
          {list.length} Event{list.length !== 1 ? 's' : ''}
        </span>
      </div>

      {list.length === 0 ? (
        <div className="flex items-center gap-2 text-xs text-slate-400 p-3 rounded-lg bg-slate-950/40 border border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>No privilege boundary transitions detected along the evaluated path.</span>
        </div>
      ) : (
        <div className="space-y-2">
          {list.map((esc, i) => {
            const fromLabel = esc.from_asset || `Privilege L${esc.from_level}`;
            const toLabel = esc.to_asset || esc.asset_id || `Privilege L${esc.to_level}`;

            return (
              <div key={i} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium">{fromLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-slate-200 font-bold">{toLabel}</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    L{esc.from_level}
                  </span>
                  <span className="text-purple-400">→</span>
                  <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                    L{esc.to_level}
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
