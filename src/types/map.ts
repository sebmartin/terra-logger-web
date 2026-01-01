import type { Map as LeafletMap, LatLngBounds, LatLng } from "leaflet";
import type { Map as MapLibreMap } from "maplibre-gl";
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
  center: LatLng | MapCenter | null;
  zoom: number;
  bounds: LatLngBounds | Bounds | null;
}

export interface MapContextType {
  // Support both Leaflet and MapLibre during migration
  map: LeafletMap | MapLibreMap | any | null;
  setMap: (map: LeafletMap | MapLibreMap | any | null) => void;

  // Terra Draw instance
  draw?: TerraDraw | null;
  setDraw?: (draw: TerraDraw | null) => void;

  mapState: MapState;
  updateMapState: (state: Partial<MapState>) => void;
  drawMode: DrawMode;
  setDrawMode: (mode: DrawMode) => void;
}
