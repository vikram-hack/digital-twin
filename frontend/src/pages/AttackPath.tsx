import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ReactFlow, 
  Controls, 
  Background, 
  Node, 
  Edge,
  MarkerType 
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useSimulationStore } from '../store/simulationStore';
import { AssetNode } from '../components/nodes/AssetNode';
import { Card } from '../components/ui/Card';
import { 
  Route, 
  Flame, 
  ArrowRight, 
  Terminal, 
  ShieldAlert, 
  Info,
  Server,
  PlayCircle
} from 'lucide-react';
import clsx from 'clsx';

export default function AttackPath() {
  const navigate = useNavigate();
  const { currentSimulation } = useSimulationStore();
  const [selectedStepIdx, setSelectedStepIdx] = useState<number>(0);

  const nodeTypes = useMemo(() => ({
    asset: AssetNode
  }), []);

  const attackPath = currentSimulation?.attack_path || [];

  // Build sequential flow nodes specifically for the attack chain
  const { flowNodes, flowEdges } = useMemo(() => {
    if (!attackPath.length) return { flowNodes: [], flowEdges: [] };

    const nodes: Node[] = attackPath.map((step, idx) => ({
      id: step.asset_id,
      type: 'asset',
      position: { x: 50 + idx * 260, y: 180 + (idx % 2 === 0 ? 0 : 50) },
      data: {
        id: step.asset_id,
        name: step.asset_name,
        type: step.asset_type,
        criticality: step.criticality,
        privilege_level: step.privilege_level,
        status: idx === 0 ? 'compromised' : 'in-path',
        step_number: idx + 1,
      },
    }));

    const edges: Edge[] = [];
    for (let i = 0; i < attackPath.length - 1; i++) {
      const source = attackPath[i];
      const target = attackPath[i + 1];

      edges.push({
        id: `e-${source.asset_id}-${target.asset_id}`,
        source: source.asset_id,
        target: target.asset_id,
        animated: true,
        style: { stroke: '#ef4444', strokeWidth: 3 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#ef4444',
          width: 18,
          height: 18,
        },
        label: target.reached_via || 'CONNECTS_TO',
        labelStyle: { fill: '#fca5a5', fontSize: 11, fontFamily: 'monospace', fontWeight: 600 },
        labelBgStyle: { fill: '#1e1b4b', fillOpacity: 0.9 },
      });
    }

    return { flowNodes: nodes, flowEdges: edges };
  }, [attackPath]);

  const selectedNode = attackPath[selectedStepIdx];

  if (!currentSimulation || attackPath.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] text-center p-6">
        <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/20 mb-4">
          <Route className="w-12 h-12 text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-100">No Active Attack Path Simulated</h2>
        <p className="text-xs text-slate-400 max-w-md mt-1 mb-6">
          To visualize an animated attack chain, choose an asset and launch a simulation on the Attack Simulation page.
        </p>
        <button
          onClick={() => navigate('/simulation')}
          className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-red-600/30"
        >
          <PlayCircle className="w-4 h-4" />
          <span>Launch First Simulation</span>
        </button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col gap-4">
      {/* Top Banner */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-red-400" />
          <h2 className="font-bold text-sm text-slate-100">
            Dedicated Attack Path Analyzer: {currentSimulation.scenario_name}
          </h2>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
            {attackPath.length} Exploited Stages
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/simulation')}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors font-mono"
          >
            Back to Simulator
          </button>
        </div>
      </div>

      {/* Main Path Graph */}
      <div className="flex-1 rounded-xl border border-slate-800 bg-[#070b14] overflow-hidden relative shadow-inner min-h-0">
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          nodeTypes={nodeTypes}
          onNodeClick={(_, node) => {
            const idx = attackPath.findIndex((s) => s.asset_id === node.id);
            if (idx !== -1) setSelectedStepIdx(idx);
          }}
          fitView
          colorMode="dark"
        >
          <Background color="#1e293b" gap={25} size={1} />
          <Controls position="bottom-left" />
        </ReactFlow>

        {/* Step Inspector floating overlay */}
        {selectedNode && (
          <div className="absolute top-4 right-4 w-80 bg-slate-900/95 border border-slate-800 rounded-xl p-4 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
              <span className="text-xs font-bold text-slate-200">Stage {selectedStepIdx + 1} Inspector</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">
                {selectedNode.asset_type.toUpperCase()}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-mono">Asset Name</div>
                <div className="font-bold text-slate-100">{selectedNode.asset_name}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px]">Privilege:</span>
                  <div className="font-bold text-purple-400">Level {selectedNode.privilege_level}</div>
                </div>
                <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px]">Criticality:</span>
                  <div className="font-bold text-red-400">{selectedNode.criticality}/5</div>
                </div>
              </div>

              <div>
                <div className="text-slate-400 text-[10px] uppercase font-mono">Ingress Relationship</div>
                <div className="font-mono text-cyan-300 text-xs mt-0.5">
                  {selectedNode.reached_via || 'INITIAL ACCESS'}
                </div>
              </div>

              <div>
                <div className="text-slate-400 text-[10px] uppercase font-mono">Simulated ATT&CK Technique</div>
                <div className="font-mono text-purple-300 text-xs mt-0.5">
                  {selectedNode.mitre_technique || 'T1078 Valid Accounts'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Step Strip */}
      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-mono uppercase text-slate-500 shrink-0 mr-2">Attack Flow:</span>
        {attackPath.map((node, i) => (
          <React.Fragment key={node.asset_id}>
            {i > 0 && <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />}
            <button
              onClick={() => setSelectedStepIdx(i)}
              className={clsx(
                "px-3 py-1.5 rounded-lg border text-xs font-mono shrink-0 transition-all flex items-center gap-2",
                selectedStepIdx === i
                  ? "bg-red-500/20 text-red-300 border-red-500/40 shadow-sm ring-1 ring-red-500/40"
                  : "bg-slate-950/80 text-slate-400 border-slate-800 hover:text-white"
              )}
            >
              <span className="font-bold text-[10px] opacity-60">#{i + 1}</span>
              <span>{node.asset_name}</span>
            </button>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}