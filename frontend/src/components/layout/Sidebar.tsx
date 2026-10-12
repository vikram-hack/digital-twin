import { Link, useLocation } from 'react-router-dom';
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
