// store/regionStore.ts
import { create } from "zustand";

interface RegionState {
  selectedRegion: string;
  setRegion: (region: string) => void;
}

export const useRegionStore = create<RegionState>((set) => ({
  selectedRegion: "서울",
  setRegion: (region) => set({ selectedRegion: region }),
}));
