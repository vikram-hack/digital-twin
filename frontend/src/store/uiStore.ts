import { create } from 'zustand';
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
