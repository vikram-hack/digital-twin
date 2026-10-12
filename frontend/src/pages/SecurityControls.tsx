import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSecurityControls, toggleControl } from '../api/securityControls';
import { SecurityControl } from '../types';
import { Card } from '../components/ui/Card';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Network, 
  Activity, 
  Key, 
  RotateCw, 
  Check, 
  X,
  PlayCircle,
  TrendingUp,
  Sliders
} from 'lucide-react';
import clsx from 'clsx';

export default function SecurityControls() {
  const navigate = useNavigate();
  const [controls, setControls] = useState<SecurityControl[]>([]);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSecurityControls()
      .then((data) => {
        setControls(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load controls:', err);
        setLoading(false);
      });
  }, []);

  const handleToggle = async (controlId: string) => {
    setTogglingId(controlId);
    try {
      const updated = await toggleControl(controlId);
      setControls((prev) =>
        prev.map((c) => (c.id === controlId ? { ...c, is_enabled: updated.is_enabled } : c))
      );
    } catch (err) {
      console.error('Failed to toggle control:', err);
    } finally {
      setTogglingId(null);
    }
  };

  const activeCount = controls.filter((c) => c.is_enabled).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Defensive Security Control Management
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure simulated enterprise defense mechanisms and observe their dampening effect on attack graph propagation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-400 font-mono">Active Policy Posture:</div>
            <div className="text-sm font-bold font-mono text-emerald-400">
              {activeCount} of {controls.length} Controls Active
            </div>
          </div>
          <button
            onClick={() => navigate('/simulation')}
            className="px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-red-600/30"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Test in Simulation</span>
          </button>
        </div>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {controls.map((control) => {
          const isToggling = togglingId === control.id;

          return (
            <Card
              key={control.id}
              className={clsx(
                "p-5 transition-all flex flex-col justify-between border",
                control.is_enabled
                  ? "bg-slate-900/90 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.08)]"
                  : "bg-slate-950/60 border-slate-800 opacity-75 hover:opacity-100"
              )}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm">{control.name}</h3>
                    <div className="text-[10px] text-slate-500 font-mono uppercase mt-0.5">
                      {control.type}
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => handleToggle(control.id)}
                    disabled={isToggling}
                    className={clsx(
                      "w-12 h-6 rounded-full transition-colors relative p-0.5 flex items-center shrink-0 cursor-pointer",
                      control.is_enabled ? "bg-emerald-600" : "bg-slate-800"
                    )}
                  >
                    <div
                      className={clsx(
                        "w-5 h-5 rounded-full bg-white transition-transform shadow-md flex items-center justify-center text-[10px]",
                        control.is_enabled ? "translate-x-6 text-emerald-600" : "translate-x-0 text-slate-500"
                      )}
                    >
                      {control.is_enabled ? <Check className="w-3 h-3 stroke-[3]" /> : <X className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {control.description}
                </p>

                {/* Effect Details */}
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 mb-4 leading-relaxed">
                  <span className="text-slate-200 font-semibold font-mono">Simulated Impact: </span>
                  {control.effect_description || 'Restricts graph edge traversal and adds privilege boundary validation.'}
                </div>
              </div>

              {/* Bottom Effectiveness Gauge */}
              <div className="pt-3 border-t border-slate-800/80">
                <div className="flex justify-between items-center text-[11px] font-mono mb-1.5">
                  <span className="text-slate-400">Mitigation Effectiveness:</span>
                  <span className="text-emerald-400 font-bold">{control.effectiveness}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={clsx(
                      "h-full rounded-full transition-all duration-500",
                      control.is_enabled ? "bg-emerald-500" : "bg-slate-600"
                    )}
                    style={{ width: `${control.effectiveness}%` }}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}