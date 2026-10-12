import React from 'react';
import { Card } from '../components/ui/Card';
import { 
  Settings as SettingsIcon, 
  Bot, 
  Cpu, 
  Database, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  Server,
  Layers,
  Terminal
} from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-blue-400" />
          CyberTwin AI Platform Configuration
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Platform settings, AI explanation engine telemetry, and virtual digital-twin parameters.
        </p>
      </div>

      {/* AI Engine Status Card */}
      <Card className="p-6 border-purple-500/20 bg-slate-900/90 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-slate-100 text-sm">AI Explanation Engine Configuration</h3>
          </div>
          <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Active Provider: Local Simulation Engine
          </span>
        </div>

        <div className="space-y-3 text-xs leading-relaxed text-slate-300">
          <p>
            CyberTwin AI is configured with an <span className="text-purple-300 font-semibold">automatic deterministic fallback engine</span>. It analyzes graph traversal patterns, privilege elevations, and MITRE tactics to produce full structured threat reports without requiring an external API key or outbound cloud dependency.
          </p>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <span>Primary Engine:</span>
              <span className="text-cyan-300 font-bold">Deterministic Graph Narrative Synthesizer</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Cloud LLM Provider:</span>
              <span className="text-slate-500">OpenAI (Optional - Plug & Play)</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Response Format:</span>
              <span className="text-emerald-400">Structured Pydantic JSON v2</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Simulation Safety Mode:</span>
              <span className="text-emerald-400">100% Synthetic / Zero-Exploit</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-500/20 text-blue-200 text-xs">
            <span className="font-semibold text-blue-400 font-mono">Optional OpenAI Integration: </span>
            To connect OpenAI GPT-4o, set <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300 font-mono">OPENAI_API_KEY=sk-...</code> in <code className="bg-slate-900 px-1 py-0.5 rounded text-slate-300 font-mono">backend/.env</code> and restart the backend. The platform will automatically activate OpenAI without breaking local fallback.
          </div>
        </div>
      </Card>

      {/* Digital Twin Technology Stack */}
      <Card className="p-6 border-slate-800 bg-slate-900/90 space-y-4">
        <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
          <Cpu className="w-5 h-5 text-blue-400" />
          Architecture & Technology Stack
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-slate-500 text-[10px] uppercase font-semibold">Graph Propagation Engine</div>
            <div className="text-slate-200 font-bold">NetworkX (DiGraph Traversal)</div>
            <div className="text-[11px] text-slate-400 font-sans">Dynamic shortest-path, BFS/DFS traversal, custom edge damping.</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-slate-500 text-[10px] uppercase font-semibold">API & Backend Framework</div>
            <div className="text-slate-200 font-bold">FastAPI + Pydantic v2</div>
            <div className="text-[11px] text-slate-400 font-sans">High-throughput asynchronous REST API on Python 3.11+.</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-slate-500 text-[10px] uppercase font-semibold">Network Visualization</div>
            <div className="text-slate-200 font-bold">@xyflow/react (React Flow 12)</div>
            <div className="text-[11px] text-slate-400 font-sans">Interactive drag-and-drop, zoomable, animated attack edges.</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-slate-500 text-[10px] uppercase font-semibold">Digital Twin Store</div>
            <div className="text-slate-200 font-bold">SQLite + SQLAlchemy ORM</div>
            <div className="text-[11px] text-slate-400 font-sans">Relational database ready for Neo4j / PostgreSQL scale.</div>
          </div>
        </div>
      </Card>

      {/* Safety Notice Card */}
      <Card className="p-4 border-amber-500/30 bg-amber-950/10 text-xs text-amber-200 space-y-1">
        <div className="font-bold text-amber-400 flex items-center gap-1.5 uppercase font-mono">
          <ShieldCheck className="w-4 h-4" />
          Strict Defensive Simulation Compliance Notice
        </div>
        <p className="leading-relaxed">
          CyberTwin AI is purely a modeling, analytical, and educational tool. The platform strictly forbids and does not include capabilities for network scanning, real-world packet transmission, credential theft, payload deployment, or interaction with production systems. All calculations are conducted in memory on synthetic graph representations.
        </p>
      </Card>
    </div>
  );
}