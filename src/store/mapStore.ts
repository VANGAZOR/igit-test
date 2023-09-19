import { create } from 'zustand';

interface MapState {
  lineLength: number | null;
  setLineLength: (length: number | null) => void;
}

const useMapStore = create<MapState>((set) => ({
  lineLength: null,
  setLineLength: (length) => {
    set({ lineLength: length });
  },
}));

export default useMapStore;
