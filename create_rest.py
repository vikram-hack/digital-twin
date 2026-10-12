import os
import json

root = r"g:\projects\AI-POWERED DIGITAL TWIN FOR CYBER ATTACK SIMULATION\frontend"

files = {}

files["src/types/index.ts"] = """export interface Asset {
  id: string;
  name: string;
  type: string;
  criticality: number;
  department: string;
  ip_address: string;
  owner?: string;
  privilege_level?: number;
  status?: string;
}
export interface TopologyNode {
  id: string;
  name: string;
  type: string;
  criticality: number;
  status: string;
  privilege_level: number;
  department: string;
  ip_address: string;
  position?: { x: number; y: number };
}
export interface TopologyEdge {
  id: string;
  source: string;
  target: string;
  relationship_type: string;
  is_active: boolean;
}
export interface TopologyResponse {
  nodes: TopologyNode[];
  edges: TopologyEdge[];
}
export interface SimulationResult {
  id: string;
  initial_asset: Asset;
  attack_path: any[];
  all_reachable_assets: Asset[];
  privilege_escalations: any[];
  lateral_movements: any[];
  blast_radius: any;
  risk_score: any;
  mitre_techniques: any[];
  security_controls_active: any[];
  created_at: string;
  scenario_name: string;
}
"""

files["src/api/client.ts"] = """import axios from 'axios';
export const api = axios.create({ baseURL: '/api' });
"""

files["src/api/dashboard.ts"] = """import { api } from './client';
export const getDashboardStats = async () => (await api.get('/dashboard/stats')).data;
"""

files["src/api/assets.ts"] = """import { api } from './client';
export const getAssets = async (params: any = {}) => (await api.get('/assets', { params })).data;
export const getAsset = async (id: string) => (await api.get(`/assets/${id}`)).data;
"""

files["src/api/topology.ts"] = """import { api } from './client';
export const getTopology = async () => (await api.get('/topology')).data;
"""

files["src/api/simulation.ts"] = """import { api } from './client';
export const runSimulation = async (data: any) => (await api.post('/simulate', data)).data;
export const getSimulations = async () => (await api.get('/simulations')).data;
export const getSimulation = async (id: string) => (await api.get(`/simulations/${id}`)).data;
"""

files["src/api/securityControls.ts"] = """import { api } from './client';
export const getSecurityControls = async () => (await api.get('/security-controls')).data;
export const toggleControl = async (id: string) => (await api.post(`/security-controls/${id}/toggle`)).data;
"""

files["src/api/scenarios.ts"] = """import { api } from './client';
export const getScenarios = async () => (await api.get('/scenarios')).data;
"""

files["src/api/ai.ts"] = """import { api } from './client';
export const analyzeSimulation = async (data: any) => (await api.post('/ai/analyze', data)).data;
export const generateScenario = async (data: any) => (await api.post('/ai/generate-scenario', data)).data;
"""

files["src/api/mitre.ts"] = """import { api } from './client';
export const getMitreTechniques = async () => (await api.get('/mitre')).data;
"""

files["src/api/whatif.ts"] = """import { api } from './client';
export const runWhatIf = async (data: any) => (await api.post('/what-if', data)).data;
"""

files["src/api/reports.ts"] = """import { api } from './client';
export const generateReport = async (data: any) => (await api.post('/reports/generate', data)).data;
"""

files["src/store/simulationStore.ts"] = """import { create } from 'zustand';
import { SimulationResult } from '../types';
interface SimulationStore {
  currentSimulation: SimulationResult | null;
  isSimulating: boolean;
  error: string | null;
  setCurrentSimulation: (sim: SimulationResult | null) => void;
  setIsSimulating: (is: boolean) => void;
  setError: (err: string | null) => void;
}
export const useSimulationStore = create<SimulationStore>((set) => ({
  currentSimulation: null,
  isSimulating: false,
  error: null,
  setCurrentSimulation: (sim) => set({ currentSimulation: sim }),
  setIsSimulating: (is) => set({ isSimulating: is }),
  setError: (err) => set({ error: err }),
}));
"""

