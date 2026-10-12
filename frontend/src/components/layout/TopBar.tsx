import { useUiStore } from '../../store/uiStore';
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
