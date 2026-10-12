import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAssets } from '../api/assets';
import { Asset } from '../types';
import { Card } from '../components/ui/Card';
import { useSimulationStore } from '../store/simulationStore';
import { 
  Server, 
  Search, 
  Filter, 
  Flame, 
  User, 
  Monitor, 
  Database, 
  Layers, 
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  X,
  ExternalLink
} from 'lucide-react';
import clsx from 'clsx';

const getAssetIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'user': return <User className="w-4 h-4 text-blue-400" />;
    case 'workstation': return <Monitor className="w-4 h-4 text-cyan-400" />;
    case 'server': return <Server className="w-4 h-4 text-purple-400" />;
    case 'database': return <Database className="w-4 h-4 text-amber-400" />;
    case 'application': return <Layers className="w-4 h-4 text-emerald-400" />;
    case 'security_system': return <ShieldCheck className="w-4 h-4 text-indigo-400" />;
    default: return <Server className="w-4 h-4 text-slate-400" />;
  }
};

export default function Assets() {
  const navigate = useNavigate();
  const { setSelectedAssetId } = useSimulationStore();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [sortField, setSortField] = useState<'name' | 'criticality' | 'privilege_level'>('criticality');
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAssets()
      .then((data) => {
        setAssets(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load assets:', err);
        setAssets([]);
        setLoading(false);
      });
  }, []);

  const filteredAssets = useMemo(() => {
    return assets
      .filter((a) => {
        const matchesType = typeFilter === 'ALL' || a.type.toLowerCase() === typeFilter.toLowerCase();
        const matchesSearch = !searchTerm || 
          a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (a.ip_address && a.ip_address.includes(searchTerm)) ||
          (a.department && a.department.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesType && matchesSearch;
      })
      .sort((a, b) => {
        let valA = (a as any)[sortField] ?? 0;
        let valB = (b as any)[sortField] ?? 0;
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [assets, searchTerm, typeFilter, sortField, sortAsc]);

  const handleSimulate = (assetId: string) => {
    setSelectedAssetId(assetId);
    navigate('/simulation');
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-400" />
            Enterprise Digital Twin Asset Inventory
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Complete inventory of 37 simulated identities, computing hosts, and sensitive data repositories.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search assets, IPs, depts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 w-52 font-mono"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="py-1.5 px-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Types ({assets.length})</option>
            <option value="user">Users</option>
            <option value="workstation">Workstations</option>
            <option value="server">Servers</option>
            <option value="database">Databases</option>
            <option value="application">Applications</option>
            <option value="security_system">Security Systems</option>
          </select>
        </div>
      </div>

      {/* Asset Table */}
      <Card className="p-0 overflow-hidden border-slate-800 bg-slate-900/90">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-3">Asset</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Department</th>
                <th 
                  className="py-3 px-3 cursor-pointer hover:text-white"
                  onClick={() => {
                    if (sortField === 'criticality') setSortAsc(!sortAsc);
                    else { setSortField('criticality'); setSortAsc(false); }
                  }}
                >
                  <div className="flex items-center gap-1">
                    <span>Criticality</span>
                    {sortField === 'criticality' && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  </div>
                </th>
                <th 
                  className="py-3 px-3 cursor-pointer hover:text-white"
                  onClick={() => {
                    if (sortField === 'privilege_level') setSortAsc(!sortAsc);
                    else { setSortField('privilege_level'); setSortAsc(false); }
                  }}
                >
                  <div className="flex items-center gap-1">
                    <span>Privilege</span>
                    {sortField === 'privilege_level' && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  </div>
                </th>
                <th className="py-3 px-3">Virtual IP</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-mono">
                    Loading digital twin assets...
                  </td>
                </tr>
              ) : filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-mono">
                    No matching assets found.
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => (
                  <tr 
                    key={asset.id} 
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                    onClick={() => setSelectedAsset(asset)}
                  >
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1 rounded bg-slate-800 border border-slate-700">
                          {getAssetIcon(asset.type)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-200">{asset.name}</div>
                          <div className="font-mono text-[10px] text-slate-500">{asset.id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-2.5 px-3">
                      <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {asset.type}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-slate-300 font-medium">
                      {asset.department || 'IT Operations'}
                    </td>

                    <td className="py-2.5 px-3 font-mono">
                      <span className={clsx(
                        "px-1.5 py-0.5 rounded text-[10px] font-bold",
                        asset.criticality >= 5 ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                        asset.criticality >= 4 ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" :
                        asset.criticality >= 3 ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                        "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      )}>
                        {asset.criticality} / 5
                      </span>
                    </td>

                    <td className="py-2.5 px-3 font-mono">
                      <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                        Level {asset.privilege_level ?? 1}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">
                      {asset.ip_address || '10.0.0.x'}
                    </td>

                    <td className="py-2.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleSimulate(asset.id)}
                        className="px-2.5 py-1 rounded bg-red-600/80 hover:bg-red-500 text-white font-semibold text-[11px] font-mono transition-colors flex items-center gap-1 ml-auto shadow-sm"
                      >
                        <Flame className="w-3 h-3" />
                        <span>Simulate</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Asset Detail Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setSelectedAsset(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                {getAssetIcon(selectedAsset.type)}
              </div>
              <div>
                <h3 className="font-bold text-base text-white">{selectedAsset.name}</h3>
                <p className="text-xs text-slate-400 font-mono">{selectedAsset.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase">Type</span>
                <div className="font-bold text-slate-200 uppercase mt-0.5">{selectedAsset.type}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase">Department</span>
                <div className="font-bold text-slate-200 mt-0.5">{selectedAsset.department}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase">Criticality</span>
                <div className="font-bold text-red-400 mt-0.5">{selectedAsset.criticality} of 5</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase">Privilege Level</span>
                <div className="font-bold text-purple-400 mt-0.5">Level {selectedAsset.privilege_level}</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
              <div className="font-semibold text-slate-200">Simulated Digital Twin Properties</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Represents a virtual asset within the corporate network topology with configured authentication and trust relationships to adjacent services.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleSimulate(selectedAsset.id)}
                className="flex-1 py-2 px-4 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-600/30"
              >
                <Flame className="w-4 h-4" />
                <span>Simulate Compromise on this Asset</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}