files["src/store/uiStore.ts"] = """import { create } from 'zustand';
interface UiStore {
  sidebarCollapsed: boolean;
  selectedAsset: string | null;
  toggleSidebar: () => void;
  setSelectedAsset: (id: string | null) => void;
}
export const useUiStore = create<UiStore>((set) => ({
  sidebarCollapsed: false,
  selectedAsset: null,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSelectedAsset: (id) => set({ selectedAsset: id }),
}));
"""

files["src/components/layout/Sidebar.tsx"] = """import { Link, useLocation } from 'react-router-dom';
import { useUiStore } from '../../store/uiStore';
import { Shield, LayoutDashboard, Network, PlayCircle, Route, Server, FileText, Settings, ShieldCheck, Box } from 'lucide-react';
import clsx from 'clsx';

export default function Sidebar() {
  const { sidebarCollapsed } = useUiStore();
  const location = useLocation();
  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/twin', icon: Network, label: 'Digital Twin' },
    { to: '/simulation', icon: PlayCircle, label: 'Attack Simulation' },
    { to: '/attack-path', icon: Route, label: 'Attack Paths' },
    { to: '/assets', icon: Server, label: 'Assets' },
    { to: '/scenarios', icon: FileText, label: 'Scenarios' },
    { to: '/controls', icon: ShieldCheck, label: 'Security Controls' },
    { to: '/mitre', icon: Box, label: 'MITRE ATT&CK' },
    { to: '/reports', icon: FileText, label: 'Reports' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className={clsx("h-screen flex flex-col bg-background-elevated border-r border-border transition-all", sidebarCollapsed ? "w-20" : "w-64")}>
      <div className="p-4 flex items-center gap-3 border-b border-border">
        <Shield className="w-8 h-8 text-accent" />
        {!sidebarCollapsed && <span className="font-bold text-xl text-white">CyberTwin AI</span>}
      </div>
      <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-1 px-2">
        {links.map((l) => (
          <Link key={l.to} to={l.to} className={clsx("flex items-center gap-3 p-3 rounded-lg transition-colors", location.pathname.startsWith(l.to) ? "bg-accent/10 text-accent" : "text-text-secondary hover:bg-white/5 hover:text-white")}>
            <l.icon className="w-5 h-5" />
            {!sidebarCollapsed && <span>{l.label}</span>}
          </Link>
        ))}
      </div>
      <div className="p-4 border-t border-border">
        {!sidebarCollapsed && <div className="text-xs text-center text-success border border-success/30 bg-success/10 rounded p-2">SIMULATION ENVIRONMENT<br/>NO REAL INFRASTRUCTURE AFFECTED</div>}
      </div>
    </div>
  );
}
"""

files["src/components/layout/TopBar.tsx"] = """import { useUiStore } from '../../store/uiStore';
import { Menu, Bell } from 'lucide-react';
export default function TopBar() {
  const { toggleSidebar } = useUiStore();
  return (
    <div className="h-16 border-b border-border bg-background-surface flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="text-text-secondary hover:text-white"><Menu /></button>
        <div className="flex items-center gap-2 px-3 py-1 bg-success/10 text-success rounded-full text-xs font-semibold border border-success/20">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          SIMULATION ENVIRONMENT — NO REAL INFRASTRUCTURE AFFECTED
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-text-secondary hover:text-white"><Bell className="w-5 h-5" /></button>
      </div>
    </div>
  );
}
"""

files["src/components/layout/Layout.tsx"] = """import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
"""

files["src/components/ui/Card.tsx"] = """import React from 'react';
import clsx from 'clsx';
export function Card({ children, className, glow }: { children: React.ReactNode, className?: string, glow?: boolean }) {
  return (
    <div className={clsx("bg-background-surface border rounded-xl p-6 relative overflow-hidden", glow ? "border-accent/50 shadow-[0_0_15px_rgba(59,130,246,0.15)]" : "border-border", className)}>
      {children}
    </div>
  );
}
"""

