import type { Map as MapboxMap } from "mapbox-gl";
import type { TerraDraw } from "terra-draw";

export type DrawMode =
  | "select"
  | "marker"
  | "polyline"
  | "polygon"
  | "rectangle"
  | "measure"
  | null;

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

export interface MapContextType {
  map: MapboxMap | null;
  setMap: (map: MapboxMap | null) => void;

  // Terra Draw instance
  draw?: TerraDraw | null;
  setDraw?: (draw: TerraDraw | null) => void;

  mapState: MapState;
  updateMapState: (state: Partial<MapState>) => void;
  drawMode: DrawMode;
  setDrawMode: (mode: DrawMode) => void;
}
