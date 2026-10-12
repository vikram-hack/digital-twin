import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ReactFlow, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState,
  Node,
  Edge,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { getTopology } from '../api/topology';
import { AssetNode } from '../components/nodes/AssetNode';
import { calculateTopologyLayout } from '../components/topology/layoutUtils';
import { useSimulationStore } from '../store/simulationStore';
import { Card } from '../components/ui/Card';
import { 
  Network, 
  Search, 
  Filter, 
  Flame, 
  Info, 
  Server, 
  User, 
  Database, 
  Layers, 
  Monitor, 
  ShieldCheck,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import clsx from 'clsx';

export default function DigitalTwin() {
  const navigate = useNavigate();
  const { currentSimulation, setSelectedAssetId } = useSimulationStore();

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [rawNodes, setRawNodes] = useState<any[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [filterType, setFilterType] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const nodeTypes = useMemo(() => ({
    asset: AssetNode
  }), []);

  useEffect(() => {
    getTopology()
      .then((res) => {
        setRawNodes(res.nodes);
        const positions = calculateTopologyLayout(res.nodes);

        // Map attack path statuses if simulation exists
        const pathAssetMap = new Map();
        if (currentSimulation?.attack_path) {
          currentSimulation.attack_path.forEach((step, idx) => {
            pathAssetMap.set(step.asset_id, {
              status: idx === 0 ? 'compromised' : 'in-path',
              stepNumber: idx + 1,
            });
          });
        }

        const flowNodes: Node[] = res.nodes.map((n) => {
          const pathInfo = pathAssetMap.get(n.id);
          const status = pathInfo ? pathInfo.status : (n.criticality >= 5 ? 'critical' : 'normal');

          return {
            id: n.id,
            type: 'asset',
            position: positions[n.id] || { x: 100, y: 100 },
            data: {
              id: n.id,
              name: n.name,
              type: n.type,
              criticality: n.criticality,
              privilege_level: n.privilege_level,
              ip_address: n.ip_address,
              department: n.department,
              status: status,
              step_number: pathInfo?.stepNumber,
            },
          };
        });

        const flowEdges: Edge[] = res.edges.map((e) => {
          const isAttackEdge = currentSimulation?.attack_path?.some((node, idx) => {
            if (idx === 0) return false;
            const prev = currentSimulation.attack_path[idx - 1];
            return prev.asset_id === e.source && node.asset_id === e.target;
          });

          return {
            id: e.id,
            source: e.source,
            target: e.target,
            animated: isAttackEdge,
            style: {
              stroke: isAttackEdge ? '#ef4444' : '#334155',
              strokeWidth: isAttackEdge ? 2.5 : 1.2,
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: isAttackEdge ? '#ef4444' : '#64748b',
              width: 15,
              height: 15,
            },
            label: e.label || e.relationship_type,
            labelStyle: { fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' },
            labelBgStyle: { fill: '#0f172a', fillOpacity: 0.8 },
          };
        });

        setNodes(flowNodes);
        setEdges(flowEdges);
        setSelectedAsset(res.nodes[0]);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load topology:', err);
        setLoading(false);
      });
  }, [currentSimulation]);

  const handleNodeClick = (_: React.MouseEvent, node: Node) => {
    const asset = rawNodes.find((n) => n.id === node.id);
    if (asset) {
      setSelectedAsset(asset);
    }
  };

  const handleSimulateAsset = (assetId: string) => {
    setSelectedAssetId(assetId);
    navigate('/simulation');
  };

  // Filtered nodes
  const displayNodes = useMemo(() => {
    return nodes.map((node) => {
      const matchesType = filterType === 'ALL' || (node.data as any).type?.toLowerCase() === filterType.toLowerCase();
      const matchesSearch = !searchTerm || (node.data as any).name?.toLowerCase().includes(searchTerm.toLowerCase());
      const isVisible = matchesType && matchesSearch;

      return {
        ...node,
        style: {
          opacity: isVisible ? 1 : 0.2,
          pointerEvents: (isVisible ? 'auto' : 'none') as React.CSSProperties['pointerEvents'],
        },
      };
    });
  }, [nodes, filterType, searchTerm]);

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col gap-4">
      {/* Top Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2">
          <Network className="w-5 h-5 text-blue-400" />
          <h2 className="font-bold text-sm text-slate-100">Digital Twin Topology Viewer</h2>
          <span className="text-xs text-slate-400 font-mono">
            ({rawNodes.length} Assets, {edges.length} Relationships)
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 w-44 font-mono"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="py-1.5 px-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Categories</option>
              <option value="user">Users</option>
              <option value="workstation">Workstations</option>
              <option value="server">Servers</option>
              <option value="database">Databases</option>
              <option value="application">Applications</option>
              <option value="security_system">Security Systems</option>
            </select>
          </div>

          {currentSimulation && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-mono">
              <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <span>Attack Overlay Active</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Flow Canvas & Details Drawer */}
      <div className="flex-1 flex gap-4 min-h-0 relative">
        {/* React Flow Canvas */}
        <div className="flex-1 rounded-xl border border-slate-800 bg-[#0a0e1a] overflow-hidden relative shadow-inner">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
            </div>
          ) : (
            <ReactFlow
              nodes={displayNodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={handleNodeClick}
              nodeTypes={nodeTypes}
              fitView
              colorMode="dark"
              minZoom={0.2}
              maxZoom={1.5}
            >
              <Background color="#1e293b" gap={20} size={1} />
              <Controls position="bottom-left" />
            </ReactFlow>
          )}

          {/* Legend Overlay */}
          <div className="absolute top-3 left-3 bg-slate-900/90 border border-slate-800/90 rounded-lg p-2.5 text-[10px] space-y-1 font-mono text-slate-400 backdrop-blur pointer-events-none">
            <div className="font-bold text-slate-200 uppercase tracking-wider mb-1">Topology Legend</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-blue-500/30 border border-blue-500" /> Users (L1-L5)</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-cyan-500/30 border border-cyan-500" /> Workstations</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-purple-500/30 border border-purple-500" /> Core Servers</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-500/30 border border-amber-500" /> Databases</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500/30 border border-emerald-500" /> Applications</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-red-500/30 border border-red-500 animate-pulse" /> Compromised</div>
          </div>
        </div>

        {/* Selected Asset Sidebar Inspector */}
        {selectedAsset && (
          <div className="w-80 flex flex-col shrink-0">
            <Card className="h-full bg-slate-900 border-slate-800 p-4 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold text-slate-200">Asset Detail</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                    {selectedAsset.type}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <h3 className="font-bold text-sm text-slate-100">{selectedAsset.name}</h3>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">{selectedAsset.id}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-500">Criticality</div>
                      <div className="font-bold text-red-400 mt-0.5">{selectedAsset.criticality} / 5</div>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-500">Privilege Level</div>
                      <div className="font-bold text-purple-400 mt-0.5">Level {selectedAsset.privilege_level}</div>
                    </div>
                  </div>

                  <div className="space-y-1.5 p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">IP Address:</span>
                      <span className="text-slate-300">{selectedAsset.ip_address || '10.0.0.x (Virtual)'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Department:</span>
                      <span className="text-slate-300">{selectedAsset.department || 'Operations'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Access Mode:</span>
                      <span className="text-emerald-400">Virtual Twin Node</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase font-mono text-slate-500 mb-1">Simulated Threat Vector</div>
                    <p className="text-[11px] text-slate-300 p-2.5 rounded bg-slate-950 border border-slate-800 leading-relaxed">
                      This asset possesses graph edges to adjacent services. Selecting "Simulate Compromise" evaluates graph traversal, privilege escalation hops, and downstream database exposures.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-800 mt-4">
                <button
                  onClick={() => handleSimulateAsset(selectedAsset.id)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors shadow-lg shadow-red-600/30"
                >
                  <Flame className="w-4 h-4" />
                  <span>Simulate Compromise From Here</span>
                </button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
