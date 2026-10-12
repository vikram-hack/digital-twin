import React, { useState } from 'react';
import { AttackPathNode } from '../../types';
import { Card } from '../ui/Card';
import { 
  ArrowDown, 
  ShieldAlert, 
  Terminal, 
  Flame, 
  Server, 
  Database, 
  Layers, 
  User, 
  Monitor, 
  ShieldCheck,
  ChevronRight,
  Info
} from 'lucide-react';
import clsx from 'clsx';

interface AttackPathPanelProps {
  attackPath: AttackPathNode[];
  onSelectNode?: (node: AttackPathNode) => void;
}

const getAssetIcon = (type?: string) => {
  switch ((type || '').toLowerCase()) {
    case 'user': return <User className="w-4 h-4 text-blue-400" />;
    case 'workstation': return <Monitor className="w-4 h-4 text-cyan-400" />;
    case 'server': return <Server className="w-4 h-4 text-purple-400" />;
    case 'database': return <Database className="w-4 h-4 text-amber-400" />;
    case 'application': return <Layers className="w-4 h-4 text-emerald-400" />;
    case 'security_system': return <ShieldCheck className="w-4 h-4 text-indigo-400" />;
    default: return <Server className="w-4 h-4 text-slate-400" />;
  }
};

export const AttackPathPanel: React.FC<AttackPathPanelProps> = ({ attackPath = [], onSelectNode }) => {
  const [selectedNode, setSelectedNode] = useState<AttackPathNode | null>(attackPath[0] || null);

  React.useEffect(() => {
    if (attackPath && attackPath.length > 0) {
      setSelectedNode(attackPath[0]);
    } else {
      setSelectedNode(null);
    }
  }, [attackPath]);

  if (!attackPath || attackPath.length === 0) {
    return (
      <Card className="text-center py-8">
        <ShieldAlert className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <p className="text-sm text-slate-400">No attack path available for this simulation.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-red-400" />
          <h3 className="font-bold text-slate-100 text-base">Primary Calculated Attack Path</h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {attackPath.length} Traversal Steps
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Timeline column */}
        <div className="lg:col-span-7 space-y-2">
          {attackPath.map((node, index) => {
            const isSelected = selectedNode?.asset_id === node.asset_id;
            const isInitial = index === 0;

            return (
              <div key={node.asset_id} className="relative">
                {/* Connector line */}
                {index > 0 && (
                  <div className="flex items-center justify-center my-1.5">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-[10px] font-mono text-slate-300">
                      <ArrowDown className="w-3 h-3 text-red-400" />
                      <span>{node.reached_via || 'CONNECTS_TO'}</span>
                      {node.mitre_technique && (
                        <span className="text-purple-400 bg-purple-950/60 px-1 rounded border border-purple-800/50">
                          {node.mitre_technique}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Node card */}
                <div
                  onClick={() => {
                    setSelectedNode(node);
                    onSelectNode?.(node);
                  }}
                  className={clsx(
                    "p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3",
                    isSelected
                      ? "bg-slate-800/90 border-blue-500 shadow-md ring-1 ring-blue-500/50"
                      : "bg-slate-900/80 border-slate-800 hover:border-slate-700",
                    isInitial && "border-red-500/50 bg-red-950/20"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={clsx(
                      "w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs font-mono",
                      isInitial ? "bg-red-500 text-white" : "bg-slate-800 text-slate-300 border border-slate-700"
                    )}>
                      {index + 1}
                    </div>

                    <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700">
                      {isInitial ? <Flame className="w-4 h-4 text-red-500 animate-pulse" /> : getAssetIcon(node.asset_type)}
                    </div>

                    <div>
                      <div className="font-semibold text-xs text-slate-100 flex items-center gap-2">
                        {node.asset_name}
                        {isInitial && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                            INITIAL COMPROMISE
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2">
                        <span className="uppercase">{node.asset_type}</span>
                        <span>•</span>
                        <span>Priv L{node.privilege_level}</span>
                        <span>•</span>
                        <span>Crit {node.criticality}/5</span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className={clsx("w-4 h-4", isSelected ? "text-blue-400" : "text-slate-600")} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Step Detail Inspector */}
        <div className="lg:col-span-5">
          {selectedNode ? (
            <Card className="h-full border-blue-500/30 bg-slate-900/90 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold text-slate-200">Step Inspection</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Step {selectedNode.step_number + 1} of {attackPath.length}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-[10px] uppercase font-mono text-slate-500 mb-0.5">Asset Name</div>
                    <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      {getAssetIcon(selectedNode.asset_type)}
                      {selectedNode.asset_name}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                      <div className="text-[10px] text-slate-500 font-mono">Privilege Level</div>
                      <div className="font-bold text-slate-200 mt-0.5">Level {selectedNode.privilege_level}</div>
                    </div>
                    <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                      <div className="text-[10px] text-slate-500 font-mono">Criticality Rating</div>
                      <div className="font-bold text-slate-200 mt-0.5">{selectedNode.criticality} of 5</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase font-mono text-slate-500 mb-0.5">Why Attacker Can Reach It</div>
                    <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                      {selectedNode.step_number === 0 
                        ? 'Simulated initial point of compromise. Threat actor established initial foothold via simulated credential phishing or vulnerable workstation service.' 
                        : `Permitted simulated relationship '${selectedNode.reached_via || 'CONNECTS_TO'}' allows graph traversal from the preceding node with active access privileges.`}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase font-mono text-slate-500 mb-0.5">Potential Impact</div>
                    <div className="p-2.5 rounded bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 leading-relaxed">
                      {selectedNode.asset_type === 'database' 
                        ? 'Simulated unauthorized data exfiltration, sensitive record access, customer/financial database query compromise.'
                        : selectedNode.asset_type === 'server'
                        ? 'Lateral pivot, internal command execution, credential harvesting, administrative system compromise.'
                        : selectedNode.asset_type === 'application'
                        ? 'Session hijacking, API token leakage, application-tier privilege misuse.'
                        : 'Privilege escalation and unauthorized asset access across network boundaries.'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500 font-mono">
                Asset ID: {selectedNode.asset_id} • Type: {selectedNode.asset_type}
              </div>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center text-slate-500 text-xs">
              Select a node in the attack path to inspect technical details.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
