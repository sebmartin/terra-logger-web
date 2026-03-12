import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { Map as MapboxMap } from "mapbox-gl";
import type { TerraDraw } from "terra-draw";

export type DrawMode =
  | "select"
  | "marker"
  | "polyline"
  | "polygon"
  | "rectangle"
  | "measure";

export interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapCenter {
  lat: number;
  lng: number;
}

export interface MapState {
  center: MapCenter | null;
  zoom: number;
  bounds: Bounds | null;
}

interface MapStore {
  // State
  map: MapboxMap | null;
  draw: TerraDraw | null;
  drawMode: DrawMode | null;
  mapState: MapState;

  // Actions
  setMap: (map: MapboxMap | null) => void;
  setDraw: (draw: TerraDraw | null) => void;
  setDrawMode: (mode: DrawMode) => void;
  updateMapState: (state: Partial<MapState>) => void;
}

export const useMapStore = create<MapStore>()(
  immer((set) => ({
    // Initial State
    map: null,
    draw: null,
    drawMode: null,
    mapState: {
      center: null,
      zoom: 13,
      bounds: null,
    },

    // Actions
    // Use direct set for non-draftable objects (Map/TerraDraw contain DOM refs)
    setMap: (map) => set({ map }),

    setDraw: (draw) => set({ draw }),

    setDrawMode: (drawMode) =>
      set((state) => {
        state.drawMode = drawMode;
      }),

    updateMapState: (update) =>
      set((state) => {
        Object.assign(state.mapState, update);
      }),
  }))
);
