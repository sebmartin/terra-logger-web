import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import type { Map as LeafletMap } from "leaflet";
import type { Map as MapLibreMap } from "maplibre-gl";
import type { TerraDraw } from "terra-draw";
import type { MapContextType, DrawMode, MapState } from "../types/map";

const MapContext = createContext<MapContextType | undefined>(undefined);

export function MapProvider({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<LeafletMap | MapLibreMap | any | null>(null);
  const [draw, setDraw] = useState<TerraDraw | null>(null);
  const [drawMode, setDrawMode] = useState<DrawMode>(null);
  const [mapState, setMapState] = useState<MapState>({
    center: null,
    zoom: 13,
    bounds: null,
  });

  const updateMapState = useCallback((state: Partial<MapState>) => {
    setMapState((prev) => ({ ...prev, ...state }));
  }, []);

  const value: MapContextType = useMemo(
    () => ({
      map,
      setMap,
      draw,
      setDraw,
      mapState,
      updateMapState,
      drawMode,
      setDrawMode,
    }),
    [map, draw, mapState, updateMapState, drawMode],
  );

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

export function useMap() {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error("useMap must be used within a MapProvider");
  }
  return context;
}