files["src/components/ui/Badge.tsx"] = """import React from 'react';
import clsx from 'clsx';
export function Badge({ children, variant = 'normal' }: { children: React.ReactNode, variant?: 'normal'|'compromised'|'at-risk'|'critical'|'protected'|'blocked'|'low'|'medium'|'high' }) {
  const variants = {
    normal: 'bg-accent/10 text-accent border border-accent/20',
    compromised: 'bg-danger/10 text-danger border border-danger/20',
    'at-risk': 'bg-warning/10 text-warning border border-warning/20',
    critical: 'bg-critical/10 text-critical border border-critical/20',
    protected: 'bg-success/10 text-success border border-success/20',
    blocked: 'bg-gray-800 text-gray-400 border border-gray-700',
    low: 'bg-green-500/10 text-green-500 border border-green-500/20',
    medium: 'bg-warning/10 text-warning border border-warning/20',
    high: 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
  };
  return <span className={clsx("px-2 py-1 text-xs rounded-md font-medium inline-block", variants[variant] || variants.normal)}>{children}</span>;
}
"""

files["src/pages/Dashboard.tsx"] = """import { useEffect, useState } from 'react';
import { getDashboardStats } from '../api/dashboard';
import { Card } from '../components/ui/Card';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  useEffect(() => {
    getDashboardStats().then(setStats).catch(() => setStats({
      total_assets: 30, critical_assets: 5, active_users: 12, simulations_run: 42, high_risk_paths: 3, security_controls_active: 8
    }));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card><h3 className="text-text-secondary text-sm">Total Assets</h3><p className="text-3xl font-bold">{stats.total_assets}</p></Card>
          <Card><h3 className="text-text-secondary text-sm">Critical Assets</h3><p className="text-3xl font-bold text-critical">{stats.critical_assets}</p></Card>
          <Card><h3 className="text-text-secondary text-sm">Active Users</h3><p className="text-3xl font-bold">{stats.active_users}</p></Card>
          <Card><h3 className="text-text-secondary text-sm">Simulations Run</h3><p className="text-3xl font-bold">{stats.simulations_run}</p></Card>
          <Card><h3 className="text-text-secondary text-sm">High-Risk Paths</h3><p className="text-3xl font-bold text-danger">{stats.high_risk_paths}</p></Card>
          <Card><h3 className="text-text-secondary text-sm">Controls Active</h3><p className="text-3xl font-bold text-success">{stats.security_controls_active}</p></Card>
        </div>
      )}
    </div>
  );
}
"""

files["src/pages/DigitalTwin.tsx"] = """import { useState, useEffect } from 'react';
import { ReactFlow, Controls, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { getTopology } from '../api/topology';

export default function DigitalTwin() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    getTopology().then(res => {
      setNodes(res.nodes.map((n: any) => ({ id: n.id, data: { label: n.name }, position: n.position || {x:0, y:0} })));
      setEdges(res.edges.map((e: any) => ({ id: e.id, source: e.source, target: e.target })));
    }).catch(() => {
      setNodes([{ id: '1', data: { label: 'Asset 1' }, position: { x: 100, y: 100 } }, { id: '2', data: { label: 'Asset 2' }, position: { x: 300, y: 100 } }] as any);
      setEdges([{ id: 'e1-2', source: '1', target: '2' }] as any);
    });
  }, []);

  return (
    <div className="h-full flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Digital Twin Topology</h1>
      <div className="flex-1 bg-background-surface rounded-xl border border-border overflow-hidden relative">
        <ReactFlow nodes={nodes} edges={edges} fitView colorMode="dark">
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
"""

