import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats } from '../api/dashboard';
import { Card } from '../components/ui/Card';
import { AssetDistributionChart } from '../components/charts/AssetDistributionChart';
import { RiskDistributionChart } from '../components/charts/RiskDistributionChart';
import { TechniqueDistributionChart } from '../components/charts/TechniqueDistributionChart';
import { 
  Server, 
  ShieldAlert, 
  Users, 
  Database, 
  Layers, 
  ShieldCheck, 
  PlayCircle,
  AlertTriangle,
  Flame,
  ArrowRight
} from 'lucide-react';
import clsx from 'clsx';

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load dashboard stats:', err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const counts = data.counts || {};

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              Simulation Digital Twin Active
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white mt-1">
            Enterprise Infrastructure Digital Twin
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Synthetic model representing 37 IT enterprise assets, trust edges, and attack vectors.
          </p>
        </div>

        <button
          onClick={() => navigate('/simulation')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-red-600/30"
        >
          <Flame className="w-4 h-4" />
          <span>Launch Attack Simulation</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="p-4 bg-slate-900/90 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Assets</span>
            <Server className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{counts.total_assets || 37}</div>
          <div className="text-[10px] text-slate-500 mt-1">100% Synthetic nodes</div>
        </Card>

        <Card className="p-4 bg-slate-900/90 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Critical Assets</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-red-400">{counts.critical_assets || 22}</div>
          <div className="text-[10px] text-slate-500 mt-1">Tier-1 high impact</div>
        </Card>

        <Card className="p-4 bg-slate-900/90 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Users & Accounts</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400">{counts.users || 10}</div>
          <div className="text-[10px] text-slate-500 mt-1">Privilege L1 - L5</div>
        </Card>

        <Card className="p-4 bg-slate-900/90 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Servers & Hosts</span>
            <Server className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-400">{counts.servers || 6}</div>
          <div className="text-[10px] text-slate-500 mt-1">Core infra tier</div>
        </Card>

        <Card className="p-4 bg-slate-900/90 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Databases</span>
            <Database className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">{counts.databases || 4}</div>
          <div className="text-[10px] text-slate-500 mt-1">Sensitive data stores</div>
        </Card>

        <Card className="p-4 bg-slate-900/90 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Active Controls</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">{counts.active_controls || 5}</div>
          <div className="text-[10px] text-slate-500 mt-1">Mitigating edges</div>
        </Card>
      </div>

      {/* Row 2: Analytics Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-slate-900/90 border-slate-800">
          <h3 className="font-bold text-sm text-slate-200 mb-1">Asset Distribution</h3>
          <p className="text-[11px] text-slate-400 mb-3">Breakdown by infrastructure category</p>
          <AssetDistributionChart data={data.asset_distribution || []} />
        </Card>

        <Card className="p-4 bg-slate-900/90 border-slate-800">
          <h3 className="font-bold text-sm text-slate-200 mb-1">Simulated Risk Levels</h3>
          <p className="text-[11px] text-slate-400 mb-3">Severity rating across completed runs</p>
          <RiskDistributionChart data={data.risk_distribution || []} />
        </Card>

        <Card className="p-4 bg-slate-900/90 border-slate-800">
          <h3 className="font-bold text-sm text-slate-200 mb-1">Top MITRE ATT&CK Techniques</h3>
          <p className="text-[11px] text-slate-400 mb-3">Frequency of mapped attack techniques</p>
          <TechniqueDistributionChart data={data.technique_distribution || []} />
        </Card>
      </div>

      {/* Row 3: Recent Simulations & Critical Assets Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Recent Simulations */}
        <div className="lg:col-span-7">
          <Card className="p-4 bg-slate-900/90 border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-200">Recent Attack Simulations</h3>
                <p className="text-[11px] text-slate-400">Historical simulation executions and impact findings</p>
              </div>
              <button
                onClick={() => navigate('/simulation')}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
              >
                <span>New Run</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 font-mono text-[10px] uppercase">
                    <th className="py-2 px-2">Scenario</th>
                    <th className="py-2 px-2">Initial Asset</th>
                    <th className="py-2 px-2">Blast Radius</th>
                    <th className="py-2 px-2">Risk</th>
                    <th className="py-2 px-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {(data.recent_simulations || []).map((sim: any) => (
                    <tr key={sim.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-2 text-slate-200 font-sans font-medium">{sim.scenario}</td>
                      <td className="py-2.5 px-2 text-blue-400">{sim.initial_asset}</td>
                      <td className="py-2.5 px-2 text-slate-300">{sim.assets_affected} assets</td>
                      <td className="py-2.5 px-2">
                        <span className={clsx(
                          "px-1.5 py-0.5 rounded text-[10px] font-bold uppercase",
                          sim.risk_level === 'CRITICAL' ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                          sim.risk_level === 'HIGH' ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" :
                          sim.risk_level === 'MEDIUM' ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                          "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        )}>
                          {sim.risk_score} {sim.risk_level}
                        </span>
                      </td>
                      <td className="py-2.5 px-2">
                        <span className="text-emerald-400 text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          {sim.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Critical Assets Monitored */}
        <div className="lg:col-span-5">
          <Card className="p-4 bg-slate-900/90 border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-200">High-Criticality Assets</h3>
                <p className="text-[11px] text-slate-400">Target assets in the digital twin graph</p>
              </div>
              <button
                onClick={() => navigate('/assets')}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              {(data.critical_assets || []).map((asset: any) => (
                <div key={asset.id} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-slate-200">{asset.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono uppercase">
                      {asset.type} • {asset.department}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold">
                      Priv L{asset.privilege_level}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-mono text-[10px] font-bold">
                      Crit {asset.criticality}/5
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
