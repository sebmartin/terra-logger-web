import type { Map as LeafletMap, LatLngBounds, LatLng } from "leaflet";

export type DrawMode =
  | "select"
  | "marker"
  | "polyline"
  | "polygon"
  | "rectangle"
  | "measure"
  | null;

export interface MapState {
  center: LatLng | null;
  zoom: number;
  bounds: LatLngBounds | null;
}

export interface MapContextType {
  map: LeafletMap | null;
  setMap: (map: LeafletMap | null) => void;
  mapState: MapState;
  updateMapState: (state: Partial<MapState>) => void;
  drawMode: DrawMode;
  setDrawMode: (mode: DrawMode) => void;
}