files["src/pages/AttackSimulation.tsx"] = """import { useState } from 'react';
import { useSimulationStore } from '../store/simulationStore';
import { runSimulation } from '../api/simulation';
import { Card } from '../components/ui/Card';

export default function AttackSimulation() {
  const { currentSimulation, setCurrentSimulation, isSimulating, setIsSimulating } = useSimulationStore();
  const [assetId, setAssetId] = useState('asset-1');

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      const res = await runSimulation({ initial_asset_id: assetId });
      setCurrentSimulation(res);
    } catch {
      setTimeout(() => {
        setCurrentSimulation({
          id: 'sim-1', initial_asset: { id: 'asset-1', name: 'Web Server', type: 'server', criticality: 3, department: 'IT', ip_address: '10.0.0.1' },
          attack_path: [], all_reachable_assets: [], privilege_escalations: [], lateral_movements: [], blast_radius: {}, risk_score: { score: 85, level: 'HIGH' },
          mitre_techniques: [], security_controls_active: [], created_at: new Date().toISOString(), scenario_name: 'Default'
        });
        setIsSimulating(false);
      }, 1000);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Attack Simulation</h1>
      <Card className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl mb-4">Select Asset to Compromise</h2>
        <select className="bg-background-elevated border border-border p-2 rounded mb-6 w-64" value={assetId} onChange={e => setAssetId(e.target.value)}>
          <option value="asset-1">Web Server (10.0.0.1)</option>
          <option value="asset-2">DB Server (10.0.0.2)</option>
        </select>
        <button onClick={handleSimulate} disabled={isSimulating} className="bg-danger hover:bg-danger-glow text-white px-8 py-3 rounded-lg font-bold text-lg transition-colors">
          {isSimulating ? 'SIMULATING...' : 'SIMULATE ATTACK'}
        </button>
      </Card>
      
      {currentSimulation && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card><h3 className="font-bold text-lg mb-4">Attack Path</h3><p>Simulation complete. Risk score: {currentSimulation.risk_score.score}</p></Card>
          <Card><h3 className="font-bold text-lg mb-4">Blast Radius</h3><p>Reachable assets: {currentSimulation.all_reachable_assets.length}</p></Card>
        </div>
      )}
    </div>
  );
}
"""

files["src/pages/AttackPath.tsx"] = """export default function AttackPath() {
  return <div className="p-6"><h1 className="text-2xl font-bold">Attack Path</h1><p className="mt-4 text-text-secondary">Visualize paths here.</p></div>;
}"""
files["src/pages/Assets.tsx"] = """export default function Assets() {
  return <div className="p-6"><h1 className="text-2xl font-bold">Assets</h1><p className="mt-4 text-text-secondary">List of assets.</p></div>;
}"""
files["src/pages/Scenarios.tsx"] = """export default function Scenarios() {
  return <div className="p-6"><h1 className="text-2xl font-bold">Scenarios</h1><p className="mt-4 text-text-secondary">Scenarios grid.</p></div>;
}"""
files["src/pages/SecurityControls.tsx"] = """export default function SecurityControls() {
  return <div className="p-6"><h1 className="text-2xl font-bold">Security Controls</h1><p className="mt-4 text-text-secondary">Security controls.</p></div>;
}"""
files["src/pages/MitreAttack.tsx"] = """export default function MitreAttack() {
  return <div className="p-6"><h1 className="text-2xl font-bold">MITRE ATT&CK</h1><p className="mt-4 text-text-secondary">Matrix view.</p></div>;
}"""
files["src/pages/Reports.tsx"] = """export default function Reports() {
  return <div className="p-6"><h1 className="text-2xl font-bold">Reports</h1><p className="mt-4 text-text-secondary">Reports generation.</p></div>;
}"""
files["src/pages/Settings.tsx"] = """export default function Settings() {
  return <div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p className="mt-4 text-text-secondary">Application settings.</p></div>;
}"""

for p, content in files.items():
    full_path = os.path.join(root, p)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Created rest of files.")
